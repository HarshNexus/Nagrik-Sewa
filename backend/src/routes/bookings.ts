import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { Booking } from '../models/Booking';
import { Payment } from '../models/Payment';
import { Service } from '../models/Service';
import { WorkerProfile } from '../models/WorkerProfile';
import { User } from '../models/User';
import { authenticate, authorize, optionalAuth } from '../middleware/auth';
import { validateInput, schemas } from '../middleware/security';
import { sendEmail } from '../services/email';
import { sendBookingNotificationSMS } from '../services/sms';

const router = Router();

const findBookableWorker = (workerId: string) =>
  WorkerProfile.findOne({
    $or: [{ _id: workerId }, { userId: workerId }],
    isActive: true,
    'verification.status': { $ne: 'rejected' }
  });

// Single source of truth for booking prices; used by both the quote and the booking itself.
const calculatePricing = (basePrice: number, isEmergency: boolean) => {
  const emergencyCharges = isEmergency ? Math.round(basePrice * 0.5) : 0; // 50% emergency surcharge
  const subtotal = basePrice + emergencyCharges;
  const gst = Math.round(subtotal * 0.18);
  const platformFee = Math.max(5, Math.round(subtotal * 0.05)); // convenience fee: 5%, minimum ₹5
  return {
    emergencyCharges,
    subtotal,
    gst,
    platformFee,
    totalAmount: subtotal + gst + platformFee,
    workerEarnings: subtotal - platformFee
  };
};

// Price preview for the booking form: the selected worker's hourly rate x hours.
router.post('/quote', authenticate, async (req: Request, res: Response): Promise<void> => {
  const { workerId, hours, emergency } = req.body;
  const hourlyRate = typeof workerId === 'string' && mongoose.isValidObjectId(workerId)
    ? (await findBookableWorker(workerId).select('skills'))?.skills?.[0]?.hourlyRate
    : undefined;
  if (!hourlyRate || !(hours >= 1 && hours <= 8)) {
    res.status(400).json({ success: false, message: 'A worker with an hourly rate and 1-8 hours are required' });
    return;
  }

  const basePrice = hourlyRate * hours;
  res.json({ success: true, data: { basePrice, hourlyRate, hours, ...calculatePricing(basePrice, !!emergency) } });
});

// Time ranges already taken by paid (confirmed) bookings, so the form can disable those slots.
router.get('/worker/:workerId/booked-slots', authenticate, async (req: Request, res: Response): Promise<void> => {
  const { workerId } = req.params;
  const from = new Date(req.query.from as string);
  const to = new Date(req.query.to as string);
  if (!mongoose.isValidObjectId(workerId) || isNaN(from.getTime()) || isNaN(to.getTime())) {
    res.status(400).json({ success: false, message: 'Invalid worker or date range' });
    return;
  }

  const profile = await WorkerProfile.findById(workerId).select('userId');
  const bookings = await Booking.find({
    workerId: { $in: [workerId, profile?.userId].filter(Boolean) },
    status: { $in: ['confirmed', 'in-progress'] },
    'schedule.requestedDate': { $gte: from, $lt: to }
  }).select('schedule.requestedDate schedule.estimatedDuration').lean();

  res.json({
    success: true,
    data: bookings.map(b => ({ start: b.schedule.requestedDate, durationMinutes: b.schedule.estimatedDuration }))
  });
});

