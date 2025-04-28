/**
 * justThreeJs index.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/23 09:07:13
 */
import * as THREE from "three";
import MathUtils from "@/views/pages/lusion/js/utils/math.js";
import Tween from "@/views/pages/lusion/js/utils/tween.js";
import Browser from "@/views/pages/lusion/js/utils/browser.js";
import Settings from "@/views/pages/lusion/js/utils/setting.js";
import Support from '@/views/pages/lusion/js/utils/support.js'
import Properties from "@/views/pages/lusion/js/utils/properties.js";
import Input from "@/views/pages/lusion/js/utils/input.js";
import ScrollManager from "@/views/pages/lusion/js/utils/scrollManager.js";
import TaskManager from "@/views/pages/lusion/js/utils/taskManager.js";
import FboHelper from "@/views/pages/lusion/js/utils/fboHelper.js";
import QuickLoader from "@/views/pages/lusion/js/utils/quickLoader/quickLoader";
import AnyItem from "@/views/pages/lusion/js/utils/quickLoader/anyItem.js";
import AudioItem from "@/views/pages/lusion/js/utils/quickLoader/audioItem.js";
import ImageItem from "@/views/pages/lusion/js/utils/quickLoader/imageItem.js";
import XHRItem from "@/views/pages/lusion/js/utils/quickLoader/xhrItem.js";
import EXRItem from "@/views/pages/lusion/js/utils/quickLoader/exrItem.js";
import TextureItem from "@/views/pages/lusion/js/utils/quickLoader/textureItem.js";
import ThreeLoaderItem from "@/views/pages/lusion/js/utils/quickLoader/threeLoaderItem";
import FontItem from "@/views/pages/lusion/js/utils/quickLoader/fontItem";
import BufItem from "@/views/pages/lusion/js/utils/quickLoader/bufItem";
import TextureHelper from "@/views/pages/lusion/js/utils/textureHelper.js";
import Postprocessing from "@/views/pages/lusion/js/utils/postprocessing.js";
import BlueNoise from "@/views/pages/lusion/js/utils/blueNoise.js";
import GlPositionOffset from "@/views/pages/lusion/js/utils/glPositionOffset.js";
import Blur from "@/views/pages/lusion/js/utils/blur.js";
import ScreenPaint from "@/views/pages/lusion/js/utils/screenPaint.js";
import CameraControls from "@/views/pages/lusion/js/utils/cameraControls.js";
import Visuals from "@/views/pages/lusion/js/utils/visuals.js";
import AboutPageHeroEfxPrepass from "@/views/pages/lusion/js/pass/aboutPageHeroEfxPrepass.js";
import AboutPageHeroEfx from "@/views/pages/lusion/js/pass/aboutPageHeroEfx.js";
import App from '@/views/pages/lusion/js/app'
import TransitionOverlay from "@/views/pages/lusion/js/utils/transitionOverlay.js";
import Preloader from "@/views/pages/lusion/js/utils/preload.js";
import UI from "@/views/pages/lusion/js/utils/ui.js";
import About from "@/views/pages/lusion/js/about/about";
import AboutHero from "@/views/pages/lusion/js/about/aboutHero.js";
// import PageManager from "@/views/pages/lusion/js/utils/pageManager";
// import RouteManager from "@/views/pages/lusion/js/utils/routeManager.js";

export default class Main {
    constructor(config) {
        this.target = config.target;
        this.width = this.target.offsetWidth;
        this.height = this.target.offsetHeight;
        this.math = new MathUtils;
        this.tween = new Tween(this);
        this.browser = new Browser();
        this.settings = new Settings(this);
        this.quickLoader = new QuickLoader(this);
        this.quickLoader.register(AnyItem)
        this.quickLoader.register(AudioItem)
        this.quickLoader.register(ImageItem)
        this.quickLoader.register(XHRItem)
        this.quickLoader.register(EXRItem)
        this.quickLoader.register(TextureItem)
        this.quickLoader.register(ThreeLoaderItem)
        this.quickLoader.register(FontItem)
        this.quickLoader.register(BufItem)
        this.properties = new Properties(this);
        this.support = new Support(this);
        this.input = new Input(this);
        this.scrollManager = new ScrollManager(this);
        this.taskManager = new TaskManager(this);
        this.transitionOverlay = new TransitionOverlay(this);
        this.preloader = new Preloader(this);
        this.ui = new UI(this);
        this.fboHelper = new FboHelper(this);
        this.textureHelper = new TextureHelper(this);
        this.postprocessing = new Postprocessing(this);
        this.blueNoise = new BlueNoise(this);
        this.glPositionOffset = new GlPositionOffset(this);
        this.blur = new Blur(this);
        this.screenPaint = new ScreenPaint(this)
        this.cameraControls = new CameraControls(this)
        this.visuals = new Visuals(this);
        this.aboutPageHeroEfxPrepass = new AboutPageHeroEfxPrepass(this)
        this.aboutPageHeroEfx = new AboutPageHeroEfx(this)
        this.app = new App(this);
        this.dateTime = performance.now()
        this._needsResize = !1;
        this.preRun();
    }

