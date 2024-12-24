/**
 * justThreeJs input.js
 * @author kongjianqiu
 * @description
 * @created 2024/7/5 13:01:32
 */
import * as THREE from "three";

function getDefaultExportFromCjs(a) {
    return a && a.__esModule && Object.prototype.hasOwnProperty.call(a, "default") ? a.default : a
}

let minSignal$1 = {exports: {}};
(function (a) {
    (function (e) {
        function t() {
            this._listeners = [], this.dispatchCount = 0
        }

        var r = t.prototype;
        r.add = c, r.addOnce = u, r.remove = f, r.dispatch = p;
        var n = "Callback function is missing!", o = Array.prototype.slice;

        function l(g) {
            g.sort(function (v, _) {
                return v = v.p, _ = _.p, _ < v ? 1 : _ > v ? -1 : 0
            })
        }

        function c(g, v, _, w) {
            if (!g) throw n;
            _ = _ || 0;
            for (var S = this._listeners, b, C, R, T = S.length; T--;) if (b = S[T], b.f === g && b.c === v) return !1;
            typeof _ == "function" && (C = _, _ = w, R = 4), S.unshift({
                f: g,
                c: v,
                p: _,
                r: C || g,
                a: o.call(arguments, R || 3),
                j: 0
            }), l(S)
        }

        function u(g, v, _, w) {
            if (!g) throw n;
            var S = this, b = function () {
                return S.remove.call(S, g, v), g.apply(v, o.call(arguments, 0))
            };
            w = o.call(arguments, 0), w.length === 1 && w.push(e), w.splice(2, 0, b), c.apply(S, w)
        }

        function f(g, v) {
            if (!g) return this._listeners.length = 0, !0;
            for (var _ = this._listeners, w, S = _.length; S--;) if (w = _[S], w.f === g && (!v || w.c === v)) return w.j = 0, _.splice(S, 1), !0;
            return !1
        }

        function p(g) {
            g = o.call(arguments, 0), this.dispatchCount++;
            for (var v = this.dispatchCount, _ = this._listeners, w, S, b = _.length; b--;) if (w = _[b], w && w.j < v && (w.j = v, w.r.apply(w.c, w.a.concat(g)) === !1)) {
                S = w;
                break
            }
            for (_ = this._listeners, b = _.length; b--;) _[b].j = 0;
            return S
        }

        a.exports = t
    })()
})(minSignal$1);
const MinSignal$2 = getDefaultExportFromCjs(minSignal$1.exports);

let canUseDOM = !!(typeof window < "u" && window.document && window.document.createElement), ExecutionEnvironment$1 = {
    canUseDOM,
    canUseWorkers: typeof Worker < "u",
    canUseEventListeners: canUseDOM && !!(window.addEventListener || window.attachEvent),
    canUseViewport: canUseDOM && !!window.screen,
    isInWorker: !canUseDOM
}, ExecutionEnvironment_1 = ExecutionEnvironment$1, ExecutionEnvironment = ExecutionEnvironment_1, useHasFeature;
ExecutionEnvironment.canUseDOM && (useHasFeature = document.implementation && document.implementation.hasFeature && document.implementation.hasFeature("", "") !== !0);

function isEventSupported$1(a, e) {
    if (!ExecutionEnvironment.canUseDOM || e && !("addEventListener" in document)) return !1;
    var t = "on" + a, r = t in document;
    if (!r) {
        var n = document.createElement("div");
        n.setAttribute(t, "return;"), r = typeof n[t] == "function"
    }
    return !r && useHasFeature && a === "wheel" && (r = document.implementation.hasFeature("Events.wheel", "3.0")), r
}

var isEventSupported_1 = isEventSupported$1,
    isEventSupported = isEventSupported_1, PIXEL_STEP = 10, LINE_HEIGHT = 40, PAGE_HEIGHT = 800;

function normalizeWheel$2(a) {
    var e = 0, t = 0, r = 0, n = 0;
    return "detail" in a && (t = a.detail), "wheelDelta" in a && (t = -a.wheelDelta / 120), "wheelDeltaY" in a && (t = -a.wheelDeltaY / 120), "wheelDeltaX" in a && (e = -a.wheelDeltaX / 120), "axis" in a && a.axis === a.HORIZONTAL_AXIS && (e = t, t = 0), r = e * PIXEL_STEP, n = t * PIXEL_STEP, "deltaY" in a && (n = a.deltaY), "deltaX" in a && (r = a.deltaX), (r || n) && a.deltaMode && (a.deltaMode == 1 ? (r *= LINE_HEIGHT, n *= LINE_HEIGHT) : (r *= PAGE_HEIGHT, n *= PAGE_HEIGHT)), r && !e && (e = r < 1 ? -1 : 1), n && !t && (t = n < 1 ? -1 : 1), {
        spinX: e,
        spinY: t,
        pixelX: r,
        pixelY: n
    }
}

var _populated = !1, _ie, _firefox, _opera, _webkit, _chrome, _ie_real_version, _osx, _windows, _linux, _android,
    _win64, _iphone, _ipad, _native, _mobile;

