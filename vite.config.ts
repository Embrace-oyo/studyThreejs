import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import glsl from 'vite-plugin-glsl'
import basicSsl from '@vitejs/plugin-basic-ssl'
import pxtorem from 'postcss-pxtorem'
// https://vitejs.dev/config/
export default defineConfig({
    base: './',
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server: {
        host: '0.0.0.0',
        port: 8181,
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
    assetsInclude:['**/*.hdr'],
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
    },
    //打包配置
    build: {
        outDir: 'docs',
        sourcemap: false,
        reportCompressedSize: false,
        //浏览器兼容性  "esnext"|"modules"
        target: "modules",
        //指定输出路径
        //生成静态资源的存放路径
        assetsDir: "docs/assets",
        emptyOutDir: true,  // 打包时先清空上一次构建生成的目录
        rollupOptions: {
            output: {
                experimentalMinChunkSize: 20 * 1024,
                // 引入文件名的名称
                chunkFileNames: 'js/[name]-[hash].js',
                // 包的入口文件名称
                entryFileNames: 'lib/[name]-[hash].js',
                // 资源文件像 字体，图片等
                assetFileNames: '[ext]/[name]-[hash].[ext]',
                // 分包
                manualChunks(id) {
                    if (id.includes('three')) {
                        return 'threejs'
                    }
                    if (id.includes('node_modules')) {
                        return 'vendor'
                    }
                },
            }
        }
    }
})