// Create new booking. Authentication is required because the booking is paid for afterwards.
router.post('/', authenticate, validateInput(schemas.createBooking), async (req: Request, res: Response): Promise<void> => {
  try {
    const customerId = req.user!._id;
    const {
      serviceId,
      workerId,
      hours,
      bookingType,
      schedule,
      location,
      serviceDetails,
      recurring,
      emergency
    } = req.body;

    // Verify service exists (optional: worker bookings are priced from the worker's rate)
    const service = serviceId ? await Service.findById(serviceId) : null;
    if (serviceId && (!service || !service.isActive)) {
      res.status(404).json({
        success: false,
        message: 'Service not found or inactive'
      });
      return;
    }

    // If worker specified, verify worker
    let assignedWorker = null;
    if (workerId) {
      const workerProfile = await findBookableWorker(workerId).populate('userId');

      if (!workerProfile) {
        res.status(404).json({
          success: false,
          message: 'Worker not found or not available'
        });
        return;
      }

      assignedWorker = workerProfile;
    }

    // Calculate pricing: the selected worker's hourly rate x hours, else the service's base price
    const workerSkill = assignedWorker?.skills?.[0];
    let basePrice: number;
    if (workerSkill?.hourlyRate && hours) {
      basePrice = workerSkill.hourlyRate * hours;
    } else if (service) {
      basePrice = service.pricing.basePrice;
    } else {
      res.status(400).json({
        success: false,
        message: 'Select a worker with an hourly rate and the number of hours, or a service'
      });
      return;
    }
    const { emergencyCharges, gst, platformFee, totalAmount, workerEarnings } =
      calculatePricing(basePrice, bookingType === 'emergency');

    // Create booking
    const booking = new Booking({
      customerId,
      workerId: assignedWorker ? ((assignedWorker.userId as any)?._id || assignedWorker._id) : undefined,
      serviceId,
      bookingType,
      serviceDetails: {
        serviceName: service?.name || workerSkill?.name,
        category: service?.category || workerSkill?.category,
        description: serviceDetails.description,
        customRequirements: serviceDetails.customRequirements,
        urgencyLevel: serviceDetails.urgencyLevel
      },
      schedule,
      location,
      pricing: {
        basePrice,
        additionalCharges: [],
        emergencyCharges,
        tax: {
          gst,
          serviceTax: 0
        },
        totalAmount,
        platformFee,
        workerEarnings
      },
      payment: {
        method: 'cash', // Default to cash, will be updated on payment
        status: 'pending'
      },
      tracking: {
        milestones: [{
          status: 'booking_created',
          timestamp: new Date(),
          description: 'Booking created successfully',
          updatedBy: 'system'
        }]
      },
      recurring,
      emergency
    });

    await booking.save();

    // Update service stats
    if (serviceId) {
      await Service.findByIdAndUpdate(serviceId, {
        $inc: { 'stats.totalBookings': 1 }
      });
    }

    // Send confirmation email to customer
    const customer = await User.findById(customerId);
    if (customer) {
      try {
        await sendEmail({
          to: customer.email,
          subject: 'Booking Confirmed - Nagrik Sewa',
          html: `
            <h2>Booking Confirmation</h2>
            <p>Dear ${customer.firstName},</p>
            <p>Your booking has been confirmed!</p>
            <ul>
              <li><strong>Booking ID:</strong> ${booking.bookingId}</li>
              <li><strong>Service:</strong> ${booking.serviceDetails.serviceName}</li>
              <li><strong>Worker:</strong> ${assignedWorker ? `${assignedWorker.userId?.firstName || assignedWorker.firstName} ${assignedWorker.userId?.lastName || assignedWorker.lastName || ''}` : 'To be assigned'}</li>
              <li><strong>Date & Time:</strong> ${schedule.requestedDate.toDateString()} at ${schedule.requestedTime}</li>
              <li><strong>Address:</strong> ${location.address.street}, ${location.address.city}</li>
              <li><strong>Total Amount:</strong> ₹${totalAmount}</li>
            </ul>
            <p><a href="${process.env.FRONTEND_URL}/bookings/${booking._id}">View Booking Details</a></p>
          `
        });
      } catch (emailError) {
        console.error('Failed to send booking confirmation email:', emailError);
      }

      // Send SMS notification
      try {
        await sendBookingNotificationSMS(
          customer.phone,
          `New booking confirmed: ${booking.serviceDetails.serviceName} on ${schedule.requestedDate.toDateString()} at ${schedule.requestedTime}`
        );
      } catch (smsError) {
        console.error('Failed to send booking SMS:', smsError);
      }
    }

    // Notify worker if assigned
    if (assignedWorker) {
      // Add worker notification logic here
    }

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: {
        booking: {
          id: booking._id,
          bookingId: booking.bookingId,
          status: booking.status,
          serviceDetails: booking.serviceDetails,
          schedule: booking.schedule,
          pricing: booking.pricing,
          assignedWorker: assignedWorker ? {
            id: booking.workerId,
            name: `${(assignedWorker.userId as any)?.firstName || assignedWorker.firstName} ${(assignedWorker.userId as any)?.lastName || assignedWorker.lastName || ''}`.trim(),
            avatar: (assignedWorker.userId as any)?.avatar,
            rating: assignedWorker.rating.average
          } : null
        }
      }
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create booking'
    });
  }
});

