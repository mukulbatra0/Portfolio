import { useState, useEffect, useCallback } from 'react';

export const useAssetLoader = () => {
  const [loadingStates, setLoadingStates] = useState({});
  const [loadedAssets, setLoadedAssets] = useState({});
  const [errors, setErrors] = useState({});

  // Load image with WebP support detection
  const loadImage = useCallback(async (src, fallbackSrc = null) => {
    const assetId = src;
    
    setLoadingStates(prev => ({ ...prev, [assetId]: true }));
    setErrors(prev => ({ ...prev, [assetId]: null }));

    try {
      // Check WebP support
      const supportsWebP = await checkWebPSupport();
      
      // Use WebP version if supported and available
      let imageSrc = src;
      if (supportsWebP && src.includes('.jpg') || src.includes('.png')) {
        const webpSrc = src.replace(/\.(jpg|png)$/, '.webp');
        try {
          await testImageLoad(webpSrc);
          imageSrc = webpSrc;
        } catch {
          // Fallback to original format
          imageSrc = src;
        }
      }

      const img = await loadImageElement(imageSrc);
      
      setLoadedAssets(prev => ({ ...prev, [assetId]: img }));
      setLoadingStates(prev => ({ ...prev, [assetId]: false }));
      
      return img;
    } catch (error) {
      // Try fallback if provided
      if (fallbackSrc) {
        try {
          const img = await loadImageElement(fallbackSrc);
          setLoadedAssets(prev => ({ ...prev, [assetId]: img }));
          setLoadingStates(prev => ({ ...prev, [assetId]: false }));
          return img;
        } catch (fallbackError) {
          setErrors(prev => ({ ...prev, [assetId]: fallbackError }));
        }
      } else {
        setErrors(prev => ({ ...prev, [assetId]: error }));
      }
      
      setLoadingStates(prev => ({ ...prev, [assetId]: false }));
      throw error;
    }
  }, []);

  // Load multiple images with progress tracking
  const loadImages = useCallback(async (imageList, onProgress = null) => {
    const results = {};
    let loaded = 0;
    
    const loadPromises = imageList.map(async (item) => {
      const { src, fallback, id } = typeof item === 'string' ? { src: item, id: item } : item;
      
      try {
        const img = await loadImage(src, fallback);
        results[id] = img;
        loaded++;
        if (onProgress) onProgress(loaded / imageList.length);
      } catch (error) {
        results[id] = null;
        loaded++;
        if (onProgress) onProgress(loaded / imageList.length);
      }
    });

    await Promise.all(loadPromises);
    return results;
  }, [loadImage]);

  // Preload critical assets
  const preloadAssets = useCallback(async (assetList) => {
    const preloadPromises = assetList.map(async (asset) => {
      if (asset.type === 'image') {
        return loadImage(asset.src, asset.fallback);
      } else if (asset.type === 'font') {
        return loadFont(asset.family, asset.src);
      }
      // Add more asset types as needed
    });

    try {
      await Promise.all(preloadPromises);
    } catch (error) {
      console.warn('Some assets failed to preload:', error);
    }
  }, [loadImage]);

  // Lazy load assets with intersection observer
  const useLazyLoad = useCallback((ref, src, options = {}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [asset, setAsset] = useState(null);

    useEffect(() => {
      if (!ref.current) return;

      const observer = new IntersectionObserver(
        async ([entry]) => {
          if (entry.isIntersecting && !isLoaded) {
            try {
              const loadedAsset = await loadImage(src, options.fallback);
              setAsset(loadedAsset);
              setIsLoaded(true);
              observer.disconnect();
            } catch (error) {
              console.error('Failed to lazy load asset:', error);
            }
          }
        },
        { threshold: options.threshold || 0.1 }
      );

      observer.observe(ref.current);
      return () => observer.disconnect();
    }, [ref, src, options.fallback, options.threshold, isLoaded]);

    return { asset, isLoaded, isLoading: loadingStates[src] };
  }, [loadImage, loadingStates]);

  return {
    loadImage,
    loadImages,
    preloadAssets,
    useLazyLoad,
    loadingStates,
    loadedAssets,
    errors
  };
};

// Helper functions
const checkWebPSupport = () => {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
};

const testImageLoad = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

const loadImageElement = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

const loadFont = (family, src) => {
  return new Promise((resolve, reject) => {
    const font = new FontFace(family, `url(${src})`);
    font.load().then(() => {
      document.fonts.add(font);
      resolve(font);
    }).catch(reject);
  });
};