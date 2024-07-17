/**
 * justThreeJs post.js
 * @author kongjianqiu
 * @description
 * @created 2024/7/16 14:24:27
 */
import * as THREE from "three";
import Postprocessing from "@/views/example/common/trail/js/postprocessing.js";

import blitVert from "@/views/example/common/postprocessing/glsl/blitVert.glsl";
import blitFrag from "@/views/example/common/postprocessing/glsl/blitFrag.glsl";
import uvBlitVert from "@/views/example/common/postprocessing/glsl/uvBlitVert.glsl";
import clearFrag from "@/views/example/common/postprocessing/glsl/clearFrag.glsl";
import blur9VaryingVertexShader from "@/views/example/common/postprocessing/glsl/blur9VaryingVertexShader.glsl";
import blur9VaryingFragmentShader from "@/views/example/common/postprocessing/glsl/blur9VaryingFragmentShader.glsl";
import blur9FragmentShader from "@/views/example/common/postprocessing/glsl/blur9FragmentShader.glsl";
import smaaBlendFrag from "@/views/example/common/postprocessing/glsl/smaaBlendFrag.glsl";
import smaaBlendVert from "@/views/example/common/postprocessing/glsl/smaaBlendVert.glsl";
import smaaEdgesFrag from "@/views/example/common/postprocessing/glsl/smaaEdgesFrag.glsl";
import smaaEdgesVert from "@/views/example/common/postprocessing/glsl/smaaEdgesVert.glsl";
import smaaWeightsFrag from "@/views/example/common/postprocessing/glsl/smaaWeightsFrag.glsl";
import smaaWeightsVert from "@/views/example/common/postprocessing/glsl/smaaWeightsVert.glsl";
import beforeFrag from "@/views/example/common/postprocessing/glsl/beforeFrag.glsl";
import screenPaintFrag from "@/views/example/common/postprocessing/glsl/screenPaintFrag.glsl";


function cUnMix(e, t, r) {
    let math = THREE.MathUtils;
    return math.clamp((r - e) / (t - e), 0, 1)
}

function fit(e, t, r, n, o, l) {
    return e = cUnMix(t, r, e), l && (e = l(e)), n + e * (o - n)
}

class FboHelper {
    isWebGL2;
    renderer;
    quadGeom;
    triGeom;
    floatType;
    precisionPrefix;
    precisionPrefix2;
    vertexShader;
    _scene;
    _camera;
    _tri;
    copyMaterial;
    uvCopyMaterial;
    clearMaterial;

    constructor() {

    }

