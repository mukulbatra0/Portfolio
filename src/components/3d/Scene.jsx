import React, { useRef, useEffect, useState } from 'react';
import { useThreeJS } from '../../hooks/useThreeJS';

const Scene = ({ 
  children, 
  className = "", 
  enableControls = false,
  enableStats = false,
  onSceneReady = null,
  ...sceneOptions 
}) => {
  const containerRef = useRef(null);
  const [performanceStats, setPerformanceStats] = useState(null);
  
  const {
    scene,
    camera,
    renderer,
    isWebGLSupported,
    isInitialized,
    animate,
    cleanup,
    addToScene,
    removeFromScene,
    getPerformanceStats,
    handleResize
  } = useThreeJS(containerRef, sceneOptions);

  // Performance monitoring
  useEffect(() => {
    if (!enableStats || !isInitialized) return;

    const updateStats = () => {
      const stats = getPerformanceStats();
      setPerformanceStats(stats);
    };

    const interval = setInterval(updateStats, 1000);
    return () => clearInterval(interval);
  }, [enableStats, isInitialized, getPerformanceStats]);

  // Initialize controls if enabled
  useEffect(() => {
    if (!enableControls || !camera || !renderer) return;

    let controls;
    
    const initControls = async () => {
      try {
        const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls');
        controls = new OrbitControls(camera, renderer.domElement);
        
        // Configure controls
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enableZoom = false;
        controls.enablePan = false;
        controls.maxPolarAngle = Math.PI / 2;
      } catch (error) {
        console.warn('Failed to load OrbitControls:', error);
      }
    };

    initControls();

    return () => {
      if (controls) {
        controls.dispose();
      }
    };
  }, [enableControls, camera, renderer]);

  // Start animation loop
  useEffect(() => {
    if (!isInitialized) return;

    // Notify parent component that scene is ready
    if (onSceneReady) {
      onSceneReady({ scene, camera, renderer, addToScene, removeFromScene });
    }

    // Start animation loop
    animate(() => {
      // Animation callback - can be used for custom animations
    });

    return cleanup;
  }, [isInitialized, scene, camera, renderer, animate, cleanup, onSceneReady, addToScene, removeFromScene]);

  // Fallback for unsupported WebGL
  if (!isWebGLSupported) {
    return (
      <div className={`flex items-center justify-center bg-slate-800/50 rounded-lg border border-slate-700 ${className}`}>
        <div className="text-center p-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-slate-700 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M11,16.5L6.5,12L7.91,10.59L11,13.67L16.59,8.09L18,9.5L11,16.5Z"/>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">WebGL Not Supported</h3>
          <p className="text-slate-400 text-sm">
            Your browser doesn't support WebGL. Please update your browser or enable hardware acceleration.
          </p>
        </div>
      </div>
    );
  }

  // Loading state
  if (!isInitialized) {
    return (
      <div className={`flex items-center justify-center bg-slate-900/50 rounded-lg border border-slate-700 ${className}`}>
        <div className="text-center p-8">
          <div className="w-8 h-8 mx-auto mb-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm">Initializing 3D Scene...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Three.js Container */}
      <div 
        ref={containerRef} 
        className="w-full h-full"
        style={{ minHeight: '300px' }}
      />
      
      {/* Performance Stats */}
      {enableStats && performanceStats && (
        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white text-xs p-2 rounded font-mono">
          <div>Geometries: {performanceStats.memory?.geometries || 0}</div>
          <div>Textures: {performanceStats.memory?.textures || 0}</div>
          <div>Calls: {performanceStats.render?.calls || 0}</div>
          <div>Triangles: {performanceStats.render?.triangles || 0}</div>
        </div>
      )}
      
      {/* Children components can access scene context */}
      {children}
    </div>
  );
};

export default Scene;