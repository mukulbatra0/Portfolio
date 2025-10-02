// Accessibility utilities and helpers

/**
 * Focus management utilities
 */
export class FocusManager {
  constructor() {
    this.focusStack = []
    this.trapStack = []
  }

  /**
   * Save current focus and set new focus
   */
  saveFocus(newFocusElement = null) {
    const currentFocus = document.activeElement
    this.focusStack.push(currentFocus)
    
    if (newFocusElement) {
      this.setFocus(newFocusElement)
    }
  }

  /**
   * Restore previous focus
   */
  restoreFocus() {
    const previousFocus = this.focusStack.pop()
    if (previousFocus && previousFocus !== document.body) {
      this.setFocus(previousFocus)
    }
  }

  /**
   * Set focus with error handling
   */
  setFocus(element) {
    if (!element) return

    try {
      // Ensure element is focusable
      if (!this.isFocusable(element)) {
        element.setAttribute('tabindex', '-1')
      }
      
      element.focus()
      
      // Scroll into view if needed
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest'
      })
    } catch (error) {
      console.warn('Failed to set focus:', error)
    }
  }

  /**
   * Check if element is focusable
   */
  isFocusable(element) {
    if (!element || element.disabled) return false

    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ]

    return focusableSelectors.some(selector => element.matches(selector)) ||
           element.getAttribute('tabindex') === '0'
  }

  /**
   * Get all focusable elements within a container
   */
  getFocusableElements(container = document) {
    const focusableSelectors = [
      'a[href]:not([disabled])',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"]):not([disabled])',
      '[contenteditable="true"]:not([disabled])'
    ].join(', ')

    return Array.from(container.querySelectorAll(focusableSelectors))
      .filter(element => {
        return element.offsetWidth > 0 && 
               element.offsetHeight > 0 && 
               !element.hidden &&
               window.getComputedStyle(element).visibility !== 'hidden'
      })
  }

  /**
   * Trap focus within a container
   */
  trapFocus(container) {
    const focusableElements = this.getFocusableElements(container)
    if (focusableElements.length === 0) return

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleKeyDown = (event) => {
      if (event.key !== 'Tab') return

      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault()
          lastElement.focus()
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault()
          firstElement.focus()
        }
      }
    }

    container.addEventListener('keydown', handleKeyDown)
    this.trapStack.push({ container, handler: handleKeyDown })

    // Set initial focus
    firstElement.focus()

    return () => this.releaseFocusTrap(container)
  }

  /**
   * Release focus trap
   */
  releaseFocusTrap(container) {
    const trapIndex = this.trapStack.findIndex(trap => trap.container === container)
    if (trapIndex >= 0) {
      const trap = this.trapStack[trapIndex]
      container.removeEventListener('keydown', trap.handler)
      this.trapStack.splice(trapIndex, 1)
    }
  }

  /**
   * Release all focus traps
   */
  releaseAllFocusTraps() {
    this.trapStack.forEach(trap => {
      trap.container.removeEventListener('keydown', trap.handler)
    })
    this.trapStack = []
  }
}

/**
 * Screen reader utilities
 */
export class ScreenReaderUtils {
  constructor() {
    this.announcements = []
    this.createLiveRegions()
  }

  /**
   * Create ARIA live regions for announcements
   */
  createLiveRegions() {
    // Polite announcements
    this.politeRegion = document.createElement('div')
    this.politeRegion.setAttribute('aria-live', 'polite')
    this.politeRegion.setAttribute('aria-atomic', 'true')
    this.politeRegion.className = 'sr-only'
    this.politeRegion.id = 'polite-announcements'
    document.body.appendChild(this.politeRegion)

    // Assertive announcements
    this.assertiveRegion = document.createElement('div')
    this.assertiveRegion.setAttribute('aria-live', 'assertive')
    this.assertiveRegion.setAttribute('aria-atomic', 'true')
    this.assertiveRegion.className = 'sr-only'
    this.assertiveRegion.id = 'assertive-announcements'
    document.body.appendChild(this.assertiveRegion)
  }

