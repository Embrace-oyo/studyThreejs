/**
 * justThreeJs input.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/23 14:23:36
 */

import {Vector2} from 'three'
import normalizeWheel from 'normalize-wheel';
import MinSignal from '@/views/pages/lusion/js/utils/min-signal'

class SecondOrderDynamics {
    // 状态变量
    target0 = null;
    target = null;
    prevTarget = null;
    value = null;
    valueVel = null;

    // 系统参数
    k1;
    k2;
    k3;

    // 内部参数
    _f;
    _z;
    _r;
    _w;
    _d;
    _targetVelCache;
    _cache1;
    _cache2;
    _k1Stable;
    _k2Stable;

    isVector = null;
    isRobust = null;

    constructor(initialValue, frequency = 1.5, damping = 0.8, response = 2, robust = true) {
        this.isRobust = robust;
        this.isVector = typeof initialValue === "object";

        this.setFZR(frequency, damping, response);

        if (this.isVector) {
            // Vector 初始化
            this.target = initialValue;
            this.target0 = initialValue.clone();
            this.prevTarget = initialValue.clone();
            this.value = initialValue.clone();
            this.valueVel = initialValue.clone().setScalar(0);

            this._targetVelCache = this.valueVel.clone();
            this._cache1 = this.valueVel.clone();
            this._cache2 = this.valueVel.clone();

            this.update = this._updateVector;
            this.reset = this._resetVector;
        } else {
            // 数值初始化
            this.target0 = initialValue;
            this.prevTarget = initialValue;
            this.value = initialValue;
            this.valueVel = 0;

            this.update = this._updateNumber;
            this.reset = this._resetNumber;
        }

        this.computeStableCoefficients = robust
            ? this._computeRobustStableCoefficients
            : this._computeStableCoefficients;
    }

    update(dt, newTarget = this.target) {
    }

    reset(e = null) {
    }

    // ============ Reset ============
    _resetVector(e = this.target0) {
        this.valueVel.setScalar(0);
        this.prevTarget.copy(e);
        this.target.copy(e);
        this.value.copy(e);
    }

    _resetNumber(e = this.target0) {
        this.valueVel = 0;
        this.prevTarget = e;
        this.target = e;
        this.value = e;
    }

    // ============ 设置频率、阻尼、响应速度 ============
    setFZR(f = this._f, z = this._z, r = this._r) {
        let omega = Math.PI * 2 * f;

        if (this.isRobust) {
            this._w = omega;
            this._z = z;
            this._d = omega * Math.sqrt(Math.abs(z * z - 1));
        }

        this.k1 = z / (Math.PI * f);
        this.k2 = 1 / (omega * omega);
        this.k3 = r * z / omega;
    }

    // ============ 稳定系数计算 ============
    _computeStableCoefficients(dt) {
        this._k1Stable = this.k1;
        this._k2Stable = Math.max(this.k2, 1.1 * dt * dt / 4 + dt * this.k1 / 2);
    }

    _computeRobustStableCoefficients(dt) {
        if (this._w * dt < this._z) {
            this._k1Stable = this.k1;
            this._k2Stable = Math.max(this.k2, dt * dt / 2 + dt * this.k1 / 2, dt * this.k1);
        } else {
            let expTerm = Math.exp(-this._z * this._w * dt);
            let r = 2 * expTerm * (this._z <= 1 ? Math.cos(dt * this._d) : Math.cosh(dt * this._d));
            let n = expTerm * expTerm;
            let a = dt / (1 + n - r);

            this._k1Stable = (1 - n) * a;
            this._k2Stable = dt * a;
        }
    }

    // ============ 更新函数（向量） ============
    _updateVector(dt, target = this.target) {
        if (dt > 0) {
            this._targetVelCache.copy(target).sub(this.prevTarget).divideScalar(dt);
            this.prevTarget.copy(target);

            this.computeStableCoefficients(dt);

            // value += velocity * dt
            this.value.add(this._cache1.copy(this.valueVel).multiplyScalar(dt));

            // acceleration step
            this._cache1.copy(target)
                .add(this._targetVelCache.multiplyScalar(this.k3))
                .sub(this.value)
                .sub(this._cache2.copy(this.valueVel).multiplyScalar(this._k1Stable))
                .multiplyScalar(dt / this._k2Stable);

            this.valueVel.add(this._cache1);
        }
    }

    // ============ 更新函数（数字） ============
    _updateNumber(dt, target = this.target) {
        if (dt > 0) {
            let targetVel = (target - this.prevTarget) / dt;
            this.prevTarget = target;

            this.computeStableCoefficients(dt);

            this.valueVel += (target + this.k3 * targetVel - this.value - this._k1Stable * this.valueVel) * (dt / this._k2Stable);
            this.value += this.valueVel * dt;
        }
    }
}

export default class Input {
    // 信号
    onDowned = new MinSignal();
    onMoved = new MinSignal();
    onUped = new MinSignal();
    onClicked = new MinSignal();
    onWheeled = new MinSignal();
    onXScrolled = new MinSignal();
    onYScrolled = new MinSignal();

