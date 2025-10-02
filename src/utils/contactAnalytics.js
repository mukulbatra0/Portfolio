/**
 * Contact Analytics Utilities
 * Handles tracking and analytics for the enhanced contact section
 */

// Analytics event types
export const ANALYTICS_EVENTS = {
  // Contact method interactions
  CONTACT_METHOD_VIEWED: 'contact_method_viewed',
  CONTACT_METHOD_CLICKED: 'contact_method_clicked',
  CONTACT_METHOD_HOVERED: 'contact_method_hovered',
  
  // Form interactions
  FORM_STARTED: 'form_started',
  FORM_STEP_COMPLETED: 'form_step_completed',
  FORM_FIELD_FOCUSED: 'form_field_focused',
  FORM_FIELD_COMPLETED: 'form_field_completed',
  FORM_VALIDATION_ERROR: 'form_validation_error',
  FORM_SUBMITTED: 'form_submitted',
  FORM_SUBMISSION_SUCCESS: 'form_submission_success',
  FORM_SUBMISSION_ERROR: 'form_submission_error',
  FORM_ABANDONED: 'form_abandoned',
  
  // Chat interactions
  CHAT_OPENED: 'chat_opened',
  CHAT_CLOSED: 'chat_closed',
  CHAT_MESSAGE_SENT: 'chat_message_sent',
  CHAT_MESSAGE_RECEIVED: 'chat_message_received',
  
  // Scheduling interactions
  SCHEDULING_OPENED: 'scheduling_opened',
  TIME_SLOT_SELECTED: 'time_slot_selected',
  MEETING_BOOKED: 'meeting_booked',
  BOOKING_CANCELLED: 'booking_cancelled',
  
  // Section engagement
  SECTION_VIEWED: 'section_viewed',
  SECTION_SCROLL_DEPTH: 'section_scroll_depth',
  SECTION_TIME_SPENT: 'section_time_spent',
  
  // File interactions
  FILE_UPLOAD_STARTED: 'file_upload_started',
  FILE_UPLOAD_COMPLETED: 'file_upload_completed',
  FILE_UPLOAD_ERROR: 'file_upload_error',
  
  // Social interactions
  SOCIAL_LINK_CLICKED: 'social_link_clicked',
  
  // Accessibility interactions
  KEYBOARD_NAVIGATION_USED: 'keyboard_navigation_used',
  SCREEN_READER_DETECTED: 'screen_reader_detected'
};

// Analytics data structure
class ContactAnalytics {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.events = [];
    this.engagementMetrics = {
      sessionStart: Date.now(),
      sectionViewTime: 0,
      scrollDepth: 0,
      interactionCount: 0,
      conversionEvents: []
    };
    this.userContext = this.getUserContext();
    
