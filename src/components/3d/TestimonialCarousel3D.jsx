import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TestimonialCarousel3D = ({ testimonials = [], autoRotate = true, rotationSpeed = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(autoRotate);
  const [isDragging, setIsDragging] = useState(false);
  const [rotation, setRotation] = useState(0);
  const carouselRef = useRef(null);
  const autoRotateRef = useRef(null);

  // Early return if no testimonials
  if (!testimonials || testimonials.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 text-slate-400">
        <p>No testimonials available</p>
      </div>
    );
  }

  const radius = 300; // Radius of the 3D carousel
  const itemAngle = 360 / testimonials.length;

  // Auto-rotation effect
  useEffect(() => {
    if (isAutoRotating && !isDragging) {
      autoRotateRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      }, rotationSpeed);
    } else {
      clearInterval(autoRotateRef.current);
    }

    return () => clearInterval(autoRotateRef.current);
  }, [isAutoRotating, isDragging, testimonials.length, rotationSpeed]);

  // Update rotation based on current index
  useEffect(() => {
    setRotation(-currentIndex * itemAngle);
  }, [currentIndex, itemAngle]);

  const handlePrevious = () => {
    setIsAutoRotating(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setTimeout(() => setIsAutoRotating(autoRotate), 3000);
  };

  const handleNext = () => {
    setIsAutoRotating(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setTimeout(() => setIsAutoRotating(autoRotate), 3000);
  };

  const handleTestimonialClick = (index) => {
    setIsAutoRotating(false);
    setCurrentIndex(index);
    setTimeout(() => setIsAutoRotating(autoRotate), 3000);
  };

  const getTestimonialTransform = (index) => {
    const angle = index * itemAngle;
    const isActive = index === currentIndex;
    const distance = Math.abs(index - currentIndex);
    const normalizedDistance = Math.min(distance, testimonials.length - distance);
    
    return {
      transform: `
        rotateY(${angle}deg) 
        translateZ(${radius}px) 
        rotateY(${-angle}deg)
        scale(${isActive ? 1.1 : 0.8 - normalizedDistance * 0.1})
      `,
      opacity: isActive ? 1 : 0.6 - normalizedDistance * 0.2,
      zIndex: isActive ? 10 : 5 - normalizedDistance
    };
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-600'}`}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 2L15.09 8.26L22 9L17 14L18.18 22L12 18.77L5.82 22L7 14L2 9L8.91 8.26L12 2Z"/>
      </svg>
    ));
  };

  return (
    <div className="relative w-full h-96 md:h-[500px] overflow-hidden">
      {/* 3D Carousel Container */}
      <div 
        ref={carouselRef}
        className="relative w-full h-full"
        style={{
          perspective: '1000px',
          perspectiveOrigin: 'center center'
        }}
      >
        {/* Carousel Wrapper */}
        <motion.div
          className="relative w-full h-full"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateY(${rotation}deg)`
          }}
          animate={{ rotateY: rotation }}
          transition={{ 
            duration: 0.8, 
            ease: "easeInOut",
            type: "spring",
            stiffness: 100
          }}
        >
          {testimonials.map((testimonial, index) => {
            const transform = getTestimonialTransform(index);
            const isActive = index === currentIndex;
            
            return (
              <motion.div
                key={testimonial.id || index}
                className="absolute top-1/2 left-1/2 w-80 cursor-pointer"
                style={{
                  ...transform,
                  transformOrigin: 'center center',
                  marginLeft: '-160px',
                  marginTop: '-150px'
                }}
                onClick={() => handleTestimonialClick(index)}
                whileHover={isActive ? { 
                  scale: 1.15,
                  rotateX: 5,
                  transition: { duration: 0.3 }
                } : {}}
              >
                {/* Testimonial Card */}
                <div className={`glass-morphism rounded-2xl border-2 overflow-hidden transition-all duration-300 ${
                  isActive 
                    ? 'border-cyan-500 shadow-2xl shadow-cyan-500/25' 
                    : 'border-white/20'
                }`}>
                  
                  {/* Card Header */}
                  <div className="p-4 border-b border-white/10">
                    <div className="flex items-center space-x-3">
                      {/* Profile Avatar */}
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-cyan-500/50">
                        <div className="w-full h-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold">
                          {testimonial.name ? testimonial.name.split(' ').map(n => n[0]).join('') : 'A'}
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-white truncate">
                          {testimonial.name || 'Anonymous'}
                        </h3>
                        <p className="text-xs text-cyan-400 truncate">
                          {testimonial.role || 'Role not specified'}
                        </p>
                        <p className="text-xs text-slate-400 truncate">
                          {testimonial.company || 'Company not specified'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Card Content */}
                  <div className="p-4">
                    {/* Rating */}
                    <div className="flex items-center space-x-1 mb-3">
                      {renderStars(testimonial.rating || 5)}
                    </div>
                    
                    {/* Testimonial Text */}
                    <blockquote className="text-slate-300 text-sm leading-relaxed mb-3 overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                      "{testimonial.content ? testimonial.content.substring(0, 120) + '...' : 'No content available'}"
                    </blockquote>
                    
                    {/* Relationship Badge */}
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-1 bg-cyan-500/20 text-cyan-300 text-xs rounded-full border border-cyan-500/30">
                        {testimonial.relationship || 'Colleague'}
                      </span>
                      <span className="text-xs text-slate-400">
                        {testimonial.date || 'Recent'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Active Indicator */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-2xl border-2 border-cyan-400 pointer-events-none"
                      initial={{ opacity: 0, scale: 1 }}
                      animate={{ 
                        opacity: [0.5, 1, 0.5],
                        scale: [1, 1.02, 1]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </div>
                
                {/* Floating Particles for Active Card */}
                {isActive && (
                  <>
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 rounded-full bg-cyan-400"
                        style={{
                          left: `${20 + i * 10}%`,
                          top: `${20 + i * 8}%`,
                        }}
                        animate={{
                          y: [0, -20, 0],
                          opacity: [0, 1, 0],
                          scale: [0, 1, 0]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.2
                        }}
                      />
                    ))}
                  </>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
      
      {/* Navigation Controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
        {/* Previous Button */}
        <motion.button
          onClick={handlePrevious}
          className="p-3 bg-white/10 backdrop-blur-sm text-white rounded-full hover:bg-white/20 transition-colors border border-white/20"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"/>
          </svg>
        </motion.button>
        
        {/* Dots Indicator */}
        <div className="flex space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => handleTestimonialClick(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-cyan-500 scale-125'
                  : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
        
        {/* Next Button */}
        <motion.button
          onClick={handleNext}
          className="p-3 bg-white/10 backdrop-blur-sm text-white rounded-full hover:bg-white/20 transition-colors border border-white/20"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/>
          </svg>
        </motion.button>
      </div>
      
      {/* Auto-rotate Toggle */}
      <div className="absolute top-4 right-4">
        <motion.button
          onClick={() => setIsAutoRotating(!isAutoRotating)}
          className={`p-2 rounded-full transition-colors border ${
            isAutoRotating 
              ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' 
              : 'bg-white/10 border-white/20 text-white'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            {isAutoRotating ? (
              <path d="M6,2V8H12V6H8V2H6M18,16V22H16V18H12V16H18M17,2V4H21V8H19V6H17V2H15V8H21V10H15V2H17M3,16V10H9V16H3M5,12V14H7V12H5Z"/>
            ) : (
              <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z"/>
            )}
          </svg>
        </motion.button>
      </div>
      
      {/* Carousel Info */}
      <div className="absolute top-4 left-4 text-white">
        <div className="text-sm font-medium">
          {currentIndex + 1} / {testimonials.length}
        </div>
        <div className="text-xs text-slate-400">
          {testimonials[currentIndex]?.name || 'Anonymous'}
        </div>
      </div>
    </div>
  );
};

export default TestimonialCarousel3D;