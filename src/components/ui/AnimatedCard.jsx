import React from 'react'
import { motion } from 'framer-motion'

const AnimatedCard = ({ children, className = '', delay = 0, index = 0 }) => {
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        delay: delay + (index * 0.03),
        ease: "easeOut"
      }
    }
  }

  return (
    <motion.div
      className={`card-item ${className}`}
      initial="hidden"
      whileInView="visible"
      whileHover={{ 
        y: -10, 
        scale: 1.02,
        transition: { duration: 0.3 }
      }}
      viewport={{ once: true, margin: '-20px' }}
      variants={cardVariants}
    >
      {children}
    </motion.div>
  )
}

export default AnimatedCard