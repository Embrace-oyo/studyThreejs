import {createRouter, createWebHashHistory} from 'vue-router'
// import shaderStudyRouter from "./shaderStudy";
import RouterList from "./routerList";
import hero from '@/assets/listImg/宇航员.png'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            redirect: '/index',
        },
        {
            path: '/index',
            name: 'Home',
            meta: {
                keepAlive: true
            },
            component: () => import('@/views/index/index.vue')
        },
        {
            path: '/layout',
            name: 'Layout',
            meta: {
                keepAlive: true
            },
            component: () => import('@/views/index/layout.vue'),
            children: RouterList
        },
        {
            path: '/lusion',
            name: 'lusion',
            meta: {
                img: hero
            },
            component: () => import('@/views/pages/lusion/index.vue')
        }
    ]
})

export default router
