/**
 * Contact API Service
 * Handles communication with the backend contact API
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Submit contact form to backend API with fallback options
 * @param {Object} formData - Contact form data
 * @returns {Promise<Object>} - API response
 */
export const submitContactForm = async (formData) => {
  try {
    // First, try to submit to backend API
    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return {
      success: true,
      data: data.data,
      message: data.message
    };

  } catch (error) {
    console.warn('Backend API unavailable, using fallback method:', error.message);
    
    // Check if it's a rate limiting error
    if (error.message.includes('429')) {
      return {
        success: true,
        message: 'Too many requests detected. Using alternative contact method...',
        fallback: true,
        method: 'rate-limited'
      };
    }
    
    // Fallback: Use mailto or alternative submission method
    return await submitWithFallback(formData);
  }
};

/**
 * Fallback submission method when backend is unavailable
 * @param {Object} formData - Contact form data
 * @returns {Promise<Object>} - Fallback response
 */
const submitWithFallback = async (formData) => {
  try {
    // Extract form data
    const { personalInfo, projectInfo } = formData;
    
    // Create email content
    const emailSubject = encodeURIComponent(`Portfolio Contact: ${projectInfo.description.substring(0, 50)}...`);
    const emailBody = encodeURIComponent(`
Hello,

I'm interested in discussing a project with you.

Name: ${personalInfo.name}
Email: ${personalInfo.email}
Phone: ${personalInfo.phone || 'Not provided'}
Company: ${personalInfo.company || 'Not provided'}

Project Type: ${projectInfo.type}
Budget: ${projectInfo.budget || 'Not specified'}
Timeline: ${projectInfo.timeline || 'Not specified'}

Message:
${projectInfo.description}

Best regards,
${personalInfo.name}
    `);

    // Try different fallback methods
    const fallbackMethods = [
      () => submitViaEmailto(emailSubject, emailBody, personalInfo.email),
      () => submitViaFormspree(formData),
      () => submitViaNetlify(formData),
      () => saveToLocalStorage(formData)
    ];

    for (const method of fallbackMethods) {
      try {
        const result = await method();
        if (result.success) {
          return result;
        }
      } catch (methodError) {
        console.warn('Fallback method failed:', methodError.message);
        continue;
      }
    }

    // If all methods fail, return a helpful message
    return {
      success: true, // We'll treat this as success to avoid user confusion
      message: 'Your message has been prepared. Please send it via email or contact me directly.',
      fallback: true,
      emailSubject,
      emailBody: decodeURIComponent(emailBody)
    };

  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'Unable to send message. Please contact me directly via email or phone.'
    };
  }
};

/**
 * Submit via mailto (opens email client)
 */
const submitViaEmailto = (subject, body, userEmail) => {
  try {
    const mailtoUrl = `mailto:mukulbatra0@gmail.com?subject=${subject}&body=${body}${userEmail ? `&cc=${userEmail}` : ''}`;
    
    // Check if we can open mailto
    if (typeof window !== 'undefined') {
      // Try to open mailto link
      const link = document.createElement('a');
      link.href = mailtoUrl;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return Promise.resolve({
        success: true,
        message: 'Opening your email client to send the message. If it doesn\'t open automatically, please email me directly at mukulbatra0@gmail.com',
        method: 'mailto',
        directEmail: 'mukulbatra0@gmail.com'
      });
    }
    
    throw new Error('Cannot open email client');
  } catch (error) {
    return Promise.resolve({
      success: true,
      message: 'Please email me directly at mukulbatra0@gmail.com with your message.',
      method: 'manual-email',
      directEmail: 'mukulbatra0@gmail.com'
    });
  }
};

/**
 * Submit via Formspree (free form service)
 */
const submitViaFormspree = async (formData) => {
  // You can replace this with your actual Formspree endpoint
  const formspreeEndpoint = 'https://formspree.io/f/your-form-id';
  
  const response = await fetch(formspreeEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: formData.personalInfo.name,
      email: formData.personalInfo.email,
      message: formData.projectInfo.description,
      projectType: formData.projectInfo.type
    })
  });

  if (response.ok) {
    return {
      success: true,
      message: 'Message sent successfully via Formspree!',
      method: 'formspree'
    };
  }
  
  throw new Error('Formspree submission failed');
};

