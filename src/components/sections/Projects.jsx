import React, { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SECTIONS } from '../../utils/constants'
import { projects, getProjectCategories } from '../../data/projects'
import { getTechnologyColor } from '../../utils/technologyColors'
import { handleMissingThumbnail } from '../../utils/imageUtils'
import { projects as projectLayoutUtils } from '../../utils/layoutUtils'
import { ErrorRecovery, ErrorLogger } from '../../utils/errorHandling'
import { throttle, prefersReducedMotion } from '../../utils/performance'

const Projects = React.memo(({ projectsData = projects, showAll = false, maxProjects = null }) => {
  const [imageLoading, setImageLoading] = useState(new Set())
  const [imageLoaded, setImageLoaded] = useState(new Set())
  const [viewportWidth, setViewportWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [hoveredProject, setHoveredProject] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const reducedMotion = useMemo(() => prefersReducedMotion(), [])

  // Handle keyboard events for image modal
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && selectedImage) {
        setSelectedImage(null)
      }
    }

    if (selectedImage) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [selectedImage])

  // Update viewport width on resize with throttling
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleResize = throttle(() => {
      setViewportWidth(window.innerWidth)
    }, 150)

    window.addEventListener('resize', handleResize, { passive: true })
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Memoize filtered and limited projects for performance
  const displayProjects = useMemo(() => {
    let filteredProjects = showAll ? projectsData : projectsData.filter(p => p.featured)

    // Filter by category if not 'all'
    if (selectedCategory !== 'all') {
      filteredProjects = filteredProjects.filter(p => p.category === selectedCategory)
    }

    if (maxProjects && maxProjects > 0) {
      filteredProjects = filteredProjects.slice(0, maxProjects)
    }

    return filteredProjects
  }, [projectsData, showAll, maxProjects, selectedCategory])

  // Get project categories for filtering
  const categories = useMemo(() => getProjectCategories(projectsData), [projectsData])

  // Layout configuration based on project count and viewport
  const layoutConfig = useMemo(() => {
    const projectCount = displayProjects.length
    return {
      spacing: projectLayoutUtils.calculateGridSpacing(projectCount, viewportWidth),
      staggerDelay: projectLayoutUtils.getAnimationStagger(projectCount),
      useAlternating: projectLayoutUtils.shouldUseAlternatingLayout(projectCount, viewportWidth),
      gridLayout: projectLayoutUtils.getGridLayout(viewportWidth, projectCount),
      performanceConfig: projectLayoutUtils.getPerformanceConfig(projectCount)
    }
  }, [displayProjects.length, viewportWidth])

  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: reducedMotion ? 0 : layoutConfig.staggerDelay
      }
    }
  }), [layoutConfig.staggerDelay, reducedMotion])

  const cardVariants = useMemo(() => ({
    hidden: {
      opacity: 0,
      y: reducedMotion ? 0 : 30,
      scale: reducedMotion ? 1 : 0.98
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: reducedMotion ? 0.01 : 0.4,
        ease: "easeOut"
      }
    }
  }), [reducedMotion])

  // Handle image loading errors with comprehensive error handling
  const handleImageLoadError = (projectId, imagePath) => {
    ErrorLogger.log('Image load error', { projectId, imagePath })
    return '/images/profile.jpg' // fallback image
  }

  // Get status color based on project status
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-300 border-green-500/30'
      case 'in-progress':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      case 'planned':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
  }

  return (
    <section
      id={SECTIONS.PROJECTS}
      className="relative py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(34,211,238,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.1),transparent_50%)]" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-block mb-4"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="px-3 py-2 md:px-4 md:py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 text-xs md:text-sm font-medium rounded-full border border-cyan-500/30 backdrop-blur-sm">
              ✨ Portfolio Showcase
            </span>
          </motion.div>

          <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight px-4">
            Featured{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Projects
            </span>
          </h2>

          <p className="text-lg md:text-xl lg:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-6 md:mb-8 px-4">
            Discover my latest creations - innovative web applications crafted with modern technologies and creative problem-solving
          </p>

          {/* Project Stats */}
          <motion.div
            className="flex flex-wrap justify-center gap-4 md:gap-6 mb-8 md:mb-12 px-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="text-center min-w-[80px]">
              <div className="text-2xl md:text-3xl font-bold text-cyan-400">{projectsData.length}+</div>
              <div className="text-xs md:text-sm text-slate-400">Projects</div>
            </div>
            <div className="text-center min-w-[80px]">
              <div className="text-2xl md:text-3xl font-bold text-blue-400">{projectsData.filter(p => p.status === 'completed').length}</div>
              <div className="text-xs md:text-sm text-slate-400">Completed</div>
            </div>
            <div className="text-center min-w-[80px]">
              <div className="text-2xl md:text-3xl font-bold text-purple-400">{[...new Set(projectsData.flatMap(p => p.technologies))].length}+</div>
              <div className="text-xs md:text-sm text-slate-400">Technologies</div>
            </div>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            className="flex flex-wrap justify-center gap-2 md:gap-3 mb-6 md:mb-8 px-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-2 md:px-6 md:py-3 rounded-full text-sm md:text-base font-medium transition-all duration-300 backdrop-blur-sm border touch-target ${selectedCategory === category.id
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-500/50 shadow-lg shadow-cyan-500/25'
                  : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:border-white/20 hover:text-white'
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="mr-1 md:mr-2">{category.icon}</span>
                <span className="hidden sm:inline">{category.name}</span>
                <span className="sm:hidden">{category.name.split(' ')[0]}</span>
                {category.count > 0 && (
                  <span className={`ml-1 md:ml-2 px-1.5 py-0.5 md:px-2 md:py-1 text-xs rounded-full ${selectedCategory === category.id
                    ? 'bg-white/20'
                    : 'bg-slate-700'
                    }`}>
                    {category.count}
                  </span>
                )}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>

        {/* Projects Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            className="space-y-20"
            style={{
              '--spacing': `${layoutConfig.spacing}px`,
              gap: `${layoutConfig.spacing}px`
            }}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            viewport={{
              once: true,
              margin: layoutConfig.performanceConfig.lazyLoadThreshold
            }}
          >
            {displayProjects.map((project, index) => {
              const thumbnailConfig = handleMissingThumbnail(
                project.thumbnail,
                project.title,
                project.category
              )

              return (
                <motion.div
                  key={project.id}
                  variants={cardVariants}
                  className="group"
                  onHoverStart={() => setHoveredProject(project.id)}
                  onHoverEnd={() => setHoveredProject(null)}
                >
                  <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center ${layoutConfig.useAlternating && index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                    }`}>
                    {/* Project Image */}
                    <div className={`relative ${layoutConfig.useAlternating && index % 2 === 1 ? 'lg:col-start-2' : ''
                      }`}>
                      <div className="relative overflow-hidden rounded-xl md:rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 group-hover:border-cyan-500/30 transition-all duration-500 shadow-2xl backdrop-blur-sm">
                        {/* Glassmorphism overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        {/* Loading skeleton */}
                        {imageLoading.has(project.id) && (
                          <div className="absolute inset-0 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 animate-pulse">
                            <div className="w-full h-full bg-gradient-to-br from-slate-800/50 to-slate-900/50 flex items-center justify-center">
                              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
                            </div>
                          </div>
                        )}

                        {project.thumbnail ? (
                          <div className="relative">
                            <motion.img
                              src={thumbnailConfig.src}
                              alt={thumbnailConfig.alt}
                              className={`${thumbnailConfig.className} transition-all duration-700 cursor-pointer ${imageLoaded.has(project.id)
                                ? 'opacity-100 scale-100'
                                : 'opacity-0 scale-105'
                                } ${hoveredProject === project.id ? 'scale-110' : 'scale-100'}`}
                              loading={index < layoutConfig.performanceConfig.preloadCount ? 'eager' : 'lazy'}
                              fetchpriority={projectLayoutUtils.getImageLoadingPriority(index, index < 2)}
                              sizes={projectLayoutUtils.getResponsiveImageSizes()}
                              onClick={(e) => {
                                e.preventDefault()
                                console.log('Image clicked', project.images?.[0] || thumbnailConfig.src)
                                setSelectedImage(project.images?.[0] || thumbnailConfig.src)
                              }}
                              whileHover={{ scale: 1.05 }}
                              transition={{ duration: 0.3 }}
                              onLoadStart={() => {
                                setImageLoading(prev => new Set([...prev, project.id]))
                              }}
                              onLoad={() => {
                                setImageLoading(prev => {
                                  const newSet = new Set(prev)
                                  newSet.delete(project.id)
                                  return newSet
                                })
                                setImageLoaded(prev => new Set([...prev, project.id]))
                              }}
                              onError={(e) => {
                                setImageLoading(prev => {
                                  const newSet = new Set(prev)
                                  newSet.delete(project.id)
                                  return newSet
                                })

                                // Enhanced fallback system
                                if (!e.target.dataset.fallbackAttempted) {
                                  e.target.dataset.fallbackAttempted = 'true'
                                  e.target.src = '/images/profile.jpg'
                                } else if (!e.target.dataset.secondFallbackAttempted) {
                                  e.target.dataset.secondFallbackAttempted = 'true'
                                  e.target.src = '/images/avatar.png'
                                } else {
                                  // Create a more elegant fallback
                                  e.target.style.display = 'none'
                                  const fallbackDiv = document.createElement('div')
                                  fallbackDiv.className = 'w-full aspect-[4/3] flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800 relative overflow-hidden'
                                  fallbackDiv.innerHTML = `
                                <div class="absolute inset-0 bg-gradient-to-br from-${project.color?.replace('#', '') || 'cyan-500'}/10 to-transparent"></div>
                                <div class="text-center relative z-10">
                                  <div class="text-6xl text-slate-400 group-hover:scale-110 transition-transform duration-500 mb-3 filter drop-shadow-lg">
                                    ${project.category === 'fullstack' ? '⚡' :
                                      project.category === 'frontend' ? '🎨' :
                                        project.category === 'backend' ? '⚙️' :
                                          project.category === 'mobile' ? '📱' : '🚀'}
                                  </div>
                                  <p class="text-slate-300 text-sm font-semibold uppercase tracking-wider">${project.category}</p>
                                  <p class="text-slate-500 text-xs mt-1">Project Preview</p>
                                </div>
                                <div class="absolute top-4 right-4 w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                              `
                                  e.target.parentElement.appendChild(fallbackDiv)
                                }
                              }}
                            />

                            {/* Image overlay effects */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            {/* Enhanced project overlays */}
                            <motion.div
                              className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-sm text-white text-xs font-medium rounded-full border border-white/20"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{
                                opacity: hoveredProject === project.id ? 1 : 0,
                                y: hoveredProject === project.id ? 0 : 10
                              }}
                              transition={{ duration: 0.3 }}
                            >
                              {project.category}
                            </motion.div>

                            {/* Status indicator */}
                            <motion.div
                              className="absolute top-4 right-4"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{
                                opacity: hoveredProject === project.id ? 1 : 0,
                                scale: hoveredProject === project.id ? 1 : 0.8
                              }}
                              transition={{ duration: 0.3 }}
                            >
                              <div className={`w-3 h-3 rounded-full ${project.status === 'completed' ? 'bg-green-400' :
                                project.status === 'in-progress' ? 'bg-yellow-400' :
                                  'bg-blue-400'
                                } animate-pulse`} />
                            </motion.div>

                            {/* Interactive elements */}
                            <motion.div
                              className="absolute bottom-2 right-2 md:bottom-4 md:right-4 z-20"
                              initial={{ opacity: 1, y: 0 }}
                              animate={{
                                opacity: 1,
                                y: 0
                              }}
                              transition={{ duration: 0.3, delay: 0.1 }}
                            >
                              <div className="flex items-center space-x-1 md:space-x-2">
                                <motion.button
                                  onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    console.log('Eye button clicked', project.images?.[0] || thumbnailConfig.src)
                                    setSelectedImage(project.images?.[0] || thumbnailConfig.src)
                                  }}
                                  className="p-1.5 md:p-2 bg-black/50 backdrop-blur-sm text-white rounded-full border border-white/20 hover:bg-white/20 transition-colors touch-target"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                </motion.button>
                                {project.liveUrl && (
                                  <motion.button
                                    onClick={(e) => {
                                      e.preventDefault()
                                      e.stopPropagation()
                                      console.log('External link button clicked', project.liveUrl)
                                      window.open(project.liveUrl, '_blank')
                                    }}
                                    className="p-1.5 md:p-2 bg-black/50 backdrop-blur-sm text-white rounded-full border border-white/20 hover:bg-white/20 transition-colors touch-target"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                  </motion.button>
                                )}
                              </div>
                            </motion.div>

                            {/* Image gallery indicator */}
                            {project.images && project.images.length > 1 && (
                              <motion.div
                                className="absolute bottom-4 left-4"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{
                                  opacity: hoveredProject === project.id ? 1 : 0,
                                  x: hoveredProject === project.id ? 0 : -10
                                }}
                                transition={{ duration: 0.3, delay: 0.2 }}
                              >
                                <div className="flex items-center space-x-1 px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-xs rounded-full border border-white/20">
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  <span>{project.images.length}</span>
                                </div>
                              </motion.div>
                            )}
                          </div>
                        ) : (
                          <div className="w-full aspect-[4/3] flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800 relative overflow-hidden">
                            <div className={`absolute inset-0 bg-gradient-to-br from-${project.color?.replace('#', '') || 'cyan-500'}/10 to-transparent`}></div>
                            <div className="text-center relative z-10">
                              <div className="text-6xl text-slate-400 group-hover:scale-110 transition-transform duration-500 mb-3 filter drop-shadow-lg">
                                {project.category === 'fullstack' ? '⚡' :
                                  project.category === 'frontend' ? '🎨' :
                                    project.category === 'backend' ? '⚙️' :
                                      project.category === 'mobile' ? '📱' : '🚀'}
                              </div>
                              <p className="text-slate-300 text-sm font-semibold uppercase tracking-wider">{project.category}</p>
                              <p className="text-slate-500 text-xs mt-1">No Image Available</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Enhanced glow effect */}
                      {/* <motion.div
                        className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-2xl blur-xl"
                        animate={{
                          opacity: hoveredProject === project.id ? 1 : 0,
                          scale: hoveredProject === project.id ? 1.1 : 1
                        }}
                        transition={{ duration: 0.5 }}
                      /> */}



                      {/* Floating particles effect */}
                      <motion.div
                        className="absolute -inset-2"
                        animate={{ opacity: hoveredProject === project.id ? 1 : 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <motion.div
                          className="absolute top-4 left-4 w-1 h-1 bg-cyan-400 rounded-full"
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 1, 0.5]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                        <motion.div
                          className="absolute top-8 right-8 w-1 h-1 bg-blue-400 rounded-full"
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 1, 0.5]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.5
                          }}
                        />
                        <motion.div
                          className="absolute bottom-6 left-8 w-1 h-1 bg-purple-400 rounded-full"
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 1, 0.5]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1
                          }}
                        />
                      </motion.div>
                    </div>

                    {/* Project Content */}
                    <div className={`space-y-4 md:space-y-6 px-4 lg:px-0 ${layoutConfig.useAlternating && index % 2 === 1 ? 'lg:col-start-1' : ''
                      }`}>
                      {/* Project Meta */}
                      <motion.div
                        className="flex flex-wrap items-center gap-2 md:gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <motion.span
                          className="px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 text-xs md:text-sm font-medium rounded-full border border-cyan-500/30 backdrop-blur-sm"
                          whileHover={{ scale: 1.05 }}
                        >
                          Project {String(index + 1).padStart(2, '0')}
                        </motion.span>
                        <span className="text-slate-400 text-xs md:text-sm font-medium">{project.year}</span>
                        <motion.span
                          className={`px-2 py-1 md:px-3 md:py-1 text-xs rounded-full border capitalize font-medium ${getStatusColor(project.status)}`}
                          whileHover={{ scale: 1.05 }}
                        >
                          {project.status.replace('-', ' ')}
                        </motion.span>
                        {project.metrics?.complexity && (
                          <span className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-full border border-slate-600/50 hidden sm:inline">
                            {project.metrics.complexity} Complexity
                          </span>
                        )}
                      </motion.div>


                      {/* Project Title & Subtitle */}
                      <motion.div
                        className="space-y-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                      >
                        <motion.h3
                          className="text-2xl md:text-3xl lg:text-4xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-blue-500 group-hover:bg-clip-text transition-all duration-500"
                          whileHover={{ scale: 1.02 }}
                        >
                          {project.title}
                        </motion.h3>
                        <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed">
                          {project.subtitle}
                        </p>
                      </motion.div>

                      {/* Project Description */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                      >
                        <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-4">
                          {project.description}
                        </p>

                        {/* Key Features */}
                        {project.features && project.features.length > 0 && (
                          <motion.div
                            className="mt-4"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                          >
                            <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Key Features</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {project.features.slice(0, 4).map((feature, idx) => (
                                <motion.div
                                  key={idx}
                                  className="flex items-start space-x-2 text-xs md:text-sm text-slate-400"
                                  initial={{ opacity: 0, x: -10 }}
                                  whileInView={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3, delay: 0.6 + idx * 0.1 }}
                                >
                                  <span className="text-cyan-400 mt-1">•</span>
                                  <span>{feature.length > 50 ? feature.substring(0, 50) + '...' : feature}</span>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </motion.div>

                      {/* Technology Tags */}
                      <motion.div
                        className="space-y-3"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                      >
                        <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Technologies Used</h4>
                        <div className="flex flex-wrap gap-1.5 md:gap-2">
                          {ErrorRecovery.gracefulDegrade(
                            project.technologies,
                            [],
                            { projectId: project.id, field: 'technologies' }
                          ).map((tech, idx) => (
                            <motion.span
                              key={`${project.id}-tech-${idx}`}
                              className={`px-2 py-1 md:px-3 md:py-2 text-xs md:text-sm rounded-full border transition-all duration-300 hover:scale-105 backdrop-blur-sm ${getTechnologyColor(tech)}`}
                              initial={{ opacity: 0, scale: 0.8 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              whileHover={{ scale: 1.1, y: -2 }}
                              transition={{
                                duration: 0.3,
                                delay: 0.7 + idx * 0.05,
                                type: "spring",
                                stiffness: 300
                              }}
                            >
                              {tech}
                            </motion.span>
                          ))}
                          {(!project.technologies || project.technologies.length === 0) && (
                            <span className="px-2 py-1 md:px-3 md:py-1 text-xs md:text-sm rounded-full border bg-slate-500/20 text-slate-300 border-slate-500/30">
                              No technologies listed
                            </span>
                          )}
                        </div>
                      </motion.div>

                      {/* Project Actions */}
                      <motion.div
                        className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4 md:pt-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                      >
                        {project.liveUrl && (
                          <motion.button
                            onClick={() => window.open(project.liveUrl, '_blank')}
                            className="group px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 relative overflow-hidden touch-target"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <span className="relative z-10 flex items-center justify-center space-x-2">
                              <span className="text-sm md:text-base">View Live Project</span>
                              <motion.svg
                                className="w-4 h-4 md:w-5 md:h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                animate={{ x: [0, 4, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </motion.svg>
                            </span>
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              initial={false}
                            />
                          </motion.button>
                        )}
                        {project.githubUrl && (
                          <motion.button
                            onClick={() => window.open(project.githubUrl, '_blank')}
                            className="group px-6 py-3 md:px-8 md:py-4 bg-white/10 text-white font-semibold rounded-full border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300 backdrop-blur-sm relative overflow-hidden touch-target"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <span className="relative z-10 flex items-center justify-center space-x-2">
                              <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                              </svg>
                              <span className="text-sm md:text-base">View Source Code</span>
                            </span>
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-slate-700 to-slate-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              initial={false}
                            />
                          </motion.button>
                        )}

                        {/* Additional project info */}
                        {project.metrics && (
                          <motion.div
                            className="flex items-center space-x-4 text-sm text-slate-400 pt-2"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.9 }}
                          >
                            {project.metrics.duration && (
                              <span className="flex items-center space-x-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{project.metrics.duration}</span>
                              </span>
                            )}
                            {project.metrics.codeLines && (
                              <span className="flex items-center space-x-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                </svg>
                                <span>{project.metrics.codeLines} lines</span>
                              </span>
                            )}
                          </motion.div>
                        )}
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </AnimatePresence>

        {/* Show more projects indicator if there are more projects */}
        {!showAll && projectsData.length > displayProjects.length && (
          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <p className="text-slate-400 text-lg">
              Showing {displayProjects.length} of {projectsData.length} projects
            </p>
            <div className="mt-4 flex justify-center space-x-2">
              {Array.from({ length: Math.min(projectsData.length - displayProjects.length, 3) }).map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-slate-600 rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Floating Action Button - View All Projects */}
        {!showAll && projectsData.length > displayProjects.length && (
          <motion.div
            className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-40"
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1, type: "spring", stiffness: 300 }}
          >
            <motion.button
              className="group p-3 md:p-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl hover:shadow-cyan-500/25 transition-all duration-300 touch-target"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                // This would typically navigate to a full projects page
                console.log('Navigate to all projects')
              }}
            >
              <div className="flex items-center space-x-2">
                <span className="hidden sm:block font-medium text-sm md:text-base">View All Projects</span>
                <motion.svg
                  className="w-4 h-4 md:w-5 md:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  animate={{ rotate: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </motion.svg>
              </div>

              {/* Ripple effect */}
              <motion.div
                className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.button>
          </motion.div>
        )}

        {/* Image Modal */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-2 md:p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
            >
              <motion.div
                className="relative max-w-4xl max-h-[90vh] w-full"
                initial={{ scale: 0.8, opacity: 0, rotateY: -15 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                exit={{ scale: 0.8, opacity: 0, rotateY: 15 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={selectedImage}
                  alt="Project preview"
                  className="w-full h-full object-contain rounded-lg shadow-2xl"
                />

                {/* Enhanced close button */}
                <motion.button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-2 right-2 md:top-4 md:right-4 p-2 md:p-3 bg-black/50 backdrop-blur-sm text-white rounded-full hover:bg-black/70 transition-colors border border-white/20 touch-target"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>

                {/* Image info overlay */}
                <motion.div
                  className="absolute bottom-2 left-2 right-2 md:bottom-4 md:left-4 md:right-4 p-3 md:p-4 bg-black/50 backdrop-blur-sm rounded-lg border border-white/20"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <p className="text-white text-xs md:text-sm">Click outside to close • ESC to exit</p>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
})
export default Projects