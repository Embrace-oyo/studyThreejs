/**
 * justThreeJs mainCreate.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/9 09:23:23
 */
import EventEmitter from "events"
import gsap from "gsap";
import {CustomEase} from 'gsap/CustomEase';
import {createNoise3D} from "simplex-noise";
import * as THREE from "three";
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {Pass} from "three/addons/postprocessing/Pass.js";
import {OutputPass} from "three/examples/jsm/postprocessing/OutputPass.js";
import {ShaderPass} from "three/addons/postprocessing/ShaderPass.js";
import {KTX2Loader} from "three-stdlib";
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader.js'
import FluidSimCreate from '@/views/pages/abeto/js/create/fluidSimCreate'
import FlowerCreate from "@/views/pages/abeto/js/create/flowerCreate.js";
import LeavesCreate from "@/views/pages/abeto/js/create/leavesCreate.js";
import NeedlesCreate from "@/views/pages/abeto/js/create/needlesCreate.js";
import ForegroundLeavesCreate from "@/views/pages/abeto/js/create/foregroundLeavesCreate.js";
import BackgroundCreate from "@/views/pages/abeto/js/create/backgroundCreate.js";
import BorderCreate from "@/views/pages/abeto/js/create/borderCreate.js";
import NotchCreate from "@/views/pages/abeto/js/create/notchCreate.js";
import LineCreate from "@/views/pages/abeto/js/create/lineCreate.js";
// glsl
import vert from '@/views/pages/abeto/glsl/multipleRenderPass/vert.glsl'
import frag from '@/views/pages/abeto/glsl/multipleRenderPass/frag.glsl'

function filePath(path) {
    return new URL(`../../assets/${path}`, import.meta.url).href
}

class TimeStats {
    /**
     * 时间管理器
     * **/
    constructor() {
        this.TARGET_FPS = 60;
        this.BLEND_DURATION_SECONDS = 0.2;
        this.BLEND_FRAME_COUNT = this.TARGET_FPS * this.BLEND_DURATION_SECONDS;
        this.fpsSmoothingRatio = this.TARGET_FPS / this.BLEND_FRAME_COUNT;
        this.internalTime = 0;         // 当前时间（ms）
        this.frameDelta = 16;          // 帧间隔（ms）
        this.frameCount = 0;           // 当前帧编号
        this.smoothedFPS = 60;         // 平滑平均帧率
        this.recordedMaxFPS = 0;       // 最大帧率（记录用途）
    }

    get time() {
        return this.internalTime;
    }

    get delta() {
        return this.frameDelta;
    }

    get frame() {
        return this.frameCount;
    }

    get averageFPS() {
        return this.smoothedFPS;
    }

    get maxFPS() {
        return this.recordedMaxFPS;
    }

    get ratio() {
        // 返回当前帧时间占理想帧时间的比例（比如掉帧时就会 >1）
        return Math.min(this.fpsSmoothingRatio, this.frameDelta / (1000 / this.TARGET_FPS));
    }
}

class Utils {
    TWO_PI = Math.PI * 2
    HALF_PI = Math.PI * .5

    constructor(base) {
        this.base = base;
        this.timeStats = this.base.timeStats;
        this.math = THREE.MathUtils
        this.DEG2RAD = this.math.DEG2RAD
        this.RAD2DEG = this.math.RAD2DEG
        this.xm = this.base.gsap.parseEase();
    }

    degrees(i) {
        return this.math.radToDeg(i)
    }

    radians(i) {
        return this.math.degToRad(i)
    }

    clamp(i, e = 0, t = 1) {
        return this.math.clamp(i, e, t)
    }

    lerp(i, e, t) {
        return this.math.lerp(i, e, t)
    }

    mix(i, e, t) {
        return this.lerp(i, e, t)
    }

    deltaRatio() {
        return this.timeStats.ratio
    }

    lerpCoefFPS(i) {
        return this.damp(i, this.timeStats.ratio)
    }

    lerpFPS(i, e, t) {
        return this.lerp(i, e, this.lerpCoefFPS(t))
    }

    lerpFPSLimited(i, e, t, n = 1 / 0) {
        const s = this.lerpFPS(i, e, t), r = n * this.timeStats.ratio, a = this.clamp(s - i, -r, r);
        return i + a
    }

    damp(i, e) {
        return 1 - Math.exp(Math.log(1 - i) * e)
    }

    frictionFPS(i) {
        return this.friction(i, this.timeStats.ratio)
    }

    friction(i, e) {
        return Math.exp(Math.log(i) * e)
    }

    efit(i, e, t, n, s) {
        return this.math.mapLinear(i, e, t, n, s)
    }

    fit(i, e, t, n, s) {
        return this.efit(this.clamp(i, Math.min(e, t), Math.max(e, t)), e, t, n, s)
    }

    fit01(i, e, t) {
        return this.fit(i, 0, 1, e, t)
    }

    fit10(i, e, t) {
        return this.fit(i, 1, 0, e, t)
    }

    fit11(i, e, t) {
        return this.fit(i, -1, 1, e, t)
    }

    step(i, e) {
        return e < i ? 0 : 1
    }

    linearstep(i, e, t) {
        return this.clamp((t - i) / (e - i), 0, 1)
    }

    smoothstep(i, e, t) {
        return this.math.smoothstep(t, i, e)
    }

    smootherstep(i, e, t) {
        return this.math.smootherstep(t, i, e)
    }

    parabola(i, e) {
        return Math.pow(4 * i * (1 - i), e)
    }

    pcurve(i, e, t) {
        return Math.pow(e + t, e + t) / (Math.pow(e, e) * Math.pow(t, t)) * Math.pow(i, e) * Math.pow(1 - i, t)
    }

    ease(i, e = "linear") {
        return (this.xm[e] || this.xm.none)(i)
    }

    round(i, e = 0) {
        const t = Math.pow(10, e);
        return Math.round(i * t) / t
    }

    isPowerOfTwo(i) {
        return this.math.isPowerOfTwo(i)
    }

    ceilPowerOfTwo(i) {
        return this.math.ceilPowerOfTwo(i)
    }

    floorPowerOfTwo(i) {
        return this.math.floorPowerOfTwo(i)
    }

    makeAnglePositive(i) {
        const e = i % this.TWO_PI;
        return e < 0 ? this.TWO_PI + e : e
    }

    getShortestRotationAngle(i, e) {
        const t = this.makeAnglePositive(i);
        let n = this.makeAnglePositive(e);
        return Math.abs(n - t) > Math.PI && (n > t ? n -= this.TWO_PI : n += this.TWO_PI), i + n - t
    }

