/**
 * justThreeJs fsr.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/24 10:12:18
 */
import * as THREE from "three";
import PostEffect from '@/views/pages/lusion/js/pass/postEffect'
// glsl
import easuFrag from '@/views/pages/lusion/glsl/fsr/easuFrag.glsl'
import frag from '@/views/pages/lusion/glsl/fsr/frag.glsl'

class FsrRender {
    // 当前锐化强度（通常 0~1）
    sharpness = 1;

    // EASU 材质（边缘自适应空间放大）
    _easuMaterial;

    // RCAS 材质（对比度自适应锐化）
    _material;

    // 输入分辨率（原始图像分辨率）
    _inResolution = new THREE.Vector2;

    // 输出分辨率（目标图像分辨率）
    _outResolution = new THREE.Vector2;

    // 中间缓存帧缓冲对象
    _cacheRenderTarget = null;

    constructor(base) {
        this.base = base
        // 创建一个初始为 1x1 的中间帧缓冲对象
        this._cacheRenderTarget = this.base.fboHelper.createRenderTarget(1, 1);

        // 创建 EASU 材质，用于第一次 pass 放大处理
        this._easuMaterial = this.base.fboHelper.createRawShaderMaterial({
            uniforms: {
                u_texture: { value: null },
                u_inResolution: { value: this._inResolution },
                u_outResolution: { value: this._outResolution }
            },
            fragmentShader: easuFrag // 第一阶段着色器（放大）
        });

        // 创建 RCAS 材质，用于第二次 pass 锐化处理
        this._material = this.base.fboHelper.createRawShaderMaterial({
            uniforms: {
                u_texture: { value: this._cacheRenderTarget.texture }, // 使用放大后的图像
                u_outResolution: this._easuMaterial.uniforms.u_outResolution, // 与放大一致
                u_sharpness: { value: 0 } // 动态设定锐化强度
            },
            fragmentShader: frag // 第二阶段着色器（锐化）
        });
    }

    // 渲染方法：输入 e 为原始图像，t 为输出帧缓冲
    render(e, t) {
        // 获取输入纹理分辨率
        let r = e.image.width,
            n = e.image.height;

        // 设置锐化强度
        this._material.uniforms.u_sharpness.value = this.sharpness;

        // 更新输入分辨率缓存
        if (this._inResolution.width !== r || this._inResolution.height !== n)
            this._inResolution.set(r, n);

        // 获取输出尺寸（可能是屏幕，也可能是指定的 render target）
        let a, l;
        if (t) {
            a = t.width;
            l = t.height;
        } else {
            a = this.base.fboHelper.renderer.domElement.width;
            l = this.base.fboHelper.renderer.domElement.height;
        }

        // 更新输出分辨率缓存和帧缓冲尺寸
        if (this._outResolution.width !== a || this._outResolution.height !== l) {
            this._outResolution.set(a, l);
            this._cacheRenderTarget.setSize(a, l);
        }

        // 第一阶段：使用 EASU 对输入纹理放大，结果存入中间缓存
        this._easuMaterial.uniforms.u_texture.value = e;
        this.base.fboHelper.render(this._easuMaterial, this._cacheRenderTarget);

        // 第二阶段：对中间图像进行锐化，并输出到最终目标
        if (!t) {
            this.base.fboHelper.renderer.setRenderTarget(null); // 渲染到屏幕
            this.base.fboHelper.renderer.setViewport(0, 0, this._outResolution.x, this._outResolution.y);
        }

        this.base.fboHelper.render(this._material, t);
    }
};


export default class Fsr extends PostEffect {
    // 锐化程度，范围通常在 0（无锐化）到 1（最大锐化）之间
    sharpness = 1;

    // FSR 引擎对象，负责实际的渲染操作
    fsr;

    // 设置渲染顺序，确保比其他 Pass 更晚执行
    renderOrder = 2000;
    constructor(base) {
        super(base);
        this.base = base;
    }
    init(e) {
        // 允许外部传参覆盖属性
        Object.assign(this, e);

        // 调用父类初始化
        super.init();

        // 初始化 FSR 实例
        this.fsr = new FsrRender(this.base); // 你系统里的 FSR 实现对象（封装了 FSR 着色器和流程）
    }

    // 渲染逻辑，e 是当前帧的渲染上下文（fromTexture、toRenderTarget、swap() 等）
    render(e, t = false) {
        // 设置当前锐化程度
        this.fsr.sharpness = this.sharpness;

        // 执行渲染（从 fromTexture 渲染到目标帧缓冲，如果 t 为 true，则不写入 toRenderTarget）
        this.fsr.render(
            e.fromTexture,
            t ? null : e.toRenderTarget
        );

        // 交换 read/write buffer
        e.swap();
    }
}