// Get open job requests for workers to browse
router.get('/open-requests', optionalAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, location, urgency, limit = 50 } = req.query;
    const limitNum = Math.min(parseInt(limit as string) || 50, 100);

    // Build query for open/pending bookings that don't have a worker assigned
    const query: any = {
      status: { $in: ['pending', 'open'] },
      workerId: { $exists: false }
    };

    if (category) {
      query['serviceDetails.category'] = category;
    }
    if (urgency) {
      query['serviceDetails.urgencyLevel'] = urgency;
    }
    if (location) {
      query['location.address.city'] = { $regex: location, $options: 'i' };
    }

    const bookings = await Booking.find(query)
      .populate('customerId', 'firstName lastName avatar phone email rating')
      .populate('serviceId', 'name category')
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .lean();

    // Transform bookings to match expected format
    const openRequests = bookings.map((booking: any) => ({
      _id: booking._id,
      title: booking.serviceDetails?.serviceName || booking.serviceId?.name || 'Service Request',
      customer: {
        name: booking.customerId 
          ? `${booking.customerId.firstName} ${booking.customerId.lastName}` 
          : 'Customer',
        phone: booking.customerId?.phone || '',
        email: booking.customerId?.email || '',
        rating: booking.customerId?.rating || 4.5,
        completedJobs: 0,
        verified: true
      },
      location: booking.location?.address 
        ? `${booking.location.address.street}, ${booking.location.address.city}` 
        : 'Location not specified',
      category: booking.serviceDetails?.category || booking.serviceId?.category || 'General',
      budget: booking.pricing?.totalAmount 
        ? `₹${booking.pricing.totalAmount}` 
        : 'To be discussed',
      urgency: booking.serviceDetails?.urgencyLevel || booking.emergency ? 'High' : 'Medium',
      postedDate: getTimeAgo(booking.createdAt),
      description: booking.serviceDetails?.description || booking.serviceDetails?.customRequirements || ''
    }));

    res.json({
      success: true,
      data: openRequests
    });
  } catch (error) {
    console.error('Get open requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch open requests'
    });
  }
});

// Helper function to format time ago
function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
  return `${Math.floor(seconds / 604800)} weeks ago`;
}

// Get user's bookings (authentication optional for testing)
router.get('/my-bookings', optionalAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { status, page = 1, limit = 10 } = req.query;

    // If no user, return empty array for testing
    if (!userId) {
      res.json({
        success: true,
        data: {
          bookings: [],
          pagination: {
            currentPage: 1,
            totalPages: 0,
            totalBookings: 0,
            hasNextPage: false,
            hasPrevPage: false
          }
        }
      });
      return;
    }

    const pageNum = parseInt(page as string);
    const limitNum = Math.min(parseInt(limit as string), 50);
    const skip = (pageNum - 1) * limitNum;

    // Build query based on user role
    const query: any = {};
    if (req.user!.role === 'customer') {
      query.customerId = userId;
    } else if (req.user!.role === 'worker') {
      query.workerId = userId;
    }

    // Filter by status if provided
    if (status) {
      query.status = status;
    }

    const [bookings, totalCount] = await Promise.all([
      Booking.find(query)
        .populate('serviceId', 'name category images')
        .populate('customerId', 'firstName lastName avatar phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Booking.countDocuments(query)
    ]);

    // Workers live in WorkerProfile, which a populate on the User ref cannot resolve
    const workerIds = [...new Set(bookings.filter(b => b.workerId).map(b => String(b.workerId)))];
    const profiles = await WorkerProfile.find({ $or: [{ _id: { $in: workerIds } }, { userId: { $in: workerIds } }] })
      .select('firstName lastName rating userId')
      .lean();
    const workerById = new Map<string, any>();
    profiles.forEach(p => {
      const worker = { _id: p._id, firstName: p.firstName, lastName: p.lastName, rating: p.rating?.average || 0 };
      workerById.set(String(p._id), worker);
      if (p.userId) workerById.set(String(p.userId), worker);
    });

    res.json({
      success: true,
      data: {
        bookings: bookings.map(b => ({ ...b, worker: workerById.get(String(b.workerId)) })),
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limitNum),
          hasNext: pageNum * limitNum < totalCount,
          hasPrev: pageNum > 1
        }
      }
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings'
    });
  }
});

