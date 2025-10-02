import React, { useState, useEffect, useRef } from 'react'
import { useIntersectionObserverSingle } from '../../hooks/useIntersectionObserver'

const SkillCard = ({ 
  skill, 
  index = 0, 
  category = 'all',
  showProjects = true,
  showExperience = true,
  interactive = true,
  size = 'md',
  viewMode = 'grid'
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [progressAnimated, setProgressAnimated] = useState(false)
  const elementRef = useRef(null)
  const { isIntersecting } = useIntersectionObserverSingle(elementRef, {
    threshold: 0.3,
    triggerOnce: true
  })

  // Animate progress bar when in view
  useEffect(() => {
    if (isIntersecting && !progressAnimated) {
      const timer = setTimeout(() => {
        setProgressAnimated(true)
      }, index * 100) // Stagger animation based on index
      
      return () => clearTimeout(timer)
    }
  }, [isIntersecting, progressAnimated, index])

  // Get proficiency level text and color
  const getProficiencyLevel = (proficiency) => {
    if (proficiency >= 90) return { level: 'Expert', color: 'text-green-400', bgColor: 'bg-green-400' }
    if (proficiency >= 75) return { level: 'Advanced', color: 'text-blue-400', bgColor: 'bg-blue-400' }
    if (proficiency >= 60) return { level: 'Intermediate', color: 'text-yellow-400', bgColor: 'bg-yellow-400' }
    return { level: 'Beginner', color: 'text-orange-400', bgColor: 'bg-orange-400' }
  }

  const proficiencyInfo = getProficiencyLevel(skill.proficiency)

  // Size configurations
  const sizes = {
    sm: {
      card: 'p-4',
      icon: 'text-2xl',
      title: 'text-lg',
      progress: 'h-1.5',
      badge: 'text-xs px-2 py-1'
    },
    md: {
      card: 'p-6',
      icon: 'text-3xl',
      title: 'text-xl',
      progress: 'h-2',
      badge: 'text-sm px-3 py-1'
    },
    lg: {
      card: 'p-8',
      icon: 'text-4xl',
      title: 'text-2xl',
      progress: 'h-3',
      badge: 'text-base px-4 py-2'
    }
  }

  const sizeConfig = sizes[size] || sizes.md

  // Get skill icon based on name
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

  // Simple test render first
  if (!skill) {
    return <div className="glass-card p-4 text-red-500">No skill data</div>
  }

  if (viewMode === 'list') {
    return (
      <div
        ref={elementRef}
        className="glass-card p-4 flex items-center justify-between hover:bg-accent-cyan/5 transition-all duration-300 group"
      >
        <div className="flex items-center space-x-4 flex-1">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent-cyan/20 to-accent-cyan/5 flex items-center justify-center text-2xl">
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
            <div className="text-xs text-neutral-slate">{proficiencyInfo.level}</div>
          </div>
          
          <div className="w-32">
            <div className="h-2 bg-neutral-slate/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-accent-cyan rounded-full"
                style={{ width: `${skill.proficiency}%` }}
              />
            </div>
          </div>
          
          <div className="text-center min-w-[60px]">
            <div className="text-sm font-medium text-light-gray">{skill.projects?.length || 0}</div>
            <div className="text-xs text-neutral-slate">Projects</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={elementRef}
      className="glass-card p-6 group relative transition-all duration-300 hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Skill Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-cyan/20 to-accent-cyan/5 flex items-center justify-center text-2xl">
            {getSkillIcon(skill.name)}
          </div>
          <div>
            <h3 className="text-lg font-bold text-light-gray group-hover:text-accent-cyan transition-colors">
              {skill.name}
            </h3>
            <p className="text-xs text-neutral-slate">{skill.experience}</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-accent-cyan">{skill.proficiency}%</div>
          <div className="text-xs text-neutral-slate">
            {proficiencyInfo.level}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-neutral-slate">Proficiency</span>
          <span className="text-sm font-medium text-accent-cyan">{skill.proficiency}%</span>
        </div>
        <div className="relative h-3 bg-neutral-slate/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-accent-cyan to-cyan-400 rounded-full"
            style={{ width: `${skill.proficiency}%` }}
          />
        </div>
      </div>

      {/* Projects Section */}
      {skill.projects && skill.projects.length > 0 && (
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
        <div className={`w-3 h-3 rounded-full ${proficiencyInfo.bgColor}`} />
      </div>
    </div>
  )
}

export default SkillCard