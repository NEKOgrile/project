import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    base: '/project/', // ← c'est bon si ton repo s'appelle "project"
    plugins: [react()],
    optimizeDeps: {
        exclude: ['lucide-react'],
    },
});
