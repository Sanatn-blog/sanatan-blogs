'use client';

import { useEffect } from 'react';

export default function HydrationErrorHandler() {
  useEffect(() => {
    // Handle hydration errors
    const handleHydrationError = (event: ErrorEvent) => {
      if (event.error?.message?.includes('hydrated') || 
          event.error?.message?.includes('hydration') ||
          event.error?.message?.includes('server rendered') ||
          event.error?.message?.includes('client properties')) {
        
        console.warn('Hydration mismatch detected:', event.error.message);
        
        // Prevent the error from breaking the app
        event.preventDefault();
        
        // Optionally force a re-render
        // window.location.reload();
      }
    };

    // Handle console errors related to hydration
    const originalConsoleError = console.error;
    console.error = (...args) => {
      const message = args.join(' ');
      if (message.includes('hydrated') || 
          message.includes('hydration') ||
          message.includes('server rendered') ||
          message.includes('client properties')) {
        console.warn('Hydration mismatch detected (console):', message);
        return; // Don't log hydration errors as errors
      }
      originalConsoleError.apply(console, args);
    };

    // Add event listener
    window.addEventListener('error', handleHydrationError);

    // Cleanup function
    return () => {
      window.removeEventListener('error', handleHydrationError);
      console.error = originalConsoleError;
    };
  }, []);

  return null; // This component doesn't render anything
} 