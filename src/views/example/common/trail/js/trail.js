/**
 * justThreeJs trail.js
 * @author kongjianqiu
 * @description
 * @created 2024/7/2 11:39:14
 */
import * as THREE from "three";
import Base from "@/util/common/base.js";
import Blur from "@/views/example/common/trail/js/blur"
import FboHelper from "@/views/example/common/trail/js/fboHelper"
import ScreenPaint from "@/views/example/common/trail/js/screenPaint.js";
import ScreenPaintDistortion from "@/views/example/common/trail/js/screenPaintDistortion.js";
import Postprocessing from "@/views/example/common/trail/js/postprocessing.js";
import BlueNoise from "@/views/example/common/trail/js/blueNoise.js";
import Visuals from "@/views/example/common/trail/js/Visuals.js";
import CameraControls from "@/views/example/common/trail/js/cameraControls.js";

export default class Trail {
    constructor(el, config = {}) {
        this.properties = {
            cameraDirection: new THREE.Vector3(0, 0, 1),
            defaultCameraPosition: new THREE.Vector3(0, 0, 5),
            defaultLookAtPosition: new THREE.Vector3(0, 0, 0),
            autoScrollSpeed: 0,
            cameraNear: .1,
            cameraFar: 200,
            clearAlpha: 1,
            cameraFov: 45,
            cameraUsePhysical: !1,
            cameraFilmGauge: 35,
            cameraFocalLength: 35,
            cameraDollyZoomFovOffset: 0,
            screenPaintOffsetRatio: 1,
            cameraViewportOffsetX: 0,
            cameraViewportOffsetY: 0,
            cameraDistance: 5,
            cameraLookStrength: 0,
            cameraLookEaseDamp: .1,
            cameraShakePositionStrength: 0,
            cameraShakePositionSpeed: .15,
            cameraShakeRotationStrength: 0,
            cameraShakeRotationSpeed: .3,
            bloomAmount: 0,
            bloomRadius: 0,
            bloomThreshold: 0,
            bloomSmoothWidth: 0,
            bloomSaturation: 1,
            bloomHighPassMultiplier: 1,
            haloWidth: .6,
            haloRGBShift: .02,
            haloStrength: 0,
            haloMaskInner: .3,
            haloMaskOuter: .5,
            useFinal: !1,
            vignetteFrom: 2,
            vignetteTo: 5,
            vignetteColorHex: "#000000",
            saturation: 1,
            contrast: 0,
            brightness: 1,
            tintColorHex: "#000000",
            tintOpacity: 0,
            screenPaintNeedsMouseDown: !1,
            screenPaintMinRadius: 0,
            screenPaintMaxRadius: 100,
            screenPaintRadiusDistanceRange: 100,
            screenPaintPushStrength: 25,
            screenPaintVelocityDissipation: .975,
            screenPaintWeight1Dissipation: .95,
            screenPaintWeight2Dissipation: .8,
            screenPaintUseNoise: !0,
            screenPaintCurlScale: .02,
            screenPaintCurlStrength: 3,
            screenPaintDistortionAmount: 3,
            screenPaintDistortionRGBShift: .5,
            screenPaintDistortionColorMultiplier: 10,
            screenPaintDistortionMultiplier: 5,
            upscalerAmount: 1,
            upscalerSharpness: 1,
        }
        this.RENDER_TARGET_FLOAT_TYPE = THREE.HalfFloatType;
        this.DATA_FLOAT_TYPE = THREE.FloatType;
        this.canvas = document.getElementById('canvas')
        this.width = this.canvas.offsetWidth;
        this.height = this.canvas.offsetHeight;
        this.gl = this.canvas.getContext("webgl2", {
            antialias: !1,
            alpha: !1,
            xrCompatible: !1,
            powerPreference: "high-performance"
        })
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('canvas'),
            context: this.gl,
            premultipliedAlpha: false
        })
        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(45, 1, .1, 200)
        this.scene.add(this.camera)

        const geometry = new THREE.SphereGeometry(1.5, 32, 16);
        const material = new THREE.MeshBasicMaterial({color: 0x3a3a3a});
        const sphere = new THREE.Mesh(geometry, material);
        this.scene.add(sphere);


        this.mouseXY = new THREE.Vector2
        this.mousePixelXY = new THREE.Vector2
        this.prevMousePixelXY = new THREE.Vector2
        this.canvas.addEventListener('mousemove', (e) => {
            this.mouseXY.set(e.offsetX / this.width * 2 - 1, 1 - e.offsetY / this.height * 2)
            this.mousePixelXY.set(e.offsetX, e.offsetY)
            this.prevMousePixelXY.copy(this.mousePixelXY)
        })
        this.run()


    }


    run() {
        this.cameraControls = new CameraControls(this)
        this.cameraControls.preInit()
        this.visuals = new Visuals(this)
        this.blur = new Blur(this)
        this.fboHelper = new FboHelper(this)
        this.fboHelper.init(this.renderer, this.RENDER_TARGET_FLOAT_TYPE)
        this.postprocessing = new Postprocessing(this)
        this.postprocessing.init()
        this.blueNoise = new BlueNoise();
        this.blueNoise.preInit()
        this.screenPaint = new ScreenPaint(this)
        this.screenPaint.init()
        this.screenPaintDistortion = new ScreenPaintDistortion(this)
        this.screenPaintDistortion.init({screenPaint: this.screenPaint})
        this.postprocessing.queue.push(this.screenPaintDistortion)
        this.dateTime = performance.now()
        this.animation()
    }

    animation(e = 0) {
        let a = performance.now()
        e = (a - this.dateTime) / 1e3;
        this.dateTime = a
        e = Math.min(e, 1 / 20)
        requestAnimationFrame(() => {
            this.animation(e)
        })

        this.visuals.syncProperties(e)
        this.blueNoise.update(e)
        this.screenPaint.update(e)
        this.cameraControls.update(e)
        this.visuals.update(e)
        this.screenPaint.needsMouseDown = this.properties.screenPaintNeedsMouseDown
        this.screenPaint.minRadius = 0
        this.screenPaint.maxRadius = Math.max(40, this.width / 20)
        this.screenPaint.radiusDistanceRange = this.properties.screenPaintRadiusDistanceRange
        this.screenPaint.pushStrength = this.properties.screenPaintPushStrength
        this.screenPaint.velocityDissipation = this.properties.screenPaintVelocityDissipation
        this.screenPaint.weight1Dissipation = this.properties.screenPaintWeight1Dissipation
        this.screenPaint.weight2Dissipation = this.properties.screenPaintWeight2Dissipation
        this.screenPaint.useNoise = this.properties.screenPaintUseNoise
        this.screenPaint.curlScale = this.properties.screenPaintCurlScale
        this.screenPaint.curlStrength = this.properties.screenPaintCurlStrength
        this.screenPaintDistortion.amount = this.properties.screenPaintDistortionAmount
        this.screenPaintDistortion.rgbShift = this.properties.screenPaintDistortionRGBShift
        this.screenPaintDistortion.colorMultiplier = this.properties.screenPaintDistortionColorMultiplier
        this.screenPaintDistortion.multiplier = this.properties.screenPaintDistortionMultiplier
        this.postprocessing.render(this.visuals.currentStage3D, this.camera, !0)
    }


}
