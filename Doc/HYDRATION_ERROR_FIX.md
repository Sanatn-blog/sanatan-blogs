# Hydration Error Fix Guide

## Error Description
```
A tree hydrated but some attributes of the server rendered HTML didn't match the client properties. This won't be patched up.
```

## What Causes Hydration Mismatches

Hydration mismatches occur when the HTML generated on the server doesn't match what React expects on the client. Common causes include:

1. **Theme Detection**: Using `localStorage` or `window.matchMedia` during SSR
2. **Browser Extensions**: Extensions that modify the DOM (like `foxified` attribute)
3. **Dynamic Content**: Using `Date.now()`, `Math.random()`, or other changing values
4. **Client-only APIs**: Accessing browser APIs during server rendering
5. **Locale Differences**: Date/time formatting that differs between server and client

## Solutions Implemented

### 1. **Added suppressHydrationWarning**
```tsx
<html lang="en" suppressHydrationWarning>
  <body suppressHydrationWarning>
```

This tells React to ignore hydration warnings for these elements.

### 2. **Fixed Theme Detection**
- Moved theme logic to client-side only
- Added proper mounting checks
- Prevented theme-dependent rendering until mounted

### 3. **Browser Extension Attribute Cleanup**
```tsx
<script
  dangerouslySetInnerHTML={{
    __html: `
      if (typeof document !== 'undefined') {
        const html = document.documentElement;
        if (html.hasAttribute('foxified')) {
          html.removeAttribute('foxified');
        }
      }
    `,
  }}
/>
```

### 4. **Error Handlers**
- `HydrationErrorHandler`: Catches and handles hydration errors
- `GlobalErrorHandler`: Handles unhandled promise rejections
- `ErrorBoundary`: Catches React errors

## Best Practices for Preventing Hydration Issues

### 1. **Use Client Components for Browser APIs**
```tsx
'use client';

import { useEffect, useState } from 'react';

export function ClientOnlyComponent() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return <div>Loading...</div>; // Server-safe fallback
  }
  
  return <div>Client-only content</div>;
}
```

### 2. **Handle Dynamic Values Properly**
```tsx
// ❌ Bad - changes on every render
const timestamp = Date.now();

// ✅ Good - use useEffect for client-side updates
const [timestamp, setTimestamp] = useState(null);
useEffect(() => {
  setTimestamp(Date.now());
}, []);
```

### 3. **Use suppressHydrationWarning Sparingly**
Only use `suppressHydrationWarning` when you're certain the mismatch is harmless and expected.

### 4. **Check for Browser APIs**
```tsx
const isClient = typeof window !== 'undefined';
const isServer = typeof window === 'undefined';
```

## Testing Hydration Issues

### 1. **Check Browser Console**
Look for hydration warnings and errors in the browser console.

### 2. **Compare Server and Client HTML**
Use browser dev tools to compare the initial HTML with the hydrated version.

### 3. **Test with Extensions Disabled**
Test in incognito mode to rule out browser extension interference.

### 4. **Check Network Tab**
Look for any differences in the initial HTML response.

## Common Hydration Issues and Fixes

### 1. **Theme/Style Mismatches**
```tsx
// ❌ Bad
const theme = localStorage.getItem('theme') || 'light';

// ✅ Good
const [theme, setTheme] = useState('light');
useEffect(() => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  setTheme(savedTheme);
}, []);
```

### 2. **Date/Time Formatting**
```tsx
// ❌ Bad
const formattedDate = new Date().toLocaleDateString();

// ✅ Good
const [formattedDate, setFormattedDate] = useState('');
useEffect(() => {
  setFormattedDate(new Date().toLocaleDateString());
}, []);
```

### 3. **Random Values**
```tsx
// ❌ Bad
const randomId = Math.random().toString(36);

// ✅ Good
const [randomId, setRandomId] = useState('');
useEffect(() => {
  setRandomId(Math.random().toString(36));
}, []);
```

## Debugging Tools

### 1. **React DevTools**
Use React DevTools to inspect component state and props.

### 2. **Next.js Debug Mode**
```bash
NODE_ENV=development DEBUG=* npm run dev
```

### 3. **Browser DevTools**
- Elements tab: Compare server vs client HTML
- Console: Look for hydration warnings
- Network: Check initial HTML response

## When to Use suppressHydrationWarning

Use `suppressHydrationWarning` only when:
- The mismatch is expected and harmless
- You've tried all other solutions
- The content is purely cosmetic
- You understand the implications

## Monitoring and Prevention

### 1. **Add Error Logging**
```tsx
useEffect(() => {
  const handleError = (event) => {
    if (event.error?.message?.includes('hydration')) {
      // Log to your error tracking service
      console.warn('Hydration error:', event.error);
    }
  };
  
  window.addEventListener('error', handleError);
  return () => window.removeEventListener('error', handleError);
}, []);
```

### 2. **Regular Testing**
- Test in different browsers
- Test with extensions enabled/disabled
- Test in incognito mode
- Test with different user preferences

### 3. **Code Review Checklist**
- [ ] No browser APIs during SSR
- [ ] No dynamic values in initial render
- [ ] Proper mounting checks for client-only code
- [ ] Theme handling is client-side only
- [ ] Date/time formatting is consistent

## Additional Resources

- [React Hydration Documentation](https://react.dev/reference/react-dom/hydrate)
- [Next.js Hydration Guide](https://nextjs.org/docs/messages/react-hydration-error)
- [React DevTools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi) 