// Comprehensive validation utilities for project data

/**
 * Validation error types for categorizing different kinds of validation failures
 */
export const ValidationErrorTypes = {
  REQUIRED_FIELD: 'REQUIRED_FIELD',
  INVALID_TYPE: 'INVALID_TYPE',
  INVALID_FORMAT: 'INVALID_FORMAT',
  INVALID_VALUE: 'INVALID_VALUE',
  DUPLICATE_VALUE: 'DUPLICATE_VALUE',
  ARRAY_VALIDATION: 'ARRAY_VALIDATION',
  OBJECT_VALIDATION: 'OBJECT_VALIDATION',
  URL_VALIDATION: 'URL_VALIDATION',
  IMAGE_VALIDATION: 'IMAGE_VALIDATION',
  BUSINESS_RULE: 'BUSINESS_RULE'
}

/**
 * Validation severity levels
 */
export const ValidationSeverity = {
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
}

/**
 * Create a structured validation error
 * @param {string} field - Field name that failed validation
 * @param {string} message - Human-readable error message
 * @param {string} type - Error type from ValidationErrorTypes
 * @param {string} severity - Error severity from ValidationSeverity
 * @param {*} value - The invalid value
 * @param {string} suggestion - Suggested fix for the error
 * @returns {Object} - Structured validation error
 */
export const createValidationError = (field, message, type, severity = ValidationSeverity.ERROR, value = null, suggestion = null) => {
  return {
    field,
    message,
    type,
    severity,
    value,
    suggestion,
    timestamp: new Date().toISOString()
  }
}

/**
 * Validation result structure
 * @param {boolean} isValid - Whether validation passed
 * @param {Array} errors - Array of validation errors
 * @param {Array} warnings - Array of validation warnings
 * @param {Object} summary - Validation summary statistics
 * @returns {Object} - Validation result
 */
export const createValidationResult = (isValid, errors = [], warnings = [], summary = {}) => {
  return {
    isValid,
    errors,
    warnings,
    summary: {
      totalIssues: errors.length + warnings.length,
      errorCount: errors.length,
      warningCount: warnings.length,
      ...summary
    },
    timestamp: new Date().toISOString()
  }
}

/**
 * Validate required fields
 * @param {Object} data - Data object to validate
 * @param {Array} requiredFields - Array of required field names
 * @returns {Array} - Array of validation errors
 */
export const validateRequiredFields = (data, requiredFields) => {
  const errors = []
  
  requiredFields.forEach(field => {
    if (!(field in data)) {
      errors.push(createValidationError(
        field,
        `Required field '${field}' is missing`,
        ValidationErrorTypes.REQUIRED_FIELD,
        ValidationSeverity.ERROR,
        undefined,
        `Add the '${field}' property to your data object`
      ))
    } else if (data[field] === null || data[field] === undefined || data[field] === '') {
      errors.push(createValidationError(
        field,
        `Required field '${field}' cannot be empty`,
        ValidationErrorTypes.REQUIRED_FIELD,
        ValidationSeverity.ERROR,
        data[field],
        `Provide a valid value for '${field}'`
      ))
    }
  })
  
  return errors
}

/**
 * Validate field types
 * @param {Object} data - Data object to validate
 * @param {Object} typeSchema - Schema defining expected types
 * @returns {Array} - Array of validation errors
 */
export const validateFieldTypes = (data, typeSchema) => {
  const errors = []
  
  Object.entries(typeSchema).forEach(([field, expectedType]) => {
    if (field in data && data[field] !== null && data[field] !== undefined) {
      const actualType = Array.isArray(data[field]) ? 'array' : typeof data[field]
      
      if (actualType !== expectedType) {
        errors.push(createValidationError(
          field,
          `Field '${field}' must be of type '${expectedType}', got '${actualType}'`,
          ValidationErrorTypes.INVALID_TYPE,
          ValidationSeverity.ERROR,
          data[field],
          `Convert '${field}' to ${expectedType} type`
        ))
      }
    }
  })
  
  return errors
}

/**
 * Validate string formats using regex patterns
 * @param {Object} data - Data object to validate
 * @param {Object} formatSchema - Schema defining format patterns
 * @returns {Array} - Array of validation errors
 */
