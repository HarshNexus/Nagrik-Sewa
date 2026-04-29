import { Router, Request, Response } from 'express';
import { Service } from '../models/Service';
import { WorkerProfile } from '../models/WorkerProfile';
import { authenticate, optionalAuth } from '../middleware/auth';
import { validateInput, schemas } from '../middleware/security';

const router = Router();

// Get all services with search and filters
router.get('/', optionalAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      query = '',
      category,
      city,
      state,
      pincode,
      latitude,
      longitude,
      radius = 10,
      minPrice,
      maxPrice,
      rating,
      sortBy = 'relevance',
      page = 1,
      limit = 20,
      featured
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = Math.min(parseInt(limit as string), 100);
    const skip = (pageNum - 1) * limitNum;

    // Build search query
    const searchQuery: any = { isActive: true };

    // Text search
    if (query && query.toString().trim()) {
      searchQuery.$text = { $search: query.toString() };
    }

    // Category filter
    if (category) {
      searchQuery.category = category;
    }

    // Location filter
    // Support "All"/"Any" availability in seeded data so services still show up when a user selects a location.
    const andConditions: any[] = [];

    if (city) {
      const cityRegex = new RegExp(city.toString(), 'i');
      andConditions.push({
        $or: [
          { 'availableIn.city': cityRegex },
          { 'availableIn.city': /^all$/i },
          { 'availableIn.city': /^any$/i }
        ]
      });
    }

    if (state) {
      const stateRegex = new RegExp(state.toString(), 'i');
      andConditions.push({
        $or: [
          { 'availableIn.state': stateRegex },
          { 'availableIn.state': /^all$/i },
          { 'availableIn.state': /^any$/i }
        ]
      });
    }

    if (andConditions.length > 0) {
      searchQuery.$and = andConditions;
    }

    if (pincode) {
      searchQuery['availableIn.pincodes'] = pincode;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      searchQuery['pricing.basePrice'] = {};
      if (minPrice) searchQuery['pricing.basePrice'].$gte = parseFloat(minPrice.toString());
      if (maxPrice) searchQuery['pricing.basePrice'].$lte = parseFloat(maxPrice.toString());
    }

    // Rating filter
    if (rating) {
      searchQuery['stats.averageRating'] = { $gte: parseFloat(rating.toString()) };
    }

    // Featured filter
    if (featured === 'true') {
      searchQuery.featured = true;
    }

    // Build sort options
    let sortOptions: any = {};
    switch (sortBy) {
      case 'price_low':
        sortOptions = { 'pricing.basePrice': 1 };
        break;
      case 'price_high':
        sortOptions = { 'pricing.basePrice': -1 };
        break;
      case 'rating':
        sortOptions = { 'stats.averageRating': -1, 'stats.totalReviews': -1 };
        break;
      case 'popularity':
        sortOptions = { 'stats.totalBookings': -1 };
        break;
      case 'relevance':
      default:
        if (query && query.toString().trim()) {
          sortOptions = { score: { $meta: 'textScore' } };
        } else {
          sortOptions = { featured: -1, 'stats.averageRating': -1 };
        }
        break;
    }

    // Execute query
    const [services, totalCount] = await Promise.all([
      Service.find(searchQuery)
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Service.countDocuments(searchQuery)
    ]);

    // Get unique categories for filters
    const categories = await Service.distinct('category', { isActive: true });

    res.json({
      success: true,
      data: {
        services,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limitNum),
          hasNext: pageNum * limitNum < totalCount,
          hasPrev: pageNum > 1
        },
        filters: {
          categories
        }
      }
    });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch services'
    });
  }
});

// Get service by ID
router.get('/:id', optionalAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const service = await Service.findById(id);

    if (!service) {
      res.status(404).json({
        success: false,
        message: 'Service not found'
      });
      return;
    }

    // Increment view count
    await Service.findByIdAndUpdate(id, { $inc: { 'stats.viewCount': 1 } });

    // Get available workers for this service
    const workers = await WorkerProfile.find({
      isActive: true,
      isApproved: true,
      serviceCategories: service.category,
      'verification.status': 'verified',
      'availability.isCurrentlyAvailable': true
    })
    .populate('userId', 'firstName lastName avatar')
    .select('userId rating earnings.totalEarnings stats.completedBookings serviceAreas skills')
    .limit(10)
    .sort({ 'rating.average': -1 });

    res.json({
      success: true,
      data: {
        service,
        availableWorkers: workers
      }
    });
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch service'
    });
  }
});

