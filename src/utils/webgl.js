// WebGL detection and fallback utilities

export const detectWebGLSupport = () => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      return { supported: false, reason: 'WebGL context not available' };
    }

    // Check for required extensions
    const requiredExtensions = [
      'OES_texture_float',
      'OES_element_index_uint'
    ];

    const missingExtensions = requiredExtensions.filter(ext => !gl.getExtension(ext));
    
    if (missingExtensions.length > 0) {
      return { 
        supported: false, 
        reason: `Missing extensions: ${missingExtensions.join(', ')}` 
      };
    }

    // Check WebGL capabilities
    const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    const maxVertexAttribs = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
    
    return {
      supported: true,
      capabilities: {
        maxTextureSize,
        maxVertexAttribs,
        vendor: gl.getParameter(gl.VENDOR),
        renderer: gl.getParameter(gl.RENDERER),
        version: gl.getParameter(gl.VERSION)
      }
    };
  } catch (error) {
    return { 
      supported: false, 
      reason: `WebGL detection failed: ${error.message}` 
    };
  }
};

export const getDevicePerformanceLevel = () => {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  
  if (!gl) return 'low';

  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
  if (debugInfo) {
    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    
    // High-end GPUs
    if (renderer.includes('RTX') || 
        renderer.includes('GTX 1060') || 
        renderer.includes('GTX 1070') || 
        renderer.includes('GTX 1080') ||
        renderer.includes('RX 580') ||
        renderer.includes('RX 6') ||
        renderer.includes('RX 7')) {
      return 'high';
    }
    
    // Mid-range GPUs
    if (renderer.includes('GTX') || 
        renderer.includes('RX') || 
        renderer.includes('Radeon') ||
        renderer.includes('GeForce')) {
      return 'medium';
    }
  }

  // Fallback based on other factors
  const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
  if (maxTextureSize >= 8192) return 'medium';
  
  return 'low';
};

export const getOptimalSettings = () => {
  const performanceLevel = getDevicePerformanceLevel();
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  const settings = {
    low: {
      antialias: false,
      shadows: false,
      particleCount: 20,
      maxLights: 2,
      textureSize: 512,
      pixelRatio: 1
    },
    medium: {
      antialias: true,
      shadows: true,
      particleCount: 50,
      maxLights: 4,
      textureSize: 1024,
      pixelRatio: Math.min(window.devicePixelRatio, 1.5)
    },
    high: {
      antialias: true,
      shadows: true,
      particleCount: 100,
      maxLights: 8,
      textureSize: 2048,
      pixelRatio: Math.min(window.devicePixelRatio, 2)
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

export const createFallbackRenderer = (container) => {
  // Create a CSS-based fallback for 3D effects
  const fallbackElement = document.createElement('div');
  fallbackElement.className = 'webgl-fallback';
  fallbackElement.innerHTML = `
    <div class="fallback-content">
      <div class="fallback-animation">
        <div class="fallback-shape"></div>
        <div class="fallback-shape"></div>
        <div class="fallback-shape"></div>
      </div>
      <p class="fallback-message">
        3D effects are not available on this device. 
        Showing optimized 2D version.
      </p>
    </div>
  `;
  
  // Add CSS for fallback animation
  const style = document.createElement('style');
  style.textContent = `
    .webgl-fallback {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.8));
      border-radius: 12px;
      border: 1px solid rgba(34, 211, 238, 0.2);
    }
    
    .fallback-content {
      text-align: center;
      color: white;
    }
    
    .fallback-animation {
      display: flex;
      justify-content: center;
      margin-bottom: 1rem;
    }
    
    .fallback-shape {
      width: 20px;
      height: 20px;
      background: linear-gradient(45deg, #22D3EE, #3B82F6);
      margin: 0 5px;
      border-radius: 50%;
      animation: fallback-bounce 1.5s ease-in-out infinite;
    }
    
    .fallback-shape:nth-child(2) {
      animation-delay: 0.3s;
    }
    
    .fallback-shape:nth-child(3) {
      animation-delay: 0.6s;
    }
    
    @keyframes fallback-bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-20px); }
    }
    
    .fallback-message {
      font-size: 0.875rem;
      color: rgba(148, 163, 184, 1);
      max-width: 300px;
      margin: 0 auto;
    }
  `;
  
  document.head.appendChild(style);
  container.appendChild(fallbackElement);
  
  return {
    dispose: () => {
      if (fallbackElement.parentNode) {
        fallbackElement.parentNode.removeChild(fallbackElement);
      }
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    }
  };
};

export const monitorPerformance = (renderer, callback) => {
  let frameCount = 0;
  let lastTime = performance.now();
  let fps = 0;
  
  const monitor = () => {
    frameCount++;
    const currentTime = performance.now();
    
    if (currentTime - lastTime >= 1000) {
      fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
      frameCount = 0;
      lastTime = currentTime;
      
      const stats = {
        fps,
        memory: renderer.info.memory,
        render: renderer.info.render
      };
      
      callback(stats);
    }
    
    requestAnimationFrame(monitor);
  };
  
  monitor();
  
  return { fps: () => fps };
};