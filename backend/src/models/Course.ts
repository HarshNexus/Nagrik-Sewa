import mongoose, { Document, Schema } from 'mongoose';

export interface ICourse extends Document {
  title: string;
  description: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  
  // Course content
  modules: Array<{
    title: string;
    description: string;
    order: number;
    duration: number; // in minutes
    lessons: Array<{
      title: string;
      type: 'video' | 'text' | 'quiz' | 'assignment';
      content: string; // URL for video, text content, or quiz data
      duration: number;
      order: number;
      isRequired: boolean;
    }>;
  }>;
  
  // Media
  thumbnail: string;
  previewVideo?: string;
  
  // Instructor
  instructor: {
    name: string;
    bio: string;
    avatar: string;
    credentials: string[];
  };
  
  // Course details
  duration: number; // total duration in minutes
  language: string;
  prerequisites: string[];
  learningOutcomes: string[];
  
  // Pricing
  price: number;
  discountPrice?: number;
  isFree: boolean;
  
  // Course stats
  stats: {
    enrollments: number;
    completions: number;
    averageRating: number;
    totalReviews: number;
  };
  
  // Status
  isActive: boolean;
  isPublished: boolean;
  publishedAt?: Date;
  
  // SEO
  slug: string;
  tags: string[];
  
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema = new Schema<ICourse>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  category: {
    type: String,
    required: true,
    index: true
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  
  modules: [{
    title: {
      type: String,
      required: true
    },
    description: String,
    order: {
      type: Number,
      required: true
    },
    duration: Number,
    lessons: [{
      title: String,
      type: {
        type: String,
        enum: ['video', 'text', 'quiz', 'assignment']
      },
      content: String,
      duration: Number,
      order: Number,
      isRequired: {
        type: Boolean,
        default: true
      }
    }]
  }],
  
  thumbnail: {
    type: String,
    required: true
  },
  previewVideo: String,
  
  instructor: {
    name: {
      type: String,
      required: true
    },
    bio: String,
    avatar: String,
    credentials: [String]
  },
  
  duration: {
    type: Number,
    required: true
  },
  language: {
    type: String,
    default: 'en'
  },
  prerequisites: [String],
  learningOutcomes: [String],
  
  price: {
    type: Number,
    required: true,
    min: 0
  },
  discountPrice: {
    type: Number,
    min: 0
  },
  isFree: {
    type: Boolean,
    default: false
  },
  
  stats: {
    enrollments: {
      type: Number,
      default: 0
    },
    completions: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalReviews: {
      type: Number,
      default: 0
    }
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  publishedAt: Date,
  
  slug: {
    type: String,
    required: true,
    unique: true
  },
  tags: [String]
}, {
  timestamps: true
});

// Indexes
courseSchema.index({ category: 1, level: 1 });
courseSchema.index({ isActive: 1, isPublished: 1 });
courseSchema.index({ slug: 1 });
courseSchema.index({ tags: 1 });

export const Course = (mongoose.models.Course as mongoose.Model<ICourse>) || mongoose.model<ICourse>('Course', courseSchema);

// Coupon model
export interface ICoupon extends Document {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  description: string;
  
  // Usage limits
  usageLimit?: number;
  usedCount: number;
  perUserLimit?: number;
  
  // Validity
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  
  // Conditions
  minimumOrderAmount?: number;
  maximumDiscountAmount?: number;
  applicableServices?: string[];
  applicableCategories?: string[];
  applicableUsers?: mongoose.Types.ObjectId[];
  excludedUsers?: mongoose.Types.ObjectId[];
  
  // Targeting
  userType?: 'all' | 'new' | 'existing';
  isFirstTimeUser?: boolean;
  
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const couponSchema = new Schema<ICoupon>({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true
  },
  value: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true,
    maxlength: 200
  },
  
  usageLimit: Number,
  usedCount: {
    type: Number,
    default: 0
  },
  perUserLimit: {
    type: Number,
    default: 1
  },
  
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  
  minimumOrderAmount: Number,
  maximumDiscountAmount: Number,
  applicableServices: [String],
  applicableCategories: [String],
  applicableUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  excludedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  userType: {
    type: String,
    enum: ['all', 'new', 'existing'],
    default: 'all'
  },
  isFirstTimeUser: Boolean,
  
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Indexes
couponSchema.index({ code: 1 });
couponSchema.index({ isActive: 1, startDate: 1, endDate: 1 });

export const Coupon = (mongoose.models.Coupon as mongoose.Model<ICoupon>) || mongoose.model<ICoupon>('Coupon', couponSchema);
