const exampleRouter = [
    {
        path: '/example/su7',
        name: '小米SU7',
        component: () => import('@/views/example/su7/su7.vue')
    },
    {
        path: '/example/sky',
        name: '天空',
        component: () => import('@/views/example/sky/sky.vue')
    },
    {
        path: '/example/fluid',
        name: '流体效果',
        component: () => import('@/views/example/fluid/fluid.vue')
    },
    {
        path: '/example/ring',
        name: '扩散光环效果',
        component: () => import('@/views/example/ring/ring.vue')
    },
    /*{
        path: '/example/abeto',
        name: '花瓣特效',
        component: () => import('@/views/example/abeto/abeto.vue')
    },*/
    {
        path: '/example/neon',
        name: '霓虹灯特效',
        component: () => import('@/views/example/neon/neon.vue')
    },
    {
        path: '/example/aurora',
        name: '极光和树',
        component: () => import('@/views/example/aurora/aurora.vue')
    },
    {
        path: '/example/webGLFog',
        name: '烟雾特效',
        component: () => import('@/views/example/webGLFog/webGLFog.vue')
    },
    {
        path: '/example/ablate',
        name: '转场特效',
        component: () => import('@/views/example/ablate/ablate.vue')
    },
    {
        path: '/example/spaceDiscover',
        name: '太空探索🚀',
        component: () => import('@/views/example/spaceDiscover/spaceDiscover.vue')
    },
    {
        path: '/example/music',
        name: '音乐可视化🎵',
        component: () => import('@/views/example/music/music.vue')
    },

]

export default exampleRouter;