function _populate() {
    if (!_populated) {
        _populated = !0;
        var a = navigator.userAgent,
            e = /(?:MSIE.(\d+\.\d+))|(?:(?:Firefox|GranParadiso|Iceweasel).(\d+\.\d+))|(?:Opera(?:.+Version.|.)(\d+\.\d+))|(?:AppleWebKit.(\d+(?:\.\d+)?))|(?:Trident\/\d+\.\d+.*rv:(\d+\.\d+))/.exec(a),
            t = /(Mac OS X)|(Windows)|(Linux)/.exec(a);
        if (_iphone = /\b(iPhone|iP[ao]d)/.exec(a), _ipad = /\b(iP[ao]d)/.exec(a), _android = /Android/i.exec(a), _native = /FBAN\/\w+;/i.exec(a), _mobile = /Mobile/i.exec(a), _win64 = !!/Win64/.exec(a), e) {
            _ie = e[1] ? parseFloat(e[1]) : e[5] ? parseFloat(e[5]) : NaN, _ie && document && document.documentMode && (_ie = document.documentMode);
            var r = /(?:Trident\/(\d+.\d+))/.exec(a);
            _ie_real_version = r ? parseFloat(r[1]) + 4 : _ie, _firefox = e[2] ? parseFloat(e[2]) : NaN, _opera = e[3] ? parseFloat(e[3]) : NaN, _webkit = e[4] ? parseFloat(e[4]) : NaN, _webkit ? (e = /(?:Chrome\/(\d+\.\d+))/.exec(a), _chrome = e && e[1] ? parseFloat(e[1]) : NaN) : _chrome = NaN
        } else _ie = _firefox = _opera = _chrome = _webkit = NaN;
        if (t) {
            if (t[1]) {
                var n = /(?:Mac OS X (\d+(?:[._]\d+)?))/.exec(a);
                _osx = n ? parseFloat(n[1].replace("_", ".")) : !0
            } else _osx = !1;
            _windows = !!t[2], _linux = !!t[3]
        } else _osx = _windows = _linux = !1
    }
}

var UserAgent_DEPRECATED$1 = {
    ie: function () {
        return _populate() || _ie
    }, ieCompatibilityMode: function () {
        return _populate() || _ie_real_version > _ie
    }, ie64: function () {
        return UserAgent_DEPRECATED$1.ie() && _win64
    }, firefox: function () {
        return _populate() || _firefox
    }, opera: function () {
        return _populate() || _opera
    }, webkit: function () {
        return _populate() || _webkit
    }, safari: function () {
        return UserAgent_DEPRECATED$1.webkit()
    }, chrome: function () {
        return _populate() || _chrome
    }, windows: function () {
        return _populate() || _windows
    }, osx: function () {
        return _populate() || _osx
    }, linux: function () {
        return _populate() || _linux
    }, iphone: function () {
        return _populate() || _iphone
    }, mobile: function () {
        return _populate() || _iphone || _ipad || _android || _mobile
    }, nativeApp: function () {
        return _populate() || _native
    }, android: function () {
        return _populate() || _android
    }, ipad: function () {
        return _populate() || _ipad
    }
}
let UserAgent_DEPRECATED_1 = UserAgent_DEPRECATED$1
let UserAgent_DEPRECATED = UserAgent_DEPRECATED_1
normalizeWheel$2.getEventType = function () {
    return UserAgent_DEPRECATED.firefox() ? "DOMMouseScroll" : isEventSupported("wheel") ? "wheel" : "mousewheel"
};
let normalizeWheel_1 = normalizeWheel$2
let normalizeWheel = normalizeWheel_1;
const normalizeWheel$1 = getDefaultExportFromCjs(normalizeWheel);

function _sfc32(a, e, t, r) {
    return function () {
        a |= 0, e |= 0, t |= 0, r |= 0;
        var n = (a + e | 0) + r | 0;
        return r = r + 1 | 0, a = e ^ e >>> 9, e = t + (t << 3) | 0, t = t << 21 | t >>> 11, t = t + n | 0, (n >>> 0) / 4294967296
    }
}

class MathUtils {
    PI = Math.PI;
    PI2 = this.PI * 2;
    HALF_PI = this.PI * .5;
    DEG2RAD = this.PI / 180;
    RAD2DEG = 180 / this.PI;

    linearStep(e, t, r) {
        return this.clamp((r - e) / (t - e), 0, 1)
    }

    step(e, t) {
        return t < e ? 0 : 1
    }

    clamp(e, t, r) {
        return e < t ? t : e > r ? r : e
    }

    mod(e, t) {
        return e - t * Math.floor(e / t)
    }

    mix(e, t, r) {
        return e + (t - e) * r
    }

    cMix(e, t, r) {
        return e + (t - e) * this.clamp(r, 0, 1)
    }

    unMix(e, t, r) {
        return (r - e) / (t - e)
    }

    cUnMix(e, t, r) {
        return this.clamp((r - e) / (t - e), 0, 1)
    }

