import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ContactCard from '../ui/ContactCard';
import SocialIcon from '../ui/SocialIcon';
import ContactForm from '../ui/ContactForm';
import ContactParticles from '../3d/ContactParticles';
import { contactInfo, getContactMethod, getSocialLink, isWorkingHours, getResponseTime } from '../../data/contact';
import { downloadResume } from '../../utils/resumeDownload';

const Contact = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('contact');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setIsOnline(isWorkingHours());
    }, 60000);

    setIsOnline(isWorkingHours());
    return () => clearInterval(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const handleEmailClick = () => {
    window.location.href = contactInfo.contact.email.action;
  };

  const handlePhoneClick = () => {
    window.location.href = contactInfo.contact.phone.action;
  };

  const handleWhatsAppClick = () => {
    window.open(contactInfo.contact.phone.whatsapp, '_blank');
  };

  const handleLocationClick = () => {
    window.open(contactInfo.contact.location.mapUrl, '_blank');
  };

  const handleResumeDownload = async () => {
    try {
      const success = await downloadResume(contactInfo.resume.url, contactInfo.resume.filename);
      if (!success) {
        console.error('Resume download failed');
      }
    } catch (error) {
      console.error('Resume download error:', error);
    }
  };

  const contactMethods = [
    {
      type: 'email',
      title: 'Email Me',
      primary: contactInfo.contact.email.display,
      secondary: 'Preferred for detailed discussions',
      description: 'Send me an email for project inquiries, collaborations, or any questions you might have.',
      color: '#22D3EE',
      status: 'online',
      responseTime: getResponseTime('email'),
      actions: [
        { label: 'Send Email', primary: true, onClick: handleEmailClick },
        { label: 'Copy Email', onClick: () => navigator.clipboard.writeText(contactInfo.contact.email.primary) }
      ]
    },
    {
      type: 'phone',
      title: 'Call Me',
      primary: contactInfo.contact.phone.display,
      secondary: 'Quick discussions and urgent matters',
      description: 'Call me directly for immediate assistance or quick project discussions.',
      color: '#10B981',
      status: isOnline ? 'online' : 'offline',
      responseTime: getResponseTime('phone'),
      actions: [
        { label: 'Call Now', primary: true, onClick: handlePhoneClick },
        { label: 'WhatsApp', onClick: handleWhatsAppClick }
      ]
    },
    {
      type: 'location',
      title: 'Location',
      primary: `${contactInfo.contact.location.city}, ${contactInfo.contact.location.state}`,
      secondary: contactInfo.contact.location.country,
      description: 'Based in India, available for remote work and local meetings in Haryana region.',
      color: '#8B5CF6',
      status: 'available',
      responseTime: 'Available for remote work',
      actions: [
        { label: 'View Map', primary: true, onClick: handleLocationClick },
        { label: 'Time Zone: IST', onClick: () => {} }
      ]
    }
  ];

  return (
    <section id="contact" className="min-h-screen py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
      
      {/* Interactive Particle System */}
      <ContactParticles isVisible={isVisible} particleCount={60} />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="text-center mb-16"
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="mb-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Let's 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                {" "}Connect
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-6">
              {contactInfo.personal.tagline}
            </p>
            <p className="text-slate-400 max-w-2xl mx-auto">
              {contactInfo.personal.availability}
            </p>
          </motion.div>

          {/* Status Indicator */}
          <motion.div variants={itemVariants} className="mb-12">
            <div className="flex items-center justify-center space-x-4 p-4 glass-morphism rounded-xl border border-white/10 max-w-md mx-auto">
              <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-yellow-500'}`}>
                <motion.div
                  className={`w-full h-full rounded-full ${isOnline ? 'bg-green-500' : 'bg-yellow-500'}`}
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <div className="text-sm">
                <span className="text-white font-medium">
                  {isOnline ? 'Available Now' : 'Currently Offline'}
                </span>
                <div className="text-slate-400 text-xs">
                  {currentTime.toLocaleTimeString('en-US', { 
                    timeZone: 'Asia/Kolkata',
                    hour12: true,
                    hour: '2-digit',
                    minute: '2-digit'
                  })} IST
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Contact Methods */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="mb-16"
        >
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">Get In Touch</h3>
            <p className="text-slate-400">Choose your preferred way to reach out</p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {contactMethods.map((contact, index) => (
              <ContactCard
                key={contact.type}
                contact={contact}
                index={index}
                onClick={() => {
                  if (contact.actions?.[0]?.onClick) {
                    contact.actions[0].onClick();
                  }
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Social Media */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="mb-16"
        >
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">Follow Me</h3>
            <p className="text-slate-400">Connect with me on social media</p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="flex justify-center space-x-6">
            {Object.entries(contactInfo.social).map(([platform, social], index) => (
              <SocialIcon
                key={platform}
                social={social}
                index={index}
              />
            ))}
          </motion.div>
        </motion.div>



        {/* Contact Form */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="mb-16"
        >
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">Send a Message</h3>
            <p className="text-slate-400">Fill out the form below and I'll get back to you soon</p>
          </motion.div>
          
          <ContactForm isVisible={isVisible} />
        </motion.div>


      </div>
    </section>
  );
};

export default Contact;