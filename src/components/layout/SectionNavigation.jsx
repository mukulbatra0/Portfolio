import React, { useState, useEffect } from 'react'
import { viewport, scroll } from '../../utils/layoutUtils'
import { SECTIONS } from '../../utils/constants'

const SectionNavigation = ({ 
  position = 'right', 
  showLabels = false, 
  showProgress = true,
  className = '' 
}) => {
  const [activeSection, setActiveSection] = useState(SECTIONS.HERO)
  const [sectionProgress, setSectionProgress] = useState({})
  const [isVisible, setIsVisible] = useState(true)

  // Section configuration
  const sectionConfig = [
    { id: SECTIONS.HERO, label: 'Home', icon: '🏠' },
    { id: SECTIONS.ABOUT, label: 'About', icon: '👨‍💻' },
    { id: SECTIONS.SKILLS, label: 'Skills', icon: '⚡' },
    { id: SECTIONS.EDUCATION, label: 'Education', icon: '🎓' },
    { id: SECTIONS.PROJECTS, label: 'Projects', icon: '💼' },
    { id: SECTIONS.ACHIEVEMENTS, label: 'Awards', icon: '🏆' },
    { id: SECTIONS.EXPERIENCE, label: 'Experience', icon: '💻' },
    { id: SECTIONS.CONTACT, label: 'Contact', icon: '📧' }
  ]

  // Track active section and progress
  useEffect(() => {
    const updateSectionState = () => {
      const progress = {}
      let currentActive = SECTIONS.HERO

      sectionConfig.forEach(({ id }) => {
        const element = document.getElementById(id)
        if (element) {
          const elementProgress = scroll.getElementProgress(element)
          progress[id] = elementProgress

          // Determine active section based on visibility
          const rect = element.getBoundingClientRect()
          const windowHeight = window.innerHeight
          
          if (rect.top <= windowHeight * 0.3 && rect.bottom >= windowHeight * 0.3) {
            currentActive = id
          }
        }
      })

      setSectionProgress(progress)
      setActiveSection(currentActive)
    }

    // Handle scroll with throttling
    const handleScroll = () => {
      requestAnimationFrame(updateSectionState)
    }

    // Handle resize
    const handleResize = () => {
      setIsVisible(!viewport.isMobile())
      updateSectionState()
    }

    // Initial setup
    updateSectionState()
    setIsVisible(!viewport.isMobile())

    // Event listeners
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Navigate to section
  const navigateToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      scroll.toElement(element, 80)
      setActiveSection(sectionId)
    }
  }

  // Don't render on mobile or if not visible
  if (!isVisible) return null

  const positionClasses = {
    right: 'right-6 top-1/2 transform -translate-y-1/2',
    left: 'left-6 top-1/2 transform -translate-y-1/2',
    bottom: 'bottom-6 left-1/2 transform -translate-x-1/2 flex-row',
    top: 'top-24 left-1/2 transform -translate-x-1/2 flex-row'
  }

  const isHorizontal = position === 'bottom' || position === 'top'

  return (
    <nav 
      className={`fixed z-40 ${positionClasses[position]} ${className}`}
      aria-label="Section navigation"
    >
      <div className={`flex ${isHorizontal ? 'flex-row space-x-3' : 'flex-col space-y-3'}`}>
        {sectionConfig.map(({ id, label, icon }) => {
          const isActive = activeSection === id
          const progress = sectionProgress[id] || 0
          
          return (
            <div key={id} className="relative group">
              <button
                onClick={() => navigateToSection(id)}
                className={`relative flex items-center justify-center transition-all duration-300 ${
                  isHorizontal ? 'w-12 h-12' : 'w-4 h-4'
                } rounded-full ${
                  isActive 
                    ? 'bg-accent-cyan shadow-glow scale-125' 
                    : 'bg-neutral-slate bg-opacity-40 hover:bg-accent-cyan hover:bg-opacity-60 hover:scale-110'
                }`}
                aria-label={`Navigate to ${label} section`}
                title={label}
              >
                {/* Progress Ring */}
                {showProgress && (
                  <div className="absolute inset-0 rounded-full">
                    <svg 
                      className="w-full h-full transform -rotate-90" 
                      viewBox="0 0 24 24"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        fill="none"
                        stroke="rgba(34, 211, 238, 0.2)"
                        strokeWidth="1.5"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        fill="none"
                        stroke="#22D3EE"
                        strokeWidth="1.5"
                        strokeDasharray={`${2 * Math.PI * 10}`}
                        strokeDashoffset={`${2 * Math.PI * 10 * (1 - progress / 100)}`}
                        className="transition-all duration-500"
                        style={{
                          opacity: progress > 0 ? 0.8 : 0.2
                        }}
                      />
                    </svg>
                  </div>
                )}

                {/* Icon for horizontal layout */}
                {isHorizontal && (
                  <span className="text-lg z-10">{icon}</span>
                )}

                {/* Active indicator */}
                <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
                  isActive ? 'animate-pulse-glow' : ''
                }`} />
              </button>

              {/* Label tooltip */}
              {showLabels && (
                <div className={`absolute z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none ${
                  position === 'right' ? 'right-full mr-4 top-1/2 transform -translate-y-1/2' :
                  position === 'left' ? 'left-full ml-4 top-1/2 transform -translate-y-1/2' :
                  position === 'bottom' ? 'bottom-full mb-4 left-1/2 transform -translate-x-1/2' :
                  'top-full mt-4 left-1/2 transform -translate-x-1/2'
                }`}>
                  <div className="glass-card px-3 py-2 text-sm font-medium text-accent-cyan whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span>{icon}</span>
                      <span>{label}</span>
                      {showProgress && (
                        <span className="text-xs text-neutral-slate">
                          {Math.round(progress)}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Navigation controls */}
      <div className={`${isHorizontal ? 'mt-4' : 'mt-6'} flex ${isHorizontal ? 'justify-center space-x-2' : 'flex-col space-y-2'}`}>
        <button
          onClick={() => {
            const currentIndex = sectionConfig.findIndex(s => s.id === activeSection)
            if (currentIndex > 0) {
              navigateToSection(sectionConfig[currentIndex - 1].id)
            }
          }}
          className="w-8 h-8 rounded-full glass-button flex-center text-sm hover:text-accent-cyan transition-colors"
          aria-label="Previous section"
          disabled={activeSection === SECTIONS.HERO}
        >
          {isHorizontal ? '←' : '↑'}
        </button>
        
        <button
          onClick={() => {
            const currentIndex = sectionConfig.findIndex(s => s.id === activeSection)
            if (currentIndex < sectionConfig.length - 1) {
              navigateToSection(sectionConfig[currentIndex + 1].id)
            }
          }}
          className="w-8 h-8 rounded-full glass-button flex-center text-sm hover:text-accent-cyan transition-colors"
          aria-label="Next section"
          disabled={activeSection === SECTIONS.CONTACT}
        >
          {isHorizontal ? '→' : '↓'}
        </button>
      </div>
    </nav>
  )
}

export default SectionNavigation