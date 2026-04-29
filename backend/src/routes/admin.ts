import express from 'express';
import { User } from '../models/User';
import { WorkerProfile } from '../models/WorkerProfile';
import { Service } from '../models/Service';
import { Booking } from '../models/Booking';
import { authenticate } from '../middleware/auth';
import mongoose from 'mongoose';

const router = express.Router();

// Middleware to check if user is admin
const isAdmin = async (req: any, res: any, next: any) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }
  next();
};

// Apply authentication and admin check to all routes
router.use(authenticate);
router.use(isAdmin);

// ==================== DASHBOARD STATS ====================

// Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const [
      totalUsers,
      totalWorkers,
      totalBookings,
      pendingVerifications,
      activeUsers,
      totalServices
    ] = await Promise.all([
      User.countDocuments({ role: 'customer' }),
      User.countDocuments({ role: 'worker' }),
      Booking.countDocuments(),
      WorkerProfile.countDocuments({ verificationStatus: 'pending' }),
      User.countDocuments({ accountStatus: 'active' }),
      Service.countDocuments()
    ]);

    // Revenue calculation
    const revenueData = await Booking.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const revenue = revenueData[0]?.total || 0;

    // Today's bookings and revenue
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayBookings = await Booking.countDocuments({
      createdAt: { $gte: today }
    });

    const todayRevenueData = await Booking.aggregate([
      { $match: { status: 'completed', createdAt: { $gte: today } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const todayRevenue = todayRevenueData[0]?.total || 0;

    res.json({
      success: true,
      data: {
        totalUsers,
        totalWorkers,
        totalBookings,
        revenue,
        activeUsers,
        pendingVerifications,
        totalServices,
        todayBookings,
        todayRevenue
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch statistics' });
  }
});

// ==================== USER MANAGEMENT ====================

// Get all users with pagination and filters
router.get('/users', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      role, 
      status,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query: any = {};
    
    if (role && role !== 'all') query.role = role;
    if (status && status !== 'all') query.accountStatus = status;
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const sort: any = { [sortBy as string]: sortOrder === 'asc' ? 1 : -1 };

    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password -refreshTokens')
        .sort(sort)
        .skip(skip)
        .limit(Number(limit)),
      User.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
});

// Get single user details
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -refreshTokens');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // If worker, get worker profile too
    let workerProfile = null;
    if (user.role === 'worker') {
      workerProfile = await WorkerProfile.findOne({ userId: user._id });
    }

    res.json({
      success: true,
      data: { user, workerProfile }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch user' });
  }
});

// Update user
router.put('/users/:id', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, role, accountStatus } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { 
        firstName, 
        lastName, 
        email, 
        phone, 
        role, 
        accountStatus,
        updatedAt: new Date()
      },
      { new: true }
    ).select('-password -refreshTokens');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ success: false, message: 'Failed to update user' });
  }
});

// Verify user (email/phone)
router.post('/users/:id/verify', async (req, res) => {
  try {
    const { verificationType } = req.body; // 'email' or 'phone' or 'both'
    
    const updateData: any = {};
    if (verificationType === 'email' || verificationType === 'both') {
      updateData.isEmailVerified = true;
    }
    if (verificationType === 'phone' || verificationType === 'both') {
      updateData.isPhoneVerified = true;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select('-password -refreshTokens');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      message: 'User verified successfully',
      data: user
    });
  } catch (error) {
    console.error('Error verifying user:', error);
    res.status(500).json({ success: false, message: 'Failed to verify user' });
  }
});

// Ban/Suspend user
router.post('/users/:id/ban', async (req, res) => {
  try {
    const { reason } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { 
        accountStatus: 'suspended',
        suspensionReason: reason,
        suspendedAt: new Date()
      },
      { new: true }
    ).select('-password -refreshTokens');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      message: 'User suspended successfully',
      data: user
    });
  } catch (error) {
    console.error('Error suspending user:', error);
    res.status(500).json({ success: false, message: 'Failed to suspend user' });
  }
});

