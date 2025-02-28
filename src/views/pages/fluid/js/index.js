/**
 * justThreeJs index.js
 * @author kongjianqiu
 * @description
 * @created 2025/2/20 15:27:43
 */
import * as THREE from "three";
import {EffectComposer} from "three/addons/postprocessing/EffectComposer.js";
import {RenderPass} from "three/addons/postprocessing/RenderPass.js";
import FluidPass from "@/views/pages/fluid/js/fluid.js";
import {OutputPass} from "three/addons/postprocessing/OutputPass.js";

function filePath(path) {
    return new URL(`../assets/${path}`, import.meta.url).href
}

function cUnMix(e, t, r) {
    let math = THREE.MathUtils;
    return math.clamp((r - e) / (t - e), 0, 1)
}

function fit(e, t, r, n, o, l) {
    e = cUnMix(t, r, e)
    l && (e = l(e))
    return n + e * (o - n)
}

export default class Fluid {
    constructor(config) {
        this.parent = config.parent;
        this.target = config.target;
        this.callback = config.callback;
        this.width = this.target.offsetWidth;
        this.height = this.target.offsetHeight;
        this.aspect = this.width / this.height;
        this.renderer = new THREE.WebGLRenderer({
            powerPreference: "high-performance",
            antialias: false,
            alpha: false,
            premultipliedAlpha: false,
            preserveDrawingBuffer: true
        })
        this.renderer.setSize(this.width, this.height)
        this.target.appendChild(this.renderer.domElement);
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('#464646')
        this.camera = new THREE.PerspectiveCamera(75, this.aspect, 0.01, 1000);
        this.camera.position.copy(new THREE.Vector3(0, 0, 2))
        this.camera.lookAt(new THREE.Vector3(0, 0, 0))
        this.camera.updateProjectionMatrix()
        this.scene.add(this.camera);
        this.assetsInit();
        this.resize();
    }

    async assetsInit() {
        this.manager = new THREE.LoadingManager();
        this.texture = await (new THREE.TextureLoader(this.manager)).load(filePath('LDR_RGB1_0.png'));
        // 加载完成
        this.manager.onLoad = async () => {
            console.info("%c资源加载完成!✅", "color:#fff;background-color:red");
            this.callback();
            this.geometryInit();
            this.composerInit();
            this.animation();
        }
    }

    geometryInit() {
        const light = new THREE.DirectionalLight(0xffffff, 3);
        light.position.set(1, 1, 1);
        this.scene.add(new THREE.AmbientLight(0xcccccc));
        this.scene.add(light);


        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({color: 0xc1c1c1});
        this.cube = new THREE.Mesh(geometry, material);
        this.scene.add(this.cube);
    }

    composerInit() {
        this.composer = new EffectComposer(this.renderer);
        this.renderPass = new RenderPass(this.scene, this.camera);
        this.fluidPass = new FluidPass(this);
        this.fluidPass.renderToScreen = false;
        this.outPass = new OutputPass();
        this.composer.addPass(this.renderPass);
        this.composer.addPass(this.fluidPass);
        this.composer.addPass(this.outPass);
    }


    animation() {
        this.renderer.setAnimationLoop(() => this.animation())
        this.cube.rotation.x += 0.005;
        this.cube.rotation.y += 0.01;

        this.composer.render();

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
        this.composer.dispose()
        this.renderer.dispose();
    }
}
