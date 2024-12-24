/**
 * justThreeJs blur.js
 * @author kongjianqiu
 * @description
 * @created 2024/7/4 15:52:07
 */
import * as THREE from "three";
import blur9VaryingVertexShader from '@/views/example/common/trail/glsl/blur9VaryingVertexShader.glsl'
import blur9VaryingFragmentShader from '@/views/example/common/trail/glsl/blur9VaryingFragmentShader.glsl'
import blur9FragmentShader from '@/views/example/common/trail/glsl/blur9FragmentShader.glsl'

export default class Blur {
    material = null;

    constructor(base) {
        this.base = base
    }

    getBlur9Material() {
        let e = this.base.fboHelper.MAX_VARYING_VECTORS > 8;
        return this.blur9Material || (this.blur9Material = new THREE.RawShaderMaterial({
            uniforms: {
                u_texture: {value: null},
                u_delta: {value: new THREE.Vector2}
            },
            vertexShader: e ? this.base.fboHelper.precisionPrefix + blur9VaryingVertexShader : this.base.fboHelper.vertexShader,
            fragmentShader: this.base.fboHelper.precisionPrefix + (e ? blur9VaryingFragmentShader : blur9FragmentShader),
            depthWrite: !1,
            depthTest: !1
        })), this.blur9Material
    }

    blur(e, t, r, n, o, l) {
        let c = .25
        let u = Math.ceil(r.width * t) || 0
        let f = Math.ceil(r.height * t) || 0;
        this.material || (this.material = this.getBlur9Material())
        n || console.warn("You have to pass intermediateRenderTarget to blur")
        (u !== n.width || f !== n.height) && n.setSize(u, f)
        o ? l || o.setSize(r.width, r.height) : o = r
        this.material.uniforms.u_texture.value = r.texture || r
        this.material.uniforms.u_delta.value.set(e / u * c, 0)
        this.base.fboHelper.render(this.material, n)

        this.material.uniforms.u_texture.value = n.texture || n
        this.material.uniforms.u_delta.value.set(0, e / f * c)
        this.base.fboHelper.render(this.material, o)
    }
}
