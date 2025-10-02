import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useIntersectionObserverSingle } from '../../hooks/useIntersectionObserver'

const Timeline = ({ 
  items = [], 
  orientation = 'vertical', 
  showConnector = true,
  animated = true,
  className = '',
  onItemClick = null,
  progressiveReveal = true,
  autoPlay = false,
  playSpeed = 3000
}) => {
  const [visibleItems, setVisibleItems] = useState(new Set())
  const [activeItem, setActiveItem] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [connectorProgress, setConnectorProgress] = useState(0)
  const timelineRef = useRef(null)
  const itemRefs = useRef([])
  const autoPlayRef = useRef(null)
  
  const elementRef = useRef(null)
  const { isIntersecting } = useIntersectionObserverSingle(elementRef, {
    threshold: 0.2,
    triggerOnce: true
  })

  // Enhanced progressive reveal with scroll-triggered animations
  useEffect(() => {
    if (!isIntersecting || !animated) {
      if (!animated) {
        setVisibleItems(new Set(items.map((_, index) => index)))
        setConnectorProgress(100)
      }
      return
    }

    if (progressiveReveal) {
      // Create enhanced intersection observers for each timeline item
      const observers = []
      let revealedCount = 0
      
      items.forEach((_, index) => {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting && !visibleItems.has(index)) {
              // Staggered reveal with smooth animations
              setTimeout(() => {
                setVisibleItems(prev => {
                  const newSet = new Set([...prev, index])
                  
                  // Update connector progress smoothly
                  const progress = (newSet.size / items.length) * 100
                  setConnectorProgress(progress)
                  
                  return newSet
                })
                
                // Set active item with delay for better UX
                setTimeout(() => {
                  setActiveItem(index)
                }, 300)
                
                revealedCount++
                
                // Trigger cascade effect for nearby items
                if (index > 0 && !visibleItems.has(index - 1)) {
                  setTimeout(() => {
                    setVisibleItems(prev => new Set([...prev, index - 1]))
                  }, 100)
                }
              }, Math.min(index * 150, 800)) // Cap delay to prevent too long waits
            }
          },
          { 
            threshold: 0.2,
            rootMargin: '-30px 0px -30px 0px'
          }
        )
        
        if (itemRefs.current[index]) {
          observer.observe(itemRefs.current[index])
        }
        observers.push(observer)
      })

      return () => {
        observers.forEach(observer => observer.disconnect())
      }
    } else {
      // Enhanced staggered animation with smooth progression
      let revealIndex = 0
      const revealInterval = setInterval(() => {
        if (revealIndex < items.length) {
          setVisibleItems(prev => new Set([...prev, revealIndex]))
          
          // Smooth connector progress
          const progress = ((revealIndex + 1) / items.length) * 100
          setConnectorProgress(progress)
          
          revealIndex++
        } else {
          clearInterval(revealInterval)
        }
      }, 200)
      
      return () => clearInterval(revealInterval)
    }
  }, [isIntersecting, items, animated, progressiveReveal, visibleItems])

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && autoPlay) {
      autoPlayRef.current = setInterval(() => {
        setActiveItem(prev => (prev + 1) % items.length)
      }, playSpeed)
    } else {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [isPlaying, autoPlay, items.length, playSpeed])

  // Handle item click with enhanced interactions
  const handleItemClick = useCallback((item, index, event) => {
    setActiveItem(index)
    setIsPlaying(false) // Pause auto-play on interaction
    
    // Add ripple effect
    const rect = event.currentTarget.getBoundingClientRect()
    const ripple = document.createElement('div')
    const size = Math.max(rect.width, rect.height)
    const x = event.clientX - rect.left - size / 2
    const y = event.clientY - rect.top - size / 2
    
    ripple.style.width = ripple.style.height = size + 'px'
    ripple.style.left = x + 'px'
    ripple.style.top = y + 'px'
    ripple.classList.add('timeline-ripple')
    
    event.currentTarget.appendChild(ripple)
    
    setTimeout(() => {
      ripple.remove()
    }, 600)
    
    if (onItemClick) {
      onItemClick(item, index)
    }
  }, [onItemClick])

  // Scroll to specific timeline item
  const scrollToItem = useCallback((index) => {
    if (itemRefs.current[index]) {
      itemRefs.current[index].scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
      setActiveItem(index)
    }
  }, [])

  // Toggle auto-play
  const toggleAutoPlay = useCallback(() => {
    setIsPlaying(prev => !prev)
  }, [])

  const isVertical = orientation === 'vertical'

  return (
    <div 
      ref={elementRef}
      className={`timeline ${isVertical ? 'timeline-vertical' : 'timeline-horizontal'} ${className}`}
    >
      {/* Timeline Controls */}
      {(autoPlay || items.length > 3) && (
        <div className="timeline-controls flex items-center justify-center mb-8 space-x-4">
          {autoPlay && (
            <button
              onClick={toggleAutoPlay}
              className="glass-button px-4 py-2 rounded-lg text-sm"
            >
              {isPlaying ? '⏸️ Pause' : '▶️ Play'}
            </button>
          )}
          
          {/* Timeline Navigation Dots */}
          <div className="flex space-x-2">
            {items.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToItem(index)}
                className={`
                  w-3 h-3 rounded-full transition-all duration-300
                  ${activeItem === index 
                    ? 'bg-accent-cyan shadow-glow scale-125' 
                    : 'bg-neutral-slate bg-opacity-30 hover:bg-accent-cyan hover:bg-opacity-50'
                  }
                `}
              />
            ))}
          </div>
        </div>
      )}

      {/* Timeline Progress Bar */}
      {isVertical && showConnector && (
        <div className="timeline-progress-container absolute left-6 top-0 bottom-0 w-0.5 bg-neutral-slate bg-opacity-20">
          <div 
            className="timeline-progress-fill w-full bg-gradient-to-b from-accent-cyan to-cyan-600 transition-all duration-1000 ease-out"
            style={{ height: `${connectorProgress}%` }}
          />
        </div>
      )}

      <div 
        ref={timelineRef}
        className={`timeline-container ${isVertical ? 'flex flex-col' : 'flex flex-row overflow-x-auto'}`}
      >
        {items.map((item, index) => (
          <div
            key={item.id || index}
            ref={el => itemRefs.current[index] = el}
            className={`timeline-item-wrapper ${isVertical ? 'mb-8 last:mb-0' : 'mr-8 last:mr-0 flex-shrink-0'}`}
          >
            {/* Timeline Item */}
            <div
              className={`
                timeline-item relative transition-all duration-700 ease-out overflow-hidden
                ${visibleItems.has(index) ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}
                ${activeItem === index ? 'timeline-item-active' : ''}
                ${onItemClick ? 'cursor-pointer' : ''}
              `}
              style={{ 
                transitionDelay: animated ? `${index * 100}ms` : '0ms' 
              }}
              onClick={(e) => handleItemClick(item, index, e)}
            >
              {/* Timeline Node */}
              <div className={`
                timeline-node absolute z-10 flex items-center justify-center
                w-12 h-12 rounded-full border-4 transition-all duration-500
                ${activeItem === index 
                  ? 'border-accent-cyan bg-accent-cyan text-primary-dark shadow-glow scale-125 animate-pulse' 
                  : 'border-accent-cyan bg-primary-dark hover:scale-110'
                }
                ${visibleItems.has(index) ? 'shadow-glow' : ''}
                ${isVertical ? 'left-0 top-0 transform -translate-x-1/2' : 'top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2'}
              `}
              style={{
                boxShadow: activeItem === index 
                  ? '0 0 0 8px rgba(34, 211, 238, 0.2), 0 0 20px rgba(34, 211, 238, 0.5)' 
                  : undefined
              }}
              >
                <span className={`text-lg transition-all duration-300 ${
                  activeItem === index ? 'scale-110' : ''
                }`}>
                  {item.icon || '📍'}
                </span>
                
                {/* Node Pulse Animation */}
                {activeItem === index && (
                  <div className="absolute inset-0 rounded-full border-4 border-accent-cyan animate-ping opacity-30" />
                )}
              </div>

              {/* Timeline Connector */}
              {showConnector && index < items.length - 1 && !isVertical && (
                <div className={`
                  timeline-connector absolute transition-all duration-1000
                  ${isVertical 
                    ? 'left-0 top-12 w-0.5 h-full transform -translate-x-1/2' 
                    : 'top-0 left-12 h-0.5 w-full transform -translate-y-1/2'
                  }
                  ${visibleItems.has(index + 1) 
                    ? 'opacity-100 scale-100 bg-gradient-to-r from-accent-cyan to-cyan-600' 
                    : 'opacity-30 scale-75 bg-neutral-slate'
                  }
                `} 
                style={{ 
                  transformOrigin: isVertical ? 'top' : 'left',
                  transitionDelay: animated ? `${(index + 1) * 100}ms` : '0ms'
                }}
                >
                  {/* Animated Flow Effect */}
                  {visibleItems.has(index + 1) && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-flow" />
                  )}
                </div>
              )}

              {/* Timeline Content */}
              <div className={`
                timeline-content ml-8 
                ${isVertical ? 'pl-8' : 'pt-8'}
              `}>
                {/* Render the item content */}
                {typeof item === 'object' && item.render ? (
                  item.render(item, index, visibleItems.has(index))
                ) : (
                  <div className="glass-card p-6 hover:scale-102 transition-all duration-300">
                    {/* Default content rendering */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-heading-4 font-semibold text-light-gray mb-1">
                          {item.title || item.degree || 'Timeline Item'}
                        </h3>
                        <p className="text-accent-cyan font-medium">
                          {item.subtitle || item.institution || ''}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-neutral-slate">
                          {item.period || item.date || ''}
                        </span>
                        {item.status && (
                          <div className={`
                            inline-block px-2 py-1 text-xs rounded-full ml-2
                            ${item.status === 'ongoing' 
                              ? 'bg-green-500 bg-opacity-20 text-green-400' 
                              : 'bg-blue-500 bg-opacity-20 text-blue-400'
                            }
                          `}>
                            {item.status}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {item.description && (
                      <p className="text-neutral-slate mb-4">
                        {item.description}
                      </p>
                    )}
                    
                    {/* Additional content based on item properties */}
                    {item.achievements && item.achievements.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-light-gray mb-2">Key Achievements:</h4>
                        <ul className="text-sm text-neutral-slate space-y-1">
                          {item.achievements.slice(0, 3).map((achievement, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="text-accent-cyan mr-2">•</span>
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {item.skills && item.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {item.skills.slice(0, 4).map((skill, idx) => (
                          <span 
                            key={idx}
                            className="px-2 py-1 text-xs bg-accent-cyan bg-opacity-10 text-accent-cyan rounded border border-accent-cyan border-opacity-20"
                          >
                            {skill}
                          </span>
                        ))}
                        {item.skills.length > 4 && (
                          <span className="px-2 py-1 text-xs text-neutral-slate">
                            +{item.skills.length - 4} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Timeline Summary */}
      {items.length > 0 && (
        <div className={`
          timeline-summary mt-12 text-center transition-all duration-1000 delay-500
          ${isIntersecting ? 'animate-fadeInUp opacity-100' : 'opacity-0 translate-y-8'}
        `}>
          <div className="glass-card inline-block px-6 py-3">
            <span className="text-sm text-neutral-slate">
              {items.length} milestone{items.length !== 1 ? 's' : ''} in educational journey
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default Timeline