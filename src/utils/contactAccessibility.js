/**
 * Contact Accessibility Utilities
 * Provides accessibility helpers and utilities for the enhanced contact section
 */

// ARIA role definitions for contact components
export const ARIA_ROLES = {
  CONTACT_CARD: 'button',
  CONTACT_FORM: 'form',
  FORM_SECTION: 'group',
  CHAT_WIDGET: 'dialog',
  CHAT_LOG: 'log',
  SCHEDULING_CALENDAR: 'grid',
  TIME_SLOT: 'gridcell',
  STATUS_INDICATOR: 'status',
  PROGRESS_BAR: 'progressbar',
  ALERT: 'alert',
  LIVE_REGION: 'region'
};

// Common ARIA labels for contact section
export const ARIA_LABELS = {
  CONTACT_SECTION: 'Contact information and communication options',
  EMAIL_CONTACT: 'Send email to start a conversation',
  PHONE_CONTACT: 'Call for immediate assistance',
  LOCATION_INFO: 'View location and availability information',
  CONTACT_FORM: 'Contact form to send a detailed message',
  CHAT_TOGGLE: 'Open live chat for quick questions',
  SCHEDULE_MEETING: 'Schedule a meeting or consultation',
  SOCIAL_LINKS: 'Connect on social media platforms',
  AVAILABILITY_STATUS: 'Current availability status',
  RESPONSE_TIME: 'Expected response time information',
  FORM_PROGRESS: 'Form completion progress',
  FILE_UPLOAD: 'Upload files or attachments',
  SUBMIT_FORM: 'Submit contact form',
  CLOSE_MODAL: 'Close dialog or modal',
  NEXT_STEP: 'Continue to next step',
  PREVIOUS_STEP: 'Return to previous step'
};

// Screen reader announcements
export const ANNOUNCEMENTS = {
  FORM_STARTED: 'Contact form started. Fill out your information to get in touch.',
  FORM_STEP_COMPLETED: (step, total) => `Step ${step} of ${total} completed.`,
  FORM_SUBMITTED: 'Contact form submitted successfully. You will receive a response within 24 hours.',
  FORM_ERROR: 'There are errors in the form. Please review and correct them.',
  CHAT_OPENED: 'Live chat opened. Type your message and press Enter to send.',
  CHAT_CLOSED: 'Live chat closed.',
  MESSAGE_SENT: 'Message sent.',
  MESSAGE_RECEIVED: 'New message received.',
  MEETING_SCHEDULED: 'Meeting scheduled successfully. You will receive a confirmation email.',
  FILE_UPLOADED: (filename) => `File ${filename} uploaded successfully.`,
  AVAILABILITY_CHANGED: (status) => `Availability status changed to ${status}.`,
  CONTACT_METHOD_SELECTED: (method) => `${method} contact method selected.`,
  VALIDATION_ERROR: (field, error) => `Error in ${field}: ${error}`,
  LOADING_START: 'Loading, please wait.',
  LOADING_COMPLETE: 'Loading complete.'
};

// Keyboard navigation constants
export const KEYBOARD_KEYS = {
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
  TAB: 'Tab',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End',
  PAGE_UP: 'PageUp',
  PAGE_DOWN: 'PageDown'
};

/**
 * Creates accessible form field attributes
 */
export const createFormFieldAttributes = (field) => {
  const {
    id,
    name,
    label,
    required = false,
    invalid = false,
    errorMessage = '',
    description = '',
    type = 'text'
  } = field;

  const attributes = {
    id: id || `contact-field-${name}`,
    name,
    'aria-label': label,
    'aria-required': required,
    'aria-invalid': invalid
  };

  // Add describedby for error messages and descriptions
  const describedByIds = [];
  
  if (description) {
    const descriptionId = `${attributes.id}-description`;
    describedByIds.push(descriptionId);
  }
  
  if (invalid && errorMessage) {
    const errorId = `${attributes.id}-error`;
    describedByIds.push(errorId);
  }
  
  if (describedByIds.length > 0) {
    attributes['aria-describedby'] = describedByIds.join(' ');
  }

  // Add specific attributes based on field type
  switch (type) {
    case 'email':
      attributes.type = 'email';
      attributes.autocomplete = 'email';
      attributes.inputMode = 'email';
      break;
    case 'tel':
      attributes.type = 'tel';
      attributes.autocomplete = 'tel';
      attributes.inputMode = 'tel';
      break;
    case 'url':
      attributes.type = 'url';
      attributes.inputMode = 'url';
      break;
    case 'number':
      attributes.type = 'number';
      attributes.inputMode = 'numeric';
      break;
    default:
      attributes.type = 'text';
  }

  return attributes;
};

