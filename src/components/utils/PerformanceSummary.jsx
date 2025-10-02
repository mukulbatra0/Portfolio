import React, { useState, useEffect } from 'react'
import { monitorMemory, performanceMonitor } from '../../utils/performance'

const PerformanceSummary = ({ showInDev = true }) => {
  const [metrics, setMetrics] = useState({
    memory: null,
    loadTime: 0,
    fps: 0,
    isVisible: false
  })

  useEffect(() => {
    if (!showInDev && process.env.NODE_ENV !== 'development') return

    // Measure initial load time
    const loadTime = performance.now()
    setMetrics(prev => ({ ...prev, loadTime: Math.round(loadTime) }))

    // Monitor memory usage
    const memoryInterval = setInterval(() => {
      const memory = monitorMemory()
      setMetrics(prev => ({ ...prev, memory }))
    }, 5000)

    // Keyboard shortcut to toggle visibility (Ctrl/Cmd + Shift + P)
    const handleKeyPress = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'P') {
        setMetrics(prev => ({ ...prev, isVisible: !prev.isVisible }))
      }
    }

    document.addEventListener('keydown', handleKeyPress)

    return () => {
      clearInterval(memoryInterval)
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [showInDev])

  if (!metrics.isVisible || (!showInDev && process.env.NODE_ENV !== 'development')) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black/80 backdrop-blur-sm text-white p-4 rounded-lg text-xs font-mono border border-white/20">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-cyan-400">Performance</h3>
        <button
          onClick={() => setMetrics(prev => ({ ...prev, isVisible: false }))}
          className="text-white/60 hover:text-white"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-1">
        <div>Load Time: {metrics.loadTime}ms</div>
        
        {metrics.memory && (
          <>
            <div>Memory: {metrics.memory.used}MB / {metrics.memory.limit}MB</div>
            <div className="w-full bg-gray-700 rounded-full h-1">
              <div 
                className="bg-cyan-400 h-1 rounded-full transition-all duration-300"
                style={{ width: `${(metrics.memory.used / metrics.memory.limit) * 100}%` }}
              />
            </div>
          </>
        )}
        
        <div className="text-white/60 text-[10px] mt-2">
          Press Ctrl+Shift+P to toggle
        </div>
      </div>
    </div>
  )
}

export default PerformanceSummary