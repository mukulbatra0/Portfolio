// Layout utility functions

/**
 * Viewport utilities
 */
export const viewport = {
  /**
   * Get viewport dimensions
   */
  getDimensions() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      ratio: window.innerWidth / window.innerHeight
    }
  },

  /**
   * Check if viewport matches breakpoint
   */
  matches(breakpoint) {
    const breakpoints = {
      xs: 475,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      '2xl': 1536
    }

    const width = window.innerWidth
    const bp = breakpoints[breakpoint]

    if (!bp) return false

    return width >= bp
  },

  /**
   * Get current breakpoint
   */
  getCurrentBreakpoint() {
    const width = window.innerWidth

    if (width >= 1536) return '2xl'
    if (width >= 1280) return 'xl'
    if (width >= 1024) return 'lg'
    if (width >= 768) return 'md'
    if (width >= 640) return 'sm'
    if (width >= 475) return 'xs'
    return 'base'
  },

  /**
   * Check if mobile device
   */
  isMobile() {
    return window.innerWidth < 768
  },

  /**
   * Check if tablet device
   */
  isTablet() {
    return window.innerWidth >= 768 && window.innerWidth < 1024
  },

  /**
   * Check if desktop device
   */
  isDesktop() {
    return window.innerWidth >= 1024
  }
}

/**
 * Scroll utilities
 */
export const scroll = {
  /**
   * Get scroll position
   */
  getPosition() {
    return {
      x: window.pageXOffset || document.documentElement.scrollLeft,
      y: window.pageYOffset || document.documentElement.scrollTop
    }
  },

  /**
   * Get scroll progress (0-100)
   */
  getProgress() {
    const scrollTop = window.pageYOffset
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    return Math.min(100, Math.max(0, (scrollTop / docHeight) * 100))
  },

  /**
   * Get element scroll progress
   */
  getElementProgress(element) {
    if (!element) return 0

    const rect = element.getBoundingClientRect()
    const windowHeight = window.innerHeight
    const elementHeight = rect.height

    // Element is above viewport
    if (rect.bottom < 0) return 100

    // Element is below viewport
    if (rect.top > windowHeight) return 0

    // Element is partially or fully in viewport
    const visibleHeight = Math.min(
      windowHeight,
      Math.max(0, windowHeight - Math.max(0, rect.top)),
      Math.max(0, rect.bottom)
    )

    return Math.min(100, Math.max(0, (visibleHeight / windowHeight) * 100))
  },

  /**
   * Smooth scroll to position
   */
  toPosition(x, y, behavior = 'smooth') {
    window.scrollTo({ left: x, top: y, behavior })
  },

  /**
   * Smooth scroll to element
   */
  toElement(element, offset = 0, behavior = 'smooth') {
    if (!element) {
      console.warn('Element not found for scroll')
      return
    }

    const elementTop = element.getBoundingClientRect().top + window.pageYOffset - offset
    const finalPosition = Math.max(0, elementTop)
    
    console.log(`Scrolling to element at position: ${finalPosition} (offset: ${offset})`)
    window.scrollTo({ top: finalPosition, behavior })
  },

  /**
   * Scroll to top
   */
  toTop(behavior = 'smooth') {
    window.scrollTo({ top: 0, behavior })
  },

  /**
   * Scroll to bottom
   */
  toBottom(behavior = 'smooth') {
    const docHeight = document.documentElement.scrollHeight
    window.scrollTo({ top: docHeight, behavior })
  },

  /**
   * Lock scroll
   */
  lock() {
    document.body.style.overflow = 'hidden'
    document.body.style.paddingRight = this.getScrollbarWidth() + 'px'
  },

  /**
   * Unlock scroll
   */
  unlock() {
    document.body.style.overflow = ''
    document.body.style.paddingRight = ''
  },

  /**
   * Get scrollbar width
   */
  getScrollbarWidth() {
    const outer = document.createElement('div')
    outer.style.visibility = 'hidden'
    outer.style.overflow = 'scroll'
    outer.style.msOverflowStyle = 'scrollbar'
    document.body.appendChild(outer)

    const inner = document.createElement('div')
    outer.appendChild(inner)

    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth
    outer.parentNode.removeChild(outer)

    return scrollbarWidth
  }
}

