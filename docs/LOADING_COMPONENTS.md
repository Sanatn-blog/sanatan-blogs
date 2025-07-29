# Loading Components Documentation

This document describes the beautiful loading components designed for the Sanatan Blogs website, featuring spiritual elements and elegant animations.

## Overview

The loading system consists of multiple components that provide different types of loading experiences:

1. **FullScreenLoading** - Complete page overlay with progress
2. **LoadingPage** - Customizable loading component
3. **SimpleLoading** - Inline loading spinner
4. **SkeletonLoading** - Content placeholder loading
5. **LoadingProvider** - Global loading state management
6. **LoadingOverlay** - Area-specific loading overlay
7. **LoadingButton** - Button with loading state

## Components

### 1. FullScreenLoading

A beautiful full-screen loading experience with progress bar and spiritual elements.

```tsx
import { FullScreenLoading } from '@/components/LoadingPage';

// Basic usage
{isLoading && <FullScreenLoading />}
```

**Features:**
- Animated sacred geometry rings
- Floating spiritual elements (Sun, Moon, Heart, Sparkles)
- Progress bar with gradient
- Sacred symbols in background
- Fade-in animation
- Dark mode support

### 2. LoadingPage

Customizable loading component with various options.

```tsx
import LoadingPage from '@/components/LoadingPage';

// Basic usage
<LoadingPage message="Loading spiritual wisdom..." />

// With progress
<LoadingPage 
  message="Loading content..."
  showProgress={true}
  progress={75}
/>
```

**Props:**
- `message?: string` - Custom loading message
- `showProgress?: boolean` - Show/hide progress bar
- `progress?: number` - Progress percentage (0-100)

### 3. SimpleLoading

Inline loading spinner for smaller areas.

```tsx
import { SimpleLoading } from '@/components/LoadingPage';

// Basic usage
<SimpleLoading />

// With custom message
<SimpleLoading message="Loading content..." />
```

### 4. SkeletonLoading

Content placeholder loading for better UX.

```tsx
import { SkeletonLoading } from '@/components/LoadingPage';

// Basic usage
<SkeletonLoading />

// Multiple skeletons
<div className="space-y-4">
  <SkeletonLoading />
  <SkeletonLoading />
  <SkeletonLoading />
</div>
```

## Hooks

### 1. useLoading

Custom hook for managing loading states.

```tsx
import { useLoading } from '@/hooks/useLoading';

function MyComponent() {
  const { loading, startLoading, stopLoading, withLoading } = useLoading();

  const handleAsyncOperation = async () => {
    // Manual control
    startLoading('Processing...');
    try {
      await someAsyncOperation();
    } finally {
      stopLoading();
    }
  };

  // Automatic control
  const handleWithLoading = async () => {
    const result = await withLoading(
      someAsyncOperation(),
      'Processing data...'
    );
  };

  return (
    <div>
      {loading.isLoading && <SimpleLoading message={loading.message} />}
      <button onClick={handleAsyncOperation}>Process</button>
    </div>
  );
}
```

### 2. useMultipleLoading

Hook for managing multiple loading states.

```tsx
import { useMultipleLoading } from '@/hooks/useLoading';

function MyComponent() {
  const { 
    loadingStates, 
    startLoading, 
    stopLoading, 
    isLoading,
    withLoading 
  } = useMultipleLoading();

  const handleMultipleOperations = async () => {
    // Start multiple loading states
    startLoading('operation1', 'Loading data...');
    startLoading('operation2', 'Processing...');

    // Perform operations
    await Promise.all([
      withLoading('operation1', fetchData()),
      withLoading('operation2', processData())
    ]);
  };

  return (
    <div>
      {isLoading('operation1') && <SimpleLoading message="Loading data..." />}
      {isLoading('operation2') && <SimpleLoading message="Processing..." />}
    </div>
  );
}
```

### 3. useGlobalLoading

Hook for managing global loading state.