    // Initialize tracking
    this.initializeTracking();
  }

  generateSessionId() {
    return `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getUserContext() {
    return {
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      screen: {
        width: screen.width,
        height: screen.height,
        colorDepth: screen.colorDepth
      },
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      referrer: document.referrer,
      url: window.location.href,
      timestamp: new Date().toISOString()
    };
  }

  initializeTracking() {
    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.trackEvent(ANALYTICS_EVENTS.SECTION_TIME_SPENT, {
          duration: Date.now() - this.engagementMetrics.sessionStart
        });
      }
    });

    // Track scroll depth
    let maxScrollDepth = 0;
    const trackScrollDepth = () => {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        const rect = contactSection.getBoundingClientRect();
        const sectionHeight = contactSection.offsetHeight;
        const viewportHeight = window.innerHeight;
        
        if (rect.top < viewportHeight && rect.bottom > 0) {
          const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
          const scrollDepth = Math.round((visibleHeight / sectionHeight) * 100);
          
          if (scrollDepth > maxScrollDepth) {
            maxScrollDepth = scrollDepth;
            this.engagementMetrics.scrollDepth = scrollDepth;
            
            // Track milestone scroll depths
            if (scrollDepth >= 25 && scrollDepth < 50) {
              this.trackEvent(ANALYTICS_EVENTS.SECTION_SCROLL_DEPTH, { depth: 25 });
            } else if (scrollDepth >= 50 && scrollDepth < 75) {
              this.trackEvent(ANALYTICS_EVENTS.SECTION_SCROLL_DEPTH, { depth: 50 });
            } else if (scrollDepth >= 75 && scrollDepth < 100) {
              this.trackEvent(ANALYTICS_EVENTS.SECTION_SCROLL_DEPTH, { depth: 75 });
            } else if (scrollDepth >= 100) {
              this.trackEvent(ANALYTICS_EVENTS.SECTION_SCROLL_DEPTH, { depth: 100 });
            }
          }
        }
      }
    };

    // Throttled scroll tracking
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      scrollTimeout = setTimeout(trackScrollDepth, 100);
    }, { passive: true });

    // Track keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab' || e.key === 'Enter' || e.key === ' ') {
        this.trackEvent(ANALYTICS_EVENTS.KEYBOARD_NAVIGATION_USED, {
          key: e.key,
          target: e.target.tagName
        });
      }
    });

    // Detect screen reader usage
    if (this.isScreenReaderDetected()) {
      this.trackEvent(ANALYTICS_EVENTS.SCREEN_READER_DETECTED);
    }
  }

  isScreenReaderDetected() {
    // Simple heuristic to detect screen reader usage
    return (
      navigator.userAgent.includes('NVDA') ||
      navigator.userAgent.includes('JAWS') ||
      navigator.userAgent.includes('VoiceOver') ||
      window.speechSynthesis ||
      document.querySelector('[aria-live]') !== null
    );
  }

  trackEvent(eventType, data = {}, options = {}) {
    const event = {
      id: this.generateEventId(),
      type: eventType,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      data: {
        ...data,
        interactionCount: ++this.engagementMetrics.interactionCount
      },
      context: options.includeFullContext ? this.getUserContext() : {
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      }
    };

    this.events.push(event);

    // Store in localStorage for persistence (with size limit)
    this.persistEvents();

    // Send to analytics service (if configured)
    if (options.sendImmediately) {
      this.sendEvents([event]);
    }

    // Console log for development
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Contact Analytics Event:', event);
    }

    return event;
  }

  generateEventId() {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  }

  persistEvents() {
    try {
      const eventsToStore = this.events.slice(-100); // Keep only last 100 events
      localStorage.setItem('contact_analytics_events', JSON.stringify({
        sessionId: this.sessionId,
        events: eventsToStore,
        metrics: this.engagementMetrics,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.warn('Failed to persist analytics events:', error);
    }
  }

  loadPersistedEvents() {
    try {
      const stored = localStorage.getItem('contact_analytics_events');
      if (stored) {
        const { events, metrics, timestamp } = JSON.parse(stored);
        
        // Only load if less than 24 hours old
        if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
          this.events = events || [];
          this.engagementMetrics = { ...this.engagementMetrics, ...metrics };
        }
      }
    } catch (error) {
      console.warn('Failed to load persisted analytics events:', error);
    }
  }

  async sendEvents(events = null) {
    const eventsToSend = events || this.events.filter(e => !e.sent);
    
    if (eventsToSend.length === 0) return;

    try {
      // In a real implementation, this would send to your analytics service
      // For now, we'll simulate the API call
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Mark events as sent
      eventsToSend.forEach(event => {
        event.sent = true;
        event.sentAt = Date.now();
      });

      console.log(`📤 Sent ${eventsToSend.length} analytics events`);
      
      return { success: true, eventCount: eventsToSend.length };
    } catch (error) {
      console.error('Failed to send analytics events:', error);
      return { success: false, error };
    }
  }

  getEngagementSummary() {
    const now = Date.now();
    const sessionDuration = now - this.engagementMetrics.sessionStart;
    
    return {
      sessionId: this.sessionId,
      sessionDuration,
      totalEvents: this.events.length,
      interactionCount: this.engagementMetrics.interactionCount,
      scrollDepth: this.engagementMetrics.scrollDepth,
      conversionEvents: this.engagementMetrics.conversionEvents,
      eventsByType: this.getEventsByType(),
      engagementScore: this.calculateEngagementScore()
    };
  }

  getEventsByType() {
    const eventCounts = {};
    this.events.forEach(event => {
      eventCounts[event.type] = (eventCounts[event.type] || 0) + 1;
    });
    return eventCounts;
  }

  calculateEngagementScore() {
    // Simple engagement scoring algorithm
    let score = 0;
    
    // Base score for session duration (max 30 points)
    const sessionMinutes = (Date.now() - this.engagementMetrics.sessionStart) / (1000 * 60);
    score += Math.min(sessionMinutes * 2, 30);
    
    // Score for interactions (max 40 points)
    score += Math.min(this.engagementMetrics.interactionCount * 2, 40);
    
    // Score for scroll depth (max 20 points)
    score += (this.engagementMetrics.scrollDepth / 100) * 20;
    
    // Bonus for conversion events (10 points each)
    score += this.engagementMetrics.conversionEvents.length * 10;
    
    return Math.round(score);
  }

  // Convenience methods for common tracking scenarios
  trackContactMethodInteraction(method, action, additionalData = {}) {
    return this.trackEvent(ANALYTICS_EVENTS.CONTACT_METHOD_CLICKED, {
      method,
      action,
      ...additionalData
    });
  }

  trackFormInteraction(action, fieldName, additionalData = {}) {
    const eventType = action === 'started' ? ANALYTICS_EVENTS.FORM_STARTED :
                     action === 'completed' ? ANALYTICS_EVENTS.FORM_SUBMITTED :
                     action === 'error' ? ANALYTICS_EVENTS.FORM_VALIDATION_ERROR :
                     ANALYTICS_EVENTS.FORM_FIELD_FOCUSED;
    
    return this.trackEvent(eventType, {
      action,
      fieldName,
      ...additionalData
    });
  }

  trackChatInteraction(action, additionalData = {}) {
    const eventType = action === 'opened' ? ANALYTICS_EVENTS.CHAT_OPENED :
                     action === 'closed' ? ANALYTICS_EVENTS.CHAT_CLOSED :
                     action === 'message_sent' ? ANALYTICS_EVENTS.CHAT_MESSAGE_SENT :
                     ANALYTICS_EVENTS.CHAT_MESSAGE_RECEIVED;
    
    return this.trackEvent(eventType, {
      action,
      ...additionalData
    });
  }

  trackConversionEvent(eventType, data = {}) {
    this.engagementMetrics.conversionEvents.push({
      type: eventType,
      timestamp: Date.now(),
      data
    });
    
    return this.trackEvent(eventType, data, { sendImmediately: true });
  }

  // Cleanup method
  cleanup() {
    // Send any remaining events
    this.sendEvents();
    
    // Clear event listeners if needed
    // (In a real implementation, you'd store references to remove them)
  }
}

// Create singleton instance
export const contactAnalytics = new ContactAnalytics();

// Export convenience functions
export const trackContactEvent = (eventType, data, options) => {
  return contactAnalytics.trackEvent(eventType, data, options);
};

export const trackContactMethodClick = (method, additionalData) => {
  return contactAnalytics.trackContactMethodInteraction(method, 'click', additionalData);
};

export const trackFormEvent = (action, fieldName, additionalData) => {
  return contactAnalytics.trackFormInteraction(action, fieldName, additionalData);
};

export const trackChatEvent = (action, additionalData) => {
  return contactAnalytics.trackChatInteraction(action, additionalData);
};

export const getEngagementSummary = () => {
  return contactAnalytics.getEngagementSummary();
};

// Privacy-compliant data collection
export const setAnalyticsConsent = (hasConsent) => {
  localStorage.setItem('contact_analytics_consent', hasConsent.toString());
  
  if (!hasConsent) {
    // Clear stored analytics data
    localStorage.removeItem('contact_analytics_events');
    contactAnalytics.events = [];
  }
};

export const hasAnalyticsConsent = () => {
  const consent = localStorage.getItem('contact_analytics_consent');
  return consent === 'true';
};

// Initialize analytics if consent is given
if (hasAnalyticsConsent()) {
  contactAnalytics.loadPersistedEvents();
}