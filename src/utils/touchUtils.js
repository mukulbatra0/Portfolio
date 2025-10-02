// Touch and gesture utilities for mobile optimization

/**
 * Detect if device supports touch
 */
export const isTouchDevice = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

/**
 * Get device type based on screen size and touch support
 */
export const getDeviceType = () => {
  const width = window.innerWidth
  const isTouch = isTouchDevice()
  
  if (width < 768) return 'mobile'
  if (width < 1024 && isTouch) return 'tablet'
  return 'desktop'
}

/**
 * Add touch-friendly classes based on device
 */
export const getTouchClasses = (baseClasses = '') => {
  const deviceType = getDeviceType()
  const touchClasses = {
    mobile: 'touch-manipulation select-none',
    tablet: 'touch-manipulation',
    desktop: ''
  }
  
  return `${baseClasses} ${touchClasses[deviceType]}`.trim()
}

/**
 * Optimize animations for mobile devices
 */
export const getOptimizedAnimationDuration = (baseDuration = 300) => {
  const deviceType = getDeviceType()
  const multipliers = {
    mobile: 0.8, // Faster animations on mobile
    tablet: 0.9,
    desktop: 1
  }
  
  return Math.round(baseDuration * multipliers[deviceType])
}

/**
 * Handle touch events with proper preventDefault
 */
export const handleTouchEvent = (callback, options = {}) => {
  const { preventDefault = true, passive = false } = options
  
  return (event) => {
    if (preventDefault && !passive) {
      event.preventDefault()
    }
    callback(event)
  }
}

/**
 * Create swipe gesture handler
 */
export const createSwipeHandler = (callbacks = {}) => {
  let startX = 0
  let startY = 0
  let startTime = 0
  
  const { onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold = 50, timeThreshold = 300 } = callbacks
  
  const handleTouchStart = (e) => {
    const touch = e.touches[0]
    startX = touch.clientX
    startY = touch.clientY
    startTime = Date.now()
  }
  
  const handleTouchEnd = (e) => {
    const touch = e.changedTouches[0]
    const endX = touch.clientX
    const endY = touch.clientY
    const endTime = Date.now()
    
    const deltaX = endX - startX
    const deltaY = endY - startY
    const deltaTime = endTime - startTime
    
    // Check if swipe was fast enough
    if (deltaTime > timeThreshold) return
    
    // Check if swipe was long enough
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    if (distance < threshold) return
    
    // Determine swipe direction
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (deltaX > 0 && onSwipeRight) {
        onSwipeRight(e)
      } else if (deltaX < 0 && onSwipeLeft) {
        onSwipeLeft(e)
      }
    } else {
      // Vertical swipe
      if (deltaY > 0 && onSwipeDown) {
        onSwipeDown(e)
      } else if (deltaY < 0 && onSwipeUp) {
        onSwipeUp(e)
      }
    }
  }
  
  return {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd
  }
}

/**
 * Debounce resize events for better performance
 */
export const createResizeHandler = (callback, delay = 250) => {
  let timeoutId
  
  return () => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(callback, delay)
  }
}

/**
 * Get safe area insets for devices with notches
 */
export const getSafeAreaInsets = () => {
  const style = getComputedStyle(document.documentElement)
  
  return {
    top: parseInt(style.getPropertyValue('env(safe-area-inset-top)') || '0'),
    right: parseInt(style.getPropertyValue('env(safe-area-inset-right)') || '0'),
    bottom: parseInt(style.getPropertyValue('env(safe-area-inset-bottom)') || '0'),
    left: parseInt(style.getPropertyValue('env(safe-area-inset-left)') || '0')
  }
}

/**
 * Optimize scroll performance for mobile
 */
export const optimizeScrollPerformance = () => {
  // Add passive event listeners for better scroll performance
  const passiveSupported = (() => {
    let passive = false
    try {
      const options = Object.defineProperty({}, 'passive', {
        get: () => { passive = true }
      })
      window.addEventListener('test', null, options)
      window.removeEventListener('test', null, options)
    } catch (err) {}
    return passive
  })()
  
  return passiveSupported ? { passive: true } : false
}

/**
 * Handle viewport changes for mobile browsers
 */
export const handleViewportChange = (callback) => {
  let viewportHeight = window.innerHeight
  
  const checkViewport = () => {
    const currentHeight = window.innerHeight
    const heightDiff = Math.abs(currentHeight - viewportHeight)
    
    // Significant height change (likely keyboard show/hide)
    if (heightDiff > 150) {
      callback({
        type: currentHeight < viewportHeight ? 'keyboard-show' : 'keyboard-hide',
        oldHeight: viewportHeight,
        newHeight: currentHeight,
        difference: heightDiff
      })
    }
    
    viewportHeight = currentHeight
  }
  
  window.addEventListener('resize', checkViewport, optimizeScrollPerformance())
  
  return () => {
    window.removeEventListener('resize', checkViewport)
  }
}