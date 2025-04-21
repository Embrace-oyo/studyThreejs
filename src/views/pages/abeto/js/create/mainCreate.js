/**
 * justThreeJs mainCreate.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/9 09:23:23
 */
import * as THREE from "three";
import gsap from "gsap";
import {CustomEase} from 'gsap/CustomEase';
import EventEmitter from "events";
import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader.js";
import {KTX2Loader} from "three-stdlib";
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from "three/addons/postprocessing/RenderPass.js";
import {OutputPass} from "three/addons/postprocessing/OutputPass.js";
import {SMAAPass} from "three/addons/postprocessing/SMAAPass.js";
import {ShaderPass} from "three/addons/postprocessing/ShaderPass.js";
import {GammaCorrectionShader} from 'three/examples/jsm/shaders/GammaCorrectionShader.js';
import {
    AdaptiveDPRController,
    TimeStats,
    Utils,
    InputManager,
    RenderCreate,
    customScene,
    customCamera,
    MultipleRenderPass,
    FinalPass
} from '@/views/pages/abeto/js/utils/common'
import FluidSimCreate from "@/views/pages/abeto/js/create/fluidSimCreate.js";
import FlowerCreate from "@/views/pages/abeto/js/create/flowerCreate.js";
import LeavesCreate from "@/views/pages/abeto/js/create/leavesCreate.js";
import NeedlesCreate from "@/views/pages/abeto/js/create/needlesCreate.js";
import ForegroundLeavesCreate from "@/views/pages/abeto/js/create/foregroundLeavesCreate.js";
import BackgroundCreate from "@/views/pages/abeto/js/create/backgroundCreate.js";
import BorderCreate from "@/views/pages/abeto/js/create/borderCreate.js";
import NotchCreate from "@/views/pages/abeto/js/create/notchCreate.js";
import LineCreate from "@/views/pages/abeto/js/create/lineCreate.js";

function filePath(path) {
    return new URL(`../../assets/${path}`, import.meta.url).href
}

export default class MainCreate {
    fingers = 1
    active = !1
    audio = null
    initialDPR = 1
    currentDPR = 1
    adaptiveDPR = null
    uniforms = {
        resolution: {value: new THREE.Vector2(2, 2), global: !0},
        time: {value: 0, global: !0},
        dtRatio: {value: 1, global: !0}
    }
    composer = null
    renderPass = null
    DPR = window.devicePixelRatio <= 2 ? Math.min(window.devicePixelRatio, 1.25) : Math.min(window.devicePixelRatio, 1.5) || 1
    screen = {dpr: window.devicePixelRatio || 1, aspectRatio: 1, width: 0, height: 0, w: 0, h: 0}
    start = false

    constructor(config) {
        this.parent = config.parent;
        this.target = config.target;
        this.callback = config.callback;
        this.screen.width = this.target.offsetWidth;
        this.screen.height = this.target.offsetHeight;
        this.screen.w = this.screen.width;
        this.screen.h = this.screen.height;
        this.screen.aspectRatio = this.screen.w / this.screen.h;
        this.initUBO();
        this.initDPR();
        this.initUtils();
        this.initRenderer();
        this.initCamera();
        this.initScene();
        this.initDPRMultiplier();
        this.initLoader();
        window.addEventListener('resize', this.resize.bind(this))

    }

    initUBO() {
        this.UBO = new THREE.UniformsGroup()
        this.UBO.setName("Global");
        this.UBO.add(this.uniforms.resolution);
        this.UBO.add(this.uniforms.time);
        this.UBO.add(this.uniforms.dtRatio);
    }

    initDPR() {
        this.initialDPR = this.DPR;
        this.adaptiveDPR = new AdaptiveDPRController(this)
    }

    initUtils() {
        this.gsap = gsap;
        this.gsap.registerPlugin(CustomEase);
        this.gsap.config({force3D: !0});
        this.gsap.defaults({ease: "power2.inOut", duration: .6, overwrite: "auto"});
        CustomEase.create("inOut1", "M0,0 C0.5,0 0.1,1 1,1");
        CustomEase.create("inOut2", "M0,0 C0.56,0 0,1 1,1");
        CustomEase.create("inOut3", "M0,0 C0.6,0 0,1 1,1");
        CustomEase.create("inOut4", "M0,0 C0.4,0 -0.06,1 1,1");
        this.eventManage = new EventEmitter();
        this.timeStats = new TimeStats()
        this.utils = new Utils(this)
        this.inputManager = new InputManager(this)
    }

    initRenderer() {
        this.renderer = new RenderCreate()
        this.renderer.info.autoReset = false;
        this.renderer.webgl.setSize(this.screen.width, this.screen.height);
        this.renderer.webgl.toneMapping = THREE.LinearToneMapping;
        this.target.appendChild(this.renderer.webgl.domElement);
    }

