import dotenv from 'dotenv';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { User, IUser } from '../models/User';
import { WorkerProfile } from '../models/WorkerProfile';

dotenv.config();

// Validate JWT_SECRET on module load
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('❌ FATAL: JWT_SECRET environment variable is not set');
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
}

// ============================================================================
// EXTENDED JWT PAYLOAD FOR ENV-DRIVEN SYSTEM ADMIN
// ============================================================================
export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  isSystemAdmin?: boolean;
}

// Get JWT secret with validation
const getJWTSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }
  return secret;
};

export const generateToken = (user: IUser): string => {
  const payload: JWTPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role
  };

  return jwt.sign(payload, getJWTSecret(), {
    expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn'],
    issuer: 'nagrik-sewa',
    audience: 'nagrik-sewa-users'
  });
};

export const generateRefreshToken = (user: IUser): string => {
  const payload: JWTPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role
  };

  const refreshSecret = process.env.REFRESH_TOKEN_SECRET || getJWTSecret();
  return jwt.sign(payload, refreshSecret, {
    expiresIn: (process.env.REFRESH_TOKEN_EXPIRES_IN || '30d') as SignOptions['expiresIn'],
    issuer: 'nagrik-sewa',
    audience: 'nagrik-sewa-refresh'
  });
};

export const verifyToken = (token: string): JWTPayload | null => {
  try {
    const decoded = jwt.verify(token, getJWTSecret(), {
      issuer: 'nagrik-sewa',
      audience: 'nagrik-sewa-users'
    }) as JWTPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      console.log('[AUTH] Token expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      console.log('[AUTH] Invalid token:', error.message);
    }
    return null;
  }
};

// Authentication middleware
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Access token required'
      });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const decoded = verifyToken(token);

    if (!decoded) {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
      return;
    }

    // Allow optional system-admin auth only when explicitly enabled.
    if (
      decoded.isSystemAdmin &&
      decoded.userId === 'system-admin-001' &&
      process.env.ENABLE_SYSTEM_ADMIN_LOGIN === 'true'
    ) {
      console.log('[AUTH] System admin authenticated');
      req.user = {
        _id: 'system-admin-001',
        userId: 'system-admin-001',
        email: decoded.email,
        role: 'admin',
        isSystemAdmin: true,
        firstName: 'System',
        lastName: 'Administrator'
      } as any;
      next();
      return;
    }

    const isWorkerAccount = decoded.role === 'worker';
    let user: any = null;

    if (isWorkerAccount) {
      user = await WorkerProfile.findById(decoded.userId).select('-password');
      if (!user) {
        // Backward compatibility for older worker accounts that still live in users
        user = await User.findById(decoded.userId).select('-password');
      }
    } else {
      user = await User.findById(decoded.userId).select('-password');
    }

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({
        success: false,
        message: 'Account is deactivated'
      });
      return;
    }

    if (user.isBlocked) {
      res.status(403).json({
        success: false,
        message: 'Account is blocked'
      });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

// Role-based authorization middleware
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    const isSystemAdmin = (req.user as any).isSystemAdmin === true;
    if (isSystemAdmin) {
      console.log('[AUTH] System admin bypassing role check');
      next();
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
      return;
    }

    next();
  };
};

// Optional authentication middleware (doesn't fail if no token)
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      next();
      return;
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (decoded) {
      const user: any = decoded.role === 'worker'
        ? (await WorkerProfile.findById(decoded.userId).select('-password') || await User.findById(decoded.userId).select('-password'))
        : await User.findById(decoded.userId).select('-password');
      if (user && user.isActive && !(user as any).isBlocked) {
        req.user = user as any;
      }
    }

    next();
  } catch (error) {
    // Continue without authentication if optional
    next();
  }
};

// Rate limiting for authentication attempts
const loginAttempts = new Map<string, { count: number; lastAttempt: Date }>();

export const rateLimitAuth = (req: Request, res: Response, next: NextFunction): void => {
  const identifier = req.ip || 'unknown';
  const now = new Date();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxAttempts = 5;

  const attempts = loginAttempts.get(identifier);

  if (attempts) {
    // Reset if window has passed
    if (now.getTime() - attempts.lastAttempt.getTime() > windowMs) {
      loginAttempts.delete(identifier);
    } else if (attempts.count >= maxAttempts) {
      res.status(429).json({
        success: false,
        message: 'Too many login attempts. Please try again later.',
        retryAfter: Math.ceil((windowMs - (now.getTime() - attempts.lastAttempt.getTime())) / 1000)
      });
      return;
    }
  }

  next();
};

export const recordLoginAttempt = (identifier: string, success: boolean): void => {
  if (success) {
    loginAttempts.delete(identifier);
  } else {
    const attempts = loginAttempts.get(identifier) || { count: 0, lastAttempt: new Date() };
    attempts.count += 1;
    attempts.lastAttempt = new Date();
    loginAttempts.set(identifier, attempts);
  }
};
