import React, { useState } from 'react'

const ProjectCard = ({ 
  project, 
  index = 0, 
  onClick = null,
  variant = 'default', // 'default', 'featured', 'compact'
  showDetails = true 
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleClick = () => {
    if (onClick) {
      onClick(project)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 bg-opacity-20 text-green-400 border-green-400'
      case 'in-progress':
        return 'bg-yellow-500 bg-opacity-20 text-yellow-400 border-yellow-400'
      case 'planned':
        return 'bg-blue-500 bg-opacity-20 text-blue-400 border-blue-400'
      default:
        return 'bg-neutral-slate bg-opacity-20 text-neutral-slate border-neutral-slate'
    }
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'fullstack': return '⚡'
      case 'frontend': return '🎨'
      case 'backend': return '⚙️'
      case 'mobile': return '📱'
      default: return '🚀'
    }
  }

  if (variant === 'compact') {
    return (
      <div 
        className={`project-card-compact glass-card p-4 cursor-pointer transition-all duration-300 hover:scale-105 ${
          isHovered ? 'shadow-glow' : ''
        }`}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <div className="flex items-center space-x-3">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: project.color }}
          >
            {getCategoryIcon(project.category)}
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-light-gray">{project.title}</h4>
            <p className="text-sm text-neutral-slate">{project.subtitle}</p>
          </div>
          <div className="text-right">
            <div className="text-xs text-neutral-slate">{project.year}</div>
            <div className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(project.status)}`}>
              {project.status}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className={`project-card glass-card overflow-hidden cursor-pointer transition-all duration-500 ease-out group ${
        variant === 'featured' ? 'lg:col-span-2' : ''
      } ${isHovered ? 'scale-102 shadow-glow' : ''}`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        animationDelay: `${index * 150}ms`,
        borderLeft: `4px solid ${project.color}`
      }}
    >
      {/* Project Image */}
      <div className="relative h-48 overflow-hidden bg-neutral-slate bg-opacity-10">
        {project.thumbnail ? (
          <>
            <img
              src={project.thumbnail}
              alt={project.title}
              className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageLoaded(true)}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-accent-cyan border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </>
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center text-6xl text-white"
            style={{ backgroundColor: project.color }}
          >
            {getCategoryIcon(project.category)}
          </div>
        )}
        
        {/* Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`} />
        
        {/* Featured Badge */}
        {project.featured && (
          <div className="absolute top-4 right-4 px-3 py-1 bg-accent-cyan text-primary-dark text-xs font-semibold rounded-full">
            Featured
          </div>
        )}
        
        {/* Status Badge */}
        <div className={`absolute top-4 left-4 px-2 py-1 text-xs rounded-full border ${getStatusColor(project.status)}`}>
          {project.status}
        </div>
        
        {/* Quick Actions */}
        <div className={`absolute bottom-4 right-4 flex space-x-2 transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}>
          {project.githubUrl && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                window.open(project.githubUrl, '_blank')
              }}
              className="p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-colors"
              aria-label="View GitHub repository"
            >
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            </button>
          )}
          {project.liveUrl && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                window.open(project.liveUrl, '_blank')
              }}
              className="p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-colors"
              aria-label="View live project"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Project Content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-heading-4 font-semibold text-light-gray mb-1 group-hover:text-accent-cyan transition-colors">
              {project.title}
            </h3>
            <p className="text-sm text-neutral-slate">{project.subtitle}</p>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-accent-cyan">{project.year}</div>
            <div className="text-xs text-neutral-slate">{project.category}</div>
          </div>
        </div>

        {/* Description */}
        <p className="text-neutral-slate text-sm mb-4 line-clamp-3">
          {project.description}
        </p>

        {/* Technologies */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {project.technologies.slice(0, 4).map((tech, idx) => (
              <span 
                key={idx}
                className="px-2 py-1 text-xs bg-accent-cyan bg-opacity-10 text-accent-cyan rounded border border-accent-cyan border-opacity-20"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span className="px-2 py-1 text-xs text-neutral-slate">
                +{project.technologies.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Metrics */}
        {showDetails && project.metrics && (
          <div className="grid grid-cols-2 gap-4 mb-4 pt-4 border-t border-neutral-slate border-opacity-20">
            <div className="text-center">
              <div className="text-sm font-semibold text-accent-cyan">{project.metrics.duration}</div>
              <div className="text-xs text-neutral-slate">Duration</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-semibold text-accent-cyan">{project.metrics.codeLines}</div>
              <div className="text-xs text-neutral-slate">Lines of Code</div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {project.tags.slice(0, 2).map((tag, idx) => (
              <span key={idx} className="text-xs text-neutral-slate">
                #{tag}
              </span>
            ))}
          </div>
          
          <button className="text-sm text-accent-cyan hover:text-cyan-300 transition-colors font-medium">
            View Details →
          </button>
        </div>
      </div>

      {/* Hover Effect Overlay */}
      {isHovered && (
        <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/5 to-transparent rounded-2xl pointer-events-none" />
      )}
    </div>
  )
}

export default ProjectCard