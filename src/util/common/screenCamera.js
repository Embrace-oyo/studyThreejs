/**
 * justThreeJs screenCamera.js
 * @author kongjianqiu
 * @description
 * @created 2024/5/30 15:21:29
 */


/**
 * This camera can make the pixel unit of a WebGL element equals with one of a HTML Element. If combined with [maku.js](https://github.com/alphardex/maku.js), you can easily merge HTML with WebGL!
 *
 * Demo: https://kokomi-js.vercel.app/examples/#screenCamera
 */

import * as THREE from "three";
import {getScreenFov} from "maku.js";
import Component from "@/util/common/component.js";

export default class ScreenCamera extends Component {
    camera;

    constructor(base, config = {}) {
        super(base);
        const {position = new THREE.Vector3(0, 0, 600), near = 100, far = 2000,} = config;
        const fov = getScreenFov(position.z);
        const container = base.container;
        const aspect = container.clientWidth / container.clientHeight;
        const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        camera.position.copy(position);
        this.camera = camera;
    }

    addExisting() {
        this.base.camera = this.camera;
        this.base.interactionManager.camera = this.camera;
    }
}
