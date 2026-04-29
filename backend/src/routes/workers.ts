import { Router, Request, Response } from 'express';
import { WorkerProfile } from '../models/WorkerProfile';
import { User } from '../models/User';
import { Booking } from '../models/Booking';
import { authenticate, authorize } from '../middleware/auth';
import { validateInput } from '../middleware/security';
import Joi from 'joi';

const router = Router();

// Worker profile validation schemas
const workerProfileSchemas = {
  updateProfile: Joi.object({
    businessName: Joi.string().trim().max(100),
    description: Joi.string().trim().max(1000).required(),
    experience: Joi.number().min(0).max(50).required(),
    skills: Joi.array().items(Joi.object({
      name: Joi.string().required(),
      category: Joi.string().required(),
      level: Joi.string().valid('beginner', 'intermediate', 'expert').required(),
      yearsOfExperience: Joi.number().min(0).required(),
      certifications: Joi.array().items(Joi.string()),
      hourlyRate: Joi.number().min(0),
      fixedRate: Joi.number().min(0)
    })),
    serviceCategories: Joi.array().items(Joi.string()),
    serviceAreas: Joi.array().items(Joi.object({
      city: Joi.string().required(),
      state: Joi.string().required(),
      pincode: Joi.string(),
      radius: Joi.number().min(1).max(100).required(),
      travelCharges: Joi.number().min(0)
    })),
    preferences: Joi.object({
      minimumJobValue: Joi.number().min(0),
      maximumTravelDistance: Joi.number().min(1).max(100),
      preferredPaymentMethods: Joi.array().items(Joi.string()),
      workingDays: Joi.array().items(Joi.string()),
      emergencyServiceCharges: Joi.number().min(0),
      cancellationPolicy: Joi.string()
    }),
    languages: Joi.array().items(Joi.string()),
    searchTags: Joi.array().items(Joi.string())
  }),

  updateAvailability: Joi.object({
    schedule: Joi.array().items(Joi.object({
      day: Joi.string().valid('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday').required(),
      isAvailable: Joi.boolean().required(),
      slots: Joi.array().items(Joi.object({
        startTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
        endTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
        isBooked: Joi.boolean().default(false)
      }))
    })),
    isCurrentlyAvailable: Joi.boolean(),
    emergencyAvailable: Joi.boolean()
  }),

  addPortfolio: Joi.object({
    title: Joi.string().required(),
    description: Joi.string(),
    images: Joi.array().items(Joi.string()),
    videos: Joi.array().items(Joi.string()),
    category: Joi.string(),
    completedAt: Joi.date(),
    tags: Joi.array().items(Joi.string())
  })
};

