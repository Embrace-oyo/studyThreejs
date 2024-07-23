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
        path: '/example/fluid',
        name: '流体效果',
        component: () => import('@/views/example/fluid.vue')
    },

]

export default exampleRouter;
