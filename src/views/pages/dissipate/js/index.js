/**
 * justThreeJs index.js
 * @author kongjianqiu
 * @description
 * @created 2025/2/19 14:21:49
 */
import * as THREE from 'three'
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader.js'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js';
import {SMAAPass} from "three/examples/jsm/postprocessing/SMAAPass.js";
import {UnrealBloomPass} from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import {OutputPass} from 'three/examples/jsm/postprocessing/OutputPass.js';
import {ShaderPass} from 'three/examples/jsm/postprocessing/ShaderPass.js';
import {TeapotGeometry} from 'three/examples/jsm/geometries/TeapotGeometry.js';
import {Pane} from 'tweakpane';

// GLSL
import shaderPassVertext from '@/views/pages/dissipate/glsl/shaderPassVertext.glsl'
import shaderPassFragment from '@/views/pages/dissipate/glsl/shaderPassFragment.glsl'
import particleVertext from '@/views/pages/dissipate/glsl/particleVertext.glsl'
import particleFragment from '@/views/pages/dissipate/glsl/particleFragment.glsl'
import snoise from '@/views/pages/dissipate/glsl/snoise.glsl'
import cnoise from '@/views/pages/dissipate/glsl/cnoise.glsl'

function filePath(path) {
    return new URL(`../assets/${path}`, import.meta.url).href
}

export default class Dissipate {
    constructor(config) {
        this.parent = config.parent;
        this.target = config.target;
        this.callback = config.callback;
        this.devicePixelRatio = window.devicePixelRatio;
        this.width = this.target.offsetWidth * this.devicePixelRatio;
        this.height = this.target.offsetHeight * this.devicePixelRatio;
        this.clock = new THREE.Clock();
        this.renderer = new THREE.WebGLRenderer({
            powerPreference: "high-performance",
            antialias: false,
            stencil: false,
            depth: false,
            preserveDrawingBuffer: !0
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.width, this.height);
        this.renderer.toneMapping = THREE.CineonToneMapping;
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.target.appendChild(this.renderer.domElement);
        this.scene = new THREE.Scene();
        this.blackColor = new THREE.Color(0x000000);
        this.scene.background = this.blackColor;
        this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 100);
        this.camera.position.set(15, 0, 15);
        this.control = new OrbitControls(this.camera, this.renderer.domElement);
        this.control.enableDamping = true;
        this.composerInit();
        this.geometryInit();
        this.paramsInit();
        this.particleInit();
        this.paneInit();
        this.assetsInit();
    }

    composerInit() {
        this.composer1 = new EffectComposer(this.renderer);
        this.composer2 = new EffectComposer(this.renderer);

        this.renderPass = new RenderPass(this.scene, this.camera);
        this.unrealBloomPass = new UnrealBloomPass(new THREE.Vector2(this.height, this.width), .26, .4, .2);
        this.bloomPass = new ShaderPass(new THREE.ShaderMaterial({
            uniforms: {
                tDiffuse: {
                    value: null
                },
                uBloomTexture: {
                    value: this.composer1.renderTarget2.texture
                },
                uStrength: {
                    value: 12
                }
            },

            vertexShader: shaderPassVertext,
            fragmentShader: shaderPassFragment,
        }));
        this.smaaPass = new SMAAPass(this.width, this.height);
        this.outPass = new OutputPass();


        this.composer1.addPass(this.renderPass);
        this.composer1.addPass(this.unrealBloomPass);
        this.composer1.renderToScreen = false;

        this.composer2.addPass(this.renderPass);
        this.composer2.addPass(this.bloomPass);
        this.composer2.addPass(this.smaaPass);
        this.composer2.addPass(this.outPass);
    }

