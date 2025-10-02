import React, { useState } from 'react';
import { motion } from 'framer-motion';

const TestimonialCard = ({ testimonial, index, isActive, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      rotateY: -15
    },
    visible: { 
      opacity: 1, 
      scale: isActive ? 1.05 : 0.95,
      rotateY: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.1,
        ease: "easeOut"
      }
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <motion.svg
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-600'}`}
        fill="currentColor"
        viewBox="0 0 24 24"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: i * 0.1, duration: 0.3 }}
      >
        <path d="M12 2L15.09 8.26L22 9L17 14L18.18 22L12 18.77L5.82 22L7 14L2 9L8.91 8.26L12 2Z"/>
      </motion.svg>
    ));
  };

  const getRelationshipColor = (relationship) => {
    const colors = {
      "Academic Mentor": "#10B981",
      "Project Collaborator": "#22D3EE", 
      "Freelance Client": "#8B5CF6",
      "Competition Judge": "#F59E0B",
      "Technical Mentor": "#EF4444",
      "Workshop Student": "#06B6D4"
    };
    return colors[relationship] || "#64748B";
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className={`relative cursor-pointer transition-all duration-300 ${
        isActive ? 'z-10' : 'z-0'
      }`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      whileHover={{ 
        scale: isActive ? 1.08 : 1.02,
        rotateY: 5,
        z: 20
      }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
    >
      {/* Card Container */}
      <div className={`glass-morphism rounded-2xl border-2 overflow-hidden transition-all duration-300 ${
        isActive 
          ? 'border-cyan-500 shadow-2xl shadow-cyan-500/25' 
          : 'border-white/20 hover:border-cyan-500/50'
      }`}>
        
        {/* Card Header */}
        <div className="relative p-6 border-b border-white/10">
          {/* Background Gradient */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              background: `linear-gradient(135deg, ${getRelationshipColor(testimonial.relationship)}40 0%, transparent 50%)`
            }}
          />
          
          <div className="relative flex items-center space-x-4">
            {/* Profile Image */}
            <div className="relative">
              <div className="w-16 h-16 rounded-full overflow-hidden border-3 border-cyan-500/50">
                <div 
                  className="w-full h-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold text-xl"
                >
                  {testimonial.name.split(' ').map(n => n[0]).join('')}
                </div>
              </div>
              
              {/* Online Status Indicator */}
              <motion.div
                className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-slate-900"
                animate={isActive ? {
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.7, 1]
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-1">
                {testimonial.name}
              </h3>
              <p className="text-cyan-400 font-medium text-sm mb-1">
                {testimonial.role}
              </p>
              <p className="text-slate-400 text-xs">
                {testimonial.company}
              </p>
            </div>
          </div>
          
          {/* Relationship Badge */}
          <div className="mt-4 flex items-center justify-between">
            <span 
              className="px-3 py-1 rounded-full text-xs font-medium border"
              style={{ 
                backgroundColor: `${getRelationshipColor(testimonial.relationship)}20`,
                borderColor: getRelationshipColor(testimonial.relationship),
                color: getRelationshipColor(testimonial.relationship)
              }}
            >
              {testimonial.relationship}
            </span>
            
            <div className="text-xs text-slate-400">
              {testimonial.date}
            </div>
          </div>
        </div>
        
        {/* Card Content */}
        <div className="p-6">
          {/* Rating */}
          <div className="flex items-center space-x-1 mb-4">
            {renderStars(testimonial.rating)}
            <span className="ml-2 text-sm text-slate-400">
              ({testimonial.rating}/5)
            </span>
          </div>
          
          {/* Testimonial Content */}
          <blockquote className="text-slate-300 leading-relaxed mb-4 relative">
            <svg className="absolute -top-2 -left-2 w-6 h-6 text-cyan-500/30" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14,17H17L19,13V7H13V13H16M6,17H9L11,13V7H5V13H8L6,17Z"/>
            </svg>
            <p className="relative z-10 pl-4">
              {testimonial.content}
            </p>
          </blockquote>
          
          {/* Skills Highlighted */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-white mb-2">Skills Highlighted:</h4>
            <div className="flex flex-wrap gap-2">
              {testimonial.skills_highlighted.slice(0, 3).map((skill, idx) => (
                <motion.span
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="px-2 py-1 bg-cyan-500/20 text-cyan-300 text-xs rounded-full border border-cyan-500/30"
                >
                  {skill}
                </motion.span>
              ))}
              {testimonial.skills_highlighted.length > 3 && (
                <span className="px-2 py-1 bg-slate-500/20 text-slate-400 text-xs rounded-full border border-slate-500/30">
                  +{testimonial.skills_highlighted.length - 3} more
                </span>
              )}
            </div>
          </div>
          
          {/* Project Context */}
          <div className="text-xs text-slate-400 italic">
            Context: {testimonial.project_context}
          </div>
        </div>
        
        {/* Hover Effects */}
        {isHovered && (
          <>
            {/* Floating Particles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-cyan-400"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${20 + i * 10}%`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  y: [0, -20, -40]
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
                background: `radial-gradient(circle at center, ${getRelationshipColor(testimonial.relationship)}60, transparent 70%)`,
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
        
        {/* Active Card Indicator */}
        {isActive && (
          <motion.div
            className="absolute inset-0 rounded-2xl border-2 border-cyan-400 pointer-events-none"
            initial={{ opacity: 0, scale: 1 }}
            animate={{ 
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.02, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </div>
    </motion.div>
  );
};

export default TestimonialCard;