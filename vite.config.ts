import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import glsl from 'vite-plugin-glsl'
import basicSsl from '@vitejs/plugin-basic-ssl'
// https://vitejs.dev/config/
export default defineConfig({
    server: {
        host: '0.0.0.0',
        port: 8181,
        https: false,
        proxy: {
            'assets': 'https://abeto.co/assets'
        },
    },
    plugins: [
        vue(),
        glsl(),
        basicSsl({
            /** name of certification */
            name: 'test',
            /** custom trust domains */
            domains: ['*.custom.com'],
            /** custom certification directory */
            certDir: '/Users/.../.devServer/cert'
        })
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
})
