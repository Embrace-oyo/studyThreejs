import * as THREE from "three";

function getDefaultExportFromCjs(o) {
    return o && o.__esModule && Object.prototype.hasOwnProperty.call(o, "default") ? o.default : o
}

var minSignal$1 = {
    exports: {}
};
(function (o) {
    (function (e) {
            function t() {
                this._listeners = [],
                    this.dispatchCount = 0
            }

            var r = t.prototype;
            r.add = c,
                r.addOnce = u,
                r.remove = f,
                r.dispatch = p;
            var n = "Callback function is missing!"
                , a = Array.prototype.slice;

            function l(g) {
                g.sort(function (v, _) {
                    return v = v.p,
                        _ = _.p,
                        _ < v ? 1 : _ > v ? -1 : 0
                })
            }

            function c(g, v, _, T) {
                if (!g)
                    throw n;
                _ = _ || 0;
                for (var M = this._listeners, S, b, C, w = M.length; w--;)
                    if (S = M[w],
                    S.f === g && S.c === v)
                        return !1;
                typeof _ == "function" && (b = _,
                    _ = T,
                    C = 4),
                    M.unshift({
                        f: g,
                        c: v,
                        p: _,
                        r: b || g,
                        a: a.call(arguments, C || 3),
                        j: 0
                    }),
                    l(M)
            }

            function u(g, v, _, T) {
                if (!g)
                    throw n;
                var M = this
                    , S = function () {
                    return M.remove.call(M, g, v),
                        g.apply(v, a.call(arguments, 0))
                };
                T = a.call(arguments, 0),
                T.length === 1 && T.push(e),
                    T.splice(2, 0, S),
                    c.apply(M, T)
            }

            function f(g, v) {
                if (!g)
                    return this._listeners.length = 0,
                        !0;
                for (var _ = this._listeners, T, M = _.length; M--;)
                    if (T = _[M],
                    T.f === g && (!v || T.c === v))
                        return T.j = 0,
                            _.splice(M, 1),
                            !0;
                return !1
            }

            function p(g) {
                g = a.call(arguments, 0),
                    this.dispatchCount++;
                for (var v = this.dispatchCount, _ = this._listeners, T, M, S = _.length; S--;)
                    if (T = _[S],
                    T && T.j < v && (T.j = v,
                    T.r.apply(T.c, T.a.concat(g)) === !1)) {
                        M = T;
                        break
                    }
                for (_ = this._listeners,
                         S = _.length; S--;)
                    _[S].j = 0;
                return M
            }

            o.exports = t
        }
    )()
})(minSignal$1);
var minSignalExports$1 = minSignal$1.exports;
const MinSignal$2 = getDefaultExportFromCjs(minSignalExports$1);
var quickLoader$b = {
    exports: {}
}
    , minSignal = {
    exports: {}
};
(function (o) {
    (function (e) {
            function t() {
                this._listeners = [],
                    this.dispatchCount = 0
            }

            var r = t.prototype;
            r.add = c,
                r.addOnce = u,
                r.remove = f,
                r.dispatch = p;
            var n = "Callback function is missing!"
                , a = Array.prototype.slice;

            function l(g) {
                g.sort(function (v, _) {
                    return v = v.p,
                        _ = _.p,
                        _ < v ? 1 : v > _ ? -1 : 0
                })
            }

            function c(g, v, _, T) {
                if (!g)
                    throw n;
                _ = _ || 0;
                for (var M = this._listeners, S, b, C, w = M.length; w--;)
                    if (S = M[w],
                    S.f === g && S.c === v)
                        return !1;
                typeof _ == "function" && (b = _,
                    _ = T,
                    C = 4),
                    M.unshift({
                        f: g,
                        c: v,
                        p: _,
                        r: b || g,
                        a: a.call(arguments, C || 3),
                        j: 0
                    }),
                    l(M)
            }

            function u(g, v, _, T) {
                if (!g)
                    throw n;
                var M = this
                    , S = function () {
                    return M.remove.call(M, g, v),
                        g.apply(v, a.call(arguments, 0))
                };
                T = a.call(arguments, 0),
                T.length === 1 && T.push(e),
                    T.splice(2, 0, S),
                    c.apply(M, T)
            }

            function f(g, v) {
                if (!g)
                    return this._listeners.length = 0,
                        !0;
                for (var _ = this._listeners, T, M = _.length; M--;)
                    if (T = _[M],
                    T.f === g && (!v || T.c === v))
                        return T.j = 0,
                            _.splice(M, 1),
                            !0;
                return !1
            }

            function p(g) {
                g = a.call(arguments, 0),
                    this.dispatchCount++;
                for (var v = this.dispatchCount, _ = this._listeners, T, M, S = _.length; S--;)
                    if (T = _[S],
                    T && T.j < v && (T.j = v,
                    T.r.apply(T.c, T.a.concat(g)) === !1)) {
                        M = T;
                        break
                    }
                for (_ = this._listeners,
                         S = _.length; S--;)
                    _[S].j = 0;
                return M
            }

            o.exports = t
        }
    )()
})(minSignal);
var minSignalExports = minSignal.exports, MinSignal$1 = minSignalExports, undef$3;

