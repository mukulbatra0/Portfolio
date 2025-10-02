import React, { useState, useRef, useEffect } from 'react'

const TimelineItem = ({ 
  item, 
  index, 
  isVisible = true,
  isActive = false,
  onClick = null,
  showDetails = false,
  className = '',
  animationDelay = 0
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [animationPhase, setAnimationPhase] = useState('hidden')
  const cardRef = useRef(null)
  const tooltipRef = useRef(null)
  const modalRef = useRef(null)

  // Enhanced click handler with animations and modal support
  const handleClick = (event) => {
    // Create ripple effect
    const rect = cardRef.current.getBoundingClientRect()
    const ripple = document.createElement('div')
    const size = Math.max(rect.width, rect.height)
    const x = event.clientX - rect.left - size / 2
    const y = event.clientY - rect.top - size / 2
    
    ripple.style.width = ripple.style.height = size + 'px'
    ripple.style.left = x + 'px'
    ripple.style.top = y + 'px'
    ripple.classList.add('timeline-item-ripple')
    
    cardRef.current.appendChild(ripple)
    
    setTimeout(() => {
      ripple.remove()
    }, 600)

    // Enhanced interaction - show modal for detailed view
    if (event.detail === 2) { // Double click
      setShowModal(true)
    } else if (onClick) {
      onClick(item, index, event)
    } else {
      setIsExpanded(!isExpanded)
    }
  }

  // Handle modal close
  const handleModalClose = () => {
    setShowModal(false)
  }

  // Handle keyboard navigation
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleClick(event)
    } else if (event.key === 'Escape' && showModal) {
      handleModalClose()
    }
  }

  // Enhanced hover handlers with progressive reveal
  const handleMouseEnter = () => {
    setIsHovered(true)
    setAnimationPhase('hover')
    
    // Show tooltip for long descriptions
    if (item.description && item.description.length > 100) {
      setTimeout(() => setShowTooltip(true), 500)
    }
    
    // Trigger hover animations
    if (cardRef.current) {
      cardRef.current.style.transform = 'translateY(-8px) scale(1.02)'
      cardRef.current.style.boxShadow = '0 20px 40px rgba(34, 211, 238, 0.2)'
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setShowTooltip(false)
    setAnimationPhase('visible')
    
    // Reset hover animations
    if (cardRef.current) {
      cardRef.current.style.transform = ''
      cardRef.current.style.boxShadow = ''
    }
  }

  // Enhanced animation lifecycle management
  useEffect(() => {
    if (isVisible) {
      setTimeout(() => {
        setAnimationPhase('visible')
      }, animationDelay || index * 100)
    }
  }, [isVisible, animationDelay, index])

  // Auto-expand for active items with smooth transitions
  useEffect(() => {
    if (isActive && !isExpanded) {
      setTimeout(() => {
        setIsExpanded(true)
        setAnimationPhase('active')
      }, 300)
    } else if (!isActive && isExpanded) {
      setTimeout(() => {
        setAnimationPhase('visible')
      }, 200)
    }
  }, [isActive, isExpanded])

  // Scroll-triggered reveal animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimationPhase('revealing')
          setTimeout(() => {
            setAnimationPhase('visible')
          }, 600)
        }
      },
      { 
        threshold: 0.3,
        rootMargin: '-50px 0px'
      }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case 'ongoing':
        return 'bg-green-500 bg-opacity-20 text-green-400 border-green-400'
      case 'completed':
        return 'bg-blue-500 bg-opacity-20 text-blue-400 border-blue-400'
      case 'upcoming':
        return 'bg-yellow-500 bg-opacity-20 text-yellow-400 border-yellow-400'
      default:
        return 'bg-neutral-slate bg-opacity-20 text-neutral-slate border-neutral-slate'
    }
  }

  const getGradeDisplay = () => {
    if (item.cgpa) return `CGPA: ${item.cgpa}`
    if (item.percentage) return `${item.percentage}`
    return null
  }

  return (
    <div 
      ref={cardRef}
      className={`
        timeline-item-card glass-card p-6 relative overflow-hidden
        ${animationPhase === 'hidden' ? 'timeline-item-hidden' : ''}
        ${animationPhase === 'revealing' ? 'timeline-item-revealing' : ''}
        ${animationPhase === 'visible' ? 'timeline-item-visible' : ''}
        ${animationPhase === 'hover' ? 'timeline-item-hover' : ''}
        ${animationPhase === 'active' ? 'timeline-item-active' : ''}
        ${isActive ? 'timeline-item-active ring-2 ring-accent-cyan ring-opacity-50' : ''}
        ${onClick || !isExpanded ? 'cursor-pointer' : ''}
        ${isExpanded ? 'timeline-item-expanded' : ''}
        ${className}
      `}
      style={{ 
        transitionDelay: `${animationDelay || index * 100}ms`,
        borderLeft: `4px solid ${item.color || '#22D3EE'}`
      }}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-expanded={isExpanded}
      aria-label={`Timeline item: ${item.degree || item.title}. Double-click for detailed view.`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-2xl">{item.icon}</span>
            <div>
              <h3 className="text-heading-4 font-semibold text-light-gray">
                {item.degree}
              </h3>
              <p className="text-accent-cyan font-medium">
                {item.institution}
              </p>
              {item.location && (
                <p className="text-sm text-neutral-slate">
                  📍 {item.location}
                </p>
              )}
            </div>
          </div>
        </div>
        
        <div className="text-right flex flex-col items-end space-y-2">
          <span className="text-sm font-medium text-neutral-slate">
            {item.period}
          </span>
          
          {item.status && (
            <span className={`
              px-3 py-1 text-xs rounded-full border
              ${getStatusColor(item.status)}
            `}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </span>
          )}
          
          {getGradeDisplay() && (
            <span className="text-sm font-semibold text-accent-cyan">
              {getGradeDisplay()}
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      {item.description && (
        <p className="text-neutral-slate mb-4 leading-relaxed">
          {item.description}
        </p>
      )}

      {/* Coursework/Subjects */}
      {(item.coursework || item.subjects) && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-light-gray mb-3">
            {item.coursework ? 'Key Coursework:' : 'Subjects:'}
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {(item.coursework || item.subjects).slice(0, isExpanded ? undefined : 6).map((course, idx) => (
              <div 
                key={idx}
                className="flex items-center space-x-2 text-sm text-neutral-slate"
              >
                <span className="w-1.5 h-1.5 bg-accent-cyan rounded-full"></span>
                <span>{course}</span>
              </div>
            ))}
          </div>
          
          {(item.coursework || item.subjects).length > 6 && !isExpanded && (
            <button 
              className="text-xs text-accent-cyan hover:text-cyan-300 transition-colors mt-2"
              onClick={(e) => {
                e.stopPropagation()
                setIsExpanded(true)
              }}
            >
              +{(item.coursework || item.subjects).length - 6} more courses
            </button>
          )}
        </div>
      )}

      {/* Achievements */}
      {item.achievements && item.achievements.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-light-gray mb-3">
            Key Achievements:
          </h4>
          <div className="space-y-2">
            {item.achievements.slice(0, isExpanded ? undefined : 3).map((achievement, idx) => (
              <div key={idx} className="flex items-start space-x-2">
                <span className="text-accent-cyan mt-1">🏆</span>
                <span className="text-sm text-neutral-slate">{achievement}</span>
              </div>
            ))}
          </div>
          
          {item.achievements.length > 3 && !isExpanded && (
            <button 
              className="text-xs text-accent-cyan hover:text-cyan-300 transition-colors mt-2"
              onClick={(e) => {
                e.stopPropagation()
                setIsExpanded(true)
              }}
            >
              +{item.achievements.length - 3} more achievements
            </button>
          )}
        </div>
      )}

      {/* Skills */}
      {item.skills && item.skills.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-light-gray mb-3">
            Skills Developed:
          </h4>
          <div className="flex flex-wrap gap-2">
            {item.skills.slice(0, isExpanded ? undefined : 5).map((skill, idx) => (
              <span 
                key={idx}
                className="px-3 py-1 text-xs bg-accent-cyan bg-opacity-10 text-accent-cyan rounded-lg border border-accent-cyan border-opacity-20 hover:bg-opacity-20 transition-colors"
              >
                {skill}
              </span>
            ))}
            {item.skills.length > 5 && !isExpanded && (
              <button 
                className="px-3 py-1 text-xs text-neutral-slate hover:text-accent-cyan transition-colors"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsExpanded(true)
                }}
              >
                +{item.skills.length - 5} more
              </button>
            )}
          </div>
        </div>
      )}

      {/* Projects */}
      {item.projects && item.projects.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-light-gray mb-3">
            Related Projects:
          </h4>
          <div className="space-y-2">
            {item.projects.slice(0, isExpanded ? undefined : 2).map((project, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <span className="text-accent-cyan">🚀</span>
                <span className="text-sm text-neutral-slate">{project}</span>
              </div>
            ))}
          </div>
          
          {item.projects.length > 2 && !isExpanded && (
            <button 
              className="text-xs text-accent-cyan hover:text-cyan-300 transition-colors mt-2"
              onClick={(e) => {
                e.stopPropagation()
                setIsExpanded(true)
              }}
            >
              +{item.projects.length - 2} more projects
            </button>
          )}
        </div>
      )}

      {/* Expand/Collapse Button */}
      {(item.coursework?.length > 6 || item.achievements?.length > 3 || item.skills?.length > 5 || item.projects?.length > 2) && (
        <div className="flex justify-center pt-4 border-t border-neutral-slate border-opacity-20">
          <button 
            className="flex items-center space-x-2 text-sm text-accent-cyan hover:text-cyan-300 transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              setIsExpanded(!isExpanded)
            }}
          >
            <span>{isExpanded ? 'Show Less' : 'Show More'}</span>
            <svg 
              className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      )}

      {/* Enhanced Hover Effects */}
      {isHovered && (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/5 to-transparent rounded-2xl pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-cyan/10 to-transparent rounded-2xl pointer-events-none animate-shimmer" />
        </>
      )}

      {/* Active Item Glow */}
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/10 to-transparent rounded-2xl pointer-events-none animate-pulse" />
      )}

      {/* Tooltip for long descriptions */}
      {showTooltip && item.description && (
        <div 
          ref={tooltipRef}
          className="absolute z-50 p-3 glass-card text-sm max-w-xs -top-2 left-full ml-4 animate-fadeInUp"
          style={{ 
            transform: 'translateY(-50%)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
          }}
        >
          <div className="text-light-gray">
            {item.description.substring(0, 150)}
            {item.description.length > 150 && '...'}
          </div>
          <div className="absolute top-1/2 -left-2 transform -translate-y-1/2">
            <div className="w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-accent-cyan border-opacity-20"></div>
          </div>
        </div>
      )}

      {/* Progress Indicator for Ongoing Items */}
      {item.status === 'ongoing' && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-accent-cyan overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-flow" />
        </div>
      )}

      {/* Completion Badge */}
      {item.status === 'completed' && isHovered && (
        <div className="absolute top-4 right-4 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
          <span className="text-white text-sm">✓</span>
        </div>
      )}

      {/* Click Instruction */}
      {isHovered && (
        <div className="absolute bottom-4 right-4 text-xs text-accent-cyan opacity-70 animate-pulse">
          Double-click for details
        </div>
      )}

      {/* Enhanced Timeline Item Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 timeline-modal backdrop-blur-sm"
          onClick={handleModalClose}
        >
          <div 
            ref={modalRef}
            className="glass-card max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8 timeline-modal-content relative animate-fadeInUp"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleKeyDown}
            tabIndex={0}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <span className="text-5xl animate-bounce">{item.icon}</span>
                  <div className="absolute inset-0 bg-accent-cyan rounded-full opacity-20 animate-ping" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-accent-cyan mb-2">
                    {item.degree || item.title}
                  </h2>
                  <p className="text-xl text-light-gray mb-2">
                    {item.institution || item.subtitle}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-neutral-slate">
                    {item.location && <span>📍 {item.location}</span>}
                    <span>📅 {item.period}</span>
                    {item.status && (
                      <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(item.status)}`}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <button 
                onClick={handleModalClose}
                className="text-neutral-slate hover:text-light-gray transition-colors text-2xl p-2 hover:bg-accent-cyan hover:bg-opacity-10 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Modal Content Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Description */}
                <div className="timeline-modal-section">
                  <h3 className="text-xl font-semibold text-light-gray mb-4 flex items-center">
                    <span className="mr-2">📖</span>
                    Overview
                  </h3>
                  <p className="text-neutral-slate leading-relaxed">
                    {item.description || 'No description available.'}
                  </p>
                </div>

                {/* Academic Performance */}
                <div className="timeline-modal-section">
                  <h3 className="text-xl font-semibold text-light-gray mb-4 flex items-center">
                    <span className="mr-2">📊</span>
                    Academic Performance
                  </h3>
                  <div className="glass-card p-6 bg-gradient-to-br from-accent-cyan/5 to-transparent">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-accent-cyan mb-1">
                          {item.cgpa || item.percentage || 'N/A'}
                        </div>
                        <div className="text-sm text-neutral-slate">
                          {item.cgpa ? 'CGPA' : 'Percentage'}
                        </div>
                      </div>
                      {item.stream && (
                        <div className="text-center">
                          <div className="text-lg font-semibold text-light-gray mb-1">
                            {item.stream}
                          </div>
                          <div className="text-sm text-neutral-slate">Stream</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Timeline Progress */}
                <div className="timeline-modal-section">
                  <h3 className="text-xl font-semibold text-light-gray mb-4 flex items-center">
                    <span className="mr-2">⏱️</span>
                    Timeline Progress
                  </h3>
                  <div className="relative">
                    <div className="w-full h-2 bg-neutral-slate bg-opacity-20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-accent-cyan to-cyan-600 rounded-full transition-all duration-1000 ease-out"
                        style={{ 
                          width: item.status === 'completed' ? '100%' : 
                                 item.status === 'ongoing' ? '70%' : '0%' 
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-neutral-slate mt-2">
                      <span>Started</span>
                      <span>{item.status === 'completed' ? 'Completed' : 'In Progress'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Coursework/Subjects */}
                {(item.coursework || item.subjects) && (
                  <div className="timeline-modal-section">
                    <h3 className="text-xl font-semibold text-light-gray mb-4 flex items-center">
                      <span className="mr-2">📚</span>
                      {item.coursework ? 'Coursework' : 'Subjects'}
                    </h3>
                    <div className="grid grid-cols-1 gap-3 max-h-48 overflow-y-auto">
                      {(item.coursework || item.subjects).map((course, idx) => (
                        <div 
                          key={idx}
                          className="flex items-center space-x-3 p-3 glass-card hover:bg-accent-cyan hover:bg-opacity-5 transition-colors"
                        >
                          <span className="w-2 h-2 bg-accent-cyan rounded-full flex-shrink-0"></span>
                          <span className="text-neutral-slate">{course}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Achievements */}
                {item.achievements && item.achievements.length > 0 && (
                  <div className="timeline-modal-section">
                    <h3 className="text-xl font-semibold text-light-gray mb-4 flex items-center">
                      <span className="mr-2">🏆</span>
                      Achievements
                    </h3>
                    <div className="space-y-3">
                      {item.achievements.map((achievement, idx) => (
                        <div 
                          key={idx} 
                          className="flex items-start space-x-3 p-3 glass-card hover:scale-102 transition-transform"
                        >
                          <span className="text-accent-cyan mt-1 text-lg">🎯</span>
                          <span className="text-neutral-slate">{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skills */}
                {item.skills && item.skills.length > 0 && (
                  <div className="timeline-modal-section">
                    <h3 className="text-xl font-semibold text-light-gray mb-4 flex items-center">
                      <span className="mr-2">🛠️</span>
                      Skills Developed
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {item.skills.map((skill, idx) => (
                        <span 
                          key={idx}
                          className="px-4 py-2 text-sm bg-accent-cyan bg-opacity-10 text-accent-cyan rounded-lg border border-accent-cyan border-opacity-20 hover:bg-opacity-20 transition-colors cursor-default"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Projects */}
                {item.projects && item.projects.length > 0 && (
                  <div className="timeline-modal-section">
                    <h3 className="text-xl font-semibold text-light-gray mb-4 flex items-center">
                      <span className="mr-2">🚀</span>
                      Related Projects
                    </h3>
                    <div className="space-y-3">
                      {item.projects.map((project, idx) => (
                        <div 
                          key={idx} 
                          className="flex items-center space-x-3 p-3 glass-card hover:bg-accent-cyan hover:bg-opacity-5 transition-colors"
                        >
                          <span className="text-accent-cyan text-lg">💡</span>
                          <span className="text-neutral-slate">{project}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-8 border-t border-neutral-slate border-opacity-20 mt-8">
              <div className="text-sm text-neutral-slate">
                Timeline Item {index + 1}
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleModalClose}
                  className="btn-secondary px-6 py-2"
                >
                  Close Details
                </button>
                {item.externalLink && (
                  <a
                    href={item.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary px-6 py-2 inline-flex items-center space-x-2"
                  >
                    <span>View More</span>
                    <span>↗</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TimelineItem