    init(sence, floatType) {
        this.renderer = sence;
        this.floatType = floatType;
        this.isWebGL2 = this.renderer.capabilities.isWebGL2
        this._scene = new THREE.Scene
        this._camera = new THREE.Camera
        this._camera.position.z = 1
        this.triGeom = new THREE.BufferGeometry
        this.triGeom.setAttribute("position", new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 4, -1, 0, -1, 4, 0]), 3))
        this.quadGeom = new THREE.PlaneGeometry(2, 2)
        this._tri = new THREE.Mesh(this.triGeom)
        this._tri.frustumCulled = !1
        this._scene.add(this._tri)

        this.precisionPrefix = `
        precision ${this.renderer.capabilities.precision} float;
        `;

        this.precisionPrefix2 = `
        #version 300 es
			precision ${this.renderer.capabilities.precision} float;
			precision ${this.renderer.capabilities.precision} int;
			#define IS_WEBGL2 true
		`;
        if (this.isWebGL2) {

            this.vertexPrefix = `
            ${this.precisionPrefix2}
				precision mediump sampler2DArray;
				#define attribute in
				#define varying out
				#define texture2D texture
			`;

            this.fragmentPrefix = `
            ${this.precisionPrefix2}
				#define varying in
				out highp vec4 pc_fragColor;
				#define gl_FragColor pc_fragColor
				#define gl_FragDepthEXT gl_FragDepth
				#define texture2D texture
				#define textureCube texture
				#define texture2DProj textureProj
				#define texture2DLodEXT textureLod
				#define texture2DProjLodEXT textureProjLod
				#define textureCubeLodEXT textureLod
				#define texture2DGradEXT textureGrad
				#define texture2DProjGradEXT textureProjGrad
				#define textureCubeGradEXT textureGrad
			`;

        } else {
            this.vertexPrefix = this.precisionPrefix
            this.fragmentPrefix = this.precisionPrefix
        }
        this.renderer.getContext().getExtension("OES_standard_derivatives")

        this.vertexShader = this.precisionPrefix + blitVert
        this.copyMaterial = new THREE.RawShaderMaterial({
            uniforms: {u_texture: {value: null}},
            vertexShader: this.vertexShader,
            fragmentShader: this.precisionPrefix + blitFrag,
            depthTest: !1,
            depthWrite: !1,
            blending: THREE.NoBlending
        })
        this.uvCopyMaterial = new THREE.RawShaderMaterial({
            uniforms: {u_texture: {value: null}},
            vertexShader: this.precisionPrefix + uvBlitVert,
            fragmentShader: this.precisionPrefix + blitFrag,
            depthTest: !1,
            depthWrite: !1,
            blending: THREE.NoBlending
        })
        this.clearMaterial = new THREE.RawShaderMaterial({
            uniforms: {u_color: {value: new THREE.Vector4(1, 1, 1, 1)}},
            vertexShader: this.vertexShader,
            fragmentShader: this.precisionPrefix + clearFrag,
            depthTest: !1,
            depthWrite: !1,
            blending: THREE.NoBlending
        });
    }

    copy(e, t) {
        const r = this.copyMaterial;
        if (r) {
            r.uniforms.u_texture.value = e
            this.render(r, t)
        }
    }


    render(e, t) {
        if (this._tri && this.renderer && this._scene && this._camera) {
            this._tri.material = e
            t && this.renderer.setRenderTarget(t)
            this.renderer.render(this._scene, this._camera)
        }
    }

    renderMesh(e, t, r = this._camera) {
        if (this._tri && this.renderer && this._scene && r) {
            this._tri.visible = !1
            this._scene.add(e)
            t && this.renderer.setRenderTarget(t || null)
            this.renderer.render(this._scene, r)
            t && this.renderer.setRenderTarget(null)
            this._scene.remove(e)
            this._tri.visible = !0
        }
    }


    clearColor(e, t, r, n, o) {
        if (this.clearMaterial) {
            this.clearMaterial.uniforms.u_color.value.set(e, t, r, n)
            this.render(this.clearMaterial, o)
        }
    }

    getColorState() {
        if (!this.renderer) return {
            autoClear: !0,
            autoClearColor: !0,
            autoClearStencil: !0,
            autoClearDepth: !0,
            clearColor: 0,
            clearAlpha: 1
        };
        const e = new THREE.Color(0xff0000);
        this.renderer.getClearColor(e)
        return {
            autoClear: this.renderer.autoClear,
            autoClearColor: this.renderer.autoClearColor,
            autoClearStencil: this.renderer.autoClearStencil,
            autoClearDepth: this.renderer.autoClearDepth,
            clearColor: e.getHex(),
            clearAlpha: this.renderer.getClearAlpha()
        }
    }

    setColorState(e) {
        if (this.renderer) {
            this.renderer.setClearColor(e.clearColor, e.clearAlpha)
            this.renderer.autoClear = e.autoClear
            this.renderer.autoClearColor = e.autoClearColor
            this.renderer.autoClearStencil = e.autoClearStencil
            this.renderer.autoClearDepth = e.autoClearDepth
        }
    }

    createRawShaderMaterial(e) {
        e = Object.assign({
            depthTest: !1,
            depthWrite: !1,
            blending: THREE.NoBlending,
            vertexShader: blitVert,
            fragmentShader: blitFrag,
            derivatives: !1
        }, e)
        e.vertexShader = (e.vertexShaderPrefix ? e.vertexShaderPrefix : e.derivatives ? this.vertexPrefix : this.precisionPrefix) + e.vertexShader
        e.fragmentShader = (e.fragmentShaderPrefix ? e.fragmentShaderPrefix : e.derivatives ? this.fragmentPrefix : this.precisionPrefix) + e.fragmentShader
        delete e.vertexShaderPrefix
        delete e.fragmentShaderPrefix
        delete e.derivatives;
        let t = new THREE.RawShaderMaterial(e);
        return t
    }

    createDataTexture(e, t, r, n = !1, o = !0) {
        let type = n ? THREE.FloatType : THREE.UnsignedByteType;
        let magFilter = o ? THREE.NearestFilter : THREE.LinearFilter
        let minFilter = o ? THREE.NearestFilter : THREE.LinearFilter
        let l = new THREE.DataTexture(e, t, r, THREE.RGBAFormat, type, THREE.UVMapping, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, magFilter, minFilter, 0);
        l.needsUpdate = !0;
        return l
    }

    createRenderTarget(e, t, r = !1, n = !1, o = 0) {
        return new THREE.WebGLRenderTarget(e, t, {
            wrapS: THREE.ClampToEdgeWrapping,
            wrapT: THREE.ClampToEdgeWrapping,
            magFilter: r ? THREE.NearestFilter : THREE.LinearFilter,
            minFilter: r ? THREE.NearestFilter : THREE.LinearFilter,
            type: typeof n == "boolean" ? n ? this.floatType : THREE.UnsignedByteType : n,
            anisotropy: 0,
            // encoding: THREE.LinearEncoding,
            colorSpace: THREE.LinearSRGBColorSpace,
            depthBuffer: !1,
            stencilBuffer: !1,
            samples: o
        })
    }

    createMultisampleRenderTarget(e, t, r = !1, n = !1, o = 8) {
        if (!(this.renderer && this.isWebGL2)) {
            return this.createRenderTarget(e, t, r, n)
        } else {
            return new THREE.WebGLRenderTarget(e, t, {
                wrapS: THREE.ClampToEdgeWrapping,
                wrapT: THREE.ClampToEdgeWrapping,
                magFilter: r ? THREE.NearestFilter : THREE.LinearFilter,
                minFilter: r ? THREE.NearestFilter : THREE.LinearFilter,
                type: n ? this.floatType : THREE.UnsignedByteType,
                anisotropy: 0,
                // encoding: THREE.LinearEncoding,
                colorSpace: THREE.LinearSRGBColorSpace,
                depthBuffer: !1,
                stencilBuffer: !1,
                samples: o
            })
        }
    }

    clearMultisampleRenderTargetState(e) {
        e = e || this.renderer.getRenderTarget()
        if (e && e.samples > 0) {
            const t = this.renderer.properties.get(e);
            let r = this.renderer.getContext();
            r.bindFramebuffer(r.READ_FRAMEBUFFER, t.__webglMultisampledFramebuffer);
            r.bindFramebuffer(r.DRAW_FRAMEBUFFER, t.__webglFramebuffer);
            const n = e.width;
            const o = e.height;
            let l = r.COLOR_BUFFER_BIT;
            e.depthBuffer && (l |= r.DEPTH_BUFFER_BIT)
            e.stencilBuffer && (l |= r.STENCIL_BUFFER_BIT)
            r.blitFramebuffer(0, 0, n, o, 0, 0, n, o, l, r.NEAREST)
            r.bindFramebuffer(r.FRAMEBUFFER, t.__webglMultisampledFramebuffer)
        }
    }

}