    paramsInit() {
        this.autoDissolve = false;
        this.dissolving = true;
        this.geoIdx = 0;
        this.geoLength = this.geometries.length;
        this.meshColor = '#' + (new THREE.Color('#636363')).getHexString();
        this.edgeColor = '#' + (new THREE.Color('#4d9bff')).getHexString();
        this.particleColor = '#' + (new THREE.Color('#4d9bff')).getHexString();
        // 用于调整速度位置
        this.particleData = {
            particleSpeedFactor: 0.02,
            velocityFactor: {x: 2.5, y: 2},
            waveAmplitude: 0,
        }
        this.uniforms = {
            uColor: {
                value: new THREE.Color(0x4d9bff)
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
    }

    beforeCompile() {
        this.meshPhysicalMaterial.onBeforeCompile = (shader) => {
            shader.uniforms = {
                ...shader.uniforms,
                ...this.uniforms
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
             
                 ${snoise}

                varying vec3 vPos;
                uniform vec3 uColor;
                uniform float uFreq;
                uniform float uAmp;
                uniform float uProgress;
                uniform float uEdge;
            `)
            shader.fragmentShader = shader.fragmentShader.replace(
                "#include <dithering_fragment>",
                `#include <dithering_fragment>
                float noise = snoise(vPos* uFreq)*uAmp;
                if(noise < uProgress) discard;
                float edgeWidth = uProgress + uEdge;
                if(noise > uProgress && noise < edgeWidth){
                    gl_FragColor = vec4(uColor,noise);
                }
                gl_FragColor = vec4(gl_FragColor.xyz,1.0);
                
            `)
        }
    }

    geometryInit() {
        const segments1 = 140;
        const segments2 = 32;
        this.sphere = new THREE.SphereGeometry(4.5, segments1, segments1);
        this.teaPot = new TeapotGeometry(3, segments2);
        this.torus = new THREE.TorusGeometry(3, 1.5, segments1, segments1);
        this.torusKnot = new THREE.TorusKnotGeometry(2.5, 0.8, segments1, segments1);
        this.geoNames = ["TorusKnot", "Tea Pot", "Sphere", "Torus"];
        this.geometries = [this.torusKnot, this.teaPot, this.sphere, this.torus];
        this.meshGeometry = this.geometries[0];
        this.meshPhysicalMaterial = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color('#636363'),
            metalness: 2.0,
            roughness: 0,
            side: THREE.DoubleSide
        });
        this.beforeCompile();
        this.mesh = new THREE.Mesh(this.meshGeometry, this.meshPhysicalMaterial);
        this.scene.add(this.mesh);
    }

    particleInit() {
        this.particleMaterial = new THREE.ShaderMaterial({
            transparent: true,
            blending: THREE.AdditiveBlending,
            uniforms: {
                uTexture: {
                    value: this.particleTexture,
                },
                uPixelDensity: {
                    value: this.renderer.getPixelRatio()
                },
                uProgress: {
                    value: this.uniforms.uProgress.value,
                },
                uEdge: {
                    value: 0.8
                },
                uAmp: {
                    value: 16,
                },
                uFreq: {
                    value: 0.25,
                },
                uBaseSize: {
                    value: 80,
                },
                uColor: {
                    value: new THREE.Color('#4d9bff'),
                }
            },
            vertexShader: particleVertext,
            fragmentShader: particleFragment,
        });
        this.particleMesh = new THREE.Points(this.meshGeometry, this.particleMaterial);
        this.scene.add(this.particleMesh);

        // 粒子数量
        this.particleCount = this.meshGeometry.attributes.position.count;
        // 粒子可以从其初始位置走多远
        this.particleMaxOffsetArr = new Float32Array(this.particleCount);
        // 存储粒子的初始位置——如果超过 maxoffset，粒子位置将在这里重置
        this.particleInitPosArr = new Float32Array(this.meshGeometry.getAttribute('position').array);
        // 用于更新粒子的位置
        this.particleCurrPosArr = new Float32Array(this.meshGeometry.getAttribute('position').array);
        // 每个粒子的速度
        this.particleVelocityArr = new Float32Array(this.particleCount * 3);
        this.particleDistArr = new Float32Array(this.particleCount);
        this.particleRotationArr = new Float32Array(this.particleCount);

        for (let i = 0; i < this.particleCount; i++) {
            let x = i * 3;
            let y = i * 3 + 1;
            let z = i * 3 + 2;

            this.particleMaxOffsetArr[i] = Math.random() * 5.5 + 1.5;

            this.particleVelocityArr[x] = Math.random() * 0.5 + 0.5;
            this.particleVelocityArr[y] = Math.random() * 0.5 + 0.5;
            this.particleVelocityArr[z] = Math.random() * 0.1;

            this.particleDistArr[i] = 0.001;
            this.particleRotationArr[i] = Math.random() * Math.PI * 2;

        }

        this.setAttribute();
    }

    updateParticle() {
        for (let i = 0; i < this.particleCount; i++) {
            let x = i * 3 + 0;
            let y = i * 3 + 1;
            let z = i * 3 + 2;

            let vx = this.particleVelocityArr[i * 3 + 0];
            let vy = this.particleVelocityArr[i * 3 + 1];
            let vz = this.particleVelocityArr[i * 3 + 2];

            vx *= this.particleData.velocityFactor.x;
            vy *= this.particleData.velocityFactor.y;

            const posx = this.particleCurrPosArr[i * 3 + 0];
            const posy = this.particleCurrPosArr[i * 3 + 1];

            let xwave1 = Math.sin(posy * 2) * (0.8 + this.particleData.waveAmplitude);
            let ywave1 = Math.sin(posx * 2) * (0.6 + this.particleData.waveAmplitude);

            let xwave2 = Math.sin(posy * 5) * (0.2 + this.particleData.waveAmplitude);
            let ywave2 = Math.sin(posx * 1) * (0.9 + this.particleData.waveAmplitude);


            let xwave3 = Math.sin(posy * 8) * (0.8 + this.particleData.waveAmplitude);
            let ywave3 = Math.sin(posx * 5) * (0.6 + this.particleData.waveAmplitude);


            let xwave4 = Math.sin(posy * 3) * (0.8 + this.particleData.waveAmplitude);
            let ywave4 = Math.sin(posx * 7) * (0.6 + this.particleData.waveAmplitude);

            let xwave = xwave1 + xwave2 + xwave3 + xwave4;
            let ywave = ywave1 + ywave2 + ywave3 + ywave4;


            vx += xwave;
            vy += ywave;


            vx *= Math.abs(this.particleData.particleSpeedFactor);
            vy *= Math.abs(this.particleData.particleSpeedFactor);
            vz *= Math.abs(this.particleData.particleSpeedFactor);


            this.particleCurrPosArr[x] += vx;
            this.particleCurrPosArr[y] += vy;
            this.particleCurrPosArr[z] += vz;

            const vec1 = new THREE.Vector3(this.particleInitPosArr[x], this.particleInitPosArr[y], this.particleInitPosArr[z]);
            const vec2 = new THREE.Vector3(this.particleCurrPosArr[x], this.particleCurrPosArr[y], this.particleCurrPosArr[z]);
            const dist = vec1.distanceTo(vec2);

            this.particleDistArr[i] = dist;
            this.particleRotationArr[i] += 0.01;

            if (dist > this.particleMaxOffsetArr[i]) {
                this.particleCurrPosArr[x] = this.particleInitPosArr[x];
                this.particleCurrPosArr[y] = this.particleInitPosArr[y];
                this.particleCurrPosArr[z] = this.particleInitPosArr[z];
            }
        }
        this.setAttribute();
    }

    setAttribute() {
        this.meshGeometry.setAttribute('aOffset', new THREE.BufferAttribute(this.particleMaxOffsetArr, 1));
        this.meshGeometry.setAttribute('aCurrentPos', new THREE.BufferAttribute(this.particleCurrPosArr, 3));
        this.meshGeometry.setAttribute('aVelocity', new THREE.BufferAttribute(this.particleVelocityArr, 3));
        this.meshGeometry.setAttribute('aDist', new THREE.BufferAttribute(this.particleDistArr, 1));
        this.meshGeometry.setAttribute('aAngle', new THREE.BufferAttribute(this.particleRotationArr, 1));
    }

    floatMeshes(time) {
        this.mesh.position.set(0, Math.sin(time * 2.0) * 0.5, 0);
        this.particleMesh.position.set(0, Math.sin(time * 2.0) * 0.5, 0);
    }

    async assetsInit() {
        this.manager = new THREE.LoadingManager();
        this.cubeTexture = await (new RGBELoader(this.manager)).loadAsync(filePath('宇宙4K (5).hdr'));
        this.cubeTexture.mapping = THREE.EquirectangularReflectionMapping
        this.scene.background = this.cubeTexture
        this.scene.environment = this.cubeTexture
        this.particleTexture = await (new THREE.TextureLoader(this.manager).load(filePath('star3.png')))
        // 加载完成
        this.manager.onLoad = async () => {
            console.info("%c资源加载完成!✅", "color:#fff;background-color:red",);
            this.callback();
            this.particleInit();
            this.animation();
        }
    }

    resizeRenderer() {
        const width = this.target.offsetWidth * this.devicePixelRatio;
        const height = this.target.offsetHeight * this.devicePixelRatio;

        const needResize = this.width !== width || this.height !== height;

        if (needResize) {

            this.renderer.setSize(width, height);

            this.renderPass.setSize(width, height);
            this.outPass.setSize(width, height);
            this.unrealBloomPass.setSize(width, height);

            this.composer1.setSize(width, height);
            this.composer2.setSize(width, height);

            this.width = width;
            this.height = height;
        }

        return needResize;
    }

    animateDissolve() {
        if (!this.autoDissolve) return;
        let progress = this.uniforms.uProgress;
        if (this.dissolving) {
            progress.value += 0.08;
        } else {
            progress.value -= 0.08;
        }

        if (progress.value > 20 && this.dissolving) {
            this.dissolving = false;
            this.geoIdx++;
            this.handleChange(this.geometries[this.geoIdx % this.geoLength]);
            //@ts-ignore
            this.meshBlade.value = this.geometries[this.geoIdx % this.geoLength];
        }

        if (progress.value < -20 && !this.dissolving) this.dissolving = true

        this.progressBinding.controller.value.setRawValue(progress.value);
    }

    animation() {
        let time = this.clock.getElapsedTime();

        this.renderer.setAnimationLoop(() => this.animation());
        this.control.update();

        this.updateParticle();

        this.floatMeshes(time);

        this.animateDissolve();

        if (this.resizeRenderer()) {
            this.camera.aspect = this.width / this.height;
            this.camera.updateProjectionMatrix();
        }


        this.scene.background = this.blackColor;
        this.composer1.render();

        this.scene.background = this.cubeTexture;
        this.composer2.render();
    }

    handleChange(obj) {
        this.scene.remove(this.mesh);
        this.scene.remove(this.particleMesh);

        this.meshGeometry = obj;
        this.mesh = new THREE.Mesh(this.meshGeometry, this.meshPhysicalMaterial);

        this.particleInit();
        this.scene.add(this.mesh);
    }

    paneInit() {
        this.pane = new Pane({container: this.parent});
        this.controller = this.pane.addFolder({title: "控制台", expanded: true});
        this.bloomFolder = this.controller.addFolder({title: "辉光", expanded: true});
        this.bloomFolder.addBinding(this.bloomPass.uniforms.uStrength, "value", {
            min: 1,
            max: 20,
            step: 0.01,
            label: "强度"
        }).on('change', (obj) => {
            this.bloomPass.uniforms.uStrength.value = obj.value;
        })
        this.meshBlade = this.pane.addBlade({
            view: 'list',
            label: '物体切换',
            options: [
                {text: 'TorusKnot', value: this.torusKnot},
                {text: 'Tea Pot', value: this.teaPot},
                {text: 'Sphere', value: this.sphere},
                {text: 'Torus', value: this.torus},
            ],
            value: this.torusKnot
        }).on('change', (obj) => {
            this.handleChange(obj.value);
        })
        this.meshFolder = this.controller.addFolder({title: "物体", expanded: true});
        this.meshFolder.addBinding(this.mesh, "visible", {label: "显示物体"}).on('change', (obj) => {
            this.mesh.visible = obj.value;
        });
        this.progressBinding = this.meshFolder.addBinding(this.uniforms.uProgress, "value", {
            min: -20,
            max: 20,
            step: 0.0001,
            label: "进度"
        }).on('change', (obj) => {
            this.uniforms.uProgress.value = obj.value;
            this.particleMaterial.uniforms.uProgress.value = obj.value;
        });
        this.meshFolder.addBinding(this, "autoDissolve", {label: "播放动画"}).on('change', (obj) => {
            this.autoDissolve = obj.value
        });
        this.meshFolder.addBinding(this.uniforms.uEdge, "value", {
            min: 0.1,
            max: 8,
            step: 0.001,
            label: "边缘宽度"
        }).on('change', (obj) => {
            this.uniforms.uEdge.value = obj.value
        });
        this.meshFolder.addBinding(this.uniforms.uFreq, "value", {
            min: 0.001,
            max: 2,
            step: 0.001,
            label: "频率"
        }).on('change', (obj) => {
            this.uniforms.uFreq.value = obj.value
        });
        this.meshFolder.addBinding(this.uniforms.uAmp, "value", {
            min: 0.1,
            max: 50,
            step: 0.001,
            label: "振幅"
        }).on('change', (obj) => {
            this.uniforms.uAmp.value = obj.value
        });
        this.meshFolder.addBinding(this, "meshColor", {label: "物体颜色"}).on('change', (obj) => {
            this.meshPhysicalMaterial.color.set(obj.value)
        });

        this.meshFolder.addBinding(this, "edgeColor", {label: "边缘颜色"}).on('change', (obj) => {
            this.uniforms.uColor.value.set(obj.value);
        });


        this.particleFolder = this.controller.addFolder({title: "粒子", expanded: true});
        this.particleFolder.addBinding(this.particleMesh, "visible", {label: "显示粒子"}).on('change', (obj) => {
            this.particleMesh.visible = obj.value;
        });
        this.particleFolder.addBinding(this.particleMaterial.uniforms.uBaseSize, "value", {
            min: 0.1,
            max: 3000,
            step: 0.01,
            label: "粒子大小"
        }).on('change', (obj) => {
            this.particleMaterial.uniforms.uBaseSize.value = obj.value;
        });
        this.particleFolder.addBinding(this, "particleColor", {label: "粒子颜色"}).on('change', (obj) => {
            this.particleMaterial.uniforms.uColor.value.set(obj.value)
        });
        this.particleFolder.addBinding(this.particleData, "particleSpeedFactor", {
            min: 0.001,
            max: 0.1,
            step: 0.001,
            label: "粒子漂浮速度"
        }).on('change', (obj) => {
            this.particleData.particleSpeedFactor = obj.value
        });
        this.particleFolder.addBinding(this.particleData, "waveAmplitude", {
            min: 0,
            max: 5,
            step: 0.01,
            label: "粒子波幅"
        }).on('change', (obj) => {
            this.particleData.waveAmplitude = obj.value;
        });
        this.particleFolder.addBinding(this.particleData, "velocityFactor", {
            expanded: true,
            picker: 'inline',
            label: "粒子方向"
        }).on('change', (obj) => {
            this.particleData.velocityFactor = obj.value
        });
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
        this.composer1.dispose()
        this.composer2.dispose()
        this.renderer.dispose();
    }
}
