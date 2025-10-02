import { useState, useEffect, useRef, useCallback } from 'react';

export const useIntersectionObserver = (options = {}) => {
  const [entries, setEntries] = useState([]);
  const [isSupported, setIsSupported] = useState(true);
  const observerRef = useRef(null);
  const elementsRef = useRef(new Map());
  const callbacksRef = useRef(new Map());

  const {
    threshold = 0.1,
    rootMargin = '0px',
    root = null,
    triggerOnce = false,
    skip = false
  } = options;

  // Initialize Intersection Observer
  useEffect(() => {
    if (skip) return;

    // Check if Intersection Observer is supported
    if (!window.IntersectionObserver) {
      setIsSupported(false);
      console.warn('Intersection Observer is not supported in this browser');
      return;
    }

    const handleIntersection = (observerEntries) => {
      const newEntries = [];
      
      observerEntries.forEach(entry => {
        const element = entry.target;
        const elementId = elementsRef.current.get(element);
        const callback = callbacksRef.current.get(element);
        
        // Update entries state
        newEntries.push({
          ...entry,
          id: elementId
        });
        
        // Execute callback if provided
        if (callback) {
          callback(entry);
        }
        
        // If triggerOnce is true and element is intersecting, unobserve it
        if (triggerOnce && entry.isIntersecting && observerRef.current) {
          observerRef.current.unobserve(element);
          elementsRef.current.delete(element);
          callbacksRef.current.delete(element);
        }
      });
      
      setEntries(prev => {
        const updatedEntries = [...prev];
        
        newEntries.forEach(newEntry => {
          const existingIndex = updatedEntries.findIndex(
            entry => entry.target === newEntry.target
          );
          
          if (existingIndex >= 0) {
            updatedEntries[existingIndex] = newEntry;
          } else {
            updatedEntries.push(newEntry);
          }
        });
        
        return updatedEntries;
      });
    };

    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
      root
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [threshold, rootMargin, root, triggerOnce, skip]);

  // Observe element
  const observe = useCallback((element, callback = null, id = null) => {
    if (!observerRef.current || !element || !isSupported) return;

    const elementId = id || `element-${Date.now()}-${Math.random()}`;
    
    elementsRef.current.set(element, elementId);
    if (callback) {
      callbacksRef.current.set(element, callback);
    }
    
    observerRef.current.observe(element);
    
    return elementId;
  }, [isSupported]);

  // Unobserve element
  const unobserve = useCallback((element) => {
    if (!observerRef.current || !element) return;

    observerRef.current.unobserve(element);
    elementsRef.current.delete(element);
    callbacksRef.current.delete(element);
    
    setEntries(prev => prev.filter(entry => entry.target !== element));
  }, []);

  // Disconnect observer
  const disconnect = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      elementsRef.current.clear();
      callbacksRef.current.clear();
      setEntries([]);
    }
  }, []);

  // Get entry for specific element
  const getEntry = useCallback((element) => {
    return entries.find(entry => entry.target === element);
  }, [entries]);

  // Check if element is intersecting
  const isIntersecting = useCallback((element) => {
    const entry = getEntry(element);
    return entry ? entry.isIntersecting : false;
  }, [getEntry]);

  // Get intersection ratio for element
  const getIntersectionRatio = useCallback((element) => {
    const entry = getEntry(element);
    return entry ? entry.intersectionRatio : 0;
  }, [getEntry]);

  return {
    entries,
    observe,
    unobserve,
    disconnect,
    getEntry,
    isIntersecting,
    getIntersectionRatio,
    isSupported
  };
};

