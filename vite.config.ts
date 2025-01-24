import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import glsl from 'vite-plugin-glsl'
import basicSsl from '@vitejs/plugin-basic-ssl'
import pxtorem from 'postcss-pxtorem'
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
    },
    css:{
        postcss: {
            plugins: [
                pxtorem({
                    // 设计稿宽度的1/10，通常是750的1/10
                    rootValue: 192,
                    // 需要转换的属性，除 border 外所有px 转 rem
                    propList: ['*', "!border"],
                    // 要忽略的选择器
                    selectorBlackList: ['van'],
                    replace: true, // 直接更换成rem
                    mediaQuery: false, // 是否要在媒体查询中转换px
                    minPixelValue: 2 // 设置要转换的最小像素值
                })
            ]
        }
    }
})
