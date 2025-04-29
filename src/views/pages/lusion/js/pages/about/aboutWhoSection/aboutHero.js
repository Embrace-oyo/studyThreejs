/**
 * justThreeJs aboutHero.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/25 15:42:30
 */

import * as THREE from "three";
import Stage3D from "@/views/pages/lusion/js/utils/stage3D.js";
import {easeOutCubic, easeOutSine, easeInOutSine} from 'easing-utils';
import AboutHeroLight from "@/views/pages/lusion/js/pages/about/aboutWhoSection/aboutHeroLight.js";
import AboutHeroParticlesSimulation
    from "@/views/pages/lusion/js/pages/about/aboutWhoSection/aboutHeroParticlesSimulation.js";
import AboutHeroParticles from "@/views/pages/lusion/js/pages/about/aboutWhoSection/aboutHeroParticles.js";
import AboutHeroLightField from "@/views/pages/lusion/js/pages/about/aboutWhoSection/aboutHeroLightField.js";
import AboutHeroScatter from "@/views/pages/lusion/js/pages/about/aboutWhoSection/aboutHeroScatter.js";
import AboutHeroRocks from "@/views/pages/lusion/js/pages/about/aboutWhoSection/aboutHeroRocks";
import AboutHeroGround from "@/views/pages/lusion/js/pages/about/aboutWhoSection/aboutHeroGround";
import AboutHeroPerson from "@/views/pages/lusion/js/pages/about/aboutWhoSection/aboutHeroPerson";
import AboutHeroFog from "@/views/pages/lusion/js/pages/about/aboutWhoSection/aboutHeroFog";
import AboutHeroLines from "@/views/pages/lusion/js/pages/about/aboutWhoSection/aboutHeroLines";
import AboutHeroHalo from "@/views/pages/lusion/js/pages/about/aboutWhoSection/aboutHeroHalo";
import AboutHeroFaces from "@/views/pages/lusion/js/pages/about/aboutWhoSection/aboutHeroFaces";
import AboutHeroLetters from "@/views/pages/lusion/js/pages/about/aboutWhoSection/aboutHeroLetters";

function filePath(path) {
    return new URL(`../../../../assets/${path}`, import.meta.url).href
}


let _v = new THREE.Vector3
let _q0 = new THREE.Quaternion
let _q1 = new THREE.Quaternion
export default class AboutHero extends Stage3D {
    container = new THREE.Object3D();
    sceneContainer = new THREE.Object3D();
    hudContainer = new THREE.Object3D();
    cameraSplineGeo = null;
    cameraSplinePositions = null;
    cameraSplineOrientation = null;
    sceneRatio = 0;
    sceneHideRatio = 0;
    initialSplineRatio = 0;
    hudRatio = 0;
    introRatio = 0;
    outSectionRatio = 0;
    freezeRatio = 1;
    introTime = 0;
    scrollYRatio = 0;
    panningSplineRaito = 0;

    shaderUniforms = {
        u_sceneRatio: {value: 0},
        u_sceneHideRatio: {value: 0},
        u_hudRatio: {value: 0},
        u_introRatio: {value: 0},
        u_introTime: {value: 0},
        u_introDeltaTime: {value: 0},
        u_letterTexture: {value: null}
    };

    constructor(base) {
        super({
            properties: {
                defaultCameraPosition: new THREE.Vector3(0, 5, 5),
                defaultLookAtPosition: new THREE.Vector3(0, 5, 0),
                cameraDollyZoomFovOffset: 0,
                cameraFov: 60,
                bloomAmount: 4,
                bloomRadius: 0.25,
                bloomThreshold: 0.8,
                bloomSmoothWidth: 0.3,
                haloStrength: 0,
                clearAlpha: 0,
                cameraLookStrength: 0.1,
                screenPaintOffsetRatio: 0,
                screenPaintDistortionRGBShift: 0.1
            }
        });
        this.base = base;
        this.light = new AboutHeroLight(this);
        this.lightField = new AboutHeroLightField(this);
        this.aboutHeroScatter = new AboutHeroScatter(this);

        this.sim = new AboutHeroParticlesSimulation(this)
        this.aboutHeroParticles = new AboutHeroParticles(this)
        this.aboutHeroRocks = new AboutHeroRocks(this);
        this.aboutHeroGround = new AboutHeroGround(this);
        this.aboutHeroPerson = new AboutHeroPerson(this);
        this.aboutHeroFog = new AboutHeroFog(this);
        this.aboutHeroLines = new AboutHeroLines(this);
        this.aboutHeroHalo = new AboutHeroHalo(this);
        this.aboutHeroFaces = new AboutHeroFaces(this);
        this.aboutHeroLetters = new AboutHeroLetters(this);
    }

