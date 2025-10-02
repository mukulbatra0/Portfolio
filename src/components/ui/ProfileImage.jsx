import React, { useState, useRef, useEffect } from 'react'
import { preloadImage, createPlaceholder, isImageAccessible } from '../../utils/imageUtils'

const ProfileImage = ({
  frontImage,
  backImage,
  alt = 'Profile',
  size = 'lg',
  className = '',
  showStatus = true,
  statusText = 'Available for work',
  statusColor = 'green',
  flipOnHover = true,
  flipDuration = 600,
  borderColor = 'accent-cyan',
  glowEffect = true,
  onImageLoad = null,
  onImageError = null,
  fallbackIcon = '👨‍💻'
}) => {
  const [isFlipped, setIsFlipped] = useState(false)
  const [frontLoaded, setFrontLoaded] = useState(false)
  const [backLoaded, setBackLoaded] = useState(false)
  const [frontError, setFrontError] = useState(false)
  const [backError, setBackError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [placeholderFront, setPlaceholderFront] = useState(null)
  const [placeholderBack, setPlaceholderBack] = useState(null)
  const containerRef = useRef(null)

  // Size configurations
  const sizes = {
    sm: {
      container: 'w-32 h-32',
      text: 'text-4xl',
      status: 'text-xs px-2 py-1',
      statusPosition: 'top-full left-1/2 transform -translate-x-1/2 mt-3'
    },
    md: {
      container: 'w-48 h-48',
      text: 'text-6xl',
      status: 'text-sm px-3 py-1.5',
      statusPosition: 'top-full left-1/2 transform -translate-x-1/2 mt-4'
    },
    lg: {
      container: 'w-64 h-64 lg:w-80 lg:h-80',
      text: 'text-7xl lg:text-8xl',
      status: 'text-sm px-4 py-2',
      statusPosition: 'top-full left-1/2 transform -translate-x-1/2 mt-4'
    },
    xl: {
      container: 'w-80 h-80 lg:w-96 lg:h-96',
      text: 'text-8xl lg:text-9xl',
      status: 'text-base px-4 py-2',
      statusPosition: 'top-full left-1/2 transform -translate-x-1/2 mt-6'
    }
  }

  const sizeConfig = sizes[size] || sizes.lg

  // Initialize placeholders and preload images
  useEffect(() => {
    const initializeImages = async () => {
      console.log('Initializing images:', { frontImage, backImage })
      
      // Create placeholders
      const frontPlaceholder = createPlaceholder(400, 400, '#0F172A', 'Profile')
      const backPlaceholder = createPlaceholder(400, 400, '#1e293b', 'Avatar')
      
      setPlaceholderFront(frontPlaceholder)
      setPlaceholderBack(backPlaceholder)

      // Preload images if they exist
      if (frontImage) {
        try {
          const isAccessible = await isImageAccessible(frontImage)
          console.log('Front image accessible:', isAccessible)
          if (isAccessible) {
            await preloadImage(frontImage)
          }
        } catch (error) {
          console.log('Front image preload error:', error)
          setFrontError(true)
        }
      }

      if (backImage) {
        try {
          const isAccessible = await isImageAccessible(backImage)
          console.log('Back image accessible:', isAccessible)
          if (isAccessible) {
            await preloadImage(backImage)
          }
        } catch (error) {
          console.log('Back image preload error:', error)
          setBackError(true)
        }
      }
    }

    initializeImages()
  }, [frontImage, backImage])

  // Handle mouse events for flip animation
  const handleMouseEnter = () => {
    console.log('Mouse entered, flipping to show avatar')
    console.log('Current state before flip:', { isFlipped, backLoaded, backError, backImage })
    setIsHovered(true)
    if (flipOnHover) {
      setIsFlipped(true)
      console.log('Flip state set to true - avatar should be visible now')
    }
  }

  const handleMouseLeave = () => {
    console.log('Mouse left, flipping back to profile')
    setIsHovered(false)
    if (flipOnHover) {
      setIsFlipped(false)
    }
  }

  // Handle click for manual flip
  const handleClick = () => {
    if (!flipOnHover) {
      setIsFlipped(!isFlipped)
    }
  }

  // Image load handlers
  const handleFrontLoad = () => {
    setFrontLoaded(true)
    onImageLoad?.('front')
  }

  const handleBackLoad = () => {
    setBackLoaded(true)
    console.log('Avatar image loaded successfully:', backImage)
    onImageLoad?.('back')
  }

  const handleFrontError = () => {
    setFrontError(true)
    onImageError?.('front')
  }

  const handleBackError = () => {
    setBackError(true)
    console.log('Avatar image failed to load:', backImage)
    onImageError?.('back')
  }

  // Status color configurations
  const statusColors = {
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    gray: 'bg-gray-500'
  }

  // Border color configurations
  const borderColors = {
    'accent-cyan': 'border-accent-cyan',
    'primary': 'border-primary-500',
    'white': 'border-white',
    'gray': 'border-gray-400'
  }

  return (
    <div className={`relative ${className}`}>
      {/* Main Profile Image Container */}
      <div
        ref={containerRef}
        className={`
          relative ${sizeConfig.container} mx-auto cursor-pointer
          transition-all duration-300 ease-out
          ${isHovered ? 'scale-105' : 'scale-100'}
        `}
        style={{ perspective: '1000px' }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-label={`${alt} - Click to flip`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleClick()
          }
        }}
      >
        {/* Flip Container */}
        <div 
          className="relative w-full h-full"
          style={{
            transformStyle: 'preserve-3d',
            WebkitTransformStyle: 'preserve-3d',
            transition: `transform ${flipDuration}ms ease-out`,
            WebkitTransition: `transform ${flipDuration}ms ease-out`,
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            WebkitTransform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
        >
          {/* Front Side */}
          <div
            className={`
              absolute inset-0 w-full h-full rounded-full overflow-hidden
              border-4 ${borderColors[borderColor]}
              ${glowEffect ? 'shadow-glow-lg' : 'shadow-lg'}
            `}
            style={{ 
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(0deg)',
              WebkitTransform: 'rotateY(0deg)'
            }}
          >
            {frontImage && !frontError ? (
              <img
                src={frontImage}
                alt={alt}
                className="w-full h-full object-cover"
                onLoad={handleFrontLoad}
                onError={handleFrontError}
              />
            ) : (
              <div className={`
                w-full h-full bg-gradient-primary flex-center
                ${sizeConfig.text}
              `}>
                {fallbackIcon}
              </div>
            )}
          </div>

          {/* Back Side */}
          <div
            className={`
              absolute inset-0 w-full h-full rounded-full overflow-hidden
              border-4 ${borderColors[borderColor]}
              ${glowEffect ? 'shadow-glow-lg' : 'shadow-lg'}
            `}
            style={{ 
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              WebkitTransform: 'rotateY(180deg)'
            }}
          >
            {backImage && !backError ? (
              <img
                src={backImage}
                alt={`${alt} - Avatar`}
                className="w-full h-full object-cover"
                onLoad={handleBackLoad}
                onError={handleBackError}
              />
            ) : (
              <div className={`
                w-full h-full bg-gradient-card flex-center
                ${sizeConfig.text} animate-pulse
              `}>
                {backError ? '❌' : '🎭'}
              </div>
            )}
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent-cyan opacity-20 rounded-full blur-lg animate-pulse" />
        <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-accent-cyan opacity-10 rounded-full blur-xl animate-pulse animate-delay-500" />
        
        {/* Hover Ring Effect */}
        {isHovered && (
          <div className="absolute inset-0 rounded-full border-2 border-accent-cyan animate-ping opacity-75" />
        )}
      </div>

      {/* Status Indicator */}
      {showStatus && (
        <div className={`absolute ${sizeConfig.statusPosition} z-10`}>
          <div className={`
            glass-card ${sizeConfig.status} flex items-center space-x-2
            animate-fadeInUp animate-delay-1000
            ${isHovered ? 'scale-110' : 'scale-100'}
            transition-transform duration-200
          `}>
            <div className={`
              w-2 h-2 rounded-full ${statusColors[statusColor]} 
              animate-pulse
            `} />
            <span className="text-light-gray font-medium whitespace-nowrap">
              {statusText}
            </span>
          </div>
        </div>
      )}

      {/* Flip Instruction (appears on first hover) */}
      {flipOnHover && isHovered && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-16 z-10">
          <div className="glass-card px-3 py-2 text-sm text-accent-cyan animate-fadeInUp">
            <div className="flex items-center space-x-2">
              <span>Hover to see avatar</span>
              <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Click Instruction (for manual flip) */}
      {!flipOnHover && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-16 z-10">
          <div className="glass-card px-3 py-2 text-sm text-neutral-slate">
            <div className="flex items-center space-x-2">
              <span>Click to flip</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfileImage