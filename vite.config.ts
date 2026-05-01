import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron/simple'

const isElectron = process.env.ELECTRON === 'true'

export default defineConfig({
  plugins: [
    react(),
    ...(isElectron
      ? [
          electron({
            main: { entry: 'electron/main.ts' },
            preload: { input: 'electron/preload.ts' },
          }),
        ]
      : []),
  ],
  base: isElectron ? './' : '/',
  server: {
    port: 3000,
    open: !isElectron,
  },
})
