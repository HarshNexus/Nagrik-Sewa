import { Request, Response, NextFunction } from 'express';

// Performance monitoring middleware
export const performanceMonitor = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  
  // Store original send function
  const originalSend = res.send;
  
  // Override send to capture response time
  res.send = function(data) {
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    // Add performance headers
    res.setHeader('X-Response-Time', `${responseTime}ms`);
    res.setHeader('X-Timestamp', new Date().toISOString());
    
    // Log slow requests (> 1000ms)
    if (responseTime > 1000) {
      console.warn(`🐌 Slow request detected: ${req.method} ${req.path} - ${responseTime}ms`);
    }
    
    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`⚡ ${req.method} ${req.path} - ${responseTime}ms - ${res.statusCode}`);
    }
    
    return originalSend.call(this, data);
  };
  
  next();
};

// Memory usage middleware
export const memoryMonitor = (req: Request, res: Response, next: NextFunction) => {
  const memUsage = process.memoryUsage();
  const memoryUsedMB = Math.round(memUsage.heapUsed / 1024 / 1024);
  
  // Warn if memory usage is high
  if (memoryUsedMB > 512) { // 512MB threshold
    console.warn(`🚨 High memory usage detected: ${memoryUsedMB}MB`);
  }
  
  // Add memory usage header in development
  if (process.env.NODE_ENV === 'development') {
    res.setHeader('X-Memory-Usage', `${memoryUsedMB}MB`);
  }
  
  next();
};

// Request size monitoring
export const requestSizeMonitor = (req: Request, res: Response, next: NextFunction) => {
  const contentLength = req.get('Content-Length');
  
  if (contentLength) {
    const sizeBytes = parseInt(contentLength, 10);
    const sizeMB = sizeBytes / (1024 * 1024);
    
    // Log large requests (> 5MB)
    if (sizeMB > 5) {
      console.warn(`📦 Large request detected: ${req.method} ${req.path} - ${sizeMB.toFixed(2)}MB`);
    }
  }
  
  next();
};

// API endpoint monitoring
export const endpointStats: Map<string, { count: number; totalTime: number; errors: number }> = new Map();

export const endpointMonitor = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  const endpoint = `${req.method} ${req.route?.path || req.path}`;
  
  // Initialize stats if not exists
  if (!endpointStats.has(endpoint)) {
    endpointStats.set(endpoint, { count: 0, totalTime: 0, errors: 0 });
  }
  
  const stats = endpointStats.get(endpoint)!;
  stats.count++;
  
  // Store original end function
  const originalEnd = res.end;
  
  res.end = function(chunk?: any) {
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    stats.totalTime += responseTime;
    
    if (res.statusCode >= 400) {
      stats.errors++;
    }
    
    return originalEnd.call(this, chunk);
  };
  
  next();
};

// Get performance statistics
export const getPerformanceStats = () => {
  const stats: any = {};
  
  for (const [endpoint, data] of endpointStats) {
    stats[endpoint] = {
      requests: data.count,
      averageTime: data.count > 0 ? Math.round(data.totalTime / data.count) : 0,
      errors: data.errors,
      errorRate: data.count > 0 ? Math.round((data.errors / data.count) * 100) : 0,
    };
  }
  
  return {
    endpoints: stats,
    memory: process.memoryUsage(),
    uptime: process.uptime(),
    nodeVersion: process.version,
  };
};