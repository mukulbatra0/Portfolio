// Utility helper functions

/**
 * Debounce function to limit the rate of function calls
 */
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttle function to limit function calls to once per specified time
 */
export const throttle = (func, limit) => {
  let inThrottle
  return function() {
    const args = arguments
    const context = this
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

/**
 * Check if device supports WebGL
 */
export const checkWebGLSupport = () => {
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    return !!gl
  } catch (e) {
    return false
  }
}

/**
 * Get device performance tier based on hardware
 */
export const getPerformanceTier = () => {
  const canvas = document.createElement('canvas')
  const gl = canvas.getContext('webgl')
  
  if (!gl) return 'low'
  
  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
  if (debugInfo) {
    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
    
    // Simple heuristic based on GPU names
    if (renderer.includes('RTX') || renderer.includes('GTX 1060') || renderer.includes('RX 580')) {
      return 'high'
    } else if (renderer.includes('GTX') || renderer.includes('RX')) {
      return 'medium'
    }
  }
  
  // Fallback to memory-based detection
  const memory = navigator.deviceMemory || 4
  if (memory >= 8) return 'high'
  if (memory >= 4) return 'medium'
  return 'low'
}

/**
 * Enhanced smooth scroll to element with easing
 */
export const smoothScrollTo = (elementId, offset = 0, duration = 1000) => {
  const element = document.getElementById(elementId)
  if (!element) return

  const startPosition = window.pageYOffset
  const targetPosition = element.offsetTop - offset
  const distance = targetPosition - startPosition
  let startTime = null

  // Easing function for smooth animation
  const easeInOutCubic = (t) => {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
  }

  const animation = (currentTime) => {
    if (startTime === null) startTime = currentTime
    const timeElapsed = currentTime - startTime
    const progress = Math.min(timeElapsed / duration, 1)
    
    const ease = easeInOutCubic(progress)
    const currentPosition = startPosition + (distance * ease)
    
    window.scrollTo(0, currentPosition)
    
    if (progress < 1) {
      requestAnimationFrame(animation)
    }
  }

  requestAnimationFrame(animation)
}

/**
 * Smooth scroll with custom easing options
 */
export const smoothScrollToWithEasing = (elementId, options = {}) => {
  const {
    offset = 0,
    duration = 800,
    easing = 'easeInOutCubic',
    callback = null
  } = options

  const element = document.getElementById(elementId)
  if (!element) return

  const startPosition = window.pageYOffset
  const targetPosition = element.offsetTop - offset
  const distance = targetPosition - startPosition
  let startTime = null

  // Easing functions
  const easingFunctions = {
    linear: (t) => t,
    easeInQuad: (t) => t * t,
    easeOutQuad: (t) => t * (2 - t),
    easeInOutQuad: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    easeInCubic: (t) => t * t * t,
    easeOutCubic: (t) => (--t) * t * t + 1,
    easeInOutCubic: (t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
    easeInQuart: (t) => t * t * t * t,
    easeOutQuart: (t) => 1 - (--t) * t * t * t,
    easeInOutQuart: (t) => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t
  }

  const easingFunction = easingFunctions[easing] || easingFunctions.easeInOutCubic

  const animation = (currentTime) => {
    if (startTime === null) startTime = currentTime
    const timeElapsed = currentTime - startTime
    const progress = Math.min(timeElapsed / duration, 1)
    
    const ease = easingFunction(progress)
    const currentPosition = startPosition + (distance * ease)
    
    window.scrollTo(0, currentPosition)
    
    if (progress < 1) {
      requestAnimationFrame(animation)
    } else if (callback) {
      callback()
    }
  }

  requestAnimationFrame(animation)
}

/**
 * Clamp number between min and max values
 */
export const clamp = (num, min, max) => Math.min(Math.max(num, min), max)

/**
 * Linear interpolation between two values
 */
export const lerp = (start, end, factor) => start + (end - start) * factor

/**
 * Map value from one range to another
 */
export const mapRange = (value, inMin, inMax, outMin, outMax) => {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
}

/**
 * Check if element is in viewport
 */
export const isInViewport = (element, threshold = 0) => {
  const rect = element.getBoundingClientRect()
  const windowHeight = window.innerHeight || document.documentElement.clientHeight
  
  return (
    rect.top <= windowHeight * (1 - threshold) &&
    rect.bottom >= windowHeight * threshold
  )
}

/**
 * Preload image
 */
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

/**
 * Format file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}