function QuickLoader() {
    this.isLoading = !1,
        this.totalWeight = 0,
        this.loadedWeight = 0,
        this.itemUrls = {},
        this.itemList = [],
        this.loadingSignal = new MinSignal$1,
        this.crossOriginMap = {},
        this.queue = [],
        this.activeItems = [],
        this.maxActiveItems = 4
}

var _p$9 = QuickLoader.prototype;
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
var addedItems = _p$9.addedItems = {}
    , loadedItems = _p$9.loadedItems = {}
    , ITEM_CLASS_LIST = _p$9.ITEM_CLASS_LIST = []
    , ITEM_CLASSES = _p$9.ITEM_CLASSES = {};
quickLoader$b.exports = create();

function setCrossOrigin(o, e) {
    this.crossOriginMap[o] = e
}

function addChunk(o, e) {
    var t, r, n, a, l, c = retrieveAll(o, e);
    for (t = 0,
             n = c.length; t < n; t++)
        for (l = c[t],
                 r = 0,
                 a = l.items.length; r < a; r++)
            this.add(l.items[r], {
                type: l.type
            });
    return c
}

function add(o, e) {
    var t = addedItems[o];
    return t || (t = this._createItem(o, e && e.type ? e.type : retrieve(o).type, e)),
    e && e.onLoad && t.onLoaded.addOnce(e.onLoad),
    this.itemUrls[o] || (this.itemUrls[o] = t,
        this.itemList.push(t),
        this.totalWeight += t.weight),
        t
}

function load$7(o, e) {
    var t = addedItems[o];
    return t || (t = this._createItem(o, e && e.type ? e.type : retrieve(o).type, e)),
    e && e.onLoad && t.onLoaded.addOnce(e.onLoad),
        loadedItems[o] ? t.dispatch() : t.isStartLoaded || t.load(),
        t
}

function start$1(o) {
    o && this.loadingSignal.add(o),
        this.isLoading = !0;
    var e = this.itemList.length;
    if (e) {
        var t = this.itemList.splice(0, this.itemList.length), r;
        for (var n in this.itemUrls)
            delete this.itemUrls[n];
        for (var a = 0; a < e; a++) {
            r = t[a];
            var l = !!loadedItems[r.url];
            r.onLoaded.addOnce(_onItemLoad, this, -1024, r, t, l),
            r.hasLoading && r.loadingSignal.add(_onLoading$1, this, -1024, r, t, undef$3),
                l ? r.dispatch(_onItemLoad) : r.isStartLoaded || this.queue.push(r)
        }
        this.queue.length && this.loadNext()
    } else
        _onItemLoad.call(this, undef$3, this.itemList)
}

function loadNext() {
    if (this.queue.length && this.activeItems.length < this.maxActiveItems) {
        var o = this.queue.shift();
        this.activeItems.push(o),
            this.loadNext(),
            o.load()
    }
}