    latLonTo3D(i, e, t) {
        const n = this.HALF_PI - this.radians(i), s = this.radians(e);
        return {x: t * Math.sin(n) * Math.sin(s), y: t * Math.cos(n), z: t * Math.sin(n) * Math.cos(s)}
    }

    uid() {
        return this.math.generateUUID()
    }
}

class TouchTracker {
    constructor(base, fingerIndex = 0) {
        this.base = base.base;
        // 基本属性
        this.finger = fingerIndex; // 手指编号
        this.touchID = false;
        this.eventID = this.finger === 0 ? "touch" : `touch${fingerIndex + 1}`;
        this.currentInput = this.finger === 0 ? "mouse" : "touch";
        this.button = 0;
        this.touching = false;

        // 位置/位移向量
        this.position = new THREE.Vector2(this.base.screen.w * 0.5, this.base.screen.h * 0.5);      // 像素坐标
        this.position01 = new THREE.Vector2(0.5, 0.5); // 标准化 0~1
        this.position11 = new THREE.Vector2();        // 标准化 -1~1

        this.delta = new THREE.Vector2();      // 每帧的位移差值
        this.delta11 = new THREE.Vector2();    // 标准化差值

        this.dragged = new THREE.Vector2();    // 累计拖动量
        this.dragged11 = new THREE.Vector2();  // 累计标准化拖动量

        this.velocity = new THREE.Vector2();        // 当前移动速度（平滑值）
        this.swipeVelocity = new THREE.Vector2();  // 释放时的滑动速度

        // 前一帧位置缓存（做 delta 用）
        this.prevPixel = new THREE.Vector2();
        this.prev01 = new THREE.Vector2();

        this.dragOriginPixel = new THREE.Vector2();
        this.dragOrigin01 = new THREE.Vector2();

        this.lastTouchTime = 0;

        this._updateVelocity.bind(this)

        // 启动更新监听
        this.base.eventManage.on("webgl_prerender", this._updateVelocity.bind(this));
    }

    // ========= pointer 事件钩子 =========

    onTouchStart(event) {
        this.touching = true;
        this.lastTouchTime = this.base.timeStats.time;

        this._updatePosition(event);   // 更新位置
        this._storeLastPosition();     // 记录前一帧位置
        this._storeDragOrigin();       // 初始化拖动起点
        this._updateDrag();            // 重置拖动量

        this.base.eventManage.emit(`${this.eventID}_start`, this);
    }

    onTouchMove(event) {
        this._updatePosition(event);
        this._updateDelta();
        this.base.eventManage.emit(`${this.eventID}_move`, this);

        if (this.touching) {
            this._updateDrag();
            this.base.eventManage.emit(`${this.eventID}_drag`, this);
        }
    }

    onTouchEnd(event) {
        this._updatePosition(event);
        this._updateDelta();
        this._updateDrag();

        const wasTouching = this.touching;
        this.touching = false;

        if (!wasTouching) return;

        const dt = Math.max(0.001, this.base.timeStats.time - this.lastTouchTime);
        this.swipeVelocity.copy(this.dragged).divideScalar(dt);

        this.base.eventManage.emit(`${this.eventID}_end`, this);

        // 判断是否是点击事件（拖动距离 + 时间都很短）
        if (this.dragged.length() < 15 && dt < 0.5 && event.type !== "pointerout") {
            this.base.eventManage.emit(`${this.eventID}_click`, this);
        }
    }

    dispose() {
        this.base.eventManage.off("webgl_prerender", this._updateVelocity, this);
    }

    // ========= 私有更新逻辑 =========

    _updatePosition(e) {
        const x = e.clientX;
        const y = e.clientY;

        this.position.set(x, y);
        this.position01.set(x / this.base.screen.w, 1 - y / this.base.screen.h);
        this.position11.copy(this.position01).multiplyScalar(2).subScalar(1);

        this.currentInput = e.pointerType === "mouse" ? "mouse" : "touch";
        this.button = e.button;
    }

    _storeLastPosition() {
        this.prevPixel.copy(this.position);
        this.prev01.copy(this.position01);
    }

    _updateDelta() {
        this.delta.copy(this.position).sub(this.prevPixel);
        this.delta11.copy(this.position01).sub(this.prev01);
        this._storeLastPosition();

        const scaledDelta = this.delta11.clone().multiplyScalar(2);
        this.velocity.add(scaledDelta);
    }

    _storeDragOrigin() {
        this.dragOriginPixel.copy(this.position);
        this.dragOrigin01.copy(this.position01);
    }

    _updateDrag() {
        this.dragged.copy(this.position).sub(this.dragOriginPixel);
        this.dragged11.copy(this.position01).sub(this.dragOrigin01);
    }

    _updateVelocity() {
        const friction = this.base.utils.frictionFPS(0.95); // 每帧阻力因子
        this.velocity.multiplyScalar(friction);
        this.velocity.clampScalar(-1, 1);

        if (this.velocity.length() < 0.001) {
            this.velocity.setScalar(0);
        }
    }
}

class InputManager {
    constructor(base) {
        this.base = base;
        // 私有触摸列表（如 TouchTracker 实例）
        this.trackers = [];
        this.targetElement = null;
        this.isCanvas = true;

        // 是否允许原生 touchstart 默认行为
        this.allowTouchStart = false;

        // 绑定事件方法，确保 this 正确
        this.handleTouchStart = this._onPointerDown.bind(this);
        this.handleTouchMove = this._onPointerMove.bind(this);
        this.handleTouchEnd = this._onPointerUp.bind(this);
        this.handlePreventTouchStart = this._preventTouchStart.bind(this);
        this.handlePreventDefault = this._preventDefault.bind(this);

        this.init({element: this.base.target, fingers: 1})
    }

    /**
     * 获取第 n 个 Tracker
     */
    get(index) {
        return this.trackers[index];
    }

    /**
     * 获取所有处于 active 状态的触点
     */
    getActive() {
        return this.trackers.filter(t => t.touching);
    }

