import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useIntersectionObserverSingle } from '../../hooks/useIntersectionObserver';
import { useGSAP } from '../../hooks/useGSAP';
import { ANIMATION_PRESETS } from '../../utils/animations';

const AnimatedSection = ({
  children,
  animation = 'fadeInUp',
  threshold = 0.1,
  rootMargin = '50px',
  triggerOnce = true,
  stagger = false,
  staggerDelay = 0.1,
  delay = 0,
  duration = 0.8,
  ease = 'power2.out',
  className = '',
  useGSAPAnimation = false,
  onAnimationStart = null,
  onAnimationComplete = null,
  ...props
}) => {
  const sectionRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const { gsap, isLoaded: gsapLoaded } = useGSAP();

  const { isIntersecting, entry } = useIntersectionObserverSingle(sectionRef, {
    threshold,
    rootMargin,
    triggerOnce,
    onIntersect: (entry) => {
      if (!hasAnimated) {
        startAnimation();
        setHasAnimated(true);
      }
    }
  });

  const startAnimation = () => {
    if (onAnimationStart) {
      onAnimationStart(sectionRef.current, entry);
    }

    if (useGSAPAnimation && gsap && gsapLoaded) {
      startGSAPAnimation();
    }
  };

  const startGSAPAnimation = () => {
    const elements = sectionRef.current?.children;
    if (!elements || elements.length === 0) return;

    const animationPreset = ANIMATION_PRESETS[animation];
    if (!animationPreset) return;

    // Set initial state
    gsap.set(elements, animationPreset.from);

    // Create animation
    const timeline = gsap.timeline({
      delay,
      onComplete: () => {
        if (onAnimationComplete) {
          onAnimationComplete(sectionRef.current, entry);
        }
      }
    });

    if (stagger) {
      timeline.to(elements, {
        ...animationPreset.to,
        duration,
        ease,
        stagger: staggerDelay
      });
    } else {
      timeline.to(elements, {
        ...animationPreset.to,
        duration,
        ease
      });
    }
  };

  // Framer Motion variants for non-GSAP animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay,
        staggerChildren: stagger ? staggerDelay : 0,
        delayChildren: 0.1
      }
    }
  };

  const getItemVariants = () => {
    switch (animation) {
      case 'fadeInUp':
        return {
          hidden: { opacity: 0, y: 50 },
          visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration, ease: [0.25, 0.46, 0.45, 0.94] }
          }
        };
      case 'fadeInDown':
        return {
          hidden: { opacity: 0, y: -50 },
          visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration, ease: [0.25, 0.46, 0.45, 0.94] }
          }
        };
      case 'fadeInLeft':
        return {
          hidden: { opacity: 0, x: -50 },
          visible: { 
            opacity: 1, 
            x: 0,
            transition: { duration, ease: [0.25, 0.46, 0.45, 0.94] }
          }
        };
      case 'fadeInRight':
        return {
          hidden: { opacity: 0, x: 50 },
          visible: { 
            opacity: 1, 
            x: 0,
            transition: { duration, ease: [0.25, 0.46, 0.45, 0.94] }
          }
        };
      case 'scaleIn':
        return {
          hidden: { opacity: 0, scale: 0.8 },
          visible: { 
            opacity: 1, 
            scale: 1,
            transition: { duration, ease: [0.34, 1.56, 0.64, 1] }
          }
        };
      case 'slideInUp':
        return {
          hidden: { y: 100, opacity: 0 },
          visible: { 
            y: 0, 
            opacity: 1,
            transition: { duration, ease: [0.25, 0.46, 0.45, 0.94] }
          }
        };
      default:
        return {
          hidden: { opacity: 0, y: 20 },
          visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration, ease: [0.25, 0.46, 0.45, 0.94] }
          }
        };
    }
  };

  const itemVariants = getItemVariants();

  // If using GSAP, render without Framer Motion animations
  if (useGSAPAnimation) {
    return (
      <div
        ref={sectionRef}
        className={className}
        {...props}
      >
        {children}
      </div>
    );
  }

  // Use Framer Motion for animations
  return (
    <motion.div
      ref={sectionRef}
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate={isIntersecting ? "visible" : "hidden"}
      onAnimationComplete={() => {
        if (onAnimationComplete) {
          onAnimationComplete(sectionRef.current, entry);
        }
      }}
      {...props}
    >
      {stagger ? (
        React.Children.map(children, (child, index) => (
          <motion.div key={index} variants={itemVariants}>
            {child}
          </motion.div>
        ))
      ) : (
        <motion.div variants={itemVariants}>
          {children}
        </motion.div>
      )}
    </motion.div>
  );
};

export default AnimatedSection;