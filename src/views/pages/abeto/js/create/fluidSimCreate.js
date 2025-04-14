/**
 * justThreeJs fluidSimCreate.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/2 16:44:43
 */
import * as THREE from "three";

export default class FluidSimCreate {
    constructor(base) {
        this.base = base.base;
        this.isFluid = !0
        this._linearFilteringSupported = this.base.renderer.webgl.capabilities.floatLinearFiltering
        this._simRes = 128
        this._dyeRes = 256
        this._simTexelSize = 1 / this._simRes
        this._dyeTexelSize = 1 / this._dyeRes
        this._pressureIterations = 2
        this._densityDissipation = 0.88
        this._velocityDissipation = 0.98
        this._pressureDissipation = 0.86
        this._curlStrength = 0
        this._splatRadius = 0.2
        this._splatRadiusVelocity = !1
        this._splatForce = 35
        this._splatMode = 2
        this._borders = !1
        this._mode = 1
        this._aspect = 1
        this._fingers = this.base.inputManager.fingers
        this._enabled = !1
        this.points = Array.from(Array(this._fingers), () => ({
            position: new THREE.Vector2(.5, .5),
            prevPosition: new THREE.Vector2(.5, .5),
            lastUpdate: 0,
            lastSplat: 0,
            velocity: 0
        }))
        this.rc = new THREE.Vector2();
        this._createRTs()
        this._createMaterials()
        this._createScene()
        this.dyeUniform = {value: null}
        this.velUniform = {value: null}
        this.enable()
    }

    swapBuffer(size, format, filter) {
        const n = new THREE.WebGLRenderTarget(size, size, {
            format: format,
            type: THREE.HalfFloatType,
            magFilter: filter,
            minFilter: filter,
            depthBuffer: !1
        })
        const s = n.clone()
        const r = {
            read: n,
            write: s,
            swap: () => {
                const a = r.read;
                r.read = r.write
                r.write = a
            }
        };
        return r
    }

    _createRTs() {
        this._density = this.swapBuffer(this._dyeRes, THREE.RGBAFormat, this._linearFilteringSupported ? THREE.LinearFilter : THREE.NearestFilter)
        this._velocity = this.swapBuffer(this._simRes, THREE.RGBAFormat, this._linearFilteringSupported ? THREE.LinearFilter : THREE.NearestFilter)
        this._pressure = this.swapBuffer(this._simRes, THREE.RGBAFormat, THREE.NearestFilter);
        const options = {
            type: THREE.HalfFloatType,
            magFilter: THREE.NearestFilter,
            minFilter: THREE.NearestFilter,
            depthBuffer: !1
        };
        this._divergence = new THREE.WebGLRenderTarget(this._simRes, this._simRes, options)
        this._curl = new THREE.WebGLRenderTarget(this._simRes, this._simRes, options)
    }

