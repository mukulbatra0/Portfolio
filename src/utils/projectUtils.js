// Project data template and validation utilities
import { validateImagePath, validateImageArray, generateProjectImagePaths } from './imageUtils.js'
import { 
  validateData, 
  ValidationErrorTypes, 
  ValidationSeverity,
  createValidationError,
  validateForRuntime,
  formatValidationErrors
} from './validationUtils.js'

/**
 * Project data template with all required fields and example values
 * This template serves as a reference for creating new projects
 */
export const projectTemplate = {
  id: 'example-project',
  title: 'Example Project',
  subtitle: 'Brief project description',
  year: '2025',
  status: 'completed', // 'completed' | 'in-progress' | 'planned'
  category: 'fullstack', // 'fullstack' | 'frontend' | 'backend' | 'mobile'
  featured: false,
  description: 'Short description for project cards (1-2 sentences)',
  longDescription: 'Detailed project overview explaining the purpose, scope, and impact of the project. This should be comprehensive enough to give visitors a complete understanding of the project.',
  technologies: [
    'React.js',
    'Node.js',
    'Express.js',
    'MongoDB',
    'JavaScript',
    'HTML5',
    'CSS3'
  ],
  features: [
    'Key feature or accomplishment 1',
    'Key feature or accomplishment 2',
    'Key feature or accomplishment 3',
    'Key feature or accomplishment 4'
  ],
  challenges: [
    'Development challenge 1',
    'Development challenge 2',
    'Development challenge 3'
  ],
  solutions: [
    'Solution implemented for challenge 1',
    'Solution implemented for challenge 2',
    'Solution implemented for challenge 3'
  ],
  githubUrl: 'https://github.com/username/repository.git', // or null
  liveUrl: 'https://example.com', // or null
  images: [
    '/assets/images/projects/example-project-1.jpg',
    '/assets/images/projects/example-project-2.jpg',
    '/assets/images/projects/example-project-3.jpg'
  ],
  thumbnail: '/assets/images/projects/example-project-thumb.jpg',
  color: '#3B82F6', // Hex color for theming
  tags: ['Full-Stack', 'Web App', 'API', 'Database'],
  metrics: {
    codeLines: '2000+',
    duration: '3 months',
    teamSize: '1',
    complexity: 'Medium' // 'Low' | 'Medium' | 'High'
  }
}

/**
 * Valid values for project schema validation
 */
export const validProjectValues = {
  status: ['completed', 'in-progress', 'planned'],
  category: ['fullstack', 'frontend', 'backend', 'mobile'],
  complexity: ['Low', 'Medium', 'High']
}

/**
 * Required fields for project validation
 */
export const requiredFields = [
  'id', 'title', 'subtitle', 'year', 'status', 'category', 'featured',
  'description', 'longDescription', 'technologies', 'features', 'challenges',
  'solutions', 'githubUrl', 'liveUrl', 'images', 'thumbnail', 'color',
  'tags', 'metrics'
]

/**
 * Required metrics fields
 */
export const requiredMetricsFields = ['codeLines', 'duration', 'teamSize', 'complexity']

/**
 * Project validation schema
 */
