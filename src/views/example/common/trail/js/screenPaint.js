/**
 * justThreeJs screenPaint.js
 * @author kongjianqiu
 * @description
 * @created 2024/7/4 14:35:23
 */

import * as THREE from "three";

function _sfc32(a, e, t, r) {
    return function () {
        a |= 0, e |= 0, t |= 0, r |= 0;
        var n = (a + e | 0) + r | 0;
        return r = r + 1 | 0, a = e ^ e >>> 9, e = t + (t << 3) | 0, t = t << 21 | t >>> 11, t = t + n | 0, (n >>> 0) / 4294967296
    }
}

class MathUtils {
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

    fit(e, t, r, n, o, l) {
        return e = this.cUnMix(t, r, e), l && (e = l(e)), n + e * (o - n)
    }

    unClampedFit(e, t, r, n, o, l) {
        return e = this.unMix(t, r, e), l && (e = l(e)), n + e * (o - n)
    }

    lerp(e, t, r) {
        return e * (1 - r) + t * r
    }

    loop(e, t, r) {
        return e -= t, r -= t, (e < 0 ? (r - Math.abs(e) % r) % r : e % r) + t
    }

    normalize(e, t, r) {
        return Math.max(0, Math.min(1, e - t / r - t))
    }

    smoothstep(e, t, r) {
        return r = this.cUnMix(e, t, r), r * r * (3 - r * 2)
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
        let o = Math.sin(n - t) * Math.cos(r),
            l = Math.cos(e) * Math.sin(r) - Math.sin(e) * Math.cos(r) * Math.cos(n - t);
        return Math.atan2(o, l)
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
        let o = Math.sin((r - e) / 2), l = Math.sin((n - t) / 2), c = o * o + Math.cos(e) * Math.cos(r) * l * l;
        return 2 * Math.atan2(Math.sqrt(c), Math.sqrt(1 - c))
    }

    cubicBezier(e, t, r, n, o) {
        let l = (t - e) * 3, c = (r - t) * 3 - l, u = n - e - l - c, f = o * o, p = f * o;
        return u * p + c * f + l * o + e
    }

    cubicBezierFn(e, t, r, n) {
        let o = (t - e) * 3, l = (r - t) * 3 - o, c = n - e - o - l;
        return u => {
            let f = u * u, p = f * u;
            return c * p + l * f + o * u + e
        }
    }

    normalizeAngle(e) {
        return e += this.PI, e = e < 0 ? this.PI2 - Math.abs(e % PI2) : e % this.PI2, e -= this.PI, e
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
        const n = e >> 16, o = e >> 8 & 255, l = e & 255, c = t >> 16, u = t >> 8 & 255, f = t & 255,
            p = n + r * (c - n), g = o + r * (u - o), v = l + r * (f - l);
        return (p << 16) + (g << 8) + (v | 0)
    }

    getSeedRandomFn(e) {
        let t = 1779033703, r = 3144134277, n = 1013904242, o = 2773480762;
        for (let l = 0, c; l < e.length; l++) c = e.charCodeAt(l), t = r ^ Math.imul(t ^ c, 597399067), r = n ^ Math.imul(r ^ c, 2869860233), n = o ^ Math.imul(n ^ c, 951274213), o = t ^ Math.imul(o ^ c, 2716044179);
        return _sfc32(Math.imul(n ^ t >>> 18, 597399067), Math.imul(o ^ r >>> 22, 2869860233), Math.imul(t ^ n >>> 17, 951274213), Math.imul(r ^ o >>> 19, 2716044179))
    }
}

