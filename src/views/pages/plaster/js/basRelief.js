/**
 * justThreeJs basRelief.js
 * @author kongjianqiu
 * @description
 * @created 2025/3/17 15:55:55
 */

// class Ha extends It
// _createHomeReliefComponent
// class Gu extends $(Z)
// class ku {


import * as THREE from "three";
import gsap from "gsap";
import FlowMap from "@/views/pages/plaster/js/flowMap.js";

import plasterVertex from '@/views/pages/plaster/glsl/plaster/vertex.glsl'
import plasterFragment from '@/views/pages/plaster/glsl/plaster/fragment.glsl'

import modelVertex from '@/views/pages/plaster/glsl/model/vertex.glsl'
import modelFragment from '@/views/pages/plaster/glsl/model/fragment.glsl'

const Ei = 9.995
const $o = 1.33

function re(t, l, a) {
    return (1 - a) * t + a * l
}

export default class BasRelief {
    constructor(base) {
        this.base = base;
        this.config = {
            scroll: {
                speed: .25
            },
            flowmap: {
                mouseEase: .4,
                dissipation: .953,
                falloff: .38,
                alpha: 1
            },
            extrude: {
                textureStrength: 1,
                gradientStrength: .17
            },
            camera: {
                fov: 30,
                distance: 15,
                fastModeZoom: .6,
                slowModeZoom: 1,
                near: 5,
                far: 20
            },
            scrollExtrude: {
                noiseSize: 7.77,
                speed: 2,
                mask: {
                    min: -1,
                    max: 1
                },
                strength: 1.02
            },
            particles: {},
            chromaticMask: {
                fresnelSharpness: 35,
                fresnelOpacity: .98,
                shadowRange: {
                    min: .2,
                    max: .42
                },
                shadowOpacity: .25
            },
            fluidEffect: {
                amplitude: .57,
                shadowStrength: .3,
                baseColor: {
                    r: 122,
                    g: 191,
                    b: 197
                },
                baseThreshold: 1,
                fluidMagnitude: .15,
                fluidRedCoef: 2,
                fluidGreenCoef: 1,
                fluidBlueCoef: 1.5,
                linesSpeed: 2,
                linesScale: 4,
                linesStrength: 0,
                linesWaveLength: .15,
                hueShift: -.52,
                colorRange: 2
            }
        }
        // this.view = t
        this.isPaused = !1
        this.viewport = null
        this._isMobile = false
        this._effectParams = {
            showEffectFluid: !1,
            showEffectColors: !1,
            showEffectLines: !1
        }
        this._state = {
            cameraZoom: 1
        }
        this.scrollOffset = 0
        this.randomMouseMovementTimeline = null
        // this.debug = this.createDebug(i)
        this.createReliefScene()
        this.initReliefContent()
        this.onConfigUpdated();
        this.loopRandomMouseMovement();
        this.onWindowResize({
            innerWidth: this.base.width,
            innerHeight: this.base.height,
            renderWidth: this.base.width,
            renderHeight: this.base.height
        })
    }

    createReliefScene() {
        this.camera = this.base.camera;
        this.scene = this.base.scene;
        this.renderer = this.base.renderer;
        this.tMaskNoise = {value: this.base.maskNoise};
        this.tMaskNoise.value.wrapS = this.tMaskNoise.value.wrapT = THREE.RepeatWrapping
        this.tPlaster = {value: this.base.plasterTexture};
        this.tPlaster.value.wrapS = this.tPlaster.value.wrapT = THREE.RepeatWrapping
        this.tFluidFlowmap = {
            value: null
        }
        this.uScreen = {
            value: new THREE.Vector2()
        }
        this.uResolution = {
            value: new THREE.Vector2()
        }
        this.uAspect = {
            value: 1
        }
        this.uDPR = {
            value: window.devicePixelRatio
        }
        this.uTime = {
            value: 0
        }
        this.uScroll = {
            value: 0
        }
        this.uScreenScroll = {
            value: 0
        }
        this.uScrollSpeed = {
            value: 0
        }
        this.uTransition = {
            value: 0
        }
        this.uTextureStrength = {
            value: 1
        }
        this.uGradientStrength = {
            value: 1
        }
        this.tDepth = {
            value: null
        }
        this.tRelief = {
            value: null
        }
        this.uFastScroll = {
            value: 0
        }
        this.uSwitchColorFastScroll = {
            value: 0
        }
        this.uOpacity = {
            value: 1
        }
        this.uSwitchColorTransition = {
            value: 0
        }
        this.scrollLast = 0
        this.scrollDelta = 0
        this.flowmap = new FlowMap(this.renderer, this.tMaskNoise, this.uTime)
        this.tFlow = this.flowmap.uniform
    }

