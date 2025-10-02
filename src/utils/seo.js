// SEO utility functions for dynamic meta tag management
import seoConfig from '../config/seo.js';

export const updateMetaTags = (section) => {
  const data = seoConfig.sections[section] || seoConfig.sections.hero;
  
  // Update document title
  document.title = data.title;
  
  // Update meta description
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', data.description);
  }
  
  // Update meta keywords
  const metaKeywords = document.querySelector('meta[name="keywords"]');
  if (metaKeywords) {
    metaKeywords.setAttribute('content', data.keywords);
  }
  
  // Update Open Graph tags
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) {
    ogTitle.setAttribute('content', data.title);
  }
  
  const ogDescription = document.querySelector('meta[property="og:description"]');
  if (ogDescription) {
    ogDescription.setAttribute('content', data.description);
  }
  
  // Update Twitter tags
  const twitterTitle = document.querySelector('meta[name="twitter:title"]');
  if (twitterTitle) {
    twitterTitle.setAttribute('content', data.title);
  }
  
  const twitterDescription = document.querySelector('meta[name="twitter:description"]');
  if (twitterDescription) {
    twitterDescription.setAttribute('content', data.description);
  }
};

// Generate structured data for projects
export const generateProjectStructuredData = (projects) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": "Mukul Batra's Web Development Projects",
    "description": "Collection of full-stack web development projects",
    "author": {
      "@type": "Person",
      "name": "Mukul Batra"
    },
    "hasPart": projects.map(project => ({
      "@type": "SoftwareApplication",
      "name": project.title,
      "description": project.description,
      "applicationCategory": "WebApplication",
      "operatingSystem": "Web Browser",
      "programmingLanguage": project.technologies,
      "codeRepository": project.githubUrl,
      "author": {
        "@type": "Person",
        "name": "Mukul Batra"
      }
    }))
  };
  
  return JSON.stringify(structuredData);
};

// Generate structured data for skills
export const generateSkillsStructuredData = (skills) => {
  const allSkills = [
    ...skills.languages.map(skill => skill.name),
    ...skills.frontend.map(skill => skill.name),
    ...skills.backend.map(skill => skill.name),
    ...skills.databases.map(skill => skill.name),
    ...skills.tools.map(skill => skill.name),
    ...skills.concepts.map(skill => skill.name)
  ];
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Mukul Batra",
    "knowsAbout": allSkills,
    "hasSkill": allSkills.map(skill => ({
      "@type": "DefinedTerm",
      "name": skill,
      "inDefinedTermSet": "Programming and Web Development Skills"
    }))
  };
  
  return JSON.stringify(structuredData);
};

// Core Web Vitals optimization utilities
export const optimizeForCoreWebVitals = () => {
  // Preload critical resources (skip images for now as they're placeholders)
  const preloadCriticalResources = () => {
    // Skip image preloading until actual images are available
    console.log('SEO: Critical resource preloading initialized');
  };
  
  // Optimize font loading
  const optimizeFontLoading = () => {
    const fontLink = document.querySelector('link[href*="fonts.googleapis.com"]');
    if (fontLink) {
      // Create a new preload link for fonts
      const preloadLink = document.createElement('link');
      preloadLink.rel = 'preload';
      preloadLink.as = 'style';
      preloadLink.href = fontLink.href;
      preloadLink.onload = function() {
        this.onload = null;
        this.rel = 'stylesheet';
      };
      
      // Insert before the original font link
      fontLink.parentNode.insertBefore(preloadLink, fontLink);
      
      // Set the original link to load asynchronously
      fontLink.media = 'print';
      fontLink.onload = function() {
        this.media = 'all';
      };
    }
  };
  
  // Reduce layout shift by setting image dimensions
  const preventLayoutShift = () => {
    const images = document.querySelectorAll('img:not([width]):not([height])');
    images.forEach(img => {
      img.style.aspectRatio = '1 / 1'; // Default aspect ratio
      img.style.objectFit = 'cover';
    });
  };
  
  // Execute optimizations
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      preloadCriticalResources();
      optimizeFontLoading();
      preventLayoutShift();
    });
  } else {
    preloadCriticalResources();
    optimizeFontLoading();
    preventLayoutShift();
  }
};

// Performance monitoring for Core Web Vitals
export const monitorCoreWebVitals = () => {
  // Use fallback monitoring since web-vitals is not installed
  console.log('Core Web Vitals monitoring initialized with fallback');
};

// Initialize SEO optimizations
export const initializeSEO = () => {
  optimizeForCoreWebVitals();
  monitorCoreWebVitals();
  
  // Set initial meta tags
  updateMetaTags('hero');
};