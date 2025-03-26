/**
 * justThreeJs common.js
 * @author kongjianqiu
 * @description
 * @created 2025/3/22 21:40:36
 */
import * as THREE from "three";

// glsl
import blitVertex from '@/views/pages/hero/glsl/fboHelper/blitVertex.glsl'
import blitFragment from '@/views/pages/hero/glsl/fboHelper/blitFragment.glsl'
import clearFragment from '@/views/pages/hero/glsl/fboHelper/clearFragment.glsl'
import blurVertex from '@/views/pages/hero/glsl/common/blurVertex.glsl'
import blurFragment from '@/views/pages/hero/glsl/common/blurFragment.glsl'
import blurFragment2 from '@/views/pages/hero/glsl/common/blurFragment2.glsl'
import channelMixerFrag from '@/views/pages/hero/glsl/common/channelMixerFrag.glsl'

function _sfc32(o, e, t, r) {
    return function () {
        o |= 0,
            e |= 0,
            t |= 0,
            r |= 0;
        var n = (o + e | 0) + r | 0;
        return r = r + 1 | 0,
            o = e ^ e >>> 9,
            e = t + (t << 3) | 0,
            t = t << 21 | t >>> 11,
            t = t + n | 0,
        (n >>> 0) / 4294967296
    }
}

export class MathUtils {
    PI = Math.PI;
    PI2 = this.PI * 2;
    HALF_PI = this.PI * .5;
    DEG2RAD = this.PI / 180;
    RAD2DEG = 180 / this.PI;

    linearStep(e, t, r) {
        return this.clamp((r - e) / (t - e), 0, 1)
    }

    step(e, t) {
        return t < e ? 0 : 1
    }

    clamp(e, t, r) {
        return e < t ? t : e > r ? r : e
    }

    mod(e, t) {
        return e - t * Math.floor(e / t)
    }

    mix(e, t, r) {
        return e + (t - e) * r
    }

    cMix(e, t, r) {
        return e + (t - e) * this.clamp(r, 0, 1)
    }

    unMix(e, t, r) {
        return (r - e) / (t - e)
    }

    cUnMix(e, t, r) {
        return this.clamp((r - e) / (t - e), 0, 1)
    }

    saturate(e) {
        return this.clamp(e, 0, 1)
    }

    fit(e, t, r, n, a, l) {
        return e = this.cUnMix(t, r, e),
        l && (e = l(e)),
        n + e * (a - n)
    }

    unClampedFit(e, t, r, n, a, l) {
        return e = this.unMix(t, r, e),
        l && (e = l(e)),
        n + e * (a - n)
    }

    lerp(e, t, r) {
        return e * (1 - r) + t * r
    }

    loop(e, t, r) {
        return e -= t,
            r -= t,
        (e < 0 ? (r - Math.abs(e) % r) % r : e % r) + t
    }

    normalize(e, t, r) {
        return Math.max(0, Math.min(1, e - t / r - t))
    }

    smoothstep(e, t, r) {
        return r = this.cUnMix(e, t, r),
        r * r * (3 - r * 2)
    }

    fract(e) {
        return e - Math.floor(e)
    }

    hash(e) {
        return this.fract(Math.sin(e) * 43758.5453123)
    }

    hash2(e, t) {
        return this.fract(Math.sin(e * 12.9898 + t * 4.1414) * 43758.5453)
    }

    sign(e) {
        return e ? e < 0 ? -1 : 1 : 0
    }

    isPowerOfTwo(e) {
        return (e & -e) === e
    }

    powerTwoCeilingBase(e) {
        return Math.ceil(Math.log(e) / Math.log(2))
    }

    powerTwoCeiling(e) {
        return this.isPowerOfTwo(e) ? e : 1 << this.powerTwoCeilingBase(e)
    }

    powerTwoFloorBase(e) {
        return Math.floor(Math.log(e) / Math.log(2))
    }

