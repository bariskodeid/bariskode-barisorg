import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    // beforeAll di spec yang memakai DB menjalankan getPayload() dalam dev
    // mode = schema push ke database yang sama. Lima file seperti itu jalan
    // paralel dan saling menunggu (sendiri ~2 detik), jadi batas default 10
    // detik gampang terlewati di mesin yang sedang sibuk.
    hookTimeout: 60_000,
    include: ['tests/int/**/*.int.spec.ts', 'tests/int/**/*.int.spec.tsx'],
  },
})
