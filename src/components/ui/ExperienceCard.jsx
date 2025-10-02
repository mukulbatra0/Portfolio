import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ExperienceCard = ({ experience, index, isVisible }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      x: index % 2 === 0 ? -50 : 50,
      rotateY: index % 2 === 0 ? -15 : 15
    },
    visible: { 
      opacity: 1, 
      x: 0,
      rotateY: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.2,
        ease: "easeOut"
      }
    }
  };

  const expandVariants = {
    collapsed: { height: "auto", opacity: 1 },
    expanded: { 
      height: "auto", 
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeInOut"
      }
    }
  };

  const getTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'freelance':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7L12 12L22 7L12 2ZM2 17L12 22L22 17M2 12L12 17L22 12"/>
          </svg>
        );
      case 'education':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z"/>
          </svg>
        );
      case 'career goal':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M5,4V7H10.5V19H13.5V7H19V4H5Z"/>
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20,6C20.58,6 21.05,6.2 21.42,6.59C21.8,7 22,7.45 22,8V19C22,19.55 21.8,20 21.42,20.41C21.05,20.8 20.58,21 20,21H4C3.42,21 2.95,20.8 2.58,20.41C2.2,20 2,19.55 2,19V8C2,7.45 2.2,7 2.58,6.59C2.95,6.2 3.42,6 4,6H8V4C8,3.42 8.2,2.95 8.58,2.58C8.95,2.2 9.42,2 10,2H14C14.58,2 15.05,2.2 15.42,2.58C15.8,2.95 16,3.42 16,4V6H20M4,8V19H20V8H4M10,4V6H14V4H10Z"/>
          </svg>
        );
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      className={`relative mb-8 ${index % 2 === 0 ? 'md:mr-auto md:ml-0' : 'md:ml-auto md:mr-0'} w-full md:w-5/12`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Timeline Connector */}
      <div className={`absolute top-6 w-4 h-4 rounded-full border-4 bg-slate-900 z-10 ${
        index % 2 === 0 ? 'md:-right-8' : 'md:-left-8'
      } left-4 md:left-auto`}
        style={{ borderColor: experience.color }}
      >
        {/* Pulse Effect */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: experience.color }}
          animate={isVisible ? {
            scale: [1, 1.5, 1],
            opacity: [0.5, 0, 0.5]
          } : {}}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Experience Card */}
      <motion.div
        className="glass-morphism rounded-xl border-2 overflow-hidden cursor-pointer"
        style={{ borderColor: experience.color }}
        whileHover={{ 
          scale: 1.02,
          boxShadow: `0 10px 40px ${experience.color}30`
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Card Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              {/* Company Logo/Icon */}
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center border-2"
                style={{ 
                  borderColor: experience.color,
                  backgroundColor: `${experience.color}20`
                }}
              >
                <div style={{ color: experience.color }}>
                  {getTypeIcon(experience.type)}
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-white mb-1">
                  {experience.title}
                </h3>
                <p className="text-cyan-400 font-medium">
                  {experience.company}
                </p>
              </div>
            </div>
            
            {/* Type Badge */}
            <span 
              className="px-3 py-1 rounded-full text-sm font-medium border"
              style={{ 
                backgroundColor: `${experience.color}20`,
                borderColor: experience.color,
                color: experience.color
              }}
            >
              {experience.type}
            </span>
          </div>
          
          {/* Period and Location */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19,3H18V1H16V3H8V1H6V3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M19,19H5V8H19V19Z"/>
              </svg>
              <span>{experience.period}</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z"/>
              </svg>
              <span>{experience.location}</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2Z"/>
              </svg>
              <span>{experience.duration}</span>
            </div>
          </div>
          
          {/* Description */}
          <p className="text-slate-300 mt-4 leading-relaxed">
            {experience.description}
          </p>
          
          {/* Expand/Collapse Indicator */}
          <div className="flex items-center justify-center mt-4">
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="text-cyan-400"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
              </svg>
            </motion.div>
          </div>
        </div>
        
        {/* Expandable Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              variants={expandVariants}
              initial="collapsed"
              animate="expanded"
              exit="collapsed"
              className="p-6 space-y-6"
            >
              {/* Responsibilities */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <svg className="w-5 h-5 text-cyan-400 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,16.5L6.5,12L7.91,10.59L11,13.67L16.59,8.09L18,9.5L11,16.5Z"/>
                  </svg>
                  Key Responsibilities
                </h4>
                <ul className="space-y-2">
                  {experience.responsibilities.map((responsibility, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start space-x-3 text-slate-300"
                    >
                      <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                      <span>{responsibility}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
              
              {/* Technologies */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <svg className="w-5 h-5 text-cyan-400 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8,3A2,2 0 0,0 6,5V9A2,2 0 0,1 4,11H3V13H4A2,2 0 0,1 6,15V19A2,2 0 0,0 8,21H10V19H8V14A2,2 0 0,0 6,12A2,2 0 0,0 8,10V5H10V3M16,3A2,2 0 0,1 18,5V9A2,2 0 0,0 20,11H21V13H20A2,2 0 0,0 18,15V19A2,2 0 0,1 16,21H14V19H16V14A2,2 0 0,1 18,12A2,2 0 0,1 16,10V5H14V3H16Z"/>
                  </svg>
                  Technologies Used
                </h4>
                <div className="flex flex-wrap gap-2">
                  {experience.technologies.map((tech, idx) => (
                    <motion.span
                      key={idx}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="px-3 py-1 bg-white/10 text-cyan-300 text-sm rounded-full border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </div>
              
              {/* Achievements */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <svg className="w-5 h-5 text-cyan-400 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L15.09 8.26L22 9L17 14L18.18 22L12 18.77L5.82 22L7 14L2 9L8.91 8.26L12 2Z"/>
                  </svg>
                  Key Achievements
                </h4>
                <ul className="space-y-2">
                  {experience.achievements.map((achievement, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start space-x-3 text-slate-300"
                    >
                      <div className="w-2 h-2 rounded-full bg-yellow-400 mt-2 flex-shrink-0" />
                      <span>{achievement}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
              
              {/* Related Projects */}
              {experience.projects && experience.projects.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <svg className="w-5 h-5 text-cyan-400 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M7.5,13A2.5,2.5 0 0,0 5,15.5A2.5,2.5 0 0,0 7.5,18A2.5,2.5 0 0,0 10,15.5A2.5,2.5 0 0,0 7.5,13M16.5,13A2.5,2.5 0 0,0 14,15.5A2.5,2.5 0 0,0 16.5,18A2.5,2.5 0 0,0 19,15.5A2.5,2.5 0 0,0 16.5,13Z"/>
                    </svg>
                    Related Projects
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {experience.projects.map((project, idx) => (
                      <motion.span
                        key={idx}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full border border-purple-500/30 hover:bg-purple-500/30 transition-colors cursor-pointer"
                      >
                        {project}
                      </motion.span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default ExperienceCard;