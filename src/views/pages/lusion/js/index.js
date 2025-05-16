/**
 * justThreeJs index.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/29 10:19:49
 */
import {Vector2} from 'three'
// loader
import QuickLoader from "@/views/pages/lusion/js/quickLoader/quickLoader";
import AnyItem from "@/views/pages/lusion/js/quickLoader/anyItem.js";
import AudioItem from "@/views/pages/lusion/js/quickLoader/audioItem.js";
import ImageItem from "@/views/pages/lusion/js/quickLoader/imageItem.js";
import XHRItem from "@/views/pages/lusion/js/quickLoader/xhrItem.js";
import EXRItem from "@/views/pages/lusion/js/quickLoader/exrItem.js";
import TextureItem from "@/views/pages/lusion/js/quickLoader/textureItem.js";
import ThreeLoaderItem from "@/views/pages/lusion/js/quickLoader/threeLoaderItem";
import FontItem from "@/views/pages/lusion/js/quickLoader/fontItem";
import TextItem from "@/views/pages/lusion/js/quickLoader/textItem";
import JSONItem from "@/views/pages/lusion/js/quickLoader/jsonItem";
import BufItem from "@/views/pages/lusion/js/quickLoader/bufItem";
// utils
import MathUtils from "@/views/pages/lusion/js/utils/math.js";
import Tween from "@/views/pages/lusion/js/utils/tween.js";
import Support from "@/views/pages/lusion/js/utils/support.js";
import Browser from "@/views/pages/lusion/js/utils/browser.js";
import Settings from "@/views/pages/lusion/js/utils/setting.js";
import Properties from "@/views/pages/lusion/js/utils/properties.js";
import Input from "@/views/pages/lusion/js/utils/input.js";
import BlueNoise from "@/views/pages/lusion/js/utils/blueNoise.js";
import Blur from "@/views/pages/lusion/js/utils/blur.js";
import CameraControls from "@/views/pages/lusion/js/utils/cameraControls.js";
// manager
import ScrollManager from "@/views/pages/lusion/js/manager/scrollManager.js";
import TaskManager from "@/views/pages/lusion/js/manager/taskManager.js";
import PagesManager from "@/views/pages/lusion/js/manager/pagesManager.js";
// helper
import FboHelper from "@/views/pages/lusion/js/helper/fboHelper.js";
import TextureHelper from "@/views/pages/lusion/js/helper/textureHelper.js";
// pass
import Postprocessing from "@/views/pages/lusion/js/pass/postprocessing.js";
import ScreenPaint from "@/views/pages/lusion/js/pass/screenPaint.js";
import ScreenPaintDistortion from "@/views/pages/lusion/js/pass/screenPaintDistortion.js";
import AboutPageHeroEfxPrepass from "@/views/pages/lusion/js/pass/aboutPageHeroEfxPrepass.js";
import AboutPageHeroEfx from "@/views/pages/lusion/js/pass/aboutPageHeroEfx.js";
import {PostUfx, PreUfx} from "@/views/pages/lusion/js/pass/ufx.js";
// pages
import Visuals from "@/views/pages/lusion/js/pages/preUtils/visuals.js";
import TransitionOverlay from "@/views/pages/lusion/js/pages/preUtils/transitionOverlay.js";
import Preloader from "@/views/pages/lusion/js/pages/preUtils/preload.js";
import UI from "@/views/pages/lusion/js/pages/preUtils/ui.js";
import App from "@/views/pages/lusion/js/pages/app.js";

export default class Main {
    constructor(config) {
        this.target = config.target;
        this.width = this.target.offsetWidth;
        this.height = this.target.offsetHeight;
        this.dateTime = performance.now()
        this._needsResize = !1;
        this.loaderInit();
        this.utilsInit();
        this.passInit();
        this.pagesInit();
        this.helperInit();
        this.managerInit();
        this.listenerInit();
        this.preRun();
    }

    loaderInit() {
        this.quickLoader = new QuickLoader(this);
        this.quickLoader.register(AnyItem)
        this.quickLoader.register(AudioItem)
        this.quickLoader.register(ImageItem)
        this.quickLoader.register(XHRItem)
        this.quickLoader.register(EXRItem)
        this.quickLoader.register(TextureItem)
        this.quickLoader.register(ThreeLoaderItem)
        this.quickLoader.register(FontItem)
        this.quickLoader.register(TextItem)
        this.quickLoader.register(JSONItem)
        this.quickLoader.register(BufItem)
    }

    utilsInit() {
        this.math = new MathUtils;
        this.browser = new Browser(this);
        this.support = new Support(this);
        this.settings = new Settings(this);
        this.properties = new Properties(this);
        this.properties.reset();
        this.input = new Input(this);
        this.blueNoise = new BlueNoise(this);
        this.blur = new Blur(this);
        this.cameraControls = new CameraControls(this);
    }

