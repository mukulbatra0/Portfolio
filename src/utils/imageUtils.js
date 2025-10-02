// Image handling utilities for project management

/**
 * Standard image directory structure for projects
 */
export const IMAGE_PATHS = {
  projects: '/assets/images/projects',
  placeholders: '/assets/images/placeholders',
  thumbnails: '/assets/images/projects/thumbnails'
}

/**
 * Supported image formats for project images
 */
export const SUPPORTED_IMAGE_FORMATS = ['.jpg', '.jpeg', '.png', '.webp', '.svg']

/**
 * Default placeholder images for different project types
 */
export const PLACEHOLDER_IMAGES = {
  fullstack: '/assets/images/placeholders/fullstack-placeholder.jpg',
  frontend: '/assets/images/placeholders/frontend-placeholder.jpg',
  backend: '/assets/images/placeholders/backend-placeholder.jpg',
  mobile: '/assets/images/placeholders/mobile-placeholder.jpg',
  default: '/assets/images/placeholders/project-placeholder.jpg'
}

/**
 * Validates image path format and structure
 * @param {string} imagePath - The image path to validate
 * @returns {Object} - Validation result with details
 */
export const validateImagePath = (imagePath) => {
  if (!imagePath || typeof imagePath !== 'string') {
    return {
      isValid: false,
      error: 'Image path must be a non-empty string',
      suggestion: 'Provide a valid image path string'
    }
  }

  // Check if path starts with expected directory
  const validPrefixes = Object.values(IMAGE_PATHS)
  const hasValidPrefix = validPrefixes.some(prefix => imagePath.startsWith(prefix))
  
  if (!hasValidPrefix) {
    return {
      isValid: false,
      error: 'Image path does not follow standard directory structure',
      suggestion: `Use one of these prefixes: ${validPrefixes.join(', ')}`
    }
  }

  // Check file extension
  const hasValidExtension = SUPPORTED_IMAGE_FORMATS.some(ext => 
    imagePath.toLowerCase().endsWith(ext)
  )
  
  if (!hasValidExtension) {
    return {
      isValid: false,
      error: 'Image path does not have a supported file extension',
      suggestion: `Use one of these extensions: ${SUPPORTED_IMAGE_FORMATS.join(', ')}`
    }
  }

  // Check for valid filename (no spaces, special characters except hyphens and underscores)
  const filename = imagePath.split('/').pop()
  const filenamePattern = /^[a-zA-Z0-9_-]+\.[a-zA-Z0-9]+$/
  
  if (!filenamePattern.test(filename)) {
    return {
      isValid: false,
      error: 'Filename contains invalid characters',
      suggestion: 'Use only letters, numbers, hyphens, and underscores in filenames'
    }
  }

  return {
    isValid: true,
    error: null,
    suggestion: null
  }
}

/**
 * Standardizes image path format
 * @param {string} imagePath - The image path to standardize
 * @param {string} projectId - The project ID for consistent naming
 * @param {string} imageType - Type of image ('thumbnail', 'gallery', 'hero')
 * @returns {string} - Standardized image path
 */
export const standardizeImagePath = (imagePath, projectId, imageType = 'gallery') => {
  if (!imagePath || !projectId) {
    return getPlaceholderImage()
  }

  // Extract filename and extension
  const filename = imagePath.split('/').pop()
  const extension = filename.split('.').pop()
  
  // Create standardized filename
  let standardizedFilename
  switch (imageType) {
    case 'thumbnail':
      standardizedFilename = `${projectId}-thumb.${extension}`
      return `${IMAGE_PATHS.projects}/${standardizedFilename}`
    case 'hero':
      standardizedFilename = `${projectId}-hero.${extension}`
      return `${IMAGE_PATHS.projects}/${standardizedFilename}`
    case 'gallery':
    default:
      // For gallery images, maintain original filename but ensure project prefix
      if (!filename.startsWith(projectId)) {
        standardizedFilename = `${projectId}-${filename}`
      } else {
        standardizedFilename = filename
      }
      return `${IMAGE_PATHS.projects}/${standardizedFilename}`
  }
}

