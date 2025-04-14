/**
 * justThreeJs bloomPass.js
 * @author kongjianqiu
 * @description
 * @created 2025/3/26 17:34:20
 */

import * as THREE from "three";
import {Pass} from 'three/addons/postprocessing/Pass.js';
// glsl
import convolutionSrcFrag from '@/views/pages/hero/glsl/common/bloom/convolutionSrcFrag.glsl'
import highPassFrag from '@/views/pages/hero/glsl/common/bloom/highPassFrag.glsl'
import fftFrag from '@/views/pages/hero/glsl/common/bloom/fftFrag.glsl'
import convolutionMixFrag from '@/views/pages/hero/glsl/common/bloom/convolutionMixFrag.glsl'
import convolutionCacheFrag from '@/views/pages/hero/glsl/common/bloom/convolutionCacheFrag.glsl'
import convolutionFrag from '@/views/pages/hero/glsl/common/bloom/convolutionFrag.glsl'
import blurFrag from '@/views/pages/hero/glsl/common/bloom/blurFrag.glsl'
import frag$2 from '@/views/pages/hero/glsl/common/bloom/frag$2.glsl'

export default class Bloom extends Pass {
    ITERATION = 5;
    USE_CONVOLUTION = true;
    USE_HD = true;
    USE_LENS_DIRT = false;
    amount = 1;
    radius = 0;
    threshold = 0.1;
    smoothWidth = 1;
    highPassMultiplier = 1;
    haloWidth = 0.8;
    haloRGBShift = 0.03;
    haloStrength = 0.21;
    haloMaskInner = 0.3;
    haloMaskOuter = 0.5;
    saturation = 1;
    renderOrder = 10;
    directionX = new THREE.Vector2(1, 0);
    directionY = new THREE.Vector2(0, 1);
    convolutionMixDownScale = 1;
    convolutionBuffer = 0.1;
    highPassMaterial;
    highPassRenderTarget;
    fftHMaterial;
    fftVMaterial;
    srcMaterial;
    convolutionSrcFrag = convolutionSrcFrag;
    srcSize = 256;
    srcRT;
    fftCacheRT1;
    fftCacheRT2;
    fftSrcRT;
    fftBloomOutCacheMaterial;
    fftBloomOutCacheRT;
    convolutionMixMaterial;
    renderTargetsHorizontal = [];
    renderTargetsVertical = [];
    blurMaterials = [];

