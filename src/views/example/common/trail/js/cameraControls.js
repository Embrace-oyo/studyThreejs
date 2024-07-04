import * as THREE from "three";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import BrownianMotion from '@/views/example/common/trail/js/brownianMotion'
import DeviceOrientationControls from '@/views/example/common/trail/js/deviceOrientationControls'


export default class CameraControls {
    useOrbitControls = !1;

    constructor(base) {
        this.base = base
    }

    preInit(e) {
        this.isMobile = false
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
        this._camera = this.base.camera
        this._deviceOrientationEuler = new THREE.Euler
        this._camera.position.copy(this.DEFAULT_CAMERA_POSITION)
        this._brownianMotion = new BrownianMotion
        if (this.useOrbitControls === !0) {
            this._orbitCamera = this._camera.clone()
            this._orbitControls = new OrbitControls(this._orbitCamera, document.documentElement)
            this._orbitControls.enableDamping = !0
            this._orbitControls.target0.copy(this.DEFAULT_LOOKAT_POSITION)
            this._orbitControls.reset()
        }
        if (this.isMobile) {
            this._deviceOrientationCamera = new THREE.Camera
            this._baseDeviceControlQuaternion = new THREE.Quaternion
            this._targetDeviceControlQuaternion = new THREE.Quaternion
            let t = () => {
                this._deviceOrientationControls = new DeviceOrientationControls(this._deviceOrientationCamera)
                this._deviceOrientationControls.connect()
            };
            t()
            // browser$1.isIOS ? this.base.properties.onFirstClicked.addOnce(t) : t()
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
        if (this.isMobile && this._deviceOrientationControls) this._deviceOrientationControls.update()
        if (this.useOrbitControls === !0) {
            this._orbitControls.update()
            this._orbitCamera.updateMatrix()
            this._orbitCamera.matrix.decompose(t.position, t.quaternion, t.scale)
        }
        this._v1.set(0, 0, -1).applyQuaternion(t.quaternion)
        if (this.useOrbitControls === !0) {
            this.cameraDistance = this._v2.copy(this._orbitControls.target).sub(t.position).dot(this._v1)
        } else {
            this.cameraDistance = this._v2.copy(this.DEFAULT_LOOKAT_POSITION).sub(t.position).dot(this._v1)
        }
        if (this.base.properties.cameraUsePhysical) {
            t.filmGauge = this.base.properties.cameraFilmGauge
            t.setFocalLength(this.base.properties.cameraFocalLength)
        } else {
            t.fov = this.base.properties.cameraFov
        }
        let r = t.fov;
        t.fov += this.base.properties.cameraDollyZoomFovOffset;
        let n = this.cameraDistance;
        n = n * Math.tan(r / 360 * Math.PI / 2) / Math.tan(t.fov / 360 * Math.PI / 2) - n
        t.translateZ(n)
        t.setViewOffset(this.base.width, this.base.height, this.base.properties.cameraViewportOffsetX, this.base.properties.cameraViewportOffsetY, this.base.width, this.base.height)
        t.fov = r
        this.cameraDistance += n
        if (this.isMobile) {
            if (this._deviceOrientationControls) {
                this._deviceOrientationControls.update()
                if (this._deviceOrientationControls.hasValue) {
                    if (!this._hasDeviceOrientationControlValues) {
                        this._targetDeviceControlQuaternion.copy(this._deviceOrientationCamera.quaternion)
                        this._baseDeviceControlQuaternion.copy(this._deviceOrientationCamera.quaternion)
                    }
                    this._targetDeviceControlQuaternion.slerp(this._deviceOrientationCamera.quaternion, .15)
                    this._baseDeviceControlQuaternion.slerp(this._targetDeviceControlQuaternion, .15)
                    this._q.copy(this._baseDeviceControlQuaternion).invert().multiply(this._targetDeviceControlQuaternion)
                    this._deviceOrientationEuler.setFromQuaternion(this._q)
                    this._hasDeviceOrientationControlValues = !0
                    t.quaternion.multiply(this._q)
                }
            }
        } else {
            t.translateZ(this.cameraDistance * -1);
            let o = THREE.MathUtils.clamp(this.base.mouseXY.y, -1, 1) * this.base.properties.cameraLookStrength
            let l = THREE.MathUtils.clamp(-this.base.mouseXY.x, -1, 1) * this.base.properties.cameraLookStrength;
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
        t.matrix.decompose(t.position, t.quaternion, t.scale)
        this._v1.set(0, 0, -1).applyQuaternion(t.quaternion)
        if (this.useOrbitControls === !0) {
            this.base.properties.cameraDistance = this._v2.copy(this._orbitControls.target).sub(t.position).dot(this._v1)
        }
        t.updateMatrixWorld()
        this.base.properties.cameraDirection.set(0, 0, 1).applyMatrix4(t.matrixWorld).sub(this._v1.set(0, 0, 0).applyMatrix4(t.matrixWorld)).normalize()
    }
}