/**
 * justThreeJs properties.js
 * @author kongjianqiu
 * @description
 * @created 2024/7/5 09:07:47
 */
import * as THREE from "three";


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

let isSSR = typeof window > "u";
let DetectUA = function () {
    function a(e) {
        this.userAgent = e || (!isSSR && window.navigator ? window.navigator.userAgent : ""), this.isAndroidDevice = !/like android/i.test(this.userAgent) && /android/i.test(this.userAgent), this.iOSDevice = this.match(1, /(iphone|ipod|ipad)/i).toLowerCase(), !isSSR && navigator.platform === "MacIntel" && navigator.maxTouchPoints > 2 && !window.MSStream && (this.iOSDevice = "ipad")
    }

    return a.prototype.match = function (e, t) {
        var r = this.userAgent.match(t);
        return r && r.length > 1 && r[e] || ""
    }, Object.defineProperty(a.prototype, "isMobile", {
        get: function () {
            return !this.isTablet && (/[^-]mobi/i.test(this.userAgent) || this.iOSDevice === "iphone" || this.iOSDevice === "ipod" || this.isAndroidDevice || /nexus\s*[0-6]\s*/i.test(this.userAgent))
        }, enumerable: !1, configurable: !0
    }), Object.defineProperty(a.prototype, "isTablet", {
        get: function () {
            return /tablet/i.test(this.userAgent) && !/tablet pc/i.test(this.userAgent) || this.iOSDevice === "ipad" || this.isAndroidDevice && !/[^-]mobi/i.test(this.userAgent) || !/nexus\s*[0-6]\s*/i.test(this.userAgent) && /nexus\s*[0-9]+/i.test(this.userAgent)
        }, enumerable: !1, configurable: !0
    }), Object.defineProperty(a.prototype, "isDesktop", {
        get: function () {
            return !this.isMobile && !this.isTablet
        }, enumerable: !1, configurable: !0
    }), Object.defineProperty(a.prototype, "isMacOS", {
        get: function () {
            return /macintosh/i.test(this.userAgent) && {
                version: this.match(1, /mac os x (\d+(\.?_?\d+)+)/i).replace(/[_\s]/g, ".").split(".").map(function (e) {
                    return e
                })[1]
            }
        }, enumerable: !1, configurable: !0
    }), Object.defineProperty(a.prototype, "isWindows", {
        get: function () {
            return /windows /i.test(this.userAgent) && {version: this.match(1, /Windows ((NT|XP)( \d\d?.\d)?)/i)}
        }, enumerable: !1, configurable: !0
    }), Object.defineProperty(a.prototype, "isiOS", {
        get: function () {
            return !!this.iOSDevice && {version: this.match(1, /os (\d+([_\s]\d+)*) like mac os x/i).replace(/[_\s]/g, ".") || this.match(1, /version\/(\d+(\.\d+)?)/i)}
        }, enumerable: !1, configurable: !0
    }), Object.defineProperty(a.prototype, "isAndroid", {
        get: function () {
            return this.isAndroidDevice && {version: this.match(1, /android[ \/-](\d+(\.\d+)*)/i)}
        }, enumerable: !1, configurable: !0
    }), Object.defineProperty(a.prototype, "browser", {
        get: function () {
            var e = this.match(1, /version\/(\d+(\.\d+)?)/i);
            return /opera/i.test(this.userAgent) ? {
                name: "Opera",
                version: e || this.match(1, /(?:opera|opr|opios)[\s\/](\d+(\.\d+)?)/i)
            } : /opr\/|opios/i.test(this.userAgent) ? {
                name: "Opera",
                version: this.match(1, /(?:opr|opios)[\s\/](\d+(\.\d+)?)/i) || e
            } : /SamsungBrowser/i.test(this.userAgent) ? {
                name: "Samsung Internet for Android",
                version: e || this.match(1, /(?:SamsungBrowser)[\s\/](\d+(\.\d+)?)/i)
            } : /yabrowser/i.test(this.userAgent) ? {
                name: "Yandex Browser",
                version: e || this.match(1, /(?:yabrowser)[\s\/](\d+(\.\d+)?)/i)
            } : /ucbrowser/i.test(this.userAgent) ? {
                name: "UC Browser",
                version: this.match(1, /(?:ucbrowser)[\s\/](\d+(\.\d+)?)/i)
            } : /msie|trident/i.test(this.userAgent) ? {
                name: "Internet Explorer",
                version: this.match(1, /(?:msie |rv:)(\d+(\.\d+)?)/i)
            } : /(edge|edgios|edga|edg)/i.test(this.userAgent) ? {
                name: "Microsoft Edge",
                version: this.match(2, /(edge|edgios|edga|edg)\/(\d+(\.\d+)?)/i)
            } : /firefox|iceweasel|fxios/i.test(this.userAgent) ? {
                name: "Firefox",
                version: this.match(1, /(?:firefox|iceweasel|fxios)[ \/](\d+(\.\d+)?)/i)
            } : /chromium/i.test(this.userAgent) ? {
                name: "Chromium",
                version: this.match(1, /(?:chromium)[\s\/](\d+(?:\.\d+)?)/i) || e
            } : /chrome|crios|crmo/i.test(this.userAgent) ? {
                name: "Chrome",
                version: this.match(1, /(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)
            } : /safari|applewebkit/i.test(this.userAgent) ? {
                name: "Safari",
                version: e
            } : {name: this.match(1, /^(.*)\/(.*) /), version: this.match(2, /^(.*)\/(.*) /)}
        }, enumerable: !1, configurable: !0
    }), a
}();
let detectUA = new DetectUA
let userAgent = (navigator.userAgent || navigator.vendor).toLowerCase()
let browserName = detectUA.browser.name
let audioElem = document.createElement("audio");


export class Browser {
    isMobile = detectUA.isMobile || detectUA.isTablet;
    isDesktop = detectUA.isDesktop;
    device = this.isMobile ? "mobile" : "desktop";
    isAndroid = !!detectUA.isAndroid;
    isIOS = !!detectUA.isiOS;
    isMacOS = !!detectUA.isMacOS;
    isWindows = detectUA.isWindows.version !== null;
    isLinux = userAgent.indexOf("linux") != -1;
    ua = userAgent;
    isEdge = browserName === "Microsoft Edge";
    isIE = browserName === "Internet Explorer";
    isFirefox = browserName === "Firefox";
    isChrome = browserName === "Chrome";
    isOpera = browserName === "Opera";
    isSafari = browserName === "Safari";
    isSupportMSAA = !userAgent.match("version/15.4 ");
    isSupportOgg = !!audioElem.canPlayType("audio/ogg");
    isRetina = window.devicePixelRatio && window.devicePixelRatio >= 1.5;
    devicePixelRatio = window.devicePixelRatio || 1;
    cpuCoreCount = navigator.hardwareConcurrency || 1;
    baseUrl = document.location.origin;
    isIFrame = window.self !== window.top;

    constructor() {
    }
}

let browser$1 = new Browser()
let CDN_PATH = "";
window.location.hostname == "lusion.co" && (CDN_PATH = "https://lusion.dev");
window.location.hostname == "lusion.dev" && (window.location.href = "https://lusion.co" + window.location.pathname + window.location.search);

export class Settings {
    CDN_PATH = "";
    TEAM_PATH = "/assets/team/";
    PROJECT_PATH = "/assets/projects/";
    MODEL_PATH = "/assets/models/";
    IMAGE_PATH = "/assets/images/";
    TEXTURE_PATH = "/assets/textures/";
    AUDIO_PATH = "/assets/audios/";
    SPRITE_PATH = "/assets/sprites/";
    RENDER_TARGET_FLOAT_TYPE = null;
    DATA_FLOAT_TYPE = null;
    USE_FLOAT_PACKING = !1;
    USE_WEBGL2 = !0;
    DPR = Math.min(1.5, browser$1.devicePixelRatio) || 1;
    USE_PIXEL_LIMIT = !0;
    MAX_PIXEL_COUNT = 2560 * 1440;
    MOBILE_WIDTH = 812;
    IS_SMALL_SCREEN = Math.min(window.screen.width, window.screen.height) <= 820;
    JUMP_SECTION = "";
    JUMP_OFFSET = 0;
    USE_HD = !1;
    SHOW_DETAILS = "";
    CROSS_ORIGINS = {"https://lusion.dev/": "anonymous"};
    IS_DEV = !1;
    LOG = !1;
    SKIP_ANIMATION = !1;
    WEBGL_OFF = !1;
    LOOK_DEV_MODE = !1;
    TEST_TUNNEL = !1;
    HOME_TEST = !1;
    OPEN_CONTACT = !1;
    TEST_BALLOONS = !1;
    BALLOON_COLOR = "";
    USE_AUDIO = browser$1.isSupportOgg && !browser$1.isMobile;

    constructor() {
        if (window.URLSearchParams) {
            const t = (r => [...r].reduce((n, [o, l]) => (n[o] = l === "" ? !0 : l, n), {}))(new URLSearchParams(window.location.search));
            this.override(t);
            for (const r in this) r.indexOf("_PATH") > -1 && (this["LOCAL_" + r] = this[r], this[r] = CDN_PATH + this[r])
        }
    }

    override(e) {
        for (const t in e) if (this[t] !== void 0) {
            const r = e[t].toString();
            typeof this[t] == "boolean" ? this[t] = !(r === "0" || r === !1) : typeof this[t] == "number" ? this[t] = parseFloat(r) : typeof this[t] == "string" && (this[t] = r)
        }
        this.USE_HD && (this.USE_PIXEL_LIMIT = !1)
    }
}

let computedStyle = getComputedStyle(document.documentElement);
let settings = new Settings()

export class Support {
    constructor(base) {
        this.base = base
    }

    isSupported() {
        return this.base.properties._isSupportedDevice = !0, this.base.properties._isSupportedBrowser = (browser$1.isChrome || browser$1.isSafari || browser$1.isEdge || browser$1.isFirefox || browser$1.isOpera) && !browser$1.isIE, this.base.properties._isSupportedWebGL = this.checkSupportWebGL(), this.base.properties._isSupportedWebGL
    }

    checkSupportWebGL() {
        if (!(this.base.properties.canvas instanceof HTMLCanvasElement)) return !1;
        if (settings.USE_WEBGL2 && window.WebGL2RenderingContext) try {
            return this.base.properties.gl = this.base.properties.canvas.getContext("webgl2", this.base.properties.webglOpts), settings.RENDER_TARGET_FLOAT_TYPE = THREE.HalfFloatType, settings.DATA_FLOAT_TYPE = THREE.FloatType, !0
        } catch (e) {
            return console.error(e), !1
        }
        if (settings.USE_WEBGL2 = !1, window.WebGLRenderingContext) try {
            let e = this.base.properties.gl = this.base.properties.canvas.getContext("webgl", this.base.properties.webglOpts) || this.base.properties.canvas.getContext("experimental-webgl", this.base.properties.webglOpts);
            if ((e.getExtension("OES_texture_float") || e.getExtension("OES_texture_half_float")) && e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS)) settings.RENDER_TARGET_FLOAT_TYPE = browser$1.isIOS || e.getExtension("OES_texture_half_float") ? THREE.HalfFloatType : THREE.FloatType, settings.DATA_FLOAT_TYPE = THREE.FloatType; else return settings.USE_FLOAT_PACKING = !0, settings.RENDER_TARGET_FLOAT_TYPE = settings.DATA_FLOAT_TYPE = THREE.UnsignedByteType, !1;
            return !0
        } catch (e) {
            return console.error(e), !1
        }
        return !1
    }
}

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
let minSignalExports$1 = minSignal$1.exports;
const MinSignal$2 = getDefaultExportFromCjs(minSignalExports$1);
let minSignal = {exports: {}};
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
                return v = v.p, _ = _.p, _ < v ? 1 : v > _ ? -1 : 0
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
})(minSignal);
let minSignalExports = minSignal.exports;
let MinSignal$1 = minSignalExports;
let undef$3;


function QuickLoader() {
    this.isLoading = !1
    this.totalWeight = 0
    this.loadedWeight = 0
    this.itemUrls = {}
    this.itemList = []
    this.loadingSignal = new MinSignal$1
    this.crossOriginMap = {}
    this.queue = []
    this.activeItems = []
    this.maxActiveItems = 4
}

