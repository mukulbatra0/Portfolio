import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { monitorPerformance } from './utils/webVitals'
import { register as registerSW } from './utils/serviceWorker'

// Initialize performance monitoring only in production
if (process.env.NODE_ENV === 'production') {
  monitorPerformance();
}

// Register optimized service worker for better performance
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw-optimized.js')
      .then((registration) => {
        console.log('Service Worker: Registered successfully', registration.scope);
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('Service Worker: New content available, please refresh');
              // Optionally show update notification to user
            }
          });
        });
      })
      .catch((error) => {
        console.log('Service Worker: Registration failed', error);
      });
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)