    initReliefContent() {
        this.plasterGeometry = new THREE.BufferGeometry();
        this.plasterGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3))
        this.plasterGeometry.setAttribute("uv", new THREE.BufferAttribute(new Float32Array([0, 0, 2, 0, 0, 2]), 2))
        this.plasterMaterial = new THREE.RawShaderMaterial({
            vertexShader: plasterVertex,
            fragmentShader: plasterFragment,
            uniforms: {
                uGradientStrength: this.uGradientStrength,
                tPlaster: this.tPlaster,
                uTextureStrength: this.uTextureStrength
            },
            depthWrite: false,
            depthTest: false
        });
        this.plaster = new THREE.Mesh(this.plasterGeometry, this.plasterMaterial);
        this.plaster.frustumCulled = !1
        this.plaster.renderOrder = -1;
        this.plaster.material.needsUpdate = true;
        this.scene.add(this.plaster)
        this.sections = []
        this.sectionsPerLine = 1;
        const e = {}
        const t = [];
        const model = this.base.reliefsModel;
        model.children.forEach((item) => {
            if (!item.geometry) return;
            const mesh = new THREE.Mesh();
            mesh.geometry = item.geometry;
            mesh.position.copy(item.position)
            mesh.scale.copy(item.scale);
            const a = Math.round(item.position.y);
            e[a] || (e[a] = 0)
            e[a]++
            e[a] > this.sectionsPerLine && (this.sectionsPerLine = e[a])
            t.includes(a) || t.push(a);
            const r = t.indexOf(a)
            const l = {
                value: item.material.map
            }
            const h = {
                value: item.material.emissiveMap
            }
            const m = this.base.attenuation;
            m.wrapS = m.wrapT = THREE.MirroredRepeatWrapping;
            const material = new THREE.ShaderMaterial({
                vertexShader: modelVertex,
                fragmentShader: modelFragment,
                uniforms: {
                    uResolution: this.uResolution,
                    uAspect: this.uAspect,
                    uDPR: this.uDPR,
                    uTime: this.uTime,
                    uScroll: this.uScroll,
                    uScrollSpeed: this.uScrollSpeed,
                    uScreenScroll: this.uScreenScroll,
                    uOpacity: this.uOpacity,
                    uSwitchColorTransition: this.uSwitchColorTransition,
                    tMaskNoise: {
                        value: m
                    },
                    tFlow: this.tFlow,
                    uTransition: this.uTransition,
                    tPlaster: this.tPlaster,
                    uTextureStrength: this.uTextureStrength,
                    uGradientStrength: this.uGradientStrength,
                    uSwitchColorFastScroll: this.uSwitchColorFastScroll,
                    tFluidFlowmap: this.tFluidFlowmap,
                    uFastScroll: this.uFastScroll,
                    uBrightnessFactor: {
                        value: this._isMobile ? .5 : .6
                    },
                    uBrightnessOffset: {
                        value: this._isMobile ? .6 : .4
                    },
                    tBake1: l,
                    tBake2: h
                },
                defines: {
                    SHOW_EFFECT_FLUID: 0,
                    SHOW_EFFECT_COLORS: 0,
                    SHOW_EFFECT_LINES: 0,
                    EFFECT_AMPLITUDE: 0,
                    EFFECT_SHADOW_STRENGTH: 0,
                    EFFECT_FLUID_MAGNITUDE: 0,
                    EFFECT_FLUID_RED_COEF: 0,
                    EFFECT_FLUID_GREEN_COEF: 0,
                    EFFECT_FLUID_BLUE_COEF: 0,
                    EFFECT_LINES_SPEED: 0,
                    EFFECT_LINES_SCALE: 0,
                    EFFECT_LINES_STRENGTH: 0,
                    EFFECT_LINES_WAVE_LENGTH: 0,
                    EFFECT_BASE_COLOR: 0,
                    EFFECT_BASE_THRESHOLD: 0,
                    EFFECT_HUE_SHIFT: 0,
                    EFFECT_COLOR_RANGE: 0,
                    CHROMATIC_FRESNEL_SHARPNESS: 0,
                    CHROMATIC_FRESNEL_OPACITY: 0,
                    CHROMATIC_SHADOW_RANGE: 0,
                    CHROMATIC_SHADOW_OPACITY: 0,
                    SCROLL_EXTRUDE_NOISE_SIZE: 0,
                    SCROLL_EXTRUDE_SPEED: 0,
                    SCROLL_EXTRUDE_MASK: 0,
                    SCROLL_EXTRUDE_STRENGTH: 0
                }
            })
            mesh.material = material;
            mesh.renderOrder = r
            this.sections.push(mesh)
            this.scene.add(mesh)
        })
    }

    onConfigUpdated() {
        function Hl(u, i) {
            return i.set(parseInt(u.substring(1, 3), 16) / 255, parseInt(u.substring(3, 5), 16) / 255, parseInt(u.substring(5, 7), 16) / 255, parseInt(u.substring(7, 9), 16) / 255)
        }

        function Yl(u, i = 4) {
            return Number(u.toFixed(i))
        }

        function ye(u, i = 4) {
            const e = Yl(u, i);
            return Number.isInteger(e) ? `${e}.` : e.toString()
        }

        function hi(u, i = 4) {
            return `vec3(${ye(u.r, i)}, ${ye(u.g, i)}, ${ye(u.b, i)})`
        }

        function wo(u, i = 4) {
            return `vec4(${ye(u.x, i)}, ${ye(u.y, i)}, ${ye(u.z, i)}, ${ye(u.w, i)})`
        }

        function ts(u, i = 4) {
            return `vec3(${ye(u.x, i)}, ${ye(u.y, i)}, ${ye(u.z, i)})`
        }

        function qt(u, i = 4) {
            return `vec2(${ye(u.x, i)}, ${ye(u.y, i)})`
        }

        function Gl(u, i = 4) {
            return `vec3(${ye(u.r / 255, i)}, ${ye(u.g / 255, i)}, ${ye(u.b / 255, i)})`
        }

        const Vl = new THREE.Vector4()
        const Wl = new THREE.Vector2()
        const $l = new THREE.Color();

        function jl(u, i) {
            if (typeof u == "number")
                return ye(u, i);
            if (typeof u == "string" && u.startsWith("#"))
                return u.length === 9 ? wo(Hl(u, Vl)) : hi($l.set(u));
            if (typeof u == "string")
                return u;
            if (typeof u == "boolean")
                return u;
            if ("w" in u)
                return wo(u);
            if ("z" in u)
                return ts(u);
            if ("y" in u)
                return qt(u);
            if ("r" in u)
                return Gl(u);
            if ("min" in u)
                return qt(Wl.set(u.min, u.max))
        }

        function ql(u, i, e, t = !1) {
            if (!u.defines)
                return !1;
            const s = u.defines[i] !== e;
            return u.defines[i],
            i in u.defines && s && (u.defines[i] = e),
                s
        }

        function Oe(u, i, e) {
            let t = !1;
            for (const s in i)
                if (Object.prototype.hasOwnProperty.call(i, s)) {
                    const o = i[s]
                        , n = jl(o, (e == null ? void 0 : e.precision) || 4)
                        , a = ql(u, s, n, e == null ? void 0 : e.warn);
                    t || (t = a)
                }
            u.needsUpdate = t
        }

        this.camera.position.z = this.config.camera.distance
        this.camera.near = this.config.camera.near
        this.camera.far = this.config.camera.far
        this.camera.updateProjectionMatrix()
        this.flowmap.setDissipation(this.config.flowmap.dissipation)
        this.flowmap.setFalloff(this.config.flowmap.falloff)
        this.flowmap.setAlpha(this.config.flowmap.alpha)
        this.uTextureStrength.value = this.config.extrude.textureStrength
        this.uGradientStrength.value = this.config.extrude.gradientStrength
        this.sections.forEach(i => {
                Oe(i.material, {
                    CHROMATIC_FRESNEL_SHARPNESS: this.config.chromaticMask.fresnelSharpness,
                    CHROMATIC_FRESNEL_OPACITY: this.config.chromaticMask.fresnelOpacity,
                    CHROMATIC_SHADOW_RANGE: this.config.chromaticMask.shadowRange,
                    CHROMATIC_SHADOW_OPACITY: this.config.chromaticMask.shadowOpacity,
                    SHOW_EFFECT_FLUID: this._effectParams.showEffectFluid,
                    SHOW_EFFECT_COLORS: this._effectParams.showEffectColors,
                    SHOW_EFFECT_LINES: this._effectParams.showEffectLines,
                    EFFECT_AMPLITUDE: this.config.fluidEffect.amplitude,
                    EFFECT_SHADOW_STRENGTH: this.config.fluidEffect.shadowStrength,
                    EFFECT_FLUID_MAGNITUDE: this.config.fluidEffect.fluidMagnitude,
                    EFFECT_FLUID_RED_COEF: this.config.fluidEffect.fluidRedCoef,
                    EFFECT_FLUID_GREEN_COEF: this.config.fluidEffect.fluidGreenCoef,
                    EFFECT_FLUID_BLUE_COEF: this.config.fluidEffect.fluidBlueCoef,
                    EFFECT_LINES_SPEED: this.config.fluidEffect.linesSpeed,
                    EFFECT_LINES_SCALE: this.config.fluidEffect.linesScale,
                    EFFECT_LINES_STRENGTH: this.config.fluidEffect.linesStrength,
                    EFFECT_LINES_WAVE_LENGTH: this.config.fluidEffect.linesWaveLength,
                    EFFECT_BASE_COLOR: this.config.fluidEffect.baseColor,
                    EFFECT_BASE_THRESHOLD: this.config.fluidEffect.baseThreshold,
                    EFFECT_HUE_SHIFT: this.config.fluidEffect.hueShift,
                    EFFECT_COLOR_RANGE: this.config.fluidEffect.colorRange,
                    SCROLL_EXTRUDE_NOISE_SIZE: this.config.scrollExtrude.noiseSize,
                    SCROLL_EXTRUDE_SPEED: this.config.scrollExtrude.speed,
                    SCROLL_EXTRUDE_MASK: this.config.scrollExtrude.mask,
                    SCROLL_EXTRUDE_STRENGTH: this.config.scrollExtrude.strength
                })
            }
        )
    }

    loopRandomMouseMovement() {
        var i;
        (i = this.randomMouseMovementTimeline) == null || i.kill(),
            this.randomMouseMovementTimeline = this.triggerRandomMouseMovement(),
            this.randomMouseMovementTimeline.call(() => {
                    this.loopRandomMouseMovement()
                }
                , null, "+=" + re(1, 3, Math.random()).toFixed(2))
    }

    triggerRandomMouseMovement() {
        this.flowmap.velocity2.x = 1,
            this.flowmap.velocity2.y = 1;
        const i = Math.floor(Math.random() * 3) + 1;
        let e = null;
        const t = gsap.timeline();
        for (let s = 0; s < i; s++) {
            const n = !(s === i - 1) && Math.random() < .7
                , a = n ? re(.8, 1, Math.random()) : re(.7, .8, Math.random())
                , r = this.createRandomDirections(e)
                , l = {
                duration: a,
                ease: `rough({
					strength: ${n ? 3 : 2},
					points: ${Math.floor(a * 12)},
					template: ${n ? "power2.out" : "none"},
					taper: none,
					randomize: true,
					clamp: true
				})`
            };
            t.fromTo(this.flowmap.mouse2, {
                x: r.start.x / 2 + .5
            }, {
                x: r.end.x / 2 + .5,
                ...l
            }),
                t.fromTo(this.flowmap.mouse2, {
                    y: r.start.y / 2 + .5
                }, {
                    y: r.end.y / 2 + .5,
                    ...l
                }),
                e = r.end
        }
        return t.set(this.flowmap.mouse2, {
            x: -1,
            y: -1
        }),
            t
    }

    createRandomDirections(i = null) {
        const e = i || new THREE.Vector2((Math.random() - .5) * 2, (Math.random() - .5) * 2)
            , t = e.angleTo(new THREE.Vector2) + (Math.random() - .5) * 2 * Math.PI * .8
            , s = re(.7, .9, Math.random())
            , o = new THREE.Vector2(Math.cos(t) * s, Math.sin(t) * s);
        return {
            start: e,
            end: o
        }
    }

    onWindowResize({innerWidth: i, innerHeight: e, renderWidth: t, renderHeight: s}) {
        const Lc = new THREE.Vector3();
        const Oc = new THREE.Vector3();
        const ds = new THREE.Vector3();

        function mt(u, i = Oc) {
            const {innerWidth: e, innerHeight: t} = {innerWidth, innerHeight}
            const s = e / t;
            i instanceof THREE.Vector3 ? ds.copy(i) : ds.set(...i);
            const o = u.getWorldPosition(Lc).distanceTo(ds);
            if (u.isOrthographicCamera) {
                const n = Math.abs(u.right - u.left)
                const a = Math.abs(u.top - u.bottom);
                return {
                    width: n / u.zoom,
                    height: a / u.zoom,
                    factor: 1,
                    distance: o,
                    aspect: s
                }
            } else {
                const n = u.fov * Math.PI / 180
                const a = 2 * Math.tan(n / 2) * o
                const r = a * (e / t);
                return {
                    width: r,
                    height: a,
                    factor: e / r,
                    distance: o,
                    aspect: s
                }
            }
        }

        function re(t, l, a) {
            return (1 - a) * t + a * l
        }


        const o = i / e
        const n = window.devicePixelRatio;
        this.uScreen.value.set(i * n, e * n)
        this.uResolution.value.set(i * n, e * n)
        this.uDPR.value = n
        this.uAspect.value = o
        this.flowmap.aspect = o
        Yt.resize()
        this.viewport = mt(this.camera)
        this.camera.aspect = o;
        const a = $o * (Ei - .1) / this.uAspect.value
        const r = this.config.camera.distance
        const l = 2 * Math.atan(a / (2 * r)) * (180 / Math.PI);
        this.camera.fov = Math.min(this.config.camera.fov, l)
        this.camera.zoom = re(this.config.camera.slowModeZoom, this.config.camera.fastModeZoom, this.uFastScroll.value) * this._state.cameraZoom
        this.camera.updateProjectionMatrix()
    }

    update({delta: i, time: e}) {
        if (this.isPaused)
            return;
        this.uTime.value += i,
            this.scene.position.y = this.uScroll.value * -Ei,
            this.uScreenScroll.value = this.scene.position.y * this.config.camera.fastModeZoom / this.viewport.height,
            this.sections.forEach((n, a) => {
                    const r = this.sections.length / this.sectionsPerLine * Ei
                        , l = r * .5
                        , h = n.position.y + this.scene.position.y;
                    h < -l && (n.position.y += r),
                    h > l && (n.position.y -= r)
                }
            ),
            this.scrollDelta = this.uScreenScroll.value - this.scrollLast,
            this.scrollDelta = Math.min(.2, Math.abs(this.scrollDelta)) * Math.sign(this.scrollDelta),
            this.scrollLast = this.uScreenScroll.value,
            this.flowmap.mouse.lerp(Yt.normalFlip, this.config.flowmap.mouseEase),
            this.flowmap.velocity.lerp(Yt.velocity, Yt.velocity.length() ? .1 : .04),
            this.flowmap.update(-this.scrollDelta),
            this.uScrollSpeed.value += (this.scrollDelta * 5 - this.uScrollSpeed.value) * .04;
        const t = $o * (Ei - .1) / this.uAspect.value
            , s = this.config.camera.distance
            , o = 2 * Math.atan(t / (2 * s)) * (180 / Math.PI);
        this.camera.fov = Math.min(this.config.camera.fov, o),
            this.camera.zoom = re(this.config.camera.slowModeZoom, this.config.camera.fastModeZoom, this.uFastScroll.value) * this._state.cameraZoom,
            this.camera.updateProjectionMatrix()
    }

    mainUpdate() {
        // 更新浮雕效果的深度纹理和普通纹理
        this._components.homeRelief.tDepth.value = this._renderTarget.depthTexture;
        this._components.homeRelief.tRelief.value = this._renderTarget.texture;
    }
}
