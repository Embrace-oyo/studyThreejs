import {createRouter, createWebHashHistory} from 'vue-router'
// import shaderStudyRouter from "./shaderStudy";
import RouterList from "./routerList";

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
        }
    ]
})

export default router
