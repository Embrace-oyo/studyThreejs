/**
 * justThreeJs heroLightField.js
 * @author kongjianqiu
 * @description
 * @created 2025/3/24 11:11:46
 */

import * as THREE from "three";

// glsl
import sliceBlendFrag from '@/views/pages/hero/glsl/heroLightField/sliceBlendFrag.glsl'

export default class HeroLightField {
    GRID_COUNT = new THREE.Vector3(64, 64, 64);
    VOLUME_SIZE = new THREE.Vector3(8, 0, 0);
    container = new THREE.Object3D;
    prevSliceRenderTarget = null;
    currSliceRenderTarget = null;
    drawnSliceRenderTarget = null;
    sliceTo3DMesh = null;
    sliceBlendMaterial;
    sliceColumnCount = 0;
    sliceRowCount = 0;
    gridSize = 0;
    SHOW_TEST_VOXELS = !1;
    shaderUniforms = {
        u_lightFieldTexture3D: {value: null},
        u_lightFieldMaxLod: {value: 0},
        u_lightFieldSlicedTexture: {value: null},
        u_lightFieldSlicedTextureSize: {value: new THREE.Vector2},
        u_lightFieldSliceColRowCount: {value: new THREE.Vector2},
        u_lightFieldGridSize: {value: 0},
        u_lightFieldGridCount: {value: this.GRID_COUNT},
        u_lightFieldVolumeOffset: {value: new THREE.Vector3},
        u_lightFieldVolumeSize: {value: new THREE.Vector3}
    };

    constructor(base) {
        this.base = base;
        this.fboHelper = base.fboHelper
        this.gridSize = this.VOLUME_SIZE.x / (this.GRID_COUNT.x - 1)
        this.shaderUniforms.u_lightFieldGridSize.value = this.gridSize
        this.VOLUME_SIZE.y = this.gridSize * (this.GRID_COUNT.y - 1)
        this.VOLUME_SIZE.z = this.gridSize * (this.GRID_COUNT.z - 1)
        this.shaderUniforms.u_lightFieldVolumeSize.value.setScalar(this.gridSize).add(this.VOLUME_SIZE)
        this.shaderUniforms.u_lightFieldMaxLod.value = Math.log2(Math.min(this.GRID_COUNT.x, this.GRID_COUNT.y, this.GRID_COUNT.z));
        let e = this.GRID_COUNT.x * this.GRID_COUNT.y * this.GRID_COUNT.z
        let t = this.sliceColumnCount = Math.ceil(Math.sqrt(e) / this.GRID_COUNT.x)
        let r = this.sliceRowCount = Math.ceil(this.GRID_COUNT.z / t);
        this.shaderUniforms.u_lightFieldSliceColRowCount.value.set(t, r);
        let n = this.GRID_COUNT.x * t
        let a = this.GRID_COUNT.y * r;
        this.shaderUniforms.u_lightFieldSlicedTextureSize.value.set(n, a)
        this.currSliceRenderTarget = this.fboHelper.createRenderTarget(n, a)
        this.prevSliceRenderTarget = this.currSliceRenderTarget.clone()
        this.drawnSliceRenderTarget = this.currSliceRenderTarget.clone()
        this.fboHelper.clearColor(0, 0, 0, 0, this.currSliceRenderTarget)
        this.sliceBlendMaterial = this.fboHelper.createRawShaderMaterial({
            uniforms: {
                u_lightFieldSlicedTextureSize: this.shaderUniforms.u_lightFieldSlicedTextureSize,
                u_lightFieldSliceColRowCount: this.shaderUniforms.u_lightFieldSliceColRowCount,
                u_lightFieldGridCount: this.shaderUniforms.u_lightFieldGridCount,
                u_lightFieldVolumeOffset: this.shaderUniforms.u_lightFieldVolumeOffset,
                u_lightFieldVolumeSize: this.shaderUniforms.u_lightFieldVolumeSize,
                u_prevSliceTexture: {value: null},
                u_drawnSliceTexture: {value: this.drawnSliceRenderTarget.texture}
            },
            fragmentShader: sliceBlendFrag
        })
    }

    update(e) {
        let t = this.VOLUME_SIZE.clone().multiplyScalar(.5).sub(this.base.heroLight.position).multiplyScalar(-1);
        this.shaderUniforms.u_lightFieldVolumeOffset.value.setScalar(-this.gridSize / 2).add(t);
        let r = this.base.renderer
        let n = this.fboHelper.getColorState()
        let a = r.getRenderTarget();
        r.setRenderTarget(this.drawnSliceRenderTarget)
        r.setClearColor(0, 0)
        r.clear()
        r.setRenderTarget(a)
        this.fboHelper.setColorState(n)
    }

    renderMesh(e) {
        let t = this.base.renderer
        let r = this.fboHelper.getColorState()
        let n = t.getRenderTarget();
        t.autoClearColor = !1
        this.fboHelper.renderMesh(e, this.drawnSliceRenderTarget)
        t.setRenderTarget(n)
        this.fboHelper.setColorState(r)
    }

    postUpdate() {
        let t = this.base.renderer
        let r = this.fboHelper.getColorState()
        let n = t.getRenderTarget();
        t.autoClear = !1;
        let a = this.prevSliceRenderTarget;
        this.prevSliceRenderTarget = this.currSliceRenderTarget
        this.currSliceRenderTarget = a
        this.shaderUniforms.u_lightFieldSlicedTexture.value = this.currSliceRenderTarget.texture
        this.sliceBlendMaterial.uniforms.u_prevSliceTexture.value = this.prevSliceRenderTarget.texture
        this.fboHelper.render(this.sliceBlendMaterial, this.currSliceRenderTarget)
        t.setRenderTarget(n)
        this.fboHelper.setColorState(r)
    }
}
