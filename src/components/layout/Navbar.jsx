import React, { useState, useEffect } from 'react'
import { SECTIONS } from '../../utils/constants'
import { useSections } from '../../contexts/LayoutContext'

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const sections = useSections()

  // Navigation items
  const navItems = [
    { id: SECTIONS.HERO, label: 'Home' },
    { id: SECTIONS.ABOUT, label: 'About' },
    { id: SECTIONS.SKILLS, label: 'Skills' },
    { id: SECTIONS.EDUCATION, label: 'Education' },
    { id: SECTIONS.PROJECTS, label: 'Projects' },
    { id: SECTIONS.CONTACT, label: 'Contact' }
  ]

  // Handle scroll effect for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Force navbar to always stay visible - bulletproof protection
  useEffect(() => {
    const navbar = document.querySelector('nav[role="navigation"]')
    if (!navbar) return

    const forceVisibility = () => {
      // Force inline styles to override any CSS
      navbar.style.position = 'fixed'
      navbar.style.top = '0px'
      navbar.style.left = '0px'
      navbar.style.right = '0px'
      navbar.style.zIndex = '10000'
      navbar.style.transform = 'translateY(0px)'
      navbar.style.visibility = 'visible'
      navbar.style.opacity = '1'
      navbar.style.display = 'block'
    }

    // Initial force
    forceVisibility()

    // Monitor for any changes and correct them immediately
    const observer = new MutationObserver(forceVisibility)
    observer.observe(navbar, { 
      attributes: true, 
      attributeFilter: ['style', 'class'],
      subtree: false
    })

    // Also force on scroll to prevent any scroll-based hiding
    const handleScrollProtection = () => {
      requestAnimationFrame(forceVisibility)
    }

    window.addEventListener('scroll', handleScrollProtection, { passive: true })

    // Force every 100ms as additional protection
    const interval = setInterval(forceVisibility, 100)

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', handleScrollProtection)
      clearInterval(interval)
    }
  }, [])

  // Handle navigation click
  const handleNavClick = (sectionId) => {
    setIsMobileMenuOpen(false)
    
    // Use the context's navigation method if available
    if (sections?.navigateToSection) {
      sections.navigateToSection(sectionId, 80)
      return
    }
    
    // Fallback navigation method
    const element = document.getElementById(sectionId)
    if (element) {
      const navbarHeight = 80
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
      const offsetPosition = Math.max(0, elementPosition - navbarHeight)
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
      
      // Update active section manually if context method not available
      console.log(`Navigating to section: ${sectionId}`)
    } else {
      console.warn(`Section element not found: ${sectionId}`)
    }
  }

  // Close mobile menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.navbar-container')) {
        setIsMobileMenuOpen(false)
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener('click', handleClickOutside)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  return (
    <header className="navbar-container">
      <nav 
        className={`fixed top-0 left-0 right-0 transition-all duration-300 ${
          isScrolled 
            ? 'bg-slate-900/95 backdrop-blur-xl border-b border-cyan-500/20 shadow-lg shadow-cyan-500/10' 
            : 'bg-slate-900/80 backdrop-blur-md'
        }`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10000,
          transform: 'translateY(0px)',
          visibility: 'visible',
          opacity: 1,
          display: 'block'
        }}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <div className="flex items-center">
              <button
                onClick={() => handleNavClick(SECTIONS.HERO)}
                className="flex items-center space-x-3 group focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900 rounded-lg p-2 -m-2"
                aria-label="Go to home section"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:shadow-cyan-400/50 transition-all duration-300 group-hover:scale-105">
                  M
                </div>
                <div className="hidden sm:block">
                  <div className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors duration-300">
                    Mukul Batra
                  </div>
                  <div className="text-sm text-slate-400 -mt-1">
                    Full-Stack Developer
                  </div>
                </div>
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                    sections?.active === item.id
                      ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                  aria-label={`Navigate to ${item.label} section`}
                  aria-current={sections?.active === item.id ? 'page' : undefined}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors duration-200"
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMobileMenuOpen}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen 
            ? 'max-h-screen opacity-100' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="px-4 pt-2 pb-6 space-y-2 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`block w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                  sections?.active === item.id
                    ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
                aria-label={`Navigate to ${item.label} section`}
                aria-current={sections?.active === item.id ? 'page' : undefined}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Navbar