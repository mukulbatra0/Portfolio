import React, { useRef, useEffect, useState } from 'react';
import { useThreeJS } from '../../hooks/useThreeJS';

const FloatingElements = ({ 
  elementCount = 20,
  elementTypes = ['sphere', 'cube', 'torus'],
  colors = ['#22D3EE', '#10B981', '#8B5CF6', '#F59E0B'],
  animationSpeed = 1,
  mouseInteraction = true,
  className = ""
}) => {
  const containerRef = useRef(null);
  const elementsRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  const {
    scene,
    camera,
    renderer,
    isWebGLSupported,
    isInitialized,
    animate,
    cleanup
  } = useThreeJS(containerRef, {
    camera: {
      fov: 75,
      near: 0.1,
      far: 1000,
      position: [0, 0, 10]
    },
    lights: {
      ambient: { color: 0x404040, intensity: 0.6 },
      directional: { 
        color: 0xffffff, 
        intensity: 0.8, 
        position: [5, 5, 5],
        castShadow: false
      }
    }
  });

  // Create floating elements
  const createFloatingElements = async () => {
    if (!scene || !isInitialized) return;

    try {
      const THREE = await import('three');
      const elements = [];

      for (let i = 0; i < elementCount; i++) {
        // Random element type
        const elementType = elementTypes[Math.floor(Math.random() * elementTypes.length)];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        let geometry;
        const size = Math.random() * 0.5 + 0.2;
        
        switch (elementType) {
          case 'sphere':
            geometry = new THREE.SphereGeometry(size, 16, 16);
            break;
          case 'cube':
            geometry = new THREE.BoxGeometry(size, size, size);
            break;
          case 'torus':
            geometry = new THREE.TorusGeometry(size, size * 0.3, 8, 16);
            break;
          case 'octahedron':
            geometry = new THREE.OctahedronGeometry(size);
            break;
          default:
            geometry = new THREE.SphereGeometry(size, 16, 16);
        }

        // Create material with glow effect
        const material = new THREE.MeshPhongMaterial({
          color: new THREE.Color(color),
          transparent: true,
          opacity: 0.7,
          shininess: 100,
          emissive: new THREE.Color(color).multiplyScalar(0.1)
        });

        const mesh = new THREE.Mesh(geometry, material);
        
        // Random position
        mesh.position.set(
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 10
        );
        
        // Random rotation
        mesh.rotation.set(
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2
        );

        // Animation properties
        mesh.userData = {
          originalPosition: mesh.position.clone(),
          rotationSpeed: {
            x: (Math.random() - 0.5) * 0.02 * animationSpeed,
            y: (Math.random() - 0.5) * 0.02 * animationSpeed,
            z: (Math.random() - 0.5) * 0.02 * animationSpeed
          },
          floatSpeed: Math.random() * 0.01 + 0.005,
          floatRange: Math.random() * 2 + 1,
          phase: Math.random() * Math.PI * 2,
          mouseInfluence: Math.random() * 0.5 + 0.2
        };

        scene.add(mesh);
        elements.push(mesh);
      }

      elementsRef.current = elements;
    } catch (error) {
      console.error('Failed to create floating elements:', error);
    }
  };

  // Mouse interaction
  useEffect(() => {
    if (!mouseInteraction || !containerRef.current) return;

    const handleMouseMove = (event) => {
      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current = {
        x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
        y: -((event.clientY - rect.top) / rect.height) * 2 + 1
      };
    };

    containerRef.current.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [mouseInteraction]);

  // Intersection observer for visibility
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Animation loop
  useEffect(() => {
    if (!isInitialized || !scene) return;

    const animateElements = () => {
      if (!isVisible) return;

      const time = Date.now() * 0.001;
      
      elementsRef.current.forEach((element, index) => {
        if (!element.userData) return;

        const { 
          originalPosition, 
          rotationSpeed, 
          floatSpeed, 
          floatRange, 
          phase,
          mouseInfluence 
        } = element.userData;

        // Floating animation
        element.position.y = originalPosition.y + 
          Math.sin(time * floatSpeed + phase) * floatRange;
        
        element.position.x = originalPosition.x + 
          Math.cos(time * floatSpeed * 0.7 + phase) * (floatRange * 0.5);

        // Rotation animation
        element.rotation.x += rotationSpeed.x;
        element.rotation.y += rotationSpeed.y;
        element.rotation.z += rotationSpeed.z;

        // Mouse interaction
        if (mouseInteraction) {
          const mouseInfluenceX = mouseRef.current.x * mouseInfluence;
          const mouseInfluenceY = mouseRef.current.y * mouseInfluence;
          
          element.position.x += mouseInfluenceX * 0.5;
          element.position.y += mouseInfluenceY * 0.5;
          
          // Subtle rotation based on mouse position
          element.rotation.y += mouseInfluenceX * 0.01;
          element.rotation.x += mouseInfluenceY * 0.01;
        }

        // Pulsing effect
        const pulseScale = 1 + Math.sin(time * 2 + index) * 0.1;
        element.scale.setScalar(pulseScale);

        // Color shifting
        if (element.material && element.material.emissive) {
          const hue = (time * 0.1 + index * 0.1) % 1;
          element.material.emissive.setHSL(hue, 0.5, 0.1);
        }
      });
    };

    animate(animateElements);
    
    return cleanup;
  }, [isInitialized, scene, animate, cleanup, isVisible, mouseInteraction]);

  // Create elements when scene is ready
  useEffect(() => {
    if (isInitialized) {
      createFloatingElements();
    }
  }, [isInitialized, elementCount, elementTypes, colors]);

  // Cleanup elements
  useEffect(() => {
    return () => {
      if (scene && elementsRef.current) {
        elementsRef.current.forEach(element => {
          scene.remove(element);
          if (element.geometry) element.geometry.dispose();
          if (element.material) element.material.dispose();
        });
      }
    };
  }, [scene]);

  if (!isWebGLSupported) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        {/* CSS Fallback Animation */}
        <div className="absolute inset-0">
          {[...Array(Math.min(elementCount, 10))].map((_, i) => (
            <div
              key={i}
              className="absolute w-4 h-4 rounded-full opacity-30"
              style={{
                backgroundColor: colors[i % colors.length],
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className={`relative ${className}`}
      style={{ minHeight: '400px' }}
    >
      {!isInitialized && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-slate-400 text-sm">Loading 3D elements...</div>
        </div>
      )}
    </div>
  );
};

export default FloatingElements;