class BlueNoise {
    shaderUniforms = {
        u_blueNoiseTexture: {value: null},
        u_blueNoiseLinearTexture: {value: null},
        u_blueNoiseTexelSize: {value: null},
        u_blueNoiseCoordOffset: {value: new THREE.Vector2()}
    };
    TEXTURE_SIZE = 128;

    constructor(base) {
        this.base = base
    }

    async init() {
        let e = new THREE.Texture;
        e.generateMipmaps = !1
        e.minFilter = e.magFilter = THREE.LinearFilter
        e.wrapS = e.wrapT = THREE.RepeatWrapping;
        let loader = new THREE.TextureLoader()
        let texture = await loader.loadAsync('https://lusion.dev/assets/textures/LDR_RGB1_0.png')
        let t = texture.image;
        e.image = t.image
        t.generateMipmaps = !1
        t.minFilter = t.magFilter = THREE.NearestFilter
        t.wrapS = t.wrapT = THREE.RepeatWrapping
        this.shaderUniforms.u_blueNoiseTexture.value = t
        this.shaderUniforms.u_blueNoiseLinearTexture.value = e
        this.shaderUniforms.u_blueNoiseTexelSize.value = new THREE.Vector2(1 / this.TEXTURE_SIZE, 1 / this.TEXTURE_SIZE)
    }

    update() {
        this.shaderUniforms.u_blueNoiseCoordOffset.value.set(Math.random(), Math.random())
    }
}

class PostEffect {
    shaderUniforms = {};
    enabled = !0;
    material = null;
    renderOrder = 0;
    _hasShownWarning = !1;

    constructor(base) {
        this.base = base
    }

    init(e) {
        Object.assign(this, e)
    }

    needsRender() {
        return !0
    }

    warn(e) {
        if (!this._hasShownWarning) {
            console.warn(e)
            this._hasShownWarning = !0
        }
    }

    setPostprocessing(e) {
    }

    render(e, t = !1) {
        this.material.uniforms.u_texture && (this.material.uniforms.u_texture.value = e.fromTexture)
        this.base.fboHelper.render(this.material, t ? null : e.toRenderTarget)
        e.swap()
    }
}

class Smaa extends PostEffect {
    edgesRenderTarget = null;
    weightsRenderTarget = null;
    edgesMaterial = null;
    weightsMaterial = null;
    renderOrder = 500;

    constructor(base) {
        super(base);
        this.base = base
    }

