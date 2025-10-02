import { useState, useEffect, useRef, useCallback } from 'react';
import { useIntersectionObserver } from './useIntersectionObserver';

export const useProgressiveReveal = (options = {}) => {
  const [revealedElements, setRevealedElements] = useState(new Set());
  const [revealQueue, setRevealQueue] = useState([]);
  const [isRevealing, setIsRevealing] = useState(false);
  const timeoutRef = useRef(null);
  const queueRef = useRef([]);

  const {
    threshold = 0.1,
    rootMargin = '50px',
    revealDelay = 100,
    maxConcurrentReveals = 3,
    animationDuration = 600,
    animationClass = 'reveal-animation',
    onRevealStart = null,
    onRevealComplete = null,
    onAllRevealed = null
  } = options;

  const { observe, unobserve, isIntersecting } = useIntersectionObserver({
    threshold,
    rootMargin,
    triggerOnce: true
  });

  // Process reveal queue
  const processRevealQueue = useCallback(() => {
    if (isRevealing || queueRef.current.length === 0) return;

    setIsRevealing(true);
    const batch = queueRef.current.splice(0, maxConcurrentReveals);
    
    batch.forEach((element, index) => {
      setTimeout(() => {
        if (!revealedElements.has(element)) {
          // Add animation class
          element.classList.add(animationClass);
          
          // Update revealed elements
          setRevealedElements(prev => new Set([...prev, element]));
          
          // Call start callback
          if (onRevealStart) {
            onRevealStart(element, index);
          }
          
          // Listen for animation end
          const handleAnimationEnd = () => {
            if (onRevealComplete) {
              onRevealComplete(element);
            }
            element.removeEventListener('animationend', handleAnimationEnd);
            element.removeEventListener('transitionend', handleAnimationEnd);
          };
          
          element.addEventListener('animationend', handleAnimationEnd);
          element.addEventListener('transitionend', handleAnimationEnd);
        }
      }, index * revealDelay);
    });

    // Schedule next batch
    setTimeout(() => {
      setIsRevealing(false);
      if (queueRef.current.length > 0) {
        processRevealQueue();
      } else if (onAllRevealed && revealedElements.size > 0) {
        onAllRevealed();
      }
    }, animationDuration + (batch.length * revealDelay));
  }, [isRevealing, maxConcurrentReveals, revealDelay, animationDuration, animationClass, onRevealStart, onRevealComplete, onAllRevealed, revealedElements]);

  // Add element to reveal queue
  const queueForReveal = useCallback((element) => {
    if (!revealedElements.has(element) && !queueRef.current.includes(element)) {
      queueRef.current.push(element);
      setRevealQueue([...queueRef.current]);
      
      // Start processing if not already running
      if (!isRevealing) {
        processRevealQueue();
      }
    }
  }, [revealedElements, isRevealing, processRevealQueue]);

  // Observe element for progressive reveal
  const observeForReveal = useCallback((element, priority = 0) => {
    if (!element) return;

    // Set priority as data attribute for sorting
    element.dataset.revealPriority = priority.toString();
    
    observe(element, (entry) => {
      if (entry.isIntersecting) {
        queueForReveal(element);
        unobserve(element);
      }
    });
  }, [observe, unobserve, queueForReveal]);

  // Observe multiple elements with priority sorting
  const observeMultipleForReveal = useCallback((elements, priorityFn = null) => {
    const elementsWithPriority = elements.map((element, index) => ({
      element,
      priority: priorityFn ? priorityFn(element, index) : index
    }));

    // Sort by priority (higher priority first)
    elementsWithPriority.sort((a, b) => b.priority - a.priority);

    elementsWithPriority.forEach(({ element, priority }) => {
      observeForReveal(element, priority);
    });
  }, [observeForReveal]);

  // Reveal element immediately (bypass queue)
  const revealImmediately = useCallback((element) => {
    if (!revealedElements.has(element)) {
      element.classList.add(animationClass);
      setRevealedElements(prev => new Set([...prev, element]));
      
      if (onRevealStart) {
        onRevealStart(element, 0);
      }
      
      const handleAnimationEnd = () => {
        if (onRevealComplete) {
          onRevealComplete(element);
        }
        element.removeEventListener('animationend', handleAnimationEnd);
        element.removeEventListener('transitionend', handleAnimationEnd);
      };
      
      element.addEventListener('animationend', handleAnimationEnd);
      element.addEventListener('transitionend', handleAnimationEnd);
    }
  }, [revealedElements, animationClass, onRevealStart, onRevealComplete]);

  // Reset all reveals
  const resetReveals = useCallback(() => {
    revealedElements.forEach(element => {
      element.classList.remove(animationClass);
    });
    setRevealedElements(new Set());
    queueRef.current = [];
    setRevealQueue([]);
    setIsRevealing(false);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, [revealedElements, animationClass]);

  // Get reveal progress
  const getRevealProgress = useCallback((totalElements) => {
    return totalElements > 0 ? revealedElements.size / totalElements : 0;
  }, [revealedElements.size]);

  // Check if element is revealed
  const isRevealed = useCallback((element) => {
    return revealedElements.has(element);
  }, [revealedElements]);

  // Pause/resume revealing
  const pauseRevealing = useCallback(() => {
    setIsRevealing(true);
  }, []);

  const resumeRevealing = useCallback(() => {
    setIsRevealing(false);
    processRevealQueue();
  }, [processRevealQueue]);

  return {
    observeForReveal,
    observeMultipleForReveal,
    revealImmediately,
    resetReveals,
    pauseRevealing,
    resumeRevealing,
    getRevealProgress,
    isRevealed,
    revealedElements,
    revealQueue,
    isRevealing
  };
};

// Hook for section-based progressive reveal
export const useSectionReveal = (options = {}) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [revealedSections, setRevealedSections] = useState(new Set());
  const sectionsRef = useRef([]);

  const {
    sectionDelay = 500,
    autoReveal = true,
    revealOnScroll = true,
    ...revealOptions
  } = options;

  const {
    observeForReveal,
    revealImmediately,
    resetReveals,
    isRevealed
  } = useProgressiveReveal(revealOptions);

  // Register section
  const registerSection = useCallback((element, sectionIndex) => {
    if (!element) return;

    sectionsRef.current[sectionIndex] = element;
    
    if (revealOnScroll) {
      observeForReveal(element, -sectionIndex); // Negative for top-to-bottom reveal
    }
  }, [observeForReveal, revealOnScroll]);

  // Reveal section by index
  const revealSection = useCallback((sectionIndex) => {
    const element = sectionsRef.current[sectionIndex];
    if (element && !revealedSections.has(sectionIndex)) {
      revealImmediately(element);
      setRevealedSections(prev => new Set([...prev, sectionIndex]));
      setCurrentSection(sectionIndex);
    }
  }, [revealImmediately, revealedSections]);

  // Reveal next section
  const revealNextSection = useCallback(() => {
    const nextSection = currentSection + 1;
    if (nextSection < sectionsRef.current.length) {
      setTimeout(() => {
        revealSection(nextSection);
      }, sectionDelay);
    }
  }, [currentSection, sectionDelay, revealSection]);

  // Reveal all sections sequentially
  const revealAllSections = useCallback(() => {
    sectionsRef.current.forEach((_, index) => {
      setTimeout(() => {
        revealSection(index);
      }, index * sectionDelay);
    });
  }, [sectionDelay, revealSection]);

  // Reset all sections
  const resetAllSections = useCallback(() => {
    resetReveals();
    setRevealedSections(new Set());
    setCurrentSection(0);
  }, [resetReveals]);

  // Auto-reveal effect
  useEffect(() => {
    if (autoReveal && sectionsRef.current.length > 0) {
      revealSection(0);
    }
  }, [autoReveal, revealSection]);

  return {
    registerSection,
    revealSection,
    revealNextSection,
    revealAllSections,
    resetAllSections,
    currentSection,
    revealedSections,
    isRevealed: (sectionIndex) => revealedSections.has(sectionIndex)
  };
};

