#!/usr/bin/env node

/**
 * Component Hook Validator
 * 
 * This script scans React component files to check for potentially missing hook imports.
 * It identifies components that use hooks (useState, useEffect, etc.) but might be
 * missing the proper imports, which can lead to "X is not defined" errors.
 * 
 * Usage:
 *   node hook-validator.js [directory]
 * 
 * Example:
 *   node hook-validator.js src/components
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const readFile = promisify(fs.readFile);

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

// Custom hooks used in the project (add more as needed)
const CUSTOM_HOOKS = [
  'useStore',
  'useCareerAgent',
  'useCareerAgentRenderer',
  'useCareerApproval',
  'useCareerHQConnection',
  'useCareerTaskRegistry',
  'useMockCoAgent'
];

// Check if 'use client' directive is present
function hasUseClientDirective(content) {
  return content.includes('\'use client\'') || content.includes('"use client"');
}

// Check if React is imported
function hasReactImport(content) {
  return /import\s+React\b/.test(content);
}

// Check if specific hooks are imported
function getImportedHooks(content) {
  const importedHooks = [];
  
  // Match named imports
  const namedImportMatches = content.match(/import\s+{([^}]*)}\s+from\s+['"]react['"]/g);
  if (namedImportMatches) {
    for (const match of namedImportMatches) {
      // Extract the hooks from the import statement
      const hookMatches = match.match(/import\s+{([^}]*)}\s+from/);
      if (hookMatches && hookMatches[1]) {
        const hooks = hookMatches[1].split(',')
          .map(h => h.trim())
          .filter(h => REACT_HOOKS.includes(h));
        importedHooks.push(...hooks);
      }
    }
  }
  
  return importedHooks;
}

// Check if a hook is used in the code
function getUsedHooks(content) {
  const usedHooks = [];
  
  // Check for React hooks
  for (const hook of REACT_HOOKS) {
    // Look for hook usage that's not part of an import statement
    const regex = new RegExp(`\\b${hook}\\s*\\(`, 'g');
    if (regex.test(content)) {
      usedHooks.push(hook);
    }
  }
  
  // Check for custom hooks
  for (const hook of CUSTOM_HOOKS) {
    const regex = new RegExp(`\\b${hook}\\s*\\(`, 'g');
    if (regex.test(content)) {
      usedHooks.push(hook);
    }
  }
  
  return usedHooks;
}

// Check a file for potential hook import issues
async function checkFile(filePath) {
  const issues = [];
  
  try {
    const content = await readFile(filePath, 'utf8');
    
    // Skip files without hook usage
    const usedHooks = getUsedHooks(content);
    if (usedHooks.length === 0) {
      return issues;
    }
    
    // Check if it's a client component using hooks
    const isClientComponent = hasUseClientDirective(content);
    const hasReact = hasReactImport(content);
    const importedHooks = getImportedHooks(content);
    
    // Check for missing 'use client' directive
    if (!isClientComponent && usedHooks.length > 0) {
      issues.push({
        type: 'missing-directive',
        message: `Missing 'use client' directive in component using hooks: ${usedHooks.join(', ')}`
      });
    }
    
    // Check for missing React imports
    if (!hasReact && usedHooks.some(h => REACT_HOOKS.includes(h))) {
      issues.push({
        type: 'missing-react',
        message: 'Component uses hooks but does not import React'
      });
    }
    
    // Check for missing hook imports
    const missingHooks = usedHooks.filter(h => 
      REACT_HOOKS.includes(h) && !importedHooks.includes(h)
    );
    
    if (missingHooks.length > 0) {
      issues.push({
        type: 'missing-hooks',
        message: `Missing import for hooks: ${missingHooks.join(', ')}`
      });
    }
  } catch (error) {
    issues.push({
      type: 'read-error',
      message: `Error reading file: ${error.message}`
    });
  }
  
  return issues;
}

// Process all files in the directory recursively
async function processDirectory(dir) {
  let issues = [];
  
  try {
    const entries = await readdir(dir);
    
    for (const entry of entries) {
      const entryPath = path.join(dir, entry);
      const entryStat = await stat(entryPath);
      
      if (entryStat.isDirectory()) {
        const subIssues = await processDirectory(entryPath);
        issues = [...issues, ...subIssues];
      } else if (
        entryStat.isFile() && 
        (entryPath.endsWith('.tsx') || entryPath.endsWith('.jsx'))
      ) {
        const fileIssues = await checkFile(entryPath);
        if (fileIssues.length > 0) {
          issues.push({
            file: entryPath,
            issues: fileIssues
          });
        }
      }
    }
  } catch (error) {
    console.error(`Error processing directory ${dir}:`, error);
  }
  
  return issues;
}

// Main function
async function main() {
  const directory = process.argv[2] || 'src';
  
  console.log(`Scanning ${directory} for potential hook issues...`);
  
  const issues = await processDirectory(directory);
  
  if (issues.length === 0) {
    console.log('\n✅ No hook issues found!');
    return;
  }
  
  console.log(`\n❌ Found ${issues.length} files with potential hook issues:\n`);
  
  issues.forEach(fileIssue => {
    console.log(`\n${fileIssue.file}:`);
    fileIssue.issues.forEach(issue => {
      console.log(`  - ${issue.message}`);
    });
  });
  
  console.log('\nTo fix these issues:');
  console.log('1. Add \'use client\' directive at the top of client components');
  console.log('2. Import React: import React from \'react\'');
  console.log('3. Import used hooks: import { useState, useEffect } from \'react\'');
}

main().catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
