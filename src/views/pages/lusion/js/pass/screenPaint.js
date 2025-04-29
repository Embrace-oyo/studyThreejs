/**
 * justThreeJs screenPaint.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/23 17:08:32
 */
import * as THREE from "three";
// glsl
import frag from '@/views/pages/lusion/glsl/screenPaint/frag.glsl'

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
    drawEnabled = true;
    needsMouseDown = false;
    enabled = true;
    minRadius = 0;
    maxRadius = 100;
    radiusDistanceRange = 100;
    pushStrength = 25;
    accelerationDissipation = 0.8;
    velocityDissipation = 0.985;
    weight1Dissipation = 0.985;
    weight2Dissipation = 0.5;
    useNoise = false;
    curlScale = 0.1;
    curlStrength = 5;
    _prevUseNoise = null;

    shaderUniforms = {
        u_paintTexelSize: {value: new THREE.Vector2()},
        u_paintTextureSize: {value: new THREE.Vector2()},
        u_prevPaintTexture: {value: null},
        u_currPaintTexture: {value: null},
        u_lowPaintTexture: {value: null}
    };

    constructor(base) {
        this.base = base;
        this.math = base.math;
        this._v$4 = new THREE.Vector2;
    }

    init() {
        this._lowRenderTarget = this.base.fboHelper.createRenderTarget(1, 1);
        this._lowBlurRenderTarget = this.base.fboHelper.createRenderTarget(1, 1);
        this._prevPaintRenderTarget = this.base.fboHelper.createRenderTarget(1, 1);
        this._currPaintRenderTarget = this.base.fboHelper.createRenderTarget(1, 1);

        this.shaderUniforms.u_lowPaintTexture.value = this._lowRenderTarget.texture;

        this._material = this.base.fboHelper.createRawShaderMaterial({
            uniforms: {
                u_lowPaintTexture: {value: this._lowRenderTarget.texture},
                u_prevPaintTexture: this.shaderUniforms.u_prevPaintTexture,
                u_paintTexelSize: this.shaderUniforms.u_paintTexelSize,
                u_drawFrom: {value: this._fromDrawData = new THREE.Vector4(0, 0, 0, 0)},
                u_drawTo: {value: this._toDrawData = new THREE.Vector4(0, 0, 0, 0)},
                u_pushStrength: {value: 0},
                u_curlScale: {value: 0},
                u_curlStrength: {value: 0},
                u_vel: {value: new THREE.Vector2()},
                u_dissipations: {value: new THREE.Vector3()},
                u_scrollOffset: {value: new THREE.Vector2()}
            },
            fragmentShader: frag
        });
    }

    resize(e, t) {
        let r = e >> 2,
            n = t >> 2,
            a = e >> 3,
            l = t >> 3;

        if (r !== this._currPaintRenderTarget.width || n !== this._currPaintRenderTarget.height) {
            this._currPaintRenderTarget.setSize(r, n);
            this._prevPaintRenderTarget.setSize(r, n);
            this._lowRenderTarget.setSize(a, l);
            this._lowBlurRenderTarget.setSize(a, l);
            this.shaderUniforms.u_paintTexelSize.value.set(1 / r, 1 / n);
            this.shaderUniforms.u_paintTextureSize.value.set(r, n);
            this.clear();
        }
    }

    clear = () => {
        this.base.fboHelper.clearColor(0.5, 0.5, 0, 0, this._lowRenderTarget);
        this.base.fboHelper.clearColor(0.5, 0.5, 0, 0, this._lowBlurRenderTarget);
        this.base.fboHelper.clearColor(0.5, 0.5, 0, 0, this._currPaintRenderTarget);
        this._material.uniforms.u_vel.value.set(0, 0);
    };

    update(e) {
        if (!this.enabled) return;

        if (this.useNoise !== this._prevUseNoise) {
            this._material.defines.USE_NOISE = this.useNoise;
            this._material.needsUpdate = true;
            this._prevUseNoise = this.useNoise;
        }

        let t = this._currPaintRenderTarget.width,
            r = this._currPaintRenderTarget.height,
            n = this._prevPaintRenderTarget;

        this._prevPaintRenderTarget = this._currPaintRenderTarget;
        this._currPaintRenderTarget = n;

        this.shaderUniforms.u_prevPaintTexture.value = this._prevPaintRenderTarget.texture;
        this.shaderUniforms.u_currPaintTexture.value = this._currPaintRenderTarget.texture;

        let a = this.base.scrollManager.scrollViewDelta * this.base.properties.screenPaintOffsetRatio,
            l = this.base.scrollManager.isVertical ? 0 : a,
            c = this.base.scrollManager.isVertical ? a : 0;

        this._v$4.copy(this.base.input.mousePixelXY);
        this._v$4.x += l * this.base.properties.viewportWidth * 3;
        this._v$4.y += c * this.base.properties.viewportHeight * 3;
        let u = this._v$4.distanceTo(this.base.input.prevMousePixelXY)
        let f = this.math.fit(u, 0, this.radiusDistanceRange, this.minRadius, this.maxRadius);
        if (Math.abs(this.base.scrollManager.scrollViewDelta) == 0 && (
            !this.base.input.hadMoved ||
            !this.drawEnabled ||
            (this.needsMouseDown || this.base.browser.isMobile) && (!this.base.input.isDown || !this.base.input.wasDown)
        )) {
            f = 0;
        }

        f = f / this.base.properties.viewportHeight * r;

        this._material.uniforms.u_pushStrength.value = this.pushStrength;
        this._material.uniforms.u_curlScale.value = this.curlScale;
        this._material.uniforms.u_curlStrength.value = this.curlStrength;
        this._material.uniforms.u_dissipations.value.set(this.velocityDissipation, this.weight1Dissipation, this.weight2Dissipation);

        this._fromDrawData.copy(this._toDrawData);
        this._v$4.copy(this.base.input.mouseXY);
        this._v$4.x += l;
        this._v$4.y += c;

        this._toDrawData.set(
            (this._v$4.x + 1) * t / 2,
            (this._v$4.y + 1) * r / 2,
            f,
            1
        );

        this._v$4.set(this._toDrawData.x - this._fromDrawData.x, this._toDrawData.y - this._fromDrawData.y)
            .multiplyScalar(e * 0.8);

        this._material.uniforms.u_vel.value.multiplyScalar(this.accelerationDissipation).add(this._v$4);
        this._material.uniforms.u_scrollOffset.value.y = l;
        this._material.uniforms.u_scrollOffset.value.y = c;

        this.base.fboHelper.render(this._material, this._currPaintRenderTarget);
        this.base.fboHelper.copy(this._currPaintRenderTarget.texture, this._lowRenderTarget);
        this.base.blur.blur(8, 1, this._lowRenderTarget, this._lowBlurRenderTarget);
    }
}