    powerTwoFloor(e) {
        return this.isPowerOfTwo(e) ? e : 1 << this.powerTwoFloorBase(e)
    }

    latLngBearing(e, t, r, n) {
        let a = Math.sin(n - t) * Math.cos(r)
            , l = Math.cos(e) * Math.sin(r) - Math.sin(e) * Math.cos(r) * Math.cos(n - t);
        return Math.atan2(a, l)
    }

    distanceTo(e, t) {
        return Math.sqrt(e * e + t * t)
    }

    distanceSqrTo(e, t) {
        return e * e + t * t
    }

    distanceTo3(e, t, r) {
        return Math.sqrt(e * e + t * t + r * r)
    }

    distanceSqrTo3(e, t, r) {
        return e * e + t * t + r * r
    }

    latLngDistance(e, t, r, n) {
        let a = Math.sin((r - e) / 2)
            , l = Math.sin((n - t) / 2)
            , c = a * a + Math.cos(e) * Math.cos(r) * l * l;
        return 2 * Math.atan2(Math.sqrt(c), Math.sqrt(1 - c))
    }

    cubicBezier(e, t, r, n, a) {
        let l = (t - e) * 3
            , c = (r - t) * 3 - l
            , u = n - e - l - c
            , f = a * a
            , p = f * a;
        return u * p + c * f + l * a + e
    }

    cubicBezierFn(e, t, r, n) {
        let a = (t - e) * 3
            , l = (r - t) * 3 - a
            , c = n - e - a - l;
        return u => {
            let f = u * u
                , p = f * u;
            return c * p + l * f + a * u + e
        }
    }

    normalizeAngle(e) {
        return e += this.PI,
            e = e < 0 ? this.PI2 - Math.abs(e % this.PI2) : e % this.PI2,
            e -= this.PI,
            e
    }

    closestAngleTo(e, t) {
        return e + this.normalizeAngle(t - e)
    }

    randomRange(e, t) {
        return e + Math.random() * (t - e)
    }

    randomRangeInt(e, t) {
        return Math.floor(this.randomRange(e, t + 1))
    }

    padZero(e, t) {
        return e.toString().length >= t ? e : (Math.pow(10, t) + Math.floor(e)).toString().substring(1)
    }

    lerpColor(e, t, r) {
        const n = e >> 16
            , a = e >> 8 & 255
            , l = e & 255
            , c = t >> 16
            , u = t >> 8 & 255
            , f = t & 255
            , p = n + r * (c - n)
            , g = a + r * (u - a)
            , v = l + r * (f - l);
        return (p << 16) + (g << 8) + (v | 0)
    }

    getSeedRandomFn(e) {
        let t = 1779033703
            , r = 3144134277
            , n = 1013904242
            , a = 2773480762;
        for (let l = 0, c; l < e.length; l++)
            c = e.charCodeAt(l),
                t = r ^ Math.imul(t ^ c, 597399067),
                r = n ^ Math.imul(r ^ c, 2869860233),
                n = a ^ Math.imul(n ^ c, 951274213),
                a = t ^ Math.imul(a ^ c, 2716044179);
        return _sfc32(Math.imul(n ^ t >>> 18, 597399067), Math.imul(a ^ r >>> 22, 2869860233), Math.imul(t ^ n >>> 17, 951274213), Math.imul(r ^ a >>> 19, 2716044179))
    }
}

