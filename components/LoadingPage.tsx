'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Heart, Sparkles, Sun, Moon } from 'lucide-react';

interface LoadingPageProps {
  message?: string;
  showProgress?: boolean;
  progress?: number;
}

export default function LoadingPage({ 
  message = "Loading spiritual wisdom...", 
  showProgress = false, 
  progress = 0 
}: LoadingPageProps) {
  const [currentDot, setCurrentDot] = useState(0);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true);
    
    const dotInterval = setInterval(() => {
      setCurrentDot((prev) => (prev + 1) % 4);
    }, 500);

    return () => clearInterval(dotInterval);
  }, []);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-opacity duration-1000 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
      <div className="relative">
        {/* Main Loading Container */}
        <div className="relative flex flex-col items-center space-y-8 p-12">
          
          {/* Sacred Symbol Container */}
          <div className="relative">
            {/* Outer Ring */}
            <div className="w-32 h-32 border-4 border-orange-200 dark:border-orange-800 rounded-full animate-spin-slow">
              <div className="absolute inset-2 border-4 border-pink-200 dark:border-pink-800 rounded-full animate-spin-slow-reverse"></div>
            </div>
            
            {/* Center Logo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-2xl animate-pulse">
                <BookOpen className="w-8 h-8" />
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -left-4">
              <Sparkles className="w-6 h-6 text-orange-400 animate-bounce" />
            </div>
            <div className="absolute -top-4 -right-4">
              <Heart className="w-6 h-6 text-pink-400 animate-bounce" style={{ animationDelay: '0.5s' }} />
            </div>
            <div className="absolute -bottom-4 -left-4">
              <Sun className="w-6 h-6 text-yellow-400 animate-spin" />
            </div>
            <div className="absolute -bottom-4 -right-4">
              <Moon className="w-6 h-6 text-blue-400 animate-pulse" />
            </div>
          </div>

          {/* Text Content */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
              सनातन Blogs
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">
              {message}
              <span className="inline-block ml-1">
                {'.'.repeat(currentDot)}
              </span>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Connecting to divine wisdom
            </p>
          </div>

          {/* Progress Bar */}
          {showProgress && (
            <div className="w-64 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-orange-500 to-pink-500 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}

          {/* Sacred Geometry Pattern */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-orange-400 rounded-full animate-ping"></div>
            <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-yellow-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>
          </div>
        </div>

        {/* Background Sacred Symbols */}
        <div className="absolute inset-0 pointer-events-none opacity-5">
          <div className="absolute top-10 left-10 text-6xl">ॐ</div>
          <div className="absolute top-20 right-20 text-4xl">🕉</div>
          <div className="absolute bottom-20 left-20 text-4xl">☸</div>
          <div className="absolute bottom-10 right-10 text-6xl">🕉</div>
        </div>
      </div>
    </div>
  );
}

// Full Screen Loading Component
export function FullScreenLoading() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <LoadingPage 
      message="Initializing spiritual journey..."
      showProgress={true}
      progress={progress}
    />
  );
}

// Simple Loading Component
export function SimpleLoading({ message }: { message?: string }) {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
        </div>
        {message && (
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

// Skeleton Loading Component
export function SkeletonLoading() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
      </div>
    </div>
  );
} 