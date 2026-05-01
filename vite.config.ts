import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron/simple'

const isElectron = process.env.ELECTRON === 'true'

const cjsOutput = {
  rollupOptions: {
    output: { format: 'cjs' as const, entryFileNames: '[name].cjs' },
  },
}

export default defineConfig({
  plugins: [
    react(),
    ...(isElectron
      ? [
          electron({
            main: {
              entry: 'electron/main.ts',
              vite: { build: cjsOutput },
            },
            preload: {
              input: 'electron/preload.ts',
              vite: {
                build: {
                  rollupOptions: {
                    output: { format: 'cjs' as const, entryFileNames: '[name].js' },
                  },
                },
              },
            },
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
