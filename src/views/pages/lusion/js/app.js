/**
 * justThreeJs app.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/23 14:18:41
 */
import * as THREE from "three";
import Smaa from '@/views/pages/lusion/js/pass/smaa'
import Bloom from '@/views/pages/lusion/js/pass/bloom'
import ScreenPaintDistortion from '@/views/pages/lusion/js/pass/screenPaintDistortion'
import Fsr from '@/views/pages/lusion/js/pass/fsr'
import {preUfx, PostUfx} from "@/views/pages/lusion/js/pass/ufx.js";
import FinalPass from "@/views/pages/lusion/js/pass/finalPass";

function filePath(path) {
    return new URL(`../assets/${path}`, import.meta.url).href
}

export default class App {
    constructor(base) {
        this.base = base;
    }

    initEngine() {
        this.base.properties.canvas = document.getElementById("canvas");
        this.base.properties.isSupported = this.base.support.isSupported();

        if (!this.base.properties.isSupported) return;

        this.base.properties.renderer = new THREE.WebGLRenderer({
            canvas: this.base.properties.canvas,
            context: this.base.properties.gl,
            premultipliedAlpha: false
        });

        this.base.properties.scene = new THREE.Scene();
        this.base.properties.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 200);
        this.base.properties.scene.add(this.base.properties.camera);

        this.base.properties.shaderUniforms.u_resolution.value = this.base.properties.resolution = new THREE.Vector2();
        this.base.properties.shaderUniforms.u_viewportResolution.value = this.base.properties.viewportResolution = new THREE.Vector2();
        this.base.properties.shaderUniforms.u_bgColor.value = this.base.properties.bgColor = new THREE.Color();

        this.base.fboHelper.init(this.base.properties.renderer, this.base.settings.RENDER_TARGET_FLOAT_TYPE);
        this.base.textureHelper.init();

        this.base.properties.postprocessing = this.base.postprocessing;
        this.base.properties.postprocessing.init();

        this.base.blueNoise.preInit();
        this.base.glPositionOffset.init();
        this.base.screenPaint.init();

        // SMAA
        this.base.properties.smaa = new Smaa(this.base);
        this.base.properties.smaa.init();
        this.base.properties.smaa.setTextures(
            this.base.properties.loader.add(filePath('img/smaa-area.png'), {weight: 32}).content,
            this.base.properties.loader.add(filePath("img/smaa-search.png"), {weight: 0.1}).content
        );
        this.base.properties.postprocessing.queue.push(this.base.properties.smaa);

        // Bloom
        const useHD = !this.base.browser.isMobile || this.base.settings.USE_HD;
        this.base.properties.bloom = new Bloom(this.base);
        this.base.properties.bloom.init({USE_CONVOLUTION: useHD, USE_HD: useHD});
        this.base.properties.postprocessing.queue.push(this.base.properties.bloom);

        // Screen Paint Distortion
        this.base.properties.screenPaintDistortion = new ScreenPaintDistortion(this.base);
        this.base.properties.screenPaintDistortion.init({screenPaint: this.base.screenPaint});
        this.base.properties.postprocessing.queue.push(this.base.properties.screenPaintDistortion);

        // Final pass
        this.base.properties.finalPass = new FinalPass(this.base);
        this.base.properties.finalPass.init();
        this.base.properties.postprocessing.queue.push(this.base.properties.finalPass);

        // Upscaler (FSR)
        if (this.base.settings.UP_SCALE > 1) {
            this.base.properties.upscaler = new Fsr(this.base);
            this.base.properties.upscaler.init();
            this.base.properties.postprocessing.queue.push(this.base.properties.upscaler);
        }


        // preUfx pass
        this.preUfx = new preUfx(this.base);
        this.preUfx.init();
        this.base.properties.postprocessing.queue.push(this.preUfx);


