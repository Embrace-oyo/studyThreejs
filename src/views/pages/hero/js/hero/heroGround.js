/**
 * justThreeJs heroGround.js
 * @author kongjianqiu
 * @description
 * @created 2025/3/25 10:00:40
 */
import * as THREE from "three";
// glsl
import frag from '@/views/pages/hero/glsl/heroGround/frag.glsl'
import groundVert from '@/views/pages/hero/glsl/heroGround/groundVert.glsl'
import groundFrag from '@/views/pages/hero/glsl/heroGround/groundFrag.glsl'

export default class HeroGround {
    container = new THREE.Object3D;
    geometry = null;
    mesh = null;
    texture = null;
    RADIUS = 12;
    SIZE = 768;
    shaderUniforms = {
        u_groundShadowTexture: {value: null}
    };
    prevRenderTarget = null;
    currRenderTarget = null;
    blurCacheRenderTarget = null;

    constructor(base) {
        this.base = base;
        this.geometry = this.base.terrain;
        this.texture = this.base.terrainShadowLightHeightTexture;
        this.texture.flipY = !0;
        this.texture.minFilter = THREE.LinearFilter;

        this.prevRenderTarget = this.base.fboHelper.createRenderTarget(this.SIZE, this.SIZE)
        this.currRenderTarget = this.prevRenderTarget.clone()
        this.blurCacheRenderTarget = this.prevRenderTarget.clone()
        this.mesh = new THREE.Mesh(new THREE.CircleGeometry(1.1, 128),
            this.base.fboHelper.createRawShaderMaterial({
                uniforms: Object.assign({
                        u_prevTexture: {value: null},
                        u_radius: {value: this.RADIUS},
                        u_texelSize: {value: 1 / this.SIZE},
                        u_blueNoiseOffset: {value: new THREE.Vector2}
                    },
                    this.base.heroLight.shaderUniforms,
                    this.base.blueNoise.shaderUniforms
                ),
                fragmentShader: frag
            }))
        this.mesh.material.defines.LIGHT_SHADOW_SAMPLE_COUNT = 8
        this.groundMesh = new THREE.Mesh(this.geometry, new THREE.ShaderMaterial({
            uniforms: Object.assign({
                    u_texture: {value: this.texture},
                    u_groundShadowTexture: {value: this.currRenderTarget.texture},
                    u_color: {value: new THREE.Color},
                    u_bgColor: {value: new THREE.Color},
                    u_noiseStableFactor: this.base.heroParticlesSimulation.shaderUniforms.u_noiseStableFactor,
                    u_fogA: {value: .03},
                    u_fogB: {value: .285}
                },
                this.base.heroLight.shaderUniforms,
                this.base.heroScatter.shaderUniforms,
                this.base.blueNoise.shaderUniforms,
                this.base.shaderUniforms
            ),
            vertexShader: groundVert,
            fragmentShader: groundFrag
        }))
        this.groundMesh.material.extensions.derivatives = !0
        this.container.add(this.groundMesh)
        this.base.fboHelper.clearColor(1, 1, 1, 1, this.currRenderTarget)
    }

    update(e) {
        let t = this.prevRenderTarget;
        this.prevRenderTarget = this.currRenderTarget
        this.currRenderTarget = t;
        let r = this.base.renderer
        let n = this.base.fboHelper.getColorState()
        let a = r.getRenderTarget();
        r.setRenderTarget(this.currRenderTarget)
        r.setClearColor(16777215, 1)
        this.mesh.material.uniforms.u_blueNoiseOffset.value.set(~~(Math.random() * 128), ~~(Math.random() * 128))
        this.mesh.material.uniforms.u_prevTexture.value = this.prevRenderTarget.texture
        this.base.fboHelper.renderMesh(this.mesh, this.currRenderTarget)
        r.setRenderTarget(a)
        this.base.fboHelper.setColorState(n)
        this.base.heroParticlesSimulation.shaderUniforms.u_noiseStableFactor.value
        this.groundMesh.material.uniforms.u_groundShadowTexture.value = this.currRenderTarget.texture
        this.groundMesh.material.uniforms.u_bgColor.value.copy(this.base.bgColor)
        this.groundMesh.material.uniforms.u_color.value.set("#fff")
    }
}
