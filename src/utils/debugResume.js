/**
 * Debug utility for testing resume download functionality
 * Use this in browser console to diagnose download issues
 */

import { testResumeDownload, validateResumeFile, getResumeInfo } from './resumeDownload';
import { contactInfo } from '../data/contact';
import { personalInfo } from '../data/personalInfo';

/**
 * Run comprehensive resume download diagnostics
 */
export const debugResumeDownload = async () => {
  console.log('🔍 Starting Resume Download Diagnostics...\n');
  
  // Check both resume URLs
  const urls = [
    { name: 'Contact Info URL', url: contactInfo.resume.url },
    { name: 'Personal Info URL', url: personalInfo.resumeUrl }
  ];
  
  for (const { name, url } of urls) {
    console.log(`📋 Testing ${name}: ${url}`);
    
    try {
      const testResult = await testResumeDownload(url);
      
      console.log(`✅ ${name} Results:`);
      console.log(`   - File exists: ${testResult.validation.exists}`);
      console.log(`   - Is valid: ${testResult.validation.isValid}`);
      console.log(`   - Content type: ${testResult.validation.contentType}`);
      console.log(`   - File size: ${testResult.info.sizeFormatted}`);
      console.log(`   - Last modified: ${testResult.info.lastModifiedFormatted}`);
      
      if (testResult.validation.errors.length > 0) {
        console.log(`   - Errors: ${testResult.validation.errors.join(', ')}`);
      }
      
      if (testResult.recommendations.length > 0) {
        console.log(`   - Recommendations: ${testResult.recommendations.join(', ')}`);
      }
      
    } catch (error) {
      console.error(`❌ ${name} Test Failed:`, error);
    }
    
    console.log(''); // Empty line for readability
  }
  
  // Test browser download capability
  console.log('🌐 Browser Download Capability:');
  const link = document.createElement('a');
  console.log(`   - Download attribute supported: ${typeof link.download !== 'undefined'}`);
  console.log(`   - Fetch API supported: ${typeof fetch !== 'undefined'}`);
  console.log(`   - Blob supported: ${typeof Blob !== 'undefined'}`);
  console.log(`   - URL.createObjectURL supported: ${typeof URL.createObjectURL !== 'undefined'}`);
  
  // Test current page context
  console.log('\n📄 Current Page Context:');
  console.log(`   - Protocol: ${window.location.protocol}`);
  console.log(`   - Host: ${window.location.host}`);
  console.log(`   - Is HTTPS: ${window.location.protocol === 'https:'}`);
  console.log(`   - Is localhost: ${window.location.hostname === 'localhost'}`);
  
  console.log('\n🔧 Quick Fix Suggestions:');
  console.log('1. Ensure the PDF file exists at /resume/mukul-batra-resume.pdf');
  console.log('2. Check that the PDF file is not corrupted (should start with %PDF)');
  console.log('3. Verify the file size is reasonable (> 1KB for a resume)');
  console.log('4. Test the download in different browsers');
  console.log('5. Check browser console for any CORS or security errors');
  
  console.log('\n✨ Diagnostics Complete!');
};

/**
 * Quick test function for browser console
 */
window.debugResume = debugResumeDownload;

/**
 * Test individual resume URL
 */
export const testResumeUrl = async (url) => {
  console.log(`🧪 Testing resume URL: ${url}`);
  
  try {
    const validation = await validateResumeFile(url);
    const info = await getResumeInfo(url);
    
    console.log('Validation:', validation);
    console.log('Info:', info);
    
    return { validation, info };
  } catch (error) {
    console.error('Test failed:', error);
    return { error };
  }
};

/**
 * Manual download test
 */
export const manualDownloadTest = (url = contactInfo.resume.url, filename = 'Test_Resume.pdf') => {
  console.log(`📥 Manual download test: ${url}`);
  
  try {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('✅ Download initiated successfully');
    return true;
  } catch (error) {
    console.error('❌ Manual download failed:', error);
    return false;
  }
};

// Make functions available globally for console testing
if (typeof window !== 'undefined') {
  window.testResumeUrl = testResumeUrl;
  window.manualDownloadTest = manualDownloadTest;
  
  console.log('🛠️ Resume debug utilities loaded!');
  console.log('Available functions:');
  console.log('- debugResume() - Run full diagnostics');
  console.log('- testResumeUrl(url) - Test specific URL');
  console.log('- manualDownloadTest(url, filename) - Manual download test');
}