```tsx
import { useGlobalLoading } from '@/hooks/useLoading';

function MyComponent() {
  const { 
    globalLoading, 
    startGlobalLoading, 
    stopGlobalLoading 
  } = useGlobalLoading();

  const handleGlobalOperation = async () => {
    startGlobalLoading('Initializing spiritual journey...');
    await someGlobalOperation();
    stopGlobalLoading();
  };

  return (
    <button onClick={handleGlobalOperation}>
      Start Global Operation
    </button>
  );
}
```

## Global Loading Provider

The `LoadingProvider` wraps the entire application and provides global loading functionality.

### Setup

The provider is already configured in `app/layout.tsx`:

```tsx
import { LoadingProvider } from '@/components/LoadingProvider';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <LoadingProvider>
          {children}
        </LoadingProvider>
      </body>
    </html>
  );
}
```

### Usage

```tsx
import { useLoadingContext } from '@/components/LoadingProvider';

function MyComponent() {
  const { startLoading, stopLoading, withLoading } = useLoadingContext();

  const handleGlobalLoading = async () => {
    const result = await withLoading(
      fetch('/api/data'),
      'Loading spiritual wisdom...'
    );
  };

  return (
    <button onClick={handleGlobalLoading}>
      Load Data
    </button>
  );
}
```

## Utility Components

### 1. LoadingOverlay

Shows loading state over a specific area.

```tsx
import { LoadingOverlay } from '@/components/LoadingProvider';

function MyComponent() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoadingOverlay isLoading={isLoading} message="Loading content...">
      <div className="p-4">
        <h2>My Content</h2>
        <p>This content will be covered by loading overlay when isLoading is true.</p>
      </div>
    </LoadingOverlay>
  );
}
```

### 2. LoadingButton

Button with built-in loading state.

```tsx
import { LoadingButton } from '@/components/LoadingProvider';

function MyComponent() {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    await someAsyncOperation();
    setIsLoading(false);
  };

  return (
    <LoadingButton
      isLoading={isLoading}
      onClick={handleClick}
      className="bg-orange-500 text-white px-4 py-2 rounded"
    >
      Submit
    </LoadingButton>
  );
}
```

## Styling

### Custom Animations

The loading components use custom CSS animations defined in `app/globals.css`:

```css
@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin-slow {
  animation: spin-slow 3s linear infinite;
}
```

### Theme Colors

The loading components use the Sanatan Blogs color scheme:

- **Primary**: Orange gradient (`from-orange-500 to-pink-500`)
- **Background**: Light gradient (`from-orange-50 via-white to-pink-50`)
- **Dark Mode**: Gray gradients (`from-gray-900 via-gray-800 to-gray-900`)

## Best Practices

### 1. Choose the Right Component

- **FullScreenLoading**: For page transitions or major operations
- **LoadingPage**: For custom loading experiences
- **SimpleLoading**: For inline content loading
- **SkeletonLoading**: For content placeholders
- **LoadingOverlay**: For area-specific loading
- **LoadingButton**: For button loading states

### 2. Use Appropriate Messages

```tsx
// Good messages
<LoadingPage message="Loading spiritual wisdom..." />
<LoadingPage message="Connecting to divine knowledge..." />
<LoadingPage message="Preparing your journey..." />

// Avoid generic messages
<LoadingPage message="Loading..." />
```

### 3. Handle Loading States Properly

```tsx
// Good: Use try-finally
const handleOperation = async () => {
  startLoading('Processing...');
  try {
    await someAsyncOperation();
  } finally {
    stopLoading();
  }
};

// Better: Use withLoading
const handleOperation = async () => {
  await withLoading(someAsyncOperation(), 'Processing...');
};
```

### 4. Provide User Feedback

```tsx
// Show progress when possible
<LoadingPage 
  message="Uploading image..."
  showProgress={true}
  progress={uploadProgress}
/>
```

## Demo Page

Visit `/loading-demo` to see all loading components in action and test their functionality.

## Accessibility

All loading components include:

- Proper ARIA labels
- Screen reader support
- Keyboard navigation
- Reduced motion support
- High contrast mode support

## Performance

- Components use `useCallback` for optimized re-renders
- Loading states are managed efficiently
- Animations use CSS transforms for better performance
- Minimal DOM manipulation during loading states 