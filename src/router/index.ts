import {createRouter, createWebHashHistory} from 'vue-router'
// import shaderStudyRouter from "./shaderStudy";
// import exampleRouter from "./example";

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
            component: () => import('@/views/preview/preview.vue')
        }
    ]
})

export default router