export class FboHelper {
    constructor(base) {
        this.base = base;
        this.renderer = this.base.renderer;
        this.floatType = THREE.HalfFloatType
        this.isWebGL2 = this.renderer.capabilities.isWebGL2
        this.scene = new THREE.Scene();
        this.camera = new THREE.Camera();
        this.camera.position.z = 1;
        this.geometry = new THREE.BufferGeometry();
        this.geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 4, -1, 0, -1, 4, 0]), 3));
        this.mesh = new THREE.Mesh(this.geometry)
        this.mesh.frustumCulled = false;
        this.scene.add(this.mesh)
        this.paramsInit();
    }

    paramsInit() {
        this.precisionPrefix = `precision ${this.renderer.capabilities.precision} float;`
        this.precisionPrefix2 = `precision ${this.renderer.capabilities.precision} float;
			precision ${this.renderer.capabilities.precision} int;
			#define IS_WEBGL2 true
		`
        if (this.isWebGL2) {
            this.vertexPrefix = `${this.precisionPrefix2}
				precision mediump sampler2DArray;
				#define attribute in
				#define varying out
				#define texture2D texture
			`
            this.fragmentPrefix = `${this.precisionPrefix2}
				#define varying in
				out highp vec4 pc_fragColor;
				#define gl_FragColor pc_fragColor
				#define gl_FragDepthEXT gl_FragDepth
				#define texture2D texture
				#define textureCube texture
				#define texture2DProj textureProj
				#define texture2DLodEXT textureLod
				#define texture2DProjLodEXT textureProjLod
				#define textureCubeLodEXT textureLod
				#define texture2DGradEXT textureGrad
				#define texture2DProjGradEXT textureProjGrad
				#define textureCubeGradEXT textureGrad
			`
        } else {
            this.vertexPrefix = this.precisionPrefix
            this.fragmentPrefix = this.precisionPrefix
        }
        this.renderer.getContext().getExtension("OES_standard_derivatives");
        this.vertexShader = this.isWebGL2 ? this.precisionPrefix2 + blitVertex : this.precisionPrefix + blitFragment;
        this.copyMaterial = this.createRawShaderMaterial({
            uniforms: {u_texture: {value: null}},
            fragmentShader: blitFragment,
            depthTest: !1,
            depthWrite: !1,
            blending: THREE.NoBlending
        })
        this.clearMaterial = this.createRawShaderMaterial({
            uniforms: {
                u_color: {
                    value: new THREE.Vector4(1, 1, 1, 1)
                }
            },
            fragmentShader: clearFragment,
            depthTest: !1,
            depthWrite: !1,
            blending: THREE.NoBlending
        });
    }

    createRawShaderMaterial(e) {
        e = Object.assign({
            depthTest: !1,
            depthWrite: !1,
            blending: THREE.NoBlending,
            vertexShader: blitVertex,
            fragmentShader: blitFragment,
            derivatives: !1
        }, e)
        e.vertexShader = (e.vertexShaderPrefix ? e.vertexShaderPrefix : e.derivatives ? this.vertexPrefix : this.vertexPrefix) + e.vertexShader
        e.fragmentShader = (e.fragmentShaderPrefix ? e.fragmentShaderPrefix : e.derivatives ? this.fragmentPrefix : this.fragmentPrefix) + e.fragmentShader
        delete e.vertexShaderPrefix
        delete e.fragmentShaderPrefix
        delete e.derivatives
        e.glslVersion = this.isWebGL2 ? THREE.GLSL3 : THREE.GLSL1;
        let t = new THREE.RawShaderMaterial(e);
        return t
    }

    createRenderTarget(e, t, r = !1, n = !1, a = 0) {
        return new THREE.WebGLRenderTarget(e, t, {
            wrapS: THREE.ClampToEdgeWrapping,
            wrapT: THREE.ClampToEdgeWrapping,
            magFilter: r ? THREE.NearestFilter : THREE.LinearFilter,
            minFilter: r ? THREE.NearestFilter : THREE.LinearFilter,
            type: typeof n == "boolean" ? n ? this.floatType : THREE.UnsignedByteType : n,
            anisotropy: 0,
            colorSpace: THREE.NoColorSpace,
            depthBuffer: !1,
            stencilBuffer: !1,
            samples: a
        })
    }

    createDataTexture(e, t, r, n = !1, a = !0) {
        let l = new THREE.DataTexture(e, t, r, THREE.RGBAFormat, n ? THREE.FloatType : THREE.UnsignedByteType, THREE.UVMapping, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, a ? THREE.NearestFilter : THREE.LinearFilter, a ? THREE.NearestFilter : THREE.LinearFilter, 0);
        l.needsUpdate = !0
        return l
    }

    clearMultisampleRenderTargetState(e) {
        if (e = e || this.renderer.getRenderTarget(), e && e.samples > 0) {
            const t = this.renderer.properties.get(e);
            let r = this.renderer.getContext();
            r.bindFramebuffer(r.READ_FRAMEBUFFER, t.__webglMultisampledFramebuffer)
            r.bindFramebuffer(r.DRAW_FRAMEBUFFER, t.__webglFramebuffer);
            const n = e.width, a = e.height;
            let l = r.COLOR_BUFFER_BIT;
            e.depthBuffer && (l |= r.DEPTH_BUFFER_BIT), e.stencilBuffer && (l |= r.STENCIL_BUFFER_BIT)
            r.blitFramebuffer(0, 0, n, a, 0, 0, n, a, l, r.NEAREST)
            r.bindFramebuffer(r.FRAMEBUFFER, t.__webglMultisampledFramebuffer)
        }
    }

    renderMesh(mesh, renderTarget, camera = this.camera) {
        this.mesh.visible = !1
        this.scene.add(mesh)
        this.renderer.setRenderTarget(renderTarget)
        this.renderer.render(this.scene, camera)
        this.renderer.setRenderTarget(null)
        this.scene.remove(mesh)
        this.mesh.visible = !0
    }

    copy(texture, renderTarget) {
        const r = this.copyMaterial;
        r.uniforms.u_texture.value = texture
        this.render(r, renderTarget)
    }

    render(material, renderTarget) {
        this.mesh.material = material
        this.renderer.setRenderTarget(renderTarget)
        this.renderer.render(this.scene, this.camera)
    }

    getColorState() {
        if (!this.renderer) return {
            autoClear: !0,
            autoClearColor: !0,
            autoClearStencil: !0,
            autoClearDepth: !0,
            clearColor: 0,
            clearAlpha: 1
        };
        const e = new THREE.Color;
        this.renderer.getClearColor(e)
        return {
            autoClear: this.renderer.autoClear,
            autoClearColor: this.renderer.autoClearColor,
            autoClearStencil: this.renderer.autoClearStencil,
            autoClearDepth: this.renderer.autoClearDepth,
            clearColor: e.getHex(),
            clearAlpha: this.renderer.getClearAlpha()
        }
    }

    setColorState(e) {
        this.renderer.setClearColor(e.clearColor, e.clearAlpha)
        this.renderer.autoClear = e.autoClear
        this.renderer.autoClearColor = e.autoClearColor
        this.renderer.autoClearStencil = e.autoClearStencil
        this.renderer.autoClearDepth = e.autoClearDepth
    }

    clearColor(e, t, r, n, a) {
        this.clearMaterial.uniforms.u_color.value.set(e, t, r, n)
        this.render(this.clearMaterial, a)
    }

}

