import fs from 'fs';
import path from 'path';

/**
 * Utility to convert React JSX components to clean Markdown
 * Extracts text content and converts HTML-like JSX to Markdown format
 */

/**
 * Extract the main content from a React component file
 * @param {string} componentPath - Path to the React component file
 * @returns {string} - Extracted JSX content or data-driven content
 */
function extractJSXContent(componentPath) {
  try {
    const content = fs.readFileSync(componentPath, 'utf8');
    const componentName = path.basename(componentPath, '.tsx');
    
    // Check if this is a data-driven component
    if (componentName === 'WorkExperience') {
      return extractWorkExperienceContent(componentPath);
    }
    
    if (componentName === 'Consultation') {
      return extractConsultationContent(componentPath);
    }
    
    if (componentName === 'Expertise') {
      return extractSkillsContent(componentPath);
    }
    
    // For static components, extract the return statement content
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
 * Extract work experience content from data file
 * @param {string} componentPath - Path to the component file
 * @returns {string} - Generated JSX content based on data
 */
function extractWorkExperienceContent(componentPath) {
  try {
    const projectRoot = path.resolve(path.dirname(componentPath), '../../..');
    const dataPath = path.join(projectRoot, 'src', 'react-app', 'data', 'workExperience.ts');
    
    if (!fs.existsSync(dataPath)) {
      throw new Error('Work experience data file not found');
    }
    
    const dataContent = fs.readFileSync(dataPath, 'utf8');
    
    // Extract the array data
    const arrayMatch = dataContent.match(/export const workExperienceData = \[([\s\S]*?)\];/);
    if (!arrayMatch) {
      throw new Error('Could not find workExperienceData array');
    }
    
    // Use a more robust method to parse job objects
    // Split by closing brace + comma + whitespace pattern to get individual job objects
    const jobsText = arrayMatch[1].trim();
    const jobObjects = [];
    
    // Find all job objects by matching balanced braces
    let braceCount = 0;
    let start = -1;
    for (let i = 0; i < jobsText.length; i++) {
      if (jobsText[i] === '{') {
        if (braceCount === 0) start = i;
        braceCount++;
      } else if (jobsText[i] === '}') {
        braceCount--;
        if (braceCount === 0) {
          jobObjects.push(jobsText.substring(start, i + 1));
        }
      }
    }
    
    let jsxContent = '';
    
    jobObjects.forEach(jobStr => {
      // Extract job properties using more precise regex
      const titleMatch = jobStr.match(/title:\s*'([^']+)'/);
      const datesMatch = jobStr.match(/dates:\s*'([^']+)'/);
      const locationMatch = jobStr.match(/location:\s*'([^']+)'/);
      
      if (titleMatch && datesMatch) {
        const title = titleMatch[1];
        const dates = datesMatch[1];
        const location = locationMatch ? locationMatch[1] : '';
        
        jsxContent += `<section className="content-entry">`;
        jsxContent += `<h2>${location}: ${title}</h2>`;
        jsxContent += `<p className="dates">${dates}</p>`;
        
        // Extract description array - handle escaped quotes and multiline content
        const descriptionMatch = jobStr.match(/description:\s*\[([\s\S]*?)\]/);
        if (descriptionMatch) {
          const descriptionContent = descriptionMatch[1];
          
          // Split by string boundaries, handling escaped quotes
          const stringMatches = descriptionContent.match(/'((?:[^'\\]|\\.)*)'/g) || [];
          
          stringMatches.forEach(stringMatch => {
            // Remove outer quotes and unescape content
            let text = stringMatch.slice(1, -1); // Remove outer quotes
            text = text.replace(/\\'/g, "'"); // Unescape single quotes
            text = text.replace(/\\n/g, '\n'); // Handle newlines if present
            
            if (text.trim()) {
              jsxContent += `<p>${text}</p>`;
            }
          });
        }
        
        jsxContent += `</section>`;
      }
    });
    
    return jsxContent;
  } catch (error) {
    console.warn(`Warning: Could not extract work experience data:`, error.message);
    return '';
  }
}

/**
 * Extract consultation content from data file
 * @param {string} componentPath - Path to the component file
 * @returns {string} - Generated JSX content based on data
 */
