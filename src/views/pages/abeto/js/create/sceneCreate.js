/**
 * justThreeJs sceneCreate.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/1 14:22:14
 */

import * as THREE from "three";

class CameraCreate extends THREE.PerspectiveCamera {
    constructor(base) {
        super(45, base.width / base.height, 0.01, 1e3)
        this.base = base;
        this.isBaseCamera = !0
        this.Fu = {SCREEN: 1, CUSTOM: 2}
        this._sizing = this.Fu.SCREEN
        this._size = new THREE.Vector2(base.width, base.height)
        this._firstUpdate = !0
        this._prevSize = this._size.clone()
        this._prevPosition = new THREE.Vector3
        this._prevTarget = new THREE.Vector3
        this._prevUp = new THREE.Vector3
        this._additionalSphericalPosition = new THREE.Spherical
        this._additionalSphericalTarget = new THREE.Spherical
        this._additionalRotationUp = 0
        this.target = new THREE.Vector3
        this.basePosition = new THREE.Vector3(0, 0, 6)
        this.baseTarget = new THREE.Vector3
        this.baseUp = new THREE.Vector3(0, 1, 0)
        this.displacement = {
            position: new THREE.Vector2,
            target: new THREE.Vector2,
            rotation: 0
        }
        this.lerpPosition = .035
        this.lerpTarget = .035
        this.lerpRotation = .035
        this.shake = new THREE.Vector3
        this.shakeSpeed = new THREE.Vector3(1, 1, 1)
        this.touchAmount = 1
        this.resetOnTouch = !0
    }

    _update() {

    }


    _resize() {
        this._sizing === this.Fu.SCREEN && this._size.set(this.base.width, this.base.height)
        if (!this._prevSize.equals(this._size)) {
            this._prevSize.copy(this._size)
            if (this.isPerspectiveCamera) {
                this.aspect = this._size.x / this._size.y
            } else {
                const n = this._size.x * .5
                const s = this._size.y * .5;
                this.left = -n
                this.right = n
                this.top = s
                this.bottom = -s
            }
            this.updateProjectionMatrix()
        }
    }

    setCustomSize(n, s) {
        this._sizing = this.Fu.CUSTOM
        this._size.set(n, s)
    }

}


export default class SceneCreate extends THREE.Scene {
    constructor(base) {
        super();
        this.camera = new CameraCreate(base);
        this.camera.matrixWorldAutoUpdate = !1
        this.composer = null
        this.matrixWorldAutoUpdate = !0
        this.matrixAutoUpdate = !1
        this.beforeRenderCbs = []
        this._textures = new Set
        this.customUploadRT = null
    }
}
