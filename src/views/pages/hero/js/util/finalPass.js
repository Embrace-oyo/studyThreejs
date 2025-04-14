/**
 * justThreeJs finalPass.js
 * @author kongjianqiu
 * @description
 * @created 2025/3/27 16:54:45
 */
import * as THREE from "three";
import {Pass} from 'three/addons/postprocessing/Pass.js';
//glsl
import fragment from '@/views/pages/hero/glsl/common/final/fragment.glsl'

export default class FinalPass extends Pass {
    vignetteFrom = .6;
    vignetteTo = 1.6;
    vignetteAspect = new THREE.Vector2;
    vignetteColor = new THREE.Color;
    saturation = 1;
    contrast = 0;
    brightness = 1;
    tintColor = new THREE.Color;
    tintOpacity = 1;
    bgColor = new THREE.Color;
    opacity = 1;
    isActive = !1;
    renderOrder = 30;

    constructor(base) {
        super();
        this.base = base;
        this.fboHelper = base.fboHelper;
        this.init();
    }

    init() {
        this.material = this.fboHelper.createRawShaderMaterial({
            uniforms: {
                u_texture: {value: null},
                u_vignetteFrom: {value: 0},
                u_vignetteTo: {value: 0},
                u_vignetteAspect: {value: this.vignetteAspect},
                u_vignetteColor: {value: this.vignetteColor},
                u_saturation: {value: 0},
                u_contrast: {value: 0},
                u_brightness: {value: 0},
                u_tintColor: {value: this.tintColor},
                u_tintOpacity: {value: 0},
                u_bgColor: {value: this.bgColor},
                u_opacity: {value: 0},
                u_ditherSeed: {value: 0}
            },
            fragmentShader: fragment
        })
    }


    render(renderer, writeBuffer, readBuffer) {
        const r = this.base.width
        const n = this.base.height;
        let a = this.material.uniforms;
        a.u_vignetteFrom.value = this.vignetteFrom
        a.u_vignetteTo.value = this.vignetteTo;
        const l = n / Math.sqrt(r * r + n * n);
        this.vignetteAspect.set(r / n * l, l)
        a.u_saturation.value = this.saturation - 1
        a.u_contrast.value = this.contrast
        a.u_brightness.value = this.brightness - 1
        a.u_tintOpacity.value = this.tintOpacity
        a.u_opacity.value = this.opacity
        a.u_ditherSeed.value = Math.random() * 1e3
        this.material.uniforms.u_texture.value = readBuffer.texture
        this.base.fboHelper.render(this.material, this.renderToScreen ? null : writeBuffer)

        this.base.base.composer.swapBuffers()
        // super.render(e, t)
    }
}