// Get service categories
router.get('/categories/list', async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Service.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgPrice: { $avg: '$pricing.basePrice' },
          avgRating: { $avg: '$stats.averageRating' },
          totalBookings: { $sum: '$stats.totalBookings' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: { categories }
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories'
    });
  }
});

// Get popular services
router.get('/popular/list', async (req: Request, res: Response): Promise<void> => {
  try {
    const { limit = 10 } = req.query;

    const popularServices = await Service.find({ isActive: true })
      .sort({ 'stats.totalBookings': -1, 'stats.averageRating': -1 })
      .limit(parseInt(limit as string))
      .lean();

    res.json({
      success: true,
      data: { services: popularServices }
    });
  } catch (error) {
    console.error('Get popular services error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch popular services'
    });
  }
});

// Search services with location-based results
router.post('/search', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      query = '',
      location,
      filters = {},
      sorting = 'relevance',
      page = 1,
      limit = 20
    } = req.body;

    const pageNum = parseInt(page);
    const limitNum = Math.min(parseInt(limit), 100);
    const skip = (pageNum - 1) * limitNum;

    // Build aggregation pipeline
    const pipeline: any[] = [
      { $match: { isActive: true } }
    ];

    // Add text search if query provided
    if (query.trim()) {
      pipeline.unshift({
        $match: {
          $text: { $search: query }
        }
      });
      pipeline.push({
        $addFields: { score: { $meta: 'textScore' } }
      });
    }

    // Location-based filtering
    if (location && location.coordinates) {
      pipeline.push({
        $addFields: {
          distance: {
            $min: {
              $map: {
                input: '$availableIn',
                as: 'area',
                in: {
                  $sqrt: {
                    $add: [
                      { $pow: [{ $subtract: [location.coordinates.latitude, '$$area.coordinates.latitude'] }, 2] },
                      { $pow: [{ $subtract: [location.coordinates.longitude, '$$area.coordinates.longitude'] }, 2] }
                    ]
                  }
                }
              }
            }
          }
        }
      });
      
      if (location.radius) {
        pipeline.push({
          $match: { distance: { $lte: location.radius } }
        });
      }
    }

    // Apply filters
    if (filters.category) {
      pipeline.push({ $match: { category: filters.category } });
    }
    if (filters.priceRange) {
      const priceMatch: any = {};
      if (filters.priceRange.min !== undefined) {
        priceMatch['pricing.basePrice'] = { $gte: filters.priceRange.min };
      }
      if (filters.priceRange.max !== undefined) {
        priceMatch['pricing.basePrice'] = { ...priceMatch['pricing.basePrice'], $lte: filters.priceRange.max };
      }
      if (Object.keys(priceMatch).length > 0) {
        pipeline.push({ $match: priceMatch });
      }
    }
    if (filters.rating) {
      pipeline.push({ $match: { 'stats.averageRating': { $gte: filters.rating } } });
    }

    // Sorting
    let sortStage: any = {};
    switch (sorting) {
      case 'price_low':
        sortStage = { 'pricing.basePrice': 1 };
        break;
      case 'price_high':
        sortStage = { 'pricing.basePrice': -1 };
        break;
      case 'rating':
        sortStage = { 'stats.averageRating': -1 };
        break;
      case 'distance':
        if (location && location.coordinates) {
          sortStage = { distance: 1 };
        } else {
          sortStage = { 'stats.averageRating': -1 };
        }
        break;
      case 'popularity':
        sortStage = { 'stats.totalBookings': -1 };
        break;
      default:
        if (query.trim()) {
          sortStage = { score: { $meta: 'textScore' } };
        } else {
          sortStage = { featured: -1, 'stats.averageRating': -1 };
        }
    }
    pipeline.push({ $sort: sortStage });

    // Pagination
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limitNum });

    // Execute aggregation
    const services = await Service.aggregate(pipeline);

    // Get total count
    const countPipeline = pipeline.slice(0, -2); // Remove skip and limit
    countPipeline.push({ $count: 'total' });
    const countResult = await Service.aggregate(countPipeline);
    const totalCount = countResult[0]?.total || 0;

    res.json({
      success: true,
      data: {
        services,
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
    console.error('Search services error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search services'
    });
  }
});

export default router;
