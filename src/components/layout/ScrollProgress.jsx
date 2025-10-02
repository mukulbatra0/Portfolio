import React, { useState, useEffect } from 'react'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import { SECTIONS } from '../../utils/constants'

const ScrollProgress = ({ showSectionIndicators = true, showPercentage = false }) => {
  const scrollAnimation = useScrollAnimation() || { scrollProgress: 0 }
  const { scrollProgress } = scrollAnimation
  const [currentSection, setCurrentSection] = useState('')
  const [sectionProgress, setSectionProgress] = useState({})

  // Track section progress
  useEffect(() => {
    const updateSectionProgress = () => {
      const sections = Object.values(SECTIONS)
      const progress = {}
      let activeSection = ''

      sections.forEach((sectionId) => {
        const element = document.getElementById(sectionId)
        if (element) {
          const rect = element.getBoundingClientRect()
          const windowHeight = window.innerHeight
          const elementHeight = rect.height
          
          // Calculate section visibility percentage
          const visibleHeight = Math.min(
            windowHeight,
            Math.max(0, windowHeight - Math.max(0, rect.top)),
            Math.max(0, rect.bottom)
          )
          
          const sectionVisibility = Math.min(100, Math.max(0, (visibleHeight / windowHeight) * 100))
          progress[sectionId] = sectionVisibility
          
          // Determine active section
          if (rect.top <= windowHeight * 0.3 && rect.bottom >= windowHeight * 0.3) {
            activeSection = sectionId
          }
        }
      })

      setSectionProgress(progress)
      setCurrentSection(activeSection)
    }

    const handleScroll = () => {
      requestAnimationFrame(updateSectionProgress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    updateSectionProgress() // Initial call

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Main Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-30 pointer-events-none">
        <div 
          className="h-full bg-gradient-to-r from-accent-cyan via-cyan-400 to-cyan-600 transition-all duration-300 ease-out"
          style={{
            width: `${scrollProgress}%`,
            boxShadow: scrollProgress > 0 ? '0 0 10px rgba(34, 211, 238, 0.5)' : 'none',
            filter: scrollProgress > 0 ? 'drop-shadow(0 0 5px rgba(34, 211, 238, 0.3))' : 'none'
          }}
        />
      </div>

      {/* Section Indicators */}
      {showSectionIndicators && (
        <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
          <div className="flex flex-col space-y-3">
            {Object.values(SECTIONS).map((sectionId) => {
              const isActive = currentSection === sectionId
              const progress = sectionProgress[sectionId] || 0
              
              return (
                <button
                  key={sectionId}
                  onClick={() => {
                    const element = document.getElementById(sectionId)
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }
                  }}
                  className={`group relative w-3 h-3 rounded-full transition-all duration-300 ${
                    isActive 
                      ? 'bg-accent-cyan shadow-glow scale-125' 
                      : 'bg-neutral-slate bg-opacity-40 hover:bg-accent-cyan hover:bg-opacity-60'
                  }`}
                  aria-label={`Navigate to ${sectionId} section`}
                  title={sectionId.charAt(0).toUpperCase() + sectionId.slice(1)}
                >
                  {/* Progress Ring */}
                  <div className="absolute inset-0 rounded-full">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 24 24">
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        fill="none"
                        stroke="rgba(34, 211, 238, 0.2)"
                        strokeWidth="2"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        fill="none"
                        stroke="#22D3EE"
                        strokeWidth="2"
                        strokeDasharray={`${2 * Math.PI * 10}`}
                        strokeDashoffset={`${2 * Math.PI * 10 * (1 - progress / 100)}`}
                        className="transition-all duration-300"
                        style={{
                          opacity: isActive ? 1 : 0.3
                        }}
                      />
                    </svg>
                  </div>

                  {/* Tooltip */}
                  <div className="absolute right-6 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <div className="glass-card px-3 py-2 text-sm font-medium text-accent-cyan whitespace-nowrap">
                      {sectionId.charAt(0).toUpperCase() + sectionId.slice(1)}
                      {showPercentage && (
                        <span className="text-xs text-neutral-slate ml-2">
                          {Math.round(progress)}%
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Reading Progress Indicator (Optional) */}
      {showPercentage && (
        <div className="fixed bottom-6 left-6 z-40 glass-card px-4 py-2 hidden lg:block">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 relative">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 32 32">
                <circle
                  cx="16"
                  cy="16"
                  r="14"
                  fill="none"
                  stroke="rgba(100, 116, 139, 0.3)"
                  strokeWidth="2"
                />
                <circle
                  cx="16"
                  cy="16"
                  r="14"
                  fill="none"
                  stroke="#22D3EE"
                  strokeWidth="2"
                  strokeDasharray={`${2 * Math.PI * 14}`}
                  strokeDashoffset={`${2 * Math.PI * 14 * (1 - scrollProgress / 100)}`}
                  className="transition-all duration-300"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-accent-cyan">
                  {Math.round(scrollProgress)}
                </span>
              </div>
            </div>
            <div className="text-sm">
              <div className="font-medium text-light-gray">Reading Progress</div>
              <div className="text-xs text-neutral-slate">
                {currentSection ? `Currently: ${currentSection}` : 'Scroll to navigate'}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ScrollProgress