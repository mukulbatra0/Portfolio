import { useState, useEffect } from 'react'
import { throttle } from '../utils/helpers'

/**
 * Custom hook for scroll-based animations and effects
 */
export const useScrollAnimation = () => {
  const [scrollY, setScrollY] = useState(0)
  const [scrollDirection, setScrollDirection] = useState('up')
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    let lastScrollY = window.scrollY

    const updateScrollInfo = throttle(() => {
      const currentScrollY = window.scrollY
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight
      
      setScrollY(currentScrollY)
      setScrollDirection(currentScrollY > lastScrollY ? 'down' : 'up')
      setScrollProgress(Math.min(100, (currentScrollY / documentHeight) * 100))
      
      lastScrollY = currentScrollY
    }, 16) // ~60fps

    window.addEventListener('scroll', updateScrollInfo, { passive: true })
    updateScrollInfo() // Initial call

    return () => window.removeEventListener('scroll', updateScrollInfo)
  }, [])

  return {
    scrollY,
    scrollDirection,
    scrollProgress
  }
}

/**
 * Custom hook for detecting active section based on scroll position
 */
export const useActiveSection = (sections, offset = 100) => {
  const [activeSection, setActiveSection] = useState(sections[0]?.id || '')

  useEffect(() => {
    const handleScroll = throttle(() => {
      const scrollPosition = window.scrollY + offset

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        const element = document.getElementById(section.id)
        
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(section.id)
          break
        }
      }
    }, 16)

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial call

    return () => window.removeEventListener('scroll', handleScroll)
  }, [sections, offset])

  return activeSection
}

/**
 * Custom hook for navbar scroll state (simplified)
 */
export const useNavbarVisibility = (threshold = 50) => {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > threshold)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial call

    return () => window.removeEventListener('scroll', handleScroll)
  }, [threshold])

  return { isScrolled }
}