// Get worker profiles with search and filters
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      search = '',
      category,
      city,
      state,
      minRating = 0,
      maxDistance = 50,
      latitude,
      longitude,
      availableNow = false,
      verified = false,
      sortBy = 'rating',
      page = 1,
      limit = 20
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = Math.min(parseInt(limit as string), 50);
    const skip = (pageNum - 1) * limitNum;

    // DEBUG: Check total workers in database
    const totalWorkers = await WorkerProfile.countDocuments({});
    console.log(`[DEBUG] Total workers in database: ${totalWorkers}`);

    // Build search query
    const query: any = {
      isActive: true,
      isApproved: true
    };

    // DEBUG: Log the query after building it
    console.log(`[DEBUG] Initial isActive/isApproved filter set`);

    // Verification filter
    if (verified === 'true') {
      query['verification.status'] = 'verified';
    }

    // Category filter
    if (category) {
      query.serviceCategories = category;
    }

    // Location filter
    if (city) {
      query['serviceAreas.city'] = new RegExp(city.toString(), 'i');
    }
    if (state) {
      query['serviceAreas.state'] = new RegExp(state.toString(), 'i');
    }

    // Rating filter
    if (minRating) {
      query['rating.average'] = { $gte: parseFloat(minRating.toString()) };
    }

    // Availability filter
    if (availableNow === 'true') {
      query['availability.isCurrentlyAvailable'] = true;
    }

    // Text search
    if (search && search.toString().trim()) {
      query.$or = [
        { description: new RegExp(search.toString(), 'i') },
        { businessName: new RegExp(search.toString(), 'i') },
        { 'skills.name': new RegExp(search.toString(), 'i') },
        { searchTags: new RegExp(search.toString(), 'i') }
      ];
    }

    // Build sort options
    let sortOptions: any = {};
    switch (sortBy) {
      case 'rating':
        sortOptions = { 'rating.average': -1, 'rating.totalReviews': -1 };
        break;
      case 'experience':
        sortOptions = { experience: -1 };
        break;
      case 'price_low':
        sortOptions = { 'skills.hourlyRate': 1 };
        break;
      case 'price_high':
        sortOptions = { 'skills.hourlyRate': -1 };
        break;
      case 'completion_rate':
        sortOptions = { 'stats.jobCompletionRate': -1 };
        break;
      default:
        sortOptions = { 'rating.average': -1, 'stats.completedBookings': -1 };
    }

    // DEBUG: Count workers matching the query BEFORE pagination
    const filteredCount = await WorkerProfile.countDocuments(query);
    console.log(`[DEBUG] Query: ${JSON.stringify(query)}`);
    console.log(`[DEBUG] Workers matching query (before pagination): ${filteredCount}`);

    // Execute query with population
    const [workers, totalCount] = await Promise.all([
      WorkerProfile.find(query)
        .populate('userId', 'firstName lastName avatar phone createdAt')
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      WorkerProfile.countDocuments(query)
    ]);

    console.log(`[DEBUG] Workers returned after pagination: ${workers.length}`);

    // Calculate distance if coordinates provided
    if (latitude && longitude) {
      const userLat = parseFloat(latitude.toString());
      const userLng = parseFloat(longitude.toString());

      workers.forEach((worker: any) => {
        if (worker.serviceAreas && worker.serviceAreas.length > 0) {
          // Calculate minimum distance to any service area
          worker.distance = Math.min(
            ...worker.serviceAreas.map((area: any) => {
              // Mock distance calculation - in real app, use proper geolocation
              return Math.random() * parseFloat(maxDistance.toString());
            })
          );
        }
      });

      // Filter by distance and sort if distance sorting requested
      workers.filter((worker: any) => !worker.distance || worker.distance <= parseFloat(maxDistance.toString()));
      
      if (sortBy === 'distance') {
        workers.sort((a: any, b: any) => (a.distance || 0) - (b.distance || 0));
      }
    }

    res.json({
      success: true,
      data: {
        workers,
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
    console.error('Get workers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch workers'
    });
  }
});

// Get worker profile by ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const worker = await WorkerProfile.findById(id)
      .populate('userId', 'firstName lastName avatar phone email createdAt address')
      .lean();

    if (!worker) {
      res.status(404).json({
        success: false,
        message: 'Worker not found'
      });
      return;
    }

    // Get recent bookings and reviews
    const recentBookings = await Booking.find({
      workerId: worker.userId._id,
      status: 'completed'
    })
    .populate('customerId', 'firstName lastName avatar')
    .select('review serviceDetails createdAt')
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

    // Extract reviews from bookings
    const reviews = recentBookings
      .filter(booking => booking.review?.customerReview)
      .map(booking => ({
        ...booking.review.customerReview,
        customer: booking.customerId,
        service: booking.serviceDetails.serviceName,
        date: booking.createdAt
      }));

    res.json({
      success: true,
      data: {
        worker,
        reviews,
        totalReviews: reviews.length
      }
    });
  } catch (error) {
    console.error('Get worker error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch worker'
    });
  }
});

// Get current worker's profile
router.get('/me/profile', authenticate, authorize('worker'), async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;

    const workerProfile = await WorkerProfile.findOne({ userId })
      .populate('userId', 'firstName lastName avatar phone email address');

    if (!workerProfile) {
      res.status(404).json({
        success: false,
        message: 'Worker profile not found'
      });
      return;
    }

    res.json({
      success: true,
      data: { workerProfile }
    });
  } catch (error) {
    console.error('Get worker profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch worker profile'
    });
  }
});

