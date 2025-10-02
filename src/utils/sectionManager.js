// Section management utilities

import React from 'react'
import { SECTIONS } from './constants'
import { smoothScrollTo } from './helpers'

/**
 * Section Manager Class
 * Handles section navigation, progress tracking, and state management
 */
export class SectionManager {
  constructor() {
    this.sections = Object.values(SECTIONS)
    this.currentSection = SECTIONS.HERO
    this.observers = new Map()
    this.callbacks = new Set()
    this.sectionElements = new Map()
    this.sectionProgress = new Map()
    
    this.init()
  }

  /**
   * Initialize section manager
   */
  init() {
    this.setupIntersectionObservers()
    this.setupScrollListener()
    this.cacheSectionElements()
  }

  /**
   * Cache section elements for performance
   */
  cacheSectionElements() {
    this.sections.forEach(sectionId => {
      const element = document.getElementById(sectionId)
      if (element) {
        this.sectionElements.set(sectionId, element)
      }
    })
  }

  /**
   * Setup intersection observers for each section
   */
  setupIntersectionObservers() {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -20% 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1]
    }

    this.sections.forEach(sectionId => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const progress = entry.intersectionRatio * 100
          this.sectionProgress.set(sectionId, progress)
          
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            this.setActiveSection(sectionId)
          }
        })
      }, observerOptions)

      const element = document.getElementById(sectionId)
      if (element) {
        observer.observe(element)
        this.observers.set(sectionId, observer)
      }
    })
  }

  /**
   * Setup scroll listener for additional tracking
   */
  setupScrollListener() {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.updateScrollProgress()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
  }

  /**
   * Update scroll progress for all sections
   */
  updateScrollProgress() {
    this.sections.forEach(sectionId => {
      const element = this.sectionElements.get(sectionId)
      if (element) {
        const rect = element.getBoundingClientRect()
        const windowHeight = window.innerHeight
        
        // Calculate visibility percentage
        const visibleHeight = Math.min(
          windowHeight,
          Math.max(0, windowHeight - Math.max(0, rect.top)),
          Math.max(0, rect.bottom)
        )
        
        const visibility = Math.min(100, Math.max(0, (visibleHeight / windowHeight) * 100))
        this.sectionProgress.set(sectionId, visibility)
      }
    })

    // Notify callbacks
    this.notifyCallbacks()
  }

  /**
   * Set active section
   */
  setActiveSection(sectionId) {
    if (this.currentSection !== sectionId) {
      const previousSection = this.currentSection
      this.currentSection = sectionId
      
      // Update URL hash without triggering scroll
      if (history.replaceState) {
        history.replaceState(null, null, `#${sectionId}`)
      }
      
      // Notify callbacks
      this.notifyCallbacks({
        type: 'sectionChange',
        current: sectionId,
        previous: previousSection
      })
    }
  }

  /**
   * Navigate to section
   */
  navigateToSection(sectionId, offset = 80) {
    if (this.sections.includes(sectionId)) {
      smoothScrollTo(sectionId, offset)
      this.setActiveSection(sectionId)
    }
  }

  /**
   * Get current section
   */
  getCurrentSection() {
    return this.currentSection
  }

  /**
   * Get section progress
   */
  getSectionProgress(sectionId) {
    return this.sectionProgress.get(sectionId) || 0
  }

  /**
   * Get all section progress
   */
  getAllSectionProgress() {
    const progress = {}
    this.sectionProgress.forEach((value, key) => {
      progress[key] = value
    })
    return progress
  }

  /**
   * Get next section
   */
  getNextSection() {
    const currentIndex = this.sections.indexOf(this.currentSection)
    return currentIndex < this.sections.length - 1 
      ? this.sections[currentIndex + 1] 
      : null
  }

  /**
   * Get previous section
   */
  getPreviousSection() {
    const currentIndex = this.sections.indexOf(this.currentSection)
    return currentIndex > 0 
      ? this.sections[currentIndex - 1] 
      : null
  }

  /**
   * Navigate to next section
   */
  navigateToNext() {
    const nextSection = this.getNextSection()
    if (nextSection) {
      this.navigateToSection(nextSection)
    }
  }

  /**
   * Navigate to previous section
   */
  navigateToPrevious() {
    const previousSection = this.getPreviousSection()
    if (previousSection) {
      this.navigateToSection(previousSection)
    }
  }

  /**
   * Subscribe to section changes
   */
  subscribe(callback) {
    this.callbacks.add(callback)
    return () => this.callbacks.delete(callback)
  }

  /**
   * Notify all callbacks
   */
  notifyCallbacks(data = {}) {
    const eventData = {
      currentSection: this.currentSection,
      sectionProgress: this.getAllSectionProgress(),
      ...data
    }

    this.callbacks.forEach(callback => {
      try {
        callback(eventData)
      } catch (error) {
        console.error('Error in section manager callback:', error)
      }
    })
  }

  /**
   * Cleanup observers
   */
  destroy() {
    this.observers.forEach(observer => observer.disconnect())
    this.observers.clear()
    this.callbacks.clear()
    this.sectionElements.clear()
    this.sectionProgress.clear()
  }
}

// Create singleton instance
export const sectionManager = new SectionManager()

// React hook for using section manager
export const useSectionManager = () => {
  const [state, setState] = React.useState({
    currentSection: sectionManager.getCurrentSection(),
    sectionProgress: sectionManager.getAllSectionProgress()
  })

  React.useEffect(() => {
    const unsubscribe = sectionManager.subscribe((data) => {
      setState({
        currentSection: data.currentSection,
        sectionProgress: data.sectionProgress
      })
    })

    return unsubscribe
  }, [])

  return {
    ...state,
    navigateToSection: sectionManager.navigateToSection.bind(sectionManager),
    navigateToNext: sectionManager.navigateToNext.bind(sectionManager),
    navigateToPrevious: sectionManager.navigateToPrevious.bind(sectionManager),
    getNextSection: sectionManager.getNextSection.bind(sectionManager),
    getPreviousSection: sectionManager.getPreviousSection.bind(sectionManager)
  }
}