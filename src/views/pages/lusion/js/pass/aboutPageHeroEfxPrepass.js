/**
 * justThreeJs aboutPageHeroEfxPrepass.js
 * @author kongjianqiu
 * @description * @created 2025/4/24 11:00:44
 */

import * as THREE from "three";
import PostEffect from '@/views/pages/lusion/js/pass/postEffect'
// glsl
import fragmentShader$2 from '@/views/pages/lusion/glsl/aboutPageHeroEfxPrepass/fragmentShader$2.glsl'
import blurFragmentShader from '@/views/pages/lusion/glsl/aboutPageHeroEfxPrepass/blurFragmentShader.glsl'
import motionBlurFragmentShader from '@/views/pages/lusion/glsl/aboutPageHeroEfxPrepass/motionBlurFragmentShader.glsl'

export default class AboutPageHeroEfxPrepass extends PostEffect {
    // 类属性初始化
    isActive = true;                // 是否激活状态
    cacheRT = null;                 // 缓存渲染目标
    motionBlurRatio = 1;            // 运动模糊比例
    motionRT;                       // 运动渲染目标
    motionTmpRT;                    // 临时运动渲染目标
    useMotionBlur = false;          // 是否使用运动模糊
    blurRatio = 0;                  // 模糊比例
    scene = new THREE.Scene();            // 场景对象
    needsRenderScene = true;        // 是否需要渲染场景
    renderOrder = 5;                // 渲染顺序
    constructor(base) {
        super(base);
        this.base = base;
    }
    /**
     * 初始化方法
     * @param {Object} e 配置参数
     */
    init(e) {
        // 合并配置参数
        Object.assign(this, e);

        // 调用父类初始化
        super.init();

        // 创建各种渲染目标
        this.cacheRT = this.base.fboHelper.createRenderTarget(1, 1);
        this.motionRT = this.base.fboHelper.createRenderTarget(1, 1);
        this.motionRT.depthBuffer = true;
        this.motionTmpRT = this.base.fboHelper.createRenderTarget(1, 1);

        // 创建主材质
        this._material = this.base.fboHelper.createRawShaderMaterial({
            uniforms: Object.assign({
                u_texture: {value: null},                      // 输入纹理
                u_motionTexture: {value: this.motionRT.texture}, // 运动纹理
                u_aspect: {value: 1},                          // 宽高比
                u_blurRatio: {value: 0}                        // 模糊比例
            }, this.base.blueNoise.shaderUniforms),                      // 合并噪声uniforms
            fragmentShader: fragmentShader$2                   // 片段着色器
        });

        // 创建运动模糊材质
        this._motionBlurMaterial = this.base.fboHelper.createRawShaderMaterial({
            uniforms: this._material.uniforms,                  // 共享uniforms
            fragmentShader: motionBlurFragmentShader            // 运动模糊片段着色器
        });

        // 创建普通模糊材质
        this._blurMaterial = this.base.fboHelper.createRawShaderMaterial({
            uniforms: this._material.uniforms,                  // 共享uniforms
            fragmentShader: blurFragmentShader                  // 模糊片段着色器
        });
    }

    /**
     * 判断是否需要渲染
     * @return {boolean} 是否激活
     */
    needsRender() {
        return this.isActive;
    }

    /**
     * 设置后期处理参数
     * @param {Object} e 包含width和height的对象
     */
    setPostprocessing(e) {
        const t = e.width, r = e.height;
        // 调整渲染目标尺寸
        this.cacheRT.setSize(t, r);
        // 更新宽高比
        this._material.uniforms.u_aspect.value = t / r;
    }

    /**
     * 渲染运动效果
     * @param {Object} e 网格对象
     * @param {Camera} t 相机
     * @param {number} r 宽度
     * @param {number} n 高度
     */
    renderMotion(e, t, r, n) {
        let a = this.base.properties.renderer;
        let l = this.base.fboHelper.getColorState();     // 保存当前颜色状态
        let c = a.getRenderTarget();           // 获取当前渲染目标

        // 设置运动渲染目标
        this.motionRT.setSize(r, n);
        a.setRenderTarget(this.motionRT);
        a.setClearColor(8355711, 0);           // 设置清除颜色 (十六进制8355711 = rgb(127,127,127))
        a.clear();

        // 渲染网格到运动纹理
        this.base.fboHelper.renderMesh(e, this.motionRT, t);

        // 应用模糊效果
        this.base.blur.blur(2, 1, this.motionRT, this.motionTmpRT, this.motionRT);

        // 恢复渲染状态
        a.setRenderTarget(c);
        this.base.fboHelper.setColorState(l);

        // 启用运动模糊标志
        this.useMotionBlur = true;
    }

    /**
     * 渲染方法
     * @param {Object} e 渲染参数对象
     * @param {boolean} t 是否强制渲染 (默认false)
     */
    render(e, t = false) {
        // 复制纹理到缓存
        this.base.fboHelper.copy(e.fromTexture, this.cacheRT);

        // 根据条件选择材质
        if (this.useMotionBlur) {
            this.useMotionBlur = false;
            this.material = this._motionBlurMaterial;
            this.material.uniforms.u_blurRatio.value = this.motionBlurRatio;
        } else {
            this.material = this.blurRatio > 0 ? this._blurMaterial : this._material;
            this.material.uniforms.u_blurRatio.value = this.blurRatio;
        }

        // 判断是否需要渲染场景
        if (this.needsRenderScene) {
            // 设置纹理并渲染
            this.material.uniforms.u_texture.value = e.fromTexture;
            this.base.fboHelper.render(this.material, e.toRenderTarget);

            // 保存颜色状态
            let r = this.base.fboHelper.getColorState();

            // 渲染场景
            this.base.fboHelper.renderer.autoClear = false;
            this.base.fboHelper.renderer.setRenderTarget(e.toRenderTarget);
            this.base.fboHelper.renderer.render(this.scene, e.camera);

            // 恢复颜色状态
            this.base.fboHelper.setColorState(r);

            // 交换缓冲区
            e.swap();
        } else {
            // 调用父类渲染
            super.render(e, t);
        }
    }
}
