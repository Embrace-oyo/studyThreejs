/**
 * justThreeJs flowMap.js
 * @author kongjianqiu
 * @description
 * @created 2025/3/13 13:30:20
 */
import * as THREE from "three";
import flowMapVertex from "@/views/pages/plaster/glsl/flowMap/vertex.glsl";
import flowMapFragment from "@/views/pages/plaster/glsl/flowMap/fragment.glsl";

export default class FlowMap {
    constructor(base) {
        this.base = base;
        this.dateTime = performance.now();
        this.renderer = this.base.renderer;
        this.camera = new THREE.Camera();
        this.scene = new THREE.Scene();
        this.uniform = {
            value: null
        }
        this.mask = {
            read: new THREE.WebGLRenderTarget(256, 256, {
                type: THREE.FloatType,
                depthBuffer: !1
            }),
            write: new THREE.WebGLRenderTarget(256, 256, {
                type: THREE.FloatType,
                depthBuffer: !1
            }),
            swap: () => {
                const m = this.mask.read;
                this.mask.read = this.mask.write
                this.mask.write = m
                this.uniform.value = this.mask.read.texture
            }
        }
        this.mask.swap()
        this.aspect = 1;
        this.mouse = new THREE.Vector2();
        this.velocity = new THREE.Vector2();
        this.mouse2 = new THREE.Vector2();
        this.velocity2 = new THREE.Vector2();
        this.mesh = this.createMesh();
        this.scene.add(this.mesh);
        this.setDissipation(0.953)
        this.setFalloff(0.38)
        this.setAlpha(1)
    }

    createMesh() {
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3))
        geometry.setAttribute("uv", new THREE.BufferAttribute(new Float32Array([0, 0, 2, 0, 0, 2]), 2))
        const material = new THREE.RawShaderMaterial({
            vertexShader: flowMapVertex,
            fragmentShader: flowMapFragment,
            uniforms: {
                tMap: this.uniform,
                uFalloff: {
                    value: 0.5 * .5
                },
                uAlpha: {
                    value: 0.3
                },
                uDissipation: {
                    value: 0.98
                },
                uDeltaMult: {
                    value: 1
                },
                tNoise: {
                    value: this.base.maskNoise
                },
                uTime: {
                    value: 0
                },
                uAspect: {
                    value: 1
                },
                uMouse: {
                    value: this.mouse
                },
                uVelocity: {
                    value: this.velocity
                },
                uMouse2: {
                    value: this.mouse2
                },
                uVelocity2: {
                    value: this.velocity2
                },
                uOffset: {
                    value: 0
                }
            },
            depthTest: !1
        })
        return new THREE.Mesh(geometry, material);
    }

    setFalloff(i) {
        this.mesh.material.uniforms.uFalloff.value = i * .5
    }

    setDissipation(i) {
        this.mesh.material.uniforms.uDissipation.value = i
    }

    setAlpha(i) {
        this.mesh.material.uniforms.uAlpha.value = i
    }

    update(i = 0) {
        this.mouse.lerp(this.base.normalFlip, 0.4)
        this.velocity.lerp(this.base.velocity, this.base.velocity.length() ? .1 : .04)
        console.log()
        this.mesh.material.uniforms.uAspect.value = this.aspect
        this.mesh.material.uniforms.uOffset.value = i;
        const e = this.renderer.getRenderTarget();
        this.renderer.setRenderTarget(this.mask.write)
        this.renderer.render(this.scene, this.camera)
        this.renderer.setRenderTarget(e)
        this.mask.swap()
    }

    tick(e) {
        const t = Math.min(e, 32) / 16;
        this.mesh.material.uniforms.uDeltaMult.value = t
    }
}