// Hook for text progressive reveal
export const useTextReveal = (options = {}) => {
  const [revealedChars, setRevealedChars] = useState(0);
  const [isRevealing, setIsRevealing] = useState(false);
  const intervalRef = useRef(null);

  const {
    revealSpeed = 50, // ms per character
    revealType = 'typewriter', // 'typewriter', 'fade', 'slide'
    onCharReveal = null,
    onComplete = null
  } = options;

  // Start text reveal
  const startReveal = useCallback((text, element) => {
    if (isRevealing) return;

    setIsRevealing(true);
    setRevealedChars(0);

    if (revealType === 'typewriter') {
      element.innerHTML = '';
      let charIndex = 0;

      intervalRef.current = setInterval(() => {
        if (charIndex < text.length) {
          element.innerHTML += text[charIndex];
          setRevealedChars(charIndex + 1);
          
          if (onCharReveal) {
            onCharReveal(text[charIndex], charIndex);
          }
          
          charIndex++;
        } else {
          clearInterval(intervalRef.current);
          setIsRevealing(false);
          if (onComplete) onComplete();
        }
      }, revealSpeed);
    } else if (revealType === 'fade') {
      const chars = text.split('').map((char, index) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.opacity = '0';
        span.style.transition = `opacity ${revealSpeed}ms ease`;
        return span;
      });

      element.innerHTML = '';
      chars.forEach(span => element.appendChild(span));

      let charIndex = 0;
      intervalRef.current = setInterval(() => {
        if (charIndex < chars.length) {
          chars[charIndex].style.opacity = '1';
          setRevealedChars(charIndex + 1);
          
          if (onCharReveal) {
            onCharReveal(text[charIndex], charIndex);
          }
          
          charIndex++;
        } else {
          clearInterval(intervalRef.current);
          setIsRevealing(false);
          if (onComplete) onComplete();
        }
      }, revealSpeed);
    }
  }, [isRevealing, revealType, revealSpeed, onCharReveal, onComplete]);

  // Stop reveal
  const stopReveal = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      setIsRevealing(false);
    }
  }, []);

  // Reset reveal
  const resetReveal = useCallback(() => {
    stopReveal();
    setRevealedChars(0);
  }, [stopReveal]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    startReveal,
    stopReveal,
    resetReveal,
    revealedChars,
    isRevealing
  };
};