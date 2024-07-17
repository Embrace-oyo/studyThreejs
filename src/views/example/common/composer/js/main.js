/**
 * justThreeJs main.js
 * @author kongjianqiu
 * @description
 * @created 2024/7/17 14:33:41
 */
import * as THREE from "three";
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';

import Smaa from "@/views/example/common/composer/js/smaa_pass.js";
import blitVert from "@/views/example/common/postprocessing/glsl/blitVert.glsl";
import blitFrag from "@/views/example/common/postprocessing/glsl/blitFrag.glsl";


class Main {
    mainWidth = 0;
    mainHeight = 0;
    mainViewportWidth = 0;
    mainViewportHeight = 0;
    mainResolution = new THREE.Vector2();
    mainViewportResolution = new THREE.Vector2();
    MAX_PIXEL_COUNT = 2560 * 1440;
    USE_PIXEL_LIMIT = !0;
    DPR = Math.min(1.5, window.devicePixelRatio || 1);
    mainCanvas;
    mainWebGL;
    mainWebGLConfig = {antialias: !1, alpha: !1, xrCompatible: !1, powerPreference: "high-performance"};
    mainRenderer;
    mainScene;
    mainCamera;
    mainComposer;
    mainDateTime;
    mainBackgroundColor = new THREE.Color(0xff0000);
    mainCameraDirection = new THREE.Vector3(0, 0, 5);
    mainObject;
    mainShaderUniforms = {
        u_aspect: {value: 1},
        u_cameraDirection: {value: this.mainCameraDirection},
        u_dpr: {value: 1},
        u_time: {value: 0},
        u_deltaTime: {value: 1},
        u_resolution: {value: this.mainResolution},
        u_viewportResolution: {value: this.mainViewportResolution},
        u_bgColor: {value: this.mainBackgroundColor},
        u_globalRadius: {value: 0}
    };
    isSmaaEnabled = !0;
    floatType = THREE.HalfFloatType;
    postScene;
    postCamera;
    postGeometry;
    postMesh;
    postTexelSize = new THREE.Vector2(0, 0);
    postAspect = new THREE.Vector2(1, 1);
    postShaderUniforms = {
        u_sceneTexture: {value: this.sceneTexture},
        u_fromTexture: {value: null},
        u_toTexture: {value: null},
        u_sceneDepthTexture: {value: null},
        u_cameraNear: {value: 0},
        u_cameraFar: {value: 1},
        u_cameraFovRad: {value: 1},
        u_resolution: {value: this.mainResolution},
        u_texelSize: {value: this.postTexelSize},
        u_aspect: {value: this.postAspect}
    }
    smaa;

    constructor(config = {}) {
        this.mainCanvas = config.canvas;
        if (window.WebGL2RenderingContext) {
            this.mainWebGL = this.mainCanvas.getContext("webgl2", this.mainWebGLConfig)
        } else {
            this.mainWebGL = this.mainCanvas.getContext("webgl", this.mainWebGLConfig) || this.mainCanvas.getContext("experimental-webgl", this.mainWebGLConfig)
        }
        this.mainRenderer = new THREE.WebGLRenderer({
            canvas: this.mainCanvas,
            context: this.mainWebGL,
            premultipliedAlpha: !1
        })
        this.mainScene = new THREE.Scene();
        this.mainScene.background = new THREE.Color(0xffffff);
        this.mainCamera = new THREE.PerspectiveCamera(45, 1, .1, 200)
        this.mainCamera.position.set(0, 0, 10)
        this.mainScene.add(this.mainCamera)
        this.mainDateTime = performance.now()


        this.FBOInit();
        this.backgroundLoad()
        this.postInit();
        this.smaa = new Smaa(this);
        this.resize(config)
        // this.composerInit()
        this.animation();

        window.onresize = () => {
            this.resize(config);
        }

    }

    backgroundLoad() {
        this.mainObject = new THREE.Object3D();
        this.mainScene.add(this.mainObject);

        const geometry = new THREE.SphereGeometry(0.5, 4, 4);

        for (let i = 0; i < 500; i++) {
            const material = new THREE.MeshPhongMaterial({color: 0xffffff * Math.random(), flatShading: true});
            const mesh = new THREE.Mesh(geometry, material);

            let x = (Math.random() - 0.5);
            let y = (Math.random() - 0.5);
            let z = (Math.random() - 0.5);

            mesh.position.set(x, y, z).normalize();
            mesh.position.multiplyScalar(Math.random() * 5);
            mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
            mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 0.5;

            this.mainObject.add(mesh);

        }

        const light = new THREE.DirectionalLight(0xffffff, 3);
        light.position.set(1, 1, 1);

        this.mainScene.add(new THREE.AmbientLight(0xcccccc));
        this.mainObject.add(light);
    }

