/**
 * justThreeJs goalTunnelEfx.js
 * @author kongjianqiu
 * @description
 * @created 2025/3/28 09:19:08
 */
import * as THREE from "three";
import {Pass} from 'three/addons/postprocessing/Pass.js';

// glsl

import fragment from '@/views/pages/hero/glsl/common/goalTunnelEfx/fragment.glsl'

export default class GoalTunnelEfxPass extends Pass {
    needsSync = !0;
    amount = 1;
    _position = null;
    _quaternion = null;
    _scale = null;
    _q = null;
    projectionMatrix = null;
    prevProjectionMatrix = null;
    projectionViewMatrix = null;
    prevProjectionViewMatrix = null;
    projectionViewInverseMatrix = null;
    offsetPostion = null;
    offsetRotation = null;
    offsetScale = null;
    isActive = !1;

    constructor(base) {
        super();
        this.base = base;
        this.fboHelper = base.fboHelper
        this.init();
    }

    init(e) {
        this._position = new THREE.Vector3
        this._quaternion = new THREE.Quaternion
        this._scale = new THREE.Vector3(1, 1, 1)
        this._q = new THREE.Quaternion
        this.offsetPostion = new THREE.Vector3(0, 0, 0)
        this.offsetRotation = new THREE.Euler(0, 0, 0)
        this.offsetScale = new THREE.Vector3(1, 1, 1)
        this.projectionViewMatrix = new THREE.Matrix4
        this.prevProjectionViewMatrix = new THREE.Matrix4
        this.projectionViewInverseMatrix = new THREE.Matrix4
        this.finalPrevMatrix = new THREE.Matrix4
        this.extraTransformMatrix = new THREE.Matrix4
        this.material = this.fboHelper.createRawShaderMaterial({
            uniforms: Object.assign({
                    u_time: this.base.commonUniforms.u_time,
                    u_texture: {value: null},
                    u_depthTexture: {value: null},
                    u_amount: {value: 1},
                    u_aspect: this.base.commonUniforms.u_aspect,
                    u_projectionViewInverseMatrix: {value: this.projectionViewInverseMatrix},
                    u_prevProjectionViewMatrix: {value: this.finalPrevMatrix}
                },
                this.base.blueNoise.shaderUniforms
            ),
            fragmentShader: fragment
        })
        this.depthTexture = new THREE.DepthTexture(this.base.width, this.base.height);
        this.depthTexture.type = THREE.UnsignedIntType
        this.depthTexture.minFilter = THREE.NearestFilter
        this.depthTexture.magFilter = THREE.NearestFilter
    }

    syncCamera(e) {
        this.needsSync = !0
        if (e) {
            e.matrixWorldInverse.decompose(this._position, this._quaternion, this._scale)
            this.projectionViewMatrix.multiplyMatrices(e.projectionMatrix, e.matrixWorldInverse)
            this.projectionViewInverseMatrix.copy(this.projectionViewMatrix).invert()
        }
        this.prevProjectionViewMatrix.copy(this.projectionViewMatrix)
    }

    render(renderer, writeBuffer, readBuffer) {
        let r = this.base.base.camera;
        // this.material.uniforms.u_depthTexture.value = this.depthTexture
        this.material.uniforms.u_amount.value = this.amount
        if (this.needsSync) {
            this.syncCamera(r)
            this.needsSync = !1
        } else {
            this.prevProjectionViewMatrix.copy(this.projectionViewMatrix)
        }
        this.projectionViewMatrix.multiplyMatrices(r.projectionMatrix, r.matrixWorldInverse)
        this.projectionViewInverseMatrix.copy(this.projectionViewMatrix).invert()
        this.extraTransformMatrix.compose(this.offsetPostion, this._q.setFromEuler(this.offsetRotation), this.offsetScale).invert()
        this.finalPrevMatrix.copy(this.prevProjectionViewMatrix)
        this.finalPrevMatrix.multiply(this.extraTransformMatrix)

        this.material.uniforms.u_texture.value = readBuffer.texture
        this.base.fboHelper.render(this.material, this.renderToScreen ? null : writeBuffer)
        // super.render(e, t)
    }
}
