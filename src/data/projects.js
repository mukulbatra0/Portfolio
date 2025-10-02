// Projects data model for Mukul Batra

export const projects = [
  {
    id: 'portmysim',
    title: 'PortMySim',
    subtitle: 'SIM Porting Web Application',
    year: '2025',
    status: 'completed',
    category: 'fullstack',
    featured: true,
    description: 'A comprehensive full-stack web application designed to streamline the SIM porting process. Built with modern web technologies to provide an intuitive user experience for telecom customers.',
    longDescription: 'PortMySim is a full-stack web application that revolutionizes the SIM porting process by providing a seamless, user-friendly interface for customers to port their mobile numbers between telecom operators. The application features a robust backend API, secure data handling, and an intuitive frontend that guides users through each step of the porting process.',
    technologies: [
      'MongoDB',
      'Express.js',
      'Node.js',
      'EJS',
      'RESTful APIs',
      'JavaScript',
      'HTML5',
      'CSS3',
      'Bootstrap'
    ],
    features: [
      'Engineered full-stack web application to streamline SIM porting process',
      'Developed RESTful API backend with Express.js and Node.js',
      'Implemented secure MongoDB database for user data management',
      'Created responsive frontend with EJS templating and Bootstrap',
      'Built comprehensive form validation and error handling',
      'Integrated real-time status tracking for porting requests',
      'Implemented user authentication and session management',
      'Added email notification system for process updates'
    ],
    challenges: [
      'Designing secure data flow for sensitive telecom information',
      'Creating intuitive UX for complex multi-step process',
      'Implementing real-time status updates',
      'Ensuring data validation and security compliance'
    ],
    solutions: [
      'Implemented JWT-based authentication with secure session management',
      'Created step-by-step wizard interface with progress indicators',
      'Used WebSocket connections for real-time status updates',
      'Added comprehensive input validation and sanitization'
    ],
    githubUrl: 'https://github.com/mukulbatra0/PortMySim.git',
    liveUrl: null,
    images: [
      '/assets/images/projects/portmysim-1.png',
      '/assets/images/projects/portmysim-2.png',
      '/assets/images/projects/portmysim-3.png'
    ],
    thumbnail: '/assets/images/projects/portmysim-thumb.png',
    color: '#22D3EE',
    tags: ['Full-Stack', 'Web App', 'API', 'Database'],
    metrics: {
      codeLines: '2500+',
      duration: '3 months',
      teamSize: '1',
      complexity: 'High'
    }
  },
  {
    id: 'sydneyevent',
    title: 'SydneyEvent',
    subtitle: 'Event Management Platform',
    year: '2025',
    status: 'completed',
    category: 'frontend',
    featured: true,
    description: 'A modern event management platform built with React.js, featuring real-time event creation, management, and attendee tracking capabilities.',
    longDescription: 'SydneyEvent is a comprehensive event management platform that enables users to create, manage, and track events seamlessly. Built with React.js and modern web technologies, it provides a responsive and intuitive interface for event organizers and attendees alike.',
    technologies: [
      'React.js',
      'Node.js',
      'Express.js',
      'JavaScript (ES6+)',
      'HTML5',
      'CSS3',
      'RESTful APIs',
      'JSON'
    ],
    features: [
      'Built responsive React.js frontend with component-based architecture',
      'Implemented real-time event creation and management system',
      'Created dynamic event listing with search and filter capabilities',
      'Developed user registration and authentication system',
      'Added event booking and attendee management features',
      'Integrated calendar view for event scheduling',
      'Built responsive design for mobile and desktop platforms',
      'Implemented state management for complex user interactions'
    ],
    challenges: [
      'Managing complex state across multiple components',
      'Creating responsive design for various screen sizes',
      'Implementing real-time updates for event changes',
      'Optimizing performance for large event lists'
    ],
    solutions: [
      'Used React Context API for efficient state management',
      'Implemented CSS Grid and Flexbox for responsive layouts',
      'Added real-time updates using WebSocket connections',
      'Implemented virtual scrolling for performance optimization'
    ],
    githubUrl: 'https://github.com/mukulbatra0/SydeyEvent.git',
    liveUrl: null,
    images: [
      '/assets/images/projects/sydneyevent-1.jpg',
      '/assets/images/projects/sydneyevent-2.jpg',
      '/assets/images/projects/sydneyevent-3.jpg'
    ],
    thumbnail: '/assets/images/projects/sydneyevent-thumb.png',
    color: '#3B82F6',
    tags: ['React.js', 'Frontend', 'Events', 'Responsive'],
    metrics: {
      codeLines: '1800+',
      duration: '2 months',
      teamSize: '1',
      complexity: 'Medium'
    }
  },
  {
    id: 'pixisphere',
    title: 'PixiSphere',
    subtitle: 'Interactive 3D Visualization Platform',
    year: '2024',
    status: 'completed',
    category: 'frontend',
    featured: true,
    description: 'An innovative 3D visualization platform built with React.js and Tailwind CSS, featuring interactive 3D elements and modern UI design.',
    longDescription: 'PixiSphere represents the cutting edge of web-based 3D visualization, combining React.js with advanced CSS techniques to create immersive interactive experiences. The platform showcases modern web development capabilities with smooth animations and responsive design.',
    technologies: [
      'React.js',
      'Tailwind CSS',
      'JavaScript (ES6+)',
      'HTML5',
      'CSS3',
      'Three.js',
      'WebGL'
    ],
    features: [
      'Developed interactive 3D visualization components using React.js',
      'Implemented modern UI design with Tailwind CSS utility classes',
      'Created responsive layouts that work across all device sizes',
      'Built smooth animations and transitions for enhanced UX',
      'Integrated 3D graphics rendering with WebGL and Three.js',
      'Developed component-based architecture for maintainability',
      'Added interactive controls for 3D scene manipulation',
      'Implemented performance optimizations for smooth rendering'
    ],
    challenges: [
      'Integrating 3D graphics with React component lifecycle',
      'Optimizing performance for complex 3D scenes',
      'Creating responsive design for 3D content',
      'Managing WebGL context and memory efficiently'
    ],
    solutions: [
      'Used React Three Fiber for seamless React-Three.js integration',
      'Implemented Level of Detail (LOD) for performance optimization',
      'Created adaptive rendering based on device capabilities',
      'Added proper cleanup and memory management for WebGL resources'
    ],
    githubUrl: 'https://github.com/mukulbatra0/PixiSphere.git',
    liveUrl: null,
    images: [
      '/assets/images/projects/pixisphere-1.png',
      '/assets/images/projects/pixisphere-2.png',
      '/assets/images/projects/pixisphere-3.png'
    ],
    thumbnail: '/assets/images/projects/pixisphere-thumb.png',
    color: '#10B981',
    tags: ['React.js', '3D', 'WebGL', 'Interactive'],
    metrics: {
      codeLines: '1500+',
      duration: '2 months',
      teamSize: '1',
      complexity: 'High'
    }
  }
]

