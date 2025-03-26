/**
 * justThreeJs hero.js
 * @author kongjianqiu
 * @description
 * @created 2025/3/25 14:05:42
 */
import * as THREE from "three";
import {easeOutCubic, easeOutSine, easeInOutSine} from 'easing-utils';
import {
    BlueNoise,
    Blur,
    bufferToGeometry,
    FboHelper,
    MathUtils,
    TextureHelper
} from "@/views/pages/hero/js/util/common.js";
import HeroEfxPrevPass from "@/views/pages/hero/js/hero/heroEfxPrepass.js";
import HeroEfxPass from "@/views/pages/hero/js/hero/heroEfxPass";
import HeroLight from "@/views/pages/hero/js/hero/heroLight.js";
import HeroParticlesSimulation from "@/views/pages/hero/js/hero/heroParticlesSimulation.js";
import HeroLightField from "@/views/pages/hero/js/hero/heroLightField.js";
import HeroScatter from "@/views/pages/hero/js/hero/heroScatter.js";
import HeroParticles from "@/views/pages/hero/js/hero/heroParticles.js";
import HeroRocks from "@/views/pages/hero/js/hero/heroRocks.js";
import HeroGround from "@/views/pages/hero/js/hero/heroGround.js";
import HeroLines from "@/views/pages/hero/js/hero/heroLines.js";
import HeroPerson from "@/views/pages/hero/js/hero/HeroPerson.js";
import HeroFog from "@/views/pages/hero/js/hero/heroFog.js";
import HeroHalo from "@/views/pages/hero/js/hero/heroHalo.js";

function filePath(path) {
    return new URL(`../../assets/${path}`, import.meta.url).href
}

