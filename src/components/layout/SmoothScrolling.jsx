import React, { useEffect, useRef } from 'react'
import { usePreferences } from '../../contexts/LayoutContext'

/**
 * Smooth Scrolling Component
 * Provides enhanced smooth scrolling with easing and performance optimization
 */
const SmoothScrolling = ({ 
  children, 
  enabled = true, 
  smoothness = 0.1, 
  threshold = 0.1 
}) => {
  const containerRef = useRef(null)
  const contentRef = useRef(null)
  const scrollRef = useRef({ current: 0, target: 0, ease: smoothness })
  const rafRef = useRef(null)
  const { reducedMotion } = usePreferences()

  useEffect(() => {
    if (!enabled || reducedMotion) return

    const container = containerRef.current
    const content = contentRef.current
    if (!container || !content) return

    // Set up container styles
    container.style.position = 'fixed'
    container.style.top = '0'
    container.style.left = '0'
    container.style.width = '100%'
    container.style.height = '100%'
    container.style.overflow = 'hidden'

    // Set up content styles
    content.style.willChange = 'transform'

    // Update scroll values
    const updateScroll = () => {
      const { current, target, ease } = scrollRef.current
      
      // Smooth interpolation
      scrollRef.current.current += (target - current) * ease
      
      // Apply transform
      content.style.transform = `translateY(${-scrollRef.current.current}px)`
      
      // Continue animation if not close enough to target
      if (Math.abs(target - scrollRef.current.current) > threshold) {
        rafRef.current = requestAnimationFrame(updateScroll)
      }
    }

    // Handle wheel events
    const handleWheel = (e) => {
      e.preventDefault()
      
      const delta = e.deltaY
      const maxScroll = content.offsetHeight - window.innerHeight
      
      scrollRef.current.target = Math.max(
        0, 
        Math.min(maxScroll, scrollRef.current.target + delta)
      )
      
      // Start animation if not already running
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(updateScroll)
      }
    }

    // Handle touch events for mobile
    let touchStartY = 0
    let touchStartTime = 0

    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY
      touchStartTime = Date.now()
    }

    const handleTouchMove = (e) => {
      e.preventDefault()
      
      const touchY = e.touches[0].clientY
      const deltaY = touchStartY - touchY
      const maxScroll = content.offsetHeight - window.innerHeight
      
      scrollRef.current.target = Math.max(
        0, 
        Math.min(maxScroll, scrollRef.current.target + deltaY * 2)
      )
      
      touchStartY = touchY
      
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(updateScroll)
      }
    }

    const handleTouchEnd = () => {
      // Add momentum scrolling
      const touchEndTime = Date.now()
      const touchDuration = touchEndTime - touchStartTime
      
      if (touchDuration < 300) {
        // Add some momentum based on touch speed
        const momentum = (touchStartY - event.changedTouches[0].clientY) * 3
        const maxScroll = content.offsetHeight - window.innerHeight
        
        scrollRef.current.target = Math.max(
          0, 
          Math.min(maxScroll, scrollRef.current.target + momentum)
        )
        
        if (!rafRef.current) {
          rafRef.current = requestAnimationFrame(updateScroll)
        }
      }
    }

    // Handle keyboard navigation
    const handleKeyDown = (e) => {
      const maxScroll = content.offsetHeight - window.innerHeight
      let delta = 0

      switch (e.key) {
        case 'ArrowUp':
          delta = -100
          break
        case 'ArrowDown':
          delta = 100
          break
        case 'PageUp':
          delta = -window.innerHeight * 0.8
          break
        case 'PageDown':
          delta = window.innerHeight * 0.8
          break
        case 'Home':
          scrollRef.current.target = 0
          break
        case 'End':
          scrollRef.current.target = maxScroll
          break
        default:
          return
      }

      if (delta !== 0) {
        e.preventDefault()
        scrollRef.current.target = Math.max(
          0, 
          Math.min(maxScroll, scrollRef.current.target + delta)
        )
        
        if (!rafRef.current) {
          rafRef.current = requestAnimationFrame(updateScroll)
        }
      }
    }

    // Handle resize
    const handleResize = () => {
      const maxScroll = content.offsetHeight - window.innerHeight
      scrollRef.current.target = Math.min(scrollRef.current.target, maxScroll)
    }

    // Add event listeners
    container.addEventListener('wheel', handleWheel, { passive: false })
    container.addEventListener('touchstart', handleTouchStart, { passive: true })
    container.addEventListener('touchmove', handleTouchMove, { passive: false })
    container.addEventListener('touchend', handleTouchEnd, { passive: true })
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('resize', handleResize)

    // Set initial height for body to enable scrollbar
    document.body.style.height = `${content.offsetHeight}px`

    // Cleanup
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
      
      container.removeEventListener('wheel', handleWheel)
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('resize', handleResize)
      
      // Reset body height
      document.body.style.height = ''
    }
  }, [enabled, reducedMotion, smoothness, threshold])

  // If smooth scrolling is disabled, render normally
  if (!enabled || reducedMotion) {
    return <>{children}</>
  }

  return (
    <div ref={containerRef} className="smooth-scroll-container">
      <div ref={contentRef} className="smooth-scroll-content">
        {children}
      </div>
    </div>
  )
}

export default SmoothScrolling