/**
 * Generates consistent image paths for a project
 * @param {string} projectId - The project ID
 * @param {number} imageCount - Number of gallery images
 * @returns {Object} - Object with thumbnail and images array
 */
export const generateProjectImagePaths = (projectId, imageCount = 3) => {
  if (!projectId || typeof projectId !== 'string') {
    return {
      thumbnail: getPlaceholderImage(),
      images: [getPlaceholderImage()]
    }
  }

  const thumbnail = `${IMAGE_PATHS.projects}/${projectId}-thumb.jpg`
  const images = []
  
  for (let i = 1; i <= imageCount; i++) {
    images.push(`${IMAGE_PATHS.projects}/${projectId}-${i}.jpg`)
  }

  return {
    thumbnail,
    images
  }
}

/**
 * Gets appropriate placeholder image based on project category
 * @param {string} category - Project category ('fullstack', 'frontend', 'backend', 'mobile')
 * @returns {string} - Placeholder image path
 */
export const getPlaceholderImage = (category = 'default') => {
  return PLACEHOLDER_IMAGES[category] || PLACEHOLDER_IMAGES.default
}

/**
 * Creates fallback image system for missing images
 * @param {string} imagePath - Original image path
 * @param {string} category - Project category for appropriate placeholder
 * @returns {Object} - Image configuration with fallbacks
 */
export const createImageFallback = (imagePath, category = 'default') => {
  const placeholder = getPlaceholderImage(category)
  
  return {
    primary: imagePath || placeholder,
    fallback: placeholder,
    alt: `Project image - ${category} application`,
    loading: 'lazy',
    onError: `this.src='${placeholder}'`
  }
}

/**
 * Validates array of image paths
 * @param {Array} imagePaths - Array of image paths to validate
 * @returns {Object} - Validation result with details for each image
 */
export const validateImageArray = (imagePaths = []) => {
  if (!Array.isArray(imagePaths)) {
    return {
      isValid: false,
      error: 'Images must be provided as an array',
      validImages: [],
      invalidImages: []
    }
  }

  const validImages = []
  const invalidImages = []

  imagePaths.forEach((imagePath, index) => {
    const validation = validateImagePath(imagePath)
    
    if (validation.isValid) {
      validImages.push({
        index,
        path: imagePath,
        status: 'valid'
      })
    } else {
      invalidImages.push({
        index,
        path: imagePath,
        status: 'invalid',
        error: validation.error,
        suggestion: validation.suggestion
      })
    }
  })

  return {
    isValid: invalidImages.length === 0,
    error: invalidImages.length > 0 ? `${invalidImages.length} invalid image paths found` : null,
    validImages,
    invalidImages,
    totalImages: imagePaths.length
  }
}

/**
 * Handles missing thumbnail gracefully in UI
 * @param {string} thumbnailPath - Original thumbnail path
 * @param {string} projectTitle - Project title for alt text
 * @param {string} category - Project category
 * @returns {Object} - Thumbnail configuration with fallbacks
 */
export const handleMissingThumbnail = (thumbnailPath, projectTitle, category = 'default') => {
  const placeholder = getPlaceholderImage(category)
  
  return {
    src: thumbnailPath || placeholder,
    alt: `${projectTitle} - Project thumbnail`,
    fallbackSrc: placeholder,
    className: 'w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700',
    onError: function() {
      this.src = placeholder
      this.classList.add('placeholder-image')
    },
    loading: 'lazy'
  }
}

/**
 * Optimizes image loading for performance
 * @param {Array} imagePaths - Array of image paths
 * @param {boolean} preload - Whether to preload images
 * @returns {Object} - Optimized loading configuration
 */
