import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' makes built asset URLs relative, so the app works when served from
// any subpath (preview hosts, static folders) instead of only the domain root.
export default defineConfig({
  base: './',
  plugins: [react()],
})