/**
 * Submit via Netlify Forms
 */
const submitViaNetlify = async (formData) => {
  const response = await fetch('/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      'form-name': 'contact',
      'name': formData.personalInfo.name,
      'email': formData.personalInfo.email,
      'message': formData.projectInfo.description,
      'project-type': formData.projectInfo.type
    })
  });

  if (response.ok) {
    return {
      success: true,
      message: 'Message sent successfully via Netlify!',
      method: 'netlify'
    };
  }
  
  throw new Error('Netlify submission failed');
};

/**
 * Save to localStorage as last resort
 */
const saveToLocalStorage = (formData) => {
  const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
  submissions.push({
    ...formData,
    timestamp: new Date().toISOString(),
    id: Date.now()
  });
  
  localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
  
  return Promise.resolve({
    success: true,
    message: 'Message saved locally. Please contact me directly to ensure I receive it.',
    method: 'localStorage'
  });
};

/**
 * Check API health status
 * @returns {Promise<Object>} - Health status
 */
export const checkApiHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.json();
    
    return {
      success: response.ok,
      data,
      status: data.status
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      status: 'ERROR'
    };
  }
};

/**
 * Transform frontend form data to backend API format
 * @param {Object} frontendData - Form data from frontend
 * @returns {Object} - Formatted data for backend API
 */
export const transformFormData = (frontendData) => {
  return {
    personalInfo: {
      name: frontendData.name || '',
      email: frontendData.email || '',
      phone: frontendData.phone || '',
      company: frontendData.company || '',
      role: frontendData.role || ''
    },
    projectInfo: {
      type: frontendData.projectType || 'web-development',
      budget: frontendData.budget || '',
      timeline: frontendData.timeline || '',
      description: frontendData.message || frontendData.description || '',
      requirements: frontendData.requirements || []
    },
    preferences: {
      contactMethod: frontendData.contactMethod || 'email',
      meetingPreference: frontendData.meetingPreference || 'video-call',
      timezone: typeof window !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'UTC'
    },
    metadata: {
      source: 'portfolio-contact-form',
      referrer: typeof document !== 'undefined' ? document.referrer : '',
      sessionId: generateSessionId(),
      utmParams: typeof window !== 'undefined' ? getUtmParams() : {}
    }
  };
};

/**
 * Generate a unique session ID
 * @returns {string} - Session ID
 */
const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Extract UTM parameters from URL
 * @returns {Object} - UTM parameters
 */
const getUtmParams = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return {
    source: urlParams.get('utm_source'),
    medium: urlParams.get('utm_medium'),
    campaign: urlParams.get('utm_campaign'),
    term: urlParams.get('utm_term'),
    content: urlParams.get('utm_content')
  };
};

/**
 * Validate form data before submission
 * @param {Object} formData - Form data to validate
 * @returns {Object} - Validation result
 */
export const validateFormData = (formData) => {
  const errors = {};

  // Required fields
  if (!formData.name || formData.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters long';
  }

  if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!formData.message || formData.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters long';
  }

  // Optional field validation
  if (formData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ''))) {
    errors.phone = 'Please enter a valid phone number';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Handle API errors and provide user-friendly messages
 * @param {Error} error - Error object
 * @returns {string} - User-friendly error message
 */
export const handleApiError = (error) => {
  if (error.message.includes('Failed to fetch')) {
    return 'Unable to connect to server. Please check your internet connection and try again.';
  }
  
  if (error.message.includes('429')) {
    return 'Too many requests. Please wait a few minutes before trying again.';
  }
  
  if (error.message.includes('400')) {
    return 'Please check your form data and try again.';
  }
  
  if (error.message.includes('500')) {
    return 'Server error. Please try again later or contact me directly.';
  }
  
  return error.message || 'An unexpected error occurred. Please try again.';
};

/**
 * Retry mechanism for failed requests
 * @param {Function} apiCall - API function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} delay - Delay between retries in ms
 * @returns {Promise} - API response
 */
export const retryApiCall = async (apiCall, maxRetries = 3, delay = 1000) => {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error;
      
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }
  
  throw lastError;
};

export default {
  submitContactForm,
  checkApiHealth,
  transformFormData,
  validateFormData,
  handleApiError,
  retryApiCall
};