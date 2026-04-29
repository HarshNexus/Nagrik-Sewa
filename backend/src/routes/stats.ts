import express from 'express';
import { User } from '../models/User';
import { WorkerProfile } from '../models/WorkerProfile';
import { Booking } from '../models/Booking';

const router = express.Router();

// Get platform statistics
router.get('/platform', async (req, res) => {
  try {
    const [
      totalCustomers,
      totalWorkers,
      verifiedWorkers,
      completedBookings,
      totalBookings,
      activeStates,
      avgRating
    ] = await Promise.all([
      User.countDocuments({ role: 'customer' }),
      User.countDocuments({ role: 'worker' }),
      WorkerProfile.countDocuments({ 
        'verification.isKYCVerified': true,
        isActive: true 
      }),
      Booking.countDocuments({ status: 'completed' }),
      Booking.countDocuments(),
      User.aggregate([
        { $match: { role: { $in: ['customer', 'worker'] } } },
        { $group: { _id: '$address.state' } },
        { $count: 'totalStates' }
      ]),
      WorkerProfile.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: null, avgRating: { $avg: '$rating.average' } } }
      ])
    ]);

    // Calculate active districts based on user locations
    const activeDistrictsResult = await User.aggregate([
      { $match: { 'address.city': { $exists: true, $ne: '' } } },
      { $group: { _id: '$address.city' } },
      { $count: 'totalDistricts' }
    ]);

    const stats = {
      totalCustomers: totalCustomers || 0,
      totalWorkers: totalWorkers || 0,
      totalUsers: (totalCustomers || 0) + (totalWorkers || 0),
      verifiedWorkers: verifiedWorkers || 0,
      totalBookings: totalBookings || 0,
      completedBookings: completedBookings || 0,
      activeDistricts: activeDistrictsResult[0]?.totalDistricts || (activeStates[0]?.totalStates || 1) * 20,
      activeStates: activeStates[0]?.totalStates || 1,
      averageRating: avgRating[0]?.avgRating ? parseFloat(avgRating[0].avgRating.toFixed(1)) : 4.5,
      averageEarning: 25000 // This would need worker earnings data
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching platform stats:', error);
    res.status(500).json({ error: 'Failed to fetch platform statistics' });
  }
});

// Get featured reviews/testimonials
router.get('/reviews/featured', async (req, res) => {
  try {
    const { limit = 6 } = req.query;
    const limitNum = Math.min(parseInt(limit as string) || 6, 20);

    // Get top-rated completed bookings with reviews
    const bookingsWithReviews = await Booking.find({
      status: 'completed',
      'reviews.customer.rating': { $gte: 4 }
    })
      .populate('customerId', 'firstName lastName avatar')
      .populate('serviceId', 'name category')
      .sort({ 'reviews.customer.rating': -1, createdAt: -1 })
      .limit(limitNum)
      .lean();

    const testimonials = bookingsWithReviews.map((booking: any) => ({
      name: booking.customerId 
        ? `${booking.customerId.firstName} ${booking.customerId.lastName}` 
        : 'Verified Customer',
      avatar: booking.customerId?.avatar || '',
      rating: booking.reviews?.customer?.rating || 5,
      comment: booking.reviews?.customer?.review || 'Great service!',
      service: booking.serviceId?.name || booking.serviceDetails?.serviceName || 'Home Service',
      location: booking.location?.address?.city || 'India',
      date: booking.completedAt || booking.updatedAt
    }));

    res.json({
      success: true,
      data: testimonials
    });
  } catch (error) {
    console.error('Error fetching featured reviews:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch reviews' 
    });
  }
});

// Get worker testimonials (for Join as Worker page)
router.get('/reviews/worker-testimonials', async (req, res) => {
  try {
    const { limit = 3 } = req.query;
    const limitNum = Math.min(parseInt(limit as string) || 3, 10);

    // Get top-rated workers with their stats
    const topWorkers = await WorkerProfile.find({
      isActive: true,
      isApproved: true,
      'rating.average': { $gte: 4 }
    })
      .populate('userId', 'firstName lastName avatar')
      .sort({ 'rating.average': -1, 'stats.completedJobs': -1 })
      .limit(limitNum)
      .lean();

    const testimonials = topWorkers.map((worker: any) => ({
      name: worker.userId 
        ? `${worker.userId.firstName} ${worker.userId.lastName}` 
        : 'Verified Worker',
      service: worker.skills?.[0]?.category || 'Professional',
      location: worker.serviceAreas?.[0]?.city || 'India',
      rating: worker.rating?.average || 5,
      earning: `₹${((worker.stats?.completedJobs || 10) * 500).toLocaleString()}+/month`,
      comment: worker.bio || 'Nagrik Sewa has helped me grow my business and connect with more customers.'
    }));

    res.json({
      success: true,
      data: testimonials
    });
  } catch (error) {
    console.error('Error fetching worker testimonials:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch testimonials' 
    });
  }
});

export default router;