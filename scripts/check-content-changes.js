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

// Components that affect llms.txt generation
const TRACKED_COMPONENTS = [
  'Home.tsx',
  'Skills.tsx', 
  'WorkExperience.tsx',
  'Education.tsx',
  'Consultation.tsx',
  'App.tsx' // For routing changes
];

/**
 * Calculate hash of all tracked component files
 */
function calculateContentHash() {
  let combinedContent = '';
  
  for (const component of TRACKED_COMPONENTS) {
    const componentPath = path.join(COMPONENTS_DIR, component);
    
    try {
      if (fs.existsSync(componentPath)) {
        const content = fs.readFileSync(componentPath, 'utf8');
        combinedContent += content;
      }
    } catch (error) {
      console.warn(`Warning: Could not read ${component}:`, error.message);
    }
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
    trackedFiles: TRACKED_COMPONENTS
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