/**
 * Enhanced Resume Download Utility
 * Handles resume downloads with better error handling and validation
 */

/**
 * Download resume with enhanced error handling
 * @param {string} resumeUrl - URL of the resume file
 * @param {string} filename - Desired filename for download
 * @returns {Promise<boolean>} - Success status
 */
export const downloadResume = async (resumeUrl, filename = 'Resume.pdf') => {
  try {
    // First, check if the file exists
    const response = await fetch(resumeUrl, { method: 'HEAD' });
    
    if (!response.ok) {
      console.error('Resume file not found:', response.status);
      throw new Error(`Resume file not found (${response.status})`);
    }

    // Check if it's actually a PDF
    const contentType = response.headers.get('content-type');
    if (contentType && !contentType.includes('application/pdf') && !contentType.includes('application/octet-stream')) {
      console.warn('File may not be a PDF:', contentType);
    }

    // Get the file size for validation
    const contentLength = response.headers.get('content-length');
    const fileSize = contentLength ? parseInt(contentLength, 10) : 0;
    
    if (fileSize < 1000) { // Less than 1KB is suspicious for a resume
      console.warn('Resume file seems too small:', fileSize, 'bytes');
    }

    // Create download link
    const link = document.createElement('a');
    link.href = resumeUrl;
    link.download = filename;
    link.style.display = 'none';
    
    // Add to DOM, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Track the download
    console.log('Resume download initiated:', filename);
    
    // Optional: Track with analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'file_download', {
        file_name: filename,
        file_extension: 'pdf',
        source: 'resume_button'
      });
    }

    return true;

  } catch (error) {
    console.error('Resume download failed:', error);
    
    // Fallback: try to open in new tab
    try {
      window.open(resumeUrl, '_blank');
      console.log('Opened resume in new tab as fallback');
      return true;
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
      
      // Last resort: show user the direct link
      alert(`Unable to download resume automatically. Please visit: ${resumeUrl}`);
      return false;
    }
  }
};

/**
 * Validate resume file before download
 * @param {string} resumeUrl - URL to validate
 * @returns {Promise<Object>} - Validation result
 */
export const validateResumeFile = async (resumeUrl) => {
  try {
    const response = await fetch(resumeUrl, { method: 'HEAD' });
    
    const result = {
      exists: response.ok,
      status: response.status,
      contentType: response.headers.get('content-type'),
      contentLength: response.headers.get('content-length'),
      lastModified: response.headers.get('last-modified'),
      isValid: false,
      errors: []
    };

    if (!response.ok) {
      result.errors.push(`File not found (HTTP ${response.status})`);
      return result;
    }

    const fileSize = result.contentLength ? parseInt(result.contentLength, 10) : 0;
    
    // Validate file size
    if (fileSize < 1000) {
      result.errors.push('File size too small (likely corrupted)');
    } else if (fileSize > 10 * 1024 * 1024) { // 10MB
      result.errors.push('File size too large for a resume');
    }

    // Validate content type
    const contentType = result.contentType || '';
    if (!contentType.includes('application/pdf') && 
        !contentType.includes('application/octet-stream') &&
        !contentType.includes('binary/octet-stream')) {
      result.errors.push(`Unexpected content type: ${contentType}`);
    }

    result.isValid = result.errors.length === 0;
    return result;

  } catch (error) {
    return {
      exists: false,
      isValid: false,
      errors: [`Validation failed: ${error.message}`]
    };
  }
};

/**
 * Get resume file info
 * @param {string} resumeUrl - URL to check
 * @returns {Promise<Object>} - File information
 */
export const getResumeInfo = async (resumeUrl) => {
  try {
    const validation = await validateResumeFile(resumeUrl);
    
    if (!validation.isValid) {
      return {
        ...validation,
        sizeFormatted: 'Unknown',
        lastModifiedFormatted: 'Unknown'
      };
    }

    const fileSize = validation.contentLength ? parseInt(validation.contentLength, 10) : 0;
    const lastModified = validation.lastModified ? new Date(validation.lastModified) : null;

    return {
      ...validation,
      sizeFormatted: formatFileSize(fileSize),
      lastModifiedFormatted: lastModified ? lastModified.toLocaleDateString() : 'Unknown'
    };

  } catch (error) {
    return {
      exists: false,
      isValid: false,
      errors: [`Failed to get file info: ${error.message}`],
      sizeFormatted: 'Unknown',
      lastModifiedFormatted: 'Unknown'
    };
  }
};

/**
 * Format file size in human readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted size
 */
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Test resume download functionality
 * @param {string} resumeUrl - URL to test
 * @returns {Promise<Object>} - Test results
 */
export const testResumeDownload = async (resumeUrl) => {
  console.log('Testing resume download:', resumeUrl);
  
  const validation = await validateResumeFile(resumeUrl);
  const info = await getResumeInfo(resumeUrl);
  
  const testResult = {
    url: resumeUrl,
    validation,
    info,
    recommendations: []
  };

  // Generate recommendations
  if (!validation.isValid) {
    testResult.recommendations.push('Fix file accessibility issues');
  }
  
  if (validation.errors.length > 0) {
    testResult.recommendations.push('Address validation errors');
  }
  
  const fileSize = info.contentLength ? parseInt(info.contentLength, 10) : 0;
  if (fileSize < 50000) { // Less than 50KB
    testResult.recommendations.push('Consider if resume file is complete');
  }

  console.log('Resume download test results:', testResult);
  return testResult;
};