/**
 * justThreeJs bloom.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/23 17:42:52
 */
import * as THREE from "three";
import PostEffect from '@/views/pages/lusion/js/pass/postEffect'
// glsl
import blurFrag from '@/views/pages/lusion/glsl/bloom/blurFrag.glsl'
import convolutionCacheFrag from '@/views/pages/lusion/glsl/bloom/convolutionCacheFrag.glsl'
import convolutionFrag from '@/views/pages/lusion/glsl/bloom/convolutionFrag.glsl'
import convolutionMixFrag from '@/views/pages/lusion/glsl/bloom/convolutionMixFrag.glsl'
import convolutionSrcFrag from '@/views/pages/lusion/glsl/bloom/convolutionSrcFrag.glsl'
import fftFrag from '@/views/pages/lusion/glsl/bloom/fftFrag.glsl'
import frag$2 from '@/views/pages/lusion/glsl/bloom/frag$2.glsl'
import highPassFrag from '@/views/pages/lusion/glsl/bloom/highPassFrag.glsl'



export default class Bloom extends PostEffect {
    ITERATION = 5;
    USE_CONVOLUTION = !0;
    USE_HD = !0;
    USE_LENS_DIRT = !1;

    // 效果参数
    amount = 1;
    radius = 0;
    threshold = .1;
    smoothWidth = 1;
    highPassMultiplier = 1;
    haloWidth = .8;
    haloRGBShift = .03;
    haloStrength = .21;
    haloMaskInner = .3;
    haloMaskOuter = .5;
    saturation = 1;
    renderOrder = 10;

    // 材质和渲染目标
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
    convolutionMixDownScale = 1;
    convolutionBuffer = .1;

    // 高斯模糊相关
    renderTargetsHorizontal = [];
    renderTargetsVertical = [];
    blurMaterials = [];

    // 方向向量
    directionX = new THREE.Vector2(1, 0);
    directionY = new THREE.Vector2(0, 1);

    constructor(base) {
        super(base);
        this.base = base;
    }

    init(e) {
        Object.assign(this, e);
        super.init();

        let t = THREE.HalfFloatType;

        // 创建高通过滤渲染目标和材质
        this.highPassRenderTarget = this.base.fboHelper.createRenderTarget(1, 1, !this.USE_HD, t);
        this.highPassMaterial = this.base.fboHelper.createRawShaderMaterial({
            uniforms: {
                u_texture: { value: null },
                u_luminosityThreshold: { value: 1 },
                u_smoothWidth: { value: 1 },
                u_amount: { value: 1 },
                u_haloWidth: { value: 1 },
                u_haloRGBShift: { value: 1 },
                u_haloStrength: { value: 1 },
                u_haloMaskInner: { value: 1 },
                u_haloMaskOuter: { value: 1 },
                u_texelSize: null,
                u_aspect: { value: new THREE.Vector2 },
                u_dirtTexture: { value: null },
                u_dirtAspect: { value: new THREE.Vector2 }
            },
            fragmentShader: highPassFrag
        });

        this.highPassMaterial.defines.USE_LENS_DIRT = this.USE_LENS_DIRT;

        if (this.USE_CONVOLUTION) {
            // 卷积方法初始化
            this.highPassMaterial.defines.USE_CONVOLUTION = !0;
            this.highPassMaterial.uniforms.u_convolutionBuffer = { value: .15 };

            this.fftSrcRT = this.base.fboHelper.createRenderTarget(1, 1, !0, t);
            this.fftCacheRT1 = this.base.fboHelper.createRenderTarget(1, 1, !0, t);
            this.fftCacheRT2 = this.fftCacheRT1.clone();
            this.fftBloomOutCacheRT = this.base.fboHelper.createRenderTarget(1, 1);

            this.srcMaterial = this.base.fboHelper.createRawShaderMaterial({
                uniforms: { u_aspect: { value: new THREE.Vector2 } },
                fragmentShader: this.convolutionSrcFrag
            });

            this.fftHMaterial = this.base.fboHelper.createRawShaderMaterial({
                uniforms: {
                    u_texture: { value: null },
                    u_texelSize: { value: new THREE.Vector2 },
                    u_subtransformSize: { value: 0 },
                    u_normalization: { value: 0 },
                    u_isForward: { value: 0 }
                },
                fragmentShader: fftFrag
            });
            this.fftHMaterial.defines.HORIZTONAL = !0;

            this.fftVMaterial = this.base.fboHelper.createRawShaderMaterial({
                uniforms: this.fftHMaterial.uniforms,
                fragmentShader: fftFrag
            });

            this.convolutionMixMaterial = this.base.fboHelper.createRawShaderMaterial({
                uniforms: {
                    u_texture: { value: null },
                    u_kernelTexture: { value: this.fftSrcRT.texture }
                },
                fragmentShader: convolutionMixFrag
            });

            this.fftBloomOutCacheMaterial = this.base.fboHelper.createRawShaderMaterial({
                uniforms: {
                    u_texture: { value: null },
                    u_amount: { value: 0 },
                    u_saturation: { value: 0 }
                },
                fragmentShader: convolutionCacheFrag
            });

            this.material = this.base.fboHelper.createRawShaderMaterial({
                uniforms: {
                    u_texture: { value: null },
                    u_bloomTexture: { value: this.fftBloomOutCacheRT.texture },
                    u_convolutionBuffer: this.highPassMaterial.uniforms.u_convolutionBuffer
                },
                fragmentShader: convolutionFrag,
                blending: THREE.NoBlending
            });
        } else {
            // 高斯模糊方法初始化
            for (let r = 0; r < this.ITERATION; r++) {
                this.renderTargetsHorizontal.push(this.base.fboHelper.createRenderTarget(1, 1, !1, t));
                this.renderTargetsVertical.push(this.base.fboHelper.createRenderTarget(1, 1, !1, t));

                const n = 3 + r * 2;
                this.blurMaterials[r] = this.base.fboHelper.createRawShaderMaterial({
                    uniforms: {
                        u_texture: { value: null },
                        u_resolution: { value: new THREE.Vector2 },
                        u_direction: { value: null }
                    },
                    fragmentShader: blurFrag,
                    defines: { KERNEL_RADIUS: n, SIGMA: n }
                });
            }

            this.material = this.base.fboHelper.createRawShaderMaterial({
                uniforms: {
                    u_texture: { value: null },
                    u_bloomStrength: { value: 1 },
                    u_bloomWeights: { value: [] },
                    u_saturation: { value: 0 }
                },
                fragmentShader: frag$2,
                blending: THREE.NoBlending,
                defines: { ITERATION: this.ITERATION }
            });

            for (let r = 0; r < this.ITERATION; r++) {
                this.material.uniforms["u_blurTexture" + r] = { value: this.renderTargetsVertical[r].texture };
            }
        }
    }