// Get customer dashboard data
router.get('/customer/dashboard', optionalAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;

    // If no user, return empty dashboard
    if (!userId) {
      res.json({
        success: true,
        data: {
          activeBookings: 0,
          totalSpent: 0,
          reviewsGiven: 0,
          savedServices: 0,
          recentActivity: [],
          bookingsByStatus: {
            pending: 0,
            confirmed: 0,
            'in-progress': 0,
            completed: 0,
            cancelled: 0
          }
        }
      });
      return;
    }

    // Get all bookings for this customer
    const bookings = await Booking.find({ customerId: userId })
      .populate('serviceId', 'name category images')
      .populate('workerId', 'firstName lastName avatar')
      .sort({ createdAt: -1 })
      .lean();

    // Calculate active bookings (pending, confirmed, in-progress)
    const activeBookings = bookings.filter(b => 
      ['pending', 'confirmed', 'in-progress'].includes(b.status)
    ).length;

    // Total spent is what the customer has actually paid, not just completed bookings
    const [paid] = await Payment.aggregate([
      { $match: { customerId: userId, status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalSpent = paid?.total || 0;

    // Count reviews given (bookings with customer reviews)
    const reviewsGiven = bookings.filter(b => 
      b.review?.customerReview?.rating !== undefined
    ).length;

    // Count bookings by status
    const bookingsByStatus = {
      pending: bookings.filter(b => b.status === 'pending').length,
      confirmed: bookings.filter(b => b.status === 'confirmed').length,
      'in-progress': bookings.filter(b => b.status === 'in-progress').length,
      completed: bookings.filter(b => b.status === 'completed').length,
      cancelled: bookings.filter(b => b.status === 'cancelled').length
    };

    // Get saved services count from user document
    const user = await User.findById(userId).lean();
    const savedServices = (user as any)?.savedServices?.length || 0;

    // Format recent activity (last 5 bookings)
    const recentActivity = bookings.slice(0, 5).map(booking => ({
      _id: booking._id,
      type: 'booking',
      title: (booking.serviceId as any)?.name || 'Service Booking',
      status: booking.status,
      amount: booking.pricing?.totalAmount || 0,
      date: booking.createdAt,
      worker: booking.workerId ? {
        name: `${(booking.workerId as any).firstName} ${(booking.workerId as any).lastName}`,
        avatar: (booking.workerId as any).avatar
      } : null
    }));

    res.json({
      success: true,
      data: {
        activeBookings,
        totalSpent,
        reviewsGiven,
        savedServices,
        recentActivity,
        bookingsByStatus,
        totalBookings: bookings.length
      }
    });
  } catch (error) {
    console.error('Get customer dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data'
    });
  }
});

// Get booking by ID
router.get('/:id', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!._id;

    // workerId is not populated: workers live in WorkerProfile, which the User ref cannot resolve
    const booking = mongoose.isValidObjectId(id) ? await Booking.findById(id)
      .populate('serviceId', 'name category description images pricing')
      .populate('customerId', 'firstName lastName avatar phone email address') : null;

    if (!booking) {
      res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
      return;
    }

    // Check if user has permission to view this booking
    const hasPermission = booking.customerId._id.toString() === userId.toString() ||
                         String(booking.workerId) === userId.toString() ||
                         req.user!.role === 'admin';

    if (!hasPermission) {
      res.status(403).json({
        success: false,
        message: 'Access denied'
      });
      return;
    }

    // Get worker profile if worker is assigned (workerId holds the WorkerProfile _id, or the linked User _id)
    let workerProfile = null;
    if (booking.workerId) {
      workerProfile = await WorkerProfile.findOne({ $or: [{ _id: booking.workerId }, { userId: booking.workerId }] })
        .select('firstName lastName phone rating skills experience verification');
    }
    const paidPayment = await Payment.findOne({ bookingId: booking._id, status: 'paid' }).select('_id');

    res.json({
      success: true,
      data: {
        booking,
        workerProfile,
        receiptPaymentId: paidPayment?._id
      }
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking'
    });
  }
});

