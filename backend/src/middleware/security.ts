import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import Joi from 'joi';

const parsePositiveInt = (value: string | undefined, fallback: number): number => {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const generalRateWindowMs = parsePositiveInt(process.env.RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000);
const generalRateMax = parsePositiveInt(
  process.env.RATE_LIMIT_MAX,
  process.env.NODE_ENV === 'development' ? 1000 : 100,
);
const authRateWindowMs = parsePositiveInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000);
const authRateMax = parsePositiveInt(
  process.env.AUTH_RATE_LIMIT_MAX,
  process.env.NODE_ENV === 'development' ? 50 : 5,
);
const otpRateWindowMs = parsePositiveInt(process.env.OTP_RATE_LIMIT_WINDOW_MS, 60 * 1000);
const otpRateMax = parsePositiveInt(process.env.OTP_RATE_LIMIT_MAX, 1);

// Security headers middleware
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "https://lh3.googleusercontent.com"],
      scriptSrc: process.env.NODE_ENV === 'development' 
        ? ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://accounts.google.com", "https://apis.google.com", "https://digilocker.gov.in"] 
        : ["'self'", "https://accounts.google.com", "https://apis.google.com", "https://digilocker.gov.in"],
      connectSrc: process.env.NODE_ENV === 'development'
        ? ["'self'", "ws:", "wss:", "http://localhost:*", "https://api.razorpay.com", "https://accounts.google.com", "https://oauth2.googleapis.com", "https://api.digitallocker.gov.in", "https://digilocker.gov.in", "https://generativelanguage.googleapis.com"]
        : ["'self'", "https://api.razorpay.com", "https://accounts.google.com", "https://oauth2.googleapis.com", "https://api.digitallocker.gov.in", "https://digilocker.gov.in", "https://generativelanguage.googleapis.com"],
      frameSrc: ["'self'", "https://accounts.google.com", "https://digilocker.gov.in"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      upgradeInsecureRequests: []
    }
  },
  crossOriginEmbedderPolicy: false
});

// Rate limiting configurations
export const generalRateLimit = rateLimit({
  windowMs: generalRateWindowMs,
  max: generalRateMax,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for static assets in development
    if (process.env.NODE_ENV === 'development') {
      return req.url.includes('.js') || req.url.includes('.css') || 
             req.url.includes('.ico') || req.url.includes('@') ||
             req.url.includes('chunk-');
    }
    return false;
  }
});

export const authRateLimit = rateLimit({
  windowMs: authRateWindowMs,
  max: authRateMax,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.'
  },
  skipSuccessfulRequests: true
});

export const otpRateLimit = rateLimit({
  windowMs: otpRateWindowMs,
  max: otpRateMax,
  message: {
    success: false,
    message: 'OTP requests are limited to once per minute.'
  }
});

// Input validation middleware
export const validateInput = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
      return;
    }

    req.body = value;
    next();
  };
};

