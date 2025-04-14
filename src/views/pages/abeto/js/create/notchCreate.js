/**
 * justThreeJs notchCreate.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/1 14:27:49
 */
import * as THREE from "three";

//glsl
import vertex from '@/views/pages/abeto/glsl/notch/vertex.glsl'
import fragment from '@/views/pages/abeto/glsl/notch/fragment.glsl'

export default class NotchCreate {
    constructor(base, t = {}) {
        this.base = base;
        this.imageAspect = 1
        this.options = {...t}
        this.init()
    }

    init() {
        const geometry = new THREE.PlaneGeometry();
        geometry.translate(-.5, .5, 0);
        const material = new THREE.ShaderMaterial({
            uniformsGroups: [this.base.UBO],
            uniforms: {
                uColor1: {value: new THREE.Color("#ecc168")},
                uColor2: {value: new THREE.Color("#9f4a16")},
                tNoise: {value: this.base.noiseSimplexLayeredTexture},
                tMap: {value: this.base.emailTexture}
            },
            depthTest: !1,
            vertexShader: vertex,
            fragmentShader: fragment
        })
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.renderOrder = 3
        this.base.mainScene.add(this.mesh)
      /*  this.interaction = new hf({
            camera: this.base.mainScene.camera,
            meshes: this.mesh,
            hoverCursor: !0,
            onHover: n => {
            },
            onClick: n => {
                window.location.href = "mailto:hi@abeto.co"
            }
        })
        this.imageAspect = material.uniforms.tMap.value.image.width / material.uniforms.tMap.value.image.height
        this.base.mainScene.beforeRenderCbs.push(this.positionMesh.bind(this))
        this.interaction.enable()*/
    }

    positionMesh() {
        const t = 200 / this.imageAspect
        const n = 11
        const s = 15;
        ja.positionUI({
            camera: this.base.mainScene.camera,
            mesh: this.mesh,
            x: this.base.screen.width - n,
            y: this.base.screen.height - s,
            width: 200,
            height: t
        })
    }
}
