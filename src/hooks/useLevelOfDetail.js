import { useState, useEffect, useCallback, useRef } from 'react';

export const useLevelOfDetail = (options = {}) => {
  const [currentLOD, setCurrentLOD] = useState('high');
  const [lodMetrics, setLodMetrics] = useState({
    distance: 1,
    viewportRatio: 1,
    performanceScore: 100
  });
  
  const observerRef = useRef(null);
  const elementRef = useRef(null);
  const performanceHistoryRef = useRef([]);

  const {
    thresholds = {
      distance: { near: 1, medium: 2, far: 4 },
      fps: { high: 45, medium: 30, low: 20 },
      memory: { high: 50, medium: 100, low: 150 }, // MB
      viewport: { large: 0.5, medium: 0.25, small: 0.1 }
    },
    updateInterval = 1000,
    performanceWeight = 0.6,
    distanceWeight = 0.3,
    viewportWeight = 0.1,
    onLODChange = null
  } = options;

  // Calculate viewer distance based on element size and position
  const calculateDistance = useCallback(() => {
    if (!elementRef.current) return 1;

    const rect = elementRef.current.getBoundingClientRect();
    const viewportArea = window.innerWidth * window.innerHeight;
    const elementArea = rect.width * rect.height;
    
    if (elementArea === 0) return 4; // Element not visible
    
    const viewportRatio = elementArea / viewportArea;
    const distance = 1 / Math.max(viewportRatio, 0.01);
    
    return Math.min(distance, 10); // Cap maximum distance
  }, []);

  // Calculate viewport ratio
  const calculateViewportRatio = useCallback(() => {
    if (!elementRef.current) return 0;

    const rect = elementRef.current.getBoundingClientRect();
    const viewportArea = window.innerWidth * window.innerHeight;
    const elementArea = rect.width * rect.height;
    
    return elementArea / viewportArea;
  }, []);

  // Calculate performance score based on FPS and memory
  const calculatePerformanceScore = useCallback((fps, memoryUsage) => {
    let score = 100;
    
    // FPS impact (70% weight)
    if (fps < thresholds.fps.low) score -= 50;
    else if (fps < thresholds.fps.medium) score -= 30;
    else if (fps < thresholds.fps.high) score -= 15;
    
    // Memory impact (30% weight)
    if (memoryUsage > thresholds.memory.low) score -= 20;
    else if (memoryUsage > thresholds.memory.medium) score -= 10;
    else if (memoryUsage > thresholds.memory.high) score -= 5;
    
    return Math.max(0, score);
  }, [thresholds]);

  // Determine LOD level based on multiple factors
  const determineLODLevel = useCallback((distance, viewportRatio, performanceScore) => {
    // Weighted scoring system
    let lodScore = 100;
    
    // Distance factor
    if (distance > thresholds.distance.far) {
      lodScore -= 40 * distanceWeight * 100;
    } else if (distance > thresholds.distance.medium) {
      lodScore -= 25 * distanceWeight * 100;
    } else if (distance > thresholds.distance.near) {
      lodScore -= 10 * distanceWeight * 100;
    }
    
    // Performance factor
    lodScore -= (100 - performanceScore) * performanceWeight;
    
    // Viewport factor
    if (viewportRatio < thresholds.viewport.small) {
      lodScore -= 30 * viewportWeight * 100;
    } else if (viewportRatio < thresholds.viewport.medium) {
      lodScore -= 15 * viewportWeight * 100;
    } else if (viewportRatio < thresholds.viewport.large) {
      lodScore -= 5 * viewportWeight * 100;
    }
    
    // Determine level based on final score
    if (lodScore >= 75) return 'high';
    if (lodScore >= 45) return 'medium';
    return 'low';
  }, [thresholds, distanceWeight, performanceWeight, viewportWeight]);

  // Update LOD metrics and level
  const updateLOD = useCallback((performanceMetrics = {}) => {
    const distance = calculateDistance();
    const viewportRatio = calculateViewportRatio();
    const performanceScore = calculatePerformanceScore(
      performanceMetrics.fps || 60,
      performanceMetrics.memory?.used || 0
    );
    
    const newMetrics = {
      distance,
      viewportRatio,
      performanceScore
    };
    
    setLodMetrics(newMetrics);
    
    // Add to performance history for smoothing
    performanceHistoryRef.current.push({
      ...newMetrics,
      timestamp: Date.now()
    });
    
    // Keep only recent history (last 5 measurements)
    if (performanceHistoryRef.current.length > 5) {
      performanceHistoryRef.current = performanceHistoryRef.current.slice(-5);
    }
    
    // Calculate average metrics for smoother LOD transitions
    const avgMetrics = performanceHistoryRef.current.reduce(
      (acc, curr) => ({
        distance: acc.distance + curr.distance,
        viewportRatio: acc.viewportRatio + curr.viewportRatio,
        performanceScore: acc.performanceScore + curr.performanceScore
      }),
      { distance: 0, viewportRatio: 0, performanceScore: 0 }
    );
    
    const count = performanceHistoryRef.current.length;
    avgMetrics.distance /= count;
    avgMetrics.viewportRatio /= count;
    avgMetrics.performanceScore /= count;
    
    const newLOD = determineLODLevel(
      avgMetrics.distance,
      avgMetrics.viewportRatio,
      avgMetrics.performanceScore
    );
    
    if (newLOD !== currentLOD) {
      setCurrentLOD(newLOD);
      if (onLODChange) {
        onLODChange(newLOD, newMetrics);
      }
    }
  }, [calculateDistance, calculateViewportRatio, calculatePerformanceScore, determineLODLevel, currentLOD, onLODChange]);

  // Setup intersection observer for visibility detection
  useEffect(() => {
    if (!elementRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            // Element not visible, set to lowest LOD
            setCurrentLOD('low');
          } else {
            // Element visible, recalculate LOD
            updateLOD();
          }
        });
      },
      {
        threshold: [0, 0.1, 0.5, 1.0],
        rootMargin: '50px'
      }
    );

    observerRef.current.observe(elementRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [updateLOD]);

  // Setup resize observer for viewport changes
  useEffect(() => {
    const handleResize = () => {
      updateLOD();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateLOD]);

  // Get LOD settings for current level
  const getLODSettings = useCallback((level = currentLOD) => {
    const settings = {
      high: {
        quality: 1.0,
        shadows: true,
        reflections: true,
        postProcessing: true,
        particleCount: 1.0,
        textureQuality: 'high',
        geometryDetail: 1.0,
        animationQuality: 'high',
        maxLights: 8
      },
      medium: {
        quality: 0.75,
        shadows: true,
        reflections: false,
        postProcessing: false,
        particleCount: 0.6,
        textureQuality: 'medium',
        geometryDetail: 0.75,
        animationQuality: 'medium',
        maxLights: 4
      },
      low: {
        quality: 0.5,
        shadows: false,
        reflections: false,
        postProcessing: false,
        particleCount: 0.3,
        textureQuality: 'low',
        geometryDetail: 0.5,
        animationQuality: 'low',
        maxLights: 2
      }
    };

    return settings[level] || settings.medium;
  }, [currentLOD]);

  // Force LOD level (useful for testing or manual override)
  const setLODLevel = useCallback((level) => {
    if (['high', 'medium', 'low'].includes(level)) {
      setCurrentLOD(level);
      if (onLODChange) {
        onLODChange(level, lodMetrics);
      }
    }
  }, [lodMetrics, onLODChange]);

  // Get performance recommendations
  const getRecommendations = useCallback(() => {
    const recommendations = [];
    
    if (lodMetrics.performanceScore < 50) {
      recommendations.push({
        type: 'performance',
        severity: 'high',
        message: 'Poor performance detected. Consider reducing quality settings.',
        suggestion: 'Force LOD to low level'
      });
    }
    
    if (lodMetrics.distance > thresholds.distance.far) {
      recommendations.push({
        type: 'distance',
        severity: 'medium',
        message: 'Object is far from viewer. Using low detail level.',
        suggestion: 'This is automatic optimization'
      });
    }
    
    if (lodMetrics.viewportRatio < thresholds.viewport.small) {
      recommendations.push({
        type: 'viewport',
        severity: 'low',
        message: 'Object occupies small viewport area.',
        suggestion: 'Consider reducing detail for better performance'
      });
    }
    
    return recommendations;
  }, [lodMetrics, thresholds]);

  return {
    elementRef,
    currentLOD,
    lodMetrics,
    updateLOD,
    getLODSettings,
    setLODLevel,
    getRecommendations
  };
};