// Browser support configuration and minimum requirements

export const BROWSER_SUPPORT = {
  // Minimum supported versions
  minimumVersions: {
    Chrome: 70,
    Firefox: 65,
    Safari: 12,
    Edge: 79,
    'Samsung Internet': 10,
    Opera: 57
  },

  // Critical features required for basic functionality
  criticalFeatures: [
    'cssFlexbox',
    'es6Modules',
    'fetch',
    'localStorage',
    'intersectionObserver'
  ],

  // Enhanced features for optimal experience
  enhancedFeatures: [
    'cssGrid',
    'cssCustomProperties',
    'cssBackdropFilter',
    'cssTransforms3D',
    'webGL',
    'resizeObserver'
  ],

  // Features that can be polyfilled
  polyfillableFeatures: [
    'intersectionObserver',
    'resizeObserver',
    'fetch',
    'customElements'
  ],

  // Browser-specific optimizations
  optimizations: {
    Chrome: {
      useGPUAcceleration: true,
      useBackdropFilter: true,
      useWebGL2: true,
      usePassiveListeners: true
    },
    Firefox: {
      useGPUAcceleration: true,
      useBackdropFilter: true,
      useWebGL2: true,
      avoidWillChange: true // Firefox has issues with will-change
    },
    Safari: {
      useGPUAcceleration: true,
      useBackdropFilter: true,
      useWebGL2: false, // Limited WebGL2 support
      useWebkitPrefixes: true
    },
    Edge: {
      useGPUAcceleration: true,
      useBackdropFilter: true,
      useWebGL2: true,
      useMsPrefixes: false // Modern Edge doesn't need -ms- prefixes
    }
  },

  // Fallback strategies
  fallbacks: {
    cssGrid: 'flexbox',
    cssBackdropFilter: 'solidBackground',
    webGL: 'canvas2d',
    intersectionObserver: 'scrollListener',
    customElements: 'regularElements'
  },

  // Performance thresholds
  performance: {
    lowEnd: {
      maxAnimations: 5,
      reducedEffects: true,
      simplifiedShaders: true,
      lowerFrameRate: true
    },
    midRange: {
      maxAnimations: 15,
      reducedEffects: false,
      simplifiedShaders: false,
      lowerFrameRate: false
    },
    highEnd: {
      maxAnimations: -1, // No limit
      reducedEffects: false,
      simplifiedShaders: false,
      lowerFrameRate: false
    }
  }
}

export const FEATURE_DETECTION = {
  // CSS Feature Detection
  css: {
    grid: () => CSS.supports('display', 'grid'),
    flexbox: () => CSS.supports('display', 'flex'),
    customProperties: () => CSS.supports('--test', 'value'),
    backdropFilter: () => CSS.supports('backdrop-filter', 'blur(10px)') || 
                          CSS.supports('-webkit-backdrop-filter', 'blur(10px)'),
    clipPath: () => CSS.supports('clip-path', 'circle(50%)'),
    transforms3d: () => CSS.supports('transform', 'translateZ(0)'),
    sticky: () => CSS.supports('position', 'sticky') || 
                  CSS.supports('position', '-webkit-sticky')
  },

  // JavaScript Feature Detection
  javascript: {
    es6Modules: () => 'noModule' in HTMLScriptElement.prototype,
    asyncAwait: () => {
      try {
        return (async () => {})().constructor === (async function(){}).constructor
      } catch (e) {
        return false
      }
    },
    destructuring: () => {
      try {
        const { test } = { test: true }
        return test === true
      } catch (e) {
        return false
      }
    },
    arrowFunctions: () => {
      try {
        const test = () => true
        return test() === true
      } catch (e) {
        return false
      }
    },
    templateLiterals: () => {
      try {
        const test = `template`
        return test === 'template'
      } catch (e) {
        return false
      }
    }
  },

  // Web API Detection
  webAPIs: {
    intersectionObserver: () => 'IntersectionObserver' in window,
    resizeObserver: () => 'ResizeObserver' in window,
    mutationObserver: () => 'MutationObserver' in window,
    fetch: () => 'fetch' in window,
    localStorage: () => {
      try {
        localStorage.setItem('test', 'test')
        localStorage.removeItem('test')
        return true
      } catch (e) {
        return false
      }
    },
    sessionStorage: () => {
      try {
        sessionStorage.setItem('test', 'test')
        sessionStorage.removeItem('test')
        return true
      } catch (e) {
        return false
      }
    },
    webGL: () => {
      try {
        const canvas = document.createElement('canvas')
        return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      } catch (e) {
        return false
      }
    },
    webGL2: () => {
      try {
        const canvas = document.createElement('canvas')
        return !!canvas.getContext('webgl2')
      } catch (e) {
        return false
      }
    }
  },

  // Performance Detection
  performance: {
    requestAnimationFrame: () => 'requestAnimationFrame' in window,
    requestIdleCallback: () => 'requestIdleCallback' in window,
    performanceAPI: () => 'performance' in window && 'now' in performance,
    passiveListeners: () => {
      let passiveSupported = false
      try {
        const options = Object.defineProperty({}, 'passive', {
          get: () => { passiveSupported = true }
        })
        window.addEventListener('test', null, options)
        window.removeEventListener('test', null, options)
      } catch (err) {}
      return passiveSupported
    }
  }
}

export const ERROR_MESSAGES = {
  unsupportedBrowser: {
    title: 'Browser Not Supported',
    message: 'Your browser is not fully supported. Please upgrade to a modern browser for the best experience.',
    suggestions: [
      'Chrome 70 or later',
      'Firefox 65 or later', 
      'Safari 12 or later',
      'Edge 79 or later'
    ]
  },
  missingFeatures: {
    title: 'Missing Features',
    message: 'Some features may not work properly in your browser.',
    fallback: 'Basic functionality will still be available.'
  },
  performanceWarning: {
    title: 'Performance Warning',
    message: 'Your device may experience reduced performance. Some visual effects have been disabled.',
    suggestion: 'Consider using a more powerful device for the full experience.'
  }
}