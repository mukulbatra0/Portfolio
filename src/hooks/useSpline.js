import { useState, useEffect, useCallback, useRef } from 'react';

export const useSpline = (sceneUrl, options = {}) => {
  const [splineApp, setSplineApp] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const containerRef = useRef(null);
  const cleanupRef = useRef(null);

  const {
    enableInteraction = true,
    autoRotate = false,
    onLoad = null,
    onError = null,
    fallbackOnError = true
  } = options;

  // Load Spline application
  const loadSpline = useCallback(async (container) => {
    if (!container || !sceneUrl) return;

    try {
      setIsLoading(true);
      setError(null);

      // Check if Spline runtime is available
      let Application;
      try {
        const splineModule = await import('@splinetool/runtime');
        Application = splineModule.Application;
      } catch (importError) {
        throw new Error('Spline runtime not available. Please install @splinetool/runtime');
      }

      // Create and configure Spline application
      const app = new Application(container);
      
      // Set up loading progress if available
      if (app.setLoadingCallback) {
        app.setLoadingCallback((progress) => {
          // You can emit progress events here if needed
        });
      }

      // Load the scene
      await app.load(sceneUrl);

      setSplineApp(app);
      setIsLoaded(true);
      setIsLoading(false);

      if (onLoad) onLoad(app);

      return app;
    } catch (err) {
      console.error('Failed to load Spline scene:', err);
      setError(err);
      setIsLoading(false);
      if (onError) onError(err);
      throw err;
    }
  }, [sceneUrl, onLoad, onError]);

  // Get object by name from Spline scene
  const getObjectByName = useCallback((name) => {
    if (!splineApp) return null;
    
    try {
      return splineApp.findObjectByName(name);
    } catch (error) {
      console.warn(`Object "${name}" not found in Spline scene:`, error);
      return null;
    }
  }, [splineApp]);

  // Emit event to Spline scene
  const emitEvent = useCallback((eventType, data = {}) => {
    if (!splineApp) return false;
    
    try {
      splineApp.emitEvent(eventType, data);
      return true;
    } catch (error) {
      console.warn(`Failed to emit event "${eventType}":`, error);
      return false;
    }
  }, [splineApp]);

  // Set object property
  const setObjectProperty = useCallback((objectName, property, value) => {
    const object = getObjectByName(objectName);
    if (!object) return false;

    try {
      if (property.includes('.')) {
        // Handle nested properties like 'position.x'
        const props = property.split('.');
        let current = object;
        for (let i = 0; i < props.length - 1; i++) {
          current = current[props[i]];
          if (!current) return false;
        }
        current[props[props.length - 1]] = value;
      } else {
        object[property] = value;
      }
      return true;
    } catch (error) {
      console.warn(`Failed to set property "${property}" on object "${objectName}":`, error);
      return false;
    }
  }, [getObjectByName]);

  // Animate object property
  const animateObject = useCallback((objectName, animations, duration = 1000) => {
    const object = getObjectByName(objectName);
    if (!object) return Promise.reject(new Error(`Object "${objectName}" not found`));

    return new Promise((resolve) => {
      const startTime = Date.now();
      const startValues = {};

      // Store initial values
      Object.keys(animations).forEach(prop => {
        if (prop.includes('.')) {
          const props = prop.split('.');
          let current = object;
          for (let i = 0; i < props.length - 1; i++) {
            current = current[props[i]];
          }
          startValues[prop] = current[props[props.length - 1]];
        } else {
          startValues[prop] = object[prop];
        }
      });

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);

        Object.keys(animations).forEach(prop => {
          const startValue = startValues[prop];
          const endValue = animations[prop];
          const currentValue = startValue + (endValue - startValue) * easeOut;
          
          setObjectProperty(objectName, prop, currentValue);
        });

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };

      animate();
    });
  }, [getObjectByName, setObjectProperty]);

  // Setup mouse interactions
  const setupInteractions = useCallback((container) => {
    if (!enableInteraction || !splineApp || !container) return;

    const canvas = container.querySelector('canvas');
    if (!canvas) return;

    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      emitEvent('mouseMove', { x: mouseX, y: mouseY });
    };

    const handleMouseDown = () => {
      emitEvent('mouseDown', { x: mouseX, y: mouseY });
    };

    const handleMouseUp = () => {
      emitEvent('mouseUp', { x: mouseX, y: mouseY });
    };

    const handleClick = () => {
      emitEvent('click', { x: mouseX, y: mouseY });
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('click', handleClick);

    // Store cleanup function
    cleanupRef.current = () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('click', handleClick);
    };
  }, [enableInteraction, splineApp, emitEvent]);

  // Setup auto-rotation
  const setupAutoRotation = useCallback(() => {
    if (!autoRotate || !splineApp) return;

    let animationId;
    const rotationSpeed = 0.005;

    const rotate = () => {
      const mainObject = getObjectByName('Scene') || getObjectByName('Main');
      if (mainObject && mainObject.rotation) {
        mainObject.rotation.y += rotationSpeed;
      }
      animationId = requestAnimationFrame(rotate);
    };

    rotate();

    // Add to cleanup
    const existingCleanup = cleanupRef.current;
    cleanupRef.current = () => {
      if (existingCleanup) existingCleanup();
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [autoRotate, splineApp, getObjectByName]);

  // Resize handler
  const handleResize = useCallback(() => {
    if (splineApp && containerRef.current) {
      try {
        splineApp.setSize(
          containerRef.current.clientWidth,
          containerRef.current.clientHeight
        );
      } catch (error) {
        console.warn('Failed to resize Spline canvas:', error);
      }
    }
  }, [splineApp]);

  // Initialize Spline when container is available
  useEffect(() => {
    if (containerRef.current && sceneUrl && !splineApp && !isLoading) {
      loadSpline(containerRef.current)
        .then((app) => {
          setupInteractions(containerRef.current);
          setupAutoRotation();
        })
        .catch((error) => {
          // Error is already handled in loadSpline
        });
    }
  }, [sceneUrl, splineApp, isLoading, loadSpline, setupInteractions, setupAutoRotation]);

  // Setup resize listener
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
      if (splineApp) {
        try {
          splineApp.dispose();
        } catch (error) {
          console.warn('Failed to dispose Spline app:', error);
        }
      }
    };
  }, [splineApp]);

  return {
    containerRef,
    splineApp,
    isLoading,
    isLoaded,
    error,
    loadSpline,
    getObjectByName,
    emitEvent,
    setObjectProperty,
    animateObject,
    handleResize
  };
};