/**
 * Generate project categories with dynamic counts
 * @param {Array} projectsArray - Array of projects to calculate counts from
 * @returns {Array} - Array of category objects with updated counts
 */
export const getProjectCategories = (projectsArray = projects) => [
  { id: 'all', name: 'All Projects', icon: '🚀', count: projectsArray.length },
  { id: 'fullstack', name: 'Full-Stack', icon: '⚡', count: projectsArray.filter(p => p.category === 'fullstack').length },
  { id: 'frontend', name: 'Frontend', icon: '🎨', count: projectsArray.filter(p => p.category === 'frontend').length },
  { id: 'backend', name: 'Backend', icon: '⚙️', count: projectsArray.filter(p => p.category === 'backend').length },
  { id: 'mobile', name: 'Mobile', icon: '📱', count: projectsArray.filter(p => p.category === 'mobile').length }
]

// Project categories for filtering (backward compatibility)
export const projectCategories = getProjectCategories(projects)

/**
 * Generate technology tags dynamically from projects
 * @param {Array} projectsArray - Array of projects to extract technologies from
 * @returns {Array} - Array of unique technology names
 */
export const getTechnologyTags = (projectsArray = projects) => {
  return [...new Set(projectsArray.flatMap(project => project.technologies || []))].sort()
}

