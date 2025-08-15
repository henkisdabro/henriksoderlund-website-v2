import { generateLlmsTxt } from '../scripts/generate-llms-txt.js';
import fs from 'fs';
import path from 'path';

/**
 * Vite plugin to automatically generate llms.txt file during build
 * and optionally watch for changes during development
 */
export function llmsTxtPlugin(options = {}) {
  const {
    watch = true, // Watch for changes in development
    outputPath = 'llms.txt'
  } = options;

  let isServing = false;

  return {
    name: 'llms-txt-generator',
    
    configResolved(config) {
      isServing = config.command === 'serve';
    },

    buildStart() {
      // Generate llms.txt at the start of build
      try {
        const content = generateLlmsTxt();
        const outputFile = path.resolve(outputPath);
        fs.writeFileSync(outputFile, content, 'utf8');
        
        if (isServing) {
          console.log('🤖 llms.txt generated for development');
        } else {
          console.log('🤖 llms.txt generated for production build');
        }
      } catch (error) {
        console.error('❌ Failed to generate llms.txt:', error.message);
        // Don't fail the build, just warn
      }
    },

    handleHotUpdate(ctx) {
      // In development, regenerate llms.txt when component files change
      if (!watch || !isServing) return;

      const componentExtensions = ['.tsx', '.ts'];
      const isComponentFile = componentExtensions.some(ext => ctx.file.endsWith(ext));
      const isInComponentsDir = ctx.file.includes('src/react-app/components');
      
      if (isComponentFile && isInComponentsDir) {
        try {
          const content = generateLlmsTxt();
          const outputFile = path.resolve(outputPath);
          fs.writeFileSync(outputFile, content, 'utf8');
          console.log('🔄 llms.txt updated due to component changes');
        } catch (error) {
          console.error('❌ Failed to update llms.txt:', error.message);
        }
      }
    },

    generateBundle() {
      // Ensure llms.txt is included in the build output
      try {
        const content = generateLlmsTxt();
        this.emitFile({
          type: 'asset',
          fileName: 'llms.txt',
          source: content
        });
        console.log('📦 llms.txt included in build output');
      } catch (error) {
        console.error('❌ Failed to include llms.txt in build:', error.message);
      }
    }
  };
}