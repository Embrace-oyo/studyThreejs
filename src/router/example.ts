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
    {
        path: '/example/ring',
        name: '扩散光环效果',
        component: () => import('@/views/example/ring.vue')
    },
    {
        path: '/example/abeto',
        name: '花瓣特效',
        component: () => import('@/views/example/abeto.vue')
    },
    {
        path: '/example/neon',
        name: '霓虹灯特效',
        component: () => import('@/views/example/neon.vue')
    },
    {
        path: '/example/aurora',
        name: '极光和树',
        component: () => import('@/views/example/aurora.vue')
    },
    {
        path: '/example/webGLFog',
        name: '烟雾',
        component: () => import('@/views/example/webGLFog.vue')
    },
    /*  {
          path: '/example/midwam',
          name: 'MIDWAM',
          component: () => import('@/views/example/midwam.vue')
      },*/

]

export default exampleRouter;