function _onLoading$1(o, e, t, r, n) {
    o && !o.isLoaded && o.getCombinedPercent(r) === 1 || (n === undef$3 && (this.loadedWeight = _getLoadedWeight(e),
        n = this.loadedWeight / this.totalWeight),
        t = t || this.loadingSignal,
        t.dispatch(n, o))
}

function _getLoadedWeight(o) {
    for (var e = 0, t = 0, r = o.length; t < r; t++)
        e += o[t].loadedWeight;
    return e
}

function _onItemLoad(o, e, t) {
    if (this.loadedWeight = _getLoadedWeight(e),
        !t) {
        for (var r = this.activeItems, n = r.length; n--;)
            if (r[n] === o) {
                r.splice(n, 1);
                break
            }
    }
    var a = this.loadingSignal;
    this.loadedWeight === this.totalWeight ? (this.isLoading = !1,
        this.loadedWeight = 0,
        this.totalWeight = 0,
        this.loadingSignal = new MinSignal$1,
        this._onLoading(o, e, a, 1, 1),
    o && o.noCache && _removeItemCache(o)) : (this._onLoading(o, e, a, 1, this.loadedWeight / this.totalWeight),
    o && o.noCache && _removeItemCache(o),
    t || this.loadNext())
}

function _removeItemCache(o) {
    var e = o.url;
    o.content = undef$3,
        addedItems[e] = undef$3,
        loadedItems[e] = undef$3
}

function _createItem(o, e, t) {
    if (t = t || {},
        !t.crossOrigin) {
        for (var r in this.crossOriginMap)
            if (o.indexOf(r) === 0) {
                t.crossOrigin = this.crossOriginMap[r];
                break
            }
    }
    return new ITEM_CLASSES[e](o, t)
}

function register(o) {
    ITEM_CLASSES[o.type] || (ITEM_CLASS_LIST.push(o),
        ITEM_CLASSES[o.type] = o)
}

function retrieveAll(o, e) {
    var t, r, n = o.length, a = [];
    if (n && typeof o != "string")
        for (t = 0; t < n; t++)
            r = retrieve(o[t], e),
            r && (a = a.concat(r));
    else
        r = retrieve(o, e),
        r && (a = a.concat(r));
    return a
}

function retrieve(o, e) {
    var t, r, n, a, l;
    if (e)
        a = ITEM_CLASSES[e],
            n = a.retrieve(o);
    else
        for (t = 0,
                 r = ITEM_CLASS_LIST.length; t < r; t++) {
            if (a = ITEM_CLASS_LIST[t],
                l = a.type,
            typeof o == "string") {
                if (testExtensions(o, a)) {
                    n = [o];
                    break
                }
            } else if (n = a.retrieve(o),
            n && n.length && typeof n[0] == "string" && testExtensions(n[0], a))
                break;
            n = undef$3,
                l = undef$3
        }
    if (n)
        return {
            type: e || l,
            items: n
        }
}

function testExtensions(o, e) {
    if (o) {
        for (var t = _getExtension(o), r = e.extensions, n = r.length; n--;)
            if (t === r[n])
                return !0;
        return !1
    }
}

function _getExtension(o) {
    return o.split(".").pop().split(/#|\?/)[0]
}

function create() {
    return new QuickLoader
}

function check() {
    var o = []
        , e = [];
    for (var t in addedItems)
        o.push(t),
        loadedItems[t] || e.push(addedItems[t]);
    console.log({
        added: o,
        notLoaded: e
    })
}

var quickLoaderExports = quickLoader$b.exports
    , MinSignal = minSignalExports
    , quickLoader$a = quickLoaderExports;

function AbstractItem$6(o, e) {
    if (o) {
        this.url = o,
            this.loadedWeight = 0,
            this.weight = 1,
            this.postPercent = 0;
        for (var t in e)
            this[t] = e[t];
        this.type || (this.type = this.constructor.type),
        this.hasLoading && (this.loadingSignal = new MinSignal,
            this.loadingSignal.add(_onLoading, this),
        this.onLoading && this.loadingSignal.add(this.onLoading)),
            this.onPost ? (this.onPostLoadingSignal = new MinSignal,
                this.onPostLoadingSignal.add(this._onPostLoading, this),
                this.postWeightRatio = this.postWeightRatio || .1) : this.postWeightRatio = 0;
        var r = this;
        this.boundOnLoad = function () {
            r._onLoad()
        }
            ,
            this.onLoaded = new MinSignal,
            quickLoader$a.addedItems[o] = this
    }
}

var AbstractItem_1 = AbstractItem$6
    , _p$8 = AbstractItem$6.prototype;
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
}
;

