#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const PROJECT_ROOT = path.resolve(__dirname, '..');
const COMPONENTS_DIR = path.join(PROJECT_ROOT, 'src', 'react-app', 'components');
const CACHE_FILE = path.join(PROJECT_ROOT, '.llms-cache.json');

// Files that affect llms.txt generation
const TRACKED_COMPONENTS = [
  'Home.tsx',
  'Expertise.tsx', // Renamed from Skills.tsx
  'WorkExperience.tsx',
  'Education.tsx',
  'Consultation.tsx',
  'App.tsx' // For routing changes
];

// Data files that affect content generation
const TRACKED_DATA_FILES = [
  'expertise.ts',
  'workExperience.ts', 
  'consultation.ts'
];

/**
 * Calculate hash of all tracked component files and data files
 */
function calculateContentHash() {
  let combinedContent = '';
  
  // Hash component files
  for (const component of TRACKED_COMPONENTS) {
    // App.tsx is in the react-app root, others are in components
    const componentPath = component === 'App.tsx' 
      ? path.join(PROJECT_ROOT, 'src', 'react-app', component)
      : path.join(COMPONENTS_DIR, component);
    
    try {
      if (fs.existsSync(componentPath)) {
        const content = fs.readFileSync(componentPath, 'utf8');
        combinedContent += `[COMPONENT:${component}]${content}`;
      } else {
        console.warn(`Warning: Component file not found: ${componentPath}`);
      }
    } catch (error) {
      console.warn(`Warning: Could not read ${component}:`, error.message);
    }
  }
  
  // Hash data files
  const DATA_DIR = path.join(PROJECT_ROOT, 'src', 'react-app', 'data');
  for (const dataFile of TRACKED_DATA_FILES) {
    const dataPath = path.join(DATA_DIR, dataFile);
    
    try {
      if (fs.existsSync(dataPath)) {
        const content = fs.readFileSync(dataPath, 'utf8');
        combinedContent += `[DATA:${dataFile}]${content}`;
      } else {
        console.warn(`Warning: Data file not found: ${dataPath}`);
      }
    } catch (error) {
      console.warn(`Warning: Could not read ${dataFile}:`, error.message);
    }
  }
  
  // Also include the markdown generation script itself to catch improvements
  const scriptPath = path.join(PROJECT_ROOT, 'scripts', 'jsx-to-markdown.js');
  try {
    if (fs.existsSync(scriptPath)) {
      const scriptContent = fs.readFileSync(scriptPath, 'utf8');
      combinedContent += `[SCRIPT:jsx-to-markdown.js]${scriptContent}`;
    }
  } catch (error) {
    console.warn(`Warning: Could not read script file:`, error.message);
  }
  
  return crypto.createHash('md5').update(combinedContent).digest('hex');
}

/**
 * Check if content has changed since last generation
 */
function hasContentChanged() {
  const currentHash = calculateContentHash();
  
  let lastHash = null;
  if (fs.existsSync(CACHE_FILE)) {
    try {
      const cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
      lastHash = cache.contentHash;
    } catch (error) {
      console.warn('Warning: Could not read cache file, will regenerate');
    }
  }
  
  return currentHash !== lastHash;
}

/**
 * Update the cache with current content hash
 */
function updateCache() {
  const currentHash = calculateContentHash();
  const cache = {
    contentHash: currentHash,
    lastUpdated: new Date().toISOString(),
    trackedFiles: {
      components: TRACKED_COMPONENTS,
      dataFiles: TRACKED_DATA_FILES,
      scripts: ['jsx-to-markdown.js']
    }
  };
  
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf8');
}

/**
 * Main execution
 */
function main() {
  const hasChanged = hasContentChanged();
  
  if (hasChanged) {
    console.log('🔄 Content changes detected, llms.txt generation needed');
    updateCache();
    process.exit(0); // Exit code 0 = run generation
  } else {
    console.log('✅ No content changes detected, skipping llms.txt generation');
    process.exit(1); // Exit code 1 = skip generation
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}` || 
    fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main();
}

export { hasContentChanged, updateCache, calculateContentHash };