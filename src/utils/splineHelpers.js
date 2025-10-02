// Spline utility functions and helpers

export const SPLINE_EVENTS = {
  MOUSE_MOVE: 'mouseMove',
  MOUSE_DOWN: 'mouseDown',
  MOUSE_UP: 'mouseUp',
  CLICK: 'click',
  HOVER: 'hover',
  SCROLL: 'scroll'
};

export const SPLINE_OBJECT_TYPES = {
  MESH: 'mesh',
  LIGHT: 'light',
  CAMERA: 'camera',
  GROUP: 'group'
};

// Check if Spline is supported in the current environment
export const isSplineSupported = () => {
  try {
    // Check for WebGL support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) return false;

    // Check for required features
    const hasRequiredFeatures = !!(
      window.WebGLRenderingContext &&
      window.requestAnimationFrame &&
      window.Promise
    );

    return hasRequiredFeatures;
  } catch (error) {
    return false;
  }
};

// Get device performance level for Spline optimization
export const getSplinePerformanceLevel = () => {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  
  if (!gl) return 'low';

  // Check GPU info
  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
  let renderer = 'unknown';
  
  if (debugInfo) {
    renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL).toLowerCase();
  }

  // High-end GPUs
  if (renderer.includes('rtx') || 
      renderer.includes('gtx 1060') || 
      renderer.includes('gtx 1070') || 
      renderer.includes('gtx 1080') ||
      renderer.includes('rx 580') ||
      renderer.includes('rx 6') ||
      renderer.includes('rx 7')) {
    return 'high';
  }
  
  // Mid-range GPUs
  if (renderer.includes('gtx') || 
      renderer.includes('rx') || 
      renderer.includes('radeon') ||
      renderer.includes('geforce')) {
    return 'medium';
  }

  // Check other performance indicators
  const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
  const maxVertexAttribs = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
  
  if (maxTextureSize >= 8192 && maxVertexAttribs >= 16) {
    return 'medium';
  }
  
  return 'low';
};

// Get optimal Spline settings based on device performance
export const getOptimalSplineSettings = () => {
  const performanceLevel = getSplinePerformanceLevel();
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  const settings = {
    low: {
      quality: 0.5,
      shadows: false,
      reflections: false,
      postProcessing: false,
      particleCount: 10,
      maxLights: 1,
      pixelRatio: 0.75
    },
    medium: {
      quality: 0.75,
      shadows: true,
      reflections: false,
      postProcessing: false,
      particleCount: 25,
      maxLights: 3,
      pixelRatio: 1
    },
    high: {
      quality: 1,
      shadows: true,
      reflections: true,
      postProcessing: true,
      particleCount: 50,
      maxLights: 5,
      pixelRatio: Math.min(window.devicePixelRatio, 1.5)
    }
  };

  let level = performanceLevel;
  if (isMobile && level === 'high') level = 'medium';
  if (isMobile && level === 'medium') level = 'low';

  return {
    ...settings[level],
    isMobile,
    performanceLevel: level
  };
};

// Create fallback content when Spline fails to load
export const createSplineFallback = (container, options = {}) => {
  const {
    message = "3D model unavailable",
    showRetry = true,
    onRetry = null,
    backgroundColor = 'rgba(15, 23, 42, 0.8)',
    borderColor = 'rgba(34, 211, 238, 0.2)'
  } = options;

  const fallbackElement = document.createElement('div');
  fallbackElement.className = 'spline-fallback';
  fallbackElement.style.cssText = `
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: ${backgroundColor};
    border: 1px solid ${borderColor};
    border-radius: 12px;
    color: white;
    text-align: center;
    padding: 2rem;
  `;

  const icon = document.createElement('div');
  icon.innerHTML = `
    <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" style="color: #64748B; margin-bottom: 1rem;">
      <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M11,16.5L6.5,12L7.91,10.59L11,13.67L16.59,8.09L18,9.5L11,16.5Z"/>
    </svg>
  `;

  const messageElement = document.createElement('p');
  messageElement.textContent = message;
  messageElement.style.cssText = `
    font-size: 1rem;
    color: #94A3B8;
    margin-bottom: 1rem;
    max-width: 300px;
  `;

  fallbackElement.appendChild(icon);
  fallbackElement.appendChild(messageElement);

  if (showRetry && onRetry) {
    const retryButton = document.createElement('button');
    retryButton.textContent = 'Retry';
    retryButton.style.cssText = `
      padding: 0.5rem 1rem;
      background: rgba(34, 211, 238, 0.2);
      color: #22D3EE;
      border: 1px solid rgba(34, 211, 238, 0.3);
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.875rem;
      transition: all 0.3s ease;
    `;
    
    retryButton.addEventListener('mouseenter', () => {
      retryButton.style.background = 'rgba(34, 211, 238, 0.3)';
    });
    
    retryButton.addEventListener('mouseleave', () => {
      retryButton.style.background = 'rgba(34, 211, 238, 0.2)';
    });
    
    retryButton.addEventListener('click', onRetry);
    fallbackElement.appendChild(retryButton);
  }

  container.appendChild(fallbackElement);

  return {
    element: fallbackElement,
    dispose: () => {
      if (fallbackElement.parentNode) {
        fallbackElement.parentNode.removeChild(fallbackElement);
      }
    }
  };
};

// Preload Spline scenes
export const preloadSplineScene = async (sceneUrl) => {
  try {
    const { Application } = await import('@splinetool/runtime');
    
    // Create a hidden container for preloading
    const hiddenContainer = document.createElement('div');
    hiddenContainer.style.cssText = `
      position: absolute;
      top: -9999px;
      left: -9999px;
      width: 1px;
      height: 1px;
      opacity: 0;
      pointer-events: none;
    `;
    document.body.appendChild(hiddenContainer);

    const app = new Application(hiddenContainer);
    await app.load(sceneUrl);
    
    // Clean up
    app.dispose();
    document.body.removeChild(hiddenContainer);
    
    return true;
  } catch (error) {
    console.warn('Failed to preload Spline scene:', error);
    return false;
  }
};

// Monitor Spline performance
export const createSplinePerformanceMonitor = (splineApp, callback) => {
  if (!splineApp) return null;

  let frameCount = 0;
  let lastTime = performance.now();
  let isMonitoring = true;

  const monitor = () => {
    if (!isMonitoring) return;

    frameCount++;
    const currentTime = performance.now();
    
    if (currentTime - lastTime >= 1000) {
      const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
      frameCount = 0;
      lastTime = currentTime;
      
      const stats = {
        fps,
        timestamp: currentTime
      };
      
      callback(stats);
    }
    
    requestAnimationFrame(monitor);
  };

  monitor();

  return {
    stop: () => {
      isMonitoring = false;
    },
    getFPS: () => frameCount
  };
};

// Spline scene optimization utilities
export const optimizeSplineScene = (splineApp, settings = {}) => {
  if (!splineApp) return;

  const {
    quality = 1,
    shadows = true,
    reflections = true,
    postProcessing = true,
    pixelRatio = 1
  } = settings;

  try {
    // Set render quality
    if (splineApp.setQuality) {
      splineApp.setQuality(quality);
    }

    // Set pixel ratio
    if (splineApp.setPixelRatio) {
      splineApp.setPixelRatio(pixelRatio);
    }

    // Configure shadows
    const renderer = splineApp.renderer;
    if (renderer && renderer.shadowMap) {
      renderer.shadowMap.enabled = shadows;
    }

    // Configure post-processing
    if (splineApp.composer) {
      splineApp.composer.enabled = postProcessing;
    }

  } catch (error) {
    console.warn('Failed to optimize Spline scene:', error);
  }
};