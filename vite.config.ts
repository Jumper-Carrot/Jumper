import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'url'
import tailwindcss from "@tailwindcss/vite";

// @ts-expect-error process is a nodejs global
const host = process.env.TAURI_DEV_HOST;

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@@types': fileURLToPath(new URL('./src/@types', import.meta.url)),
      '@@materials': fileURLToPath(
        new URL('./src/components/@materials', import.meta.url)
      ),
      '@@common': fileURLToPath(
        new URL('./src/components/@common', import.meta.url)
      )
    }
  },
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
