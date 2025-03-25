/**
 * justThreeJs index.js
 * @author kongjianqiu
 * @description
 * @created 2025/3/21 11:14:27
 */

// const properties = new Properties;

import * as THREE from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import {EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer.js";
import {RenderPass} from "three/addons/postprocessing/RenderPass.js";
import {OutputPass} from "three/addons/postprocessing/OutputPass.js";

import Hero from '@/views/pages/hero/js/hero/hero'

export default class HeroMain {
    constructor(config) {
        this.parent = config.parent;
        this.target = config.target;
        this.callback = config.callback;
        this.devicePixelRatio = window.devicePixelRatio;
        this.width = this.target.offsetWidth;
        this.height = this.target.offsetHeight;
        this.aspect = this.width / this.height;
        this.resolution = new THREE.Vector2(this.width, this.height);
        this.renderer = new THREE.WebGLRenderer({
            powerPreference: "high-performance",
            alpha: true,
            antialias: true,
            preserveDrawingBuffer: !0
        });
        this.renderer.setSize(this.width, this.height);
        this.scene = new THREE.Scene();
        this.target.appendChild(this.renderer.domElement);
        this.camera = new THREE.PerspectiveCamera(45, this.aspect, 0.1, 50000);
        this.camera.position.set(0, 0, 5);
        this.camera.lookAt(0, 0, 0)
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.clock = new THREE.Clock();
        this.debugInit();
        this.commonInit();
        this.assetsInit();
    }

    debugInit() {
        const light = new THREE.DirectionalLight(0xffffff, 3);
        light.position.set(1, 1, 1);
        this.scene.add(new THREE.AmbientLight(0xcccccc));
        this.scene.add(light);


        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const material = new THREE.MeshBasicMaterial({color: '#7455c9'});
        this.cube = new THREE.Mesh(geometry, material);
        this.scene.add(this.cube);
    }

    commonInit() {
        this.commonUniforms = {
            u_time: {value: 0},
            u_resolution: {value: new THREE.Vector2(this.width, this.height)},
            u_aspect: {value: 1},
        }
        this.introRatio = 0;
        this.bgColorHex = new THREE.Color('#f0f1fa');
        this.bgColor = new THREE.Color('#f0f1fa');
        this.dateTime = performance.now()
        this.time = 0;
        this.startTime = 0;


    }

    composerInit() {
        this.composer = new EffectComposer(this.renderer);
        this.renderPass = new RenderPass(this.scene, this.camera);
        this.outPass = new OutputPass();

        this.composer.addPass(this.renderPass);
        this.composer.addPass(this.hero.heroEfxPrevPass);
        this.composer.addPass(this.hero.heroEfxPass);
        this.composer.addPass(this.outPass);
    }

    async assetsInit() {
        this.manager = new THREE.LoadingManager();
        this.hero = new Hero(this);
        this.manager.onLoad = () => {
            this.callback();
            this.hero.init();
            this.composerInit();
            this.animation();
        }
    }

    animation() {
        this.renderer.setAnimationLoop(() => this.animation());

        let o = performance.now()
        let e = (o - this.dateTime) / 1e3;
        this.dateTime = o
        e = Math.min(e, 1 / 20)
        this.startTime += e;
        this.time += e;
        this.commonUniforms.u_time.value += e;

        this.hero.syncProperties(e)
        this.hero.update(e)

        this.composer.render();
    }

    resize() {
        window.addEventListener('resize', () => {
            this.width = this.target.offsetWidth;
            this.height = this.target.offsetHeight;
            this.resolution.set(this.width, this.height);
            this.aspect = this.width / this.height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(this.width, this.height);
            this.hero.resize(this.width, this.height)
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
        if (this.composer) this.composer.dispose();
    }
}
