// Browser detection and compatibility utilities

/**
 * Detect current browser
 */
export const getBrowserInfo = () => {
  const userAgent = navigator.userAgent
  const vendor = navigator.vendor || ''
  
  // Chrome
  if (userAgent.includes('Chrome') && vendor.includes('Google')) {
    const match = userAgent.match(/Chrome\/(\d+)/)
    return {
      name: 'Chrome',
      version: match ? parseInt(match[1]) : 0,
      isChrome: true,
      isFirefox: false,
      isSafari: false,
      isEdge: false,
      isIE: false
    }
  }
  
  // Firefox
  if (userAgent.includes('Firefox')) {
    const match = userAgent.match(/Firefox\/(\d+)/)
    return {
      name: 'Firefox',
      version: match ? parseInt(match[1]) : 0,
      isChrome: false,
      isFirefox: true,
      isSafari: false,
      isEdge: false,
      isIE: false
    }
  }
  
  // Safari
  if (userAgent.includes('Safari') && vendor.includes('Apple') && !userAgent.includes('Chrome')) {
    const match = userAgent.match(/Version\/(\d+)/)
    return {
      name: 'Safari',
      version: match ? parseInt(match[1]) : 0,
      isChrome: false,
      isFirefox: false,
      isSafari: true,
      isEdge: false,
      isIE: false
    }
  }
  
  // Edge
  if (userAgent.includes('Edg')) {
    const match = userAgent.match(/Edg\/(\d+)/)
    return {
      name: 'Edge',
      version: match ? parseInt(match[1]) : 0,
      isChrome: false,
      isFirefox: false,
      isSafari: false,
      isEdge: true,
      isIE: false
    }
  }
  
  // Internet Explorer
  if (userAgent.includes('MSIE') || userAgent.includes('Trident')) {
    const match = userAgent.match(/(?:MSIE |rv:)(\d+)/)
    return {
      name: 'Internet Explorer',
      version: match ? parseInt(match[1]) : 0,
      isChrome: false,
      isFirefox: false,
      isSafari: false,
      isEdge: false,
      isIE: true
    }
  }
  
  // Unknown browser
  return {
    name: 'Unknown',
    version: 0,
    isChrome: false,
    isFirefox: false,
    isSafari: false,
    isEdge: false,
    isIE: false
  }
}

/**
 * Check if browser supports specific features
 */
export const checkBrowserSupport = () => {
  const support = {
    // CSS Features
    cssGrid: CSS.supports('display', 'grid'),
    cssFlexbox: CSS.supports('display', 'flex'),
    cssCustomProperties: CSS.supports('--test', 'value'),
    cssBackdropFilter: CSS.supports('backdrop-filter', 'blur(10px)'),
    cssClipPath: CSS.supports('clip-path', 'circle(50%)'),
    cssTransforms3D: CSS.supports('transform', 'translateZ(0)'),
    
    // JavaScript Features
    intersectionObserver: 'IntersectionObserver' in window,
    resizeObserver: 'ResizeObserver' in window,
    webGL: (() => {
      try {
        const canvas = document.createElement('canvas')
        return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      } catch (e) {
        return false
      }
    })(),
    webGL2: (() => {
      try {
        const canvas = document.createElement('canvas')
        return !!canvas.getContext('webgl2')
      } catch (e) {
        return false
      }
    })(),
    
    // Modern JavaScript
    es6Modules: 'noModule' in HTMLScriptElement.prototype,
    asyncAwait: (() => {
      try {
        return (async () => {})().constructor === (async function(){}).constructor
      } catch (e) {
        return false
      }
    })(),
    
    // Web APIs
    fetch: 'fetch' in window,
    localStorage: (() => {
      try {
        localStorage.setItem('test', 'test')
        localStorage.removeItem('test')
        return true
      } catch (e) {
        return false
      }
    })(),
    
    // Media Features
    webP: (() => {
      const canvas = document.createElement('canvas')
      canvas.width = 1
      canvas.height = 1
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
    })(),
    avif: (() => {
      const canvas = document.createElement('canvas')
      canvas.width = 1
      canvas.height = 1
      return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0
    })()
  }
  
  return support
}

