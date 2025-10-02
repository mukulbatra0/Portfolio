import { useState, useEffect } from 'react'
import { getDeviceType, createResizeHandler, isTouchDevice } from '../utils/touchUtils'

/**
 * Hook for responsive design and device detection
 */
export const useResponsive = () => {
  const [deviceType, setDeviceType] = useState(getDeviceType())
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })
  const [isTouch, setIsTouch] = useState(isTouchDevice())
  const [orientation, setOrientation] = useState(
    window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
  )

  useEffect(() => {
    const handleResize = createResizeHandler(() => {
      const newWidth = window.innerWidth
      const newHeight = window.innerHeight
      
      setScreenSize({ width: newWidth, height: newHeight })
      setDeviceType(getDeviceType())
      setOrientation(newWidth > newHeight ? 'landscape' : 'portrait')
    })

    window.addEventListener('resize', handleResize)
    
    // Handle orientation change
    const handleOrientationChange = () => {
      setTimeout(() => {
        setScreenSize({
          width: window.innerWidth,
          height: window.innerHeight
        })
        setOrientation(window.innerWidth > window.innerHeight ? 'landscape' : 'portrait')
      }, 100) // Small delay to ensure dimensions are updated
    }

    window.addEventListener('orientationchange', handleOrientationChange)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleOrientationChange)
    }
  }, [])

  // Breakpoint helpers
  const breakpoints = {
    xs: screenSize.width < 480,
    sm: screenSize.width >= 480 && screenSize.width < 768,
    md: screenSize.width >= 768 && screenSize.width < 1024,
    lg: screenSize.width >= 1024 && screenSize.width < 1280,
    xl: screenSize.width >= 1280,
    mobile: screenSize.width < 768,
    tablet: screenSize.width >= 768 && screenSize.width < 1024,
    desktop: screenSize.width >= 1024
  }

  return {
    deviceType,
    screenSize,
    isTouch,
    orientation,
    breakpoints,
    isMobile: deviceType === 'mobile',
    isTablet: deviceType === 'tablet',
    isDesktop: deviceType === 'desktop'
  }
}

/**
 * Hook for mobile-specific optimizations
 */
export const useMobileOptimizations = () => {
  const { isMobile, isTouch } = useResponsive()
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)

    const handleChange = (e) => setReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handleChange)

    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Get optimized animation settings
  const getAnimationConfig = (baseConfig = {}) => {
    const { duration = 300, easing = 'ease-out', delay = 0 } = baseConfig

    if (reducedMotion) {
      return { duration: 0, easing: 'linear', delay: 0 }
    }

    if (isMobile) {
      return {
        duration: Math.round(duration * 0.8), // Faster on mobile
        easing,
        delay: Math.round(delay * 0.8)
      }
    }

    return baseConfig
  }

  // Get touch-optimized classes
  const getTouchClasses = (baseClasses = '') => {
    const touchClasses = isTouch ? 'touch-manipulation select-none' : ''
    return `${baseClasses} ${touchClasses}`.trim()
  }

  return {
    isMobile,
    isTouch,
    reducedMotion,
    getAnimationConfig,
    getTouchClasses
  }
}

/**
 * Hook for adaptive content based on screen size
 */
export const useAdaptiveContent = () => {
  const { breakpoints, screenSize } = useResponsive()

  // Get adaptive grid columns
  const getGridCols = (config = {}) => {
    const { xs = 1, sm = 2, md = 3, lg = 4, xl = 5 } = config

    if (breakpoints.xs) return xs
    if (breakpoints.sm) return sm
    if (breakpoints.md) return md
    if (breakpoints.lg) return lg
    return xl
  }

  // Get adaptive spacing
  const getSpacing = (config = {}) => {
    const { xs = 4, sm = 6, md = 8, lg = 12, xl = 16 } = config

    if (breakpoints.xs) return xs
    if (breakpoints.sm) return sm
    if (breakpoints.md) return md
    if (breakpoints.lg) return lg
    return xl
  }

  // Get adaptive font sizes
  const getFontSize = (config = {}) => {
    const { xs = 'text-sm', sm = 'text-base', md = 'text-lg', lg = 'text-xl', xl = 'text-2xl' } = config

    if (breakpoints.xs) return xs
    if (breakpoints.sm) return sm
    if (breakpoints.md) return md
    if (breakpoints.lg) return lg
    return xl
  }

  return {
    breakpoints,
    screenSize,
    getGridCols,
    getSpacing,
    getFontSize
  }
}