import { useEffect, useRef } from 'react'
import { performanceMonitor, monitorMemory } from '../../utils/performance'

const PerformanceMonitor = ({ enabled = process.env.NODE_ENV === 'development' }) => {
  const frameCountRef = useRef(0)
  const lastTimeRef = useRef(performance.now())
  const fpsRef = useRef(0)

  useEffect(() => {
    if (!enabled) return

    let animationId

    const measureFPS = () => {
      frameCountRef.current++
      const now = performance.now()
      
      if (now - lastTimeRef.current >= 1000) {
        fpsRef.current = Math.round((frameCountRef.current * 1000) / (now - lastTimeRef.current))
        frameCountRef.current = 0
        lastTimeRef.current = now

        // Log performance warnings
        if (fpsRef.current < 30) {
          console.warn(`Low FPS detected: ${fpsRef.current}fps`)
        }

        // Monitor memory usage
        const memory = monitorMemory()
        if (memory && memory.used > memory.limit * 0.8) {
          console.warn(`High memory usage: ${memory.used}MB / ${memory.limit}MB`)
        }
      }

      animationId = requestAnimationFrame(measureFPS)
    }

    animationId = requestAnimationFrame(measureFPS)

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [enabled])

  // Monitor long tasks
  useEffect(() => {
    if (!enabled || !window.PerformanceObserver) return

    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.duration > 50) {
          console.warn(`Long task detected: ${entry.duration.toFixed(2)}ms`)
        }
      })
    })

    try {
      observer.observe({ entryTypes: ['longtask'] })
    } catch (e) {
      // Longtask API not supported
    }

    return () => observer.disconnect()
  }, [enabled])

  // Monitor layout shifts
  useEffect(() => {
    if (!enabled || !window.PerformanceObserver) return

    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.value > 0.1) {
          console.warn(`Layout shift detected: ${entry.value.toFixed(4)}`)
        }
      })
    })

    try {
      observer.observe({ entryTypes: ['layout-shift'] })
    } catch (e) {
      // Layout shift API not supported
    }

    return () => observer.disconnect()
  }, [enabled])

  return null
}

export default PerformanceMonitor