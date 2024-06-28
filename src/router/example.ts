const exampleRouter = [
    {
        path: '/perlinBall',
        name: '柏林噪音球',
        component: () => import('@/views/example/perlinBall.vue')
    },
    {
        path: '/starSky',
        name: '星云',
        component: () => import('@/views/example/starSky.vue')
    },
    {
        path: '/starSkyShader',
        name: '动态星云',
        component: () => import('@/views/example/starSkyShader.vue')
    },
    {
        path: '/starCloud',
        name: '银河',
        component: () => import('@/views/example/starCloud.vue')
    },
    {
        path: '/sea',
        name: '海面',
        component: () => import('@/views/example/sea.vue')
    },
    {
        path: '/text',
        name: '文本',
        component: () => import('@/views/example/text.vue')
    },
    {
        path: '/tween',
        name: '动画',
        component: () => import('@/views/example/tween.vue')
    },
    {
        path: '/fantasy',
        name: 'fantasy',
        component: () => import('@/views/example/fantasy.vue')
    },
    {
        path: '/fire',
        name: '火焰',
        component: () => import('@/views/example/fire.vue')
    },
    {
        path: '/streamer',
        name: '流光',
        component: () => import('@/views/example/streamer.vue')
    },
    {
        path: '/su7',
        name: '小米SU7',
        component: () => import('@/views/example/su7.vue')
    },
    {
        path: '/galaxy',
        name: '星河',
        component: () => import('@/views/example/galaxy.vue')
    },
    {
        path: '/ar',
        name: 'AR',
        component: () => import('@/views/example/ar.vue')
    },
    {
        path: '/pepyaka',
        name: 'pepyaka',
        component: () => import('@/views/example/pepyaka.vue')
    },
    {
        path: '/rain',
        name: '雨滴',
        component: () => import('@/views/example/rain.vue')
    },
    {
        path: '/water',
        name: '水面',
        component: () => import('@/views/example/water.vue')
    },
    {
        path: '/galaxyShader',
        name: '宇宙银河',
        component: () => import('@/views/example/GalaxyofUniverses.vue')
    },
    {
        path: '/test',
        name: '测试',
        component: () => import('@/views/example/test.vue')
    }
]

export default exampleRouter;
