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
import screenPaintVert from "@/views/example/common/composer/glsl/screenPaintVert.glsl";
import screenPaintFrag from "@/views/example/common/composer/glsl/screenPaintFrag.glsl";

function getDefaultExportFromCjs(a) {
    return a && a.__esModule && Object.prototype.hasOwnProperty.call(a, "default") ? a.default : a
}

let minSignal$1 = {exports: {}};
(function (a) {
    (function (e) {
        function t() {
            this._listeners = [], this.dispatchCount = 0
        }

        var r = t.prototype;
        r.add = c, r.addOnce = u, r.remove = f, r.dispatch = p;
        var n = "Callback function is missing!", o = Array.prototype.slice;

        function l(g) {
            g.sort(function (v, _) {
                return v = v.p, _ = _.p, _ < v ? 1 : _ > v ? -1 : 0
            })
        }

        function c(g, v, _, w) {
            if (!g) throw n;
            _ = _ || 0;
            for (var S = this._listeners, b, C, R, T = S.length; T--;) if (b = S[T], b.f === g && b.c === v) return !1;
            typeof _ == "function" && (C = _, _ = w, R = 4), S.unshift({
                f: g,
                c: v,
                p: _,
                r: C || g,
                a: o.call(arguments, R || 3),
                j: 0
            }), l(S)
        }

        function u(g, v, _, w) {
            if (!g) throw n;
            var S = this, b = function () {
                return S.remove.call(S, g, v), g.apply(v, o.call(arguments, 0))
            };
            w = o.call(arguments, 0), w.length === 1 && w.push(e), w.splice(2, 0, b), c.apply(S, w)
        }

        function f(g, v) {
            if (!g) return this._listeners.length = 0, !0;
            for (var _ = this._listeners, w, S = _.length; S--;) if (w = _[S], w.f === g && (!v || w.c === v)) return w.j = 0, _.splice(S, 1), !0;
            return !1
        }

        function p(g) {
            g = o.call(arguments, 0), this.dispatchCount++;
            for (var v = this.dispatchCount, _ = this._listeners, w, S, b = _.length; b--;) if (w = _[b], w && w.j < v && (w.j = v, w.r.apply(w.c, w.a.concat(g)) === !1)) {
                S = w;
                break
            }
            for (_ = this._listeners, b = _.length; b--;) _[b].j = 0;
            return S
        }

        a.exports = t
    })()
})(minSignal$1);
const MinSignal$2 = getDefaultExportFromCjs(minSignal$1.exports);


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


class ScreenPaintPass extends Pass {
    dateTime = performance.now();
    deltaXY = new THREE.Vector2;
    mouseXY = new THREE.Vector2;
    mousePixelXY = new THREE.Vector2;
    prevMousePixelXY = new THREE.Vector2;
    _prevMouseXY = new THREE.Vector2;
    hadMoved = !1;
    hasMoved = !1;
    _lowRenderTarget;
    _prevPaintRenderTarget;
    _currPaintRenderTarget;
    _material;
    _fromDrawData;
    _toDrawData;
    drawEnabled = !0;
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
    shaderUniforms = {
        u_paintTexelSize: {value: new THREE.Vector2},
        u_paintTextureSize: {value: new THREE.Vector2},
        u_prevPaintTexture: {value: null},
        u_currPaintTexture: {value: null},
        u_lowPaintTexture: {value: null}
    };
    amount = 20;
    rgbShift = 1;
    multiplier = 1.25;
    colorMultiplier = 1;
    shade = 1.25;
    renderOrder = 75;

    bgColor = new THREE.Color;

    clearAlpha = 1;

    bgColorHex = null;

    uniforms = {};

    sceneRenderTarget = null;
    fromRenderTarget = null;
    toRenderTarget = null;
    useDepthTexture = !0;
    depthTexture = null;
    fromTexture = null;
    toTexture = null;
    sceneTexture = null;
    resolution = new THREE.Vector2(0, 0);
    texelSize = new THREE.Vector2(0, 0);
    aspect = new THREE.Vector2(1, 1);
    onBeforeSceneRendered = new MinSignal$2;
    onAfterSceneRendered = new MinSignal$2;
    onAfterRendered = new MinSignal$2;

