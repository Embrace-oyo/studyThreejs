import * as THREE from "three";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

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


class Simple1DNoise {
    static MAX_VERTICES = 512;
    static MAX_VERTICES_MASK = Simple1DNoise.MAX_VERTICES - 1;
    _scale = 1;
    _amplitude = 1;
    _r = [];

    constructor(e) {
        let t = e ? math.getSeedRandomFn(e) : Math.random;
        for (let r = 0; r < Simple1DNoise.MAX_VERTICES; ++r) this._r.push(t() - .5)
    }

    getVal(e) {
        const t = e * this._scale, r = Math.floor(t), n = t - r, o = n * n * (3 - 2 * n),
            l = r & Simple1DNoise.MAX_VERTICES_MASK, c = l + 1 & Simple1DNoise.MAX_VERTICES_MASK;
        return math.mix(this._r[l], this._r[c], o) * this._amplitude
    }

    getFbm(e, t) {
        let r = 0, n = .5;
        for (let o = 0; o < t; o++) r += n * this.getVal(e), e *= 2, n *= .5;
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

const _v$2 = new THREE.Vector3;

class BrownianMotion {
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

    constructor(base) {
        this.base = base
        this.rehash()
    }

    rehash() {
        for (let e = 0; e < 6; e++) this._times[e] = Math.random() * -1e4
    }

    update(e) {
        const t = e === void 0 ? 16.666666666666668 : e;
        if (this._enablePositionNoise) {
            for (let r = 0; r < 3; r++) this._times[r] += this._positionFrequency * t;
            _v$2.set(this._noise.getFbm(this._times[0], this._positionFractalLevel), this._noise.getFbm(this._times[1], this._positionFractalLevel), this._noise.getFbm(this._times[2], this._positionFractalLevel)), _v$2.multiply(this._positionScale), _v$2.multiplyScalar(this._positionAmplitude * BrownianMotion.FBM_NORM), this._position.copy(_v$2)
        }
        if (this._enableRotationNoise) {
            for (let r = 0; r < 3; r++) this._times[r + 3] += this._rotationFrequency * t;
            _v$2.set(this._noise.getFbm(this._times[3], this._rotationFractalLevel), this._noise.getFbm(this._times[4], this._rotationFractalLevel), this._noise.getFbm(this._times[5], this._rotationFractalLevel)), _v$2.multiply(this._rotationScale), _v$2.multiplyScalar(this._rotationAmplitude * BrownianMotion.FBM_NORM), this._euler.set(_v$2.x, _v$2.y, _v$2.z), this._rotation.setFromEuler(this._euler)
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

class DeviceOrientationControls {
    object = null;
    enabled = !0;
    hasValue = !1;
    deviceOrientation = {};
    screenOrientation = 0;
    alphaOffset = 0;
    zee = new THREE.Vector3(0, 0, 1);
    euler = new THREE.Euler;
    q0 = new THREE.Quaternion;
    q1 = new THREE.Quaternion(-Math.sqrt(.5), 0, 0, Math.sqrt(.5));
    _onBoundDeviceOrientationChangeEvent;
    _onBoundScreenOrientationChangeEvent;

    constructor(e) {
        this.object = e, this.object.rotation.reorder("YXZ"), this._onBoundDeviceOrientationChangeEvent = this._onDeviceOrientationChangeEvent.bind(this), this._onBoundScreenOrientationChangeEvent = this._onScreenOrientationChangeEvent.bind(this), this.connect()
    }

    _onDeviceOrientationChangeEvent(e) {
        this.deviceOrientation = e
    }

    _onScreenOrientationChangeEvent() {
        this.screenOrientation = window.orientation || 0
    }

    setObjectQuaternion(e, t, r, n, o) {
        this.euler.set(r, t, -n, "YXZ"), e.setFromEuler(this.euler), e.multiply(this.q1), e.multiply(this.q0.setFromAxisAngle(this.zee, -o))
    }

    connect() {
        this._onBoundScreenOrientationChangeEvent(), window.DeviceOrientationEvent !== void 0 && typeof window.DeviceOrientationEvent.requestPermission == "function" ? window.DeviceOrientationEvent.requestPermission().then(e => {
            e == "granted" && (window.addEventListener("orientationchange", this._onBoundScreenOrientationChangeEvent, !1), window.addEventListener("deviceorientation", this._onBoundDeviceOrientationChangeEvent, !1))
        }).catch(function (e) {
        }) : (window.addEventListener("orientationchange", this._onBoundScreenOrientationChangeEvent, !1), window.addEventListener("deviceorientation", this._onBoundDeviceOrientationChangeEvent, !1)), this.enabled = !0
    }

    disconnect() {
        window.removeEventListener("orientationchange", this._onBoundScreenOrientationChangeEvent, !1), window.removeEventListener("deviceorientation", this._onBoundDeviceOrientationChangeEvent, !1), this.enabled = !1
    }

    update() {
        if (this.enabled === !1) return;
        let e = this.deviceOrientation;
        if (e) {
            let t = e.alpha ? THREE.MathUtils.degToRad(e.alpha) + this.alphaOffset : 0,
                r = e.beta ? THREE.MathUtils.degToRad(e.beta) : 0, n = e.gamma ? THREE.MathUtils.degToRad(e.gamma) : 0,
                o = this.screenOrientation ? THREE.MathUtils.degToRad(this.screenOrientation) : 0;
            this.setObjectQuaternion(this.object.quaternion, t, r, n, o), this.hasValue = this.hasValue || e.alpha && e.beta && e.gamma
        }
    }

    dispose() {
        this.disconnect()
    }
}

export default class CameraControls {
    useOrbitControls = !1;

    constructor(base) {
        this.base = base
    }

    preInit(e) {
        this.DEFAULT_CAMERA_POSITION = new THREE.Vector3(0, 0, 5)
        this.DEFAULT_LOOKAT_POSITION = new THREE.Vector3(0, 0, 0)
        this._brownianMotion = null
        this._orbitControls = null
        this._orbitCamera = null
        this._deviceOrientationControls = null
        this._baseDeviceControlQuaternion = null
        this._targetDeviceControlQuaternion = null
        this._deviceOrientationCamera = null
        this._hasDeviceOrientationControlValues = !1
        this._q = new THREE.Quaternion
        this._e = new THREE.Euler
        this._v1 = new THREE.Vector3
        this._v2 = new THREE.Vector3
        this._camera = this.base.properties.camera
        this._deviceOrientationEuler = new THREE.Euler
        this._camera.position.copy(this.DEFAULT_CAMERA_POSITION)
        this._brownianMotion = new BrownianMotion(this)
        if (this.useOrbitControls === !0) {
            this._orbitCamera = this._camera.clone()
            this._orbitControls = new OrbitControls(this._orbitCamera, document.documentElement)
            this._orbitControls.enableDamping = !0
            this._orbitControls.target0.copy(this.DEFAULT_LOOKAT_POSITION)
            this._orbitControls.reset()
        }
        if (this.base.browser.isMobile) {
            this._deviceOrientationCamera = new THREE.Camera
            this._baseDeviceControlQuaternion = new THREE.Quaternion
            this._targetDeviceControlQuaternion = new THREE.Quaternion;
            let t = () => {
                this._deviceOrientationControls = new DeviceOrientationControls(this._deviceOrientationCamera)
                this._deviceOrientationControls.connect()
            };
            this.base.browser.isIOS ? this.base.properties.onFirstClicked.addOnce(t) : t()
        }
    }

    init() {
    }

    resize(e, t) {
    }

    update(e) {
        let t = this._camera;
        this.DEFAULT_CAMERA_POSITION.copy(this.base.properties.defaultCameraPosition)
        this.DEFAULT_LOOKAT_POSITION.copy(this.base.properties.defaultLookAtPosition)
        t.near = this.base.properties.cameraNear
        t.far = this.base.properties.cameraFar
        t.matrix.identity()
        t.matrix.decompose(t.position, t.quaternion, t.scale)
        t.position.copy(this.DEFAULT_CAMERA_POSITION)
        t.lookAt(this.DEFAULT_LOOKAT_POSITION)
        this.base.browser.isMobile && this._deviceOrientationControls && this._deviceOrientationControls.update()
        this.useOrbitControls === !0 && (this._orbitControls.update(), this._orbitCamera.updateMatrix(), this._orbitCamera.matrix.decompose(t.position, t.quaternion, t.scale))
        this._v1.set(0, 0, -1).applyQuaternion(t.quaternion)
        this.useOrbitControls === !0 ? this.cameraDistance = this._v2.copy(this._orbitControls.target).sub(t.position).dot(this._v1) : this.cameraDistance = this._v2.copy(this.DEFAULT_LOOKAT_POSITION).sub(t.position).dot(this._v1)
        this.base.properties.cameraUsePhysical ? (t.filmGauge = this.base.properties.cameraFilmGauge, t.setFocalLength(this.base.properties.cameraFocalLength)) : t.fov = this.base.properties.cameraFov;
        let r = t.fov;
        t.fov += this.base.properties.cameraDollyZoomFovOffset;
        let n = this.cameraDistance;
        n = n * Math.tan(r / 360 * Math.PI / 2) / Math.tan(t.fov / 360 * Math.PI / 2) - n
        t.translateZ(n)
        t.setViewOffset(this.base.properties.viewportWidth, this.base.properties.viewportHeight, this.base.properties.cameraViewportOffsetX, this.base.properties.cameraViewportOffsetY, this.base.properties.viewportWidth, this.base.properties.viewportHeight)
        t.fov = r
        this.cameraDistance += n
        if (this.base.browser.isMobile) {
            if (this._deviceOrientationControls) {
                this._deviceOrientationControls.update()
                if (this._deviceOrientationControls.hasValue) {
                    if (!this._hasDeviceOrientationControlValues) {
                        this._targetDeviceControlQuaternion.copy(this._deviceOrientationCamera.quaternion)
                        this._baseDeviceControlQuaternion.copy(this._deviceOrientationCamera.quaternion)
                    }
                    this._targetDeviceControlQuaternion.slerp(this._deviceOrientationCamera.quaternion, .15), this._baseDeviceControlQuaternion.slerp(this._targetDeviceControlQuaternion, .15)
                    this._q.copy(this._baseDeviceControlQuaternion).invert().multiply(this._targetDeviceControlQuaternion)
                    this._deviceOrientationEuler.setFromQuaternion(this._q)
                    this._hasDeviceOrientationControlValues = !0
                    t.quaternion.multiply(this._q)
                }
            }
        } else {
            t.translateZ(this.cameraDistance * -1);
            let o = math.clamp(this.base.input.mouseXY.y, -1, 1) * this.base.properties.cameraLookStrength
            let l = math.clamp(-this.base.input.mouseXY.x, -1, 1) * this.base.properties.cameraLookStrength;
            this.base.properties.cameraLookX += (o - this.base.properties.cameraLookX) * this.base.properties.cameraLookEaseDamp
            this.base.properties.cameraLookY += (l - this.base.properties.cameraLookY) * this.base.properties.cameraLookEaseDamp
            this._e.set(this.base.properties.cameraLookX, this.base.properties.cameraLookY, 0)
            this._q.setFromEuler(this._e)
            t.quaternion.multiply(this._q)
            t.translateZ(this.cameraDistance)
        }
        t.matrix.compose(t.position, t.quaternion, t.scale)
        this._brownianMotion.positionAmplitude = this.base.properties.cameraShakePositionStrength
        this._brownianMotion.positionFrequency = this.base.properties.cameraShakePositionSpeed
        this._brownianMotion.rotationAmplitude = this.base.properties.cameraShakeRotationStrength
        this._brownianMotion.rotationFrequency = this.base.properties.cameraShakeRotationSpeed
        this._brownianMotion.update(e), t.matrix.multiply(this._brownianMotion.matrix)
        t.matrix.decompose(t.position, t.quaternion, t.scale), this._v1.set(0, 0, -1).applyQuaternion(t.quaternion)
        this.useOrbitControls === !0 && (this.base.properties.cameraDistance = this._v2.copy(this._orbitControls.target).sub(t.position).dot(this._v1))
        t.updateMatrixWorld()
        this.base.properties.cameraDirection.set(0, 0, 1).applyMatrix4(t.matrixWorld).sub(this._v1.set(0, 0, 0).applyMatrix4(t.matrixWorld)).normalize()
    }
}