export const optimizeImageLoading = (imagePaths = [], preload = false) => {
  const optimizedImages = imagePaths.map((imagePath, index) => ({
    src: imagePath,
    loading: index === 0 ? 'eager' : 'lazy', // Load first image immediately
    decoding: 'async',
    fetchpriority: index === 0 ? 'high' : 'auto'
  }))

  const preloadLinks = preload ? imagePaths.slice(0, 2).map(imagePath => ({
    rel: 'preload',
    as: 'image',
    href: imagePath
  })) : []

  return {
    optimizedImages,
    preloadLinks,
    totalImages: imagePaths.length
  }
}

/**
 * Creates responsive image configuration
 * @param {string} imagePath - Base image path
 * @param {Array} breakpoints - Array of breakpoint configurations
 * @returns {Object} - Responsive image configuration
 */
export const createResponsiveImage = (imagePath, breakpoints = []) => {
  if (!imagePath) {
    return {
      src: getPlaceholderImage(),
      srcSet: '',
      sizes: '100vw'
    }
  }

  // Default breakpoints if none provided
  const defaultBreakpoints = [
    { width: 320, suffix: '-mobile' },
    { width: 768, suffix: '-tablet' },
    { width: 1024, suffix: '-desktop' }
  ]

  const activeBreakpoints = breakpoints.length > 0 ? breakpoints : defaultBreakpoints
  
  // Generate srcSet
  const srcSet = activeBreakpoints.map(bp => {
    const responsiveImagePath = imagePath.replace(/(\.[^.]+)$/, `${bp.suffix}$1`)
    return `${responsiveImagePath} ${bp.width}w`
  }).join(', ')

  // Generate sizes attribute
  const sizes = activeBreakpoints.map((bp, index) => {
    if (index === activeBreakpoints.length - 1) {
      return `${bp.width}px`
    }
    return `(max-width: ${bp.width}px) ${bp.width}px`
  }).join(', ')

  return {
    src: imagePath, // Fallback for browsers that don't support srcSet
    srcSet,
    sizes,
    loading: 'lazy',
    decoding: 'async'
  }
}

/**
 * Validates image naming conventions
 * @param {string} projectId - Project ID
 * @param {Array} imagePaths - Array of image paths
 * @returns {Object} - Validation result with naming compliance
 */
export const validateImageNaming = (projectId, imagePaths = []) => {
  const issues = []
  const validPaths = []

  imagePaths.forEach((imagePath, index) => {
    const filename = imagePath.split('/').pop()
    
    // Check if filename starts with project ID
    if (!filename.startsWith(projectId)) {
      issues.push({
        index,
        path: imagePath,
        issue: 'Filename should start with project ID',
        suggestion: `Rename to ${projectId}-${filename}`
      })
    } else {
      validPaths.push({
        index,
        path: imagePath,
        status: 'compliant'
      })
    }
  })

  return {
    isCompliant: issues.length === 0,
    issues,
    validPaths,
    complianceRate: imagePaths.length > 0 ? Math.round((validPaths.length / imagePaths.length) * 100) : 100
  }
}

/**
 * Creates a placeholder image data URL
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {string} backgroundColor - Background color (hex)
 * @param {string} text - Text to display on placeholder
 * @returns {string} - Data URL for placeholder image
 */
export const createPlaceholder = (width = 400, height = 400, backgroundColor = '#0F172A', text = 'Image') => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  
  canvas.width = width
  canvas.height = height
  
  // Fill background
  ctx.fillStyle = backgroundColor
  ctx.fillRect(0, 0, width, height)
  
  // Add text
  ctx.fillStyle = '#ffffff'
  ctx.font = `${Math.min(width, height) / 10}px Arial`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, width / 2, height / 2)
  
  return canvas.toDataURL()
}

/**
 * Preloads an image and returns a promise
 * @param {string} src - Image source URL
 * @returns {Promise} - Promise that resolves when image loads
 */
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

/**
 * Checks if an image is accessible/loadable
 * @param {string} src - Image source URL
 * @returns {Promise<boolean>} - Promise that resolves to true if accessible
 */
export const isImageAccessible = async (src) => {
  try {
    await preloadImage(src)
    return true
  } catch (error) {
    return false
  }
}