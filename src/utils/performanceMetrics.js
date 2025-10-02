// Simple performance metrics without external dependencies

export const measurePageLoad = () => {
  if ('performance' in window && 'timing' in performance) {
    const timing = performance.timing;
    const navigation = performance.navigation;
    
    const metrics = {
      // Navigation timing
      navigationStart: timing.navigationStart,
      domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
      loadComplete: timing.loadEventEnd - timing.navigationStart,
      
      // Network timing
      dnsLookup: timing.domainLookupEnd - timing.domainLookupStart,
      tcpConnect: timing.connectEnd - timing.connectStart,
      serverResponse: timing.responseEnd - timing.requestStart,
      
      // Rendering timing
      domProcessing: timing.domComplete - timing.domLoading,
      
      // Navigation type
      navigationType: navigation.type === 0 ? 'navigate' : 
                     navigation.type === 1 ? 'reload' : 
                     navigation.type === 2 ? 'back_forward' : 'unknown'
    };
    
    return metrics;
  }
  
  return null;
};

export const measureResourceTiming = () => {
  if ('performance' in window && 'getEntriesByType' in performance) {
    const resources = performance.getEntriesByType('resource');
    
    return resources.map(resource => ({
      name: resource.name,
      duration: resource.duration,
      size: resource.transferSize || 0,
      type: resource.initiatorType,
      startTime: resource.startTime
    }));
  }
  
  return [];
};

export const measureMemoryUsage = () => {
  if ('memory' in performance) {
    return {
      usedJSHeapSize: performance.memory.usedJSHeapSize,
      totalJSHeapSize: performance.memory.totalJSHeapSize,
      jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
    };
  }
  
  return null;
};

export const logPerformanceReport = () => {
  // Silent monitoring - only collect data, don't log to console
  const resources = measureResourceTiming();
  const memory = measureMemoryUsage();
  
  // Store metrics for potential analytics without console noise
  return {
    slowResources: resources.filter(r => r.duration > 500).length, // Only extremely slow
    memoryUsage: memory ? Math.round(memory.usedJSHeapSize / 1024 / 1024) : 0
  };
};

// Initialize performance monitoring
export const initPerformanceMonitoring = () => {
  // Silent monitoring only - no console output
  if (process.env.NODE_ENV === 'production') {
    // Only collect metrics in production for analytics
    if (document.readyState === 'complete') {
      setTimeout(logPerformanceReport, 3000);
    } else {
      window.addEventListener('load', () => {
        setTimeout(logPerformanceReport, 3000);
      });
    }
  }
};