    saturate(e) {
        return this.clamp(e, 0, 1)
    }

    fit(e, t, r, n, o, l) {
        return e = this.cUnMix(t, r, e), l && (e = l(e)), n + e * (o - n)
    }

    unClampedFit(e, t, r, n, o, l) {
        return e = this.unMix(t, r, e), l && (e = l(e)), n + e * (o - n)
    }

    lerp(e, t, r) {
        return e * (1 - r) + t * r
    }

    loop(e, t, r) {
        return e -= t, r -= t, (e < 0 ? (r - Math.abs(e) % r) % r : e % r) + t
    }

    normalize(e, t, r) {
        return Math.max(0, Math.min(1, e - t / r - t))
    }

    smoothstep(e, t, r) {
        return r = this.cUnMix(e, t, r), r * r * (3 - r * 2)
    }

    fract(e) {
        return e - Math.floor(e)
    }

    hash(e) {
        return this.fract(Math.sin(e) * 43758.5453123)
    }

    hash2(e, t) {
        return this.fract(Math.sin(e * 12.9898 + t * 4.1414) * 43758.5453)
    }

    sign(e) {
        return e ? e < 0 ? -1 : 1 : 0
    }

    isPowerOfTwo(e) {
        return (e & -e) === e
    }

    powerTwoCeilingBase(e) {
        return Math.ceil(Math.log(e) / Math.log(2))
    }

    powerTwoCeiling(e) {
        return this.isPowerOfTwo(e) ? e : 1 << this.powerTwoCeilingBase(e)
    }

    powerTwoFloorBase(e) {
        return Math.floor(Math.log(e) / Math.log(2))
    }

    powerTwoFloor(e) {
        return this.isPowerOfTwo(e) ? e : 1 << this.powerTwoFloorBase(e)
    }

    latLngBearing(e, t, r, n) {
        let o = Math.sin(n - t) * Math.cos(r),
            l = Math.cos(e) * Math.sin(r) - Math.sin(e) * Math.cos(r) * Math.cos(n - t);
        return Math.atan2(o, l)
    }

    distanceTo(e, t) {
        return Math.sqrt(e * e + t * t)
    }

    distanceSqrTo(e, t) {
        return e * e + t * t
    }

    distanceTo3(e, t, r) {
        return Math.sqrt(e * e + t * t + r * r)
    }

    distanceSqrTo3(e, t, r) {
        return e * e + t * t + r * r
    }

    latLngDistance(e, t, r, n) {
        let o = Math.sin((r - e) / 2), l = Math.sin((n - t) / 2), c = o * o + Math.cos(e) * Math.cos(r) * l * l;
        return 2 * Math.atan2(Math.sqrt(c), Math.sqrt(1 - c))
    }

    cubicBezier(e, t, r, n, o) {
        let l = (t - e) * 3, c = (r - t) * 3 - l, u = n - e - l - c, f = o * o, p = f * o;
        return u * p + c * f + l * o + e
    }

    cubicBezierFn(e, t, r, n) {
        let o = (t - e) * 3, l = (r - t) * 3 - o, c = n - e - o - l;
        return u => {
            let f = u * u, p = f * u;
            return c * p + l * f + o * u + e
        }
    }

    normalizeAngle(e) {
        return e += this.PI, e = e < 0 ? this.PI2 - Math.abs(e % PI2) : e % this.PI2, e -= this.PI, e
    }

    closestAngleTo(e, t) {
        return e + this.normalizeAngle(t - e)
    }

    randomRange(e, t) {
        return e + Math.random() * (t - e)
    }

    randomRangeInt(e, t) {
        return Math.floor(this.randomRange(e, t + 1))
    }

    padZero(e, t) {
        return e.toString().length >= t ? e : (Math.pow(10, t) + Math.floor(e)).toString().substring(1)
    }

    lerpColor(e, t, r) {
        const n = e >> 16, o = e >> 8 & 255, l = e & 255, c = t >> 16, u = t >> 8 & 255, f = t & 255,
            p = n + r * (c - n), g = o + r * (u - o), v = l + r * (f - l);
        return (p << 16) + (g << 8) + (v | 0)
    }

    getSeedRandomFn(e) {
        let t = 1779033703, r = 3144134277, n = 1013904242, o = 2773480762;
        for (let l = 0, c; l < e.length; l++) c = e.charCodeAt(l), t = r ^ Math.imul(t ^ c, 597399067), r = n ^ Math.imul(r ^ c, 2869860233), n = o ^ Math.imul(n ^ c, 951274213), o = t ^ Math.imul(o ^ c, 2716044179);
        return _sfc32(Math.imul(n ^ t >>> 18, 597399067), Math.imul(o ^ r >>> 22, 2869860233), Math.imul(t ^ n >>> 17, 951274213), Math.imul(r ^ o >>> 19, 2716044179))
    }
}

const math = new MathUtils()

class SecondOrderDynamics {
    target0 = null;
    target = null;
    prevTarget = null;
    value = null;
    valueVel = null;
    k1;
    k2;
    k3;
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

