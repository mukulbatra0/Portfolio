import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useIntersectionObserverSingle } from '../../hooks/useIntersectionObserver'
import { SECTIONS } from '../../utils/constants'
import { education, getEducationStats, getEducationTimeline } from '../../data/education'
import SectionTransition from '../ui/SectionTransition'
import AnimatedCard from '../ui/AnimatedCard'

const Education = () => {
  const elementRef = useRef(null)
  const { isIntersecting } = useIntersectionObserverSingle(elementRef, {
    threshold: 0.3,
    triggerOnce: true
  })

  const [selectedEducation, setSelectedEducation] = useState(null)
  const [isVisible, setIsVisible] = useState(false)
  const [viewMode, setViewMode] = useState('timeline') // 'timeline' or 'cards'
  const [activeEducationIndex, setActiveEducationIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)
  const [showDetailedView, setShowDetailedView] = useState(false)

  const educationTimeline = getEducationTimeline()
  const stats = getEducationStats()

  useEffect(() => {
    if (isIntersecting) {
      const timer = setTimeout(() => setIsVisible(true), 300)
      return () => clearTimeout(timer)
    }
  }, [isIntersecting])

  // Enhanced education click handler with animations
  const handleEducationClick = useCallback((educationItem, index, event) => {
    setActiveEducationIndex(index)
    setSelectedEducation(educationItem)
    setIsAutoPlaying(false) // Pause auto-play on interaction

    // Add visual feedback
    if (event && event.currentTarget) {
      event.currentTarget.style.transform = 'scale(0.98)'
      setTimeout(() => {
        if (event.currentTarget) {
          event.currentTarget.style.transform = ''
        }
      }, 150)
    }
  }, [])

  const closeModal = useCallback(() => {
    setSelectedEducation(null)
  }, [])

  // Toggle detailed view
  const toggleDetailedView = useCallback(() => {
    setShowDetailedView(prev => !prev)
  }, [])

  // Navigate between education items
  const navigateEducation = useCallback((direction) => {
    const newIndex = direction === 'next'
      ? (activeEducationIndex + 1) % educationTimeline.length
      : (activeEducationIndex - 1 + educationTimeline.length) % educationTimeline.length

    setActiveEducationIndex(newIndex)
    setSelectedEducation(educationTimeline[newIndex])
  }, [activeEducationIndex, educationTimeline])

  // Enhanced render function for timeline items
  const renderTimelineItem = (item, index, isVisible) => (
    <TimelineItem
      item={item}
      index={index}
      isVisible={isVisible}
      isActive={activeEducationIndex === index}
      onClick={handleEducationClick}
      showDetails={showDetailedView}
      animationDelay={index * 150}
    />
  )

  // Prepare timeline items with enhanced render function
  const timelineItems = educationTimeline.map((item, index) => ({
    ...item,
    render: renderTimelineItem,
    isActive: activeEducationIndex === index
  }))

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  }

  return (
    <SectionTransition>
      <motion.section
        id={SECTIONS.EDUCATION}
        ref={elementRef}
        className="section-spacing relative overflow-hidden section-animate"
        initial="hidden"
        whileInView="visible"
        variants={containerVariants}
        viewport={{ once: true, margin: '-50px' }}
      >
        {/* Enhanced Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/5 via-transparent to-purple-500/5" />
          <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-accent-cyan/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-float" />
        </div>

        <div className="container-custom relative z-10">
          {/* Section Header */}
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-heading-2 font-bold text-gradient-primary mb-4">
              🎓 Educational Journey
            </h2>
            <div className="w-24 h-1 bg-accent-cyan mx-auto rounded-full glow-effect mb-6" />
            <p className="text-body-large text-neutral-slate max-w-2xl mx-auto">
              Building knowledge through academic excellence and continuous learning
            </p>
          </motion.div>

          {/* Education Statistics */}
          <motion.div className="mb-16" variants={itemVariants}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { label: 'Institutions', value: stats.totalInstitutions, icon: '🏢' },
                { label: 'Years of Study', value: stats.totalYears, icon: '📅' },
                { label: 'Current CGPA', value: stats.currentCGPA || 'N/A', icon: '🏆' },
                { label: 'Completed', value: stats.completedCount, icon: '✅' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="glass-card text-center p-6 group"
                  whileHover={{ y: -5, scale: 1.02 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.2 }}
                >
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{stat.icon}</div>
                  <div className="text-3xl font-bold text-accent-cyan mb-2">{stat.value}</div>
                  <div className="text-sm text-neutral-slate font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Enhanced Timeline */}
          <motion.div className="relative" variants={itemVariants}>
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent-cyan via-purple-500 to-accent-cyan opacity-30" />
            
            <div className="space-y-12">
              {educationTimeline.map((item, index) => (
                <motion.div
                  key={item.id}
                  className="relative flex items-start group"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  viewport={{ once: true }}
                >
                  {/* Timeline Node */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-accent-cyan to-purple-500 rounded-full flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {item.icon || '🎓'}
                    </div>
                    <div className="absolute inset-0 bg-accent-cyan rounded-full opacity-20 animate-ping group-hover:animate-none" />
                  </div>
                  
                  {/* Content Card */}
                  <div className="ml-8 flex-1">
                    <AnimatedCard index={index} className="group-hover:scale-[1.02] transition-transform duration-300">
                      <div className="glass-card p-6 relative overflow-hidden">
                        {/* Status Badge */}
                        <div className="absolute top-4 right-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            item.status === 'ongoing'
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                              : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          }`}>
                            {item.status === 'ongoing' ? '🟢 Ongoing' : '✅ Completed'}
                          </span>
                        </div>
                        
                        {/* Header */}
                        <div className="mb-4">
                          <h3 className="text-xl font-bold text-accent-cyan mb-2 group-hover:text-purple-400 transition-colors">
                            {item.degree}
                          </h3>
                          <p className="text-lg text-light-gray mb-1">{item.institution}</p>
                          <div className="flex items-center space-x-4 text-sm text-neutral-slate">
                            <span>📅 {item.period}</span>
                            <span>📍 {item.location}</span>
                            {(item.cgpa || item.percentage) && (
                              <span>🏆 {item.cgpa || item.percentage}</span>
                            )}
                          </div>
                        </div>
                        
                        {/* Description */}
                        <p className="text-neutral-slate mb-4 leading-relaxed">
                          {item.description}
                        </p>
                        
                        {/* Coursework/Subjects */}
                        {(item.coursework || item.subjects) && (
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-light-gray mb-2">
                              {item.coursework ? 'Key Coursework:' : 'Subjects:'}
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {(item.coursework || item.subjects).slice(0, 4).map((course, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 text-xs bg-accent-cyan/10 text-accent-cyan rounded border border-accent-cyan/20"
                                >
                                  {course}
                                </span>
                              ))}
                              {(item.coursework || item.subjects).length > 4 && (
                                <span className="px-2 py-1 text-xs text-neutral-slate">
                                  +{(item.coursework || item.subjects).length - 4} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {/* Achievements */}
                        {item.achievements && (
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-light-gray mb-2">Achievements:</h4>
                            <div className="space-y-1">
                              {item.achievements.slice(0, 2).map((achievement, idx) => (
                                <div key={idx} className="flex items-start space-x-2">
                                  <span className="text-accent-cyan mt-0.5">•</span>
                                  <span className="text-sm text-neutral-slate">{achievement}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Action Button */}
                        <button
                          onClick={() => handleEducationClick(item, index)}
                          className="mt-4 px-4 py-2 bg-accent-cyan/10 text-accent-cyan rounded-lg hover:bg-accent-cyan/20 transition-colors text-sm font-medium"
                        >
                          View Details →
                        </button>
                        
                        {/* Hover Glow */}
                        <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      </div>
                    </AnimatedCard>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>








        </div>

        {/* Enhanced Education Detail Modal */}
        <AnimatePresence>
          {selectedEducation && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
              onClick={closeModal}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="glass-card max-w-5xl w-full max-h-[90vh] overflow-y-auto p-6 relative"
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                transition={{ duration: 0.2 }}
              >
            {/* Enhanced Modal Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <span className="text-4xl animate-bounce">{selectedEducation.icon}</span>
                  <div className="absolute inset-0 bg-accent-cyan rounded-full opacity-20 animate-ping" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-accent-cyan mb-1">
                    {selectedEducation.degree}
                  </h3>
                  <p className="text-lg text-light-gray mb-1">
                    {selectedEducation.institution}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-neutral-slate">
                    <span>📍 {selectedEducation.location}</span>
                    <span>📅 {selectedEducation.period}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${selectedEducation.status === 'ongoing'
                        ? 'bg-green-500 bg-opacity-20 text-green-400'
                        : 'bg-blue-500 bg-opacity-20 text-blue-400'
                      }`}>
                      {selectedEducation.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {/* Modal Navigation */}
                <button
                  onClick={() => navigateEducation('prev')}
                  className="glass-button p-2 rounded-lg hover:bg-accent-cyan hover:bg-opacity-20 transition-all duration-300"
                  disabled={activeEducationIndex === 0}
                >
                  ←
                </button>
                <button
                  onClick={() => navigateEducation('next')}
                  className="glass-button p-2 rounded-lg hover:bg-accent-cyan hover:bg-opacity-20 transition-all duration-300"
                  disabled={activeEducationIndex === educationTimeline.length - 1}
                >
                  →
                </button>
                <button
                  onClick={closeModal}
                  className="text-neutral-slate hover:text-light-gray transition-colors text-xl p-2"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div>
                {/* Description */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-light-gray mb-3">Overview</h4>
                  <p className="text-neutral-slate leading-relaxed">
                    {selectedEducation.description}
                  </p>
                </div>

                {/* Academic Performance */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-light-gray mb-3">Academic Performance</h4>
                  <div className="glass-card p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-slate">
                        {selectedEducation.cgpa ? 'CGPA' : 'Percentage'}
                      </span>
                      <span className="text-xl font-bold text-accent-cyan">
                        {selectedEducation.cgpa || selectedEducation.percentage}
                      </span>
                    </div>
                    {selectedEducation.stream && (
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-neutral-slate">Stream</span>
                        <span className="text-light-gray">{selectedEducation.stream}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Coursework/Subjects */}
                {(selectedEducation.coursework || selectedEducation.subjects) && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-light-gray mb-3">
                      {selectedEducation.coursework ? 'Coursework' : 'Subjects'}
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {(selectedEducation.coursework || selectedEducation.subjects).map((item, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <span className="w-2 h-2 bg-accent-cyan rounded-full"></span>
                          <span className="text-neutral-slate">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div>
                {/* Achievements */}
                {selectedEducation.achievements && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-light-gray mb-3">Achievements</h4>
                    <div className="space-y-3">
                      {selectedEducation.achievements.map((achievement, idx) => (
                        <div key={idx} className="flex items-start space-x-3">
                          <span className="text-accent-cyan mt-1">🏆</span>
                          <span className="text-neutral-slate">{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skills */}
                {selectedEducation.skills && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-light-gray mb-3">Skills Developed</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedEducation.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 text-sm bg-accent-cyan bg-opacity-10 text-accent-cyan rounded-lg border border-accent-cyan border-opacity-20"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Projects */}
                {selectedEducation.projects && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-light-gray mb-3">Related Projects</h4>
                    <div className="space-y-2">
                      {selectedEducation.projects.map((project, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <span className="text-accent-cyan">🚀</span>
                          <span className="text-neutral-slate">{project}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Modal Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-neutral-slate border-opacity-20 space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-neutral-slate">
                  {activeEducationIndex + 1} of {educationTimeline.length}
                </span>
                <div className="flex space-x-1">
                  {educationTimeline.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${activeEducationIndex === index
                          ? 'bg-accent-cyan'
                          : 'bg-neutral-slate bg-opacity-30'
                        }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => navigateEducation('prev')}
                  disabled={activeEducationIndex === 0}
                  className="btn-secondary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Previous
                </button>
                <button onClick={closeModal} className="btn-primary px-6 py-2">
                  Close Details
                </button>
                <button
                  onClick={() => navigateEducation('next')}
                  disabled={activeEducationIndex === educationTimeline.length - 1}
                  className="btn-secondary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </div>
            </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>
    </SectionTransition>
  )
}

export default Education