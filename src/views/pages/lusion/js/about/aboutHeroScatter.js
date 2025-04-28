/**
 * justThreeJs this.parent.aboutHeroScatter.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/26 01:33:27
 */
import * as THREE from "three";
import BrownianMotion from '@/views/pages/lusion/js/utils/brownianMotion'
import {easeInCubic} from 'easing-utils';

export default class AboutHeroScatter {
    // 共享 Uniforms，用于光散射的控制参数
    shaderUniforms = {
        u_lightScatterDivider: {value: new THREE.Vector2(1.1, 5.5)}, // 控制散射方向强度分布
        u_lightScatterPowInv: {value: 0},                      // 逆指数控制（动态）
        u_lightScatterRatio: {value: 0},                       // 散射强度比（动态）
        u_lightScatterPos0: {value: new THREE.Vector3(0, 18, 0)},    // 散射光源位置0
        u_lightScatterPos1: {value: new THREE.Vector3(0, 0, 0)}      // 散射光源位置1
    };

    constructor(base) {
        this.parent = base;
        this.base = base.base;
        // 两个布朗运动实例用于动态扰动光源位置（可扩展）
        this._brownianMotion0 = new BrownianMotion();
        this._brownianMotion1 = new BrownianMotion();
    }

    init() {
    }

    update(dt) {
        // 根据 introRatio 动态调整散射参数

        // powInv 值根据 introRatio 分两段线性过渡
        let powInv = this.base.math.fit(this.parent.introRatio, 0, 0.2, 2, 0.7);
        powInv = this.base.math.fit(this.parent.introRatio, 0.7, 0.85, powInv, 0.4);

        this.shaderUniforms.u_lightScatterPowInv.value = powInv;

        // 散射强度比使用 cubicIn 曲线渐变
        this.shaderUniforms.u_lightScatterRatio.value = this.base.math.fit(
            this.parent.introRatio, 0.7, 0.85, 1, 0, easeInCubic
        );
    }
}
