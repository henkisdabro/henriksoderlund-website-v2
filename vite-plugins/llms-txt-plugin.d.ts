import { Plugin } from 'vite';

export interface LlmsTxtPluginOptions {
  watch?: boolean;
  outputPath?: string;
}

export declare function llmsTxtPlugin(options?: LlmsTxtPluginOptions): Plugin;