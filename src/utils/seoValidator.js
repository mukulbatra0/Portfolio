// SEO Validation utilities

export const validateSEO = () => {
  const results = {
    metaTags: {},
    structuredData: {},
    performance: {},
    accessibility: {},
    errors: []
  };

  try {
    // Check basic meta tags
    results.metaTags.title = document.title || 'Missing';
    results.metaTags.description = document.querySelector('meta[name="description"]')?.content || 'Missing';
    results.metaTags.keywords = document.querySelector('meta[name="keywords"]')?.content || 'Missing';
    results.metaTags.canonical = document.querySelector('link[rel="canonical"]')?.href || 'Missing';
    
    // Check Open Graph tags
    results.metaTags.ogTitle = document.querySelector('meta[property="og:title"]')?.content || 'Missing';
    results.metaTags.ogDescription = document.querySelector('meta[property="og:description"]')?.content || 'Missing';
    results.metaTags.ogImage = document.querySelector('meta[property="og:image"]')?.content || 'Missing';
    results.metaTags.ogUrl = document.querySelector('meta[property="og:url"]')?.content || 'Missing';
    
    // Check Twitter Card tags
    results.metaTags.twitterCard = document.querySelector('meta[name="twitter:card"]')?.content || 'Missing';
    results.metaTags.twitterTitle = document.querySelector('meta[name="twitter:title"]')?.content || 'Missing';
    results.metaTags.twitterDescription = document.querySelector('meta[name="twitter:description"]')?.content || 'Missing';
    results.metaTags.twitterImage = document.querySelector('meta[name="twitter:image"]')?.content || 'Missing';
    
    // Check structured data
    const structuredDataScripts = document.querySelectorAll('script[type="application/ld+json"]');
    results.structuredData.count = structuredDataScripts.length;
    results.structuredData.valid = [];
    results.structuredData.invalid = [];
    
    structuredDataScripts.forEach((script, index) => {
      try {
        const data = JSON.parse(script.textContent);
        results.structuredData.valid.push({
          index,
          type: data['@type'] || 'Unknown',
          context: data['@context'] || 'Missing'
        });
      } catch (error) {
        results.structuredData.invalid.push({
          index,
          error: error.message
        });
      }
    });
    
    // Check performance hints
    results.performance.preconnect = document.querySelectorAll('link[rel="preconnect"]').length;
    results.performance.preload = document.querySelectorAll('link[rel="preload"]').length;
    results.performance.prefetch = document.querySelectorAll('link[rel="prefetch"]').length;
    results.performance.dnsPrefetch = document.querySelectorAll('link[rel="dns-prefetch"]').length;
    
    // Check accessibility
    results.accessibility.lang = document.documentElement.lang || 'Missing';
    results.accessibility.viewport = document.querySelector('meta[name="viewport"]')?.content || 'Missing';
    results.accessibility.skipLinks = document.querySelectorAll('a[href^="#"]').length;
    
    // Check for common issues
    if (!results.metaTags.title || results.metaTags.title === 'Missing') {
      results.errors.push('Missing page title');
    }
    
    if (!results.metaTags.description || results.metaTags.description === 'Missing') {
      results.errors.push('Missing meta description');
    }
    
    if (results.metaTags.description && results.metaTags.description.length > 160) {
      results.errors.push('Meta description too long (>160 characters)');
    }
    
    if (!results.metaTags.canonical || results.metaTags.canonical === 'Missing') {
      results.errors.push('Missing canonical URL');
    }
    
    if (results.structuredData.count === 0) {
      results.errors.push('No structured data found');
    }
    
    if (results.structuredData.invalid.length > 0) {
      results.errors.push(`${results.structuredData.invalid.length} invalid structured data blocks`);
    }
    
  } catch (error) {
    results.errors.push(`Validation error: ${error.message}`);
  }
  
  return results;
};

export const logSEOReport = () => {
  const results = validateSEO();
  
  console.group('🔍 SEO Validation Report');
  
  console.group('📝 Meta Tags');
  console.table(results.metaTags);
  console.groupEnd();
  
  console.group('📊 Structured Data');
  console.log(`Found ${results.structuredData.count} structured data blocks`);
  if (results.structuredData.valid.length > 0) {
    console.table(results.structuredData.valid);
  }
  if (results.structuredData.invalid.length > 0) {
    console.error('Invalid structured data:', results.structuredData.invalid);
  }
  console.groupEnd();
  
  console.group('⚡ Performance');
  console.table(results.performance);
  console.groupEnd();
  
  console.group('♿ Accessibility');
  console.table(results.accessibility);
  console.groupEnd();
  
  if (results.errors.length > 0) {
    console.group('❌ Issues Found');
    results.errors.forEach(error => console.error(error));
    console.groupEnd();
  } else {
    console.log('✅ No issues found');
  }
  
  console.groupEnd();
  
  return results;
};

// Run validation in development mode (only once)
if (process.env.NODE_ENV === 'development') {
  let validationRun = false;
  
  const runValidation = () => {
    if (!validationRun) {
      setTimeout(() => {
        logSEOReport();
        validationRun = true;
      }, 3000); // Wait longer for all content to load
    }
  };
  
  // Run validation after DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runValidation);
  } else {
    runValidation();
  }
}