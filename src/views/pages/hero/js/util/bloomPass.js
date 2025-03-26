/**
 * justThreeJs bloomPass.js
 * @author kongjianqiu
 * @description
 * @created 2025/3/26 17:34:20
 */

import * as THREE from "three";
import {Pass, FullScreenQuad} from 'three/addons/postprocessing/Pass.js';
// glsl
import convolutionSrcFrag from '@/views/pages/hero/glsl/common/bloom/convolutionSrcFrag.glsl'
import highPassFrag from '@/views/pages/hero/glsl/common/bloom/highPassFrag.glsl'
import fftFrag from '@/views/pages/hero/glsl/common/bloom/fftFrag.glsl'
import convolutionMixFrag from '@/views/pages/hero/glsl/common/bloom/convolutionMixFrag.glsl'
import convolutionCacheFrag from '@/views/pages/hero/glsl/common/bloom/convolutionCacheFrag.glsl'
import convolutionFrag from '@/views/pages/hero/glsl/common/bloom/convolutionFrag.glsl'
import blurFrag from '@/views/pages/hero/glsl/common/bloom/blurFrag.glsl'
import frag$2 from '@/views/pages/hero/glsl/common/bloom/frag$2.glsl'

class PostEffect {
    sharedUniforms = {};
    enabled = !0;
    material = null;
    renderOrder = 0;
    _hasShownWarning = !1;

    init(e) {
        Object.assign(this, e)
    }

    needsRender() {
        return !0
    }

    warn(e) {
        this._hasShownWarning || (console.warn(e), this._hasShownWarning = !0)
    }

    setPostprocessing(e) {
    }

    render(e, t = !1) {
        this.material.uniforms.u_texture && (this.material.uniforms.u_texture.value = e.fromTexture)
        this.base.fboHelper.render(this.material, t ? null : e.toRenderTarget)
        e.swap()
    }
}

class Bloom extends PostEffect {
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
    fftSrcRT;

    constructor(base) {
        super();
        this.base = base;
    }

    init(e) {
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
        const width = w;
        const height = h;

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
            super.setPostprocessing({width, height});

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

    render(e, shouldRender = false) {
        const w = this.base.width;
        const h = this.base.height;

        const mat = this.highPassMaterial;
        mat.uniforms.u_texture.value = e.fromTexture;
        mat.uniforms.u_luminosityThreshold.value = this.threshold;
        mat.uniforms.u_smoothWidth.value = this.smoothWidth;
        mat.uniforms.u_amount.value = this.highPassMultiplier;
        mat.uniforms.u_haloWidth.value = this.haloWidth;
        mat.uniforms.u_haloRGBShift.value = this.haloRGBShift * w;
        mat.uniforms.u_haloStrength.value = this.haloStrength;
        mat.uniforms.u_haloMaskInner.value = this.haloMaskInner;
        mat.uniforms.u_haloMaskOuter.value = this.haloMaskOuter;
        mat.uniforms.u_texelSize = e.sharedUniforms.u_texelSize;
        mat.uniforms.u_aspect = e.sharedUniforms.u_aspect;

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

        e.renderMaterial(mat, this.highPassRenderTarget);

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

            e.renderMaterial(this.fftBloomOutCacheMaterial, this.fftBloomOutCacheRT);

        } else {
            let input = this.highPassRenderTarget;

            for (let i = 0; i < this.ITERATION; i++) {
                const blurMat = this.blurMaterials[i];
                blurMat.uniforms.u_texture.value = input.texture;
                blurMat.uniforms.u_direction.value = this.directionX;
                e.renderMaterial(blurMat, this.renderTargetsHorizontal[i]);

                blurMat.uniforms.u_texture.value = this.renderTargetsHorizontal[i].texture;
                blurMat.uniforms.u_direction.value = this.directionY;
                e.renderMaterial(blurMat, this.renderTargetsVertical[i]);

                input = this.renderTargetsVertical[i];
            }

            this.material.uniforms.u_texture.value = e.fromTexture;
            this.material.uniforms.u_saturation.value = this.base.math.mix(1, this.saturation, 0.5);

            for (let i = 0; i < this.ITERATION; i++) {
                const f = (this.ITERATION - i) / this.ITERATION;
                this.material.uniforms.u_bloomWeights.value[i] =
                    this.amount * (f + (1.2 - f * 2) * this.radius) / Math.pow(2, this.ITERATION - i - 1);
            }

        }

        super.render(e, shouldRender);
    }
}
