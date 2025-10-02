import { useEffect, useRef, useState, useCallback } from 'react'
import { createIntersectionObserver } from '../utils/performance'

/**
 * Optimized intersection observer hook with performance improvements
 * @param {Object} options - Intersection observer options
 * @returns {Object} - Ref and intersection state
 */
export const useOptimizedIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasIntersected, setHasIntersected] = useState(false)
  const elementRef = useRef(null)
  const observerRef = useRef(null)

  const defaultOptions = {
    threshold: 0.1,
    rootMargin: '50px',
    triggerOnce: false,
    ...options
  }

  const handleIntersection = useCallback((entries) => {
    entries.forEach((entry) => {
      const isCurrentlyIntersecting = entry.isIntersecting
      setIsIntersecting(isCurrentlyIntersecting)
      
      if (isCurrentlyIntersecting && !hasIntersected) {
        setHasIntersected(true)
        
        // If triggerOnce is true, disconnect after first intersection
        if (defaultOptions.triggerOnce && observerRef.current) {
          observerRef.current.unobserve(entry.target)
        }
      }
    })
  }, [hasIntersected, defaultOptions.triggerOnce])

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    observerRef.current = createIntersectionObserver(handleIntersection, {
      threshold: defaultOptions.threshold,
      rootMargin: defaultOptions.rootMargin
    })

    observerRef.current.observe(element)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [handleIntersection, defaultOptions.threshold, defaultOptions.rootMargin])

  return {
    elementRef,
    isIntersecting,
    hasIntersected
  }
}

/**
 * Batch intersection observer for multiple elements
 * @param {Array} elements - Array of elements to observe
 * @param {Object} options - Intersection observer options
 * @returns {Map} - Map of element states
 */
export const useBatchIntersectionObserver = (elements = [], options = {}) => {
  const [intersectionStates, setIntersectionStates] = useState(new Map())
  const observerRef = useRef(null)

  const handleIntersection = useCallback((entries) => {
    setIntersectionStates(prevStates => {
      const newStates = new Map(prevStates)
      
      entries.forEach((entry) => {
        const element = entry.target
        newStates.set(element, {
          isIntersecting: entry.isIntersecting,
          intersectionRatio: entry.intersectionRatio,
          boundingClientRect: entry.boundingClientRect
        })
      })
      
      return newStates
    })
  }, [])

  useEffect(() => {
    if (elements.length === 0) return

    observerRef.current = createIntersectionObserver(handleIntersection, options)

    elements.forEach(element => {
      if (element) {
        observerRef.current.observe(element)
      }
    })

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [elements, handleIntersection, options])

  return intersectionStates
}

/**
 * Lazy loading intersection observer
 * @param {Object} options - Options for lazy loading
 * @returns {Object} - Ref and loading state
 */
export const useLazyIntersectionObserver = (options = {}) => {
  const [shouldLoad, setShouldLoad] = useState(false)
  const elementRef = useRef(null)
  const observerRef = useRef(null)

  const defaultOptions = {
    rootMargin: '100px',
    threshold: 0,
    ...options
  }

  useEffect(() => {
    const element = elementRef.current
    if (!element || shouldLoad) return

    observerRef.current = createIntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true)
            observerRef.current?.unobserve(entry.target)
          }
        })
      },
      defaultOptions
    )

    observerRef.current.observe(element)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [shouldLoad, defaultOptions])

  return {
    elementRef,
    shouldLoad
  }
}

export default useOptimizedIntersectionObserver