// Hook for single element observation
export const useIntersectionObserverSingle = (elementRef, options = {}) => {
  const [entry, setEntry] = useState(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const observerRef = useRef(null);

  const {
    threshold = 0.1,
    rootMargin = '0px',
    root = null,
    triggerOnce = false,
    skip = false,
    onIntersect = null,
    onLeave = null
  } = options;

  useEffect(() => {
    if (skip || !elementRef.current) return;

    if (!window.IntersectionObserver) {
      console.warn('Intersection Observer is not supported');
      return;
    }

    const handleIntersection = ([entry]) => {
      setEntry(entry);
      setIsIntersecting(entry.isIntersecting);
      
      if (entry.isIntersecting && onIntersect) {
        onIntersect(entry);
      } else if (!entry.isIntersecting && onLeave) {
        onLeave(entry);
      }
      
      if (triggerOnce && entry.isIntersecting && observerRef.current) {
        observerRef.current.disconnect();
      }
    };

    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
      root
    });

    observerRef.current.observe(elementRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [elementRef, threshold, rootMargin, root, triggerOnce, skip, onIntersect, onLeave]);

  return {
    entry,
    isIntersecting,
    intersectionRatio: entry?.intersectionRatio || 0
  };
};

// Hook for batch element observation with animations
export const useIntersectionAnimation = (options = {}) => {
  const [animatedElements, setAnimatedElements] = useState(new Set());
  const observerRef = useRef(null);
  const elementsRef = useRef(new Map());

  const {
    threshold = 0.1,
    rootMargin = '50px',
    triggerOnce = true,
    animationClass = 'animate-in',
    animationDelay = 0,
    staggerDelay = 100,
    onAnimationStart = null,
    onAnimationComplete = null
  } = options;

  useEffect(() => {
    if (!window.IntersectionObserver) return;

    const handleIntersection = (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const elementData = elementsRef.current.get(element);
          
          if (!animatedElements.has(element)) {
            const delay = animationDelay + (elementData?.index || index) * staggerDelay;
            
            setTimeout(() => {
              element.classList.add(animationClass);
              setAnimatedElements(prev => new Set([...prev, element]));
              
              if (onAnimationStart) {
                onAnimationStart(element, entry);
              }
              
              // Listen for animation end
              const handleAnimationEnd = () => {
                if (onAnimationComplete) {
                  onAnimationComplete(element, entry);
                }
                element.removeEventListener('animationend', handleAnimationEnd);
                element.removeEventListener('transitionend', handleAnimationEnd);
              };
              
              element.addEventListener('animationend', handleAnimationEnd);
              element.addEventListener('transitionend', handleAnimationEnd);
            }, delay);
            
            if (triggerOnce) {
              observerRef.current.unobserve(element);
              elementsRef.current.delete(element);
            }
          }
        }
      });
    };

    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [threshold, rootMargin, triggerOnce, animationClass, animationDelay, staggerDelay, onAnimationStart, onAnimationComplete, animatedElements]);

  const observeElement = useCallback((element, index = 0) => {
    if (!observerRef.current || !element) return;

    elementsRef.current.set(element, { index });
    observerRef.current.observe(element);
  }, []);

  const observeElements = useCallback((elements) => {
    elements.forEach((element, index) => {
      observeElement(element, index);
    });
  }, [observeElement]);

  const unobserveElement = useCallback((element) => {
    if (!observerRef.current || !element) return;

    observerRef.current.unobserve(element);
    elementsRef.current.delete(element);
  }, []);

  const resetAnimations = useCallback(() => {
    animatedElements.forEach(element => {
      element.classList.remove(animationClass);
    });
    setAnimatedElements(new Set());
  }, [animatedElements, animationClass]);

  return {
    observeElement,
    observeElements,
    unobserveElement,
    resetAnimations,
    animatedElements
  };
};

// Hook for progressive image loading with intersection observer
export const useProgressiveImageLoading = (options = {}) => {
  const [loadedImages, setLoadedImages] = useState(new Set());
  const observerRef = useRef(null);

  const {
    threshold = 0.1,
    rootMargin = '50px',
    loadingClass = 'loading',
    loadedClass = 'loaded',
    errorClass = 'error'
  } = options;

  useEffect(() => {
    if (!window.IntersectionObserver) return;

    const handleIntersection = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.dataset.src;
          
          if (src && !loadedImages.has(img)) {
            img.classList.add(loadingClass);
            
            const imageLoader = new Image();
            
            imageLoader.onload = () => {
              img.src = src;
              img.classList.remove(loadingClass);
              img.classList.add(loadedClass);
              setLoadedImages(prev => new Set([...prev, img]));
            };
            
            imageLoader.onerror = () => {
              img.classList.remove(loadingClass);
              img.classList.add(errorClass);
            };
            
            imageLoader.src = src;
            observerRef.current.unobserve(img);
          }
        }
      });
    };

    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [threshold, rootMargin, loadingClass, loadedClass, errorClass, loadedImages]);

  const observeImage = useCallback((img) => {
    if (!observerRef.current || !img) return;
    observerRef.current.observe(img);
  }, []);

  const observeImages = useCallback((images) => {
    images.forEach(img => observeImage(img));
  }, [observeImage]);

  return {
    observeImage,
    observeImages,
    loadedImages
  };
};