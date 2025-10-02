import { useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Performance optimizations
gsap.config({
  force3D: true,
  nullTargetWarn: false
})

export const useGSAPAnimations = () => {
  const timelineRef = useRef(null)
  const animationsRef = useRef([])

  const cleanupAnimations = useCallback(() => {
    // Kill all scroll triggers
    ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    
    // Kill timeline
    if (timelineRef.current) {
      timelineRef.current.kill()
    }
    
    // Clear animations array
    animationsRef.current.forEach(animation => {
      if (animation && animation.kill) {
        animation.kill()
      }
    })
    animationsRef.current = []
  }, [])

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    
    if (prefersReducedMotion) {
      return cleanupAnimations
    }

    // Create master timeline with performance optimizations
    timelineRef.current = gsap.timeline({
      defaults: {
        ease: 'power2.out',
        force3D: true
      }
    })

    // Optimized section transitions with intersection observer fallback
    const sections = gsap.utils.toArray('.section-animate')
    sections.forEach((section, index) => {
      if (!section) return
      
      const animation = gsap.fromTo(section, 
        { 
          opacity: 0, 
          y: 30,
          scale: 0.98
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.4,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
            once: true, // Only animate once for better performance
            fastScrollEnd: true,
            preventOverlaps: true
          }
        }
      )
      
      animationsRef.current.push(animation)
    })

    // Optimized stagger animations with reduced complexity
    const containers = gsap.utils.toArray('.card-animate')
    containers.forEach(container => {
      if (!container) return
      
      const cards = container.querySelectorAll('.card-item')
      if (cards.length === 0) return
      
      const animation = gsap.fromTo(cards,
        { 
          opacity: 0, 
          y: 15,
          scale: 0.95
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.3,
          stagger: 0.03, // Reduced stagger for better performance
          ease: 'power2.out',
          scrollTrigger: {
            trigger: container,
            start: 'top 90%',
            once: true,
            fastScrollEnd: true
          }
        }
      )
      
      animationsRef.current.push(animation)
    })

    return cleanupAnimations
  }, [cleanupAnimations])

  return timelineRef.current
}

export const createSectionTransition = (element, direction = 'up') => {
  const directions = {
    up: { y: 100 },
    down: { y: -100 },
    left: { x: -100 },
    right: { x: 100 }
  }

  return gsap.fromTo(element,
    { opacity: 0, ...directions[direction] },
    {
      opacity: 1,
      x: 0,
      y: 0,
      duration: 1,
      ease: 'power3.out'
    }
  )
}