// Technology tags for filtering (backward compatibility)
export const technologyTags = getTechnologyTags(projects)

// Helper functions
export const getFeaturedProjects = () => {
  return projects.filter(project => project.featured)
}

export const getProjectsByCategory = (category, projectsArray = projects) => {
  if (category === 'all') return projectsArray
  return projectsArray.filter(project => project.category === category)
}

export const getProjectsByTechnology = (technology, projectsArray = projects) => {
  return projectsArray.filter(project =>
    project.technologies?.some(tech =>
      tech.toLowerCase().includes(technology.toLowerCase())
    )
  )
}

export const getProjectById = (id, projectsArray = projects) => {
  return projectsArray.find(project => project.id === id)
}

/**
 * Get projects by status
 * @param {string} status - Project status to filter by
 * @param {Array} projectsArray - Array of projects to filter
 * @returns {Array} - Filtered projects array
 */
export const getProjectsByStatus = (status, projectsArray = projects) => {
  return projectsArray.filter(project => project.status === status)
}

/**
 * Get projects by complexity
 * @param {string} complexity - Complexity level to filter by
 * @param {Array} projectsArray - Array of projects to filter
 * @returns {Array} - Filtered projects array
 */
export const getProjectsByComplexity = (complexity, projectsArray = projects) => {
  return projectsArray.filter(project => project.metrics?.complexity === complexity)
}

/**
 * Search projects by title, description, or technologies
 * @param {string} searchTerm - Search term
 * @param {Array} projectsArray - Array of projects to search
 * @returns {Array} - Matching projects array
 */
export const searchProjects = (searchTerm, projectsArray = projects) => {
  if (!searchTerm || typeof searchTerm !== 'string') return projectsArray

  const term = searchTerm.toLowerCase().trim()

  return projectsArray.filter(project =>
    project.title?.toLowerCase().includes(term) ||
    project.subtitle?.toLowerCase().includes(term) ||
    project.description?.toLowerCase().includes(term) ||
    project.longDescription?.toLowerCase().includes(term) ||
    project.technologies?.some(tech => tech.toLowerCase().includes(term)) ||
    project.tags?.some(tag => tag.toLowerCase().includes(term))
  )
}

/**
 * Get projects sorted by various criteria
 * @param {string} sortBy - Sort criteria ('year', 'title', 'complexity', 'status')
 * @param {string} order - Sort order ('asc' or 'desc')
 * @param {Array} projectsArray - Array of projects to sort
 * @returns {Array} - Sorted projects array
 */
export const getSortedProjects = (sortBy = 'year', order = 'desc', projectsArray = projects) => {
  const sortedProjects = [...projectsArray]

  sortedProjects.sort((a, b) => {
    let aValue, bValue

    switch (sortBy) {
      case 'year':
        aValue = parseInt(a.year) || 0
        bValue = parseInt(b.year) || 0
        break
      case 'title':
        aValue = a.title?.toLowerCase() || ''
        bValue = b.title?.toLowerCase() || ''
        break
      case 'complexity':
        const complexityOrder = { 'Low': 1, 'Medium': 2, 'High': 3 }
        aValue = complexityOrder[a.metrics?.complexity] || 0
        bValue = complexityOrder[b.metrics?.complexity] || 0
        break
      case 'status':
        const statusOrder = { 'planned': 1, 'in-progress': 2, 'completed': 3 }
        aValue = statusOrder[a.status] || 0
        bValue = statusOrder[b.status] || 0
        break
      default:
        aValue = a.title?.toLowerCase() || ''
        bValue = b.title?.toLowerCase() || ''
    }

    if (order === 'asc') {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0
    } else {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0
    }
  })

  return sortedProjects
}

