import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/smart-todo/', // 仓库名，注意前后斜杠
  plugins: [react()],
})
