#!/usr/bin/env node

/**
 * Component Fixer Script
 * 
 * This script automatically fixes common React hook issues:
 * 1. Ensures 'use client' directive is present
 * 2. Ensures React is imported
 * 3. Ensures all used hooks are properly imported
 * 
 * Usage:
 *   node component-fixer.js <file-path>
 */

const fs = require('fs');
const path = require('path');

// List of common React hooks to check for
const REACT_HOOKS = [
  'useState',
  'useEffect',
  'useContext',
  'useReducer',
  'useCallback',
  'useMemo',
  'useRef',
  'useImperativeHandle',
  'useLayoutEffect',
  'useDebugValue',
  'useTransition',
  'useDeferredValue',
  'useId'
];

// Fix a component file
async function fixComponentFile(filePath) {
  try {
    // Read the file content
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    
    // Check for 'use client' directive
    const hasUseClientDirective = content.includes('\'use client\'') || content.includes('"use client"');
    
    // Check if React is imported
    const hasReactImport = /import\s+React\b/.test(content);
    
    // Identify imported hooks
    const importedHooks = [];
    const namedImportMatches = content.match(/import\s+{([^}]*)}\s+from\s+['"]react['"]/g);
    if (namedImportMatches) {
      for (const match of namedImportMatches) {
        const hookMatches = match.match(/import\s+{([^}]*)}\s+from/);
        if (hookMatches && hookMatches[1]) {
          const hooks = hookMatches[1].split(',')
            .map(h => h.trim())
            .filter(h => REACT_HOOKS.includes(h));
          importedHooks.push(...hooks);
        }
      }
    }
    
    // Identify used hooks
    const usedHooks = [];
    for (const hook of REACT_HOOKS) {
      const regex = new RegExp(`\\b${hook}\\s*\\(`, 'g');
      if (regex.test(content)) {
        usedHooks.push(hook);
      }
    }
    
    // Fix issues
    
    // 1. Add 'use client' directive if missing
    if (!hasUseClientDirective && usedHooks.length > 0) {
      content = '\'use client\';\n\n' + content;
    }
    
    // 2. Fix React imports
    const missingHooks = usedHooks.filter(h => !importedHooks.includes(h));
    
    if (!hasReactImport && usedHooks.length > 0) {
      // If we need to add React import and there are hooks
      if (missingHooks.length > 0) {
        const newImport = `import React, { ${missingHooks.join(', ')} } from 'react';\n`;
        content = content.replace(/^['"]use client['"];?\n+/, `'use client';\n\n${newImport}`);
      } else {
        const newImport = `import React from 'react';\n`;
        content = content.replace(/^['"]use client['"];?\n+/, `'use client';\n\n${newImport}`);
      }
    } 
    // If React is already imported but hooks are missing
    else if (hasReactImport && missingHooks.length > 0) {
      // If we already have a named import from react
      if (content.match(/import\s+React,\s*{([^}]*)}\s+from\s+['"]react['"]/)) {
        // Add hooks to existing named import
        content = content.replace(
          /import\s+React,\s*{([^}]*)}\s+from\s+['"]react['"]/,
          `import React, { $1, ${missingHooks.join(', ')} } from 'react'`
        );
      }
      // If we have a simple React import
      else if (content.match(/import\s+React\s+from\s+['"]react['"]/)) {
        content = content.replace(
          /import\s+React\s+from\s+['"]react['"]/,
          `import React, { ${missingHooks.join(', ')} } from 'react'`
        );
      }
    }
    
    // Write changes back to file if there were changes
    if (originalContent !== content) {
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error);
    return false;
  }
}

// Main function
async function main() {
  const filePath = process.argv[2];
  
  if (!filePath) {
    console.error('Please provide a file path');
    process.exit(1);
  }
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    console.error(`File does not exist: ${filePath}`);
    process.exit(1);
  }
  
  // Fix the component
  const changed = await fixComponentFile(filePath);
  
  if (changed) {
    console.log(`✅ Fixed issues in: ${filePath}`);
  } else {
    console.log(`ℹ️ No changes required for: ${filePath}`);
  }
}

// Run the script
main().catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