export const validateStringFormats = (data, formatSchema) => {
  const errors = []
  
  Object.entries(formatSchema).forEach(([field, { pattern, message, suggestion }]) => {
    if (field in data && typeof data[field] === 'string') {
      if (!pattern.test(data[field])) {
        errors.push(createValidationError(
          field,
          message || `Field '${field}' has invalid format`,
          ValidationErrorTypes.INVALID_FORMAT,
          ValidationSeverity.ERROR,
          data[field],
          suggestion || `Ensure '${field}' matches the required format`
        ))
      }
    }
  })
  
  return errors
}

/**
 * Validate enum values
 * @param {Object} data - Data object to validate
 * @param {Object} enumSchema - Schema defining valid enum values
 * @returns {Array} - Array of validation errors
 */
export const validateEnumValues = (data, enumSchema) => {
  const errors = []
  
  Object.entries(enumSchema).forEach(([field, validValues]) => {
    if (field in data && data[field] !== null && data[field] !== undefined) {
      if (!validValues.includes(data[field])) {
        errors.push(createValidationError(
          field,
          `Field '${field}' must be one of: ${validValues.join(', ')}`,
          ValidationErrorTypes.INVALID_VALUE,
          ValidationSeverity.ERROR,
          data[field],
          `Use one of these valid values: ${validValues.join(', ')}`
        ))
      }
    }
  })
  
  return errors
}

/**
 * Validate URL formats
 * @param {Object} data - Data object to validate
 * @param {Array} urlFields - Array of field names that should contain URLs
 * @returns {Array} - Array of validation errors
 */
export const validateUrls = (data, urlFields) => {
  const errors = []
  const urlPattern = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/
  
  urlFields.forEach(field => {
    if (field in data && data[field] !== null && data[field] !== '') {
      if (typeof data[field] !== 'string') {
        errors.push(createValidationError(
          field,
          `URL field '${field}' must be a string`,
          ValidationErrorTypes.INVALID_TYPE,
          ValidationSeverity.ERROR,
          data[field],
          `Convert '${field}' to a string`
        ))
      } else if (!urlPattern.test(data[field])) {
        errors.push(createValidationError(
          field,
          `Field '${field}' must be a valid URL`,
          ValidationErrorTypes.URL_VALIDATION,
          ValidationSeverity.ERROR,
          data[field],
          `Ensure '${field}' starts with http:// or https:// and is a valid URL`
        ))
      }
    }
  })
  
  return errors
}

/**
 * Validate array fields
 * @param {Object} data - Data object to validate
 * @param {Object} arraySchema - Schema defining array validation rules
 * @returns {Array} - Array of validation errors
 */
export const validateArrayFields = (data, arraySchema) => {
  const errors = []
  
  Object.entries(arraySchema).forEach(([field, rules]) => {
    if (field in data) {
      if (!Array.isArray(data[field])) {
        errors.push(createValidationError(
          field,
          `Field '${field}' must be an array`,
          ValidationErrorTypes.INVALID_TYPE,
          ValidationSeverity.ERROR,
          data[field],
          `Convert '${field}' to an array`
        ))
        return
      }
      
      const array = data[field]
      
      // Check minimum length
      if (rules.minLength && array.length < rules.minLength) {
        errors.push(createValidationError(
          field,
          `Array '${field}' must have at least ${rules.minLength} items`,
          ValidationErrorTypes.ARRAY_VALIDATION,
          ValidationSeverity.ERROR,
          array.length,
          `Add more items to '${field}' array`
        ))
      }
      
      // Check maximum length
      if (rules.maxLength && array.length > rules.maxLength) {
        errors.push(createValidationError(
          field,
          `Array '${field}' cannot have more than ${rules.maxLength} items`,
          ValidationErrorTypes.ARRAY_VALIDATION,
          ValidationSeverity.WARNING,
          array.length,
          `Remove some items from '${field}' array`
        ))
      }
      
      // Check item types
      if (rules.itemType) {
        array.forEach((item, index) => {
          const actualType = typeof item
          if (actualType !== rules.itemType) {
            errors.push(createValidationError(
              `${field}[${index}]`,
              `Array item at index ${index} must be of type '${rules.itemType}', got '${actualType}'`,
              ValidationErrorTypes.ARRAY_VALIDATION,
              ValidationSeverity.ERROR,
              item,
              `Convert item at index ${index} to ${rules.itemType}`
            ))
          }
        })
      }
      
      // Check for duplicates
      if (rules.unique) {
        const duplicates = array.filter((item, index) => array.indexOf(item) !== index)
        if (duplicates.length > 0) {
          errors.push(createValidationError(
            field,
            `Array '${field}' contains duplicate values: ${duplicates.join(', ')}`,
            ValidationErrorTypes.DUPLICATE_VALUE,
            ValidationSeverity.WARNING,
            duplicates,
            `Remove duplicate values from '${field}' array`
          ))
        }
      }
    }
  })
  
  return errors
}

