function _sfc32(a, e, t, r) {
    return function () {
        a |= 0,
            e |= 0,
            t |= 0,
            r |= 0;
        var n = (a + e | 0) + r | 0;
        return r = r + 1 | 0,
            a = e ^ e >>> 9,
            e = t + (t << 3) | 0,
            t = t << 21 | t >>> 11,
            t = t + n | 0,
        (n >>> 0) / 4294967296
    }
}

function getSeedRandomFn(e) {
    let t = 1779033703
        , r = 3144134277
        , n = 1013904242
        , o = 2773480762;
    for (let l = 0, c; l < e.length; l++)
        c = e.charCodeAt(l),
            t = r ^ Math.imul(t ^ c, 597399067),
            r = n ^ Math.imul(r ^ c, 2869860233),
            n = o ^ Math.imul(n ^ c, 951274213),
            o = t ^ Math.imul(o ^ c, 2716044179);
    return _sfc32(Math.imul(n ^ t >>> 18, 597399067), Math.imul(o ^ r >>> 22, 2869860233), Math.imul(t ^ n >>> 17, 951274213), Math.imul(r ^ o >>> 19, 2716044179))
}

function mix(e, t, r) {
    return e + (t - e) * r
}


export default class Simple1DNoise {
    static MAX_VERTICES = 512;
    static MAX_VERTICES_MASK = Simple1DNoise.MAX_VERTICES - 1;
    _scale = 1;
    _amplitude = 1;
    _r = [];

    constructor(e) {
        let t = e ? getSeedRandomFn(e) : Math.random;
        for (let r = 0; r < Simple1DNoise.MAX_VERTICES; ++r) this._r.push(t() - .5)
    }

    getVal(e) {
        const t = e * this._scale, r = Math.floor(t), n = t - r, o = n * n * (3 - 2 * n),
            l = r & Simple1DNoise.MAX_VERTICES_MASK, c = l + 1 & Simple1DNoise.MAX_VERTICES_MASK;
        return mix(this._r[l], this._r[c], o) * this._amplitude
    }

    getFbm(e, t) {
        let r = 0, n = .5;
        for (let o = 0; o < t; o++) r += n * this.getVal(e), e *= 2, n *= .5;
        return r
    }

    get amplitude() {
        return this._amplitude
    }

    set amplitude(e) {
        this._amplitude = e
    }

    get scale() {
        return this._scale
    }

    set scale(e) {
        this._scale = e
    }
}