/**
 * Creates accessible button attributes
 */
export const createButtonAttributes = (button) => {
  const {
    id,
    label,
    description = '',
    pressed = null,
    expanded = null,
    disabled = false,
    loading = false,
    type = 'button'
  } = button;

  const attributes = {
    id: id || `contact-button-${Date.now()}`,
    type,
    'aria-label': label,
    disabled: disabled || loading
  };

  if (description) {
    const descriptionId = `${attributes.id}-description`;
    attributes['aria-describedby'] = descriptionId;
  }

  if (pressed !== null) {
    attributes['aria-pressed'] = pressed;
  }

  if (expanded !== null) {
    attributes['aria-expanded'] = expanded;
  }

  if (loading) {
    attributes['aria-busy'] = true;
  }

  return attributes;
};

/**
 * Creates accessible modal/dialog attributes
 */
export const createModalAttributes = (modal) => {
  const {
    id,
    title,
    description = '',
    labelledBy = '',
    modal: isModal = true
  } = modal;

  const attributes = {
    id: id || `contact-modal-${Date.now()}`,
    role: 'dialog',
    'aria-modal': isModal,
    tabIndex: -1
  };

  if (title && !labelledBy) {
    const titleId = `${attributes.id}-title`;
    attributes['aria-labelledby'] = titleId;
  } else if (labelledBy) {
    attributes['aria-labelledby'] = labelledBy;
  }

  if (description) {
    const descriptionId = `${attributes.id}-description`;
    attributes['aria-describedby'] = descriptionId;
  }

  return attributes;
};

/**
 * Creates accessible live region for announcements
 */
export const createLiveRegion = (priority = 'polite') => {
  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('aria-live', priority);
  liveRegion.setAttribute('aria-atomic', 'true');
  liveRegion.className = 'sr-only';
  liveRegion.style.cssText = `
    position: absolute !important;
    width: 1px !important;
    height: 1px !important;
    padding: 0 !important;
    margin: -1px !important;
    overflow: hidden !important;
    clip: rect(0, 0, 0, 0) !important;
    white-space: nowrap !important;
    border: 0 !important;
  `;
  
  return liveRegion;
};

/**
 * Announces message to screen readers
 */
export const announceToScreenReader = (message, priority = 'polite') => {
  if (!message) return;

  let liveRegion = document.getElementById('contact-live-region');
  
  if (!liveRegion) {
    liveRegion = createLiveRegion(priority);
    liveRegion.id = 'contact-live-region';
    document.body.appendChild(liveRegion);
  }

  // Clear previous message
  liveRegion.textContent = '';
  
  // Set new message after a brief delay to ensure screen readers pick it up
  setTimeout(() => {
    liveRegion.textContent = message;
  }, 100);

  // Clear message after 5 seconds
  setTimeout(() => {
    if (liveRegion.textContent === message) {
      liveRegion.textContent = '';
    }
  }, 5000);
};

/**
 * Manages focus for keyboard navigation
 */
export const manageFocus = {
  // Store focus history
  history: [],

  // Save current focus
  save() {
    if (document.activeElement && document.activeElement !== document.body) {
      this.history.push(document.activeElement);
      // Keep only last 10 focus states
      if (this.history.length > 10) {
        this.history.shift();
      }
    }
  },

  // Restore previous focus
  restore() {
    const previousElement = this.history.pop();
    if (previousElement && document.contains(previousElement)) {
      previousElement.focus();
      return true;
    }
    return false;
  },

  // Focus element with options
  set(element, options = {}) {
    if (!element) return false;

    const { preventScroll = false, saveHistory = true } = options;

    if (saveHistory) {
      this.save();
    }

    element.focus({ preventScroll });
    return true;
  },

  // Create focus trap for modals
  trap(container) {
    if (!container) return null;

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return null;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);

    // Focus first element
    firstElement.focus();

    // Return cleanup function
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }
};

/**
 * Validates color contrast for accessibility
 */