    _createMaterials() {
        const e = this.base.renderer.webgl.capabilities
        const highPrecision = e.getMaxPrecision("highp")
        const mediumPrecision = e.getMaxPrecision("mediump");
        this._materialClear = new THREE.RawShaderMaterial({
            name: "FLUID_CLEAR",
            uniforms: {
                texelSize: {value: new THREE.Vector2},
                uTexture: {value: null},
                value: {value: this._pressureDissipation}
            },
            vertexShader: `
                precision ${highPrecision} float;

                attribute vec3 position;
                attribute vec2 uv;

                varying vec2 vUv;

                void main () {
                    vUv = uv;
                    gl_Position = vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                precision ${mediumPrecision} float;
                precision ${mediumPrecision} sampler2D;

                uniform sampler2D uTexture;
                uniform float value;

                varying highp vec2 vUv;

                void main () {
                    gl_FragColor.rgb = value * texture2D(uTexture, vUv).rgb;
                    gl_FragColor.a = 1.0;
                }
            `,
            depthTest: !1,
            depthWrite: !1
        })
        this._materialSplat = new THREE.RawShaderMaterial({
            name: "FLUID_SPLAT",
            uniforms: {
                texelSize: {value: new THREE.Vector2},
                uTarget: {value: null},
                aspectRatio: {value: 1},
                color: {value: new THREE.Vector3},
                point: {value: new THREE.Vector2},
                prevPoint: {value: new THREE.Vector2},
                radius: {value: 1},
                isDye: {value: !1}
            },
            vertexShader: `
                precision ${highPrecision} float;

                attribute vec3 position;
                attribute vec2 uv;

                varying vec2 vUv;

                void main () {
                    vUv = uv;
                    gl_Position = vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                precision ${highPrecision} float;
                precision ${highPrecision} sampler2D;

                ${this._splatMode === 1 ? "#define SPLAT_DOT" : ""}

                uniform sampler2D uTarget;
                uniform float aspectRatio;
                uniform vec3 color;
                uniform vec2 point;
                uniform vec2 prevPoint;
                uniform float radius;
                uniform bool isDye;

                varying vec2 vUv;

                float line(vec2 uv, vec2 point1, vec2 point2) {
                    vec2 pa = uv - point1, ba = point2 - point1;
                    pa.x *= aspectRatio;
                    ba.x *= aspectRatio;
                    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
                    return length(pa - ba * h);
                }

                float cubicIn(float t) {
                    return t * t * t;
                }

                void main () {
                    #ifdef SPLAT_DOT
                        vec2 p = vUv - point.xy;
                        p.x *= aspectRatio;
                        vec3 splat = exp(-dot(p, p) / (radius / 50.0)) * color; // vec3 splat = exp(-dot(p, p) / radius) * color;
                    #else
                        vec3 splat =  cubicIn(clamp(1.0 - line(vUv, prevPoint.xy, point.xy) / radius, 0.0, 1.0)) * color;
                    #endif

                    vec3 base = texture2D(uTarget, vUv).xyz;
                    vec3 result = base + splat;
                    if (isDye) result = clamp(result, vec3(0.0), vec3(1.0));

                    gl_FragColor = vec4(result, 1.0);
                }
            `,
            depthTest: !1,
            depthWrite: !1
        })
        this._materialCurl = new THREE.RawShaderMaterial({
            name: "FLUID_CURL",
            uniforms: {
                texelSize: {value: new THREE.Vector2},
                uVelocity: {value: null}
            },
            vertexShader: `
                precision ${highPrecision} float;

                attribute vec3 position;
                attribute vec2 uv;

                uniform vec2 texelSize;

                varying vec2 vL;
                varying vec2 vR;
                varying vec2 vT;
                varying vec2 vB;

                void main () {
                    vL = uv - vec2(texelSize.x, 0.0);
                    vR = uv + vec2(texelSize.x, 0.0);
                    vT = uv + vec2(0.0, texelSize.y);
                    vB = uv - vec2(0.0, texelSize.y);
                    gl_Position = vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                precision ${mediumPrecision} float;
                precision ${mediumPrecision} sampler2D;

                uniform sampler2D uVelocity;

                varying highp vec2 vL;
                varying highp vec2 vR;
                varying highp vec2 vT;
                varying highp vec2 vB;

                void main () {
                    float L = texture2D(uVelocity, vL).y;
                    float R = texture2D(uVelocity, vR).y;
                    float T = texture2D(uVelocity, vT).x;
                    float B = texture2D(uVelocity, vB).x;
                    float vorticity = R - L - T + B;
                    gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
                }
            `,
            depthTest: !1,
            depthWrite: !1
        })
        this._materialVorticity = new THREE.RawShaderMaterial({
            name: "FLUID_VORTICITY",
            uniforms: {
                texelSize: {value: new THREE.Vector2},
                uVelocity: {value: null},
                uCurl: {value: null},
                curl: {value: this._curlStrength},
                dt: {value: 1 / 60}
            },
            vertexShader: `
                precision ${highPrecision} float;

                attribute vec3 position;
                attribute vec2 uv;

                uniform vec2 texelSize;

                varying vec2 vUv;
                varying vec2 vL;
                varying vec2 vR;
                varying vec2 vT;
                varying vec2 vB;

                void main () {
                    vUv = uv;
                    vL = vUv - vec2(texelSize.x, 0.0);
                    vR = vUv + vec2(texelSize.x, 0.0);
                    vT = vUv + vec2(0.0, texelSize.y);
                    vB = vUv - vec2(0.0, texelSize.y);
                    gl_Position = vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                precision ${highPrecision} float;
                precision ${highPrecision} sampler2D;

                uniform sampler2D uVelocity;
                uniform sampler2D uCurl;
                uniform float curl;
                uniform float dt;

                varying vec2 vUv;
                varying vec2 vL;
                varying vec2 vR;
                varying vec2 vT;
                varying vec2 vB;

                void main () {
                    float L = texture2D(uCurl, vL).x;
                    float R = texture2D(uCurl, vR).x;
                    float T = texture2D(uCurl, vT).x;
                    float B = texture2D(uCurl, vB).x;
                    float C = texture2D(uCurl, vUv).x;
                    vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
                    force /= length(force) + 0.0001;
                    force *= curl * C;
                    force.y *= -1.0;
                    vec2 vel = texture2D(uVelocity, vUv).xy;
                    gl_FragColor = vec4(vel + force * dt, 0.0, 1.0);
                }
            `,
            depthTest: !1,
            depthWrite: !1
        })
        this._materialDivergence = new THREE.RawShaderMaterial({
            name: "FLUID_DIVERGENCE",
            uniforms: {
                texelSize: {value: new THREE.Vector2},
                uVelocity: {value: null}
            },
            vertexShader: `
                precision ${highPrecision} float;

                attribute vec3 position;
                attribute vec2 uv;

                uniform vec2 texelSize;

                varying vec2 vUv;
                varying vec2 vL;
                varying vec2 vR;
                varying vec2 vT;
                varying vec2 vB;

                void main () {
                    vUv = uv;
                    vL = vUv - vec2(texelSize.x, 0.0);
                    vR = vUv + vec2(texelSize.x, 0.0);
                    vT = vUv + vec2(0.0, texelSize.y);
                    vB = vUv - vec2(0.0, texelSize.y);
                    gl_Position = vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                precision ${mediumPrecision} float;
                precision ${mediumPrecision} sampler2D;
                ${this._borders ? "#define LIMIT_BORDERS" : ""}

                uniform sampler2D uVelocity;

                varying highp vec2 vUv;
                varying highp vec2 vL;
                varying highp vec2 vR;
                varying highp vec2 vT;
                varying highp vec2 vB;

                void main () {
                    float L = texture2D(uVelocity, vL).x;
                    float R = texture2D(uVelocity, vR).x;
                    float T = texture2D(uVelocity, vT).y;
                    float B = texture2D(uVelocity, vB).y;
                    vec2 C = texture2D(uVelocity, vUv).xy;

                    #ifdef LIMIT_BORDERS
                        if (vL.x < 0.0) { L = -C.x; }
                        if (vR.x > 1.0) { R = -C.x; }
                        if (vT.y > 1.0) { T = -C.y; }
                        if (vB.y < 0.0) { B = -C.y; }
                    #endif

                    float div = 0.5 * (R - L + T - B);
                    gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
                }
            `,
            depthTest: !1,
            depthWrite: !1
        })
        this._materialPressure = new THREE.RawShaderMaterial({
            name: "FLUID_PRESSURE",
            uniforms: {
                texelSize: {value: new THREE.Vector2},
                uPressure: {value: null},
                uDivergence: {value: null}
            },
            vertexShader: `
                precision ${highPrecision} float;

                attribute vec3 position;
                attribute vec2 uv;

                uniform vec2 texelSize;

                varying vec2 vUv;
                varying vec2 vL;
                varying vec2 vR;
                varying vec2 vT;
                varying vec2 vB;

                void main () {
                    vUv = uv;
                    vL = vUv - vec2(texelSize.x, 0.0);
                    vR = vUv + vec2(texelSize.x, 0.0);
                    vT = vUv + vec2(0.0, texelSize.y);
                    vB = vUv - vec2(0.0, texelSize.y);
                    gl_Position = vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                precision ${mediumPrecision} float;
                precision ${mediumPrecision} sampler2D;

                uniform sampler2D uPressure;
                uniform sampler2D uDivergence;

                varying highp vec2 vUv;
                varying highp vec2 vL;
                varying highp vec2 vR;
                varying highp vec2 vT;
                varying highp vec2 vB;

                void main () {
                    float L = texture2D(uPressure, vL).x;
                    float R = texture2D(uPressure, vR).x;
                    float T = texture2D(uPressure, vT).x;
                    float B = texture2D(uPressure, vB).x;
                    float C = texture2D(uPressure, vUv).x;
                    float divergence = texture2D(uDivergence, vUv).x;
                    float pressure = (L + R + B + T - divergence) * 0.25;
                    gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
                }
            `,
            depthTest: !1,
            depthWrite: !1
        })
        this._materialGradientSubstract = new THREE.RawShaderMaterial({
            name: "FLUID_GRADIENT_SUBSTRACT",
            uniforms: {
                texelSize: {value: new THREE.Vector2},
                uPressure: {value: null},
                uVelocity: {value: null}
            },
            vertexShader: `
                precision ${highPrecision} float;

                attribute vec3 position;
                attribute vec2 uv;

                uniform vec2 texelSize;

                varying vec2 vUv;
                varying vec2 vL;
                varying vec2 vR;
                varying vec2 vT;
                varying vec2 vB;

                void main () {
                    vUv = uv;
                    vL = vUv - vec2(texelSize.x, 0.0);
                    vR = vUv + vec2(texelSize.x, 0.0);
                    vT = vUv + vec2(0.0, texelSize.y);
                    vB = vUv - vec2(0.0, texelSize.y);
                    gl_Position = vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                precision ${mediumPrecision} float;
                precision ${mediumPrecision} sampler2D;

                uniform sampler2D uPressure;
                uniform sampler2D uVelocity;

                varying highp vec2 vUv;
                varying highp vec2 vL;
                varying highp vec2 vR;
                varying highp vec2 vT;
                varying highp vec2 vB;

                void main () {
                    float L = texture2D(uPressure, vL).x;
                    float R = texture2D(uPressure, vR).x;
                    float T = texture2D(uPressure, vT).x;
                    float B = texture2D(uPressure, vB).x;
                    vec2 velocity = texture2D(uVelocity, vUv).xy;
                    velocity.xy -= vec2(R - L, T - B);
                    gl_FragColor = vec4(velocity, 0.0, 1.0);
                }
            `,
            depthTest: !1,
            depthWrite: !1
        })
        this._materialAdvection = new THREE.RawShaderMaterial({
            name: "FLUID_ADVECTION",
            uniforms: {
                texelSize: {value: new THREE.Vector2},
                dyeTexelSize: {value: new THREE.Vector2().setScalar(1 / this._dyeRes)},
                uVelocity: {value: null},
                uSource: {value: null},
                dt: {value: 1 / 60},
                dissipation: {value: 1}
            },
            vertexShader: `
                precision ${highPrecision} float;

                attribute vec3 position;
                attribute vec2 uv;

                varying vec2 vUv;

                void main () {
                    vUv = uv;
                    gl_Position = vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                precision ${highPrecision} float;
                precision ${highPrecision} sampler2D;
                ${this._linearFilteringSupported ? "" : "#define MANUAL_FILTERING"}

                uniform sampler2D uVelocity;
                uniform sampler2D uSource;
                uniform vec2 texelSize;
                uniform vec2 dyeTexelSize;
                uniform float dt;
                uniform float dissipation;

                varying vec2 vUv;

                vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
                    vec2 st = uv / tsize - 0.5;
                    vec2 iuv = floor(st);
                    vec2 fuv = fract(st);
                    vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
                    vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
                    vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
                    vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);
                    return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
                }

                void main () {
                    vec4 result;

                    #ifdef MANUAL_FILTERING
                        vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
                        result = bilerp(uSource, coord, dyeTexelSize);
                    #else
                        vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
                        result = texture2D(uSource, coord);
                    #endif

                    gl_FragColor.rgb = result.rgb * dissipation;
                    gl_FragColor.a = 1.0;
                }
            `,
            depthTest: !1,
            depthWrite: !1
        })
    }

