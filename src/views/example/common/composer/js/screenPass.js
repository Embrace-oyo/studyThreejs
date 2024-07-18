/**
 * justThreeJs screenPass.js
 * @author kongjianqiu
 * @description
 * @created 2024/7/18 10:08:20
 */
import * as THREE from "three";
import screenPaintFrag from "@/views/example/common/postprocessing/glsl/screenPaintFrag.glsl";
import blitVert from "@/views/example/common/postprocessing/glsl/blitVert.glsl";
import blitFrag from "@/views/example/common/postprocessing/glsl/blitFrag.glsl";
import beforeFrag from "@/views/example/common/postprocessing/glsl/beforeFrag.glsl";
import uvBlitVert from "@/views/example/common/postprocessing/glsl/uvBlitVert.glsl";
import clearFrag from "@/views/example/common/postprocessing/glsl/clearFrag.glsl";
import blur9VaryingVertexShader from "@/views/example/common/postprocessing/glsl/blur9VaryingVertexShader.glsl";
import blur9VaryingFragmentShader from "@/views/example/common/postprocessing/glsl/blur9VaryingFragmentShader.glsl";
import blur9FragmentShader from "@/views/example/common/postprocessing/glsl/blur9FragmentShader.glsl";

class FullScreenQuad {
    quadScene;
    quadCamera;
    quadGeometry;
    quadMaterial;
    quadMesh;
    renderer;

