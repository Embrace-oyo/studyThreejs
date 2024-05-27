import {createRouter, createWebHashHistory} from 'vue-router'
import webglRouter from "./webgl";
import shaderStudyRouter from "./shaderStudy";

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            redirect: '/page_1',
        },
        ...shaderStudyRouter,
        ...webglRouter,
        {
            path: '/perlinBall',
            name: '柏林噪音球',
            component: () => import('@/views/perlinBall.vue')
        },
        {
            path: '/starSky',
            name: '星云',
            component: () => import('@/views/starSky.vue')
        },
        {
            path: '/starSkyShader',
            name: '动态星云',
            component: () => import('@/views/starSkyShader.vue')
        },
        {
            path: '/starCloud',
            name: '银河',
            component: () => import('@/views/starCloud.vue')
        },
        {
            path: '/sea',
            name: '海面',
            component: () => import('@/views/sea.vue')
        },
        {
            path: '/text',
            name: '文本',
            component: () => import('@/views/text.vue')
        },
        {
            path: '/tween',
            name: '动画',
            component: () => import('@/views/tween.vue')
        },
        {
            path: '/fantasy',
            name: 'fantasy',
            component: () => import('@/views/fantasy.vue')
        },
        {
            path: '/fire',
            name: '火焰',
            component: () => import('@/views/fire.vue')
        },
        {
            path: '/streamer',
            name: '流光',
            component: () => import('@/views/streamer.vue')
        },
        {
            path: '/su7',
            name: '小米SU7',
            component: () => import('@/views/su7.vue')
        },
        {
            path: '/galaxy',
            name: '星河',
            component: () => import('@/views/galaxy.vue')
        },
        {
            path: '/ar',
            name: 'AR',
            component: () => import('@/views/ar.vue')
        },
        {
            path: '/pepyaka',
            name: 'pepyaka',
            component: () => import('@/views/pepyaka.vue')
        },
        {
            path: '/rain',
            name: '雨滴',
            component: () => import('@/views/rain.vue')
        }
    ]
})

export default router
