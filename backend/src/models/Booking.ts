import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
  bookingId: string;
  customerId: mongoose.Types.ObjectId;
  workerId: mongoose.Types.ObjectId;
  serviceId: mongoose.Types.ObjectId;
  
  // Booking Details
  bookingType: 'instant' | 'scheduled' | 'recurring' | 'emergency';
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'disputed';
  
  // Service Details
  serviceDetails: {
    serviceName: string;
    category: string;
    description: string;
    customRequirements?: string;
    urgencyLevel: 'low' | 'medium' | 'high' | 'emergency';
  };
  
  // Scheduling
  schedule: {
    requestedDate: Date;
    requestedTime: string;
    confirmedDate?: Date;
    confirmedTime?: string;
    estimatedDuration: number; // in minutes
    actualStartTime?: Date;
    actualEndTime?: Date;
    actualDuration?: number;
  };
  
  // Recurring booking details
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    interval: number; // every X days/weeks/months
    endDate?: Date;
    occurrences?: number;
    nextBookingDate?: Date;
    parentBookingId?: string;
  };
  
  // Location
  location: {
    address: {
      street: string;
      city: string;
      state: string;
      pincode: string;
      landmark?: string;
    };
    coordinates: {
      latitude: number;
      longitude: number;
    };
    accessInstructions?: string;
  };
  
  // Pricing
  pricing: {
    basePrice: number;
    additionalCharges: Array<{
      name: string;
      amount: number;
      type: 'fixed' | 'percentage';
    }>;
    materialCosts?: number;
    travelCharges?: number;
    emergencyCharges?: number;
    discount?: {
      amount: number;
      type: 'fixed' | 'percentage';
      reason: string;
      couponCode?: string;
    };
    tax: {
      gst: number;
      serviceTax: number;
    };
    totalAmount: number;
    platformFee: number;
    workerEarnings: number;
  };
  
  // Payment
  payment: {
    method: 'cash' | 'upi' | 'card' | 'wallet' | 'netbanking';
    status: 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded';
    transactionId?: string;
    paymentGatewayResponse?: any;
    paidAt?: Date;
    refundAmount?: number;
    refundReason?: string;
    refundedAt?: Date;
  };
  
  // Communication
  communication: {
    chatEnabled: boolean;
    lastMessage?: Date;
    messageCount: number;
    callLogs: Array<{
      type: 'voice' | 'video';
      duration: number;
      startedAt: Date;
      endedAt: Date;
      initiated_by: 'customer' | 'worker';
    }>;
  };
  
  // Tracking and Updates
  tracking: {
    workerLocation?: {
      latitude: number;
      longitude: number;
      updatedAt: Date;
    };
    milestones: Array<{
      status: string;
      timestamp: Date;
      description: string;
      updatedBy: 'system' | 'customer' | 'worker' | 'admin';
    }>;
    estimatedArrival?: Date;
    actualArrival?: Date;
  };
  
  // Reviews and Rating
  review?: {
    customerReview: {
      rating: number;
      comment: string;
      categories: {
        quality: number;
        punctuality: number;
        communication: number;
        pricing: number;
        professionalism: number;
      };
      images?: string[];
      reviewedAt: Date;
    };
    workerReview: {
      rating: number;
      comment: string;
      categories: {
        clarity: number;
        payment: number;
        cooperation: number;
        location: number;
      };
      reviewedAt: Date;
    };
  };
  
  // Photos and Documentation
  media: {
    beforeImages?: string[];
    afterImages?: string[];
    workProgressImages?: string[];
    videos?: string[];
    documents?: string[];
  };
  
  // Cancellation
  cancellation?: {
    cancelledBy: 'customer' | 'worker' | 'admin' | 'system';
    reason: string;
    cancelledAt: Date;
    refundEligible: boolean;
    cancellationFee?: number;
    refundAmount?: number;
  };
  
  // Dispute
  dispute?: {
    isDisputed: boolean;
    disputedBy: 'customer' | 'worker';
    reason: string;
    description: string;
    disputedAt: Date;
    status: 'open' | 'investigating' | 'resolved' | 'closed';
    resolution?: string;
    resolvedAt?: Date;
    resolvedBy?: mongoose.Types.ObjectId;
  };
  
  // Emergency details
  emergency?: {
    isEmergency: boolean;
    urgencyLevel: 'high' | 'critical';
    description: string;
    contactNumber: string;
    specialInstructions?: string;
  };
  
  // System fields
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>({
  bookingId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  workerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  
  bookingType: {
    type: String,
    enum: ['instant', 'scheduled', 'recurring', 'emergency'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled', 'disputed'],
    default: 'pending',
    index: true
  },
  
  // Service details
  serviceDetails: {
    serviceName: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    description: String,
    customRequirements: String,
    urgencyLevel: {
      type: String,
      enum: ['low', 'medium', 'high', 'emergency'],
      default: 'medium'
    }
  },
  
  // Schedule
  schedule: {
    requestedDate: {
      type: Date,
      required: true
    },
    requestedTime: {
      type: String,
      required: true
    },
    confirmedDate: Date,
    confirmedTime: String,
    estimatedDuration: {
      type: Number,
      required: true
    },
    actualStartTime: Date,
    actualEndTime: Date,
    actualDuration: Number
  },
  
  // Recurring details
  recurring: {
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly']
    },
    interval: Number,
    endDate: Date,
    occurrences: Number,
    nextBookingDate: Date,
    parentBookingId: String
  },
  
  // Location
  location: {
    address: {
      street: {
        type: String,
        required: true
      },
      city: {
        type: String,
        required: true
      },
      state: {
        type: String,
        required: true
      },
      pincode: {
        type: String,
        required: true
      },
      landmark: String
    },
    coordinates: {
      latitude: {
        type: Number,
        required: true
      },
      longitude: {
        type: Number,
        required: true
      }
    },
    accessInstructions: String
  },
  
  // Pricing
  pricing: {
    basePrice: {
      type: Number,
      required: true,
      min: 0
    },
    additionalCharges: [{
      name: String,
      amount: Number,
      type: {
        type: String,
        enum: ['fixed', 'percentage']
      }
    }],
    materialCosts: {
      type: Number,
      min: 0
    },
    travelCharges: {
      type: Number,
      min: 0
    },
    emergencyCharges: {
      type: Number,
      min: 0
    },
    discount: {
      amount: Number,
      type: {
        type: String,
        enum: ['fixed', 'percentage']
      },
      reason: String,
      couponCode: String
    },
    tax: {
      gst: {
        type: Number,
        default: 0
      },
      serviceTax: {
        type: Number,
        default: 0
      }
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    platformFee: {
      type: Number,
      required: true,
      min: 0
    },
    workerEarnings: {
      type: Number,
      required: true,
      min: 0
    }
  },
  
  // Payment
  payment: {
    method: {
      type: String,
      enum: ['cash', 'upi', 'card', 'wallet', 'netbanking'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded', 'partially_refunded'],
      default: 'pending'
    },
    transactionId: String,
    paymentGatewayResponse: Schema.Types.Mixed,
    paidAt: Date,
    refundAmount: Number,
    refundReason: String,
    refundedAt: Date
  },
  
  // Communication
  communication: {
    chatEnabled: {
      type: Boolean,
      default: true
    },
    lastMessage: Date,
    messageCount: {
      type: Number,
      default: 0
    },
    callLogs: [{
      type: {
        type: String,
        enum: ['voice', 'video']
      },
      duration: Number,
      startedAt: Date,
      endedAt: Date,
      initiated_by: {
        type: String,
        enum: ['customer', 'worker']
      }
    }]
  },
  
  // Tracking
  tracking: {
    workerLocation: {
      latitude: Number,
      longitude: Number,
      updatedAt: Date
    },
    milestones: [{
      status: String,
      timestamp: Date,
      description: String,
      updatedBy: {
        type: String,
        enum: ['system', 'customer', 'worker', 'admin']
      }
    }],
    estimatedArrival: Date,
    actualArrival: Date
  },
  
  // Reviews
  review: {
    customerReview: {
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      comment: String,
      categories: {
        quality: Number,
        punctuality: Number,
        communication: Number,
        pricing: Number,
        professionalism: Number
      },
      images: [String],
      reviewedAt: Date
    },
    workerReview: {
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      comment: String,
      categories: {
        clarity: Number,
        payment: Number,
        cooperation: Number,
        location: Number
      },
      reviewedAt: Date
    }
  },
  
  // Media
  media: {
    beforeImages: [String],
    afterImages: [String],
    workProgressImages: [String],
    videos: [String],
    documents: [String]
  },
  
  // Cancellation
  cancellation: {
    cancelledBy: {
      type: String,
      enum: ['customer', 'worker', 'admin', 'system']
    },
    reason: String,
    cancelledAt: Date,
    refundEligible: Boolean,
    cancellationFee: Number,
    refundAmount: Number
  },
  
  // Dispute
  dispute: {
    isDisputed: {
      type: Boolean,
      default: false
    },
    disputedBy: {
      type: String,
      enum: ['customer', 'worker']
    },
    reason: String,
    description: String,
    disputedAt: Date,
    status: {
      type: String,
      enum: ['open', 'investigating', 'resolved', 'closed']
    },
    resolution: String,
    resolvedAt: Date,
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  
  // Emergency
  emergency: {
    isEmergency: {
      type: Boolean,
      default: false
    },
    urgencyLevel: {
      type: String,
      enum: ['high', 'critical']
    },
    description: String,
    contactNumber: String,
    specialInstructions: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
bookingSchema.index({ status: 1, 'schedule.requestedDate': 1 });
bookingSchema.index({ 'location.address.city': 1, 'location.address.state': 1 });
bookingSchema.index({ createdAt: -1 });
bookingSchema.index({ 'payment.status': 1 });
bookingSchema.index({ bookingType: 1 });

// Compound indexes
bookingSchema.index({
  customerId: 1,
  status: 1,
  createdAt: -1
});

bookingSchema.index({
  workerId: 1,
  status: 1,
  'schedule.requestedDate': 1
});

// Pre-save middleware to generate booking ID
bookingSchema.pre('save', function(next) {
  if (this.isNew && !this.bookingId) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    this.bookingId = `BK${timestamp}${random}`.toUpperCase();
  }
  next();
});

// Virtual for booking duration
bookingSchema.virtual('actualDurationMinutes').get(function() {
  if (this.schedule.actualStartTime && this.schedule.actualEndTime) {
    return Math.round((this.schedule.actualEndTime.getTime() - this.schedule.actualStartTime.getTime()) / (1000 * 60));
  }
  return null;
});

export const Booking = (mongoose.models.Booking as mongoose.Model<IBooking>) || mongoose.model<IBooking>('Booking', bookingSchema);