    constructor(e, t = 1.5, r = .8, n = 2, o = !0) {
        this.isRobust = o, this.isVector = typeof e == "object", this.setFZR(t, r, n), this.isVector ? (this.target = e, this.target0 = e.clone(), this.prevTarget = e.clone(), this.value = e.clone(), this.valueVel = e.clone().setScalar(0), this._targetVelCache = this.valueVel.clone(), this._cache1 = this.valueVel.clone(), this._cache2 = this.valueVel.clone(), this.update = this._updateVector, this.reset = this._resetVector) : (this.target0 = e, this.prevTarget = e, this.value = e, this.valueVel = 0, this.update = this._updateNumber, this.reset = this._resetNumber), this.computeStableCoefficients = o ? this._computeRobustStableCoefficients : this._computeStableCoefficients
    }

    update(e, t = 0) {
    }

    reset(e = null) {
    }

    _resetVector(e = this.target0) {
        this.valueVel.setScalar(0), this.prevTarget.copy(e), this.target.copy(e), this.value.copy(e)
    }

    _resetNumber(e = this.target0) {
        this.valueVel = 0, this.prevTarget = e, this.target = e, this.value = e
    }

    setFZR(e = this._f, t = this._z, r = this._r) {
        let n = Math.PI * 2 * e;
        this.isRobust && (this._w = n, this._z = t, this._d = this._w * Math.sqrt(Math.abs(this._z * this._z - 1))), this.k1 = t / (Math.PI * e), this.k2 = 1 / (n * n), this.k3 = r * t / n
    }

    _computeStableCoefficients(e) {
        this._k1Stable = this.k1, this._k2Stable = Math.max(this.k2, 1.1 * e * e / 4 + e * this.k1 / 2)
    }

    _computeRobustStableCoefficients(e) {
        if (this._w * e < this._z) this._k1Stable = this.k1, this._k2Stable = Math.max(this.k2, e * e / 2 + e * this.k1 / 2, e * this.k1); else {
            let t = Math.exp(-this._z * this._w * e),
                r = 2 * t * (this._z <= 1 ? Math.cos(e * this._d) : Math.cosh(e * this._d)), n = t * t,
                o = e / (1 + n - r);
            this._k1Stable = (1 - n) * o, this._k2Stable = e * o
        }
    }

    _updateVector(e, t = this.target) {
        e > 0 && (this._targetVelCache.copy(t).sub(this.prevTarget).divideScalar(e), this.prevTarget.copy(t), this.computeStableCoefficients(e), this.value.add(this._cache1.copy(this.valueVel).multiplyScalar(e)), this._cache1.copy(t).add(this._targetVelCache.multiplyScalar(this.k3)).sub(this.value).sub(this._cache2.copy(this.valueVel).multiplyScalar(this._k1Stable)).multiplyScalar(e / this._k2Stable), this.valueVel.add(this._cache1))
    }

    _updateNumber(e, t = this.target) {
        if (e > 0) {
            let r = (t - this.prevTarget) / e;
            this.prevTarget = t, this.computeStableCoefficients(e), this.valueVel += (t + this.k3 * r - this.value - this._k1Stable * this.valueVel) * (e / this._k2Stable), this.value += this.valueVel * e
        }
    }
}

class ScrollDomRange {
    constructor(e, t) {
        this.dom = e, this.isVertical = t, this.needsUpdate = !0, this.forcedUpdate = !0, this.screenX = 0, this.screenY = 0, this.ratio = 0, this.screenRatio = 0, this.isActive = !1, this._left = 0, this._right = 0, this._top = 0, this._bottom = 0, this.left = 0, this.right = 0, this.top = 0, this.bottom = 0, this.width = 0, this.height = 0, this.showScreenOffset = 0, this.hideScreenOffset = 0
    }

    update(e, t, r, n) {
        n = n || this.needsUpdate
        if (n) {
            let c = this.dom.getBoundingClientRect();
            this.needsUpdate = !1,
                this._left = c.left,
                this._right = c.right,
                this._top = c.top,
                this._bottom = c.bottom, this.width = c.width, this.height = c.height, this.forcedUpdate = !1, this.isVertical ? (this._top += e, this._bottom += e) : (this._left += e, this._right += e)
        }
        this.left = this._left, this.right = this._right, this.top = this._top, this.bottom = this._bottom, this.isVertical ? (this.top += r, this.bottom += r) : (this.left += r, this.right += r), this.screenX = this.left, this.screenY = this.top;
        let o;
        this.isVertical ? o = this.screenY -= e : o = this.screenX -= e;
        let l = this.isVertical ? this.height : this.width;
        this.ratio = Math.min(0, math.unClampedFit(o, t, t - l, -1, 0)), this.ratio += Math.max(0, math.unClampedFit(o, 0, -l, 0, 1)), this.screenRatio = math.fit(o, t, -l, -1, 1), this.showScreenOffset = -(o - t) / t, this.hideScreenOffset = -(o + l) / t, this.isActive = this.ratio >= -1 && this.ratio <= 1
    }
}

