/**
 * justThreeJs blur.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/23 17:20:18
 */
import * as THREE from "three";
// glsl
import blur9VaryingVertexShader from '@/views/pages/lusion/glsl/blur/blur9VaryingVertexShader.glsl'
import blur9VaryingFragmentShader from '@/views/pages/lusion/glsl/blur/blur9VaryingFragmentShader.glsl'
import blur9FragmentShader from '@/views/pages/lusion/glsl/blur/blur9FragmentShader.glsl'
export default class Blur {
    material = null;
    constructor(base) {
        this.base = base;
    }
    getBlur9Material() {
        let e = this.base.fboHelper.MAX_VARYING_VECTORS > 8;
        return this.blur9Material || (this.blur9Material = this.base.fboHelper.createRawShaderMaterial({
            uniforms: {
                u_texture: { value: null },
                u_delta: { value: new THREE.Vector2() }
            },
            vertexShader: e ? this.base.fboHelper.precisionPrefix + blur9VaryingVertexShader : this.base.fboHelper.vertexShader,
            fragmentShader: this.base.fboHelper.precisionPrefix + (e ? blur9VaryingFragmentShader : blur9FragmentShader),
            depthWrite: false,
            depthTest: false
        })), this.blur9Material;
    }

    blur(e, t, r, n, a, l) {
        let c = 0.25,
            u = Math.ceil(r.width * t) || 0,
            f = Math.ceil(r.height * t) || 0;

        if (!this.material) {
            this.material = this.getBlur9Material();
        }

        if (!n) {
            console.warn("You have to pass intermediateRenderTarget to blur");
        }

        if (u !== n.width || f !== n.height) {
            n.setSize(u, f);
        }

        if (a) {
            if (!l) a.setSize(r.width, r.height);
        } else {
            a = r;
        }

        this.material.uniforms.u_texture.value = r.texture || r;
        this.material.uniforms.u_delta.value.set(e / u * c, 0);
        this.base.fboHelper.render(this.material, n);

        this.material.uniforms.u_texture.value = n.texture || n;
        this.material.uniforms.u_delta.value.set(0, e / f * c);
        this.base.fboHelper.render(this.material, a);
    }
}