/**
 * Element utilities
 */
export const element = {
  /**
   * Get element dimensions
   */
  getDimensions(el) {
    if (!el) return { width: 0, height: 0 }

    const rect = el.getBoundingClientRect()
    return {
      width: rect.width,
      height: rect.height,
      top: rect.top,
      left: rect.left,
      bottom: rect.bottom,
      right: rect.right
    }
  },

  /**
   * Check if element is in viewport
   */
  isInViewport(el, threshold = 0) {
    if (!el) return false

    const rect = el.getBoundingClientRect()
    const windowHeight = window.innerHeight
    const windowWidth = window.innerWidth

    return (
      rect.top >= -threshold &&
      rect.left >= -threshold &&
      rect.bottom <= windowHeight + threshold &&
      rect.right <= windowWidth + threshold
    )
  },

  /**
   * Check if element is partially in viewport
   */
  isPartiallyInViewport(el) {
    if (!el) return false

    const rect = el.getBoundingClientRect()
    const windowHeight = window.innerHeight
    const windowWidth = window.innerWidth

    return (
      rect.bottom > 0 &&
      rect.right > 0 &&
      rect.top < windowHeight &&
      rect.left < windowWidth
    )
  },

  /**
   * Get element offset from document top
   */
  getOffsetTop(el) {
    if (!el) return 0

    let offsetTop = 0
    while (el) {
      offsetTop += el.offsetTop
      el = el.offsetParent
    }
    return offsetTop
  },

  /**
   * Get element center position
   */
  getCenter(el) {
    if (!el) return { x: 0, y: 0 }

    const rect = el.getBoundingClientRect()
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    }
  }
}

/**
 * Layout measurement utilities
 */
export const layout = {
  /**
   * Measure text dimensions
   */
  measureText(text, font = '16px Arial') {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    context.font = font
    const metrics = context.measureText(text)

    return {
      width: metrics.width,
      height: metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
    }
  },

  /**
   * Calculate optimal grid columns
   */
  calculateGridColumns(containerWidth, itemMinWidth, gap = 16) {
    const availableWidth = containerWidth - gap
    const itemWidthWithGap = itemMinWidth + gap
    const columns = Math.floor(availableWidth / itemWidthWithGap)
    return Math.max(1, columns)
  },

  /**
   * Calculate aspect ratio
   */
  calculateAspectRatio(width, height) {
    const gcd = (a, b) => b === 0 ? a : gcd(b, a % b)
    const divisor = gcd(width, height)
    return {
      ratio: width / height,
      width: width / divisor,
      height: height / divisor,
      string: `${width / divisor}:${height / divisor}`
    }
  },

  /**
   * Get container queries support
   */
  supportsContainerQueries() {
    return CSS.supports('container-type: inline-size')
  },

  /**
   * Get CSS custom property value
   */
  getCSSCustomProperty(property, element = document.documentElement) {
    return getComputedStyle(element).getPropertyValue(property).trim()
  },

  /**
   * Set CSS custom property
   */
  setCSSCustomProperty(property, value, element = document.documentElement) {
    element.style.setProperty(property, value)
  }
}

/**
 * Performance utilities
 */
export const performance = {
  /**
   * Debounce function
   */
  debounce(func, wait, immediate = false) {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        timeout = null
        if (!immediate) func(...args)
      }
      const callNow = immediate && !timeout
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
      if (callNow) func(...args)
    }
  },

  /**
   * Throttle function
   */
  throttle(func, limit) {
    let inThrottle
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  },

  /**
   * Request animation frame with fallback
   */
  raf(callback) {
    return (window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      function (callback) { setTimeout(callback, 16) })(callback)
  },

  /**
   * Cancel animation frame with fallback
   */
  cancelRaf(id) {
    return (window.cancelAnimationFrame ||
      window.webkitCancelAnimationFrame ||
      window.mozCancelAnimationFrame ||
      clearTimeout)(id)
  }
}

