/**
 * justThreeJs homeRelief.js
 * @author kongjianqiu
 * @description
 * @created 2025/3/13 15:45:53
 */
import * as THREE from "three";
import gsap from "gsap";
import FlowMap from "@/views/pages/plaster/js/flowMap.js";
import reliefVertex from "@/views/pages/plaster/glsl/relief/vertex.glsl";
import reliefFragment from "@/views/pages/plaster/glsl/relief/fragment.glsl";
import modelVertex from "@/views/pages/plaster/glsl/model/vertex.glsl";
import modelfragment from "@/views/pages/plaster/glsl/model/fragment.glsl";

export default class HomeRelief {
    constructor(base) {
        this.base = base;
        this.paramsInit();
        // this.topInit();
        this.initReliefContent();
        this.onConfigUpdated();
    }

    paramsInit() {
        this.camera = this.base.camera;
        this.scene = this.base.scene;
        this.renderer = this.base.renderer;
        this.tMaskNoise = this.base.maskNoise;
        this.tMaskNoise.wrapT = this.tMaskNoise.wrapS = THREE.RepeatWrapping
        this.tPlaster = this.base.plasterImg;
        this.tPlaster.wrapT = this.tPlaster.wrapS = THREE.RepeatWrapping
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
        this.flowMap = new FlowMap(this);
        this.tFlow = this.flowMap.uniform;
    }

    sizeInit() {
        const o = i / e
        const {dpr: n} = this.view;
        this.uScreen.value.set(i * n, e * n), this.uResolution.value.set(i * n, e * n)
        this.uDPR.value = n, this.uAspect.value = o
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

    topInit() {
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3))
        geometry.setAttribute("uv", new THREE.BufferAttribute(new Float32Array([0, 0, 2, 0, 0, 2]), 2))
        const material = new THREE.RawShaderMaterial({
            vertexShader: reliefVertex,
            fragmentShader: reliefFragment,
            uniforms: {
                uGradientStrength: this.uGradientStrength,
                tPlaster: {value: this.tPlaster},
                uTextureStrength: this.uTextureStrength
            },
            depthWrite: false,
            depthTest: false
        })
        const mesh = new THREE.Mesh(geometry, material);
        mesh.frustumCulled = !1
        mesh.renderOrder = -1
        this.scene.add(mesh);
    }

    initReliefContent() {
        this.sections = []
        this.sectionsPerLine = 1;
        const e = {}
        const t = [];
        this.base.reliefsModel.children.forEach((item) => {
            if (!item.geometry) return;
            const geometry = item.geometry;
            const material = new THREE.ShaderMaterial({
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
                        value: this.base.rgbAtt09
                    },
                    tFlow: this.tFlow,
                    uTransition: this.uTransition,
                    tPlaster: this.tPlaster,
                    uTextureStrength: this.uTextureStrength,
                    uGradientStrength: this.uGradientStrength,
                    uSwitchColorFastScroll: this.uSwitchColorFastScroll,
                    tFluidFlowmap: {
                        value: null
                    },
                    uFastScroll: this.uFastScroll,
                    uBrightnessFactor: {
                        value: 0.6
                    },
                    uBrightnessOffset: {
                        value: 0.4
                    },
                    tBake1: {
                        value: item.material.map
                    },
                    tBake2: {
                        value: item.material.emissiveMap
                    }
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
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.copy(item.position);
            mesh.scale.copy(item.scale);
            const a = Math.round(item.position.y);
            e[a] || (e[a] = 0)
            e[a]++
            e[a] > this.sectionsPerLine && (this.sectionsPerLine = e[a])
            t.includes(a) || t.push(a);
            const r = t.indexOf(a);
            mesh.renderOrder = r;
            this.sections.push(mesh)
            this.scene.add(mesh)
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
            Object.assign(i.material.defines, {
                CHROMATIC_FRESNEL_SHARPNESS: this.config.chromaticMask.fresnelSharpness,
                CHROMATIC_FRESNEL_OPACITY: this.config.chromaticMask.fresnelOpacity,
                CHROMATIC_SHADOW_RANGE: this.config.chromaticMask.shadowRange,
                CHROMATIC_SHADOW_OPACITY: this.config.chromaticMask.shadowOpacity,
                SHOW_EFFECT_FLUID: false,
                SHOW_EFFECT_COLORS: false,
                SHOW_EFFECT_LINES: false,
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
            i.material.needsUpdate = true;
        })
    }
}
