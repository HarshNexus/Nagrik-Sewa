import { Router, Request, Response } from 'express';
import { Course } from '../models/Course';
import { optionalAuth, authenticate, authorize } from '../middleware/auth';

const router = Router();

// Get all courses (public)
router.get('/', optionalAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, level, isFree, page = 1, limit = 20 } = req.query;
    
    const pageNum = parseInt(page as string);
    const limitNum = Math.min(parseInt(limit as string) || 20, 50);
    const skip = (pageNum - 1) * limitNum;

    // Build query
    const query: any = { isActive: true, isPublished: true };
    
    if (category && category !== 'All') {
      query.category = category;
    }
    if (level) {
      query.level = level;
    }
    if (isFree === 'true') {
      query.isFree = true;
    }

    const [courses, totalCount] = await Promise.all([
      Course.find(query)
        .select('title description category level duration price isFree thumbnail instructor.name stats')
        .sort({ 'stats.enrollments': -1, createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Course.countDocuments(query)
    ]);

    // Transform courses to match frontend expected format
    const transformedCourses = courses.map((course: any, index: number) => ({
      id: index + 1,
      _id: course._id,
      title: course.title,
      category: course.category,
      icon: getCategoryIcon(course.category),
      description: course.description,
      duration: formatDuration(course.duration),
      level: capitalizeFirst(course.level),
      rating: course.stats?.averageRating || 4.5,
      students: course.stats?.enrollments || 0,
      instructor: course.instructor?.name || 'Nagrik Sewa Expert',
      videoUrl: course.previewVideo || '',
      thumbnail: course.thumbnail || '',
      modules: course.modules?.map((m: any) => m.title) || [],
      certificationAvailable: true,
      price: course.isFree ? 'Free' : `₹${course.price}`
    }));

    res.json({
      success: true,
      data: transformedCourses,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limitNum),
        hasNext: pageNum * limitNum < totalCount,
        hasPrev: pageNum > 1
      }
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch courses'
    });
  }
});

// Get course by ID
router.get('/:id', optionalAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id).lean();

    if (!course) {
      res.status(404).json({
        success: false,
        message: 'Course not found'
      });
      return;
    }

    res.json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch course'
    });
  }
});

// Helper functions
function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    'Home Services': '🏠',
    'Technical': '🔧',
    'Construction': '🏗️',
    'Personal Care': '💄',
    'Safety': '🛡️',
    'Electrical': '⚡',
    'Plumbing': '🔧',
    'Cleaning': '🧹',
    'Painting': '🎨',
    'Gardening': '🌱',
    'AC Repair': '❄️',
    'Carpentry': '🔨'
  };
  return icons[category] || '📚';
}

function formatDuration(minutes: number): string {
  if (!minutes) return '1 hour';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins} mins`;
  if (mins === 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
  return `${hours}.${Math.round(mins / 6)} hours`;
}

function capitalizeFirst(str: string): string {
  if (!str) return 'Beginner';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default router;
