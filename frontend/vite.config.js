import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Base path cho deployment (GitHub Pages cần path là /tên-repo/)
  // Khi chạy dev local: mặc định là '/'
  // Khi build cho GitHub Pages: đặt qua biến môi trường VITE_BASE_URL
  // eslint-disable-next-line no-undef
  base: process.env.VITE_BASE_URL || '/',
})
