/**
 * justThreeJs postprocessing.js
 * @author kongjianqiu
 * @description
 * @created 2024/7/4 14:30:04
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

let _geom;
export default class Postprocessing {
    width = 1;
    height = 1;
    scene = null;
    camera = null;
    resolution = new THREE.Vector2(0, 0);
    texelSize = new THREE.Vector2(0, 0);
    aspect = new THREE.Vector2(1, 1);
    onBeforeSceneRendered = new MinSignal$2;
    onAfterSceneRendered = new MinSignal$2;
    onAfterRendered = new MinSignal$2;
    sceneRenderTarget = null;
    fromRenderTarget = null;
    toRenderTarget = null;
    useDepthTexture = !0;
    depthTexture = null;
    fromTexture = null;
    toTexture = null;
    sceneTexture = null;
    mesh = null;
    queue = [];
    shaderUniforms = {};
    geom;
    hasSizeChanged = !0;

    constructor(base) {
        this.base = base
    }

    init(e) {
        Object.assign(this, e)
        if (_geom) {
            this.geom = _geom
        } else {
            this.geom = _geom = new THREE.BufferGeometry
            this.geom.setAttribute("position", new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 4, -1, 0, -1, 4, 0]), 3))
            this.geom.setAttribute("a_uvClamp", new THREE.BufferAttribute(new Float32Array([0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1]), 4))
        }
        this.sceneFlatRenderTarget = this.base.fboHelper.createRenderTarget(1, 1)
        this.sceneFlatRenderTarget.depthBuffer = !0
        this.sceneMsRenderTarget = this.base.fboHelper.createMultisampleRenderTarget(1, 1)
        this.sceneMsRenderTarget.depthBuffer = !0
        this.fromRenderTarget = this.base.fboHelper.createRenderTarget(1, 1)
        this.toRenderTarget = this.fromRenderTarget.clone()
        this.useDepthTexture = !!this.useDepthTexture && this.base.fboHelper.renderer && (this.base.fboHelper.renderer.capabilities.isWebGL2 || this.base.fboHelper.renderer.extensions.get("WEBGL_depth_texture"))
        this.fromTexture = this.fromRenderTarget.texture
        this.toTexture = this.toRenderTarget.texture
        this.sceneRenderTarget = this.sceneMsRenderTarget
        this.sceneTexture = this.sceneMsRenderTarget.texture
        this.mesh = new THREE.Mesh
        this.shaderUniforms = Object.assign(this.shaderUniforms, {
            u_sceneTexture: {value: this.sceneTexture},
            u_fromTexture: {value: null},
            u_toTexture: {value: null},
            u_sceneDepthTexture: {value: null},
            u_cameraNear: {value: 0},
            u_cameraFar: {value: 1},
            u_cameraFovRad: {value: 1},
            u_resolution: {value: this.resolution},
            u_texelSize: {value: this.texelSize},
            u_aspect: {value: this.aspect}
        })
        if (this.useDepthTexture && this.base.fboHelper.renderer) {
            const t = new THREE.DepthTexture(this.resolution.width, this.resolution.height);
            this.base.fboHelper.renderer.capabilities.isWebGL2 ? t.type = THREE.UnsignedIntType : (t.format = THREE.DepthStencilFormat, t.type = THREE.UnsignedInt248Type)
            t.minFilter = THREE.NearestFilter
            t.magFilter = THREE.NearestFilter
            this.sceneFlatRenderTarget.depthTexture = t
            this.sceneMsRenderTarget.depthTexture = t
            this.depthTexture = this.shaderUniforms.u_sceneDepthTexture.value = t
        }
    }

    swap() {
        const e = this.fromRenderTarget;
        this.fromRenderTarget = this.toRenderTarget
        this.toRenderTarget = e
        this.fromTexture = this.fromRenderTarget.texture
        this.toTexture = this.toRenderTarget.texture
        this.shaderUniforms.u_fromTexture.value = this.fromTexture
        this.shaderUniforms.u_toTexture.value = this.toTexture
    }

    setSize(e, t) {
        if (this.width !== e || this.height !== t) {
            this.hasSizeChanged = !0
            this.width = e
            this.height = t
            this.resolution.set(e, t)
            this.texelSize.set(1 / e, 1 / t);
            const r = t / Math.sqrt(e * e + t * t) * 2;
            this.aspect.set(e / t * r, r)
            this.sceneFlatRenderTarget.setSize(e, t)
            this.sceneMsRenderTarget.setSize(e, t)
            this.fromRenderTarget.setSize(e, t)
            this.toRenderTarget.setSize(e, t)
        }
    }

    dispose() {
        this.fromRenderTarget && this.fromRenderTarget.dispose()
        this.toRenderTarget && this.toRenderTarget.dispose()
        this.sceneMsRenderTarget && this.sceneMsRenderTarget.dispose()
        this.sceneFlatRenderTarget && this.sceneFlatRenderTarget.dispose()
    }

    _filterQueue(e) {
        return e.enabled && e.needsRender()
    }

    renderMaterial(e, t) {
        this.mesh.material = e
        this.base.fboHelper.renderMesh(this.mesh, t)
    }

    checkSceneRt() {
        this.sceneRenderTarget = this.base.properties.isSmaaEnabled ? this.sceneFlatRenderTarget : this.sceneMsRenderTarget
        this.sceneTexture = this.sceneRenderTarget.texture
        this.shaderUniforms.u_sceneTexture.value = this.sceneTexture
    }

    render(e, t, r) {
        if (!this.base.fboHelper.renderer) return;
        this.scene = e
        this.camera = t
        this.mesh.geometry = this.geom;
        const n = this.queue.filter(this._filterQueue)
        const o = this.shaderUniforms;
        n.sort((l, c) => l.renderOrder == c.renderOrder ? 0 : l.renderOrder - c.renderOrder)
        this.checkSceneRt()
        o.u_cameraNear.value = t.near
        o.u_cameraFar.value = t.far
        o.u_cameraFovRad.value = t.fov / 180 * Math.PI
        this.onBeforeSceneRendered.dispatch()
        if (n.length) {
            this.base.fboHelper.renderer.setRenderTarget(this.sceneRenderTarget)
            this.base.fboHelper.renderer.render(e, t)
            this.base.fboHelper.renderer.setRenderTarget(null)
            this.base.fboHelper.copy(this.sceneRenderTarget.texture, this.fromRenderTarget)
            this.onAfterSceneRendered.dispatch(this.sceneRenderTarget);
            const l = this.base.fboHelper.getColorState();
            this.base.fboHelper.renderer.autoClear = !1;
            for (let c = 0, u = n.length; c < u; c++) {
                const f = c === u - 1 && r;
                const p = n[c];
                p.setPostprocessing(this)
                p.render(this, f)
            }
            this.base.fboHelper.setColorState(l)
        } else {
            this.base.fboHelper.renderer.render(e, t)
            this.onAfterSceneRendered.dispatch()
        }
        this.onAfterRendered.dispatch()
        this.hasSizeChanged = !1
    }
}
