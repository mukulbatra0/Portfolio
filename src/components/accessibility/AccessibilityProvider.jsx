import React, { useEffect, useRef, useState } from 'react'
import { 
  initializeAccessibility, 
  focusManager, 
  screenReader, 
  keyboardNav 
} from '../../utils/accessibilityUtils'

const AccessibilityProvider = ({ children }) => {
  const [isKeyboardUser, setIsKeyboardUser] = useState(false)
  const [announcements, setAnnouncements] = useState([])
  const skipLinkRef = useRef(null)

  useEffect(() => {
    // Initialize accessibility features
    initializeAccessibility()

    // Detect keyboard vs mouse usage
    const handleKeyDown = (e) => {
      if (e.key === 'Tab') {
        setIsKeyboardUser(true)
        document.body.classList.add('keyboard-user')
        document.body.classList.remove('mouse-user')
      }
    }

    const handleMouseDown = () => {
      setIsKeyboardUser(false)
      document.body.classList.add('mouse-user')
      document.body.classList.remove('keyboard-user')
    }

    // Set initial state
    document.body.classList.add('mouse-user')

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleMouseDown)

    // Add semantic HTML attributes
    document.documentElement.setAttribute('lang', 'en')
    
    // Add viewport meta for accessibility
    const viewport = document.querySelector('meta[name="viewport"]')
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=5')
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleMouseDown)
    }
  }, [])

  // Handle skip to main content
  const handleSkipToMain = (e) => {
    e.preventDefault()
    const mainContent = document.querySelector('main')
    if (mainContent) {
      focusManager.setFocus(mainContent)
      screenReader.announce('Skipped to main content')
    }
  }

  return (
    <>
      {/* Skip Navigation Links */}
      <div className="sr-only-focusable">
        <a 
          href="#main-content" 
          className="skip-link"
          onClick={handleSkipToMain}
          ref={skipLinkRef}
        >
          Skip to main content
        </a>
        <a 
          href="#navigation" 
          className="skip-link"
          onClick={(e) => {
            e.preventDefault()
            const nav = document.querySelector('nav')
            if (nav) {
              focusManager.setFocus(nav)
              screenReader.announce('Skipped to navigation')
            }
          }}
        >
          Skip to navigation
        </a>
      </div>

      {/* Main Content with Semantic Structure */}
      <div role="application" aria-label="Mukul Batra Portfolio">
        {children}
      </div>

      {/* Keyboard Shortcuts Help */}
      <KeyboardShortcutsHelp />

      {/* Accessibility Announcements */}
      <div 
        id="accessibility-announcements"
        aria-live="polite" 
        aria-atomic="true"
        className="sr-only"
      />
      
      <div 
        id="accessibility-alerts"
        aria-live="assertive" 
        aria-atomic="true"
        className="sr-only"
      />
    </>
  )
}

// Keyboard shortcuts help component
const KeyboardShortcutsHelp = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [shortcuts, setShortcuts] = useState([])

  useEffect(() => {
    // Register help shortcut
    keyboardNav.registerShortcut('?', () => {
      setIsVisible(!isVisible)
    }, { description: 'Show keyboard shortcuts help' })

    keyboardNav.registerShortcut('h', () => {
      setIsVisible(!isVisible)
    }, { 
      shiftKey: true, 
      description: 'Show keyboard shortcuts help' 
    })

    // Get all shortcuts
    setShortcuts(keyboardNav.getShortcuts())
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-title"
      onClick={() => setIsVisible(false)}
    >
      <div 
        className="bg-slate-900 border border-slate-700 rounded-lg p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 id="shortcuts-title" className="text-xl font-bold text-white">
            Keyboard Shortcuts
          </h2>
          <button
            onClick={() => setIsVisible(false)}
            className="text-slate-400 hover:text-white p-1"
            aria-label="Close keyboard shortcuts help"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-3">
          {shortcuts.map(({ key, description }) => (
            <div key={key} className="flex justify-between items-center">
              <span className="text-slate-300">{description}</span>
              <kbd className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-sm font-mono">
                {key.replace(/\+/g, ' + ').toUpperCase()}
              </kbd>
            </div>
          ))}
          
          <div className="border-t border-slate-700 pt-3 mt-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Close this help</span>
              <kbd className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-sm font-mono">
                ESC
              </kbd>
            </div>
          </div>
        </div>

        <div className="mt-4 text-sm text-slate-400">
          Press <kbd className="px-1 py-0.5 bg-slate-800 rounded">?</kbd> or{' '}
          <kbd className="px-1 py-0.5 bg-slate-800 rounded">Shift + H</kbd> to toggle this help.
        </div>
      </div>
    </div>
  )
}

export default AccessibilityProvider