import { useEffect, useRef, useState } from 'react';

export const useThreeJS = (containerRef, options = {}) => {
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const animationFrameRef = useRef(null);
  const [isWebGLSupported, setIsWebGLSupported] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const defaultOptions = {
    enableShadows: true,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
    camera: {
      fov: 75,
      near: 0.1,
      far: 1000,
      position: [0, 0, 5]
    },
    lights: {
      ambient: { color: 0x404040, intensity: 0.4 },
      directional: { 
        color: 0xffffff, 
        intensity: 1, 
        position: [10, 10, 5],
        castShadow: true
      }
    },
    controls: {
      enableDamping: true,
      dampingFactor: 0.05,
      enableZoom: false,
      enablePan: false,
      maxPolarAngle: Math.PI / 2
    }
  };

  const config = { ...defaultOptions, ...options };

  // Check WebGL support
  const checkWebGLSupport = () => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      return !!gl;
    } catch (e) {
      return false;
    }
  };

  // Initialize Three.js scene
  const initializeScene = async () => {
    if (!containerRef.current || !isWebGLSupported) return;

    try {
      // Dynamically import Three.js to reduce initial bundle size
      const THREE = await import('three');
      
      // Create scene
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      // Create camera
      const camera = new THREE.PerspectiveCamera(
        config.camera.fov,
        containerRef.current.clientWidth / containerRef.current.clientHeight,
        config.camera.near,
        config.camera.far
      );
      camera.position.set(...config.camera.position);
      cameraRef.current = camera;

      // Create renderer
      const renderer = new THREE.WebGLRenderer({
        antialias: config.antialias,
        alpha: config.alpha,
        powerPreference: config.powerPreference
      });
      
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      
      if (config.enableShadows) {
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      }
      
      renderer.outputEncoding = THREE.sRGBEncoding;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1;
      
      rendererRef.current = renderer;
      containerRef.current.appendChild(renderer.domElement);

      // Add lights
      if (config.lights.ambient) {
        const ambientLight = new THREE.AmbientLight(
          config.lights.ambient.color,
          config.lights.ambient.intensity
        );
        scene.add(ambientLight);
      }

      if (config.lights.directional) {
        const directionalLight = new THREE.DirectionalLight(
          config.lights.directional.color,
          config.lights.directional.intensity
        );
        directionalLight.position.set(...config.lights.directional.position);
        
        if (config.lights.directional.castShadow) {
          directionalLight.castShadow = true;
          directionalLight.shadow.mapSize.width = 2048;
          directionalLight.shadow.mapSize.height = 2048;
          directionalLight.shadow.camera.near = 0.5;
          directionalLight.shadow.camera.far = 500;
        }
        
        scene.add(directionalLight);
      }

      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to initialize Three.js scene:', error);
      setIsWebGLSupported(false);
    }
  };

  // Handle window resize
  const handleResize = () => {
    if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    cameraRef.current.aspect = width / height;
    cameraRef.current.updateProjectionMatrix();
    rendererRef.current.setSize(width, height);
  };

  // Animation loop
  const animate = (callback) => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;

    const loop = () => {
      if (callback) callback();
      
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      animationFrameRef.current = requestAnimationFrame(loop);
    };

    loop();
  };

  // Cleanup function
  const cleanup = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    if (rendererRef.current) {
      rendererRef.current.dispose();
      if (containerRef.current && rendererRef.current.domElement) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
    }

    if (sceneRef.current) {
      // Dispose of all objects in the scene
      sceneRef.current.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    }
  };

  // Performance monitoring
  const getPerformanceStats = () => {
    if (!rendererRef.current) return null;

    return {
      memory: rendererRef.current.info.memory,
      render: rendererRef.current.info.render,
      fps: 0 // Would need additional FPS counter implementation
    };
  };

  // Add object to scene
  const addToScene = (object) => {
    if (sceneRef.current && object) {
      sceneRef.current.add(object);
    }
  };

  // Remove object from scene
  const removeFromScene = (object) => {
    if (sceneRef.current && object) {
      sceneRef.current.remove(object);
    }
  };

  // Initialize on mount
  useEffect(() => {
    const webglSupported = checkWebGLSupport();
    setIsWebGLSupported(webglSupported);

    if (webglSupported) {
      initializeScene();
    }

    return cleanup;
  }, []);

  // Handle resize
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    scene: sceneRef.current,
    camera: cameraRef.current,
    renderer: rendererRef.current,
    isWebGLSupported,
    isInitialized,
    animate,
    cleanup,
    addToScene,
    removeFromScene,
    getPerformanceStats,
    handleResize
  };
};