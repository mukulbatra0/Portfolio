import React from 'react'
import Navbar from './Navbar'
// import { useSmoothScroll } from '../../hooks/useSmoothScroll'

const SimpleLayout = ({ children }) => {
  const [isVisible, setIsVisible] = React.useState(false)
  
  // Enhanced smooth scrolling
 const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // This tells the browser to handle the smooth animation
    })
  }
  React.useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 500)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-primary-dark text-light-gray bg-gradient-mesh">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-noise opacity-30 pointer-events-none" />
      

      
      {/* Navigation */}
      <Navbar />
      
      {/* Main Content */}
      <main className="relative z-10 pt-20">
        {children}
      </main>
      
      {/* Back to Top Button */}
      <button
        onClick={() => scrollToTop()}
        className={`fab transition-all duration-500 hover:scale-110 active:scale-95 ${
          isVisible 
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
    </div>
  )
}

export default SimpleLayout