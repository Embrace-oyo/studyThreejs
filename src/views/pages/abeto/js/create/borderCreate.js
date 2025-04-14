/**
 * justThreeJs borderCreate.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/1 14:27:12
 */
import * as THREE from "three";
// glsl
import vertex from '@/views/pages/abeto/glsl/border/vertex.glsl'
import fragment from '@/views/pages/abeto/glsl/border/fragment.glsl'

export default class BorderCreate {
    constructor(base, t = {}) {
        this.base = base;
        this.options = {...t}
        this.init()
    }

    init() {
        const geometry = this.base.border;
        const t = this.base.border.attributes.position.array;
        for (let s = 0; s < t.length; s++) {
            t[s] = Math.round(t[s]);
        }
        const material = new THREE.ShaderMaterial({
            uniformsGroups: [this.base.UBO],
            uniforms: {
                uBorderSizePixels: {value: 64},
                uNotchSizePixels: {value: new THREE.Vector2(384, 103)},
                uColor1: {value: new THREE.Color("#ecc168")},
                uColor2: {value: new THREE.Color("#ffec95")},
                tNoise: {value: this.base.noiseSimplexLayeredTexture},
                uRes: {value: new THREE.Vector2(this.base.screen.width, this.base.screen.height)}
            },
            vertexShader: vertex,
            fragmentShader: fragment,
            depthTest: !1
        })
        this.mesh = new THREE.Mesh(geometry, material)
        this.mesh.name = "border"
        this.mesh.renderOrder = 2
        this.mesh.updateMatrixWorld()
        this.mesh.matrixAutoUpdate = !1
        this.resize({w: this.base.screen.width, h: this.base.screen.height})
        this.base.eventManage.on("resize", this.resize.bind(this))
        this.base.mainScene.add(this.mesh)

    }

    resize({w, h}) {
        this.mesh.material.uniforms.uRes.value.set(w, h)
    }
}
