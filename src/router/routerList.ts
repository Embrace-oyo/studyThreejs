import su7 from '@/assets/listImg/小米SU7.png'
import dissipate from '@/assets/listImg/消散特效.png'
import fluid from '@/assets/listImg/流体效果.png'
import shield from '@/assets/listImg/能量护盾效果.png'
import water from '@/assets/listImg/泳池.png'
import space from '@/assets/listImg/太空探索.png'
import fire from '@/assets/listImg/火球.png'
import neon from '@/assets/listImg/霓虹灯特效.png'
import aurora from '@/assets/listImg/极光和树.png'
import ring from '@/assets/listImg/扩散光环效果.png'
import skull from '@/assets/listImg/头骨.png'
import metal from '@/assets/listImg/金属方块.png'
import land from '@/assets/listImg/岛屿.png'
import ocean from '@/assets/listImg/海洋.png'

const exampleRouter = [
    {
        path: 'su7',
        name: '小米SU7',
        meta: {
            img: su7
        },
        component: () => import('@/views/pages/su7/index.vue')
    },
    {
        path: 'dissipate',
        name: '消散特效',
        meta: {
            img: dissipate
        },
        component: () => import('@/views/pages/dissipate/index.vue')
    },
    {
        path: 'fluid',
        name: '流体效果',
        meta: {
            img: fluid
        },
        component: () => import('@/views/pages/fluid/index.vue')
    },
    {
        path: 'shield',
        name: '能量护盾效果',
        meta: {
            img: shield
        },
        component: () => import('@/views/pages/shield/index.vue')
    },
    {
        path: 'water',
        name: '泳池🏊',
        meta: {
            img: water
        },
        component: () => import('@/views/pages/water/index.vue')
    },
    {
        path: 'spaceDiscover',
        name: '太空探索🚀',
        meta: {
            img: space
        },
        component: () => import('@/views/pages/spaceDiscover/index.vue')
    },
    {
        path: 'fireBall',
        name: '火球🔥',
        meta: {
            img: fire
        },
        component: () => import('@/views/pages/fireBall/index.vue')
    },
    {
        path: 'neon',
        name: '霓虹灯特效💡',
        meta: {
            img: neon
        },
        component: () => import('@/views/pages/neon/index.vue')
    },
    {
        path: 'aurora',
        name: '极光和树🌲',
        meta: {
            img: aurora
        },
        component: () => import('@/views/pages/aurora/index.vue')
    },
    {
        path: 'ring',
        name: '扩散光环效果😇',
        meta: {
            img: ring
        },
        component: () => import('@/views/pages/ring/index.vue')
    },
    {
        path: 'skull',
        name: '头骨🦴',
        meta: {
            img: skull
        },
        component: () => import('@/views/pages/skull/index.vue')
    },
    {
        path: 'metalCube',
        name: '金属方块♦️',
        meta: {
            img: metal
        },
        component: () => import('@/views/pages/metalCube/index.vue')
    },
    {
        path: 'land',
        name: '岛屿🏝️',
        meta: {
            img: land
        },
        component: () => import('@/views/pages/land/index.vue')
    },
    {
        path: 'ocean',
        name: '海洋🌊',
        meta: {
            img: ocean
        },
        component: () => import('@/views/pages/ocean/index.vue')
    }

]

export default exampleRouter;