export default class Hero extends THREE.Scene {
    defaultCameraPosition = new THREE.Vector3(0, 0, 5)
    defaultLookAtPosition = new THREE.Vector3(0, 0, 0)
    properties = {
        defaultCameraPosition: new THREE.Vector3(0, 5, 5),
        defaultLookAtPosition: new THREE.Vector3(0, 5, 0),
        cameraDollyZoomFovOffset: 0,
        cameraFov: 60,
        bloomAmount: 4,
        bloomRadius: .25,
        bloomThreshold: .8,
        bloomSmoothWidth: .3,
        haloStrength: 0,
        clearAlpha: 0,
        cameraLookStrength: .1,
        screenPaintOffsetRatio: 0,
        screenPaintDistortionRGBShift: .1
    }
    container = new THREE.Object3D;
    sceneContainer = new THREE.Object3D;
    hudContainer = new THREE.Object3D;
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
        u_sceneRatio: {
            value: 0
        },
        u_sceneHideRatio: {
            value: 0
        },
        u_hudRatio: {
            value: 0
        },
        u_introRatio: {
            value: 0
        },
        u_introTime: {
            value: 0
        },
        u_introDeltaTime: {
            value: 0
        },
        u_letterTexture: {
            value: null
        }
    };

    constructor(base) {
        super();
        this.base = base;
        this.width = this.base.width;
        this.height = this.base.height;
        this.renderer = this.base.renderer;
        this.commonUniforms = this.base.commonUniforms;
        this._v = new THREE.Vector3
        this._q0 = new THREE.Quaternion
        this._q1 = new THREE.Quaternion;
        this.isDown = false;

        this.introRatio = 0.388;
        this.sceneRatio = 1;

        this.assetsLoad();
    }

    async assetsLoad() {
        this.manager = this.base.manager;
        this.textureLoader = new THREE.TextureLoader(this.manager);
        this.fileLoader = (new THREE.FileLoader(this.manager)).setResponseType('arraybuffer');
        this.blueNoiseTexture = this.textureLoader.load(filePath('texture/LDR_RGB1_0.png'));
        this.fontTexture = this.textureLoader.load(filePath('texture/font.png'));
        this.fontTexture.minFilter = THREE.LinearFilter
        this.rocksTexture = this.textureLoader.load(filePath('texture/rocks.webp'))
        this.terrainShadowLightHeightTexture = this.textureLoader.load(filePath('texture/terrain_shadow_light_height.webp'))
        this.personLightTexutre = this.textureLoader.load(filePath('texture/person_light.webp'))
        this.personTexutre = this.textureLoader.load(filePath('texture/person.webp'))
        this.groundPersonShadowTexture = this.textureLoader.load(filePath('texture/ground_person_shadow.webp'))
        this.fogTexture = this.textureLoader.load(filePath('texture/fog.png'))
        this.cameraSplineGeometry = bufferToGeometry(await this.fileLoader.loadAsync(filePath('buf/camera_spline.buf')));
        this.sphere_l = bufferToGeometry(await this.fileLoader.loadAsync(filePath(`buf/sphere_l.buf`)));
        this.sphere_m = bufferToGeometry(await this.fileLoader.loadAsync(filePath(`buf/sphere_m.buf`)));
        this.sphere_s = bufferToGeometry(await this.fileLoader.loadAsync(filePath(`buf/sphere_s.buf`)));
        this.sphere_xs = bufferToGeometry(await this.fileLoader.loadAsync(filePath(`buf/sphere_xs.buf`)));
        this.rock_0 = bufferToGeometry(await this.fileLoader.loadAsync(filePath(`buf/rock_0.buf`)));
        this.rock_1 = bufferToGeometry(await this.fileLoader.loadAsync(filePath(`buf/rock_1.buf`)));
        this.rock_2 = bufferToGeometry(await this.fileLoader.loadAsync(filePath(`buf/rock_2.buf`)));
        this.rock_3 = bufferToGeometry(await this.fileLoader.loadAsync(filePath(`buf/rock_3.buf`)));
        this.rock_0_low = bufferToGeometry(await this.fileLoader.loadAsync(filePath(`buf/rock_0_low.buf`)));
        this.rock_1_low = bufferToGeometry(await this.fileLoader.loadAsync(filePath(`buf/rock_1_low.buf`)));
        this.rock_2_low = bufferToGeometry(await this.fileLoader.loadAsync(filePath(`buf/rock_2_low.buf`)));
        this.rock_3_low = bufferToGeometry(await this.fileLoader.loadAsync(filePath(`buf/rock_3_low.buf`)));
        this.rock_animation_0 = bufferToGeometry(await this.fileLoader.loadAsync(filePath(`buf/rock_animation_0.buf`)));
        this.rock_animation_1 = bufferToGeometry(await this.fileLoader.loadAsync(filePath(`buf/rock_animation_1.buf`)));
        this.rock_animation_2 = bufferToGeometry(await this.fileLoader.loadAsync(filePath(`buf/rock_animation_2.buf`)));
        this.rock_animation_3 = bufferToGeometry(await this.fileLoader.loadAsync(filePath(`buf/rock_animation_3.buf`)));
        this.terrain = bufferToGeometry(await this.fileLoader.loadAsync(filePath(`buf/terrain.buf`)));
        this.terrainLines = bufferToGeometry(await this.fileLoader.loadAsync(filePath(`buf/terrain_lines.buf`)));
        this.personGeometry = bufferToGeometry(await this.fileLoader.loadAsync(filePath(`buf/person.buf`)));
        this.personIdleGeometry = bufferToGeometry(await this.fileLoader.loadAsync(filePath(`buf/person_idle.buf`)));
        this.bgBoxGeometry = bufferToGeometry(await this.fileLoader.loadAsync(filePath(`buf/bg_box.buf`)));
    }

    init() {
        this.cameraSplinePositions = this.cameraSplineGeometry.attributes.position
        this.cameraSplineOrientation = this.cameraSplineGeometry.attributes.orient
        this.math = new MathUtils;
        this.fboHelper = new FboHelper(this);
        this.textureHelper = new TextureHelper(this);
        this.blur = new Blur(this);
        this.blueNoise = new BlueNoise(this);
        this.heroEfxPrevPass = new HeroEfxPrevPass(this);
        this.heroEfxPass = new HeroEfxPass(this);
        this.heroLight = new HeroLight(this);
        this.heroParticlesSimulation = new HeroParticlesSimulation(this);
        this.heroLightField = new HeroLightField(this);
        this.heroScatter = new HeroScatter(this);
        this.heroParticles = new HeroParticles(this);
        this.heroRocks = new HeroRocks(this);
        this.heroGround = new HeroGround(this);
        this.heroPerson = new HeroPerson(this);
        this.heroFog = new HeroFog(this);
        this.heroHalo = new HeroHalo(this)
        this.heroLines = new HeroLines(this);


        this.sceneContainer.add(this.heroRocks.container)
        this.sceneContainer.add(this.heroPerson.container)
        this.sceneContainer.add(this.heroFog.container)
        this.add(this.sceneContainer)
        this.add(this.heroParticles.container)
        this.add(this.heroGround.container)
        this.add(this.heroHalo.container)


        // this.hudContainer.add(this.heroLines.container)
        // this.add(this.hudContainer)
        // aboutPageHeroEfxPrepass.scene.add(aboutHeroFaces.container)
        // aboutPageHeroEfxPrepass.scene.add(aboutHeroLetters.container)

        this.resize(this.width, this.height)

        this.base.scene.add(this);
    }

    resize(width, height) {
        this.width = width;
        this.height = height;
        this.heroFog.resize(width, height)
        this.heroHalo.resize(width, height)
    }

    syncProperties(e) {
        this.shaderUniforms.u_introRatio.value = this.introRatio;
        const t = this.math.saturate(this.initialSplineRatio) * 149 + this.math.saturate(this.panningSplineRaito) * 50
        const r = Math.floor(t)
        const n = Math.min(this.cameraSplinePositions.count - 1, Math.ceil(t))
        const a = t - r;
        this.sceneRatio = this.shaderUniforms.u_sceneRatio.value = this.math.fit(this.introRatio, .01, .1, 0, 1, easeOutCubic)
        this.sceneHideRatio = this.shaderUniforms.u_sceneHideRatio.value = this.math.fit(this.introRatio, .85, 1, 0, 1)
        this.shaderUniforms.u_hudRatio.value = this.hudRatio
        this.properties.bloomAmount = 3
        this.properties.bloomAmount = this.math.fit(this.introRatio, .1, .85, this.properties.bloomAmount, 1.5, easeOutSine)
        this.properties.bloomAmount = this.math.fit(this.introRatio, .85, 1, this.properties.bloomAmount, 10)
        this.properties.bloomAmount = this.math.fit(this.hudRatio, 0, .5, this.properties.bloomAmount, 12.5)
        this.properties.haloStrength = .08
        this.properties.haloStrength = this.math.fit(this.introRatio, .1, .4, this.properties.haloStrength, .15)
        this.properties.haloStrength = this.math.fit(this.hudRatio, 0, .5, this.properties.haloStrength, 0)
        this.properties.screenPaintDistortionRGBShift = this.math.mix(0, 0.5, this.outSectionRatio)
        this.properties.cameraLookStrength = this.math.fit(this.initialSplineRatio, 0, 1, .1, .035)
        this._v.fromArray(this.cameraSplinePositions.array, n * 3)
        this.properties.defaultCameraPosition.fromArray(this.cameraSplinePositions.array, r * 3)
        this.properties.defaultCameraPosition.lerp(this._v, a)
        this._q0.fromArray(this.cameraSplineOrientation.array, r * 4)
        this._q1.fromArray(this.cameraSplineOrientation.array, n * 4)
        this._q0.slerp(this._q1, a)
        this._v.set(0, 0, 1).applyQuaternion(this._q0).add(this.properties.defaultCameraPosition)
        this.properties.defaultLookAtPosition.copy(this._v)
        this.properties.cameraDollyZoomFovOffset = this.math.fit(this.initialSplineRatio, .4, .8, 0, -10, easeInOutSine)
        this.properties.defaultCameraPosition.y += this.math.fit(this.scrollYRatio, 0, 1, 0, -10, easeOutSine)
        this.properties.defaultLookAtPosition.y += this.math.fit(this.scrollYRatio, 0, 1, 0, -10.1, easeOutSine)
        this.freezeRatio += ((this.isDown ? 1 - this.hudRatio : 0) - this.freezeRatio) * .1
    }

    update(e) {
        this.blueNoise.update(e);
        let t = e * this.math.mix(1, .1, this.freezeRatio);
        this.introTime += t
        this.shaderUniforms.u_introTime.value = this.introTime
        this.shaderUniforms.u_introDeltaTime.value = t
        // this.heroScatter.update()
        /* if (this.hudRatio < 1) {
             this.heroParticlesSimulation.update(e)
             this.heroLightField.update(t)
             this.heroParticles.update(t)
             this.heroParticles.container.visible = !0
         } else {
             this.heroParticles.container.visible = !1
         }
         if (this.sceneRatio > 0 && this.hudRatio < 1) {
             this.heroLight.update(t)
             this.heroRocks.update(t)
             this.heroPerson.update(t)
             this.heroFog.update(t)
             this.heroHalo.update(t)
             this.sceneContainer.visible = !0
         } else {
             this.sceneContainer.visible = !1
         }
         this.sceneRatio > 0 && this.heroGround.update(t)
         this.hudRatio < 1 && this.heroLightField.postUpdate(e)
         this.sceneRatio > 0 && this.hudRatio < 1 && this.heroLight.postUpdate(e)*/

        this.heroScatter.update()

        this.heroLightField.update(t)
        this.heroParticlesSimulation.update(e)
        this.heroParticles.update(t)

        this.heroLight.update(t)
        this.heroRocks.update(t)
        this.heroPerson.update(t)
        this.heroFog.update(t)
        this.heroHalo.update(t)

        this.heroGround.update(t)

        this.heroLightField.postUpdate(e)
        this.heroLight.postUpdate(e)
    }


}
