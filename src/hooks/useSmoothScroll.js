import { useEffect, useCallback } from 'react'

/**
 * Custom hook for enhanced smooth scrolling
 */
export const useSmoothScroll = (options = {}) => {
  const {
    duration = 800,
    easing = 'easeInOutCubic',
    offset = 0,
    updateHistory = true
  } = options

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
    easeInOutQuart: (t) => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
    easeInOutBack: (t) => {
      const c1 = 1.70158
      const c2 = c1 * 1.525
      return t < 0.5
        ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
        : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2
    }
  }

  const scrollToElement = useCallback((elementId, customOptions = {}) => {
    const element = document.getElementById(elementId)
    if (!element) return Promise.reject(new Error(`Element with id "${elementId}" not found`))

    const finalOptions = { ...options, ...customOptions }
    const startPosition = window.pageYOffset
    const targetPosition = element.offsetTop - (finalOptions.offset || offset)
    const distance = targetPosition - startPosition
    let startTime = null

    const easingFunction = easingFunctions[finalOptions.easing || easing] || easingFunctions.easeInOutCubic

    return new Promise((resolve) => {
      const animation = (currentTime) => {
        if (startTime === null) startTime = currentTime
        const timeElapsed = currentTime - startTime
        const progress = Math.min(timeElapsed / (finalOptions.duration || duration), 1)
        
        const ease = easingFunction(progress)
        const currentPosition = startPosition + (distance * ease)
        
        window.scrollTo(0, currentPosition)
        
        if (progress < 1) {
          requestAnimationFrame(animation)
        } else {
          // Update URL hash if requested
          if (updateHistory && elementId) {
            history.replaceState(null, null, `#${elementId}`)
          }
          resolve()
        }
      }

      requestAnimationFrame(animation)
    })
  }, [duration, easing, offset, updateHistory])

  const scrollToTop = useCallback((customOptions = {}) => {
    const finalOptions = { ...options, ...customOptions }
    const startPosition = window.pageYOffset
    let startTime = null

    const easingFunction = easingFunctions[finalOptions.easing || easing] || easingFunctions.easeInOutCubic

    return new Promise((resolve) => {
      const animation = (currentTime) => {
        if (startTime === null) startTime = currentTime
        const timeElapsed = currentTime - startTime
        const progress = Math.min(timeElapsed / (finalOptions.duration || duration), 1)
        
        const ease = easingFunction(progress)
        const currentPosition = startPosition * (1 - ease)
        
        window.scrollTo(0, currentPosition)
        
        if (progress < 1) {
          requestAnimationFrame(animation)
        } else {
          resolve()
        }
      }

      requestAnimationFrame(animation)
    })
  }, [duration, easing])

  const scrollBy = useCallback((pixels, customOptions = {}) => {
    const finalOptions = { ...options, ...customOptions }
    const startPosition = window.pageYOffset
    let startTime = null

    const easingFunction = easingFunctions[finalOptions.easing || easing] || easingFunctions.easeInOutCubic

    return new Promise((resolve) => {
      const animation = (currentTime) => {
        if (startTime === null) startTime = currentTime
        const timeElapsed = currentTime - startTime
        const progress = Math.min(timeElapsed / (finalOptions.duration || duration), 1)
        
        const ease = easingFunction(progress)
        const currentPosition = startPosition + (pixels * ease)
        
        window.scrollTo(0, currentPosition)
        
        if (progress < 1) {
          requestAnimationFrame(animation)
        } else {
          resolve()
        }
      }

      requestAnimationFrame(animation)
    })
  }, [duration, easing])

  // Handle hash changes for direct navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1)
      if (hash) {
        // Small delay to ensure page is loaded
        setTimeout(() => {
          scrollToElement(hash)
        }, 100)
      }
    }

    // Handle initial hash on page load
    if (window.location.hash) {
      handleHashChange()
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [scrollToElement])

  return {
    scrollToElement,
    scrollToTop,
    scrollBy
  }
}

export default useSmoothScroll