function _getExtension(a) {
    return a.split(".").pop().split(/#|\?/)[0]
}

function testExtensions(a, e) {
    if (a) {
        for (var t = _getExtension(a), r = e.extensions, n = r.length; n--;) if (t === r[n]) return !0;
        return !1
    }
}

function retrieve(a, e) {
    var t, r, n, o, l;
    if (e) o = ITEM_CLASSES[e], n = o.retrieve(a); else for (t = 0, r = ITEM_CLASS_LIST.length; t < r; t++) {
        if (o = ITEM_CLASS_LIST[t], l = o.type, typeof a == "string") {
            if (testExtensions(a, o)) {
                n = [a];
                break
            }
        } else if (n = o.retrieve(a), n && n.length && typeof n[0] == "string" && testExtensions(n[0], o)) break;
        n = undef$3, l = undef$3
    }
    if (n) return {type: e || l, items: n}
}

function retrieveAll(a, e) {
    var t, r, n = a.length, o = [];
    if (n && typeof a != "string") for (t = 0; t < n; t++) r = retrieve(a[t], e), r && (o = o.concat(r)); else r = retrieve(a, e), r && (o = o.concat(r));
    return o
}

function addChunk(a, e) {
    var t, r, n, o, l, c = retrieveAll(a, e);
    for (t = 0, n = c.length; t < n; t++) for (l = c[t], r = 0, o = l.items.length; r < o; r++) this.add(l.items[r], {type: l.type});
    return c
}

function setCrossOrigin(a, e) {
    this.crossOriginMap[a] = e
}

function add(a, e) {
    var t = addedItems[a];
    return t || (t = this._createItem(a, e && e.type ? e.type : retrieve(a).type, e)), e && e.onLoad && t.onLoaded.addOnce(e.onLoad), this.itemUrls[a] || (this.itemUrls[a] = t, this.itemList.push(t), this.totalWeight += t.weight), t
}

function load$7(a, e) {
    var t = addedItems[a];
    return t || (t = this._createItem(a, e && e.type ? e.type : retrieve(a).type, e)), e && e.onLoad && t.onLoaded.addOnce(e.onLoad), loadedItems[a] ? t.dispatch() : t.isStartLoaded || t.load(), t
}

function _getLoadedWeight(a) {
    for (var e = 0, t = 0, r = a.length; t < r; t++) e += a[t].loadedWeight;
    return e
}

function _removeItemCache(a) {
    var e = a.url;
    a.content = undef$3, addedItems[e] = undef$3, loadedItems[e] = undef$3
}

function _onItemLoad(a, e, t) {
    if (this.loadedWeight = _getLoadedWeight(e), !t) {
        for (var r = this.activeItems, n = r.length; n--;) if (r[n] === a) {
            r.splice(n, 1);
            break
        }
    }
    var o = this.loadingSignal;
    this.loadedWeight === this.totalWeight ? (this.isLoading = !1, this.loadedWeight = 0, this.totalWeight = 0, this.loadingSignal = new MinSignal$1, this._onLoading(a, e, o, 1, 1), a && a.noCache && _removeItemCache(a)) : (this._onLoading(a, e, o, 1, this.loadedWeight / this.totalWeight), a && a.noCache && _removeItemCache(a), t || this.loadNext())
}

function _onLoading$1(a, e, t, r, n) {
    a && !a.isLoaded && a.getCombinedPercent(r) === 1 || (n === undef$3 && (this.loadedWeight = _getLoadedWeight(e), n = this.loadedWeight / this.totalWeight), t = t || this.loadingSignal, t.dispatch(n, a))
}

function loadNext() {
    if (this.queue.length && this.activeItems.length < this.maxActiveItems) {
        var a = this.queue.shift();
        this.activeItems.push(a), this.loadNext(), a.load()
    }
}

function start$1(a) {
    a && this.loadingSignal.add(a)
    this.isLoading = !0;
    var e = this.itemList.length;
    if (e) {
        var t = this.itemList.splice(0, this.itemList.length), r;
        for (var n in this.itemUrls) delete this.itemUrls[n];
        for (var o = 0; o < e; o++) {
            r = t[o];
            var l = !!loadedItems[r.url];
            r.onLoaded.addOnce(_onItemLoad, this, -1024, r, t, l), r.hasLoading && r.loadingSignal.add(_onLoading$1, this, -1024, r, t, undef$3), l ? r.dispatch(_onItemLoad) : r.isStartLoaded || this.queue.push(r)
        }
        this.queue.length && this.loadNext()
    } else {
        _onItemLoad.call(this, undef$3, this.itemList)
    }
}


function _createItem(a, e, t) {
    if (t = t || {}, !t.crossOrigin) {
        for (var r in this.crossOriginMap) if (a.indexOf(r) === 0) {
            t.crossOrigin = this.crossOriginMap[r];
            break
        }
    }
    return new ITEM_CLASSES[e](a, t)
}

function register(a) {
    ITEM_CLASSES[a.type] || (ITEM_CLASS_LIST.push(a), ITEM_CLASSES[a.type] = a)
}

function create() {
    return new QuickLoader
}

function check() {
    var a = [], e = [];
    for (var t in addedItems) a.push(t), loadedItems[t] || e.push(addedItems[t]);
    console.log({added: a, notLoaded: e})
}

let _p$9 = QuickLoader.prototype;
_p$9.addChunk = addChunk;
_p$9.setCrossOrigin = setCrossOrigin;
_p$9.add = add;
_p$9.load = load$7;
_p$9.start = start$1;
_p$9.loadNext = loadNext;
_p$9._createItem = _createItem;
_p$9._onLoading = _onLoading$1;
_p$9.VERSION = "0.1.17";
_p$9.register = register;
_p$9.retrieveAll = retrieveAll;
_p$9.retrieve = retrieve;
_p$9.testExtensions = testExtensions;
_p$9.create = create;
_p$9.check = check;
let addedItems = _p$9.addedItems = {}
let loadedItems = _p$9.loadedItems = {}
let ITEM_CLASS_LIST = _p$9.ITEM_CLASS_LIST = []
let ITEM_CLASSES = _p$9.ITEM_CLASSES = {};

let quickLoader$b = {exports: {}};
quickLoader$b.exports = create();
let quickLoaderExports = quickLoader$b.exports
let quickLoader = quickLoaderExports;
let quickLoader$1 = getDefaultExportFromCjs(quickLoader);
let MinSignal = minSignalExports
let quickLoader$a = quickLoaderExports

function AbstractItem$6(a, e) {
    if (a) {
        this.url = a, this.loadedWeight = 0, this.weight = 1, this.postPercent = 0;
        for (var t in e) this[t] = e[t];
        this.type || (this.type = this.constructor.type), this.hasLoading && (this.loadingSignal = new MinSignal, this.loadingSignal.add(_onLoading, this), this.onLoading && this.loadingSignal.add(this.onLoading)), this.onPost ? (this.onPostLoadingSignal = new MinSignal, this.onPostLoadingSignal.add(this._onPostLoading, this), this.postWeightRatio = this.postWeightRatio || .1) : this.postWeightRatio = 0;
        var r = this;
        this.boundOnLoad = function () {
            r._onLoad()
        }, this.onLoaded = new MinSignal, quickLoader$a.addedItems[a] = this
    }
}

function load$6() {
    this.isStartLoaded = !0
}

function _onLoad$6() {
    this.onPost ? this.onPost.call(this, this.content, this.onPostLoadingSignal) : this._onLoadComplete()
}

function _onLoadComplete() {
    this.isLoaded = !0, this.loadedWeight = this.weight, quickLoader$a.loadedItems[this.url] = this, this.onLoaded.dispatch(this.content)
}

function _onLoading(a) {
    this.loadedWeight = this.weight * this.getCombinedPercent(a)
}

function _onPostLoading(a) {
    this.postPercent = a, this.hasLoading && this.loadingSignal.dispatch(1), a === 1 && this._onLoadComplete()
}

function getCombinedPercent(a) {
    return a * (1 - this.postWeightRatio) + this.postWeightRatio * this.postPercent
}

function dispatch() {
    this.hasLoading && this.loadingSignal.remove(), this.onLoaded.dispatch(this.content)
}

function load$1() {
    var a = this;
    this.loadFunc(this.url, function (e) {
        a.content = e, _super$1._onLoad.call(a)
    }, this.loadingSignal)
}

let _p$8 = AbstractItem$6.prototype;
_p$8.load = load$6;
_p$8._onLoad = _onLoad$6;
_p$8._onLoading = _onLoading;
_p$8._onPostLoading = _onPostLoading;
_p$8._onLoadComplete = _onLoadComplete;
_p$8.getCombinedPercent = getCombinedPercent;
_p$8.dispatch = dispatch;
AbstractItem$6.extensions = [];
AbstractItem$6.retrieve = function () {
    return !1
};
let AbstractItem_1 = AbstractItem$6
let AbstractItem$1 = AbstractItem_1
let quickLoader$3 = quickLoaderExports

let _super$1 = AbstractItem$1.prototype
let _p$1 = AnyItem$3.prototype = new AbstractItem$1;
_p$1.constructor = AnyItem$3;
_p$1.load = load$1;

function AnyItem$3(a, e) {
    a && (_super$1.constructor.call(this, a, e), !this.loadFunc && console && console[console.error || console.log]("require loadFunc in the config object."))
}

AnyItem$3.type = "any";
AnyItem$3.extensions = [];
AnyItem$3.retrieve = function () {
    return !1
};
quickLoader$3.register(AnyItem$3);

class FontItem extends AnyItem$3 {
    constructor(e, t) {
        FontItem.dom || FontItem.initDom(), t.loadFunc = () => {
        }, t.hasLoading = t.hasLoading === void 0 ? !0 : t.hasLoading, t.refText = "refing something...", t.refFontSize = t.refFontSize || 120, t.refFont = "Helvetica, Arial, FreeSans, Garuda, sans-serif", t.interval = t.interval || 20, t.refTextWidth = 0, super(e, t), this.loadFunc = this._loadFunc.bind(this)
    }

    static dom;

    static initDom() {
        let e = document.createElement("dom");
        e.style.position = "fixed", e.style.left = e.style.top = 0, e.style.visibility = "hidden", document.body.appendChild(e), FontItem.dom = e
    }

    _loadFunc(e, t, r) {
        let n = e.split(","), o = [];
        for (let g = 0; g < n.length; g++) o.push(n[g].trim());
        n = this.refFont.split(":");
        let l = n[0], c = n[1] || "normal", u = n[2] || "normal", f, p = o.length;
        f = setInterval(() => {
            n = o[0].split(":"), l = n[0], c = n[1] || "normal", u = n[2] || "normal";
            let g = this._getTextWidth(l, c, u, this.refFont), v = this._getTextWidth(this.refFont, c, u, this.refFont);
            g !== v && (o.shift(), r.dispatch((p - o.length) / p), o.length === 0 && (clearInterval(f), t()))
        }, this.interval)
    }

    _getTextWidth = (e, t, r, n) => {
        let o = FontItem.dom;
        return o.style.fontFamily = '"' + e + '"' + (n ? ", " + n : ""), o.style.fontWeight = t, o.style.fontStyle = r, o.innerHTML = this.refText, o.getBoundingClientRect().width
    };

    _onLoaderLoad(e, t) {
        this.content = t, e(t)
    }

    _onLoaderLoading(e, t) {
        e.dispatch(t.loaded / t.total)
    }
}

FontItem.type = "font";
FontItem.extensions = [];
quickLoader$3.register(FontItem);


let AbstractItem$4 = AbstractItem_1
let quickLoader$8 = quickLoaderExports
let undef$2;
let IS_SUPPORT_XML_HTTP_REQUEST = !!window.XMLHttpRequest;

let _super$6 = AbstractItem$4.prototype;

function load$4() {
    _super$6.load.apply(this, arguments);
    var a = this, e;
    IS_SUPPORT_XML_HTTP_REQUEST ? e = this.xmlhttp = new XMLHttpRequest : e = this.xmlhttp = new ActiveXObject("Microsoft.XMLHTTP"), this.hasLoading && (e.onprogress = function (t) {
        a._onXmlHttpProgress(t)
    }), e.onreadystatechange = function () {
        a._onXmlHttpChange()
    }, e.open(this.method, this.url, !0), this.xmlhttp.responseType = this.responseType, IS_SUPPORT_XML_HTTP_REQUEST ? e.send(null) : e.send()
}

function _onXmlHttpChange() {
    this.xmlhttp.readyState === 4 && this.xmlhttp.status === 200 && this._onLoad(this.xmlhttp)
}

function _onXmlHttpProgress(a) {
    this.loadingSignal.dispatch(a.loaded / a.total)
}

function _onLoad$5() {
    this.content || (this.content = this.xmlhttp.response), this.xmlhttp = undef$2, _super$6._onLoad.call(this)
}


let _p$6 = XHRItem$2.prototype = new AbstractItem$4;
_p$6.constructor = XHRItem$2;
_p$6.load = load$4;
_p$6._onXmlHttpChange = _onXmlHttpChange;
_p$6._onXmlHttpProgress = _onXmlHttpProgress;
_p$6._onLoad = _onLoad$5;

function XHRItem$2(a) {
    a && (_super$6.constructor.apply(this, arguments), this.responseType = this.responseType || "", this.method = this.method || "GET")
}

let XHRItem_1 = XHRItem$2;
XHRItem$2.type = "xhr";
XHRItem$2.extensions = [];
XHRItem$2.retrieve = function () {
    return !1
};
quickLoader$8.register(XHRItem$2);

class BufItem extends XHRItem$2 {
    constructor(e, t) {
        super(e, {...t, responseType: "arraybuffer"})
    }

    retrieve() {
        return !1
    }

    _onLoad() {
        if (!this.content) {
            const e = this.xmlhttp.response;
            let t = new Uint32Array(e, 0, 1)[0],
                r = JSON.parse(String.fromCharCode.apply(null, new Uint8Array(e, 4, t))), n = r.vertexCount,
                o = r.indexCount, l = 4 + t, c = new THREE.BufferGeometry, u = r.attributes, f = !1, p = {};
            for (let _ = 0, w = u.length; _ < w; _++) {
                let S = u[_], b = S.id, C = b === "indices" ? o : n, R = S.componentSize, T = window[S.storageType],
                    M = new T(e, l, C * R), P = T.BYTES_PER_ELEMENT, I;
                if (S.needsPack) {
                    let V = S.packedComponents, A = V.length, O = S.storageType.indexOf("Int") === 0, W = 1 << P * 8,
                        Q = O ? W * .5 : 0, H = 1 / W;
                    I = new Float32Array(C * R);
                    for (let B = 0, D = 0; B < C; B++) for (let q = 0; q < A; q++) {
                        let k = V[q];
                        I[D] = (M[D] + Q) * H * k.delta + k.from, D++
                    }
                } else p[b] = l, I = M;
                b === "normal" && (f = !0), b === "indices" ? c.setIndex(new THREE.BufferAttribute(I, 1)) : c.setAttribute(b, new THREE.BufferAttribute(I, R)), l += C * R * P
            }
            let g = r.meshType, v = [];
            if (r.sceneData) {
                let _ = r.sceneData, w = new THREE.Object3D, S = [],
                    b = g === "Mesh" ? 3 : g === "LineSegments" ? 2 : 1;
                for (let C = 0, R = _.length; C < R; C++) {
                    let T = _[C], M;
                    if (T.vertexCount == 0) M = new THREE.Object3D; else {
                        let P = new THREE.BufferGeometry, I = c.index, V = I.array, A = V.constructor,
                            O = A.BYTES_PER_ELEMENT;
                        P.setIndex(new THREE.BufferAttribute(new V.constructor(V.buffer, T.faceIndex * I.itemSize * O * b + (p.indices || 0), T.faceCount * I.itemSize * b), I.itemSize));
                        for (let W = 0, Q = P.index.array.length; W < Q; W++) P.index.array[W] -= T.vertexIndex;
                        for (let W in c.attributes) I = c.attributes[W], V = I.array, A = V.constructor, O = A.BYTES_PER_ELEMENT, P.setAttribute(W, new THREE.BufferAttribute(new V.constructor(V.buffer, T.vertexIndex * I.itemSize * O + (p[W] || 0), T.vertexCount * I.itemSize), I.itemSize));
                        g === "Mesh" ? M = new THREE.Mesh(P, new THREE.MeshNormalMaterial({flatShading: !f})) : g === "LineSegments" ? M = new THREE.LineSegments(P, new THREE.LineBasicMaterial) : M = new THREE.Points(P, new THREE.PointsMaterial({
                            sizeAttenuation: !1,
                            size: 2
                        })), S.push(M)
                    }
                    T.parentIndex > -1 ? v[T.parentIndex].add(M) : w.add(M), M.position.fromArray(T.position), M.quaternion.fromArray(T.quaternion), M.scale.fromArray(T.scale), M.name = T.name, M.userData.material = T.material, v[C] = M
                }
                c.userData.meshList = S, c.userData.sceneObject = w
            }
            this.content = c
        }
        this.xmlhttp = void 0, super._onLoad(this)
    }
}

BufItem.type = "buf";
BufItem.extensions = ["buf"];
BufItem.responseType = "arraybuffer";
quickLoader$8.register(BufItem);


var durl = function (a) {
    return URL.createObjectURL(new Blob([a], {type: "text/javascript"}))
};
try {
    URL.revokeObjectURL(durl(""))
} catch (a) {
    durl = function (e) {
        return "data:application/javascript;charset=UTF-8," + encodeURI(e)
    }
}
var u8 = Uint8Array
var u16 = Uint16Array
var u32 = Uint32Array
var fleb = new u8([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 0, 0, 0])
var fdeb = new u8([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 0, 0])
var clim = new u8([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15])
var freb = function (a, e) {
    for (var t = new u16(31), r = 0; r < 31; ++r) t[r] = e += 1 << a[r - 1];
    for (var n = new u32(t[30]), r = 1; r < 30; ++r) for (var o = t[r]; o < t[r + 1]; ++o) n[o] = o - t[r] << 5 | r;
    return [t, n]
}
var _a = freb(fleb, 2)
var fl = _a[0]
var revfl = _a[1];
fl[28] = 258
revfl[258] = 28;
var _b = freb(fdeb, 0)
var fd = _b[0]
var rev = new u16(32768);
for (var i = 0; i < 32768; ++i) {
    var x = (i & 43690) >>> 1 | (i & 21845) << 1;
    x = (x & 52428) >>> 2 | (x & 13107) << 2, x = (x & 61680) >>> 4 | (x & 3855) << 4, rev[i] = ((x & 65280) >>> 8 | (x & 255) << 8) >>> 1
}
var hMap = function (a, e, t) {
    for (var r = a.length, n = 0, o = new u16(e); n < r; ++n) ++o[a[n] - 1];
    var l = new u16(e);
    for (n = 0; n < e; ++n) l[n] = l[n - 1] + o[n - 1] << 1;
    var c;
    if (t) {
        c = new u16(1 << e);
        var u = 15 - e;
        for (n = 0; n < r; ++n) if (a[n]) for (var f = n << 4 | a[n], p = e - a[n], g = l[a[n] - 1]++ << p, v = g | (1 << p) - 1; g <= v; ++g) c[rev[g] >>> u] = f
    } else for (c = new u16(r), n = 0; n < r; ++n) a[n] && (c[n] = rev[l[a[n] - 1]++] >>> 15 - a[n]);
    return c
}
var flt = new u8(288);
for (var i = 0; i < 144; ++i) flt[i] = 8;
for (var i = 144; i < 256; ++i) flt[i] = 9;
for (var i = 256; i < 280; ++i) flt[i] = 7;
for (var i = 280; i < 288; ++i) flt[i] = 8;
var fdt = new u8(32);
for (var i = 0; i < 32; ++i) fdt[i] = 5;
var flrm = hMap(flt, 9, 1), fdrm = hMap(fdt, 5, 1), max = function (a) {
    for (var e = a[0], t = 1; t < a.length; ++t) a[t] > e && (e = a[t]);
    return e
}
var bits = function (a, e, t) {
    var r = e / 8 | 0;
    return (a[r] | a[r + 1] << 8) >> (e & 7) & t
}
var bits16 = function (a, e) {
    var t = e / 8 | 0;
    return (a[t] | a[t + 1] << 8 | a[t + 2] << 16) >> (e & 7)
}
var shft = function (a) {
    return (a / 8 | 0) + (a & 7 && 1)
}
var slc = function (a, e, t) {
    (e == null || e < 0) && (e = 0), (t == null || t > a.length) && (t = a.length);
    var r = new (a instanceof u16 ? u16 : a instanceof u32 ? u32 : u8)(t - e);
    return r.set(a.subarray(e, t)), r
}
var inflt = function (a, e, t) {
    var r = a.length;
    if (!r || t && !t.l && r < 5) return e || new u8(0);
    var n = !e || t, o = !t || t.i;
    t || (t = {}), e || (e = new u8(r * 3));
    var l = function (L) {
        var N = e.length;
        if (L > N) {
            var oe = new u8(Math.max(N * 2, L));
            oe.set(e), e = oe
        }
    }, c = t.f || 0, u = t.p || 0, f = t.b || 0, p = t.l, g = t.d, v = t.m, _ = t.n, w = r * 8;
    do {
        if (!p) {
            t.f = c = bits(a, u, 1);
            var S = bits(a, u + 1, 3);
            if (u += 3, S) if (S == 1) p = flrm, g = fdrm, v = 9, _ = 5; else if (S == 2) {
                var T = bits(a, u, 31) + 257, M = bits(a, u + 10, 15) + 4, P = T + bits(a, u + 5, 31) + 1;
                u += 14;
                for (var I = new u8(P), V = new u8(19), A = 0; A < M; ++A) V[clim[A]] = bits(a, u + A * 3, 7);
                u += M * 3;
                for (var O = max(V), W = (1 << O) - 1, Q = hMap(V, O, 1), A = 0; A < P;) {
                    var H = Q[bits(a, u, W)];
                    u += H & 15;
                    var b = H >>> 4;
                    if (b < 16) I[A++] = b; else {
                        var B = 0, D = 0;
                        for (b == 16 ? (D = 3 + bits(a, u, 3), u += 2, B = I[A - 1]) : b == 17 ? (D = 3 + bits(a, u, 7), u += 3) : b == 18 && (D = 11 + bits(a, u, 127), u += 7); D--;) I[A++] = B
                    }
                }
                var q = I.subarray(0, T), k = I.subarray(T);
                v = max(q), _ = max(k), p = hMap(q, v, 1), g = hMap(k, _, 1)
            } else throw"invalid block type"; else {
                var b = shft(u) + 4, C = a[b - 4] | a[b - 3] << 8, R = b + C;
                if (R > r) {
                    if (o) throw"unexpected EOF";
                    break
                }
                n && l(f + C), e.set(a.subarray(b, R), f), t.b = f += C, t.p = u = R * 8;
                continue
            }
            if (u > w) {
                if (o) throw"unexpected EOF";
                break
            }
        }
        n && l(f + 131072);
        for (var J = (1 << v) - 1, U = (1 << _) - 1, ce = u; ; ce = u) {
            var B = p[bits16(a, u) & J], ee = B >>> 4;
            if (u += B & 15, u > w) {
                if (o) throw"unexpected EOF";
                break
            }
            if (!B) throw"invalid length/literal";
            if (ee < 256) e[f++] = ee; else if (ee == 256) {
                ce = u, p = null;
                break
            } else {
                var ne = ee - 254;
                if (ee > 264) {
                    var A = ee - 257, ae = fleb[A];
                    ne = bits(a, u, (1 << ae) - 1) + fl[A], u += ae
                }
                var ve = g[bits16(a, u) & U], Y = ve >>> 4;
                if (!ve) throw"invalid distance";
                u += ve & 15;
                var k = fd[Y];
                if (Y > 3) {
                    var ae = fdeb[Y];
                    k += bits16(a, u) & (1 << ae) - 1, u += ae
                }
                if (u > w) {
                    if (o) throw"unexpected EOF";
                    break
                }
                n && l(f + 131072);
                for (var $ = f + ne; f < $; f += 4) e[f] = e[f - k], e[f + 1] = e[f + 1 - k], e[f + 2] = e[f + 2 - k], e[f + 3] = e[f + 3 - k];
                f = $
            }
        }
        t.l = p, t.p = ce, t.b = f, p && (c = 1, t.m = v, t.d = g, t.n = _)
    } while (!c);
    return f == e.length ? e : slc(e, 0, f)
}
var et = new u8(0), zlv = function (a) {
    if ((a[0] & 15) != 8 || a[0] >>> 4 > 7 || (a[0] << 8 | a[1]) % 31) throw"invalid zlib data";
    if (a[1] & 32) throw"invalid zlib data: preset dictionaries not supported"
};

function unzlibSync(a, e) {
    return inflt((zlv(a), a.subarray(2, -4)), e)
}

var td = typeof TextDecoder < "u" && new TextDecoder, tds = 0;
try {
    td.decode(et, {stream: !0}), tds = 1
} catch (a) {
}

class EXRLoader extends THREE.DataTextureLoader {
    constructor(e) {
        super(e), this.type = THREE.HalfFloatType
    }

    parse(e) {
        const O = Math.pow(2.7182818, 2.2);

        function W(E, F) {
            let X = 0;
            for (let me = 0; me < 65536; ++me) (me == 0 || E[me >> 3] & 1 << (me & 7)) && (F[X++] = me);
            const ie = X - 1;
            for (; X < 65536;) F[X++] = 0;
            return ie
        }

        function Q(E) {
            for (let F = 0; F < 16384; F++) E[F] = {}, E[F].len = 0, E[F].lit = 0, E[F].p = null
        }

        const H = {l: 0, c: 0, lc: 0};

        function B(E, F, X, ie, me) {
            for (; X < E;) F = F << 8 | Xe(ie, me), X += 8;
            X -= E, H.l = F >> X & (1 << E) - 1, H.c = F, H.lc = X
        }

        const D = new Array(59);

        function q(E) {
            for (let X = 0; X <= 58; ++X) D[X] = 0;
            for (let X = 0; X < 65537; ++X) D[E[X]] += 1;
            let F = 0;
            for (let X = 58; X > 0; --X) {
                const ie = F + D[X] >> 1;
                D[X] = F, F = ie
            }
            for (let X = 0; X < 65537; ++X) {
                const ie = E[X];
                ie > 0 && (E[X] = ie | D[ie]++ << 6)
            }
        }

        function k(E, F, X, ie, me, ue) {
            const ye = F;
            let Pe = 0, De = 0;
            for (; ie <= me; ie++) {
                if (ye.value - F.value > X) return !1;
                B(6, Pe, De, E, ye);
                const Re = H.l;
                if (Pe = H.c, De = H.lc, ue[ie] = Re, Re == 63) {
                    if (ye.value - F.value > X) throw new Error("Something wrong with hufUnpackEncTable");
                    B(8, Pe, De, E, ye);
                    let Fe = H.l + 6;
                    if (Pe = H.c, De = H.lc, ie + Fe > me + 1) throw new Error("Something wrong with hufUnpackEncTable");
                    for (; Fe--;) ue[ie++] = 0;
                    ie--
                } else if (Re >= 59) {
                    let Fe = Re - 59 + 2;
                    if (ie + Fe > me + 1) throw new Error("Something wrong with hufUnpackEncTable");
                    for (; Fe--;) ue[ie++] = 0;
                    ie--
                }
            }
            q(ue)
        }

        function J(E) {
            return E & 63
        }

        function U(E) {
            return E >> 6
        }

        function ce(E, F, X, ie) {
            for (; F <= X; F++) {
                const me = U(E[F]), ue = J(E[F]);
                if (me >> ue) throw new Error("Invalid table entry");
                if (ue > 14) {
                    const ye = ie[me >> ue - 14];
                    if (ye.len) throw new Error("Invalid table entry");
                    if (ye.lit++, ye.p) {
                        const Pe = ye.p;
                        ye.p = new Array(ye.lit);
                        for (let De = 0; De < ye.lit - 1; ++De) ye.p[De] = Pe[De]
                    } else ye.p = new Array(1);
                    ye.p[ye.lit - 1] = F
                } else if (ue) {
                    let ye = 0;
                    for (let Pe = 1 << 14 - ue; Pe > 0; Pe--) {
                        const De = ie[(me << 14 - ue) + ye];
                        if (De.len || De.p) throw new Error("Invalid table entry");
                        De.len = ue, De.lit = F, ye++
                    }
                }
            }
            return !0
        }

        const ee = {c: 0, lc: 0};

        function ne(E, F, X, ie) {
            E = E << 8 | Xe(X, ie), F += 8, ee.c = E, ee.lc = F
        }

        const ae = {c: 0, lc: 0};

        function ve(E, F, X, ie, me, ue, ye, Pe, De) {
            if (E == F) {
                ie < 8 && (ne(X, ie, me, ue), X = ee.c, ie = ee.lc), ie -= 8;
                let Re = X >> ie;
                if (Re = new Uint8Array([Re])[0], Pe.value + Re > De) return !1;
                const Fe = ye[Pe.value - 1];
                for (; Re-- > 0;) ye[Pe.value++] = Fe
            } else if (Pe.value < De) ye[Pe.value++] = E; else return !1;
            ae.c = X, ae.lc = ie
        }

        function Y(E) {
            return E & 65535
        }

        function $(E) {
            const F = Y(E);
            return F > 32767 ? F - 65536 : F
        }

        const L = {a: 0, b: 0};

        function N(E, F) {
            const X = $(E), me = $(F), ue = X + (me & 1) + (me >> 1), ye = ue, Pe = ue - me;
            L.a = ye, L.b = Pe
        }

        function oe(E, F) {
            const X = Y(E), ie = Y(F), me = X - (ie >> 1) & 65535, ue = ie + me - 32768 & 65535;
            L.a = ue, L.b = me
        }

        function pe(E, F, X, ie, me, ue, ye) {
            const Pe = ye < 16384, De = X > me ? me : X;
            let Re = 1, Fe, Be;
            for (; Re <= De;) Re <<= 1;
            for (Re >>= 1, Fe = Re, Re >>= 1; Re >= 1;) {
                Be = 0;
                const Le = Be + ue * (me - Fe), Je = ue * Re, je = ue * Fe, $e = ie * Re, Ze = ie * Fe;
                let rt, ut, ot, ft;
                for (; Be <= Le; Be += je) {
                    let at = Be;
                    const it = Be + ie * (X - Fe);
                    for (; at <= it; at += Ze) {
                        const dt = at + $e, _t = at + Je, mt = _t + $e;
                        Pe ? (N(E[at + F], E[_t + F]), rt = L.a, ot = L.b, N(E[dt + F], E[mt + F]), ut = L.a, ft = L.b, N(rt, ut), E[at + F] = L.a, E[dt + F] = L.b, N(ot, ft), E[_t + F] = L.a, E[mt + F] = L.b) : (oe(E[at + F], E[_t + F]), rt = L.a, ot = L.b, oe(E[dt + F], E[mt + F]), ut = L.a, ft = L.b, oe(rt, ut), E[at + F] = L.a, E[dt + F] = L.b, oe(ot, ft), E[_t + F] = L.a, E[mt + F] = L.b)
                    }
                    if (X & Re) {
                        const dt = at + Je;
                        Pe ? N(E[at + F], E[dt + F]) : oe(E[at + F], E[dt + F]), rt = L.a, E[dt + F] = L.b, E[at + F] = rt
                    }
                }
                if (me & Re) {
                    let at = Be;
                    const it = Be + ie * (X - Fe);
                    for (; at <= it; at += Ze) {
                        const dt = at + $e;
                        Pe ? N(E[at + F], E[dt + F]) : oe(E[at + F], E[dt + F]), rt = L.a, E[dt + F] = L.b, E[at + F] = rt
                    }
                }
                Fe = Re, Re >>= 1
            }
            return Be
        }

        function K(E, F, X, ie, me, ue, ye, Pe, De) {
            let Re = 0, Fe = 0;
            const Be = ye, Le = Math.trunc(ie.value + (me + 7) / 8);
            for (; ie.value < Le;) for (ne(Re, Fe, X, ie), Re = ee.c, Fe = ee.lc; Fe >= 14;) {
                const je = Re >> Fe - 14 & 16383, $e = F[je];
                if ($e.len) Fe -= $e.len, ve($e.lit, ue, Re, Fe, X, ie, Pe, De, Be), Re = ae.c, Fe = ae.lc; else {
                    if (!$e.p) throw new Error("hufDecode issues");
                    let Ze;
                    for (Ze = 0; Ze < $e.lit; Ze++) {
                        const rt = J(E[$e.p[Ze]]);
                        for (; Fe < rt && ie.value < Le;) ne(Re, Fe, X, ie), Re = ee.c, Fe = ee.lc;
                        if (Fe >= rt && U(E[$e.p[Ze]]) == (Re >> Fe - rt & (1 << rt) - 1)) {
                            Fe -= rt, ve($e.p[Ze], ue, Re, Fe, X, ie, Pe, De, Be), Re = ae.c, Fe = ae.lc;
                            break
                        }
                    }
                    if (Ze == $e.lit) throw new Error("hufDecode issues")
                }
            }
            const Je = 8 - me & 7;
            for (Re >>= Je, Fe -= Je; Fe > 0;) {
                const je = F[Re << 14 - Fe & 16383];
                if (je.len) Fe -= je.len, ve(je.lit, ue, Re, Fe, X, ie, Pe, De, Be), Re = ae.c, Fe = ae.lc; else throw new Error("hufDecode issues")
            }
            return !0
        }

        function Se(E, F, X, ie, me, ue) {
            const ye = {value: 0}, Pe = X.value, De = Ge(F, X), Re = Ge(F, X);
            X.value += 4;
            const Fe = Ge(F, X);
            if (X.value += 4, De < 0 || De >= 65537 || Re < 0 || Re >= 65537) throw new Error("Something wrong with HUF_ENCSIZE");
            const Be = new Array(65537), Le = new Array(16384);
            Q(Le);
            const Je = ie - (X.value - Pe);
            if (k(E, X, Je, De, Re, Be), Fe > 8 * (ie - (X.value - Pe))) throw new Error("Something wrong with hufUncompress");
            ce(Be, De, Re, Le), K(Be, Le, E, X, Fe, Re, ue, me, ye)
        }

        function Ce(E, F, X) {
            for (let ie = 0; ie < X; ++ie) F[ie] = E[F[ie]]
        }

        function Te(E) {
            for (let F = 1; F < E.length; F++) {
                const X = E[F - 1] + E[F] - 128;
                E[F] = X
            }
        }

        function we(E, F) {
            let X = 0, ie = Math.floor((E.length + 1) / 2), me = 0;
            const ue = E.length - 1;
            for (; !(me > ue || (F[me++] = E[X++], me > ue));) F[me++] = E[ie++]
        }

        function Ae(E) {
            let F = E.byteLength;
            const X = new Array;
            let ie = 0;
            const me = new DataView(E);
            for (; F > 0;) {
                const ue = me.getInt8(ie++);
                if (ue < 0) {
                    const ye = -ue;
                    F -= ye + 1;
                    for (let Pe = 0; Pe < ye; Pe++) X.push(me.getUint8(ie++))
                } else {
                    const ye = ue;
                    F -= 2;
                    const Pe = me.getUint8(ie++);
                    for (let De = 0; De < ye + 1; De++) X.push(Pe)
                }
            }
            return X
        }

        function Ne(E, F, X, ie, me, ue) {
            let ye = new DataView(ue.buffer);
            const Pe = X[E.idx[0]].width, De = X[E.idx[0]].height, Re = 3, Fe = Math.floor(Pe / 8),
                Be = Math.ceil(Pe / 8), Le = Math.ceil(De / 8), Je = Pe - (Be - 1) * 8, je = De - (Le - 1) * 8,
                $e = {value: 0}, Ze = new Array(Re), rt = new Array(Re), ut = new Array(Re), ot = new Array(Re),
                ft = new Array(Re);
            for (let it = 0; it < Re; ++it) ft[it] = F[E.idx[it]], Ze[it] = it < 1 ? 0 : Ze[it - 1] + Be * Le, rt[it] = new Float32Array(64), ut[it] = new Uint16Array(64), ot[it] = new Uint16Array(Be * 64);
            for (let it = 0; it < Le; ++it) {
                let dt = 8;
                it == Le - 1 && (dt = je);
                let _t = 8;
                for (let lt = 0; lt < Be; ++lt) {
                    lt == Be - 1 && (_t = Je);
                    for (let ht = 0; ht < Re; ++ht) ut[ht].fill(0), ut[ht][0] = me[Ze[ht]++], Ue($e, ie, ut[ht]), le(ut[ht], rt[ht]), Z(rt[ht]);
                    He(rt);
                    for (let ht = 0; ht < Re; ++ht) Ke(rt[ht], ot[ht], lt * 64)
                }
                let mt = 0;
                for (let lt = 0; lt < Re; ++lt) {
                    const ht = X[E.idx[lt]].type;
                    for (let St = 8 * it; St < 8 * it + dt; ++St) {
                        mt = ft[lt][St];
                        for (let Tt = 0; Tt < Fe; ++Tt) {
                            const yt = Tt * 64 + (St & 7) * 8;
                            ye.setUint16(mt + 0 * 2 * ht, ot[lt][yt + 0], !0), ye.setUint16(mt + 1 * 2 * ht, ot[lt][yt + 1], !0), ye.setUint16(mt + 2 * 2 * ht, ot[lt][yt + 2], !0), ye.setUint16(mt + 3 * 2 * ht, ot[lt][yt + 3], !0), ye.setUint16(mt + 4 * 2 * ht, ot[lt][yt + 4], !0), ye.setUint16(mt + 5 * 2 * ht, ot[lt][yt + 5], !0), ye.setUint16(mt + 6 * 2 * ht, ot[lt][yt + 6], !0), ye.setUint16(mt + 7 * 2 * ht, ot[lt][yt + 7], !0), mt += 8 * 2 * ht
                        }
                    }
                    if (Fe != Be) for (let St = 8 * it; St < 8 * it + dt; ++St) {
                        const Tt = ft[lt][St] + 8 * Fe * 2 * ht, yt = Fe * 64 + (St & 7) * 8;
                        for (let Ct = 0; Ct < _t; ++Ct) ye.setUint16(Tt + Ct * 2 * ht, ot[lt][yt + Ct], !0)
                    }
                }
            }
            const at = new Uint16Array(Pe);
            ye = new DataView(ue.buffer);
            for (let it = 0; it < Re; ++it) {
                X[E.idx[it]].decoded = !0;
                const dt = X[E.idx[it]].type;
                if (X[it].type == 2) for (let _t = 0; _t < De; ++_t) {
                    const mt = ft[it][_t];
                    for (let lt = 0; lt < Pe; ++lt) at[lt] = ye.getUint16(mt + lt * 2 * dt, !0);
                    for (let lt = 0; lt < Pe; ++lt) ye.setFloat32(mt + lt * 2 * dt, re(at[lt]), !0)
                }
            }
        }

        function Ue(E, F, X) {
            let ie, me = 1;
            for (; me < 64;) ie = F[E.value], ie == 65280 ? me = 64 : ie >> 8 == 255 ? me += ie & 255 : (X[me] = ie, me++), E.value++
        }

        function le(E, F) {
            F[0] = re(E[0]), F[1] = re(E[1]), F[2] = re(E[5]), F[3] = re(E[6]), F[4] = re(E[14]), F[5] = re(E[15]), F[6] = re(E[27]), F[7] = re(E[28]), F[8] = re(E[2]), F[9] = re(E[4]), F[10] = re(E[7]), F[11] = re(E[13]), F[12] = re(E[16]), F[13] = re(E[26]), F[14] = re(E[29]), F[15] = re(E[42]), F[16] = re(E[3]), F[17] = re(E[8]), F[18] = re(E[12]), F[19] = re(E[17]), F[20] = re(E[25]), F[21] = re(E[30]), F[22] = re(E[41]), F[23] = re(E[43]), F[24] = re(E[9]), F[25] = re(E[11]), F[26] = re(E[18]), F[27] = re(E[24]), F[28] = re(E[31]), F[29] = re(E[40]), F[30] = re(E[44]), F[31] = re(E[53]), F[32] = re(E[10]), F[33] = re(E[19]), F[34] = re(E[23]), F[35] = re(E[32]), F[36] = re(E[39]), F[37] = re(E[45]), F[38] = re(E[52]), F[39] = re(E[54]), F[40] = re(E[20]), F[41] = re(E[22]), F[42] = re(E[33]), F[43] = re(E[38]), F[44] = re(E[46]), F[45] = re(E[51]), F[46] = re(E[55]), F[47] = re(E[60]), F[48] = re(E[21]), F[49] = re(E[34]), F[50] = re(E[37]), F[51] = re(E[47]), F[52] = re(E[50]), F[53] = re(E[56]), F[54] = re(E[59]), F[55] = re(E[61]), F[56] = re(E[35]), F[57] = re(E[36]), F[58] = re(E[48]), F[59] = re(E[49]), F[60] = re(E[57]), F[61] = re(E[58]), F[62] = re(E[62]), F[63] = re(E[63])
        }

        function Z(E) {
            const F = .5 * Math.cos(.7853975), X = .5 * Math.cos(3.14159 / 16), ie = .5 * Math.cos(3.14159 / 8),
                me = .5 * Math.cos(3 * 3.14159 / 16), ue = .5 * Math.cos(5 * 3.14159 / 16),
                ye = .5 * Math.cos(3 * 3.14159 / 8), Pe = .5 * Math.cos(7 * 3.14159 / 16), De = new Array(4),
                Re = new Array(4), Fe = new Array(4), Be = new Array(4);
            for (let Le = 0; Le < 8; ++Le) {
                const Je = Le * 8;
                De[0] = ie * E[Je + 2], De[1] = ye * E[Je + 2], De[2] = ie * E[Je + 6], De[3] = ye * E[Je + 6], Re[0] = X * E[Je + 1] + me * E[Je + 3] + ue * E[Je + 5] + Pe * E[Je + 7], Re[1] = me * E[Je + 1] - Pe * E[Je + 3] - X * E[Je + 5] - ue * E[Je + 7], Re[2] = ue * E[Je + 1] - X * E[Je + 3] + Pe * E[Je + 5] + me * E[Je + 7], Re[3] = Pe * E[Je + 1] - ue * E[Je + 3] + me * E[Je + 5] - X * E[Je + 7], Fe[0] = F * (E[Je + 0] + E[Je + 4]), Fe[3] = F * (E[Je + 0] - E[Je + 4]), Fe[1] = De[0] + De[3], Fe[2] = De[1] - De[2], Be[0] = Fe[0] + Fe[1], Be[1] = Fe[3] + Fe[2], Be[2] = Fe[3] - Fe[2], Be[3] = Fe[0] - Fe[1], E[Je + 0] = Be[0] + Re[0], E[Je + 1] = Be[1] + Re[1], E[Je + 2] = Be[2] + Re[2], E[Je + 3] = Be[3] + Re[3], E[Je + 4] = Be[3] - Re[3], E[Je + 5] = Be[2] - Re[2], E[Je + 6] = Be[1] - Re[1], E[Je + 7] = Be[0] - Re[0]
            }
            for (let Le = 0; Le < 8; ++Le) De[0] = ie * E[16 + Le], De[1] = ye * E[16 + Le], De[2] = ie * E[48 + Le], De[3] = ye * E[48 + Le], Re[0] = X * E[8 + Le] + me * E[24 + Le] + ue * E[40 + Le] + Pe * E[56 + Le], Re[1] = me * E[8 + Le] - Pe * E[24 + Le] - X * E[40 + Le] - ue * E[56 + Le], Re[2] = ue * E[8 + Le] - X * E[24 + Le] + Pe * E[40 + Le] + me * E[56 + Le], Re[3] = Pe * E[8 + Le] - ue * E[24 + Le] + me * E[40 + Le] - X * E[56 + Le], Fe[0] = F * (E[Le] + E[32 + Le]), Fe[3] = F * (E[Le] - E[32 + Le]), Fe[1] = De[0] + De[3], Fe[2] = De[1] - De[2], Be[0] = Fe[0] + Fe[1], Be[1] = Fe[3] + Fe[2], Be[2] = Fe[3] - Fe[2], Be[3] = Fe[0] - Fe[1], E[0 + Le] = Be[0] + Re[0], E[8 + Le] = Be[1] + Re[1], E[16 + Le] = Be[2] + Re[2], E[24 + Le] = Be[3] + Re[3], E[32 + Le] = Be[3] - Re[3], E[40 + Le] = Be[2] - Re[2], E[48 + Le] = Be[1] - Re[1], E[56 + Le] = Be[0] - Re[0]
        }

        function He(E) {
            for (let F = 0; F < 64; ++F) {
                const X = E[0][F], ie = E[1][F], me = E[2][F];
                E[0][F] = X + 1.5747 * me, E[1][F] = X - .1873 * ie - .4682 * me, E[2][F] = X + 1.8556 * ie
            }
        }

        function Ke(E, F, X) {
            for (let ie = 0; ie < 64; ++ie) F[X + ie] = THREE.DataUtils.toHalfFloat(j(E[ie]))
        }

        function j(E) {
            return E <= 1 ? Math.sign(E) * Math.pow(Math.abs(E), 2.2) : Math.sign(E) * Math.pow(O, Math.abs(E) - 1)
        }

        function z(E) {
            return new DataView(E.array.buffer, E.offset.value, E.size)
        }

        function ge(E) {
            const F = E.viewer.buffer.slice(E.offset.value, E.offset.value + E.size), X = new Uint8Array(Ae(F)),
                ie = new Uint8Array(X.length);
            return Te(X), we(X, ie), new DataView(ie.buffer)
        }

        function Ee(E) {
            const F = E.array.slice(E.offset.value, E.offset.value + E.size), X = unzlibSync(F),
                ie = new Uint8Array(X.length);
            return Te(X), we(X, ie), new DataView(ie.buffer)
        }

        function Oe(E) {
            const F = E.viewer, X = {value: E.offset.value},
                ie = new Uint16Array(E.width * E.scanlineBlockSize * (E.channels * E.type)), me = new Uint8Array(8192);
            let ue = 0;
            const ye = new Array(E.channels);
            for (let je = 0; je < E.channels; je++) ye[je] = {}, ye[je].start = ue, ye[je].end = ye[je].start, ye[je].nx = E.width, ye[je].ny = E.lines, ye[je].size = E.type, ue += ye[je].nx * ye[je].ny * ye[je].size;
            const Pe = Ie(F, X), De = Ie(F, X);
            if (De >= 8192) throw new Error("Something is wrong with PIZ_COMPRESSION BITMAP_SIZE");
            if (Pe <= De) for (let je = 0; je < De - Pe + 1; je++) me[je + Pe] = Qe(F, X);
            const Re = new Uint16Array(65536), Fe = W(me, Re), Be = Ge(F, X);
            Se(E.array, F, X, Be, ie, ue);
            for (let je = 0; je < E.channels; ++je) {
                const $e = ye[je];
                for (let Ze = 0; Ze < ye[je].size; ++Ze) pe(ie, $e.start + Ze, $e.nx, $e.size, $e.ny, $e.nx * $e.size, Fe)
            }
            Ce(Re, ie, ue);
            let Le = 0;
            const Je = new Uint8Array(ie.buffer.byteLength);
            for (let je = 0; je < E.lines; je++) for (let $e = 0; $e < E.channels; $e++) {
                const Ze = ye[$e], rt = Ze.nx * Ze.size, ut = new Uint8Array(ie.buffer, Ze.end * 2, rt * 2);
                Je.set(ut, Le), Le += rt * 2, Ze.end += rt
            }
            return new DataView(Je.buffer)
        }

        function ze(E) {
            const F = E.array.slice(E.offset.value, E.offset.value + E.size), X = unzlibSync(F),
                ie = E.lines * E.channels * E.width, me = E.type == 1 ? new Uint16Array(ie) : new Uint32Array(ie);
            let ue = 0, ye = 0;
            const Pe = new Array(4);
            for (let De = 0; De < E.lines; De++) for (let Re = 0; Re < E.channels; Re++) {
                let Fe = 0;
                switch (E.type) {
                    case 1:
                        Pe[0] = ue, Pe[1] = Pe[0] + E.width, ue = Pe[1] + E.width;
                        for (let Be = 0; Be < E.width; ++Be) {
                            const Le = X[Pe[0]++] << 8 | X[Pe[1]++];
                            Fe += Le, me[ye] = Fe, ye++
                        }
                        break;
                    case 2:
                        Pe[0] = ue, Pe[1] = Pe[0] + E.width, Pe[2] = Pe[1] + E.width, ue = Pe[2] + E.width;
                        for (let Be = 0; Be < E.width; ++Be) {
                            const Le = X[Pe[0]++] << 24 | X[Pe[1]++] << 16 | X[Pe[2]++] << 8;
                            Fe += Le, me[ye] = Fe, ye++
                        }
                        break
                }
            }
            return new DataView(me.buffer)
        }

        function te(E) {
            const F = E.viewer, X = {value: E.offset.value},
                ie = new Uint8Array(E.width * E.lines * (E.channels * E.type * 2)), me = {
                    version: tt(F, X),
                    unknownUncompressedSize: tt(F, X),
                    unknownCompressedSize: tt(F, X),
                    acCompressedSize: tt(F, X),
                    dcCompressedSize: tt(F, X),
                    rleCompressedSize: tt(F, X),
                    rleUncompressedSize: tt(F, X),
                    rleRawSize: tt(F, X),
                    totalAcUncompressedCount: tt(F, X),
                    totalDcUncompressedCount: tt(F, X),
                    acCompression: tt(F, X)
                };
            if (me.version < 2) throw new Error("EXRLoader.parse: " + fe.compression + " version " + me.version + " is unsupported");
            const ue = new Array;
            let ye = Ie(F, X) - 2;
            for (; ye > 0;) {
                const $e = be(F.buffer, X), Ze = Qe(F, X), rt = Ze >> 2 & 3, ut = (Ze >> 4) - 1,
                    ot = new Int8Array([ut])[0], ft = Qe(F, X);
                ue.push({name: $e, index: ot, type: ft, compression: rt}), ye -= $e.length + 3
            }
            const Pe = fe.channels, De = new Array(E.channels);
            for (let $e = 0; $e < E.channels; ++$e) {
                const Ze = De[$e] = {}, rt = Pe[$e];
                Ze.name = rt.name, Ze.compression = 0, Ze.decoded = !1, Ze.type = rt.pixelType, Ze.pLinear = rt.pLinear, Ze.width = E.width, Ze.height = E.lines
            }
            const Re = {idx: new Array(3)};
            for (let $e = 0; $e < E.channels; ++$e) {
                const Ze = De[$e];
                for (let rt = 0; rt < ue.length; ++rt) {
                    const ut = ue[rt];
                    Ze.name == ut.name && (Ze.compression = ut.compression, ut.index >= 0 && (Re.idx[ut.index] = $e), Ze.offset = $e)
                }
            }
            let Fe, Be, Le;
            if (me.acCompressedSize > 0) switch (me.acCompression) {
                case 0:
                    Fe = new Uint16Array(me.totalAcUncompressedCount), Se(E.array, F, X, me.acCompressedSize, Fe, me.totalAcUncompressedCount);
                    break;
                case 1:
                    const $e = E.array.slice(X.value, X.value + me.totalAcUncompressedCount), Ze = unzlibSync($e);
                    Fe = new Uint16Array(Ze.buffer), X.value += me.totalAcUncompressedCount;
                    break
            }
            if (me.dcCompressedSize > 0) {
                const $e = {array: E.array, offset: X, size: me.dcCompressedSize};
                Be = new Uint16Array(Ee($e).buffer), X.value += me.dcCompressedSize
            }
            if (me.rleRawSize > 0) {
                const $e = E.array.slice(X.value, X.value + me.rleCompressedSize), Ze = unzlibSync($e);
                Le = Ae(Ze.buffer), X.value += me.rleCompressedSize
            }
            let Je = 0;
            const je = new Array(De.length);
            for (let $e = 0; $e < je.length; ++$e) je[$e] = new Array;
            for (let $e = 0; $e < E.lines; ++$e) for (let Ze = 0; Ze < De.length; ++Ze) je[Ze].push(Je), Je += De[Ze].width * E.type * 2;
            Ne(Re, je, De, Fe, Be, ie);
            for (let $e = 0; $e < De.length; ++$e) {
                const Ze = De[$e];
                if (!Ze.decoded) switch (Ze.compression) {
                    case 2:
                        let rt = 0, ut = 0;
                        for (let ot = 0; ot < E.lines; ++ot) {
                            let ft = je[$e][rt];
                            for (let at = 0; at < Ze.width; ++at) {
                                for (let it = 0; it < 2 * Ze.type; ++it) ie[ft++] = Le[ut + it * Ze.width * Ze.height];
                                ut++
                            }
                            rt++
                        }
                        break;
                    case 1:
                    default:
                        throw new Error("EXRLoader.parse: unsupported channel compression")
                }
            }
            return new DataView(ie.buffer)
        }

        function be(E, F) {
            const X = new Uint8Array(E);
            let ie = 0;
            for (; X[F.value + ie] != 0;) ie += 1;
            const me = new TextDecoder().decode(X.slice(F.value, F.value + ie));
            return F.value = F.value + ie + 1, me
        }

        function xe(E, F, X) {
            const ie = new TextDecoder().decode(new Uint8Array(E).slice(F.value, F.value + X));
            return F.value = F.value + X, ie
        }

        function Ve(E, F) {
            const X = ke(E, F), ie = Ge(E, F);
            return [X, ie]
        }

        function qe(E, F) {
            const X = Ge(E, F), ie = Ge(E, F);
            return [X, ie]
        }

        function ke(E, F) {
            const X = E.getInt32(F.value, !0);
            return F.value = F.value + 4, X
        }

        function Ge(E, F) {
            const X = E.getUint32(F.value, !0);
            return F.value = F.value + 4, X
        }

        function Xe(E, F) {
            const X = E[F.value];
            return F.value = F.value + 1, X
        }

        function Qe(E, F) {
            const X = E.getUint8(F.value);
            return F.value = F.value + 1, X
        }

        const tt = function (E, F) {
            const X = Number(E.getBigInt64(F.value, !0));
            return F.value += 8, X
        };

        function nt(E, F) {
            const X = E.getFloat32(F.value, !0);
            return F.value += 4, X
        }

        function se(E, F) {
            return THREE.DataUtils.toHalfFloat(nt(E, F))
        }

        function re(E) {
            const F = (E & 31744) >> 10, X = E & 1023;
            return (E >> 15 ? -1 : 1) * (F ? F === 31 ? X ? NaN : 1 / 0 : Math.pow(2, F - 15) * (1 + X / 1024) : 6103515625e-14 * (X / 1024))
        }

        function Ie(E, F) {
            const X = E.getUint16(F.value, !0);
            return F.value += 2, X
        }

        function We(E, F) {
            return re(Ie(E, F))
        }

        function Ye(E, F, X, ie) {
            const me = X.value, ue = [];
            for (; X.value < me + ie - 1;) {
                const ye = be(F, X), Pe = ke(E, X), De = Qe(E, X);
                X.value += 3;
                const Re = ke(E, X), Fe = ke(E, X);
                ue.push({name: ye, pixelType: Pe, pLinear: De, xSampling: Re, ySampling: Fe})
            }
            return X.value += 1, ue
        }

        function st(E, F) {
            const X = nt(E, F), ie = nt(E, F), me = nt(E, F), ue = nt(E, F), ye = nt(E, F), Pe = nt(E, F),
                De = nt(E, F), Re = nt(E, F);
            return {redX: X, redY: ie, greenX: me, greenY: ue, blueX: ye, blueY: Pe, whiteX: De, whiteY: Re}
        }

        function pt(E, F) {
            const X = ["NO_COMPRESSION", "RLE_COMPRESSION", "ZIPS_COMPRESSION", "ZIP_COMPRESSION", "PIZ_COMPRESSION", "PXR24_COMPRESSION", "B44_COMPRESSION", "B44A_COMPRESSION", "DWAA_COMPRESSION", "DWAB_COMPRESSION"],
                ie = Qe(E, F);
            return X[ie]
        }

        function gt(E, F) {
            const X = Ge(E, F), ie = Ge(E, F), me = Ge(E, F), ue = Ge(E, F);
            return {xMin: X, yMin: ie, xMax: me, yMax: ue}
        }

        function bt(E, F) {
            const X = ["INCREASING_Y"], ie = Qe(E, F);
            return X[ie]
        }

        function ct(E, F) {
            const X = nt(E, F), ie = nt(E, F);
            return [X, ie]
        }

        function xt(E, F) {
            const X = nt(E, F), ie = nt(E, F), me = nt(E, F);
            return [X, ie, me]
        }

        function vt(E, F, X, ie, me) {
            if (ie === "string" || ie === "stringvector" || ie === "iccProfile") return xe(F, X, me);
            if (ie === "chlist") return Ye(E, F, X, me);
            if (ie === "chromaticities") return st(E, X);
            if (ie === "compression") return pt(E, X);
            if (ie === "box2i") return gt(E, X);
            if (ie === "lineOrder") return bt(E, X);
            if (ie === "float") return nt(E, X);
            if (ie === "v2f") return ct(E, X);
            if (ie === "v3f") return xt(E, X);
            if (ie === "int") return ke(E, X);
            if (ie === "rational") return Ve(E, X);
            if (ie === "timecode") return qe(E, X);
            if (ie === "preview") return X.value += me, "skipped";
            X.value += me
        }

        function Mt(E, F, X) {
            const ie = {};
            if (E.getUint32(0, !0) != 20000630) throw new Error("THREE.EXRLoader: provided file doesn't appear to be in OpenEXR format.");
            ie.version = E.getUint8(4);
            const me = E.getUint8(5);
            ie.spec = {
                singleTile: !!(me & 2),
                longName: !!(me & 4),
                deepFormat: !!(me & 8),
                multiPart: !!(me & 16)
            }, X.value = 8;
            let ue = !0;
            for (; ue;) {
                const ye = be(F, X);
                if (ye == 0) ue = !1; else {
                    const Pe = be(F, X), De = Ge(E, X), Re = vt(E, F, X, Pe, De);
                    Re === void 0 ? console.warn(`EXRLoader.parse: skipped unknown header attribute type '${Pe}'.`) : ie[ye] = Re
                }
            }
            if (me & -5) throw console.error("EXRHeader:", ie), new Error("THREE.EXRLoader: provided file is currently unsupported.");
            return ie
        }

        function Rt(E, F, X, ie, me) {
            const ue = {
                size: 0,
                viewer: F,
                array: X,
                offset: ie,
                width: E.dataWindow.xMax - E.dataWindow.xMin + 1,
                height: E.dataWindow.yMax - E.dataWindow.yMin + 1,
                channels: E.channels.length,
                bytesPerLine: null,
                lines: null,
                inputSize: null,
                type: E.channels[0].pixelType,
                uncompress: null,
                getter: null,
                format: null,
                encoding: null
            };
            switch (E.compression) {
                case"NO_COMPRESSION":
                    ue.lines = 1, ue.uncompress = z;
                    break;
                case"RLE_COMPRESSION":
                    ue.lines = 1, ue.uncompress = ge;
                    break;
                case"ZIPS_COMPRESSION":
                    ue.lines = 1, ue.uncompress = Ee;
                    break;
                case"ZIP_COMPRESSION":
                    ue.lines = 16, ue.uncompress = Ee;
                    break;
                case"PIZ_COMPRESSION":
                    ue.lines = 32, ue.uncompress = Oe;
                    break;
                case"PXR24_COMPRESSION":
                    ue.lines = 16, ue.uncompress = ze;
                    break;
                case"DWAA_COMPRESSION":
                    ue.lines = 32, ue.uncompress = te;
                    break;
                case"DWAB_COMPRESSION":
                    ue.lines = 256, ue.uncompress = te;
                    break;
                default:
                    throw new Error("EXRLoader.parse: " + E.compression + " is unsupported")
            }
            if (ue.scanlineBlockSize = ue.lines, ue.type == 1) switch (me) {
                case THREE.FloatType:
                    ue.getter = We, ue.inputSize = 2;
                    break;
                case THREE.HalfFloatType:
                    ue.getter = Ie, ue.inputSize = 2;
                    break
            } else if (ue.type == 2) switch (me) {
                case THREE.FloatType:
                    ue.getter = nt, ue.inputSize = 4;
                    break;
                case THREE.HalfFloatType:
                    ue.getter = se, ue.inputSize = 4
            } else throw new Error("EXRLoader.parse: unsupported pixelType " + ue.type + " for " + E.compression + ".");
            ue.blockCount = (E.dataWindow.yMax + 1) / ue.scanlineBlockSize;
            for (let Pe = 0; Pe < ue.blockCount; Pe++) tt(F, ie);
            ue.outputChannels = ue.channels == 3 ? 4 : ue.channels;
            const ye = ue.width * ue.height * ue.outputChannels;
            switch (me) {
                case THREE.FloatType:
                    ue.byteArray = new Float32Array(ye), ue.channels < ue.outputChannels && ue.byteArray.fill(1, 0, ye);
                    break;
                case THREE.HalfFloatType:
                    ue.byteArray = new Uint16Array(ye), ue.channels < ue.outputChannels && ue.byteArray.fill(15360, 0, ye);
                    break;
                default:
                    console.error("THREE.EXRLoader: unsupported type: ", me);
                    break
            }
            return ue.bytesPerLine = ue.width * ue.inputSize * ue.channels, ue.outputChannels == 4 ? (ue.format = THREE.RGBAFormat, ue.encoding = THREE.LinearEncoding) : (ue.format = THREE.RedFormat, ue.encoding = THREE.LinearEncoding), ue
        }

        const wt = new DataView(e), Pt = new Uint8Array(e), G = {value: 0}, fe = Mt(wt, e, G),
            de = Rt(fe, wt, Pt, G, this.type), he = {value: 0}, Me = {R: 0, G: 1, B: 2, A: 3, Y: 0};
        for (let E = 0; E < de.height / de.scanlineBlockSize; E++) {
            const F = Ge(wt, G);
            de.size = Ge(wt, G), de.lines = F + de.scanlineBlockSize > de.height ? de.height - F : de.scanlineBlockSize;
            const ie = de.size < de.lines * de.bytesPerLine ? de.uncompress(de) : z(de);
            G.value += de.size;
            for (let me = 0; me < de.scanlineBlockSize; me++) {
                const ue = me + E * de.scanlineBlockSize;
                if (ue >= de.height) break;
                for (let ye = 0; ye < de.channels; ye++) {
                    const Pe = Me[fe.channels[ye].name];
                    for (let De = 0; De < de.width; De++) {
                        he.value = (me * (de.channels * de.width) + ye * de.width + De) * de.inputSize;
                        const Re = (de.height - 1 - ue) * (de.width * de.outputChannels) + De * de.outputChannels + Pe;
                        de.byteArray[Re] = de.getter(ie, he)
                    }
                }
            }
        }
        return {
            header: fe,
            width: de.width,
            height: de.height,
            data: de.byteArray,
            format: de.format,
            encoding: de.encoding,
            type: this.type
        }
    }

    setDataType(e) {
        return this.type = e, this
    }

    load(e, t, r, n) {
        function o(l, c) {
            l.encoding = c.encoding, l.minFilter = THREE.LinearFilter, l.magFilter = THREE.LinearFilter, l.generateMipmaps = !1, l.flipY = !1, t && t(l, c)
        }

        return super.load(e, o, r, n)
    }
}

class EXRItem extends AnyItem$3 {
    constructor(e, t) {
        super(e, {...t, responseType: "type"}), this.EXRLoader = new EXRLoader
    }

    retrieve() {
        return !1
    }

    _onLoad(e) {
        this.content = e, super._onLoad(this)
    }

    loadFunc() {
        this.EXRLoader.load(this.url, this._onLoad.bind(this), this._onGLTFLoading.bind(this))
    }

    _onGLTFLoading(e) {
        this.hasLoading && this.loadingSignal.dispatch(e.loaded / e.total)
    }
}

EXRItem.type = "exr";
EXRItem.extensions = ["exr"];

quickLoader$8.register(EXRItem);


class ThreeLoaderItem extends AnyItem$3 {
    constructor(e, t) {
        t.loadFunc = () => {
        }, t.hasLoading = t.hasLoading === void 0 ? !0 : t.hasLoading, super(e, t), !t.loader && console && (console.error || console.log)("loader is required."), this.loadFunc = this._loadFunc.bind(this)
    }

    _loadFunc(e, t, r) {
        this.loader.load(e, this._onLoaderLoad.bind(this, t), this._onLoaderLoading.bind(this, r))
    }

    _onLoaderLoad(e, t) {
        this.content = t, e(t)
    }

    _onLoaderLoading(e, t) {
        e.dispatch(t.loaded / t.total)
    }
}

ThreeLoaderItem.type = "three-loader";
ThreeLoaderItem.extensions = [];
quickLoader$8.register(ThreeLoaderItem);

export class ShaderHelper {
    glslifyStrip(e) {
        return e.replace(/#define\sGLSLIFY\s./, "")
    }

    addChunk(e, t) {
        THREE.ShaderChunk[e] = this.glslifyStrip(t)
    }

    _wrapInclude(e) {
        return "#include <" + e + ">"
    }

    insertBefore(e, t, r, n) {
        const o = n ? this._wrapInclude(t) : t;
        return e.replace(t, this.glslifyStrip(r) + `
` + o)
    }

    insertAfter(e, t, r, n) {
        const o = n ? this._wrapInclude(t) : t;
        return e.replace(o, o + `
` + this.glslifyStrip(r) + `
`)
    }

    replace(e, t, r, n) {
        const o = n ? this._wrapInclude(t) : t;
        return e.replace(o, `
` + this.glslifyStrip(r) + `
`)
    }
}

class Task {
    constructor(e, base) {
        this.base = base
        Array.isArray(e) ? this.run = this.createMultiCallbackFunc(e) : this.run = this.createCallbackFunc(e)
    }

    run() {
    }

    createMultiCallbackFunc(e) {
        let t = [];
        for (let r = 0; r < e.length; r++) t.push(this.createCallbackFunc(e[r]));
        return function () {
            for (let r = 0; r < t.length; r++) t[r]()
        }
    }

    createCallbackFunc(e) {
        let t;
        return e.isRawShaderMaterial || e.isShaderMaterial ? t = this.createShaderMaterialFunc(e) : e.isObject3D ? t = this.createCompileSceneFunc(e) : e.isTexture ? t = this.createInitTextureFunc(e) : t = e, t
    }

    createShaderMaterialFunc(e) {
        return function () {
            this.base.fboHelper._tri.material = e, this.base.properties.renderer.compile(this.base.fboHelper._tri, this.base.properties.camera)
        }
    }

    createCompileSceneFunc(e) {
        return function () {
            e.traverse(r => {
                r._tmpVisible = r.visible, r.visible = !0
            });
            let t = e.visible;
            e.visible = !0, this.base.properties.renderer.compile(e, this.base.properties.camera), e.traverse(r => {
                r.visible = r._tmpVisible
            }), e.visible = t
        }
    }

    createInitTextureFunc(e) {
        return function () {
            this.base.properties.renderer.initTexture(e)
        }
    }
}

export class TaskManager {
    percent = 1;
    taskList = [];
    _activeTaskList = [];
    _activeTaskIndex = 0;
    _needsStart = !1;
    onCompleted = new MinSignal$2;

    constructor(base) {
        this.base = base
    }

    start() {
        this._needsStart = !0, this.percent = 0
    }

    _start() {
        this._needsStart = !1, this._activeTaskList = this.taskList.splice(0, this.taskList.length), this._activeTaskIndex = 0
    }

    add(e) {
        settings.SKIP_ANIMATION || this.taskList.push(new Task(e, this.base))
    }

    update() {
        if (this._needsStart && this._start(), this._activeTaskList.length) {
            let e = this._activeTaskList[this._activeTaskIndex];
            e && (this._activeTaskIndex++, this.percent = this._activeTaskIndex / this._activeTaskList.length, e.run())
        } else {
            let e = this.percent;
            this.percent = 1, e < 1 && this.onCompleted.dispatch()
        }
    }
}

let channelMixerFrag = `#define GLSLIFY 1
uniform sampler2D u_texture;uniform vec4 u_channelMixerR;uniform vec4 u_channelMixerG;uniform vec4 u_channelMixerB;uniform vec4 u_channelMixerA;varying vec2 v_uv;void main(){vec4 color=texture2D(u_texture,v_uv);gl_FragColor=vec4(dot(color,u_channelMixerR),dot(color,u_channelMixerG),dot(color,u_channelMixerB),dot(color,u_channelMixerA));}`;

export class TextureHelper {
    blackTexture;
    whiteTexture;
    transparentTexture;
    channelMixerMaterial;

    constructor(base) {
        this.base = base
    }

    init() {
        this.blackTexture = this._createPixelTexture([0, 0, 0, 255])
        this.whiteTexture = this._createPixelTexture([255, 255, 255, 255])
        this.transparentTexture = this._createPixelTexture([0, 0, 0, 0])
    }

    _createPixelTexture(e) {
        return this.base.fboHelper.createDataTexture(new Uint8Array(e), 1, 1, !1, !0)
    }

    mixChannels(e, t, r = -1, n = -1, o = -1, l = -1) {
        this.channelMixerMaterial || (this.channelMixerMaterial = new THREE.RawShaderMaterial({
            uniforms: {
                u_texture: {value: null},
                u_channelMixerR: {value: new THREE.Vector4},
                u_channelMixerG: {value: new THREE.Vector4},
                u_channelMixerB: {value: new THREE.Vector4},
                u_channelMixerA: {value: new THREE.Vector4}
            },
            vertexShader: this.base.fboHelper.vertexShader,
            fragmentShader: this.base.fboHelper.precisionPrefix + channelMixerFrag,
            blending: THREE.CustomBlending,
            blendEquation: THREE.AddEquation,
            blendDst: THREE.OneFactor,
            blendSrc: THREE.OneFactor,
            blendEquationAlpha: THREE.AddEquation,
            blendDstAlpha: THREE.OneFactor,
            blendSrcAlpha: THREE.OneFactor
        })), this.channelMixerMaterial.uniforms.u_texture.value = e, this.channelMixerMaterial.uniforms.u_channelMixerR.value.set(+(r % 4 == 0), +(r % 4 == 1), +(r % 4 == 2), +(r % 4 == 3)).multiplyScalar(r < 0 ? 0 : 1), this.channelMixerMaterial.uniforms.u_channelMixerG.value.set(+(n % 4 == 0), +(n % 4 == 1), +(n % 4 == 2), +(n % 4 == 3)).multiplyScalar(n < 0 ? 0 : 1), this.channelMixerMaterial.uniforms.u_channelMixerB.value.set(+(o % 4 == 0), +(o % 4 == 1), +(o % 4 == 2), +(o % 4 == 3)).multiplyScalar(o < 0 ? 0 : 1), this.channelMixerMaterial.uniforms.u_channelMixerA.value.set(+(l % 4 == 0), +(l % 4 == 1), +(l % 4 == 2), +(l % 4 == 3)).multiplyScalar(l < 0 ? 0 : 1);
        let c = this.base.fboHelper.getColorState();
        this.base.fboHelper.renderer.autoClear = !1, this.base.fboHelper.render(this.channelMixerMaterial, t), this.base.fboHelper.setColorState(c)
    }
}


function ImageItem$1(a, e) {
    a && (_super.constructor.apply(this, arguments), this.content = this.content || new Image, this.crossOrigin && (this.content.crossOrigin = this.crossOrigin))
}

let AbstractItem = AbstractItem_1
var _super = AbstractItem.prototype
let _p = ImageItem$1.prototype = new AbstractItem;
_p.constructor = ImageItem$1;

function load() {
    _super.load.apply(this, arguments);
    var a = this.content;
    a.onload = this.boundOnLoad, a.src = this.url
}

function _onLoad() {
    delete this.content.onload, this.width = this.content.width, this.height = this.content.height, _super._onLoad.call(this)
}

_p.load = load;
_p._onLoad = _onLoad;

function computedStyle$2(a, e, t, r) {
    if (t = window.getComputedStyle, r = t ? t(a) : a.currentStyle, r) return r[e.replace(/-(\w)/gi, function (n, o) {
        return o.toUpperCase()
    })]
}

function _isNotData(a) {
    return a.indexOf("data:") !== 0
}

let computedStyle_commonjs = computedStyle$2
let computedStyle$1 = computedStyle_commonjs
ImageItem$1.retrieve = function (a) {
    if (a.nodeType && a.style) {
        var e = [];
        a.nodeName.toLowerCase() === "img" && a.src.indexOf(";") < 0 && e.push(a.src), computedStyle$1(a, "background-image").replace(/s?url\(\s*?['"]?([^;]*?)['"]?\s*?\)/g, function (r, n) {
            e.push(n)
        });
        for (var t = e.length; t--;) _isNotData(e[t]) || e.splice(t, 1);
        return e.length ? e : !1
    } else return typeof a == "string" ? [a] : !1
};
ImageItem$1.type = "image";
ImageItem$1.extensions = ["jpg", "gif", "png"];
quickLoader$8.register(ImageItem$1);

const shader = `#define GLSLIFY 1
uniform vec2 u_glPositionOffset;vec4 glPositionOffset(vec4 glPosition){return glPosition+vec4(u_glPositionOffset*glPosition.w,0.0,0.0);}`;

export class GlPositionOffset {
    constructor(base) {
        this.base = base
    }

    offset = new THREE.Vector2;
    sharedUniforms = {u_glPositionOffset: {value: null}};

    init() {
        this.sharedUniforms.u_glPositionOffset.value = this.offset, this.base.shaderHelper.addChunk("glPositionOffset", shader)
    }

    setOffset(e, t) {
        return this.offset.set(e, t)
    }
}

let self$1;

class Ease {
    quadIn(e) {
        return e * e
    }

    quadOut(e) {
        return e * (2 - e)
    }

    quadOutIn(e) {
        return e < .5 ? self$1.quadOut(e + e) * .5 : self$1.quadIn(e + e - 1) * .5 + .5
    }

    quadInOut(e) {
        return (e *= 2) < 1 ? .5 * e * e : -.5 * (--e * (e - 2) - 1)
    }

    cubicIn(e) {
        return e * e * e
    }

    cubicOut(e) {
        return --e * e * e + 1
    }

    cubicOutIn(e) {
        return e < .5 ? self$1.cubicOut(e + e) * .5 : self$1.cubicIn(e + e - 1) * .5 + .5
    }

    cubicInOut(e) {
        return (e *= 2) < 1 ? .5 * e * e * e : .5 * ((e -= 2) * e * e + 2)
    }

    quartIn(e) {
        return e * e * e * e
    }

    quartOut(e) {
        return 1 - --e * e * e * e
    }

    quartOutIn(e) {
        return e < .5 ? self$1.quartOut(e + e) * .5 : self$1.quartIn(e + e - 1) * .5 + .5
    }

    quartInOut(e) {
        return (e *= 2) < 1 ? .5 * e * e * e * e : -.5 * ((e -= 2) * e * e * e - 2)
    }

    quintIn(e) {
        return e * e * e * e * e
    }

    quintOut(e) {
        return --e * e * e * e * e + 1
    }

    quintOutIn(e) {
        return e < .5 ? self$1.quintOut(e + e) * .5 : self$1.quintIn(e + e - 1) * .5 + .5
    }

    quintInOut(e) {
        return (e *= 2) < 1 ? .5 * e * e * e * e * e : .5 * ((e -= 2) * e * e * e * e + 2)
    }

    sineIn(e) {
        return 1 - Math.cos(e * Math.PI / 2)
    }

    sineOut(e) {
        return Math.sin(e * Math.PI / 2)
    }

    sineOutIn(e) {
        return e < .5 ? self$1.sineOut(e + e) * .5 : self$1.sineIn(e + e - 1) * .5 + .5
    }

    sineInOut(e) {
        return .5 * (1 - Math.cos(Math.PI * e))
    }

    expoIn(e) {
        return e === 0 ? 0 : Math.pow(1024, e - 1)
    }

    expoOut(e) {
        return e === 1 ? 1 : 1 - Math.pow(2, -10 * e)
    }

    expoOutIn(e) {
        return e < .5 ? self$1.expoOut(e + e) * .5 : self$1.expoIn(e + e - 1) * .5 + .5
    }

    expoInOut(e) {
        return e === 0 ? 0 : e === 1 ? 1 : (e *= 2) < 1 ? .5 * Math.pow(1024, e - 1) : .5 * (-Math.pow(2, -10 * (e - 1)) + 2)
    }

    circIn(e) {
        return 1 - Math.sqrt(1 - e * e)
    }

    circOut(e) {
        return Math.sqrt(1 - --e * e)
    }

    circOutIn(e) {
        return e < .5 ? self$1.circOut(e + e) * .5 : self$1.circIn(e + e - 1) * .5 + .5
    }

    circInOut(e) {
        return (e *= 2) < 1 ? -.5 * (Math.sqrt(1 - e * e) - 1) : .5 * (Math.sqrt(1 - (e -= 2) * e) + 1)
    }

    elasticIn(e) {
        let t, r = .1, n = .4;
        return e === 0 ? 0 : e === 1 ? 1 : (!r || r < 1 ? (r = 1, t = n / 4) : t = n * Math.asin(1 / r) / (2 * Math.PI), -(r * Math.pow(2, 10 * (e -= 1)) * Math.sin((e - t) * 2 * Math.PI / n)))
    }

    elasticOut(e) {
        let t, r = .1, n = .4;
        return e === 0 ? 0 : e === 1 ? 1 : (!r || r < 1 ? (r = 1, t = n / 4) : t = n * Math.asin(1 / r) / (2 * Math.PI), r * Math.pow(2, -10 * e) * Math.sin((e - t) * 2 * Math.PI / n) + 1)
    }

    elasticOutIn(e) {
        return e < .5 ? self$1.elasticOut(e + e) * .5 : self$1.elasticIn(e + e - 1) * .5 + .5
    }

    elasticInOut(e) {
        let t, r = .1, n = .4;
        return e === 0 ? 0 : e === 1 ? 1 : (!r || r < 1 ? (r = 1, t = n / 4) : t = n * Math.asin(1 / r) / (2 * Math.PI), (e *= 2) < 1 ? -.5 * r * Math.pow(2, 10 * (e -= 1)) * Math.sin((e - t) * 2 * Math.PI / n) : r * Math.pow(2, -10 * (e -= 1)) * Math.sin((e - t) * 2 * Math.PI / n) * .5 + 1)
    }

    backIn(e) {
        let t = 1.70158;
        return e * e * ((t + 1) * e - t)
    }

    backOut(e) {
        let t = 1.70158;
        return --e * e * ((t + 1) * e + t) + 1
    }

    backOutIn(e) {
        return e < .5 ? self$1.backOut(e + e) * .5 : self$1.backIn(e + e - 1) * .5 + .5
    }

    backInOut(e) {
        let t = 2.5949095;
        return (e *= 2) < 1 ? .5 * e * e * ((t + 1) * e - t) : .5 * ((e -= 2) * e * ((t + 1) * e + t) + 2)
    }

    bounceIn(e) {
        return 1 - self$1.bounceOut(1 - e)
    }

    bounceOut(e) {
        return e < 1 / 2.75 ? 7.5625 * e * e : e < 2 / 2.75 ? 7.5625 * (e -= 1.5 / 2.75) * e + .75 : e < 2.5 / 2.75 ? 7.5625 * (e -= 2.25 / 2.75) * e + .9375 : 7.5625 * (e -= 2.625 / 2.75) * e + .984375
    }

    bounceOutIn(e) {
        return e < .5 ? self$1.bounceOut(e + e) * .5 : self$1.bounceIn(e + e - 1) * .5 + .5
    }

    bounceInOut(e) {
        return e < .5 ? self$1.bounceIn(e * 2) * .5 : self$1.bounceOut(e * 2 - 1) * .5 + .5
    }

    lusion(e) {
        return self$1.cubicBezier(e, .35, 0, 0, 1)
    }

    cubicBezier(e, t, r, n, o) {
        if (e <= 0) return 0;
        if (e >= 1) return 1;
        if (t === r && n === o) return e;
        const l = (B, D, q, k) => 1 / (3 * D * B * B + 2 * q * B + k),
            c = (B, D, q, k, J) => D * (B * B * B) + q * (B * B) + k * B + J, u = (B, D, q, k, J) => {
                let U = B * B;
                return D * (U * B) + q * U + k * B + J
            };
        let f = 0, p = 0, g = t, v = r, _ = n, w = o, S = 1, b = 1, C = S - 3 * _ + 3 * g - f,
            R = 3 * _ - 6 * g + 3 * f, T = 3 * g - 3 * f, M = f, P = b - 3 * w + 3 * v - p, I = 3 * w - 6 * v + 3 * p,
            V = 3 * v - 3 * p, A = p, O = e, W, Q, H;
        for (W = 0; W < 100; W++) Q = c(O, C, R, T, M), H = l(O, C, R, T), H === 1 / 0 && (H = e), O -= (Q - e) * H, O = Math.min(Math.max(O, 0), 1);
        return u(O, P, I, V, A)
    }
}

self$1 = new Ease;
const ease = self$1

export class Preloader {
    percentTarget = 0;
    percent = 0;
    percentToStart = 0;
    DELAY = 1.5;
    MIN_PRELOAD_DURATION = 1;
    PERCENT_BETWEEN_INIT_AND_START = .3;
    MIN_DURATION_BETWEEN_INIT_AND_START = .25;
    HIDE_DURATION = .5;
    isActive = !1;
    lineTransformTime = 0;
    digitsWidth = 0;

    constructor(base) {
        this.base = base
    }

    preInit() {
        this.domContainer = document.getElementById("preloader")
        this.domDigitsContainer = document.getElementById("preloader-percent-digits")
        this.domDigits = document.querySelectorAll(".preloader-percent-digit");
        for (let e = 0; e < this.domDigits.length; e++) {
            let t = this.domDigits[e];
            t._domNums = t.querySelectorAll(".preloader-percent-digit-num")
            t._easedVal = 0
        }
    }

    init() {
    }

    show(e, t) {
        this._initCallback = e, this._startCallback = t, this.isActive = !0, this.base.properties.loader.start(r => {
            this.percentTarget = r
        })
    }

    hide() {
    }

    resize(e, t, r) {
        // r !== !0 && (this.digitsWidth = this.domDigitsContainer.offsetWidth)
    }

    update(e) {
        if (!this.isActive) return;
        this.percent = Math.min(this.percentTarget, this.percent + (settings.SKIP_ANIMATION ? 1 : this.percentTarget > this.percent ? e : 0) / this.MIN_PRELOAD_DURATION)
        if (this.percentTarget == 1) {
            this.base.properties.hasInitialized || this._initCallback()
            this.percentToStart = settings.SKIP_ANIMATION ? 1 : Math.min(this.base.taskManager.percent, this.percentToStart + e / this.MIN_DURATION_BETWEEN_INIT_AND_START)
        }
        let t = this.percentToStart * this.PERCENT_BETWEEN_INIT_AND_START + this.percent * (1 - this.PERCENT_BETWEEN_INIT_AND_START)
        let r = 0;
        if (t == 1) {
            this.lineTransformTime += settings.SKIP_ANIMATION ? 1 : e
            r = ease.expoInOut(math.saturate(this.lineTransformTime))
        }
        if (r == 1 && !this.base.properties.hasStarted) this._startCallback();
        let n = settings.SKIP_ANIMATION ? +this.base.properties.hasStarted : math.saturate(this.base.properties.startTime);
        /* for (let o = 0; o < this.domDigits.length; o++) {
             let l = this.domDigits[o]
             let c = Math.floor(t * 100 / Math.pow(10, this.domDigits.length - o - 1));
             l._easedVal = math.mix(l._easedVal, c, 1 - Math.exp(-7 * e))
             c - l._easedVal < .01 && (l._easedVal = c);
             let u = l._easedVal % 10
             let f = Math.floor(u)
             let p = Math.ceil(u) % 10
             let g = u - f;
             l._domNums[0].innerHTML = f
             l._domNums[1].innerHTML = p
             l.style.transform = "translateY(" + -(g - ease.expoInOut(math.saturate(n * 1.2 - .2 * o / (this.domDigits.length - 1)))) * 50 + "%) translateY(-0.05em)"
         }*/
        if (n == 1) this.isActive = !1
    }
}

export class UI {
    domSectionsContainer = document.querySelector("#page-container");

    constructor(base) {
        this.base = base
    }

    preInit() {
        if (!this.base.settings.WEBGL_OFF) {
            this.base.preloader.preInit()
        }
    }

    preload(e, t) {
        this.base.preloader.show(e, t)
    }

    init() {

    }

    start() {
        this.base.preloader.hide()
    }

    resize(e, t, r) {
        this.base.preloader.resize(e, t, r)
        const o = getComputedStyle(document.documentElement).getPropertyValue("--global-border-radius").split("px")[0]
        this.base.properties.globalRadius = this.base.properties.sharedUniforms.u_globalRadius.value = parseInt(o)
    }

    update(e) {
        this.base.preloader.update(e)
    }
}

export class Properties {
    win = window;
    isSecureConnection = window.location.protocol === "https:";
    loader = quickLoader$1.create();
    percent = 0;
    easedPercent = 0;
    domRoot = document.querySelector(":root");
    _isSupportedDevice = !1;
    _isSupportedBrowser = !1;
    _isSupportedWebGL = !1;
    _isSupportedMobileOrientation = !1;
    _isSupported = !1;
    time = 0;
    deltaTime = 0;
    hasInitialized = !1;
    hasStarted = !1;
    startTime = 0;
    viewportWidth = 0;
    viewportHeight = 0;
    width = 0;
    height = 0;
    useMobileLayout = !1;
    renderer = null;
    scene = null;
    camera = null;
    cameraDirection = new THREE.Vector3(0, 0, 1);
    postprocessing = null;
    resolution = new THREE.Vector2;
    viewportResolution = new THREE.Vector2;
    bgColor = new THREE.Color;
    canvas = null;
    gl = null;
    webglDPR = 1;
    webglOpts = {antialias: !1, alpha: !1, xrCompatible: !1, powerPreference: "high-performance"};
    sharedUniforms = {
        u_aspect: {value: 1},
        u_cameraDirection: {value: this.cameraDirection},
        u_dpr: {value: 1},
        u_time: {value: 0},
        u_deltaTime: {value: 1},
        u_resolution: {value: this.resolution},
        u_viewportResolution: {value: this.viewportResolution},
        u_bgColor: {value: this.bgColor},
        u_globalRadius: {value: 0}
    };
    initTaskList = [];
    changeCamera = new MinSignal$2;
    smaa = null;
    fxaa = null;
    aboutPageHeroEfxPrepass = null;
    cameraMotionBlur = null;
    aboutPageHeroEfx = null;
    gtao = null;
    bloom = null;
    screenPaintDistortion = null;
    final = null;
    offWhiteColorHex = computedStyle.getPropertyValue("--color-off-white").trim();
    blackColorHex = computedStyle.getPropertyValue("--color-black").trim();
    blueColorHex = computedStyle.getPropertyValue("--color-blue").trim();
    bgColorHex = computedStyle.getPropertyValue("--color-off-white").trim();
    opacity = 1;
    cameraLookX = 0;
    cameraLookY = 0;
    defaults = {
        defaultCameraPosition: new THREE.Vector3(0, 0, 5),
        defaultLookAtPosition: new THREE.Vector3(0, 0, 0),
        autoScrollSpeed: 0,
        cameraNear: .1,
        cameraFar: 200,
        clearAlpha: 1,
        cameraFov: 45,
        cameraUsePhysical: !1,
        cameraFilmGauge: 35,
        cameraFocalLength: 35,
        screenPaintOffsetRatio: 1,
        cameraViewportOffsetX: 0,
        cameraViewportOffsetY: 0,
        cameraDistance: 5,
        cameraLookStrength: 0,
        cameraLookEaseDamp: .1,
        cameraShakePositionStrength: 0,
        cameraShakePositionSpeed: .15,
        cameraShakeRotationStrength: 0,
        cameraShakeRotationSpeed: .3,
        cameraDollyZoomFovOffset: 0,
        bloomAmount: 0,
        bloomRadius: 0,
        bloomThreshold: 0,
        bloomSmoothWidth: 0,
        bloomSaturation: 1,
        bloomHighPassMultiplier: 1,
        haloWidth: .6,
        haloRGBShift: .02,
        haloStrength: 0,
        haloMaskInner: .3,
        haloMaskOuter: .5,
        useFinal: !1,
        vignetteFrom: 2,
        vignetteTo: 5,
        vignetteColorHex: "#000000",
        saturation: 1,
        contrast: 0,
        brightness: 1,
        tintColorHex: "#000000",
        tintOpacity: 0,
        screenPaintNeedsMouseDown: !1,
        screenPaintMinRadius: 0,
        screenPaintMaxRadius: 100,
        screenPaintRadiusDistanceRange: 100,
        screenPaintPushStrength: 25,
        screenPaintVelocityDissipation: .975,
        screenPaintWeight1Dissipation: .95,
        screenPaintWeight2Dissipation: .8,
        screenPaintUseNoise: !0,
        screenPaintCurlScale: .02,
        screenPaintCurlStrength: 3,
        screenPaintDistortionAmount: 3,
        screenPaintDistortionRGBShift: .5,
        screenPaintDistortionColorMultiplier: 10,
        screenPaintDistortionMultiplier: 5,
        upscalerAmount: 1,
        upscalerSharpness: 1,
        isSmaaEnabled: !settings.USE_HD
    };
    onFirstClicked = new MinSignal$2;
    isPreloaderFinished = !1;
    balloonsColorIndex = 0;
    globalRadius = 0;
    isContactFromProjectPage = !1;

    constructor() {
    }

    reset() {
        for (let e in this.defaults) this[e] = this.defaults[e];
        this.smaa && (this.smaa.enabled = !0)
    }
}




