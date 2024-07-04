/**
 * justThreeJs screenPaint.js
 * @author kongjianqiu
 * @description
 * @created 2024/7/4 14:35:23
 */

import * as THREE from "three";
import screenPaint2 from '@/views/example/common/trail/glsl/screenPaint2.glsl'


export default class ScreenPaint {
    _lowRenderTarget;
    _lowBlurRenderTarget;
    _prevPaintRenderTarget;
    _currPaintRenderTarget;
    _material;
    _material2;
    _distortionMaterial;
    _fromDrawData;
    _toDrawData;
    drawEnabled = !0;
    needsMouseDown = !1;
    enabled = !0;
    minRadius = 0;
    maxRadius = 100;
    radiusDistanceRange = 100;
    pushStrength = 25;
    accelerationDissipation = .8;
    velocityDissipation = .985;
    weight1Dissipation = .985;
    weight2Dissipation = .5;
    useNoise = !1;
    curlScale = .1;
    curlStrength = 5;
    _prevUseNoise = null;
    sharedUniforms = {
        u_paintTexelSize: {value: new THREE.Vector2},
        u_paintTextureSize: {value: new THREE.Vector2},
        u_prevPaintTexture: {value: null},
        u_currPaintTexture: {value: null},
        u_lowPaintTexture: {value: null}
    };

    constructor(base) {
        this.base = base
    }

    init() {
        this._lowRenderTarget = this.base.fboHelper.createRenderTarget(1, 1)
        this._lowBlurRenderTarget = this.base.fboHelper.createRenderTarget(1, 1)
        this._prevPaintRenderTarget = this.base.fboHelper.createRenderTarget(1, 1)
        this._currPaintRenderTarget = this.base.fboHelper.createRenderTarget(1, 1)
        this.sharedUniforms.u_lowPaintTexture.value = this._lowRenderTarget.texture
        this._material = this.base.fboHelper.createRawShaderMaterial({
            uniforms: {
                u_lowPaintTexture: {value: this._lowRenderTarget.texture},
                u_prevPaintTexture: this.sharedUniforms.u_prevPaintTexture,
                u_paintTexelSize: this.sharedUniforms.u_paintTexelSize,
                u_drawFrom: {value: this._fromDrawData = new THREE.Vector4(0, 0, 0, 0)},
                u_drawTo: {value: this._toDrawData = new THREE.Vector4(0, 0, 0, 0)},
                u_pushStrength: {value: 0},
                u_curlScale: {value: 0},
                u_curlStrength: {value: 0},
                u_vel: {value: new THREE.Vector2},
                u_dissipations: {value: new THREE.Vector3},
                u_scrollOffset: {value: new THREE.Vector2}
            }, fragmentShader: screenPaint2
        })
    }

    resize(e, t) {
        let r = e >> 2
        let n = t >> 2
        let o = e >> 3
        let l = t >> 3;

        if (r !== this._currPaintRenderTarget.width || n !== this._currPaintRenderTarget.height) {
            this._currPaintRenderTarget.setSize(r, n)
            this._prevPaintRenderTarget.setSize(r, n)
            this._lowRenderTarget.setSize(o, l)
            this._lowBlurRenderTarget.setSize(o, l)
            this.sharedUniforms.u_paintTexelSize.value.set(1 / r, 1 / n)
            this.sharedUniforms.u_paintTextureSize.value.set(r, n)
            this.clear()
        }
    }

    clear = () => {
        this.base.fboHelper.clearColor(.5, .5, 0, 0, this._lowRenderTarget)
        this.base.fboHelper.clearColor(.5, .5, 0, 0, this._lowBlurRenderTarget)
        this.base.fboHelper.clearColor(.5, .5, 0, 0, this._currPaintRenderTarget)
        this._material.uniforms.u_vel.value.set(0, 0)
    };

    update(e) {
        if (!this.enabled) return;
        if (this.useNoise !== this._prevUseNoise) {
            this._material.defines.USE_NOISE = this.useNoise
            this._material.needsUpdate = !0
            this._prevUseNoise = this.useNoise
        }


        let t = this._currPaintRenderTarget.width
        let r = this._currPaintRenderTarget.height
        let n = this._prevPaintRenderTarget


        this._prevPaintRenderTarget = this._currPaintRenderTarget
        this._currPaintRenderTarget = n
        this.sharedUniforms.u_prevPaintTexture.value = this._prevPaintRenderTarget.texture
        this.sharedUniforms.u_currPaintTexture.value = this._currPaintRenderTarget.texture;
        let _v$4 = new THREE.Vector2;


        let o = 0
        let l = 0
        let c = o;


        _v$4.copy(this.base.mousePixelXY)
        _v$4.x += l * this.base.width * 3
        _v$4.y += c * this.base.height * 3;
        let u = _v$4.distanceTo(this.base.prevMousePixelXY)
        let math = THREE.MathUtils
        let cUnMix = (e, t, r) => math.clamp((r - e) / (t - e), 0, 1)
        let fit = (e, t, r, n, o, l) => {
            e = cUnMix(t, r, e);
            if (l) e = l(e)
            return n + e * (o - n)
        }
        let f = fit(u, 0, this.radiusDistanceRange, this.minRadius, this.maxRadius);


        let scrollViewDelta = 0;
        let hadMoved = !1;
        let isMobile = !1;
        let isDown = !1;
        let wasDown = !1;
        if (Math.abs(scrollViewDelta) === 0 && (!hadMoved || !this.drawEnabled || (this.needsMouseDown || isMobile) && (!isDown && !wasDown))) f = 0
        f = f / this.base.height * r;


        this._material.uniforms.u_pushStrength.value = this.pushStrength
        this._material.uniforms.u_curlScale.value = this.curlScale
        this._material.uniforms.u_curlStrength.value = this.curlStrength
        this._material.uniforms.u_dissipations.value.set(this.velocityDissipation, this.weight1Dissipation, this.weight2Dissipation)
        this._fromDrawData.copy(this._toDrawData)

        _v$4.copy(this.base.mouseXY)
        _v$4.x += l
        _v$4.y += c
        this._toDrawData.set((_v$4.x + 1) * t / 2, (_v$4.y + 1) * r / 2, f, 1)
        _v$4.set(this._toDrawData.x - this._fromDrawData.x, this._toDrawData.y - this._fromDrawData.y).multiplyScalar(e * .8)
        this._material.uniforms.u_vel.value.multiplyScalar(this.accelerationDissipation).add(_v$4)

        this._material.uniforms.u_scrollOffset.value.y = l
        this._material.uniforms.u_scrollOffset.value.y = c

        this.base.fboHelper.render(this._material, this._currPaintRenderTarget)
        this.base.fboHelper.copy(this._currPaintRenderTarget.texture, this._lowRenderTarget)

        this.base.blur.blur(8, 1, this._lowRenderTarget, this._lowBlurRenderTarget)
    }
}
