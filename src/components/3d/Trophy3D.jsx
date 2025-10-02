import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

const Trophy3D = ({ achievement, isVisible, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const trophyRef = useRef(null);

  const getTrophyShape = (type) => {
    switch (type) {
      case 'trophy':
        return (
          <div className="relative">
            {/* Trophy Cup */}
            <div 
              className="w-16 h-12 rounded-t-full border-4 relative overflow-hidden"
              style={{ 
                borderColor: achievement.color,
                background: `linear-gradient(145deg, ${achievement.color}20, ${achievement.color}40)`
              }}
            >
              {/* Inner Glow */}
              <div 
                className="absolute inset-2 rounded-t-full opacity-60"
                style={{ 
                  background: `radial-gradient(ellipse at center top, ${achievement.color}60, transparent)`
                }}
              />
              
              {/* Handles */}
              <div 
                className="absolute -left-2 top-2 w-4 h-6 border-2 rounded-full border-l-0"
                style={{ borderColor: achievement.color }}
              />
              <div 
                className="absolute -right-2 top-2 w-4 h-6 border-2 rounded-full border-r-0"
                style={{ borderColor: achievement.color }}
              />
            </div>
            
            {/* Trophy Base */}
            <div 
              className="w-20 h-3 mx-auto border-2 rounded"
              style={{ 
                borderColor: achievement.color,
                background: `linear-gradient(90deg, ${achievement.color}30, ${achievement.color}50, ${achievement.color}30)`
              }}
            />
            <div 
              className="w-24 h-2 mx-auto mt-1 border-2 rounded"
              style={{ 
                borderColor: achievement.color,
                background: `linear-gradient(90deg, ${achievement.color}20, ${achievement.color}40, ${achievement.color}20)`
              }}
            />
          </div>
        );
      
      case 'medal':
        return (
          <div className="relative">
            {/* Medal Circle */}
            <div 
              className="w-16 h-16 rounded-full border-4 flex items-center justify-center relative overflow-hidden"
              style={{ 
                borderColor: achievement.color,
                background: `radial-gradient(circle at 30% 30%, ${achievement.color}60, ${achievement.color}30)`
              }}
            >
              {/* Star in Medal */}
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L15.09 8.26L22 9L17 14L18.18 22L12 18.77L5.82 22L7 14L2 9L8.91 8.26L12 2Z"/>
              </svg>
              
              {/* Medal Shine */}
              <div 
                className="absolute inset-0 rounded-full opacity-40"
                style={{ 
                  background: `linear-gradient(135deg, transparent 40%, ${achievement.color}80 50%, transparent 60%)`
                }}
              />
            </div>
            
            {/* Ribbon */}
            <div className="flex justify-center -mt-2">
              <div 
                className="w-2 h-8 mx-1 rounded-b"
                style={{ backgroundColor: achievement.color }}
              />
              <div 
                className="w-2 h-8 mx-1 rounded-b opacity-80"
                style={{ backgroundColor: achievement.color }}
              />
            </div>
          </div>
        );
      
      case 'star':
        return (
          <div className="relative">
            {/* Main Star */}
            <div 
              className="w-16 h-16 flex items-center justify-center relative"
              style={{ 
                background: `radial-gradient(circle, ${achievement.color}60, ${achievement.color}30)`,
                clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
              }}
            >
              {/* Inner Star Glow */}
              <div 
                className="absolute inset-2 opacity-80"
                style={{ 
                  background: `radial-gradient(circle, ${achievement.color}80, transparent)`,
                  clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
                }}
              />
            </div>
          </div>
        );
      
      case 'code':
        return (
          <div className="relative">
            {/* Code Badge */}
            <div 
              className="w-16 h-16 rounded-lg border-4 flex items-center justify-center relative overflow-hidden"
              style={{ 
                borderColor: achievement.color,
                background: `linear-gradient(145deg, ${achievement.color}20, ${achievement.color}40)`
              }}
            >
              {/* Code Icon */}
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 3L4 7L8 11L9.4 9.6L6.8 7L9.4 4.4L8 3ZM16 3L14.6 4.4L17.2 7L14.6 9.6L16 11L20 7L16 3Z"/>
              </svg>
              
              {/* Digital Grid Pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="grid grid-cols-4 grid-rows-4 h-full w-full">
                  {[...Array(16)].map((_, i) => (
                    <div 
                      key={i}
                      className="border border-white/20"
                      style={{ 
                        backgroundColor: Math.random() > 0.7 ? achievement.color + '40' : 'transparent'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div 
            className="w-16 h-16 rounded-full border-4 flex items-center justify-center"
            style={{ 
              borderColor: achievement.color,
              background: `radial-gradient(circle, ${achievement.color}60, ${achievement.color}30)`
            }}
          >
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L15.09 8.26L22 9L17 14L18.18 22L12 18.77L5.82 22L7 14L2 9L8.91 8.26L12 2Z"/>
            </svg>
          </div>
        );
    }
  };

  return (
    <motion.div
      ref={trophyRef}
      className="relative cursor-pointer"
      initial={{ 
        opacity: 0, 
        scale: 0.5, 
        rotateY: -90,
        y: 50
      }}
      animate={isVisible ? { 
        opacity: 1, 
        scale: 1, 
        rotateY: 0,
        y: 0
      } : {}}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.2,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        scale: 1.1,
        rotateY: 15,
        rotateX: -10,
        z: 20
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
    >
      {/* 3D Trophy Container */}
      <motion.div
        className="relative"
        animate={isVisible ? {
          rotateY: [0, 5, -5, 0],
          y: [0, -5, 0, 5, 0]
        } : {}}
        transition={{
          rotateY: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        {/* Glow Effect */}
        <motion.div
          className="absolute inset-0 rounded-full blur-xl opacity-0"
          style={{ backgroundColor: achievement.color }}
          animate={isHovered ? { 
            opacity: 0.4,
            scale: 1.5
          } : { 
            opacity: 0.2,
            scale: 1.2
          }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Trophy Shape */}
        <div className="relative z-10">
          {getTrophyShape(achievement.icon)}
        </div>
        
        {/* Floating Particles */}
        {isHovered && (
          <>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{ 
                  backgroundColor: achievement.color,
                  left: '50%',
                  top: '50%'
                }}
                initial={{ 
                  x: 0, 
                  y: 0, 
                  opacity: 0,
                  scale: 0
                }}
                animate={{ 
                  x: Math.cos(i * 45 * Math.PI / 180) * 30,
                  y: Math.sin(i * 45 * Math.PI / 180) * 30,
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0]
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.1
                }}
              />
            ))}
          </>
        )}
        
        {/* Sparkle Effects */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={isVisible ? {
            rotate: 360
          } : {}}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${20 + i * 20}%`,
                top: `${20 + i * 15}%`,
                boxShadow: `0 0 4px ${achievement.color}`
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.5
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Trophy3D;