const projectValidationSchema = {
  required: requiredFields,
  types: {
    id: 'string',
    title: 'string',
    subtitle: 'string',
    year: 'string',
    status: 'string',
    category: 'string',
    featured: 'boolean',
    description: 'string',
    longDescription: 'string',
    technologies: 'array',
    features: 'array',
    challenges: 'array',
    solutions: 'array',
    images: 'array',
    thumbnail: 'string',
    color: 'string',
    tags: 'array',
    metrics: 'object'
  },
  formats: {
    id: {
      pattern: /^[a-z0-9-]+$/,
      message: 'Project ID must contain only lowercase letters, numbers, and hyphens',
      suggestion: 'Use kebab-case format (e.g., "my-project-name")'
    },
    year: {
      pattern: /^\d{4}$/,
      message: 'Year must be a 4-digit string',
      suggestion: 'Use format "YYYY" (e.g., "2025")'
    },
    color: {
      pattern: /^#[0-9A-Fa-f]{6}$/,
      message: 'Color must be a valid hex color',
      suggestion: 'Use format "#RRGGBB" (e.g., "#3B82F6")'
    }
  },
  enums: {
    status: validProjectValues.status,
    category: validProjectValues.category
  },
  urls: ['githubUrl', 'liveUrl'],
  arrays: {
    technologies: {
      minLength: 1,
      itemType: 'string',
      unique: true
    },
    features: {
      minLength: 1,
      itemType: 'string'
    },
    challenges: {
      itemType: 'string'
    },
    solutions: {
      itemType: 'string'
    },
    images: {
      itemType: 'string'
    },
    tags: {
      minLength: 1,
      itemType: 'string',
      unique: true
    }
  },
  businessRules: [
    // Validate that challenges and solutions arrays have similar lengths
    (data) => {
      if (data.challenges && data.solutions) {
        const challengeCount = data.challenges.length
        const solutionCount = data.solutions.length
        
        if (challengeCount > 0 && solutionCount === 0) {
          return {
            isValid: false,
            field: 'solutions',
            message: 'Solutions should be provided when challenges are listed',
            severity: ValidationSeverity.WARNING,
            suggestion: 'Add solutions that correspond to the challenges faced'
          }
        }
        
        if (Math.abs(challengeCount - solutionCount) > 2) {
          return {
            isValid: false,
            field: 'solutions',
            message: 'Number of solutions should roughly match number of challenges',
            severity: ValidationSeverity.WARNING,
            suggestion: 'Balance the number of challenges and solutions'
          }
        }
      }
      return { isValid: true }
    },
    
    // Validate metrics object structure
    (data) => {
      if (data.metrics) {
        const requiredMetricsFields = ['codeLines', 'duration', 'teamSize', 'complexity']
        const missingFields = requiredMetricsFields.filter(field => !(field in data.metrics))
        
        if (missingFields.length > 0) {
          return {
            isValid: false,
            field: 'metrics',
            message: `Missing required metrics fields: ${missingFields.join(', ')}`,
            suggestion: 'Add all required metrics fields'
          }
        }
        
        if (data.metrics.complexity && !validProjectValues.complexity.includes(data.metrics.complexity)) {
          return {
            isValid: false,
            field: 'metrics.complexity',
            message: `Complexity must be one of: ${validProjectValues.complexity.join(', ')}`,
            suggestion: 'Use Low, Medium, or High for complexity'
          }
        }
      }
      return { isValid: true }
    },
    
    // Validate featured projects have sufficient content
    (data) => {
      if (data.featured) {
        if (!data.longDescription || data.longDescription.length < 100) {
          return {
            isValid: false,
            field: 'longDescription',
            message: 'Featured projects should have detailed descriptions (at least 100 characters)',
            severity: ValidationSeverity.WARNING,
            suggestion: 'Add a more comprehensive project description'
          }
        }
        
        if (!data.features || data.features.length < 3) {
          return {
            isValid: false,
            field: 'features',
            message: 'Featured projects should have at least 3 features listed',
            severity: ValidationSeverity.WARNING,
            suggestion: 'Add more detailed feature descriptions'
          }
        }
      }
      return { isValid: true }
    }
  ]
}

/**
 * Validates project data against the required schema
 * @param {Object} projectData - The project data to validate
 * @returns {Object} - Validation result with isValid boolean and errors array
 */