export class ScrollPane {
    static scrollPaneCount = 0;
    static domCount = 0;
    id = 0;
    isActive = !1;
    x;
    y;
    viewDom;
    contentDom;
    isVertical = !0;
    canOvershoot = !1;
    targetScrollPixel = 0;
    scrollViewDelta = 0;
    viewWidth = 0;
    viewHeight = 0;
    totalViewSize = 0;
    scrollView = 0;
    progress = 0;
    scrollMotion = null;
    scrollMotionF = 3;
    scrollMotionZ = 1;
    scrollMotionR = .2;
    minScrollPixel = .1;
    viewPixelSize = 1;
    scrollMultiplier = 1;
    domRanges = [];
    hashIdx = -1;
    autoScrollSpeed = 0;
    useResizeObserver = !0;
    tick = -1;
    lastResizeTick = -1;
    resizeObserveTick = -1;
    hasResizeObserved = !1;
    autoScrollRatio = 0;
    skipAutoScroll = !1;

    constructor(base) {
        this.base = base
        this.id = ScrollPane.scrollPaneCount++
        this.scrollMultiplier = (this.base.browser.isMobile, 1)
    }

    init(e = {}) {
        Object.assign(this, e), this.scrollMotion = new SecondOrderDynamics(0, this.scrollMotionF, this.scrollMotionZ, this.scrollMotionR, !0), this.contentDom && this.useResizeObserver && window.ResizeObserver && new ResizeObserver(this._onResizeObserve.bind(this)).observe(this.contentDom)
    }

    _onResizeObserve() {
        this.hasResizeObserved = !0, this.resizeObserveTick = this.tick
    }

    getDomRange(e, t = 0, r = !1) {
        e._scrollDomRangeId === void 0 && (e._scrollDomRangeId = ScrollPane.domCount++);
        let n = this.id + e._scrollDomRangeId, o = this.domRanges[n];
        return o || (o = this.domRanges[n] = new ScrollDomRange(e, this.isVertical)), o.update(this.scrollPixel, this.viewPixelSize, t, r), o
    }

    scrollTo(e, t = 0, r = !1) {
        if (e = typeof e == "string" ? document.getElementById(e) : e, e) {
            let n = this.getDomRange(e);
            this.scrollToPixel(n.top + t * this.viewPixelSize, r)
        }
    }

    scrollToPixel(e = 0, t = !1) {
        if (e = math.clamp(e, 0, this.viewPixelSize * this.totalViewSize), this.scrollMotion.reset(this.scrollMotion.value), this.targetScrollPixel = e, t) this.scrollMotion.reset(this.targetScrollPixel), this.progress = e / this.totalViewSize / this.viewPixelSize; else {
            let r = Math.abs(this.targetScrollPixel - this.scrollPixel), n = Math.exp(-r / this.totalViewSize / 800);
            this.scrollMotion.setFZR(this.scrollMotionF * n, math.mix(1, this.scrollMotionZ, n), math.mix(1, this.scrollMotionR, n)), this.skipAutoScroll = !0
        }
        this.syncDom()
    }

    get scrollPixel() {
        return this.scrollMotion.value
    }

    getEaseInOutOffset(e, t, r = 0, n = .5) {
        let o = 1.5 + n, l = (o - 1) * 2 + r, c = 0, u = o, f = u + r, p = f + o, g = t * p / l,
            v = e + g * .5 - t * .5, _ = Math.min(1, v / g);
        if (_ > 0) {
            let S = _ * p;
            var w = S;
            if (S > c && S <= u) {
                let b = (S - c) / (u - c);
                w = math.cubicBezier(c, (u - c) / 3 + c, 1, 1, b)
            } else if (S > u && S <= f) w = 1; else if (S > f && S <= p) {
                let b = (S - f) / (p - f);
                w = math.cubicBezier(1, 1, -(p - f) / 3 + 2, 2, b)
            } else S > p && (w = S - l);
            return (S - w) / l * t
        }
        return 0
    }

    resize(e, t, r) {
        for (let o = 0; o < this.domRanges.length; o++) this.domRanges[o].needsUpdate = !0;
        if (this.viewDom) {
            let o = this.viewDom.getBoundingClientRect();
            e = o.width, t = o.height
        }
        this.viewWidth = e, this.viewHeight = t;
        let n = this.isVertical ? t : e;
        if (this.contentDom) {
            let o = this.contentDom.getBoundingClientRect();
            this.totalViewSize = Math.max(0, (this.isVertical ? o.height : o.width) / n - 1)
        }
        this.targetScrollPixel = this.totalViewSize * n * this.progress, this.scrollMotion.reset(this.targetScrollPixel), this.viewPixelSize = n, this.lastResizeTick = this.tick, this.syncDom()
    }

