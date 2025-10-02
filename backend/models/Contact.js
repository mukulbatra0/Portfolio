const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  // Personal Information
  personalInfo: {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: {
      type: String,
      trim: true,
      maxlength: [20, 'Phone number cannot exceed 20 characters']
    },
    company: {
      type: String,
      trim: true,
      maxlength: [100, 'Company name cannot exceed 100 characters']
    },
    role: {
      type: String,
      trim: true,
      maxlength: [100, 'Role cannot exceed 100 characters']
    }
  },

  // Project Information
  projectInfo: {
    type: {
      type: String,
      required: [true, 'Project type is required'],
      enum: {
        values: ['web-development', 'frontend', 'backend', 'consultation', 'other'],
        message: 'Project type must be one of: web-development, frontend, backend, consultation, other'
      }
    },
    budget: {
      type: String,
      enum: {
        values: ['under-5k', '5k-15k', '15k-50k', '50k-100k', 'above-100k', 'discuss', ''],
        message: 'Budget must be a valid range'
      }
    },
    timeline: {
      type: String,
      enum: {
        values: ['asap', '1-month', '2-3-months', '3-6-months', '6-months-plus', 'flexible', ''],
        message: 'Timeline must be a valid option'
      }
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    requirements: [{
      type: String,
      trim: true,
      maxlength: [200, 'Each requirement cannot exceed 200 characters']
    }],
    attachments: [{
      filename: String,
      originalName: String,
      mimetype: String,
      size: Number,
      url: String
    }]
  },

  // Contact Preferences
  preferences: {
    contactMethod: {
      type: String,
      enum: {
        values: ['email', 'phone', 'whatsapp', 'video-call'],
        message: 'Contact method must be one of: email, phone, whatsapp, video-call'
      },
      default: 'email'
    },
    meetingPreference: {
      type: String,
      enum: {
        values: ['video-call', 'phone-call', 'in-person', 'email-only'],
        message: 'Meeting preference must be one of: video-call, phone-call, in-person, email-only'
      },
      default: 'video-call'
    },
    timezone: {
      type: String,
      default: 'Asia/Kolkata'
    }
  },

  // Metadata
  metadata: {
    source: {
      type: String,
      default: 'portfolio-contact-form'
    },
    referrer: String,
    userAgent: String,
    ipAddress: String,
    sessionId: String,
    utmParams: {
      source: String,
      medium: String,
      campaign: String,
      term: String,
      content: String
    }
  },

  // Status and Communication
  status: {
    type: String,
    enum: {
      values: ['new', 'contacted', 'in-progress', 'completed', 'archived'],
      message: 'Status must be one of: new, contacted, in-progress, completed, archived'
    },
    default: 'new'
  },
  
  priority: {
    type: String,
    enum: {
      values: ['low', 'medium', 'high', 'urgent'],
      message: 'Priority must be one of: low, medium, high, urgent'
    },
    default: 'medium'
  },

  // Email tracking
  emailSent: {
    adminNotification: {
      sent: { type: Boolean, default: false },
      sentAt: Date,
      messageId: String,
      error: String
    },
    userConfirmation: {
      sent: { type: Boolean, default: false },
      sentAt: Date,
      messageId: String,
      error: String
    }
  },

  // Communication history
  communications: [{
    type: {
      type: String,
      enum: ['email', 'phone', 'meeting', 'note'],
      required: true
    },
    direction: {
      type: String,
      enum: ['inbound', 'outbound'],
      required: true
    },
    subject: String,
    content: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    createdBy: {
      type: String,
      default: 'system'
    }
  }],

  // Timestamps
  submittedAt: {
    type: Date,
    default: Date.now
  },
  lastContactedAt: Date,
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
contactSchema.index({ 'personalInfo.email': 1 });
contactSchema.index({ status: 1 });
contactSchema.index({ priority: 1 });
contactSchema.index({ submittedAt: -1 });
contactSchema.index({ 'projectInfo.type': 1 });

// Virtual for full name
contactSchema.virtual('fullContactInfo').get(function() {
  return {
    name: this.personalInfo.name,
    email: this.personalInfo.email,
    phone: this.personalInfo.phone,
    company: this.personalInfo.company
  };
});

// Virtual for project summary
contactSchema.virtual('projectSummary').get(function() {
  return `${this.projectInfo.type} project - ${this.projectInfo.description.substring(0, 100)}...`;
});

// Pre-save middleware
contactSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Auto-set priority based on project type and timeline
  if (this.projectInfo.timeline === 'asap') {
    this.priority = 'urgent';
  } else if (this.projectInfo.type === 'consultation') {
    this.priority = 'high';
  } else if (this.projectInfo.timeline === '1-month') {
    this.priority = 'high';
  }
  
  next();
});

// Static methods
contactSchema.statics.findByEmail = function(email) {
  return this.find({ 'personalInfo.email': email.toLowerCase() });
};

contactSchema.statics.findByStatus = function(status) {
  return this.find({ status }).sort({ submittedAt: -1 });
};

contactSchema.statics.findRecent = function(days = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.find({
    submittedAt: { $gte: startDate }
  }).sort({ submittedAt: -1 });
};

// Instance methods
contactSchema.methods.markAsContacted = function() {
  this.status = 'contacted';
  this.lastContactedAt = new Date();
  return this.save();
};

contactSchema.methods.addCommunication = function(type, direction, content, subject = '') {
  this.communications.push({
    type,
    direction,
    content,
    subject,
    timestamp: new Date()
  });
  return this.save();
};

contactSchema.methods.updateEmailStatus = function(emailType, success, messageId = '', error = '') {
  if (emailType === 'admin') {
    this.emailSent.adminNotification.sent = success;
    this.emailSent.adminNotification.sentAt = new Date();
    this.emailSent.adminNotification.messageId = messageId;
    this.emailSent.adminNotification.error = error;
  } else if (emailType === 'user') {
    this.emailSent.userConfirmation.sent = success;
    this.emailSent.userConfirmation.sentAt = new Date();
    this.emailSent.userConfirmation.messageId = messageId;
    this.emailSent.userConfirmation.error = error;
  }
  // Don't auto-save to avoid parallel save errors
  return this;
};

// New method for safely updating email status and saving
contactSchema.methods.updateEmailStatusAndSave = async function(emailType, success, messageId = '', error = '') {
  this.updateEmailStatus(emailType, success, messageId, error);
  return await this.save();
};

module.exports = mongoose.model('Contact', contactSchema);