  /**
   * Announce message to screen readers
   */
  announce(message, priority = 'polite') {
    if (!message) return

    const region = priority === 'assertive' ? this.assertiveRegion : this.politeRegion
    
    // Clear previous announcement
    region.textContent = ''
    
    // Add new announcement after a brief delay
    setTimeout(() => {
      region.textContent = message
      this.announcements.push({ message, priority, timestamp: Date.now() })
    }, 100)

    // Clear announcement after it's been read
    setTimeout(() => {
      if (region.textContent === message) {
        region.textContent = ''
      }
    }, 5000)
  }

  /**
   * Announce navigation changes
   */
  announceNavigation(sectionName) {
    this.announce(`Navigated to ${sectionName} section`, 'polite')
  }

  /**
   * Announce loading states
   */
  announceLoading(isLoading, context = '') {
    const message = isLoading 
      ? `Loading ${context}...`.trim()
      : `${context} loaded`.trim()
    
    this.announce(message, 'polite')
  }

  /**
   * Announce errors
   */
  announceError(error) {
    this.announce(`Error: ${error}`, 'assertive')
  }

  /**
   * Announce success messages
   */
  announceSuccess(message) {
    this.announce(`Success: ${message}`, 'polite')
  }
}

/**
 * Keyboard navigation utilities
 */
export class KeyboardNavigation {
  constructor() {
    this.shortcuts = new Map()
    this.setupGlobalKeyboardHandlers()
  }

  /**
   * Register keyboard shortcut
   */
  registerShortcut(key, callback, options = {}) {
    const { ctrlKey = false, altKey = false, shiftKey = false, description = '' } = options
    
    const shortcutKey = `${ctrlKey ? 'ctrl+' : ''}${altKey ? 'alt+' : ''}${shiftKey ? 'shift+' : ''}${key.toLowerCase()}`
    
    this.shortcuts.set(shortcutKey, {
      callback,
      description,
      ctrlKey,
      altKey,
      shiftKey,
      key: key.toLowerCase()
    })
  }

  /**
   * Setup global keyboard event handlers
   */
  setupGlobalKeyboardHandlers() {
    document.addEventListener('keydown', (event) => {
      // Check if user is typing in a form element
      const activeElement = document.activeElement
      const isTypingInForm = activeElement && (
        activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.tagName === 'SELECT' ||
        activeElement.isContentEditable ||
        activeElement.closest('[contenteditable="true"]')
      )
      
      // Don't trigger shortcuts when typing in form fields
      if (isTypingInForm) {
        // Only handle escape key when in form fields
        if (event.key && event.key.toLowerCase() === 'escape') {
          this.handleEscape(event)
        }
        return
      }
      
      // Ensure event.key exists before processing
      if (!event.key) {
        return
      }
      
      const key = event.key.toLowerCase()
      const shortcutKey = `${event.ctrlKey ? 'ctrl+' : ''}${event.altKey ? 'alt+' : ''}${event.shiftKey ? 'shift+' : ''}${key}`
      
      const shortcut = this.shortcuts.get(shortcutKey)
      if (shortcut) {
        event.preventDefault()
        shortcut.callback(event)
      }

      // Handle escape key globally
      if (key === 'escape') {
        this.handleEscape(event)
      }
    })
  }

  /**
   * Handle escape key press
   */
  handleEscape(event) {
    // Close modals, dropdowns, etc.
    const openModals = document.querySelectorAll('[role="dialog"][aria-hidden="false"]')
    openModals.forEach(modal => {
      const closeButton = modal.querySelector('[aria-label*="close"], [aria-label*="Close"]')
      if (closeButton) {
        closeButton.click()
      }
    })

    // Clear focus traps
    const focusManager = new FocusManager()
    focusManager.releaseAllFocusTraps()
  }

  /**
   * Get all registered shortcuts
   */
  getShortcuts() {
    return Array.from(this.shortcuts.entries()).map(([key, shortcut]) => ({
      key,
      description: shortcut.description
    }))
  }
}

/**
 * Color contrast utilities
 */
