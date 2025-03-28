# Hook Validator

This tool scans your React components for common hook-related issues, helping prevent the "X is not defined" errors that can occur when React hooks are used incorrectly.

## Common Hook Issues

1. **Missing `useState` Import**: Using `useState` without importing it from React.
2. **Missing `useEffect` Import**: Using `useEffect` without importing it from React.
3. **Missing `'use client'` Directive**: Using hooks in components without marking them as client components.

## Usage

To run the hook validator manually:

```bash
npm run validate-hooks
```

This will scan all `.tsx` and `.jsx` files in the `src/components` directory and report any potential issues.

### Automatic Fixing

To automatically fix the issues identified by the validator:

```bash
npm run fix-hooks
```

This script will:
1. Run the validator to identify components with issues
2. Apply the necessary fixes to each component (adding missing imports, etc.)
3. Run the validator again to confirm all issues are resolved

## Pre-commit Hook

A pre-commit hook has been set up to automatically run the hook validator before each commit. This helps catch hook-related issues before they make it into the codebase.

## Common Fixes

When the hook validator finds issues, here's how to fix them:

### 1. Missing 'use client' Directive

Add the `'use client'` directive at the top of any component file that uses React hooks:

```tsx
'use client';

import React from 'react';
// Rest of your component
```

### 2. Missing Hook Imports

Make sure to import any hooks you use:

```tsx
// BAD - hooks used without imports
const [state, setState] = useState(initialState);
useEffect(() => { /* ... */ }, []);

// GOOD - hooks properly imported
import React, { useState, useEffect } from 'react';

const [state, setState] = useState(initialState);
useEffect(() => { /* ... */ }, []);
```

### 3. Side Effects in Render Functions

Move all side effects to appropriate lifecycle hooks:

```tsx
// BAD - side effect in render function
function Component() {
  // This will cause warnings
  someStore.subscribe((state) => {
    // Do something with state
  });
  
  return <div>...</div>;
}

// GOOD - side effect in useEffect
function Component() {
  useEffect(() => {
    const unsubscribe = someStore.subscribe((state) => {
      // Do something with state
    });
    
    // Clean up subscription
    return () => unsubscribe();
  }, []);
  
  return <div>...</div>;
}
```

## Adding Custom Hooks

If your project uses custom hooks that aren't detected by the validator, you can add them to the `CUSTOM_HOOKS` array in the `hook-validator.js` file:

```js
// In scripts/hook-validator.js
const CUSTOM_HOOKS = [
  'useStore',
  'useCareerAgent',
  // Add your custom hook name here
  'useYourCustomHook'
];
```

## Troubleshooting

If you're getting false positives, check if your hook names are being properly detected. The validator looks for patterns like `hookName(...)` to identify hook usage.
