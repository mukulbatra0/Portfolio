// Performance optimization utilities

/**
 * Debounce function to limit function calls
 */
export const debounce = (func, wait, immediate = false) => {
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
}

/**
 * Throttle function to limit function calls
 */
export const throttle = (func, limit) => {
  let inThrottle
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

/**
 * Intersection Observer for lazy loading
 */
export const createIntersectionObserver = (callback, options = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1
  }
  
  return new IntersectionObserver(callback, { ...defaultOptions, ...options })
}

/**
 * Preload critical images
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
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * RAF-based smooth scroll
 */
export const smoothScrollTo = (element, duration = 800) => {
  const start = window.pageYOffset
  const target = element.offsetTop - 80 // Account for navbar
  const distance = target - start
  let startTime = null

  const animation = (currentTime) => {
    if (startTime === null) startTime = currentTime
    const timeElapsed = currentTime - startTime
    const progress = Math.min(timeElapsed / duration, 1)
    
    // Easing function
    const ease = progress < 0.5 
      ? 2 * progress * progress 
      : 1 - Math.pow(-2 * progress + 2, 3) / 2

    window.scrollTo(0, start + distance * ease)

    if (timeElapsed < duration) {
      requestAnimationFrame(animation)
    }
  }

  requestAnimationFrame(animation)
}

/**
 * Memory-efficient event listener management
 */
export class EventManager {
  constructor() {
    this.listeners = new Map()
  }

  add(element, event, handler, options = {}) {
    const key = `${element}-${event}`
    if (this.listeners.has(key)) {
      this.remove(element, event)
    }
    
    element.addEventListener(event, handler, options)
    this.listeners.set(key, { element, event, handler, options })
  }

  remove(element, event) {
    const key = `${element}-${event}`
    const listener = this.listeners.get(key)
    
    if (listener) {
      listener.element.removeEventListener(listener.event, listener.handler, listener.options)
      this.listeners.delete(key)
    }
  }

  removeAll() {
    this.listeners.forEach(({ element, event, handler, options }) => {
      element.removeEventListener(event, handler, options)
    })
    this.listeners.clear()
  }
}

/**
 * Virtual scrolling for large lists
 */
export class VirtualScroller {
  constructor(container, itemHeight, renderItem) {
    this.container = container
    this.itemHeight = itemHeight
    this.renderItem = renderItem
    this.scrollTop = 0
    this.containerHeight = container.clientHeight
    this.visibleStart = 0
    this.visibleEnd = 0
    
    this.init()
  }

  init() {
    this.container.addEventListener('scroll', throttle(() => {
      this.scrollTop = this.container.scrollTop
      this.updateVisibleRange()
    }, 16))
  }

  updateVisibleRange() {
    this.visibleStart = Math.floor(this.scrollTop / this.itemHeight)
    this.visibleEnd = Math.min(
      this.visibleStart + Math.ceil(this.containerHeight / this.itemHeight) + 1,
      this.items.length
    )
  }

  render(items) {
    this.items = items
    this.updateVisibleRange()
    
    const visibleItems = items.slice(this.visibleStart, this.visibleEnd)
    const offsetY = this.visibleStart * this.itemHeight
    
    return {
      items: visibleItems,
      offsetY,
      totalHeight: items.length * this.itemHeight
    }
  }
}

/**
 * Image lazy loading with intersection observer
 */
export const setupLazyLoading = (selector = '[data-lazy]') => {
  const images = document.querySelectorAll(selector)
  
  const imageObserver = createIntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target
        const src = img.dataset.lazy
        
        if (src) {
          img.src = src
          img.classList.remove('lazy')
          img.classList.add('loaded')
          imageObserver.unobserve(img)
        }
      }
    })
  })

  images.forEach(img => imageObserver.observe(img))
  
  return imageObserver
}

/**
 * Performance monitoring
 */
export const performanceMonitor = {
  marks: new Map(),
  
  mark(name) {
    this.marks.set(name, performance.now())
  },
  
  measure(name, startMark) {
    const start = this.marks.get(startMark)
    const end = performance.now()
    const duration = end - start
    
    console.log(`${name}: ${duration.toFixed(2)}ms`)
    return duration
  },
  
  measureRender(component, fn) {
    const start = performance.now()
    const result = fn()
    const end = performance.now()
    
    if (end - start > 16) { // Longer than one frame
      console.warn(`Slow render in ${component}: ${(end - start).toFixed(2)}ms`)
    }
    
    return result
  }
}

/**
 * Bundle size analyzer (development only)
 */
export const analyzeBundleSize = () => {
  if (process.env.NODE_ENV !== 'development') return

  const scripts = Array.from(document.querySelectorAll('script[src]'))
  const totalSize = scripts.reduce((total, script) => {
    return total + (script.src.length * 2) // Rough estimate
  }, 0)

  console.log(`Estimated bundle size: ${(totalSize / 1024).toFixed(2)}KB`)
}

/**
 * Memory usage monitoring
 */
export const monitorMemory = () => {
  if (!performance.memory) return null

  return {
    used: Math.round(performance.memory.usedJSHeapSize / 1048576),
    total: Math.round(performance.memory.totalJSHeapSize / 1048576),
    limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576)
  }
}