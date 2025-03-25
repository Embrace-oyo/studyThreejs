/**
 * justThreeJs heroEfxPass.js
 * @author kongjianqiu
 * @description
 * @created 2025/3/24 09:38:05
 */

import * as THREE from "three";
import {Pass, FullScreenQuad} from 'three/addons/postprocessing/Pass.js';

//glsl
import fragment from '@/views/pages/hero/glsl/heroEfxPass/fragment.glsl'

export default class HeroEfxPass extends Pass {

    colorBurn = new THREE.Color("#000000");
    colorDodge = new THREE.Color("#000000");
    sceneColorBurn = new THREE.Color('#00f0ff')
    sceneColorDodge = new THREE.Color('#005aff')
    hudColorBurn = new THREE.Color("#79a8ff")
    hudColorDodge = new THREE.Color("#a5ff44")
    sceneColorBurnAlpha = 0.15
    sceneColorDodgeAlpha = 0.12
    hudColorBurnAlpha = 1
    hudColorDodgeAlpha = 0.7
    hudRatio = 1;
    isActive = !0;
    renderOrder = 20;

    constructor(base) {
        super();
        this.base = base;
        this.math = this.base.math;
        this.fboHelper = this.base.fboHelper;
        this.fsQuad = new FullScreenQuad(null);
        this.material = this.fboHelper.createRawShaderMaterial({
            uniforms: {
                u_texture: {value: null},
                u_colorBurn: {value: this.colorBurn},
                u_colorBurnAlpha: {value: 1},
                u_colorDodge: {value: this.colorDodge},
                u_colorDodgeAlpha: {value: 1}
            },
            fragmentShader: fragment
        })
        this.fsQuad.material = this.material;
    }

    setSize(width, height) {

    }

    dispose() {
        this.material.dispose();
        this.fsQuad.dispose();
    }

    render(renderer, writeBuffer, readBuffer) {
        let r = this.material.uniforms;
        this.colorBurn.copy(this.sceneColorBurn).lerp(this.hudColorBurn, this.hudRatio)
        this.colorDodge.copy(this.sceneColorDodge).lerp(this.hudColorDodge, this.hudRatio)
        r.u_colorBurnAlpha.value = this.math.mix(this.sceneColorBurnAlpha, this.hudColorBurnAlpha, this.hudRatio * this.hudRatio)
        r.u_colorDodgeAlpha.value = this.math.mix(this.sceneColorDodgeAlpha, this.hudColorDodgeAlpha, this.hudRatio * this.hudRatio)
        this.material.uniforms.u_texture.value = readBuffer.texture;


        if (this.renderToScreen) {
            renderer.setRenderTarget(null);

        } else {
            renderer.setRenderTarget(writeBuffer);
            if (this.clear) renderer.clear();
        }

        this.fsQuad.render(renderer)

    }
}
