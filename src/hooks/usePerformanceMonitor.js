import { useState, useEffect, useRef, useCallback } from 'react';

export const usePerformanceMonitor = (options = {}) => {
  const [metrics, setMetrics] = useState({
    fps: 0,
    memory: null,
    loadTime: 0,
    renderTime: 0,
    isLowPerformance: false
  });

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const renderStartRef = useRef(0);
  const observerRef = useRef(null);

  const {
    enableFPSMonitoring = true,
    enableMemoryMonitoring = true,
    enableRenderTimeMonitoring = true,
    fpsThreshold = 30,
    memoryThreshold = 100, // MB
    updateInterval = 1000
  } = options;

  // FPS Monitoring
  const updateFPS = useCallback(() => {
    if (!enableFPSMonitoring) return;

    frameCountRef.current++;
    const currentTime = performance.now();
    
    if (currentTime - lastTimeRef.current >= updateInterval) {
      const fps = Math.round((frameCountRef.current * 1000) / (currentTime - lastTimeRef.current));
      
      setMetrics(prev => ({
        ...prev,
        fps,
        isLowPerformance: fps < fpsThreshold
      }));
      
      frameCountRef.current = 0;
      lastTimeRef.current = currentTime;
    }
    
    requestAnimationFrame(updateFPS);
  }, [enableFPSMonitoring, updateInterval, fpsThreshold]);

  // Memory Monitoring
  const updateMemory = useCallback(() => {
    if (!enableMemoryMonitoring || !performance.memory) return;

    const memory = {
      used: Math.round(performance.memory.usedJSHeapSize / 1048576), // MB
      total: Math.round(performance.memory.totalJSHeapSize / 1048576), // MB
      limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576) // MB
    };

    setMetrics(prev => ({
      ...prev,
      memory,
      isLowPerformance: prev.isLowPerformance || memory.used > memoryThreshold
    }));
  }, [enableMemoryMonitoring, memoryThreshold]);

  // Render Time Monitoring
  const startRenderMeasure = useCallback(() => {
    if (!enableRenderTimeMonitoring) return;
    renderStartRef.current = performance.now();
  }, [enableRenderTimeMonitoring]);

  const endRenderMeasure = useCallback(() => {
    if (!enableRenderTimeMonitoring || !renderStartRef.current) return;
    
    const renderTime = performance.now() - renderStartRef.current;
    setMetrics(prev => ({ ...prev, renderTime }));
  }, [enableRenderTimeMonitoring]);

  // Page Load Time
  const measureLoadTime = useCallback(() => {
    if (document.readyState === 'complete') {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      setMetrics(prev => ({ ...prev, loadTime }));
    } else {
      window.addEventListener('load', () => {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        setMetrics(prev => ({ ...prev, loadTime }));
      });
    }
  }, []);

  // Performance Observer for additional metrics
  const setupPerformanceObserver = useCallback(() => {
    if (!window.PerformanceObserver) return;

    try {
      observerRef.current = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        
        entries.forEach((entry) => {
          if (entry.entryType === 'measure') {
            setMetrics(prev => ({
              ...prev,
              customMeasures: {
                ...prev.customMeasures,
                [entry.name]: entry.duration
              }
            }));
          }
        });
      });

      observerRef.current.observe({ entryTypes: ['measure', 'navigation'] });
    } catch (error) {
      console.warn('Performance Observer not supported:', error);
    }
  }, []);

  // Get performance recommendations
  const getPerformanceRecommendations = useCallback(() => {
    const recommendations = [];
    
    if (metrics.fps < fpsThreshold) {
      recommendations.push({
        type: 'fps',
        message: 'Low FPS detected. Consider reducing animation complexity or particle count.',
        severity: 'high'
      });
    }
    
    if (metrics.memory && metrics.memory.used > memoryThreshold) {
      recommendations.push({
        type: 'memory',
        message: 'High memory usage detected. Consider optimizing assets or reducing 3D complexity.',
        severity: 'medium'
      });
    }
    
    if (metrics.renderTime > 16.67) { // 60fps = 16.67ms per frame
      recommendations.push({
        type: 'render',
        message: 'Slow render times detected. Consider optimizing rendering pipeline.',
        severity: 'medium'
      });
    }
    
    if (metrics.loadTime > 3000) {
      recommendations.push({
        type: 'load',
        message: 'Slow page load detected. Consider optimizing assets and implementing lazy loading.',
        severity: 'low'
      });
    }
    
    return recommendations;
  }, [metrics, fpsThreshold, memoryThreshold]);

  // Adaptive quality settings based on performance
  const getAdaptiveSettings = useCallback(() => {
    const settings = {
      particleCount: 100,
      shadowQuality: 'high',
      textureQuality: 'high',
      antialiasing: true,
      postProcessing: true
    };

    if (metrics.isLowPerformance || metrics.fps < fpsThreshold) {
      settings.particleCount = 30;
      settings.shadowQuality = 'low';
      settings.textureQuality = 'medium';
      settings.antialiasing = false;
      settings.postProcessing = false;
    } else if (metrics.fps < fpsThreshold * 1.5) {
      settings.particleCount = 60;
      settings.shadowQuality = 'medium';
      settings.textureQuality = 'high';
      settings.antialiasing = true;
      settings.postProcessing = false;
    }

    return settings;
  }, [metrics, fpsThreshold]);

  // Custom performance marks
  const mark = useCallback((name) => {
    if (performance.mark) {
      performance.mark(name);
    }
  }, []);

  const measure = useCallback((name, startMark, endMark) => {
    if (performance.measure) {
      performance.measure(name, startMark, endMark);
    }
  }, []);

  // Initialize monitoring
  useEffect(() => {
    measureLoadTime();
    setupPerformanceObserver();
    
    if (enableFPSMonitoring) {
      requestAnimationFrame(updateFPS);
    }
    
    if (enableMemoryMonitoring) {
      const memoryInterval = setInterval(updateMemory, updateInterval);
      return () => clearInterval(memoryInterval);
    }
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [
    enableFPSMonitoring,
    enableMemoryMonitoring,
    updateFPS,
    updateMemory,
    updateInterval,
    measureLoadTime,
    setupPerformanceObserver
  ]);

  return {
    metrics,
    startRenderMeasure,
    endRenderMeasure,
    getPerformanceRecommendations,
    getAdaptiveSettings,
    mark,
    measure
  };
};