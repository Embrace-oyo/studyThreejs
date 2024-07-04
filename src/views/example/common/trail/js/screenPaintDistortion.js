/**
 * justThreeJs screenPaintDistortion.js
 * @author kongjianqiu
 * @description
 * @created 2024/7/4 14:34:57
 */
import * as THREE from "three";
import screenPaint from '@/views/example/common/trail/glsl/screenPaint.glsl'

class PostEffect {
    constructor(base) {
        this.base = base
    }

    sharedUniforms = {};
    enabled = !0;
    material = null;
    renderOrder = 0;
    _hasShownWarning = !1;

    init(e) {
        Object.assign(this, e)
    }

    needsRender() {
        return !0
    }

    warn(e) {
        if (!this._hasShownWarning) {
            console.warn(e)
            this._hasShownWarning = !0
        }
    }

    setPostprocessing(e) {
    }

    render(e, t = !1) {
        if (this.material.uniforms.u_texture) {
            this.material.uniforms.u_texture.value = e.fromTexture
        }
        this.base.fboHelper.render(this.material, t ? null : e.toRenderTarget)
        e.swap()
    }
}

export default class ScreenPaintDistortion extends PostEffect {
    screenPaint = null;
    amount = 20;
    rgbShift = 1;
    multiplier = 1.25;
    colorMultiplier = 1;
    shade = 1.25;
    renderOrder = 75;

    constructor(base) {
        super(base);
        this.base = base;
    }

    init(e) {
        Object.assign(this, e)
        super.init()
        if (!this.screenPaint) throw new Error("screenPaint is required")
        this.material = this.base.fboHelper.createRawShaderMaterial({
            uniforms: Object.assign({
                u_texture: {value: null},
                u_screenPaintTexture: this.screenPaint.sharedUniforms.u_currPaintTexture,
                u_screenPaintTexelSize: this.screenPaint.sharedUniforms.u_paintTexelSize,
                u_amount: {value: 0},
                u_rgbShift: {value: 0},
                u_multiplier: {value: 0},
                u_colorMultiplier: {value: 0},
                u_shade: {value: 0}
            }, this.base.blueNoiseUniforms),
            fragmentShader: screenPaint
        })
    }

    needsRender(e) {
        return this.amount > 0
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

    render(e, t = !1) {
        this.material.uniforms.u_amount.value = this.amount
        this.material.uniforms.u_rgbShift.value = this.rgbShift
        this.material.uniforms.u_multiplier.value = this.multiplier
        this.material.uniforms.u_colorMultiplier.value = this.colorMultiplier
        this.material.uniforms.u_shade.value = this.shade
        super.render(e, t)
    }
}
