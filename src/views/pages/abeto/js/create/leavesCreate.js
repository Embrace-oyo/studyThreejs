/**
 * justThreeJs leavesCreate.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/1 14:20:02
 */
import * as THREE from "three";
import {FullScreenQuad} from 'three/addons/postprocessing/Pass.js';

// glsl
import vertex from '@/views/pages/abeto/glsl/leaves/vertex.glsl'
import fragment from '@/views/pages/abeto/glsl/leaves/fragment.glsl'
import vertex2 from '@/views/pages/abeto/glsl/leaves/vertex2.glsl'
import fragment2 from '@/views/pages/abeto/glsl/leaves/fragment2.glsl'


class CreateMesh extends THREE.InstancedMesh {
    constructor(base) {
        super(base.geometry, base.material, base.options.count)
        this.base = base;
        this.renderer = this.base.base.renderer.webgl;
        this.isParticlesGPU = true
        this.name = "GPU Particles"
        this.particlesCount = base.options.count
        this.frustumCulled = false;
        const s = THREE.FloatType;
        const r = Math.max(2, this.base.base.utils.ceilPowerOfTwo(Math.sqrt(this.particlesCount)));
        this.rt1 = new THREE.WebGLMultipleRenderTargets(r, r, this.base.data.textures || 1, {
            wrapS: THREE.ClampToEdgeWrapping,
            wrapT: THREE.ClampToEdgeWrapping,
            minFilter: THREE.NearestFilter,
            magFilter: THREE.NearestFilter,
            format: THREE.RGBAFormat,
            type: s,
            depthBuffer: !1
        })
        this.rt2 = this.rt1.clone()
        this.rtCurrent = 0
        this.fsQuad = new FullScreenQuad(null)
        if (this.base.data.initialTextures && this.base.data.initialTextures.length > 0) {
            const uniforms = {};
            this.base.data.initialTextures.forEach((u, d) => {
                uniforms[`tTexture${d + 1}`] = {value: u}
            });
            const material = new THREE.ShaderMaterial({
                uniforms,
                vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = vec4(position, 1.0);
                }
                `,
                fragmentShader: `
                varying vec2 vUv;
                #define outTex1 pc_fragColor
                uniform sampler2D tTexture1;
                layout(location = 1) out highp vec4 outTex2;
                uniform sampler2D tTexture2;
                void main() {
                    outTex1 = texture2D(tTexture1, vUv);
                    outTex2 = texture2D(tTexture2, vUv);
                }
                `
            })
            this.fsQuad.material = material;
            const c = this.renderer.autoClear
            const h = this.renderer.getRenderTarget();
            this.renderer.autoClear = !1
            this.renderer.setRenderTarget(this.rt1)
            this.fsQuad.render(this.renderer)
            this.renderer.setRenderTarget(this.rt2)
            this.fsQuad.render(this.renderer)
            this.renderer.autoClear = c
            this.renderer.setRenderTarget(h)
            material.dispose()
        }
        this.computationMaterial = this.base.data.material
        this.fsQuad.material = this.computationMaterial
        this.base.data.afterCompute && (this.afterCompute = this.base.data.afterCompute)
        this.base.data.autoCompute !== !1 && (this.onBeforeRender = this.compute.bind(this))
    }

    compute(renderer, scene, camera) {
        const r = this.computationMaterial.uniforms.uModelMatrix;
        const a = this.computationMaterial.uniforms.uViewMatrix;
        const o = this.computationMaterial.uniforms.uProjMatrix;
        r && r.value.copy(this.matrixWorld);
        a && a.value.copy(camera.matrixWorldInverse);
        o && o.value.copy(camera.projectionMatrix);
        const l = this.rtCurrent === 0 ? this.rt1 : this.rt2;
        const c = this.rtCurrent === 0 ? this.rt2 : this.rt1;
        this.rtCurrent = (this.rtCurrent + 1) % 2;
        for (let f = 0; f < c.texture.length; f++) {
            const A = this.computationMaterial.uniforms[`tTexture${f + 1}`];
            A && (A.value = c.texture[f])
        }
        const h = renderer.autoClear;
        renderer.autoClear = !1;
        const u = renderer.getRenderTarget();
        renderer.setRenderTarget(l)
        renderer.getClearColor(new THREE.Color);
        const d = renderer.getClearAlpha();
        renderer.setClearColor(new THREE.Color('#000000'), 0)
        renderer.clear(!0, !1, !1)
        this.fsQuad.render(renderer)
        renderer.autoClear = h
        renderer.setRenderTarget(u)
        renderer.setClearColor(new THREE.Color, d);
        for (let f = 0; f < l.texture.length; f++) {
            const A = this.material.uniforms[`tTexture${f + 1}`];
            A && (A.value = l.texture[f]);
            const g = this.material.uniforms[`tTexture${f + 1}Prev`];
            g && (g.value = c.texture[f])
        }
        this.afterCompute && this.afterCompute(renderer, scene, camera)
    }

    dispose() {
        let t;
        this.fsQuad.dispose();
        this.computationMaterial.dispose();
        this.rt1.dispose();
        this.rt2.dispose();
        (t = super.dispose) == null || t.call(this)
    }
}

export default class LeavesCreate {
    constructor(base, t = {}) {
        this.base = base;
        this.options = {count: 140, ...t}
        this.init()
    }

    init() {
        const t = this.options.count
        const n = Math.max(2, this.base.utils.ceilPowerOfTwo(Math.sqrt(t)))
        const s = new Float32Array(n * n * 4);
        for (let o = 0; o < t; o++) {
            s[o * 4 + 0] = Math.random() * 32 - 16
            s[o * 4 + 1] = Math.random() * 12 - 6
            s[o * 4 + 2] = -2 - Math.random() * 6
            s[o * 4 + 3] = Math.random();
        }
        this.dataTextureR = new THREE.DataTexture(s, n, n, THREE.RGBAFormat, THREE.FloatType);
        this.dataTextureR.needsUpdate = !0;
        this.dataTextureA = new THREE.DataTexture(new Float32Array(n * n * 4), n, n, THREE.RGBAFormat, THREE.FloatType);
        this.dataTextureA.needsUpdate = !0
        this.data = {
            textures: 2,
            initialTextures: [this.dataTextureR, this.dataTextureA],
            material: new THREE.ShaderMaterial({
                uniformsGroups: [this.base.UBO],
                uniforms: {
                    tTexture1: {value: null},
                    tTexture2: {value: null},
                    tVel: this.base.mainScene.fluidSim.velUniform,
                    uViewMatrix: {value: new THREE.Matrix4},
                    uModelMatrix: {value: new THREE.Matrix4},
                    uProjMatrix: {value: new THREE.Matrix4}
                },
                vertexShader: vertex2,
                fragmentShader: fragment2
            })
        }
        this.createGeometry();
        this.createMaterial();
        this.createMesh();
    }

    createGeometry() {
        const clone = this.base.leaf.clone();
        this.geometry = new THREE.InstancedBufferGeometry()
        this.geometry.instanceCount = this.options.count;
        clone.index && this.geometry.setIndex(clone.index);
        for (const h in clone.attributes) {
            this.geometry.setAttribute(h, clone.attributes[h])
        }
        const s = []
        const r = []
        const a = Math.max(2, this.base.utils.ceilPowerOfTwo(Math.sqrt(this.options.count)))
        const o = 1 / a * .5;
        for (let c = 0; c < this.options.count; c++) {
            s.push(Math.random(), Math.random(), Math.random(), Math.random());
            const h = c % a / a + o
            const u = Math.floor(c / a) / a + o;
            r.push(h, u)
        }
        this.geometry.setAttribute("rand", new THREE.InstancedBufferAttribute(new Float32Array(s), 4))
        this.geometry.setAttribute("texuv", new THREE.InstancedBufferAttribute(new Float32Array(r), 2))
    }

    createMaterial() {
        this.material = new THREE.ShaderMaterial({
            uniformsGroups: [this.base.UBO],
            uniforms: {
                tTexture1: {value: null},
                tTexture2: {value: this.dataTextureA},
                uCount: {value: this.options.count},
                uColor1: {value: new THREE.Color("#886a3d")},
                uOutlineColor: {value: new THREE.Color("#904619")},
                tPetal: {value: this.base.leafTexture},
                tNoise: {value: this.base.noiseSimplexLayeredTexture}
            },
            vertexShader: vertex,
            fragmentShader: fragment,
            depthTest: !1
        })
    }

    createMesh() {
        this.mesh = new CreateMesh(this);
        this.mesh.name = "leaves"
        this.mesh.renderOrder = 1
        this.mesh.updateMatrixWorld()
        this.mesh.matrixAutoUpdate = !1
        this.base.mainScene.add(this.mesh);
    }

}
