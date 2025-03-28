#!/usr/bin/env node

/**
 * Component Fixer Script (Updated)
 * 
 * This script automatically fixes common React hook issues:
 * 1. Ensures 'use client' directive is present
 * 2. Ensures React is imported
 * 3. Ensures all used hooks are properly imported
 * 
 * Usage:
 *   node component-fixer-updated.js <file-path>
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
    
    // Check for combined import: "import React, { useState, useEffect } from 'react';"
    const combinedImportRegex = /import\s+React,\s*{([^}]*)}\s+from\s+['"]react['"]/;
    const combinedMatch = content.match(combinedImportRegex);
    if (combinedMatch && combinedMatch[1]) {
      const hooks = combinedMatch[1].split(',')
        .map(h => h.trim())
        .filter(h => REACT_HOOKS.includes(h));
      importedHooks.push(...hooks);
    }
    
    // Check for named import: "import { useState, useEffect } from 'react';"
    const namedImportRegex = /import\s+{([^}]*)}\s+from\s+['"]react['"]/g;
    const namedImportMatches = content.match(namedImportRegex) || [];
    for (const match of namedImportMatches) {
      const hookMatch = match.match(/import\s+{([^}]*)}\s+from/);
      if (hookMatch && hookMatch[1]) {
        const hooks = hookMatch[1].split(',')
          .map(h => h.trim())
          .filter(h => REACT_HOOKS.includes(h));
        importedHooks.push(...hooks);
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
    
    // Output debug info
    console.log(`Debug for ${path.basename(filePath)}:`);
    console.log(`- Used hooks: ${usedHooks.join(', ')}`);
    console.log(`- Imported hooks: ${importedHooks.join(', ')}`);
    console.log(`- Has React import: ${hasReactImport}`);
    console.log(`- Is client component: ${hasUseClientDirective}`);
    
    // Fix issues
    
    // 1. Add 'use client' directive if missing
    if (!hasUseClientDirective && usedHooks.length > 0) {
      content = '\'use client\';\n\n' + content;
    }
    
    // 2. Fix React imports
    const missingHooks = usedHooks.filter(h => !importedHooks.includes(h));
    
    if (missingHooks.length > 0) {
      console.log(`- Missing hooks: ${missingHooks.join(', ')}`);
    }
    
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
    
    // Fix duplicated imports (e.g., "import React, { useState, useState } from 'react';")
    content = fixDuplicateImports(content);
    
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

// Function to fix duplicate imports
function fixDuplicateImports(content) {
  // Fix duplicates in combined imports
  const combinedRegex = /import\s+React,\s*{([^}]*)}\s+from\s+['"]react['"]/;
  const combinedMatch = content.match(combinedRegex);
  
  if (combinedMatch && combinedMatch[1]) {
    const importedHooks = combinedMatch[1].split(',').map(h => h.trim());
    // Remove duplicates by creating a Set and converting back to array
    const uniqueHooks = [...new Set(importedHooks)];
    
    // Replace with deduplicated hooks
    content = content.replace(
      combinedRegex,
      `import React, { ${uniqueHooks.join(', ')} } from 'react'`
    );
  }
  
  // Fix duplicates in named imports
  const namedRegex = /import\s+{([^}]*)}\s+from\s+['"]react['"]/;
  const namedMatch = content.match(namedRegex);
  
  if (namedMatch && namedMatch[1]) {
    const importedHooks = namedMatch[1].split(',').map(h => h.trim());
    // Remove duplicates
    const uniqueHooks = [...new Set(importedHooks)];
    
    // Replace with deduplicated hooks
    content = content.replace(
      namedRegex,
      `import { ${uniqueHooks.join(', ')} } from 'react'`
    );
  }
  
  return content;
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
