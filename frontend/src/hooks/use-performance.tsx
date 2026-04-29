import { useState, useEffect, useRef } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  connectionType: string | undefined;
  isOnline: boolean;
  fps: number;
}

interface UsePerformanceOptions {
  trackFPS?: boolean;
  trackMemory?: boolean;
  reportInterval?: number;
}

export const usePerformance = (options: UsePerformanceOptions = {}) => {
  const {
    trackFPS = false,
    trackMemory = true,
    reportInterval = 10000, // 10 seconds
  } = options;

  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    connectionType: undefined,
    isOnline: navigator.onLine,
    fps: 0,
  });

  const frameRef = useRef<number>();
  const fpsRef = useRef(0);
  const lastTimeRef = useRef(performance.now());

  // Track page load time
  useEffect(() => {
    const loadTime = performance.timing 
      ? performance.timing.loadEventEnd - performance.timing.navigationStart
      : 0;
    
    setMetrics(prev => ({ ...prev, loadTime }));
  }, []);

  // Track component render time
  const renderStartTime = useRef(performance.now());
  useEffect(() => {
    const renderTime = performance.now() - renderStartTime.current;
    setMetrics(prev => ({ ...prev, renderTime }));
  });

  // Track memory usage
  useEffect(() => {
    if (!trackMemory) return;

    const updateMemoryUsage = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        setMetrics(prev => ({
          ...prev,
          memoryUsage: memory.usedJSHeapSize / 1024 / 1024, // Convert to MB
        }));
      }
    };

    updateMemoryUsage();
    const interval = setInterval(updateMemoryUsage, reportInterval);

    return () => clearInterval(interval);
  }, [trackMemory, reportInterval]);

  // Track FPS
  useEffect(() => {
    if (!trackFPS) return;

    const calculateFPS = (currentTime: number) => {
      const delta = currentTime - lastTimeRef.current;
      if (delta >= 1000) { // Update every second
        setMetrics(prev => ({ ...prev, fps: Math.round(fpsRef.current * 1000 / delta) }));
        fpsRef.current = 0;
        lastTimeRef.current = currentTime;
      } else {
        fpsRef.current++;
      }

      frameRef.current = requestAnimationFrame(calculateFPS);
    };

    frameRef.current = requestAnimationFrame(calculateFPS);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [trackFPS]);

  // Track network connection
  useEffect(() => {
    const updateConnection = () => {
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      setMetrics(prev => ({
        ...prev,
        connectionType: connection?.effectiveType || undefined,
        isOnline: navigator.onLine,
      }));
    };

    updateConnection();

    window.addEventListener('online', updateConnection);
    window.addEventListener('offline', updateConnection);

    if ('connection' in navigator) {
      (navigator as any).connection.addEventListener('change', updateConnection);
    }

    return () => {
      window.removeEventListener('online', updateConnection);
      window.removeEventListener('offline', updateConnection);
      if ('connection' in navigator) {
        (navigator as any).connection.removeEventListener('change', updateConnection);
      }
    };
  }, []);

  return metrics;
};

// Hook for tracking specific operations
export const useOperationTiming = () => {
  const [operations, setOperations] = useState<Record<string, number>>({});

  const trackOperation = (name: string, operation: () => Promise<any> | any) => {
    const startTime = performance.now();
    
    const result = operation();
    
    if (result instanceof Promise) {
      return result.finally(() => {
        const duration = performance.now() - startTime;
        setOperations(prev => ({ ...prev, [name]: duration }));
      });
    } else {
      const duration = performance.now() - startTime;
      setOperations(prev => ({ ...prev, [name]: duration }));
      return result;
    }
  };

  const clearOperations = () => setOperations({});

  return { operations, trackOperation, clearOperations };
};

// Hook for Web Vitals
export const useWebVitals = () => {
  const [vitals, setVitals] = useState({
    lcp: 0, // Largest Contentful Paint
    fid: 0, // First Input Delay
    cls: 0, // Cumulative Layout Shift
    fcp: 0, // First Contentful Paint
    ttfb: 0, // Time to First Byte
  });

  useEffect(() => {
    // LCP
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      setVitals(prev => ({ ...prev, lcp: lastEntry.startTime }));
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    // FID
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        if ('processingStart' in entry) {
          const perfEntry = entry as any; // Type assertion for First Input Delay
          setVitals(prev => ({ ...prev, fid: perfEntry.processingStart - perfEntry.startTime }));
        }
      });
    });
    fidObserver.observe({ entryTypes: ['first-input'] });

    // CLS
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
          setVitals(prev => ({ ...prev, cls: clsValue }));
        }
      });
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });

    // FCP & TTFB
    const navigationObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        const nav = entry as PerformanceNavigationTiming;
        setVitals(prev => ({
          ...prev,
          fcp: nav.loadEventStart - nav.fetchStart,
          ttfb: nav.responseStart - nav.requestStart,
        }));
      });
    });
    navigationObserver.observe({ entryTypes: ['navigation'] });

    return () => {
      lcpObserver.disconnect();
      fidObserver.disconnect();
      clsObserver.disconnect();
      navigationObserver.disconnect();
    };
  }, []);

  return vitals;
};

// Performance monitoring component
export const PerformanceMonitor: React.FC<{ enabled?: boolean }> = ({ enabled = false }) => {
  const metrics = usePerformance({ trackFPS: true, trackMemory: true });
  const vitals = useWebVitals();

  if (!enabled || process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-3 rounded-lg text-xs font-mono z-50">
      <div className="space-y-1">
        <div>Load: {metrics.loadTime.toFixed(0)}ms</div>
        <div>Render: {metrics.renderTime.toFixed(1)}ms</div>
        <div>Memory: {metrics.memoryUsage.toFixed(1)}MB</div>
        <div>FPS: {metrics.fps}</div>
        <div>Network: {metrics.connectionType || 'Unknown'}</div>
        <div>Status: {metrics.isOnline ? '🟢' : '🔴'}</div>
        <hr className="border-gray-600" />
        <div>LCP: {vitals.lcp.toFixed(0)}ms</div>
        <div>FID: {vitals.fid.toFixed(1)}ms</div>
        <div>CLS: {vitals.cls.toFixed(3)}</div>
      </div>
    </div>
  );
};

export default usePerformance;