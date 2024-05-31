/**
 * justThreeJs orbitControls.js
 * @author kongjianqiu
 * @description
 * @created 2024/5/31 10:16:08
 */

import Component from '@/util/common/component'
import {OrbitControls as OrbitControlsImpl} from "three-stdlib";

/**
 * A drop-in orbitControls
 */
export default class OrbitControls extends Component {
    controls;

    constructor(base, config = {}) {
        super(base);
        const {enableDamping = true} = config;
        const controls = new OrbitControlsImpl(base.camera, base.renderer.domElement);
        this.controls = controls;
        controls.enableDamping = enableDamping;
    }

    update(time) {
        this.controls.update();
    }
}
