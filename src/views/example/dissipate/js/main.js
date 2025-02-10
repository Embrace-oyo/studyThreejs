/**
 * justThreeJs main.js
 * @author kongjianqiu
 * @description
 * @created 2025/2/10 11:08:22
 */
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader.js'
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import {TeapotGeometry} from 'three/examples/jsm/geometries/TeapotGeometry.js';
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js';
import {UnrealBloomPass} from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import {ShaderPass} from 'three/examples/jsm/postprocessing/ShaderPass.js';
import {OutputPass} from 'three/examples/jsm/postprocessing/OutputPass.js';
import {GUI} from 'three/addons/libs/lil-gui.module.min.js';
import gsap from "gsap";
import vertexShader from '@/views/example/dissipate/glsl/vertexShader.glsl'
import fragmentShader from '@/views/example/dissipate/glsl/fragmentShader.glsl'

export default class Dissipate {
    constructor(config) {
        this.target = config.target;
        this.width = this.target.offsetWidth;
        this.height = this.target.offsetHeight;
        this.clock = new THREE.Clock();
        this.renderer = new THREE.WebGLRenderer({antialias: true, preserveDrawingBuffer: !0});
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.width, this.height);
        this.target.appendChild(this.renderer.domElement);
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 100);
        this.camera.position.set(10, 10, 10);
        this.control = new OrbitControls(this.camera, this.renderer.domElement);
        this.control.enableDamping = true;
        this.rgbeLoader = new RGBELoader();
        this.rgbeLoader.load('./hdr/宇宙4K (5).hdr', (environmentMap) => {
            environmentMap.mapping = THREE.EquirectangularReflectionMapping
            this.scene.background = environmentMap
            this.scene.environment = environmentMap
        })
        this.textureLoader = new THREE.TextureLoader();
        this.roundedboxgeometry = new RoundedBoxGeometry(5, 5, 5, 24, 1);
        this.spheregeometry = new THREE.SphereGeometry(4, 128, 128);
        this.torusgeometry = new THREE.TorusGeometry(3, 1.7, 150, 150);
        this.teapotgeometry = new TeapotGeometry(3, 32);
        this.torusknotgeometry = new THREE.TorusKnotGeometry(2.5, .8, 200, 200);

        this.createParticle();
        this.createEffect();
        this.createGui();
        this.setupPointsByGeometry(this.spheregeometry)
        this.animation();
        this.resize()
    }

    createParticle() {
        this.config = {
            uColor: {
                value: new THREE.Color('#4d9bff')
            },
            uEdgeColor1: {
                value: new THREE.Color('#4d9bff')
            },
            uEdgeColor2: {
                value: new THREE.Color('#0733ff')
            },
            uFreq: {
                value: 0.45
            },
            uAmp: {
                value: 16
            },
            uProgress: {
                value: -7
            },
            uEdge: {
                value: 0.8
            },
        }
        this.uParticleTexture = this.textureLoader.load('./texture/star3.png');
        this.material = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color('#fff'),
            iridescence: .2,
            roughness: 0,
            metalness: 2,
            side: THREE.DoubleSide,
            sheen: 1,
        })
        this.material.onBeforeCompile = (shader) => {
            shader.uniforms = {
                ...shader.uniforms,
                ...this.config
            }
            shader.vertexShader = shader.vertexShader.replace(
                "#include <common>",
                `#include <common>
                varying vec3 vPos;`
            )
            shader.vertexShader = shader.vertexShader.replace(
                "#include <begin_vertex>",
                `#include <begin_vertex>
                vPos = position;`
            )
            shader.fragmentShader = shader.fragmentShader.replace(
                "#include <common>",
                `#include <common>
                //	Classic Perlin 3D Noise 
                //	by Stefan Gustavson (https://github.com/stegu/webgl-noise)
                //
                vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
                vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
                vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

                float cnoise(vec3 P){
                    vec3 Pi0 = floor(P); // Integer part for indexing
                    vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
                    Pi0 = mod(Pi0, 289.0);
                    Pi1 = mod(Pi1, 289.0);
                    vec3 Pf0 = fract(P); // Fractional part for interpolation
                    vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
                    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
                    vec4 iy = vec4(Pi0.yy, Pi1.yy);
                    vec4 iz0 = Pi0.zzzz;
                    vec4 iz1 = Pi1.zzzz;

                    vec4 ixy = permute(permute(ix) + iy);
                    vec4 ixy0 = permute(ixy + iz0);
                    vec4 ixy1 = permute(ixy + iz1);

                    vec4 gx0 = ixy0 / 7.0;
                    vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
                    gx0 = fract(gx0);
                    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
                    vec4 sz0 = step(gz0, vec4(0.0));
                    gx0 -= sz0 * (step(0.0, gx0) - 0.5);
                    gy0 -= sz0 * (step(0.0, gy0) - 0.5);

                    vec4 gx1 = ixy1 / 7.0;
                    vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
                    gx1 = fract(gx1);
                    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
                    vec4 sz1 = step(gz1, vec4(0.0));
                    gx1 -= sz1 * (step(0.0, gx1) - 0.5);
                    gy1 -= sz1 * (step(0.0, gy1) - 0.5);

                    vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
                    vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
                    vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
                    vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
                    vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
                    vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
                    vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
                    vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

                    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
                    g000 *= norm0.x;
                    g010 *= norm0.y;
                    g100 *= norm0.z;
                    g110 *= norm0.w;
                    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
                    g001 *= norm1.x;
                    g011 *= norm1.y;
                    g101 *= norm1.z;
                    g111 *= norm1.w;

                    float n000 = dot(g000, Pf0);
                    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
                    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
                    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
                    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
                    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
                    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
                    float n111 = dot(g111, Pf1);

                    vec3 fade_xyz = fade(Pf0);
                    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
                    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
                    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
                    return 2.2 * n_xyz;
                }

                varying vec3 vPos;
                uniform vec3 uEdgeColor1;
                uniform vec3 uEdgeColor2;
                uniform float uFreq;
                uniform float uAmp;
                uniform float uProgress;
                uniform float uEdge;
            `)
            shader.fragmentShader = shader.fragmentShader.replace(
                "#include <dithering_fragment>",
                `#include <dithering_fragment>
                float noise = cnoise(vPos* uFreq)*uAmp;
                if(noise < uProgress) discard;
                float edgeWidth = uProgress + uEdge;
                if(noise > uProgress && noise < edgeWidth){
                    gl_FragColor = vec4(uEdgeColor1,noise);
                }
                gl_FragColor = vec4(gl_FragColor.xyz,1.0);
            `)
        }

        this.pointsMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uPixelDensity: {
                    value: this.renderer.getPixelRatio()
                },
                uBaseSize: {
                    value: 40
                },
                uFreq: this.config.uFreq,
                uAmp: this.config.uAmp,
                uEdge: this.config.uEdge,
                uColor: this.config.uColor,
                uProgress: this.config.uProgress,
                uParticleTexture: {
                    value: this.uParticleTexture
                }
            },
            vertexShader,
            fragmentShader,
            transparent: true,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide
        })

    }

    createExtendGeometry(geometry) {
        this.extend = geometry;
        this.count = geometry.getAttribute("position").array.length / 3;
        this.maxOffsetArr = new Float32Array(this.count);
        this.scaleArr = new Float32Array(this.count);
        this.distArr = new Float32Array(this.count);
        this.rotationArr = new Float32Array(this.count);
        this.currentPositionArr = new Float32Array(this.extend.getAttribute("position").array);
        this.initPositionArr = new Float32Array(this.extend.getAttribute("position").array);
        this.velocityArr = new Float32Array(this.count * 3);
        for (let i = 0; i < this.count; i++) {
            let x = i * 3 + 0
            let y = i * 3 + 1
            let z = i * 3 + 2;
            this.maxOffsetArr[i] = Math.random() * 2.5 + .5;
            this.scaleArr[i] = Math.random();
            this.rotationArr[i] = Math.random() * 2 * Math.PI;
            this.velocityArr[x] = Math.random() * .02;
            this.velocityArr[y] = Math.random() * .05;
            this.velocityArr[z] = Math.random() * 0;
            this.distArr[i] = .01
        }
        this.setAttributes()
    }

    updateAttributesValues() {
        for (let t = 0; t < this.count; t++) {
            this.rotationArr[t] += .1;
            let e = t * 3 + 0;
            let i = t * 3 + 1;
            let r = t * 3 + 2;
            const s = .2;
            let o = Math.sin(this.currentPositionArr[i] * 5) * .28;
            let a = Math.sin(this.currentPositionArr[e] * 6) * .23;
            this.currentPositionArr[e] += Math.abs(this.velocityArr[e] + o) * s;
            this.currentPositionArr[i] += Math.abs(this.velocityArr[i] + a) * s;
            this.currentPositionArr[r] += this.velocityArr[r] * s;
            const l = new THREE.Vector3(this.initPositionArr[e], this.initPositionArr[i], this.initPositionArr[r]);
            const c = new THREE.Vector3(this.currentPositionArr[e], this.currentPositionArr[i], this.currentPositionArr[r]);
            const h = l.distanceTo(c);
            this.distArr[t] = h;
            if (h > this.maxOffsetArr[t]) {
                this.currentPositionArr[e] = this.initPositionArr[e]
                this.currentPositionArr[i] = this.initPositionArr[i]
                this.currentPositionArr[r] = this.initPositionArr[r]
                this.distArr[t] = .01
            }
        }
        this.setAttributes()
    }

    setAttributes() {
        this.extend.setAttribute("aOffset", new THREE.BufferAttribute(this.maxOffsetArr, 1))
        this.extend.setAttribute("aDist", new THREE.BufferAttribute(this.distArr, 1))
        this.extend.setAttribute("aRotation", new THREE.BufferAttribute(this.rotationArr, 1))
        this.extend.setAttribute("aScale", new THREE.BufferAttribute(this.scaleArr, 1))
        this.extend.setAttribute("aPosition", new THREE.BufferAttribute(this.currentPositionArr, 3))
        this.extend.setAttribute("aVelocity", new THREE.BufferAttribute(this.velocityArr, 3))
    }

    setupPointsByGeometry(geometry) {
        console.log("%c Line:429 🥑 geometry", "color:#b03734", geometry);

        geometry = geometry.clone()

        this.currentMesh?.removeFromParent()
        this.currentPoints?.removeFromParent()

        this.currentMesh = new THREE.Mesh(geometry, this.material);
        this.scene.add(this.currentMesh)

        this.createExtendGeometry(geometry)


        this.currentPoints = new THREE.Points(geometry, this.pointsMaterial)
        this.scene.add(this.currentPoints)
    }

    createEffect() {
        this.composer1 = new EffectComposer(this.renderer);
        this.composer2 = new EffectComposer(this.renderer);
        this.renderPass = new RenderPass(this.scene, this.camera);
        this.bloomPass = new UnrealBloomPass(new THREE.Vector2(this.width, this.height), .26, .4, .2);
        this.outputPass = new OutputPass();
        this.finalPass = new ShaderPass({
            uniforms: {
                tDiffuse: {
                    value: null
                },
                uBloomTexture: {
                    value: this.composer1.renderTarget2.texture
                },
                uStrength: {
                    value: 12.01
                }
            },
            vertexShader: `
                varying vec2 vUv;
                void main(){
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D tDiffuse;
                uniform sampler2D uBloomTexture;
                uniform float uStrength;
                varying vec2 vUv;
                void main(){
                    vec4 baseEffect = texture2D(tDiffuse,vUv);
                    vec4 bloomEffect = texture2D(uBloomTexture,vUv);
                    gl_FragColor = baseEffect + bloomEffect * uStrength;
                }
            `
        })

        // 添加通道
        this.composer1.addPass(this.renderPass);
        this.composer1.addPass(this.bloomPass);
        this.composer1.renderToScreen = false;
        this.composer2.addPass(this.renderPass)
        this.composer2.addPass(this.finalPass)
        this.composer2.addPass(this.outputPass)
    }

    createGui() {
        this.gui = new GUI({container: this.target})
        this.gui.domElement.style.position = 'absolute'
        this.gui.domElement.style.right = '0'
        this.gui.domElement.style.top = '0'
        this.gui.domElement.style.zIndex = '999'
        const bloomPassFolder = this.gui.addFolder('bloom');
        bloomPassFolder.add(this.bloomPass, 'threshold').min(0.01).max(.5).step(0.001)
        bloomPassFolder.add(this.bloomPass, 'strength').min(0.01).max(1).step(0.001)
        bloomPassFolder.add(this.bloomPass, 'radius').min(0.01).max(1).step(0.001)
        const materialFolder = this.gui.addFolder('material')
        materialFolder.add(this.config.uFreq, 'value').name('uFreq').min(0.01).max(1).step(0.001)
        materialFolder.add(this.config.uAmp, 'value').name('uAmp').min(0.01).max(20).step(0.001)
        materialFolder.add(this.config.uEdge, 'value').name('uEdge').min(0.01).max(2).step(0.001)
        materialFolder.add(this.config.uProgress, 'value').name('uProgress').min(-20).max(20).step(0.001)
        const geometryFolder = this.gui.addFolder('geometry');
        const currentGeometry = {
            value: this.spheregeometry
        }
        let tween = null;
        geometryFolder.add(currentGeometry, 'value', {
            roundedboxgeometry: this.roundedboxgeometry,
            spheregeometry: this.spheregeometry,
            torusgeometry: this.torusgeometry,
            teapotgeometry: this.teapotgeometry,
            torusknotgeometry: this.torusknotgeometry
        }).name('type').onChange((type) => {
            // 创建时间轴
            if (tween) {
                tween.kill()
            }
            const tl = gsap.timeline();

            tl.to(this.config.uProgress, {
                value: 20,
                duration: 1,
                ease: 'linear.inOut'
            }).add(() => {
                // this.config.uProgress = -20;
                this.setupPointsByGeometry(type)
            }, "+=0") // 在动画完成后立即执行
                .to(this.config.uProgress, {
                    value: -20,
                    duration: 1,
                    ease: 'linear.inOut'
                }, "<") // 与上一个动画同时开始

            tween = tl; // 将时间轴赋值给tween变量
        })
    }

    animation() {
        const elapsedTime = this.clock.getElapsedTime()
        this.renderer.setAnimationLoop(() => this.animation());
        this.control.update();
        this.renderer.render(this.scene, this.camera);

        if (this.currentPoints) {
            this.currentPoints.position.y = Math.sin(elapsedTime)
        }
        if (this.currentMesh) {
            this.currentMesh.position.y = Math.sin(elapsedTime)
        }
        if (this.extend) {
            this.updateAttributesValues()
        }

        this.composer1.render()

        this.finalPass.uniforms.uBloomTexture.value = this.composer1.renderTarget2.texture

        this.composer2.render()
    }

    resize() {
        window.addEventListener('resize', () => {
            this.width = this.target.offsetWidth;
            this.height = this.target.offsetHeight;
            this.camera.aspect = this.width / this.height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(this.width, this.height);
        })
    }

    destroy() {
        // scene
        this.scene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.geometry?.dispose();
                Object.values(child.material).forEach((value) => {
                    if (value && typeof value.dispose === "function") {
                        value.dispose();
                    }
                });
            }
        });
        // renderer
        this.renderer.dispose();
    }
}
