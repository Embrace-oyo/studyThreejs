/**
 * justThreeJs index.js
 * @author kongjianqiu
 * @description
 * @created 2025/3/4 09:35:10
 */
import * as THREE from "three";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader.js';
import MathEx from '@/views/pages/fireBall/js/MathEx';
import {Pane} from 'tweakpane';
// glsl
import backgroundVertex from '@/views/pages/skull/glsl/background/vertex.glsl'
import backgroundFragment from '@/views/pages/skull/glsl/background/fragment.glsl'

import skullVertex from '@/views/pages/skull/glsl/skull/vertex.glsl'
import skullFragment from '@/views/pages/skull/glsl/skull/fragment.glsl'

import auraPostEffectVertex from '@/views/pages/skull/glsl/auraPostEffect/vertex.glsl'
import auraPostEffectFragment from '@/views/pages/skull/glsl/auraPostEffect/fragment.glsl'

import auraVertex from '@/views/pages/skull/glsl/aura/vertex.glsl'
import auraFragment from '@/views/pages/skull/glsl/aura/fragment.glsl'

import pointsVertex from '@/views/pages/skull/glsl/points/vertex.glsl'
import pointsFragment from '@/views/pages/skull/glsl/points/fragment.glsl'

function filePath(path) {
    return new URL(`../assets/${path}`, import.meta.url).href
}

export default class Skull {
    constructor(config) {
        this.parent = config.parent;
        this.target = config.target;
        this.callback = config.callback;
        this.devicePixelRatio = window.devicePixelRatio;
        this.width = this.target.offsetWidth;
        this.height = this.target.offsetHeight;
        this.resolution = new THREE.Vector2(this.width, this.height);
        this.renderer = new THREE.WebGL1Renderer({
            powerPreference: "high-performance",
            alpha: true,
            antialias: true,
            preserveDrawingBuffer: !0
        });
        // this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.width, this.height);
        this.renderer.setClearColor(0x000000, 1.0);
        this.target.appendChild(this.renderer.domElement);
        this.clock = new THREE.Clock();
        this.time = 0;
        this.radian = 0;
        this.renderTarget1 = new THREE.WebGLRenderTarget(256, 256);
        this.renderTarget2 = new THREE.WebGLRenderTarget(256, 256);
        this.cameraInit();
        this.assetsInit();
        this.paneInit();
    }

    paneInit(){
        this.pane = new Pane({container: this.parent});
        this.controller = this.pane.addFolder({title: "控制台", expanded: true});
        this.controller.addBinding(this, "distance", {
            min: 0.1,
            max: 50,
            step: 0.01,
            label: "光环大小"
        })
    }

