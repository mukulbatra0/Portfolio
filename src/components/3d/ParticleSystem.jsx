import React, { useRef, useEffect, useState } from 'react';
import { useThreeJS } from '../../hooks/useThreeJS';

const ParticleSystem = ({
  particleCount = 1000,
  colors = ['#22D3EE', '#10B981', '#8B5CF6'],
  size = 0.05,
  speed = 0.5,
  mouseInteraction = true,
  className = ""
}) => {
  const containerRef = useRef(null);
  const particleSystemRef = useRef(null);
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
      position: [0, 0, 5]
    },
    lights: {
      ambient: { color: 0x404040, intensity: 0.8 }
    }
  });

  // Create particle system
  const createParticleSystem = async () => {
    if (!scene || !isInitialized) return;

    try {
      const THREE = await import('three');
      
      // Create geometry
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const colors_array = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);
      const velocities = new Float32Array(particleCount * 3);

      // Initialize particle properties
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // Positions
        positions[i3] = (Math.random() - 0.5) * 20;
        positions[i3 + 1] = (Math.random() - 0.5) * 20;
        positions[i3 + 2] = (Math.random() - 0.5) * 10;
        
        // Colors
        const color = new THREE.Color(colors[Math.floor(Math.random() * colors.length)]);
        colors_array[i3] = color.r;
        colors_array[i3 + 1] = color.g;
        colors_array[i3 + 2] = color.b;
        
        // Sizes
        sizes[i] = Math.random() * size + size * 0.5;
        
        // Velocities
        velocities[i3] = (Math.random() - 0.5) * speed;
        velocities[i3 + 1] = (Math.random() - 0.5) * speed;
        velocities[i3 + 2] = (Math.random() - 0.5) * speed;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors_array, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

      // Create shader material for better performance
      const vertexShader = `
        attribute float size;
        varying vec3 vColor;
        
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `;

      const fragmentShader = `
        varying vec3 vColor;
        
        void main() {
          float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
          float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
          gl_FragColor = vec4(vColor, alpha * 0.8);
        }
      `;

      const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      // Create particle system
      const particles = new THREE.Points(geometry, material);
      particles.userData = { velocities };
      
      scene.add(particles);
      particleSystemRef.current = particles;

    } catch (error) {
      console.error('Failed to create particle system:', error);
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

  // Intersection observer
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

    const animateParticles = () => {
      if (!isVisible || !particleSystemRef.current) return;

      const particles = particleSystemRef.current;
      const positions = particles.geometry.attributes.position.array;
      const velocities = particles.userData.velocities;
      const time = Date.now() * 0.001;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // Update positions based on velocities
        positions[i3] += velocities[i3] * 0.01;
        positions[i3 + 1] += velocities[i3 + 1] * 0.01;
        positions[i3 + 2] += velocities[i3 + 2] * 0.01;

        // Add wave motion
        positions[i3 + 1] += Math.sin(time + positions[i3] * 0.1) * 0.01;
        positions[i3] += Math.cos(time + positions[i3 + 1] * 0.1) * 0.005;

        // Mouse interaction
        if (mouseInteraction) {
          const mouseInfluenceX = mouseRef.current.x * 2;
          const mouseInfluenceY = mouseRef.current.y * 2;
          
          const dx = positions[i3] - mouseInfluenceX;
          const dy = positions[i3 + 1] - mouseInfluenceY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 3) {
            const force = (3 - distance) / 3;
            positions[i3] += dx * force * 0.02;
            positions[i3 + 1] += dy * force * 0.02;
          }
        }

        // Boundary wrapping
        if (positions[i3] > 10) positions[i3] = -10;
        if (positions[i3] < -10) positions[i3] = 10;
        if (positions[i3 + 1] > 10) positions[i3 + 1] = -10;
        if (positions[i3 + 1] < -10) positions[i3 + 1] = 10;
        if (positions[i3 + 2] > 5) positions[i3 + 2] = -5;
        if (positions[i3 + 2] < -5) positions[i3 + 2] = 5;
      }

      particles.geometry.attributes.position.needsUpdate = true;

      // Rotate entire particle system slowly
      particles.rotation.y += 0.001;
    };

    animate(animateParticles);
    
    return cleanup;
  }, [isInitialized, scene, animate, cleanup, isVisible, mouseInteraction, particleCount]);

  // Create particle system when ready
  useEffect(() => {
    if (isInitialized) {
      createParticleSystem();
    }
  }, [isInitialized, particleCount, colors, size, speed]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (scene && particleSystemRef.current) {
        scene.remove(particleSystemRef.current);
        if (particleSystemRef.current.geometry) {
          particleSystemRef.current.geometry.dispose();
        }
        if (particleSystemRef.current.material) {
          particleSystemRef.current.material.dispose();
        }
      }
    };
  }, [scene]);

  if (!isWebGLSupported) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        {/* CSS Fallback */}
        <div className="absolute inset-0">
          {[...Array(Math.min(particleCount / 10, 50))].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full opacity-60"
              style={{
                backgroundColor: colors[i % colors.length],
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `particle-drift ${5 + Math.random() * 5}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`
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
      style={{ minHeight: '300px' }}
    >
      {!isInitialized && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-slate-400 text-sm">Loading particles...</div>
        </div>
      )}
    </div>
  );
};

export default ParticleSystem;