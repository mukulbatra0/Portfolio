import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { viewport, scroll, a11y } from '../utils/layoutUtils'
import { SECTIONS } from '../utils/constants'

// Layout Context
const LayoutContext = createContext()

// Action types
const LAYOUT_ACTIONS = {
  SET_VIEWPORT: 'SET_VIEWPORT',
  SET_SCROLL: 'SET_SCROLL',
  SET_ACTIVE_SECTION: 'SET_ACTIVE_SECTION',
  SET_SECTION_PROGRESS: 'SET_SECTION_PROGRESS',
  SET_PREFERENCES: 'SET_PREFERENCES',
  SET_LOADING: 'SET_LOADING',
  SET_MODAL: 'SET_MODAL',
  TOGGLE_MOBILE_MENU: 'TOGGLE_MOBILE_MENU'
}

// Initial state
const initialState = {
  // Viewport state
  viewport: {
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
    breakpoint: 'lg',
    isMobile: false,
    isTablet: false,
    isDesktop: true
  },
  
  // Scroll state
  scroll: {
    x: 0,
    y: 0,
    progress: 0,
    direction: 'up',
    isScrolled: false
  },
  
  // Section state
  sections: {
    active: SECTIONS.HERO,
    progress: {},
    history: [SECTIONS.HERO]
  },
  
  // User preferences
  preferences: {
    reducedMotion: false,
    highContrast: false,
    darkMode: false
  },
  
  // UI state
  ui: {
    isLoading: false,
    modal: null,
    mobileMenuOpen: false,
    sidebarOpen: false
  }
}

// Reducer
const layoutReducer = (state, action) => {
  switch (action.type) {
    case LAYOUT_ACTIONS.SET_VIEWPORT:
      return {
        ...state,
        viewport: { ...state.viewport, ...action.payload }
      }
      
    case LAYOUT_ACTIONS.SET_SCROLL:
      return {
        ...state,
        scroll: { ...state.scroll, ...action.payload }
      }
      
    case LAYOUT_ACTIONS.SET_ACTIVE_SECTION:
      const newHistory = [...state.sections.history]
      if (newHistory[newHistory.length - 1] !== action.payload) {
        newHistory.push(action.payload)
        // Keep only last 10 sections in history
        if (newHistory.length > 10) {
          newHistory.shift()
        }
      }
      
      return {
        ...state,
        sections: {
          ...state.sections,
          active: action.payload,
          history: newHistory
        }
      }
      
    case LAYOUT_ACTIONS.SET_SECTION_PROGRESS:
      return {
        ...state,
        sections: {
          ...state.sections,
          progress: { ...state.sections.progress, ...action.payload }
        }
      }
      
    case LAYOUT_ACTIONS.SET_PREFERENCES:
      return {
        ...state,
        preferences: { ...state.preferences, ...action.payload }
      }
      
    case LAYOUT_ACTIONS.SET_LOADING:
      return {
        ...state,
        ui: { ...state.ui, isLoading: action.payload }
      }
      
    case LAYOUT_ACTIONS.SET_MODAL:
      return {
        ...state,
        ui: { ...state.ui, modal: action.payload }
      }
      
    case LAYOUT_ACTIONS.TOGGLE_MOBILE_MENU:
      return {
        ...state,
        ui: { 
          ...state.ui, 
          mobileMenuOpen: action.payload !== undefined ? action.payload : !state.ui.mobileMenuOpen 
        }
      }
      
    default:
      return state
  }
}

