# SEO and Performance Utilities

This directory contains utilities for SEO optimization and performance monitoring.

## Files Overview

### SEO Related
- `seo.js` - Core SEO utilities for meta tag management and structured data
- `seoValidator.js` - Development tool for validating SEO implementation
- `serviceWorker.js` - Service worker registration for performance

### Performance Monitoring
- `webVitals.js` - Web Vitals monitoring with fallback implementation
- `performanceMetrics.js` - Simple performance metrics without external dependencies

### Browser Compatibility
- `browserUtils.js` - Browser detection and compatibility utilities

## Implementation Notes

### Web Vitals
The implementation uses a fallback approach since the `web-vitals` library is not installed:
- Uses native Performance Observer API when available
- Provides approximate measurements for Core Web Vitals
- Graceful degradation for unsupported browsers

### Polyfills
Browser polyfills are referenced but not loaded since the packages aren't installed:
- `intersection-observer` - For older browser support
- `@juggle/resize-observer` - ResizeObserver polyfill
- `whatwg-fetch` - Fetch API polyfill

### Performance Monitoring
- Native Performance API for timing measurements
- Resource timing analysis
- Memory usage monitoring (Chrome only)
- Long task detection

## Usage

### SEO Initialization
```javascript
import { initializeSEO } from './utils/seo'

// Initialize SEO optimizations
initializeSEO()
```

### Performance Monitoring
```javascript
import { initPerformanceMonitoring } from './utils/performanceMetrics'

// Start performance monitoring
initPerformanceMonitoring()
```

### Dynamic Meta Tags
```javascript
import { updateMetaTags } from './utils/seo'

// Update meta tags based on current section
updateMetaTags('projects')
```

## Adding External Dependencies

To enhance the implementation with external libraries:

1. **Install web-vitals**:
   ```bash
   npm install web-vitals
   ```

2. **Install polyfills**:
   ```bash
   npm install intersection-observer @juggle/resize-observer whatwg-fetch
   ```

3. **Update imports**: The code is already prepared to use these libraries when available.

## Browser Support

- **Modern browsers**: Full feature support
- **Older browsers**: Graceful degradation with fallbacks
- **IE11+**: Basic functionality with polyfills (when installed)