    preInit() {
        this.base.aboutPageHeroEfxPrepass.init();
        this.base.properties.postprocessing.queue.push(this.base.aboutPageHeroEfxPrepass);

        this.base.aboutPageHeroEfx.init();
        this.base.properties.postprocessing.queue.push(this.base.aboutPageHeroEfx);

        this.shaderUniforms.u_letterTexture.value = this.base.properties.loader.add(
            filePath("texture/font.png"),
            {minFilter: THREE.LinearFilter, type: "texture"}
        ).content;


        this.base.properties.loader.add(
            filePath("buf/camera_spline.buf"),
            {onLoad: (e) => (this.cameraSplineGeo = e)}
        );

        this.light.preInit();
        this.sim.preInit();
        this.lightField.preInit();
        this.aboutHeroParticles.preInit();
        this.aboutHeroRocks.preInit();
        this.aboutHeroGround.preInit();
        this.aboutHeroLines.preInit();
        this.aboutHeroPerson.preInit();
        this.aboutHeroFog.preInit();
        this.aboutHeroHalo.preInit();
        this.aboutHeroFaces.preInit();
        this.aboutHeroLetters.preInit();
    }

    init() {
        this.light.init();
        this.lightField.init();
        this.sim.init();
        this.aboutHeroParticles.init();
        this.aboutHeroScatter.init();
        this.aboutHeroRocks.init();
        this.aboutHeroGround.init();
        this.aboutHeroLines.init();
        this.aboutHeroPerson.init();
        this.aboutHeroFog.init();
        this.aboutHeroHalo.init();
        this.aboutHeroFaces.init();
        this.aboutHeroLetters.init();

        this.add(this.aboutHeroParticles.container);

        this.sceneContainer.add(this.aboutHeroRocks.container);
        this.sceneContainer.add(this.aboutHeroPerson.container);
        this.sceneContainer.add(this.aboutHeroFog.container);
        this.add(this.sceneContainer);
        this.add(this.aboutHeroGround.container);
        this.add(this.aboutHeroHalo.container);

        this.hudContainer.add(this.aboutHeroLines.container);
        this.add(this.hudContainer);

        this.base.aboutPageHeroEfxPrepass.scene.add(this.aboutHeroFaces.container);
        this.base.aboutPageHeroEfxPrepass.scene.add(this.aboutHeroLetters.container);

        this.cameraSplinePositions = this.cameraSplineGeo.attributes.position;
        this.cameraSplineOrientation = this.cameraSplineGeo.attributes.orient;


        this.base.taskManager.add(this);
        this.base.taskManager.add(this.base.aboutPageHeroEfxPrepass.scene);

        this.base.taskManager.start();


    }

    resize(w, h) {
        this.aboutHeroFog.resize(w, h);
        this.aboutHeroHalo.resize(w, h);
        this.aboutHeroFaces.resize(w, h);
    }

