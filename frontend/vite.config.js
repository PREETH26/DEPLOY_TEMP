import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  base: '/',
  assetsInclude: ["**/pdf.worker.min.js", "**/pdf.worker.js"], // Treat these files as assets
    server: {
        watch: {
            usePolling: true, // Optional: Useful for some development environments
        },
    },
    build: {
        rollupOptions: {
            external: [/pdf\.worker\.(min\.)?js$/], // Exclude from bundling
        },
    },
})
