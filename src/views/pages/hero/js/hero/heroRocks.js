/**
 * justThreeJs heroRocks.js
 * @author kongjianqiu
 * @description
 * @created 2025/3/24 18:25:28
 */
import * as THREE from "three";

// glsl
import vertex from '@/views/pages/hero/glsl/heroRock/vertex.glsl'
import fragmnet from '@/views/pages/hero/glsl/heroRock/fragmnet.glsl'
import lightShadowMapFrag from '@/views/pages/hero/glsl/heroRock/lightShadowMapFrag.glsl'

export default class HeroRocks {
    ROCK_PIECE_COUNT = 16;
    FRAME_COUNT = 120;
    FPS = 60;
    COUNT = 64;
    container = new THREE.Object3D;
    meshList = [];
    shadowMeshList = [];
    meshAnimationUniformList = [];
    meshInstanceUniformsList = [];
    meshInstanceAttributesList = [];
    time = 0;

    constructor(base) {
        this.base = base;
        this.shaderUniforms = {
            u_texture: {value: null},
            u_animationTextureSize: {value: new THREE.Vector2(this.ROCK_PIECE_COUNT, this.FRAME_COUNT)},
            u_time: {value: 0},
            u_globalTime: {value: 0},
            u_scale: {value: 0},
            u_lightPosition: this.base.heroLight.shaderUniforms.u_lightPosition,
            u_noiseStableFactor: this.base.heroParticlesSimulation.shaderUniforms.u_noiseStableFactor
        };
        let e = this.base.rocksTexture
        let t = this.base.fboHelper.createRawShaderMaterial({
            uniforms: Object.assign({
                    u_texture: {value: e}
                },
                this.base.heroScatter.shaderUniforms
            ),
            fragmentShader: `
						uniform sampler2D u_texture;
						varying vec2 v_uv;
						void main () {
							vec2 uv = v_uv * 0.5;
							gl_FragColor = vec4(
								texture2D(u_texture, uv).g,
								texture2D(u_texture, uv + vec2(.5, 0.)).g,
								texture2D(u_texture, uv + vec2(0., .5)).g,
								texture2D(u_texture, uv + vec2(.5, .5)).g
							);
						}`
        })
        let r = this.base.fboHelper.createRenderTarget(512, 512);
        r.texture.minFitler = THREE.LinearMipmapLinearFilter
        r.texture.generateMipmaps = !0
        this.base.fboHelper.render(t, r)
        this.shaderUniforms.u_texture.value = r.texture
        t.dispose()
        e.dispose()

        for (let e = 0; e < 4; e++) {
            this.meshAnimationUniformList[e] = {
                u_posRandTexture: {value: null},
                u_orientTexture: {value: null}
            }
            this.meshInstanceUniformsList[e] = Object.assign(
                {u_textureChannelMixer: {value: new THREE.Vector4(+(e == 0), +(e == 1), +(e == 2), +(e == 3))}},
                this.meshAnimationUniformList[e],
                this.shaderUniforms,
                this.base.shaderUniforms,
                this.base.heroLight.shaderUniforms,
                this.base.heroScatter.shaderUniforms
            );
            let t = new Float32Array(this.COUNT)
            let r = new Float32Array(this.COUNT * 4);
            for (let n = 0; n < this.COUNT; n++) {
                t[n] = e + n * 4
                r[n * 4 + 0] = Math.random()
                r[n * 4 + 1] = Math.random()
                r[n * 4 + 2] = Math.random()
                r[n * 4 + 3] = Math.random();
            }
            this.meshInstanceAttributesList[e] = {
                instanceId: new THREE.InstancedBufferAttribute(t, 1),
                instanceRands: new THREE.InstancedBufferAttribute(r, 4)
            }
            this.onRockLoad(e, !1, this.base[`rock_${e}`])
            this.onRockLoad(e, !0, this.base[`rock_${e}_low`])
            this.onRockAnimationLoad(e, this.base[`rock_animation_${e}`])
        }

        for (let e = 0; e < 4; e++) {
            this.container.add(this.meshList[e])
        }
    }

    onRockLoad(e, t, r) {
        let n = new THREE.InstancedBufferGeometry;
        for (let c in r.attributes) {
            n.setAttribute(c, r.attributes[c]);
        }
        n.index = r.index;
        let a = this.meshInstanceAttributesList[e];
        n.setAttribute("instanceId", a.instanceId)
        n.setAttribute("instanceRands", a.instanceRands);
        let l = new THREE.Mesh(n, new THREE.ShaderMaterial({
            uniforms: this.meshInstanceUniformsList[e],
            vertexShader: vertex,
            fragmentShader: fragmnet
        }));
        l.frustumCulled = !1
        if (t) {
            this.shadowMeshList[e] = l
            l.material.defines.IS_SHADOW = !0
            l.material.fragmentShader = lightShadowMapFrag
            l.material.side = THREE.DoubleSide
        } else {
            this.meshList[e] = l
        }
    }


    onRockAnimationLoad(e, t) {
        let r = t.attributes.position.array
        let n = t.attributes.orient.array
        let a = new Float32Array(r.length / 3 * 4)
        let l = [];
        for (let c = 0, u = 0, f = 0; u < r.length; c++, u += 3, f += 4) {
            a[f] = r[u]
            a[f + 1] = r[u + 1]
            a[f + 2] = r[u + 2]
            c < this.ROCK_PIECE_COUNT && (l[c] = Math.random())
            a[f + 3] = l[c % this.ROCK_PIECE_COUNT]
        }
        this.meshAnimationUniformList[e].u_posRandTexture.value = this.base.fboHelper.createDataTexture(a, this.ROCK_PIECE_COUNT, this.FRAME_COUNT, !0, !0)
        this.meshAnimationUniformList[e].u_orientTexture.value = this.base.fboHelper.createDataTexture(n, this.ROCK_PIECE_COUNT, this.FRAME_COUNT, !0, !0)
    }

    update(e) {
        // this.base.heroParticlesSimulation.shaderUniforms.u_noiseStableFactor.value
        this.time += e
        this.shaderUniforms.u_time.value = this.time
        this.shaderUniforms.u_globalTime.value = this.base.time
        this.shaderUniforms.u_scale.value = this.base.math.fit(this.base.introRatio, 0, .2, 0, 1);
        for (let t = 0; t < 4; t++) {
            this.base.heroLight.renderMesh(this.shadowMeshList[t])
        }
    }
}
