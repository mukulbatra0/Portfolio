import { useState, useEffect, useCallback, useRef } from 'react';
import { trackContactEvent, ANALYTICS_EVENTS } from '../utils/contactAnalytics';

/**
 * Custom hook for managing accessibility features in the contact section
 */
export const useContactAccessibility = () => {
  const [focusedElement, setFocusedElement] = useState(null);
  const [keyboardNavigation, setKeyboardNavigation] = useState(false);
  const [screenReaderActive, setScreenReaderActive] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const focusHistoryRef = useRef([]);
  const announcementTimeoutRef = useRef(null);

  // Detect keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Tab') {
        setKeyboardNavigation(true);
        trackContactEvent(ANALYTICS_EVENTS.KEYBOARD_NAVIGATION_USED, {
          key: e.key,
          shiftKey: e.shiftKey
        });
      }
    };

    const handleMouseDown = () => {
      setKeyboardNavigation(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  // Detect screen reader usage
  useEffect(() => {
    const detectScreenReader = () => {
      // Check for common screen reader indicators
      const indicators = [
        () => navigator.userAgent.includes('NVDA'),
        () => navigator.userAgent.includes('JAWS'),
        () => navigator.userAgent.includes('VoiceOver'),
        () => window.speechSynthesis && window.speechSynthesis.getVoices().length > 0,
        () => document.querySelector('[aria-live]') !== null,
        () => window.navigator.userAgent.includes('Talkback')
      ];

      const isScreenReaderDetected = indicators.some(check => check());
      
      if (isScreenReaderDetected) {
        setScreenReaderActive(true);
        trackContactEvent(ANALYTICS_EVENTS.SCREEN_READER_DETECTED);
      }
    };

    // Check immediately and after a delay for dynamic content
    detectScreenReader();
    setTimeout(detectScreenReader, 1000);
  }, []);

  // Focus management
  const manageFocus = useCallback((element, options = {}) => {
    if (!element) return;

    const { 
      preventScroll = false, 
      addToHistory = true,
      announce = null 
    } = options;

    // Add current focus to history
    if (addToHistory && document.activeElement) {
      focusHistoryRef.current.push(document.activeElement);
      // Keep only last 10 focus states
      if (focusHistoryRef.current.length > 10) {
        focusHistoryRef.current.shift();
      }
    }

    // Focus the element
    element.focus({ preventScroll });
    setFocusedElement(element);

    // Make announcement if provided
    if (announce) {
      announceToScreenReader(announce);
    }

    trackContactEvent(ANALYTICS_EVENTS.KEYBOARD_NAVIGATION_USED, {
      action: 'focus_managed',
      elementType: element.tagName,
      elementId: element.id,
      elementClass: element.className
    });
  }, []);

  // Return to previous focus
  const returnToPreviousFocus = useCallback(() => {
    const previousElement = focusHistoryRef.current.pop();
    if (previousElement && document.contains(previousElement)) {
      previousElement.focus();
      setFocusedElement(previousElement);
    }
  }, []);

  // Screen reader announcements
  const announceToScreenReader = useCallback((message, priority = 'polite') => {
    if (!message) return;

    const announcement = {
      id: Date.now(),
      message,
      priority,
      timestamp: new Date()
    };

    setAnnouncements(prev => [...prev, announcement]);

    // Create or update live region
    let liveRegion = document.getElementById('contact-announcements');
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'contact-announcements';
      liveRegion.setAttribute('aria-live', priority);
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      document.body.appendChild(liveRegion);
    }

    // Update the live region
    liveRegion.textContent = message;

    // Clear announcement after delay
    if (announcementTimeoutRef.current) {
      clearTimeout(announcementTimeoutRef.current);
    }

    announcementTimeoutRef.current = setTimeout(() => {
      setAnnouncements(prev => prev.filter(a => a.id !== announcement.id));
      if (liveRegion && liveRegion.textContent === message) {
        liveRegion.textContent = '';
      }
    }, 5000);

    trackContactEvent(ANALYTICS_EVENTS.SCREEN_READER_DETECTED, {
      action: 'announcement_made',
      message: message.substring(0, 100), // Truncate for privacy
      priority
    });
  }, []);

  // Keyboard navigation helpers
  const handleKeyboardNavigation = useCallback((e, handlers = {}) => {
    const {
      onEnter,
      onSpace,
      onEscape,
      onArrowUp,
      onArrowDown,
      onArrowLeft,
      onArrowRight,
      onTab,
      onHome,
      onEnd
    } = handlers;

    switch (e.key) {
      case 'Enter':
        if (onEnter) {
          e.preventDefault();
          onEnter(e);
        }
        break;
      case ' ':
        if (onSpace) {
          e.preventDefault();
          onSpace(e);
        }
        break;
      case 'Escape':
        if (onEscape) {
          e.preventDefault();
          onEscape(e);
        }
        break;
      case 'ArrowUp':
        if (onArrowUp) {
          e.preventDefault();
          onArrowUp(e);
        }
        break;
      case 'ArrowDown':
        if (onArrowDown) {
          e.preventDefault();
          onArrowDown(e);
        }
        break;
      case 'ArrowLeft':
        if (onArrowLeft) {
          e.preventDefault();
          onArrowLeft(e);
        }
        break;
      case 'ArrowRight':
        if (onArrowRight) {
          e.preventDefault();
          onArrowRight(e);
        }
        break;
      case 'Tab':
        if (onTab) {
          onTab(e);
        }
        break;
      case 'Home':
        if (onHome) {
          e.preventDefault();
          onHome(e);
        }
        break;
      case 'End':
        if (onEnd) {
          e.preventDefault();
          onEnd(e);
        }
        break;
    }
  }, []);

  // Focus trap for modals/dialogs
  const createFocusTrap = useCallback((containerElement) => {
    if (!containerElement) return null;

    const focusableElements = containerElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const trapFocus = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    containerElement.addEventListener('keydown', trapFocus);

    // Focus first element
    if (firstElement) {
      firstElement.focus();
    }

    // Return cleanup function
    return () => {
      containerElement.removeEventListener('keydown', trapFocus);
    };
  }, []);

  // Generate accessible IDs
  const generateAccessibleId = useCallback((prefix = 'contact') => {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  }, []);

  // ARIA helpers
  const getAriaProps = useCallback((type, options = {}) => {
    const baseProps = {
      role: options.role,
      'aria-label': options.label,
      'aria-labelledby': options.labelledBy,
      'aria-describedby': options.describedBy,
      'aria-expanded': options.expanded,
      'aria-selected': options.selected,
      'aria-checked': options.checked,
      'aria-disabled': options.disabled,
      'aria-required': options.required,
      'aria-invalid': options.invalid,
      'aria-live': options.live,
      'aria-atomic': options.atomic
    };

    // Remove undefined values
    Object.keys(baseProps).forEach(key => {
      if (baseProps[key] === undefined) {
        delete baseProps[key];
      }
    });

    return baseProps;
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (announcementTimeoutRef.current) {
        clearTimeout(announcementTimeoutRef.current);
      }
      
      // Remove live region
      const liveRegion = document.getElementById('contact-announcements');
      if (liveRegion) {
        document.body.removeChild(liveRegion);
      }
    };
  }, []);

  return {
    // State
    focusedElement,
    keyboardNavigation,
    screenReaderActive,
    announcements,

    // Focus management
    manageFocus,
    returnToPreviousFocus,
    createFocusTrap,

    // Screen reader
    announceToScreenReader,

    // Keyboard navigation
    handleKeyboardNavigation,

    // Utilities
    generateAccessibleId,
    getAriaProps
  };
};

