/**
 * justThreeJs heroHalo.js
 * @author kongjianqiu
 * @description
 * @created 2025/3/25 11:54:16
 */
import * as THREE from "three";
// glsl
import vert from '@/views/pages/hero/glsl/heroHalo/vert.glsl'
import frag from '@/views/pages/hero/glsl/heroHalo/frag.glsl'

export default class HeroHalo {
    container = new THREE.Object3D;
    mesh = null;

    constructor(base) {
        this.base = base;
        this.onGeometryLoad(this.base.bgBoxGeometry)
    }

    onGeometryLoad(e) {
        this.mesh = new THREE.Mesh(e, new THREE.ShaderMaterial({
            uniforms: Object.assign(
                {u_resolution: this.base.commonUniforms.u_resolution},
                this.base.heroLight.shaderUniforms,
                this.base.blueNoise.shaderUniforms,
                this.base.heroScatter.shaderUniforms,
                this.base.shaderUniforms
            ),
            vertexShader: vert,
            fragmentShader: frag
        }))
        this.mesh.renderOrder = 10
        this.container.add(this.mesh)
    }
    update(e) {
    }
}
