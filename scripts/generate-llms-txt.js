#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { convertComponentToMarkdown, extractPageTitle } from './jsx-to-markdown.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const BASE_URL = 'https://www.henriksoderlund.com';
const PROJECT_ROOT = path.resolve(__dirname, '..');
const COMPONENTS_DIR = path.join(PROJECT_ROOT, 'src', 'react-app', 'components');
const PUBLIC_OUTPUT_FILE = path.join(PROJECT_ROOT, 'public', 'llms.txt');

// Route mapping from App.tsx analysis
const ROUTES = {
  '/': 'Home',
  '/expertise': 'Skills', // Skills component serves /expertise route
  '/work-experience': 'WorkExperience',
  '/education': 'Education',
  '/consultancy': 'Consultation'
};

// GitHub projects extracted from Skills.tsx
const GITHUB_PROJECTS = [
  {
    title: 'Platform URL Click ID Parameters',
    url: 'https://github.com/henkisdabro/platform-url-click-id-parameters',
    description: 'Comprehensive database of advertising platform parameters'
  },
  {
    title: 'IPmeta GA4 Tag Template',
    url: 'https://github.com/henkisdabro/gtm-templates-ipmeta-ga4',
    description: 'Google Tag Manager template for traffic filtering'
  },
  {
    title: 'Google Chat Webhook Template',
    url: 'https://github.com/henkisdabro/gtm-templates-web-google-chat-webhook',
    description: 'Real-time notifications for campaign performance'
  },
  {
    title: 'Hugo GTM Integration',
    url: 'https://github.com/henkisdabro/GTM-integration-Hugo',
    description: 'Advanced Tag Manager framework for static sites'
  }
];

// Extract metadata from React components
function extractComponentMetadata(componentPath) {
  try {
    const content = fs.readFileSync(componentPath, 'utf8');
    
    // Extract the main heading (h1)
    const h1Match = content.match(/<h1[^>]*>([^<]+)<\/h1>/);
    const title = h1Match ? h1Match[1].trim() : null;
    
    // Extract the first paragraph for description
    const pMatch = content.match(/<p[^>]*className="lead"[^>]*>([^<]+)<\/p>/) || 
                   content.match(/<p[^>]*>([^<]+)<\/p>/);
    const description = pMatch ? pMatch[1].replace(/<[^>]*>/g, '').trim() : null;
    
    return { title, description };
  } catch (error) {
    console.warn(`Warning: Could not read component ${componentPath}:`, error.message);
    return { title: null, description: null };
  }
}

// Generate page descriptions based on content
function getPageDescription(route, componentName) {
  const descriptions = {
    '/': 'Executive introduction and background',
    '/expertise': 'Technical skills including AI, measurement, and development',
    '/work-experience': 'Professional background and achievements', 
    '/education': 'Academic qualifications and certifications',
    '/consultancy': 'Consulting services and approach'
  };
  
  return descriptions[route] || `Information about ${componentName.toLowerCase()}`;
}

// Generate the llms.txt content
function generateLlmsTxt() {
  const timestamp = new Date().toISOString();
  
  let content = `# Henrik Söderlund - Digital Strategy Executive & Technology Leader
> Personal website showcasing digital strategy expertise, AI innovation, and technical leadership in marketing technology and measurement architecture

## About\n`;

  // Add main pages
  for (const [route, componentName] of Object.entries(ROUTES)) {
    const pageTitle = route === '/' ? 'Homepage' : 
                     route === '/expertise' ? 'Expertise' :
                     route.split('/')[1].split('-').map(word => 
                       word.charAt(0).toUpperCase() + word.slice(1)
                     ).join(' ');
    
    const description = getPageDescription(route, componentName);
    content += `- [${pageTitle}](${BASE_URL}${route}): ${description}\n`;
  }

  content += `\n## GitHub Projects\n`;
  
  // Add GitHub projects
  for (const project of GITHUB_PROJECTS) {
    content += `- [${project.title}](${project.url}): ${project.description}\n`;
  }

  content += `\n## Technical Focus Areas
- [AI & Automation](${BASE_URL}/expertise): AI-powered solutions, prompt engineering, API integration
- [Measurement & Analytics](${BASE_URL}/expertise): Server-side tracking, advanced attribution, data architecture
- [Digital Strategy](${BASE_URL}/): Executive leadership in media activations and performance marketing
- [Technology Leadership](${BASE_URL}/): Cross-platform system integration and infrastructure automation

<!-- Generated automatically on ${timestamp} -->`;

  return content;
}

/**
 * Generate Markdown versions of each page
 */
function generateMarkdownPages() {
  const markdownFiles = [];
  
  for (const [route, componentName] of Object.entries(ROUTES)) {
    try {
      const componentPath = path.join(COMPONENTS_DIR, `${componentName}.tsx`);
      
      if (!fs.existsSync(componentPath)) {
        console.warn(`⚠️  Component file not found: ${componentPath}`);
        continue;
      }
      
      // Extract title from component
      const pageTitle = extractPageTitle(componentPath);
      
      // Convert to markdown
      const markdownContent = convertComponentToMarkdown(componentPath, pageTitle);
      
      // Determine output filename based on llms.txt spec
      let filename;
      if (route === '/') {
        filename = 'index.html.md';
      } else {
        filename = route.slice(1) + '.md'; // Remove leading slash
      }
      
      // Write to public directory
      const outputPath = path.join(PROJECT_ROOT, 'public', filename);
      fs.writeFileSync(outputPath, markdownContent, 'utf8');
      
      markdownFiles.push({
        route,
        filename,
        title: pageTitle,
        path: outputPath,
        size: fs.statSync(outputPath).size
      });
      
      console.log(`📝 Generated ${filename} for ${route}`);
      
    } catch (error) {
      console.error(`❌ Error generating markdown for ${route}:`, error.message);
    }
  }
  
  return markdownFiles;
}

// Main execution
function main() {
  try {
    console.log('🚀 Generating llms.txt file and markdown pages...');
    
    // Generate main llms.txt content
    const content = generateLlmsTxt();
    
    // Write only to public directory (gets deployed)
    fs.writeFileSync(PUBLIC_OUTPUT_FILE, content, 'utf8');
    
    console.log(`✅ llms.txt generated at: ${PUBLIC_OUTPUT_FILE}`);
    console.log(`📄 File size: ${fs.statSync(PUBLIC_OUTPUT_FILE).size} bytes`);
    
    // Generate markdown pages
    console.log('\n📝 Generating markdown versions of pages...');
    const markdownFiles = generateMarkdownPages();
    
    console.log(`\n✅ Generated ${markdownFiles.length} markdown files:`);
    markdownFiles.forEach(file => {
      console.log(`   • ${file.filename} (${file.size} bytes) - ${file.title}`);
    });
    
    // Show preview
    console.log('\n📄 llms.txt content preview:');
    console.log('─'.repeat(50));
    console.log(content.split('\n').slice(0, 10).join('\n'));
    console.log('...');
    
  } catch (error) {
    console.error('❌ Error generating files:', error.message);
    process.exit(1);
  }
}

// Run if called directly (handle both Unix and Windows paths)
const scriptPath = fileURLToPath(import.meta.url);
const calledPath = process.argv[1];
if (scriptPath === calledPath || scriptPath === path.resolve(calledPath)) {
  main();
}

export { generateLlmsTxt };