/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Let tests read stylesheet source via `?raw` (motion-safety regression checks).
  test: { css: true },
});
