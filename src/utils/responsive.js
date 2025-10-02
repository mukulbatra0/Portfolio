/**
 * Responsive utility functions for better mobile experience
 */

/**
 * Breakpoint utilities
 */
export const breakpoints = {
  xs: 475,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
}

/**
 * Check if current viewport matches breakpoint
 */
export const useBreakpoint = (breakpoint) => {
  if (typeof window === 'undefined') return false
  return window.innerWidth >= breakpoints[breakpoint]
}

/**
 * Get current breakpoint
 */
export const getCurrentBreakpoint = () => {
  if (typeof window === 'undefined') return 'lg'
  
  const width = window.innerWidth
  
  if (width >= breakpoints['2xl']) return '2xl'
  if (width >= breakpoints.xl) return 'xl'
  if (width >= breakpoints.lg) return 'lg'
  if (width >= breakpoints.md) return 'md'
  if (width >= breakpoints.sm) return 'sm'
  if (width >= breakpoints.xs) return 'xs'
  return 'base'
}

/**
 * Device type detection
 */
export const deviceType = {
  isMobile: () => typeof window !== 'undefined' && window.innerWidth < breakpoints.md,
  isTablet: () => typeof window !== 'undefined' && window.innerWidth >= breakpoints.md && window.innerWidth < breakpoints.lg,
  isDesktop: () => typeof window !== 'undefined' && window.innerWidth >= breakpoints.lg,
  
  // Touch device detection
  isTouchDevice: () => {
    if (typeof window === 'undefined') return false
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0
  },
  
  // Mobile browser detection
  isMobileBrowser: () => {
    if (typeof window === 'undefined') return false
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  }
}

/**
 * Responsive spacing utilities
 */
export const spacing = {
  // Get responsive padding based on screen size
  getResponsivePadding: (base = 4) => {
    const current = getCurrentBreakpoint()
    const multipliers = {
      base: 1,
      xs: 1,
      sm: 1.25,
      md: 1.5,
      lg: 2,
      xl: 2.5,
      '2xl': 3
    }
    return base * (multipliers[current] || 1)
  },
  
  // Get responsive gap based on screen size
  getResponsiveGap: (base = 4) => {
    const current = getCurrentBreakpoint()
    const multipliers = {
      base: 0.75,
      xs: 0.75,
      sm: 1,
      md: 1.25,
      lg: 1.5,
      xl: 2,
      '2xl': 2.5
    }
    return base * (multipliers[current] || 1)
  }
}

/**
 * Responsive text utilities
 */
export const typography = {
  // Get responsive font size
  getResponsiveFontSize: (sizes) => {
    const current = getCurrentBreakpoint()
    return sizes[current] || sizes.base || sizes.md || '1rem'
  },
  
  // Common responsive text size patterns
  heading1: {
    base: '2rem',
    sm: '2.5rem',
    md: '3rem',
    lg: '4rem',
    xl: '5rem'
  },
  
  heading2: {
    base: '1.75rem',
    sm: '2rem',
    md: '2.5rem',
    lg: '3rem',
    xl: '3.5rem'
  },
  
  heading3: {
    base: '1.5rem',
    sm: '1.75rem',
    md: '2rem',
    lg: '2.5rem',
    xl: '3rem'
  },
  
  body: {
    base: '0.875rem',
    sm: '1rem',
    md: '1.125rem',
    lg: '1.25rem'
  }
}

/**
 * Responsive grid utilities
 */
export const grid = {
  // Get responsive column count
  getResponsiveColumns: (config) => {
    const current = getCurrentBreakpoint()
    return config[current] || config.base || 1
  },
  
  // Common grid patterns
  autoFit: (minWidth = 300) => ({
    base: 1,
    sm: Math.floor(breakpoints.sm / minWidth),
    md: Math.floor(breakpoints.md / minWidth),
    lg: Math.floor(breakpoints.lg / minWidth),
    xl: Math.floor(breakpoints.xl / minWidth)
  }),
  
  // Project grid specific
  projectGrid: {
    base: 1,
    sm: 1,
    md: 1,
    lg: 2,
    xl: 2,
    '2xl': 2
  }
}

/**
 * Performance utilities for responsive design
 */
export const performance = {
  // Debounced resize handler
  createResizeHandler: (callback, delay = 150) => {
    let timeoutId
    return () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(callback, delay)
    }
  },
  
  // Throttled scroll handler
  createScrollHandler: (callback, delay = 16) => {
    let ticking = false
    return () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          callback()
          ticking = false
        })
        ticking = true
      }
    }
  },
  
  // Intersection observer for lazy loading
  createIntersectionObserver: (callback, options = {}) => {
    const defaultOptions = {
      rootMargin: '50px',
      threshold: 0.1,
      ...options
    }
    
    if (typeof window === 'undefined' || !window.IntersectionObserver) {
      return null
    }
    
    return new IntersectionObserver(callback, defaultOptions)
  }
}

/**
 * Accessibility utilities for responsive design
 */
export const accessibility = {
  // Check if user prefers reduced motion
  prefersReducedMotion: () => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  },
  
  // Check if user prefers high contrast
  prefersHighContrast: () => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-contrast: high)').matches
  },
  
  // Focus management for mobile
  manageFocus: {
    trap: (element) => {
      const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      
      if (focusableElements.length === 0) return () => {}
      
      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]
      
      const handleTabKey = (e) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              lastElement.focus()
              e.preventDefault()
            }
          } else {
            if (document.activeElement === lastElement) {
              firstElement.focus()
              e.preventDefault()
            }
          }
        }
      }
      
      element.addEventListener('keydown', handleTabKey)
      firstElement.focus()
      
      return () => {
        element.removeEventListener('keydown', handleTabKey)
      }
    }
  }
}

/**
 * Image optimization utilities
 */
export const images = {
  // Get responsive image sizes
  getResponsiveSizes: (config = {}) => {
    const defaults = {
      mobile: '100vw',
      tablet: '50vw',
      desktop: '33vw'
    }
    
    const sizes = { ...defaults, ...config }
    
    return `(max-width: ${breakpoints.md}px) ${sizes.mobile}, (max-width: ${breakpoints.lg}px) ${sizes.tablet}, ${sizes.desktop}`
  },
  
  // Generate srcset for responsive images
  generateSrcSet: (basePath, sizes = [400, 800, 1200, 1600]) => {
    return sizes.map(size => `${basePath}?w=${size} ${size}w`).join(', ')
  },
  
  // Lazy loading configuration
  getLazyLoadConfig: () => ({
    rootMargin: deviceType.isMobile() ? '100px' : '200px',
    threshold: 0.1
  })
}

/**
 * Animation utilities for responsive design
 */
export const animations = {
  // Get reduced animation config for mobile/reduced motion
  getAnimationConfig: (fullConfig, reducedConfig = {}) => {
    if (accessibility.prefersReducedMotion() || deviceType.isMobile()) {
      return {
        duration: 0.01,
        ease: 'linear',
        ...reducedConfig
      }
    }
    return fullConfig
  },
  
  // Stagger delays based on device performance
  getStaggerDelay: (baseDelay = 0.1) => {
    if (deviceType.isMobile()) {
      return baseDelay * 0.5 // Faster on mobile
    }
    return baseDelay
  }
}

export default {
  breakpoints,
  useBreakpoint,
  getCurrentBreakpoint,
  deviceType,
  spacing,
  typography,
  grid,
  performance,
  accessibility,
  images,
  animations
}