const exampleRouter = [
    {
        path: 'su7',
        name: '小米SU7',
        meta: {
            img: '../../assets/listImg/小米SU7.png'
        },
        component: () => import('@/views/pages/su7/index.vue')
    },
    {
        path: 'dissipate',
        name: '消散特效',
        meta: {
            img: '../../assets/listImg/消散特效.png'
        },
        component: () => import('@/views/pages/dissipate/index.vue')
    }
    /*  {
          path: 'fluid',
          name: '流体效果',
          meta:{
              img: '../../assets/listImg/流体效果.png'
          },
          component: () => import('@/views/example/fluid/fluid.vue')
      },
      {
          path: 'ring',
          name: '扩散光环效果',
          meta:{
              img: '../../assets/listImg/扩散光环效果.png'
          },
          component: () => import('@/views/example/ring/ring.vue')
      },
      {
          path: 'neon',
          name: '霓虹灯特效',
          meta:{
              img: '../../assets/listImg/霓虹灯特效.png'
          },
          component: () => import('@/views/example/neon/neon.vue')
      },
      {
          path: 'aurora',
          name: '极光和树',
          meta:{
              img: '../../assets/listImg/极光和树.png'
          },
          component: () => import('@/views/example/aurora/aurora.vue')
      },
      {
          path: 'webGLFog',
          name: '烟雾特效',
          meta:{
              img: '../../assets/listImg/烟雾特效.png'
          },
          component: () => import('@/views/example/webGLFog/webGLFog.vue')
      },
      {
          path: 'ablate',
          name: '转场特效',
          meta:{
              img: '../../assets/listImg/转场特效.png'
          },
          component: () => import('@/views/example/ablate/ablate.vue')
      },
      {
          path: 'spaceDiscover',
          name: '太空探索🚀',
          meta:{
              img: '../../assets/listImg/太空探索🚀.png'
          },
          component: () => import('@/views/example/spaceDiscover/spaceDiscover.vue')
      },
      {
          path: 'cloud',
          name: '云☁️',
          meta:{
              img: '../../assets/listImg/云☁️.png'
          },
          component: () => import('@/views/example/cloud/cloud.vue')
      },
      {
          path: 'meteor',
          name: '陨石🪨',
          meta:{
              img: '../../assets/listImg/云☁️.png'
          },
          component: () => import('@/views/example/meteor/meteor.vue')
      },
    ,*/

]

export default exampleRouter;