    cameraInit() {
        const fov = 50;
        this.scene = new THREE.Scene();
        this.sceneAura = new THREE.Scene();

        this.aspect = this.width / this.height;
        this.camera = new THREE.PerspectiveCamera(fov, this.aspect, 0.1, 1000);
        this.camera.setFocalLength(50);
        this.camera.position.set(0, 10, 40);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));

        this.cameraAura = new THREE.PerspectiveCamera(fov, 1, 0.1, 1000);
        this.cameraAura.setFocalLength(50);
        this.distance = Math.abs(Math.tan(MathEx.radians(fov) / 2) * 2) * 20 * 1.55;

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
    }


    async assetsInit() {
        this.manager = new THREE.LoadingManager();
        this.noiseTexture = (new THREE.TextureLoader(this.manager)).load(filePath('noise.png'))
        this.noiseTexture.wrapS = THREE.RepeatWrapping;
        this.noiseTexture.wrapT = THREE.RepeatWrapping;
        this.model = await (new OBJLoader(this.manager)).loadAsync(filePath('SkullHead.obj'));
        this.skullHead = this.model.children[1].geometry;
        this.skullJaw = this.model.children[0].geometry;
        this.manager.onLoad = () => {
            console.info("%c资源加载完成!✅", "color:#fff;background-color:red");
            this.callback();
            this.backgroundInit();
            this.auraPostEffectInit();
            this.skullInit();
            this.auraInit();
            this.pointsInit();
            this.readyInit();
            this.animation();
            this.resize();
        }
    }

    cameraUpdate(time) {
        this.time += time;
        this.cameraAura.position.copy(this.camera.position).normalize().multiplyScalar(this.distance);
        this.cameraAura.lookAt(new THREE.Vector3());
    }

    backgroundInit() {
        const geometry = new THREE.SphereGeometry(100, 12, 12);
        const material = new THREE.RawShaderMaterial({
            uniforms: {
                time: {
                    value: 0
                },
                hex: {
                    value: 0
                },
            },
            vertexShader: backgroundVertex,
            fragmentShader: backgroundFragment,
            side: THREE.BackSide,
        });
        this.background = new THREE.Mesh(geometry, material);
        this.background.name = 'Background';
    }

    auraPostEffectInit() {
        const geometry = new THREE.PlaneGeometry(2, 2);
        const material = new THREE.RawShaderMaterial({
            uniforms: {
                resolution: {
                    value: new THREE.Vector2(this.width, this.height),
                },
                direction: {
                    value: new THREE.Vector2(0, 0)
                },
                radius: {
                    value: 1
                },
                texture: {
                    value: this.noiseTexture
                }
            },
            vertexShader: auraPostEffectVertex,
            fragmentShader: auraPostEffectFragment,
        });
        this.auraPostEffect = new THREE.Mesh(geometry, material);
        this.auraPostEffect.name = 'AuraPostEffect';
    }

    skullInit() {
        this.skull = new THREE.Group();
        this.skullMaterial = new THREE.RawShaderMaterial({
            uniforms: {
                time: {
                    value: 0
                },
                renderOutline: {
                    value: 0
                },
                noiseTex: {
                    value: this.noiseTexture
                },
            },
            vertexShader: skullVertex,
            fragmentShader: skullFragment,
        });

        this.head = new THREE.Mesh(this.skullHead, this.skullMaterial);
        this.jaw = new THREE.Mesh(this.skullJaw, this.skullMaterial);

        this.skull.add(this.head);
        this.skull.add(this.jaw);
        this.skull.name = 'Skull';
    }

    skullUpdate(time) {
        this.skullMaterial.uniforms.time.value += time;
        this.head.rotation.set(MathEx.radians(-(Math.sin(this.skullMaterial.uniforms.time.value) * 0.7 + 0.7) * 8), 0, 0);
        this.jaw.rotation.set(MathEx.radians((Math.sin(this.skullMaterial.uniforms.time.value) * 0.7 + 0.7) * 8), 0, 0);
    }

    auraInit() {
        const geometry = new THREE.PlaneGeometry(20, 20);
        const material = new THREE.RawShaderMaterial({
            uniforms: {
                time: {
                    value: 0
                },
                postEffectTex: {
                    value: this.renderTarget1.texture
                },
                noiseTex: {
                    value: this.noiseTexture
                },
            },
            vertexShader: auraVertex,
            fragmentShader: auraFragment,
            transparent: true,
        });
        this.aura = new THREE.Mesh(geometry, material);
        this.aura.name = 'Aura';
    }


    auraUpdate(time) {
        this.aura.rotation.copy(this.camera.rotation);
        this.aura.material.uniforms.time.value += time;
    }

    pointsInit() {
        const DURATION = 4;
        const NUM = 360;
        const geometry = new THREE.BufferGeometry();
        const baPositions = new THREE.BufferAttribute(new Float32Array(NUM * 3), 3);
        const baDelays = new THREE.BufferAttribute(new Float32Array(NUM), 1);
        for (var i = 0, ul = NUM; i < ul; i++) {
            const radian = MathEx.radians(Math.random() * 360);
            const radius = Math.random() * 4 + 1;
            baPositions.setXYZ(
                i,
                Math.cos(radian) * radius,
                0,
                Math.sin(radian) * radius
            );
            baDelays.setX(i, Math.random() * DURATION);
        }
        geometry.setAttribute('position', baPositions);
        geometry.setAttribute('delay', baDelays);
        const material = new THREE.RawShaderMaterial({
            uniforms: {
                time: {
                    value: 0
                },
                duration: {
                    value: DURATION
                },
                resolution: {
                    value: new THREE.Vector2(this.width, this.height)
                },
                pixelRatio: {
                    value: window.devicePixelRatio
                },
                noiseTex: {
                    value: this.noiseTexture
                },
            },
            vertexShader: pointsVertex,
            fragmentShader: pointsFragment,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });
        this.points = new THREE.Points(geometry, material);
        this.points.name = 'Points';

    }

    pointUpdate(time) {
        this.points.material.uniforms.time.value += time;
        this.points.rotation.set(
            0,
            this.points.material.uniforms.time.value * 0.2,
            0
        );
    }

    readyInit() {
        this.group = new THREE.Group();
        this.group.add(this.skull);
        this.group.add(this.aura);
        this.group.add(this.points);
        this.scene.add(this.group);
        this.scene.add(this.background);
    }

    animation() {
        this.renderer.setAnimationLoop(() => this.animation());
        const time = this.clock.getDelta();
        this.radian += time;
        this.controls.update();
        this.cameraUpdate(time);
        this.skullUpdate(time);
        this.auraUpdate(time);
        this.pointUpdate(time);

        // processing before rendering the aura as texture.
        this.renderer.setRenderTarget(this.renderTarget1);
        this.sceneAura.add(this.skull);
        this.skullMaterial.uniforms.renderOutline.value = 1;
        // rendering the aura as texture.
        this.renderer.render(this.sceneAura, this.cameraAura);
        // processing before rendering the post effect.
        this.renderer.setRenderTarget(this.renderTarget2);
        this.sceneAura.remove(this.skull);
        this.sceneAura.add(this.auraPostEffect);
        this.auraPostEffect.material.uniforms.direction.value.set(1, 0);
        this.auraPostEffect.material.uniforms.texture.value = this.renderTarget1.texture;
        // rendering Gaussian Blur to direction X.
        this.renderer.render(this.sceneAura, this.cameraAura);
        // processing before rendering the post effect.
        this.renderer.setRenderTarget(this.renderTarget1);
        this.auraPostEffect.material.uniforms.direction.value.set(0, 1);
        this.auraPostEffect.material.uniforms.texture.value = this.renderTarget2.texture;
        // rendering Gaussian Blur to direction Y.
        this.renderer.render(this.sceneAura, this.cameraAura);
        // processing after rendering the aura as texture.
        this.renderer.setRenderTarget(null);
        this.sceneAura.remove(this.auraPostEffect);
        this.group.add(this.skull);
        this.skullMaterial.uniforms.renderOutline.value = 0;


        this.renderer.render(this.scene, this.camera);
    }

    resize() {
        window.addEventListener('resize', () => {
            this.width = this.target.offsetWidth;
            this.height = this.target.offsetHeight;
            this.resolution.set(this.width, this.height);
            this.aspect = this.width / this.height;
            this.renderer.setSize(this.width, this.height);
            this.camera.updateProjectionMatrix();
            this.points.material.uniforms.resolution.value.copy(this.resolution);
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
        this.renderTarget1.dispose()
        this.renderTarget2.dispose()
    }

}
