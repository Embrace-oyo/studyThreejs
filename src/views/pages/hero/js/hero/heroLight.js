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
        let t = this.renderer
        let r = this.fboHelper.getColorState()
        let n = t.getRenderTarget();
        t.setRenderTarget(this.shadowRenderTarget)
        t.setClearColor(16777215, 1)
        t.clear()
        t.setRenderTarget(n)
        this.fboHelper.setColorState(r)
    }

    renderMesh(e) {
        let t = this.renderer
        let r = this.fboHelper.getColorState()
        let n = t.getRenderTarget();
        t.autoClearColor = !1
        this.fboHelper.renderMesh(e, this.shadowRenderTarget)
        t.setRenderTarget(n)
        this.fboHelper.setColorState(r)
    }

    postUpdate(e) {
        let t = this.renderer
        let r = this.fboHelper.getColorState()
        let n = t.getRenderTarget();
        // properties.gl
        t.autoClear = !1
        t.setRenderTarget(n)
        this.fboHelper.setColorState(r)
    }
}
