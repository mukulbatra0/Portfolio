import React, { useRef, useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSpline } from '../../hooks/useSpline';
import { usePerformanceMonitor } from '../../hooks/usePerformanceMonitor';
import { useAdaptiveQuality } from '../../hooks/useAdaptiveQuality';
import { 
  isSplineSupported, 
  getOptimalSplineSettings, 
  createSplineFallback,
  optimizeSplineScene 
} from '../../utils/splineHelpers';
import LoadingSpinner from '../ui/LoadingSpinner';

const OptimizedSplineModel = ({
  scene,
  className = "",
  enableLOD = true,
  enablePerformanceMonitoring = true,
  adaptiveQuality = true,
  interactionThreshold = 30, // FPS threshold for disabling interactions
  fallbackComponent = null,
  onPerformanceChange = null,
  ...props
}) => {
  const [isInView, setIsInView] = useState(false);
  const [performanceLevel, setPerformanceLevel] = useState('high');
  const [shouldRender, setShouldRender] = useState(true);
  const intersectionRef = useRef(null);
  const fallbackRef = useRef(null);

  // Performance monitoring
  const { metrics } = usePerformanceMonitor({
    enableFPSMonitoring: enablePerformanceMonitoring,
    enableMemoryMonitoring: enablePerformanceMonitoring,
    fpsThreshold: interactionThreshold
  });

  // Adaptive quality management
  const { 
    qualitySettings, 
    updateQualitySettings,
    getRecommendations 
  } = useAdaptiveQuality();

  // Spline integration with optimized settings
  const splineOptions = useMemo(() => ({
    enableInteraction: metrics.fps > interactionThreshold && isInView,
    autoRotate: false,
    onLoad: (app) => {
      // Apply initial optimizations
      optimizeSplineScene(app, qualitySettings);
      
      // Setup LOD if enabled
      if (enableLOD) {
        setupLevelOfDetail(app);
      }
    },
    onError: (error) => {
      console.warn('Spline model failed to load:', error);
      setShouldRender(false);
    }
  }), [metrics.fps, interactionThreshold, isInView, qualitySettings, enableLOD]);

  const {
    containerRef,
    splineApp,
    isLoading,
    isLoaded,
    error,
    getObjectByName,
    setObjectProperty
  } = useSpline(scene, splineOptions);

  // Intersection Observer for viewport detection
  useEffect(() => {
    if (!intersectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
        
        // Pause/resume Spline rendering based on visibility
        if (splineApp) {
          try {
            if (entry.isIntersecting) {
              splineApp.play();
            } else {
              splineApp.pause();
            }
          } catch (error) {
            // Silently handle if play/pause methods don't exist
          }
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    observer.observe(intersectionRef.current);
    return () => observer.disconnect();
  }, [splineApp]);

  // Performance-based quality adjustment
  useEffect(() => {
    if (!adaptiveQuality || !splineApp) return;

    updateQualitySettings(metrics);
    
    // Apply new quality settings to Spline
    optimizeSplineScene(splineApp, qualitySettings);
    
    // Notify parent of performance changes
    if (onPerformanceChange) {
      onPerformanceChange({
        metrics,
        qualitySettings,
        recommendations: getRecommendations(metrics),
        performanceLevel
      });
    }
  }, [metrics, adaptiveQuality, splineApp, qualitySettings, updateQualitySettings, getRecommendations, performanceLevel, onPerformanceChange]);

  // Level of Detail (LOD) implementation
  const setupLevelOfDetail = (app) => {
    if (!app || !containerRef.current) return;

    const updateLOD = () => {
      const distance = calculateViewerDistance();
      const lodLevel = getLODLevel(distance, metrics.fps);
      
      applyLODSettings(app, lodLevel);
    };

    // Update LOD based on performance and distance
    const lodInterval = setInterval(updateLOD, 1000);
    
    return () => clearInterval(lodInterval);
  };

  const calculateViewerDistance = () => {
    // Simplified distance calculation based on viewport size
    if (!containerRef.current) return 1;
    
    const rect = containerRef.current.getBoundingClientRect();
    const viewportArea = window.innerWidth * window.innerHeight;
    const elementArea = rect.width * rect.height;
    
    return viewportArea / elementArea;
  };

  const getLODLevel = (distance, fps) => {
    if (fps < 20 || distance > 4) return 'low';
    if (fps < 40 || distance > 2) return 'medium';
    return 'high';
  };

  const applyLODSettings = (app, level) => {
    const settings = {
      low: {
        quality: 0.5,
        shadows: false,
        reflections: false,
        particleCount: 0.3
      },
      medium: {
        quality: 0.75,
        shadows: true,
        reflections: false,
        particleCount: 0.6
      },
      high: {
        quality: 1,
        shadows: true,
        reflections: true,
        particleCount: 1
      }
    };

    const currentSettings = settings[level];
    optimizeSplineScene(app, currentSettings);
    
    // Update particle systems if they exist
    const particleSystem = getObjectByName('Particles');
    if (particleSystem && particleSystem.material) {
      particleSystem.material.opacity = currentSettings.particleCount;
    }
  };

  // Memory management
  useEffect(() => {
    const handleMemoryPressure = () => {
      if (metrics.memory && metrics.memory.used > 150) { // 150MB threshold
        // Reduce quality to free memory
        if (splineApp) {
          optimizeSplineScene(splineApp, {
            quality: 0.5,
            shadows: false,
            reflections: false,
            postProcessing: false
          });
        }
      }
    };

    // Listen for memory pressure events (if supported)
    if ('memory' in performance) {
      const memoryInterval = setInterval(handleMemoryPressure, 5000);
      return () => clearInterval(memoryInterval);
    }
  }, [metrics.memory, splineApp]);

  // Error boundary and fallback handling
  useEffect(() => {
    if (error && !fallbackRef.current && containerRef.current) {
      const fallback = createSplineFallback(containerRef.current, {
        message: "3D model temporarily unavailable",
        showRetry: true,
        onRetry: () => {
          setShouldRender(true);
          window.location.reload(); // Simple retry mechanism
        }
      });
      
      fallbackRef.current = fallback;
    }
  }, [error]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (fallbackRef.current) {
        fallbackRef.current.dispose();
      }
    };
  }, []);

  // Check if Spline is supported
  if (!isSplineSupported() || !shouldRender) {
    if (fallbackComponent) {
      return fallbackComponent;
    }
    
    return (
      <div className={`flex items-center justify-center bg-slate-800/50 rounded-lg border border-slate-700 ${className}`}>
        <div className="text-center p-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-slate-700 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M11,16.5L6.5,12L7.91,10.59L11,13.67L16.59,8.09L18,9.5L11,16.5Z"/>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">3D Model Unavailable</h3>
          <p className="text-slate-400 text-sm">
            Your device doesn't support advanced 3D graphics or the model failed to load.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={intersectionRef}
      className={`relative ${className}`}
      {...props}
    >
      {/* Spline Container */}
      <motion.div
        ref={containerRef}
        className="w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        style={{ minHeight: '400px' }}
      />

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 rounded-lg">
          <LoadingSpinner 
            size="large" 
            color="cyan" 
            text="Loading optimized 3D model..."
          />
        </div>
      )}

      {/* Performance Indicator */}
      {enablePerformanceMonitoring && isLoaded && (
        <motion.div
          className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              metrics.fps > 45 ? 'bg-green-400' :
              metrics.fps > 30 ? 'bg-yellow-400' : 'bg-red-400'
            }`} />
            <span>{metrics.fps}fps</span>
            <span className="text-slate-400">|</span>
            <span>{qualitySettings.qualityLevel || 'auto'}</span>
          </div>
        </motion.div>
      )}

      {/* Interaction Status */}
      {isLoaded && (
        <motion.div
          className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: isInView ? 1 : 0.5,
            y: 0 
          }}
          transition={{ delay: 1.5 }}
        >
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
            </svg>
            <span>
              {metrics.fps > interactionThreshold && isInView 
                ? 'Interactive mode' 
                : 'Performance mode'
              }
            </span>
          </div>
        </motion.div>
      )}

      {/* Quality Recommendations */}
      {adaptiveQuality && getRecommendations(metrics).length > 0 && (
        <motion.div
          className="absolute top-4 left-4 bg-yellow-500/20 backdrop-blur-sm text-yellow-300 text-xs px-3 py-2 rounded-lg border border-yellow-500/30"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2 }}
        >
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z"/>
            </svg>
            <span>Performance optimized</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default OptimizedSplineModel;