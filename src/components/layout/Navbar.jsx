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
        className="fixed top-0 left-0 right-0 z-[10000] pointer-events-none"
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
        {/* Floating Capsule Container */}
        <div className="flex justify-center px-4 pt-6 max-w-7xl mx-auto w-full">
          <div className={`pointer-events-auto transition-all duration-500 w-full ${
            isScrolled 
              ? 'scale-95' 
              : 'scale-100'
          }`}>
            
            {/* Desktop Navigation Capsule */}
            <div className="hidden md:flex items-center justify-between gap-2 px-6 py-3 rounded-full bg-slate-900/90 backdrop-blur-xl border border-cyan-500/20 shadow-2xl shadow-cyan-500/10 w-full max-w-5xl mx-auto">
              
              {/* Logo Button */}
              <button
                onClick={() => handleNavClick(SECTIONS.HERO)}
                className="flex items-center gap-3 px-5 py-2 rounded-full hover:bg-slate-800/50 transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-cyan-400"
                aria-label="Go to home section"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-base shadow-lg group-hover:shadow-cyan-400/50 transition-all duration-300 group-hover:scale-110">
                  M
                </div>
                <span className="text-base font-semibold text-white group-hover:text-cyan-400 transition-colors duration-300">
                  Mukul Batra
                </span>
              </button>

              {/* Navigation Items Container */}
              <div className="flex items-center gap-2">{navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                    sections?.active === item.id
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50 scale-105'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/70 hover:scale-105'
                  }`}
                  aria-label={`Navigate to ${item.label} section`}
                  aria-current={sections?.active === item.id ? 'page' : undefined}
                >
                  {item.label}
                  {sections?.active === item.id && (
                    <span className="absolute inset-0 rounded-full bg-cyan-400/20 animate-pulse"></span>
                  )}
                </button>
              ))}</div>
            </div>

            {/* Mobile Navigation Capsule */}
            <div className="md:hidden">
              <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-full bg-slate-900/90 backdrop-blur-xl border border-cyan-500/20 shadow-2xl shadow-cyan-500/10">
                
                {/* Logo Button */}
                <button
                  onClick={() => handleNavClick(SECTIONS.HERO)}
                  className="flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded-full p-1"
                  aria-label="Go to home section"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:shadow-cyan-400/50 transition-all duration-300">
                    M
                  </div>
                  <span className="text-base font-semibold text-white group-hover:text-cyan-400 transition-colors duration-300">
                    Mukul
                  </span>
                </button>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2.5 rounded-full text-slate-300 hover:text-white hover:bg-slate-800/70 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300"
                  aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                  aria-expanded={isMobileMenuOpen}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isMobileMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </div>

              {/* Mobile Dropdown Menu */}
              <div className={`mt-3 transition-all duration-300 ease-in-out origin-top ${
                isMobileMenuOpen 
                  ? 'scale-100 opacity-100' 
                  : 'scale-95 opacity-0 pointer-events-none'
              }`}>
                <div className="px-3 py-3 rounded-3xl bg-slate-900/95 backdrop-blur-xl border border-cyan-500/20 shadow-2xl shadow-cyan-500/10">
                  <div className="space-y-1">
                    {navItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id)}
                        className={`block w-full text-left px-5 py-3 rounded-full text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                          sections?.active === item.id
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50'
                            : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                        }`}
                        aria-label={`Navigate to ${item.label} section`}
                        aria-current={sections?.active === item.id ? 'page' : undefined}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Navbar