export class ColorContrastUtils {
  /**
   * Calculate relative luminance
   */
  static getRelativeLuminance(color) {
    const rgb = this.hexToRgb(color)
    if (!rgb) return 0

    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
      c = c / 255
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })

    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }

  /**
   * Calculate contrast ratio between two colors
   */
  static getContrastRatio(color1, color2) {
    const l1 = this.getRelativeLuminance(color1)
    const l2 = this.getRelativeLuminance(color2)
    
    const lighter = Math.max(l1, l2)
    const darker = Math.min(l1, l2)
    
    return (lighter + 0.05) / (darker + 0.05)
  }

  /**
   * Check if contrast ratio meets WCAG standards
   */
  static meetsWCAG(color1, color2, level = 'AA', size = 'normal') {
    const ratio = this.getContrastRatio(color1, color2)
    
    const requirements = {
      'AA': { normal: 4.5, large: 3 },
      'AAA': { normal: 7, large: 4.5 }
    }
    
    return ratio >= requirements[level][size]
  }

  /**
   * Convert hex to RGB
   */
  static hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }
}

/**
 * ARIA utilities
 */
export class ARIAUtils {
  /**
   * Set ARIA attributes safely
   */
  static setARIA(element, attributes) {
    if (!element) return

    Object.entries(attributes).forEach(([key, value]) => {
      const ariaKey = key.startsWith('aria-') ? key : `aria-${key}`
      
      if (value === null || value === undefined) {
        element.removeAttribute(ariaKey)
      } else {
        element.setAttribute(ariaKey, String(value))
      }
    })
  }

  /**
   * Create accessible button
   */
  static createAccessibleButton(text, onClick, options = {}) {
    const button = document.createElement('button')
    button.textContent = text
    button.addEventListener('click', onClick)
    
    const {
      ariaLabel,
      ariaDescribedBy,
      disabled = false,
      className = ''
    } = options

    if (ariaLabel) button.setAttribute('aria-label', ariaLabel)
    if (ariaDescribedBy) button.setAttribute('aria-describedby', ariaDescribedBy)
    if (disabled) button.disabled = true
    if (className) button.className = className

    return button
  }

  /**
   * Create accessible link
   */
  static createAccessibleLink(text, href, options = {}) {
    const link = document.createElement('a')
    link.textContent = text
    link.href = href
    
    const {
      ariaLabel,
      target,
      rel = target === '_blank' ? 'noopener noreferrer' : undefined,
      className = ''
    } = options

    if (ariaLabel) link.setAttribute('aria-label', ariaLabel)
    if (target) link.target = target
    if (rel) link.rel = rel
    if (className) link.className = className

    return link
  }

  /**
   * Generate unique ID for ARIA relationships
   */
  static generateId(prefix = 'aria') {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
}

// Create global instances
export const focusManager = new FocusManager()
export const screenReader = new ScreenReaderUtils()
export const keyboardNav = new KeyboardNavigation()

// Initialize accessibility features
export const initializeAccessibility = () => {
  // Register common keyboard shortcuts
  keyboardNav.registerShortcut('h', () => {
    const heroSection = document.getElementById('hero')
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: 'smooth' })
      focusManager.setFocus(heroSection)
      screenReader.announceNavigation('Hero')
    }
  }, { description: 'Go to Hero section' })

  keyboardNav.registerShortcut('a', () => {
    const aboutSection = document.getElementById('about')
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' })
      focusManager.setFocus(aboutSection)
      screenReader.announceNavigation('About')
    }
  }, { description: 'Go to About section' })

  keyboardNav.registerShortcut('s', () => {
    const skillsSection = document.getElementById('skills')
    if (skillsSection) {
      skillsSection.scrollIntoView({ behavior: 'smooth' })
      focusManager.setFocus(skillsSection)
      screenReader.announceNavigation('Skills')
    }
  }, { description: 'Go to Skills section' })

  keyboardNav.registerShortcut('p', () => {
    const projectsSection = document.getElementById('projects')
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' })
      focusManager.setFocus(projectsSection)
      screenReader.announceNavigation('Projects')
    }
  }, { description: 'Go to Projects section' })

  keyboardNav.registerShortcut('c', () => {
    const contactSection = document.getElementById('contact')
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' })
      focusManager.setFocus(contactSection)
      screenReader.announceNavigation('Contact')
    }
  }, { description: 'Go to Contact section' })

  // Skip to main content shortcut
  keyboardNav.registerShortcut('m', () => {
    const mainContent = document.querySelector('main')
    if (mainContent) {
      focusManager.setFocus(mainContent)
      screenReader.announce('Skipped to main content')
    }
  }, { description: 'Skip to main content' })

  console.log('Accessibility features initialized')
}