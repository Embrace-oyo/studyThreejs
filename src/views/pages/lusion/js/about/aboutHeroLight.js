/**
 * justThreeJs aboutHeroLight.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/25 18:15:25
 */
import * as THREE from "three";

export default class AboutHeroLight {
    // 阴影贴图尺寸
    shadowMapSize = 1024;

    // 光源位置 (默认在场景上方)
    position = new THREE.Vector3(0, 8, 0);

    // 阴影渲染目标
    shadowRenderTarget = null;

    // 共享的uniform变量
    shaderUniforms = {
        u_lightPosition: { value: this.position },  // 光源位置
        u_lightColor: { value: new THREE.Color("#000") },  // 光源颜色(默认黑色)
        u_lightShadowMaxDistance: { value: 12 },     // 阴影最大距离
        u_lightShadowTexture: { value: null },       // 阴影贴图
        u_lightShadowTextureTexelSize: {             // 阴影贴图像素尺寸
            value: new THREE.Vector2(
                1 / this.shadowMapSize,
                1 / (this.shadowMapSize * 2)
            )
        }
    };
    constructor(base) {
        this.base = base.base;
    }
    /**
     * 预初始化方法 (当前为空实现)
     */
    preInit() {
        // 可在此添加资源预加载逻辑
    }

    /**
     * 初始化光源
     */
    init() {
        // 添加着色器代码片段

        // 创建阴影渲染目标
        this.shadowRenderTarget = this.base.fboHelper.createRenderTarget(
            this.shadowMapSize,
            this.shadowMapSize * 2,  // 高度是宽度的2倍
            true,                    // 包含深度缓冲
            THREE.HalfFloatType            // 使用半浮点类型
        );

        // 配置阴影纹理
        let shadowTexture = this.shaderUniforms.u_lightShadowTexture.value = this.shadowRenderTarget.texture;
        this.shadowRenderTarget.depthBuffer = true;

        // WebGL2优化: 使用单通道格式
        if (this.base.settings.USE_WEBGL2) {
            shadowTexture.format = THREE.RedFormat;
        }
    }

    /**
     * 更新光源状态
     * @param {number} deltaTime 时间增量
     */
    update(deltaTime) {
        // 保存当前渲染状态
        let renderer = this.base.properties.renderer;
        let colorState = this.base.fboHelper.getColorState();
        let currentTarget = renderer.getRenderTarget();

        // 清除阴影贴图 (填充白色表示无阴影)
        renderer.setRenderTarget(this.shadowRenderTarget);
        renderer.setClearColor(0xFFFFFF, 1); // 白色
        renderer.clear();

        // 恢复渲染状态
        renderer.setRenderTarget(currentTarget);
        this.base.fboHelper.setColorState(colorState);
    }

    /**
     * 渲染网格到阴影贴图
     * @param {Mesh} mesh 要渲染的网格对象
     */
    renderMesh(mesh) {
        // 保存当前渲染状态
        let renderer = this.base.properties.renderer;
        let colorState = this.base.fboHelper.getColorState();
        let currentTarget = renderer.getRenderTarget();

        // 禁用自动清除颜色(保留深度)
        renderer.autoClearColor = false;

        // 渲染网格到阴影贴图
        this.base.fboHelper.renderMesh(mesh, this.shadowRenderTarget);

        // 恢复渲染状态
        renderer.setRenderTarget(currentTarget);
        this.base.fboHelper.setColorState(colorState);
    }

    /**
     * 后期更新 (当前实现为空)
     * @param {number} deltaTime 时间增量
     */
    postUpdate(deltaTime) {
        // 保存当前渲染状态
        let renderer = this.base.properties.renderer;
        let colorState = this.base.fboHelper.getColorState();
        let currentTarget = renderer.getRenderTarget();

        // 禁用自动清除
        renderer.autoClear = false;

        // 确保恢复到正确的渲染目标
        renderer.setRenderTarget(currentTarget);
        this.base.fboHelper.setColorState(colorState);
    }
}
