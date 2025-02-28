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
    },
    {
        path: 'fluid',
        name: '流体效果',
        meta:{
            img: '../../assets/listImg/流体效果.png'
        },
        component: () => import('@/views/pages/fluid/index.vue')
    },
    {
        path: 'shield',
        name: '能量护盾效果',
        meta:{
            img: '../../assets/listImg/能量护盾效果.png'
        },
        component: () => import('@/views/pages/shield/index.vue')
    },
    {
        path: 'water',
        name: '泳池',
        meta:{
            img: '../../assets/listImg/泳池.png'
        },
        component: () => import('@/views/pages/water/index.vue')
    },
    {
        path: 'spaceDiscover',
        name: '太空探索🚀',
        meta:{
            img: '../../assets/listImg/太空探索🚀.png'
        },
        component: () => import('@/views/pages/spaceDiscover/index.vue')
    },
    {
        path: 'fireBall',
        name: '火球🔥',
        meta:{
            img: '../../assets/listImg/火球.png'
        },
        component: () => import('@/views/pages/fireBall/index.vue')
    },
    {
        path: 'neon',
        name: '霓虹灯特效',
        meta:{
            img: '../../assets/listImg/霓虹灯特效.png'
        },
        component: () => import('@/views/pages/neon/index.vue')
    },
    {
        path: 'aurora',
        name: '极光和树',
        meta:{
            img: '../../assets/listImg/极光和树.png'
        },
        component: () => import('@/views/pages/aurora/index.vue')
    },
    {
        path: 'ring',
        name: '扩散光环效果',
        meta:{
            img: '../../assets/listImg/扩散光环效果.png'
        },
        component: () => import('@/views/pages/ring/index.vue')
    },
    /*
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
