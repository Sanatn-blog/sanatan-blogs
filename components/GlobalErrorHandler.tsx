'use client';

import { useEffect } from 'react';

export default function GlobalErrorHandler() {
  useEffect(() => {
    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      
      // Check if it's a message channel error
      if (event.reason?.message?.includes('message channel closed') || 
          event.reason?.message?.includes('asynchronous response')) {
        console.warn('Message channel error detected. This is usually caused by browser extensions or development tools.');
        
        // Prevent the default browser error handling
        event.preventDefault();
        
        // Optionally show a user-friendly message
        // You could use a toast notification here
        console.log('Message channel error handled gracefully');
      }
    };

    // Handle unhandled errors
    const handleError = (event: ErrorEvent) => {
      console.error('Global error:', event.error);
      
      // Check if it's a message channel error
      if (event.error?.message?.includes('message channel closed') || 
          event.error?.message?.includes('asynchronous response')) {
        console.warn('Message channel error detected. This is usually caused by browser extensions or development tools.');
        
        // Prevent the default browser error handling
        event.preventDefault();
        
        console.log('Message channel error handled gracefully');
      }
      
      // Handle HMR module factory errors
      if (event.error?.message?.includes('module factory is not available') ||
          event.error?.message?.includes('error-boundary.js')) {
        console.warn('HMR module factory error detected. This is a development-time issue.');
        
        // Prevent the default browser error handling
        event.preventDefault();
        
        // In development, we can try to recover by reloading
        if (process.env.NODE_ENV === 'development' && window.location.href.includes('localhost')) {
          console.log('Attempting to recover from HMR error...');
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      }
    };

    // Add event listeners
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    // Cleanup function
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, []);

  return null; // This component doesn't render anything
} 