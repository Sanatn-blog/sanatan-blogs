'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import LoadingPage from './LoadingPage';

interface LoadingState {
  isLoading: boolean;
  message?: string;
  progress?: number;
}

interface LoadingContextType {
  loading: LoadingState;
  startLoading: (message?: string) => void;
  stopLoading: () => void;
  updateProgress: (progress: number) => void;
  updateMessage: (message: string) => void;
  withLoading: <T>(promise: Promise<T>, message?: string) => Promise<T>;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

interface LoadingProviderProps {
  children: ReactNode;
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [loading, setLoading] = useState<LoadingState>({
    isLoading: false,
    message: 'Loading spiritual wisdom...',
    progress: 0,
  });

  const startLoading = useCallback((message?: string) => {
    setLoading({
      isLoading: true,
      message: message || 'Loading spiritual wisdom...',
      progress: 0,
    });
  }, []);

  const stopLoading = useCallback(() => {
    setLoading({
      isLoading: false,
      message: 'Loading spiritual wisdom...',
      progress: 0,
    });
  }, []);

  const updateProgress = useCallback((progress: number) => {
    setLoading(prev => ({
      ...prev,
      progress: Math.min(100, Math.max(0, progress)),
    }));
  }, []);

  const updateMessage = useCallback((message: string) => {
    setLoading(prev => ({
      ...prev,
      message,
    }));
  }, []);

  const withLoading = useCallback(<T,>(
    promise: Promise<T>, 
    message?: string
  ): Promise<T> => {
    return (async () => {
      try {
        startLoading(message);
        const result = await promise;
        return result;
      } finally {
        stopLoading();
      }
    })();
  }, [startLoading, stopLoading]);

  const value = {
    loading,
    startLoading,
    stopLoading,
    updateProgress,
    updateMessage,
    withLoading,
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
      {loading.isLoading && (
        <LoadingPage
          message={loading.message}
          showProgress={true}
          progress={loading.progress}
        />
      )}
    </LoadingContext.Provider>
  );
}

export function useLoadingContext() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoadingContext must be used within a LoadingProvider');
  }
  return context;
}

// Higher-order component for wrapping components with loading functionality
export function withLoading<T extends object>(
  Component: React.ComponentType<T>
) {
  return function WrappedComponent(props: T) {
    const { withLoading: withLoadingFn } = useLoadingContext();
    
    const handleAsyncOperation = <R,>(
      operation: () => Promise<R>,
      message?: string
    ): Promise<R> => {
      return withLoadingFn(operation(), message);
    };

    return (
      <Component
        {...props}
        handleAsyncOperation={handleAsyncOperation}
      />
    );
  };
}

// Component for showing loading state in specific areas
export function LoadingOverlay({ 
  isLoading, 
  message, 
  children 
}: { 
  isLoading: boolean; 
  message?: string; 
  children: ReactNode; 
}) {
  if (!isLoading) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {children}
      <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-10">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
          {message && (
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Component for showing loading state in buttons
export function LoadingButton({ 
  isLoading, 
  children, 
  className = "",
  ...props 
}: { 
  isLoading: boolean; 
  children: ReactNode; 
  className?: string;
  [key: string]: unknown;
}) {
  return (
    <button
      className={`relative ${className}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-800/80 rounded">
          <div className="w-4 h-4 border-2 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
        </div>
      )}
      <span className={isLoading ? 'opacity-0' : ''}>
        {children}
      </span>
    </button>
  );
} 