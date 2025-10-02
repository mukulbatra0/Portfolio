import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ContactCard = ({ contact, index, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getIcon = (type) => {
    const iconProps = {
      className: "w-6 h-6",
      fill: "currentColor",
      viewBox: "0 0 24 24"
    };

    switch (type) {
      case 'email':
        return (
          <svg {...iconProps}>
            <path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z"/>
          </svg>
        );
      case 'phone':
        return (
          <svg {...iconProps}>
            <path d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z"/>
          </svg>
        );
      case 'location':
        return (
          <svg {...iconProps}>
            <path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z"/>
          </svg>
        );
      case 'whatsapp':
        return (
          <svg {...iconProps}>
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M8.53 7.33C8.37 7.33 8.1 7.39 7.87 7.64C7.65 7.89 7 8.5 7 9.71C7 10.93 7.89 12.1 8 12.27C8.14 12.44 9.76 14.94 12.25 16C12.84 16.27 13.3 16.42 13.66 16.53C14.25 16.72 14.79 16.69 15.22 16.63C15.7 16.56 16.68 16.03 16.89 15.45C17.1 14.87 17.1 14.38 17.04 14.27C16.97 14.17 16.81 14.11 16.56 14C16.31 13.86 15.09 13.26 14.87 13.18C14.64 13.1 14.5 13.06 14.31 13.3C14.15 13.55 13.67 14.11 13.53 14.27C13.38 14.44 13.24 14.46 13 14.34C12.74 14.21 11.94 13.95 11 13.11C10.26 12.45 9.77 11.64 9.62 11.39C9.5 11.15 9.61 11 9.73 10.89C9.84 10.78 10 10.6 10.1 10.45C10.23 10.31 10.27 10.2 10.35 10.04C10.43 9.87 10.39 9.73 10.33 9.61C10.27 9.5 9.77 8.26 9.56 7.77C9.36 7.29 9.16 7.35 9 7.34C8.86 7.33 8.7 7.33 8.53 7.33Z"/>
          </svg>
        );
      default:
        return (
          <svg {...iconProps}>
            <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
          </svg>
        );
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      rotateX: -15
    },
    visible: { 
      opacity: 1, 
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.1,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="relative group cursor-pointer"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      whileHover={{ 
        scale: 1.05,
        rotateY: 5,
        z: 10
      }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
    >
      {/* Card Container */}
      <div className="glass-morphism rounded-2xl border-2 border-white/20 overflow-hidden transition-all duration-300 hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/25">
        
        {/* Card Header */}
        <div className="relative p-6 border-b border-white/10">
          {/* Background Gradient */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              background: `linear-gradient(135deg, ${contact.color || '#22D3EE'}40 0%, transparent 50%)`
            }}
          />
          
          <div className="relative flex items-center justify-between">
            {/* Icon */}
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-300"
              style={{ 
                borderColor: contact.color || '#22D3EE',
                backgroundColor: `${contact.color || '#22D3EE'}20`
              }}
            >
              <div style={{ color: contact.color || '#22D3EE' }}>
                {getIcon(contact.type)}
              </div>
            </div>
            
            {/* Status Indicator */}
            {contact.status && (
              <div className="flex items-center space-x-2">
                <div 
                  className={`w-3 h-3 rounded-full ${
                    contact.status === 'online' ? 'bg-green-500' : 
                    contact.status === 'busy' ? 'bg-yellow-500' : 'bg-gray-500'
                  }`}
                />
                <span className="text-xs text-slate-400 capitalize">
                  {contact.status}
                </span>
              </div>
            )}
          </div>
        </div>
        
        {/* Card Content */}
        <div className="p-6">
          {/* Title */}
          <h3 className="text-xl font-bold text-white mb-2">
            {contact.title}
          </h3>
          
          {/* Primary Info */}
          <p className="text-cyan-400 font-medium mb-2">
            {contact.primary}
          </p>
          
          {/* Secondary Info */}
          {contact.secondary && (
            <p className="text-slate-300 text-sm mb-4">
              {contact.secondary}
            </p>
          )}
          
          {/* Description */}
          <p className="text-slate-400 text-sm leading-relaxed mb-4">
            {contact.description}
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            {contact.actions?.map((action, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  if (action.onClick) action.onClick();
                }}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-all duration-300 hover:scale-105 ${
                  action.primary 
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400 hover:bg-cyan-500/30'
                    : 'bg-white/10 border-white/20 text-slate-300 hover:border-white/40'
                }`}
              >
                {action.label}
              </button>
            ))}
          </div>
          
          {/* Response Time */}
          {contact.responseTime && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.7L16.2,16.2Z"/>
                </svg>
                <span>Response time: {contact.responseTime}</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Hover Effects */}
        {isHovered && (
          <>
            {/* Floating Particles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{ 
                  backgroundColor: contact.color || '#22D3EE',
                  left: `${20 + i * 15}%`,
                  top: `${20 + i * 10}%`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  y: [0, -30, -60]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
            
            {/* Glow Effect */}
            <motion.div
              className="absolute inset-0 rounded-2xl opacity-20 pointer-events-none"
              style={{ 
                background: `radial-gradient(circle at center, ${contact.color || '#22D3EE'}60, transparent 70%)`,
                filter: 'blur(20px)'
              }}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </>
        )}
        
        {/* Ripple Effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl border-2 opacity-0 pointer-events-none"
          style={{ borderColor: contact.color || '#22D3EE' }}
          animate={isHovered ? {
            scale: [1, 1.1, 1.2],
            opacity: [0.5, 0.2, 0]
          } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </div>
    </motion.div>
  );
};

export default ContactCard;