    /**
     * 初始化输入系统
     * @param {*} options
     *  - element: 监听目标 DOM（默认是 window）
     *  - fingers: 支持的手指数（默认 2）
     *  - contextMenu: 是否允许右键菜单（默认 false = 禁止）
     */
    init({element = window, fingers = 2, contextMenu = false} = {}) {
        this.targetElement = element;
        this.isCanvas = element instanceof HTMLCanvasElement;

        // 创建 n 个触点追踪器
        for (let i = 0; i < fingers; i++) {
            this.trackers.push(new TouchTracker(this, i));
        }

        // 设置样式（禁用选择/滚动）
        element.style.touchAction = "none";
        if (this.isCanvas) {
            element.style.userSelect = "none";
        }

        // 监听 pointer 事件（鼠标 / 手指）
        element.addEventListener("pointerdown", this.handleTouchStart);
        element.addEventListener("pointermove", this.handleTouchMove);
        element.addEventListener("pointerup", this.handleTouchEnd);
        element.addEventListener("pointerout", this.handleTouchEnd);
        element.addEventListener("pointercancel", this.handleTouchEnd);

        // 禁止右键菜单
        if (!contextMenu) {
            element.addEventListener("contextmenu", this.handlePreventDefault);
        }

        // 禁止滚动行为（iOS需要）
        element.addEventListener("touchstart", this.handlePreventTouchStart, {passive: false});
        document.addEventListener("dblclick", this.handlePreventDefault);
    }

    /**
     * 清理事件与资源
     */
    dispose() {
        const el = this.targetElement;
        el.removeEventListener("pointerdown", this.handleTouchStart);
        el.removeEventListener("pointermove", this.handleTouchMove);
        el.removeEventListener("pointerup", this.handleTouchEnd);
        el.removeEventListener("pointerout", this.handleTouchEnd);
        el.removeEventListener("pointercancel", this.handleTouchEnd);
        el.removeEventListener("contextmenu", this.handlePreventDefault);
        el.removeEventListener("touchstart", this.handlePreventTouchStart);
        document.removeEventListener("dblclick", this.handlePreventDefault);

        this.trackers.forEach(t => t.dispose());
        this.trackers.length = 0;

        this.targetElement = null;
        this.isCanvas = true;
    }

    // ========== 内部事件逻辑 ==========

    /**
     * 查找未绑定 touchID 的 Tracker（新触摸）
     */
    _findUnusedTracker() {
        return this.trackers.find(t => t.touchID === false);
    }

    /**
     * 查找当前触摸的 Tracker（通过 pointerId）
     */
    _findTrackerByID(id) {
        return this.trackers.find(t => t.touchID === id);
    }

    /**
     * pointerdown 处理器
     */
    _onPointerDown(e) {
        const tracker = this._findUnusedTracker();
        if (tracker) {
            // 捕获输入焦点（避免被其他元素干扰）
            if (this.isCanvas && this.getActive().length === 0) {
                this.targetElement.setPointerCapture(e.pointerId);
            }

            tracker.touchID = e.pointerId;
            tracker.onTouchStart(e);
        }
    }

    /**
     * pointermove 处理器
     */
    _onPointerMove(e) {
        const tracker = this._findTrackerByID(e.pointerId);

        if (tracker) {
            tracker.onTouchMove(e);
        } else if (e.pointerType === "mouse" && this.getActive().length === 0) {
            // 鼠标状态无 active tracker 时直接用第一个
            this.trackers[0].onTouchMove(e);
        }
    }

    /**
     * pointerup / cancel / out 处理器
     */
    _onPointerUp(e) {
        const tracker = this._findTrackerByID(e.pointerId);
        if (tracker) {
            tracker.onTouchEnd(e);
            tracker.touchID = false;

            // 释放 pointer capture
            if (this.isCanvas && this.getActive().length === 0) {
                this.targetElement.releasePointerCapture(e.pointerId);
            }
        }
    }

    /**
     * 阻止默认 touchstart（如 iOS 双指缩放）
     */
    _preventTouchStart(e) {
        if (!this.allowTouchStart) {
            e.preventDefault();
        }
    }

    /**
     * 阻止默认行为（如右键菜单）
     */
    _preventDefault(e) {
        e.preventDefault();
    }
}

class AdaptiveDPRController {
    /**
     * 根据实时 FPS 自动调节 WebGL 的设备像素比（DPR）
     * **/
    constructor(target) {
        this.target = target; // 有 setDPRMultiplier 方法的对象（比如渲染器）
        this.startDelay = 2; // 启动前延迟秒数
        this.lowFPSThreshold = 30;
        this.highFPSThreshold = 60;
        this.minDPR = 0.6;
        this.maxDPR = 1;
        this.dprStep = 0.1;
        this.fpsSampleInterval = 4; // 每次采样的间隔秒数
        this.requiredSampleCount = 5; // 最少样本数量
        this.maxAdjustments = 4; // 最多调整次数

        this.samples = [];
        this.lastSampleTime = 0;
        this.currentDPR = 1;
        this.adjustmentCount = 0;
        this.lastAdjustmentDirection = 0; // -1降，1升，0无
        this.startTime = 0;

        this._onFPSUpdate = this._onFPSUpdate.bind(this);
    }

    get hasRun() {
        return this.lastSampleTime !== 0;
    }

    start() {
        this.stop();
        this.startTime = this.target.timeStats.time + this.startDelay;
        this.lastSampleTime = this.startTime;
        this.target.eventManage.on("webgl_average_fps_update", this._onFPSUpdate);
    }

    stop() {
        this.samples.length = 0;
        this.target.eventManage.off("webgl_average_fps_update", this._onFPSUpdate);
    }

    _onFPSUpdate(fps) {
        if (this.target.timeStats.time < this.startTime) return;

        this.samples.push(fps);

        const timeSinceLastSample = this.target.timeStats.time - this.lastSampleTime;
        if (timeSinceLastSample >= this.fpsSampleInterval && this.samples.length >= this.requiredSampleCount) {
            const averageFPS = this.samples.reduce((sum, f) => sum + f, 0) / this.samples.length;

            if (averageFPS < this.lowFPSThreshold && this.currentDPR > this.minDPR) {
                this.currentDPR = Math.max(this.minDPR, this.currentDPR - this.dprStep);
                this.target.setDPRMultiplier(this.currentDPR);
                if (this.lastAdjustmentDirection === 1) this.adjustmentCount++;
                this.lastAdjustmentDirection = -1;
            } else if (averageFPS >= this.highFPSThreshold && this.currentDPR < this.maxDPR) {
                this.currentDPR = Math.min(this.maxDPR, this.currentDPR + this.dprStep);
                this.target.setDPRMultiplier(this.currentDPR);
                if (this.lastAdjustmentDirection === -1) this.adjustmentCount++;
                this.lastAdjustmentDirection = 1;
            }

            this.samples.length = 0;
            this.lastSampleTime = this.target.timeStats.time;

            if (this.adjustmentCount >= this.maxAdjustments) {
                console.warn("Adaptive DPR stopped.");
                this.stop();
            }
        }
    }
}

