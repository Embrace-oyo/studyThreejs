/**
 * justThreeJs heroPerson.js
 * @author kongjianqiu
 * @description
 * @created 2025/3/25 10:56:04
 */
import * as THREE from "three";
// glsl
import vert from '@/views/pages/hero/glsl/heroPerson/vert.glsl'
import frag from '@/views/pages/hero/glsl/heroPerson/frag.glsl'
import shadowVert from '@/views/pages/hero/glsl/heroPerson/shadowVert.glsl'
import shadowFrag from '@/views/pages/hero/glsl/heroPerson/shadowFrag.glsl'

export default class HeroPerson {
    BONE_COUNT = 54;
    FPS = 60;
    container = new THREE.Object3D;
    geometry = null;
    mesh = null;
    texture = null;
    shadowMesh = null;
    shadowTexture = null;
    time = 0;
    frameCount = 0;
    bonePosAnimationData;
    boneOrientAnimationData;
    bonePoses = new Float32Array(this.BONE_COUNT * 3);
    boneOrients = new Float32Array(this.BONE_COUNT * 4);
    shaderUniforms = {
        u_texture: {value: null},
        u_lightMixer: {value: new THREE.Vector3(1, 0, 0)}
    };

    constructor(base) {
        this.base = base;
        this.lightTexture = this.base.personLightTexutre
        this.texture = this.base.personTexutre
        this.shadowTexture = this.base.groundPersonShadowTexture
        this.onTextureLoad();
        this.onModelLoad(this.base.personGeometry)
        this.onAnimationLoad(this.base.personIdleGeometry)

        this.shadowMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.5), new THREE.ShaderMaterial({
            uniforms: Object.assign({
                    u_texture: {value: this.shadowTexture},
                    u_lightMixer: this.shaderUniforms.u_lightMixer
                },
                this.base.blueNoise.sharedUniforms
            ),
            vertexShader: shadowVert,
            fragmentShader: shadowFrag,
            blending: THREE.MultiplyBlending
        }))
        this.shadowMesh.renderOrder = 10
        this.shadowMesh.position.y = .01
        this.shadowMesh.rotation.x = -Math.PI / 2
        this.container.add(this.shadowMesh)
        this._v1$2 = new THREE.Vector3
        this._v2$1 = new THREE.Vector3
        this._q1$1 = new THREE.Quaternion
        this._q2 = new THREE.Quaternion;
    }

    onTextureLoad() {
        if (this.lightTexture && this.texture) {
            let e = this.base.fboHelper.createRenderTarget(this.lightTexture.image.width, this.lightTexture.image.height);
            e.texture.minFilter = THREE.LinearMipMapNearestFilter
            e.texture.generateMipmaps = !1
            this.shaderUniforms.u_texture.value = e.texture
            this.base.fboHelper.copy(this.base.textureHelper.transparentTexture, e)
            this.base.textureHelper.mixChannels(this.lightTexture, e, 0, 1, 2, -1)
            e.texture.generateMipmaps = !0
            this.base.textureHelper.mixChannels(this.texture, e, -1, -1, -1, 0)
            this.texture.dispose()
            this.lightTexture.dispose()
            this.texture = null
            this.lightTexture = null
        }
    }

    onModelLoad(e) {
        this.mesh = new THREE.Mesh(e, new THREE.ShaderMaterial({
            uniforms: Object.assign({
                    u_texture: this.shaderUniforms.u_texture,
                    u_lightMixer: this.shaderUniforms.u_lightMixer,
                    u_bonePoses: {value: this.bonePoses},
                    u_boneOrients: {value: this.boneOrients}
                },
                this.base.heroLight.shaderUniforms,
                this.base.heroScatter.shaderUniforms,
                this.base.shaderUniforms
            ),
            vertexShader: vert,
            fragmentShader: frag
        }))
        this.mesh.material.defines.BONE_COUNT = this.BONE_COUNT
        this.container.add(this.mesh)
    }

    onAnimationLoad(e) {
        this.bonePosAnimationData = e.attributes.position.array
        this.boneOrientAnimationData = e.attributes.orient.array
        this.frameCount = this.bonePosAnimationData.length / (this.BONE_COUNT * 3)
    }

    update(e) {
        if (this.mesh && this.frameCount) {
            this.time += e * .5;
            let t = this.time * this.FPS % this.frameCount
            let r = Math.floor(t)
            let n = Math.ceil(t) % this.frameCount
            let a = t - r
            let l = r * this.BONE_COUNT
            let c = n * this.BONE_COUNT
            let u = this.frameCount / 3;
            this.shaderUniforms.u_lightMixer.value.set(this.base.math.fit(t, u * 2, this.frameCount, 0, 1) + this.base.math.fit(t, 0, u, 1, 0), this.base.math.fit(t, 0, u, 0, 1) * this.base.math.fit(t, u, u * 2, 1, 0), this.base.math.fit(t, u, u * 2, 0, 1) * this.base.math.fit(t, u * 2, this.frameCount, 1, 0));
            for (let f = 0; f < this.BONE_COUNT; f++) {
                this._v1$2.fromArray(this.bonePosAnimationData, (l + f) * 3).lerp(this._v2$1.fromArray(this.bonePosAnimationData, (c + f) * 3), a).toArray(this.bonePoses, f * 3)
                this._q1$1.fromArray(this.boneOrientAnimationData, (l + f) * 4).slerp(this._q2.fromArray(this.boneOrientAnimationData, (c + f) * 4), a).toArray(this.boneOrients, f * 4)
            }
        }
    }
}
