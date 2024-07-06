const exampleRouter = [
    {
        path: '/example/su7',
        name: '小米SU7',
        component: () => import('@/views/example/su7.vue')
    },
    {
        path: '/example/sky',
        name: '天空',
        component: () => import('@/views/example/sky.vue')
    },
    {
        path: '/example/trail',
        name: '拖尾特效',
        component: () => import('@/views/example/trail.vue')
    },
    {
        path: '/example/composer',
        name: '离屏渲染',
        component: () => import('@/views/example/composer.vue')
    },

]

export default exampleRouter;
