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
    colorBurn = new THREE.Color("#000");
    colorDodge = new THREE.Color("#000");
    hudRatio = 1;
    isActive = !0;
    renderOrder = 20;
    randSimplex1Ds = [];
    _sceneColorBurn = new THREE.Color("#00f0ff")
    _sceneColorDodge = new THREE.Color("#005aff")
    _sceneColorBurnAlpha = .15
    _sceneColorDodgeAlpha = .12
    _hudColorBurn = new THREE.Color("#79a8ff")
    _hudColorDodge = new THREE.Color("#a5ff44")
    _hudColorBurnAlpha = 1
    _hudColorDodgeAlpha = .7;

    constructor(base) {
        super();
        this.base = base;
        this.fboHelper = base.fboHelper;
        this.math = base.math;
        this.init();
    }

    init() {
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
    }


    render(renderer, writeBuffer, readBuffer) {
        let r = this.material.uniforms;
        this.colorBurn.copy(this._sceneColorBurn).lerp(this._hudColorBurn, this.hudRatio)
        this.colorDodge.copy(this._sceneColorDodge).lerp(this._hudColorDodge, this.hudRatio)
        r.u_colorBurnAlpha.value = this.math.mix(this._sceneColorBurnAlpha, this._hudColorBurnAlpha, this.hudRatio * this.hudRatio)
        r.u_colorDodgeAlpha.value = this.math.mix(this._sceneColorDodgeAlpha, this._hudColorDodgeAlpha, this.hudRatio * this.hudRatio)
        this.material.uniforms.u_texture && (this.material.uniforms.u_texture.value = readBuffer.texture)
        this.fboHelper.render(this.material, this.renderToScreen ? null : writeBuffer)
    }

    setSize() {
    }

    dispose() {

    }
}