    init(e) {
        Object.assign(this, {
            shaderUniforms: {
                u_areaTexture: {value: null},
                u_searchTexture: {value: null}
            }
        }, e)
        super.init()
        this.weightsRenderTarget = this.base.fboHelper.createRenderTarget(1, 1)
        this.edgesRenderTarget = this.base.fboHelper.createRenderTarget(1, 1)
        this.edgesMaterial = new THREE.RawShaderMaterial({
            uniforms: {
                u_texture: {value: null},
                u_texelSize: null
            },
            vertexShader: this.base.fboHelper.precisionPrefix + smaaEdgesVert,
            fragmentShader: this.base.fboHelper.precisionPrefix + smaaEdgesFrag,
            defines: {SMAA_THRESHOLD: "0.1"},
            blending: THREE.NoBlending,
            depthTest: !1,
            depthWrite: !1
        })
        this.weightsMaterial = new THREE.RawShaderMaterial({
            uniforms: {
                u_edgesTexture: {value: this.edgesRenderTarget.texture},
                u_areaTexture: this.shaderUniforms.u_areaTexture,
                u_searchTexture: this.shaderUniforms.u_searchTexture,
                u_texelSize: null
            },
            vertexShader: this.base.fboHelper.precisionPrefix + smaaWeightsVert,
            fragmentShader: this.base.fboHelper.precisionPrefix + smaaWeightsFrag,
            defines: {
                SMAA_MAX_SEARCH_STEPS: "8",
                SMAA_AREATEX_MAX_DISTANCE: "16",
                SMAA_AREATEX_PIXEL_SIZE: "( 1.0 / vec2( 160.0, 560.0 ) )",
                SMAA_AREATEX_SUBTEX_SIZE: "( 1.0 / 7.0 )"
            },
            transparent: !0,
            blending: THREE.NoBlending,
            depthTest: !1,
            depthWrite: !1
        })
        this.material = this.base.fboHelper.createRawShaderMaterial({
            uniforms: {
                u_texture: {value: null},
                u_weightsTexture: {value: this.weightsRenderTarget.texture},
                u_texelSize: null
            },
            vertexShader: this.base.fboHelper.precisionPrefix + smaaBlendVert,
            fragmentShader: this.base.fboHelper.precisionPrefix + smaaBlendFrag
        })
    }

    setTextures(e, t) {
        const r = this.shaderUniforms.u_areaTexture.value = this._createTexture(e);
        r.minFilter = THREE.LinearFilter;
        const n = this.shaderUniforms.u_searchTexture.value = this._createTexture(t);
        n.magFilter = THREE.NearestFilter
        n.minFilter = THREE.NearestFilter
    }

    updateTextures() {
        this.shaderUniforms.u_areaTexture.value.needsUpdate = !0
        this.shaderUniforms.u_searchTexture.value.needsUpdate = !0
    }

    setPostprocessing(e) {
        super.setPostprocessing(e);
        const t = e.width, r = e.height;
        this.edgesRenderTarget.setSize(t, r)
        this.weightsRenderTarget.setSize(t, r)
    }

    dispose() {
        this.edgesRenderTarget && this.edgesRenderTarget.dispose()
        this.weightsRenderTarget && this.weightsRenderTarget.dispose()
    }

    needsRender() {
        return this.enabled && !this.shaderUniforms.u_areaTexture.value.needsUpdate && this.base.properties.isSmaaEnabled
    }

    render(parentThis, flag) {
        const r = this.base.fboHelper.getColorState();
        this.shaderUniforms.u_searchTexture.value || console.warn("You need to use Smaa.setImages() to set the smaa textures manually and assign to this class.");
        const n = this.base.fboHelper.renderer;
        if (n) {
            n.autoClear = !0
            n.setClearColor(0, 0)
        }
        this.edgesMaterial.uniforms.u_texelSize = this.weightsMaterial.uniforms.u_texelSize = this.material.uniforms.u_texelSize = parentThis.shaderUniforms.u_texelSize
        this.edgesMaterial.uniforms.u_texture.value = parentThis.fromTexture
        parentThis.renderMaterial(this.edgesMaterial, this.edgesRenderTarget)
        parentThis.renderMaterial(this.weightsMaterial, this.weightsRenderTarget)
        this.base.fboHelper.setColorState(r)
        this.material.uniforms.u_texture.value = parentThis.fromTexture
        super.render(parentThis, flag)
    }

    _createTexture(e) {
        const t = new THREE.Texture(e);
        t.generateMipmaps = !1
        t.flipY = !1
        return t
    }
}

class ScreenPaint {
    deltaXY = new THREE.Vector2();
    mouseXY = new THREE.Vector2();
    mousePixelXY = new THREE.Vector2();
    prevMousePixelXY = new THREE.Vector2();
    _prevMouseXY = new THREE.Vector2();
    hadMoved = !1;
    hasMoved = !1;
    _lowRenderTarget;
    _lowBlurRenderTarget;
    _prevPaintRenderTarget;
    _currPaintRenderTarget;
    _material;
    _material2;
    _distortionMaterial;
    _fromDrawData;
    _toDrawData;
    drawEnabled = !0;
    needsMouseDown = !1;
    enabled = !0;
    minRadius = 0;
    maxRadius = 100;
    radiusDistanceRange = 100;
    pushStrength = 25;
    accelerationDissipation = .8;
    velocityDissipation = .985;
    weight1Dissipation = .985;
    weight2Dissipation = .5;
    useNoise = !1;
    curlScale = .1;
    curlStrength = 5;
    _prevUseNoise = null;
    shaderUniforms = {
        u_paintTexelSize: {value: new THREE.Vector2()},
        u_paintTextureSize: {value: new THREE.Vector2()},
        u_prevPaintTexture: {value: null},
        u_currPaintTexture: {value: null},
        u_lowPaintTexture: {value: null}
    };
    _v$4 = new THREE.Vector2();