function load$6() {
    this.isStartLoaded = !0
}

function _onLoad$6() {
    this.onPost ? this.onPost.call(this, this.content, this.onPostLoadingSignal) : this._onLoadComplete()
}

function _onPostLoading(o) {
    this.postPercent = o,
    this.hasLoading && this.loadingSignal.dispatch(1),
    o === 1 && this._onLoadComplete()
}

function _onLoadComplete() {
    this.isLoaded = !0,
        this.loadedWeight = this.weight,
        quickLoader$a.loadedItems[this.url] = this,
        this.onLoaded.dispatch(this.content)
}

function getCombinedPercent(o) {
    return o * (1 - this.postWeightRatio) + this.postWeightRatio * this.postPercent
}

function _onLoading(o) {
    this.loadedWeight = this.weight * this.getCombinedPercent(o)
}

function dispatch() {
    this.hasLoading && this.loadingSignal.remove(),
        this.onLoaded.dispatch(this.content)
}

var AbstractItem$5 = AbstractItem_1
    , quickLoader$9 = quickLoaderExports;

function __generateFuncName() {
    return "_jsonp" + new Date().getTime() + ~~(Math.random() * 1e8)
}

function JSONPItem(o) {
    o && _super$7.constructor.apply(this, arguments)
}

JSONPItem.type = "jsonp";
JSONPItem.extensions = [];
quickLoader$9.register(JSONPItem);
JSONPItem.retrieve = function (o) {
    return typeof o == "string" && o.indexOf("=") > -1 ? [o] : !1
}
;
var _super$7 = AbstractItem$5.prototype
    , _p$7 = JSONPItem.prototype = new AbstractItem$5;
_p$7.constructor = JSONPItem;
_p$7.load = load$5;

function load$5(o) {
    _super$7.load.apply(this, arguments);
    var e = this
        , t = this.url.lastIndexOf("=") + 1
        , r = this.url.substr(0, t)
        , n = this.url.substr(t);
    n.length === 0 ? (n = __generateFuncName(),
        this.jsonpCallback = o) : this.jsonpCallback = this.jsonpCallback || window[n],
        window[n] = function (l) {
            a.parentNode && a.parentNode.removeChild(a),
                e.content = l,
                e._onLoad()
        }
    ;
    var a = document.createElement("script");
    a.type = "text/javascript",
        a.src = r + n,
        document.getElementsByTagName("head")[0].appendChild(a)
}

var AbstractItem$4 = AbstractItem_1, quickLoader$8 = quickLoaderExports, undef$2,
    IS_SUPPORT_XML_HTTP_REQUEST = !!window.XMLHttpRequest;

function XHRItem$2(o) {
    o && (_super$6.constructor.apply(this, arguments),
        this.responseType = this.responseType || "",
        this.method = this.method || "GET")
}

var XHRItem_1 = XHRItem$2;
XHRItem$2.type = "xhr";
XHRItem$2.extensions = [];
quickLoader$8.register(XHRItem$2);
XHRItem$2.retrieve = function () {
    return !1
}
;
var _super$6 = AbstractItem$4.prototype
    , _p$6 = XHRItem$2.prototype = new AbstractItem$4;
_p$6.constructor = XHRItem$2;
_p$6.load = load$4;
_p$6._onXmlHttpChange = _onXmlHttpChange;
_p$6._onXmlHttpProgress = _onXmlHttpProgress;
_p$6._onLoad = _onLoad$5;

