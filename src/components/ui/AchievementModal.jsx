import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AchievementModal = ({ achievement, isOpen, onClose }) => {
  if (!achievement) return null;

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      rotateX: -15
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      rotateX: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      rotateX: 15,
      transition: {
        duration: 0.2
      }
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />
          
          {/* Modal Content */}
          <motion.div
            className="relative w-full max-w-2xl mx-auto"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="glass-morphism border-2 rounded-2xl overflow-hidden"
                 style={{ borderColor: achievement.color }}>
              
              {/* Header */}
              <div className="relative p-6 border-b border-white/10">
                {/* Background Gradient */}
                <div 
                  className="absolute inset-0 opacity-10"
                  style={{
                    background: `linear-gradient(135deg, ${achievement.color}40 0%, transparent 50%)`
                  }}
                />
                
                <div className="relative flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Achievement Icon */}
                    <div 
                      className="w-16 h-16 rounded-full flex items-center justify-center border-2"
                      style={{ 
                        borderColor: achievement.color,
                        backgroundColor: `${achievement.color}20`
                      }}
                    >
                      <div className="w-8 h-8 text-white">
                        {/* Icon based on achievement type */}
                        {achievement.icon === 'trophy' && (
                          <svg fill="currentColor" viewBox="0 0 24 24">
                            <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20.38C20.8 4 21.13 4.42 21.01 4.83L19.31 12H18.64C18.8 12.64 18.89 13.31 18.92 14H19.64L20.01 15.83C20.13 16.42 19.8 17 19.38 17H4.62C4.2 17 3.87 16.42 3.99 15.83L4.36 14H5.08C5.11 13.31 5.2 12.64 5.36 12H4.69L2.99 4.83C2.87 4.42 3.2 4 3.62 4H7ZM9 3V4H15V3H9ZM12 5C8.69 5 6 7.69 6 11S8.69 17 12 17 18 14.31 18 11 15.31 5 12 5ZM12 15C9.79 15 8 13.21 8 11S9.79 7 12 7 16 8.79 16 11 14.21 15 12 15Z"/>
                          </svg>
                        )}
                        {achievement.icon === 'medal' && (
                          <svg fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2L13.09 8.26L22 9L17 14L18.18 22.5L12 19.5L5.82 22.5L7 14L2 9L10.91 8.26L12 2Z"/>
                          </svg>
                        )}
                        {achievement.icon === 'star' && (
                          <svg fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2L15.09 8.26L22 9L17 14L18.18 22L12 18.77L5.82 22L7 14L2 9L8.91 8.26L12 2Z"/>
                          </svg>
                        )}
                        {achievement.icon === 'code' && (
                          <svg fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 3L4 7L8 11L9.4 9.6L6.8 7L9.4 4.4L8 3ZM16 3L14.6 4.4L17.2 7L14.6 9.6L16 11L20 7L16 3Z"/>
                          </svg>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">
                        {achievement.title}
                      </h2>
                      <p className="text-cyan-400 font-medium">
                        {achievement.event}
                      </p>
                      <p className="text-slate-400 text-sm">
                        {achievement.date}
                      </p>
                    </div>
                  </div>
                  
                  {/* Close Button */}
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                  >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
                  <p className="text-slate-300 leading-relaxed">
                    {achievement.description}
                  </p>
                </div>
                
                {/* Details Grid */}
                {achievement.details && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(achievement.details).map(([key, value]) => (
                        <div key={key} className="bg-white/5 rounded-lg p-4 border border-white/10">
                          <div className="text-sm text-cyan-400 font-medium capitalize mb-1">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </div>
                          <div className="text-white">
                            {Array.isArray(value) ? (
                              <div className="flex flex-wrap gap-2">
                                {value.map((item, index) => (
                                  <span 
                                    key={index}
                                    className="px-2 py-1 bg-cyan-500/20 text-cyan-300 text-xs rounded-full border border-cyan-500/30"
                                  >
                                    {item}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-sm">{value}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Category Badge */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-slate-400">Category:</span>
                    <span 
                      className="px-3 py-1 rounded-full text-sm font-medium border"
                      style={{ 
                        backgroundColor: `${achievement.color}20`,
                        borderColor: achievement.color,
                        color: achievement.color
                      }}
                    >
                      {achievement.category.charAt(0).toUpperCase() + achievement.category.slice(1)}
                    </span>
                  </div>
                  
                  {/* Decorative Elements */}
                  <div className="flex space-x-1">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: achievement.color }}
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.2
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AchievementModal;