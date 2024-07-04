import * as THREE from "three";
import Simple1DNoise from '@/views/example/common/trail/js/simple1DNoise'

export default class BrownianMotion {
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
    _v$2 = new THREE.Vector3
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