export const validateProjectData = (projectData) => {
  // Check if projectData is an object
  if (!projectData || typeof projectData !== 'object') {
    return {
      isValid: false,
      errors: ['Project data must be a valid object'],
      warnings: [],
      summary: { totalIssues: 1, errorCount: 1, warningCount: 0 }
    }
  }
  
  // Use comprehensive validation
  const validationResult = validateData(projectData, projectValidationSchema)
  
  // Add image-specific validation
  const imageErrors = []
  
  if (projectData.images) {
    const imageValidation = validateImageArray(projectData.images)
    if (!imageValidation.isValid) {
      imageErrors.push(createValidationError(
        'images',
        imageValidation.error,
        ValidationErrorTypes.IMAGE_VALIDATION,
        ValidationSeverity.ERROR,
        projectData.images,
        'Ensure all image paths are valid and follow naming conventions'
      ))
    }
  }
  
  if (projectData.thumbnail) {
    const thumbnailValidation = validateImagePath(projectData.thumbnail)
    if (!thumbnailValidation.isValid) {
      imageErrors.push(createValidationError(
        'thumbnail',
        thumbnailValidation.error,
        ValidationErrorTypes.IMAGE_VALIDATION,
        ValidationSeverity.ERROR,
        projectData.thumbnail,
        thumbnailValidation.suggestion
      ))
    }
  }
  
  // Add runtime validation
  const runtimeValidation = validateForRuntime(projectData)
  const runtimeWarnings = runtimeValidation.issues
    .filter(issue => issue.severity === ValidationSeverity.WARNING)
    .map(issue => createValidationError(
      issue.field,
      issue.issue,
      ValidationErrorTypes.BUSINESS_RULE,
      ValidationSeverity.WARNING,
      null,
      issue.suggestion
    ))
  
  // Combine all validation results
  const allErrors = [...validationResult.errors, ...imageErrors]
  const allWarnings = [...validationResult.warnings, ...runtimeWarnings]
  
  return {
    isValid: allErrors.length === 0,
    errors: allErrors.map(error => error.message), // Keep backward compatibility
    warnings: allWarnings.map(warning => warning.message),
    detailedErrors: allErrors, // Provide detailed error objects
    detailedWarnings: allWarnings,
    summary: {
      totalIssues: allErrors.length + allWarnings.length,
      errorCount: allErrors.length,
      warningCount: allWarnings.length,
      fieldsValidated: Object.keys(projectData).length
    },
    runtimeSafe: runtimeValidation.isRuntimeSafe
  }
}

}

/**
 * Generates a unique project ID based on the title
 * @param {string} title - The project title
 * @param {Array} existingProjects - Array of existing projects to check for duplicates
 * @returns {string} - Unique project ID in kebab-case format
 */
export const generateUniqueProjectId = (title, existingProjects = []) => {
  if (!title || typeof title !== 'string') {
    throw new Error('Title must be a non-empty string')
  }
  
  // Convert title to kebab-case
  let baseId = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
  
  // Ensure the ID is not empty
  if (!baseId) {
    baseId = 'project'
  }
  
  // Check for existing IDs and add suffix if needed
  const existingIds = existingProjects.map(project => project.id)
  let uniqueId = baseId
  let counter = 1
  
  while (existingIds.includes(uniqueId)) {
    uniqueId = `${baseId}-${counter}`
    counter++
  }
  
  return uniqueId
}

/**
 * Creates a new project object with default values
 * @param {Object} projectData - Partial project data to override defaults
 * @param {Array} existingProjects - Array of existing projects for ID generation
 * @returns {Object} - Complete project object with all required fields
 */
export const createProjectFromTemplate = (projectData = {}, existingProjects = []) => {
  // Generate unique ID if not provided
  const id = projectData.id || generateUniqueProjectId(projectData.title || 'New Project', existingProjects)
  
  // Generate image paths if not provided
  let images = projectData.images
  let thumbnail = projectData.thumbnail
  
  if (!images || !thumbnail) {
    const generatedPaths = generateProjectImagePaths(id, 3)
    images = images || generatedPaths.images
    thumbnail = thumbnail || generatedPaths.thumbnail
  }
  
  // Merge provided data with template defaults
  const newProject = {
    ...projectTemplate,
    ...projectData,
    id,
    images,
    thumbnail,
    // Ensure arrays are properly merged
    technologies: projectData.technologies || projectTemplate.technologies,
    features: projectData.features || projectTemplate.features,
    challenges: projectData.challenges || projectTemplate.challenges,
    solutions: projectData.solutions || projectTemplate.solutions,
    tags: projectData.tags || projectTemplate.tags,
    metrics: {
      ...projectTemplate.metrics,
      ...(projectData.metrics || {})
    }
  }
  
  return newProject
}