// Update booking status
router.patch('/:id/status', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;
    const userId = req.user!._id;

    const booking = await Booking.findById(id);

    if (!booking) {
      res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
      return;
    }

    // Check permissions
    const isCustomer = booking.customerId.toString() === userId.toString();
    const isWorker = booking.workerId?.toString() === userId.toString();
    const isAdmin = req.user!.role === 'admin';

    if (!isCustomer && !isWorker && !isAdmin) {
      res.status(403).json({
        success: false,
        message: 'Access denied'
      });
      return;
    }

    // Validate status transitions
    const validTransitions: { [key: string]: string[] } = {
      'pending': ['confirmed', 'cancelled'],
      'confirmed': ['in-progress', 'cancelled'],
      'in-progress': ['completed', 'cancelled'],
      'completed': ['disputed'],
      'cancelled': [],
      'disputed': ['resolved']
    };

    if (!validTransitions[booking.status]?.includes(status)) {
      res.status(400).json({
        success: false,
        message: `Cannot change status from ${booking.status} to ${status}`
      });
      return;
    }

    // Update booking status
    booking.status = status;

    // Add milestone
    booking.tracking.milestones.push({
      status,
      timestamp: new Date(),
      description: reason || `Status changed to ${status}`,
      updatedBy: isAdmin ? 'admin' : (isCustomer ? 'customer' : 'worker')
    });

    // Handle specific status changes
    if (status === 'in-progress') {
      booking.schedule.actualStartTime = new Date();
    } else if (status === 'completed') {
      booking.schedule.actualEndTime = new Date();
      
      // Update service and worker stats
      await Promise.all([
        Service.findByIdAndUpdate(booking.serviceId, {
          $inc: { 'stats.completedBookings': 1 }
        }),
        WorkerProfile.findOneAndUpdate(
          { userId: booking.workerId },
          {
            $inc: {
              'stats.completedBookings': 1,
              'earnings.totalEarnings': booking.pricing.workerEarnings
            }
          }
        )
      ]);
    } else if (status === 'cancelled') {
      booking.cancellation = {
        cancelledBy: isAdmin ? 'admin' : (isCustomer ? 'customer' : 'worker'),
        reason: reason || 'No reason provided',
        cancelledAt: new Date(),
        refundEligible: true, // Logic for refund eligibility
        refundAmount: booking.pricing.totalAmount
      };
    }

    await booking.save();

    res.json({
      success: true,
      message: `Booking status updated to ${status}`,
      data: { booking }
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update booking status'
    });
  }
});

