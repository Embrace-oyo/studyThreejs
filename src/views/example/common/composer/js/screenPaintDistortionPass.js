/**
 * justThreeJs screenPaintDistortionPass.js
 * @author kongjianqiu
 * @description
 * @created 2024/7/9 12:42:06
 */
import * as THREE from "three";
import {FullScreenQuad, Pass} from "three/addons/postprocessing/Pass.js";
import beforeVert from '@/views/example/common/composer/glsl/beforeVert.glsl'
import beforeFrag from '@/views/example/common/composer/glsl/beforeFrag.glsl'
import copyVert from "@/views/example/common/composer/glsl/copyVert.glsl";
import copyFrag from "@/views/example/common/composer/glsl/copyFrag.glsl";
import blurVert from "@/views/example/common/composer/glsl/blurVert.glsl";
import blurFrag from "@/views/example/common/composer/glsl/blurFrag.glsl";
import clearFrag from "@/views/example/common/composer/glsl/clearFrag.glsl";


let _v$4 = new THREE.Vector2;
let math = THREE.MathUtils

function cUnMix(e, t, r) {
    return math.clamp((r - e) / (t - e), 0, 1)
}

function fit(e, t, r, n, o, l) {
    e = cUnMix(t, r, e)
    l && (e = l(e))
    return n + e * (o - n)
}

class ScreenPaintDistortion extends Pass {
    deltaXY = new THREE.Vector2;
    mouseXY = new THREE.Vector2;
    mousePixelXY = new THREE.Vector2;
    prevMousePixelXY = new THREE.Vector2;
    _prevMouseXY = new THREE.Vector2;
    hadMoved = !1;
    hasMoved = !1;
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

    constructor(width, height, renderer) {
        super();
        this.renderer = renderer;
        this.width = width;
        this.height = height;
        this.dateTime = performance.now()
        this.dom = renderer.domElement;
        this.dom.addEventListener('mousemove', (e) => {
            this.mouseXY.set(e.offsetX / width * 2 - 1, 1 - e.offsetY / height * 2)
            this.mousePixelXY.set(e.offsetX, e.offsetY)
            this.deltaXY.copy(this.mouseXY).sub(this._prevMouseXY)
            this._prevMouseXY.copy(this.mouseXY)
            this.hasMoved = this.deltaXY.length() > 0
        })
        this.fsQuad = new FullScreenQuad(null);
        this.RTInit(width, height)
        this.materialInit()
        this.textureInit()
    }

    RTInit(width, height) {
        let r = width >> 2
        let n = height >> 2
        let o = width >> 3
        let l = height >> 3;
        this._lowRenderTarget = this.createRenderTarget(o, l)
        this._lowBlurRenderTarget = this.createRenderTarget(o, l)
        this._prevPaintRenderTarget = this.createRenderTarget(r, n)
        this._currPaintRenderTarget = this.createRenderTarget(r, n)
        this.sharedUniforms.u_paintTexelSize.value.set(1 / r, 1 / n)
        this.sharedUniforms.u_paintTextureSize.value.set(r, n)
    }

    textureInit() {
        this.u_lowPaintTexture = this._lowRenderTarget.texture
    }

    materialInit() {
        this.beforeMaterial = new THREE.RawShaderMaterial({
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
            },
            vertexShader: beforeVert,
            fragmentShader: beforeFrag,
        })

        this.clearMaterial = new THREE.RawShaderMaterial({
            uniforms: {u_color: {value: new THREE.Vector4(1, 1, 1, 1)}},
            vertexShader: copyVert,
            fragmentShader: clearFrag,
            depthTest: !1,
            depthWrite: !1,
            blending: THREE.NoBlending
        })

        this.copyMaterial = new THREE.RawShaderMaterial({
            uniforms: {u_texture: {value: null}},
            vertexShader: copyVert,
            fragmentShader: copyFrag,
            depthTest: !1,
            depthWrite: !1,
            blending: THREE.NoBlending
        })