    update(e, t) {
        this.hasResizeObserved && (this.hasResizeObserved = !1, this.resizeObserveTick !== this.lastResizeTick && this.resize(this.viewWidth, this.viewHeight));
        let r = this.scrollView, n = 0, o = Math.floor(this.totalViewSize * this.viewPixelSize);
        if (this.isMoveable) {
            let l = this.isVertical ? this.base.input.isDragScrollingY ? this.base.input.deltaScrollY : 0 : this.base.input.isDragScrollingX ? this.base.input.deltaScrollX : 0,
                c = (this.isVertical ? this.base.input.isDragScrollingY || this.base.input.isWheelScrolling ? this.base.input.deltaScrollY + this.base.input.dragScrollYMomentum : 0 : this.base.input.isDragScrollingX || this.base.input.isWheelScrolling ? this.base.input.deltaScrollX + this.base.input.dragScrollXMomentum : 0) * this.scrollMultiplier;
            l !== 0 && (this.skipAutoScroll = !1), this.autoScrollRatio = math.saturate(this.autoScrollRatio + (Math.abs(this.autoScrollSpeed) > 0 && l == 0 ? e : -1)), c += this.autoScrollSpeed * this.viewPixelSize * e * (this.skipAutoScroll ? 0 : this.autoScrollRatio), Math.abs(l) > 0 && this.scrollMotion.setFZR(this.scrollMotionF, this.scrollMotionZ, this.scrollMotionR), this.targetScrollPixel = this.targetScrollPixel + c, this.targetScrollPixel = math.clamp(this.targetScrollPixel, n, o)
        }
        if (this.totalViewSize == 0 && (this.targetScrollPixel = 0, this.scrollMotion.reset(this.targetScrollPixel)), this.targetScrollPixel !== this.scrollPixel) {
            let l = this.targetScrollPixel - this.scrollPixel;
            this.base.input.isDown && this.isVertical && this.base.input.isDragScrollingY || !this.isVertical && this.base.input.isDragScrollingX ? this.scrollMotion.reset(this.scrollPixel + l) : this.scrollMotion.update(e, this.scrollPixel + l), Math.abs(this.scrollPixel - this.targetScrollPixel) < this.minScrollPixel && Math.abs(this.scrollPixel + this.scrollMotion.valueVel * e - this.targetScrollPixel) < this.minScrollPixel && this.scrollMotion.reset(this.targetScrollPixel)
        }
        !this.canOvershoot && this.isMoveable && (this.scrollPixel < n ? this.scrollMotion.value = n : this.scrollPixel > o && (this.scrollMotion.value = o)), this.scrollView = this.scrollPixel / this.viewPixelSize, this.scrollViewDelta = this.scrollView - r, this.progress = this.totalViewSize > 0 ? this.scrollPixel / (this.totalViewSize * this.viewPixelSize) : 0, this.isScrolling = this.scrollMotion.valueVel !== 0, this.syncDom(), this.tick++
    }

    syncDom() {
        this.contentDom && (this.x = 0, this.y = 0, this.isVertical ? this.y = -this.scrollPixel : this.x = -this.scrollPixel, this.contentDom.style.transform = `translate3d(${this.x}px, ${this.y}px, 0px)`)
    }

    get isMoveable() {
        // return this.isActive && !videoOverlay.isOpened && pagesManager.isIdle && !header.menu.opened && this.totalViewSize > 0 && (!this.viewDom || input.hasThroughElem(this.viewDom, "down"))
    }
}

export class ScrollManager extends ScrollPane {
    domScrollIndicator;
    domScrollIndicatorHeight = 1;
    domScrollIndicatorBar;
    scrollIndicatorActiveRatio = 0;
    lastMouseInteractiveTime = -1 / 0;
    isIndicatorActive = void 0;
    easedScrollStrength = 0;
    frameIdx = -1;
    MIN_BAR_SCALE_Y = 2 / 10;

    constructor(base) {
        super(base)
        this.base = base
    }

    init() {
        super.init({
            contentDom: document.getElementById("page-container"),
            domScrollIndicator: document.getElementById("scroll-indicator"),
            domScrollIndicatorBar: document.getElementById("scroll-indicator-bar"),
            canOvershoot: !1
        })
    }

    resize(e, t) {
        super.resize(e, t)
        // this.domScrollIndicatorHeight = this.domScrollIndicator.getBoundingClientRect().height
    }

    update(e) {
        super.update(e, this.scrollValue)
        this.easedScrollStrength += Math.abs(this.scrollViewDelta)
        this.easedScrollStrength += (0 - this.easedScrollStrength) * (1 - Math.exp(-10 * e))
        this.easedScrollStrength = Math.min(this.easedScrollStrength, 1)
        Math.abs(this.scrollViewDelta) > 0 ? (this.lastMouseInteractiveTime = this.base.properties.time, this.isIndicatorActive = !0) : this.base.properties.time > this.lastMouseInteractiveTime + .5 && (this.isIndicatorActive = !1)
        this.scrollIndicatorActiveRatio = math.clamp(this.scrollIndicatorActiveRatio + (this.isIndicatorActive ? 2 : -2) * e, 0, 1)
        // this.domScrollIndicator.style.opacity = this.scrollIndicatorActiveRatio;
        let r = 1;
        let n = 0;

        if (this.totalViewSize > 0) {
            r = Math.max(this.MIN_BAR_SCALE_Y, 1 / (1 + this.totalViewSize))
            n = this.scrollView / this.totalViewSize * (1 - r)
        }
        // this.domScrollIndicatorBar.style.height = this.domScrollIndicatorHeight * r + "px"
        // this.domScrollIndicatorBar.style.transform = "translate3d(0," + this.domScrollIndicatorHeight * n + "px,0)"
        this.frameIdx++
    }