class RenderCreate {

    /**
     * 渲染器
     * **/
    webgl
    domElement
    info
    clearColor = new THREE.Color("#000000")
    clearAlpha = 1

    constructor({shadowMap = true, shadowMapType = THREE.PCFSoftShadowMap} = {}) {
        this.webgl = new THREE.WebGLRenderer({alpha: !1, antialias: !1, stencil: !1, depth: !1})
        this.webgl.setClearColor(this.clearColor, this.clearAlpha)
        if (shadowMap) {
            this.webgl.shadowMap.enabled = !0
            if (shadowMapType) this.webgl.shadowMap.type = shadowMapType
        }
        this.info = this.webgl.info
        this.webgl.debug.checkShaderErrors = !1
        this.webgl.capabilities.floatLinearFiltering = this.webgl.extensions.has("OES_texture_float_linear")
        this.webgl.capabilities.floatRenderTarget = this.checkFloatRenderTarget()
    }

    checkFloatRenderTarget() {
        const renderTarget = new THREE.WebGLRenderTarget(1, 1, {
            minFilter: THREE.NearestFilter,
            magFilter: THREE.NearestFilter,
            type: THREE.FloatType
        })
        const scene = new THREE.Scene
        const material = new THREE.ShaderMaterial({
            vertexShader: " void main() { gl_Position = vec4(position, 1.0); } ",
            fragmentShader: " void main() { gl_FragColor.rgb = vec3(0.0, 1.0 / 10.0, 1.0 / 20.0); gl_FragColor.a = 1.0; } "
        });
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3));
        geometry.setAttribute("uv", new THREE.BufferAttribute(new Float32Array([0, 0, 2, 0, 0, 2]), 2));
        scene.add(new THREE.Mesh(geometry, material));
        const getRenderTarget = this.webgl.getRenderTarget()
        this.webgl.setRenderTarget(renderTarget)
        this.webgl.render(scene, new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1));
        const array = new Float32Array(4);
        this.webgl.readRenderTargetPixels(renderTarget, 0, 0, 1, 1, array)
        this.webgl.setRenderTarget(getRenderTarget)
        renderTarget.dispose()
        material.dispose()
        return !(array[0] !== 0 || array[1] < .1 || array[2] < .05 || array[3] < 1)
    }

    dispose() {
        this.webgl.dispose()
        this.webgl = null
        this.domElement = null
        this.info = null
    }
}

class EnhancedComposer extends EffectComposer {
    /**
     * 对 EffectComposer 的一个扩展类
     * **/
    constructor(base, option = {
        renderTarget: undefined,
        autoResize: true,          // 是否自动响应窗口大小
        renderToScreen: false,     // 是否直接渲染到屏幕
        depthTexture: false,       // 是否启用深度纹理
        scene: null
    }) {
        super(base.renderer.webgl);
        this.base = base;
        this.renderToScreen = true;

        // 如果需要深度纹理，为 read/write buffer 添加深度纹理
        if (option.depthTexture) {
            this.writeBuffer.depthTexture = new THREE.DepthTexture;
            this.readBuffer.depthTexture = new THREE.DepthTexture;
        }
        this._autoResize.bind(this)
        // 自动 resize（监听 resize 事件）
        if (option.autoResize) {
            this._autoResize();
            this.base.eventManage.on("resize", this._autoResize.bind(this));
        }

        // 如果传入了默认场景（包含 camera），自动创建一个 RenderPass
        if (option.scene?.camera) {
            this.addPass(new RenderPass(option.scene, option.scene.camera));
            option.scene.composer = this;
        }
    }

    // 自动调整大小
    _autoResize() {
        const {x: width, y: height} = this.base.uniforms.resolution.value;
        this.setSize(width, height);
    }

    // 添加后处理 Pass，自动处理 composer 引用，并排序 gamma pass
    addPass(pass) {
        super.addPass(pass);

        // 如果 Pass 关联了一个 Scene 且它有相机，设置 composer 引用
        if (pass.scene?.camera) {
            pass.scene.composer = this;
        }

        // 确保 gamma pass 排在最后（通常最后做 gamma 矫正）
        this.passes.sort((a, b) => {
            const isGammaA = a.isGammaCorrectionPass ? 1 : 0;
            const isGammaB = b.isGammaCorrectionPass ? 1 : 0;
            return isGammaA - isGammaB;
        });
    }

    // 销毁：解绑 resize、清空 passes、释放资源
    dispose() {
        this.base.eventManage.off("resize", this._autoResize);

        this.passes.forEach(pass => {
            pass.scene?.dispose?.();
            pass.dispose?.();
        });

        this.passes = [];

        super.dispose();
    }
}

class createCamera extends THREE.PerspectiveCamera {
    constructor(base) {
        super(45, base.screen.w / base.screen.h, 0.1, 1e3);
        this.base = base;
        this.isBaseCamera = true;
        this._sizing = 1;                       // 尺寸来源
        this._size = new THREE.Vector2(base.screen.w, base.screen.h);   // 当前尺寸
        this._firstUpdate = true;
        this._prevSize = this._size.clone();

        // 状态缓存（防止冗余更新）
        this._prevPosition = new THREE.Vector3();
        this._prevTarget = new THREE.Vector3();
        this._prevUp = new THREE.Vector3();

        // 补充旋转与位置偏移控制（球坐标）
        this._additionalSphericalPosition = new THREE.Spherical(); // theta/phi for position
        this._additionalSphericalTarget = new THREE.Spherical();   // theta/phi for target
        this._additionalRotationUp = 0;

        // 摄像目标和方向
        this.target = new THREE.Vector3();
        this.basePosition = new THREE.Vector3(0, 0, 6);  // 初始相机位置
        this.baseTarget = new THREE.Vector3();           // 初始看向目标
        this.baseUp = new THREE.Vector3(0, 1, 0);         // 初始 up 向量

        // 位移控制参数（用于跟随或拖拽）
        this.displacement = {
            position: new THREE.Vector2(),  // 鼠标拖动造成的位置偏移
            target: new THREE.Vector2(),    // 鼠标拖动造成的目标偏移
            rotation: 0         // 旋转偏移
        };

        // 平滑系数
        this.lerpPosition = 0.035;
        this.lerpTarget = 0.035;
        this.lerpRotation = 0.035;

        // 抖动参数
        this.shake = new THREE.Vector3();              // xyz 分量控制 shake 影响程度
        this.shakeSpeed = new THREE.Vector3(1, 1, 1);  // 每个 shake 分量的噪声速度

        // 交互控制参数
        this.touchAmount = 1;
        this.resetOnTouch = true;

        this.Tn = new THREE.Vector3()
        this.er = new THREE.Vector3()
        this.Gu = new THREE.Vector3()
        this.As = new THREE.Vector3()
        this.Em = new THREE.Vector2()
        this.XI = new THREE.Matrix4()
        const noise = createNoise3D(Math.random);
        this.Du = {sineNoise1: noise};
    }

