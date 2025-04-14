/**
 * justThreeJs flowerCreate.js
 * @author kongjianqiu
 * @description
 * @created 2025/3/31 09:55:50
 */
import * as THREE from "three";
// glsl
import vertex from '@/views/pages/abeto/glsl/flower/vertex.glsl'
import fragment from '@/views/pages/abeto/glsl/flower/fragment.glsl'

export default class FlowerCreate {
    constructor(base, t = {}) {
        this.base = base;
        this.scene = this.base.mainScene;
        this.baseTime = 0
        this.additionalTime = 0
        this.additionalTimeTarget = 0
        this.additionalHold = 0
        this.additionalHoldTarget = 0
        this.touching = !1
        this.options = {petalCount: 38, ...t}
        this.init()
    }

    init() {
        this.geometry = this.base.petal;
        this.count = this.options.petalCount
        const float32Array = new Float32Array(this.count);
        for (let l = 0; l < this.count; l++) {
            float32Array[l] = Math.random();
        }
        const s = new THREE.InstancedBufferAttribute(float32Array, 1, !1, 1)
        this.geometry.setAttribute("random", s);
        this.material = new THREE.ShaderMaterial({
            uniformsGroups: [this.base.UBO],
            uniforms: {
                uCount: {value: this.count},
                uColor1: {value: new THREE.Color("#d88b3e")},
                uColor2: {value: new THREE.Color("#ddb94c")},
                uOutlineColor: {value: new THREE.Color("#b84a08")},
                tPetal: {value: this.base.petalTexture},
                tNoise: {value: this.base.noiseSimplexLayeredTexture},
                uFlowerTime: {value: 0}
            },
            side: THREE.DoubleSide,
            vertexShader: vertex,
            fragmentShader: fragment,
        })
        this.mesh = new THREE.Group()
        this.mesh.name = "flower";
        this.instancedMesh = new THREE.InstancedMesh(this.geometry, this.material, this.count)
        this.instancedMesh.rotation.x = 3.14159 * .5 - .5
        this.instancedMesh.rotation.z = 3.14159 * .05
        this.instancedMesh.position.y += .03
        this.instancedMesh.renderOrder = 3
        this.mesh.add(this.instancedMesh);
        this.instancedMesh.updateMatrixWorld();
        this.instancedMesh.matrixAutoUpdate = !1;
        this.instancedMesh.onBeforeRender = () => {
            this.additionalTime = this.base.utils.lerpFPS(this.additionalTime, this.additionalTimeTarget, .035)
            this.baseTime += this.base.timeStats.delta * .001
            this.additionalHoldTarget += this.touching ? this.base.timeStats.delta * .0025 : 0
            this.additionalHold = this.base.utils.lerpFPS(this.additionalHold, this.additionalHoldTarget, .035)
            this.material.uniforms.uFlowerTime.value = this.baseTime + this.additionalTime + this.additionalHold
            this.mesh.rotation.y = -this.scene.camera._additionalSphericalPosition.theta * 7
            this.mesh.rotation.x = this.scene.camera._additionalSphericalPosition.phi * 7
        }
        this.base.eventManage.on("wheel", this.onWheel.bind(this))
        this.base.eventManage.on("touch_drag", this.onTouchDrag.bind(this))
        this.base.eventManage.on("touch_start", this.onTouchStart.bind(this))
        this.base.eventManage.on("touch_end", this.onTouchEnd.bind(this))
        this.scene.add(this.mesh)
    }


    onWheel(e) {
        const t = Math.abs(e.delta.y) > Math.abs(e.delta.x) ? e.delta.y : e.delta.x;
        this.additionalTimeTarget += t * 65e-5 * (t < 0 ? 2 : 1)
    }

    onTouchDrag(e) {
        const t = Math.abs(e.delta11.y) > Math.abs(e.delta11.x) ? -e.delta11.y : e.delta11.x;
        this.additionalTimeTarget -= t * 2.5 * (t > 0 ? 1.5 : 1)
        Math.abs(e.dragged.x) + Math.abs(e.dragged.y) > 20 && (this.touching = !1)
    }

    onTouchStart() {
        this.touching = !0
    }

    onTouchEnd() {
        this.touching = !1
    }
}
