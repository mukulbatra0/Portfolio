import { useEffect, useRef, useCallback, useState } from 'react';

export const useGSAP = (options = {}) => {
  const [gsap, setGsap] = useState(null);
  const [ScrollTrigger, setScrollTrigger] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const timelinesRef = useRef(new Map());
  const elementsRef = useRef(new Map());

  const {
    enableScrollTrigger = true,
    enableTimeline = true,
    autoCleanup = true
  } = options;

  // Load GSAP dynamically
  useEffect(() => {
    const loadGSAP = async () => {
      try {
        // Dynamic import to reduce initial bundle size
        const gsapModule = await import('gsap');
        const gsapInstance = gsapModule.gsap || gsapModule.default;
        
        setGsap(gsapInstance);

        // Load ScrollTrigger if enabled
        if (enableScrollTrigger) {
          const scrollTriggerModule = await import('gsap/ScrollTrigger');
          const ScrollTriggerInstance = scrollTriggerModule.ScrollTrigger || scrollTriggerModule.default;
          
          gsapInstance.registerPlugin(ScrollTriggerInstance);
          setScrollTrigger(ScrollTriggerInstance);
        }

        setIsLoaded(true);
      } catch (error) {
        console.error('Failed to load GSAP:', error);
      }
    };

    loadGSAP();
  }, [enableScrollTrigger]);

  // Create timeline
  const createTimeline = useCallback((id, config = {}) => {
    if (!gsap || !isLoaded) return null;

    const timeline = gsap.timeline(config);
    timelinesRef.current.set(id, timeline);
    
    return timeline;
  }, [gsap, isLoaded]);

  // Get timeline by ID
  const getTimeline = useCallback((id) => {
    return timelinesRef.current.get(id);
  }, []);

  // Animate element with GSAP
  const animate = useCallback((target, vars, timelineId = null) => {
    if (!gsap || !isLoaded) return null;

    if (timelineId) {
      const timeline = getTimeline(timelineId);
      if (timeline) {
        return timeline.to(target, vars);
      }
    }

    return gsap.to(target, vars);
  }, [gsap, isLoaded, getTimeline]);

  // Animate from initial state
  const animateFrom = useCallback((target, vars, timelineId = null) => {
    if (!gsap || !isLoaded) return null;

    if (timelineId) {
      const timeline = getTimeline(timelineId);
      if (timeline) {
        return timeline.from(target, vars);
      }
    }

    return gsap.from(target, vars);
  }, [gsap, isLoaded, getTimeline]);

  // Animate from-to
  const animateFromTo = useCallback((target, fromVars, toVars, timelineId = null) => {
    if (!gsap || !isLoaded) return null;

    if (timelineId) {
      const timeline = getTimeline(timelineId);
      if (timeline) {
        return timeline.fromTo(target, fromVars, toVars);
      }
    }

    return gsap.fromTo(target, fromVars, toVars);
  }, [gsap, isLoaded, getTimeline]);

  // Set immediate values
  const set = useCallback((target, vars) => {
    if (!gsap || !isLoaded) return null;
    return gsap.set(target, vars);
  }, [gsap, isLoaded]);

  // Create staggered animation
  const stagger = useCallback((targets, vars, staggerConfig = {}) => {
    if (!gsap || !isLoaded) return null;

    const {
      amount = 0.1,
      from = 'start',
      ease = 'power2.out'
    } = staggerConfig;

    return gsap.to(targets, {
      ...vars,
      stagger: {
        amount,
        from,
        ease
      }
    });
  }, [gsap, isLoaded]);

  // Create scroll-triggered animation
  const scrollTriggerAnimation = useCallback((target, vars, triggerConfig = {}) => {
    if (!gsap || !ScrollTrigger || !isLoaded) return null;

    const {
      trigger = target,
      start = 'top 80%',
      end = 'bottom 20%',
      scrub = false,
      toggleActions = 'play none none reverse',
      ...otherConfig
    } = triggerConfig;

    return gsap.to(target, {
      ...vars,
      scrollTrigger: {
        trigger,
        start,
        end,
        scrub,
        toggleActions,
        ...otherConfig
      }
    });
  }, [gsap, ScrollTrigger, isLoaded]);

  // Create entrance animation
  const createEntranceAnimation = useCallback((elements, config = {}) => {
    if (!gsap || !isLoaded) return null;

    const {
      duration = 0.8,
      stagger = 0.1,
      ease = 'power2.out',
      y = 50,
      opacity = 0,
      scale = 0.8,
      rotation = 0
    } = config;

    // Set initial state
    gsap.set(elements, {
      y,
      opacity,
      scale,
      rotation
    });

    // Create entrance timeline
    const timeline = gsap.timeline();
    
    timeline.to(elements, {
      y: 0,
      opacity: 1,
      scale: 1,
      rotation: 0,
      duration,
      ease,
      stagger
    });

    return timeline;
  }, [gsap, isLoaded]);

  // Create hover animation
  const createHoverAnimation = useCallback((element, config = {}) => {
    if (!gsap || !isLoaded) return null;

    const {
      scale = 1.05,
      duration = 0.3,
      ease = 'power2.out',
      ...otherProps
    } = config;

    let hoverTween = null;

    const handleMouseEnter = () => {
      if (hoverTween) hoverTween.kill();
      hoverTween = gsap.to(element, {
        scale,
        duration,
        ease,
        ...otherProps
      });
    };

    const handleMouseLeave = () => {
      if (hoverTween) hoverTween.kill();
      hoverTween = gsap.to(element, {
        scale: 1,
        duration,
        ease,
        ...Object.keys(otherProps).reduce((acc, key) => {
          acc[key] = 0; // Reset to default values
          return acc;
        }, {})
      });
    };

    if (element) {
      element.addEventListener('mouseenter', handleMouseEnter);
      element.addEventListener('mouseleave', handleMouseLeave);
    }

    return {
      destroy: () => {
        if (element) {
          element.removeEventListener('mouseenter', handleMouseEnter);
          element.removeEventListener('mouseleave', handleMouseLeave);
        }
        if (hoverTween) hoverTween.kill();
      }
    };
  }, [gsap, isLoaded]);

  // Create morphing text animation
  const createTextAnimation = useCallback((element, config = {}) => {
    if (!gsap || !isLoaded) return null;

    const {
      type = 'typewriter',
      duration = 2,
      ease = 'none',
      stagger = 0.05
    } = config;

    if (type === 'typewriter') {
      const text = element.textContent;
      element.innerHTML = '';
      
      const chars = text.split('').map(char => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.opacity = '0';
        element.appendChild(span);
        return span;
      });

      return gsap.to(chars, {
        opacity: 1,
        duration: 0.05,
        stagger,
        ease
      });
    }

    if (type === 'fadeIn') {
      const words = element.textContent.split(' ');
      element.innerHTML = '';
      
      const wordSpans = words.map(word => {
        const span = document.createElement('span');
        span.textContent = word + ' ';
        span.style.opacity = '0';
        span.style.display = 'inline-block';
        element.appendChild(span);
        return span;
      });

      return gsap.to(wordSpans, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger,
        ease
      });
    }

    return null;
  }, [gsap, isLoaded]);

  // Kill all animations
  const killAll = useCallback(() => {
    if (!gsap) return;

    // Kill all timelines
    timelinesRef.current.forEach(timeline => {
      timeline.kill();
    });
    timelinesRef.current.clear();

    // Kill all GSAP tweens
    gsap.killTweensOf('*');
  }, [gsap]);

  // Refresh ScrollTrigger
  const refreshScrollTrigger = useCallback(() => {
    if (ScrollTrigger) {
      ScrollTrigger.refresh();
    }
  }, [ScrollTrigger]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoCleanup) {
        killAll();
        if (ScrollTrigger) {
          ScrollTrigger.killAll();
        }
      }
    };
  }, [autoCleanup, killAll, ScrollTrigger]);

  return {
    gsap,
    ScrollTrigger,
    isLoaded,
    createTimeline,
    getTimeline,
    animate,
    animateFrom,
    animateFromTo,
    set,
    stagger,
    scrollTriggerAnimation,
    createEntranceAnimation,
    createHoverAnimation,
    createTextAnimation,
    killAll,
    refreshScrollTrigger
  };
};