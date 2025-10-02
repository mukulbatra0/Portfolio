import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const AchievementBadge = ({ achievement, index, onBadgeClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const badgeRef = useRef(null);
  const floatingAnimationRef = useRef(null);

  const getIconComponent = (iconType) => {
    const iconProps = {
      className: "w-8 h-8 text-white",
      fill: "currentColor"
    };

    switch (iconType) {
      case 'trophy':
        return (
          <svg {...iconProps} viewBox="0 0 24 24">
            <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20.38C20.8 4 21.13 4.42 21.01 4.83L19.31 12H18.64C18.8 12.64 18.89 13.31 18.92 14H19.64L20.01 15.83C20.13 16.42 19.8 17 19.38 17H4.62C4.2 17 3.87 16.42 3.99 15.83L4.36 14H5.08C5.11 13.31 5.2 12.64 5.36 12H4.69L2.99 4.83C2.87 4.42 3.2 4 3.62 4H7ZM9 3V4H15V3H9ZM12 5C8.69 5 6 7.69 6 11S8.69 17 12 17 18 14.31 18 11 15.31 5 12 5ZM12 15C9.79 15 8 13.21 8 11S9.79 7 12 7 16 8.79 16 11 14.21 15 12 15Z"/>
          </svg>
        );
      case 'medal':
        return (
          <svg {...iconProps} viewBox="0 0 24 24">
            <path d="M12 2L13.09 8.26L22 9L17 14L18.18 22.5L12 19.5L5.82 22.5L7 14L2 9L10.91 8.26L12 2Z"/>
          </svg>
        );
      case 'star':
        return (
          <svg {...iconProps} viewBox="0 0 24 24">
            <path d="M12 2L15.09 8.26L22 9L17 14L18.18 22L12 18.77L5.82 22L7 14L2 9L8.91 8.26L12 2Z"/>
          </svg>
        );
      case 'code':
        return (
          <svg {...iconProps} viewBox="0 0 24 24">
            <path d="M8 3L4 7L8 11L9.4 9.6L6.8 7L9.4 4.4L8 3ZM16 3L14.6 4.4L17.2 7L14.6 9.6L16 11L20 7L16 3Z"/>
          </svg>
        );
      default:
        return (
          <svg {...iconProps} viewBox="0 0 24 24">
            <path d="M12 2L15.09 8.26L22 9L17 14L18.18 22L12 18.77L5.82 22L7 14L2 9L8.91 8.26L12 2Z"/>
          </svg>
        );
    }
  };

  // Floating animation effect
  useEffect(() => {
    const startFloating = () => {
      if (badgeRef.current) {
        floatingAnimationRef.current = setInterval(() => {
          if (badgeRef.current && !isHovered) {
            const randomY = Math.sin(Date.now() * 0.001 + index) * 3;
            const randomRotate = Math.sin(Date.now() * 0.0008 + index) * 2;
            badgeRef.current.style.transform = `translateY(${randomY}px) rotateZ(${randomRotate}deg)`;
          }
        }, 16);
      }
    };

    startFloating();
    return () => {
      if (floatingAnimationRef.current) {
        clearInterval(floatingAnimationRef.current);
      }
    };
  }, [index, isHovered]);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 300);
    onBadgeClick && onBadgeClick(achievement);
  };

  return (
    <motion.div
      ref={badgeRef}
      className="relative group cursor-pointer"
      initial={{ opacity: 0, y: 50, rotateY: -15, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        rotateY: 0, 
        scale: 1,
        rotateZ: 0
      }}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.15,
        ease: "easeOut",
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        scale: 1.1,
        rotateY: 10,
        rotateX: 5,
        z: 20,
        transition: { duration: 0.3 }
      }}
      whileTap={{
        scale: 0.95,
        rotateZ: 5,
        transition: { duration: 0.1 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleClick}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
    >
      {/* Main Badge Container */}
      <div className="relative">
        {/* Glow Effect */}
        <motion.div
          className="absolute inset-0 rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"
          style={{ backgroundColor: achievement.color }}
          animate={isHovered ? { scale: 1.2 } : { scale: 1 }}
        />
        
        {/* Badge Background */}
        <motion.div
          className="relative w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center glass-morphism border-2 overflow-hidden"
          style={{ 
            borderColor: achievement.color,
            transformStyle: 'preserve-3d'
          }}
          animate={isHovered ? { 
            boxShadow: [
              `0 0 20px ${achievement.color}40`,
              `0 0 40px ${achievement.color}60`,
              `0 0 20px ${achievement.color}40`
            ],
            borderColor: achievement.color,
            rotateY: [0, 5, -5, 0],
            scale: [1, 1.05, 1]
          } : {
            boxShadow: `0 0 10px ${achievement.color}20`
          }}
          transition={{
            boxShadow: { duration: 2, repeat: Infinity },
            rotateY: { duration: 4, repeat: Infinity },
            scale: { duration: 2, repeat: Infinity }
          }}
        >
          {/* Animated Background Gradient */}
          <motion.div
            className="absolute inset-0 rounded-full opacity-20"
            style={{
              background: `radial-gradient(circle, ${achievement.color}40 0%, transparent 70%)`
            }}
            animate={isHovered ? { scale: 1.2, opacity: 0.3 } : { scale: 1, opacity: 0.2 }}
          />
          
          {/* Icon Container */}
          <motion.div
            className="relative z-10"
            animate={isHovered ? { 
              rotateY: 360,
              scale: 1.1
            } : { rotateY: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            {getIconComponent(achievement.icon)}
          </motion.div>
          
          {/* Enhanced Floating Particles */}
          {isHovered && (
            <>
              {/* Primary Particles */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={`primary-${i}`}
                  className="absolute w-2 h-2 rounded-full"
                  style={{ 
                    backgroundColor: achievement.color,
                    boxShadow: `0 0 6px ${achievement.color}`
                  }}
                  initial={{ 
                    x: 0, 
                    y: 0, 
                    opacity: 0,
                    scale: 0,
                    rotateZ: 0
                  }}
                  animate={{ 
                    x: Math.cos(i * 45 * Math.PI / 180) * (30 + Math.sin(Date.now() * 0.001) * 10),
                    y: Math.sin(i * 45 * Math.PI / 180) * (30 + Math.cos(Date.now() * 0.001) * 10),
                    opacity: [0, 1, 0.5, 0],
                    scale: [0, 1.2, 0.8, 0],
                    rotateZ: [0, 180, 360]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: "easeInOut"
                  }}
                />
              ))}
              
              {/* Secondary Sparkle Particles */}
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={`sparkle-${i}`}
                  className="absolute w-1 h-1 rounded-full"
                  style={{ 
                    backgroundColor: '#ffffff',
                    boxShadow: `0 0 4px ${achievement.color}`
                  }}
                  initial={{ 
                    x: 0, 
                    y: 0, 
                    opacity: 0,
                    scale: 0
                  }}
                  animate={{ 
                    x: Math.cos(i * 30 * Math.PI / 180) * (20 + Math.random() * 25),
                    y: Math.sin(i * 30 * Math.PI / 180) * (20 + Math.random() * 25),
                    opacity: [0, 1, 0],
                    scale: [0, 0.8, 0]
                  }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.05 + Math.random() * 0.5,
                    ease: "easeOut"
                  }}
                />
              ))}
            </>
          )}
          
          {/* Click Burst Effect */}
          {isClicked && (
            <>
              {[...Array(16)].map((_, i) => (
                <motion.div
                  key={`burst-${i}`}
                  className="absolute w-1 h-1 rounded-full"
                  style={{ backgroundColor: achievement.color }}
                  initial={{ 
                    x: 0, 
                    y: 0, 
                    opacity: 1,
                    scale: 1
                  }}
                  animate={{ 
                    x: Math.cos(i * 22.5 * Math.PI / 180) * 60,
                    y: Math.sin(i * 22.5 * Math.PI / 180) * 60,
                    opacity: 0,
                    scale: 0
                  }}
                  transition={{ 
                    duration: 0.6,
                    ease: "easeOut"
                  }}
                />
              ))}
            </>
          )}
        </motion.div>
        
        {/* Achievement Title */}
        <motion.div
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="bg-slate-800/90 backdrop-blur-sm px-3 py-1 rounded-lg border border-cyan-500/30 whitespace-nowrap">
            <p className="text-xs font-medium text-white">{achievement.title}</p>
            <p className="text-xs text-cyan-400">{achievement.date}</p>
          </div>
        </motion.div>
      </div>
      
      {/* Enhanced Ripple Effects */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 opacity-0"
        style={{ borderColor: achievement.color }}
        animate={isHovered ? {
          scale: [1, 1.8, 2.2],
          opacity: [0.6, 0.3, 0]
        } : {}}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      
      {/* Secondary Ripple */}
      <motion.div
        className="absolute inset-0 rounded-full border opacity-0"
        style={{ borderColor: achievement.color }}
        animate={isHovered ? {
          scale: [1, 1.4, 1.8],
          opacity: [0.4, 0.2, 0]
        } : {}}
        transition={{ duration: 1.2, repeat: Infinity, delay: 0.3 }}
      />
      
      {/* Glow Pulse Effect */}
      <motion.div
        className="absolute inset-0 rounded-full opacity-0"
        style={{ 
          background: `radial-gradient(circle, ${achievement.color}40 0%, transparent 70%)`,
          filter: 'blur(8px)'
        }}
        animate={isHovered ? {
          scale: [1, 1.3, 1],
          opacity: [0, 0.6, 0]
        } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
  );
};

export default AchievementBadge;