    constructor(base) {
        this.base = base
    }

    init() {

        this.base.parent.addEventListener('mousemove', (e) => {
            this.mouseXY.set(e.offsetX / this.base.parent.offsetWidth * 2 - 1, 1 - e.offsetY / this.base.parent.offsetHeight * 2)
            this.mousePixelXY.set(e.offsetX, e.offsetY)
            this.deltaXY.copy(this.mouseXY).sub(this._prevMouseXY)
            this._prevMouseXY.copy(this.mouseXY)
            this.hasMoved = this.deltaXY.length() > 0
        })

        this._lowRenderTarget = this.base.fboHelper.createRenderTarget(1, 1)
        this._lowBlurRenderTarget = this.base.fboHelper.createRenderTarget(1, 1)
        this._prevPaintRenderTarget = this.base.fboHelper.createRenderTarget(1, 1)
        this._currPaintRenderTarget = this.base.fboHelper.createRenderTarget(1, 1)
        this.shaderUniforms.u_lowPaintTexture.value = this._lowRenderTarget.texture
        this._material = this.base.fboHelper.createRawShaderMaterial({
            uniforms: {
                u_lowPaintTexture: {value: this._lowRenderTarget.texture},
                u_prevPaintTexture: this.shaderUniforms.u_prevPaintTexture,
                u_paintTexelSize: this.shaderUniforms.u_paintTexelSize,
                u_drawFrom: {value: this._fromDrawData = new THREE.Vector4(0, 0, 0, 0)},
                u_drawTo: {value: this._toDrawData = new THREE.Vector4(0, 0, 0, 0)},
                u_pushStrength: {value: 0},
                u_curlScale: {value: 0},
                u_curlStrength: {value: 0},
                u_vel: {value: new THREE.Vector2()},
                u_dissipations: {value: new THREE.Vector3()},
                u_scrollOffset: {value: new THREE.Vector2()}
            },
            fragmentShader: beforeFrag
        })
    }

    resize(e, t) {
        let r = e >> 2
        let n = t >> 2
        let o = e >> 3
        let l = t >> 3;
        if (r !== this._currPaintRenderTarget.width || n !== this._currPaintRenderTarget.height) {
            this._currPaintRenderTarget.setSize(r, n)
            this._prevPaintRenderTarget.setSize(r, n)
            this._lowRenderTarget.setSize(o, l)
            this._lowBlurRenderTarget.setSize(o, l)
            this.shaderUniforms.u_paintTexelSize.value.set(1 / r, 1 / n)
            this.shaderUniforms.u_paintTextureSize.value.set(r, n)
            this.clear()
        }
    }

    clear = () => {
        this.base.fboHelper.clearColor(.5, .5, 0, 0, this._lowRenderTarget)
        this.base.fboHelper.clearColor(.5, .5, 0, 0, this._lowBlurRenderTarget)
        this.base.fboHelper.clearColor(.5, .5, 0, 0, this._currPaintRenderTarget)
        this._material.uniforms.u_vel.value.set(0, 0)
    };

    postUpdate() {
        this.prevMousePixelXY.copy(this.mousePixelXY)
        this.hadMoved = this.hasMoved
        this.deltaXY.set(0, 0)
    }