export class TextureHelper {
    blackTexture;
    whiteTexture;
    transparentTexture;
    channelMixerMaterial;

    constructor(base) {
        this.base = base;
        this.blackTexture = this._createPixelTexture([0, 0, 0, 255])
        this.whiteTexture = this._createPixelTexture([255, 255, 255, 255])
        this.transparentTexture = this._createPixelTexture([0, 0, 0, 0])
    }

    _createPixelTexture(e) {
        return this.base.fboHelper.createDataTexture(new Uint8Array(e), 1, 1, !1, !0)
    }

    mixChannels(e, t, r = -1, n = -1, a = -1, l = -1) {
        this.channelMixerMaterial || (this.channelMixerMaterial = this.base.fboHelper.createRawShaderMaterial({
            uniforms: {
                u_texture: {value: null},
                u_channelMixerR: {value: new THREE.Vector4},
                u_channelMixerG: {value: new THREE.Vector4},
                u_channelMixerB: {value: new THREE.Vector4},
                u_channelMixerA: {value: new THREE.Vector4}
            },
            vertexShader: this.base.fboHelper.vertexShader,
            fragmentShader: this.base.fboHelper.precisionPrefix + '\n\n' + channelMixerFrag,
            blending: THREE.CustomBlending,
            blendEquation: THREE.AddEquation,
            blendDst: THREE.OneFactor,
            blendSrc: THREE.OneFactor,
            blendEquationAlpha: THREE.AddEquation,
            blendDstAlpha: THREE.OneFactor,
            blendSrcAlpha: THREE.OneFactor
        }))
        this.channelMixerMaterial.uniforms.u_texture.value = e
        this.channelMixerMaterial.uniforms.u_channelMixerR.value.set(+(r % 4 == 0), +(r % 4 == 1), +(r % 4 == 2), +(r % 4 == 3)).multiplyScalar(r < 0 ? 0 : 1)
        this.channelMixerMaterial.uniforms.u_channelMixerG.value.set(+(n % 4 == 0), +(n % 4 == 1), +(n % 4 == 2), +(n % 4 == 3)).multiplyScalar(n < 0 ? 0 : 1)
        this.channelMixerMaterial.uniforms.u_channelMixerB.value.set(+(a % 4 == 0), +(a % 4 == 1), +(a % 4 == 2), +(a % 4 == 3)).multiplyScalar(a < 0 ? 0 : 1)
        this.channelMixerMaterial.uniforms.u_channelMixerA.value.set(+(l % 4 == 0), +(l % 4 == 1), +(l % 4 == 2), +(l % 4 == 3)).multiplyScalar(l < 0 ? 0 : 1);
        let c = this.base.fboHelper.getColorState();
        this.base.fboHelper.renderer.autoClear = !1
        this.base.fboHelper.render(this.channelMixerMaterial, t)
        this.base.fboHelper.setColorState(c)
    }
}

