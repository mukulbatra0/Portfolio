import React from 'react'
import { motion } from 'framer-motion'

const SectionTransition = ({ children, className = '', delay = 0 }) => {
  const variants = {
    hidden: { 
      opacity: 0, 
      y: 30
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        delay,
        ease: "easeOut"
      }
    }
  }

  return (
    <motion.div
      className={`section-animate ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={variants}
    >
      {children}
    </motion.div>
  )
}

export default SectionTransition