    update(e) {
        if (!this.enabled) return;
        if (this.useNoise !== this._prevUseNoise) {
            this._material.defines.USE_NOISE = this.useNoise
            this._material.needsUpdate = !0
            this._prevUseNoise = this.useNoise
        }
        let t = this._currPaintRenderTarget.width
        let r = this._currPaintRenderTarget.height
        let n = this._prevPaintRenderTarget;


        this._prevPaintRenderTarget = this._currPaintRenderTarget
        this._currPaintRenderTarget = n
        this.shaderUniforms.u_prevPaintTexture.value = this._prevPaintRenderTarget.texture
        this.shaderUniforms.u_currPaintTexture.value = this._currPaintRenderTarget.texture;
        let l = 0;
        let c = 0;
        this._v$4.copy(this.mousePixelXY)
        this._v$4.x += l * this.base.viewportWidth * 3
        this._v$4.y += c * this.base.viewportHeight * 3;
        let u = this._v$4.distanceTo(this.prevMousePixelXY)
        let f = fit(u, 0, this.radiusDistanceRange, this.minRadius, this.maxRadius);
        if (!this.hadMoved || !this.drawEnabled) f = 0
        f = f / this.base.viewportHeight * r
        this._material.uniforms.u_pushStrength.value = this.pushStrength
        this._material.uniforms.u_curlScale.value = this.curlScale
        this._material.uniforms.u_curlStrength.value = this.curlStrength
        this._material.uniforms.u_dissipations.value.set(this.velocityDissipation, this.weight1Dissipation, this.weight2Dissipation)
        this._fromDrawData.copy(this._toDrawData)
        this._v$4.copy(this.mouseXY)
        this._v$4.x += l
        this._v$4.y += c
        this._toDrawData.set((this._v$4.x + 1) * t / 2, (this._v$4.y + 1) * r / 2, f, 1)
        this._v$4.set(this._toDrawData.x - this._fromDrawData.x, this._toDrawData.y - this._fromDrawData.y).multiplyScalar(e * .8)
        this._material.uniforms.u_vel.value.multiplyScalar(this.accelerationDissipation).add(this._v$4)
        this._material.uniforms.u_scrollOffset.value.y = l
        this._material.uniforms.u_scrollOffset.value.y = c
        this.base.fboHelper.render(this._material, this._currPaintRenderTarget)
        this.base.fboHelper.copy(this._currPaintRenderTarget.texture, this._lowRenderTarget)
        this.base.blur(8, 1, this._lowRenderTarget, this._lowBlurRenderTarget)

        this.postUpdate()
    }
}


class ScreenPaintDistortion extends PostEffect {
    screenPaint = null;
    amount = 20;
    rgbShift = 1;
    multiplier = 1.25;
    colorMultiplier = 1;
    shade = 1.25;
    renderOrder = 75;

    constructor(base) {
        super(base);
        this.base = base
    }

    init(e) {
        Object.assign(this, e)
        super.init()
        if (!this.screenPaint) throw new Error("screenPaint is required");
        this.material = this.base.fboHelper.createRawShaderMaterial({
            uniforms: Object.assign({
                u_texture: {value: null},
                u_screenPaintTexture: this.screenPaint.shaderUniforms.u_currPaintTexture,
                u_screenPaintTexelSize: this.screenPaint.shaderUniforms.u_paintTexelSize,
                u_amount: {value: 0},
                u_rgbShift: {value: 0},
                u_multiplier: {value: 0},
                u_colorMultiplier: {value: 0},
                u_shade: {value: 0}
            }, this.base.blueNoise.shaderUniforms),
            fragmentShader: screenPaintFrag
        })
    }

    needsRender(e) {
        return this.amount > 0
    }

    syncCamera(e) {
        this.needsSync = !0
        if (e) {
            e.matrixWorldInverse.decompose(this._position, this._quaternion, this._scale)
            this.projectionViewMatrix.multiplyMatrices(e.projectionMatrix, e.matrixWorldInverse)
            this.projectionViewInverseMatrix.copy(this.projectionViewMatrix).invert()
        }
        this.prevProjectionViewMatrix.copy(this.projectionViewMatrix)
    }

    render(e, t = !1) {
        this.material.uniforms.u_amount.value = this.amount
        this.material.uniforms.u_rgbShift.value = this.rgbShift
        this.material.uniforms.u_multiplier.value = this.multiplier
        this.material.uniforms.u_colorMultiplier.value = this.colorMultiplier
        this.material.uniforms.u_shade.value = this.shade
        super.render(e, t)
    }
}

class World {
    USE_FLOAT_PACKING = !1;
    DATA_FLOAT_TYPE = null;
    RENDER_TARGET_FLOAT_TYPE = null;
    USE_WEBGL2 = !0;
    _isSupportedDevice = !0;
    _isSupportedBrowser = !0;
    _isSupportedWebGL = !1;
    canvas = null;
    viewportWidth = 0;
    viewportHeight = 0;
    viewportResolution = new THREE.Vector2();
    width = 0;
    height = 0;
    MAX_PIXEL_COUNT = 2560 * 1440;
    USE_PIXEL_LIMIT = !0;
    DPR = Math.min(1.5, window.devicePixelRatio || 1) || 1;
    isSupported = true;
    renderer;
    gl;
    WEBGL_OFF = !1;
    webglDPR = 1;
    webglOpts = {antialias: !1, alpha: !1, xrCompatible: !1, powerPreference: "high-performance"};
    scene;
    resolution = new THREE.Vector2();
    bgColor = new THREE.Color(0xff0000);
    clearAlpha = 1;
    cameraDirection = new THREE.Vector3(0, 0, 5);
    shaderUniforms = {
        u_aspect: {value: 1},
        u_cameraDirection: {value: this.cameraDirection},
        u_dpr: {value: 1},
        u_time: {value: 0},
        u_deltaTime: {value: 1},
        u_resolution: {value: this.resolution},
        u_viewportResolution: {value: this.viewportResolution},
        u_bgColor: {value: this.bgColor},
        u_globalRadius: {value: 0}
    }
    blurMaterial;
    upscalerAmount = 1;
    upscalerSharpness = 1;
    postprocessing;
    screenPaintNeedsMouseDown = !1;
    screenPaintMinRadius = 0;
    screenPaintMaxRadius = 100;
    screenPaintRadiusDistanceRange = 100;
    screenPaintPushStrength = 25;
    screenPaintVelocityDissipation = .975;
    screenPaintWeight1Dissipation = .95;
    screenPaintWeight2Dissipation = .8;
    screenPaintUseNoise = !0;
    screenPaintCurlScale = .02;
    screenPaintCurlStrength = 3;
    screenPaintDistortionAmount = 3;
    screenPaintDistortionRGBShift = .5;
    screenPaintDistortionColorMultiplier = 10;
    screenPaintDistortionMultiplier = 5;
    properties = {
        isSmaaEnabled: !0
    }