function load$4() {
    _super$6.load.apply(this, arguments);
    var o = this, e;
    IS_SUPPORT_XML_HTTP_REQUEST ? e = this.xmlhttp = new XMLHttpRequest : e = this.xmlhttp = new ActiveXObject("Microsoft.XMLHTTP"),
    this.hasLoading && (e.onprogress = function (t) {
            o._onXmlHttpProgress(t)
        }
    ),
        e.onreadystatechange = function () {
            o._onXmlHttpChange()
        }
        ,
        e.open(this.method, this.url, !0),
        this.xmlhttp.responseType = this.responseType,
        IS_SUPPORT_XML_HTTP_REQUEST ? e.send(null) : e.send()
}

function _onXmlHttpProgress(o) {
    this.loadingSignal.dispatch(o.loaded / o.total)
}

function _onXmlHttpChange() {
    this.xmlhttp.readyState === 4 && this.xmlhttp.status === 200 && this._onLoad(this.xmlhttp)
}

function _onLoad$5() {
    this.content || (this.content = this.xmlhttp.response),
        this.xmlhttp = undef$2,
        _super$6._onLoad.call(this)
}

var XHRItem$1 = XHRItem_1
    , quickLoader$7 = quickLoaderExports;

function TextItem$1(o, e) {
    o && (e.responseType = "text",
        _super$5.constructor.apply(this, arguments))
}

var TextItem_1 = TextItem$1;
TextItem$1.type = "text";
TextItem$1.extensions = ["html", "txt", "svg"];
quickLoader$7.register(TextItem$1);
TextItem$1.retrieve = function () {
    return !1
}
;
var _super$5 = XHRItem$1.prototype
    , _p$5 = TextItem$1.prototype = new XHRItem$1;
_p$5.constructor = TextItem$1;
_p$5._onLoad = _onLoad$4;

function _onLoad$4() {
    this.content || (this.content = this.xmlhttp.responseText),
        _super$5._onLoad.apply(this, arguments)
}

var TextItem = TextItem_1
    , quickLoader$6 = quickLoaderExports;

function JSONItem(o) {
    o && _super$4.constructor.apply(this, arguments)
}

JSONItem.type = "json";
JSONItem.extensions = ["json"];
quickLoader$6.register(JSONItem);
JSONItem.retrieve = function () {
    return !1
}
;
var _super$4 = TextItem.prototype
    , _p$4 = JSONItem.prototype = new TextItem;
_p$4.constructor = JSONItem;
_p$4._onLoad = _onLoad$3;

function _onLoad$3() {
    this.content || (this.content = window.JSON && window.JSON.parse ? JSON.parse(this.xmlhttp.responseText.toString()) : eval(this.xmlhttp.responseText.toString())),
        _super$4._onLoad.call(this)
}

var AbstractItem$3 = AbstractItem_1, quickLoader$5 = quickLoaderExports, undef$1;

function AudioItem$1(o, e) {
    if (o) {
        this.loadThrough = !e || e.loadThrough === undef$1 ? !0 : e.loadThrough,
            _super$3.constructor.apply(this, arguments);
        try {
            this.content = this.content || new Audio
        } catch {
            this.content = this.content || document.createElement("audio")
        }
        this.crossOrigin && (this.content.crossOrigin = this.crossOrigin)
    }
}

AudioItem$1.type = "audio";
AudioItem$1.extensions = ["mp3", "ogg"];
quickLoader$5.register(AudioItem$1);
AudioItem$1.retrieve = function (o) {
    return !1
}
;
var _super$3 = AbstractItem$3.prototype
    , _p$3 = AudioItem$1.prototype = new AbstractItem$3;
_p$3.constructor = AudioItem$1;
_p$3.load = load$3;
_p$3._onLoad = _onLoad$2;

function load$3() {
    _super$3.load.apply(this, arguments);
    var o = this
        , e = o.content;
    e.src = this.url,
        this.loadThrough ? e.addEventListener("canplaythrough", this.boundOnLoad, !1) : e.addEventListener("canplay", this.boundOnLoad, !1),
        e.load()
}

function _onLoad$2() {
    this.content.removeEventListener("canplaythrough", this.boundOnLoad, !1),
        this.content.removeEventListener("canplay", this.boundOnLoad, !1),
    !this.isLoaded && _super$3._onLoad.call(this)
}

