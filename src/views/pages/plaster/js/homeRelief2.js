/**
 * justThreeJs homeRelief.js
 * @author kongjianqiu
 * @description
 * @created 2025/3/13 09:19:03
 */

import * as THREE from "three";
import gsap from "gsap";
import FlowMap from "@/views/pages/plaster/js/flowMap.js";
// glsl
import reliefVertex from '@/views/pages/plaster/glsl/relief/vertex.glsl'
import reliefFragment from '@/views/pages/plaster/glsl/relief/fragment.glsl'
import modelVertex from '@/views/pages/plaster/glsl/model/vertex.glsl'
import modelfragment from '@/views/pages/plaster/glsl/model/fragment.glsl'


function re(t, l, a) {
    return (1 - a) * t + a * l
}

class cu {
    constructor(base) {
        this.base = base
        this.pixel = new THREE.Vector2()
        this.normal = new THREE.Vector2(.5, .5)
        this.normalFlip = new THREE.Vector2(-1, -1)
        this.tilt = new THREE.Vector2()
        this.velocity = new THREE.Vector2()
        this.width = this.base.width;
        this.height = this.base.height;
        this.lastTime = 0
        this.lastNormalFlip = new THREE.Vector2(-1, -1)
        this.dateTime = performance.now()
        this.down = this.down.bind(this)
        this.move = this.move.bind(this)
        this.up = this.up.bind(this)
        // this.resize = this.resize.bind(this)
        // this.tick = this.tick.bind(this)
        !(typeof window > "u") && this.handlers()
    }

    handlers() {
        window.addEventListener("pointerdown", this.down)
        window.addEventListener("pointermove", this.move)
        window.addEventListener("touchmove", this.move)
        window.addEventListener("pointerup", this.up)
        window.addEventListener("resize", this.resize)
        window.addEventListener("orientationchange", this.resize)
        this.resize()
    }

    updateMouse(i) {
        i.changedTouches && i.changedTouches.length && (i.x = i.changedTouches[0].pageX, i.y = i.changedTouches[0].pageY), i.x === void 0 && (i.x = i.pageX, i.y = i.pageY)
        this.pixel.set(i.x, i.y)
        this.normal.x = this.pixel.x / this.width
        this.normal.y = this.pixel.y / this.height
        this.normalFlip.x = this.normal.x
        this.normalFlip.y = 1 - this.normal.y
        this.tilt.x = this.normalFlip.x * 2 - 1
        this.tilt.y = this.normalFlip.y * 2 - 1

    }

    resize() {
        // this.width = G.innerWidth
        // this.height = G.innerHeight
    }

    down(i) {
        this.updateMouse(i)
    }

    move(i) {
        this.updateMouse(i)
    }

    up() {
    }

    tick() {
        let a = performance.now()
        let e = (a - this.dateTime) / 1000;
        this.dateTime = a
        this.lastNormalFlip.x === -1 && this.lastNormalFlip.copy(this.normalFlip);
        const t = this.normalFlip.x - this.lastNormalFlip.x
        const s = this.normalFlip.y - this.lastNormalFlip.y;
        this.lastNormalFlip.copy(this.normalFlip);
        const o = Math.min(32, e) / 16;
        this.velocity.x = t * o
        this.velocity.y = s * o
    }
}

export default class HomeRelief extends THREE.Object3D {
    constructor(base) {
        super();
        this.base = base;
        this.uniforms = this.base.uniforms;
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
        this.isPaused = !1
        this.viewport = null
        this._isMobile = false;
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
        this.createReliefScene();
        this.initReliefContent();
        this.onConfigUpdated()
        this.loopRandomMouseMovement()
    }

    get cameraZoom() {
        return this._state.cameraZoom
    }

    set cameraZoom(i) {
        this._state.cameraZoom = i
    }

    createReliefScene() {
        this.camera = this.base.camera;
        this.scene = this.base.scene;
        this.renderer = this.base.renderer;
        this.tMaskNoise = this.base.maskNoise;
        this.tMaskNoise.wrapT = this.tMaskNoise.wrapS = THREE.RepeatWrapping
        this.tPlaster = this.base.plasterImg;
        this.tPlaster.wrapT = this.tPlaster.wrapS = THREE.RepeatWrapping
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
        this.flowmap = new FlowMap(this);
        this.tFlow = this.flowmap.uniform;
    }