function extractConsultationContent(componentPath) {
  try {
    const projectRoot = path.resolve(path.dirname(componentPath), '../../..');
    const dataPath = path.join(projectRoot, 'src', 'react-app', 'data', 'consultation.ts');
    
    if (!fs.existsSync(dataPath)) {
      throw new Error('Consultation data file not found');
    }
    
    const dataContent = fs.readFileSync(dataPath, 'utf8');
    let jsxContent = '';
    
    // Extract intro section
    const introMatch = dataContent.match(/intro:\s*\{[\s\S]*?title:\s*'([^']+)'[\s\S]*?paragraph:\s*'([^']+)'[\s\S]*?\}/);
    if (introMatch) {
      jsxContent += `<section className="intro-section">`;
      jsxContent += `<p className="lead">${introMatch[2]}</p>`;
      jsxContent += `</section>`;
    }
    
    // Extract AI consultancy section
    const aiMatch = dataContent.match(/aiConsultancy:\s*\{[\s\S]*?title:\s*'([^']+)'[\s\S]*?paragraph:\s*'([^']+)'[\s\S]*?\}/);
    if (aiMatch) {
      jsxContent += `<section className="ai-consultancy">`;
      jsxContent += `<h2>${aiMatch[1]}</h2>`;
      jsxContent += `<p>${aiMatch[2]}</p>`;
      
      // Extract AI services
      const aiServicesMatch = dataContent.match(/services:\s*\{[\s\S]*?title:\s*'([^']+)'[\s\S]*?items:\s*\[([\s\S]*?)\][\s\S]*?\}/);
      if (aiServicesMatch) {
        jsxContent += `<h3>${aiServicesMatch[1]}</h3>`;
        jsxContent += `<ul>`;
        
        const serviceMatches = aiServicesMatch[2].match(/\{[^}]*name:[^}]*description:[^}]*\}/g) || [];
        serviceMatches.forEach(serviceStr => {
          const nameMatch = serviceStr.match(/name:\s*'([^']+)'/);
          const descMatch = serviceStr.match(/description:\s*'([^']+)'/);
          if (nameMatch && descMatch) {
            jsxContent += `<li><strong>${nameMatch[1]}</strong>: ${descMatch[1]}</li>`;
          }
        });
        
        jsxContent += `</ul>`;
      }
      
      // Extract AI pricing table
      const aiPricingMatch = dataContent.match(/pricing:\s*\{[\s\S]*?title:\s*'([^']+)'[\s\S]*?headers:\s*\[([\s\S]*?)\][\s\S]*?rows:\s*\[([\s\S]*?)\][\s\S]*?\}/);
      if (aiPricingMatch) {
        jsxContent += `<h3>${aiPricingMatch[1]}</h3>`;
        jsxContent += `<table>`;
        
        // Extract headers
        const headersList = aiPricingMatch[2].match(/'([^']+)'/g) || [];
        if (headersList.length > 0) {
          jsxContent += `<thead><tr>`;
          headersList.forEach(header => {
            const headerText = header.replace(/'/g, '');
            jsxContent += `<th>${headerText}</th>`;
          });
          jsxContent += `</tr></thead>`;
        }
        
        // Extract rows
        jsxContent += `<tbody>`;
        const rowMatches = aiPricingMatch[3].match(/\[[\s\S]*?\]/g) || [];
        rowMatches.forEach(rowStr => {
          const cellsList = rowStr.match(/'([^']+)'/g) || [];
          if (cellsList.length > 0) {
            jsxContent += `<tr>`;
            cellsList.forEach(cell => {
              let cellText = cell.replace(/'/g, '');
              // Handle escaped quotes and special characters
              cellText = cellText.replace(/\\'/g, "'");
              cellText = cellText.replace(/\\\\/g, "\\");
              jsxContent += `<td>${cellText}</td>`;
            });
            jsxContent += `</tr>`;
          }
        });
        jsxContent += `</tbody></table>`;
      }
      
      jsxContent += `</section>`;
    }
    
    // Extract analytics consultancy section
    const analyticsMatch = dataContent.match(/analyticsConsultancy:\s*\{[\s\S]*?title:\s*'([^']+)'[\s\S]*?paragraph:\s*'([^']+)'[\s\S]*?\}/);
    if (analyticsMatch) {
      jsxContent += `<section className="analytics-consultancy">`;
      jsxContent += `<h2>${analyticsMatch[1]}</h2>`;
      jsxContent += `<p>${analyticsMatch[2]}</p>`;
      
      // Extract analytics services
      const analyticsServicesMatch = dataContent.match(/analyticsConsultancy:[\s\S]*?services:\s*\{[\s\S]*?title:\s*'([^']+)'[\s\S]*?items:\s*\[([\s\S]*?)\][\s\S]*?\}/);
      if (analyticsServicesMatch) {
        jsxContent += `<h3>${analyticsServicesMatch[1]}</h3>`;
        jsxContent += `<ul>`;
        
        const servicesList = analyticsServicesMatch[2].match(/'([^']+)'/g) || [];
        servicesList.forEach(service => {
          const serviceText = service.replace(/'/g, '');
          jsxContent += `<li>${serviceText}</li>`;
        });
        
        jsxContent += `</ul>`;
      }
      
      jsxContent += `</section>`;
    }
    
    // Extract quality guarantee section - use a more robust approach
    const guaranteeSectionMatch = dataContent.match(/qualityGuarantee:\s*\{([\s\S]*?)\},?\s*scheduling/);
    if (guaranteeSectionMatch) {
      const guaranteeContent = guaranteeSectionMatch[1];
      const titleMatch = guaranteeContent.match(/title:\s*'([^']+)'/);
      const paragraphMatch = guaranteeContent.match(/paragraph:\s*'([\s\S]*?)'/);
      
      if (titleMatch && paragraphMatch) {
        jsxContent += `<section className="quality-guarantee">`;
        jsxContent += `<h2>${titleMatch[1]}</h2>`;
        let guaranteeText = paragraphMatch[1];
        // Handle escaped quotes
        guaranteeText = guaranteeText.replace(/\\'/g, "'");
        jsxContent += `<p>${guaranteeText}</p>`;
        jsxContent += `</section>`;
      }
    }
    
    // Extract scheduling section - use a more robust approach  
    const schedulingSectionMatch = dataContent.match(/scheduling:\s*\{([\s\S]*?)\}\s*\}/);
    if (schedulingSectionMatch) {
      const schedulingContent = schedulingSectionMatch[1];
      const titleMatch = schedulingContent.match(/title:\s*'([^']+)'/);
      const paragraphsMatch = schedulingContent.match(/paragraphs:\s*\[([\s\S]*?)\]/);
      
      if (titleMatch && paragraphsMatch) {
        jsxContent += `<section className="scheduling">`;
        jsxContent += `<h2>${titleMatch[1]}</h2>`;
        
        const paragraphsContent = paragraphsMatch[1];
        // Split by commas that are not inside quotes
        const paragraphs = paragraphsContent.split(/,(?=\s*['"'])/);
        
        paragraphs.forEach(para => {
          let paraText = para.trim().replace(/^['"]|['"],?$/g, ''); // Remove outer quotes and trailing comma
          if (paraText.trim()) {
            // Handle escaped quotes and HTML tags
            paraText = paraText.replace(/\\'/g, "'");
            paraText = paraText.replace(/<strong>/g, '**');
            paraText = paraText.replace(/<\/strong>/g, '**');
            paraText = paraText.replace(/<em>/g, '*');
            paraText = paraText.replace(/<\/em>/g, '*');
            jsxContent += `<p>${paraText}</p>`;
          }
        });
        
        jsxContent += `</section>`;
      }
    }
    
    return jsxContent;
  } catch (error) {
    console.warn(`Warning: Could not extract consultation data:`, error.message);
    return '';
  }
}

