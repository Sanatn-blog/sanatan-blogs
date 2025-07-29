'use client';

import { useState, useCallback } from 'react';

interface LoadingState {
  isLoading: boolean;
  message?: string;
  progress?: number;
}

interface UseLoadingReturn {
  loading: LoadingState;
  startLoading: (message?: string) => void;
  stopLoading: () => void;
  updateProgress: (progress: number) => void;
  updateMessage: (message: string) => void;
  withLoading: (promise: Promise<unknown>, message?: string) => Promise<unknown>;
}

export function useLoading(initialMessage?: string): UseLoadingReturn {
  const [loading, setLoading] = useState<LoadingState>({
    isLoading: false,
    message: initialMessage || 'Loading...',
    progress: 0,
  });

  const startLoading = useCallback((message?: string) => {
    setLoading({
      isLoading: true,
      message: message || 'Loading...',
      progress: 0,
    });
  }, []);

  const stopLoading = useCallback(() => {
    setLoading({
      isLoading: false,
      message: 'Loading...',
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

  const withLoading = useCallback(async (
    promise: Promise<unknown>,
    message?: string
  ): Promise<unknown> => {
    try {
      startLoading(message);
      const result = await promise;
      return result;
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);

  return {
    loading,
    startLoading,
    stopLoading,
    updateProgress,
    updateMessage,
    withLoading,
  };
}

// Hook for managing multiple loading states
export function useMultipleLoading() {
  const [loadingStates, setLoadingStates] = useState<Record<string, LoadingState>>({});

  const startLoading = useCallback((key: string, message?: string) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: {
        isLoading: true,
        message: message || 'Loading...',
        progress: 0,
      },
    }));
  }, []);

  const stopLoading = useCallback((key: string) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: {
        isLoading: false,
        message: 'Loading...',
        progress: 0,
      },
    }));
  }, []);

  const updateProgress = useCallback((key: string, progress: number) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        progress: Math.min(100, Math.max(0, progress)),
      },
    }));
  }, []);

  const updateMessage = useCallback((key: string, message: string) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        message,
      },
    }));
  }, []);

  const withLoading = useCallback(async (
    key: string,
    promise: Promise<unknown>,
    message?: string
  ): Promise<unknown> => {
    try {
      startLoading(key, message);
      const result = await promise;
      return result;
    } finally {
      stopLoading(key);
    }
  }, [startLoading, stopLoading]);

  const isLoading = useCallback((key?: string) => {
    if (key) {
      return loadingStates[key]?.isLoading || false;
    }
    return Object.values(loadingStates).some(state => state.isLoading);
  }, [loadingStates]);

  const getLoadingState = useCallback((key: string) => {
    return loadingStates[key] || { isLoading: false, message: 'Loading...', progress: 0 };
  }, [loadingStates]);

  return {
    loadingStates,
    startLoading,
    stopLoading,
    updateProgress,
    updateMessage,
    withLoading,
    isLoading,
    getLoadingState,
  };
}

// Hook for managing global loading state
export function useGlobalLoading() {
  const [globalLoading, setGlobalLoading] = useState<LoadingState>({
    isLoading: false,
    message: 'Loading spiritual wisdom...',
    progress: 0,
  });

  const startGlobalLoading = useCallback((message?: string) => {
    setGlobalLoading({
      isLoading: true,
      message: message || 'Loading spiritual wisdom...',
      progress: 0,
    });
  }, []);

  const stopGlobalLoading = useCallback(() => {
    setGlobalLoading({
      isLoading: false,
      message: 'Loading spiritual wisdom...',
      progress: 0,
    });
  }, []);

  const updateGlobalProgress = useCallback((progress: number) => {
    setGlobalLoading(prev => ({
      ...prev,
      progress: Math.min(100, Math.max(0, progress)),
    }));
  }, []);

  const updateGlobalMessage = useCallback((message: string) => {
    setGlobalLoading(prev => ({
      ...prev,
      message,
    }));
  }, []);

  return {
    globalLoading,
    startGlobalLoading,
    stopGlobalLoading,
    updateGlobalProgress,
    updateGlobalMessage,
  };
} 