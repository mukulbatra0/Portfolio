import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useIntersectionObserverSingle } from '../../hooks/useIntersectionObserver'
import { SECTIONS } from '../../utils/constants'
import { skills, skillCategories, getSkillsByCategory, getAllSkills } from '../../data/skills'
import SectionTransition from '../ui/SectionTransition'
import AnimatedCard from '../ui/AnimatedCard'
import SkillSearchFilter from '../ui/SkillSearchFilter'

const Skills3D = () => {
  const elementRef = useRef(null)
  const { isIntersecting } = useIntersectionObserverSingle(elementRef, {
    threshold: 0.3,
    triggerOnce: true
  })

  const [activeCategory, setActiveCategory] = useState('all')
  const [filteredSkills, setFilteredSkills] = useState([])
  const [isVisible, setIsVisible] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('proficiency')
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'

  useEffect(() => {
    let categorySkills = activeCategory === 'all' ? getAllSkills() : getSkillsByCategory(activeCategory)
    
    // Apply search filter
    if (searchTerm) {
      categorySkills = categorySkills.filter(skill =>
        skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.projects.some(project => 
          project.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }
    
    // Apply sorting
    categorySkills.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'proficiency':
          return b.proficiency - a.proficiency
        case 'experience':
          return b.experience.localeCompare(a.experience)
        case 'projects':
          return b.projects.length - a.projects.length
        default:
          return 0
      }
    })
    
    setFilteredSkills(categorySkills)
  }, [activeCategory, searchTerm, sortBy])

  useEffect(() => {
    if (isIntersecting) {
      const timer = setTimeout(() => setIsVisible(true), 300)
      return () => clearTimeout(timer)
    }
  }, [isIntersecting])

  // Get skill statistics
  const getSkillStats = () => {
    const allSkills = getAllSkills()
    const totalSkills = allSkills.length
    const averageProficiency = Math.round(
      allSkills.reduce((sum, skill) => sum + skill.proficiency, 0) / totalSkills
    )
    const expertSkills = allSkills.filter(skill => skill.proficiency >= 90).length
    const categories = Object.keys(skills).length

    return { totalSkills, averageProficiency, expertSkills, categories }
  }

  const stats = getSkillStats()

  // Helper function to get skill icon
  const getSkillIcon = (skillName) => {
    const iconMap = {
      // Languages
      'Java': '☕',
      'JavaScript (ES6+)': '🟨',
      'SQL': '🗃️',
      'HTML5': '🌐',
      'CSS3': '🎨',
      
      // Frontend
      'React.js': '⚛️',
      'HTML': '📄',
      'CSS': '🎨',
      'Tailwind CSS': '💨',
      'Bootstrap': '🅱️',
      'Material UI': '🎭',
      
      // Backend
      'Node.js': '🟢',
      'Express.js': '🚂',
      
      // Databases
      'MongoDB': '🍃',
      'MySQL': '🐬',
      
      // Tools
      'Git': '📚',
      'GitHub': '🐙',
      'VS Code': '💻',
      'npm': '📦',
      
      // Concepts
      'DSA': '🧮',
      'OOP': '🏗️',
      'RESTful APIs': '🔗',
      'SDLC': '🔄',
      'Operating Systems': '💾',
      'DBMS': '🗄️',
      'Computer Networks': '🌐'
    }
    
    return iconMap[skillName] || '⚡'
  }

  // Helper function to get proficiency level
  const getProficiencyLevel = (proficiency) => {
    if (proficiency >= 90) return { level: 'Expert', color: 'text-green-400', bgColor: 'bg-green-400' }
    if (proficiency >= 75) return { level: 'Advanced', color: 'text-blue-400', bgColor: 'bg-blue-400' }
    if (proficiency >= 60) return { level: 'Intermediate', color: 'text-yellow-400', bgColor: 'bg-yellow-400' }
    return { level: 'Beginner', color: 'text-orange-400', bgColor: 'bg-orange-400' }
  }

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
        id={SECTIONS.SKILLS}
        ref={elementRef}
        className="section-spacing relative overflow-hidden section-animate"
        aria-labelledby="skills-heading"
        initial="hidden"
        whileInView="visible"
        variants={containerVariants}
        viewport={{ once: true, margin: '-50px' }}
      >
        {/* Enhanced Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/5 via-transparent to-accent-cyan/10" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-cyan/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent-cyan/5 rounded-full blur-2xl animate-float" />
          
          {/* Floating Particles */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-accent-cyan rounded-full opacity-30"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${3 + Math.random() * 4}s`
                }}
              />
            ))}
          </div>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div 
              className="w-full h-full"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(34, 211, 238, 0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(34, 211, 238, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: '50px 50px'
              }}
            />
          </div>
        </div>

        <div className="container-custom relative z-10">
          {/* Enhanced Section Header */}
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <div className="relative inline-block">
              <h2 id="skills-heading" className="text-heading-2 font-bold text-gradient-primary mb-4 relative z-10">
                🚀 Technical Arsenal
              </h2>
              <div className="absolute inset-0 bg-accent-cyan/20 blur-xl rounded-full scale-150 opacity-50" />
            </div>
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-accent-cyan to-transparent mx-auto rounded-full glow-effect mb-6" />
            <p className="text-body-large text-neutral-slate max-w-2xl mx-auto leading-relaxed">
              Mastering the tools and technologies that power modern web development and beyond
            </p>
          </motion.div>

          {/* Enhanced Search and Filter Section */}
          <motion.div className="mb-12 space-y-8" variants={itemVariants}>
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-neutral-slate" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search skills, technologies, or projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="glass-input w-full pl-12 pr-4 py-4 rounded-xl text-lg focus:ring-2 focus:ring-accent-cyan focus:ring-opacity-50 transition-all duration-300"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-slate hover:text-accent-cyan transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter with Icons */}
            <div className="flex flex-wrap justify-center gap-3">
              {skillCategories.map((category) => (
                <motion.button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center space-x-2 ${
                    activeCategory === category.id
                      ? 'bg-accent-cyan text-primary-dark shadow-glow scale-105'
                      : 'glass-button hover:bg-accent-cyan/20 hover:text-accent-cyan'
                  }`}
                >
                  <span className="text-lg">{category.icon}</span>
                  <span>{category.name}</span>
                  {activeCategory === category.id && (
                    <span className="ml-2 px-2 py-1 bg-primary-dark/20 rounded-full text-xs">
                      {category.id === 'all' ? getAllSkills().length : getSkillsByCategory(category.id).length}
                    </span>
                  )}
                </motion.button>
              ))}
            </div>

            {/* View Controls */}
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-neutral-slate">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="glass-input px-4 py-2 rounded-lg text-sm border-accent-cyan/30 focus:border-accent-cyan"
                >
                  <option value="proficiency">Proficiency</option>
                  <option value="name">Name</option>
                  <option value="experience">Experience</option>
                  <option value="projects">Projects</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-neutral-slate">View:</span>
                <div className="glass-card p-1 flex rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded transition-all duration-200 ${
                      viewMode === 'grid' ? 'bg-accent-cyan text-primary-dark' : 'text-neutral-slate hover:text-accent-cyan'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded transition-all duration-200 ${
                      viewMode === 'list' ? 'bg-accent-cyan text-primary-dark' : 'text-neutral-slate hover:text-accent-cyan'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Results Summary */}
            {(searchTerm || activeCategory !== 'all') && (
              <div className="text-center">
                <p className="text-sm text-neutral-slate">
                  Showing <span className="text-accent-cyan font-semibold">{filteredSkills.length}</span> skills
                  {searchTerm && <span> matching "<span className="text-accent-cyan">{searchTerm}</span>"</span>}
                  {activeCategory !== 'all' && <span> in <span className="text-accent-cyan">{skillCategories.find(cat => cat.id === activeCategory)?.name}</span></span>}
                </p>
              </div>
            )}
          </motion.div>

          {/* Skills Statistics */}
          <motion.div className="mb-16" variants={itemVariants}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { label: 'Technologies', value: stats.totalSkills, icon: '⚡' },
                { label: 'Proficiency', value: `${stats.averageProficiency}%`, icon: '🎯' },
                { label: 'Expert Level', value: stats.expertSkills, icon: '🏆' },
                { label: 'Categories', value: stats.categories, icon: '📚' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="glass-card text-center p-6 group hover:scale-105 transition-all duration-300"
                  whileHover={{ y: -5 }}
                  initial={{ opacity: 0, y: 10 }}
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

          {/* Enhanced Skills Display */}
          <motion.div className="card-animate" variants={itemVariants}>
            <AnimatePresence mode="wait">
              {filteredSkills.length > 0 ? (
                <motion.div
                  key={`${viewMode}-${activeCategory}-${searchTerm}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={viewMode === 'grid' 
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
                    : "space-y-4"
                  }
                >
                  {filteredSkills.map((skill, index) => (
                    <AnimatedCard key={skill.name} index={index} className="group">
                      {viewMode === 'grid' ? (
                        // Grid View - Enhanced Card Design
                        <div className="glass-card p-6 h-full relative overflow-hidden hover:scale-105 transition-all duration-300">
                          {/* Skill Icon & Name */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-cyan/20 to-accent-cyan/5 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                {getSkillIcon(skill.name)}
                              </div>
                              <div>
                                <h4 className="font-bold text-light-gray text-lg group-hover:text-accent-cyan transition-colors">
                                  {skill.name}
                                </h4>
                                <p className="text-xs text-neutral-slate">{skill.experience}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-accent-cyan">{skill.proficiency}%</div>
                              <div className="text-xs text-neutral-slate">
                                {getProficiencyLevel(skill.proficiency).level}
                              </div>
                            </div>
                          </div>
                          
                          {/* Enhanced Progress Bar */}
                          <div className="mb-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-neutral-slate">Proficiency</span>
                              <span className="text-sm font-medium text-accent-cyan">{skill.proficiency}%</span>
                            </div>
                            <div className="relative h-3 bg-neutral-slate/20 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${skill.proficiency}%` }}
                                transition={{ duration: 1, delay: index * 0.1 }}
                                className="h-full bg-gradient-to-r from-accent-cyan to-cyan-400 rounded-full relative"
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                              </motion.div>
                            </div>
                          </div>
                          
                          {/* Projects */}
                          {skill.projects.length > 0 && (
                            <div className="mb-4">
                              <h5 className="text-sm font-medium text-neutral-slate mb-2">Projects</h5>
                              <div className="flex flex-wrap gap-1">
                                {skill.projects.slice(0, 2).map((project, projectIndex) => (
                                  <span
                                    key={project}
                                    className="text-xs px-2 py-1 bg-accent-cyan/10 text-accent-cyan rounded-full border border-accent-cyan/20"
                                  >
                                    {project}
                                  </span>
                                ))}
                                {skill.projects.length > 2 && (
                                  <span className="text-xs px-2 py-1 bg-neutral-slate/20 text-neutral-slate rounded-full">
                                    +{skill.projects.length - 2}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {/* Proficiency Badge */}
                          <div className="absolute top-4 right-4">
                            <div className={`w-3 h-3 rounded-full ${getProficiencyLevel(skill.proficiency).bgColor} animate-pulse`} />
                          </div>
                          
                          {/* Hover Glow Effect */}
                          <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />
                        </div>
                      ) : (
                        // List View - Compact Design
                        <div className="glass-card p-4 flex items-center justify-between hover:bg-accent-cyan/5 transition-all duration-300">
                          <div className="flex items-center space-x-4 flex-1">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-cyan/20 to-accent-cyan/5 flex items-center justify-center text-xl">
                              {getSkillIcon(skill.name)}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-light-gray">{skill.name}</h4>
                              <p className="text-sm text-neutral-slate">{skill.experience}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-6">
                            <div className="text-center">
                              <div className="text-lg font-bold text-accent-cyan">{skill.proficiency}%</div>
                              <div className="text-xs text-neutral-slate">{getProficiencyLevel(skill.proficiency).level}</div>
                            </div>
                            
                            <div className="w-32">
                              <div className="h-2 bg-neutral-slate/20 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${skill.proficiency}%` }}
                                  transition={{ duration: 1, delay: index * 0.05 }}
                                  className="h-full bg-gradient-to-r from-accent-cyan to-cyan-400 rounded-full"
                                />
                              </div>
                            </div>
                            
                            <div className="text-center min-w-[60px]">
                              <div className="text-sm font-medium text-light-gray">{skill.projects.length}</div>
                              <div className="text-xs text-neutral-slate">Projects</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </AnimatedCard>
                  ))}
                </motion.div>
              ) : (
                // Enhanced Empty State
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16"
                >
                  <div className="text-8xl mb-6 animate-bounce">🔍</div>
                  <h3 className="text-heading-4 font-semibold text-neutral-slate mb-4">
                    No skills found
                  </h3>
                  <p className="text-body text-neutral-slate mb-6 max-w-md mx-auto">
                    Try adjusting your search terms or selecting a different category to explore more skills.
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm('')
                      setActiveCategory('all')
                    }}
                    className="btn-primary"
                  >
                    Show All Skills
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Enhanced Call to Action */}
          <motion.div className="text-center mt-20" variants={itemVariants}>
            <div className="glass-card max-w-4xl mx-auto p-8 relative overflow-hidden">
              {/* Animated Border */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-cyan to-transparent" />
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-cyan to-transparent" />
              
              {/* Background Animation */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/5 via-transparent to-accent-cyan/10 opacity-50" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-center mb-6">
                  <div className="text-6xl animate-bounce mr-4">🚀</div>
                  <h3 className="text-heading-3 font-bold text-gradient-primary">
                    Ready to Build Something Amazing?
                  </h3>
                </div>
                
                <p className="text-body text-neutral-slate mb-8 max-w-2xl mx-auto leading-relaxed">
                  With expertise across <span className="text-accent-cyan font-semibold">{stats.totalSkills}</span> technologies 
                  and an average proficiency of <span className="text-accent-cyan font-semibold">{stats.averageProficiency}%</span>, 
                  I'm ready to tackle your next challenge and create innovative solutions that make a real impact.
                </p>
                
                {/* Skills Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-2xl mx-auto">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent-cyan">{stats.totalSkills}</div>
                    <div className="text-xs text-neutral-slate">Technologies</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent-cyan">{stats.expertSkills}</div>
                    <div className="text-xs text-neutral-slate">Expert Level</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent-cyan">{stats.categories}</div>
                    <div className="text-xs text-neutral-slate">Categories</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent-cyan">2+</div>
                    <div className="text-xs text-neutral-slate">Years Exp</div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.button 
                    className="btn-primary group relative overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const element = document.getElementById(SECTIONS.PROJECTS)
                      element?.scrollIntoView({ behavior: 'smooth' })
                    }}
                  >
                    <span className="relative z-10 flex items-center">
                      Explore My Projects
                      <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  </motion.button>
                  
                  <motion.button 
                    className="btn-secondary group relative overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const element = document.getElementById(SECTIONS.CONTACT)
                      element?.scrollIntoView({ behavior: 'smooth' })
                    }}
                  >
                    <span className="relative z-10 flex items-center">
                      Let's Collaborate
                      <svg className="w-4 h-4 ml-2 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </span>
                  </motion.button>
                </div>
                
                {/* Quick Contact Info */}
                <div className="mt-6 pt-6 border-t border-accent-cyan/20">
                  <p className="text-sm text-neutral-slate">
                    💡 Have a project in mind? I'm always excited to discuss new opportunities and innovative ideas.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </SectionTransition>
  )
}

export default Skills3D