    constructor(config = {}) {
        this.init(config)
    }

    blurInit() {
        let e = this.fboHelper.MAX_VARYING_VECTORS > 8;
        this.blurMaterial = new THREE.RawShaderMaterial({
            uniforms: {
                u_texture: {value: null},
                u_delta: {value: new THREE.Vector2()}
            },
            vertexShader: e ? this.fboHelper.precisionPrefix + blur9VaryingVertexShader : this.fboHelper.vertexShader,
            fragmentShader: this.fboHelper.precisionPrefix + (e ? blur9VaryingFragmentShader : blur9FragmentShader),
            depthWrite: !1,
            depthTest: !1
        })
    }

    blur(e, t, r, n, o, l) {
        let c = .25
        let u = Math.ceil(r.width * t) || 0
        let f = Math.ceil(r.height * t) || 0;
        if (!n) console.warn("You have to pass intermediateRenderTarget to blur")
        (u !== n.width || f !== n.height) && n.setSize(u, f)
        o ? l || o.setSize(r.width, r.height) : o = r
        this.blurMaterial.uniforms.u_texture.value = r.texture || r
        this.blurMaterial.uniforms.u_delta.value.set(e / u * c, 0)
        this.fboHelper.render(this.blurMaterial, n)

        this.blurMaterial.uniforms.u_texture.value = n.texture || n
        this.blurMaterial.uniforms.u_delta.value.set(0, e / f * c)
        this.fboHelper.render(this.blurMaterial, o)
    }

