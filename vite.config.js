import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import Pages from 'vite-plugin-pages'
import path from "path"
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    Pages({
      dirs: 'src/pages', // dossier source
      extensions: ['jsx', 'tsx'],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
