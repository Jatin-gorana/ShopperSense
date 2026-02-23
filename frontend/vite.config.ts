import { iframeErrorPropagation } from './vite-plugin-iframe-errors.ts';
import { loaderInjectPlugin } from './vite-plugin-loader.ts';
import react from '@vitejs/plugin-react';
import path from 'path';
import { type UserConfigFn, loadEnv } from 'vite';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
const config: UserConfigFn = ({ mode }) => {
    process.env = {
        ...process.env,
        ...loadEnv(mode, process.cwd())
    };
    return {
        plugins: [
            react(),
            tailwindcss(),
            iframeErrorPropagation(),
            loaderInjectPlugin()
        ],
        server: {
            allowedHosts: process.env.ALLOWED_HOSTS?.split(',') || true,
            host: '0.0.0.0',
            port: parseInt(process.env.PORT!) || 5000,
            strictPort: true, // Don't try alternative ports, fail if port is occupied
            watch: {
                ignored: ['node_modules']
            },
            hmr: false
        },
        base: '/',
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src')
            }
        }
    };
};

export default config;