    FBOInit() {
        this.isWebGL2 = this.mainRenderer.capabilities.isWebGL2
        this.precisionPrefix = `
        precision ${this.mainRenderer.capabilities.precision} float;
        `;

        this.precisionPrefix2 = `
        #version 300 es
			precision ${this.mainRenderer.capabilities.precision} float;
			precision ${this.mainRenderer.capabilities.precision} int;
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
        this.vertexShader = this.precisionPrefix + blitVert

        this.FBOSence = new THREE.Scene()
        this.FBOCamera = new THREE.Camera()
        this.FBOCamera.position.z = 1
        this.FBOGeometry = new THREE.BufferGeometry()
        this.FBOGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 4, -1, 0, -1, 4, 0]), 3))
        this.FBOMesh = new THREE.Mesh(this.FBOGeometry)
        this.FBOMesh.frustumCulled = !1
        this.FBOSence.add(this.FBOMesh)

        this.FBOCopyMaterial = new THREE.RawShaderMaterial({
            uniforms: {u_texture: {value: null}},
            vertexShader: this.vertexShader,
            fragmentShader: this.precisionPrefix + blitFrag,
            depthTest: !1,
            depthWrite: !1,
            blending: THREE.NoBlending
        })
    }

    backgroundUpdate() {
        this.mainObject.rotation.x += 0.005;
        this.mainObject.rotation.y += 0.01;
    }


    postInit() {
        this.postGeometry = new THREE.BufferGeometry
        this.postGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 4, -1, 0, -1, 4, 0]), 3))
        this.postGeometry.setAttribute("a_uvClamp", new THREE.BufferAttribute(new Float32Array([0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1]), 4))
        this.postMesh = new THREE.Mesh()

        this.sceneFlatRenderTarget = this.createRenderTarget(1, 1)
        this.sceneMsRenderTarget = this.createMultisampleRenderTarget(1, 1)
        this.fromRenderTarget = this.createRenderTarget(1, 1)
        this.toRenderTarget = this.fromRenderTarget.clone()

        this.sceneFlatRenderTarget.depthBuffer = !0
        this.sceneMsRenderTarget.depthBuffer = !0

        this.useDepthTexture = !!this.useDepthTexture && this.mainRenderer && (this.mainRenderer.capabilities.isWebGL2 || this.mainRenderer.extensions.get("WEBGL_depth_texture"))
        this.fromTexture = this.fromRenderTarget.texture
        this.toTexture = this.toRenderTarget.texture
        this.sceneRenderTarget = this.sceneMsRenderTarget
        this.sceneTexture = this.sceneMsRenderTarget.texture

        if (this.useDepthTexture && this.mainRenderer) {
            const t = new THREE.DepthTexture(this.mainResolution.width, this.mainResolution.height);
            this.mainRenderer.capabilities.isWebGL2 ? t.type = THREE.UnsignedIntType : (t.format = THREE.DepthStencilFormat, t.type = THREE.UnsignedInt248Type)
            t.minFilter = THREE.NearestFilter
            t.magFilter = THREE.NearestFilter
            this.sceneFlatRenderTarget.depthTexture = t
            this.sceneMsRenderTarget.depthTexture = t
            this.depthTexture = this.postShaderUniforms.u_sceneDepthTexture.value = t
        }
    }

    postSetSize(width, height) {
        this.postTexelSize.set(1 / width, 1 / height);
        const r = height / Math.sqrt(width * width + height * height) * 2;
        this.postAspect.set(width / height * r, r)
        this.sceneFlatRenderTarget.setSize(width, height)
        this.sceneMsRenderTarget.setSize(width, height)
        this.fromRenderTarget.setSize(width, height)
        this.toRenderTarget.setSize(width, height)
    }

    postRender(pass) {

        this.postScene = this.mainScene;
        this.postCamera = this.mainCamera;

        this.postMesh.geometry = this.postGeometry;
        this.sceneRenderTarget = this.isSmaaEnabled ? this.sceneFlatRenderTarget : this.sceneMsRenderTarget
        this.sceneTexture = this.sceneRenderTarget.texture
        this.postShaderUniforms.u_sceneTexture.value = this.sceneTexture
        this.postShaderUniforms.u_cameraNear.value = this.mainCamera.near
        this.postShaderUniforms.u_cameraFar.value = this.mainCamera.far
        this.postShaderUniforms.u_cameraFovRad.value = this.mainCamera.fov / 180 * Math.PI

        this.mainRenderer.setRenderTarget(this.sceneRenderTarget)
        this.mainRenderer.render(this.FBOSence, this.FBOCamera)
        this.mainRenderer.setRenderTarget(null)

        const r = this.FBOCopyMaterial;
        r.uniforms.u_texture.value = this.sceneRenderTarget.texture
        this.FBOMesh.material = r
        this.mainRenderer.setRenderTarget(this.fromRenderTarget)
        this.mainRenderer.render(this.FBOSence, this.FBOCamera)

        this.mainRenderer.autoClear = !1;

        pass.setPostprocessing(this)

        pass.render(this, !0)

        this.postSwap()
    }

    postSwap() {
        const e = this.fromRenderTarget;
        this.fromRenderTarget = this.toRenderTarget
        this.toRenderTarget = e
        this.fromTexture = this.fromRenderTarget.texture
        this.toTexture = this.toRenderTarget.texture
        this.postShaderUniforms.u_fromTexture.value = this.fromTexture
        this.postShaderUniforms.u_toTexture.value = this.toTexture
    }

    getColorState() {
        if (!this.mainRenderer) return {
            autoClear: !0,
            autoClearColor: !0,
            autoClearStencil: !0,
            autoClearDepth: !0,
            clearColor: 0,
            clearAlpha: 1
        };
        const e = new THREE.Color(0xff0000);
        this.mainRenderer.getClearColor(e)
        return {
            autoClear: this.mainRenderer.autoClear,
            autoClearColor: this.mainRenderer.autoClearColor,
            autoClearStencil: this.mainRenderer.autoClearStencil,
            autoClearDepth: this.mainRenderer.autoClearDepth,
            clearColor: e.getHex(),
            clearAlpha: this.mainRenderer.getClearAlpha()
        }
    }

    setColorState(e) {
        if (this.mainRenderer) {
            this.mainRenderer.setClearColor(e.clearColor, e.clearAlpha)
            this.mainRenderer.autoClear = e.autoClear
            this.mainRenderer.autoClearColor = e.autoClearColor
            this.mainRenderer.autoClearStencil = e.autoClearStencil
            this.mainRenderer.autoClearDepth = e.autoClearDepth
        }
    }

    composerInit() {
        this.mainComposer = new EffectComposer(this.mainRenderer);
        this.mainComposer.addPass(new RenderPass(this.mainScene, this.mainCamera));


        const outputPass = new OutputPass();
        this.mainComposer.addPass(outputPass);
    }

    createRenderTarget(width, height, r = !1, n = !1, o = 0) {
        return new THREE.WebGLRenderTarget(width, height, {
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

    createMultisampleRenderTarget(e, t, r = !1, n = !1, o = 8) {
        if (!(this.mainRenderer && this.isWebGL2)) {
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


    resize(config) {
        this.mainViewportWidth = config.DOM.offsetWidth;
        this.mainViewportHeight = config.DOM.offsetHeight;
        this.mainCanvas.style.width = `${this.mainWidth}px`
        this.mainCanvas.style.height = `${this.mainHeight}px`
        this.mainViewportResolution = new THREE.Vector2(this.mainViewportWidth, this.mainViewportHeight)
        let r = this.mainViewportWidth * this.DPR
        let n = this.mainViewportHeight * this.DPR;
        if (this.USE_PIXEL_LIMIT === !0 && r * n > this.MAX_PIXEL_COUNT) {
            let o = r / n;
            n = Math.sqrt(this.MAX_PIXEL_COUNT / o)
            r = Math.ceil(n * o)
            n = Math.ceil(n)
        }
        this.mainWidth = r
        this.mainHeight = n
        this.mainResolution.set(this.mainWidth, this.mainHeight);
        this.mainRenderer.setSize(this.mainWidth, this.mainHeight);
        if (this.mainComposer) this.mainComposer.setSize(this.mainWidth, this.mainHeight);
        this.mainCanvas.style.width = `${this.mainViewportWidth}px`;
        this.mainCanvas.style.height = `${this.mainViewportHeight}px`;
        this.mainCamera.aspect = this.mainWidth / this.mainHeight;
        this.mainShaderUniforms.u_aspect.value = this.mainCamera.aspect;
        this.mainCamera.updateProjectionMatrix()

        this.postSetSize(this.mainViewportWidth, this.mainViewportHeight)
    }

    animation(e = 0) {
        this.mainRenderer.setAnimationLoop((e) => this.animation(e))

        this.backgroundUpdate()

        this.postRender(this.smaa)

        this.setColorState(this.getColorState())


        if (this.mainComposer) {
            this.mainComposer.render();
        } else {
            this.mainRenderer.render(this.mainScene, this.mainCamera)
        }
    }

}

export default Main;
