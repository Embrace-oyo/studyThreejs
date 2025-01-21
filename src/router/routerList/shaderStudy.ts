const shaderStudyRouter = [
    {
        path: '/shaderStudy/page_1',
        name: 'Shader小样',
        component: () => import('@/views/shaderStudy/page_1.vue')
    },
    {
        path: '/shaderStudy/page_2',
        name: 'Shaderuv绘制图像',
        component: () => import('@/views/shaderStudy/page_2.vue')
    },
    {
        path: '/shaderStudy/page_3',
        name: 'Shader对图像的处理',
        component: () => import('@/views/shaderStudy/page_3.vue')
    },
    {
        path: '/shaderStudy/page_4',
        name: 'Shader滤镜处理',
        component: () => import('@/views/shaderStudy/page_4.vue')
    },
    {
        path: '/shaderStudy/page_5',
        name: 'Shader顶点着色器',
        component: () => import('@/views/shaderStudy/page_5.vue')
    },
    {
        path: '/shaderStudy/page_6',
        name: 'Shader光照模型',
        component: () => import('@/views/shaderStudy/page_6.vue')
    },
    {
        path: '/shaderStudy/page_7',
        name: 'Shader光线步进',
        component: () => import('@/views/shaderStudy/page_7.vue')
    },
    {
        path: '/shaderStudy/page_8',
        name: 'Shader图片特效',
        component: () => import('@/views/shaderStudy/page_8.vue')
    },
    {
        path: '/shaderStudy/page_9',
        name: 'Shader3D图形特效',
        component: () => import('@/views/shaderStudy/page_9.vue')
    },
    {
        path: '/shaderStudy/page_10',
        name: 'Shader光线行进特效',
        component: () => import('@/views/shaderStudy/page_10.vue')
    },
    {
        path: '/shaderStudy/page_11',
        name: 'Shader太阳特效',
        component: () => import('@/views/shaderStudy/page_11.vue')
    }
]

export default shaderStudyRouter
