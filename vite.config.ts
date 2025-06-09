import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import mkcert from 'vite-plugin-mkcert'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const process: any

const useMkcert =
  process.env.USE_MKCERT === 'true' || process.env.USE_MKCERT === '1'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: useMkcert
    ? [react(), tailwindcss(), mkcert()]
    : [react(), tailwindcss()],
  optimizeDeps: {
    exclude: ['lucide-react']
  },
  base: './',
  build: {
    sourcemap: true,
    minify: false
  }
})