    // 更新相机的实际位置、目标、up，并计算 quaternion
    _update() {
        if (this._firstUpdate) this._firstUpdate = false;

        const isTouchReleased = this.resetOnTouch && this.base.inputManager.get(0).currentInput === "touch" && !this.base.inputManager.get(0).touching;

        const interactionFactor = isTouchReleased ? 0.5 : 1;

        const xInput = this.base.utils.fit(isTouchReleased ? 0 : this.base.inputManager.get(0).position11.x, -1, 1, -Math.PI * .5, Math.PI * .5) * this.touchAmount;
        const yInput = this.base.utils.fit(isTouchReleased ? 0 : this.base.inputManager.get(0).position11.y, 1, -1, -Math.PI * .5, Math.PI * .5) * this.touchAmount;

        // 方向向量构造
        this.Tn.subVectors(this.basePosition, this.baseTarget);
        if (this.Tn.lengthSq() === 0) this.Tn.z = 1;
        this.Tn.normalize();

        this.er.crossVectors(this.baseUp, this.Tn);
        if (this.er.lengthSq() === 0) {
            Math.abs(this.baseUp.z) === 1 ? this.Tn.x += 1e-4 : this.Tn.z += 1e-4;
            this.Tn.normalize();
            this.er.crossVectors(this.baseUp, this.Tn);
        }
        this.er.normalize();

        this.Gu.crossVectors(this.Tn, this.er);

        // === 位置更新 ===
        if (this.displacement.position.equals(this.Em)) {
            this.position.copy(this.basePosition);
            this._additionalSphericalPosition.set(1, 0, 0);
        } else {
            this._additionalSphericalPosition.theta = this.base.utils.lerpFPS(this._additionalSphericalPosition.theta, xInput * this.displacement.position.x, this.lerpPosition * interactionFactor);
            this._additionalSphericalPosition.phi = this.base.utils.lerpFPS(this._additionalSphericalPosition.phi, yInput * this.displacement.position.y, this.lerpPosition * interactionFactor);

            this.As.subVectors(this.basePosition, this.baseTarget);
            this.As.applyAxisAngle(this.er, this._additionalSphericalPosition.phi).applyAxisAngle(this.Gu, this._additionalSphericalPosition.theta);
            this.position.copy(this.baseTarget).add(this.As);
        }

        // === 目标更新 ===
        if (this.displacement.target.equals(this.Em) && this.shake.x === 0 && this.shake.y === 0) {
            this.target.copy(this.baseTarget);
            this._additionalSphericalTarget.set(1, 0, 0);
        } else {
            this._additionalSphericalTarget.theta = this.base.utils.lerpFPS(this._additionalSphericalTarget.theta, xInput * this.displacement.target.x, this.lerpTarget * interactionFactor);
            this._additionalSphericalTarget.phi = this.base.utils.lerpFPS(this._additionalSphericalTarget.phi, yInput * this.displacement.target.y, this.lerpTarget * interactionFactor);

            const shakeX = this.shake.x === 0 ? 0 : this.Du.sineNoise1(12.23, 3.44, -3.234 + this.base.timeStats.time * this.shakeSpeed.x) * this.shake.x * this.touchAmount;
            const shakeY = this.shake.y === 0 ? 0 : this.Du.sineNoise1(-2.45, 4.789, 7.343 + this.base.timeStats.time * this.shakeSpeed.y) * this.shake.y * this.touchAmount;

            this.As.subVectors(this.baseTarget, this.basePosition);
            this.As.applyAxisAngle(this.er, this._additionalSphericalTarget.phi + shakeY)
                .applyAxisAngle(this.Gu, this._additionalSphericalTarget.theta + shakeX);

            this.target.copy(this.basePosition).add(this.As);
        }

        // === up向量更新（用于相机 roll 旋转）===
        if (this.displacement.rotation === 0 && this.shake.z === 0) {
            this.up.copy(this.baseUp);
            this._additionalRotationUp = 0;
        } else {
            this._additionalRotationUp = this.base.utils.lerpFPS(this._additionalRotationUp, this.base.inputManager.get(0).velocity.x * this.displacement.rotation * this.touchAmount, this.lerpRotation * interactionFactor);

            const shakeZ = this.shake.z === 0 ? 0 : this.Du.sineNoise1(23.434, -1.565, 8.454 + this.base.timeStats.time * this.shakeSpeed.z) * this.shake.z * this.touchAmount;

            this.As.subVectors(this.position, this.target).normalize();
            this.up.copy(this.baseUp).applyAxisAngle(this.As, this._additionalRotationUp + shakeZ);
        }

        // === 如果任意状态变化，更新方向四元数 ===
        if (
            !this.position.equals(this._prevPosition) ||
            !this.target.equals(this._prevTarget) ||
            !this.up.equals(this._prevUp)
        ) {
            this._prevPosition.copy(this.position);
            this._prevTarget.copy(this.target);
            this._prevUp.copy(this.up);
            this.quaternion.setFromRotationMatrix(this.XI.lookAt(this.position, this.target, this.up));
        }
    }

    // 根据屏幕 / 自定义尺寸更新投影矩阵
    _resize() {
        if (this._sizing === 1) {
            this._size.set(this.base.screen.w, this.base.screen.h);
        }

        if (!this._prevSize.equals(this._size)) {
            this._prevSize.copy(this._size);

            if (this.isPerspectiveCamera) {
                this.aspect = this._size.x / this._size.y;
            } else {
                const halfW = this._size.x * 0.5;
                const halfH = this._size.y * 0.5;
                this.left = -halfW;
                this.right = halfW;
                this.top = halfH;
                this.bottom = -halfH;
            }

            this.updateProjectionMatrix();
        }
    }

    // 设置自定义尺寸而非屏幕尺寸
    setCustomSize(width, height) {
        this._sizing = 2;
        this._size.set(width, height);
    }
}

