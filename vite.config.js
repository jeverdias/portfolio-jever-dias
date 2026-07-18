import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    manifest: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (/[/\\]node_modules[/\\](react|react-dom|scheduler)[/\\]/.test(id)) return 'vendor-react'
          if (id.includes('@supabase') || id.includes('node_modules/ws/')) return 'vendor-supabase'
          if (id.includes('lucide-react')) return 'vendor-icons'
          return 'vendor'
        },
      },
    },
  },
})