    setDirtTexture(e) {
        this.highPassMaterial.uniforms.u_dirtTexture.value = e;
    }

    setPostprocessing(e) {
        const t = e.width,
            r = e.height;

        if (this.USE_CONVOLUTION) {
            let n = this.base.math.powerTwoCeiling(t / 2) >> this.convolutionMixDownScale,
                a = this.base.math.powerTwoCeiling(r / 2) >> this.convolutionMixDownScale;

            this.highPassRenderTarget.setSize(n, a);

            if (n !== this.fftCacheRT1.width || a !== this.fftCacheRT1.height) {
                this.fftSrcRT.setSize(n, a);
                this.fftCacheRT1.setSize(n, a);
                this.fftCacheRT2.setSize(n, a);
                this.fftBloomOutCacheRT.setSize(n, a);

                let l = r / Math.max(t, r);
                this.srcMaterial.uniforms.u_aspect.value.set(t / r * l, l);
                this.base.fboHelper.render(this.srcMaterial, this.fftCacheRT1);
                this.renderFFT(this.fftCacheRT1, this.fftSrcRT, !0);
            }
        } else {
            let n = Math.ceil(t / 2),
                a = Math.ceil(r / 2);

            this.highPassRenderTarget.setSize(n, a);
            super.setPostprocessing(e);

            for (let l = 0; l < this.ITERATION; l++) {
                this.renderTargetsHorizontal[l].setSize(n, a);
                this.renderTargetsVertical[l].setSize(n, a);
                this.blurMaterials[l].uniforms.u_resolution.value.set(n, a);
                n = Math.ceil(n / 2);
                a = Math.ceil(a / 2);
            }
        }
    }

    dispose() {
        if (!this.USE_CONVOLUTION) {
            this.highPassRenderTarget && this.highPassRenderTarget.dispose();

            for (let e = 0; e < this.ITERATION; e++) {
                this.renderTargetsHorizontal[e] && this.renderTargetsHorizontal[e].dispose();
                this.renderTargetsVertical[e] && this.renderTargetsVertical[e].dispose();
            }
        }
    }

    needsRender() {
        return !!this.amount;
    }

    renderFFT(e, t, r) {
        let n = e.width,
            a = e.height,
            l = Math.round(Math.log(n) / Math.log(2)),
            c = Math.round(Math.log(a) / Math.log(2)),
            u = l + c,
            f = u % 2 === 0;

        this.fftHMaterial;
        let p = this.fftHMaterial.uniforms;

        for (let g = 0; g < u; g++) {
            let v = g < l;
            p.u_texture.value = e.texture;
            p.u_normalization.value = g === 0 ? 1 / Math.sqrt(n * a) : 1;
            p.u_isForward.value = !!r;
            p.u_texelSize.value.set(1 / n, 1 / a);
            p.u_subtransformSize.value = Math.pow(2, (v ? g : g - l) + 1);

            this.base.fboHelper.render(v ? this.fftHMaterial : this.fftVMaterial, t);

            let _ = e;
            e = t;
            t = _;
        }

        f && this.base.fboHelper.copy(e.texture, t);
    }

