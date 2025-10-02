const express = require('express');
const { body, validationResult } = require('express-validator');
const Contact = require('../models/Contact');
const { sendEmail, emailTemplates } = require('../config/email');
const router = express.Router();

// Validation rules for contact form
const contactValidation = [
  // Personal Info validation
  body('personalInfo.name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s'.-]+$/)
    .withMessage('Name can only contain letters, spaces, hyphens, apostrophes, and periods'),
  
  body('personalInfo.email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('personalInfo.phone')
    .optional({ checkFalsy: true })
    .custom((value) => {
      if (!value || value.trim() === '') return true;
      return /^[\+]?[1-9][\d\s\-\(\)]{7,15}$/.test(value.replace(/\s/g, ''));
    })
    .withMessage('Please provide a valid phone number'),
  
  body('personalInfo.company')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage('Company name cannot exceed 100 characters'),
  
  body('personalInfo.role')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage('Role cannot exceed 100 characters'),

  // Project Info validation
  body('projectInfo.type')
    .isIn(['web-development', 'frontend', 'backend', 'consultation', 'other'])
    .withMessage('Please select a valid project type'),
  
  body('projectInfo.budget')
    .optional({ checkFalsy: true })
    .isIn(['under-5k', '5k-15k', '15k-50k', '50k-100k', 'above-100k', 'discuss'])
    .withMessage('Please select a valid budget range'),
  
  body('projectInfo.timeline')
    .optional({ checkFalsy: true })
    .isIn(['asap', '1-month', '2-3-months', '3-6-months', '6-months-plus', 'flexible'])
    .withMessage('Please select a valid timeline'),
  
  body('projectInfo.description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Project description must be between 10 and 2000 characters'),
  
  body('projectInfo.requirements')
    .optional({ checkFalsy: true })
    .isArray()
    .withMessage('Requirements must be an array'),
  
  body('projectInfo.requirements.*')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 200 })
    .withMessage('Each requirement cannot exceed 200 characters'),

  // Preferences validation
  body('preferences.contactMethod')
    .optional({ checkFalsy: true })
    .isIn(['email', 'phone', 'whatsapp', 'video-call'])
    .withMessage('Please select a valid contact method'),
  
  body('preferences.meetingPreference')
    .optional({ checkFalsy: true })
    .isIn(['video-call', 'phone-call', 'in-person', 'email-only'])
    .withMessage('Please select a valid meeting preference'),
  
  body('preferences.timezone')
    .optional({ checkFalsy: true })
    .isLength({ max: 50 })
    .withMessage('Timezone cannot exceed 50 characters')
];