export class Blur {
    material = null;

    constructor(base) {
        this.base = base;
    }

    getBlur9Material() {
        let e = this.base.fboHelper.MAX_VARYING_VECTORS > 8;
        this.blur9Material || (this.blur9Material = this.base.fboHelper.createRawShaderMaterial({
            uniforms: {
                u_texture: {value: null},
                u_delta: {value: new THREE.Vector2}
            },
            vertexShader: e ? this.base.fboHelper.precisionPrefix + '\n\n' + blurVertex : this.base.fboHelper.vertexShader,
            fragmentShader: this.base.fboHelper.precisionPrefix + '\n\n' + (e ? blurFragment : blurFragment2),
            depthWrite: !1,
            depthTest: !1
        }))
        return this.blur9Material
    }

    blur(e, t, r, n, a, l) {
        let c = .25
        let u = Math.ceil(r.width * t) || 0
        let f = Math.ceil(r.height * t) || 0;
        this.material || (this.material = this.getBlur9Material())
        n || console.warn("You have to pass intermediateRenderTarget to blur")
        (u !== n.width || f !== n.height) && n.setSize(u, f)
        a ? l || a.setSize(r.width, r.height) : a = r
        this.material.uniforms.u_texture.value = r.texture || r
        this.material.uniforms.u_delta.value.set(e / u * c, 0)
        this.base.fboHelper.render(this.material, n)
        this.material.uniforms.u_texture.value = n.texture || n
        this.material.uniforms.u_delta.value.set(0, e / f * c)
        this.base.fboHelper.render(this.material, a)
    }
}

export class BlueNoise {
    shaderUniforms = {
        u_blueNoiseTexture: {value: null},
        u_blueNoiseLinearTexture: {value: null},
        u_blueNoiseTexelSize: {value: null},
        u_blueNoiseCoordOffset: {value: new THREE.Vector2}
    };
    TEXTURE_SIZE = 128;

