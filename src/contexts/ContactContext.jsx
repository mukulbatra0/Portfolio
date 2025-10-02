import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { contactInfo, isWorkingHours, getResponseTime } from '../data/contact';

// Contact Context
const ContactContext = createContext();

// Action types
const CONTACT_ACTIONS = {
  SET_AVAILABILITY: 'SET_AVAILABILITY',
  SET_FORM_DATA: 'SET_FORM_DATA',
  SET_FORM_ERRORS: 'SET_FORM_ERRORS',
  SET_FORM_STEP: 'SET_FORM_STEP',
  SET_SUBMISSION_STATUS: 'SET_SUBMISSION_STATUS',
  SET_CHAT_STATE: 'SET_CHAT_STATE',
  ADD_CHAT_MESSAGE: 'ADD_CHAT_MESSAGE',
  SET_SCHEDULING_DATA: 'SET_SCHEDULING_DATA',
  TRACK_INTERACTION: 'TRACK_INTERACTION',
  SET_DRAFT_DATA: 'SET_DRAFT_DATA',
  CLEAR_DRAFT: 'CLEAR_DRAFT',
  SET_SELECTED_METHOD: 'SET_SELECTED_METHOD',
  SET_ENGAGEMENT_METRICS: 'SET_ENGAGEMENT_METRICS'
};

