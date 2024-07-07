/**
 * justThreeJs trail.js
 * @author kongjianqiu
 * @description
 * @created 2024/7/2 11:39:14
 */
import * as THREE from "three";
import {
    Properties,
    Settings,
    Browser,
    Support,
    ShaderHelper,
    TaskManager, TextureHelper, UI,
    Preloader
} from "@/views/example/common/trail/js/properties"
import {Input, ScrollManager} from "@/views/example/common/trail/js/input"
import FboHelper from "@/views/example/common/trail/js/fboHelper"
import Postprocessing from "@/views/example/common/trail/js/postprocessing"
import BlueNoise from "@/views/example/common/trail/js/blueNoise"
import Blur from "@/views/example/common/trail/js/blur"
import CameraControls from "@/views/example/common/trail/js/cameraControls"
import Visuals from "@/views/example/common/trail/js/visuals"
import ScreenPaint from "@/views/example/common/trail/js/screenPaint"
import {ScreenPaintDistortion, Smaa, Bloom, Final, Fsr, PreUfx, PostUfx} from "@/views/example/common/trail/js/pass.js"

export default class Trail {
    constructor() {
        this.canvas = document.getElementById('canvas')

        function preventZoom(a) {
            a.preventDefault()
            document.body.style.zoom = 1
        }

        window.addEventListener("wheel", a => a.preventDefault(), {passive: !1});
        document.addEventListener("gesturestart", a => preventZoom(a));
        document.addEventListener("gesturechange", a => preventZoom(a));
        document.addEventListener("gestureend", a => preventZoom(a));
        this.browser = new Browser()
        this.settings = new Settings()
        this.input = new Input(this)
        this.scrollManager = new ScrollManager(this)
        this.properties = new Properties()
        this.support = new Support(this)
        this.shaderHelper = new ShaderHelper()
        this.fboHelper = new FboHelper(this)
        this.taskManager = new TaskManager(this)
        this.blueNoise = new BlueNoise(this)
        this.blur = new Blur(this)
        this.screenPaint = new ScreenPaint(this)
        this.cameraControls = new CameraControls(this)
        this.visuals = new Visuals(this)
        this.ui = new UI(this)
        this.preloader = new Preloader(this)
        this.dateTime = performance.now()
        this._needsResize = !1
        this.preRun()
    }

    appInitEngine() {
        this.properties.canvas = document.getElementById("canvas")
        this.properties.isSupported = this.support.isSupported()
        if (this.properties.isSupported) {
            this.properties.renderer = new THREE.WebGLRenderer({
                canvas: this.properties.canvas,
                context: this.properties.gl,
                premultipliedAlpha: !1
            })
            this.properties.scene = new THREE.Scene
            this.properties.camera = new THREE.PerspectiveCamera(45, 1, .1, 200)
            this.properties.scene.add(this.properties.camera)
            this.properties.sharedUniforms.u_resolution.value = this.properties.resolution = new THREE.Vector2
            this.properties.sharedUniforms.u_viewportResolution.value = this.properties.viewportResolution = new THREE.Vector2
            this.properties.sharedUniforms.u_bgColor.value = this.properties.bgColor = new THREE.Color
            this.fboHelper.init(this.properties.renderer, this.settings.RENDER_TARGET_FLOAT_TYPE)
            this.properties.postprocessing = new Postprocessing(this)
            this.properties.postprocessing.init()
            this.blueNoise.preInit()

            this.properties.smaa = new Smaa(this)
            this.properties.smaa.init()
            this.properties.smaa.setTextures(this.properties.loader.add("https://lusion.dev/assets/textures/smaa-area.png", {weight: 32}).content, this.properties.loader.add("https://lusion.dev/assets/textures/smaa-search.png", {weight: .1}).content)
            this.properties.postprocessing.queue.push(this.properties.smaa);


            this.screenPaint.init()
            this.properties.screenPaintDistortion = new ScreenPaintDistortion(this)
            this.properties.screenPaintDistortion.init({screenPaint: this.screenPaint})
            this.properties.postprocessing.queue.push(this.properties.screenPaintDistortion)


        }
    }


    appPreInit() {
        if (!this.settings.WEBGL_OFF) {
            this.cameraControls.preInit()
            this.visuals.preInit()
        }
    }

    appInit() {
        if (!this.settings.WEBGL_OFF) {
            this.cameraControls.init()
            this.visuals.init()
        }
    }

    appStart() {
        this.visuals.start()
    }

    appPreUpdate(e = 0) {
        this.visuals.deactivateAll()
    }

