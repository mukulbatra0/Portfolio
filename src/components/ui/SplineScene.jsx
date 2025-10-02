import React, { Suspense } from 'react'
import Spline from '@splinetool/react-spline'

const SplineScene = ({ scene, className = '', fallback = null }) => {
  return (
    <div className={`spline-container ${className}`}>
      <Suspense fallback={fallback || <div className="animate-pulse bg-slate-800 rounded-lg h-64" />}>
        <Spline 
          scene={scene}
          style={{ width: '100%', height: '100%' }}
        />
      </Suspense>
    </div>
  )
}

export default SplineScene