/**
 * Updates technology color mappings for new technologies in projects
 * @param {Array} projects - Array of project objects
 * @returns {Object} - Report of technology color mapping status
 */
export const updateTechnologyColorMappings = (projects = []) => {
  // Import here to avoid circular dependencies
  const { generateTechnologyColorReport } = require('./technologyColors.js')
  
  return generateTechnologyColorReport(projects)
}

/**
 * Validates that all technologies in projects have appropriate color mappings
 * @param {Array} projects - Array of project objects
 * @returns {Object} - Validation result with mapping coverage
 */
export const validateProjectTechnologyColors = (projects = []) => {
  const { getUnmappedTechnologies, generateTechnologyColorReport } = require('./technologyColors.js')
  
  const unmappedTechnologies = getUnmappedTechnologies(projects)
  const report = generateTechnologyColorReport(projects)
  
  return {
    isValid: unmappedTechnologies.length === 0,
    unmappedTechnologies,
    mappingCoverage: report.mappingCoverage,
    totalTechnologies: report.total,
    recommendations: unmappedTechnologies.length > 0 
      ? `Consider adding explicit color mappings for: ${unmappedTechnologies.join(', ')}`
      : 'All technologies have color mappings'
  }
}

/**
 * Adds a new project to the projects array with validation
 * @param {Object} newProjectData - The new project data to add
 * @param {Array} existingProjects - Current projects array
 * @returns {Object} - Result with updated projects array and validation info
 */
export const addNewProject = (newProjectData, existingProjects = []) => {
  // Validate the new project data
  const validation = validateProjectData(newProjectData)
  
  if (!validation.isValid) {
    return {
      success: false,
      errors: validation.errors,
      projects: existingProjects
    }
  }
  
  // Check for duplicate IDs
  const existingIds = existingProjects.map(project => project.id)
  if (existingIds.includes(newProjectData.id)) {
    return {
      success: false,
      errors: [`Project with ID '${newProjectData.id}' already exists`],
      projects: existingProjects
    }
  }
  
  // Create the complete project object
  const completeProject = createProjectFromTemplate(newProjectData, existingProjects)
  
  // Add to projects array (new projects go at the beginning for featured display)
  const updatedProjects = [completeProject, ...existingProjects]
  
  return {
    success: true,
    errors: [],
    projects: updatedProjects,
    addedProject: completeProject,
    projectCount: updatedProjects.length
  }
}

/**
 * Updates project statistics after adding a new project
 * @param {Array} projects - Updated projects array
 * @returns {Object} - Updated project statistics
 */
export const updateProjectStatistics = (projects = []) => {
  const totalProjects = projects.length
  const completedProjects = projects.filter(p => p.status === 'completed').length
  const featuredProjects = projects.filter(p => p.featured).length
  const totalTechnologies = [...new Set(projects.flatMap(p => p.technologies))].length
  
  // Calculate category counts
  const categoryStats = {
    fullstack: projects.filter(p => p.category === 'fullstack').length,
    frontend: projects.filter(p => p.category === 'frontend').length,
    backend: projects.filter(p => p.category === 'backend').length,
    mobile: projects.filter(p => p.category === 'mobile').length
  }
  
  // Calculate status distribution
  const statusStats = {
    completed: completedProjects,
    'in-progress': projects.filter(p => p.status === 'in-progress').length,
    planned: projects.filter(p => p.status === 'planned').length
  }
  
  return {
    totalProjects,
    completedProjects,
    featuredProjects,
    totalTechnologies,
    categoryStats,
    statusStats,
    completionRate: totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0
  }
}