var AbstractItem$2 = AbstractItem_1, quickLoader$4 = quickLoaderExports, undef;

function VideoItem(o, e) {
    if (o) {
        this.loadThrough = !e || e.loadThrough === undef ? !0 : e.loadThrough,
            _super$2.constructor.apply(this, arguments);
        try {
            this.content = this.content || new Video
        } catch {
            this.content = this.content || document.createElement("video")
        }
        this.crossOrigin && (this.content.crossOrigin = this.crossOrigin)
    }
}

VideoItem.type = "video";
VideoItem.extensions = ["mp4", "webm", "ogv"];
quickLoader$4.register(VideoItem);
VideoItem.retrieve = function (o) {
    return !1
}
;
var _super$2 = AbstractItem$2.prototype
    , _p$2 = VideoItem.prototype = new AbstractItem$2;
_p$2.constructor = VideoItem;
_p$2.load = load$2;
_p$2._onLoad = _onLoad$1;

function load$2() {
    _super$2.load.apply(this, arguments);
    var o = this.content;
    o.preload = "auto",
        o.src = this.url,
        this.loadThrough ? o.addEventListener("canplaythrough", this.boundOnLoad, !1) : o.addEventListener("canplay", this.boundOnLoad, !1),
        o.load()
}

function _onLoad$1() {
    this.content.removeEventListener("canplaythrough", this.boundOnLoad),
        this.content.removeEventListener("canplay", this.boundOnLoad),
    !this.isLoaded && _super$2._onLoad.call(this)
}

var AbstractItem$1 = AbstractItem_1
    , quickLoader$3 = quickLoaderExports;

function AnyItem$3(o, e) {
    o && (_super$1.constructor.call(this, o, e),
    !this.loadFunc && console && console[console.error || console.log]("require loadFunc in the config object."))
}

AnyItem$3.type = "any";
AnyItem$3.extensions = [];
quickLoader$3.register(AnyItem$3);
AnyItem$3.retrieve = function () {
    return !1
}
;
var _super$1 = AbstractItem$1.prototype
    , _p$1 = AnyItem$3.prototype = new AbstractItem$1;
_p$1.constructor = AnyItem$3;
_p$1.load = load$1;

function load$1() {
    var o = this;
    this.loadFunc(this.url, function (e) {
        o.content = e,
            _super$1._onLoad.call(o)
    }, this.loadingSignal)
}

function computedStyle$2(o, e, t, r) {
    if (t = window.getComputedStyle,
        r = t ? t(o) : o.currentStyle,
        r)
        return r[e.replace(/-(\w)/gi, function (n, a) {
            return a.toUpperCase()
        })]
}

var computedStyle_commonjs = computedStyle$2
    , AbstractItem = AbstractItem_1
    , computedStyle$1 = computedStyle_commonjs
    , quickLoader$2 = quickLoaderExports;

function ImageItem$1(o, e) {
    o && (_super.constructor.apply(this, arguments),
        this.content = this.content || new Image,
    this.crossOrigin && (this.content.crossOrigin = this.crossOrigin))
}

var _super = AbstractItem.prototype
    , _p = ImageItem$1.prototype = new AbstractItem;
