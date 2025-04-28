/**
 * justThreeJs stage3D.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/24 10:55:32
 */
import * as THREE from "three";
export default class Stage3D extends THREE.Scene {
    wasActive = null;
    isActive = null;

    constructor(e = {}) {
        super()
        Object.assign(this, {
            defaultCameraPosition: new THREE.Vector3(0, 0, 5),
            defaultLookAtPosition: new THREE.Vector3(0, 0, 0),
            properties: {}
        }, e)
    }

    preInit() {
    }

    init() {
    }

    resize(e, t) {
    }

    syncProperties(e) {
    }

    update(e) {
    }
}