    helperInit() {
        this.fboHelper = new FboHelper(this);
        this.textureHelper = new TextureHelper(this);
    }

    passInit() {
        this.postprocessing = new Postprocessing(this);
        this.screenPaint = new ScreenPaint(this);
        this.screenPaintDistortion = new ScreenPaintDistortion(this);
        this.aboutPageHeroEfxPrepass = new AboutPageHeroEfxPrepass(this);
        this.aboutPageHeroEfx = new AboutPageHeroEfx(this);
        this.preUfx = new PreUfx(this)
        this.postUfx = new PostUfx(this)
    }

    pagesInit() {
        this.visuals = new Visuals(this);
        this.transitionOverlay = new TransitionOverlay(this);
        this.preloader = new Preloader(this);
        this.ui = new UI(this);
        this.app = new App(this);
    }

    managerInit() {
        this.scrollManager = new ScrollManager(this);
        this.taskManager = new TaskManager(this);
        this.pagesManager = new PagesManager(this);
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

    preRun() {
        for (const [o, e] of Object.entries(this.settings.CROSS_ORIGINS)) this.properties.loader.setCrossOrigin(o, e);
        // routeManager.init()
        this.properties.loader.add("Aeonik:400", {type: "font"})
        this.properties.loader.start(o => {
            o === 1 && this.run()
        })
    }


    run() {
        let o = this.properties.viewportWidth = this.width;
        let e = this.properties.viewportHeight = this.height;
        this.properties.viewportResolution = new Vector2(o, e)
        this.properties.width = o
        this.properties.height = e
        this.properties.loader.add("Aeonik:500,Aeonik:400:italic,IBMPlexMono:400,IBMPlexMono:500,LusionMono:400", {type: "font"})
        this.app.initEngine()
        this.input.preInit()
        this.scrollManager.init()
        this.pagesManager.preInit()
        this.ui.preInit()
        this.app.preInit()
        window.addEventListener("resize", () => this.onResize())
        this._onResize()
        this.loop()
        this.ui.preload(() => this.init(), () => this.start())
    }

    init() {
        this.input.init()
        this.pagesManager.init()
        this.ui.init()
        this.app.init()
        this.properties.hasInitialized = !0
    }

    start() {
        this.ui.start()
        this.pagesManager.start()
        this.app.start()
        this.properties.hasStarted = !0
        this._onResize(!0)
        this.scrollManager.isActive = !0
        this.settings.JUMP_SECTION !== "" && this.scrollManager.scrollTo(this.settings.JUMP_SECTION, this.settings.JUMP_OFFSET, !0)
    }

    update(o) {
        this.scrollManager.autoScrollSpeed = this.properties.autoScrollSpeed
        window.__AUTO_SCROLL__ && (this.scrollManager.autoScrollSpeed = window.__AUTO_SCROLL__)
        this.taskManager.update()
        this.properties.reset()
        this.app.preUpdate(o)
        this.input.update(o)
        this.scrollManager.update(o)
        this.pagesManager.update(o)
        this.ui.update(o)
        this.app.update(o)
        this.input.postUpdate(o)
    }

    loop() {
        window.requestAnimationFrame(() => this.loop());
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

    _onResize(o) {
        this.width = this.target.offsetWidth;
        this.height = this.target.offsetHeight;
        let e = this.properties.viewportWidth = this.width;
        let t = this.properties.viewportHeight = this.height;
        this.properties.viewportResolution.set(e, this.height)
        this.properties.useMobileLayout = e <= this.settings.MOBILE_WIDTH
        document.documentElement.style.setProperty("--vh", t * .01 + "px");
        let r = e * this.settings.DPR
        let n = t * this.settings.DPR;
        if (this.settings.USE_PIXEL_LIMIT === !0 && r * n > this.settings.MAX_PIXEL_COUNT) {
            let a = r / n;
            n = Math.sqrt(this.settings.MAX_PIXEL_COUNT / a)
            r = Math.ceil(n * a)
            n = Math.ceil(n)
        }
        this.properties.width = r
        this.properties.height = n
        this.properties.webglDPR = this.properties.width / e
        this.properties.resolution.set(this.properties.width, this.properties.height)
        o || this.input.resize()
        this.scrollManager.resize(e, t)
        this.pagesManager.resize(e, t)
        this.ui.resize(e, t, o)
        this.app.resize(Math.ceil(r * this.properties.upscalerAmount), Math.ceil(n * this.properties.upscalerAmount))
        this.scrollManager.resize(e, t)
    }

    destroy() {

    }
}