/**
 * Project layout utilities
 */
export const projects = {
  /**
   * Calculate optimal project grid spacing based on project count
   */
  calculateGridSpacing(projectCount, viewportWidth) {
    if (projectCount <= 3) return 80 // 20rem
    if (projectCount <= 6) return 64 // 16rem
    if (viewportWidth < 768) return 48 // 12rem on mobile
    return 56 // 14rem default
  },

  /**
   * Determine animation stagger delay based on project count
   */
  getAnimationStagger(projectCount) {
    if (projectCount <= 3) return 0.3
    if (projectCount <= 6) return 0.2
    if (projectCount <= 10) return 0.15
    return 0.1
  },

  /**
   * Calculate project card aspect ratio based on content
   */
  calculateCardAspectRatio(hasImage, contentLength) {
    if (!hasImage) return 'auto'
    if (contentLength > 500) return '3/4' // Taller for more content
    return '4/3' // Standard aspect ratio
  },

  /**
   * Determine if alternating layout should be used
   */
  shouldUseAlternatingLayout(projectCount, viewportWidth) {
    // Don't use alternating layout on mobile or with few projects
    if (viewportWidth < 1024 || projectCount < 2) return false
    return true
  },

  /**
   * Calculate image loading priority based on position
   */
  getImageLoadingPriority(index, isAboveFold = false) {
    if (isAboveFold && index === 0) return 'high'
    if (index < 2) return 'auto'
    return 'low'
  },

  /**
   * Get responsive image sizes for project thumbnails
   */
  getResponsiveImageSizes() {
    return '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw'
  },

  /**
   * Calculate performance optimizations based on project count
   */
  getPerformanceConfig(projectCount) {
    return {
      useVirtualization: projectCount > 20,
      lazyLoadThreshold: projectCount > 6 ? '100px' : '200px',
      preloadCount: Math.min(3, Math.ceil(projectCount / 3)),
      enableImageOptimization: projectCount > 4
    }
  },

  /**
   * Determine grid layout based on screen size and project count
   */
  getGridLayout(viewportWidth, projectCount) {
    if (viewportWidth < 768) {
      return { columns: 1, gap: 16 }
    }
    
    if (viewportWidth < 1024) {
      return { columns: 1, gap: 24 }
    }
    
    // Desktop: use 2-column alternating layout
    return { columns: 2, gap: 48, alternating: true }
  },

  /**
   * Calculate container max width based on content
   */
  getContainerMaxWidth(projectCount, hasLongContent = false) {
    if (projectCount === 1) return '4xl' // Single project gets more space
    if (hasLongContent) return '6xl' // More space for detailed content
    return '7xl' // Standard container width
  }
}

/**
 * Accessibility utilities
 */
export const a11y = {
  /**
   * Check if user prefers reduced motion
   */
  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  },

  /**
   * Check if user prefers high contrast
   */
  prefersHighContrast() {
    return window.matchMedia('(prefers-contrast: high)').matches
  },

  /**
   * Check if user prefers dark mode
   */
  prefersDarkMode() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  },

  /**
   * Announce to screen readers
   */
  announce(message, priority = 'polite') {
    const announcer = document.createElement('div')
    announcer.setAttribute('aria-live', priority)
    announcer.setAttribute('aria-atomic', 'true')
    announcer.className = 'sr-only'
    announcer.textContent = message

    document.body.appendChild(announcer)

    setTimeout(() => {
      document.body.removeChild(announcer)
    }, 1000)
  },

  /**
   * Trap focus within element
   */
  trapFocus(element) {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

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