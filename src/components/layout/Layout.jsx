import React from 'react'
import { LayoutProvider, useLayout, useScroll, usePreferences } from '../../contexts/LayoutContext'
import Navbar from './Navbar'
import ScrollProgress from './ScrollProgress'
import SectionNavigation from './SectionNavigation'

const Layout = ({ children }) => {
  return (
    <LayoutProvider>
      <LayoutContent>{children}</LayoutContent>
    </LayoutProvider>
  )
}

// Layout Content Component (inside provider)
const LayoutContent = ({ children }) => {
  const preferences = usePreferences() || { reducedMotion: false, highContrast: false }
  const scroll = useScroll() || { isScrolled: false }

  return (
    <div className={`min-h-screen bg-primary-dark text-light-gray bg-gradient-mesh relative ${preferences.reducedMotion ? 'motion-reduce' : ''
      } ${preferences.highContrast ? 'high-contrast' : ''
      }`}>
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-noise opacity-30 pointer-events-none" />

      {/* Scroll Progress */}
      {/* <ScrollProgress showSectionIndicators={false} showPercentage={false} /> */}

      {/* Navigation */}
      <Navbar />

      {/* Section Navigation
      <SectionNavigation
        position="right"
        showLabels={true}
        showProgress={true}
      /> */}

      {/* Main Content */}
      <main className="relative z-10 pt-20">
        {children}
      </main>

      {/* Back to Top Button */}
      <BackToTopButton />

      {/* Loading Overlay */}
      <LoadingOverlay />

      {/* Modal Container */}
      <ModalContainer />
    </div>
  )
}

// Back to Top Button Component
const BackToTopButton = () => {
  const scroll = useScroll() || { y: 0 }
  const layout = useLayout() || { actions: { scrollToTop: () => window.scrollTo({ top: 0, behavior: 'smooth' }) } }
  const isVisible = scroll.y > 500

  return (
    <button
      onClick={layout.actions.scrollToTop}
      className={`fab transition-all duration-500 ${isVisible
        ? 'opacity-100 translate-y-0 pointer-events-auto'
        : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      aria-label="Back to top"
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </button>
  )
}

// Loading Overlay Component
const LoadingOverlay = () => {
  const layout = useLayout() || { ui: { isLoading: false } }

  if (!layout.ui.isLoading) return null

  return (
    <div className="fixed inset-0 z-[9998] flex-center bg-primary-dark bg-opacity-80 backdrop-blur-sm">
      <div className="glass-card p-8 text-center">
        <div className="loading-spinner mx-auto mb-4"></div>
        <p className="text-body text-accent-cyan">Loading...</p>
      </div>
    </div>
  )
}

// Modal Container Component
const ModalContainer = () => {
  const layout = useLayout() || { ui: { modal: null }, actions: { setModal: () => { } } }

  if (!layout.ui.modal) return null

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      layout.actions.setModal(null)
    }
  }

  return (
    <div
      className="modal-backdrop"
      onClick={handleBackdropClick}
    >
      <div className="modal-content">
        {layout.ui.modal}
      </div>
    </div>
  )
}

export default Layout