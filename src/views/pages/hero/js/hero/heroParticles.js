/**
 * justThreeJs heroParticles.js
 * @author kongjianqiu
 * @description
 * @created 2025/3/24 11:33:52
 */

import * as THREE from "three";

// glsl
import vertex from '@/views/pages/hero/glsl/heroParticles/vertex.glsl'
import fragment from '@/views/pages/hero/glsl/heroParticles/fragment.glsl'
import emissiveVertex from '@/views/pages/hero/glsl/heroParticles/emissiveVertex.glsl'
import emissiveFragment from '@/views/pages/hero/glsl/heroParticles/emissiveFragment.glsl'
import motionVert from '@/views/pages/hero/glsl/heroParticles/motionVert.glsl'
import motionFrag from '@/views/pages/hero/glsl/heroParticles/motionFrag.glsl'
import lightFieldVert from '@/views/pages/hero/glsl/heroParticles/lightFieldVert.glsl'
import lightFieldFrag from '@/views/pages/hero/glsl/heroParticles/lightFieldFrag.glsl'

export default class HeroParticles {
    container = new THREE.Object3D;
    emissiveMesh = null;
    nonEmissiveMesh = null;
    lightFieldMesh = null;
    lodIds = ["l", "m", "s", "xs"];
    lodRefGeometries = [];

    constructor(base) {
        this.base = base;
        this.math = base.math;
        this.IS_SMALL_SCREEN = Math.min(base.width, base.height) <= 820;
        this.lodRefGeometries = [
            this.base.sphere_l,
            this.base.sphere_m,
            this.base.sphere_s,
            this.base.sphere_xs,
        ]
        let e = this.base.heroParticlesSimulation.SIM_TEXTURE_WIDTH * this.base.heroParticlesSimulation.SIM_TEXTURE_HEIGHT
        let t = new Float32Array(e * 3)
        let r = new THREE.InstancedBufferGeometry
        let n = new THREE.InstancedBufferGeometry
        let a = new Float32Array((this.base.heroParticlesSimulation.SIM_TEXTURE_WIDTH - 1) * this.base.heroParticlesSimulation.SIM_TEXTURE_HEIGHT * 2)
        let l = new Float32Array(this.base.heroParticlesSimulation.SIM_TEXTURE_HEIGHT * 2);
        for (let p = 0, g = 0, v = 0, _ = 0; p < e; p++, g += 3) {
            let T = t[g + 0] = (p % this.base.heroParticlesSimulation.SIM_TEXTURE_WIDTH + .5) / this.base.heroParticlesSimulation.SIM_TEXTURE_WIDTH
            let M = t[g + 1] = (~~(p / this.base.heroParticlesSimulation.SIM_TEXTURE_WIDTH) + .5) / this.base.heroParticlesSimulation.SIM_TEXTURE_HEIGHT;
            p % this.base.heroParticlesSimulation.SIM_TEXTURE_WIDTH == 0 ? (l[v + 0] = T, l[v + 1] = M, v += 2) : (a[_ + 0] = T, a[_ + 1] = M, _ += 2)
        }
        r.setAttribute("simUv", new THREE.InstancedBufferAttribute(a, 2))
        this.nonEmissiveMesh = new THREE.Mesh(r, new THREE.ShaderMaterial({
            uniforms: Object.assign({
                    u_simCurrPosLifeTexture: this.base.heroParticlesSimulation.shaderUniforms.u_simCurrPosLifeTexture,
                    u_simTextureSize: this.base.heroParticlesSimulation.shaderUniforms.u_simTextureSize,
                    u_noiseStableFactor: this.base.heroParticlesSimulation.shaderUniforms.u_noiseStableFactor,
                    u_isEmissive: {value: 0},
                    u_emissiveRatio: {value: 0}
                },
                this.base.heroLightField.shaderUniforms,
                this.base.heroScatter.shaderUniforms,
                this.base.shaderUniforms,
                this.base.blueNoise.shaderUniforms
            ),
            vertexShader: vertex,
            fragmentShader: fragment
        }))
        this.nonEmissiveMesh.renderOrder = 5
        this.nonEmissiveMesh.frustumCulled = !1
        this.container.add(this.nonEmissiveMesh)
        n.setAttribute("simUv", new THREE.InstancedBufferAttribute(l, 2))
        this.emissiveMesh = new THREE.Mesh(n, new THREE.ShaderMaterial({
            uniforms: Object.assign({}, this.nonEmissiveMesh.material.uniforms, {
                u_isEmissive: {value: 1},
                u_emissiveRatio: {value: 0}
            }),
            vertexShader: emissiveVertex,
            fragmentShader: emissiveFragment
        }))
        this.emissiveMesh.renderOrder = 5
        this.emissiveMesh.frustumCulled = !1
        this.container.add(this.emissiveMesh);
        let c = new THREE.PlaneGeometry(1, 1)
        let u = new THREE.InstancedBufferGeometry;
        for (let p in c.attributes) u.attributes[p] = c.attributes[p];
        u.setIndex(c.getIndex())
        u.setAttribute("simUv", new THREE.InstancedBufferAttribute(t, 3))
        this.motionMesh = new THREE.Mesh(u, new THREE.ShaderMaterial({
            uniforms: {
                u_simPrevPosLifeTexture: this.base.heroParticlesSimulation.shaderUniforms.u_simPrevPosLifeTexture,
                u_simCurrPosLifeTexture: this.base.heroParticlesSimulation.shaderUniforms.u_simCurrPosLifeTexture,
                u_aspect: this.base.commonUniforms.u_aspect
            },
            vertexShader: motionVert,
            fragmentShader: motionFrag
        }))
        this.motionMesh.frustumCulled = !1;
        let f = new THREE.BufferGeometry;
        f.name = "lightFieldGeometry"
        f.setAttribute("position", new THREE.BufferAttribute(t, 3))
        this.lightFieldMesh = new THREE.Points(f, this.base.fboHelper.createRawShaderMaterial({
            uniforms: Object.assign({
                    u_simCurrPosLifeTexture: this.base.heroParticlesSimulation.shaderUniforms.u_simCurrPosLifeTexture,
                    u_noiseStableFactor: this.base.heroParticlesSimulation.shaderUniforms.u_noiseStableFactor
                },
                this.base.heroLightField.shaderUniforms
            ),
            vertexShader: lightFieldVert,
            fragmentShader: lightFieldFrag,
            blending: THREE.CustomBlending,
            blendEquation: THREE.MaxEquation,
            blendSrc: THREE.OneFactor,
            blendDst: THREE.OneFactor,
            blendEquationAlpha: THREE.MaxEquation,
            blendSrcAlpha: THREE.OneFactor,
            blendDstAlpha: THREE.OneFactor
        }))
        this.lightFieldMesh.frustumCulled = !1
    }

