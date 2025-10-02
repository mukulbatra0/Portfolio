import React, { useState, useCallback, useRef, useEffect } from 'react'
import { createIntersectionObserver } from '../../utils/performance'

const OptimizedImage = React.memo(({
  src,
  alt,
  className = '',
  fallbackSrc = null,
  placeholder = null,
  lazy = true,
  priority = false,
  onLoad = null,
  onError = null,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(lazy && !priority ? null : src)
  const imgRef = useRef(null)
  const observerRef = useRef(null)

  // Handle image load
  const handleLoad = useCallback(() => {
    setIsLoaded(true)
    onLoad?.()
  }, [onLoad])

  // Handle image error with fallback
  const handleError = useCallback(() => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc)
    } else {
      setIsError(true)
      onError?.()
    }
  }, [fallbackSrc, currentSrc, onError])

  // Lazy loading with Intersection Observer
  useEffect(() => {
    if (!lazy || priority || currentSrc) return

    const img = imgRef.current
    if (!img) return

    observerRef.current = createIntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCurrentSrc(src)
            observerRef.current?.unobserve(img)
          }
        })
      },
      { rootMargin: '50px' }
    )

    observerRef.current.observe(img)

    return () => {
      observerRef.current?.disconnect()
    }
  }, [src, lazy, priority, currentSrc])

  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      observerRef.current?.disconnect()
    }
  }, [])

  if (isError && !fallbackSrc) {
    return (
      <div 
        className={`flex items-center justify-center bg-slate-800 text-slate-400 ${className}`}
        {...props}
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Placeholder */}
      {!isLoaded && placeholder && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          {placeholder}
        </div>
      )}
      
      {/* Loading skeleton */}
      {!isLoaded && !placeholder && (
        <div className="absolute inset-0 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 animate-pulse" />
      )}

      {/* Actual image */}
      {currentSrc && (
        <img
          ref={imgRef}
          src={currentSrc}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          {...props}
        />
      )}
    </div>
  )
})

OptimizedImage.displayName = 'OptimizedImage'

export default OptimizedImage