// POST /api/contact - Submit contact form
router.post('/', contactValidation, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Extract client information
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
    const userAgent = req.get('User-Agent') || 'unknown';
    const referrer = req.get('Referer') || '';

    // Create contact record
    const contactData = {
      ...req.body,
      metadata: {
        ...req.body.metadata,
        ipAddress: clientIP,
        userAgent: userAgent,
        referrer: referrer,
        sessionId: req.body.metadata?.sessionId || `session_${Date.now()}`
      }
    };

    const contact = new Contact(contactData);
    await contact.save();

    console.log(`📝 New contact submission from ${contact.personalInfo.name} (${contact.personalInfo.email})`);

    // Send emails asynchronously
    const emailPromises = [];

    // Send admin notification email
    if (process.env.EMAIL_TO || process.env.ADMIN_EMAIL) {
      const adminEmail = emailTemplates.adminNotification(contact);
      emailPromises.push(
        sendEmail({
          to: process.env.EMAIL_TO || process.env.ADMIN_EMAIL,
          ...adminEmail
        }).then(result => {
          return { type: 'admin', ...result };
        })
      );
    }

    // Send user confirmation email
    const userEmail = emailTemplates.userConfirmation(contact);
    emailPromises.push(
      sendEmail({
        to: contact.personalInfo.email,
        ...userEmail
      }).then(result => {
        return { type: 'user', ...result };
      })
    );

    // Wait for emails to be sent (but don't block the response)
    Promise.all(emailPromises)
      .then(async (results) => {
        const adminResult = results.find(r => r.type === 'admin');
        const userResult = results.find(r => r.type === 'user');
        
        console.log(`📧 Email results - Admin: ${adminResult?.success ? '✅' : '❌'}, User: ${userResult?.success ? '✅' : '❌'}`);
        
        // Update email status in a single save operation
        try {
          if (adminResult) {
            contact.emailSent.adminNotification.sent = adminResult.success;
            contact.emailSent.adminNotification.sentAt = new Date();
            contact.emailSent.adminNotification.messageId = adminResult.messageId || '';
            contact.emailSent.adminNotification.error = adminResult.error || '';
          }
          
          if (userResult) {
            contact.emailSent.userConfirmation.sent = userResult.success;
            contact.emailSent.userConfirmation.sentAt = new Date();
            contact.emailSent.userConfirmation.messageId = userResult.messageId || '';
            contact.emailSent.userConfirmation.error = userResult.error || '';
          }
          
          await contact.save();
        } catch (saveError) {
          console.error('❌ Error updating email status:', saveError);
        }
      })
      .catch(error => {
        console.error('❌ Email sending error:', error);
      });

    // Return success response immediately
    res.status(201).json({
      success: true,
      message: 'Thank you for your message! I\'ll get back to you within 24 hours.',
      data: {
        id: contact._id,
        submittedAt: contact.submittedAt,
        status: contact.status,
        estimatedResponseTime: '24 hours',
        nextSteps: [
          'Your message has been received and saved',
          'You will receive a confirmation email shortly',
          'I will review your project requirements',
          'Expect a personal response within 24 hours'
        ]
      }
    });

  } catch (error) {
    console.error('❌ Contact form submission error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Sorry, there was an error processing your message. Please try again or contact me directly.',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// GET /api/contact - Get all contacts (admin only - would need authentication in production)
router.get('/', async (req, res) => {
  try {
    const { status, page = 1, limit = 10, sortBy = 'submittedAt', sortOrder = 'desc' } = req.query;
    
    // Build query
    const query = {};
    if (status) {
      query.status = status;
    }

    // Execute query with pagination
    const contacts = await Contact.find(query)
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-metadata.ipAddress -metadata.userAgent') // Hide sensitive data
      .exec();

    const total = await Contact.countDocuments(query);

    res.json({
      success: true,
      data: contacts,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        limit
      }
    });

  } catch (error) {
    console.error('❌ Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contacts',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// GET /api/contact/:id - Get specific contact
router.get('/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id)
      .select('-metadata.ipAddress -metadata.userAgent'); // Hide sensitive data

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({
      success: true,
      data: contact
    });

  } catch (error) {
    console.error('❌ Error fetching contact:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contact',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// PUT /api/contact/:id/status - Update contact status
router.put('/:id/status', [
  body('status')
    .isIn(['new', 'contacted', 'in-progress', 'completed', 'archived'])
    .withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    contact.status = req.body.status;
    if (req.body.status === 'contacted') {
      contact.lastContactedAt = new Date();
    }

    await contact.save();

    res.json({
      success: true,
      message: 'Contact status updated successfully',
      data: contact
    });

  } catch (error) {
    console.error('❌ Error updating contact status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating contact status',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// GET /api/contact/stats/summary - Get contact statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const stats = await Contact.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const projectTypes = await Contact.aggregate([
      {
        $group: {
          _id: '$projectInfo.type',
          count: { $sum: 1 }
        }
      }
    ]);

    const recentContacts = await Contact.countDocuments({
      submittedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    const totalContacts = await Contact.countDocuments();

    res.json({
      success: true,
      data: {
        totalContacts,
        recentContacts,
        statusBreakdown: stats,
        projectTypeBreakdown: projectTypes
      }
    });

  } catch (error) {
    console.error('❌ Error fetching contact stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contact statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;