    update(e) {
        this.nonEmissiveMesh.material.uniforms.u_emissiveRatio.value = this.math.fit(this.base.introRatio, 0, .2, 0, .75)
        this.emissiveMesh.material.uniforms.u_emissiveRatio.value = this.math.fit(this.base.introRatio, 0, .2, 0, .75);
        let t;
        let r = this.base.introRatio < .3
        let n = !r && this.base.introRatio < .7
        let a = 0;
        let l = 0;
        this.IS_SMALL_SCREEN ? (a = r ? 2 : 3, l = r ? 1 : n ? 2 : 3) : (a = r ? 1 : n ? 2 : 3, l = r ? 0 : n ? 1 : 3)
        t = this.lodRefGeometries[a];
        for (let u in t.attributes) this.nonEmissiveMesh.geometry.attributes[u] = t.attributes[u];
        this.nonEmissiveMesh.geometry.setIndex(t.getIndex())
        t = this.lodRefGeometries[l];
        for (let u in t.attributes) this.emissiveMesh.geometry.attributes[u] = t.attributes[u];
        this.emissiveMesh.geometry.setIndex(t.getIndex())
        this.base.heroLightField.renderMesh(this.lightFieldMesh);
        let c = this.math.fit(this.base.introRatio, 0, .1, 1, 1.5);
        c = this.math.fit(this.base.introRatio, .1, .15, c, 0)
        this.base.heroEfxPrevPass.motionBlurRatio = c
        if (this.base.heroEfxPrevPass.motionBlurRatio > 0) {
            this.base.heroEfxPrevPass.renderMotion(this.motionMesh, this.base.camera, this.base.width >> 2, this.base.height >> 2)
        }
    }

}
