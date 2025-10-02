import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { submitContactForm, transformFormData, validateFormData, handleApiError } from '../../services/contactApi';

const ContactForm = ({ isVisible }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    projectType: 'web-development'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});

  const projectTypes = [
    { value: 'web-development', label: 'Web Development', color: '#22D3EE' },
    { value: 'frontend', label: 'Frontend Only', color: '#10B981' },
    { value: 'backend', label: 'Backend Only', color: '#8B5CF6' },
    { value: 'consultation', label: 'Technical Consultation', color: '#F59E0B' },
    { value: 'other', label: 'Other', color: '#64748B' }
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Transform form data to API format
      const apiFormData = transformFormData({
        name: formData.name,
        email: formData.email,
        phone: '', // Add phone field if needed
        company: '', // Add company field if needed
        role: '', // Add role field if needed
        projectType: formData.projectType,
        message: `${formData.subject}\n\n${formData.message}`, // Combine subject and message
        description: `${formData.subject}\n\n${formData.message}`, // Also map to description
        contactMethod: 'email',
        meetingPreference: 'video-call'
      });

      // Submit to backend API
      const result = await submitContactForm(apiFormData);
      
      if (result.success) {
        setSubmitStatus('success');
        
        // Handle different submission methods
        if (result.fallback) {
          console.log('📧 Using fallback submission method:', result.method);
          
          // Handle different fallback scenarios
          if (result.method === 'mailto' || result.method === 'manual-email') {
            setErrors({ 
              submit: result.message || 'Please email me directly at mukulbatra0@gmail.com with your message.'
            });
          } else if (result.method === 'rate-limited') {
            setErrors({ 
              submit: 'Too many requests detected. Please wait a moment and try again, or email me directly at mukulbatra0@gmail.com'
            });
          }
        }
        
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          projectType: 'web-development'
        });
        
        console.log('✅ Form submitted successfully:', result);
      } else {
        throw new Error(result.error || 'Submission failed');
      }
      
    } catch (error) {
      console.error('❌ Form submission error:', error);
      setSubmitStatus('error');
      
      // Set user-friendly error message
      const errorMessage = handleApiError(error);
      setErrors({ submit: errorMessage });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setSubmitStatus(null);
        setErrors(prev => ({ ...prev, submit: '' }));
      }, 8000);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error immediately when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const fieldVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <motion.div
      variants={formVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      className="max-w-2xl mx-auto"
    >
      <div className="glass-morphism rounded-2xl border border-white/20 overflow-hidden">
        {/* Form Header */}
        <div className="p-6 border-b border-white/10 bg-gradient-to-r from-cyan-500/10 to-blue-500/10">
          <h3 className="text-2xl font-bold text-white mb-2">Send Me a Message</h3>
          <p className="text-slate-300">Let's discuss your project and bring your ideas to life</p>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name and Email Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div variants={fieldVariants}>
              <label className="block text-sm font-medium text-white mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300 ${
                  errors.name ? 'border-red-500' : 'border-white/20 focus:border-cyan-500'
                }`}
                placeholder="Enter your full name"
              />
              <div className="h-6 mt-1">
                <AnimatePresence mode="wait">
                  {errors.name && (
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-red-400 text-sm"
                    >
                      {errors.name}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            <motion.div variants={fieldVariants}>
              <label className="block text-sm font-medium text-white mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300 ${
                  errors.email ? 'border-red-500' : 'border-white/20 focus:border-cyan-500'
                }`}
                placeholder="your.email@example.com"
              />
              <div className="h-6 mt-1">
                <AnimatePresence mode="wait">
                  {errors.email && (
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-red-400 text-sm"
                    >
                      {errors.email}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Project Type */}
          <motion.div variants={fieldVariants}>
            <label className="block text-sm font-medium text-white mb-2">
              Project Type
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {projectTypes.map((type) => (
                <label
                  key={type.value}
                  className={`relative flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                    formData.projectType === type.value
                      ? 'border-cyan-500 bg-cyan-500/20'
                      : 'border-white/20 bg-white/5 hover:border-white/40'
                  }`}
                >
                  <input
                    type="radio"
                    name="projectType"
                    value={type.value}
                    checked={formData.projectType === type.value}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium text-white text-center">
                    {type.label}
                  </span>
                  {formData.projectType === type.value && (
                    <motion.div
                      layoutId="projectTypeIndicator"
                      className="absolute inset-0 rounded-lg border-2 border-cyan-500"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </label>
              ))}
            </div>
          </motion.div>

          {/* Subject */}
          <motion.div variants={fieldVariants}>
            <label className="block text-sm font-medium text-white mb-2">
              Subject *
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300 ${
                errors.subject ? 'border-red-500' : 'border-white/20 focus:border-cyan-500'
              }`}
              placeholder="What's your project about?"
            />
            <div className="h-6 mt-1">
              <AnimatePresence mode="wait">
                {errors.subject && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-red-400 text-sm"
                  >
                    {errors.subject}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Message */}
          <motion.div variants={fieldVariants}>
            <label className="block text-sm font-medium text-white mb-2">
              Message *
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={5}
              className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300 resize-none ${
                errors.message ? 'border-red-500' : 'border-white/20 focus:border-cyan-500'
              }`}
              placeholder="Tell me more about your project, timeline, budget, and any specific requirements..."
            />
            <div className="h-6 mt-1">
              <AnimatePresence mode="wait">
                {errors.message && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-red-400 text-sm"
                  >
                    {errors.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div variants={fieldVariants}>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <motion.div
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <span>Sending Message...</span>
                </div>
              ) : (
                'Send Message'
              )}
            </button>
          </motion.div>
        </form>

        {/* Status Messages */}
        <AnimatePresence>
          {submitStatus && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`p-4 border-t border-white/10 ${
                submitStatus === 'success' 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-red-500/20 text-red-400'
              }`}
            >
              <div className="flex items-start space-x-3">
                {submitStatus === 'success' ? (
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,16.5L6.5,12L7.91,10.59L11,13.67L16.59,8.09L18,9.5L11,16.5Z"/>
                  </svg>
                ) : (
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,7A1.5,1.5 0 0,1 13.5,8.5A1.5,1.5 0 0,1 12,10A1.5,1.5 0 0,1 10.5,8.5A1.5,1.5 0 0,1 12,7M10.5,12H13.5V17H10.5V12Z"/>
                  </svg>
                )}
                <div className="flex-1">
                  <p className="font-medium">
                    {submitStatus === 'success' 
                      ? 'Message sent successfully!' 
                      : 'Unable to send message'
                    }
                  </p>
                  <p className="text-sm mt-1 opacity-90">
                    {submitStatus === 'success' 
                      ? 'I\'ll get back to you within 24 hours. You can also reach me directly at mukulbatra0@gmail.com' 
                      : 'Please contact me directly via email at mukulbatra0@gmail.com or call me for immediate assistance.'
                    }
                  </p>
                  {errors.submit && (
                    <p className="text-sm mt-2 p-2 bg-white/10 rounded border border-white/20">
                      {errors.submit}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ContactForm;