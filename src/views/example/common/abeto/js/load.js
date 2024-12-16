/**
 * justThreeJs load.js
 * @author kongjianqiu
 * @description
 * @created 2024/11/28 15:51:23
 */

const Vv = new QM
const Oc = new rw().setWorkerLimit(1)
const qf = new pw().setWorkerLimit(1)
const xw = new Za(.5, .5, .5)
const Vs = {
    _geometryCache: new Map,
    _initLoad(i, e) {
        return this._geometryCache.has(i) || this._geometryCache.set(i, new Promise(e)),
            this._geometryCache.get(i)
    },
    load(i, e = "default") {
        return this._initLoad(`${i}_<>_${e}`, async t => {
                const n = i.split(".").pop();
                let s = null;
                try {
                    n.startsWith("drc") || n.startsWith("bin") ? s = await Oc.loadAsync(i) : s = await Vv.loadAsync(i),
                        s._loadMode = e,
                        t(s)
                } catch (r) {
                    console.log("Geometry loader", r),
                        t(xw)
                }
            }
        )
    },
    instanced(i, e, t = "load") {
        return this._initLoad(`instanced_<>_${i}-${e}`, async n => {
                const [s, r] = await Promise.all([this[t](i), this.load(e)]);
                n(Uv(s, r))
            }
        )
    },
    instancedPatches(i, e, {maxPerPatch: t = 25, maxDistance: n = 50} = {}, s = "load") {
        return this._initLoad(`instancedPatches_<>_${i}-${e}-${t}-${n}`, async r => {
                const [a, o] = await Promise.all([this[s](i), this.load(e)]);
                r(aw(a, o, {
                    maxPerPatch: t,
                    maxDistance: n,
                    name: e
                }))
            }
        )
    },
    vertexAnimation(i) {
        return this._initLoad(`vertexanimation_<>_${i}`, async e => {
                const t = await this.load(i);
                e(lw(t))
            }
        )
    },
    curves(i, e = !1, t = 1) {
        return this._initLoad(`curves_<>_${i}_${e}_${t}`, async n => {
                const s = await this.load(i);
                n(cw(s, t, e))
            }
        )
    },
    pointAnimation(i) {
        return this._initLoad(`pointAnimation_<>_${i}}`, async e => {
                const t = await this.load(i);
                e(new gw(t))
            }
        )
    },
    skin(i, e) {
        return this._initLoad(`skin_<>_${i}-${e}`, async t => {
                const [n, s] = await Promise.all([this.load(i), this.load(e)]);
                t(uw(n, s))
            }
        )
    },
    skinAnimation(i) {
        return this._initLoad(`skinanimation_<>_${i}`, async e => {
                const t = await this.load(i);
                e(vw(i, t))
            }
        )
    },
    msdf(i) {
        return qf.loadAsync(i)
    }
};

function aw(i, e, t) {
    const n = Object.keys(e.attributes)
        , s = e.attributes.position
        , r = s.count
        , a = Array.from(Array(r).keys())
        , o = []
        , l = [];
    let c = 0;
    const h = [];
    for (; a.length > 0; ) {
        o.push(c),
            h.push(c),
            a.splice(a.indexOf(c), 1),
            Gm.fromBufferAttribute(s, c);
        let u = null
            , d = 1 / 0
            , f = !1;
        if (a.forEach(A => {
                Nm.fromBufferAttribute(s, A);
                const g = Nm.distanceToSquared(Gm);
                g < d && (u = A,
                    d = g)
            }
        ),
        u && (c = u,
        Math.sqrt(d) < t.maxDistance && (f = !0)),
        h.length > 0 && (h.length === t.maxPerPatch || !f || o.length === r)) {
            const A = new Gt;
            n.forEach(g => {
                    const p = e.attributes[g]
                        , m = new Float32Array(p.itemSize * h.length);
                    for (let x = 0; x < h.length; x++) {
                        const v = h[x] * p.itemSize
                            , y = [];
                        for (let M = 0; M < p.itemSize; M++)
                            y.push(p.array[v + M]);
                        m.set(y, x * p.itemSize)
                    }
                    A.setAttribute(g, new ke(m,p.itemSize))
                }
            ),
                l.push(Uv(i, A)),
                h.length = 0
        }
    }
    return l
}

function cw(i, e, t) {
    const n = [];
    return Object.values(i.attributes).forEach(r => {
            const a = r.count
                , o = r.array
                , l = [];
            for (let u = 0; u < a; u++)
                l.push(new w(o[u * 3 + 0],o[u * 3 + 1],o[u * 3 + 2]));
            const c = new SM;
            for (let u = 0; u < l.length - 1; u++)
                c.add(new a0(l[u],l[u + 1]));
            t && (c.autoClose = !0);
            const h = c.getPoints(Math.round(c.getLength() * 10 * e));
            n.push({
                curve: c,
                geometry: new Gt().setFromPoints(h)
            })
        }
    ),
        n
}