// Layout Provider Component
export const LayoutProvider = ({ children }) => {
  const [state, dispatch] = useReducer(layoutReducer, initialState)

  // Update viewport state
  const updateViewport = () => {
    const dimensions = viewport.getDimensions()
    const breakpoint = viewport.getCurrentBreakpoint()
    
    dispatch({
      type: LAYOUT_ACTIONS.SET_VIEWPORT,
      payload: {
        ...dimensions,
        breakpoint,
        isMobile: viewport.isMobile(),
        isTablet: viewport.isTablet(),
        isDesktop: viewport.isDesktop()
      }
    })
  }

  // Update scroll state
  const updateScroll = () => {
    const position = scroll.getPosition()
    const progress = scroll.getProgress()
    const isScrolled = position.y > 50
    
    // Determine scroll direction
    const direction = position.y > state.scroll.y ? 'down' : 'up'
    
    dispatch({
      type: LAYOUT_ACTIONS.SET_SCROLL,
      payload: {
        ...position,
        progress,
        direction,
        isScrolled
      }
    })
  }

  // Update section progress
  const updateSectionProgress = () => {
    const progress = {}
    let activeSection = state.sections.active

    Object.values(SECTIONS).forEach(sectionId => {
      const element = document.getElementById(sectionId)
      if (element) {
        const sectionProgress = scroll.getElementProgress(element)
        progress[sectionId] = sectionProgress

        // Determine active section
        const rect = element.getBoundingClientRect()
        const windowHeight = window.innerHeight
        
        if (rect.top <= windowHeight * 0.3 && rect.bottom >= windowHeight * 0.3) {
          activeSection = sectionId
        }
      }
    })

    dispatch({
      type: LAYOUT_ACTIONS.SET_SECTION_PROGRESS,
      payload: progress
    })

    if (activeSection !== state.sections.active) {
      dispatch({
        type: LAYOUT_ACTIONS.SET_ACTIVE_SECTION,
        payload: activeSection
      })
    }
  }

  // Update user preferences
  const updatePreferences = () => {
    dispatch({
      type: LAYOUT_ACTIONS.SET_PREFERENCES,
      payload: {
        reducedMotion: a11y.prefersReducedMotion(),
        highContrast: a11y.prefersHighContrast(),
        darkMode: a11y.prefersDarkMode()
      }
    })
  }

  // Setup event listeners
  useEffect(() => {
    let ticking = false

    const handleResize = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateViewport()
          ticking = false
        })
        ticking = true
      }
    }

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateScroll()
          updateSectionProgress()
          ticking = false
        })
        ticking = true
      }
    }

    // Initial updates
    updateViewport()
    updateScroll()
    updateSectionProgress()
    updatePreferences()

    // Event listeners
    window.addEventListener('resize', handleResize, { passive: true })
    window.addEventListener('scroll', handleScroll, { passive: true })

    // Media query listeners for preferences
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)')
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handlePreferenceChange = () => updatePreferences()

    reducedMotionQuery.addEventListener('change', handlePreferenceChange)
    highContrastQuery.addEventListener('change', handlePreferenceChange)
    darkModeQuery.addEventListener('change', handlePreferenceChange)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll)
      reducedMotionQuery.removeEventListener('change', handlePreferenceChange)
      highContrastQuery.removeEventListener('change', handlePreferenceChange)
      darkModeQuery.removeEventListener('change', handlePreferenceChange)
    }
  }, [state.scroll.y, state.sections.active])

  // Action creators
  const actions = {
    setActiveSection: (sectionId) => {
      dispatch({
        type: LAYOUT_ACTIONS.SET_ACTIVE_SECTION,
        payload: sectionId
      })
    },
    
    setLoading: (isLoading) => {
      dispatch({
        type: LAYOUT_ACTIONS.SET_LOADING,
        payload: isLoading
      })
    },
    
    setModal: (modal) => {
      dispatch({
        type: LAYOUT_ACTIONS.SET_MODAL,
        payload: modal
      })
    },
    
    toggleMobileMenu: (open) => {
      dispatch({
        type: LAYOUT_ACTIONS.TOGGLE_MOBILE_MENU,
        payload: open
      })
    },
    
    navigateToSection: (sectionId, offset = 80) => {
      const element = document.getElementById(sectionId)
      if (element) {
        scroll.toElement(element, offset)
        actions.setActiveSection(sectionId)
      }
    },
    
    scrollToTop: () => {
      scroll.toTop()
    },
    
    lockScroll: () => {
      scroll.lock()
    },
    
    unlockScroll: () => {
      scroll.unlock()
    }
  }

  const value = {
    ...state,
    actions
  }

  return (
    <LayoutContext.Provider value={value}>
      {children}
    </LayoutContext.Provider>
  )
}

// Custom hook to use layout context
export const useLayout = () => {
  const context = useContext(LayoutContext)
  if (!context) {
    console.warn('useLayout must be used within a LayoutProvider')
    return null
  }
  return context
}

// Selector hooks for specific parts of state
export const useViewport = () => {
  const layout = useLayout()
  return layout?.viewport || {
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
    breakpoint: 'lg',
    isMobile: false,
    isTablet: false,
    isDesktop: true
  }
}

export const useScroll = () => {
  const layout = useLayout()
  return layout?.scroll || {
    x: 0,
    y: 0,
    progress: 0,
    direction: 'up',
    isScrolled: false
  }
}

export const useSections = () => {
  const layout = useLayout()
  return layout ? 
    { ...layout.sections, navigateToSection: layout.actions.navigateToSection } :
    { active: 'hero', progress: {}, history: ['hero'], navigateToSection: () => {} }
}

export const usePreferences = () => {
  const layout = useLayout()
  return layout?.preferences || {
    reducedMotion: false,
    highContrast: false,
    darkMode: false
  }
}

export const useUI = () => {
  const layout = useLayout()
  return layout ? 
    { 
      ...layout.ui, 
      setLoading: layout.actions.setLoading,
      setModal: layout.actions.setModal,
      toggleMobileMenu: layout.actions.toggleMobileMenu
    } :
    {
      isLoading: false,
      modal: null,
      mobileMenuOpen: false,
      sidebarOpen: false,
      setLoading: () => {},
      setModal: () => {},
      toggleMobileMenu: () => {}
    }
}