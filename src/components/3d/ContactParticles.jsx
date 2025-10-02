import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const ContactParticles = ({ isVisible, particleCount = 50 }) => {
  const containerRef = useRef(null);
  const [particles, setParticles] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Initialize particles
  useEffect(() => {
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      speed: Math.random() * 2 + 0.5,
      direction: Math.random() * 360,
      opacity: Math.random() * 0.8 + 0.2,
      color: ['#22D3EE', '#10B981', '#8B5CF6', '#F59E0B'][Math.floor(Math.random() * 4)],
      type: ['circle', 'square', 'triangle'][Math.floor(Math.random() * 3)]
    }));
    setParticles(newParticles);
  }, [particleCount]);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  const getParticleShape = (particle) => {
    const baseProps = {
      className: "absolute transition-all duration-300",
      style: {
        width: `${particle.size}px`,
        height: `${particle.size}px`,
        backgroundColor: particle.color,
        opacity: particle.opacity
      }
    };

    switch (particle.type) {
      case 'circle':
        return <div {...baseProps} style={{...baseProps.style, borderRadius: '50%'}} />;
      case 'square':
        return <div {...baseProps} />;
      case 'triangle':
        return (
          <div 
            {...baseProps} 
            style={{
              ...baseProps.style,
              width: 0,
              height: 0,
              backgroundColor: 'transparent',
              borderLeft: `${particle.size/2}px solid transparent`,
              borderRight: `${particle.size/2}px solid transparent`,
              borderBottom: `${particle.size}px solid ${particle.color}`
            }} 
          />
        );
      default:
        return <div {...baseProps} style={{...baseProps.style, borderRadius: '50%'}} />;
    }
  };

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
    >
      {/* Floating Particles */}
      {particles.map((particle) => {
        const distanceFromMouse = Math.sqrt(
          Math.pow(particle.x - mousePosition.x, 2) + 
          Math.pow(particle.y - mousePosition.y, 2)
        );
        const isNearMouse = distanceFromMouse < 15;

        return (
          <motion.div
            key={particle.id}
            className="absolute"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={isVisible ? {
              x: [0, Math.cos(particle.direction * Math.PI / 180) * 20, 0],
              y: [0, Math.sin(particle.direction * Math.PI / 180) * 20, 0],
              rotate: [0, 360],
              scale: isNearMouse ? 1.5 : 1,
              opacity: isNearMouse ? 1 : particle.opacity
            } : {}}
            transition={{
              x: { duration: 4 + particle.speed, repeat: Infinity, ease: "easeInOut" },
              y: { duration: 3 + particle.speed, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 8 + particle.speed, repeat: Infinity, ease: "linear" },
              scale: { duration: 0.3 },
              opacity: { duration: 0.3 }
            }}
          >
            {getParticleShape(particle)}
          </motion.div>
        );
      })}

      {/* Connection Lines */}
      <svg className="absolute inset-0 w-full h-full">
        {particles.map((particle, i) => {
          return particles.slice(i + 1).map((otherParticle, j) => {
            const distance = Math.sqrt(
              Math.pow(particle.x - otherParticle.x, 2) + 
              Math.pow(particle.y - otherParticle.y, 2)
            );
            
            if (distance < 20) {
              return (
                <motion.line
                  key={`${i}-${j}`}
                  x1={`${particle.x}%`}
                  y1={`${particle.y}%`}
                  x2={`${otherParticle.x}%`}
                  y2={`${otherParticle.y}%`}
                  stroke="rgba(34, 211, 238, 0.3)"
                  strokeWidth="1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isVisible ? 0.3 : 0 }}
                  transition={{ duration: 0.5 }}
                />
              );
            }
            return null;
          });
        })}
      </svg>

      {/* Mouse Interaction Effect */}
      <motion.div
        className="absolute w-20 h-20 rounded-full border border-cyan-400/30 pointer-events-none"
        style={{
          left: `${mousePosition.x}%`,
          top: `${mousePosition.y}%`,
          transform: 'translate(-50%, -50%)'
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
};

export default ContactParticles;