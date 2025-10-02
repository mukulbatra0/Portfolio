import React, { useRef, useEffect, useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import LoadingSpinner from '../ui/LoadingSpinner';

const SplineModel = ({ 
  scene,
  className = "",
  fallbackComponent = null,
  onLoad = null,
  onError = null,
  enableInteraction = true,
  autoRotate = false,
  ...props 
}) => {
  const containerRef = useRef(null);
  const splineRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [splineApp, setSplineApp] = useState(null);

  // Lazy load Spline library
  const loadSpline = async () => {
    try {
      setIsLoading(true);
      
      // Dynamic import of Spline runtime
      const { Application } = await import('@splinetool/runtime');
      
      if (!containerRef.current) return;

      // Create Spline application
      const app = new Application(containerRef.current);
      
      // Load the scene
      await app.load(scene);
      
      setSplineApp(app);
      setIsLoaded(true);
      setIsLoading(false);
      
      if (onLoad) onLoad(app);
      
      // Setup interactions if enabled
      if (enableInteraction) {
        setupInteractions(app);
      }
      
      // Setup auto-rotation if enabled
      if (autoRotate) {
        setupAutoRotation(app);
      }
      
    } catch (err) {
      console.error('Failed to load Spline model:', err);
      setError(err);
      setIsLoading(false);
      if (onError) onError(err);
    }
  };

  // Setup mouse interactions
  const setupInteractions = (app) => {
    if (!containerRef.current) return;

    const canvas = containerRef.current.querySelector('canvas');
    if (!canvas) return;

    let isMouseDown = false;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      mouseX = x;
      mouseY = y;

      // Emit mouse move event to Spline
      try {
        app.emitEvent('mouseMove', { x, y });
      } catch (error) {
        // Silently handle if event emission fails
      }
    };

    const handleMouseDown = (event) => {
      isMouseDown = true;
      try {
        app.emitEvent('mouseDown', { x: mouseX, y: mouseY });
      } catch (error) {
        // Silently handle if event emission fails
      }
    };

    const handleMouseUp = (event) => {
      isMouseDown = false;
      try {
        app.emitEvent('mouseUp', { x: mouseX, y: mouseY });
      } catch (error) {
        // Silently handle if event emission fails
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);

    // Store cleanup function
    splineRef.current = {
      cleanup: () => {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mousedown', handleMouseDown);
        canvas.removeEventListener('mouseup', handleMouseUp);
      }
    };
  };

  // Setup auto-rotation
  const setupAutoRotation = (app) => {
    let rotationSpeed = 0.005;
    let animationId;

    const rotate = () => {
      try {
        // Find the main object to rotate (this depends on your Spline scene structure)
        const mainObject = app.findObjectByName('Scene') || app.findObjectByName('Main');
        if (mainObject) {
          mainObject.rotation.y += rotationSpeed;
        }
      } catch (error) {
        // Silently handle rotation errors
      }
      
      animationId = requestAnimationFrame(rotate);
    };

    rotate();

    // Store cleanup function
    if (splineRef.current) {
      const existingCleanup = splineRef.current.cleanup;
      splineRef.current.cleanup = () => {
        if (existingCleanup) existingCleanup();
        if (animationId) cancelAnimationFrame(animationId);
      };
    }
  };

  // Initialize Spline when component mounts
  useEffect(() => {
    if (scene) {
      loadSpline();
    }

    return () => {
      // Cleanup
      if (splineRef.current?.cleanup) {
        splineRef.current.cleanup();
      }
      if (splineApp) {
        try {
          splineApp.dispose();
        } catch (error) {
          // Silently handle disposal errors
        }
      }
    };
  }, [scene]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (splineApp && containerRef.current) {
        try {
          splineApp.setSize(
            containerRef.current.clientWidth,
            containerRef.current.clientHeight
          );
        } catch (error) {
          // Silently handle resize errors
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [splineApp]);

  // Render error state
  if (error) {
    if (fallbackComponent) {
      return fallbackComponent;
    }
    
    return (
      <div className={`flex items-center justify-center bg-slate-800/50 rounded-lg border border-slate-700 ${className}`}>
        <div className="text-center p-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12,2L13.09,8.26L22,9L17,14L18.18,22L12,18.77L5.82,22L7,14L2,9L8.91,8.26L12,2Z"/>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Failed to Load 3D Model</h3>
          <p className="text-slate-400 text-sm mb-4">
            The 3D model could not be loaded. This might be due to network issues or browser compatibility.
          </p>
          <button 
            onClick={() => {
              setError(null);
              loadSpline();
            }}
            className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Render loading state
  if (isLoading) {
    return (
      <div className={`flex items-center justify-center bg-slate-900/50 rounded-lg border border-slate-700 ${className}`}>
        <LoadingSpinner 
          size="large" 
          color="cyan" 
          text="Loading 3D Model..."
        />
      </div>
    );
  }

  return (
    <motion.div
      ref={containerRef}
      className={`relative w-full h-full ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoaded ? 1 : 0 }}
      transition={{ duration: 0.5 }}
      style={{ minHeight: '400px' }}
      {...props}
    >
      {/* Spline canvas will be inserted here */}
      
      {/* Interaction hints */}
      {enableInteraction && isLoaded && (
        <motion.div
          className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
            </svg>
            <span>Click and drag to interact</span>
          </div>
        </motion.div>
      )}
      
      {/* Performance indicator */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
          Spline Model
        </div>
      )}
    </motion.div>
  );
};

// Wrapper component with Suspense for better loading handling
const SplineModelWithSuspense = (props) => {
  return (
    <Suspense 
      fallback={
        <div className="flex items-center justify-center bg-slate-900/50 rounded-lg border border-slate-700 min-h-[400px]">
          <LoadingSpinner size="large" color="cyan" text="Loading 3D Model..." />
        </div>
      }
    >
      <SplineModel {...props} />
    </Suspense>
  );
};

export default SplineModelWithSuspense;