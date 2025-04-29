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
import {PreUfx, PostUfx} from "@/views/pages/lusion/js/pass/ufx.js";
import FinalPass from "@/views/pages/lusion/js/pass/finalPass";

function filePath(path) {
    return new URL(`../../assets/${path}`, import.meta.url).href
}

export default class App {
    // 初始化WebGL引擎
    constructor(base) {
        this.base = base;
    }

    initEngine() {
        // 获取画布元素
        this.base.properties.canvas = document.getElementById("canvas");

        // 检查浏览器支持情况
        this.base.properties.isSupported = this.base.support.isSupported();

        if (this.base.properties.isSupported) {

            // 初始化WebGL渲染器
            this.base.properties.renderer = new THREE.WebGLRenderer({
                canvas: this.base.properties.canvas,
                context: this.base.properties.gl,
                premultipliedAlpha: false // 禁用预乘alpha
            });

            // 初始化场景和相机
            this.base.properties.scene = new THREE.Scene();
            this.base.properties.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 200);
            this.base.properties.scene.add(this.base.properties.camera);

            // 设置共享uniform变量
            this.base.properties.shaderUniforms.u_resolution.value = this.base.properties.resolution = new THREE.Vector2();
            this.base.properties.shaderUniforms.u_viewportResolution.value = this.base.properties.viewportResolution = new THREE.Vector2();
            this.base.properties.shaderUniforms.u_bgColor.value = this.base.properties.bgColor = new THREE.Color();


            // 初始化各种辅助工具
            this.base.fboHelper.init(this.base.properties.renderer, this.base.settings.RENDER_TARGET_FLOAT_TYPE);
            this.base.textureHelper.init();

            // 初始化后处理系统
            this.base.properties.postprocessing = this.base.postprocessing;
            this.base.properties.postprocessing.init();

            // 初始化蓝噪声
            this.base.blueNoise.preInit();

            // 初始化位置偏移和屏幕绘制效果
            // glPositionOffset.init();
            this.base.screenPaint.init();

            // 初始化SMAA抗锯齿
            this.base.properties.smaa = new Smaa(this.base);
            this.base.properties.smaa.init();
            this.base.properties.smaa.setTextures(
                this.base.properties.loader.add(filePath("img/smaa-area.png"), {weight: 32}).content,
                this.base.properties.loader.add(filePath("img/smaa-search.png"), {weight: 0.1}).content
            );
            this.base.properties.postprocessing.queue.push(this.base.properties.smaa);

            // 初始化Bloom效果
            const useHighQualityBloom = !this.base.browser.isMobile || this.base.settings.USE_HD;
            this.base.properties.bloom = new Bloom(this.base);
            this.base.properties.bloom.init({
                USE_CONVOLUTION: useHighQualityBloom,
                USE_HD: useHighQualityBloom
            });
            this.base.properties.postprocessing.queue.push(this.base.properties.bloom);

            // 初始化屏幕绘制扭曲效果
            this.base.properties.screenPaintDistortion = this.base.screenPaintDistortion;
            this.base.properties.screenPaintDistortion.init({screenPaint: this.base.screenPaint});
            this.base.properties.postprocessing.queue.push(this.base.properties.screenPaintDistortion);

            // 初始化最终输出效果
            this.base.properties.final = new FinalPass(this.base);
            this.base.properties.final.init();
            this.base.properties.postprocessing.queue.push(this.base.properties.final);

            // 初始化超分辨率缩放(如果启用)
            if (this.base.settings.UP_SCALE > 1) {
                this.base.properties.upscaler = new Fsr(this.base);
                this.base.properties.upscaler.init();
                this.base.properties.postprocessing.queue.push(this.base.properties.upscaler);
            }

            // 初始化前后特效
            this.base.preUfx.init();
            this.base.properties.postprocessing.queue.push(this.base.preUfx);
            this.base.postUfx.init();
            this.base.properties.postprocessing.queue.push(this.base.postUfx);
        }
    }

    // 预初始化
    preInit() {
        if (!this.base.settings.WEBGL_OFF) {
            this.base.cameraControls.preInit();
            this.base.visuals.preInit();
            // audios.preInit();
        }
    }

    // 初始化
    init() {
        if (!this.base.settings.WEBGL_OFF) {
            // 更新SMAA纹理
            this.base.properties.smaa && this.base.properties.smaa.updateTextures();

            // 初始化各子系统
            this.base.cameraControls.init();
            this.base.visuals.init();
            // audios.init();

            // 生产环境清除控制台并显示版权信息
            /*if (this.base.settings.IS_DEV === false) {
                console.clear && console.clear();
                console.log("%c Created by Lusion: https://lusion.co/",
                    "border:2px solid gray; padding:5px; font-family:monospace; font-size:11px;");
            }*/
        }
    }

    // 启动应用
    start() {
        this.base.visuals.start();
    }

    // 响应视窗大小变化
    resize(width, height) {
        if (!this.base.settings.WEBGL_OFF) {
            // 更新渲染器尺寸
            this.base.properties.renderer.setSize(width, height);

            // 设置画布CSS尺寸
            this.base.properties.canvas.style.width = `${this.base.properties.viewportWidth}px`;
            this.base.properties.canvas.style.height = `${this.base.properties.viewportHeight}px`;

            // 更新相机参数
            this.base.properties.camera.aspect = this.base.properties.width / this.base.properties.height;
            this.base.properties.shaderUniforms.u_aspect.value = this.base.properties.camera.aspect;
            this.base.properties.camera.updateProjectionMatrix();

            // 更新后处理系统尺寸
            this.base.properties.postprocessing.setSize(this.base.properties.width, this.base.properties.height);

            // 调整屏幕绘制效果尺寸
            this.base.screenPaint.resize(this.base.properties.width, this.base.properties.height);

            // 调整视觉效果尺寸
            this.base.visuals.resize(this.base.properties.width, this.base.properties.height);
        }
    }

    // 帧更新前的准备工作
    preUpdate(deltaTime = 0) {
        this.base.visuals.deactivateAll();
    }

    // 帧更新
    update(deltaTime = 0) {
        if (!this.base.settings.WEBGL_OFF) {
            // 更新时间相关属性
            this.base.properties.time = this.base.properties.shaderUniforms.u_time.value += deltaTime;
            this.base.properties.deltaTime = this.base.properties.shaderUniforms.u_deltaTime.value = deltaTime;

            // 同步视觉效果属性
            this.base.visuals.syncProperties(deltaTime);

            // 更新各子系统
            this.base.blueNoise.update(deltaTime);
            this.base.screenPaint.update(deltaTime);
            this.base.cameraControls.update(deltaTime);
            this.base.visuals.update(deltaTime);
            // audios.update(deltaTime);

            // 设置渲染器清除颜色
            this.base.properties.renderer.setClearColor(this.base.properties.bgColor, this.base.properties.clearAlpha);
            this.base.properties.bgColor.setStyle(this.base.properties.bgColorHex);

            if (this.base.pagesManager.aboutPage.aboutWhoSection.aboutHero !== undefined) {
                // 设置特效激活状态
                this.base.aboutPageHeroEfxPrepass.isActive = this.base.pagesManager.aboutPage.aboutWhoSection.aboutHero.isActive;
                this.base.aboutPageHeroEfx.isActive = this.base.pagesManager.aboutPage.aboutWhoSection.aboutHero.isActive;
            }


            // goalTunnelEfx.isActive = goalTunnels.isActive;

            // 配置Bloom效果参数
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
            this.base.properties.bloom.highPassMultiplier = this.base.properties.bloomHighPassMultiplier *
                (this.base.properties.bloom.USE_CONVOLUTION ? 1 : 1.5);

            // 配置最终输出效果参数
            this.base.properties.final.isActive = this.base.properties.useFinal;
            this.base.properties.final.vignetteFrom = this.base.properties.vignetteFrom;
            this.base.properties.final.vignetteTo = this.base.properties.vignetteTo;
            this.base.properties.final.vignetteColor.setStyle(this.base.properties.vignetteColorHex);
            this.base.properties.final.saturation = this.base.properties.saturation;
            this.base.properties.final.contrast = this.base.properties.contrast;
            this.base.properties.final.brightness = this.base.properties.brightness;
            this.base.properties.final.tintColor.setStyle(this.base.properties.tintColorHex);
            this.base.properties.final.tintOpacity = this.base.properties.tintOpacity;
            this.base.properties.final.bgColor.setStyle(this.base.properties.bgColorHex);
            this.base.properties.final.opacity = this.base.properties.opacity;

            // 配置屏幕绘制效果参数
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

            // 配置屏幕绘制扭曲效果参数
            this.base.properties.screenPaintDistortion.amount = this.base.properties.screenPaintDistortionAmount;
            this.base.properties.screenPaintDistortion.rgbShift = this.base.properties.screenPaintDistortionRGBShift;
            this.base.properties.screenPaintDistortion.colorMultiplier = this.base.properties.screenPaintDistortionColorMultiplier;
            this.base.properties.screenPaintDistortion.multiplier = this.base.properties.screenPaintDistortionMultiplier;

            // 配置超分辨率缩放参数(如果启用)
            if (this.base.properties.upscaler) {
                this.base.properties.upscaler.sharpness = this.base.properties.upscalerSharpness;
            }

            // 渲染场景(如果过渡效果未完全覆盖)
            if (this.base.transitionOverlay.activeRatio < 1) {
                this.base.properties.postprocessing.render(this.base.visuals.currentStage3D, this.base.properties.camera, true);
            }

            // 调试纹理输出
            if (window.__debugTexture) {
                this.base.fboHelper.debugTo(window.__debugTexture);
            }
        }
    }
}
