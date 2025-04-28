/**
 * justThreeJs textureHelper.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/23 16:46:23
 */
import * as THREE from "three";

// glsl
import channelMixerFrag from '@/views/pages/lusion/glsl/textureHelper/channelMixerFrag.glsl'

export default class TextureHelper {
    blackTexture;
    whiteTexture;
    transparentTexture;
    channelMixerMaterial;
    constructor(base) {
        this.base = base;
    }
    init() {
        this.blackTexture = this._createPixelTexture([0, 0, 0, 255]);
        this.whiteTexture = this._createPixelTexture([255, 255, 255, 255]);
        this.transparentTexture = this._createPixelTexture([0, 0, 0, 0]);
    }

    _createPixelTexture(e) {
        return this.base.fboHelper.createDataTexture(new Uint8Array(e), 1, 1, false, true);
    }

    mixChannels(e, t, r = -1, n = -1, a = -1, l = -1) {
        if (!this.channelMixerMaterial) {
            this.channelMixerMaterial = this.base.fboHelper.createRawShaderMaterial({
                uniforms: {
                    u_texture: { value: null },
                    u_channelMixerR: { value: new THREE.Vector4() },
                    u_channelMixerG: { value: new THREE.Vector4() },
                    u_channelMixerB: { value: new THREE.Vector4() },
                    u_channelMixerA: { value: new THREE.Vector4() },
                },
                vertexShader: this.base.fboHelper.vertexShader,
                fragmentShader: this.base.fboHelper.precisionPrefix + channelMixerFrag,
                blending: THREE.CustomBlending,
                blendEquation: THREE.AddEquation,
                blendDst: THREE.OneFactor,
                blendSrc: THREE.OneFactor,
                blendEquationAlpha: THREE.AddEquation,
                blendDstAlpha: THREE.OneFactor,
                blendSrcAlpha: THREE.OneFactor,
            });
        }

        this.channelMixerMaterial.uniforms.u_texture.value = e;

        this.channelMixerMaterial.uniforms.u_channelMixerR.value
            .set(+(r % 4 === 0), +(r % 4 === 1), +(r % 4 === 2), +(r % 4 === 3))
            .multiplyScalar(r < 0 ? 0 : 1);

        this.channelMixerMaterial.uniforms.u_channelMixerG.value
            .set(+(n % 4 === 0), +(n % 4 === 1), +(n % 4 === 2), +(n % 4 === 3))
            .multiplyScalar(n < 0 ? 0 : 1);

        this.channelMixerMaterial.uniforms.u_channelMixerB.value
            .set(+(a % 4 === 0), +(a % 4 === 1), +(a % 4 === 2), +(a % 4 === 3))
            .multiplyScalar(a < 0 ? 0 : 1);

        this.channelMixerMaterial.uniforms.u_channelMixerA.value
            .set(+(l % 4 === 0), +(l % 4 === 1), +(l % 4 === 2), +(l % 4 === 3))
            .multiplyScalar(l < 0 ? 0 : 1);

        let c = this.base.fboHelper.getColorState();
        this.base.fboHelper.renderer.autoClear = false;
        this.base.fboHelper.render(this.channelMixerMaterial, t);
        this.base.fboHelper.setColorState(c);
    }
}