    _createScene() {
        this._scene = new THREE.Scene;
        this._camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3));
        geometry.setAttribute("uv", new THREE.BufferAttribute(new Float32Array([0, 0, 2, 0, 0, 2]), 2));
        this._mesh = new THREE.Mesh(geometry, this._materialClear)
        this._mesh.frustumCulled = !1
        this._scene.add(this._mesh)
    }

    _update(e) {
        const time = e.data
        if (this._mode === 1) {
            this._aspect = this.base.uniforms.resolution.value.x / this.base.uniforms.resolution.value.y;
        }
        const n = this.base.renderer.webgl.autoClear;
        this.base.renderer.webgl.autoClear = false;
        this.points.forEach(r => {
            if (time - r.lastUpdate < 0.016) return;
            this.rc.subVectors(r.position, r.prevPosition);
            const a = this.rc.length();
            r.velocity += a * 2
            if (a > 0) {
                const l = time - r.lastSplat > 0.15;
                this._mesh.material = this._materialSplat;
                this._materialSplat.uniforms.isDye.value = false;
                this._materialSplat.uniforms.uTarget.value = this._velocity.read.texture;
                this._materialSplat.uniforms.aspectRatio.value = this._aspect;
                this._materialSplat.uniforms.point.value.copy(r.position);
                this._materialSplat.uniforms.prevPoint.value.copy(l ? r.position : r.prevPosition);
                this._materialSplat.uniforms.color.value.set(this.rc.x, this.rc.y, 0).multiplyScalar(this._splatForce).multiplyScalar(l ? 0 : 1);
                this._materialSplat.uniforms.radius.value = this._splatRadius * (this._splatRadiusVelocity ? r.velocity : 1);

                this.base.renderer.webgl.setRenderTarget(this._velocity.write);
                this.base.renderer.webgl.render(this._scene, this._camera);
                this._velocity.swap();

                this._materialSplat.uniforms.isDye.value = true;
                this._materialSplat.uniforms.uTarget.value = this._density.read.texture;
                this._materialSplat.uniforms.color.value.setScalar(1);

                this.base.renderer.webgl.setRenderTarget(this._density.write);
                this.base.renderer.webgl.render(this._scene, this._camera);
                this._density.swap();

                r.lastSplat = e;
            }

            r.lastUpdate = e;
            r.prevPosition.copy(r.position);
            r.velocity *= 0.9;
            r.velocity = Math.min(1, r.velocity);
        });

        const s = this.base.ratio;

        this._mesh.material = this._materialCurl;
        this._materialCurl.uniforms.texelSize.value.setScalar(this._simTexelSize);
        this._materialCurl.uniforms.uVelocity.value = this._velocity.read.texture;

        this.base.renderer.webgl.setRenderTarget(this._curl);
        this.base.renderer.webgl.render(this._scene, this._camera);

        this._mesh.material = this._materialVorticity;
        this._materialVorticity.uniforms.texelSize.value.setScalar(this._simTexelSize);
        this._materialVorticity.uniforms.uVelocity.value = this._velocity.read.texture;
        this._materialVorticity.uniforms.uCurl.value = this._curl.texture;
        this._materialVorticity.uniforms.curl.value = this._curlStrength;
        this._materialVorticity.uniforms.dt.value = s;

        this.base.renderer.webgl.setRenderTarget(this._velocity.write);
        this.base.renderer.webgl.render(this._scene, this._camera);
        this._velocity.swap();

        this._mesh.material = this._materialDivergence;
        this._materialDivergence.uniforms.texelSize.value.setScalar(this._simTexelSize);
        this._materialDivergence.uniforms.uVelocity.value = this._velocity.read.texture;

        this.base.renderer.webgl.setRenderTarget(this._divergence);
        this.base.renderer.webgl.render(this._scene, this._camera);

        this._mesh.material = this._materialClear;
        this._materialClear.uniforms.uTexture.value = this._pressure.read.texture;
        this._materialClear.uniforms.value.value = this.base.utils.frictionFPS(this._pressureDissipation);

        this.base.renderer.webgl.setRenderTarget(this._pressure.write);
        this.base.renderer.webgl.render(this._scene, this._camera);
        this._pressure.swap();

        this._mesh.material = this._materialPressure;
        this._materialPressure.uniforms.texelSize.value.setScalar(this._simTexelSize);
        this._materialPressure.uniforms.uDivergence.value = this._divergence.texture;

        for (let r = 0; r < this._pressureIterations; r++) {
            this._materialPressure.uniforms.uPressure.value = this._pressure.read.texture;
            this.base.renderer.webgl.setRenderTarget(this._pressure.write);
            this.base.renderer.webgl.render(this._scene, this._camera);
            this._pressure.swap();
        }

        this._mesh.material = this._materialGradientSubstract;
        this._materialGradientSubstract.uniforms.texelSize.value.setScalar(this._simTexelSize);
        this._materialGradientSubstract.uniforms.uPressure.value = this._pressure.read.texture;
        this._materialGradientSubstract.uniforms.uVelocity.value = this._velocity.read.texture;

        this.base.renderer.webgl.setRenderTarget(this._velocity.write);
        this.base.renderer.webgl.render(this._scene, this._camera);
        this._velocity.swap();

        this._mesh.material = this._materialAdvection;
        this._materialAdvection.uniforms.texelSize.value.setScalar(this._simTexelSize);
        this._materialAdvection.uniforms.dyeTexelSize.value.setScalar(this._simTexelSize);
        this._materialAdvection.uniforms.uVelocity.value = this._velocity.read.texture;
        this._materialAdvection.uniforms.uSource.value = this._velocity.read.texture;
        this._materialAdvection.uniforms.dt.value = s;
        this._materialAdvection.uniforms.dissipation.value = this.base.utils.frictionFPS(this._velocityDissipation);

        this.base.renderer.webgl.setRenderTarget(this._velocity.write);
        this.base.renderer.webgl.render(this._scene, this._camera);
        this._velocity.swap();

        this._materialAdvection.uniforms.dyeTexelSize.value.setScalar(this._dyeTexelSize);
        this._materialAdvection.uniforms.uVelocity.value = this._velocity.read.texture;
        this._materialAdvection.uniforms.uSource.value = this._density.read.texture;
        this._materialAdvection.uniforms.dissipation.value = this.base.utils.frictionFPS(this._densityDissipation);

        this.base.renderer.webgl.setRenderTarget(this._density.write);
        this.base.renderer.webgl.render(this._scene, this._camera);
        this._density.swap();

        this.base.renderer.webgl.autoClear = n;
        this.dyeUniform.value = this._density.read.texture;
        this.velUniform.value = this._velocity.read.texture;
    }

    _moveFinger(e) {
        this.points[e.data.finger].position.copy(e.data.prevPosition)
    }

    enable() {
        if (!this._enabled) {
            this._enabled = !0
            this.base.eventManage.on("webgl_prerender", this._update.bind(this))
            if (this._mode === 1) {
                for (let e = 0; e < this._fingers; e++) {
                    this.base.eventManage.on(`touch${e === 0 ? "" : e + 1}_start`, this._moveFinger.bind(this))
                    this.base.eventManage.on(`touch${e === 0 ? "" : e + 1}_move`, this._moveFinger.bind(this))
                }
            }
        }
    }

    disable() {
        if (this._enabled) {
            this._enabled = !1
            this.base.eventManage.on("webgl_prerender", this._update.bind(this))
            if (this._mode === 1) {
                for (let e = 0; e < this._fingers; e++) {
                    this.base.eventManage.on(`touch${e === 0 ? "" : e + 1}_start`, this._moveFinger.bind(this))
                    this.base.eventManage.on(`touch${e === 0 ? "" : e + 1}_move`, this._moveFinger.bind(this))
                }
            }
        }
    }


    dispose() {
        this.disable()
        this._materialClear.dispose()
        this._materialSplat.dispose()
        this._materialCurl.dispose()
        this._materialVorticity.dispose()
        this._materialDivergence.dispose()
        this._materialPressure.dispose()
        this._materialGradientSubstract.dispose()
        this._materialAdvection.dispose();
        [this._density, this._velocity, this._pressure].forEach(e => e.read.dispose() && e.write.dispose())
        this._divergence.dispose()
        this._curl.dipose()
    }
}