    get isMoveable() {
        return super.isMoveable
    }
}

export class Input {
    onDowned = new MinSignal$2;
    onMoved = new MinSignal$2;
    onUped = new MinSignal$2;
    onClicked = new MinSignal$2;
    onWheeled = new MinSignal$2;
    onXScrolled = new MinSignal$2;
    onYScrolled = new MinSignal$2;
    wasDown = !1;
    isDown = !1;
    downTime = 0;
    hasClicked = !1;
    hasMoved = !1;
    hadMoved = !1;
    justClicked = !1;
    mouseXY = new THREE.Vector2;
    _prevMouseXY = new THREE.Vector2;
    prevMouseXY = new THREE.Vector2;
    mousePixelXY = new THREE.Vector2;
    _prevMousePixelXY = new THREE.Vector2;
    prevMousePixelXY = new THREE.Vector2;
    downXY = new THREE.Vector2;
    downPixelXY = new THREE.Vector2;
    deltaXY = new THREE.Vector2;
    deltaPixelXY = new THREE.Vector2;
    deltaDownXY = new THREE.Vector2;
    deltaDownPixelXY = new THREE.Vector2;
    deltaDownPixelDistance = 0;
    deltaWheel = 0;
    deltaDragScrollX = 0;
    deltaScrollX = 0;
    deltaDragScrollY = 0;
    deltaScrollY = 0;
    isDragScrollingX = !1;
    isDragScrollingY = !1;
    isWheelScrolling = !1;
    dragScrollXMomentum = 0;
    dragScrollYMomentum = 0;
    dragScrollMomentumMultiplier = 10;
    canDesktopDragScroll = !1;
    needsCheckDragScrollDirection = !1;
    lastScrollXDirection = 0;
    lastScrollYDirection = 0;
    easedMouseDynamics = {};
    dragScrollDynamic;
    downThroughElems = [];
    currThroughElems = [];
    prevThroughElems = [];
    clickThroughElems = [];

    constructor(base) {
        this.base = base
    }

    preInit() {
        const e = document;
        e.addEventListener("mousedown", this._onDown.bind(this)), e.addEventListener("touchstart", this._getTouchBound(this, this._onDown)), e.addEventListener("mousemove", this._onMove.bind(this)), e.addEventListener("touchmove", this._getTouchBound(this, this._onMove)), e.addEventListener("mouseup", this._onUp.bind(this)), e.addEventListener("touchend", this._getTouchBound(this, this._onUp)), e.addEventListener("wheel", this._onWheel.bind(this)), e.addEventListener("mousewheel", this._onWheel.bind(this)), this.addEasedInput("default", 1.35, .5, 1.25), this.dragScrollDynamic = this.addEasedInput("dragScroll", 2, 1, 1), this.onUped.addOnce(() => {
            this.base.properties.onFirstClicked.dispatch()
        })
    }

    init() {
    }

    resize() {
        for (let e in this.easedMouseDynamics) this.easedMouseDynamics[e].reset()
    }

    update(e) {
        for (let t in this.easedMouseDynamics) {
            let r = this.easedMouseDynamics[t];
            r.target.copy(this.mouseXY), r.update(e)
        }
    }

    addEasedInput(e, t = 1.5, r = .8, n = 2) {
        return this.easedMouseDynamics[e] = new SecondOrderDynamics(new THREE.Vector2, t, r, n)
    }

    postUpdate(e) {
        this.prevThroughElems.length = 0,
            this.prevThroughElems.concat(this.currThroughElems),
            this.deltaWheel = 0,
            this.deltaDragScrollX = 0,
            this.deltaDragScrollY = 0,
            this.deltaScrollX = 0,
            this.deltaScrollY = 0,
            this.dragScrollXMomentum = 0,
            this.dragScrollYMomentum = 0,
            this.deltaXY.set(0, 0),
            this.deltaPixelXY.set(0, 0),
            this.prevMouseXY.copy(this.mouseXY),
            this.prevMousePixelXY.copy(this.mousePixelXY),
            this.hadMoved = this.hasMoved,
            this.wasDown = this.isDown,
            this.justClicked = !1,
            this.isWheelScrolling = !1
    }

    _onWheel(e) {
        let t = normalizeWheel$1(e).pixelY;
        t = THREE.MathUtils.clamp(t, -200, 200), this.deltaWheel += t, this.deltaScrollX = this.deltaDragScrollX + this.deltaWheel, this.deltaScrollY = this.deltaDragScrollY + this.deltaWheel, this.lastScrollXDirection = this.deltaWheel > 0 ? 1 : -1, this.lastScrollYDirection = this.deltaWheel > 0 ? 1 : -1, this.isWheelScrolling = !0, this.onWheeled.dispatch(e.target), this.onXScrolled.dispatch(e.target), this.onYScrolled.dispatch(e.target)
    }

