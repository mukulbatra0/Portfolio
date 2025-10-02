import { useState, useEffect, useCallback, useRef } from 'react'

export const useTimelineAnimations = ({
  items = [],
  autoPlay = false,
  playSpeed = 3000,
  progressiveReveal = true
}) => {
  const [visibleItems, setVisibleItems] = useState(new Set())
  const [activeItem, setActiveItem] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [connectorProgress, setConnectorProgress] = useState(0)
  const [animationPhase, setAnimationPhase] = useState('idle') // 'idle', 'revealing', 'complete'
  
  const autoPlayRef = useRef(null)
  const itemRefs = useRef([])
  const observersRef = useRef([])

  // Progressive reveal with intersection observers
  const initializeProgressiveReveal = useCallback(() => {
    if (!progressiveReveal || items.length === 0) return

    setAnimationPhase('revealing')
    
    // Clean up existing observers
    observersRef.current.forEach(observer => observer.disconnect())
    observersRef.current = []

    items.forEach((_, index) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setVisibleItems(prev => {
                const newSet = new Set([...prev, index])
                
                // Update connector progress
                const progress = (newSet.size / items.length) * 100
                setConnectorProgress(progress)
                
                // Set active item to the latest revealed
                setActiveItem(index)
                
                // Check if all items are revealed
                if (newSet.size === items.length) {
                  setAnimationPhase('complete')
                }
                
                return newSet
              })
            }, index * 150)
          }
        },
        { 
          threshold: 0.3,
          rootMargin: '-50px 0px -50px 0px'
        }
      )
      
      if (itemRefs.current[index]) {
        observer.observe(itemRefs.current[index])
      }
      observersRef.current.push(observer)
    })
  }, [items, progressiveReveal])

  // Standard staggered reveal
  const initializeStaggeredReveal = useCallback(() => {
    if (progressiveReveal || items.length === 0) return

    setAnimationPhase('revealing')
    
    items.forEach((_, index) => {
      setTimeout(() => {
        setVisibleItems(prev => new Set([...prev, index]))
      }, index * 200)
    })
    
    // Animate connector progress
    setTimeout(() => {
      setConnectorProgress(100)
      setAnimationPhase('complete')
    }, items.length * 200)
  }, [items, progressiveReveal])

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && autoPlay && animationPhase === 'complete') {
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
  }, [isPlaying, autoPlay, items.length, playSpeed, animationPhase])

  // Initialize animations
  useEffect(() => {
    if (progressiveReveal) {
      initializeProgressiveReveal()
    } else {
      initializeStaggeredReveal()
    }

    return () => {
      observersRef.current.forEach(observer => observer.disconnect())
    }
  }, [initializeProgressiveReveal, initializeStaggeredReveal])

  // Control functions
  const toggleAutoPlay = useCallback(() => {
    setIsPlaying(prev => !prev)
  }, [])

  const goToItem = useCallback((index) => {
    if (index >= 0 && index < items.length) {
      setActiveItem(index)
      setIsPlaying(false) // Pause auto-play on manual navigation
      
      // Scroll to item if ref exists
      if (itemRefs.current[index]) {
        itemRefs.current[index].scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        })
      }
    }
  }, [items.length])

  const nextItem = useCallback(() => {
    const nextIndex = (activeItem + 1) % items.length
    goToItem(nextIndex)
  }, [activeItem, items.length, goToItem])

  const prevItem = useCallback(() => {
    const prevIndex = (activeItem - 1 + items.length) % items.length
    goToItem(prevIndex)
  }, [activeItem, items.length, goToItem])

  const resetAnimation = useCallback(() => {
    setVisibleItems(new Set())
    setActiveItem(0)
    setConnectorProgress(0)
    setAnimationPhase('idle')
    setIsPlaying(autoPlay)
  }, [autoPlay])

  // Reveal all items instantly
  const revealAll = useCallback(() => {
    setVisibleItems(new Set(items.map((_, index) => index)))
    setConnectorProgress(100)
    setAnimationPhase('complete')
  }, [items])

  // Set item ref
  const setItemRef = useCallback((index, element) => {
    itemRefs.current[index] = element
  }, [])

  return {
    // State
    visibleItems,
    activeItem,
    isPlaying,
    connectorProgress,
    animationPhase,
    
    // Controls
    toggleAutoPlay,
    goToItem,
    nextItem,
    prevItem,
    resetAnimation,
    revealAll,
    setItemRef,
    
    // Utilities
    isItemVisible: (index) => visibleItems.has(index),
    isItemActive: (index) => activeItem === index,
    getAnimationDelay: (index) => index * 150,
    getVisibilityProgress: () => (visibleItems.size / items.length) * 100
  }
}

export default useTimelineAnimations