// Add review for completed booking
router.post('/:id/review', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { rating, comment, categories, images } = req.body;
    const userId = req.user!._id;

    const booking = await Booking.findById(id);

    if (!booking) {
      res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
      return;
    }

    if (booking.status !== 'completed') {
      res.status(400).json({
        success: false,
        message: 'Can only review completed bookings'
      });
      return;
    }

    const isCustomer = booking.customerId.toString() === userId.toString();
    const isWorker = booking.workerId?.toString() === userId.toString();

    if (!isCustomer && !isWorker) {
      res.status(403).json({
        success: false,
        message: 'Access denied'
      });
      return;
    }

    // Add review
    const reviewData = {
      rating,
      comment,
      categories,
      images,
      reviewedAt: new Date()
    };

    if (isCustomer) {
      if (booking.review?.customerReview) {
        res.status(400).json({
          success: false,
          message: 'Customer review already exists'
        });
        return;
      }
      booking.review = { ...booking.review, customerReview: reviewData };
    } else {
      if (booking.review?.workerReview) {
        res.status(400).json({
          success: false,
          message: 'Worker review already exists'
        });
        return;
      }
      booking.review = { ...booking.review, workerReview: reviewData };
    }

    await booking.save();

    // Update worker rating if customer reviewed
    if (isCustomer && booking.workerId) {
      const workerProfile = await WorkerProfile.findOne({ userId: booking.workerId });
      if (workerProfile) {
        const currentRating = workerProfile.rating;
        const newTotalReviews = currentRating.totalReviews + 1;
        const newAverage = ((currentRating.average * currentRating.totalReviews) + rating) / newTotalReviews;

        workerProfile.rating.average = Math.round(newAverage * 10) / 10;
        workerProfile.rating.totalReviews = newTotalReviews;
        workerProfile.rating.breakdown[rating as keyof typeof workerProfile.rating.breakdown]++;

        // Update category ratings
        if (categories) {
          Object.keys(categories).forEach(category => {
            if (workerProfile.rating.categories[category as keyof typeof workerProfile.rating.categories] !== undefined) {
              const currentCategoryRating = workerProfile.rating.categories[category as keyof typeof workerProfile.rating.categories];
              const newCategoryRating = ((currentCategoryRating * (newTotalReviews - 1)) + categories[category]) / newTotalReviews;
              (workerProfile.rating.categories as any)[category] = Math.round(newCategoryRating * 10) / 10;
            }
          });
        }

        await workerProfile.save();
      }
    }

    res.json({
      success: true,
      message: 'Review added successfully',
      data: { review: reviewData }
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add review'
    });
  }
});

// Cancel booking
router.post('/:id/cancel', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user!._id;

    const booking = await Booking.findById(id);

    if (!booking) {
      res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
      return;
    }

    // Check if booking can be cancelled
    if (['completed', 'cancelled', 'disputed'].includes(booking.status)) {
      res.status(400).json({
        success: false,
        message: 'Booking cannot be cancelled'
      });
      return;
    }

    const isCustomer = booking.customerId.toString() === userId.toString();
    const isWorker = booking.workerId?.toString() === userId.toString();

    if (!isCustomer && !isWorker && req.user!.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Access denied'
      });
      return;
    }

    // Calculate cancellation charges
    let cancellationFee = 0;
    let refundAmount = booking.pricing.totalAmount;

    const timeUntilBooking = new Date(booking.schedule.requestedDate).getTime() - Date.now();
    const hoursUntilBooking = timeUntilBooking / (1000 * 60 * 60);

    if (isCustomer) {
      if (hoursUntilBooking < 2) {
        cancellationFee = Math.round(booking.pricing.totalAmount * 0.5); // 50% charge
      } else if (hoursUntilBooking < 24) {
        cancellationFee = Math.round(booking.pricing.totalAmount * 0.25); // 25% charge
      }
    }

    refundAmount = booking.pricing.totalAmount - cancellationFee;

    // Update booking
    booking.status = 'cancelled';
    booking.cancellation = {
      cancelledBy: req.user!.role === 'admin' ? 'admin' : (isCustomer ? 'customer' : 'worker'),
      reason: reason || 'No reason provided',
      cancelledAt: new Date(),
      refundEligible: true,
      cancellationFee,
      refundAmount
    };

    booking.tracking.milestones.push({
      status: 'cancelled',
      timestamp: new Date(),
      description: `Booking cancelled: ${reason || 'No reason provided'}`,
      updatedBy: req.user!.role === 'admin' ? 'admin' : (isCustomer ? 'customer' : 'worker')
    });

    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: {
        cancellationFee,
        refundAmount,
        booking
      }
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel booking'
    });
  }
});

export default router;