    constructor(base) {
        super();
        this.base = base;
        const r = this.base.height / Math.sqrt(this.base.width * this.base.width + this.base.height * this.base.height) * 2;
        this.texelSize = {value: new THREE.Vector2(1 / this.base.width, 1 / this.base.height)}
        this.aspect = {value: new THREE.Vector2(this.base.width / this.base.height * r, r)}
        const _geometry = new THREE.BufferGeometry
        _geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 4, -1, 0, -1, 4, 0]), 3))
        _geometry.setAttribute("a_uvClamp", new THREE.BufferAttribute(new Float32Array([0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1]), 4))
        this._camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        this.mesh = new THREE.Mesh(_geometry, null);
        this.init();
        this.setSize(this.base.width, this.base.height)
    }

    init() {
        let t = THREE.HalfFloatType;
        this.highPassRenderTarget = this.base.fboHelper.createRenderTarget(1, 1, !this.USE_HD, t);
        this.highPassMaterial = this.base.fboHelper.createRawShaderMaterial({
            uniforms: {
                u_texture: {value: null},
                u_luminosityThreshold: {value: 1},
                u_smoothWidth: {value: 1},
                u_amount: {value: 1},
                u_haloWidth: {value: 1},
                u_haloRGBShift: {value: 1},
                u_haloStrength: {value: 1},
                u_haloMaskInner: {value: 1},
                u_haloMaskOuter: {value: 1},
                u_texelSize: null,
                u_aspect: {value: new THREE.Vector2()},
                u_dirtTexture: {value: null},
                u_dirtAspect: {value: new THREE.Vector2()}
            },
            fragmentShader: highPassFrag
        });
        this.highPassMaterial.defines.USE_LENS_DIRT = this.USE_LENS_DIRT;
        if (this.USE_CONVOLUTION) {
            this.highPassMaterial.defines.USE_CONVOLUTION = true;
            this.highPassMaterial.uniforms.u_convolutionBuffer = {value: 0.15};
            this.fftSrcRT = this.base.fboHelper.createRenderTarget(1, 1, true, t);
            this.fftCacheRT1 = this.base.fboHelper.createRenderTarget(1, 1, true, t);
            this.fftCacheRT2 = this.fftCacheRT1.clone();
            this.fftBloomOutCacheRT = this.base.fboHelper.createRenderTarget(1, 1);
            this.srcMaterial = this.base.fboHelper.createRawShaderMaterial({
                uniforms: {u_aspect: {value: new THREE.Vector2()}},
                fragmentShader: this.convolutionSrcFrag
            });
            this.fftHMaterial = this.base.fboHelper.createRawShaderMaterial({
                uniforms: {
                    u_texture: {value: null},
                    u_texelSize: {value: new THREE.Vector2()},
                    u_subtransformSize: {value: 0},
                    u_normalization: {value: 0},
                    u_isForward: {value: 0}
                },
                fragmentShader: fftFrag
            });
            this.fftHMaterial.defines.HORIZTONAL = true;
            this.fftVMaterial = this.base.fboHelper.createRawShaderMaterial({
                uniforms: this.fftHMaterial.uniforms,
                fragmentShader: fftFrag
            });
            this.convolutionMixMaterial = this.base.fboHelper.createRawShaderMaterial({
                uniforms: {
                    u_texture: {value: null},
                    u_kernelTexture: {value: this.fftSrcRT.texture}
                },
                fragmentShader: convolutionMixFrag
            });
            this.fftBloomOutCacheMaterial = this.base.fboHelper.createRawShaderMaterial({
                uniforms: {
                    u_texture: {value: null},
                    u_amount: {value: 0},
                    u_saturation: {value: 0}
                },
                fragmentShader: convolutionCacheFrag
            });

            this.material = this.base.fboHelper.createRawShaderMaterial({
                uniforms: {
                    u_texture: {value: null},
                    u_bloomTexture: {value: this.fftBloomOutCacheRT.texture},
                    u_convolutionBuffer: this.highPassMaterial.uniforms.u_convolutionBuffer
                },
                fragmentShader: convolutionFrag,
                blending: THREE.NoBlending
            });
        } else {
            for (let r = 0; r < this.ITERATION; r++) {
                this.renderTargetsHorizontal.push(this.base.fboHelper.createRenderTarget(1, 1, false, t));
                this.renderTargetsVertical.push(this.base.fboHelper.createRenderTarget(1, 1, false, t));
                const kernelSize = 3 + r * 2;
                this.blurMaterials[r] = this.base.fboHelper.createRawShaderMaterial({
                    uniforms: {
                        u_texture: {value: null},
                        u_resolution: {value: new THREE.Vector2()},
                        u_direction: {value: null}
                    },
                    fragmentShader: blurFrag,
                    defines: {KERNEL_RADIUS: kernelSize, SIGMA: kernelSize}
                });
            }
            this.material = this.base.fboHelper.createRawShaderMaterial({
                uniforms: {
                    u_texture: {value: null},
                    u_bloomStrength: {value: 1},
                    u_bloomWeights: {value: []},
                    u_saturation: {value: 0}
                },
                fragmentShader: frag$2,
                blending: THREE.NoBlending,
                defines: {ITERATION: this.ITERATION}
            });

            for (let r = 0; r < this.ITERATION; r++) {
                this.material.uniforms[`u_blurTexture${r}`] = {
                    value: this.renderTargetsVertical[r].texture
                };
            }
        }
    }

    setDirtTexture(texture) {
        this.highPassMaterial.uniforms.u_dirtTexture.value = texture;
    }

    setSize(w, h) {
        const r = h / Math.sqrt(w * w + h * h) * 2;
        this.aspect.value.set(w / h * r, r)
        this.texelSize.value.set(1 / w, 1 / h)
        if (this.USE_CONVOLUTION) {
            let pw = this.base.math.powerTwoCeiling(w / 2) >> this.convolutionMixDownScale;
            let ph = this.base.math.powerTwoCeiling(h / 2) >> this.convolutionMixDownScale;

            this.highPassRenderTarget.setSize(pw, ph);

            if (pw !== this.fftCacheRT1.width || ph !== this.fftCacheRT1.height) {
                this.fftSrcRT.setSize(pw, ph);
                this.fftCacheRT1.setSize(pw, ph);
                this.fftCacheRT2.setSize(pw, ph);
                this.fftBloomOutCacheRT.setSize(pw, ph);

                let aspect = h / Math.max(w, h);
                this.srcMaterial.uniforms.u_aspect.value.set((w / h) * aspect, aspect);

                this.base.fboHelper.render(this.srcMaterial, this.fftCacheRT1);
                this.renderFFT(this.fftCacheRT1, this.fftSrcRT, true);
            }
        } else {
            let pw = Math.ceil(w / 2), ph = Math.ceil(h / 2);
            this.highPassRenderTarget.setSize(pw, ph);
            // super.setPostprocessing({width, height});

            for (let i = 0; i < this.ITERATION; i++) {
                this.renderTargetsHorizontal[i].setSize(pw, ph);
                this.renderTargetsVertical[i].setSize(pw, ph);
                this.blurMaterials[i].uniforms.u_resolution.value.set(pw, ph);
                pw = Math.ceil(pw / 2);
                ph = Math.ceil(ph / 2);
            }
        }
    }

    dispose() {
        if (!this.USE_CONVOLUTION) {
            this.highPassRenderTarget?.dispose();
            for (let i = 0; i < this.ITERATION; i++) {
                this.renderTargetsHorizontal[i]?.dispose();
                this.renderTargetsVertical[i]?.dispose();
            }
        }
    }

    needsRender() {
        return !!this.amount;
    }

    renderFFT(input, output, forward) {
        const w = input.width;
        const h = input.height;
        const logW = Math.round(Math.log2(w));
        const logH = Math.round(Math.log2(h));
        const passes = logW + logH;
        const evenPass = passes % 2 === 0;

        const uniforms = this.fftHMaterial.uniforms;

        for (let i = 0; i < passes; i++) {
            const horizontal = i < logW;
            uniforms.u_texture.value = input.texture;
            uniforms.u_normalization.value = i === 0 ? 1 / Math.sqrt(w * h) : 1;
            uniforms.u_isForward.value = forward;
            uniforms.u_texelSize.value.set(1 / w, 1 / h);
            uniforms.u_subtransformSize.value = Math.pow(2, (horizontal ? i : i - logW) + 1);

            this.base.fboHelper.render(horizontal ? this.fftHMaterial : this.fftVMaterial, output);

            const tmp = input;
            input = output;
            output = tmp;
        }

        if (evenPass) {
            this.base.fboHelper.copy(input.texture, output);
        }
    }

    render(renderer, writeBuffer, readBuffer) {
        const w = this.base.width;
        const h = this.base.height;

        const mat = this.highPassMaterial;
        mat.uniforms.u_texture.value = readBuffer.texture
        mat.uniforms.u_luminosityThreshold.value = this.threshold;
        mat.uniforms.u_smoothWidth.value = this.smoothWidth;
        mat.uniforms.u_amount.value = this.highPassMultiplier;
        mat.uniforms.u_haloWidth.value = this.haloWidth;
        mat.uniforms.u_haloRGBShift.value = this.haloRGBShift * w;
        mat.uniforms.u_haloStrength.value = this.haloStrength;
        mat.uniforms.u_haloMaskInner.value = this.haloMaskInner;
        mat.uniforms.u_haloMaskOuter.value = this.haloMaskOuter;
        mat.uniforms.u_texelSize = this.texelSize;
        mat.uniforms.u_aspect = this.aspect;

        let haloEnabled = this.haloStrength > 0;
        let aspect = h / Math.sqrt(w * w + h * h) * 2;
        mat.uniforms.u_aspect.value.set((w / h) * aspect, aspect);

        aspect = h / Math.max(w, h);
        mat.uniforms.u_dirtAspect.value.set((w / h) * aspect, aspect);

        if (mat.defines.USE_HALO !== haloEnabled) {
            mat.defines.USE_HALO = haloEnabled;
            mat.needsUpdate = true;
        }

        if (this.USE_CONVOLUTION) {
            mat.uniforms.u_convolutionBuffer.value = this.convolutionBuffer;
        }

        this.mesh.material = mat
        this.base.fboHelper.renderMesh(this.mesh, this.highPassRenderTarget)
        // e.renderMaterial(mat, this.highPassRenderTarget);

        if (this.USE_CONVOLUTION) {
            this.base.fboHelper.copy(this.highPassRenderTarget.texture, this.fftCacheRT1);
            this.renderFFT(this.fftCacheRT1, this.fftCacheRT2, true);
            this.convolutionMixMaterial.uniforms.u_texture.value = this.fftCacheRT2.texture;
            this.base.fboHelper.render(this.convolutionMixMaterial, this.fftCacheRT1);
            this.renderFFT(this.fftCacheRT1, this.fftCacheRT2, false);

            let bloomAmount = this.amount * 1024;
            bloomAmount = bloomAmount / Math.pow(this.base.math.powerTwoCeilingBase(this.fftCacheRT1.width * this.fftCacheRT1.height), 4) * 0.85;

            this.fftBloomOutCacheMaterial.uniforms.u_amount.value = bloomAmount;
            this.fftBloomOutCacheMaterial.uniforms.u_saturation.value = this.saturation;
            this.fftBloomOutCacheMaterial.uniforms.u_texture.value = this.fftCacheRT2.texture;

            // e.renderMaterial(this.fftBloomOutCacheMaterial, this.fftBloomOutCacheRT);
            this.mesh.material = this.fftBloomOutCacheMaterial
            this.base.fboHelper.renderMesh(this.mesh, this.fftBloomOutCacheRT)


        } else {
            let input = this.highPassRenderTarget;

            for (let i = 0; i < this.ITERATION; i++) {
                const blurMat = this.blurMaterials[i];
                blurMat.uniforms.u_texture.value = input.texture;
                blurMat.uniforms.u_direction.value = this.directionX;
                // e.renderMaterial(blurMat, this.renderTargetsHorizontal[i]);
                this.mesh.material = blurMat
                this.base.fboHelper.renderMesh(this.mesh, this.renderTargetsHorizontal[i])

                blurMat.uniforms.u_texture.value = this.renderTargetsHorizontal[i].texture;
                blurMat.uniforms.u_direction.value = this.directionY;
                // e.renderMaterial(blurMat, this.renderTargetsVertical[i]);
                this.mesh.material = blurMat
                this.base.fboHelper.renderMesh(this.mesh, this.renderTargetsVertical[i])

                input = this.renderTargetsVertical[i];
            }

            this.material.uniforms.u_texture.value = readBuffer.texture;
            this.material.uniforms.u_saturation.value = this.base.math.mix(1, this.saturation, 0.5);

            for (let i = 0; i < this.ITERATION; i++) {
                const f = (this.ITERATION - i) / this.ITERATION;
                this.material.uniforms.u_bloomWeights.value[i] = this.amount * (f + (1.2 - f * 2) * this.radius) / Math.pow(2, this.ITERATION - i - 1);
            }

        }

        this.material.uniforms.u_texture.value = readBuffer.texture
        this.base.fboHelper.render(this.material, this.renderToScreen ? null : writeBuffer)
    }
}
