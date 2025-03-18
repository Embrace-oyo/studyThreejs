/**
 * justThreeJs flowMap.js
 * @author kongjianqiu
 * @description
 * @created 2025/3/17 16:38:46
 */

import * as THREE from "three";
import flowMapVertext from '@/views/pages/plaster/glsl/flowMap/vertex.glsl'
import flowMapFragment from '@/views/pages/plaster/glsl/flowMap/fragment.glsl'

export default class FlowMap {
    constructor(base, tNoise, uTime) {

        const r = this;
        this.base = base;
        this.renderer = this.base.renderer
        this.camera = new THREE.Camera();
        this.scene = new THREE.Scene();
        // this.camera = this.base.camera;
        // this.scene = this.base.scene;
        this.uniform = {
            value: null
        }
        const m = {
            type: /(iPad|iPhone|iPod)/g.test(navigator.userAgent) ? THREE.HalfFloatType : THREE.FloatType,
            depthBuffer: false
        };
        this.mask = {
            read: new THREE.WebGLRenderTarget(256, 256, m),
            write: new THREE.WebGLRenderTarget(256, 256, m),
            swap: () => {
                const m = r.mask.read;
                r.mask.read = r.mask.write
                r.mask.write = m
                r.uniform.value = r.mask.read.texture
            }
        }
        this.mask.swap()
        this.aspect = 1
        this.mouse = new THREE.Vector2()
        this.velocity = new THREE.Vector2()
        this.mouse2 = new THREE.Vector2()
        this.velocity2 = new THREE.Vector2()
        this.geometry = new THREE.BufferGeometry();
        this.geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3))
        this.geometry.setAttribute("uv", new THREE.BufferAttribute(new Float32Array([0, 0, 2, 0, 0, 2]), 2))
        this.material = new THREE.RawShaderMaterial({
            vertexShader: flowMapVertext,
            fragmentShader: flowMapFragment,
            uniforms: {
                tMap: r.uniform,
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
                tNoise: tNoise,
                uTime: uTime,
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
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.material.needsUpdate = true;
        this.scene.add(this.mesh);
        this.tick = this.tick.bind(this);
        this.base.tick.add(this.tick)

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
        this.mesh.material.uniforms.uAspect.value = this.aspect
        this.mesh.material.uniforms.uOffset.value = i;
        this.mesh.material.needsUpdate = true;
        this.renderer.setRenderTarget(this.mask.write)
        this.renderer.render(this.scene, this.camera)
        this.renderer.setRenderTarget(null)
        this.mask.swap()
    }

    tick(i, e) {
        const t = Math.min(i, 32) / 16;
        this.mesh.material.uniforms.uDeltaMult.value = t
    }
}