    render(e, t = !1) {
        let r = this.base.properties.postprocessing.width,
            n = this.base.properties.postprocessing.height;

        // 设置高通过滤材质参数
        this.highPassMaterial.uniforms.u_texture.value = e.fromTexture;
        this.highPassMaterial.uniforms.u_luminosityThreshold.value = this.threshold;
        this.highPassMaterial.uniforms.u_smoothWidth.value = this.smoothWidth;
        this.highPassMaterial.uniforms.u_amount.value = this.highPassMultiplier;
        this.highPassMaterial.uniforms.u_haloWidth.value = this.haloWidth;
        this.highPassMaterial.uniforms.u_haloRGBShift.value = this.haloRGBShift * r;
        this.highPassMaterial.uniforms.u_haloStrength.value = this.haloStrength;
        this.highPassMaterial.uniforms.u_haloMaskInner.value = this.haloMaskInner;
        this.highPassMaterial.uniforms.u_haloMaskOuter.value = this.haloMaskOuter;
        this.highPassMaterial.uniforms.u_texelSize = e.shaderUniforms.u_texelSize;
        this.highPassMaterial.uniforms.u_aspect = e.shaderUniforms.u_aspect;

        let a = this.haloStrength > 0, l = n / Math.sqrt(r * r + n * n) * 2;

        this.highPassMaterial.uniforms.u_aspect.value.set(r / n * l, l);
        l = n / Math.max(r, n);
        this.highPassMaterial.uniforms.u_dirtAspect.value.set(r / n * l, l);

        if (this.highPassMaterial.defines.USE_HALO !== a) {
            this.highPassMaterial.defines.USE_HALO = a;
            this.highPassMaterial.needsUpdate = !0;
        }

        if (this.USE_CONVOLUTION) {
            this.highPassMaterial.uniforms.u_convolutionBuffer.value = this.convolutionBuffer;
        }

        e.renderMaterial(this.highPassMaterial, this.highPassRenderTarget);

        if (this.USE_CONVOLUTION) {
            // 卷积方法渲染路径
            this.base.fboHelper.copy(this.highPassRenderTarget.texture, this.fftCacheRT1);
            this.renderFFT(this.fftCacheRT1, this.fftCacheRT2, !0);

            this.convolutionMixMaterial.uniforms.u_texture.value = this.fftCacheRT2.texture;
            this.base.fboHelper.render(this.convolutionMixMaterial, this.fftCacheRT1);

            this.renderFFT(this.fftCacheRT1, this.fftCacheRT2, !1);

            let c = this.amount * 1024;
            c = c / Math.pow(this.base.math.powerTwoCeilingBase(this.fftCacheRT1.width * this.fftCacheRT1.height), 4) * .85;

            this.fftBloomOutCacheMaterial.uniforms.u_amount.value = c;
            this.fftBloomOutCacheMaterial.uniforms.u_saturation.value = this.saturation;
            this.fftBloomOutCacheMaterial.uniforms.u_texture.value = this.fftCacheRT2.texture;

            e.renderMaterial(this.fftBloomOutCacheMaterial, this.fftBloomOutCacheRT);
            super.render(e, t);
        } else {
            // 高斯模糊方法渲染路径
            let c = this.highPassRenderTarget;

            for (let u = 0; u < this.ITERATION; u++) {
                const f = this.blurMaterials[u];

                f.uniforms.u_texture.value = c.texture;
                f.uniforms.u_direction.value = this.directionX;
                e.renderMaterial(f, this.renderTargetsHorizontal[u]);

                f.uniforms.u_texture.value = this.renderTargetsHorizontal[u].texture;
                f.uniforms.u_direction.value = this.directionY;
                e.renderMaterial(f, this.renderTargetsVertical[u]);

                c = this.renderTargetsVertical[u];
            }

            this.material.uniforms.u_texture.value = e.fromTexture;
            this.material.uniforms.u_saturation.value = this.base.math.mix(1, this.saturation, .5);

            for (let u = 0; u < this.ITERATION; u++) {
                const f = (this.ITERATION - u) / this.ITERATION;
                this.material.uniforms.u_bloomWeights.value[u] = this.amount * (f + (1.2 - f * 2) * this.radius) / Math.pow(2, this.ITERATION - u - 1);
            }

            super.render(e, t);
        }
    }
}
