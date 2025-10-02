// Web Vitals monitoring and reporting

const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // Silent monitoring - no console output
    fallbackVitalsMonitoring(onPerfEntry);
  }
};

// Fallback monitoring using Performance API
const fallbackVitalsMonitoring = (onPerfEntry) => {
  try {
    // Monitor First Contentful Paint (FCP)
    if ('PerformanceObserver' in window) {
      try {
        const fcpObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
              onPerfEntry({
                name: 'FCP',
                value: entry.startTime,
                id: 'fallback-fcp',
                rating: entry.startTime < 1800 ? 'good' : entry.startTime < 3000 ? 'needs-improvement' : 'poor'
              });
            }
          }
        });
        fcpObserver.observe({ entryTypes: ['paint'] });
      } catch (error) {
        // Silent error handling
      }

      // Monitor Largest Contentful Paint (LCP)
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          if (entries.length > 0) {
            const lastEntry = entries[entries.length - 1];
            onPerfEntry({
              name: 'LCP',
              value: lastEntry.startTime,
              id: 'fallback-lcp',
              rating: lastEntry.startTime < 2500 ? 'good' : lastEntry.startTime < 4000 ? 'needs-improvement' : 'poor'
            });
          }
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (error) {
        // Silent error handling
      }

      // Monitor First Input Delay (FID) approximation
      try {
        let firstInputTime = null;
        const firstInputHandler = (event) => {
          if (firstInputTime === null) {
            firstInputTime = performance.now();
            const processingTime = performance.now() - event.timeStamp;
            onPerfEntry({
              name: 'FID',
              value: processingTime,
              id: 'fallback-fid',
              rating: processingTime < 100 ? 'good' : processingTime < 300 ? 'needs-improvement' : 'poor'
            });
            
            // Remove listeners after first input
            ['mousedown', 'keydown', 'touchstart', 'pointerdown'].forEach(type => {
              document.removeEventListener(type, firstInputHandler, true);
            });
          }
        };
        
        ['mousedown', 'keydown', 'touchstart', 'pointerdown'].forEach(type => {
          document.addEventListener(type, firstInputHandler, true);
        });
      } catch (error) {
        // Silent error handling
      }

      // Monitor Cumulative Layout Shift (CLS) approximation
      try {
        let clsValue = 0;
        let clsReported = false;
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
          
          // Only report CLS once when it stabilizes or reaches a threshold
          if (!clsReported && (clsValue > 0.05 || performance.now() > 5000)) {
            onPerfEntry({
              name: 'CLS',
              value: clsValue,
              id: 'fallback-cls',
              rating: clsValue < 0.1 ? 'good' : clsValue < 0.25 ? 'needs-improvement' : 'poor'
            });
            clsReported = true;
          }
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (error) {
        // Silent error handling
      }
    }
  } catch (error) {
    // Silent error handling
  }
};

// Custom performance monitoring
export const monitorPerformance = () => {
  // Silent monitoring - no console output
  reportWebVitals((metric) => {
    // Send to analytics in production only
    if (process.env.NODE_ENV === 'production') {
      if (typeof gtag !== 'undefined') {
        gtag('event', metric.name, {
          event_category: 'Web Vitals',
          event_label: metric.id,
          value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
          non_interaction: true,
        });
      }
    }
  });
};

// Performance observer for additional metrics
export const observePerformance = () => {
  // Disabled in development to reduce console noise
  // Only collect metrics in production for analytics
  if ('PerformanceObserver' in window && process.env.NODE_ENV === 'production') {
    try {
      // Silent monitoring for production analytics
      const navObserver = new PerformanceObserver((list) => {
        // Collect data silently for potential analytics
      });
      navObserver.observe({ entryTypes: ['navigation'] });
    } catch (error) {
      // Silent error handling
    }
  }
};

export default reportWebVitals;