    async initLoader() {
        this.manager = new THREE.LoadingManager();
        this.fileLoader = (new THREE.FileLoader(this.manager)).setResponseType('arraybuffer')
        this.dracoLoader = (new DRACOLoader(this.manager)).setDecoderPath('/draco/gltf/').setWorkerLimit(1).preload();
        this.ktx2Loader = (new KTX2Loader(this.manager)).setTranscoderPath('/basis/').detectSupport(this.renderer.webgl);

        this.emailTexture = await this.ktx2Loader.loadAsync(filePath('ktx/email.ktx2'));
        this.headLineTexture = await this.ktx2Loader.loadAsync(filePath('ktx/headline.ktx2'));
        this.leafTexture = await this.ktx2Loader.loadAsync(filePath('ktx/leaf.ktx2'));
        this.noiseSimplexLayeredTexture = await this.ktx2Loader.loadAsync(filePath('ktx/noise-simplex-layered.ktx2'));
        this.petalTexture = await this.ktx2Loader.loadAsync(filePath('ktx/petal.ktx2'));
        this.transitionNomipmapsTexture = await (new THREE.TextureLoader(this.manager)).load(filePath('ktx/transition-nomipmaps.jpg'))

        this.noiseSimplexLayeredTexture.colorSpace = THREE.SRGBColorSpace; // 设置 sRGB 颜色空间
        this.noiseSimplexLayeredTexture.wrapS = this.noiseSimplexLayeredTexture.wrapT = THREE.RepeatWrapping; // 启用 Repeat

        this.petalTexture.colorSpace = THREE.SRGBColorSpace; // 设置 sRGB 颜色空间
        this.petalTexture.wrapS = this.petalTexture.wrapT = THREE.ClampToEdgeWrapping; // 边界处理

        this.leafTexture.colorSpace = THREE.SRGBColorSpace; // 设置 sRGB 颜色空间
        this.leafTexture.wrapS = this.leafTexture.wrapT = THREE.ClampToEdgeWrapping; // 边界处理

        let total = 0;
        const geometryArray = [
            {path: filePath('drc/needle.drc'), key: 'needle'},
            {path: filePath('drc/border.drc'), key: 'border'},
            {path: filePath('drc/leaf.drc'), key: 'leaf'},
            {path: filePath('drc/petal.drc'), key: 'petal'},
        ]
        for (let i = 0; i < geometryArray.length; i++) {
            this[geometryArray[i].key] = await this.dracoLoader.loadAsync(geometryArray[i].path)
            this[geometryArray[i].key].name = geometryArray[i].key

            if (geometryArray[i].key === 'border') {
                this[geometryArray[i].key].setAttribute('inset', new THREE.BufferAttribute(new Float32Array([
                    0.0002442598342895508,
                    0.0002442598342895508,
                    0,
                    0.0002442598342895508,
                    0.0002442598342895508,
                    0,
                    0.0002442598342895508,
                    0.0002442598342895508,
                    0,
                    0.0002442598342895508,
                    0.0002442598342895508,
                    0,
                    -1,
                    -1,
                    0,
                    -1,
                    1,
                    0,
                    -1,
                    1,
                    0,
                    1,
                    1,
                    0,
                    1,
                    -1,
                    0,
                    -1,
                    1,
                    0,
                    0.0002442598342895508,
                    0.0002442598342895508,
                    0,
                    0.0002442598342895508,
                    0.0002442598342895508,
                    0,
                    0.0002442598342895508,
                    0.0002442598342895508,
                    0,
                    1,
                    -1,
                    0,
                    0.0002442598342895508,
                    0.0002442598342895508,
                    0
                ]), 3))
                this[geometryArray[i].key].setAttribute('notch', new THREE.BufferAttribute(new Float32Array([
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    -1,
                    0,
                    0,
                    -1,
                    1,
                    0,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    -1,
                    1,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    -1,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0
                ]), 3))
            }

            total += 1;
            if (total === geometryArray.length) {
                this.initComposer();
                this.initEvents()
                this.initWorld();
                this.resize();
                this.initAnimation();
            }
        }
    }

    initCamera() {
        this.camera = new customCamera(this);
        this.camera.basePosition.set(0, 0, 4)
        this.camera.baseTarget.set(0, 0, 0)
        this.camera.displacement.position.set(.03, .015)
        this.camera.lerpPosition = .035
    }

    initScene() {
        this.scene = new customScene(this);
        this.fluidSim = new FluidSimCreate(this)
    }

