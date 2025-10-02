import React from 'react';
import { motion } from 'framer-motion';

const SkeletonScreen = ({ 
  type = 'card',
  count = 1,
  className = ""
}) => {
  const shimmerVariants = {
    initial: { x: '-100%' },
    animate: { 
      x: '100%',
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const SkeletonCard = () => (
    <div className="glass-morphism rounded-xl border border-white/10 p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <div className="relative w-12 h-12 bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-600 to-transparent"
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
          />
        </div>
        <div className="space-y-2 flex-1">
          <div className="relative h-4 bg-slate-700 rounded w-3/4 overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-600 to-transparent"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
            />
          </div>
          <div className="relative h-3 bg-slate-700 rounded w-1/2 overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-600 to-transparent"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
            />
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className={`relative h-3 bg-slate-700 rounded overflow-hidden ${
            i === 2 ? 'w-2/3' : 'w-full'
          }`}>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-600 to-transparent"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              transition={{ delay: i * 0.1 }}
            />
          </div>
        ))}
      </div>
      
      {/* Footer */}
      <div className="flex space-x-2 pt-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="relative h-6 w-16 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-600 to-transparent"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              transition={{ delay: i * 0.05 }}
            />
          </div>
        ))}
      </div>
    </div>
  );

  const SkeletonList = () => (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4 glass-morphism rounded-lg border border-white/10">
          <div className="relative w-10 h-10 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-600 to-transparent"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              transition={{ delay: i * 0.1 }}
            />
          </div>
          <div className="flex-1 space-y-2">
            <div className="relative h-4 bg-slate-700 rounded w-3/4 overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-600 to-transparent"
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: i * 0.1 }}
              />
            </div>
            <div className="relative h-3 bg-slate-700 rounded w-1/2 overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-600 to-transparent"
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: i * 0.1 + 0.05 }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const SkeletonText = () => (
    <div className="space-y-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className={`relative h-4 bg-slate-700 rounded overflow-hidden ${
          i === 3 ? 'w-2/3' : 'w-full'
        }`}>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-600 to-transparent"
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
            transition={{ delay: i * 0.1 }}
          />
        </div>
      ))}
    </div>
  );

  const SkeletonImage = () => (
    <div className="relative w-full h-48 bg-slate-700 rounded-lg overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-600 to-transparent"
        variants={shimmerVariants}
        initial="initial"
        animate="animate"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <svg className="w-12 h-12 text-slate-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19M21,19L16,10L11,17L7,13L3,19H21Z"/>
        </svg>
      </div>
    </div>
  );

  const SkeletonGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );

  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return count > 1 ? <SkeletonGrid /> : <SkeletonCard />;
      case 'list':
        return <SkeletonList />;
      case 'text':
        return <SkeletonText />;
      case 'image':
        return <SkeletonImage />;
      case 'grid':
        return <SkeletonGrid />;
      default:
        return <SkeletonCard />;
    }
  };

  return (
    <div className={`animate-pulse ${className}`}>
      {renderSkeleton()}
    </div>
  );
};

export default SkeletonScreen;