_p.constructor = ImageItem$1;
_p.load = load;
_p._onLoad = _onLoad;
ImageItem$1.retrieve = function (o) {
    if (o.nodeType && o.style) {
        var e = [];
        o.nodeName.toLowerCase() === "img" && o.src.indexOf(";") < 0 && e.push(o.src),
            computedStyle$1(o, "background-image").replace(/s?url\(\s*?['"]?([^;]*?)['"]?\s*?\)/g, function (r, n) {
                e.push(n)
            });
        for (var t = e.length; t--;)
            _isNotData(e[t]) || e.splice(t, 1);
        return e.length ? e : !1
    } else
        return typeof o == "string" ? [o] : !1
}
;
ImageItem$1.type = "image";
ImageItem$1.extensions = ["jpg", "gif", "png"];
quickLoader$2.register(ImageItem$1);

function load() {
    _super.load.apply(this, arguments);
    var o = this.content;
    o.onload = this.boundOnLoad,
        o.src = this.url
}

function _onLoad() {
    delete this.content.onload,
        this.width = this.content.width,
        this.height = this.content.height,
        _super._onLoad.call(this)
}

function _isNotData(o) {
    return o.indexOf("data:") !== 0
}

var quickLoader = quickLoaderExports;
const quickLoader$1 = getDefaultExportFromCjs(quickLoader);
let computedStyle = getComputedStyle(document.documentElement);
const demo = quickLoader$1.create();
const XHRItem = demo.ITEM_CLASSES.xhr;
class BufItem extends XHRItem {
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
                a = r.indexCount, l = 4 + t, c = new THREE.BufferGeometry, u = r.attributes, f = !1, p = {};
            for (let _ = 0, T = u.length; _ < T; _++) {
                let M = u[_], S = M.id, b = S === "indices" ? a : n, C = M.componentSize, w = window[M.storageType],
                    R = new w(e, l, b * C), E = w.BYTES_PER_ELEMENT, I;
                if (M.needsPack) {
                    let O = M.packedComponents, k = O.length, L = M.storageType.indexOf("Int") === 0, F = 1 << E * 8,
                        se = L ? F * .5 : 0, V = 1 / F;
                    I = new Float32Array(b * C);
                    for (let Y = 0, D = 0; Y < b; Y++) for (let G = 0; G < k; G++) {
                        let H = O[G];
                        I[D] = (R[D] + se) * V * H.delta + H.from, D++
                    }
                } else p[S] = l, I = R;
                S === "normal" && (f = !0), S === "indices" ? c.setIndex(new THREE.BufferAttribute(I, 1)) : c.setAttribute(S, new THREE.BufferAttribute(I, C)), l += b * C * E
            }
            let g = r.meshType, v = [];
            if (r.sceneData) {
                let _ = r.sceneData, T = new THREE.Object3D, M = [],
                    S = g === "Mesh" ? 3 : g === "LineSegments" ? 2 : 1;
                for (let b = 0, C = _.length; b < C; b++) {
                    let w = _[b], R;
                    if (w.vertexCount == 0) R = new THREE.Object3D; else {
                        let E = new THREE.BufferGeometry, I = c.index, O = I.array, k = O.constructor,
                            L = k.BYTES_PER_ELEMENT;
                        E.setIndex(new THREE.BufferAttribute(new O.constructor(O.buffer, w.faceIndex * I.itemSize * L * S + (p.indices || 0), w.faceCount * I.itemSize * S), I.itemSize));
                        for (let F = 0, se = E.index.array.length; F < se; F++) E.index.array[F] -= w.vertexIndex;
                        for (let F in c.attributes) I = c.attributes[F], O = I.array, k = O.constructor, L = k.BYTES_PER_ELEMENT, E.setAttribute(F, new THREE.BufferAttribute(new O.constructor(O.buffer, w.vertexIndex * I.itemSize * L + (p[F] || 0), w.vertexCount * I.itemSize), I.itemSize));
                        g === "Mesh" ? R = new THREE.Mesh(E, new THREE.MeshNormalMaterial({flatShading: !f})) : g === "LineSegments" ? R = new THREE.LineSegments(E, new THREE.LineBasicMaterial) : R = new THREE.Points(E, new THREE.PointsMaterial({
                            sizeAttenuation: !1,
                            size: 2
                        })), M.push(R)
                    }
                    w.parentIndex > -1 ? v[w.parentIndex].add(R) : T.add(R), R.position.fromArray(w.position), R.quaternion.fromArray(w.quaternion), R.scale.fromArray(w.scale), R.name = w.name, R.userData.material = w.material, v[b] = R
                }
                c.userData.meshList = M, c.userData.sceneObject = T
            }
            this.content = c
        }
        this.xmlhttp = void 0, super._onLoad(this)
    }
}

BufItem.type = "buf";
BufItem.extensions = ["buf"];
BufItem.responseType = "arraybuffer";

export {quickLoader$1, MinSignal$2, BufItem}
