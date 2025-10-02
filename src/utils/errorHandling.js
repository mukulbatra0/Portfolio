// Error handling utilities for UI components and project management

/**
 * Error types for different scenarios
 */
export const ErrorTypes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  IMAGE_LOAD_ERROR: 'IMAGE_LOAD_ERROR',
  COMPONENT_ERROR: 'COMPONENT_ERROR',
  DATA_ERROR: 'DATA_ERROR',
  PERMISSION_ERROR: 'PERMISSION_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
}

/**
 * Error severity levels
 */
export const ErrorSeverity = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
}

/**
 * Create a structured error object
 * @param {string} type - Error type from ErrorTypes
 * @param {string} message - Human-readable error message
 * @param {string} severity - Error severity from ErrorSeverity
 * @param {Object} context - Additional context about the error
 * @param {Error} originalError - Original error object if available
 * @returns {Object} - Structured error object
 */
export const createError = (type, message, severity = ErrorSeverity.MEDIUM, context = {}, originalError = null) => {
  return {
    id: generateErrorId(),
    type,
    message,
    severity,
    context,
    originalError,
    timestamp: new Date().toISOString(),
    stack: originalError?.stack || new Error().stack
  }
}

/**
 * Generate unique error ID
 * @returns {string} - Unique error identifier
 */
