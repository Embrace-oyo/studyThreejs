import {createRouter, createWebHashHistory} from 'vue-router'
// import shaderStudyRouter from "./shaderStudy";
import exampleRouter from "./routerList/example";

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            redirect: '/preview',
        },
        {
            path: '/preview',
            name: 'Home',
            meta: {
                keepAlive: true
            },
            component: () => import('@/views/preview/preview.vue')
        },
        {
            path: '/layout',
            name: 'Layout',
            meta: {
                keepAlive: true
            },
            component: () => import('@/views/preview/layout.vue'),
            children: exampleRouter
        }
    ]
})

export default router
