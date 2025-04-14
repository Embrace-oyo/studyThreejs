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
        this.fboHelper.copy(readBuffer.texture, this.cacheRT)
        if (this.useMotionBlur) {
            this.useMotionBlur = !1
            this.material = this.motionBlurMaterial
            this.material.uniforms.u_blurRatio.value = this.motionBlurRatio
        } else {
            this.material = this.blurRatio > 0 ? this.blurMaterial : this.material
            this.material.uniforms.u_blurRatio.value = this.blurRatio
        }
        if (this.renderToScreen) {
            this.material.uniforms.u_texture.value = readBuffer.texture
            this.fboHelper.render(this.material, writeBuffer);
            let r = this.fboHelper.getColorState();
            this.fboHelper.renderer.autoClear = !1
            this.fboHelper.renderer.setRenderTarget(writeBuffer)
            this.fboHelper.renderer.render(this.scene, this.camera)
            this.fboHelper.setColorState(r)
        } else {
            this.material.uniforms.u_texture && (this.material.uniforms.u_texture.value = readBuffer.texture)
            this.fboHelper.render(this.material, this.renderToScreen ? null : writeBuffer)
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
