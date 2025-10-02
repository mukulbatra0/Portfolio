import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ 
  size = 'medium', 
  color = 'cyan', 
  text = null,
  progress = null,
  className = ""
}) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8', 
    large: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    cyan: 'border-cyan-500',
    blue: 'border-blue-500',
    green: 'border-green-500',
    purple: 'border-purple-500',
    white: 'border-white'
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      {/* Spinner */}
      <div className="relative">
        {/* Main spinner */}
        <motion.div
          className={`${sizeClasses[size]} border-2 ${colorClasses[color]} border-t-transparent rounded-full`}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Inner spinner for enhanced effect */}
        <motion.div
          className={`absolute inset-2 border ${colorClasses[color]} border-b-transparent rounded-full opacity-60`}
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Center dot */}
        <div 
          className={`absolute top-1/2 left-1/2 w-1 h-1 ${colorClasses[color].replace('border-', 'bg-')} rounded-full transform -translate-x-1/2 -translate-y-1/2`}
        />
      </div>

      {/* Progress bar */}
      {progress !== null && (
        <div className="w-32 h-1 bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${colorClasses[color].replace('border-', 'bg-')} rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}

      {/* Loading text */}
      {text && (
        <motion.p 
          className="text-slate-300 text-sm font-medium"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {text}
          {progress !== null && ` (${Math.round(progress * 100)}%)`}
        </motion.p>
      )}
    </div>
  );
};

export default LoadingSpinner;