// Unban user
router.post('/users/:id/unban', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { 
        accountStatus: 'active',
        suspensionReason: null,
        suspendedAt: null
      },
      { new: true }
    ).select('-password -refreshTokens');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      message: 'User unbanned successfully',
      data: user
    });
  } catch (error) {
    console.error('Error unbanning user:', error);
    res.status(500).json({ success: false, message: 'Failed to unban user' });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Delete related data
    await Promise.all([
      WorkerProfile.deleteMany({ userId }),
      Booking.deleteMany({ $or: [{ customerId: userId }, { workerId: userId }] })
    ]);

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      message: 'User and related data deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, message: 'Failed to delete user' });
  }
});

// ==================== WORKER MANAGEMENT ====================

// Get all workers with verification status
router.get('/workers', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      verificationStatus,
      search 
    } = req.query;

    const userQuery: any = { role: 'worker' };
    if (search) {
      userQuery.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const workers = await User.find(userQuery)
      .select('-password -refreshTokens')
      .skip(skip)
      .limit(Number(limit));

    // Get worker profiles
    const workerIds = workers.map(w => w._id);
    const profiles = await WorkerProfile.find({ userId: { $in: workerIds } });
    
    const profileMap = new Map();
    profiles.forEach(p => profileMap.set(p.userId.toString(), p));

    const workersWithProfiles = workers.map(w => ({
      ...w.toObject(),
      profile: profileMap.get(w._id.toString()) || null
    }));

    // Filter by verification status if provided
    let filteredWorkers = workersWithProfiles;
    if (verificationStatus && verificationStatus !== 'all') {
      filteredWorkers = workersWithProfiles.filter(w => 
        w.profile?.verificationStatus === verificationStatus
      );
    }

    const total = await User.countDocuments(userQuery);

    res.json({
      success: true,
      data: {
        workers: filteredWorkers,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    console.error('Error fetching workers:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch workers' });
  }
});

// Verify worker
router.post('/workers/:id/verify', async (req, res) => {
  try {
    const workerId = req.params.id;
    
    // Update user
    await User.findByIdAndUpdate(workerId, {
      isDigiLockerVerified: true,
      isEmailVerified: true,
      isPhoneVerified: true
    });

    // Update worker profile
    const profile = await WorkerProfile.findOneAndUpdate(
      { userId: workerId },
      { 
        verificationStatus: 'verified',
        isVerified: true,
        verifiedAt: new Date(),
        verifiedBy: req.user?._id
      },
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      message: 'Worker verified successfully',
      data: profile
    });
  } catch (error) {
    console.error('Error verifying worker:', error);
    res.status(500).json({ success: false, message: 'Failed to verify worker' });
  }
});

// Reject worker verification
router.post('/workers/:id/reject', async (req, res) => {
  try {
    const { reason } = req.body;
    
    const profile = await WorkerProfile.findOneAndUpdate(
      { userId: req.params.id },
      { 
        verificationStatus: 'rejected',
        rejectionReason: reason,
        rejectedAt: new Date()
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Worker verification rejected',
      data: profile
    });
  } catch (error) {
    console.error('Error rejecting worker:', error);
    res.status(500).json({ success: false, message: 'Failed to reject worker' });
  }
});

// Delete worker
router.delete('/workers/:id', async (req, res) => {
  try {
    const workerId = req.params.id;
    
    await Promise.all([
      WorkerProfile.deleteOne({ userId: workerId }),
      Booking.deleteMany({ workerId }),
      User.findByIdAndDelete(workerId)
    ]);

    res.json({
      success: true,
      message: 'Worker deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting worker:', error);
    res.status(500).json({ success: false, message: 'Failed to delete worker' });
  }
});

// ==================== SERVICE MANAGEMENT ====================

// Get all services
router.get('/services', async (req, res) => {
  try {
    const { page = 1, limit = 20, category, search } = req.query;
    
    const query: any = {};
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [services, total] = await Promise.all([
      Service.find(query).skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
      Service.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: {
        services,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch services' });
  }
});

// Create service
router.post('/services', async (req, res) => {
  try {
    const { name, description, category, basePrice, duration, icon, isActive } = req.body;
    
    const service = new Service({
      name,
      description,
      category,
      basePrice,
      duration,
      icon,
      isActive: isActive !== false,
      createdBy: req.user?._id
    });

    await service.save();

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: service
    });
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ success: false, message: 'Failed to create service' });
  }
});

