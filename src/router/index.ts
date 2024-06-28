import {createRouter, createWebHashHistory} from 'vue-router'
import shaderStudyRouter from "./shaderStudy";
import exampleRouter from "./example";

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            redirect: '/shaderStudy/page_1',
        },
        ...shaderStudyRouter,
        ...exampleRouter,
    ]
})

export default router
