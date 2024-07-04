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

export default class Trail extends Base {
    constructor(el, config = {}) {
        super(el, config);
        this.camera = new THREE.PerspectiveCamera(45, 1, .1, 200)
        this.camera.position.z = 10;
        this.camera.updateProjectionMatrix()
        this.scene.add(this.camera)

        this.mouseXY = new THREE.Vector2
        this.mousePixelXY = new THREE.Vector2
        this.prevMousePixelXY = new THREE.Vector2
        this.container.addEventListener('mousemove', (e) => {
            this.mouseXY.set(e.offsetX / this.width * 2 - 1, 1 - e.offsetY / this.height * 2)
            this.mousePixelXY.set(e.offsetX, e.offsetY)
            this.prevMousePixelXY.copy(this.mousePixelXY)
        })


        const geometry = new THREE.SphereGeometry(1.5, 32, 16);
        const material = new THREE.MeshBasicMaterial({color: 0x3a3a3a});
        const sphere = new THREE.Mesh(geometry, material);
        this.scene.add(sphere);

        this.run()

        let dateTime = performance.now()

        this.update(() => {
            let a = performance.now()
            let e = (a - dateTime) / 1e3;
            dateTime = a
            e = Math.min(e, 1 / 20)
            this.animation(e)
        })


    }


    run() {
        this.properties = {
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
        }
        this.visuals = new Visuals(this)
        this.blur = new Blur(this)
        this.fboHelper = new FboHelper(this)
        this.fboHelper.init(this.renderer, THREE.HalfFloatType)
        this.postprocessing = new Postprocessing(this)
        this.postprocessing.init()
        this.blueNoise = new BlueNoise();
        this.blueNoise.preInit()
        this.screenPaint = new ScreenPaint(this)
        this.screenPaint.init()
        this.screenPaintDistortion = new ScreenPaintDistortion(this)
        this.screenPaintDistortion.init({screenPaint: this.screenPaint})
        this.postprocessing.queue.push(this.screenPaintDistortion)
    }

    animation(e = 0) {
        this.visuals.syncProperties(e)
        this.blueNoise.update(e)
        this.screenPaint.update(e)
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
