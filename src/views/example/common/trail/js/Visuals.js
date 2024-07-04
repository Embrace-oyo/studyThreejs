/**
 * justThreeJs Visuals.js
 * @author kongjianqiu
 * @description
 * @created 2024/7/4 16:37:03
 */

import * as THREE from "three";

class Stage3D extends THREE.Scene {
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

export default class Visuals {
    defaultStage3D = new Stage3D;
    currentStage3D = null;
    stage3DList = [];

    constructor(base) {
        this.base = base
    }


    preInit() {
    }

    init() {
    }

    start() {
    }

    resize(e, t) {
    }

    deactivateAll() {
        for (let e = 0; e < this.stage3DList.length; e++) {
            let t = this.stage3DList[e];
            t.isActive = !1
        }
    }

    syncProperties(e) {
        this.currentStage3D = this.defaultStage3D;
        for (let t = 0; t < this.stage3DList.length; t++) {
            let r = this.stage3DList[t];
            if (r.isActive === !0) {
                this.currentStage3D = r
                r.syncProperties(e);
                for (let n in r.properties) {
                    this.base.properties[n] = r.properties[n]
                }
            } else {
                r.isActive = !1
            }
        }
    }

    update(e) {
        this.currentStage3D.update(e)
        this.currentStage3D.visible = !0;
        for (let t = 0; t < this.stage3DList.length; t++) {
            let r = this.stage3DList[t];
            r.wasActive = r.isActive
        }
    }
}