    syncProperties(e) {
        if (!this.cameraSplinePositions) return

        this.shaderUniforms.u_introRatio.value = this.introRatio;

        const t = this.base.math.saturate(this.initialSplineRatio) * 149 + this.base.math.saturate(this.panningSplineRaito) * 50,
            r = Math.floor(t),
            n = Math.min(this.cameraSplinePositions.count - 1, Math.ceil(t)),
            a = t - r;

        this.sceneRatio = this.shaderUniforms.u_sceneRatio.value = this.base.math.fit(this.introRatio, 0.01, 0.1, 0, 1, easeOutCubic);
        this.sceneHideRatio = this.shaderUniforms.u_sceneHideRatio.value = this.base.math.fit(this.introRatio, 0.85, 1, 0, 1);

        this.shaderUniforms.u_hudRatio.value = this.hudRatio;

        // 调整 bloomAmount
        this.properties.bloomAmount = 3;
        this.properties.bloomAmount = this.base.math.fit(this.introRatio, 0.1, 0.85, this.properties.bloomAmount, 1.5, easeOutSine);
        this.properties.bloomAmount = this.base.math.fit(this.introRatio, 0.85, 1, this.properties.bloomAmount, 10);
        this.properties.bloomAmount = this.base.math.fit(this.hudRatio, 0, 0.5, this.properties.bloomAmount, 12.5);

        // 调整 haloStrength
        this.properties.haloStrength = 0.08;
        this.properties.haloStrength = this.base.math.fit(this.introRatio, 0.1, 0.4, this.properties.haloStrength, 0.15);
        this.properties.haloStrength = this.base.math.fit(this.hudRatio, 0, 0.5, this.properties.haloStrength, 0);

        // 调整屏幕失真
        this.properties.screenPaintDistortionRGBShift = this.base.math.mix(0, this.base.properties.defaults.screenPaintDistortionRGBShift, this.outSectionRatio);

        // 调整相机 Look Strength
        this.properties.cameraLookStrength = this.base.math.fit(this.initialSplineRatio, 0, 1, 0.1, 0.035);

        // 相机位置插值
        _v.fromArray(this.cameraSplinePositions.array, n * 3);
        this.properties.defaultCameraPosition.fromArray(this.cameraSplinePositions.array, r * 3);
        this.properties.defaultCameraPosition.lerp(_v, a);

        // 相机朝向插值
        _q0.fromArray(this.cameraSplineOrientation.array, r * 4);
        _q1.fromArray(this.cameraSplineOrientation.array, n * 4);
        _q0.slerp(_q1, a);

        _v.set(0, 0, 1).applyQuaternion(_q0).add(this.properties.defaultCameraPosition);
        this.properties.defaultLookAtPosition.copy(_v);

        // 镜头 Dolly Zoom
        this.properties.cameraDollyZoomFovOffset = this.base.math.fit(this.initialSplineRatio, 0.4, 0.8, 0, -10, easeInOutSine);

        // Y方向滚动调整
        this.properties.defaultCameraPosition.y += this.base.math.fit(this.scrollYRatio, 0, 1, 0, -10, easeOutSine);
        this.properties.defaultLookAtPosition.y += this.base.math.fit(this.scrollYRatio, 0, 1, 0, -10.1, easeOutSine);

        // 冻结效果
        this.freezeRatio += ((this.base.input.isDown ? 1 - this.hudRatio : 0) - this.freezeRatio) * 0.1;
    }

    update(e) {
        const t = e * this.base.math.mix(1, 0.1, this.freezeRatio);
        this.introTime += t;

        this.shaderUniforms.u_introTime.value = this.introTime;
        this.shaderUniforms.u_introDeltaTime.value = t;

        this.aboutHeroScatter.update();
        if (this.hudRatio < 1) {
            this.sim.update(e);
            this.lightField.update(t);
            this.aboutHeroParticles.update(t);
            this.aboutHeroParticles.container.visible = true;
        } else {
            this.aboutHeroParticles.container.visible = false;
        }

        if (this.sceneRatio > 0 && this.hudRatio < 1) {
            this.light.update(t);
            this.aboutHeroRocks.update(t);
            this.aboutHeroPerson.update(t);
            this.aboutHeroFog.update(t);
            this.aboutHeroHalo.update(t);
            this.sceneContainer.visible = true;
        } else {
            this.sceneContainer.visible = false;
        }

        if (this.sceneRatio > 0) {
            this.aboutHeroGround.update(t);
        }

        if (this.hudRatio > 0) {
            this.aboutHeroLines.update(e);
            this.hudContainer.visible = true;
        } else {
            this.hudContainer.visible = false;
        }

        this.aboutHeroFaces.update(e);
        this.aboutHeroLetters.update(e);

        this.base.aboutPageHeroEfxPrepass.blurRatio = this.hudRatio;
        this.base.aboutPageHeroEfxPrepass.needsRenderScene = this.aboutHeroFaces.isActive;
        this.base.aboutPageHeroEfxPrepass.needsRenderScene = true;
        this.base.aboutPageHeroEfx.hudRatio = this.aboutHeroFaces.showRatio;


        if (this.hudRatio < 1) {
            this.lightField.postUpdate(e);
        }

        if (this.sceneRatio > 0 && this.hudRatio < 1) {
            this.light.postUpdate(e);
        }
    }
}