    preRun() {
        this.listenerInit();
        for (const [o, e] of Object.entries(this.settings.CROSS_ORIGINS)) this.properties.loader.setCrossOrigin(o, e);
        // this.routeManager.init()
        this.properties.loader.add("Aeonik:400", {type: "font"})
        let o = this.properties.viewportWidth = this.width
        let e = this.properties.viewportHeight = this.height;
        this.properties.viewportResolution = new THREE.Vector2(o, e)
        this.properties.width = o
        this.properties.height = e
        this.properties.loader.add("Aeonik:500,Aeonik:400:italic,IBMPlexMono:400,IBMPlexMono:500,LusionMono:400", {type: "font"})
        this.app.initEngine()
        this.input.preInit()
        this.scrollManager.init()
        this.ui.preInit()
        this.app.preInit()
        this.aboutHero = new AboutHero(this);
        this.about = new About(this);
        this.about.preInit();
        this.properties.loader.start(o => {
            if (o === 1) {
                this.run();
            }
        })
    }

    run() {
        // this.pagesManager = new PageManager(this);
        // this.pagesManager.preInit()
        // this.pageExtraSections = new PageExtraSections(this);
        // this.scrollNavSection = new ScrollNavSection(this);
        window.addEventListener("resize", this.onResize.bind(this))
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
        // this.pagesManager.init()
        this.about.init();
        this.ui.init()
        this.app.init()
        this.properties.hasInitialized = !0
    }

    start() {
        this.ui.start()
        this.app.start()
        this.properties.hasStarted = !0
        this._onResize(!0)
        this.scrollManager.isActive = !0
        this.settings.JUMP_SECTION !== "" && this.scrollManager.scrollTo(this.settings.JUMP_SECTION, this.settings.JUMP_OFFSET, !0)
    }

    update(o) {
        this.scrollManager.autoScrollSpeed = this.properties.autoScrollSpeed || 0
        window.__AUTO_SCROLL__ && (this.scrollManager.autoScrollSpeed = window.__AUTO_SCROLL__)
        this.taskManager.update()
        this.properties.reset()
        this.app.preUpdate(o)
        this.input.update(o)
        this.scrollManager.update(o)
        this.about.update(o)
        this.ui.update(o)
        this.app.update(o)
        this.input.postUpdate(o)
    }

    loop() {
        window.requestAnimationFrame(() => {
            this.loop();
        });
        let o = performance.now()
        let e = (o - this.dateTime) / 1e3;
        this.dateTime = o
        e = Math.min(e, 1 / 20)
        this._needsResize && this._onResize()
        this.properties.hasStarted && (this.properties.startTime += e)
        Tween.autoUpdate(e)
        this.update(e)
        this._needsResize = !1
    }

    onResize() {
        this._needsResize = !0
    }

    _onResize(isInitial) {
        // 获取窗口尺寸
        let width = this.properties.viewportWidth = this.target.offsetWidth;
        let height = this.properties.viewportHeight = this.target.offsetHeight;

        // 设置分辨率
        this.properties.viewportResolution.set(width, height);

        // 判断是否为移动端布局
        this.properties.useMobileLayout = width <= this.settings.MOBILE_WIDTH;

        // 更新 CSS 变量 --vh，用于响应式高度（移动端常用）
        document.documentElement.style.setProperty("--vh", (height * 0.01) + "px");

        // 计算基于 DPR 的像素尺寸
        let pixelWidth = width * this.settings.DPR;
        let pixelHeight = height * this.settings.DPR;

        // 限制最大像素数量，防止过大帧缓开销
        if (this.settings.USE_PIXEL_LIMIT === true && pixelWidth * pixelHeight > this.settings.MAX_PIXEL_COUNT) {
            let aspect = pixelWidth / pixelHeight;
            pixelHeight = Math.sqrt(this.settings.MAX_PIXEL_COUNT / aspect);
            pixelWidth = Math.ceil(pixelHeight * aspect);
            pixelHeight = Math.ceil(pixelHeight);
        }

        // 保存最终计算的渲染尺寸和 DPR
        this.properties.width = pixelWidth;
        this.properties.height = pixelHeight;
        this.properties.webglDPR = this.properties.width / width;
        this.properties.resolution.set(this.properties.width, this.properties.height);

        // 子系统 resize 通知
        if (!isInitial) {
            this.input.resize(); // 输入系统
        }

        this.scrollManager.resize(width, height);      // 滚动系统
        this.about.resize(width, height)
        // this.pagesManager.resize(width, height);       // 页面管理系统
        this.ui.resize(width, height, isInitial);      // UI 系统
        this.app.resize(
            Math.ceil(pixelWidth * this.properties.upscalerAmount || 1),
            Math.ceil(pixelHeight * this.properties.upscalerAmount || 1)
        ); // 渲染系统

        // 再次通知滚动系统（冗余？可视情况保留）
        this.scrollManager.resize(width, height);
    }

    listenerInit() {
        window.addEventListener("wheel", o => o.preventDefault(), {passive: !1});
        this.target.addEventListener("gesturestart", o => this.preventZoom.bind(this, o));
        this.target.addEventListener("gesturechange", o => this.preventZoom.bind(this, o));
        this.target.addEventListener("gestureend", o => this.preventZoom.bind(this, o));
    }

    preventZoom(o) {
        o.preventDefault()
        this.target.style.zoom = 1
    }

    destroy() {

    }
}
