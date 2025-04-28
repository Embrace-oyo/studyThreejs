/**
 * justThreeJs glPositionOffset.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/23 17:05:36
 */
import * as THREE from "three";

export default class GlPositionOffset {
    offset = new THREE.Vector2;
    shaderUniforms = {u_glPositionOffset: {value: null}};

    init() {
        this.shaderUniforms.u_glPositionOffset.value = this.offset
    }

    setOffset(e, t) {
        return this.offset.set(e, t)
    }
}