// Update worker profile
router.put('/me/profile', authenticate, authorize('worker'), validateInput(workerProfileSchemas.updateProfile), async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const updates = req.body;

    const workerProfile = await WorkerProfile.findOneAndUpdate(
      { userId },
      { $set: updates },
      { new: true, runValidators: true }
    ).populate('userId', 'firstName lastName avatar');

    if (!workerProfile) {
      res.status(404).json({
        success: false,
        message: 'Worker profile not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { workerProfile }
    });
  } catch (error) {
    console.error('Update worker profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
});

// Update availability
router.put('/me/availability', authenticate, authorize('worker'), validateInput(workerProfileSchemas.updateAvailability), async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const availabilityUpdates = req.body;

    const workerProfile = await WorkerProfile.findOneAndUpdate(
      { userId },
      { 
        $set: { 
          'availability.schedule': availabilityUpdates.schedule,
          'availability.isCurrentlyAvailable': availabilityUpdates.isCurrentlyAvailable,
          'availability.emergencyAvailable': availabilityUpdates.emergencyAvailable,
          'availability.lastSeen': new Date()
        }
      },
      { new: true }
    );

    if (!workerProfile) {
      res.status(404).json({
        success: false,
        message: 'Worker profile not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Availability updated successfully',
      data: { availability: workerProfile.availability }
    });
  } catch (error) {
    console.error('Update availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update availability'
    });
  }
});

// Add portfolio item
router.post('/me/portfolio', authenticate, authorize('worker'), validateInput(workerProfileSchemas.addPortfolio), async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const portfolioItem = req.body;

    const workerProfile = await WorkerProfile.findOneAndUpdate(
      { userId },
      { $push: { portfolio: portfolioItem } },
      { new: true }
    );

    if (!workerProfile) {
      res.status(404).json({
        success: false,
        message: 'Worker profile not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Portfolio item added successfully',
      data: { portfolioItem }
    });
  } catch (error) {
    console.error('Add portfolio error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add portfolio item'
    });
  }
});

// Get worker dashboard data
router.get('/me/dashboard', authenticate, authorize('worker'), async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;

    const [workerProfile, recentBookings, monthlyEarnings] = await Promise.all([
      WorkerProfile.findOne({ userId }),
      Booking.find({ workerId: userId })
        .populate('customerId', 'firstName lastName avatar')
        .populate('serviceId', 'name category')
        .sort({ createdAt: -1 })
        .limit(10),
      Booking.aggregate([
        {
          $match: {
            workerId: userId,
            status: 'completed',
            createdAt: {
              $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            }
          }
        },
        {
          $group: {
            _id: null,
            totalEarnings: { $sum: '$pricing.workerEarnings' },
            totalBookings: { $sum: 1 }
          }
        }
      ])
    ]);

    if (!workerProfile) {
      res.status(404).json({
        success: false,
        message: 'Worker profile not found'
      });
      return;
    }

    const dashboardData = {
      profile: workerProfile,
      recentBookings,
      monthlyStats: {
        earnings: monthlyEarnings[0]?.totalEarnings || 0,
        bookings: monthlyEarnings[0]?.totalBookings || 0
      },
      summary: {
        totalEarnings: workerProfile.earnings.totalEarnings,
        completedJobs: workerProfile.stats.completedBookings,
        rating: workerProfile.rating.average,
        profileCompletion: workerProfile.profileCompletion
      }
    };

    res.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data'
    });
  }
});

// Toggle online status
router.patch('/me/status', authenticate, authorize('worker'), async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { isCurrentlyAvailable } = req.body;

    const workerProfile = await WorkerProfile.findOneAndUpdate(
      { userId },
      { 
        $set: { 
          'availability.isCurrentlyAvailable': isCurrentlyAvailable,
          'availability.lastSeen': new Date()
        }
      },
      { new: true }
    );

    if (!workerProfile) {
      res.status(404).json({
        success: false,
        message: 'Worker profile not found'
      });
      return;
    }

    res.json({
      success: true,
      message: `Status updated to ${isCurrentlyAvailable ? 'online' : 'offline'}`,
      data: { 
        isCurrentlyAvailable: workerProfile.availability.isCurrentlyAvailable,
        lastSeen: workerProfile.availability.lastSeen
      }
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update status'
    });
  }
});

export default router;
