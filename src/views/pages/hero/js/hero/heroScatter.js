/**
 * justThreeJs heroScatter.js
 * @author kongjianqiu
 * @description
 * @created 2025/3/24 14:15:49
 */
import * as THREE from "three";
import {easeInCubic} from 'easing-utils';
import {BrownianMotion} from "@/views/pages/hero/js/util/common.js";

export default class HeroScatter {

    shaderUniforms = {
        u_lightScatterDivider: {value: new THREE.Vector2(1.1, 5.5)},
        u_lightScatterPowInv: {value: 0},
        u_lightScatterRatio: {value: 0},
        u_lightScatterPos0: {value: new THREE.Vector3(0, 18, 0)},
        u_lightScatterPos1: {value: new THREE.Vector3(0, 0, 0)}
    };

    constructor(base) {
        this.base = base;
        this._brownianMotion0 = new BrownianMotion
        this._brownianMotion1 = new BrownianMotion
    }

    update() {
        let t = this.base.math.fit(this.base.introRatio, 0, .2, 2, .7);
        t = this.base.math.fit(this.base.introRatio, .7, .85, t, .4)
        this.shaderUniforms.u_lightScatterPowInv.value = t
        this.shaderUniforms.u_lightScatterRatio.value = this.base.math.fit(0, .7, .85, 1, 0, easeInCubic)
    }
}
