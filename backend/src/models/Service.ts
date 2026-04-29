import mongoose, { Document, Schema } from 'mongoose';

export interface IService extends Document {
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  
  // Pricing
  pricing: {
    type: 'fixed' | 'hourly' | 'custom';
    basePrice: number;
    priceUnit?: string; // 'hour', 'day', 'project', 'sqft', etc.
    priceRange?: {
      min: number;
      max: number;
    };
    additionalCharges?: Array<{
      name: string;
      price: number;
      type: 'fixed' | 'percentage';
      description: string;
    }>;
  };
  
  // Service Details
  duration: {
    estimated: number; // in minutes
    minimum: number;
    maximum: number;
  };
  
  // Requirements
  requirements: {
    skills: string[];
    tools?: string[];
    materials?: string[];
    certifications?: string[];
    experience?: number; // minimum years
  };
  
  // Media
  images: string[];
  videos?: string[];
  
  // Availability
  isActive: boolean;
  isPopular: boolean;
  featured: boolean;
  
  // Service Areas
  availableIn: Array<{
    city: string;
    state: string;
    pincodes?: string[];
  }>;
  
  // Tags and Search
  tags: string[];
  searchKeywords: string[];
  
  // Analytics
  stats: {
    totalBookings: number;
    completedBookings: number;
    averageRating: number;
    totalReviews: number;
    viewCount: number;
  };
  
  // SEO
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    slug: string;
  };
  
  // Language Support
  translations?: Map<string, {
    name: string;
    description: string;
  }>;
  
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new Schema<IService>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  category: {
    type: String,
    required: true,
    index: true
  },
  subcategory: {
    type: String,
    index: true
  },
  
  // Pricing object
  pricing: {
    type: {
      type: String,
      enum: ['fixed', 'hourly', 'custom'],
      required: true
    },
    basePrice: {
      type: Number,
      required: true,
      min: 0
    },
    priceUnit: String,
    priceRange: {
      min: {
        type: Number,
        min: 0
      },
      max: {
        type: Number,
        min: 0
      }
    },
    additionalCharges: [{
      name: String,
      price: Number,
      type: {
        type: String,
        enum: ['fixed', 'percentage']
      },
      description: String
    }]
  },
  
  // Duration object
  duration: {
    estimated: {
      type: Number,
      required: true,
      min: 15 // minimum 15 minutes
    },
    minimum: {
      type: Number,
      required: true,
      min: 15
    },
    maximum: {
      type: Number,
      required: true,
      min: 15
    }
  },
  
  // Requirements object
  requirements: {
    skills: [String],
    tools: [String],
    materials: [String],
    certifications: [String],
    experience: {
      type: Number,
      min: 0
    }
  },
  
  images: [String],
  videos: [String],
  
  isActive: {
    type: Boolean,
    default: true
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  featured: {
    type: Boolean,
    default: false
  },
  
  // Available areas
  availableIn: [{
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pincodes: [String]
  }],
  
  tags: [String],
  searchKeywords: [String],
  
  // Statistics
  stats: {
    totalBookings: {
      type: Number,
      default: 0
    },
    completedBookings: {
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
    },
    viewCount: {
      type: Number,
      default: 0
    }
  },
  
  // SEO object
  seo: {
    metaTitle: String,
    metaDescription: String,
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    }
  },
  
  // Multi-language support
  translations: {
    type: Map,
    of: {
      name: String,
      description: String
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
serviceSchema.index({ category: 1, subcategory: 1 });
serviceSchema.index({ 'availableIn.city': 1, 'availableIn.state': 1 });
serviceSchema.index({ tags: 1 });
serviceSchema.index({ searchKeywords: 1 });
serviceSchema.index({ isActive: 1, featured: 1 });
serviceSchema.index({ 'stats.averageRating': -1 });
serviceSchema.index({ 'stats.totalBookings': -1 });

// Text index for search
serviceSchema.index({
  name: 'text',
  description: 'text',
  tags: 'text',
  searchKeywords: 'text'
});

// Pre-save middleware to generate slug
serviceSchema.pre('save', function(next) {
  if (this.isModified('name') || this.isNew) {
    this.seo.slug = this.name
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
  next();
});

export const Service = (mongoose.models.Service as mongoose.Model<IService>) || mongoose.model<IService>('Service', serviceSchema);