    constructor(config = {}) {
        super()
        this.config = config
        this.config.dom.addEventListener('mousemove', (e) => {
            this.mouseXY.set(e.offsetX / this.config.dom.offsetWidth * 2 - 1, 1 - e.offsetY / this.config.dom.offsetHeight * 2)
            this.mousePixelXY.set(e.offsetX, e.offsetY)
            this.deltaXY.copy(this.mouseXY).sub(this._prevMouseXY)
            this._prevMouseXY.copy(this.mouseXY)
            this.hasMoved = this.deltaXY.length() > 0
        })
        this.init()
    }

    init() {
        this.blueNoiseInit()

        this._lowRenderTarget = this.createRenderTarget(1, 1)
        this._lowBlurRenderTarget = this.createRenderTarget(1, 1)
        this._prevPaintRenderTarget = this.createRenderTarget(1, 1)
        this._currPaintRenderTarget = this.createRenderTarget(1, 1)

        this._material = new THREE.RawShaderMaterial({
            uniforms: {
                u_lowPaintTexture: this.shaderUniforms.u_lowPaintTexture,
                u_prevPaintTexture: this.shaderUniforms.u_prevPaintTexture,
                u_paintTexelSize: this.shaderUniforms.u_paintTexelSize,
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

        this.clearMaterial = new THREE.RawShaderMaterial({
            uniforms: {u_color: {value: new THREE.Vector4(1, 1, 1, 1)}},
            vertexShader: copyVert,
            fragmentShader: clearFrag,
            depthTest: !1,
            depthWrite: !1,
            blending: THREE.NoBlending
        })

        this.material = new THREE.RawShaderMaterial({
            vertexShader: screenPaintVert,
            fragmentShader: screenPaintFrag,
            uniforms: Object.assign({
                u_texture: {value: null},
                u_screenPaintTexture: this.shaderUniforms.u_currPaintTexture,
                u_screenPaintTexelSize: this.shaderUniforms.u_paintTexelSize,
                u_amount: {value: 0},
                u_rgbShift: {value: 0},
                u_multiplier: {value: 0},
                u_colorMultiplier: {value: 0},
                u_shade: {value: 0}
            }, this.blueNoiseUniforms)
        })

        this.quad = new FullScreenQuad();

        this.pass3Init()
    }

    postUpdate() {
        this.prevMousePixelXY.copy(this.mousePixelXY)
        this.hadMoved = this.hasMoved
        this.deltaXY.set(0, 0)
    }

    async blueNoiseInit() {
        this.blueNoiseUniforms = {
            u_blueNoiseTexture: {value: null},
            u_blueNoiseLinearTexture: {value: null},
            u_blueNoiseTexelSize: {value: null},
            u_blueNoiseCoordOffset: {value: new THREE.Vector2}
        }
        const TEXTURE_SIZE = 128
        let e = new THREE.Texture;
        e.generateMipmaps = !1
        e.minFilter = e.magFilter = THREE.LinearFilter
        e.wrapS = e.wrapT = THREE.RepeatWrapping;
        let loader = new THREE.TextureLoader()
        let texture = await loader.loadAsync('https://lusion.dev/assets/textures/LDR_RGB1_0.png')
        let t = texture.image;
        t.needsUpdate = !0
        e.needsUpdate = !0
        e.image = t.image
        t.generateMipmaps = !1
        t.minFilter = t.magFilter = THREE.NearestFilter
        t.wrapS = t.wrapT = THREE.RepeatWrapping
        this.blueNoiseUniforms.u_blueNoiseTexture.value = t
        this.blueNoiseUniforms.u_blueNoiseLinearTexture.value = e
        this.blueNoiseUniforms.u_blueNoiseTexelSize.value = new THREE.Vector2(1 / TEXTURE_SIZE, 1 / TEXTURE_SIZE)
    }

    pass3Init() {
        this.sceneFlatRenderTarget = this.createRenderTarget(1, 1);
        this.sceneMsRenderTarget = this.createMultisampleRenderTarget(1, 1);
        this.fromRenderTarget = this.createRenderTarget(1, 1);

        this.sceneFlatRenderTarget.depthBuffer = !0;
        this.sceneMsRenderTarget.depthBuffer = !0;

        this.toRenderTarget = this.fromRenderTarget.clone()

        this.fromTexture = this.fromRenderTarget.texture
        this.toTexture = this.toRenderTarget.texture
        this.sceneRenderTarget = this.sceneMsRenderTarget
        this.sceneTexture = this.sceneMsRenderTarget.texture


        this.uniforms = Object.assign(this.uniforms, {
            u_sceneTexture: {value: this.sceneTexture},
            u_fromTexture: {value: null},
            u_toTexture: {value: null},
            u_sceneDepthTexture: {value: null},
            u_cameraNear: {value: 0},
            u_cameraFar: {value: 1},
            u_cameraFovRad: {value: 1},
            u_resolution: {value: this.resolution},
            u_texelSize: {value: this.texelSize},
            u_aspect: {value: this.aspect}
        })

        this.useDepthTexture = !!this.useDepthTexture && this.config.renderer && (this.config.renderer.capabilities.isWebGL2 || this.config.renderer.extensions.get("WEBGL_depth_texture"))
        if (this.useDepthTexture && this.config.renderer) {
            const t = new THREE.DepthTexture(this.resolution.width, this.resolution.height);
            if (this.config.renderer.capabilities.isWebGL2) {
                t.type = THREE.UnsignedIntType
            } else {
                t.format = THREE.DepthStencilFormat
                t.type = THREE.UnsignedInt248Type
            }
            t.minFilter = THREE.NearestFilter
            t.magFilter = THREE.NearestFilter
            this.sceneFlatRenderTarget.depthTexture = t
            this.sceneMsRenderTarget.depthTexture = t
            this.depthTexture = this.uniforms.u_sceneDepthTexture.value = t
        }
    }

    blueNoiseRender() {
        this.blueNoiseUniforms.u_blueNoiseCoordOffset.value.set(Math.random(), Math.random())
    }

    pass1Render(renderer, writeBuffer, readBuffer) {
        let fps = performance.now()
        let offset = (fps - this.dateTime) / 1e3;
        this.dateTime = fps
        offset = Math.min(offset, 1 / 20)

        if (!this.enabled) return;

        if (this.useNoise !== this._prevUseNoise) {
            this._material.defines.USE_NOISE = this.useNoise
            this._material.needsUpdate = !0
            this._prevUseNoise = this.useNoise
        }

        let t = this._currPaintRenderTarget.width
        let r = this._currPaintRenderTarget.height
        let n = this._prevPaintRenderTarget;


        this._prevPaintRenderTarget = this._currPaintRenderTarget
        this._currPaintRenderTarget = n


        this.shaderUniforms.u_prevPaintTexture.value = this._prevPaintRenderTarget.texture
        this.shaderUniforms.u_currPaintTexture.value = this._currPaintRenderTarget.texture;


        let l = 0;
        let c = 0;

        _v$4.copy(this.mousePixelXY)

        _v$4.x += l * this.config.dom.offsetWidth * 3
        _v$4.y += c * this.config.dom.offsetHeight * 3;

        let u = _v$4.distanceTo(this.prevMousePixelXY)
        let f = fit(u, 0, this.radiusDistanceRange, this.minRadius, this.maxRadius);
        if (!this.hadMoved || !this.drawEnabled) f = 0
        f = f / this.config.dom.offsetHeight * r


        this._material.uniforms.u_pushStrength.value = this.pushStrength
        this._material.uniforms.u_curlScale.value = this.curlScale
        this._material.uniforms.u_curlStrength.value = this.curlStrength
        this._material.uniforms.u_dissipations.value.set(this.velocityDissipation, this.weight1Dissipation, this.weight2Dissipation)

        this._fromDrawData.copy(this._toDrawData)

        _v$4.copy(this.mouseXY)

        _v$4.x += l
        _v$4.y += c

        this._toDrawData.set((_v$4.x + 1) * t / 2, (_v$4.y + 1) * r / 2, f, 1)

        _v$4.set(this._toDrawData.x - this._fromDrawData.x, this._toDrawData.y - this._fromDrawData.y).multiplyScalar(offset * .8)

        this._material.uniforms.u_vel.value.multiplyScalar(this.accelerationDissipation).add(_v$4)

        this._material.uniforms.u_scrollOffset.value.x = l
        this._material.uniforms.u_scrollOffset.value.y = c


        // pass 1
        this.quad.material = this._material;
        renderer.setRenderTarget(this._currPaintRenderTarget);
        if (this.clear) renderer.clear();
        this.quad.render(renderer);


        // pass2
        this.quad.material = this.copyMaterial;
        this.copyMaterial.uniforms.u_texture.value = this._currPaintRenderTarget.texture
        renderer.setRenderTarget(this._lowRenderTarget);
        if (this.clear) renderer.clear();
        this.quad.render(renderer);

        this.postUpdate()

    }

    pass2Render(renderer, writeBuffer, readBuffer) {
        let c = .25
        let u = Math.ceil(this._lowRenderTarget.width * 1) || 0
        let f = Math.ceil(this._lowRenderTarget.height * 1) || 0;
        if (u !== this._lowBlurRenderTarget.width || f !== this._lowBlurRenderTarget.height) this._lowBlurRenderTarget.setSize(u, f)

        this.blurMaterial.uniforms.u_texture.value = this._lowRenderTarget.texture || this._lowRenderTarget
        this.blurMaterial.uniforms.u_delta.value.set(8 / u * c, 0)

        this.quad.material = this.blurMaterial;
        renderer.setRenderTarget(this._lowBlurRenderTarget);
        if (this.clear) renderer.clear();
        this.quad.render(renderer);

        this.blurMaterial.uniforms.u_texture.value = this._lowBlurRenderTarget.texture || this._lowBlurRenderTarget
        this.blurMaterial.uniforms.u_delta.value.set(0, 8 / f * c)

        this.quad.material = this.blurMaterial;
        renderer.setRenderTarget(this._lowRenderTarget);
        if (this.clear) renderer.clear();
        this.quad.render(renderer);

    }

    pass3Render(renderer, writeBuffer, readBuffer) {
        renderer.setClearColor(this.bgColor, this.clearAlpha);
        this.bgColor.setStyle(this.bgColorHex);

        this.minRadius = 0;
        this.maxRadius = Math.max(40, this.config.dom.offsetWidth / 20);
        this.radiusDistanceRange = 100;
        this.pushStrength = 25;
        this.velocityDissipation = 0.975;
        this.weight1Dissipation = 0.95;
        this.weight2Dissipation = 0.8;
        this.useNoise = !0;
        this.curlScale = 0.02;
        this.curlStrength = 3;

        this.amount = 3;
        this.rgbShift = 0.5;
        this.colorMultiplier = 10;
        this.multiplier = 5;

        this.scene = this.config.scene;
        this.camera = this.config.camera;

        const o = this.uniforms;

        o.u_cameraNear.value = this.camera.near
        o.u_cameraFar.value = this.camera.far
        o.u_cameraFovRad.value = this.camera.fov / 180 * Math.PI

        this.onBeforeSceneRendered.dispatch()

        this.sceneRenderTarget = this.sceneFlatRenderTarget;
        this.sceneTexture = this.sceneRenderTarget.texture
        this.uniforms.u_sceneTexture.value = this.sceneTexture


        this.quad.material = this.material;
        renderer.setRenderTarget(this.sceneRenderTarget);
        if (this.clear) renderer.clear();
        this.quad.render(renderer);

        renderer.setRenderTarget(null);
        this.quad.render(renderer);


        this.quad.material = this.copyMaterial;
        this.copyMaterial.uniforms.u_texture.value = this.sceneRenderTarget.texture
        renderer.setRenderTarget(this.fromRenderTarget);
        if (this.clear) renderer.clear();
        this.quad.render(renderer);

        this.onAfterSceneRendered.dispatch(this.sceneRenderTarget);

        const l = this.getColorState()
        renderer.autoClear = !1;

        this.material.uniforms.u_amount.value = this.amount
        this.material.uniforms.u_rgbShift.value = this.rgbShift
        this.material.uniforms.u_multiplier.value = this.multiplier
        this.material.uniforms.u_colorMultiplier.value = this.colorMultiplier
        this.material.uniforms.u_shade.value = this.shade

        if (this.material.uniforms.u_texture) this.material.uniforms.u_texture.value = this.fromTexture

        this.quad.material = this.material;
        renderer.setRenderTarget(null);
        if (this.clear) renderer.clear();
        this.quad.render(renderer);

        const e = this.fromRenderTarget;
        this.fromRenderTarget = this.toRenderTarget
        this.toRenderTarget = e
        this.fromTexture = this.fromRenderTarget.texture
        this.toTexture = this.toRenderTarget.texture
        this.uniforms.u_fromTexture.value = this.fromTexture
        this.uniforms.u_toTexture.value = this.toTexture


        this.setColorState(l, renderer)

        this.onAfterRendered.dispatch()

        this.hasSizeChanged = !1

    }

    render(renderer, writeBuffer, readBuffer) {
        this.blueNoiseRender();
        this.pass1Render(renderer, writeBuffer, readBuffer);
        this.pass2Render(renderer, writeBuffer, readBuffer);
        // this.pass3Render(renderer, writeBuffer, readBuffer);

    }

    setSize(e, t) {
        let r = e >> 2
        let n = t >> 2
        let o = e >> 3
        let l = t >> 3;
        if (r !== this._currPaintRenderTarget.width || n !== this._currPaintRenderTarget.height) {
            this._currPaintRenderTarget.setSize(r, n)
            this._prevPaintRenderTarget.setSize(r, n)
            this._lowRenderTarget.setSize(o, l)
            this._lowBlurRenderTarget.setSize(o, l)
            this.shaderUniforms.u_paintTexelSize.value.set(1 / r, 1 / n)
            this.shaderUniforms.u_paintTextureSize.value.set(r, n)
            this.clearColor()
        }

        this.hasSizeChanged = !0
        this.width = e
        this.height = t
        this.resolution.set(e, t)
        this.texelSize.set(1 / e, 1 / t);
        const rx = t / Math.sqrt(e * e + t * t) * 2;
        this.aspect.set(e / t * rx, rx)
        this.sceneFlatRenderTarget.setSize(e, t)
        this.sceneMsRenderTarget.setSize(e, t)
        this.fromRenderTarget.setSize(e, t)
        this.toRenderTarget.setSize(e, t)
    }

    dispose() {
    }

    clearColor() {
        this.quad.material = this.clearMaterial;
        this.clearMaterial.uniforms.u_color.value.set(0, 0, 0, 0)

        this.config.renderer.setRenderTarget(this._lowRenderTarget);
        if (this.clear) this.renderer.clear();
        this.quad.render(this.config.renderer);


        this.config.renderer.setRenderTarget(this._currPaintRenderTarget);
        if (this.clear) this.renderer.clear();
        this.quad.render(this.config.renderer);

        this._material.uniforms.u_vel.value.set(0, 0)
    }

    setColorState(config, renderer) {
        if (renderer) {
            renderer.setClearColor(config.clearColor, config.clearAlpha)
            renderer.autoClear = config.autoClear
            renderer.autoClearColor = config.autoClearColor
            renderer.autoClearStencil = config.autoClearStencil
            renderer.autoClearDepth = config.autoClearDepth
        }
    }

    getColorState() {
        if (!this.config.renderer) return {
            autoClear: !0,
            autoClearColor: !0,
            autoClearStencil: !0,
            autoClearDepth: !0,
            clearColor: 0,
            clearAlpha: 1
        };
        const e = new THREE.Color;
        this.config.renderer.getClearColor(e)
        return {
            autoClear: this.config.renderer.autoClear,
            autoClearColor: this.config.renderer.autoClearColor,
            autoClearStencil: this.config.renderer.autoClearStencil,
            autoClearDepth: this.config.renderer.autoClearDepth,
            clearColor: e.getHex(),
            clearAlpha: this.config.renderer.getClearAlpha()
        }
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

    createMultisampleRenderTarget(e, t) {
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
            samples: 8
        })
    }

}

export {ScreenPaintPass}
