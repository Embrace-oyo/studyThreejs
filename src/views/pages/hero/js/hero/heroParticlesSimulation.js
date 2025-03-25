/**
 * justThreeJs heroParticlesSimulation.js
 * @author kongjianqiu
 * @description
 * @created 2025/3/24 10:54:04
 */
import * as THREE from "three";
import {Simple1DNoise} from "@/views/pages/hero/js/util/common.js";
// glsl
import fragment from '@/views/pages/hero/glsl/heroParticlesSimulation/fragment.glsl'

export default class HeroParticlesSimulation {
    SIM_TEXTURE_WIDTH = 128;
    SIM_TEXTURE_HEIGHT = 192;
    currPositionRenderTarget = null;
    prevPositionRenderTarget = null;
    ORIGIN = new THREE.Vector3(0, 8, 0);
    isPlaying = !0;
    isFirstSim = !0;
    noiseSpeed = .4;
    _noise = new Simple1DNoise;
    noiseScaleTime = Math.random();
    noiseStableFactorTime = Math.random();
    noiseStableFactor = Math.random();
    shaderUniforms = {
        u_simCurrPosLifeTexture: {value: null},
        u_simPrevPosLifeTexture: {value: null},
        u_simDefaultPosLifeTexture: {value: null},
        u_simTextureSize: {value: new THREE.Vector2(this.SIM_TEXTURE_WIDTH, this.SIM_TEXTURE_HEIGHT)},
        u_noiseStableFactor: {value: 0}
    };

    constructor(base) {
        this.base = base;
        this.math = base.math;
        this.fboHelper = base.fboHelper;
        this.heroLight = base.heroLight;
        this.currPositionRenderTarget = this.fboHelper.createRenderTarget(this.SIM_TEXTURE_WIDTH, this.SIM_TEXTURE_HEIGHT, !0, THREE.FloatType)
        this.prevPositionRenderTarget = this.currPositionRenderTarget.clone()
        this.positionMaterial = this.fboHelper.createRawShaderMaterial({
            uniforms: {
                u_lightPosition: this.heroLight.shaderUniforms.u_lightPosition,
                u_simPrevPosLifeTexture: this.shaderUniforms.u_simPrevPosLifeTexture,
                u_simDefaultPosLifeTexture: this.shaderUniforms.u_simDefaultPosLifeTexture,
                u_introDeltaTime: this.base.shaderUniforms.u_introDeltaTime,
                u_noiseTime: {value: 0},
                u_noiseScale: {value: 0},
                u_noiseStableFactor: this.shaderUniforms.u_noiseStableFactor
            },
            fragmentShader: fragment
        });
        let e = this.SIM_TEXTURE_WIDTH * this.SIM_TEXTURE_HEIGHT, t = new Float32Array(e * 4);
        for (let n = 0, a = 0; n < e; n++, a += 4) {
            let l = Math.random()
            let c = Math.random()
            let u = l * 2 * Math.PI
            let f = Math.acos(2 * c - 1)
            let p = .25 + Math.cbrt(Math.random()) * .5
            let g = Math.sin(u)
            let v = Math.cos(u)
            let y = Math.sin(f)
            let T = Math.cos(f);
            t[a + 0] = p * y * v
            t[a + 1] = p * y * g
            t[a + 2] = p * T
            t[a + 3] = n / e - 1
        }
        let r = this.shaderUniforms.u_simDefaultPosLifeTexture.value = this.fboHelper.createDataTexture(t, this.SIM_TEXTURE_WIDTH, this.SIM_TEXTURE_HEIGHT, !0, !0);
        this.fboHelper.copy(r, this.currPositionRenderTarget)
    }

    update(e) {
        if (this.isPlaying) {
            let t = this.currPositionRenderTarget;
            this.currPositionRenderTarget = this.prevPositionRenderTarget
            this.prevPositionRenderTarget = t
            this.shaderUniforms.u_simCurrPosLifeTexture.value = this.currPositionRenderTarget.texture
            this.shaderUniforms.u_simPrevPosLifeTexture.value = this.prevPositionRenderTarget.texture
            this.positionMaterial.uniforms.u_noiseTime.value += e * this.noiseSpeed
            this.noiseScaleTime += e;
            const r = this._noise.getFbm(this.noiseScaleTime, 3);
            this.positionMaterial.uniforms.u_noiseScale.value = 10 * Math.abs(r)
            this.noiseStableFactorTime += .5 * e
            this.noiseStableFactor += .05 * Math.abs(this._noise.getFbm(this.noiseStableFactorTime, 3))
            this.shaderUniforms.u_noiseStableFactor.value = this.math.fit(this.base.introRatio, 0, .4, 0, 1) * this.math.smoothstep(.9, .95, .5 + .5 * Math.sin(this.noiseStableFactor))
            this.fboHelper.render(this.positionMaterial, this.currPositionRenderTarget)
        }
    }

}
