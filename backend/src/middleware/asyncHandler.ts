import { Request, Response, NextFunction } from 'express';

/**
 * Async Error Handler Wrapper
 * Wraps route handlers to catch any unhandled promise rejections
 * Prevents "Cannot set headers after they are sent" errors
 *
 * Usage:
 *  router.get('/route', asyncHandler(async (req, res) => {
 *    // Your async code here
 *  }));
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      // Only send response if headers haven't been sent already
      if (!res.headersSent) {
        console.error('[ASYNC-HANDLER] Unhandled error in route:', error);
        
        const statusCode = error.statusCode || error.status || 500;
        const message = error.message || 'An unexpected error occurred';
        
        res.status(statusCode).json({
          success: false,
          message,
          ...(process.env.NODE_ENV !== 'production' && { error: error.message })
        });
      } else {
        // Headers already sent, pass to error middleware
        console.error('[ASYNC-HANDLER] Error after headers sent:', error);
        next(error);
      }
    });
  };
};

/**
 * Safely send response with header check
 * Prevents "Cannot set headers after they are sent" errors
 */
export const safeResponse = (
  res: Response,
  statusCode: number,
  data: any
) => {
  if (res.headersSent) {
    console.warn('[SAFE-RESPONSE] Headers already sent, cannot send response');
    return;
  }
  
  return res.status(statusCode).json(data);
};

/**
 * Check if response has already been sent
 * Useful for early returns after sending response
 */
export const isResponseSent = (res: Response): boolean => {
  return res.headersSent || res.writableEnded;
};
