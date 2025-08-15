import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [react(), cloudflare()],
  build: {
    // Enable source maps for better debugging with CSP
    sourcemap: true,
  },
  html: {
    // Set a placeholder nonce that will be replaced by the worker
    cspNonce: 'PLACEHOLDER_NONCE_VALUE'
  }
});
