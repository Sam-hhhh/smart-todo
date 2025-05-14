import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/smart-todo/', // 这里必须和你的 GitHub 仓库名一致！
  plugins: [react()],
})
