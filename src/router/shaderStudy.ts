const shaderStudyRouter = [
    {
        path: '/shaderStudy/page_1',
        name: 'shader_小样',
        component: () => import('@/views/shaderStudy/page_1.vue')
    },
    {
        path: '/shaderStudy/page_2',
        name: 'shader_uv绘制图像',
        component: () => import('@/views/shaderStudy/page_2.vue')
    },
    {
        path: '/shaderStudy/page_3',
        name: 'shader_对图像的处理',
        component: () => import('@/views/shaderStudy/page_3.vue')
    },
    {
        path: '/shaderStudy/page_4',
        name: 'shader_滤镜处理',
        component: () => import('@/views/shaderStudy/page_4.vue')
    },
    {
        path: '/shaderStudy/page_5',
        name: 'shader_顶点着色器',
        component: () => import('@/views/shaderStudy/page_5.vue')
    }
]

export default shaderStudyRouter