export const validateColorContrast = (foreground, background) => {
  // Convert hex to RGB
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  // Calculate relative luminance
  const getLuminance = (rgb) => {
    const { r, g, b } = rgb;
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const fgRgb = hexToRgb(foreground);
  const bgRgb = hexToRgb(background);

  if (!fgRgb || !bgRgb) return null;

  const fgLuminance = getLuminance(fgRgb);
  const bgLuminance = getLuminance(bgRgb);

  const contrast = (Math.max(fgLuminance, bgLuminance) + 0.05) / 
                  (Math.min(fgLuminance, bgLuminance) + 0.05);

  return {
    ratio: contrast,
    aa: contrast >= 4.5,
    aaa: contrast >= 7,
    aaLarge: contrast >= 3,
    aaaLarge: contrast >= 4.5
  };
};

/**
 * Checks if user prefers reduced motion
 */
export const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Checks if user prefers high contrast
 */
export const prefersHighContrast = () => {
  return window.matchMedia('(prefers-contrast: high)').matches;
};

/**
 * Gets appropriate animation duration based on user preferences
 */
export const getAnimationDuration = (defaultDuration = 300) => {
  return prefersReducedMotion() ? 0 : defaultDuration;
};

/**
 * Creates accessible error message element
 */
export const createErrorMessage = (fieldId, message) => {
  const errorElement = document.createElement('div');
  errorElement.id = `${fieldId}-error`;
  errorElement.className = 'error-message';
  errorElement.setAttribute('role', 'alert');
  errorElement.setAttribute('aria-live', 'polite');
  errorElement.textContent = message;
  
  return errorElement;
};

/**
 * Creates accessible description element
 */
export const createDescription = (fieldId, description) => {
  const descElement = document.createElement('div');
  descElement.id = `${fieldId}-description`;
  descElement.className = 'field-description';
  descElement.textContent = description;
  
  return descElement;
};

/**
 * Accessibility testing utilities
 */
export const a11yTest = {
  // Check if element has accessible name
  hasAccessibleName(element) {
    return !!(
      element.getAttribute('aria-label') ||
      element.getAttribute('aria-labelledby') ||
      element.textContent.trim() ||
      element.getAttribute('title') ||
      element.getAttribute('alt')
    );
  },

  // Check if interactive element is keyboard accessible
  isKeyboardAccessible(element) {
    const tabIndex = element.getAttribute('tabindex');
    return (
      element.tagName === 'BUTTON' ||
      element.tagName === 'A' ||
      element.tagName === 'INPUT' ||
      element.tagName === 'SELECT' ||
      element.tagName === 'TEXTAREA' ||
      (tabIndex !== null && tabIndex !== '-1')
    );
  },

  // Check if form field has proper labeling
  hasProperLabeling(input) {
    const id = input.getAttribute('id');
    const ariaLabel = input.getAttribute('aria-label');
    const ariaLabelledBy = input.getAttribute('aria-labelledby');
    
    if (ariaLabel || ariaLabelledBy) return true;
    
    if (id) {
      const label = document.querySelector(`label[for="${id}"]`);
      return !!label;
    }
    
    return false;
  },

  // Run basic accessibility audit on contact section
  auditContactSection() {
    const contactSection = document.getElementById('contact');
    if (!contactSection) return { errors: ['Contact section not found'] };

    const errors = [];
    const warnings = [];

    // Check interactive elements
    const interactiveElements = contactSection.querySelectorAll(
      'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    interactiveElements.forEach((element, index) => {
      if (!this.hasAccessibleName(element)) {
        errors.push(`Interactive element ${index + 1} lacks accessible name`);
      }

      if (!this.isKeyboardAccessible(element)) {
        errors.push(`Interactive element ${index + 1} is not keyboard accessible`);
      }
    });

    // Check form fields
    const formFields = contactSection.querySelectorAll('input, select, textarea');
    formFields.forEach((field, index) => {
      if (!this.hasProperLabeling(field)) {
        errors.push(`Form field ${index + 1} lacks proper labeling`);
      }
    });

    // Check images
    const images = contactSection.querySelectorAll('img');
    images.forEach((img, index) => {
      if (!img.getAttribute('alt')) {
        warnings.push(`Image ${index + 1} lacks alt text`);
      }
    });

    return { errors, warnings };
  }
};

// Export all utilities
export default {
  ARIA_ROLES,
  ARIA_LABELS,
  ANNOUNCEMENTS,
  KEYBOARD_KEYS,
  createFormFieldAttributes,
  createButtonAttributes,
  createModalAttributes,
  createLiveRegion,
  announceToScreenReader,
  manageFocus,
  validateColorContrast,
  prefersReducedMotion,
  prefersHighContrast,
  getAnimationDuration,
  createErrorMessage,
  createDescription,
  a11yTest
};