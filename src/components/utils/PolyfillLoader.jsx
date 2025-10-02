import { useEffect, useState } from 'react'
import { 
  getBrowserInfo, 
  checkBrowserSupport, 
  loadPolyfills, 
  addBrowserClasses,
  getBrowserOptimizations 
} from '../../utils/browserUtils'

const PolyfillLoader = ({ children, fallback = null }) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [browserInfo, setBrowserInfo] = useState(null)
  const [isSupported, setIsSupported] = useState(true)

  useEffect(() => {
    const initializeBrowser = async () => {
      try {
        // Get browser information
        const browser = getBrowserInfo()
        const support = checkBrowserSupport()
        const optimizations = getBrowserOptimizations()
        
        setBrowserInfo({ browser, support, optimizations })
        
        // Add browser classes to document
        addBrowserClasses()
        
        // Check if browser is supported
        const minVersions = {
          Chrome: 70,
          Firefox: 65,
          Safari: 12,
          Edge: 79
        }
        
        const isVersionSupported = !minVersions[browser.name] || 
          browser.version >= minVersions[browser.name]
        
        if (!isVersionSupported && !browser.isIE) {
          console.warn(`Browser ${browser.name} ${browser.version} may not be fully supported`)
        }
        
        // Load polyfills for missing features
        await loadPolyfills()
        
        // Apply browser-specific optimizations
        if (optimizations.useReducedEffects) {
          document.documentElement.classList.add('reduced-effects')
        }
        
        if (!support.cssBackdropFilter) {
          document.documentElement.classList.add('no-backdrop-filter')
        }
        
        if (!support.cssGrid) {
          document.documentElement.classList.add('no-grid')
        }
        
        // Set supported status
        setIsSupported(isVersionSupported && !browser.isIE)
        setIsLoaded(true)
        
      } catch (error) {
        console.error('Failed to initialize browser compatibility:', error)
        setIsLoaded(true)
        setIsSupported(false)
      }
    }

    initializeBrowser()
  }, [])

  // Show loading state while initializing
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-primary-dark flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mb-4"></div>
          <p className="text-neutral-slate">Initializing browser compatibility...</p>
        </div>
      </div>
    )
  }

  // Show fallback for unsupported browsers
  if (!isSupported && fallback) {
    return fallback
  }

  // Show warning for unsupported browsers
  if (!isSupported) {
    return (
      <div className="min-h-screen bg-primary-dark flex items-center justify-center p-4">
        <div className="max-w-md text-center glass-card p-8">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-accent-cyan mb-4">
            Browser Not Supported
          </h2>
          <p className="text-neutral-slate mb-6">
            Your browser ({browserInfo?.browser.name} {browserInfo?.browser.version}) 
            is not fully supported. For the best experience, please use:
          </p>
          <ul className="text-left text-neutral-slate mb-6 space-y-2">
            <li>• Chrome 70+</li>
            <li>• Firefox 65+</li>
            <li>• Safari 12+</li>
            <li>• Edge 79+</li>
          </ul>
          <button 
            onClick={() => setIsSupported(true)}
            className="btn-primary"
          >
            Continue Anyway
          </button>
        </div>
      </div>
    )
  }

  return children
}

export default PolyfillLoader