export const getRelatedProjects = (currentProjectId, limit = 2, projectsArray = projects) => {
  const currentProject = projectsArray.find(project => project.id === currentProjectId)
  if (!currentProject) return []

  // Calculate similarity scores for better matching
  const relatedProjects = projectsArray
    .filter(project => project.id !== currentProjectId)
    .map(project => {
      let similarityScore = 0

      // Category match (high weight)
      if (project.category === currentProject.category) {
        similarityScore += 3
      }

      // Technology overlap (medium weight)
      const commonTechnologies = project.technologies?.filter(tech =>
        currentProject.technologies?.includes(tech)
      ) || []
      similarityScore += commonTechnologies.length * 2

      // Status match (low weight)
      if (project.status === currentProject.status) {
        similarityScore += 1
      }

      // Complexity match (low weight)
      if (project.metrics?.complexity === currentProject.metrics?.complexity) {
        similarityScore += 1
      }

      return {
        ...project,
        similarityScore
      }
    })
    .filter(project => project.similarityScore > 0)
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, limit)

  // Remove similarity score from returned objects
  return relatedProjects.map(({ similarityScore, ...project }) => project)
}

export const getProjectStats = (projectsArray = projects) => {
  const totalProjects = projectsArray.length
  const completedProjects = projectsArray.filter(p => p.status === 'completed').length
  const featuredProjects = projectsArray.filter(p => p.featured).length
  const totalTechnologies = [...new Set(projectsArray.flatMap(p => p.technologies))].length

  // Calculate additional statistics
  const inProgressProjects = projectsArray.filter(p => p.status === 'in-progress').length
  const plannedProjects = projectsArray.filter(p => p.status === 'planned').length

  // Category breakdown
  const categoryBreakdown = {
    fullstack: projectsArray.filter(p => p.category === 'fullstack').length,
    frontend: projectsArray.filter(p => p.category === 'frontend').length,
    backend: projectsArray.filter(p => p.category === 'backend').length,
    mobile: projectsArray.filter(p => p.category === 'mobile').length
  }

  // Complexity analysis
  const complexityBreakdown = {
    low: projectsArray.filter(p => p.metrics?.complexity === 'Low').length,
    medium: projectsArray.filter(p => p.metrics?.complexity === 'Medium').length,
    high: projectsArray.filter(p => p.metrics?.complexity === 'High').length
  }

  // Calculate completion rate
  const completionRate = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0

  return {
    totalProjects,
    completedProjects,
    featuredProjects,
    totalTechnologies,
    inProgressProjects,
    plannedProjects,
    categoryBreakdown,
    complexityBreakdown,
    completionRate,
    averageComplexity: calculateAverageComplexity(projectsArray),
    mostUsedTechnologies: getMostUsedTechnologies(projectsArray, 5),
    recentProjects: getRecentProjects(projectsArray, 3)
  }
}

/**
 * Calculate average complexity score
 * @param {Array} projectsArray - Array of projects
 * @returns {number} - Average complexity (1-3 scale)
 */
const calculateAverageComplexity = (projectsArray) => {
  const complexityScores = { 'Low': 1, 'Medium': 2, 'High': 3 }
  const scores = projectsArray
    .filter(p => p.metrics?.complexity)
    .map(p => complexityScores[p.metrics.complexity] || 2)

  return scores.length > 0 ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10 : 2
}

/**
 * Get most frequently used technologies
 * @param {Array} projectsArray - Array of projects
 * @param {number} limit - Number of technologies to return
 * @returns {Array} - Array of technology usage objects
 */
const getMostUsedTechnologies = (projectsArray, limit = 5) => {
  const techCount = {}

  projectsArray.forEach(project => {
    project.technologies?.forEach(tech => {
      techCount[tech] = (techCount[tech] || 0) + 1
    })
  })

  return Object.entries(techCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([tech, count]) => ({
      technology: tech,
      count,
      percentage: Math.round((count / projectsArray.length) * 100)
    }))
}

/**
 * Get most recent projects
 * @param {Array} projectsArray - Array of projects
 * @param {number} limit - Number of projects to return
 * @returns {Array} - Array of recent projects
 */
const getRecentProjects = (projectsArray, limit = 3) => {
  return projectsArray
    .sort((a, b) => parseInt(b.year) - parseInt(a.year))
    .slice(0, limit)
    .map(project => ({
      id: project.id,
      title: project.title,
      year: project.year,
      status: project.status,
      category: project.category
    }))
}

export default projects