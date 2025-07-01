import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

export default {
  server: {
    proxy:{
      '/api':'http://localhost:4000',
    },
    host: '0.0.0.0',
    port: 5173,
  },
};

