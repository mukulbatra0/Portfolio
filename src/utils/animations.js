// Animation utility functions and presets

// Common animation presets
export const ANIMATION_PRESETS = {
  // Entrance animations
  fadeInUp: {
    from: { opacity: 0, y: 50 },
    to: { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
  },
  fadeInDown: {
    from: { opacity: 0, y: -50 },
    to: { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
  },
  fadeInLeft: {
    from: { opacity: 0, x: -50 },
    to: { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" }
  },
  fadeInRight: {
    from: { opacity: 0, x: 50 },
    to: { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" }
  },
  scaleIn: {
    from: { opacity: 0, scale: 0.8 },
    to: { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)" }
  },
  slideInUp: {
    from: { y: 100, opacity: 0 },
    to: { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
  },
  
  // Hover animations
  hoverScale: {
    scale: 1.05,
    duration: 0.3,
    ease: "power2.out"
  },
  hoverLift: {
    y: -10,
    scale: 1.02,
    duration: 0.3,
    ease: "power2.out"
  },
  hoverGlow: {
    filter: "brightness(1.1) saturate(1.2)",
    duration: 0.3,
    ease: "power2.out"
  },
  
  // Loading animations
  pulse: {
    scale: 1.1,
    duration: 1,
    ease: "power2.inOut",
    repeat: -1,
    yoyo: true
  },
  rotate: {
    rotation: 360,
    duration: 2,
    ease: "none",
    repeat: -1
  },
  
  // Text animations
  typewriter: {
    width: "100%",
    duration: 2,
    ease: "steps(40)"
  },
  
  // 3D animations
  rotate3D: {
    rotationY: 360,
    duration: 4,
    ease: "none",
    repeat: -1
  },
  float3D: {
    y: -20,
    duration: 2,
    ease: "power2.inOut",
    repeat: -1,
    yoyo: true
  }
};

// Stagger configurations
export const STAGGER_PRESETS = {
  default: {
    amount: 0.1,
    from: "start",
    ease: "power2.out"
  },
  center: {
    amount: 0.15,
    from: "center",
    ease: "back.out(1.7)"
  },
  random: {
    amount: 0.2,
    from: "random",
    ease: "power2.out"
  },
  edges: {
    amount: 0.1,
    from: "edges",
    ease: "power2.out"
  }
};

// ScrollTrigger configurations
export const SCROLL_TRIGGER_PRESETS = {
  default: {
    start: "top 80%",
    end: "bottom 20%",
    toggleActions: "play none none reverse"
  },
  scrub: {
    start: "top bottom",
    end: "bottom top",
    scrub: 1
  },
  pin: {
    start: "top top",
    end: "bottom top",
    pin: true,
    scrub: 1
  },
  batch: {
    start: "top 90%",
    end: "bottom 10%",
    toggleActions: "play none none none",
    batch: true
  }
};

// Create entrance animation for multiple elements
export const createEntranceSequence = (gsap, elements, config = {}) => {
  const {
    preset = 'fadeInUp',
    stagger = STAGGER_PRESETS.default,
    delay = 0,
    onComplete = null
  } = config;

  const animation = ANIMATION_PRESETS[preset];
  if (!animation) return null;

  // Set initial state
  gsap.set(elements, animation.from);

  // Create timeline
  const timeline = gsap.timeline({
    delay,
    onComplete
  });

  // Add staggered animation
  timeline.to(elements, {
    ...animation.to,
    stagger
  });

  return timeline;
};

// Create scroll-triggered animation sequence
export const createScrollSequence = (gsap, ScrollTrigger, elements, config = {}) => {
  const {
    trigger,
    preset = 'fadeInUp',
    scrollConfig = SCROLL_TRIGGER_PRESETS.default,
    stagger = STAGGER_PRESETS.default
  } = config;

  const animation = ANIMATION_PRESETS[preset];
  if (!animation) return null;

  // Set initial state
  gsap.set(elements, animation.from);

  // Create scroll-triggered animation
  return gsap.to(elements, {
    ...animation.to,
    stagger,
    scrollTrigger: {
      trigger: trigger || elements[0],
      ...scrollConfig
    }
  });
};

// Create hover animation system
export const createHoverSystem = (gsap, elements, config = {}) => {
  const {
    preset = 'hoverScale',
    duration = 0.3,
    ease = "power2.out"
  } = config;

  const hoverAnimation = ANIMATION_PRESETS[preset];
  const animations = [];

  elements.forEach(element => {
    let hoverTween = null;

    const handleMouseEnter = () => {
      if (hoverTween) hoverTween.kill();
      hoverTween = gsap.to(element, {
        ...hoverAnimation,
        duration,
        ease
      });
    };

    const handleMouseLeave = () => {
      if (hoverTween) hoverTween.kill();
      hoverTween = gsap.to(element, {
        scale: 1,
        y: 0,
        filter: "none",
        duration,
        ease
      });
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    animations.push({
      element,
      destroy: () => {
        element.removeEventListener('mouseenter', handleMouseEnter);
        element.removeEventListener('mouseleave', handleMouseLeave);
        if (hoverTween) hoverTween.kill();
      }
    });
  });

  return {
    destroy: () => {
      animations.forEach(anim => anim.destroy());
    }
  };
};

// Create loading animation
export const createLoadingAnimation = (gsap, element, config = {}) => {
  const {
    type = 'pulse',
    duration = 1,
    ease = "power2.inOut"
  } = config;

  const animation = ANIMATION_PRESETS[type];
  if (!animation) return null;

  return gsap.to(element, {
    ...animation,
    duration,
    ease
  });
};

// Create text reveal animation
export const createTextReveal = (gsap, element, config = {}) => {
  const {
    type = 'typewriter',
    duration = 2,
    stagger = 0.05,
    ease = "none"
  } = config;

  const text = element.textContent;
  element.innerHTML = '';

  if (type === 'typewriter') {
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

  if (type === 'slideUp') {
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

    return gsap.to(wordSpans, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger,
      ease: "power2.out"
    });
  }

  if (type === 'reveal') {
    element.style.overflow = 'hidden';
    element.style.position = 'relative';
    
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: currentColor;
      transform-origin: left;
    `;
    element.appendChild(overlay);

    const timeline = gsap.timeline();
    timeline.to(overlay, {
      scaleX: 0,
      duration,
      ease: "power2.inOut",
      transformOrigin: "right"
    });

    return timeline;
  }

  return null;
};

// Create 3D animation system
export const create3DAnimation = (gsap, elements, config = {}) => {
  const {
    type = 'float',
    duration = 4,
    ease = "power2.inOut",
    stagger = 0.2
  } = config;

  if (type === 'float') {
    return gsap.to(elements, {
      y: -20,
      duration,
      ease,
      repeat: -1,
      yoyo: true,
      stagger
    });
  }

  if (type === 'rotate') {
    return gsap.to(elements, {
      rotationY: 360,
      duration,
      ease: "none",
      repeat: -1,
      stagger
    });
  }

  if (type === 'orbit') {
    const timeline = gsap.timeline({ repeat: -1 });
    
    elements.forEach((element, index) => {
      const angle = (index / elements.length) * 360;
      timeline.to(element, {
        rotation: angle + 360,
        transformOrigin: "50px 50px",
        duration,
        ease: "none"
      }, 0);
    });

    return timeline;
  }

  return null;
};

// Performance-optimized animation
export const createOptimizedAnimation = (gsap, elements, config = {}) => {
  const {
    preset = 'fadeInUp',
    force3D = true,
    willChange = true
  } = config;

  const animation = ANIMATION_PRESETS[preset];
  if (!animation) return null;

  // Set performance optimizations
  if (willChange) {
    elements.forEach(element => {
      element.style.willChange = 'transform, opacity';
    });
  }

  // Create optimized animation
  const tween = gsap.fromTo(elements, animation.from, {
    ...animation.to,
    force3D,
    onComplete: () => {
      // Clean up will-change after animation
      if (willChange) {
        elements.forEach(element => {
          element.style.willChange = 'auto';
        });
      }
    }
  });

  return tween;
};

// Utility function to kill all animations on elements
export const killAnimations = (gsap, elements) => {
  if (Array.isArray(elements)) {
    elements.forEach(element => {
      gsap.killTweensOf(element);
    });
  } else {
    gsap.killTweensOf(elements);
  }
};

// Create responsive animation that adapts to screen size
export const createResponsiveAnimation = (gsap, elements, config = {}) => {
  const {
    desktop = {},
    tablet = {},
    mobile = {}
  } = config;

  const getScreenSize = () => {
    const width = window.innerWidth;
    if (width >= 1024) return 'desktop';
    if (width >= 768) return 'tablet';
    return 'mobile';
  };

  const currentConfig = {
    desktop,
    tablet,
    mobile
  }[getScreenSize()];

  return createOptimizedAnimation(gsap, elements, currentConfig);
};