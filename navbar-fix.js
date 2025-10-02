// Navbar Debug Script - Clean Implementation
// Run this in browser console to debug navbar issues

console.log('=== NAVBAR DEBUG (Clean Implementation) ===');

// Check if navbar exists
const navbar = document.querySelector('nav[role="navigation"]');
console.log('Navbar element:', navbar);

if (navbar) {
  const styles = window.getComputedStyle(navbar);
  console.log('Navbar computed styles:');
  console.log('- Position:', styles.position);
  console.log('- Z-index:', styles.zIndex);
  console.log('- Visibility:', styles.visibility);
  console.log('- Opacity:', styles.opacity);
  console.log('- Transform:', styles.transform);
  console.log('- Top:', styles.top);
  console.log('- Display:', styles.display);
  
  // Test scroll behavior
  console.log('Testing scroll behavior...');
  const initialScrollY = window.scrollY;
  
  // Scroll down and check navbar
  window.scrollTo({ top: 200, behavior: 'instant' });
  setTimeout(() => {
    const stylesAfterScroll = window.getComputedStyle(navbar);
    console.log('After scroll:');
    console.log('- Transform:', stylesAfterScroll.transform);
    console.log('- Visibility:', stylesAfterScroll.visibility);
    console.log('- Opacity:', stylesAfterScroll.opacity);
    console.log('- Background:', stylesAfterScroll.backgroundColor);
    
    // Restore original position
    window.scrollTo({ top: initialScrollY, behavior: 'instant' });
    
    console.log('✅ Navbar should always be visible and change style on scroll');
  }, 100);
} else {
  console.log('❌ Navbar not found');
}

// Check sections
const sections = ['hero', 'about', 'skills', 'education', 'projects', 'contact'];
sections.forEach(id => {
  const element = document.getElementById(id);
  console.log(`Section ${id}:`, element ? 'Found' : 'Missing');
});

// Test navigation function
function testNavigation(sectionId) {
  const element = document.getElementById(sectionId);
  if (element) {
    const navbarHeight = 80;
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - navbarHeight;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
    console.log(`Navigated to ${sectionId}`);
  } else {
    console.log(`Section ${sectionId} not found`);
  }
}

// Make test function available globally
window.testNavigation = testNavigation;

console.log('Run testNavigation("about") to test navigation');
// Test navbar protection mechanism
console.log('=== TESTING NAVBAR PROTECTION ===');

// Try to hide the navbar and see if protection works
const testProtection = () => {
  const navbar = document.querySelector('nav[role="navigation"]');
  if (navbar) {
    console.log('Testing protection by trying to hide navbar...');
    
    // Try various ways to hide the navbar
    navbar.style.transform = 'translateY(-100px)';
    navbar.style.visibility = 'hidden';
    navbar.style.opacity = '0';
    navbar.style.display = 'none';
    
    setTimeout(() => {
      const styles = window.getComputedStyle(navbar);
      console.log('After attempting to hide:');
      console.log('- Transform:', styles.transform);
      console.log('- Visibility:', styles.visibility);
      console.log('- Opacity:', styles.opacity);
      console.log('- Display:', styles.display);
      
      if (styles.visibility === 'visible' && styles.opacity === '1' && styles.display === 'block' && styles.zIndex === '10000') {
        console.log('✅ Protection mechanism working - navbar stayed visible with correct z-index!');
      } else {
        console.log('❌ Protection failed - navbar was hidden or has wrong z-index');
        console.log('Expected z-index: 10000, Actual:', styles.zIndex);
      }
    }, 200);
  }
};

// Run protection test
setTimeout(testProtection, 1000);

console.log('✅ Bulletproof navbar implementation loaded successfully');
console.log('Protection test will run in 1 second...');