import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from 'vite-tsconfig-paths';

const host = process.env.TAURI_DEV_HOST;

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [vue(), tailwindcss(), tsconfigPaths()],
  clearScreen: false,
  server: {
    port: 5173,
    strictPort: true,
    cors: {
      origin: '*',
      methods: '*',
      allowedHeaders: '*'
    },
    host: host || false,
    hmr: host
      ? {
          protocol: 'ws',
          host,
          port: 5173
        }
      : undefined,
    watch: {
      ignored: ['**/src-tauri/**']
    }
  },
  optimizeDeps: {
    exclude: ['monaco-editor', 'monaco-editor-vue3']
  }
}))