        this.blurMaterial = new THREE.RawShaderMaterial({
            uniforms: {
                u_texture: {value: null},
                u_delta: {value: new THREE.Vector2}
            },
            vertexShader: blurVert,
            fragmentShader: blurFrag,
            depthWrite: !1,
            depthTest: !1
        })
        this.clearInit()
    }

    clearInit() {
        this.clearMaterial.uniforms.u_color.value.set(.5, .5, 0, 0)
        this.fsQuad.material = this.clearMaterial;

        this.renderer.setRenderTarget(this._lowRenderTarget);
        if (this.clear) this.renderer.clear();
        this.fsQuad.render(this.renderer);

        this.renderer.setRenderTarget(this._lowBlurRenderTarget);
        if (this.clear) this.renderer.clear();
        this.fsQuad.render(this.renderer);

        this.renderer.setRenderTarget(this._currPaintRenderTarget);
        if (this.clear) this.renderer.clear();
        this.fsQuad.render(this.renderer);
    }
    beforeRender(renderer, writeBuffer, readBuffer) {
        if (!this.enabled) return;
        if (this.useNoise !== this._prevUseNoise) {
            this.beforeMaterial.defines.USE_NOISE = this.useNoise
            this.beforeMaterial.needsUpdate = !0
            this._prevUseNoise = this.useNoise
        }
        let t = this._currPaintRenderTarget.width
        let r = this._currPaintRenderTarget.height

        this._prevPaintRenderTarget = readBuffer

        let n = this._prevPaintRenderTarget;
        this._prevPaintRenderTarget = this._currPaintRenderTarget = writeBuffer


        this._currPaintRenderTarget = n
        this.sharedUniforms.u_prevPaintTexture.value = this._prevPaintRenderTarget.texture
        this.sharedUniforms.u_currPaintTexture.value = this._currPaintRenderTarget.texture;


        let l = 0;
        let c = 0;
        _v$4.copy(this.mousePixelXY)
        _v$4.x += l * this.width * 3
        _v$4.y += c * this.height * 3;
        let u = _v$4.distanceTo(this.prevMousePixelXY)
        let f = fit(u, 0, this.radiusDistanceRange, this.minRadius, this.maxRadius);
        if (!this.hadMoved || !this.drawEnabled) f = 0
        f = f / this.width * r
        this.beforeMaterial.uniforms.u_pushStrength.value = this.pushStrength
        this.beforeMaterial.uniforms.u_curlScale.value = this.curlScale
        this.beforeMaterial.uniforms.u_curlStrength.value = this.curlStrength
        this.beforeMaterial.uniforms.u_dissipations.value.set(this.velocityDissipation, this.weight1Dissipation, this.weight2Dissipation)
        this._fromDrawData.copy(this._toDrawData)
        _v$4.copy(this.mouseXY)
        _v$4.x += l
        _v$4.y += c
        this._toDrawData.set((_v$4.x + 1) * t / 2, (_v$4.y + 1) * r / 2, f, 1)
        let a = performance.now()
        let e = (a - this.dateTime) / 1e3;
        this.dateTime = a
        e = Math.min(e, 1 / 20)
        _v$4.set(this._toDrawData.x - this._fromDrawData.x, this._toDrawData.y - this._fromDrawData.y).multiplyScalar(e * .8)
        this.beforeMaterial.uniforms.u_vel.value.multiplyScalar(this.accelerationDissipation).add(_v$4)
        this.beforeMaterial.uniforms.u_scrollOffset.value.y = l
        this.beforeMaterial.uniforms.u_scrollOffset.value.y = c

        this.fsQuad.material = this.beforeMaterial;
        renderer.setRenderTarget(this._currPaintRenderTarget);
        if (this.clear) renderer.clear();
        this.fsQuad.render(renderer);

        const copy = this.copyMaterial
        this.fsQuad.material = copy;
        copy.uniforms.u_texture.value = this._currPaintRenderTarget.texture
        renderer.setRenderTarget(this._lowRenderTarget);
        if (this.clear) renderer.clear();
        this.fsQuad.render(renderer);

    }


    blurRender(renderer, writeBuffer, readBuffer) {
        let c = .25
        let u = Math.ceil(this._lowRenderTarget.width * 1) || 0
        let f = Math.ceil(this._lowRenderTarget.height * 1) || 0;
        if (u !== this._lowBlurRenderTarget.width || f !== this._lowBlurRenderTarget.height) this._lowBlurRenderTarget.setSize(u, f)

        this.blurMaterial.uniforms.u_texture.value = this._lowRenderTarget.texture || this._lowRenderTarget
        this.blurMaterial.uniforms.u_delta.value.set(8 / u * c, 0)

        this.fsQuad.material = this.blurMaterial;
        renderer.setRenderTarget(this._lowBlurRenderTarget);
        if (this.clear) renderer.clear();
        this.fsQuad.render(renderer);

        this.blurMaterial.uniforms.u_texture.value = this._lowBlurRenderTarget.texture || this._lowBlurRenderTarget
        this.blurMaterial.uniforms.u_delta.value.set(0, 8 / f * c)

        this.fsQuad.material = this.blurMaterial;
        renderer.setRenderTarget(this._lowRenderTarget);
        if (this.clear) renderer.clear();
        this.fsQuad.render(renderer);

    }

    postUpdate() {
        this.prevMousePixelXY.copy(this.mousePixelXY)
        this.hadMoved = this.hasMoved
        this.deltaXY.set(0, 0)
    }

    render(renderer, writeBuffer, readBuffer, deltaTime, maskActive) {

        this.beforeRender(renderer, writeBuffer, readBuffer)
        // this.blurRender(renderer, writeBuffer, readBuffer)

        if (this.renderToScreen) {

            renderer.setRenderTarget(null);
            this.fsQuad.render(renderer);

        } else {

            renderer.setRenderTarget(writeBuffer);
            if (this.clear) renderer.clear();
            this.fsQuad.render(renderer);

        }

        this.postUpdate()
    }

    setSize() {
    }

    dispose() {
        console.log('dispose')
    }

    createRenderTarget(e, t) {
        return new THREE.WebGLRenderTarget(e, t, {
            wrapS: THREE.ClampToEdgeWrapping,
            wrapT: THREE.ClampToEdgeWrapping,
            magFilter: THREE.LinearFilter,
            minFilter: THREE.LinearFilter,
            type: THREE.UnsignedByteType,
            anisotropy: 0,
            encoding: THREE.LinearEncoding,
            depthBuffer: !1,
            stencilBuffer: !1,
            samples: 0
        })
    }
}

export default ScreenPaintDistortion