// Update service
router.put('/services/:id', async (req, res) => {
  try {
    const { name, description, category, basePrice, duration, icon, isActive } = req.body;
    
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { name, description, category, basePrice, duration, icon, isActive },
      { new: true }
    );

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    res.json({
      success: true,
      message: 'Service updated successfully',
      data: service
    });
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ success: false, message: 'Failed to update service' });
  }
});

// Delete service
router.delete('/services/:id', async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    res.json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ success: false, message: 'Failed to delete service' });
  }
});

// ==================== BOOKING MANAGEMENT ====================

// Get all bookings
router.get('/bookings', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    
    const query: any = {};
    if (status && status !== 'all') query.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const [bookings, total] = await Promise.all([
      Booking.find(query)
        .populate('customerId', 'firstName lastName email phone')
        .populate('workerId', 'firstName lastName email phone')
        .populate('serviceId', 'name category')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Booking.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: {
        bookings,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch bookings' });
  }
});

// Update booking status
router.put('/bookings/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({
      success: true,
      message: 'Booking status updated',
      data: booking
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ success: false, message: 'Failed to update booking' });
  }
});

// Cancel booking
router.post('/bookings/:id/cancel', async (req, res) => {
  try {
    const { reason } = req.body;
    
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'cancelled',
        cancellationReason: reason,
        cancelledBy: 'admin',
        cancelledAt: new Date()
      },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ success: false, message: 'Failed to cancel booking' });
  }
});

// ==================== ANNOUNCEMENTS ====================

// Announcement schema (stored in memory for now, could be moved to DB)
let announcements: any[] = [];

// Get all announcements
router.get('/announcements', async (req, res) => {
  try {
    res.json({
      success: true,
      data: announcements.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch announcements' });
  }
});

// Create announcement
router.post('/announcements', async (req, res) => {
  try {
    const { title, message, type, targetAudience, expiresAt } = req.body;
    
    const announcement = {
      id: Date.now().toString(),
      title,
      message,
      type: type || 'info', // info, warning, success, error
      targetAudience: targetAudience || 'all', // all, customers, workers
      isActive: true,
      createdAt: new Date(),
      createdBy: req.user?._id,
      expiresAt: expiresAt ? new Date(expiresAt) : null
    };

    announcements.push(announcement);

    res.status(201).json({
      success: true,
      message: 'Announcement created successfully',
      data: announcement
    });
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(500).json({ success: false, message: 'Failed to create announcement' });
  }
});

// Update announcement
router.put('/announcements/:id', async (req, res) => {
  try {
    const { title, message, type, targetAudience, isActive, expiresAt } = req.body;
    
    const index = announcements.findIndex(a => a.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }

    announcements[index] = {
      ...announcements[index],
      title: title || announcements[index].title,
      message: message || announcements[index].message,
      type: type || announcements[index].type,
      targetAudience: targetAudience || announcements[index].targetAudience,
      isActive: isActive !== undefined ? isActive : announcements[index].isActive,
      expiresAt: expiresAt ? new Date(expiresAt) : announcements[index].expiresAt,
      updatedAt: new Date()
    };

    res.json({
      success: true,
      message: 'Announcement updated successfully',
      data: announcements[index]
    });
  } catch (error) {
    console.error('Error updating announcement:', error);
    res.status(500).json({ success: false, message: 'Failed to update announcement' });
  }
});

// Delete announcement
router.delete('/announcements/:id', async (req, res) => {
  try {
    const index = announcements.findIndex(a => a.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }

    announcements.splice(index, 1);

    res.json({
      success: true,
      message: 'Announcement deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    res.status(500).json({ success: false, message: 'Failed to delete announcement' });
  }
});

// Get active announcements (public endpoint for users)
router.get('/announcements/active', async (req, res) => {
  try {
    const { audience } = req.query;
    const now = new Date();
    
    const activeAnnouncements = announcements.filter(a => {
      if (!a.isActive) return false;
      if (a.expiresAt && new Date(a.expiresAt) < now) return false;
      if (audience && a.targetAudience !== 'all' && a.targetAudience !== audience) return false;
      return true;
    });

    res.json({
      success: true,
      data: activeAnnouncements
    });
  } catch (error) {
    console.error('Error fetching active announcements:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch announcements' });
  }
});

export default router;
