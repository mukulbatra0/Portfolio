import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePerformanceMonitor } from '../../hooks/usePerformanceMonitor';

const PerformanceMonitor = ({ 
  showDetails = false, 
  position = 'top-left',
  onPerformanceChange = null 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  
  const {
    metrics,
    getPerformanceRecommendations,
    getAdaptiveSettings
  } = usePerformanceMonitor({
    enableFPSMonitoring: true,
    enableMemoryMonitoring: true,
    enableRenderTimeMonitoring: true,
    fpsThreshold: 30,
    memoryThreshold: 100,
    updateInterval: 1000
  });

  const recommendations = getPerformanceRecommendations();
  const adaptiveSettings = getAdaptiveSettings();

  // Notify parent component of performance changes
  useEffect(() => {
    if (onPerformanceChange) {
      onPerformanceChange({
        metrics,
        recommendations,
        adaptiveSettings,
        isLowPerformance: metrics.isLowPerformance
      });
    }
  }, [metrics, recommendations, adaptiveSettings, onPerformanceChange]);

  const getPerformanceColor = (value, thresholds) => {
    if (value >= thresholds.good) return 'text-green-400';
    if (value >= thresholds.medium) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getFPSColor = () => getPerformanceColor(metrics.fps, { good: 50, medium: 30 });
  const getMemoryColor = () => {
    if (!metrics.memory) return 'text-slate-400';
    return getPerformanceColor(100 - (metrics.memory.used / metrics.memory.limit * 100), { good: 70, medium: 50 });
  };

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  };

  if (!showDetails && !metrics.isLowPerformance) {
    return null;
  }

  return (
    <div className={`fixed ${positionClasses[position]} z-50`}>
      <motion.div
        className="bg-black/80 backdrop-blur-sm text-white rounded-lg border border-white/20 overflow-hidden"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Compact View */}
        <div 
          className="p-3 cursor-pointer flex items-center space-x-3"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {/* Performance Indicator */}
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              metrics.isLowPerformance ? 'bg-red-400' : 'bg-green-400'
            }`} />
            <span className="text-xs font-mono">
              {metrics.fps}fps
            </span>
          </div>
          
          {/* Expand/Collapse Icon */}
          <motion.svg
            className="w-4 h-4 text-slate-400"
            fill="currentColor"
            viewBox="0 0 24 24"
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
          </motion.svg>
        </div>

        {/* Expanded View */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-white/20"
            >
              <div className="p-4 space-y-4">
                {/* Performance Metrics */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-white">Performance Metrics</h4>
                  
                  {/* FPS */}
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-300">FPS:</span>
                    <span className={`text-xs font-mono ${getFPSColor()}`}>
                      {metrics.fps}
                    </span>
                  </div>
                  
                  {/* Memory */}
                  {metrics.memory && (
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-300">Memory:</span>
                      <span className={`text-xs font-mono ${getMemoryColor()}`}>
                        {metrics.memory.used}MB / {metrics.memory.limit}MB
                      </span>
                    </div>
                  )}
                  
                  {/* Render Time */}
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-300">Render:</span>
                    <span className={`text-xs font-mono ${
                      metrics.renderTime > 16.67 ? 'text-red-400' : 'text-green-400'
                    }`}>
                      {metrics.renderTime.toFixed(1)}ms
                    </span>
                  </div>
                  
                  {/* Load Time */}
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-300">Load:</span>
                    <span className={`text-xs font-mono ${
                      metrics.loadTime > 3000 ? 'text-red-400' : 'text-green-400'
                    }`}>
                      {(metrics.loadTime / 1000).toFixed(1)}s
                    </span>
                  </div>
                </div>

                {/* Adaptive Settings */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-white">Current Settings</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="text-slate-300">
                      Particles: <span className="text-cyan-400">{adaptiveSettings.particleCount}</span>
                    </div>
                    <div className="text-slate-300">
                      Shadows: <span className="text-cyan-400">{adaptiveSettings.shadowQuality}</span>
                    </div>
                    <div className="text-slate-300">
                      Textures: <span className="text-cyan-400">{adaptiveSettings.textureQuality}</span>
                    </div>
                    <div className="text-slate-300">
                      AA: <span className="text-cyan-400">{adaptiveSettings.antialiasing ? 'On' : 'Off'}</span>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                {recommendations.length > 0 && (
                  <div className="space-y-2">
                    <button
                      onClick={() => setShowRecommendations(!showRecommendations)}
                      className="flex items-center justify-between w-full text-sm font-semibold text-yellow-400 hover:text-yellow-300 transition-colors"
                    >
                      <span>Recommendations ({recommendations.length})</span>
                      <motion.svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        animate={{ rotate: showRecommendations ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
                      </motion.svg>
                    </button>
                    
                    <AnimatePresence>
                      {showRecommendations && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-2"
                        >
                          {recommendations.map((rec, index) => (
                            <div
                              key={index}
                              className={`p-2 rounded text-xs border-l-2 ${
                                rec.severity === 'high' ? 'border-red-400 bg-red-400/10' :
                                rec.severity === 'medium' ? 'border-yellow-400 bg-yellow-400/10' :
                                'border-blue-400 bg-blue-400/10'
                              }`}
                            >
                              <div className={`font-medium ${
                                rec.severity === 'high' ? 'text-red-400' :
                                rec.severity === 'medium' ? 'text-yellow-400' :
                                'text-blue-400'
                              }`}>
                                {rec.type.toUpperCase()}
                              </div>
                              <div className="text-slate-300 mt-1">
                                {rec.message}
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-2 pt-2 border-t border-white/20">
                  <button
                    onClick={() => window.location.reload()}
                    className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded hover:bg-cyan-500/30 transition-colors"
                  >
                    Refresh
                  </button>
                  <button
                    onClick={() => {
                      // Toggle performance mode
                      const event = new CustomEvent('togglePerformanceMode');
                      window.dispatchEvent(event);
                    }}
                    className="px-3 py-1 bg-purple-500/20 text-purple-400 text-xs rounded hover:bg-purple-500/30 transition-colors"
                  >
                    Optimize
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default PerformanceMonitor;