    constructor(base) {
        this.base = base;
        this.blueNoiseTexture = this.base.blueNoiseTexture;
        let e = new THREE.Texture;
        let t = this.blueNoiseTexture;
        e.generateMipmaps = !1
        e.minFilter = e.magFilter = THREE.LinearFilter
        e.wrapS = e.wrapT = THREE.RepeatWrapping;
        e.image = t.image
        t.generateMipmaps = !1
        t.minFilter = t.magFilter = THREE.NearestFilter
        t.wrapS = t.wrapT = THREE.RepeatWrapping
        t.needsUpdate = !0
        e.needsUpdate = !0
        this.shaderUniforms.u_blueNoiseTexture.value = t
        this.shaderUniforms.u_blueNoiseLinearTexture.value = e
        this.shaderUniforms.u_blueNoiseTexelSize.value = new THREE.Vector2(1 / this.TEXTURE_SIZE, 1 / this.TEXTURE_SIZE)
    }

    update() {
        this.shaderUniforms.u_blueNoiseCoordOffset.value.set(Math.random(), Math.random())
    }
}

export class Simple1DNoise {
    static MAX_VERTICES = 512;
    static MAX_VERTICES_MASK = Simple1DNoise.MAX_VERTICES - 1;
    _scale = 1;
    _amplitude = 1;
    _r = [];

    constructor(e) {
        this.math = new MathUtils();
        let t = e ? this.math.getSeedRandomFn(e) : Math.random;
        for (let r = 0; r < Simple1DNoise.MAX_VERTICES; ++r) this._r.push(t() - .5)
    }

    getVal(e) {
        const t = e * this._scale, r = Math.floor(t), n = t - r, a = n * n * (3 - 2 * n),
            l = r & Simple1DNoise.MAX_VERTICES_MASK, c = l + 1 & Simple1DNoise.MAX_VERTICES_MASK;
        return this.math.mix(this._r[l], this._r[c], a) * this._amplitude
    }

    getFbm(e, t) {
        let r = 0, n = .5;
        for (let a = 0; a < t; a++) r += n * this.getVal(e), e *= 2, n *= .5;
        return r
    }

    get amplitude() {
        return this._amplitude
    }

    set amplitude(e) {
        this._amplitude = e
    }

    get scale() {
        return this._scale
    }

    set scale(e) {
        this._scale = e
    }
}

export class BrownianMotion {
    _v$2 = new THREE.Vector3;
    _position = new THREE.Vector3;
    _rotation = new THREE.Quaternion;
    _euler = new THREE.Euler;
    _scale = new THREE.Vector3(1, 1, 1);
    _matrix = new THREE.Matrix4;
    _enablePositionNoise = !0;
    _enableRotationNoise = !0;
    _positionFrequency = .25;
    _rotationFrequency = .25;
    _positionAmplitude = .3;
    _rotationAmplitude = .003;
    _positionScale = new THREE.Vector3(1, 1, 1);
    _rotationScale = new THREE.Vector3(1, 1, 0);
    _positionFractalLevel = 3;
    _rotationFractalLevel = 3;
    _times = new Float32Array(6);
    _noise = new Simple1DNoise;
    static FBM_NORM = 1 / .75;

    constructor() {
        this.rehash()
    }

    rehash() {
        for (let e = 0; e < 6; e++) this._times[e] = Math.random() * -1e4
    }

    update(e) {
        const t = e === void 0 ? 16.666666666666668 : e;
        if (this._enablePositionNoise) {
            for (let r = 0; r < 3; r++) this._times[r] += this._positionFrequency * t;
            this._v$2.set(this._noise.getFbm(this._times[0], this._positionFractalLevel), this._noise.getFbm(this._times[1], this._positionFractalLevel), this._noise.getFbm(this._times[2], this._positionFractalLevel))
            this._v$2.multiply(this._positionScale)
            this._v$2.multiplyScalar(this._positionAmplitude * BrownianMotion.FBM_NORM)
            this._position.copy(this._v$2)
        }
        if (this._enableRotationNoise) {
            for (let r = 0; r < 3; r++) this._times[r + 3] += this._rotationFrequency * t;
            this._v$2.set(this._noise.getFbm(this._times[3], this._rotationFractalLevel), this._noise.getFbm(this._times[4], this._rotationFractalLevel), this._noise.getFbm(this._times[5], this._rotationFractalLevel))
            this._v$2.multiply(this._rotationScale)
            this._v$2.multiplyScalar(this._rotationAmplitude * BrownianMotion.FBM_NORM)
            this._euler.set(this._v$2.x, this._v$2.y, this._v$2.z)
            this._rotation.setFromEuler(this._euler)
        }
        this._matrix.compose(this._position, this._rotation, this._scale)
    }