// Initial state
const initialState = {
  // Availability state
  availability: {
    isOnline: false,
    currentTime: new Date(),
    nextAvailable: null,
    responseTime: {
      email: getResponseTime('email'),
      phone: getResponseTime('phone'),
      chat: 'Within 1 hour'
    },
    customMessage: null
  },

  // Contact form state
  form: {
    data: {
      personalInfo: {
        name: '',
        email: '',
        phone: '',
        company: '',
        role: ''
      },
      projectInfo: {
        type: 'web-development',
        budget: '',
        timeline: '',
        description: '',
        requirements: [],
        attachments: []
      },
      preferences: {
        contactMethod: 'email',
        meetingPreference: 'video-call',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    },
    errors: {},
    currentStep: 1,
    totalSteps: 3,
    isSubmitting: false,
    submitStatus: null,
    lastSaved: null
  },

  // Draft management
  draft: {
    data: null,
    lastSaved: null,
    autoSaveEnabled: true
  },

  // Chat state
  chat: {
    isOpen: false,
    isOnline: false,
    messages: [],
    isTyping: false,
    unreadCount: 0,
    quickTemplates: [
      'Hi! I\'d like to discuss a project.',
      'What\'s your availability for a quick call?',
      'Can you share your portfolio?',
      'I need help with web development.'
    ]
  },

  // Scheduling state
  scheduling: {
    selectedDate: null,
    selectedTime: null,
    meetingType: 'consultation',
    duration: 30,
    availableSlots: [],
    isBooking: false,
    bookingStatus: null
  },

  // Analytics and tracking
  analytics: {
    sessionId: generateSessionId(),
    interactions: [],
    engagementMetrics: {
      timeOnSection: 0,
      scrollDepth: 0,
      formStarted: false,
      formCompleted: false,
      contactMethodClicks: {},
      chatInitiated: false
    },
    conversionEvents: []
  },

  // UI state
  ui: {
    selectedContactMethod: null,
    activeTab: 'contact',
    isVisible: false,
    hoveredCard: null,
    focusedElement: null
  }
};

// Helper function to generate session ID
function generateSessionId() {
  return `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Reducer
const contactReducer = (state, action) => {
  switch (action.type) {
    case CONTACT_ACTIONS.SET_AVAILABILITY:
      return {
        ...state,
        availability: { ...state.availability, ...action.payload }
      };

    case CONTACT_ACTIONS.SET_FORM_DATA:
      return {
        ...state,
        form: {
          ...state.form,
          data: { ...state.form.data, ...action.payload }
        }
      };

    case CONTACT_ACTIONS.SET_FORM_ERRORS:
      return {
        ...state,
        form: {
          ...state.form,
          errors: { ...state.form.errors, ...action.payload }
        }
      };

    case CONTACT_ACTIONS.SET_FORM_STEP:
      return {
        ...state,
        form: {
          ...state.form,
          currentStep: action.payload
        }
      };

    case CONTACT_ACTIONS.SET_SUBMISSION_STATUS:
      return {
        ...state,
        form: {
          ...state.form,
          isSubmitting: action.payload.isSubmitting || false,
          submitStatus: action.payload.status || null
        }
      };

    case CONTACT_ACTIONS.SET_CHAT_STATE:
      return {
        ...state,
        chat: { ...state.chat, ...action.payload }
      };

    case CONTACT_ACTIONS.ADD_CHAT_MESSAGE:
      return {
        ...state,
        chat: {
          ...state.chat,
          messages: [...state.chat.messages, action.payload],
          unreadCount: action.payload.sender === 'user' ? 
            state.chat.unreadCount : 
            state.chat.unreadCount + 1
        }
      };

    case CONTACT_ACTIONS.SET_SCHEDULING_DATA:
      return {
        ...state,
        scheduling: { ...state.scheduling, ...action.payload }
      };

    case CONTACT_ACTIONS.TRACK_INTERACTION:
      const newInteraction = {
        ...action.payload,
        timestamp: new Date(),
        sessionId: state.analytics.sessionId
      };
      
      return {
        ...state,
        analytics: {
          ...state.analytics,
          interactions: [...state.analytics.interactions, newInteraction]
        }
      };

    case CONTACT_ACTIONS.SET_DRAFT_DATA:
      return {
        ...state,
        draft: {
          ...state.draft,
          data: action.payload,
          lastSaved: new Date()
        }
      };

    case CONTACT_ACTIONS.CLEAR_DRAFT:
      return {
        ...state,
        draft: {
          ...state.draft,
          data: null,
          lastSaved: null
        }
      };

    case CONTACT_ACTIONS.SET_SELECTED_METHOD:
      return {
        ...state,
        ui: {
          ...state.ui,
          selectedContactMethod: action.payload
        }
      };

    case CONTACT_ACTIONS.SET_ENGAGEMENT_METRICS:
      return {
        ...state,
        analytics: {
          ...state.analytics,
          engagementMetrics: { 
            ...state.analytics.engagementMetrics, 
            ...action.payload 
          }
        }
      };

    default:
      return state;
  }
};

// Contact Provider Component
export const ContactProvider = ({ children }) => {
  const [state, dispatch] = useReducer(contactReducer, initialState);

  // Update availability status
  const updateAvailability = useCallback(() => {
    const currentTime = new Date();
    const isOnline = isWorkingHours();
    
    dispatch({
      type: CONTACT_ACTIONS.SET_AVAILABILITY,
      payload: {
        isOnline,
        currentTime,
        responseTime: {
          email: getResponseTime('email'),
          phone: getResponseTime('phone'),
          chat: isOnline ? 'Within 5 minutes' : 'Within 1 hour'
        }
      }
    });
  }, []);

  // Auto-save form data
  const autoSaveForm = useCallback((formData) => {
    if (state.draft.autoSaveEnabled) {
      try {
        localStorage.setItem('contact_form_draft', JSON.stringify({
          data: formData,
          timestamp: new Date().toISOString()
        }));
        
        dispatch({
          type: CONTACT_ACTIONS.SET_DRAFT_DATA,
          payload: formData
        });
      } catch (error) {
        console.warn('Failed to auto-save form data:', error);
      }
    }
  }, [state.draft.autoSaveEnabled]);

  // Load saved draft
  const loadDraft = useCallback(() => {
    try {
      const savedDraft = localStorage.getItem('contact_form_draft');
      if (savedDraft) {
        const { data, timestamp } = JSON.parse(savedDraft);
        const draftAge = Date.now() - new Date(timestamp).getTime();
        
        // Only load draft if it's less than 24 hours old
        if (draftAge < 24 * 60 * 60 * 1000) {
          dispatch({
            type: CONTACT_ACTIONS.SET_FORM_DATA,
            payload: data
          });
          
          dispatch({
            type: CONTACT_ACTIONS.SET_DRAFT_DATA,
            payload: data
          });
        } else {
          // Clear old draft
          localStorage.removeItem('contact_form_draft');
        }
      }
    } catch (error) {
      console.warn('Failed to load form draft:', error);
    }
  }, []);

  // Track interaction
  const trackInteraction = useCallback((eventType, data = {}) => {
    dispatch({
      type: CONTACT_ACTIONS.TRACK_INTERACTION,
      payload: {
        eventType,
        data,
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        referrer: document.referrer
      }
    });
  }, []);

  // Setup effects
  useEffect(() => {
    // Initial setup
    updateAvailability();
    loadDraft();

    // Update availability every minute
    const availabilityInterval = setInterval(updateAvailability, 60000);

    // Track section visibility
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          dispatch({
            type: CONTACT_ACTIONS.SET_ENGAGEMENT_METRICS,
            payload: { sectionVisible: true }
          });
          
          trackInteraction('section_viewed');
        }
      },
      { threshold: 0.1 }
    );

    const contactSection = document.getElementById('contact');
    if (contactSection) {
      observer.observe(contactSection);
    }

    return () => {
      clearInterval(availabilityInterval);
      observer.disconnect();
    };
  }, [updateAvailability, loadDraft, trackInteraction]);

  // Action creators
  const actions = {
    // Form actions
    updateFormData: (data) => {
      dispatch({
        type: CONTACT_ACTIONS.SET_FORM_DATA,
        payload: data
      });
      
      // Auto-save after update
      setTimeout(() => {
        autoSaveForm({ ...state.form.data, ...data });
      }, 1000);
    },

    setFormErrors: (errors) => {
      dispatch({
        type: CONTACT_ACTIONS.SET_FORM_ERRORS,
        payload: errors
      });
    },

    nextFormStep: () => {
      const nextStep = Math.min(state.form.currentStep + 1, state.form.totalSteps);
      dispatch({
        type: CONTACT_ACTIONS.SET_FORM_STEP,
        payload: nextStep
      });
      
      trackInteraction('form_step_completed', { step: state.form.currentStep });
    },

    prevFormStep: () => {
      const prevStep = Math.max(state.form.currentStep - 1, 1);
      dispatch({
        type: CONTACT_ACTIONS.SET_FORM_STEP,
        payload: prevStep
      });
    },

    submitForm: async (formData) => {
      dispatch({
        type: CONTACT_ACTIONS.SET_SUBMISSION_STATUS,
        payload: { isSubmitting: true }
      });

      try {
        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        dispatch({
          type: CONTACT_ACTIONS.SET_SUBMISSION_STATUS,
          payload: { 
            isSubmitting: false, 
            status: 'success' 
          }
        });

        // Clear draft after successful submission
        localStorage.removeItem('contact_form_draft');
        dispatch({ type: CONTACT_ACTIONS.CLEAR_DRAFT });

        trackInteraction('form_submitted', { 
          projectType: formData.projectInfo.type,
          contactMethod: formData.preferences.contactMethod
        });

        return { success: true };
      } catch (error) {
        dispatch({
          type: CONTACT_ACTIONS.SET_SUBMISSION_STATUS,
          payload: { 
            isSubmitting: false, 
            status: 'error' 
          }
        });

        trackInteraction('form_submission_failed', { error: error.message });
        return { success: false, error };
      }
    },

    // Chat actions
    toggleChat: () => {
      const newState = !state.chat.isOpen;
      dispatch({
        type: CONTACT_ACTIONS.SET_CHAT_STATE,
        payload: { isOpen: newState }
      });

      if (newState) {
        trackInteraction('chat_opened');
      }
    },

    sendChatMessage: (message) => {
      const chatMessage = {
        id: Date.now(),
        text: message,
        sender: 'user',
        timestamp: new Date()
      };

      dispatch({
        type: CONTACT_ACTIONS.ADD_CHAT_MESSAGE,
        payload: chatMessage
      });

      trackInteraction('chat_message_sent', { messageLength: message.length });

      // Simulate response (in real app, this would be WebSocket or API call)
      setTimeout(() => {
        const response = {
          id: Date.now() + 1,
          text: "Thanks for your message! I'll get back to you shortly.",
          sender: 'agent',
          timestamp: new Date()
        };

        dispatch({
          type: CONTACT_ACTIONS.ADD_CHAT_MESSAGE,
          payload: response
        });
      }, 1000);
    },

    // Contact method actions
    selectContactMethod: (method) => {
      dispatch({
        type: CONTACT_ACTIONS.SET_SELECTED_METHOD,
        payload: method
      });

      trackInteraction('contact_method_selected', { method });
    },

    // Analytics actions
    trackContactMethodClick: (method) => {
      trackInteraction('contact_method_clicked', { method });
      
      // Update engagement metrics
      const currentClicks = state.analytics.engagementMetrics.contactMethodClicks;
      dispatch({
        type: CONTACT_ACTIONS.SET_ENGAGEMENT_METRICS,
        payload: {
          contactMethodClicks: {
            ...currentClicks,
            [method]: (currentClicks[method] || 0) + 1
          }
        }
      });
    },

    // Scheduling actions
    selectTimeSlot: (date, time) => {
      dispatch({
        type: CONTACT_ACTIONS.SET_SCHEDULING_DATA,
        payload: {
          selectedDate: date,
          selectedTime: time
        }
      });

      trackInteraction('time_slot_selected', { date, time });
    },

    bookMeeting: async (bookingData) => {
      dispatch({
        type: CONTACT_ACTIONS.SET_SCHEDULING_DATA,
        payload: { isBooking: true }
      });

      try {
        // Simulate booking API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        dispatch({
          type: CONTACT_ACTIONS.SET_SCHEDULING_DATA,
          payload: { 
            isBooking: false, 
            bookingStatus: 'confirmed' 
          }
        });

        trackInteraction('meeting_booked', bookingData);
        return { success: true };
      } catch (error) {
        dispatch({
          type: CONTACT_ACTIONS.SET_SCHEDULING_DATA,
          payload: { 
            isBooking: false, 
            bookingStatus: 'failed' 
          }
        });

        return { success: false, error };
      }
    }
  };

  const value = {
    ...state,
    actions
  };

  return (
    <ContactContext.Provider value={value}>
      {children}
    </ContactContext.Provider>
  );
};

// Custom hook to use contact context
export const useContact = () => {
  const context = useContext(ContactContext);
  if (!context) {
    console.warn('useContact must be used within a ContactProvider');
    return null;
  }
  return context;
};

// Selector hooks for specific parts of state
export const useContactForm = () => {
  const contact = useContact();
  return contact ? {
    ...contact.form,
    updateFormData: contact.actions.updateFormData,
    setFormErrors: contact.actions.setFormErrors,
    nextFormStep: contact.actions.nextFormStep,
    prevFormStep: contact.actions.prevFormStep,
    submitForm: contact.actions.submitForm
  } : null;
};

export const useContactChat = () => {
  const contact = useContact();
  return contact ? {
    ...contact.chat,
    toggleChat: contact.actions.toggleChat,
    sendMessage: contact.actions.sendChatMessage
  } : null;
};

export const useContactAnalytics = () => {
  const contact = useContact();
  return contact ? {
    ...contact.analytics,
    trackContactMethodClick: contact.actions.trackContactMethodClick
  } : null;
};

export const useContactAvailability = () => {
  const contact = useContact();
  return contact?.availability || {
    isOnline: false,
    currentTime: new Date(),
    responseTime: {
      email: 'Within 24 hours',
      phone: 'Within 2 hours',
      chat: 'Within 1 hour'
    }
  };
};