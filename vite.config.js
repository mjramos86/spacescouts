import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves this project site at https://<user>.github.io/spacescouts/,
// so asset URLs must be prefixed with /spacescouts/. An absolute base resolves
// correctly whether or not the visited URL has a trailing slash.
export default defineConfig({
  base: '/spacescouts/',
  plugins: [react()],
})
