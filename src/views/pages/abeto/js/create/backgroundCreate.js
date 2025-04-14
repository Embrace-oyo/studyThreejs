/**
 * justThreeJs backgroundCreate.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/1 14:26:29
 */
import * as THREE from "three";
// glsl

import vertex from '@/views/pages/abeto/glsl/background/vertex.glsl'
import fragment from '@/views/pages/abeto/glsl/background/fragment.glsl'

export default class BackgroundCreate {
    constructor(base, t = {}) {
        this.base = base;
        this.option = {...t}
        this.init()
    }

    init() {
        const geometry = new THREE.PlaneGeometry(20, 20, 2, 2)
        const material = new THREE.ShaderMaterial({
            uniformsGroups: [this.base.UBO],
            uniforms: {
                uColor1: {value: new THREE.Color("#ffec95")},
                uColor2: {value: new THREE.Color("#ecc168")},
                tNoise: {value: this.base.noiseSimplexLayeredTexture}
            },
            vertexShader: vertex,
            fragmentShader: fragment,
            depthTest: !1,
        })

        this.mesh = new THREE.Mesh(geometry, material)
        this.mesh.name = "background"
        this.mesh.renderOrder = 0
        this.mesh.updateMatrixWorld()
        this.mesh.matrixAutoUpdate = !1
        this.base.mainScene.add(this.mesh)
    }
}