class ManagedScene extends THREE.Scene {
    /**
     * 自定义场景类
     * **/
    constructor(base) {
        super();
        this.base = base;
        this.camera = new createCamera(this.base);

        // 相机不自动更新矩阵，场景更新它
        this.camera.matrixWorldAutoUpdate = false;

        // 是否启用自动更新
        this.matrixAutoUpdate = false;
        this.matrixWorldAutoUpdate = true;

        // 与 composer 的关联引用
        this.composer = null;

        // 前置回调（渲染前）
        this.beforeRenderCbs = [];

        // 用于资源预上传的纹理集合
        this._textures = new Set();

        // 可选的上传用的 RT
        this.customUploadRT = null;

        // 上传状态的 Promise
        this.uploaded = new Promise(resolve => {
            this._isUploaded = resolve;
        });

        // 场景就绪 Promise（ready 后执行 _upload）
        this.ready = new Promise(resolve => {
            this.isReady = resolve;
        }).then(() => {
            this._upload();
        });
    }


    /**
     * 覆写矩阵更新逻辑，同时更新相机逻辑
     */
    updateMatrixWorld(force) {
        super.updateMatrixWorld(force);
        this.camera._resize?.();
        this.camera._update?.();
        this.camera.updateMatrixWorld();
        this.beforeRenderCbs.forEach(cb => cb());
    }

    /**
     * 预上传资源（纹理/材质）到 GPU。
     */
    async _upload() {
        // 遍历所有物体做上传准备
        this.traverse(obj => {
            if (obj.material?.isMaterial) {
                // 补全 geometry 的 boundingSphere
                if (obj.frustumCulled && obj.boundingSphere == null) {
                    obj.computeBoundingSphere?.();
                }

                // 收集纹理（uniform 风格或材质属性）
                if (obj.material.uniforms) {
                    Object.entries(obj.material.uniforms).forEach(([key, uniform]) => {
                        const val = uniform.value;
                        if (val?.isTexture && val._loaded) this._textures.add(val);
                    });
                } else {
                    Object.entries(obj.material).forEach(([key, val]) => {
                        if (val?.isTexture && val._loaded) this._textures.add(val);
                    });
                }

                // 记录当前可见性等状态
                obj.__uploadVars = {
                    cull: obj.frustumCulled,
                    visible: obj.visible,
                    materialVisible: obj.material.visible,
                    customDepthMaterialVisible: obj.customDepthMaterial?.visible,
                    customDistanceMaterialVisible: obj.customDistanceMaterial?.visible
                };

                // 暂时强制开启所有物体显示（保证 GPU 编译）
                obj.frustumCulled = false;
                obj.visible = true;
                obj.material.visible = true;
                if (obj.customDepthMaterial) obj.customDepthMaterial.visible = true;
                if (obj.customDistanceMaterial) obj.customDistanceMaterial.visible = true;
            } else if (obj.isLOD) {
                obj.__uploadVars = {autoUpdate: obj.autoUpdate};
                obj.autoUpdate = false;
            }
        });

        const pending = [];

        const Pm = new THREE.WebGLRenderTarget(2, 2, {type: THREE.HalfFloatType})
        Pm.setSize = () => {
        }
        Pm.dispose = () => {
        }

        // 设置渲染目标为上传用的 RT
        this.base.renderer.webgl.setRenderTarget(this.customUploadRT || Pm);

        // 编译场景
        pending.push(this.base.renderer.webgl.compileAsync(this, this.camera));

        // 编译所有纹理
        for (const tex of this._textures) {
            pending.push(tex._loaded.then(() => this.base.renderer.webgl.initTexture(tex)));
        }

        // 等待所有上传完成
        await Promise.all(pending);

        // 再次渲染一次（以确保编译）
        this.base.renderer.webgl.setRenderTarget(this.customUploadRT || Pm);
        this.base.renderer.webgl.render(this, this.camera);

        // 还原所有物体的原始属性
        this.traverse(obj => {
            if (obj.__uploadVars) {
                if (obj.material?.isMaterial) {
                    obj.frustumCulled = obj.__uploadVars.cull;
                    obj.visible = obj.__uploadVars.visible;
                    obj.material.visible = obj.__uploadVars.materialVisible;
                    if (obj.customDepthMaterial) obj.customDepthMaterial.visible = obj.__uploadVars.customDepthMaterialVisible;
                    if (obj.customDistanceMaterial) obj.customDistanceMaterial.visible = obj.__uploadVars.customDistanceMaterialVisible;
                } else if (obj.isLOD) {
                    obj.autoUpdate = obj.__uploadVars.autoUpdate;
                }
                delete obj.__uploadVars;
            }
        });

        // 触发 resolve
        this._isUploaded();
    }

    /**
     * 销毁：释放纹理、RT、几何体、材质、相机等
     */
    dispose() {
        this.camera.dispose?.();
        this.beforeRenderCbs = [];

        this.customUploadRT?.dispose?.();

        this._textures.forEach(tex => tex.dispose?.());
        this._textures.clear();

        this.traverse(obj => {
            obj.geometry?.dispose?.();

            if (obj.material?.isMaterial) {
                if (obj.material.uniforms) {
                    Object.values(obj.material.uniforms).forEach(uniform => {
                        uniform.value?.isTexture && uniform.value.dispose?.();
                    });
                } else {
                    Object.values(obj.material).forEach(val => {
                        val?.isTexture && val.dispose?.();
                    });
                }
                obj.material.dispose?.();
            }

            if (obj !== this) obj.dispose?.();
        });

        this.clear();
    }
}

class MultipleRenderPass extends Pass {
    constructor({
                    scene: e = null,
                    finalMaterials: t = [],
                    rtCount: n = 2,
                    rtOptions: s = {},
                    clearColor: r = null,
                    clearAlpha: a = null
                } = {}) {
        if (!e) throw new Error("MultipleRenderPass requires a scene.");

        super();

        this.scene = e;
        this.camera = e.camera;

        this.clearColor = r;
        this.clearAlpha = a;

        this.clear = true;
        this.clearDepth = false;
        this.needsSwap = false;

        this._oldClearColor = new THREE.Color();

        // 创建多个渲染目标（比如 color 和 info）
        this.multipleRenderTarget = new THREE.WebGLMultipleRenderTargets(2, 2, n, {
            type: THREE.HalfFloatType,      // float 类型或 half float
            ...s           // 用户自定义参数
        });

        // 为了上传给 shader 使用的 clone（也许是保留一份可修改的原始）
        this.scene.customUploadRT = this.multipleRenderTarget.clone();

        // 创建后处理的最终材质 Pass
        this.finalPasses = t.map(
            o => new ShaderPass(o, "__textureAssignDisabled__")
        );
    }

