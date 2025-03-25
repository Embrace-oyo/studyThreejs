/**
 * justThreeJs heroLight.js
 * @author kongjianqiu
 * @description
 * @created 2025/3/24 10:29:46
 */
import * as THREE from "three";

export default class HeroLight {
    shadowMapSize = 1024;
    position = new THREE.Vector3(0, 8, 0);
    shadowRenderTarget = null;
    shaderUniforms = {
        u_lightPosition: {value: this.position},
        u_lightColor: {value: new THREE.Color("#000")},
        u_lightShadowMaxDistance: {value: 12},
        u_lightShadowTexture: {value: null},
        u_lightShadowTextureTexelSize: {value: new THREE.Vector2(1 / this.shadowMapSize, 1 / (this.shadowMapSize * 2))}
    };

    constructor(base) {
        this.base = base;
        this.fboHelper = this.base.fboHelper;
        this.renderer = this.base.renderer;
        this.shadowRenderTarget = this.fboHelper.createRenderTarget(this.shadowMapSize, this.shadowMapSize * 2, !0, THREE.HalfFloatType);
        let e = this.shaderUniforms.u_lightShadowTexture.value = this.shadowRenderTarget.texture;
        this.shadowRenderTarget.depthBuffer = !0
        e.format = THREE.RedFormat
    }

    update() {
        this.renderer.setRenderTarget(this.shadowRenderTarget)
        this.renderer.setClearColor(16777215, 1)
        this.renderer.clear()
        this.renderer.setRenderTarget(null)
        this.fboHelper.setColorState(this.fboHelper.getColorState())
    }

    renderMesh(e) {
        this.renderer.autoClearColor = !1
        this.fboHelper.renderMesh(e, this.shadowRenderTarget)
        this.renderer.setRenderTarget(this.renderer.getRenderTarget())
        this.fboHelper.setColorState(this.fboHelper.getColorState())
    }

    postUpdate(e) {
        // properties.gl
        this.renderer.autoClear = !1
        this.renderer.setRenderTarget(this.renderer.getRenderTarget())
        this.fboHelper.setColorState(this.fboHelper.getColorState())
    }
}