// Common validation schemas
export const schemas = {
  // User registration
  register: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
    phone: Joi.string().pattern(/^[6-9]\d{9}$/).required().messages({
      'string.pattern.base': 'Please provide a valid Indian phone number',
      'any.required': 'Phone number is required'
    }),
    password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/).required().messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      'any.required': 'Password is required'
    }),
    firstName: Joi.string().trim().min(2).max(50).required().messages({
      'string.min': 'First name must be at least 2 characters long',
      'string.max': 'First name cannot exceed 50 characters',
      'any.required': 'First name is required'
    }),
    lastName: Joi.string().trim().min(2).max(50).required().messages({
      'string.min': 'Last name must be at least 2 characters long',
      'string.max': 'Last name cannot exceed 50 characters',
      'any.required': 'Last name is required'
    }),
    role: Joi.string().valid('customer', 'worker').default('customer'),
    address: Joi.object({
      street: Joi.string().trim().max(200),
      city: Joi.string().trim().required(),
      state: Joi.string().trim().required(),
      pincode: Joi.string().pattern(/^[1-9][0-9]{5}$/).required(),
      country: Joi.string().default('India')
    }).required()
  }),

  // User login
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  // Phone login
  phoneLogin: Joi.object({
    phone: Joi.string().pattern(/^[6-9]\d{9}$/).required(),
    otp: Joi.string().pattern(/^\d{6}$/).required()
  }),

  // OTP request
  requestOTP: Joi.object({
    phone: Joi.string().pattern(/^[6-9]\d{9}$/).required()
  }),

  // Email verification
  verifyEmail: Joi.object({
    token: Joi.string().required()
  }),

  // Password reset request
  forgotPassword: Joi.object({
    email: Joi.string().email().required()
  }),

  // Password reset
  resetPassword: Joi.object({
    token: Joi.string().required(),
    password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/).required()
  }),

  // Profile update
  updateProfile: Joi.object({
    firstName: Joi.string().trim().min(2).max(50),
    lastName: Joi.string().trim().min(2).max(50),
    dateOfBirth: Joi.date().max('now'),
    gender: Joi.string().valid('male', 'female', 'other'),
    address: Joi.object({
      street: Joi.string().trim().max(200),
      city: Joi.string().trim(),
      state: Joi.string().trim(),
      pincode: Joi.string().pattern(/^[1-9][0-9]{5}$/),
      country: Joi.string()
    }),
    languagePreference: Joi.string().valid('hi', 'en', 'ta', 'te', 'bn', 'mr', 'gu', 'kn', 'ml', 'pa', 'or', 'as'),
    notificationPreferences: Joi.object({
      email: Joi.boolean(),
      sms: Joi.boolean(),
      push: Joi.boolean(),
      whatsapp: Joi.boolean()
    })
  }),

  // Booking creation
  createBooking: Joi.object({
    serviceId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
    workerId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
    bookingType: Joi.string().valid('instant', 'scheduled', 'recurring', 'emergency').default('scheduled'),
    schedule: Joi.object({
      requestedDate: Joi.date().min('now').required(),
      requestedTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
      estimatedDuration: Joi.number().min(15).max(1440).required()
    }).required(),
    location: Joi.object({
      address: Joi.object({
        street: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        pincode: Joi.string().pattern(/^[1-9][0-9]{5}$/).required(),
        landmark: Joi.string()
      }).required(),
      coordinates: Joi.object({
        latitude: Joi.number().min(-90).max(90).required(),
        longitude: Joi.number().min(-180).max(180).required()
      }).required(),
      accessInstructions: Joi.string().max(500)
    }).required(),
    serviceDetails: Joi.object({
      description: Joi.string().max(1000).required(),
      customRequirements: Joi.string().max(500),
      urgencyLevel: Joi.string().valid('low', 'medium', 'high', 'emergency').default('medium')
    }).required(),
    recurring: Joi.object({
      frequency: Joi.string().valid('daily', 'weekly', 'monthly').required(),
      interval: Joi.number().min(1).max(12).required(),
      endDate: Joi.date().min('now'),
      occurrences: Joi.number().min(1).max(365)
    }).when('bookingType', {
      is: 'recurring',
      then: Joi.required(),
      otherwise: Joi.forbidden()
    }),
    emergency: Joi.object({
      urgencyLevel: Joi.string().valid('high', 'critical').required(),
      description: Joi.string().required(),
      contactNumber: Joi.string().pattern(/^[6-9]\d{9}$/).required(),
      specialInstructions: Joi.string().max(500)
    }).when('bookingType', {
      is: 'emergency',
      then: Joi.required(),
      otherwise: Joi.forbidden()
    })
  }),

  // Search services
  searchServices: Joi.object({
    query: Joi.string().trim().max(100),
    category: Joi.string().trim(),
    city: Joi.string().trim(),
    state: Joi.string().trim(),
    pincode: Joi.string().pattern(/^[1-9][0-9]{5}$/),
    coordinates: Joi.object({
      latitude: Joi.number().min(-90).max(90).required(),
      longitude: Joi.number().min(-180).max(180).required(),
      radius: Joi.number().min(1).max(50).default(10)
    }),
    priceRange: Joi.object({
      min: Joi.number().min(0),
      max: Joi.number().min(0)
    }),
    rating: Joi.number().min(1).max(5),
    sortBy: Joi.string().valid('relevance', 'price_low', 'price_high', 'rating', 'distance', 'popularity').default('relevance'),
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(100).default(20)
  })
};

// Error handling middleware
export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', error);

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map((err: any) => ({
      field: err.path,
      message: err.message
    }));

    res.status(400).json({
      success: false,
      message: 'Validation error',
      errors
    });
    return;
  }

  // Mongoose duplicate key error
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0];
    res.status(409).json({
      success: false,
      message: `${field} already exists`
    });
    return;
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
    return;
  }

  if (error.name === 'TokenExpiredError') {
    res.status(401).json({
      success: false,
      message: 'Token expired'
    });
    return;
  }

  // Default error
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Internal server error'
  });
};

// Not found middleware
export const notFound = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
};
