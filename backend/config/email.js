const nodemailer = require('nodemailer');

// Create email transporter
const createTransporter = () => {
  // Gmail configuration
  if (process.env.EMAIL_HOST === 'smtp.gmail.com') {
    return nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS // Use App Password, not regular password
      }
    });
  }

  // Generic SMTP configuration
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Verify email configuration
const verifyEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('📧 Email configuration verified successfully');
    return true;
  } catch (error) {
    console.error('❌ Email configuration error:', error.message);
    return false;
  }
};

// Send email function
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"${process.env.COMPANY_NAME || 'Portfolio'}" <${process.env.EMAIL_FROM}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
      replyTo: options.replyTo || process.env.EMAIL_FROM
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('📧 Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    return { success: false, error: error.message };
  }
};

// Email templates
const emailTemplates = {
  // Template for admin notification (when someone contacts you)
  adminNotification: (formData) => {
    const { name, email, phone, company, role, projectInfo, preferences } = formData;
    
    return {
      subject: `🔔 New Contact Form Submission from ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Contact Form Submission</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #22D3EE, #0EA5E9); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #0EA5E9; }
            .value { margin-top: 5px; padding: 8px; background: white; border-radius: 4px; border-left: 3px solid #22D3EE; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
            .priority { background: #fef3c7; border-left-color: #f59e0b; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>📧 New Contact Form Submission</h1>
            <p>Someone has reached out through your portfolio!</p>
          </div>
          
          <div class="content">
            <div class="field">
              <div class="label">👤 Personal Information</div>
              <div class="value">
                <strong>Name:</strong> ${name}<br>
                <strong>Email:</strong> <a href="mailto:${email}">${email}</a><br>
                ${phone ? `<strong>Phone:</strong> <a href="tel:${phone}">${phone}</a><br>` : ''}
                ${company ? `<strong>Company:</strong> ${company}<br>` : ''}
                ${role ? `<strong>Role:</strong> ${role}<br>` : ''}
              </div>
            </div>

            <div class="field">
              <div class="label">💼 Project Information</div>
              <div class="value ${projectInfo.type === 'urgent' ? 'priority' : ''}">
                <strong>Project Type:</strong> ${projectInfo.type}<br>
                ${projectInfo.budget ? `<strong>Budget:</strong> ${projectInfo.budget}<br>` : ''}
                ${projectInfo.timeline ? `<strong>Timeline:</strong> ${projectInfo.timeline}<br>` : ''}
                ${projectInfo.requirements && projectInfo.requirements.length > 0 ? 
                  `<strong>Requirements:</strong> ${projectInfo.requirements.join(', ')}<br>` : ''}
              </div>
            </div>

            <div class="field">
              <div class="label">📝 Message</div>
              <div class="value">
                ${projectInfo.description.replace(/\n/g, '<br>')}
              </div>
            </div>

            <div class="field">
              <div class="label">⚙️ Contact Preferences</div>
              <div class="value">
                <strong>Preferred Contact Method:</strong> ${preferences.contactMethod}<br>
                <strong>Meeting Preference:</strong> ${preferences.meetingPreference}<br>
                <strong>Timezone:</strong> ${preferences.timezone}
              </div>
            </div>

            <div class="field">
              <div class="label">🕒 Submission Details</div>
              <div class="value">
                <strong>Submitted:</strong> ${new Date().toLocaleString()}<br>
                <strong>IP Address:</strong> [Hidden for privacy]<br>
                <strong>User Agent:</strong> [Hidden for privacy]
              </div>
            </div>
          </div>

          <div class="footer">
            <p>💡 <strong>Quick Actions:</strong></p>
            <p>
              <a href="mailto:${email}?subject=Re: Your inquiry about ${projectInfo.type}" 
                 style="background: #22D3EE; color: white; padding: 8px 16px; text-decoration: none; border-radius: 4px; margin: 0 5px;">
                Reply via Email
              </a>
              ${phone ? `
              <a href="tel:${phone}" 
                 style="background: #10B981; color: white; padding: 8px 16px; text-decoration: none; border-radius: 4px; margin: 0 5px;">
                Call Now
              </a>` : ''}
            </p>
            <p style="margin-top: 20px; font-size: 12px;">
              This email was sent from your portfolio contact form.<br>
              Portfolio Backend API v1.0.0
            </p>
          </div>
        </body>
        </html>
      `,
      text: `
New Contact Form Submission

Personal Information:
- Name: ${name}
- Email: ${email}
${phone ? `- Phone: ${phone}` : ''}
${company ? `- Company: ${company}` : ''}
${role ? `- Role: ${role}` : ''}

Project Information:
- Type: ${projectInfo.type}
${projectInfo.budget ? `- Budget: ${projectInfo.budget}` : ''}
${projectInfo.timeline ? `- Timeline: ${projectInfo.timeline}` : ''}
${projectInfo.requirements && projectInfo.requirements.length > 0 ? 
  `- Requirements: ${projectInfo.requirements.join(', ')}` : ''}

Message:
${projectInfo.description}

Contact Preferences:
- Preferred Method: ${preferences.contactMethod}
- Meeting Preference: ${preferences.meetingPreference}
- Timezone: ${preferences.timezone}

Submitted: ${new Date().toLocaleString()}
      `,
      replyTo: email
    };
  },

  // Template for user confirmation (auto-reply)
  userConfirmation: (formData) => {
    const { name, projectInfo } = formData;
    
    return {
      subject: `✅ Thank you for contacting Mukul Batra - Message received!`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Message Received - Thank You!</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #22D3EE, #0EA5E9); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
            .highlight { background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #22D3EE; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .social-links { margin: 20px 0; }
            .social-links a { display: inline-block; margin: 0 10px; padding: 8px 16px; background: #22D3EE; color: white; text-decoration: none; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🎉 Thank You, ${name}!</h1>
            <p>Your message has been received successfully</p>
          </div>
          
          <div class="content">
            <p>Hi ${name},</p>
            
            <p>Thank you for reaching out! I've received your inquiry about <strong>${projectInfo.type}</strong> and I'm excited to learn more about your project.</p>
            
            <div class="highlight">
              <h3>📋 What happens next?</h3>
              <ul>
                <li><strong>Response Time:</strong> I'll get back to you within 24 hours</li>
                <li><strong>Initial Review:</strong> I'll review your project requirements carefully</li>
                <li><strong>Follow-up:</strong> We can schedule a call to discuss details</li>
                <li><strong>Proposal:</strong> I'll provide a detailed project proposal if we're a good fit</li>
              </ul>
            </div>

            <p>In the meantime, feel free to:</p>
            <ul>
              <li>📱 Check out my latest projects on <a href="https://github.com/mukulbatra" style="color: #22D3EE;">GitHub</a></li>
              <li>💼 Connect with me on <a href="https://linkedin.com/in/mukulbatra" style="color: #22D3EE;">LinkedIn</a></li>
              <li>📧 Reply to this email if you have any additional information</li>
            </ul>

            <div class="highlight">
              <h3>🚀 About Me</h3>
              <p>I'm a Full-Stack MERN Developer passionate about building scalable, user-friendly applications. I specialize in React.js, Node.js, and modern web technologies to bring your ideas to life.</p>
            </div>

            <p>Looking forward to working together!</p>
            
            <p>Best regards,<br>
            <strong>Mukul Batra</strong><br>
            Full-Stack MERN Developer<br>
            📧 mukulbatra5911@gmail.com<br>
            📱 +91 86859 65227</p>
          </div>

          <div class="footer">
            <div class="social-links">
              <a href="https://github.com/mukulbatra">GitHub</a>
              <a href="https://linkedin.com/in/mukulbatra">LinkedIn</a>
              <a href="https://mukulbatra.dev">Portfolio</a>
            </div>
            <p style="font-size: 12px; margin-top: 20px;">
              This is an automated response. Please don't reply to this email address.<br>
              For urgent matters, contact me directly at mukulbatra5911@gmail.com
            </p>
          </div>
        </body>
        </html>
      `,
      text: `
Hi ${name},

Thank you for reaching out! I've received your inquiry about ${projectInfo.type} and I'm excited to learn more about your project.

What happens next?
- Response Time: I'll get back to you within 24 hours
- Initial Review: I'll review your project requirements carefully
- Follow-up: We can schedule a call to discuss details
- Proposal: I'll provide a detailed project proposal if we're a good fit

In the meantime, feel free to:
- Check out my latest projects on GitHub: https://github.com/mukulbatra
- Connect with me on LinkedIn: https://linkedin.com/in/mukulbatra
- Reply to this email if you have any additional information

Looking forward to working together!

Best regards,
Mukul Batra
Full-Stack MERN Developer
📧 mukulbatra5911@gmail.com
📱 +91 86859 65227
🌐 https://mukulbatra.dev
      `
    };
  }
};

module.exports = {
  createTransporter,
  verifyEmailConfig,
  sendEmail,
  emailTemplates
};