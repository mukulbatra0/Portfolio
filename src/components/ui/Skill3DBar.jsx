import React, { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text, Box, Cylinder } from '@react-three/drei'
import * as THREE from 'three'

// 3D Skill Bar Component
const SkillBar3D = ({ proficiency, isVisible, color = '#22D3EE', index = 0 }) => {
  const barRef = useRef()
  const glowRef = useRef()
  const [animatedProficiency, setAnimatedProficiency] = useState(0)

  // Animate proficiency value
  useEffect(() => {
    if (isVisible) {
      const duration = 2000 + (index * 200) // Staggered animation
      const startTime = Date.now()
      
      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        // Easing function for smooth animation
        const easeOutCubic = 1 - Math.pow(1 - progress, 3)
        const currentValue = easeOutCubic * proficiency
        
        setAnimatedProficiency(currentValue)
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      
      animate()
    }
  }, [isVisible, proficiency, index])

  // Animate the 3D bar
  useFrame((state) => {
    if (barRef.current && glowRef.current) {
      // Subtle floating animation
      barRef.current.position.y = Math.sin(state.clock.elapsedTime + index) * 0.05
      
      // Glow effect animation
      const glowIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 2 + index) * 0.2
      glowRef.current.material.opacity = glowIntensity
      
      // Scale animation based on proficiency
      const targetScale = animatedProficiency / 100
      barRef.current.scale.x = THREE.MathUtils.lerp(barRef.current.scale.x, targetScale, 0.05)
    }
  })

  return (
    <group>
      {/* Background bar */}
      <Box
        args={[4, 0.3, 0.3]}
        position={[0, 0, 0]}
      >
        <meshStandardMaterial 
          color="#1e293b" 
          transparent 
          opacity={0.3}
        />
      </Box>
      
      {/* Progress bar */}
      <Box
        ref={barRef}
        args={[4, 0.3, 0.3]}
        position={[-2 + (animatedProficiency / 100) * 2, 0, 0]}
      >
        <meshStandardMaterial 
          color={color}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </Box>
      
      {/* Glow effect */}
      <Box
        ref={glowRef}
        args={[4.2, 0.5, 0.5]}
        position={[-2 + (animatedProficiency / 100) * 2, 0, 0]}
      >
        <meshStandardMaterial 
          color={color}
          transparent
          opacity={0.3}
          emissive={color}
          emissiveIntensity={0.1}
        />
      </Box>
      
      {/* Percentage indicator */}
      <Cylinder
        args={[0.1, 0.1, 0.6]}
        position={[-2 + (animatedProficiency / 100) * 4, 0.5, 0]}
      >
        <meshStandardMaterial 
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.1}
        />
      </Cylinder>
    </group>
  )
}