    checkSupportWebGL() {
        if (!(this.canvas instanceof HTMLCanvasElement)) return !1;

        if (this.USE_WEBGL2 && window.WebGL2RenderingContext) {
            try {
                this.gl = this.canvas.getContext("webgl2", this.webglOpts)
                this.RENDER_TARGET_FLOAT_TYPE = THREE.HalfFloatType
                this.DATA_FLOAT_TYPE = THREE.FloatType
                return !0
            } catch (e) {
                console.error(e)
                return !1;
            }
        }
        this.USE_WEBGL2 = !1
        if (window.WebGLRenderingContext) {
            try {
                let e = this.gl = this.canvas.getContext("webgl", this.webglOpts) || this.canvas.getContext("experimental-webgl", this.webglOpts);
                if ((e.getExtension("OES_texture_float") || e.getExtension("OES_texture_half_float")) && e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS)) {
                    this.RENDER_TARGET_FLOAT_TYPE = THREE.HalfFloatType
                    this.DATA_FLOAT_TYPE = THREE.FloatType;
                } else {
                    this.USE_FLOAT_PACKING = true;
                    this.RENDER_TARGET_FLOAT_TYPE = this.DATA_FLOAT_TYPE = THREE.UnsignedByteType;
                    return false;
                }
                return !0
            } catch (e) {
                console.error(e)
                return !1;
            }
        }
    }

    paramsInit(config) {
        this.parent = config.parent;
        this.canvas = config.canvas;
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            context: this.gl,
            premultipliedAlpha: !1
        })
        this.scene = new THREE.Scene;
        this.scene.background = new THREE.Color(0xffffff);
        this.camera = new THREE.PerspectiveCamera(45, 1, .1, 200)
        this.camera.position.set(0, 0, 10)
        this.scene.add(this.camera)
        this.shaderUniforms.u_resolution.value = this.resolution = new THREE.Vector2()
        this.shaderUniforms.u_viewportResolution.value = this.viewportResolution = new THREE.Vector2()
        this.shaderUniforms.u_bgColor.value = this.bgColor = new THREE.Color(0xff0000)

        this._isSupportedWebGL = this.checkSupportWebGL();

        this.dateTime = performance.now()

    }

    modelInit() {
        this.object = new THREE.Object3D();
        this.scene.add(this.object);

        const geometry = new THREE.SphereGeometry(0.5, 4, 4);
        const material = new THREE.MeshPhongMaterial({color: 0xffffff, flatShading: true});

        for (let i = 0; i < 500; i++) {

            const mesh = new THREE.Mesh(geometry, material);
            let x = (Math.random() - 0.5);
            let y = (Math.random() - 0.5);
            let z = (Math.random() - 0.5);
            mesh.position.set(x, y, z).normalize();
            mesh.position.multiplyScalar(Math.random() * 5);
            mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
            mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 0.5;
            this.object.add(mesh);

        }

        this.scene.add(new THREE.AmbientLight(0xcccccc));

        const light = new THREE.DirectionalLight(0xffffff, 3);
        light.position.set(1, 1, 1);
        this.scene.add(light);
    }

    resize() {
        let w = this.viewportWidth = this.parent.offsetWidth;
        let h = this.viewportHeight = this.parent.offsetHeight;
        this.viewportResolution = new THREE.Vector2(w, h)
        let r = w * this.DPR
        let n = h * this.DPR;
        if (this.USE_PIXEL_LIMIT === !0 && r * n > this.MAX_PIXEL_COUNT) {
            let o = r / n;
            n = Math.sqrt(this.MAX_PIXEL_COUNT / o)
            r = Math.ceil(n * o)
            n = Math.ceil(n)
        }
        this.width = r
        this.height = n
        this.webglDPR = this.width / w
        this.resolution.set(this.width, this.height)

        let e = Math.ceil(r * this.upscalerAmount)
        let t = Math.ceil(n * this.upscalerAmount)

        if (!this.WEBGL_OFF) {
            this.renderer.setSize(e, t)
            this.canvas.style.width = `${this.viewportWidth}px`
            this.canvas.style.height = `${this.viewportHeight}px`
            this.camera.aspect = this.width / this.height
            this.shaderUniforms.u_aspect.value = this.camera.aspect
            this.camera.updateProjectionMatrix()
            this.postprocessing.setSize(this.width, this.height)
            this.screenPaint.resize(this.width, this.height)
        }
    }

    async init(config) {

        this.paramsInit(config);
        this.modelInit();

        this.fboHelper = new FboHelper()
        this.fboHelper.init(this.renderer, THREE.HalfFloatType)

        this.blueNoise = new BlueNoise()
        this.blueNoise.init()

        this.blurInit()

        this.postprocessing = new Postprocessing(this);
        this.postprocessing.init()

        this.smaa = new Smaa(this);
        this.smaa.init();
        let loader = new THREE.TextureLoader()
        let t = await loader.loadAsync('https://lusion.dev/assets/textures/smaa-area.png')
        let e = await loader.loadAsync('https://lusion.dev/assets/textures/smaa-search.png')
        this.smaa.setTextures(t.image, e.image)
        this.postprocessing.queue.push(this.smaa)


        this.screenPaint = new ScreenPaint(this)
        this.screenPaint.init()

        this.screenPaintDistortion = new ScreenPaintDistortion(this);
        this.screenPaintDistortion.init({screenPaint: this.screenPaint})
        this.postprocessing.queue.push(this.screenPaintDistortion)


        this.resize();

        this.animation()


        window.onresize = () => this.resize()
    }

    animation() {
        requestAnimationFrame(() => this.animation())
        this.object.rotation.x += 0.005;
        this.object.rotation.y += 0.01;

        let a = performance.now()
        let e = (a - this.dateTime) / 1e3;
        this.dateTime = a
        e = Math.min(e, 1 / 20)

        if (!this.WEBGL_OFF) {
            this.blueNoise.update(e)
            this.screenPaint.update(e)
            this.renderer.setClearColor(this.bgColor, this.clearAlpha)

            this.screenPaint.minRadius = 0
            this.screenPaint.maxRadius = Math.max(40, this.viewportWidth / 20)
            this.screenPaint.radiusDistanceRange = this.screenPaintRadiusDistanceRange
            this.screenPaint.pushStrength = this.screenPaintPushStrength
            this.screenPaint.velocityDissipation = this.screenPaintVelocityDissipation
            this.screenPaint.weight1Dissipation = this.screenPaintWeight1Dissipation
            this.screenPaint.weight2Dissipation = this.screenPaintWeight2Dissipation
            this.screenPaint.useNoise = this.screenPaintUseNoise
            this.screenPaint.curlScale = this.screenPaintCurlScale
            this.screenPaint.curlStrength = this.screenPaintCurlStrength
            this.screenPaintDistortion.amount = this.screenPaintDistortionAmount
            this.screenPaintDistortion.rgbShift = this.screenPaintDistortionRGBShift
            this.screenPaintDistortion.colorMultiplier = this.screenPaintDistortionColorMultiplier
            this.screenPaintDistortion.multiplier = this.screenPaintDistortionMultiplier

        }
        this.postprocessing.render(this.scene, this.camera, !0)
    }

}


export default World
