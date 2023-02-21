/// <reference types="vitest" />

import { defineConfig } from 'vitest/config'
import Vue from '@vitejs/plugin-vue'
import path from 'path'

const timeout = 60000

export default defineConfig({
  plugins: [Vue()],

  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname)}/`,
      '@/': `${path.resolve(__dirname, 'src')}/`,
    },
  },

  test: {
    environment: 'jsdom',
    globals: true,
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}', '**/*.{test,spec}.api.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    testTimeout: timeout,
  },
})
