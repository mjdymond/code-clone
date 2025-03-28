#!/usr/bin/env node

/**
 * Fix All Components Script
 * 
 * This script runs the component-fixer on all components identified by the hook-validator.
 * It automatically fixes React hook-related issues in all components.
 * 
 * Usage:
 *   node fix-all-components.js
 */

const { spawn } = require('child_process');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const path = require('path');

async function runHookValidator() {
  console.log('Running hook validator to identify issues...');
  
  try {
    const { stdout } = await exec('node scripts/hook-validator-updated.js src/components');
    
    // Parse the output to extract file paths with issues
    const fileRegex = /src\/components\/[^\s:]+\.tsx/g;
    const fileMatches = stdout.match(fileRegex);
    
    // Remove duplicates
    const filesToFix = [...new Set(fileMatches)];
    
    return filesToFix;
  } catch (error) {
    console.error('Error running hook validator:', error.message);
    return [];
  }
}

async function fixComponentFile(filePath) {
  return new Promise((resolve) => {
    const fixerProcess = spawn('node', ['scripts/component-fixer-updated.js', filePath], {
      stdio: 'inherit'
    });
    
    fixerProcess.on('close', (code) => {
      resolve(code === 0);
    });
  });
}

async function main() {
  // Get files that need fixing
  const filesToFix = await runHookValidator();
  
  if (filesToFix.length === 0) {
    console.log('No files with issues found. Everything looks good!');
    return;
  }
  
  console.log(`Found ${filesToFix.length} files with issues. Starting fixes...`);
  
  // Fix each file
  let fixedCount = 0;
  
  for (const filePath of filesToFix) {
    const success = await fixComponentFile(filePath);
    if (success) {
      fixedCount++;
    }
  }
  
  console.log(`\nSummary: Fixed ${fixedCount}/${filesToFix.length} files`);
  
  // Run validator again to see if any issues remain
  console.log('\nRunning validator again to check for remaining issues...');
  await exec('node scripts/hook-validator.js src/components');
}

// Run the script
main().catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