    render(renderer, writeBuffer, readBuffer) {
        const oldAutoClear = renderer.autoClear;
        renderer.autoClear = false;

        let oldAlpha = null;

        // 设置清除颜色
        if (this.clearColor !== null) {
            renderer.getClearColor(this._oldClearColor);
            renderer.setClearColor(this.clearColor, this.clearAlpha);
        }

        // 设置 alpha（透明度）
        if (this.clearAlpha !== null) {
            oldAlpha = renderer.getClearAlpha();
            renderer.setClearAlpha(this.clearAlpha);
        }

        if (this.clearDepth)
            renderer.clearDepth();

        // 渲染到多个目标
        renderer.setRenderTarget(this.multipleRenderTarget);

        if (this.clear === true)
            renderer.clear(renderer.autoClearColor, renderer.autoClearDepth, renderer.autoClearStencil);

        renderer.render(this.scene, this.camera);

        // 还原原来的 clearColor / alpha
        if (this.clearColor !== null)
            renderer.setClearColor(this._oldClearColor, this._oldClearAlpha);

        if (this.clearAlpha !== null)
            renderer.setClearAlpha(oldAlpha);

        renderer.autoClear = oldAutoClear;

        // 使用 finalPass 渲染最终输出，交替 writeBuffer/readBuffer
        const odd = this.finalPasses.length % 2 === 1;
        let currentWrite = odd ? readBuffer : writeBuffer;
        let currentRead = odd ? writeBuffer : readBuffer;
        let tmp = null;

        this.finalPasses.forEach((pass, index) => {
            if (pass.uniforms.tDiffuse)
                pass.uniforms.tDiffuse.value = index === 0
                    ? this.multipleRenderTarget.texture[0]
                    : currentRead.texture;

            pass.clear = index === 0;
            pass.render(renderer, currentWrite);

            // 交换 write/read buffer
            tmp = currentRead;
            currentRead = currentWrite;
            currentWrite = tmp;
        });
    }

    setSize(width, height) {
        this.multipleRenderTarget.setSize(width, height);
        this.finalPasses.forEach(pass => pass.setSize(width, height));
    }

    dispose() {
        this.multipleRenderTarget.dispose();
        this.finalPasses.forEach(pass => pass.dispose());
    }
}

class FLowerScene extends ManagedScene {
    constructor(base) {
        super(base);
        this.base = base;
        this.cameraOptions();
        this.renderOptions();
    }

    cameraOptions() {
        this.camera.basePosition.set(0, 0, 4)
        this.camera.baseTarget.set(0, 0, 0)
        this.camera.displacement.position.set(.03, .015, 0)
        this.camera.lerpPosition = .035
    }

    renderOptions() {
        this.fluidSim = new FluidSimCreate(this)
        this.createMultipleRenderPass()
    }

    createMultipleRenderPass() {
        const material = new THREE.ShaderMaterial({
            uniformsGroups: [this.base.UBO],
            uniforms: {
                tLogo: {value: this.base.headLineTexture},
                tNoise: {value: this.base.noiseSimplexLayeredTexture},
                tDiffuse: {value: null},
                tInfo: {value: null},
                tSim: this.fluidSim.dyeUniform,
                uBgColor: {value: new THREE.Color("#ffec95")},
                tTransition: {value: this.base.transitionNomipmapsTexture},
                uProgress1: {value: 0},
                uProgress2: {value: 0},
                uProgress3: {value: 0},
                uProgress4: {value: 0},
                uCameraNear: {value: this.camera.near, ignore: !0},
                uCameraFar: {value: this.camera.far, ignore: !0},
                uOutlineFade: {value: new THREE.Vector2()},
                uOutlineThickness: {value: 0},
                uOutlineColor: {value: new THREE.Color(11406340)},
                uInfoRange: {value: new THREE.Vector3()},
                uInfoMinScale: {value: 0},
                uDepthRange: {value: new THREE.Vector3()},
                uNormalRange: {value: new THREE.Vector3()},
                uOutlineScale: {value: 0},
                uSmoothMargin: {value: 0}
            },
            vertexShader: vert,
            fragmentShader: frag
        })
        // 创建一个新的 multipleRenderPass 渲染通道
        const multipleRenderPass = new MultipleRenderPass({
            scene: this,
            rtCount: 2, // 使用两个渲染目标：color 和 info
            clearColor: new THREE.Color("#ffffff"), // 清除颜色设为白色
            clearAlpha: this.base.renderer.webgl.clearAlpha, // 使用全局 alpha 值
            finalMaterials: [material] // 使用 eB 作为最终材质
        });

        this.base.composer.passes.splice(0, 1); // 移除第一个默认通道
        this.base.renderPass = multipleRenderPass;

        this.base.composer.addPass(multipleRenderPass);
        // 获取多个渲染目标的贴图
        const n = multipleRenderPass.multipleRenderTarget.texture;
        multipleRenderPass.finalPasses[0].uniforms.tInfo.value = n[1]; // 将第二个贴图 (info) 传入 shader 的 tInfo

        // 命名多个输出贴图，便于调试
        n[0].name = "color";
        n[1].name = "info";

        const t = this.base.composer.passes[0].finalPasses[0];
        t.uniforms.uCameraNear.value = this.camera.near
        t.uniforms.uCameraFar.value = this.camera.far;
        const uniforms = {
            uOutlineFade: {value: new THREE.Vector2(10, 80)},
            uOutlineThickness: {value: 1},
            uOutlineColor: {value: new THREE.Color("#9f4a16")},
            uInfoRange: {value: new THREE.Vector3(1e-4, 2e-4, .1)},
            uInfoMinScale: {value: .6},
            uDepthRange: {value: new THREE.Vector3(1e-4, .001, .5)},
            uNormalRange: {value: new THREE.Vector3(.4, .5, .3)},
            uOutlineScale: {value: 1},
            uSmoothMargin: {value: .2}
        };
        Object.keys(uniforms).forEach(s => {
            typeof t.uniforms[s].value == "number" ? t.uniforms[s].value = uniforms[s].value : t.uniforms[s].value.copy(uniforms[s].value)
        })

        /*    // 如果当前的后处理器是主 composer，则替换默认的 renderPass
            if (e === this.base.composer) {
                e.passes.splice(0, 1); // 移除第一个默认通道
                this.base.renderPass = t;
            }

            // 添加该通道到后处理器中
            e.addPass(t);

            // 获取多个渲染目标的贴图
            const n = t.multipleRenderTarget.texture;
            t.finalPasses[0].uniforms.tInfo.value = n[1]; // 将第二个贴图 (info) 传入 shader 的 tInfo

            // 命名多个输出贴图，便于调试
            n[0].name = "color";
            n[1].name = "info";

            // 配置该后处理器的输出数据结构（如 RT 管理等）
            tB(i, e);

            // 如果是主 composer，还将其加入 GUI 调试面板
            if (e === this.base.composer) {
                t.finalPasses[0].fsQuad._mesh.name = "Big Triangle";
                So.addToGui(t.finalPasses[0].fsQuad._mesh, "post-outline");
            }*/
    }