/**
 * Ensures proper array ordering after adding new projects
 * @param {Array} projects - Projects array to reorder
 * @param {string} orderBy - Ordering criteria ('year', 'featured', 'status', 'category')
 * @param {string} direction - Sort direction ('asc' or 'desc')
 * @returns {Array} - Reordered projects array
 */
export const reorderProjects = (projects = [], orderBy = 'year', direction = 'desc') => {
  const sortedProjects = [...projects]
  
  sortedProjects.sort((a, b) => {
    let aValue, bValue
    
    switch (orderBy) {
      case 'year':
        aValue = parseInt(a.year)
        bValue = parseInt(b.year)
        break
      case 'featured':
        aValue = a.featured ? 1 : 0
        bValue = b.featured ? 1 : 0
        break
      case 'status':
        const statusOrder = { 'completed': 3, 'in-progress': 2, 'planned': 1 }
        aValue = statusOrder[a.status] || 0
        bValue = statusOrder[b.status] || 0
        break
      case 'category':
        aValue = a.category
        bValue = b.category
        break
      default:
        aValue = a.title
        bValue = b.title
    }
    
    if (direction === 'asc') {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0
    } else {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0
    }
  })
  
  return sortedProjects
}

/**
 * Validates project array integrity after modifications
 * @param {Array} projects - Projects array to validate
 * @returns {Object} - Validation result with any issues found
 */
export const validateProjectArrayIntegrity = (projects = []) => {
  const issues = []
  const warnings = []
  const ids = new Set()
  const validationResults = []
  
  projects.forEach((project, index) => {
    // Check for duplicate IDs
    if (ids.has(project.id)) {
      issues.push(`Duplicate project ID '${project.id}' found at index ${index}`)
    } else {
      ids.add(project.id)
    }
    
    // Validate each project
    const validation = validateProjectData(project)
    validationResults.push({
      index,
      projectId: project.id,
      validation
    })
    
    if (!validation.isValid) {
      issues.push(`Project '${project.id}' at index ${index} has ${validation.errorCount} validation errors`)
    }
    
    if (validation.warningCount > 0) {
      warnings.push(`Project '${project.id}' at index ${index} has ${validation.warningCount} warnings`)
    }
  })
  
  // Check for business rules across the entire array
  const featuredCount = projects.filter(p => p.featured).length
  if (featuredCount === 0) {
    warnings.push('No projects are marked as featured - consider featuring your best work')
  } else if (featuredCount > 6) {
    warnings.push(`${featuredCount} projects are featured - consider limiting to 3-6 for better focus`)
  }
  
  // Check for category distribution
  const categories = {}
  projects.forEach(project => {
    categories[project.category] = (categories[project.category] || 0) + 1
  })
  
  if (Object.keys(categories).length === 1) {
    warnings.push('All projects are in the same category - consider diversifying your portfolio')
  }
  
  return {
    isValid: issues.length === 0,
    issues,
    warnings,
    projectCount: projects.length,
    uniqueIds: ids.size,
    featuredCount,
    categoryDistribution: categories,
    validationResults,
    summary: {
      totalProjects: projects.length,
      validProjects: validationResults.filter(r => r.validation.isValid).length,
      projectsWithWarnings: validationResults.filter(r => r.validation.warningCount > 0).length,
      totalErrors: validationResults.reduce((sum, r) => sum + r.validation.errorCount, 0),
      totalWarnings: validationResults.reduce((sum, r) => sum + r.validation.warningCount, 0)
    }
  }
}

/**
 * Create comprehensive validation report for project data
 * @param {Object} projectData - Project data to validate
 * @returns {Object} - Detailed validation report
 */
