import { useEffect, Suspense, lazy } from 'react'

import { useGSAPAnimations } from './hooks/useGSAPAnimations'
import Layout from './components/layout/Layout'
import Hero from './components/sections/Hero'
import About from './components/sections/About'
import Skills from './components/sections/Skills'
import Education from './components/sections/Education'
import Projects from './components/sections/Projects'
import Contact from './components/sections/Contact'

import PolyfillLoader from './components/utils/PolyfillLoader'
import PerformanceMonitor from './components/utils/PerformanceMonitor'
import PerformanceSummary from './components/utils/PerformanceSummary'
import AccessibilityProvider from './components/accessibility/AccessibilityProvider'
import StructuredData from './components/SEO/StructuredData'
import { initializeSEO, generateProjectStructuredData, generateSkillsStructuredData } from './utils/seo'
import { projects } from './data/projects'
import { skills } from './data/skills'
import './utils/seoValidator' // Import for development validation

// Lazy load heavy components
const Skills3D = lazy(() => import('./components/sections/Skills3D'))

// Import debug utilities in development
if (import.meta.env.DEV) {
  import('./utils/debugResume').then(() => {
    console.log('🛠️ Resume debug utilities loaded! Type debugResume() in console to run diagnostics.');
  });
}

function App() {
  useGSAPAnimations()

  useEffect(() => {
    // Initialize SEO optimizations
    initializeSEO();
  }, []);

  return (
    <PolyfillLoader>
      <AccessibilityProvider>
        <PerformanceMonitor />
        <PerformanceSummary />

        {/* Dynamic Structured Data */}
        <StructuredData
          id="projects-structured-data"
          data={generateProjectStructuredData(projects)}
        />
        <StructuredData
          id="skills-structured-data"
          data={generateSkillsStructuredData(skills)}
        />

        <Layout>
          <main id="main-content" tabIndex="-1" className="card-animate relative">
            <section id="hero" className="relative">
              <Hero />
            </section>
            <section id="about" className="relative">
              <About />
            </section>
                        
            {/* Lazy load 3D Skills section */}
            <Suspense fallback={
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-cyan"></div>
              </div>
            }>
              <section id="skills-3d" className="relative">
                <Skills3D />
              </section>
            </Suspense>

            <section id="education" className="relative">
              <Education />
            </section>
            <section id="projects" className="relative">
              <Projects />
            </section>
            <section id="contact" className="relative">
              <Contact />
            </section>
            <section id="footer" className="relative">
              <footer className="text-center text-sm text-gray-400 py-4">
                
                <p>Designed and developed by Mukul Batra | &copy; {new Date().getFullYear()} Mukul Batra. All rights reserved.</p>
              </footer>
            </section>
          </main>
        </Layout>
      </AccessibilityProvider>
    </PolyfillLoader>
  )
}

export default App