    // 状态标记
    wasDown = false;
    isDown = false;
    downTime = 0;
    hasClicked = false;
    hasMoved = false;
    hadMoved = false;
    justClicked = false;

    // 鼠标位置
    mouseXY = new Vector2();
    _prevMouseXY = new Vector2();
    prevMouseXY = new Vector2();
    mousePixelXY = new Vector2();
    _prevMousePixelXY = new Vector2();
    prevMousePixelXY = new Vector2();

    // 按下时位置
    downXY = new Vector2();
    downPixelXY = new Vector2();

    // 位移
    deltaXY = new Vector2();
    deltaPixelXY = new Vector2();
    deltaDownXY = new Vector2();
    deltaDownPixelXY = new Vector2();
    deltaDownPixelDistance = 0;

    // 滚动
    deltaWheel = 0;
    deltaDragScrollX = 0;
    deltaScrollX = 0;
    deltaDragScrollY = 0;
    deltaScrollY = 0;
    isDragScrollingX = false;
    isDragScrollingY = false;
    isWheelScrolling = false;

    // 惯性滚动
    dragScrollXMomentum = 0;
    dragScrollYMomentum = 0;
    dragScrollMomentumMultiplier = 10;
    canDesktopDragScroll = false;
    needsCheckDragScrollDirection = false;
    lastScrollXDirection = 0;
    lastScrollYDirection = 0;

    // 动力学
    easedMouseDynamics = {};
    dragScrollDynamic;

    // 元素穿透追踪
    downThroughElems = [];
    currThroughElems = [];
    prevThroughElems = [];
    clickThroughElems = [];

    constructor(base) {
        this.base = base;
    }

    preInit() {
        const e = document;

        e.addEventListener("mousedown", this._onDown.bind(this));
        e.addEventListener("touchstart", this._getTouchBound(this, this._onDown));
        e.addEventListener("mousemove", this._onMove.bind(this));
        e.addEventListener("touchmove", this._getTouchBound(this, this._onMove));
        e.addEventListener("mouseup", this._onUp.bind(this));
        e.addEventListener("touchend", this._getTouchBound(this, this._onUp));
        e.addEventListener("wheel", this._onWheel.bind(this));
        e.addEventListener("mousewheel", this._onWheel.bind(this));

        this.addEasedInput("default", 1.35, 0.5, 1.25);
        this.dragScrollDynamic = this.addEasedInput("dragScroll", 2, 1, 1);

        this.onUped.addOnce(() => {
            this.base.properties.onFirstClicked.dispatch();
        });
    }

    init() {
    }

    resize() {
        for (let key in this.easedMouseDynamics) {
            this.easedMouseDynamics[key].reset();
        }
    }

    update(deltaTime) {
        for (let key in this.easedMouseDynamics) {
            const dynamics = this.easedMouseDynamics[key];
            dynamics.target.copy(this.mouseXY);
            dynamics.update(deltaTime);
        }
    }

    addEasedInput(name, f = 1.5, z = 0.8, r = 2) {
        return this.easedMouseDynamics[name] = new SecondOrderDynamics(new Vector2(), f, z, r);
    }

    postUpdate() {
        this.prevThroughElems.length = 0;
        this.prevThroughElems.concat(this.currThroughElems);

        this.deltaWheel = 0;
        this.deltaDragScrollX = 0;
        this.deltaDragScrollY = 0;
        this.deltaScrollX = 0;
        this.deltaScrollY = 0;
        this.dragScrollXMomentum = 0;
        this.dragScrollYMomentum = 0;

        this.deltaXY.set(0, 0);
        this.deltaPixelXY.set(0, 0);

        this.prevMouseXY.copy(this.mouseXY);
        this.prevMousePixelXY.copy(this.mousePixelXY);

        this.hadMoved = this.hasMoved;
        this.wasDown = this.isDown;
        this.justClicked = false;
        this.isWheelScrolling = false;
    }

    _onWheel(event) {
        let wheelDelta = normalizeWheel(event).pixelY;
        wheelDelta = this.base.math.clamp(wheelDelta, -200, 200);

        this.deltaWheel += wheelDelta;
        this.deltaScrollX = this.deltaDragScrollX + this.deltaWheel;
        this.deltaScrollY = this.deltaDragScrollY + this.deltaWheel;

        this.lastScrollXDirection = wheelDelta > 0 ? 1 : -1;
        this.lastScrollYDirection = wheelDelta > 0 ? 1 : -1;

        this.isWheelScrolling = true;

        this.onWheeled.dispatch(event.target);
        this.onXScrolled.dispatch(event.target);
        this.onYScrolled.dispatch(event.target);
    }