/**
 * Extract expertise content from data file
 * @param {string} componentPath - Path to the component file
 * @returns {string} - Generated JSX content based on data
 */
function extractSkillsContent(componentPath) {
  try {
    const projectRoot = path.resolve(path.dirname(componentPath), '../../..');
    const dataPath = path.join(projectRoot, 'src', 'react-app', 'data', 'expertise.ts');
    
    if (!fs.existsSync(dataPath)) {
      throw new Error('Expertise data file not found');
    }
    
    const dataContent = fs.readFileSync(dataPath, 'utf8');
    let jsxContent = '';
    
    // Extract intro section
    const introMatch = dataContent.match(/intro:\s*\{[\s\S]*?title:\s*'([^']+)'[\s\S]*?paragraph:\s*'([^']+)'[\s\S]*?\}/);
    if (introMatch) {
      jsxContent += `<section className="consultancy-section">`;
      jsxContent += `<h2>${introMatch[1]}</h2>`;
      jsxContent += `<p>${introMatch[2]}</p>`;
      jsxContent += `</section>`;
    }
    
    // Extract skills grid
    const skillsGridMatch = dataContent.match(/skillsGrid:\s*\[([\s\S]*?)\],\s*platformExperience/);
    if (skillsGridMatch) {
      jsxContent += `<section className="skills-grid">`;
      jsxContent += `<h2>🔧 Core Technical Skills</h2>`;
      
      // Find each skill category object
      const categoryMatches = skillsGridMatch[1].match(/\{[\s\S]*?\}/g) || [];
      categoryMatches.forEach(categoryStr => {
        const categoryMatch = categoryStr.match(/category:\s*'([^']+)'/);
        const skillsMatch = categoryStr.match(/skills:\s*\[([\s\S]*?)\]/);
        
        if (categoryMatch && skillsMatch) {
          jsxContent += `<div className="skill-category">`;
          jsxContent += `<h3>${categoryMatch[1]}</h3>`;
          jsxContent += `<div className="skill-tags">`;
          
          const skillsList = skillsMatch[1].match(/'([^']+)'/g) || [];
          jsxContent += `<ul>`;
          skillsList.forEach(skill => {
            const skillText = skill.replace(/'/g, '');
            jsxContent += `<li>${skillText}</li>`;
          });
          jsxContent += `</ul>`;
          
          jsxContent += `</div></div>`;
        }
      });
      
      jsxContent += `</section>`;
    }
    
    // Extract platform experience
    const platformMatch = dataContent.match(/platformExperience:\s*\{[\s\S]*?title:\s*'([^']+)'[\s\S]*?paragraph:\s*'([^']+)'[\s\S]*?platforms:\s*\[([\s\S]*?)\][\s\S]*?\}/);
    if (platformMatch) {
      jsxContent += `<section className="platform-experience">`;
      jsxContent += `<h2>${platformMatch[1]}</h2>`;
      jsxContent += `<p>${platformMatch[2]}</p>`;
      jsxContent += `<div className="platform-tags">`;
      
      const platformsList = platformMatch[3].match(/'([^']+)'/g) || [];
      jsxContent += `<ul>`;
      platformsList.forEach(platform => {
        const platformText = platform.replace(/'/g, '');
        jsxContent += `<li>${platformText}</li>`;
      });
      jsxContent += `</ul>`;
      
      jsxContent += `</div></section>`;
    }
    
    // Extract GitHub contributions
    const githubMatch = dataContent.match(/githubContributions:\s*\{[\s\S]*?title:\s*'([^']+)'[\s\S]*?contributions:\s*\[([\s\S]*?)\][\s\S]*?\}/);
    if (githubMatch) {
      jsxContent += `<section className="github-contributions">`;
      jsxContent += `<h2>${githubMatch[1]}</h2>`;
      
      const contributionMatches = githubMatch[2].match(/\{[\s\S]*?\}/g) || [];
      contributionMatches.forEach(contribStr => {
        const titleMatch = contribStr.match(/title:\s*'([^']+)'/);
        const urlMatch = contribStr.match(/url:\s*'([^']+)'/);
        const descMatch = contribStr.match(/description:\s*'([^']+)'/);
        
        if (titleMatch && urlMatch) {
          jsxContent += `<div className="contribution">`;
          jsxContent += `<h3>🔗 <a href="${urlMatch[1]}" target="_blank" rel="noopener noreferrer">${titleMatch[1]}</a></h3>`;
          if (descMatch) {
            jsxContent += `<p>${descMatch[1]}</p>`;
          }
          jsxContent += `</div>`;
        }
      });
      
      jsxContent += `</section>`;
    }
    
    // Extract dashboards section
    const dashboardMatch = dataContent.match(/dashboards:\s*\{[\s\S]*?title:\s*'([^']+)'[\s\S]*?paragraph:\s*'([^']+)'[\s\S]*?featured:\s*\{[\s\S]*?title:\s*'([^']+)'[\s\S]*?\}/);
    if (dashboardMatch) {
      jsxContent += `<section className="dashboards-section">`;
      jsxContent += `<h2>${dashboardMatch[1]}</h2>`;
      jsxContent += `<p>${dashboardMatch[2]}</p>`;
      jsxContent += `<div className="featured-build">`;
      jsxContent += `<p><strong>Featured Build:</strong></p>`;
      jsxContent += `<p><strong>${dashboardMatch[3]}</strong></p>`;
      jsxContent += `</div>`;
      jsxContent += `</section>`;
    }
    
    // Extract knowledge management section
    const knowledgeMatch = dataContent.match(/knowledgeManagement:\s*\{[\s\S]*?title:\s*'([^']+)'[\s\S]*?paragraph:\s*'([^']+)'[\s\S]*?\}/);
    if (knowledgeMatch) {
      jsxContent += `<section className="wiki-section">`;
      jsxContent += `<h2>${knowledgeMatch[1]}</h2>`;
      jsxContent += `<p>${knowledgeMatch[2]}</p>`;
      jsxContent += `</section>`;
    }
    
    return jsxContent;
  } catch (error) {
    console.warn(`Warning: Could not extract expertise data:`, error.message);
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
  
  // Only add page title if the content doesn't already have an h1 tag
  const hasH1 = jsxContent.includes('<h1');
  if (pageTitle && !hasH1) {
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
    
    // Convert line breaks
    .replace(/<br\s*\/?>/g, '  \n') // Markdown line break with two spaces
    
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