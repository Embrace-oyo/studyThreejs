/**
 * justThreeJs goalTunnelEfx.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/27 12:36:42
 */

import * as THREE from "three";
import PostEffect from '@/views/pages/lusion/js/pass/postEffect'
// glsl
import fragmentShader$4 from '@/views/pages/lusion/glsl/about/fragmentShader$4.glsl'
class GoalTunnelEfx extends PostEffect {
    needsSync = true;
    amount = 1;
    isActive = false;

    _position = null;
    _quaternion = null;
    _scale = null;
    _q = null;

    projectionMatrix = null;
    prevProjectionMatrix = null;
    projectionViewMatrix = null;
    prevProjectionViewMatrix = null;
    projectionViewInverseMatrix = null;
    finalPrevMatrix = null;
    extraTransformMatrix = null;

    offsetPostion = null;
    offsetRotation = null;
    offsetScale = null;

    constructor(base) {
        super(base);
        this.base = base;
    }

    init(e) {
        Object.assign(this, e);
        super.init();

        // 初始化变换相关
        this._position = new THREE.Vector3();
        this._quaternion = new THREE.Quaternion();
        this._scale = new THREE.Vector3(1, 1, 1);
        this._q = new THREE.Quaternion();

        this.offsetPostion = new THREE.Vector3(0, 0, 0);
        this.offsetRotation = new THREE.Euler(0, 0, 0);
        this.offsetScale = new THREE.Vector3(1, 1, 1);

        // 初始化矩阵
        this.projectionViewMatrix = new THREE.Matrix4();
        this.prevProjectionViewMatrix = new THREE.Matrix4();
        this.projectionViewInverseMatrix = new THREE.Matrix4();
        this.finalPrevMatrix = new THREE.Matrix4();
        this.extraTransformMatrix = new THREE.Matrix4();

        // 创建材质
        this.material = this.base.fboHelper.createRawShaderMaterial({
            uniforms: Object.assign({
                u_time: this.base.properties.shaderUniforms.u_time,
                u_texture: { value: null },
                u_depthTexture: { value: null },
                u_amount: { value: 1 },
                u_aspect: this.base.properties.postprocessing.shaderUniforms.u_aspect,
                u_projectionViewInverseMatrix: { value: this.projectionViewInverseMatrix },
                u_prevProjectionViewMatrix: { value: this.finalPrevMatrix }
            }, this.base.blueNoise.shaderUniforms),
            fragmentShader: fragmentShader$4
        });
    }

    needsRender(e) {
        const shouldRender = this.amount > 0;
        this.needsSync = !shouldRender;
        return shouldRender && this.isActive;
    }

    syncCamera(camera) {
        this.needsSync = true;
        if (camera) {
            camera.matrixWorldInverse.decompose(this._position, this._quaternion, this._scale);
            this.projectionViewMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
            this.projectionViewInverseMatrix.copy(this.projectionViewMatrix).invert();
        }
        this.prevProjectionViewMatrix.copy(this.projectionViewMatrix);
    }

    render(e, t = false) {
        const camera = e.camera;

        this.material.uniforms.u_depthTexture = e.shaderUniforms.u_sceneDepthTexture;
        this.material.uniforms.u_amount.value = this.amount;

        if (this.needsSync || e.hasSizeChanged) {
            this.syncCamera(camera);
            this.needsSync = false;
        } else {
            this.prevProjectionViewMatrix.copy(this.projectionViewMatrix);
        }

        this.projectionViewMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
        this.projectionViewInverseMatrix.copy(this.projectionViewMatrix).invert();

        this.extraTransformMatrix.compose(
            this.offsetPostion,
            this._q.setFromEuler(this.offsetRotation),
            this.offsetScale
        ).invert();

        this.finalPrevMatrix.copy(this.prevProjectionViewMatrix);
        this.finalPrevMatrix.multiply(this.extraTransformMatrix);

        super.render(e, t);
    }
}
