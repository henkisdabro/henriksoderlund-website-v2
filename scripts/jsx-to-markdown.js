import fs from 'fs';
import path from 'path';

/**
 * Utility to convert React JSX components to clean Markdown
 * Extracts text content and converts HTML-like JSX to Markdown format
 */

/**
 * Extract the main content from a React component file
 * @param {string} componentPath - Path to the React component file
 * @returns {string} - Extracted JSX content
 */
function extractJSXContent(componentPath) {
  try {
    const content = fs.readFileSync(componentPath, 'utf8');
    
    // Extract the return statement content
    const returnMatch = content.match(/return\s*\(\s*<div[^>]*>([\s\S]*?)<\/div>\s*\);/s);
    if (!returnMatch) {
      throw new Error('Could not find main JSX return content');
    }
    
    return returnMatch[1];
  } catch (error) {
    console.warn(`Warning: Could not extract JSX from ${componentPath}:`, error.message);
    return '';
  }
}

/**
 * Convert JSX content to Markdown
 * @param {string} jsxContent - Raw JSX content string
 * @param {string} pageTitle - Title for the page
 * @returns {string} - Clean Markdown content
 */
function jsxToMarkdown(jsxContent, pageTitle = '') {
  let markdown = '';
  
  if (pageTitle) {
    markdown += `# ${pageTitle}\n\n`;
  }
  
  // First pass: clean up JSX and preserve structure
  let content = jsxContent
    // Remove React imports and image references but preserve structure
    .replace(/\{[^}]*\}/g, '') // Remove all JSX expressions
    .replace(/className="[^"]*"/g, '') // Remove className
    .replace(/src="[^"]*"/g, '') // Remove src attributes
    .replace(/alt="([^"]*)"/g, '') // Remove alt but could preserve text
    .replace(/target="_blank"/g, '') // Remove target
    .replace(/rel="[^"]*"/g, '') // Remove rel attributes
    .trim();
  
  // Convert JSX elements to Markdown
  content = content
    // Convert headings (preserve newlines)
    .replace(/<h1[^>]*>(.*?)<\/h1>/gs, '\n# $1\n')
    .replace(/<h2[^>]*>(.*?)<\/h2>/gs, '\n## $1\n')
    .replace(/<h3[^>]*>(.*?)<\/h3>/gs, '\n### $1\n')
    .replace(/<h4[^>]*>(.*?)<\/h4>/gs, '\n#### $1\n')
    .replace(/<h5[^>]*>(.*?)<\/h5>/gs, '\n##### $1\n')
    .replace(/<h6[^>]*>(.*?)<\/h6>/gs, '\n###### $1\n')
    
    // Convert special paragraph types
    .replace(/<p[^>]*className="lead"[^>]*>(.*?)<\/p>/gs, '\n**$1**\n')
    .replace(/<p[^>]*className="dates"[^>]*>(.*?)<\/p>/gs, '\n*$1*\n')
    
    // Convert links (do this before paragraphs to preserve them)
    .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gs, '[$2]($1)')
    
    // Convert lists
    .replace(/<ul[^>]*>(.*?)<\/ul>/gs, (match, listContent) => {
      const items = listContent.match(/<li[^>]*>(.*?)<\/li>/gs) || [];
      return '\n' + items.map(item => {
        const text = item.replace(/<li[^>]*>(.*?)<\/li>/gs, '$1').trim();
        return `- ${text}`;
      }).join('\n') + '\n';
    })
    
    // Convert regular paragraphs
    .replace(/<p[^>]*>(.*?)<\/p>/gs, '\n$1\n')
    
    // Convert tables
    .replace(/<table[^>]*>(.*?)<\/table>/gs, (match, tableContent) => {
      const headers = [];
      const rows = [];
      
      // Extract headers
      const theadMatch = tableContent.match(/<thead[^>]*>(.*?)<\/thead>/s);
      if (theadMatch) {
        const headerCells = theadMatch[1].match(/<th[^>]*>(.*?)<\/th>/g) || [];
        headers.push(...headerCells.map(cell => cell.replace(/<th[^>]*>(.*?)<\/th>/, '$1').trim()));
      }
      
      // Extract rows
      const tbodyMatch = tableContent.match(/<tbody[^>]*>(.*?)<\/tbody>/s);
      if (tbodyMatch) {
        const rowMatches = tbodyMatch[1].match(/<tr[^>]*>(.*?)<\/tr>/gs) || [];
        rowMatches.forEach(row => {
          const cells = row.match(/<td[^>]*>(.*?)<\/td>/g) || [];
          const cellData = cells.map(cell => cell.replace(/<td[^>]*>(.*?)<\/td>/, '$1').trim());
          if (cellData.length > 0) {
            rows.push(cellData);
          }
        });
      }
      
      // Build markdown table
      if (headers.length > 0 && rows.length > 0) {
        let table = '\n| ' + headers.join(' | ') + ' |\n';
        table += '| ' + headers.map(() => '---').join(' | ') + ' |\n';
        rows.forEach(row => {
          table += '| ' + row.join(' | ') + ' |\n';
        });
        return table + '\n';
      }
      
      return '\n' + tableContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() + '\n';
    })
    
    // Convert strong/bold text
    .replace(/<strong[^>]*>(.*?)<\/strong>/g, '**$1**')
    .replace(/<b[^>]*>(.*?)<\/b>/g, '**$1**')
    
    // Convert emphasis/italic text
    .replace(/<em[^>]*>(.*?)<\/em>/g, '*$1*')
    .replace(/<i[^>]*>(.*?)<\/i>/g, '*$1*')
    
    // Convert remaining semantic tags
    .replace(/<section[^>]*>/gs, '\n')
    .replace(/<\/section>/gs, '\n')
    .replace(/<div[^>]*>/gs, '')
    .replace(/<\/div>/gs, '')
    
    // Remove remaining HTML tags
    .replace(/<[^>]*>/g, '')
    
    // Clean up spacing and formatting
    .replace(/\n\s*\n\s*\n+/g, '\n\n') // Multiple newlines to double newlines
    .replace(/^\s+/gm, '') // Remove leading whitespace on lines
    .replace(/\s+$/gm, '') // Remove trailing whitespace on lines
    .trim()
    // Fix spacing around headers and sections
    .replace(/\n\n\n+/g, '\n\n') // No more than double newlines
    .replace(/^# /gm, '\n# ') // Ensure headers have space before
    .replace(/^## /gm, '\n## ')
    .replace(/^### /gm, '\n### ')
    .replace(/^\n+/, '') // Remove leading newlines
    .trim();
  
  markdown += content;
  
  // Add footer
  markdown += '\n\n---\n*This page is also available as a clean Markdown version for AI/LLM consumption as per the [llms.txt specification](https://llmstxt.org/).*';
  
  return markdown;
}

/**
 * Convert a React component file to Markdown
 * @param {string} componentPath - Path to the React component file
 * @param {string} pageTitle - Title for the page
 * @returns {string} - Clean Markdown content
 */
function convertComponentToMarkdown(componentPath, pageTitle = '') {
  const jsxContent = extractJSXContent(componentPath);
  if (!jsxContent) {
    return `# ${pageTitle}\n\n*Content could not be extracted from the React component.*\n\n---\n*This page is also available as a clean Markdown version for AI/LLM consumption as per the [llms.txt specification](https://llmstxt.org/).*`;
  }
  
  const markdown = jsxToMarkdown(jsxContent, pageTitle);
  
  // Ensure proper UTF-8 encoding by normalizing the text
  return markdown.normalize('NFC');
}

/**
 * Extract the page title from a React component
 * @param {string} componentPath - Path to the React component file
 * @returns {string} - Extracted title or empty string
 */
function extractPageTitle(componentPath) {
  try {
    const content = fs.readFileSync(componentPath, 'utf8');
    const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/);
    return h1Match ? h1Match[1].trim() : '';
  } catch (error) {
    console.warn(`Warning: Could not extract title from ${componentPath}:`, error.message);
    return '';
  }
}

export {
  convertComponentToMarkdown,
  extractPageTitle,
  jsxToMarkdown,
  extractJSXContent
};