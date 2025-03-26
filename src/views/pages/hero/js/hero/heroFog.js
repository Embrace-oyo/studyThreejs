/**
 * justThreeJs heroFog.js
 * @author kongjianqiu
 * @description
 * @created 2025/3/25 11:36:15
 */
import * as THREE from "three";
//glsl
import vert from '@/views/pages/hero/glsl/heroFog/vert.glsl'
import frag from '@/views/pages/hero/glsl/heroFog/frag.glsl'

export default class HeroFog {
    container = new THREE.Object3D;
    geometry = null;
    material = null;
    mesh = null;
    texture = null;
    cacheRT = null;
    INSTANCES_COUNT = 32;

    constructor(base) {
        this.base = base;
        this.texture = this.base.fogTexture;
        let e = this.base.math.getSeedRandomFn("fog96");
        this.cacheRT = this.base.fboHelper.createRenderTarget(1, 1);
        const t = new THREE.PlaneGeometry(1, 1, 3, 3);
        this.geometry = new THREE.InstancedBufferGeometry;
        for (let l in t.attributes) {
            this.geometry.setAttribute(l, t.attributes[l]);
        }
        this.geometry.setIndex(t.index);
        const r = new Float32Array(this.INSTANCES_COUNT)
        const n = new Float32Array(this.INSTANCES_COUNT * 3)
        const a = new Float32Array(this.INSTANCES_COUNT * 3);
        for (let l = 0, c = 0; l < this.INSTANCES_COUNT; l++) {
            r[l] = l
            n[c] = 12 * (e() * 2 - 1)
            n[c + 1] = -.25 + .5 * e()
            n[c + 2] = 12 * (1 - l / (this.INSTANCES_COUNT - 1) * 2)
            a[c] = e() * 2 - 1
            a[c + 1] = e() * 2 - 1
            a[c + 2] = e() * 2 - 1
            c += 3;
        }
        this.geometry.setAttribute("a_instanceId", new THREE.InstancedBufferAttribute(r, 1))
        this.geometry.setAttribute("a_instancePos", new THREE.InstancedBufferAttribute(n, 3))
        this.geometry.setAttribute("a_instanceRands", new THREE.InstancedBufferAttribute(a, 3))
        this.material = new THREE.ShaderMaterial({
            uniforms: Object.assign({
                    u_fogTexture: {value: this.texture},
                    u_currSceneTexture: {value: this.cacheRT.texture},
                    u_lightPosition: this.base.heroLight.shaderUniforms.u_lightPosition,
                    u_resolution: this.base.commonUniforms.u_resolution
                },
                this.base.blueNoise.shaderUniforms,
                this.base.heroScatter.shaderUniforms,
                this.base.shaderUniforms
            ),
            vertexShader: vert,
            fragmentShader: frag,
            side: THREE.DoubleSide,
            depthWrite: !1,
            blending: THREE.CustomBlending,
            blendEquation: THREE.AddEquation,
            blendSrc: THREE.SrcAlphaFactor,
            blendDst: THREE.OneMinusSrcAlphaFactor,
            blendEquationAlpha: THREE.AddEquation,
            blendSrcAlpha: THREE.ZeroFactor,
            blendDstAlpha: THREE.OneFactor
        })
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.renderOrder = 20
        this.mesh.frustumCulled = !1
        this.mesh.onBeforeRender = this.onBeforeRender.bind(this)
        this.container.add(this.mesh)
    }

    onBeforeRender() {
        let e = this.base.fboHelper.renderer
        let t = e.getRenderTarget();
        this.base.fboHelper.clearMultisampleRenderTargetState()
        this.base.fboHelper.copy(t.texture, this.cacheRT)
        e.setRenderTarget(t)
    }

    resize(e, t) {
        this.cacheRT.setSize(e, t)
    }

    update(e) {
    }
}