    appUpdate(e = 0) {
        if (!this.settings.WEBGL_OFF) {
            this.properties.time = this.properties.sharedUniforms.u_time.value += e
            this.properties.deltaTime = this.properties.sharedUniforms.u_deltaTime.value = e
            this.visuals.syncProperties(e)
            this.blueNoise.update(e)
            this.screenPaint.update(e)
            this.cameraControls.update(e)
            this.visuals.update(e)
            this.properties.renderer.setClearColor(this.properties.bgColor, this.properties.clearAlpha)
            this.properties.bgColor.setStyle(this.properties.bgColorHex)
            this.screenPaint.needsMouseDown = this.properties.screenPaintNeedsMouseDown
            this.screenPaint.minRadius = 0
            this.screenPaint.maxRadius = Math.max(40, this.properties.viewportWidth / 20)
            this.screenPaint.radiusDistanceRange = this.properties.screenPaintRadiusDistanceRange
            this.screenPaint.pushStrength = this.properties.screenPaintPushStrength
            this.screenPaint.velocityDissipation = this.properties.screenPaintVelocityDissipation
            this.screenPaint.weight1Dissipation = this.properties.screenPaintWeight1Dissipation
            this.screenPaint.weight2Dissipation = this.properties.screenPaintWeight2Dissipation
            this.screenPaint.useNoise = this.properties.screenPaintUseNoise
            this.screenPaint.curlScale = this.properties.screenPaintCurlScale
            this.screenPaint.curlStrength = this.properties.screenPaintCurlStrength
            this.properties.screenPaintDistortion.amount = this.properties.screenPaintDistortionAmount
            this.properties.screenPaintDistortion.rgbShift = this.properties.screenPaintDistortionRGBShift
            this.properties.screenPaintDistortion.colorMultiplier = this.properties.screenPaintDistortionColorMultiplier
            this.properties.screenPaintDistortion.multiplier = this.properties.screenPaintDistortionMultiplier
            this.properties.upscaler && (this.properties.upscaler.sharpness = this.properties.upscalerSharpness)
            this.properties.postprocessing.render(this.visuals.currentStage3D, this.properties.camera, !0)
            window.__debugTexture && this.fboHelper.debugTo(window.__debugTexture)
        }
    }

    appResize(e, t) {
        if (!this.settings.WEBGL_OFF) {
            this.properties.renderer.setSize(e, t)
            this.properties.canvas.style.width = `${this.properties.viewportWidth}px`
            this.properties.canvas.style.height = `${this.properties.viewportHeight}px`
            this.properties.camera.aspect = this.properties.width / this.properties.height
            this.properties.sharedUniforms.u_aspect.value = this.properties.camera.aspect
            this.properties.camera.updateProjectionMatrix()
            this.properties.postprocessing.setSize(this.properties.width, this.properties.height)
            this.screenPaint.resize(this.properties.width, this.properties.height)
            this.visuals.resize(this.properties.width, this.properties.height)
        }
    }

    preRun() {
        for (const [a, e] of Object.entries(this.settings.CROSS_ORIGINS)) {
            this.properties.loader.setCrossOrigin(a, e)
        }
        this.run()
    }

    run() {
        let a = this.properties.viewportWidth = this.canvas.offsetWidth
        let e = this.properties.viewportHeight = this.canvas.offsetHeight;
        this.properties.viewportResolution = new THREE.Vector2(a, e)
        this.properties.width = a
        this.properties.height = e
        this.appInitEngine()
        this.ui.preInit()
        this.input.preInit()
        this.scrollManager.init()
        this.appPreInit()
        window.addEventListener("resize", () => {
            this.onResize()
        })
        this._onResize()
        this.loop()
        this.ui.preload(() => {
            this.init()
        }, () => {
            this.start()
        })
    }

    init() {
        this.input.init()
        this.ui.init()
        this.appInit()
        this.properties.hasInitialized = !0
    }

    start() {
        this.ui.start()
        this.appStart()
        this._onResize(!0)
        this.properties.hasStarted = !0
        this.scrollManager.isActive = !0
        if (this.settings.JUMP_SECTION !== "") {
            this.scrollManager.scrollTo(this.settings.JUMP_SECTION, this.settings.JUMP_OFFSET, !0)
        }
    }

    update(a) {
        this.scrollManager.autoScrollSpeed = this.properties.autoScrollSpeed
        window.__AUTO_SCROLL__ && (this.scrollManager.autoScrollSpeed = window.__AUTO_SCROLL__)
        this.taskManager.update()
        this.properties.reset()
        this.appPreUpdate(a)
        this.input.update(a)
        this.scrollManager.update(a)
        this.ui.update(a)
        this.appUpdate(a)
        this.input.postUpdate(a)
    }

    loop() {
        window.requestAnimationFrame(() => {
            this.loop()
        });
        let a = performance.now(), e = (a - this.dateTime) / 1e3;
        this.dateTime = a
        e = Math.min(e, 1 / 20)
        this._needsResize && this._onResize()
        this.properties.hasStarted && (this.properties.startTime += e)
        this.update(e)
        this._needsResize = !1
    }

    onResize() {
        this._needsResize = !0
    }

    _onResize(a) {
        let e = this.properties.viewportWidth = window.innerWidth
        let t = this.properties.viewportHeight = window.innerHeight;
        this.properties.viewportResolution.set(e, window.innerHeight)
        this.properties.useMobileLayout = e <= this.settings.MOBILE_WIDTH
        document.documentElement.style.setProperty("--vh", t * .01 + "px");
        let r = e * this.settings.DPR
        let n = t * this.settings.DPR;
        if (this.settings.USE_PIXEL_LIMIT === !0 && r * n > this.settings.MAX_PIXEL_COUNT) {
            let o = r / n;
            n = Math.sqrt(this.settings.MAX_PIXEL_COUNT / o)
            r = Math.ceil(n * o)
            n = Math.ceil(n)
        }
        this.properties.width = r
        this.properties.height = n
        this.properties.webglDPR = this.properties.width / e
        this.properties.resolution.set(this.properties.width, this.properties.height)
        a || this.input.resize()
        this.scrollManager.resize(e, t)
        this.ui.resize(e, t, a)
        this.appResize(Math.ceil(r * this.properties.upscalerAmount), Math.ceil(n * this.properties.upscalerAmount))
        this.scrollManager.resize(e, t)
    }
}
