import { useState, useEffect, useCallback } from 'react';
import { getOptimalSettings } from '../utils/webgl';

export const useAdaptiveQuality = (initialSettings = {}) => {
  const [qualitySettings, setQualitySettings] = useState(() => {
    const optimal = getOptimalSettings();
    return { ...optimal, ...initialSettings };
  });
  
  const [performanceHistory, setPerformanceHistory] = useState([]);
  const [isAdaptiveMode, setIsAdaptiveMode] = useState(true);
  const [lastAdjustment, setLastAdjustment] = useState(Date.now());

  // Performance thresholds
  const THRESHOLDS = {
    fps: {
      excellent: 55,
      good: 45,
      acceptable: 30,
      poor: 20
    },
    memory: {
      excellent: 50, // MB
      good: 100,
      acceptable: 150,
      poor: 200
    },
    renderTime: {
      excellent: 8, // ms
      good: 12,
      acceptable: 16.67, // 60fps
      poor: 33.33 // 30fps
    }
  };

  // Quality presets
  const QUALITY_PRESETS = {
    ultra: {
      particleCount: 150,
      shadowQuality: 'ultra',
      textureQuality: 'ultra',
      antialiasing: true,
      postProcessing: true,
      pixelRatio: Math.min(window.devicePixelRatio, 2),
      maxLights: 8,
      enableReflections: true,
      enableSSAO: true
    },
    high: {
      particleCount: 100,
      shadowQuality: 'high',
      textureQuality: 'high',
      antialiasing: true,
      postProcessing: true,
      pixelRatio: Math.min(window.devicePixelRatio, 1.5),
      maxLights: 6,
      enableReflections: true,
      enableSSAO: false
    },
    medium: {
      particleCount: 60,
      shadowQuality: 'medium',
      textureQuality: 'medium',
      antialiasing: true,
      postProcessing: false,
      pixelRatio: Math.min(window.devicePixelRatio, 1.25),
      maxLights: 4,
      enableReflections: false,
      enableSSAO: false
    },
    low: {
      particleCount: 30,
      shadowQuality: 'low',
      textureQuality: 'low',
      antialiasing: false,
      postProcessing: false,
      pixelRatio: 1,
      maxLights: 2,
      enableReflections: false,
      enableSSAO: false
    },
    potato: {
      particleCount: 10,
      shadowQuality: 'off',
      textureQuality: 'low',
      antialiasing: false,
      postProcessing: false,
      pixelRatio: 0.75,
      maxLights: 1,
      enableReflections: false,
      enableSSAO: false
    }
  };

  // Analyze performance and determine quality level
  const analyzePerformance = useCallback((metrics) => {
    const { fps, memory, renderTime } = metrics;
    
    // Calculate performance score (0-100)
    let score = 100;
    
    // FPS impact (40% weight)
    if (fps < THRESHOLDS.fps.poor) score -= 40;
    else if (fps < THRESHOLDS.fps.acceptable) score -= 25;
    else if (fps < THRESHOLDS.fps.good) score -= 10;
    else if (fps < THRESHOLDS.fps.excellent) score -= 5;
    
    // Memory impact (30% weight)
    if (memory && memory.used) {
      if (memory.used > THRESHOLDS.memory.poor) score -= 30;
      else if (memory.used > THRESHOLDS.memory.acceptable) score -= 20;
      else if (memory.used > THRESHOLDS.memory.good) score -= 10;
      else if (memory.used > THRESHOLDS.memory.excellent) score -= 5;
    }
    
    // Render time impact (30% weight)
    if (renderTime > THRESHOLDS.renderTime.poor) score -= 30;
    else if (renderTime > THRESHOLDS.renderTime.acceptable) score -= 20;
    else if (renderTime > THRESHOLDS.renderTime.good) score -= 10;
    else if (renderTime > THRESHOLDS.renderTime.excellent) score -= 5;
    
    return Math.max(0, score);
  }, []);

  // Get quality level based on performance score
  const getQualityLevel = useCallback((score) => {
    if (score >= 90) return 'ultra';
    if (score >= 75) return 'high';
    if (score >= 50) return 'medium';
    if (score >= 25) return 'low';
    return 'potato';
  }, []);

  // Update quality settings based on performance
  const updateQualitySettings = useCallback((metrics) => {
    if (!isAdaptiveMode) return;
    
    const now = Date.now();
    const timeSinceLastAdjustment = now - lastAdjustment;
    
    // Don't adjust too frequently (minimum 5 seconds)
    if (timeSinceLastAdjustment < 5000) return;
    
    // Add to performance history
    const performanceScore = analyzePerformance(metrics);
    setPerformanceHistory(prev => {
      const newHistory = [...prev, { score: performanceScore, timestamp: now }];
      // Keep only last 10 measurements
      return newHistory.slice(-10);
    });
    
    // Calculate average performance over recent history
    const recentHistory = performanceHistory.slice(-5);
    if (recentHistory.length < 3) return; // Need at least 3 measurements
    
    const averageScore = recentHistory.reduce((sum, item) => sum + item.score, 0) / recentHistory.length;
    const targetQuality = getQualityLevel(averageScore);
    
    // Get current quality level
    const currentScore = analyzePerformance({
      fps: 60, // Assume good performance for current settings
      memory: { used: 50 },
      renderTime: 10
    });
    const currentQuality = getQualityLevel(currentScore);
    
    // Only change if there's a significant difference
    if (targetQuality !== currentQuality) {
      const newSettings = { ...QUALITY_PRESETS[targetQuality] };
      
      setQualitySettings(prev => ({
        ...prev,
        ...newSettings,
        qualityLevel: targetQuality
      }));
      
      setLastAdjustment(now);
      
      console.log(`Quality adjusted to ${targetQuality} (score: ${averageScore.toFixed(1)})`);
    }
  }, [isAdaptiveMode, lastAdjustment, performanceHistory, analyzePerformance, getQualityLevel]);

  // Manual quality override
  const setQualityLevel = useCallback((level) => {
    if (!QUALITY_PRESETS[level]) return;
    
    setQualitySettings(prev => ({
      ...prev,
      ...QUALITY_PRESETS[level],
      qualityLevel: level
    }));
    
    setIsAdaptiveMode(false);
  }, []);

  // Enable/disable adaptive mode
  const toggleAdaptiveMode = useCallback(() => {
    setIsAdaptiveMode(prev => !prev);
  }, []);

  // Reset to optimal settings
  const resetToOptimal = useCallback(() => {
    const optimal = getOptimalSettings();
    setQualitySettings(optimal);
    setIsAdaptiveMode(true);
    setPerformanceHistory([]);
  }, []);

  // Get performance recommendations
  const getRecommendations = useCallback((metrics) => {
    const recommendations = [];
    const { fps, memory, renderTime } = metrics;
    
    if (fps < THRESHOLDS.fps.acceptable) {
      recommendations.push({
        type: 'fps',
        severity: fps < THRESHOLDS.fps.poor ? 'high' : 'medium',
        message: 'Consider reducing particle count or disabling post-processing effects',
        action: () => setQualityLevel('low')
      });
    }
    
    if (memory && memory.used > THRESHOLDS.memory.acceptable) {
      recommendations.push({
        type: 'memory',
        severity: memory.used > THRESHOLDS.memory.poor ? 'high' : 'medium',
        message: 'High memory usage detected. Consider reducing texture quality',
        action: () => setQualitySettings(prev => ({ 
          ...prev, 
          textureQuality: 'low',
          particleCount: Math.max(10, prev.particleCount * 0.5)
        }))
      });
    }
    
    if (renderTime > THRESHOLDS.renderTime.acceptable) {
      recommendations.push({
        type: 'render',
        severity: renderTime > THRESHOLDS.renderTime.poor ? 'high' : 'medium',
        message: 'Slow rendering detected. Consider disabling shadows or antialiasing',
        action: () => setQualitySettings(prev => ({ 
          ...prev, 
          shadowQuality: 'off',
          antialiasing: false
        }))
      });
    }
    
    return recommendations;
  }, [setQualityLevel]);

  // Listen for performance toggle events
  useEffect(() => {
    const handleTogglePerformanceMode = () => {
      toggleAdaptiveMode();
    };
    
    window.addEventListener('togglePerformanceMode', handleTogglePerformanceMode);
    return () => window.removeEventListener('togglePerformanceMode', handleTogglePerformanceMode);
  }, [toggleAdaptiveMode]);

  return {
    qualitySettings,
    isAdaptiveMode,
    performanceHistory,
    updateQualitySettings,
    setQualityLevel,
    toggleAdaptiveMode,
    resetToOptimal,
    getRecommendations,
    availablePresets: Object.keys(QUALITY_PRESETS)
  };
};