    constructor(base) {
        this.base = base
        this.renderer = this.base.base.mainComposer.renderer;
        this.quadScene = new THREE.Scene();
        this.quadCamera = new THREE.Camera();
        this.quadCamera.position.z = 1;
        this.quadGeometry = new THREE.BufferGeometry;
        this.quadGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 4, -1, 0, -1, 4, 0]), 3));
        this.quadMesh = new THREE.Mesh(this.quadGeometry);
        this.quadMesh.frustumCulled = !1;
        this.quadScene.add(this.quadMesh);
        this.shaderPrefixInit()

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

    shaderPrefixInit() {
        this.floatType = THREE.HalfFloatType;
        this.isWebGL2 = this.renderer.capabilities.isWebGL2
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
    }

    copy(e, t) {
        const r = this.copyMaterial;
        if (r) {
            r.uniforms.u_texture.value = e
            this.render(r, t)
        }
    }

    render(e, t) {
        if (this.quadMesh && this.renderer && this.quadScene && this.quadCamera) {
            this.quadMesh.material = e
            t && this.renderer.setRenderTarget(t)
            this.renderer.render(this.quadScene, this.quadCamera)
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
    _v$4 = new THREE.Vector2();
    _material;
    _fromDrawData;
    _toDrawData;
    drawEnabled = !0;
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
    }

    constructor(props) {
        this.base = props;
        this.parent = this.base.base.parent;
        this.parent.addEventListener('mousemove', (e) => {
            this.mouseXY.set(e.offsetX / this.parent.offsetWidth * 2 - 1, 1 - e.offsetY / this.parent.offsetHeight * 2)
            this.mousePixelXY.set(e.offsetX, e.offsetY)
            this.deltaXY.copy(this.mouseXY).sub(this._prevMouseXY)
            this._prevMouseXY.copy(this.mouseXY)
            this.hasMoved = this.deltaXY.length() > 0
        })
        this._lowRenderTarget = this.base.quad.createRenderTarget(1, 1)
        this._lowBlurRenderTarget = this.base.quad.createRenderTarget(1, 1)
        this._prevPaintRenderTarget = this.base.quad.createRenderTarget(1, 1)
        this._currPaintRenderTarget = this.base.quad.createRenderTarget(1, 1)
        this.shaderUniforms.u_lowPaintTexture.value = this._lowRenderTarget.texture
        this._material = this.base.quad.createRawShaderMaterial({
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

        let e = this.base.quad.MAX_VARYING_VECTORS > 8;
        this.blurMaterial = new THREE.RawShaderMaterial({
            uniforms: {
                u_texture: {value: null},
                u_delta: {value: new THREE.Vector2()}
            },
            vertexShader: e ? this.base.quad.precisionPrefix + blur9VaryingVertexShader : this.base.quad.vertexShader,
            fragmentShader: this.base.quad.precisionPrefix + (e ? blur9VaryingFragmentShader : blur9FragmentShader),
            depthWrite: !1,
            depthTest: !1
        })
    }

    clear = () => {
        this.base.quad.clearColor(.5, .5, 0, 0, this._lowRenderTarget)
        this.base.quad.clearColor(.5, .5, 0, 0, this._lowBlurRenderTarget)
        this.base.quad.clearColor(.5, .5, 0, 0, this._currPaintRenderTarget)
        this._material.uniforms.u_vel.value.set(0, 0)
    };

    setSize(e, t) {
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

    cUnMix(e, t, r) {
        let math = THREE.MathUtils;
        return math.clamp((r - e) / (t - e), 0, 1)
    }

    fit(e, t, r, n, o, l) {
        return e = this.cUnMix(t, r, e), l && (e = l(e)), n + e * (o - n)
    }

    mouseUpdate() {
        this.prevMousePixelXY.copy(this.mousePixelXY)
        this.hadMoved = this.hasMoved
        this.deltaXY.set(0, 0)
    }

    beforeUpdate(e) {
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
        this._v$4.x += l * this.base.base.mainViewportWidth * 3
        this._v$4.y += c * this.base.base.mainViewportHeight * 3;
        let u = this._v$4.distanceTo(this.prevMousePixelXY)
        let f = this.fit(u, 0, this.radiusDistanceRange, this.minRadius, this.maxRadius);
        if (!this.hadMoved || !this.drawEnabled) f = 0
        f = f / this.base.base.mainViewportHeight * r
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
        this.base.quad.render(this.blurMaterial, n)

        this.blurMaterial.uniforms.u_texture.value = n.texture || n
        this.blurMaterial.uniforms.u_delta.value.set(0, e / f * c)
        this.base.quad.render(this.blurMaterial, o)
    }

    update() {
        let a = performance.now()
        let e = (a - this.base.base.mainDateTime) / 1e3;
        this.base.base.mainDateTime = a
        e = Math.min(e, 1 / 20)

        this.beforeUpdate(e)

        this.base.quad.render(this._material, this._currPaintRenderTarget)
        this.base.quad.copy(this._currPaintRenderTarget.texture, this._lowRenderTarget)

        this.blur(8, 1, this._lowRenderTarget, this._lowBlurRenderTarget)

        this.mouseUpdate()
    }
}


class ScreenPass {
    isPass = !0;
    enabled = !0;
    needsSwap = !0;
    clear = !1;
    renderToScreen = !1;
    amount = 20;
    rgbShift = 1;
    multiplier = 1.25;
    colorMultiplier = 1;
    shade = 1.25;
    renderOrder = 75;
    screenPaint = null;
    material;
    bgColor = new THREE.Color(0xff0000);
    clearAlpha = 1;
    blueNoiseShaderUniforms = {
        u_blueNoiseTexture: {value: null},
        u_blueNoiseLinearTexture: {value: null},
        u_blueNoiseTexelSize: {value: null},
        u_blueNoiseCoordOffset: {value: new THREE.Vector2()}
    };
    TEXTURE_SIZE = 128;
    resolution = new THREE.Vector2(0, 0);
    texelSize = new THREE.Vector2(0, 0);
    aspect = new THREE.Vector2(1, 1);
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


    constructor(base) {
        this.base = base;
        this.bgColor = this.base.mainBackgroundColor;
        this.blueNoiseInit();
        this.postGeometry = new THREE.BufferGeometry();
        this.postGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 4, -1, 0, -1, 4, 0]), 3))
        this.postGeometry.setAttribute("a_uvClamp", new THREE.BufferAttribute(new Float32Array([0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1]), 4))
        this.postMesh = new THREE.Mesh();
        this.quad = new FullScreenQuad(this);
        this.screenPaint = new ScreenPaint(this)
        this.passInit();
    }

    async blueNoiseInit() {
        let e = new THREE.Texture;
        e.generateMipmaps = !1
        e.minFilter = e.magFilter = THREE.LinearFilter
        e.wrapS = e.wrapT = THREE.RepeatWrapping;
        let loader = new THREE.TextureLoader()
        let texture = await loader.loadAsync('./texture/LDR_RGB1_0.png')
        let t = texture.image;
        e.image = t.image
        t.generateMipmaps = !1
        t.minFilter = t.magFilter = THREE.NearestFilter
        t.wrapS = t.wrapT = THREE.RepeatWrapping
        this.blueNoiseShaderUniforms.u_blueNoiseTexture.value = t
        this.blueNoiseShaderUniforms.u_blueNoiseLinearTexture.value = e
        this.blueNoiseShaderUniforms.u_blueNoiseTexelSize.value = new THREE.Vector2(1 / this.TEXTURE_SIZE, 1 / this.TEXTURE_SIZE)
    }

    blueNoiseUpdate() {
        this.blueNoiseShaderUniforms.u_blueNoiseCoordOffset.value.set(Math.random(), Math.random())
    }

    passInit() {
        this.material = this.quad.createRawShaderMaterial({
            uniforms: Object.assign({
                u_texture: {value: null},
                u_screenPaintTexture: this.screenPaint.shaderUniforms.u_currPaintTexture,
                u_screenPaintTexelSize: this.screenPaint.shaderUniforms.u_paintTexelSize,
                u_amount: {value: 0},
                u_rgbShift: {value: 0},
                u_multiplier: {value: 0},
                u_colorMultiplier: {value: 0},
                u_shade: {value: 0}
            }, this.blueNoiseShaderUniforms),
            fragmentShader: screenPaintFrag
        })

        this.sceneFlatRenderTarget = this.quad.createRenderTarget(1, 1)
        this.sceneMsRenderTarget = this.quad.createMultisampleRenderTarget(1, 1)
        this.fromRenderTarget = this.quad.createRenderTarget(1, 1)
        this.toRenderTarget = this.fromRenderTarget.clone()

        this.sceneFlatRenderTarget.depthBuffer = !0
        this.sceneMsRenderTarget.depthBuffer = !0

        this.useDepthTexture = !!this.useDepthTexture && this.quad.renderer && (this.quad.renderer.capabilities.isWebGL2 || this.quad.renderer.extensions.get("WEBGL_depth_texture"))
        this.fromTexture = this.fromRenderTarget.texture
        this.toTexture = this.toRenderTarget.texture
        this.sceneRenderTarget = this.sceneMsRenderTarget
        this.sceneTexture = this.sceneMsRenderTarget.texture
        this.mesh = new THREE.Mesh()
        this.shaderUniforms = {
            u_sceneTexture: {value: this.sceneTexture},
            u_fromTexture: {value: this.fromTexture},
            u_toTexture: {value: this.toTexture},
            u_sceneDepthTexture: {value: null},
            u_cameraNear: {value: 0},
            u_cameraFar: {value: 1},
            u_cameraFovRad: {value: 1},
            u_resolution: {value: this.resolution},
            u_texelSize: {value: this.texelSize},
            u_aspect: {value: this.aspect}
        }
        if (this.useDepthTexture && this.quad.renderer) {
            const t = new THREE.DepthTexture(this.resolution.width, this.resolution.height);
            this.quad.renderer.capabilities.isWebGL2 ? t.type = THREE.UnsignedIntType : (t.format = THREE.DepthStencilFormat, t.type = THREE.UnsignedInt248Type)
            t.minFilter = THREE.NearestFilter
            t.magFilter = THREE.NearestFilter
            this.sceneFlatRenderTarget.depthTexture = t
            this.sceneMsRenderTarget.depthTexture = t
            this.depthTexture = this.shaderUniforms.u_sceneDepthTexture.value = t
        }
    }

    passSetSize(e, t) {
        if (this.width !== e || this.height !== t) {
            this.width = e
            this.height = t
            this.resolution.set(e, t)
            this.texelSize.set(1 / e, 1 / t);
            const r = t / Math.sqrt(e * e + t * t) * 2;
            this.aspect.set(e / t * r, r)
            this.sceneFlatRenderTarget.setSize(e, t)
            this.sceneMsRenderTarget.setSize(e, t)
            this.fromRenderTarget.setSize(e, t)
            this.toRenderTarget.setSize(e, t)
        }
    }


    render(renderer, writeBuffer, readBuffer) {
        this.blueNoiseUpdate();
        this.screenPaint.update()
        renderer.setClearColor(this.bgColor, this.clearAlpha)

        this.screenPaint.minRadius = 0
        this.screenPaint.maxRadius = Math.max(40, this.base.mainViewportWidth / 20)
        this.screenPaint.radiusDistanceRange = this.screenPaintRadiusDistanceRange
        this.screenPaint.pushStrength = this.screenPaintPushStrength
        this.screenPaint.velocityDissipation = this.screenPaintVelocityDissipation
        this.screenPaint.weight1Dissipation = this.screenPaintWeight1Dissipation
        this.screenPaint.weight2Dissipation = this.screenPaintWeight2Dissipation
        this.screenPaint.useNoise = this.screenPaintUseNoise
        this.screenPaint.curlScale = this.screenPaintCurlScale
        this.screenPaint.curlStrength = this.screenPaintCurlStrength
        this.amount = this.screenPaintDistortionAmount
        this.rgbShift = this.screenPaintDistortionRGBShift
        this.colorMultiplier = this.screenPaintDistortionColorMultiplier
        this.multiplier = this.screenPaintDistortionMultiplier


        this.sceneRenderTarget = this.base.option.isSmaaEnabled ? this.sceneFlatRenderTarget : this.sceneMsRenderTarget
        this.sceneTexture = this.sceneRenderTarget.texture = readBuffer.texture;
        this.shaderUniforms.u_sceneTexture.value = this.sceneTexture


        this.quad.renderer.setRenderTarget(this.sceneRenderTarget)
        this.quad.renderer.render(this.base.mainScene, this.base.mainCamera)
        this.quad.renderer.setRenderTarget(null)
        this.quad.copy(this.sceneRenderTarget.texture, this.fromRenderTarget)

        const l = this.quad.getColorState();
        this.quad.renderer.autoClear = !1;


        this.material.uniforms.u_amount.value = this.amount
        this.material.uniforms.u_rgbShift.value = this.rgbShift
        this.material.uniforms.u_multiplier.value = this.multiplier
        this.material.uniforms.u_colorMultiplier.value = this.colorMultiplier
        this.material.uniforms.u_shade.value = this.shade

        renderer.setRenderTarget(null)


        // this.quad.render(this.material, this.fromRenderTarget)
        this.material.uniforms.u_texture = readBuffer.texture;
        this.quad.quadMesh.material = this.material;
        console.log(this.material);
        // renderer.setRenderTarget(this.screenPaint._currPaintRenderTarget)
        // renderer.render(this.quad.quadScene, this.quad.quadCamera)
        // renderer.setRenderTarget(writeBuffer)
        // this.quad.setColorState(l)


        /*     if (this.renderToScreen) {
                 renderer.setRenderTarget(null)
                 this.quad.render(renderer)
             } else {
                 renderer.setRenderTarget(writeBuffer)
                 if (this.clear) renderer.clear()
                 this.quad.render(renderer)
             }*/

    }

    setSize(w, h) {
        this.screenPaint.setSize(w, h);
        this.passSetSize(w, h);
    }

    dispose() {

    }
}


export {ScreenPass}
