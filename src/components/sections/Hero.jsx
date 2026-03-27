import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useIntersectionObserverSingle } from '../../hooks/useIntersectionObserver'
import { SECTIONS } from '../../utils/constants'
import { personalInfo } from '../../data/personalInfo'
import { prefersReducedMotion, smoothScrollTo } from '../../utils/performance'
import TypingAnimation from '../ui/TypingAnimation'
import ParticleBackground from '../ui/ParticleBackground'
import StatsCounter from '../ui/StatsCounter'
import AnimatedButton from '../ui/AnimatedButton'
import ProfileImage from '../ui/ProfileImage'
import SectionTransition from '../ui/SectionTransition'

const Hero = React.memo(() => {
  const elementRef = useRef(null)
  const { isIntersecting } = useIntersectionObserverSingle(elementRef, {
    threshold: 0.1,
    triggerOnce: true
  })

  const [isLoaded, setIsLoaded] = useState(false)
  const reducedMotion = useMemo(() => prefersReducedMotion(), [])

  useEffect(() => {
    // Reduced delay for better perceived performance
    const timer = setTimeout(() => setIsLoaded(true), 50)
    return () => clearTimeout(timer)
  }, [])

  const scrollToSection = useCallback((sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      if (reducedMotion) {
        element.scrollIntoView({ behavior: 'auto', block: 'start' })
      } else {
        smoothScrollTo(element, 600)
      }
    }
  }, [reducedMotion])

  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: reducedMotion ? 0 : 0.1,
        delayChildren: reducedMotion ? 0 : 0.1
      }
    }
  }), [reducedMotion])

  const itemVariants = useMemo(() => ({
    hidden: { opacity: 0, y: reducedMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reducedMotion ? 0.01 : 0.4,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }), [reducedMotion])

  return (
    <motion.section
      id={SECTIONS.HERO}
      ref={elementRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden section-animate"
      aria-label="Hero section with personal introduction"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
      <div className="absolute inset-0 bg-noise opacity-10" />
      {!reducedMotion && (
        <ParticleBackground
          particleCount={15}
          particleColor="#22D3EE"
          speed={0.2}
          opacity={0.3}
        />
      )}

      {/* Floating Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent-cyan opacity-5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-cyan opacity-3 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-accent-cyan opacity-10 rounded-full blur-2xl" />
      </div>

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-screen py-16 sm:py-20">

          {/* Left Side - Content */}
          <div className="text-center lg:text-left space-y-6 lg:space-y-8 order-2 lg:order-1">

            {/* Greeting */}
            <motion.div variants={itemVariants}>
              <p className="text-body text-accent-cyan font-medium mb-2 tracking-wide">
                Hello, I'm
              </p>
            </motion.div>

            {/* Name */}
            <motion.div variants={itemVariants}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-none mb-4">
                <span className="text-gradient-primary">{personalInfo.name.split(' ')[0]}</span>
                <br />
                <span className="text-light-gray">{personalInfo.name.split(' ')[1]}</span>
              </h1>
            </motion.div>

            {/* Title with Typing Animation */}
            <motion.div variants={itemVariants}>
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-neutral-slate mb-6">
                <TypingAnimation
                  texts={[
                    personalInfo.title || 'Full-Stack Developer',
                    'Problem Solver',
                    'Code Enthusiast',
                    'Tech Innovator'
                  ].filter(Boolean)}
                  speed={100}
                  deleteSpeed={50}
                  pauseTime={2000}
                />
              </h2>
            </motion.div>

            {/* Description */}
            <motion.div variants={itemVariants}>
              <p className="text-body-large text-neutral-slate max-w-lg leading-relaxed mb-8">
                {personalInfo.summary ? (
                  <>
                    {personalInfo.summary.split('.')[0]}.{' '}
                    <span className="text-light-gray">
                      Passionate about building scalable, user-friendly applications.
                    </span>
                  </>
                ) : (
                  <span className="text-light-gray">
                    Passionate about building scalable, user-friendly applications and solving complex problems with efficient code.
                  </span>
                )}
              </p>
            </motion.div>

            {/* Contact Info */}
            <motion.div variants={itemVariants}>
              <div className="flex flex-wrap gap-6 text-sm text-neutral-slate mb-8">
                {personalInfo.location && (
                  <div className="flex items-center space-x-2">
                    <span className="text-accent-cyan">📍</span>
                    <span>{personalInfo.location}</span>
                  </div>
                )}
                {personalInfo.email && (
                  <div className="flex items-center space-x-2">
                    <span className="text-accent-cyan">📧</span>
                    <a
                      href={`mailto:${personalInfo.email}`}
                      className="hover:text-accent-cyan transition-colors"
                      aria-label={`Send email to ${personalInfo.email}`}
                    >
                      {personalInfo.email}
                    </a>
                  </div>
                )}
                {personalInfo.phone && (
                  <div className="flex items-center space-x-2">
                    <span className="text-accent-cyan">📱</span>
                    <a
                      href={`tel:+91${personalInfo.phone}`}
                      className="hover:text-accent-cyan transition-colors"
                      aria-label={`Call ${personalInfo.phone}`}
                    >
                      {personalInfo.phone}
                    </a>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div variants={itemVariants}>
              <div className="flex flex-col sm:flex-row gap-4">
                <AnimatedButton
                  variant="download"
                  size="lg"
                  downloadUrl={personalInfo.resumeUrl || "/resume/Mukul-Batra-Resume.pdf"}
                  fileName="Mukul_Batra_Resume.pdf"
                  iconPosition="right"
                  className="group"
                  onClick={() => {
                    // Analytics tracking could go here
                    console.log('Resume download initiated')
                  }}
                >
                  Download Resume
                </AnimatedButton>

                <AnimatedButton
                  variant="secondary"
                  size="lg"
                  onClick={() => scrollToSection(SECTIONS.PROJECTS)}
                  icon={
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  }
                  iconPosition="right"
                  className="group"
                >
                  View Projects
                </AnimatedButton>
              </div>
            </motion.div>



            {/* Social Links */}
            {personalInfo.social && Object.keys(personalInfo.social).length > 0 && (
              <motion.div variants={itemVariants}>
                <div className="flex space-x-4 pt-4">
                  {Object.entries(personalInfo.social).map(([platform, url]) => (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-slate-300 hover:text-accent-cyan hover:scale-110 transition-all duration-300"
                      aria-label={`Visit ${platform} profile`}
                    >
                      {platform === 'github' && (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                      )}
                      {platform === 'linkedin' && (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      )}
                      {platform === 'twitter' && (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                        </svg>
                      )}
                      {platform === 'instagram' && (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                      )}
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Side - Interactive Profile Image */}
          <motion.div
            className="flex justify-center lg:justify-end order-1 lg:order-2"
            variants={itemVariants}
          >
            <div className={`transition-all duration-1200 delay-300 ${isLoaded ? 'animate-slideInRight opacity-100' : 'opacity-0 translate-x-8'
              }`}>
              <ProfileImage
                frontImage={personalInfo.profileImage}
                backImage={personalInfo.avatarImage}
                alt="Mukul Batra"
                size="xl"
                flipOnHover={true}
                flipDuration={600}
                borderColor="accent-cyan"
                glowEffect={true}
                showStatus={true}
                statusText="Available for work"
                statusColor="green"
                fallbackIcon="👨‍💻"
                className="profile-image-hover"
                onImageLoad={(side) => {
                  console.log(`${side} image loaded successfully`)
                }}
                onImageError={(side) => {
                  console.log(`${side} image failed to load, using fallback`)
                }}
              />
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-1200 ${isLoaded ? 'animate-fadeInUp opacity-100' : 'opacity-0 translate-y-8'
          }`}>
          <button
            onClick={() => scrollToSection(SECTIONS.ABOUT)}
            className="flex flex-col items-center space-y-2 text-neutral-slate hover:text-accent-cyan transition-colors group"
            aria-label="Scroll to about section"
          >
            <span className="text-sm font-medium">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-current rounded-full flex justify-center">
              <div className="w-1 h-3 bg-current rounded-full mt-2 animate-bounce" />
            </div>
          </button>
        </div>
      </div>
    </motion.section>
  )
})

export default Hero