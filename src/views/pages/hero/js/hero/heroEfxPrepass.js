/**
 * justThreeJs heroEfxPrepass.js
 * @author kongjianqiu
 * @description
 * @created 2025/3/21 17:30:39
 */
import * as THREE from "three";
import {Pass} from "three/addons/postprocessing/Pass.js";
// glsl
import fragment from '@/views/pages/hero/glsl/heroEfxPrvePass/fragment.glsl'
import motionBlurFragmentShader from '@/views/pages/hero/glsl/heroEfxPrvePass/motionBlurFragmentShader.glsl'
import blurFragmentShader from '@/views/pages/hero/glsl/heroEfxPrvePass/blurFragmentShader.glsl'

export default class HeroEfxPrevPass extends Pass {
    isActive = !0;
    cacheRT = null;
    motionBlurRatio = 1;
    motionRT;
    motionTmpRT;
    useMotionBlur = !1;
    blurRatio = 0;
    scene = new THREE.Scene;
    camera = new THREE.Camera;
    needsRenderScene = !0;
    renderOrder = 5;

    constructor(base) {
        super()
        this.base = base;
        this.width = this.base.width;
        this.height = this.base.height;
        this.fboHelper = this.base.fboHelper;
        this.cacheRT = this.fboHelper.createRenderTarget(1, 1)
        this.motionRT = this.fboHelper.createRenderTarget(1, 1)
        this.motionRT.depthBuffer = !0
        this.motionTmpRT = this.fboHelper.createRenderTarget(1, 1)
        this.material = this.fboHelper.createRawShaderMaterial({
            uniforms: Object.assign({
                u_texture: {
                    value: null
                },
                u_motionTexture: {
                    value: this.motionRT.texture
                },
                u_aspect: {
                    value: 1
                },
                u_blurRatio: {
                    value: 0
                }
            }, this.base.blueNoise.shaderUniforms),
            fragmentShader: fragment
        })
        this.motionBlurMaterial = this.fboHelper.createRawShaderMaterial({
            uniforms: this.material.uniforms,
            fragmentShader: motionBlurFragmentShader
        })
        this.blurMaterial = this.fboHelper.createRawShaderMaterial({
            uniforms: this.material.uniforms,
            fragmentShader: blurFragmentShader
        })
        this.setSize(this.width, this.height);
    }

    needsRender() {
        return this.isActive
    }

    setSize(width, height) {
        this.cacheRT.setSize(width, height)
        this.material.uniforms.u_aspect.value = width / height
    }

    renderMotion(e, t, r, n) {
        let a = this.base.renderer
        let l = this.fboHelper.getColorState()
        let c = a.getRenderTarget();
        this.motionRT.setSize(r, n)
        a.setRenderTarget(this.motionRT)
        a.setClearColor(8355711, 0)
        a.clear()
        this.fboHelper.renderMesh(e, this.motionRT, t)
        this.base.blur.blur(2, 1, this.motionRT, this.motionTmpRT, this.motionRT)
        a.setRenderTarget(c)
        this.fboHelper.setColorState(l)
        this.useMotionBlur = !0
    }

    render(renderer, writeBuffer, readBuffer) {
        this.fboHelper.copy(readBuffer, this.cacheRT);
        // 动态切换材质策略
        if (this.useMotionBlur) {
            // 运动模糊模式
            this.useMotionBlur = false;
            this.material = this.motionBlurMaterial;
            this.material.uniforms.u_blurRatio.value = this.motionBlurRatio;
        } else {
            // 根据模糊强度选择普通模糊/基础材质
            this.material = this.blurRatio > 0 ? this.blurMaterial : this.material;
            this.material.uniforms.u_blurRatio.value = this.blurRatio;
        }
        this.material.uniforms.u_texture.value = readBuffer.texture
        // 场景合成渲染分支
        if (this.renderToScreen) {
            // 设置输入纹理并执行后处理渲染
            this.fboHelper.render(this.material, writeBuffer);

            // 保存当前渲染状态
            const colorState = this.fboHelper.getColorState();

            // 配置叠加场景渲染
            this.fboHelper.renderer.autoClear = false;
            this.fboHelper.renderer.setRenderTarget(writeBuffer);

            // 渲染附加3D场景内容
            this.fboHelper.renderer.render(this.scene, this.camera);

            // 恢复原始渲染状态
            this.fboHelper.setColorState(colorState);

        } else {
            // 基础渲染路径
            this.fboHelper.render(this.material, writeBuffer)
        }
    }

    dispose() {
        this.cacheRT.dispose();
        this.motionRT.dispose();
        this.motionTmpRT.dispose();
        this.material.dispose();
        this.motionBlurMaterial.dispose();
        this.blurMaterial.dispose();
    }
}
