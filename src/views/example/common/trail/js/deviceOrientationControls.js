import * as THREE from "three";

export default class DeviceOrientationControls {
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
        this.object = e
        this.object.rotation.reorder("YXZ")
        this._onBoundDeviceOrientationChangeEvent = this._onDeviceOrientationChangeEvent.bind(this)
        this._onBoundScreenOrientationChangeEvent = this._onScreenOrientationChangeEvent.bind(this)
        this.connect()
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
        this._onBoundScreenOrientationChangeEvent()
        if (window.DeviceOrientationEvent !== void 0 && typeof window.DeviceOrientationEvent.requestPermission == "function") {
            window.DeviceOrientationEvent.requestPermission().then(e => {
                if (e == "granted") {
                    window.addEventListener("orientationchange", this._onBoundScreenOrientationChangeEvent, !1)
                    window.addEventListener("deviceorientation", this._onBoundDeviceOrientationChangeEvent, !1)
                }
            }).catch(function (e) {
            })
        } else {
            window.addEventListener("orientationchange", this._onBoundScreenOrientationChangeEvent, !1)
            window.addEventListener("deviceorientation", this._onBoundDeviceOrientationChangeEvent, !1)
        }
        this.enabled = !0
    }

    disconnect() {
        window.removeEventListener("orientationchange", this._onBoundScreenOrientationChangeEvent, !1)
        window.removeEventListener("deviceorientation", this._onBoundDeviceOrientationChangeEvent, !1)
        this.enabled = !1
    }

    update() {
        if (this.enabled === !1) return;
        let e = this.deviceOrientation;
        if (e) {
            let t = e.alpha ? THREE.MathUtils.degToRad(e.alpha) + this.alphaOffset : 0
            let r = e.beta ? THREE.MathUtils.degToRad(e.beta) : 0
            let n = e.gamma ? THREE.MathUtils.degToRad(e.gamma) : 0
            let o = this.screenOrientation ? THREE.MathUtils.degToRad(this.screenOrientation) : 0;
            this.setObjectQuaternion(this.object.quaternion, t, r, n, o)
            this.hasValue = this.hasValue || e.alpha && e.beta && e.gamma
        }
    }

    dispose() {
        this.disconnect()
    }
}