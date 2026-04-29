import { Router, Request, Response } from 'express';
import { WorkerProfile } from '../models/WorkerProfile';
import { User } from '../models/User';
import { Booking } from '../models/Booking';
import { authenticate } from '../middleware/auth';

const router = Router();

/**
 * GET /api/discovery/workers?category=xyz
 * Fetch workers by service category (for customers)
 * Returns: Array of workers with name, contact, location, experience, rating
 */
router.get('/workers', async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, city, state, minRating = 0, limit = 20, page = 1 } = req.query;

    // Validate category parameter
    if (!category || !category.toString().trim()) {
      res.status(400).json({
        success: false,
        message: 'Category parameter is required'
      });
      return;
    }

    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const limitNum = Math.min(parseInt(limit as string) || 20, 50);
    const skip = (pageNum - 1) * limitNum;
    const categoryStr = category.toString().trim().toLowerCase();
    const minRatingNum = parseFloat(minRating as string) || 0;

    // Build query to find workers with matching service category
    const query: any = {
      isActive: true,
      isApproved: true,
      'verification.status': 'verified',
      // Match service categories (case-insensitive)
      serviceCategories: { $regex: categoryStr, $options: 'i' }
    };

    // Optional: Filter by city
    if (city && city.toString().trim()) {
      query['serviceAreas.city'] = new RegExp(city.toString().trim(), 'i');
    }

    // Optional: Filter by state
    if (state && state.toString().trim()) {
      query['serviceAreas.state'] = new RegExp(state.toString().trim(), 'i');
    }

    // Optional: Filter by minimum rating
    if (minRatingNum > 0) {
      query['rating.average'] = { $gte: minRatingNum };
    }

    // Fetch workers
    const [workers, totalCount] = await Promise.all([
      WorkerProfile.find(query)
        .populate('userId', 'firstName lastName avatar phone email address createdAt')
        .sort({ 'rating.average': -1, 'stats.completedBookings': -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      WorkerProfile.countDocuments(query)
    ]);

    // Transform response data
    const transformedWorkers = workers.map((worker: any) => ({
      _id: worker._id,
      userId: worker.userId._id,
      name: `${worker.userId.firstName} ${worker.userId.lastName || ''}`.trim(),
      phone: worker.userId.phone,
      email: worker.userId.email,
      avatar: worker.userId.avatar,
      experience: worker.experience,
      businessName: worker.businessName,
      description: worker.description,
      location: worker.serviceAreas && worker.serviceAreas.length > 0
        ? {
            city: worker.serviceAreas[0].city,
            state: worker.serviceAreas[0].state,
            pincode: worker.serviceAreas[0].pincode,
            radius: worker.serviceAreas[0].radius
          }
        : null,
      serviceCategories: worker.serviceCategories,
      skills: worker.skills?.slice(0, 3).map((skill: any) => ({
        name: skill.name,
        level: skill.level,
        yearsOfExperience: skill.yearsOfExperience,
        hourlyRate: skill.hourlyRate
      })),
      rating: {
        average: worker.rating?.average || 0,
        totalReviews: worker.rating?.totalReviews || 0
      },
      completedBookings: worker.stats?.completedBookings || 0,
      isCurrentlyAvailable: worker.availability?.isCurrentlyAvailable,
      verificationStatus: worker.verification?.status,
      memberSince: worker.userId.createdAt
    }));

    res.json({
      success: true,
      data: {
        workers: transformedWorkers,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: totalCount,
          pages: Math.ceil(totalCount / limitNum)
        }
      }
    });
  } catch (error) {
    console.error('[Discovery] Error fetching workers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch workers',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/discovery/customers?category=xyz
 * Fetch pending/active customer requests by service category (for workers)
 * Requires: Authentication (worker must be logged in)
 * Returns: Array of customer requests/bookings with customer name, location, job description
 */
router.get('/customers', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, city, state, limit = 20, page = 1 } = req.query;
    const workerId = req.user?._id;

    // Validate authentication
    if (!workerId) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    // Get worker profile to verify category
    const workerProfile = await WorkerProfile.findOne({ userId: workerId });
    if (!workerProfile) {
      res.status(404).json({
        success: false,
        message: 'Worker profile not found'
      });
      return;
    }

    // Validate category parameter - prioritize provided category or use worker's first category
    let categoryFilter = category?.toString().trim().toLowerCase();
    if (!categoryFilter) {
      if (workerProfile.serviceCategories && workerProfile.serviceCategories.length > 0) {
        categoryFilter = workerProfile.serviceCategories[0].toLowerCase();
      } else {
        res.status(400).json({
          success: false,
          message: 'Category parameter is required or worker must have service categories'
        });
        return;
      }
    }

    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const limitNum = Math.min(parseInt(limit as string) || 20, 50);
    const skip = (pageNum - 1) * limitNum;

    // Build query to find pending/confirmed bookings with matching category
    const query: any = {
      status: { $in: ['pending', 'confirmed'] },
      // Match service category (case-insensitive)
      'serviceDetails.category': { $regex: categoryFilter, $options: 'i' },
      // Exclude bookings already assigned to this worker
      workerId: { $ne: workerId }
    };

    // Optional: Filter by city
    if (city && city.toString().trim()) {
      query['location.address.city'] = new RegExp(city.toString().trim(), 'i');
    }

    // Optional: Filter by state
    if (state && state.toString().trim()) {
      query['location.address.state'] = new RegExp(state.toString().trim(), 'i');
    }

    // Fetch bookings
    const [bookings, totalCount] = await Promise.all([
      Booking.find(query)
        .populate('customerId', 'firstName lastName avatar phone email address')
        .sort({ 'schedule.requestedDate': 1, createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Booking.countDocuments(query)
    ]);

    // Transform response data
    const transformedCustomers = bookings.map((booking: any) => ({
      _id: booking._id,
      bookingId: booking.bookingId,
      customerId: booking.customerId._id,
      name: `${booking.customerId.firstName} ${booking.customerId.lastName || ''}`.trim(),
      phone: booking.customerId.phone,
      email: booking.customerId.email,
      avatar: booking.customerId.avatar,
      location: {
        address: booking.location.address.street,
        city: booking.location.address.city,
        state: booking.location.address.state,
        pincode: booking.location.address.pincode,
        landmark: booking.location.address.landmark
      },
      serviceDetails: {
        serviceName: booking.serviceDetails.serviceName,
        category: booking.serviceDetails.category,
        description: booking.serviceDetails.description,
        customRequirements: booking.serviceDetails.customRequirements,
        urgencyLevel: booking.serviceDetails.urgencyLevel
      },
      schedule: {
        requestedDate: booking.schedule.requestedDate,
        requestedTime: booking.schedule.requestedTime,
        estimatedDuration: booking.schedule.estimatedDuration
      },
      pricing: {
        totalAmount: booking.pricing.totalAmount,
        basePrice: booking.pricing.basePrice
      },
      bookingType: booking.bookingType,
      status: booking.status,
      postedAt: booking.createdAt
    }));

    res.json({
      success: true,
      data: {
        customers: transformedCustomers,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: totalCount,
          pages: Math.ceil(totalCount / limitNum)
        }
      }
    });
  } catch (error) {
    console.error('[Discovery] Error fetching customers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customer requests',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
