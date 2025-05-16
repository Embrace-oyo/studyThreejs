/**
 * justThreeJs aboutHeroFog.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/28 19:07:09
 */
import * as THREE from "three";
//glsl
import vert$5 from '@/views/pages/lusion/glsl/about/vert$5.glsl'
import frag$8 from '@/views/pages/lusion/glsl/about/frag$8.glsl'
function filePath(path) {
    return new URL(`../../../../../assets/${path}`, import.meta.url).href
}
export default class AboutHeroFog {
    // 3D对象和属性
    container = new THREE.Object3D();  // 容器对象
    geometry = null;             // 几何体
    material = null;             // 材质
    mesh = null;                 // 网格对象
    texture = null;              // 雾效纹理
    cacheRT = null;              // 缓存渲染目标

    // 实例数量
    INSTANCES_COUNT = 32;        // 雾效实例数量
    constructor(base) {
        this.parent = base;
        this.base = base.base;
    }

    /**
     * 预初始化 - 加载纹理资源
     */
    preInit() {
        this.texture = this.base.properties.loader.add(
            filePath("texture/fog.png"),
            {type: "texture"}
        ).content;
    }

    /**
     * 初始化雾效
     */
    init() {
        // 使用种子随机函数确保一致性
        const random = this.base.math.getSeedRandomFn("fog96");

        // 创建缓存渲染目标
        this.cacheRT = this.base.fboHelper.createRenderTarget(1, 1);

        // 基础平面几何体(3x3细分)
        const planeGeo = new THREE.PlaneGeometry(1, 1, 3, 3);

        // 创建实例化几何体
        this.geometry = new THREE.InstancedBufferGeometry();

        // 复制基础几何体属性
        for (const attr in planeGeo.attributes) {
            this.geometry.setAttribute(attr, planeGeo.attributes[attr]);
        }
        this.geometry.setIndex(planeGeo.index);

        // 准备实例化数据
        const instanceIds = new Float32Array(this.INSTANCES_COUNT);
        const instancePositions = new Float32Array(this.INSTANCES_COUNT * 3);
        const instanceRandoms = new Float32Array(this.INSTANCES_COUNT * 3);

        // 填充实例数据
        for (let i = 0, offset = 0; i < this.INSTANCES_COUNT; i++) {
            // 实例ID
            instanceIds[i] = i;

            // 位置数据 (X,Y,Z)
            instancePositions[offset] = 12 * (random() * 2 - 1);          // X: -12到12
            instancePositions[offset + 1] = -0.25 + 0.5 * random();       // Y: -0.25到0.25
            instancePositions[offset + 2] = 12 * (1 - i / (this.INSTANCES_COUNT - 1) * 2); // Z: 渐变分布

            // 随机数据 (用于变化)
            instanceRandoms[offset] = random() * 2 - 1;     // -1到1
            instanceRandoms[offset + 1] = random() * 2 - 1; // -1到1
            instanceRandoms[offset + 2] = random() * 2 - 1; // -1到1

            offset += 3;
        }

        // 设置实例化属性
        this.geometry.setAttribute(
            "a_instanceId",
            new THREE.InstancedBufferAttribute(instanceIds, 1)
        );
        this.geometry.setAttribute(
            "a_instancePos",
            new THREE.InstancedBufferAttribute(instancePositions, 3)
        );
        this.geometry.setAttribute(
            "a_instanceRands",
            new THREE.InstancedBufferAttribute(instanceRandoms, 3)
        );

        // 创建雾效材质
        this.material = new THREE.ShaderMaterial({
            uniforms: Object.assign({
                u_fogTexture: {value: this.texture},            // 雾效纹理
                u_currSceneTexture: {value: this.cacheRT.texture}, // 场景纹理
                u_lightPosition: this.parent.light.shaderUniforms.u_lightPosition, // 光源位置
                u_resolution: this.base.properties.shaderUniforms.u_resolution // 分辨率
            }, this.base.blueNoise.shaderUniforms, this.parent.aboutHeroScatter.shaderUniforms, this.parent.shaderUniforms),

            vertexShader: vert$5,    // 顶点着色器
            fragmentShader: frag$8,   // 片段着色器

            // 渲染设置
            side: THREE.DoubleSide,        // 双面渲染
            depthWrite: false,       // 禁用深度写入

            // 混合模式配置
            blending: THREE.CustomBlending,
            blendEquation: THREE.AddEquation,
            blendSrc: THREE.SrcAlphaFactor,
            blendDst: THREE.OneMinusSrcAlphaFactor,
            blendEquationAlpha: THREE.AddEquation,
            blendSrcAlpha: THREE.ZeroFactor,
            blendDstAlpha: THREE.OneFactor
        });

        // 创建网格对象
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.renderOrder = 20;          // 高渲染顺序
        this.mesh.frustumCulled = false;     // 禁用视锥体剔除

        // 设置渲染前回调
        this.mesh.onBeforeRender = this.onBeforeRender.bind(this);

        // 添加到容器
        this.container.add(this.mesh);
    }

    /**
     * 渲染前回调 - 缓存当前场景
     */
    onBeforeRender() {
        const renderer = this.base.fboHelper.renderer;
        const currentTarget = renderer.getRenderTarget();

        // 清除多采样状态并复制当前场景到缓存
        this.base.fboHelper.clearMultisampleRenderTargetState();
        this.base.fboHelper.copy(currentTarget.texture, this.cacheRT);

        // 恢复渲染目标
        renderer.setRenderTarget(currentTarget);
    }

    /**
     * 调整尺寸
     * @param {number} width 新宽度
     * @param {number} height 新高度
     */
    resize(width, height) {
        if(!this.cacheRT) return
        this.cacheRT.setSize(width, height);
    }

    /**
     * 更新雾效 (空实现，可扩展)
     * @param {number} deltaTime 时间增量
     */
    update(deltaTime) {
        // 可在此添加动画或动态效果
        console.log(this.material.uniforms)
    }
}