    initReliefContent() {
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3))
        geometry.setAttribute("uv", new THREE.BufferAttribute(new Float32Array([0, 0, 2, 0, 0, 2]), 2))
        const material = new THREE.RawShaderMaterial({
            vertexShader: reliefVertex,
            fragmentShader: reliefFragment,
            uniforms: {
                uGradientStrength: this.uGradientStrength,
                tPlaster: this.tPlaster,
                uTextureStrength: this.uTextureStrength
            },
            depthWrite: false,
            depthTest: false
        })
        const mesh = new THREE.Mesh(geometry, material);
        mesh.frustumCulled = !1
        mesh.renderOrder = -1
        // this.scene.add(mesh);
        this.sections = []
        this.sectionsPerLine = 1;
        const e = {}
        const t = [];
        const i = this.base.reliefsModel;
        i.children.forEach((s, o) => {
            if (!s.geometry) return;
            const n = new THREE.Mesh();
            n.geometry = s.geometry
            n.position.copy(s.position)
            n.scale.copy(s.scale);
            const a = Math.round(s.position.y);
            e[a] || (e[a] = 0)
            e[a]++
            e[a] > this.sectionsPerLine && (this.sectionsPerLine = e[a])
            t.includes(a) || t.push(a);
            const r = t.indexOf(a)
            const l = {
                value: s.material.map
            }
            const h = {
                value: s.material.emissiveMap
            }
            const m = this.base.rgbAtt09;
            m.wrapS = m.wrapT = THREE.MirroredRepeatWrapping;
            const f = new THREE.ShaderMaterial({
                vertexShader: modelVertex,
                fragmentShader: modelfragment,
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
                    tFluidFlowmap: this.uniforms.tFluidFlowmap,
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
            });
            n.material = f
            n.renderOrder = r
            this.sections.push(n)
            this.scene.add(n)
        })
    }

    onConfigUpdated() {
        this.camera.position.z = this.config.camera.distance
        this.camera.near = this.config.camera.near
        this.camera.far = this.config.camera.far
        this.camera.updateProjectionMatrix()
        this.uTextureStrength.value = this.config.extrude.textureStrength
        this.uGradientStrength.value = this.config.extrude.gradientStrength
        this.sections.forEach(i => {
                i.material.defines = {
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
                }
                i.material.needsUpdate = true;
            })
        this.Yt = new cu(this.base);
    }

    update(i, e) {
        if (this.isPaused) return;
        this.uTime.value += i
        this.scene.position.y = this.uScroll.value * -9.995
        this.uScreenScroll.value = this.scene.position.y * this.config.camera.fastModeZoom / this.base.height
        this.sections.forEach((n, a) => {
                const r = this.sections.length / this.sectionsPerLine * 9.995
                const l = r * .5
                const h = n.position.y + this.scene.position.y;
                h < -l && (n.position.y += r),
                h > l && (n.position.y -= r)
            }
        )
        this.scrollDelta = this.uScreenScroll.value - this.scrollLast
        this.scrollDelta = Math.min(.2, Math.abs(this.scrollDelta)) * Math.sign(this.scrollDelta)
        this.scrollLast = this.uScreenScroll.value
        this.Yt.tick();
        this.flowmap.mouse.lerp(this.Yt.normalFlip, this.config.flowmap.mouseEase)
        this.flowmap.velocity.lerp(this.Yt.velocity, this.Yt.velocity.length() ? .1 : .04)
        this.flowmap.update(-this.scrollDelta)
        this.uScrollSpeed.value += (this.scrollDelta * 5 - this.uScrollSpeed.value) * .04;
        const t = 1.33 * (9.995 - .1) / this.uAspect.value
        const s = this.config.camera.distance
        const o = 2 * Math.atan(t / (2 * s)) * (180 / Math.PI);
        this.camera.fov = Math.min(this.config.camera.fov, o)
        this.camera.zoom = re(this.config.camera.slowModeZoom, this.config.camera.fastModeZoom, this.uFastScroll.value) * this._state.cameraZoom
        this.camera.updateProjectionMatrix()
    }

    createRandomDirections(i = null) {
        const e = i || new THREE.Vector2((Math.random() - .5) * 2, (Math.random() - .5) * 2)
        const t = e.angleTo(new THREE.Vector2()) + (Math.random() - .5) * 2 * Math.PI * .8
        const s = re(.7, .9, Math.random())
        const o = new THREE.Vector2(Math.cos(t) * s, Math.sin(t) * s);
        return {
            start: e,
            end: o
        }
    }

    triggerRandomMouseMovement() {
        this.flowmap.velocity2.x = 1
        this.flowmap.velocity2.y = 1;
        const i = Math.floor(Math.random() * 3) + 1;
        let e = null;
        const t = gsap.timeline();
        for (let s = 0; s < i; s++) {
            const n = !(s === i - 1) && Math.random() < .7
            const a = n ? re(.8, 1, Math.random()) : re(.7, .8, Math.random())
            const r = this.createRandomDirections(e)
            const l = {
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
            })
            t.fromTo(this.flowmap.mouse2, {
                y: r.start.y / 2 + .5
            }, {
                y: r.end.y / 2 + .5,
                ...l
            })
            e = r.end
        }
        t.set(this.flowmap.mouse2, {
            x: -1,
            y: -1
        })
        return t
    }

    loopRandomMouseMovement() {
        var i;
        (i = this.randomMouseMovementTimeline) == null || i.kill()
        this.randomMouseMovementTimeline = this.triggerRandomMouseMovement()
        this.randomMouseMovementTimeline.call(() => {
            this.loopRandomMouseMovement()
        }, null, "+=" + re(1, 3, Math.random()).toFixed(2))
    }

    stopRandomMouseMovement() {
    }

    goFastAnimation() {
    }

    goSlowAnimation() {
    }
}