function lw(i) {
    const e = i.userData
        , t = Object.keys(i.attributes)
        , n = t.filter(o => o.slice(-2) === "_1").map(o => o.substring(0, o.length - 2))
        , s = t.filter(o => o.slice(-2) === "_2").map(o => o.substring(0, o.length - 2))
        , r = new Gt;
    i.index && r.setIndex(i.index.clone()),
        n.forEach(o => {
                r.setAttribute(o, i.attributes[`${o}_1`].clone())
            }
        );
    const a = {};
    if (s.length > 0) {
        const o = i.attributes[`${s[0]}_1`].count
            , l = o * e.frames
            , c = Math.max(2, ge.ceilPowerOfTwo(Math.sqrt(l)))
            , h = c * c;
        a.uAnimInfo = {
            value: new ot(e.fps,e.frames,o,c),
            ignore: !0
        };
        const u = new Float32Array(o);
        for (let d = 0; d < u.length; d++)
            u[d] = d;
        r.setAttribute("vposition", new ke(u,1)),
            s.forEach(d => {
                    const f = new Float32Array(h * 4);
                    for (let g = 0; g < e.frames; g++) {
                        const p = i.attributes[`${d}_${g + 1}`].array;
                        for (let m = 0; m < o; m++) {
                            const x = g * o * 4 + m * 4
                                , v = m * 3;
                            f[x + 0] = p[v + 0],
                                f[x + 1] = p[v + 1],
                                f[x + 2] = p[v + 2],
                                f[x + 3] = 1
                        }
                    }
                    const A = new ln(f,c,c,lt,Tt);
                    A.needsUpdate = !0,
                        a[`t${ow(d)}`] = {
                            value: A
                        }
                }
            )
    }
    return r.__vertexAnimationUniforms = a,
        r
}

class gw {
    constructor(e) {
        const t = e.userData;
        this._frames = t.frames,
            this._fps = t.fps,
            this._duration = this._frames / this._fps,
            this._attribs = e.attributes,
            this._camTargetDistance = 1,
            this._object = null,
            this._animationVar = 0,
            this._animation = Qi.to(this, {
                _animationVar: 1,
                duration: this._duration,
                ease: "none",
                paused: !0,
                callbackScope: this,
                onUpdate: this._onUpdate
            })
    }
    _onUpdate() {
        if (!this._object)
            return;
        const e = this._frames - 1
            , t = ge.clamp(e * this._animationVar, 0, e)
            , n = Math.floor(t)
            , s = Math.ceil(t)
            , r = Math.abs(t - n);
        this._object.isCamera && uo.identity(),
            Aw.forEach(a => {
                    const o = this._attribs[a];
                    if (!(!o || !this._object[a]) && !(this._object.isCamera && a === "scale"))
                        switch (a) {
                            case "scale":
                                o.itemSize === 1 ? this._object.scale.setScalar(ge.lerp(o.array[n], o.array[s], r)) : this._object.scale.fromArray(o.array, n * 3).lerp(Vu.fromArray(o.array, s * 3), r);
                                break;
                            case "quaternion":
                                nc.fromArray(o.array, n * 4).normalize(),
                                    Um.fromArray(o.array, s * 4).normalize(),
                                    nc.slerp(Um, r),
                                    this._object.isCamera ? uo.copy(nc) : this._object.quaternion.copy(nc);
                                break;
                            case "position":
                                this._object[this._object.isCamera ? "basePosition" : "position"].fromArray(o.array, n * 3).lerp(Vu.fromArray(o.array, s * 3), r);
                                break
                        }
                }
            ),
        this._object.isCamera && !uo.equals(mw) && (this._object.baseTarget.set(0, 0, -this._camTargetDistance).applyQuaternion(uo).add(this._object.basePosition),
            this._object.baseUp.set(0, 1, 0).applyQuaternion(uo))
    }
    use(e, t=!0) {
        return this._object = e,
        this._object.isCamera && t && (this._camTargetDistance = Vu.copy(this._object.baseTarget).sub(this._object.basePosition).length()),
            this.progress(0)
    }
    play() {
        return this._animation.play()
    }
    pause() {
        return this._animation.pause()
    }
    progress(e=0) {
        return this._animation.progress(e)
    }
    restart() {
        return this._animation.restart()
    }
    dispose() {
        this._animation.kill(),
            this._object = null
    }
}

function uw(i, e) {
    const t = [];
    for (let a = 0; a < e.attributes.position.count; a++) {
        const o = new Sf;
        o.name = `bone_${a}`,
            o.position.fromArray(e.attributes.position.array, a * 3),
            o.quaternion.fromArray(e.attributes.quaternion.array, a * 4).normalize(),
            o.scale.fromArray(e.attributes.scale.array, a * 3),
            t.push(o)
    }
    const n = [];
    for (let a = 0; a < e.attributes.hierarchy.count; a++) {
        const o = e.attributes.hierarchy.array[a] - 1;
        o === -1 ? n.push(a) : t[o].add(t[a])
    }
    const s = new Lh(t)
        , r = new e0(i,hw);
    return n.forEach(a => r.add(s.bones[a])),
        r.bind(s),
        r.normalizeSkinWeights(),
        r
}

function vw(i, e) {
    const t = e.userData
        , n = t.frames
        , s = e.attributes.position.count / n
        , r = n / t.fps
        , a = r / (n - 1)
        , o = new Array(n).fill(0).map( (u, d) => d * a)
        , l = {};
    ["position", "quaternion", "scale"].forEach(u => {
            const d = e.attributes[u].array
                , f = e.attributes[u].itemSize;
            for (let A = 0; A < s; A++) {
                const g = `bone_${A}.${u}`;
                l[g] = {
                    size: f,
                    arr: []
                };
                for (let p = 0; p < n; p++) {
                    const m = p * s * f;
                    for (let x = 0; x < f; x++)
                        l[g].arr.push(d[m + A * f + x])
                }
            }
        }
    );
    const c = [];
    return Object.keys(l).forEach(u => {
            const d = l[u].size === 4 ? Us : Mr;
            c.push(new d(u,o,l[u].arr,_r))
        }
    ),
        new c0(i,r,c)
}