/**
 * Hook for managing focus within a specific container
 */
export const useContainerFocus = (containerRef) => {
  const [focusableElements, setFocusableElements] = useState([]);
  const [currentFocusIndex, setCurrentFocusIndex] = useState(-1);

  useEffect(() => {
    if (!containerRef.current) return;

    const updateFocusableElements = () => {
      const elements = containerRef.current.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
      );
      setFocusableElements(Array.from(elements));
    };

    updateFocusableElements();

    // Update when DOM changes
    const observer = new MutationObserver(updateFocusableElements);
    observer.observe(containerRef.current, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['disabled', 'tabindex']
    });

    return () => observer.disconnect();
  }, [containerRef]);

  const focusNext = useCallback(() => {
    if (focusableElements.length === 0) return;
    
    const nextIndex = (currentFocusIndex + 1) % focusableElements.length;
    focusableElements[nextIndex].focus();
    setCurrentFocusIndex(nextIndex);
  }, [focusableElements, currentFocusIndex]);

  const focusPrevious = useCallback(() => {
    if (focusableElements.length === 0) return;
    
    const prevIndex = currentFocusIndex <= 0 ? 
      focusableElements.length - 1 : 
      currentFocusIndex - 1;
    focusableElements[prevIndex].focus();
    setCurrentFocusIndex(prevIndex);
  }, [focusableElements, currentFocusIndex]);

  const focusFirst = useCallback(() => {
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
      setCurrentFocusIndex(0);
    }
  }, [focusableElements]);

  const focusLast = useCallback(() => {
    if (focusableElements.length > 0) {
      const lastIndex = focusableElements.length - 1;
      focusableElements[lastIndex].focus();
      setCurrentFocusIndex(lastIndex);
    }
  }, [focusableElements]);

  return {
    focusableElements,
    currentFocusIndex,
    focusNext,
    focusPrevious,
    focusFirst,
    focusLast
  };
};

/**
 * Hook for managing reduced motion preferences
 */
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = (e) => {
      setPrefersReducedMotion(e.matches);
    };

    setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};

/**
 * Hook for managing high contrast preferences
 */
export const useHighContrast = () => {
  const [prefersHighContrast, setPrefersHighContrast] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    
    const handleChange = (e) => {
      setPrefersHighContrast(e.matches);
    };

    setPrefersHighContrast(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersHighContrast;
};