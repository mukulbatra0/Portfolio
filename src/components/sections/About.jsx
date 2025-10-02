import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useIntersectionObserverSingle } from '../../hooks/useIntersectionObserver'
import { SECTIONS } from '../../utils/constants'
import { personalInfo } from '../../data/personalInfo'
import TypingAnimation from '../ui/TypingAnimation'
import FloatingShapes from '../ui/FloatingShapes'
import SectionTransition from '../ui/SectionTransition'

const About = () => {
  const elementRef = useRef(null)
  const { isIntersecting } = useIntersectionObserverSingle(elementRef, {
    threshold: 0.3,
    triggerOnce: true
  })

  const [activeTab, setActiveTab] = useState('story')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isIntersecting) {
      const timer = setTimeout(() => setIsVisible(true), 300)
      return () => clearTimeout(timer)
    }
  }, [isIntersecting])

  // About content tabs
  const aboutTabs = [
    {
      id: 'story',
      label: 'My Story',
      icon: '📖',
      content: {
        title: 'The Journey Begins',
        description: personalInfo.summary,
        highlights: [
          'Started coding journey in 2022',
          'Specialized in MERN stack development',
          'Passionate about problem-solving',
          'Always learning new technologies'
        ]
      }
    },
    {
      id: 'passion',
      label: 'What Drives Me',
      icon: '🚀',
      content: {
        title: 'Passion for Innovation',
        description: 'I believe technology has the power to transform lives and solve real-world problems. My passion lies in creating digital solutions that make a meaningful impact.',
        highlights: [
          'Building scalable applications',
          'Solving complex algorithms',
          'Creating user-friendly interfaces',
          'Continuous learning mindset'
        ]
      }
    },
    {
      id: 'goals',
      label: 'Future Goals',
      icon: '🎯',
      content: {
        title: 'Looking Ahead',
        description: 'My goal is to become a versatile full-stack developer who can contribute to innovative projects and help shape the future of web development.',
        highlights: [
          'Master advanced React patterns',
          'Explore cloud technologies',
          'Contribute to open source',
          'Mentor aspiring developers'
        ]
      }
    }
  ]

  const currentContent = aboutTabs.find(tab => tab.id === activeTab)?.content

  return (
    <SectionTransition>
      <motion.section 
        id={SECTIONS.ABOUT}
        ref={elementRef}
        className="section-spacing relative overflow-hidden section-animate"
        aria-labelledby="about-heading"
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
        viewport={{ once: true, margin: '-100px' }}
      >
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <FloatingShapes count={8} />
      </div>

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isIntersecting ? 'animate-fadeInUp opacity-100' : 'opacity-0 translate-y-8'
        }`}>
          <h2 id="about-heading" className="text-heading-2 font-bold text-gradient-primary mb-4">
            About Me
          </h2>
          <div className="w-24 h-1 bg-accent-cyan mx-auto rounded-full glow-effect mb-6" />
          <p className="text-body-large text-neutral-slate max-w-2xl mx-auto">
            <TypingAnimation 
              texts={[
                "Crafting digital experiences with code",
                "Turning ideas into reality",
                "Building the future, one line at a time"
              ]}
              speed={80}
              deleteSpeed={40}
              pauseTime={3000}
            />
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            
            {/* Left Side - Content */}
            <div className={`space-y-8 transition-all duration-1000 delay-200 ${
              isVisible ? 'animate-slideInLeft opacity-100' : 'opacity-0 translate-x-8'
            }`}>
              
              {/* Tab Navigation */}
              <div className="flex flex-wrap gap-2 mb-6 lg:mb-8 justify-center lg:justify-start">
                {aboutTabs.map((tab, index) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      px-3 py-2 sm:px-4 rounded-lg font-medium transition-all duration-300
                      flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base
                      ${activeTab === tab.id 
                        ? 'bg-accent-cyan text-primary-dark shadow-glow' 
                        : 'glass-button hover:bg-accent-cyan hover:bg-opacity-10'
                      }
                    `}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="glass-card min-h-[400px]">
                <div className="space-y-6">
                  <h3 className="text-heading-3 font-semibold text-accent-cyan">
                    {currentContent?.title}
                  </h3>
                  
                  <p className="text-body text-neutral-slate leading-relaxed">
                    {currentContent?.description}
                  </p>

                  {/* Highlights */}
                  <div className="space-y-3">
                    <h4 className="text-heading-4 font-medium text-light-gray">
                      Key Highlights
                    </h4>
                    <div className="grid gap-3">
                      {currentContent?.highlights.map((highlight, index) => (
                        <div 
                          key={index}
                          className="flex items-center space-x-3 p-3 rounded-lg bg-accent-cyan bg-opacity-5 border border-accent-cyan border-opacity-20"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="w-2 h-2 bg-accent-cyan rounded-full animate-pulse" />
                          <span className="text-body-small text-light-gray">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Personal Stats */}
                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-neutral-slate border-opacity-20">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent-cyan mb-1">2+</div>
                      <div className="text-sm text-neutral-slate">Years Coding</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent-cyan mb-1">10+</div>
                      <div className="text-sm text-neutral-slate">Technologies</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  className="btn-primary flex-1"
                  onClick={() => {
                    const element = document.getElementById(SECTIONS.PROJECTS)
                    element?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  View My Work
                </button>
                <button 
                  className="btn-secondary flex-1"
                  onClick={() => {
                    const element = document.getElementById(SECTIONS.CONTACT)
                    element?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  Get In Touch
                </button>
              </div>
            </div>

            {/* Right Side - Interactive Visual */}
            <div className={`transition-all duration-1000 delay-400 ${
              isVisible ? 'animate-slideInRight opacity-100' : 'opacity-0 translate-x-8'
            }`}>
              <div className="relative">
                
                {/* Main Visual Container */}
                <div className="glass-card p-8 text-center relative overflow-hidden">
                  
                  {/* Animated Code Block */}
                  <div className="bg-primary-dark rounded-lg p-6 mb-6 font-mono text-sm text-left">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-neutral-slate ml-4">developer.js</span>
                    </div>
                    
                    <div className="space-y-2 text-neutral-slate">
                      <div><span className="text-purple-400">const</span> <span className="text-blue-400">developer</span> = {`{`}</div>
                      <div className="ml-4"><span className="text-green-400">name</span>: <span className="text-yellow-400">'Mukul Batra'</span>,</div>
                      <div className="ml-4"><span className="text-green-400">role</span>: <span className="text-yellow-400">'Full-Stack Developer'</span>,</div>
                      <div className="ml-4"><span className="text-green-400">passion</span>: <span className="text-yellow-400">'Building Amazing Apps'</span>,</div>
                      <div className="ml-4"><span className="text-green-400">status</span>: <span className="text-yellow-400">'Always Learning'</span></div>
                      <div>{`}`}</div>
                    </div>
                  </div>

                  {/* Tech Stack Icons */}
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    {['⚛️', '🟢', '🍃', '🔥'].map((icon, index) => (
                      <div 
                        key={index}
                        className="w-16 h-16 rounded-xl bg-gradient-primary flex-center text-2xl animate-float"
                        style={{ 
                          animationDelay: `${index * 200}ms`,
                          animationDuration: `${3 + index * 0.5}s`
                        }}
                      >
                        {icon}
                      </div>
                    ))}
                  </div>

                  {/* Motivational Quote */}
                  <blockquote className="text-body italic text-neutral-slate border-l-4 border-accent-cyan pl-4">
                    "Code is like humor. When you have to explain it, it's bad."
                    <footer className="text-sm text-accent-cyan mt-2">- Cory House</footer>
                  </blockquote>

                  {/* Floating Elements */}
                  <div className="absolute top-4 right-4 w-8 h-8 bg-accent-cyan opacity-20 rounded-full animate-ping" />
                  <div className="absolute bottom-4 left-4 w-6 h-6 bg-accent-cyan opacity-30 rounded-full animate-pulse" />
                </div>

                {/* Side Stats */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="glass-card p-4 text-center">
                    <div className="text-3xl mb-2">🎯</div>
                    <div className="text-sm text-neutral-slate">Goal-Oriented</div>
                  </div>
                  <div className="glass-card p-4 text-center">
                    <div className="text-3xl mb-2">🧠</div>
                    <div className="text-sm text-neutral-slate">Problem Solver</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>
      </motion.section>
    </SectionTransition>
  )
}

export default About