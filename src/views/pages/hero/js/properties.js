/**
 * justThreeJs properties.js
 * @author kongjianqiu
 * @description
 * @created 2025/3/21 11:26:43
 */

import * as THREE from "three";
import {quickLoader$1, MinSignal$2, BufItem} from '@/views/pages/hero/js/other/other'

export default class Properties {
    win = window;
    isSecureConnection = window.location.protocol === "https:";
    loader = quickLoader$1.create();
    percent = 0;
    easedPercent = 0;
    domRoot = document.querySelector(":root");
    _isSupportedDevice = !1;
    _isSupportedBrowser = !1;
    _isSupportedWebGL = !1;
    _isSupportedMobileOrientation = !1;
    _isSupported = !1;
    time = 0;
    deltaTime = 0;
    hasInitialized = !1;
    hasStarted = !1;
    startTime = 0;
    viewportWidth = 0;
    viewportHeight = 0;
    width = 0;
    height = 0;
    useMobileLayout = !1;
    renderer = null;
    scene = null;
    camera = null;
    cameraDirection = new THREE.Vector3(0, 0, 1);
    postprocessing = null;
    resolution = new THREE.Vector2;
    viewportResolution = new THREE.Vector2;
    bgColor = new THREE.Color;
    canvas = null;
    gl = null;
    webglDPR = 1;
    webglOpts = {
        antialias: !1,
        alpha: !1,
        xrCompatible: !1,
        powerPreference: "high-performance"
    };
    sharedUniforms = {
        u_aspect: {
            value: 1
        },
        u_cameraDirection: {
            value: this.cameraDirection
        },
        u_dpr: {
            value: 1
        },
        u_time: {
            value: 0
        },
        u_deltaTime: {
            value: 1
        },
        u_resolution: {
            value: this.resolution
        },
        u_viewportResolution: {
            value: this.viewportResolution
        },
        u_bgColor: {
            value: this.bgColor
        },
        u_globalRadius: {
            value: 0
        }
    };
    initTaskList = [];
    changeCamera = new MinSignal$2;
    smaa = null;
    fxaa = null;
    aboutPageHeroEfxPrepass = null;
    cameraMotionBlur = null;
    aboutPageHeroEfx = null;
    gtao = null;
    bloom = null;
    screenPaintDistortion = null;
    final = null;
    opacity = 1;
    cameraLookX = 0;
    cameraLookY = 0;
    defaults = {
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
        isSmaaEnabled: true
    };
    onFirstClicked = new MinSignal$2;
    isPreloaderFinished = !1;
    balloonsColorIndex = 0;
    globalRadius = 0;
    isContactFromProjectPage = !1;

    constructor() {
        this.loader.register(BufItem)
    }

    reset() {
        for (let e in this.defaults)
            this[e] = this.defaults[e];
        this.smaa && (this.smaa.enabled = !0)
    }
}