    _onDown(event) {
        if (event.button === 2 || event.button === 1) return;

        this.isDown = true;
        this.downTime = Date.now();

        this.prevThroughElems.length = 0;
        this._setThroughElementsByEvent(event, this.downThroughElems);
        this._getInputXY(event, this.downXY);
        this._getInputPixelXY(event, this.downPixelXY);

        this._prevMouseXY.copy(this.downXY);
        this._prevMousePixelXY.copy(this.downPixelXY);

        this.deltaXY.set(0, 0);
        this.deltaPixelXY.set(0, 0);

        this._getInputXY(event, this.mouseXY);
        this.dragScrollDynamic.reset(this.mouseXY);

        this.isDragScrollingX = false;
        this.isDragScrollingY = false;
        this.needsCheckDragScrollDirection = false;

        this._onMove(event);
        this.onDowned.dispatch(event);

        this.needsCheckDragScrollDirection = true;
    }

    _onMove(event) {
        if (event.button === 2 || event.button === 1) return;

        this._getInputXY(event, this.mouseXY);
        this._getInputPixelXY(event, this.mousePixelXY);

        this.deltaXY.copy(this.mouseXY).sub(this._prevMouseXY);
        this.deltaPixelXY.copy(this.mousePixelXY).sub(this._prevMousePixelXY);

        this._prevMouseXY.copy(this.mouseXY);
        this._prevMousePixelXY.copy(this.mousePixelXY);

        this.hasMoved = this.deltaXY.length() > 0;

        if (this.isDown) {
            this.deltaDownXY.copy(this.mouseXY).sub(this.downXY);
            this.deltaDownPixelXY.copy(this.mousePixelXY).sub(this.downPixelXY);
            this.deltaDownPixelDistance = this.deltaDownPixelXY.length();

            if (this.base.browser.isMobile || this.canDesktopDragScroll) {
                if (this.needsCheckDragScrollDirection) {
                    this.isDragScrollingX = Math.abs(this.deltaPixelXY.x) > Math.abs(this.deltaPixelXY.y);
                    this.isDragScrollingY = !this.isDragScrollingX;
                    this.needsCheckDragScrollDirection = false;
                }

                if (this.isDragScrollingX) {
                    this.deltaDragScrollX += -this.deltaPixelXY.x;
                    this.deltaScrollX += -this.deltaPixelXY.x + this.deltaWheel;
                    this.lastScrollXDirection = this.deltaDragScrollX > 0 ? 1 : -1;
                    this.onXScrolled.dispatch(event.target);
                }

                if (this.isDragScrollingY) {
                    this.deltaDragScrollY += -this.deltaPixelXY.y;
                    this.deltaScrollY += -this.deltaPixelXY.y + this.deltaWheel;
                    this.lastScrollYDirection = this.deltaDragScrollY > 0 ? 1 : -1;
                    this.onYScrolled.dispatch(event.target);
                }
            }
        }

        this._setThroughElementsByEvent(event, this.currThroughElems);
        this.onMoved.dispatch(event);
    }

    _onUp(event) {
        if (event.button === 2 || event.button === 1) return;

        const dx = event.clientX - this.downPixelXY.x;
        const dy = event.clientY - this.downPixelXY.y;

        if (Math.sqrt(dx * dx + dy * dy) < 40 && Date.now() - this.downTime < 300) {
            this._setThroughElementsByEvent(event, this.clickThroughElems);
            this._getInputXY(event, this.mouseXY);
            this.hasClicked = true;
            this.justClicked = true;
            this.onClicked.dispatch(event);
        }

        this.deltaDownXY.set(0, 0);
        this.deltaDownPixelXY.set(0, 0);
        this.deltaDownPixelDistance = 0;

        this.dragScrollXMomentum = this.dragScrollDynamic.valueVel.y * this.base.properties.viewportWidth * this.dragScrollMomentumMultiplier * this.base.properties.deltaTime;
        this.dragScrollYMomentum = this.dragScrollDynamic.valueVel.y * this.base.properties.viewportHeight * this.dragScrollMomentumMultiplier * this.base.properties.deltaTime;

        this.isDown = false;
        this.needsCheckDragScrollDirection = false;

        this.onUped.dispatch(event);
    }

    _getTouchBound(ctx, handler, preventDefault = false) {
        return function (e) {
            if (preventDefault && e.preventDefault) e.preventDefault();
            handler.call(ctx, e.changedTouches[0] || e.touches[0]);
        };
    }

    _getInputXY(e, vec) {
        return vec.set(
            (e.clientX / this.base.properties.viewportWidth) * 2 - 1,
            1 - (e.clientY / this.base.properties.viewportHeight) * 2
        );
    }

    _getInputPixelXY(e, vec) {
        return vec.set(e.clientX, e.clientY);
    }

    _setThroughElementsByEvent(e, arr) {
        let el = e.target;
        arr.length = 0;
        while (el.parentNode) {
            arr.push(el);
            el = el.parentNode;
        }
    }

    hasThroughElem(elem, which = "") {
        const arr = this[which + "ThroughElems"] || this.currThroughElems;
        return arr.includes(elem);
    }

    hasThroughElemWithClass(cls, which = "") {
        const arr = this[which + "ThroughElems"] || this.currThroughElems;
        return arr.find(el => el.classList.contains(cls)) || null;
    }
}