const math = new MathUtils()
let frag$n = `#define GLSLIFY 1
uniform sampler2D u_lowPaintTexture;uniform sampler2D u_prevPaintTexture;uniform vec2 u_paintTexelSize;uniform vec2 u_scrollOffset;uniform vec4 u_drawFrom;uniform vec4 u_drawTo;uniform float u_pushStrength;uniform vec3 u_dissipations;uniform vec2 u_vel;varying vec2 v_uv;vec2 sdSegment(in vec2 p,in vec2 a,in vec2 b){vec2 pa=p-a,ba=b-a;float h=clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0);return vec2(length(pa-ba*h),h);}
#ifdef USE_NOISE
uniform float u_curlScale;uniform float u_curlStrength;vec2 hash(vec2 p){vec3 p3=fract(vec3(p.xyx)*vec3(.1031,.1030,.0973));p3+=dot(p3,p3.yzx+33.33);return fract((p3.xx+p3.yz)*p3.zy)*2.0-1.0;}vec3 noised(in vec2 p){vec2 i=floor(p);vec2 f=fract(p);vec2 u=f*f*f*(f*(f*6.0-15.0)+10.0);vec2 du=30.0*f*f*(f*(f-2.0)+1.0);vec2 ga=hash(i+vec2(0.0,0.0));vec2 gb=hash(i+vec2(1.0,0.0));vec2 gc=hash(i+vec2(0.0,1.0));vec2 gd=hash(i+vec2(1.0,1.0));float va=dot(ga,f-vec2(0.0,0.0));float vb=dot(gb,f-vec2(1.0,0.0));float vc=dot(gc,f-vec2(0.0,1.0));float vd=dot(gd,f-vec2(1.0,1.0));return vec3(va+u.x*(vb-va)+u.y*(vc-va)+u.x*u.y*(va-vb-vc+vd),ga+u.x*(gb-ga)+u.y*(gc-ga)+u.x*u.y*(ga-gb-gc+gd)+du*(u.yx*(va-vb-vc+vd)+vec2(vb,vc)-va));}
#endif
void main(){vec2 res=sdSegment(gl_FragCoord.xy,u_drawFrom.xy,u_drawTo.xy);vec2 radiusWeight=mix(u_drawFrom.zw,u_drawTo.zw,res.y);float d=1.0-smoothstep(-0.01,radiusWeight.x,res.x);vec4 lowData=texture2D(u_lowPaintTexture,v_uv-u_scrollOffset);vec2 velInv=(0.5-lowData.xy)*u_pushStrength;
#ifdef USE_NOISE
vec3 noise3=noised(gl_FragCoord.xy*u_curlScale*(1.0-lowData.xy));vec2 noise=noised(gl_FragCoord.xy*u_curlScale*(2.0-lowData.xy*(0.5+noise3.x)+noise3.yz*0.1)).yz;velInv+=noise*(lowData.z+lowData.w)*u_curlStrength;
#endif
vec4 data=texture2D(u_prevPaintTexture,v_uv-u_scrollOffset+velInv*u_paintTexelSize);data.xy-=0.5;vec4 delta=(u_dissipations.xxyz-1.0)*data;vec2 newVel=u_vel*d;delta+=vec4(newVel,radiusWeight.yy*d);delta.zw=sign(delta.zw)*max(vec2(0.004),abs(delta.zw));data+=delta;data.xy+=0.5;gl_FragColor=clamp(data,vec4(0.0),vec4(1.0));}`;
let _v$4 = new THREE.Vector2;


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
            },
            fragmentShader: frag$n
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
        let n = this._prevPaintRenderTarget;
        this._prevPaintRenderTarget = this._currPaintRenderTarget
        this._currPaintRenderTarget = n
        this.sharedUniforms.u_prevPaintTexture.value = this._prevPaintRenderTarget.texture
        this.sharedUniforms.u_currPaintTexture.value = this._currPaintRenderTarget.texture;
        let o = this.base.scrollManager.scrollViewDelta * this.base.properties.screenPaintOffsetRatio
        let l = this.base.scrollManager.isVertical ? 0 : o
        let c = this.base.scrollManager.isVertical ? o : 0;
        _v$4.copy(this.base.input.mousePixelXY)
        _v$4.x += l * this.base.properties.viewportWidth * 3
        _v$4.y += c * this.base.properties.viewportHeight * 3;
        let u = _v$4.distanceTo(this.base.input.prevMousePixelXY)
        let f = math.fit(u, 0, this.radiusDistanceRange, this.minRadius, this.maxRadius);
        if (Math.abs(this.base.scrollManager.scrollViewDelta) == 0 && (!this.base.input.hadMoved || !this.drawEnabled || (this.needsMouseDown || this.base.browser.isMobile) && (!this.base.input.isDown || !this.base.input.wasDown))) {
            f = 0
        }
        f = f / this.base.properties.viewportHeight * r
        this._material.uniforms.u_pushStrength.value = this.pushStrength
        this._material.uniforms.u_curlScale.value = this.curlScale
        this._material.uniforms.u_curlStrength.value = this.curlStrength
        this._material.uniforms.u_dissipations.value.set(this.velocityDissipation, this.weight1Dissipation, this.weight2Dissipation)
        this._fromDrawData.copy(this._toDrawData)
        _v$4.copy(this.base.input.mouseXY)
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
