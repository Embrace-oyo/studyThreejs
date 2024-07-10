/**
 * justThreeJs fboHelper.js
 * @author kongjianqiu
 * @description
 * @created 2024/7/4 14:34:31
 */
import * as THREE from "three";
import blitVert from '@/views/example/common/trail/glsl/blitVert.glsl'
import blitFrag from '@/views/example/common/trail/glsl/blitFrag.glsl'
import uvBlitVert from '@/views/example/common/trail/glsl/uvBlitVert.glsl'
import clearFrag from '@/views/example/common/trail/glsl/clearFrag.glsl'
import debugVert from '@/views/example/common/trail/glsl/debugVert.glsl'

export default class FboHelper {
    isWebGL2;
    renderer;
    quadGeom;
    triGeom;
    floatType;
    precisionPrefix;
    precisionPrefix2;
    vertexShader;
    _scene;
    _camera;
    _tri;
    copyMaterial;
    uvCopyMaterial;
    clearMaterial;
    _debugScene;
    _debugMesh;
    _debugMaterial;

    constructor(base) {
        this.base = base
    }


    init(e, t) {
        this.renderer = e
        this.floatType = t
        this.isWebGL2 = this.renderer.capabilities.isWebGL2
        this._scene = new THREE.Scene
        this._camera = new THREE.Camera
        this._camera.position.z = 1
        this.triGeom = new THREE.BufferGeometry
        this.triGeom.setAttribute("position", new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 4, -1, 0, -1, 4, 0]), 3))
        this.quadGeom = new THREE.PlaneGeometry(2, 2)
        this._tri = new THREE.Mesh(this.triGeom)
        this._tri.frustumCulled = !1
        this._scene.add(this._tri)
        this.precisionPrefix = `precision ${this.renderer.capabilities.precision} float;
        `,
            this.precisionPrefix2 = `#version 300 es
			precision ${this.renderer.capabilities.precision} float;
			precision ${this.renderer.capabilities.precision} int;
			#define IS_WEBGL2 true
		`,
            this.isWebGL2 ? (this.vertexPrefix = `${this.precisionPrefix2}
				precision mediump sampler2DArray;
				#define attribute in
				#define varying out
				#define texture2D texture
			`,
                this.fragmentPrefix = `${this.precisionPrefix2}
				#define varying in
				out highp vec4 pc_fragColor;
				#define gl_FragColor pc_fragColor
				#define gl_FragDepthEXT gl_FragDepth
				#define texture2D texture
				#define textureCube texture
				#define texture2DProj textureProj
				#define texture2DLodEXT textureLod
				#define texture2DProjLodEXT textureProjLod
				#define textureCubeLodEXT textureLod
				#define texture2DGradEXT textureGrad
				#define texture2DProjGradEXT textureProjGrad
				#define textureCubeGradEXT textureGrad
			`) : (this.vertexPrefix = this.precisionPrefix, this.fragmentPrefix = this.precisionPrefix),
            this.renderer.getContext().getExtension("OES_standard_derivatives")
        this.vertexShader = this.precisionPrefix + blitVert
        this.copyMaterial = new THREE.RawShaderMaterial({
            uniforms: {u_texture: {value: null}},
            vertexShader: this.vertexShader,
            fragmentShader: this.precisionPrefix + blitFrag,
            depthTest: !1,
            depthWrite: !1,
            blending: THREE.NoBlending
        }),
            this.uvCopyMaterial = new THREE.RawShaderMaterial({
                uniforms: {u_texture: {value: null}},
                vertexShader: this.precisionPrefix + uvBlitVert,
                fragmentShader: this.precisionPrefix + blitFrag,
                depthTest: !1,
                depthWrite: !1,
                blending: THREE.NoBlending
            }), this.clearMaterial = new THREE.RawShaderMaterial({
            uniforms: {u_color: {value: new THREE.Vector4(1, 1, 1, 1)}},
            vertexShader: this.vertexShader,
            fragmentShader: this.precisionPrefix + clearFrag,
            depthTest: !1,
            depthWrite: !1,
            blending: THREE.NoBlending
        });
        const r = new THREE.PlaneGeometry(1, 1);
        r.translate(.5, -.5, 0), this._debugMaterial = new THREE.RawShaderMaterial({
            uniforms: {
                u_texture: {value: null},
                u_transform: {value: new THREE.Vector4(0, 0, 1, 1)}
            },
            vertexShader: this.precisionPrefix + debugVert,
            fragmentShader: this.precisionPrefix + blitFrag,
            depthTest: !1,
            depthWrite: !1,
            blending: THREE.NoBlending
        }), this._debugMesh = new THREE.Mesh(r, this._debugMaterial), this._debugScene = new THREE.Scene, this._debugScene.frustumCulled = !1, this._debugScene.add(this._debugMesh)
    }

    copy(e, t) {
        const r = this.copyMaterial;
        r && (r.uniforms.u_texture.value = e, this.render(r, t))
    }

    uvCopy(e, t) {
        const r = this.uvCopyMaterial;
        r && (r.uniforms.u_texture.value = e, this.render(r, t))
    }

    render(e, t) {
        this._tri && this.renderer && this._scene && this._camera && (this._tri.material = e, t && this.renderer.setRenderTarget(t), this.renderer.render(this._scene, this._camera))
    }

    renderGeometry(e, t, r) {
        this._tri && this.triGeom && (this._tri.geometry = e, this.render(t, r), this._tri.geometry = this.triGeom)
    }

    renderMesh(e, t, r = this._camera) {
        this._tri && this.renderer && this._scene && r && (this._tri.visible = !1, this._scene.add(e), t && this.renderer.setRenderTarget(t || null), this.renderer.render(this._scene, r), t && this.renderer.setRenderTarget(null), this._scene.remove(e), this._tri.visible = !0)
    }

    debugTo(e, t, r, n, o) {
        if (!(this.renderer && this._debugMaterial && this._debugScene && this._camera)) return;
        t = t || e.width || e.image.width, r = r || e.height || e.image.height, n = n || 0, o = o || 0;
        const l = this.renderer.getSize(new THREE.Vector2);
        n = n / l.width * 2 - 1, o = 1 - o / l.height * 2, t = t / l.width * 2, r = r / l.height * 2, this._debugMaterial.uniforms.u_texture.value = e, this._debugMaterial.uniforms.u_transform.value.set(n, o, t, r);
        const c = this.getColorState();
        this.renderer.autoClearColor = !1, this.renderer.setRenderTarget(null), this.renderer.render(this._debugScene, this._camera), this.setColorState(c)
    }

    parseDefines(e) {
        let t = "";
        for (const r in e) {
            const n = e[r];
            n === !0 ? t += `#define ${r}
` : t += `#define ${r} ${n}
`
        }
        return t
    }

    clearColor(e, t, r, n, o) {
        this.clearMaterial && (this.clearMaterial.uniforms.u_color.value.set(e, t, r, n), this.render(this.clearMaterial, o))
    }

    getColorState() {
        if (!this.renderer) return {
            autoClear: !0,
            autoClearColor: !0,
            autoClearStencil: !0,
            autoClearDepth: !0,
            clearColor: 0,
            clearAlpha: 1
        };
        const e = new THREE.Color;
        this.renderer.getClearColor(e)
        return {
            autoClear: this.renderer.autoClear,
            autoClearColor: this.renderer.autoClearColor,
            autoClearStencil: this.renderer.autoClearStencil,
            autoClearDepth: this.renderer.autoClearDepth,
            clearColor: e.getHex(),
            clearAlpha: this.renderer.getClearAlpha()
        }
    }

    setColorState(e) {
        if (this.renderer) {
            this.renderer.setClearColor(e.clearColor, e.clearAlpha)
            this.renderer.autoClear = e.autoClear
            this.renderer.autoClearColor = e.autoClearColor
            this.renderer.autoClearStencil = e.autoClearStencil
            this.renderer.autoClearDepth = e.autoClearDepth
        }
    }

    createRawShaderMaterial(e) {
        e = Object.assign({
            depthTest: !1,
            depthWrite: !1,
            blending: THREE.NoBlending,
            vertexShader: blitVert,
            fragmentShader: blitFrag,
            derivatives: !1
        }, e)
        e.vertexShader = (e.vertexShaderPrefix ? e.vertexShaderPrefix : e.derivatives ? this.vertexPrefix : this.precisionPrefix) + e.vertexShader, e.fragmentShader = (e.fragmentShaderPrefix ? e.fragmentShaderPrefix : e.derivatives ? this.fragmentPrefix : this.precisionPrefix) + e.fragmentShader
        delete e.vertexShaderPrefix,
            delete e.fragmentShaderPrefix,
            delete e.derivatives;
        let t = new THREE.RawShaderMaterial(e);
        this.base.taskManager.add(t)
        return t
    }

    createDataTexture(e, t, r, n = !1, o = !0) {
        let l = new THREE.DataTexture(e, t, r, THREE.RGBAFormat, n ? THREE.FloatType : THREE.UnsignedByteType, THREE.UVMapping, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, o ? THREE.NearestFilter : THREE.LinearFilter, o ? THREE.NearestFilter : THREE.LinearFilter, 0);
        return l.needsUpdate = !0, l
    }

    createRenderTarget(e, t, r = !1, n = !1, o = 0) {
        return new THREE.WebGLRenderTarget(e, t, {
            wrapS: THREE.ClampToEdgeWrapping,
            wrapT: THREE.ClampToEdgeWrapping,
            magFilter: r ? THREE.NearestFilter : THREE.LinearFilter,
            minFilter: r ? THREE.NearestFilter : THREE.LinearFilter,
            type: typeof n == "boolean" ? n ? this.floatType : THREE.UnsignedByteType : n,
            anisotropy: 0,
            encoding: THREE.LinearEncoding,
            depthBuffer: !1,
            stencilBuffer: !1,
            samples: this.base.browser.isSupportMSAA ? o : 0
        })
    }

    createMultisampleRenderTarget(e, t, r = !1, n = !1, o = 8) {
        return !(this.renderer && this.isWebGL2) || !this.base.browser.isSupportMSAA ? this.createRenderTarget(e, t, r, n) : new THREE.WebGLRenderTarget(e, t, {
            wrapS: THREE.ClampToEdgeWrapping,
            wrapT: THREE.ClampToEdgeWrapping,
            magFilter: r ? THREE.NearestFilter : THREE.LinearFilter,
            minFilter: r ? THREE.NearestFilter : THREE.LinearFilter,
            type: n ? this.floatType : THREE.UnsignedByteType,
            anisotropy: 0,
            encoding: THREE.LinearEncoding,
            depthBuffer: !1,
            stencilBuffer: !1,
            samples: o
        })
    }

    clearMultisampleRenderTargetState(e) {
        if (e = e || this.renderer.getRenderTarget(), e && e.samples > 0) {
            const t = this.renderer.properties.get(e);
            let r = this.renderer.getContext();
            r.bindFramebuffer(r.READ_FRAMEBUFFER, t.__webglMultisampledFramebuffer), r.bindFramebuffer(r.DRAW_FRAMEBUFFER, t.__webglFramebuffer);
            const n = e.width, o = e.height;
            let l = r.COLOR_BUFFER_BIT;
            e.depthBuffer && (l |= r.DEPTH_BUFFER_BIT), e.stencilBuffer && (l |= r.STENCIL_BUFFER_BIT), r.blitFramebuffer(0, 0, n, o, 0, 0, n, o, l, r.NEAREST), r.bindFramebuffer(r.FRAMEBUFFER, t.__webglMultisampledFramebuffer)
        }
    }
}
