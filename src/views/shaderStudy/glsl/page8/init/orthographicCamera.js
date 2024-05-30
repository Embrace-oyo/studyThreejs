/**
 * justThreeJs orthographicCamera.js
 * @author kongjianqiu
 * @description
 * @created 2024/5/30 14:53:29
 */

import * as THREE from "three";

/**
 * A more friendly `THREE.OrthographicCamera`.
 */
export default class OrthographicCamera extends THREE.OrthographicCamera {
    frustum;
    useAspect;

    constructor(config = {}) {
        const aspect = window.innerWidth / window.innerHeight;
        const {frustum = 5.7, near = 0.1, far = 2000, useAspect = true} = config;
        const actualAspect = useAspect ? aspect : 1;
        super(actualAspect * frustum * -0.5, actualAspect * frustum * 0.5, frustum * 0.5, frustum * -0.5, near, far);
        this.frustum = frustum;
        this.useAspect = useAspect;
    }
}