const generateErrorId = () => {
  return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Error boundary handler for React components
 * @param {Error} error - Error that occurred
 * @param {Object} errorInfo - Error info from React
 * @param {Object} context - Additional context
 * @returns {Object} - Structured error for logging
 */
export const handleComponentError = (error, errorInfo, context = {}) => {
  const structuredError = createError(
    ErrorTypes.COMPONENT_ERROR,
    `Component error: ${error.message}`,
    ErrorSeverity.HIGH,
    {
      componentStack: errorInfo.componentStack,
      ...context
    },
    error
  )
  
  // Log error (in production, this would go to a logging service)
  console.error('Component Error:', structuredError)
  
  return structuredError
}

/**
 * Handle project validation errors
 * @param {Object} validationResult - Result from project validation
 * @param {Object} context - Additional context
 * @returns {Object} - Structured error response
 */
export const handleValidationError = (validationResult, context = {}) => {
  if (validationResult.isValid) {
    return { hasError: false, error: null }
  }
  
  const error = createError(
    ErrorTypes.VALIDATION_ERROR,
    `Project validation failed with ${validationResult.errorCount} errors`,
    validationResult.errorCount > 5 ? ErrorSeverity.HIGH : ErrorSeverity.MEDIUM,
    {
      errorCount: validationResult.errorCount,
      warningCount: validationResult.warningCount,
      errors: validationResult.errors,
      warnings: validationResult.warnings,
      ...context
    }
  )
  
  return { hasError: true, error }
}

/**
 * Handle image loading errors
 * @param {string} imagePath - Path of the image that failed to load
 * @param {Object} context - Additional context
 * @returns {Object} - Error handling result
 */
export const handleImageError = (imagePath, context = {}) => {
  const error = createError(
    ErrorTypes.IMAGE_LOAD_ERROR,
    `Failed to load image: ${imagePath}`,
    ErrorSeverity.LOW,
    {
      imagePath,
      ...context
    }
  )
  
  // Return fallback image configuration
  return {
    hasError: true,
    error,
    fallback: {
      src: '/assets/images/placeholders/project-placeholder.jpg',
      alt: 'Project image placeholder',
      className: 'placeholder-image'
    }
  }
}

/**
 * Handle network/API errors
 * @param {Error} error - Network error
 * @param {Object} context - Request context
 * @returns {Object} - Structured error response
 */
export const handleNetworkError = (error, context = {}) => {
  let severity = ErrorSeverity.MEDIUM
  let message = 'Network request failed'
  
  if (error.code === 'NETWORK_ERROR') {
    severity = ErrorSeverity.HIGH
    message = 'Network connection failed'
  } else if (error.status >= 500) {
    severity = ErrorSeverity.HIGH
    message = 'Server error occurred'
  } else if (error.status >= 400) {
    severity = ErrorSeverity.MEDIUM
    message = 'Request failed'
  }
  
  const structuredError = createError(
    ErrorTypes.NETWORK_ERROR,
    message,
    severity,
    {
      status: error.status,
      statusText: error.statusText,
      url: context.url,
      method: context.method,
      ...context
    },
    error
  )
  
  return { hasError: true, error: structuredError }
}

/**
 * Handle data processing errors
 * @param {Error} error - Data processing error
 * @param {Object} context - Data context
 * @returns {Object} - Structured error response
 */
export const handleDataError = (error, context = {}) => {
  const structuredError = createError(
    ErrorTypes.DATA_ERROR,
    `Data processing error: ${error.message}`,
    ErrorSeverity.MEDIUM,
    {
      dataType: context.dataType,
      operation: context.operation,
      ...context
    },
    error
  )
  
  return { hasError: true, error: structuredError }
}

/**
 * Error recovery strategies
 */
export const ErrorRecovery = {
  /**
   * Retry operation with exponential backoff
   * @param {Function} operation - Operation to retry
   * @param {number} maxRetries - Maximum number of retries
   * @param {number} baseDelay - Base delay in milliseconds
   * @returns {Promise} - Promise that resolves with operation result
   */
  async retryWithBackoff(operation, maxRetries = 3, baseDelay = 1000) {
    let lastError
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation()
      } catch (error) {
        lastError = error
        
        if (attempt === maxRetries) {
          throw createError(
            ErrorTypes.UNKNOWN_ERROR,
            `Operation failed after ${maxRetries + 1} attempts`,
            ErrorSeverity.HIGH,
            { attempts: maxRetries + 1, lastError: error.message },
            error
          )
        }
        
        // Exponential backoff
        const delay = baseDelay * Math.pow(2, attempt)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  },
  
  /**
   * Graceful degradation for missing data
   * @param {*} data - Data to check
   * @param {*} fallback - Fallback value
   * @param {Object} context - Context for logging
   * @returns {*} - Data or fallback
   */
  gracefulDegrade(data, fallback, context = {}) {
    if (data === null || data === undefined || data === '') {
      console.warn('Graceful degradation applied:', context)
      return fallback
    }
    return data
  },
  
  /**
   * Safe array access with fallback
   * @param {Array} array - Array to access
   * @param {number} index - Index to access
   * @param {*} fallback - Fallback value
   * @returns {*} - Array item or fallback
   */
  safeArrayAccess(array, index, fallback = null) {
    if (!Array.isArray(array) || index < 0 || index >= array.length) {
      return fallback
    }
    return array[index]
  },
  
  /**
   * Safe object property access
   * @param {Object} obj - Object to access
   * @param {string} path - Property path (e.g., 'user.profile.name')
   * @param {*} fallback - Fallback value
   * @returns {*} - Property value or fallback
   */
  safePropertyAccess(obj, path, fallback = null) {
    try {
      return path.split('.').reduce((current, prop) => current?.[prop], obj) ?? fallback
    } catch (error) {
      return fallback
    }
  }
}

/**
 * Error logging utility
 */
export const ErrorLogger = {
  /**
   * Log error to console (development) or external service (production)
   * @param {Object} error - Structured error object
   * @param {Object} context - Additional context
   */
  log(error, context = {}) {
    const logEntry = {
      ...error,
      context: { ...error.context, ...context },
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      url: typeof window !== 'undefined' ? window.location.href : 'unknown'
    }
    
    // In development, log to console
    if (process.env.NODE_ENV === 'development') {
      console.group(`🚨 ${error.type}: ${error.message}`)
      console.error('Error Details:', logEntry)
      if (error.originalError) {
        console.error('Original Error:', error.originalError)
      }
      console.groupEnd()
    } else {
      // In production, send to logging service
      this.sendToLoggingService(logEntry)
    }
  },
  
  /**
   * Send error to external logging service
   * @param {Object} logEntry - Log entry to send
   */
  sendToLoggingService(logEntry) {
    // This would integrate with services like Sentry, LogRocket, etc.
    // For now, just log to console
    console.error('Production Error:', logEntry)
  },
  
  /**
   * Log performance issues
   * @param {string} operation - Operation name
   * @param {number} duration - Duration in milliseconds
   * @param {Object} context - Additional context
   */
  logPerformance(operation, duration, context = {}) {
    if (duration > 1000) { // Log operations taking more than 1 second
      const performanceIssue = createError(
        ErrorTypes.TIMEOUT_ERROR,
        `Slow operation detected: ${operation} took ${duration}ms`,
        duration > 5000 ? ErrorSeverity.HIGH : ErrorSeverity.MEDIUM,
        { operation, duration, ...context }
      )
      
      this.log(performanceIssue)
    }
  }
}

/**
 * User-friendly error messages
 */
export const UserMessages = {
  [ErrorTypes.VALIDATION_ERROR]: {
    title: 'Validation Error',
    message: 'Please check your project data and fix the highlighted issues.',
    action: 'Review and Fix'
  },
  [ErrorTypes.NETWORK_ERROR]: {
    title: 'Connection Error',
    message: 'Unable to connect to the server. Please check your internet connection.',
    action: 'Retry'
  },
  [ErrorTypes.IMAGE_LOAD_ERROR]: {
    title: 'Image Load Error',
    message: 'Some images could not be loaded. Using placeholder images instead.',
    action: 'Continue'
  },
  [ErrorTypes.COMPONENT_ERROR]: {
    title: 'Display Error',
    message: 'There was an issue displaying this content. Please refresh the page.',
    action: 'Refresh'
  },
  [ErrorTypes.DATA_ERROR]: {
    title: 'Data Error',
    message: 'There was an issue processing the data. Please try again.',
    action: 'Retry'
  },
  [ErrorTypes.UNKNOWN_ERROR]: {
    title: 'Unexpected Error',
    message: 'An unexpected error occurred. Please try again or contact support.',
    action: 'Retry'
  }
}

/**
 * Get user-friendly error message
 * @param {Object} error - Structured error object
 * @returns {Object} - User-friendly message
 */
export const getUserMessage = (error) => {
  const defaultMessage = UserMessages[ErrorTypes.UNKNOWN_ERROR]
  return UserMessages[error.type] || defaultMessage
}

/**
 * Error boundary component helper
 * @param {Object} error - Error object
 * @param {Function} onRetry - Retry function
 * @returns {Object} - Error boundary props
 */
export const createErrorBoundaryProps = (error, onRetry = null) => {
  const userMessage = getUserMessage(error)
  
  return {
    hasError: true,
    error,
    title: userMessage.title,
    message: userMessage.message,
    actionLabel: userMessage.action,
    onAction: onRetry,
    canRetry: onRetry !== null,
    severity: error.severity
  }
}

export default {
  ErrorTypes,
  ErrorSeverity,
  createError,
  handleComponentError,
  handleValidationError,
  handleImageError,
  handleNetworkError,
  handleDataError,
  ErrorRecovery,
  ErrorLogger,
  UserMessages,
  getUserMessage,
  createErrorBoundaryProps
}