    _onDown(e) {
        this.isDown = !0, this.downTime = +new Date, this.prevThroughElems.length = 0, this._setThroughElementsByEvent(e, this.downThroughElems), this._getInputXY(e, this.downXY), this._getInputPixelXY(e, this.downPixelXY), this._prevMouseXY.copy(this.downXY), this._prevMousePixelXY.copy(this.downPixelXY), this.deltaXY.set(0, 0), this.deltaPixelXY.set(0, 0), this._getInputXY(e, this.mouseXY), this.dragScrollDynamic.reset(this.mouseXY), this.isDragScrollingX = !1, this.isDragScrollingY = !1, this.needsCheckDragScrollDirection = !1, this._onMove(e), this.onDowned.dispatch(e), this.needsCheckDragScrollDirection = !0
    }

    _onMove(e) {
        this._getInputXY(e, this.mouseXY)
        this._getInputPixelXY(e, this.mousePixelXY)
        this.deltaXY.copy(this.mouseXY).sub(this._prevMouseXY)
        this.deltaPixelXY.copy(this.mousePixelXY).sub(this._prevMousePixelXY)
        this._prevMouseXY.copy(this.mouseXY),
            this._prevMousePixelXY.copy(this.mousePixelXY)
        this.hasMoved = this.deltaXY.length() > 0
        this.isDown && (this.deltaDownXY.copy(this.mouseXY).sub(this.downXY), this.deltaDownPixelXY.copy(this.mousePixelXY).sub(this.downPixelXY), this.deltaDownPixelDistance = this.deltaDownPixelXY.length(), (this.base.browser.isMobile || this.canDesktopDragScroll) && (this.needsCheckDragScrollDirection && (this.isDragScrollingX = Math.abs(this.deltaPixelXY.x) > Math.abs(this.deltaPixelXY.y), this.isDragScrollingY = !this.isDragScrollingX, this.needsCheckDragScrollDirection = !1), this.isDragScrollingX && (this.deltaDragScrollX += -this.deltaPixelXY.x, this.deltaScrollX += -this.deltaPixelXY.x + this.deltaWheel, this.lastScrollXDirection = this.deltaDragScrollX > 0 ? 1 : -1, this.onXScrolled.dispatch(e.target)), this.isDragScrollingY && (this.deltaDragScrollY += -this.deltaPixelXY.y, this.deltaScrollY += -this.deltaPixelXY.y + this.deltaWheel, this.lastScrollYDirection = this.deltaDragScrollY > 0 ? 1 : -1, this.onYScrolled.dispatch(e.target)))),
            this._setThroughElementsByEvent(e, this.currThroughElems),
            this.onMoved.dispatch(e)
    }

    _onUp(e) {
        const t = e.clientX - this.downPixelXY.x, r = e.clientY - this.downPixelXY.y;
        Math.sqrt(t * t + r * r) < 40 && +new Date - this.downTime < 300 && (this._setThroughElementsByEvent(e, this.clickThroughElems), this._getInputXY(e, this.mouseXY), this.hasClicked = !0, this.justClicked = !0, this.onClicked.dispatch(e)), this.deltaDownXY.set(0, 0), this.deltaDownPixelXY.set(0, 0), this.deltaDownPixelDistance = 0, this.dragScrollXMomentum = this.dragScrollDynamic.valueVel.y * this.base.properties.viewportWidth * this.dragScrollMomentumMultiplier * this.base.properties.deltaTime, this.dragScrollYMomentum = this.dragScrollDynamic.valueVel.y * this.base.properties.viewportHeight * this.dragScrollMomentumMultiplier * this.base.properties.deltaTime, this.isDown = !1, this.needsCheckDragScrollDirection = !1, this.onUped.dispatch(e)
    }

    _getTouchBound(e, t, r) {
        return function (n) {
            r && n.preventDefault && n.preventDefault(), t.call(e, n.changedTouches[0] || n.touches[0])
        }
    }

    _getInputXY(e, t) {
        return t.set(e.clientX / this.base.properties.viewportWidth * 2 - 1, 1 - e.clientY / this.base.properties.viewportHeight * 2), t
    }

    _getInputPixelXY(e, t) {
        t.set(e.clientX, e.clientY)
    }

    _setThroughElementsByEvent(e, t) {
        let r = e.target;
        for (t.length = 0; r.parentNode;) t.push(r), r = r.parentNode
    }

    hasThroughElem(e, t) {
        let r = this[t + "ThroughElems"] || this.currThroughElems, n = r.length;
        for (; n--;) if (r[n] === e) return !0;
        return !1
    }

    hasThroughElemWithClass(e, t) {
        let r = this[t + "ThroughElems"] || this.currThroughElems, n = r.length;
        for (; n--;) if (r[n].classList.contains(e)) return r[n];
        return null
    }
}