    playInAnimation() {
        const t = this.base.composer.passes[0].finalPasses[0].material;
        this.base.gsap.fromTo(t.uniforms.uProgress1, {value: 0}, {
            value: 1,
            duration: 5,
            ease: "power2.out",
            delay: .25
        })
        this.base.gsap.fromTo(t.uniforms.uProgress2, {value: 0}, {
            value: 1,
            duration: 5,
            ease: "power2.out",
            delay: .25 + .2
        })
        this.base.gsap.fromTo(t.uniforms.uProgress3, {value: 0}, {
            value: 1,
            duration: 5,
            ease: "power2.out",
            delay: .25 + .6
        })
        this.base.gsap.fromTo(t.uniforms.uProgress4, {value: 0}, {
            value: 1,
            duration: 5,
            ease: "power2.out",
            delay: .25 + .9
        })
    }
}

export default class MainCreate {
    canvasCnt = null
    canvasNode = null
    interactionNode = null
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
    eventManage = new EventEmitter()

    constructor(config) {
        this.parent = config.parent;
        this.target = config.target;
        this.callback = config.callback;
        this.screen.width = this.target.offsetWidth;
        this.screen.height = this.target.offsetHeight;
        this.screen.w = this.screen.width;
        this.screen.h = this.screen.height;
        this.screen.aspectRatio = this.screen.w / this.screen.h;
        this.UBO = new THREE.UniformsGroup()
        this.UBO.setName("Global");
        this.UBO.add(this.uniforms.resolution);
        this.UBO.add(this.uniforms.time);
        this.UBO.add(this.uniforms.dtRatio);
        this.initialDPR = this.DPR;
        this.adaptiveDPR = new AdaptiveDPRController(this)
        this.initGsap();
        this.timeStats = new TimeStats()
        this.utils = new Utils(this)
        this.inputManager = new InputManager(this)
        this.initRenderer();
        this.initAssets();
    }

    initGsap() {
        this.gsap = gsap;
        this.gsap.registerPlugin(CustomEase);
        this.gsap.config({force3D: !0});
        this.gsap.defaults({ease: "power2.inOut", duration: .6, overwrite: "auto"});
        CustomEase.create("inOut1", "M0,0 C0.5,0 0.1,1 1,1");
        CustomEase.create("inOut2", "M0,0 C0.56,0 0,1 1,1");
        CustomEase.create("inOut3", "M0,0 C0.6,0 0,1 1,1");
        CustomEase.create("inOut4", "M0,0 C0.4,0 -0.06,1 1,1");
    }

    initRenderer() {
        this.renderer = new RenderCreate()
        this.renderer.info.autoReset = false;
        this.renderer.webgl.setSize(this.screen.width, this.screen.height);
        this.renderer.webgl.toneMapping = THREE.LinearToneMapping;
        this.target.appendChild(this.renderer.webgl.domElement);
    }

    initComposer() {
        this.composer = new EnhancedComposer(this)
        this.mainScene = new FLowerScene(this);
        this.renderPass = new RenderPass(this.mainScene, this.mainScene.camera, undefined, this.renderer.clearColor, this.renderer.clearAlpha);
        this.outPass = new OutputPass();
        this.composer.addPass(this.renderPass);
        this.composer.addPass(this.outPass);
    }

    initMainScene() {
        this.flower = new FlowerCreate(this);
        this.leaves = new LeavesCreate(this);
        this.needles = new NeedlesCreate(this);
        this.foregroundleaves = new ForegroundLeavesCreate(this);
        this.bckgroundCreate = new BackgroundCreate(this);
        this.borderCreate = new BorderCreate(this);
        this.notchCreate = new NotchCreate(this);
        this.lineCreate = new LineCreate(this);
        this.eventManage.emit("webgl_render_active", true);
        if (this.mainScene && typeof this.mainScene.playInAnimation === 'function') {
            this.mainScene.playInAnimation();
        }
    }

    async initAssets() {
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
                this.callback();
                this.initEvents();
                this.initComposer();
                this.initMainScene();
                this.setDPRMultiplier()
                this.resizeInit();
                this.animationInit();
                this.resize();
            }
        }
    }

    initEvents() {
        this.eventManage.on("resize", ({w, h}) => {
            this.uniforms.resolution.value.set(w, h).multiplyScalar(this.currentDPR).floor();
            this.renderer.webgl.setSize(this.uniforms.resolution.value.x, this.uniforms.resolution.value.y);
            this.renderer.webgl.domElement.style.width = `${w}px`;
            this.renderer.webgl.domElement.style.height = `${h}px`;
        });
        this.eventManage.on("webgl_prerender", (time) => {
            this.uniforms.time.value = time;
            this.uniforms.dtRatio.value = this.utils.deltaRatio();
        });
        this.eventManage.on("webgl_render", (delta) => {
            if (!this.active) return;
            this.renderer.info?.reset();
            this.composer?.render(delta);
        });
        this.eventManage.on("webgl_render_active", (active) => {
            if (active && !this.adaptiveDPR?.hasRun) {
                this.adaptiveDPR.start();
            }
            this.active = active;
        });
    }

    animationInit() {
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

    setDPRMultiplier(dpr = 1) {
        this.currentDPR = this.initialDPR * dpr
        this.eventManage.emit("resize", {w: this.screen.w, h: this.screen.h});
    }

    setDevScene(e) {
        this.setRenderScene(e)
        if (!this.adaptiveDPR?.hasRun) {
            this.adaptiveDPR.start();
        }
        this.active = true;
    }

    setRenderScene(scene) {
        this.renderPass.scene = scene
        this.renderPass.camera = scene.camera
        scene.composer = this.composer
    }

    resizeInit() {
        this.screen.width = this.screen.w = this.target.offsetWidth;
        this.screen.height = this.screen.h = this.target.offsetHeight;
        this.screen.aspectRatio = this.screen.w / this.screen.h;
        this.uniforms.resolution.value = new THREE.Vector2(this.screen.w, this.screen.h);
        this.eventManage.emit("resize", {w: this.screen.w, h: this.screen.h});
    }

    resize() {
        window.addEventListener('resize', (e) => {
            this.resizeInit()
        })
    }

    destroy() {
    }
}