    get positionAmplitude() {
        return this._positionAmplitude
    }

    set positionAmplitude(e) {
        this._positionAmplitude = e
    }

    get positionFrequency() {
        return this._positionFrequency
    }

    set positionFrequency(e) {
        this._positionFrequency = e
    }

    get rotationAmplitude() {
        return this._rotationAmplitude
    }

    set rotationAmplitude(e) {
        this._rotationAmplitude = e
    }

    get rotationFrequency() {
        return this._rotationFrequency
    }

    set rotationFrequency(e) {
        this._rotationFrequency = e
    }

    get matrix() {
        return this._matrix
    }

    set matrix(e) {
        this._matrix = e
    }
}


export const bufferToGeometry = (buffer) => {
    // 解析二进制文件头
    const headerView = new Uint32Array(buffer, 0, 1);
    const headerLength = headerView[0];

    // 解析JSON元数据
    const jsonData = JSON.parse(
        String.fromCharCode.apply(
            null,
            new Uint8Array(buffer, 4, headerLength)
        )
    );

    // 初始化几何体
    const geometry = new THREE.BufferGeometry();
    const vertexCount = jsonData.vertexCount;
    const indexCount = jsonData.indexCount;
    let dataOffset = 4 + headerLength;  // 数据起始偏移量
    const attributeOffsets = {};        // 记录各属性的原始偏移量
    let hasNormalAttribute = false;

    // 处理顶点属性
    for (let attributeIndex = 0; attributeIndex < jsonData.attributes.length; attributeIndex++) {
        const attributeInfo = jsonData.attributes[attributeIndex];
        const attributeName = attributeInfo.id;

        // 计算数据长度
        const elementCount = (attributeName === "indices") ? indexCount : vertexCount;
        const componentSize = attributeInfo.componentSize;

        // 创建对应类型的ArrayBuffer视图
        const TypedArray = window[attributeInfo.storageType];
        const rawData = new TypedArray(buffer, dataOffset, elementCount * componentSize);
        const elementBytes = TypedArray.BYTES_PER_ELEMENT;

        let processedData;

        // 处理需要解包的属性（如压缩的UV/颜色等）
        if (attributeInfo.needsPack) {
            processedData = new Float32Array(elementCount * componentSize);
            const packConfig = attributeInfo.packedComponents;
            const componentsCount = packConfig.length;
            const isIntegerType = attributeInfo.storageType.includes("Int");
            const maxValue = 1 << (elementBytes * 8);
            const halfRange = isIntegerType ? maxValue / 2 : 0;
            const normalizeFactor = 1 / maxValue;

            // 解包处理
            for (let i = 0, ptr = 0; i < elementCount; i++) {
                for (let comp = 0; comp < componentsCount; comp++) {
                    const {delta, from} = packConfig[comp];
                    processedData[ptr] = (rawData[ptr] + halfRange) * normalizeFactor * delta + from;
                    ptr++;
                }
            }
        } else {
            // 记录原始二进制偏移量
            attributeOffsets[attributeName] = dataOffset;
            processedData = rawData;
        }

        // 设置几何体属性
        if (attributeName === "indices") {
            geometry.setIndex(new THREE.BufferAttribute(processedData, 1));
        } else {
            geometry.setAttribute(
                attributeName,
                new THREE.BufferAttribute(processedData, componentSize)
            );
            if (attributeName === "normal") hasNormalAttribute = true;
        }

        dataOffset += elementCount * componentSize * elementBytes;
    }

    // 处理场景层级数据
    const meshes = [];
    if (jsonData.sceneData) {
        const sceneRoot = new THREE.Object3D();
        const meshType = jsonData.meshType;
        const drawModeMultiplier =
            meshType === "Mesh" ? 3 :       // 三角形网格
                meshType === "LineSegments" ? 2 : // 线段
                    1;                              // 点

        // 遍历场景节点
        for (let nodeIndex = 0; nodeIndex < jsonData.sceneData.length; nodeIndex++) {
            const nodeData = jsonData.sceneData[nodeIndex];
            let meshObject;

            if (nodeData.vertexCount > 0) {
                // 创建子几何体
                const subGeometry = new THREE.BufferGeometry();

                // 处理索引缓冲区
                const baseIndexAttr = geometry.index;
                const baseIndexArray = baseIndexAttr.array;
                const IndexArrayType = baseIndexArray.constructor;
                const indexBytes = IndexArrayType.BYTES_PER_ELEMENT;

                subGeometry.setIndex(new THREE.BufferAttribute(
                    new IndexArrayType(
                        baseIndexArray.buffer,
                        nodeData.faceIndex * baseIndexAttr.itemSize * indexBytes * drawModeMultiplier + (attributeOffsets.indices || 0),
                        nodeData.faceCount * baseIndexAttr.itemSize * drawModeMultiplier
                    ),
                    baseIndexAttr.itemSize
                ));

                // 调整索引偏移
                const indexArray = subGeometry.index.array;
                for (let i = 0; i < indexArray.length; i++) {
                    indexArray[i] -= nodeData.vertexIndex;
                }

                // 处理顶点属性
                for (const attrName in geometry.attributes) {
                    const baseAttr = geometry.attributes[attrName];
                    const baseArray = baseAttr.array;
                    const ArrayType = baseArray.constructor;
                    const attrBytes = ArrayType.BYTES_PER_ELEMENT;

                    subGeometry.setAttribute(
                        attrName,
                        new THREE.BufferAttribute(
                            new ArrayType(
                                baseArray.buffer,
                                nodeData.vertexIndex * baseAttr.itemSize * attrBytes + (attributeOffsets[attrName] || 0),
                                nodeData.vertexCount * baseAttr.itemSize
                            ),
                            baseAttr.itemSize
                        )
                    );
                }

                // 创建对应类型的网格对象
                switch (meshType) {
                    case "Mesh":
                        meshObject = new THREE.Mesh(
                            subGeometry,
                            new THREE.MeshNormalMaterial({flatShading: !hasNormalAttribute})
                        );
                        break;
                    case "LineSegments":
                        meshObject = new THREE.LineSegments(subGeometry, new THREE.LineBasicMaterial());
                        break;
                    default:
                        meshObject = new THREE.Points(
                            subGeometry,
                            new THREE.PointsMaterial({
                                sizeAttenuation: false,
                                size: 2
                            })
                        );
                }
                meshes.push(meshObject);
            } else {
                meshObject = new THREE.Object3D();
            }

            // 构建场景层级
            if (nodeData.parentIndex > -1) {
                meshes[nodeData.parentIndex].add(meshObject);
            } else {
                sceneRoot.add(meshObject);
            }

            // 设置变换
            meshObject.position.fromArray(nodeData.position);
            meshObject.quaternion.fromArray(nodeData.quaternion);
            meshObject.scale.fromArray(nodeData.scale);
            meshObject.name = nodeData.name;
            meshObject.userData.material = nodeData.material;
            meshes[nodeIndex] = meshObject;
        }

        // 附加场景信息
        geometry.userData.meshList = meshes;
        geometry.userData.sceneObject = sceneRoot;
    }

    return geometry;
}


