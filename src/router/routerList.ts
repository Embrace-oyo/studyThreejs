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
        meta: {
            img: '../../assets/listImg/流体效果.png'
        },
        component: () => import('@/views/pages/fluid/index.vue')
    },
    {
        path: 'shield',
        name: '能量护盾效果',
        meta: {
            img: '../../assets/listImg/能量护盾效果.png'
        },
        component: () => import('@/views/pages/shield/index.vue')
    },
    {
        path: 'water',
        name: '泳池🏊',
        meta: {
            img: '../../assets/listImg/泳池.png'
        },
        component: () => import('@/views/pages/water/index.vue')
    },
    {
        path: 'spaceDiscover',
        name: '太空探索🚀',
        meta: {
            img: '../../assets/listImg/太空探索🚀.png'
        },
        component: () => import('@/views/pages/spaceDiscover/index.vue')
    },
    {
        path: 'fireBall',
        name: '火球🔥',
        meta: {
            img: '../../assets/listImg/火球.png'
        },
        component: () => import('@/views/pages/fireBall/index.vue')
    },
    {
        path: 'neon',
        name: '霓虹灯特效💡',
        meta: {
            img: '../../assets/listImg/霓虹灯特效.png'
        },
        component: () => import('@/views/pages/neon/index.vue')
    },
    {
        path: 'aurora',
        name: '极光和树🌲',
        meta: {
            img: '../../assets/listImg/极光和树.png'
        },
        component: () => import('@/views/pages/aurora/index.vue')
    },
    {
        path: 'ring',
        name: '扩散光环效果😇',
        meta: {
            img: '../../assets/listImg/扩散光环效果.png'
        },
        component: () => import('@/views/pages/ring/index.vue')
    },
    {
        path: 'skull',
        name: '头骨🦴',
        meta: {
            img: '../../assets/listImg/头骨.png'
        },
        component: () => import('@/views/pages/skull/index.vue')
    },
    {
        path: 'metalCube',
        name: '金属方块♦️',
        meta: {
            img: '../../assets/listImg/金属方块.png'
        },
        component: () => import('@/views/pages/metalCube/index.vue')
    },
    {
        path: 'land',
        name: '岛屿🏝️',
        meta: {
            img: '../../assets/listImg/岛屿.png'
        },
        component: () => import('@/views/pages/land/index.vue')
    },
    {
        path: 'ocean',
        name: '海洋🌊',
        meta: {
            img: '../../assets/listImg/海洋.png'
        },
        component: () => import('@/views/pages/ocean/index.vue')
    }

]

export default exampleRouter;
