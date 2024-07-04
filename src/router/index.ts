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
        {
            path: '/shaderStudy',
            name: 'shader学习',
            children: [...shaderStudyRouter]
        },
        {
            path: '/example',
            name: '例子',
            children: [...exampleRouter]
        },
        // ...shaderStudyRouter,
        // ...exampleRouter,
    ]
})

export default router
