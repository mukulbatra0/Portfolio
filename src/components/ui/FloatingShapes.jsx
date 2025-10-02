import React, { useEffect, useRef } from 'react'

const FloatingShapes = ({ 
  count = 6, 
  colors = ['#22D3EE', '#64748B', '#F4F4F4'],
  sizes = [20, 40, 60],
  speed = 0.5,
  opacity = 0.1,
  className = ''
}) => {
  const containerRef = useRef(null)
  const shapesRef = useRef([])
  const animationRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Initialize shapes
    const shapes = []
    for (let i = 0; i < count; i++) {
      const shape = {
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        size: sizes[Math.floor(Math.random() * sizes.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 2,
        opacity: Math.random() * opacity + 0.05,
        shape: Math.random() > 0.5 ? 'circle' : 'square',
        pulsePhase: Math.random() * Math.PI * 2
      }
      shapes.push(shape)
    }
    shapesRef.current = shapes

    // Animation loop
    const animate = (timestamp) => {
      const containerRect = container.getBoundingClientRect()
      const containerWidth = containerRect.width
      const containerHeight = containerRect.height

      shapesRef.current.forEach(shape => {
        // Update position
        shape.x += shape.vx
        shape.y += shape.vy

        // Bounce off edges
        if (shape.x < 0 || shape.x > containerWidth) {
          shape.vx *= -1
        }
        if (shape.y < 0 || shape.y > containerHeight) {
          shape.vy *= -1
        }

        // Keep shapes in bounds
        shape.x = Math.max(0, Math.min(containerWidth, shape.x))
        shape.y = Math.max(0, Math.min(containerHeight, shape.y))

        // Update rotation
        shape.rotation += shape.rotationSpeed

        // Update pulse
        shape.pulsePhase += 0.02
        const pulseScale = 1 + Math.sin(shape.pulsePhase) * 0.1
        
        // Find or create DOM element
        let element = container.querySelector(`[data-shape-id="${shape.id}"]`)
        if (!element) {
          element = document.createElement('div')
          element.setAttribute('data-shape-id', shape.id)
          element.className = `absolute pointer-events-none transition-all duration-1000 ${
            shape.shape === 'circle' ? 'rounded-full' : 'rounded-lg'
          }`
          container.appendChild(element)
        }

        // Update element styles
        element.style.left = `${shape.x}px`
        element.style.top = `${shape.y}px`
        element.style.width = `${shape.size * pulseScale}px`
        element.style.height = `${shape.size * pulseScale}px`
        element.style.backgroundColor = shape.color
        element.style.opacity = shape.opacity
        element.style.transform = `translate(-50%, -50%) rotate(${shape.rotation}deg)`
        element.style.filter = 'blur(1px)'
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    // Cleanup function
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      // Clean up DOM elements
      const elements = container.querySelectorAll('[data-shape-id]')
      elements.forEach(el => el.remove())
    }
  }, [count, colors, sizes, speed, opacity])

  return (
    <div 
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{ zIndex: 1 }}
    />
  )
}

export default FloatingShapes