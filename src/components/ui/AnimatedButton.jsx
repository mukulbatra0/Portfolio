import React, { useState, useRef, useEffect } from 'react'
import { downloadFile, trackDownload, validateFilename } from '../../utils/downloadManager'
import { downloadResume, validateResumeFile } from '../../utils/resumeDownload'

const AnimatedButton = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon = null,
  iconPosition = 'right',
  downloadUrl = null,
  fileName = null,
  showToast = false,
  onToast = null,
  className = '',
  ...props
}) => {
  const [isClicked, setIsClicked] = useState(false)
  const [ripples, setRipples] = useState([])
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [downloadStatus, setDownloadStatus] = useState('idle') // idle, downloading, success, error
  const buttonRef = useRef(null)
  const rippleTimeouts = useRef([])

  // Cleanup ripple timeouts on unmount
  useEffect(() => {
    return () => {
      rippleTimeouts.current.forEach(timeout => clearTimeout(timeout))
    }
  }, [])

  // Handle click with ripple effect
  const handleClick = async (e) => {
    if (disabled || loading) return

    // Create ripple effect
    createRipple(e)
    
    // Set clicked state for animation
    setIsClicked(true)
    setTimeout(() => setIsClicked(false), 200)

    // Handle download if downloadUrl is provided
    if (downloadUrl) {
      await handleDownload()
    }

    // Call custom onClick handler
    if (onClick) {
      onClick(e)
    }
  }

  // Create ripple effect
  const createRipple = (e) => {
    const button = buttonRef.current
    if (!button) return

    const rect = button.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = e.clientX - rect.left - size / 2
    const y = e.clientY - rect.top - size / 2

    const newRipple = {
      id: Date.now(),
      x,
      y,
      size
    }

    setRipples(prev => [...prev, newRipple])

    // Remove ripple after animation
    const timeout = setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id))
    }, 600)

    rippleTimeouts.current.push(timeout)
  }

  // Handle file download
  const handleDownload = async () => {
    if (!downloadUrl) return

    setDownloadStatus('downloading')
    setDownloadProgress(0)

    const validatedFilename = validateFilename(fileName || 'download')

    try {
      // Check if this is a resume download (PDF file)
      const isResumeDownload = downloadUrl.includes('.pdf') || validatedFilename.includes('.pdf')
      
      if (isResumeDownload) {
        // Use enhanced resume download for PDF files
        const success = await downloadResume(downloadUrl, validatedFilename)
        
        if (success) {
          setDownloadStatus('success')
          trackDownload(validatedFilename, 'animated-button')
          
          // Show success toast
          if (showToast && onToast) {
            onToast({
              message: `${validatedFilename} downloaded successfully!`,
              type: 'success'
            })
          }
        } else {
          throw new Error('Resume download failed')
        }
      } else {
        // Use regular download for other files
        await downloadFile(downloadUrl, validatedFilename, {
          onProgress: (progress) => {
            setDownloadProgress(progress)
          },
          onComplete: (info) => {
            setDownloadStatus('success')
            trackDownload(validatedFilename, 'animated-button')
            
            // Show success toast
            if (showToast && onToast) {
              onToast({
                message: `${validatedFilename} downloaded successfully!`,
                type: 'success'
              })
            }
          },
          onError: (error) => {
            throw error
          }
        })
      }
      
      // Reset status after success animation
      setTimeout(() => {
        setDownloadStatus('idle')
        setDownloadProgress(0)
      }, 2000)

    } catch (error) {
      console.error('Download failed:', error)
      setDownloadStatus('error')
      
      // Show error toast
      if (showToast && onToast) {
        onToast({
          message: `Failed to download ${validatedFilename}. Please try again.`,
          type: 'error'
        })
      }
      
      // Reset status after error animation
      setTimeout(() => {
        setDownloadStatus('idle')
        setDownloadProgress(0)
      }, 2000)
    }
  }

  // Button variant styles
  const variants = {
    primary: `
      bg-gradient-to-r from-accent-cyan to-cyan-600 
      text-primary-dark font-semibold
      hover:from-cyan-400 hover:to-cyan-700
      shadow-lg hover:shadow-accent-cyan/25
    `,
    secondary: `
      bg-transparent border-2 border-neutral-slate 
      text-light-gray font-medium
      hover:border-accent-cyan hover:text-accent-cyan
      hover:shadow-lg hover:shadow-accent-cyan/10
    `,
    ghost: `
      bg-transparent text-accent-cyan font-medium
      hover:bg-accent-cyan hover:bg-opacity-10
    `,
    download: `
      bg-gradient-to-r from-accent-cyan to-cyan-600 
      text-primary-dark font-semibold
      hover:from-cyan-400 hover:to-cyan-700
      shadow-lg hover:shadow-accent-cyan/25
      relative overflow-hidden
    `
  }

  // Button size styles
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl'
  }

  // Get current icon based on status
  const getCurrentIcon = () => {
    if (downloadStatus === 'downloading') {
      return (
        <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      )
    }
    
    if (downloadStatus === 'success') {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )
    }
    
    if (downloadStatus === 'error') {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )
    }

    return icon || (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  }

  // Get button text based on status
  const getButtonText = () => {
    if (downloadStatus === 'downloading') return 'Downloading...'
    if (downloadStatus === 'success') return 'Downloaded!'
    if (downloadStatus === 'error') return 'Download Failed'
    return children
  }

  const buttonClasses = `
    relative inline-flex items-center justify-center
    rounded-xl transition-all duration-300 ease-out
    transform-gpu will-change-transform
    ${variants[variant]}
    ${sizes[size]}
    ${isClicked ? 'scale-95' : 'hover:scale-105'}
    ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${downloadStatus === 'success' ? 'bg-green-500 hover:bg-green-600' : ''}
    ${downloadStatus === 'error' ? 'bg-red-500 hover:bg-red-600' : ''}
    ${className}
  `

  return (
    <button
      ref={buttonRef}
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled || loading}
      {...props}
    >
      {/* Enhanced shimmer and pulse effect for download variant */}
      {variant === 'download' && (
        <>
          <div className="absolute inset-0 -top-px overflow-hidden rounded-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700 ease-out" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 via-cyan-300/20 to-cyan-400/10 animate-pulse" />
          <div className="absolute inset-0 border border-cyan-300/30 rounded-xl animate-pulse" />
        </>
      )}

      {/* Download progress bar */}
      {downloadStatus === 'downloading' && (
        <div className="absolute inset-0 rounded-xl overflow-hidden">
          <div 
            className="absolute inset-0 bg-gradient-to-r from-cyan-400/30 to-cyan-600/30 transition-all duration-300"
            style={{ width: `${downloadProgress}%` }}
          />
        </div>
      )}

      {/* Ripple effects */}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full animate-ping pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            animationDuration: '0.6s'
          }}
        />
      ))}

      {/* Button content */}
      <span className="relative z-10 flex items-center space-x-2">
        {iconPosition === 'left' && getCurrentIcon()}
        <span className="transition-all duration-200">
          {getButtonText()}
        </span>
        {iconPosition === 'right' && getCurrentIcon()}
      </span>

      {/* Loading spinner overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-current bg-opacity-20 rounded-xl">
          <svg className="w-5 h-5 animate-spin text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
      )}

      {/* Success checkmark animation */}
      {downloadStatus === 'success' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      )}
    </button>
  )
}

export default AnimatedButton