/**
 * Validate business rules
 * @param {Object} data - Data object to validate
 * @param {Array} businessRules - Array of business rule functions
 * @returns {Array} - Array of validation errors
 */
export const validateBusinessRules = (data, businessRules) => {
  const errors = []
  
  businessRules.forEach(rule => {
    try {
      const result = rule(data)
      if (result && !result.isValid) {
        errors.push(createValidationError(
          result.field || 'general',
          result.message,
          ValidationErrorTypes.BUSINESS_RULE,
          result.severity || ValidationSeverity.ERROR,
          result.value,
          result.suggestion
        ))
      }
    } catch (error) {
      errors.push(createValidationError(
        'general',
        `Business rule validation failed: ${error.message}`,
        ValidationErrorTypes.BUSINESS_RULE,
        ValidationSeverity.ERROR,
        null,
        'Check business rule implementation'
      ))
    }
  })
  
  return errors
}

/**
 * Comprehensive validation function
 * @param {Object} data - Data to validate
 * @param {Object} schema - Validation schema
 * @returns {Object} - Validation result
 */
export const validateData = (data, schema) => {
  const allErrors = []
  const allWarnings = []
  
  try {
    // Required fields validation
    if (schema.required) {
      const requiredErrors = validateRequiredFields(data, schema.required)
      allErrors.push(...requiredErrors)
    }
    
    // Type validation
    if (schema.types) {
      const typeErrors = validateFieldTypes(data, schema.types)
      allErrors.push(...typeErrors)
    }
    
    // Format validation
    if (schema.formats) {
      const formatErrors = validateStringFormats(data, schema.formats)
      allErrors.push(...formatErrors)
    }
    
    // Enum validation
    if (schema.enums) {
      const enumErrors = validateEnumValues(data, schema.enums)
      allErrors.push(...enumErrors)
    }
    
    // URL validation
    if (schema.urls) {
      const urlErrors = validateUrls(data, schema.urls)
      allErrors.push(...urlErrors)
    }
    
    // Array validation
    if (schema.arrays) {
      const arrayErrors = validateArrayFields(data, schema.arrays)
      allErrors.push(...arrayErrors.filter(e => e.severity === ValidationSeverity.ERROR))
      allWarnings.push(...arrayErrors.filter(e => e.severity === ValidationSeverity.WARNING))
    }
    
    // Business rules validation
    if (schema.businessRules) {
      const businessErrors = validateBusinessRules(data, schema.businessRules)
      allErrors.push(...businessErrors.filter(e => e.severity === ValidationSeverity.ERROR))
      allWarnings.push(...businessErrors.filter(e => e.severity === ValidationSeverity.WARNING))
    }
    
  } catch (error) {
    allErrors.push(createValidationError(
      'general',
      `Validation process failed: ${error.message}`,
      ValidationErrorTypes.BUSINESS_RULE,
      ValidationSeverity.ERROR,
      null,
      'Check validation schema and data structure'
    ))
  }
  
  return createValidationResult(
    allErrors.length === 0,
    allErrors,
    allWarnings,
    {
      fieldsValidated: Object.keys(data).length,
      schemaRules: Object.keys(schema).length
    }
  )
}

/**
 * Format validation errors for display
 * @param {Array} errors - Array of validation errors
 * @param {Object} options - Formatting options
 * @returns {Object} - Formatted error information
 */
export const formatValidationErrors = (errors, options = {}) => {
  const {
    groupByField = false,
    includeTimestamp = false,
    includeSuggestions = true,
    maxErrors = null
  } = options
  
  let processedErrors = errors
  
  if (maxErrors && errors.length > maxErrors) {
    processedErrors = errors.slice(0, maxErrors)
  }
  
  if (groupByField) {
    const groupedErrors = {}
    processedErrors.forEach(error => {
      if (!groupedErrors[error.field]) {
        groupedErrors[error.field] = []
      }
      groupedErrors[error.field].push(error)
    })
    
    return {
      grouped: groupedErrors,
      total: errors.length,
      displayed: processedErrors.length,
      hasMore: errors.length > processedErrors.length
    }
  }
  
  const formatted = processedErrors.map(error => {
    const formattedError = {
      field: error.field,
      message: error.message,
      type: error.type,
      severity: error.severity
    }
    
    if (includeSuggestions && error.suggestion) {
      formattedError.suggestion = error.suggestion
    }
    
    if (includeTimestamp && error.timestamp) {
      formattedError.timestamp = error.timestamp
    }
    
    return formattedError
  })
  
  return {
    errors: formatted,
    total: errors.length,
    displayed: processedErrors.length,
    hasMore: errors.length > processedErrors.length
  }
}