// Main 3D Skill Bar Container
const Skill3DBar = ({ 
  skill, 
  isVisible = false, 
  index = 0,
  onHover = () => {},
  onClick = () => {}
}) => {
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  const handlePointerEnter = () => {
    setHovered(true)
    onHover(skill, true)
  }

  const handlePointerLeave = () => {
    setHovered(false)
    onHover(skill, false)
  }

  const handleClick = () => {
    setClicked(!clicked)
    onClick(skill)
  }

  return (
    <div className={`skill-3d-container relative ${hovered ? 'hovered' : ''}`}>
      {/* Skill Label */}
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-light-gray">{skill.name}</h4>
        <span className="text-xs text-accent-cyan font-semibold">
          {Math.round(skill.proficiency)}%
        </span>
      </div>
      
      {/* 3D Canvas */}
      <div 
        className="h-16 w-full cursor-pointer transition-all duration-300 hover:scale-105"
        onMouseEnter={handlePointerEnter}
        onMouseLeave={handlePointerLeave}
        onClick={handleClick}
      >
        <Canvas
          camera={{ position: [0, 0, 8], fov: 50 }}
          style={{ background: 'transparent' }}
        >
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={0.8} />
          <pointLight position={[-10, -10, -10]} intensity={0.3} color="#22D3EE" />
          
          {/* 3D Skill Bar */}
          <SkillBar3D
            proficiency={skill.proficiency}
            isVisible={isVisible}
            color={hovered ? '#06b6d4' : '#22D3EE'}
            index={index}
          />
        </Canvas>
      </div>
      
      {/* Experience and Projects Info */}
      <div className="mt-2 text-xs text-neutral-slate">
        <div className="flex items-center justify-between">
          <span>{skill.experience}</span>
          <span>{skill.projects.length} projects</span>
        </div>
      </div>
      
      {/* Hover Details */}
      {hovered && (
        <div className="absolute top-full left-0 right-0 mt-2 p-3 glass-card z-10 animate-fadeInUp">
          <div className="text-sm">
            <div className="font-medium text-accent-cyan mb-1">Experience Details</div>
            <div className="text-neutral-slate mb-2">{skill.experience} of hands-on experience</div>
            
            {skill.projects.length > 0 && (
              <>
                <div className="font-medium text-accent-cyan mb-1">Used in Projects:</div>
                <div className="flex flex-wrap gap-1">
                  {skill.projects.slice(0, 3).map((project, idx) => (
                    <span 
                      key={idx}
                      className="px-2 py-1 text-xs bg-accent-cyan bg-opacity-10 text-accent-cyan rounded border border-accent-cyan border-opacity-20"
                    >
                      {project}
                    </span>
                  ))}
                  {skill.projects.length > 3 && (
                    <span className="text-xs text-neutral-slate">
                      +{skill.projects.length - 3} more
                    </span>
                  )}\n                </div>\n              </>\n            )}\n          </div>\n        </div>\n      )}\n      \n      {/* Click Details Modal */}\n      {clicked && (\n        <div className=\"fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50\" onClick={() => setClicked(false)}>\n          <div className=\"glass-card max-w-md w-full mx-4 p-6\" onClick={(e) => e.stopPropagation()}>\n            <div className=\"flex items-center justify-between mb-4\">\n              <h3 className=\"text-lg font-semibold text-accent-cyan\">{skill.name}</h3>\n              <button \n                onClick={() => setClicked(false)}\n                className=\"text-neutral-slate hover:text-light-gray transition-colors\"\n              >\n                ✕\n              </button>\n            </div>\n            \n            <div className=\"space-y-4\">\n              <div>\n                <div className=\"text-sm font-medium text-light-gray mb-1\">Proficiency Level</div>\n                <div className=\"flex items-center space-x-2\">\n                  <div className=\"flex-1 h-2 bg-neutral-slate bg-opacity-20 rounded-full overflow-hidden\">\n                    <div \n                      className=\"h-full bg-accent-cyan rounded-full transition-all duration-1000\"\n                      style={{ width: `${skill.proficiency}%` }}\n                    />\n                  </div>\n                  <span className=\"text-sm font-semibold text-accent-cyan\">\n                    {skill.proficiency}%\n                  </span>\n                </div>\n              </div>\n              \n              <div>\n                <div className=\"text-sm font-medium text-light-gray mb-1\">Experience</div>\n                <div className=\"text-sm text-neutral-slate\">{skill.experience}</div>\n              </div>\n              \n              {skill.projects.length > 0 && (\n                <div>\n                  <div className=\"text-sm font-medium text-light-gray mb-2\">Related Projects</div>\n                  <div className=\"grid grid-cols-2 gap-2\">\n                    {skill.projects.map((project, idx) => (\n                      <div \n                        key={idx}\n                        className=\"px-3 py-2 text-sm bg-accent-cyan bg-opacity-10 text-accent-cyan rounded border border-accent-cyan border-opacity-20 text-center\"\n                      >\n                        {project}\n                      </div>\n                    ))}\n                  </div>\n                </div>\n              )}\n              \n              <div className=\"pt-4 border-t border-neutral-slate border-opacity-20\">\n                <button \n                  onClick={() => setClicked(false)}\n                  className=\"w-full btn-primary\"\n                >\n                  Close Details\n                </button>\n              </div>\n            </div>\n          </div>\n        </div>\n      )}\n    </div>\n  )\n}\n\nexport default Skill3DBar"