    initComposer() {
        this.composer = new EffectComposer(this.renderer.webgl);
        this.renderPass = new RenderPass(this.scene, this.camera);
        this.SMAAPass = new SMAAPass(this.screen.width, this.screen.height);
        this.multipleRenderPass = new MultipleRenderPass(this);
        this.finalPass = (new FinalPass(this)).pass

        // 获取多个渲染目标的贴图
        const n = this.multipleRenderPass.multipleRenderTarget.texture;
        // 命名多个输出贴图，便于调试
        n[0].name = "color";
        n[1].name = "info";
        // 将第二个贴图 (info) 传入 shader 的 tInfo
        this.finalPass.uniforms.tInfo.value = n[1];
        this.finalPass.uniforms.uCameraNear.value = this.camera.near
        this.finalPass.uniforms.uCameraFar.value = this.camera.far;


        this.gammaCorrectionPass = new ShaderPass(GammaCorrectionShader);
        // this.outPass = new OutputPass();


        this.composer.addPass(this.renderPass)
        this.composer.addPass(this.SMAAPass)
        this.composer.addPass(this.multipleRenderPass)
        this.composer.addPass(this.finalPass)
        this.composer.addPass(this.gammaCorrectionPass)
    }

    initWorld() {
        this.callback();
        this.flower = new FlowerCreate(this);
        this.leaves = new LeavesCreate(this);
        this.needles = new NeedlesCreate(this);
        this.foregroundLeavesCreate = new ForegroundLeavesCreate(this);
        this.bckgroundCreate = new BackgroundCreate(this);
        this.borderCreate = new BorderCreate(this);
        this.notchCreate = new NotchCreate(this);
        this.lineCreate = new LineCreate(this);
        this.eventManage.emit("webgl_render_active", true);
        const t = this.finalPass.material;
        this.gsap.fromTo(t.uniforms.uProgress1, {value: 0}, {
            value: 1,
            duration: 5,
            ease: "power2.out",
            delay: .25
        })
        this.gsap.fromTo(t.uniforms.uProgress2, {value: 0}, {
            value: 1,
            duration: 5,
            ease: "power2.out",
            delay: .25 + .2
        })
        this.gsap.fromTo(t.uniforms.uProgress3, {value: 0}, {
            value: 1,
            duration: 5,
            ease: "power2.out",
            delay: .25 + .6
        })
        this.gsap.fromTo(t.uniforms.uProgress4, {value: 0}, {
            value: 1,
            duration: 5,
            ease: "power2.out",
            delay: .25 + .9
        })
    }

    initAnimation() {
        let ho = []
        let ym = 0
        let RI = 0.5
        let LI = 5
        this.gsap.ticker.add((i, e, t) => {
            const n = Math.round((i - this.timeStats.internalTime) * 1e3);
            ho.push(n)
            if (i - ym >= RI && ho.length >= LI) {
                const s = Math.round(1e3 / (ho.reduce((r, a) => r + a, 0) / ho.length));
                this.timeStats.recordedMaxFPS = Math.max(this.timeStats.recordedMaxFPS, s)
                this.timeStats.smoothedFPS = s
                ho.length = 0
                ym = i
                this.eventManage.emit("webgl_average_fps_update", this.timeStats.smoothedFPS)
            }
            this.timeStats.internalTime = i
            this.timeStats.frameDelta = n
            this.timeStats.frameCount++
            ["webgl_prerender", "webgl_render", "webgl_postrender"].forEach(event => {
                this.eventManage.emit(event, i, n)
            })

        })
    }

    initEvents() {
        this.eventManage.on("resize", ({w, h}) => {
            this.uniforms.resolution.value.set(w, h).multiplyScalar(this.currentDPR).floor();
            this.renderer.webgl.setSize(this.uniforms.resolution.value.x, this.uniforms.resolution.value.y);
            this.renderer.webgl.domElement.style.width = `${w}px`;
            this.renderer.webgl.domElement.style.height = `${h}px`;
            this.composer.setSize(this.uniforms.resolution.value.x, this.uniforms.resolution.value.y);
        });
        this.eventManage.on("webgl_prerender", (time) => {
            this.uniforms.time.value = time;
            this.uniforms.dtRatio.value = this.utils.deltaRatio();
        });
        this.eventManage.on("webgl_render", (delta) => {
            if (!this.active) return;
            this.renderer.info?.reset();
            // this.renderer.webgl?.render(this.scene, this.camera);
            this.composer?.render(delta);
        });
        this.eventManage.on("webgl_render_active", (active) => {
            if (active && !this.adaptiveDPR?.hasRun) {
                this.adaptiveDPR.start();
            }
            this.active = active;
        });
    }

    initDPRMultiplier(dpr = 1) {
        this.currentDPR = this.initialDPR * dpr
        this.eventManage.emit("resize", {w: this.screen.w, h: this.screen.h});
    }

    resize() {
        this.screen.width = this.screen.w = this.target.offsetWidth;
        this.screen.height = this.screen.h = this.target.offsetHeight;
        this.screen.aspectRatio = this.screen.w / this.screen.h;
        this.eventManage.emit("resize", {w: this.screen.w, h: this.screen.h});
    }

    destroy() {
    }
}