/**
 * Get browser-specific CSS prefixes
 */
export const getCSSPrefixes = () => {
  const browser = getBrowserInfo()
  
  const prefixes = {
    webkit: ['-webkit-'],
    moz: ['-moz-'],
    ms: ['-ms-'],
    o: ['-o-'],
    standard: ['']
  }
  
  if (browser.isSafari || browser.isChrome) {
    return [...prefixes.webkit, ...prefixes.standard]
  }
  
  if (browser.isFirefox) {
    return [...prefixes.moz, ...prefixes.standard]
  }
  
  if (browser.isEdge || browser.isIE) {
    return [...prefixes.ms, ...prefixes.standard]
  }
  
  return prefixes.standard
}

/**
 * Apply CSS property with vendor prefixes
 */
export const setCSSWithPrefixes = (element, property, value) => {
  const prefixes = getCSSPrefixes()
  
  prefixes.forEach(prefix => {
    const prefixedProperty = prefix + property
    element.style.setProperty(prefixedProperty, value)
  })
}

/**
 * Polyfill for missing features
 */
export const loadPolyfills = async () => {
  const support = checkBrowserSupport()
  const polyfills = []
  
  // IntersectionObserver polyfill
  if (!support.intersectionObserver) {
    console.warn('IntersectionObserver not supported, polyfill not available')
  }
  
  // ResizeObserver polyfill
  if (!support.resizeObserver) {
    console.warn('ResizeObserver not supported, polyfill not available')
  }
  
  // Fetch polyfill for older browsers
  if (!support.fetch) {
    console.warn('Fetch not supported, polyfill not available')
  }
  
  await Promise.all(polyfills)
}

/**
 * Get browser-specific optimizations
 */
export const getBrowserOptimizations = () => {
  const browser = getBrowserInfo()
  const support = checkBrowserSupport()
  
  return {
    // Disable expensive effects on older browsers
    useReducedEffects: browser.isIE || (browser.isSafari && browser.version < 14),
    
    // Use different animation strategies
    useTransforms: support.cssTransforms3D,
    useBackdropFilter: support.cssBackdropFilter,
    useWebGL: support.webGL,
    
    // Performance optimizations
    usePassiveListeners: 'passive' in document.createElement('div'),
    useRequestIdleCallback: 'requestIdleCallback' in window,
    
    // Rendering optimizations
    useWillChange: !browser.isFirefox, // Firefox has issues with will-change
    useContainment: CSS.supports('contain', 'layout'),
    
    // Browser-specific fixes
    needsScrollbarFix: browser.isFirefox,
    needsFlexboxFix: browser.isIE,
    needsGridFix: browser.isIE || (browser.isSafari && browser.version < 12)
  }
}

/**
 * Add browser-specific CSS classes to document
 */
export const addBrowserClasses = () => {
  const browser = getBrowserInfo()
  const support = checkBrowserSupport()
  const classes = []
  
  // Browser classes
  classes.push(`browser-${browser.name.toLowerCase().replace(/\s+/g, '-')}`)
  classes.push(`browser-version-${browser.version}`)
  
  // Feature classes
  if (support.cssGrid) classes.push('supports-grid')
  if (support.cssFlexbox) classes.push('supports-flexbox')
  if (support.cssBackdropFilter) classes.push('supports-backdrop-filter')
  if (support.webGL) classes.push('supports-webgl')
  if (support.intersectionObserver) classes.push('supports-intersection-observer')
  
  // Add classes to document
  document.documentElement.classList.add(...classes)
}

/**
 * Browser-specific event listener options
 */
export const getEventOptions = (options = {}) => {
  const browser = getBrowserInfo()
  const defaultOptions = { passive: false, capture: false }
  
  // Safari has issues with passive listeners in some cases
  if (browser.isSafari && options.passive) {
    return { ...defaultOptions, ...options, passive: false }
  }
  
  return { ...defaultOptions, ...options }
}

/**
 * Safe feature detection wrapper
 */
export const safeFeatureDetection = (feature, fallback = false) => {
  try {
    return feature()
  } catch (error) {
    console.warn('Feature detection failed:', error)
    return fallback
  }
}