export const createProjectValidationReport = (projectData) => {
  const validation = validateProjectData(projectData)
  
  const report = {
    projectId: projectData.id || 'unknown',
    timestamp: new Date().toISOString(),
    overall: validation.isValid ? 'PASS' : 'FAIL',
    runtimeSafe: validation.runtimeSafe,
    summary: validation.summary,
    sections: {
      requiredFields: {
        status: 'CHECKING',
        issues: []
      },
      dataTypes: {
        status: 'CHECKING',
        issues: []
      },
      formats: {
        status: 'CHECKING',
        issues: []
      },
      businessRules: {
        status: 'CHECKING',
        issues: []
      },
      images: {
        status: 'CHECKING',
        issues: []
      },
      runtime: {
        status: 'CHECKING',
        issues: []
      }
    },
    recommendations: [],
    nextSteps: []
  }
  
  // Categorize errors by type
  if (validation.detailedErrors) {
    validation.detailedErrors.forEach(error => {
      switch (error.type) {
        case ValidationErrorTypes.REQUIRED_FIELD:
          report.sections.requiredFields.issues.push(error)
          break
        case ValidationErrorTypes.INVALID_TYPE:
          report.sections.dataTypes.issues.push(error)
          break
        case ValidationErrorTypes.INVALID_FORMAT:
          report.sections.formats.issues.push(error)
          break
        case ValidationErrorTypes.BUSINESS_RULE:
          report.sections.businessRules.issues.push(error)
          break
        case ValidationErrorTypes.IMAGE_VALIDATION:
          report.sections.images.issues.push(error)
          break
        default:
          report.sections.runtime.issues.push(error)
      }
    })
  }
  
  // Set section statuses
  Object.keys(report.sections).forEach(section => {
    const hasErrors = report.sections[section].issues.some(issue => 
      issue.severity === ValidationSeverity.ERROR
    )
    const hasWarnings = report.sections[section].issues.some(issue => 
      issue.severity === ValidationSeverity.WARNING
    )
    
    if (hasErrors) {
      report.sections[section].status = 'FAIL'
    } else if (hasWarnings) {
      report.sections[section].status = 'WARNING'
    } else {
      report.sections[section].status = 'PASS'
    }
  })
  
  // Generate recommendations
  if (validation.detailedWarnings) {
    validation.detailedWarnings.forEach(warning => {
      if (warning.suggestion) {
        report.recommendations.push(warning.suggestion)
      }
    })
  }
  
  // Generate next steps
  if (!validation.isValid) {
    report.nextSteps.push('Fix all validation errors before adding the project')
    report.nextSteps.push('Review the error messages and suggestions provided')
  } else if (validation.warningCount > 0) {
    report.nextSteps.push('Consider addressing the warnings to improve project quality')
  } else {
    report.nextSteps.push('Project is ready to be added to the portfolio')
    report.nextSteps.push('Test the project display in the UI')
  }
  
  return report
}

/**
 * Validate project data with user-friendly error messages
 * @param {Object} projectData - Project data to validate
 * @returns {Object} - User-friendly validation result
 */
export const validateProjectDataForUser = (projectData) => {
  const validation = validateProjectData(projectData)
  
  const userFriendlyResult = {
    isValid: validation.isValid,
    canProceed: validation.isValid,
    summary: `${validation.isValid ? 'Valid' : 'Invalid'} project data with ${validation.errorCount} errors and ${validation.warningCount} warnings`,
    errors: formatValidationErrors(validation.detailedErrors || [], {
      includeSuggestions: true,
      groupByField: false
    }),
    warnings: formatValidationErrors(validation.detailedWarnings || [], {
      includeSuggestions: true,
      groupByField: false
    }),
    checklist: validation.detailedErrors ? 
      require('./validationUtils.js').createValidationChecklist({
        isValid: validation.isValid,
        errors: validation.detailedErrors,
        warnings: validation.detailedWarnings
      }) : null
  }
  
  return userFriendlyResult
}