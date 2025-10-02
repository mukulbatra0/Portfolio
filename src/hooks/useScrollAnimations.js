import { useEffect, useRef, useCallback } from 'react';
import { useGSAP } from './useGSAP';
import { ANIMATION_PRESETS, SCROLL_TRIGGER_PRESETS, createScrollSequence } from '../utils/animations';

export const useScrollAnimations = (options = {}) => {
  const {
    enableBatchAnimations = true,
    enableParallax = true,
    enablePinning = false,
    refreshOnResize = true
  } = options;

  const { gsap, ScrollTrigger, isLoaded } = useGSAP({
    enableScrollTrigger: true
  });

  const animationsRef = useRef([]);
  const observersRef = useRef([]);

  // Create scroll-triggered animation
  const createScrollAnimation = useCallback((elements, config = {}) => {
    if (!gsap || !ScrollTrigger || !isLoaded) return null;

    const {
      trigger,
      animation = 'fadeInUp',
      scrollConfig = SCROLL_TRIGGER_PRESETS.default,
      stagger = 0.1,
      batch = false,
      onEnter = null,
      onLeave = null,
      onEnterBack = null,
      onLeaveBack = null
    } = config;

    const animationPreset = ANIMATION_PRESETS[animation];
    if (!animationPreset) return null;

    // Set initial state
    gsap.set(elements, animationPreset.from);

    let scrollTriggerConfig = {
      trigger: trigger || elements[0],
      ...scrollConfig,
      onEnter: () => {
        if (onEnter) onEnter();
      },
      onLeave: () => {
        if (onLeave) onLeave();
      },
      onEnterBack: () => {
        if (onEnterBack) onEnterBack();
      },
      onLeaveBack: () => {
        if (onLeaveBack) onLeaveBack();
      }
    };

    let animation_tween;

    if (batch && enableBatchAnimations) {
      // Use ScrollTrigger.batch for better performance with many elements
      ScrollTrigger.batch(elements, {
        ...scrollTriggerConfig,
        onEnter: (elements) => {
          gsap.to(elements, {
            ...animationPreset.to,
            stagger
          });
          if (onEnter) onEnter(elements);
        },
        onLeave: (elements) => {
          if (scrollConfig.toggleActions?.includes('reverse')) {
            gsap.to(elements, {
              ...animationPreset.from,
              stagger
            });
          }
          if (onLeave) onLeave(elements);
        }
      });
    } else {
      // Regular ScrollTrigger animation
      animation_tween = gsap.to(elements, {
        ...animationPreset.to,
        stagger,
        scrollTrigger: scrollTriggerConfig
      });
    }

    // Store animation reference for cleanup
    const animationRef = {
      elements,
      animation: animation_tween,
      scrollTrigger: scrollTriggerConfig,
      destroy: () => {
        if (animation_tween) animation_tween.kill();
        ScrollTrigger.getAll().forEach(trigger => {
          if (trigger.trigger === (trigger || elements[0])) {
            trigger.kill();
          }
        });
      }
    };

    animationsRef.current.push(animationRef);
    return animationRef;
  }, [gsap, ScrollTrigger, isLoaded, enableBatchAnimations]);

  // Create parallax effect
  const createParallax = useCallback((elements, config = {}) => {
    if (!gsap || !ScrollTrigger || !isLoaded || !enableParallax) return null;

    const {
      speed = 0.5,
      direction = 'vertical',
      trigger,
      start = 'top bottom',
      end = 'bottom top'
    } = config;

    const animations = [];

    elements.forEach(element => {
      const yPercent = direction === 'vertical' ? -100 * speed : 0;
      const xPercent = direction === 'horizontal' ? -100 * speed : 0;

      const animation = gsap.to(element, {
        yPercent,
        xPercent,
        ease: 'none',
        scrollTrigger: {
          trigger: trigger || element,
          start,
          end,
          scrub: true
        }
      });

      animations.push(animation);
    });

    const parallaxRef = {
      elements,
      animations,
      destroy: () => {
        animations.forEach(anim => anim.kill());
      }
    };

    animationsRef.current.push(parallaxRef);
    return parallaxRef;
  }, [gsap, ScrollTrigger, isLoaded, enableParallax]);

  // Create pinned section
  const createPinnedSection = useCallback((element, config = {}) => {
    if (!gsap || !ScrollTrigger || !isLoaded || !enablePinning) return null;

    const {
      start = 'top top',
      end = 'bottom top',
      pinSpacing = true,
      anticipatePin = 1
    } = config;

    const animation = ScrollTrigger.create({
      trigger: element,
      start,
      end,
      pin: true,
      pinSpacing,
      anticipatePin
    });

    const pinnedRef = {
      element,
      animation,
      destroy: () => {
        animation.kill();
      }
    };

    animationsRef.current.push(pinnedRef);
    return pinnedRef;
  }, [gsap, ScrollTrigger, isLoaded, enablePinning]);

  // Create text reveal animation on scroll
  const createTextRevealOnScroll = useCallback((elements, config = {}) => {
    if (!gsap || !ScrollTrigger || !isLoaded) return null;

    const {
      trigger,
      start = 'top 80%',
      end = 'bottom 20%',
      stagger = 0.1,
      duration = 0.8
    } = config;

    const animations = [];

    elements.forEach(element => {
      const text = element.textContent;
      const words = text.split(' ');
      element.innerHTML = '';

      const wordSpans = words.map(word => {
        const span = document.createElement('span');
        span.textContent = word + ' ';
        span.style.opacity = '0';
        span.style.transform = 'translateY(20px)';
        span.style.display = 'inline-block';
        element.appendChild(span);
        return span;
      });

      const animation = gsap.to(wordSpans, {
        opacity: 1,
        y: 0,
        duration,
        stagger,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: trigger || element,
          start,
          end,
          toggleActions: 'play none none reverse'
        }
      });

      animations.push(animation);
    });

    const textRevealRef = {
      elements,
      animations,
      destroy: () => {
        animations.forEach(anim => anim.kill());
      }
    };

    animationsRef.current.push(textRevealRef);
    return textRevealRef;
  }, [gsap, ScrollTrigger, isLoaded]);

  // Create counter animation on scroll
  const createCounterAnimation = useCallback((elements, config = {}) => {
    if (!gsap || !ScrollTrigger || !isLoaded) return null;

    const {
      trigger,
      start = 'top 80%',
      duration = 2,
      ease = 'power2.out'
    } = config;

    const animations = [];

    elements.forEach(element => {
      const endValue = parseInt(element.textContent) || 0;
      const obj = { value: 0 };

      const animation = gsap.to(obj, {
        value: endValue,
        duration,
        ease,
        onUpdate: () => {
          element.textContent = Math.round(obj.value);
        },
        scrollTrigger: {
          trigger: trigger || element,
          start,
          toggleActions: 'play none none reverse'
        }
      });

      animations.push(animation);
    });

    const counterRef = {
      elements,
      animations,
      destroy: () => {
        animations.forEach(anim => anim.kill());
      }
    };

    animationsRef.current.push(counterRef);
    return counterRef;
  }, [gsap, ScrollTrigger, isLoaded]);

  // Create morphing path animation
  const createMorphingPath = useCallback((pathElement, config = {}) => {
    if (!gsap || !ScrollTrigger || !isLoaded) return null;

    const {
      paths = [],
      trigger,
      start = 'top center',
      end = 'bottom center',
      scrub = true
    } = config;

    if (paths.length < 2) return null;

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: trigger || pathElement,
        start,
        end,
        scrub
      }
    });

    for (let i = 0; i < paths.length - 1; i++) {
      timeline.to(pathElement, {
        attr: { d: paths[i + 1] },
        duration: 1,
        ease: 'power2.inOut'
      });
    }

    const morphRef = {
      element: pathElement,
      timeline,
      destroy: () => {
        timeline.kill();
      }
    };

    animationsRef.current.push(morphRef);
    return morphRef;
  }, [gsap, ScrollTrigger, isLoaded]);

  // Refresh all ScrollTriggers
  const refreshScrollTriggers = useCallback(() => {
    if (ScrollTrigger) {
      ScrollTrigger.refresh();
    }
  }, [ScrollTrigger]);

  // Kill all scroll animations
  const killAllScrollAnimations = useCallback(() => {
    animationsRef.current.forEach(animRef => {
      if (animRef.destroy) {
        animRef.destroy();
      }
    });
    animationsRef.current = [];

    if (ScrollTrigger) {
      ScrollTrigger.killAll();
    }
  }, [ScrollTrigger]);

  // Setup resize handler
  useEffect(() => {
    if (!refreshOnResize) return;

    const handleResize = () => {
      refreshScrollTriggers();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [refreshOnResize, refreshScrollTriggers]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      killAllScrollAnimations();
    };
  }, [killAllScrollAnimations]);

  return {
    createScrollAnimation,
    createParallax,
    createPinnedSection,
    createTextRevealOnScroll,
    createCounterAnimation,
    createMorphingPath,
    refreshScrollTriggers,
    killAllScrollAnimations,
    isLoaded
  };
};