/**
 * Create validation checklist
 * @param {Object} validationResult - Result from validateData
 * @returns {Object} - Validation checklist
 */
export const createValidationChecklist = (validationResult) => {
  const checklist = {
    overall: validationResult.isValid ? 'PASS' : 'FAIL',
    items: [],
    summary: {
      passed: 0,
      failed: 0,
      warnings: 0
    }
  }
  
  // Group errors by type
  const errorsByType = {}
  validationResult.errors.forEach(error => {
    if (!errorsByType[error.type]) {
      errorsByType[error.type] = []
    }
    errorsByType[error.type].push(error)
  })
  
  // Create checklist items
  const checklistItems = [
    { type: ValidationErrorTypes.REQUIRED_FIELD, label: 'All required fields present' },
    { type: ValidationErrorTypes.INVALID_TYPE, label: 'Correct data types' },
    { type: ValidationErrorTypes.INVALID_FORMAT, label: 'Valid formats' },
    { type: ValidationErrorTypes.INVALID_VALUE, label: 'Valid enum values' },
    { type: ValidationErrorTypes.URL_VALIDATION, label: 'Valid URLs' },
    { type: ValidationErrorTypes.ARRAY_VALIDATION, label: 'Valid arrays' },
    { type: ValidationErrorTypes.BUSINESS_RULE, label: 'Business rules compliance' }
  ]
  
  checklistItems.forEach(item => {
    const hasErrors = errorsByType[item.type] && errorsByType[item.type].length > 0
    const status = hasErrors ? 'FAIL' : 'PASS'
    
    checklist.items.push({
      label: item.label,
      status,
      errorCount: hasErrors ? errorsByType[item.type].length : 0,
      errors: hasErrors ? errorsByType[item.type] : []
    })
    
    if (status === 'PASS') {
      checklist.summary.passed++
    } else {
      checklist.summary.failed++
    }
  })
  
  // Add warnings
  checklist.summary.warnings = validationResult.warnings.length
  
  return checklist
}

/**
 * Runtime validation for preventing display issues
 * @param {Object} data - Data to validate for runtime safety
 * @returns {Object} - Runtime validation result
 */
export const validateForRuntime = (data) => {
  const issues = []
  
  // Check for potential display issues
  if (data.title && data.title.length > 100) {
    issues.push({
      field: 'title',
      issue: 'Title may be too long for display',
      severity: ValidationSeverity.WARNING,
      suggestion: 'Consider shortening the title to under 100 characters'
    })
  }
  
  if (data.description && data.description.length > 500) {
    issues.push({
      field: 'description',
      issue: 'Description may be too long for card display',
      severity: ValidationSeverity.WARNING,
      suggestion: 'Consider shortening the description to under 500 characters'
    })
  }
  
  if (data.technologies && data.technologies.length > 10) {
    issues.push({
      field: 'technologies',
      issue: 'Too many technologies may clutter the display',
      severity: ValidationSeverity.WARNING,
      suggestion: 'Consider limiting to the most important technologies'
    })
  }
  
  // Check for missing critical display data
  if (!data.thumbnail && !data.images) {
    issues.push({
      field: 'images',
      issue: 'No images provided - will use placeholder',
      severity: ValidationSeverity.INFO,
      suggestion: 'Add project images for better visual presentation'
    })
  }
  
  return {
    isRuntimeSafe: issues.filter(i => i.severity === ValidationSeverity.ERROR).length === 0,
    issues,
    recommendations: issues.filter(i => i.severity === ValidationSeverity.WARNING)
  }
}

export default {
  ValidationErrorTypes,
  ValidationSeverity,
  createValidationError,
  createValidationResult,
  validateRequiredFields,
  validateFieldTypes,
  validateStringFormats,
  validateEnumValues,
  validateUrls,
  validateArrayFields,
  validateBusinessRules,
  validateData,
  formatValidationErrors,
  createValidationChecklist,
  validateForRuntime
}