        // postUfx pass
        this.postUfx = new PostUfx(this.base);
        this.postUfx.init();
        this.base.properties.postprocessing.queue.push(this.postUfx);
    }

    preInit() {
        if (!this.base.settings.WEBGL_OFF) {
            this.base.cameraControls.preInit();
            this.base.visuals.preInit();
        }
    }

    init() {
        if (this.base.settings.WEBGL_OFF) return;

        if (this.base.properties.smaa) {
            this.base.properties.smaa.updateTextures();
        }

        this.base.cameraControls.init();
        this.base.visuals.init();

        if (!this.base.settings.IS_DEV && console.clear) {
            // console.clear();
            console.log(
                "%c Created by Lusion: https://lusion.co/",
                "border:2px solid gray; padding:5px; font-family:monospace; font-size:11px;"
            );
        }
    }

    start() {
        this.base.visuals.start();
    }

    resize(width, height) {
        if (this.base.settings.WEBGL_OFF) return;

        this.base.properties.renderer.setSize(width, height);
        this.base.properties.canvas.style.width = `${this.base.properties.viewportWidth}px`;
        this.base.properties.canvas.style.height = `${this.base.properties.viewportHeight}px`;

        this.base.properties.camera.aspect = this.base.properties.width / this.base.properties.height;
        this.base.properties.shaderUniforms.u_aspect.value = this.base.properties.camera.aspect;
        this.base.properties.camera.updateProjectionMatrix();

        this.base.properties.postprocessing.setSize(this.base.properties.width, this.base.properties.height);
        this.base.screenPaint.resize(this.base.properties.width, this.base.properties.height);
        this.base.visuals.resize(this.base.properties.width, this.base.properties.height);
    }

    preUpdate(dt = 0) {
        this.base.visuals.deactivateAll();
    }

    update(e = 0) {
        if (this.base.settings.WEBGL_OFF) return;

        this.base.properties.time = this.base.properties.shaderUniforms.u_time.value += e;
        this.base.properties.deltaTime = this.base.properties.shaderUniforms.u_deltaTime.value = e;

        this.base.visuals.syncProperties(e);
        this.base.blueNoise.update(e);
        this.base.screenPaint.update(e);
        this.base.cameraControls.update(e);
        this.base.visuals.update(e);

        this.base.properties.renderer.setClearColor(this.base.properties.bgColor, this.base.properties.clearAlpha);
        this.base.properties.bgColor.setStyle(this.base.properties.bgColorHex);

        // 同步特效开关
        this.base.aboutPageHeroEfxPrepass.isActive = this.base.aboutHero.isActive;
        this.base.aboutPageHeroEfx.isActive = this.base.aboutHero.isActive;

        // Bloom 参数同步
        this.base.properties.bloom.amount = this.base.properties.bloomAmount;
        this.base.properties.bloom.radius = this.base.properties.bloomRadius;
        this.base.properties.bloom.threshold = this.base.properties.bloomThreshold;
        this.base.properties.bloom.smoothWidth = this.base.properties.bloomSmoothWidth;
        this.base.properties.bloom.haloWidth = this.base.properties.haloWidth;
        this.base.properties.bloom.haloRGBShift = this.base.properties.haloRGBShift;
        this.base.properties.bloom.haloStrength = this.base.properties.haloStrength;
        this.base.properties.bloom.haloMaskInner = this.base.properties.haloMaskInner;
        this.base.properties.bloom.haloMaskOuter = this.base.properties.haloMaskOuter;
        this.base.properties.bloom.saturation = this.base.properties.bloomSaturation;
        this.base.properties.bloom.highPassMultiplier = this.base.properties.bloomHighPassMultiplier * (this.base.properties.bloom.USE_CONVOLUTION ? 1 : 1.5);

        // Final Pass 参数同步
        this.base.properties.finalPass.isActive = this.base.properties.useFinal;
        this.base.properties.finalPass.vignetteFrom = this.base.properties.vignetteFrom;
        this.base.properties.finalPass.vignetteTo = this.base.properties.vignetteTo;
        this.base.properties.finalPass.vignetteColor.setStyle(this.base.properties.vignetteColorHex);
        this.base.properties.finalPass.saturation = this.base.properties.saturation;
        this.base.properties.finalPass.contrast = this.base.properties.contrast;
        this.base.properties.finalPass.brightness = this.base.properties.brightness;
        this.base.properties.finalPass.tintColor.setStyle(this.base.properties.tintColorHex);
        this.base.properties.finalPass.tintOpacity = this.base.properties.tintOpacity;
        this.base.properties.finalPass.bgColor.setStyle(this.base.properties.bgColorHex);
        this.base.properties.finalPass.opacity = this.base.properties.opacity;

        // ScreenPaint 参数同步
        this.base.screenPaint.needsMouseDown = this.base.properties.screenPaintNeedsMouseDown;
        this.base.screenPaint.minRadius = 0;
        this.base.screenPaint.maxRadius = Math.max(40, this.base.properties.viewportWidth / 20);
        this.base.screenPaint.radiusDistanceRange = this.base.properties.screenPaintRadiusDistanceRange;
        this.base.screenPaint.pushStrength = this.base.properties.screenPaintPushStrength;
        this.base.screenPaint.velocityDissipation = this.base.properties.screenPaintVelocityDissipation;
        this.base.screenPaint.weight1Dissipation = this.base.properties.screenPaintWeight1Dissipation;
        this.base.screenPaint.weight2Dissipation = this.base.properties.screenPaintWeight2Dissipation;
        this.base.screenPaint.useNoise = this.base.properties.screenPaintUseNoise;
        this.base.screenPaint.curlScale = this.base.properties.screenPaintCurlScale;
        this.base.screenPaint.curlStrength = this.base.properties.screenPaintCurlStrength;

        // ScreenPaint Distortion 参数同步
        this.base.properties.screenPaintDistortion.amount = this.base.properties.screenPaintDistortionAmount;
        this.base.properties.screenPaintDistortion.rgbShift = this.base.properties.screenPaintDistortionRGBShift;
        this.base.properties.screenPaintDistortion.colorMultiplier = this.base.properties.screenPaintDistortionColorMultiplier;
        this.base.properties.screenPaintDistortion.multiplier = this.base.properties.screenPaintDistortionMultiplier;

        // Upscaler 参数同步
        if (this.base.properties.upscaler) {
            this.base.properties.upscaler.sharpness = this.base.properties.upscalerSharpness;
        }

        // 后处理渲染
        if (this.base.transitionOverlay.activeRatio < 1) {
            this.base.properties.postprocessing.render(this.base.visuals.currentStage3D, this.base.properties.camera, true);
        }

        // Debug 显示 FBO
        if (window.__debugTexture) {
            this.base.fboHelper.debugTo(window.__debugTexture);
        }
    }

}
