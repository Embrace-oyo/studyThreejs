/**
 * justThreeJs index.js
 * @author kongjianqiu
 * @description
 * @created 2025/3/12 11:06:23
 */
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import {DRACOLoader, KTX2Loader, GLTFLoader} from "three-stdlib";
import BasRelief from "@/views/pages/plaster/js/basRelief.js";

function filePath(path) {
    return new URL(`../assets/${path}`, import.meta.url).href
}

export default class Plaster {
    constructor(config) {
        this.parent = config.parent;
        this.target = config.target;
        this.callback = config.callback;
        this.width = this.target.offsetWidth;
        this.height = this.target.offsetHeight;
        this.aspect = this.width / this.height;
        this.renderer = new THREE.WebGLRenderer({
            powerPreference: "high-performance",
            antialias: true,
            alpha: true,
            premultipliedAlpha: false,
            preserveDrawingBuffer: true
        })
        this.renderer.setSize(this.width, this.height);
        this.renderer.autoClear = false;
        this.target.appendChild(this.renderer.domElement);
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf7f7f7);
        this.camera = new THREE.PerspectiveCamera(75, this.aspect, 0.01, 10000);
        this.camera.position.copy(new THREE.Vector3(0, 0, 10))
        this.camera.lookAt(new THREE.Vector3(0, 0, 0))
        this.camera.updateProjectionMatrix()
        this.scene.add(this.camera);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.target.set(0, 0, 0);
        this.controls.update();
        this.controls.enablePan = true;
        this.controls.enableDamping = true;
        this.clock = new THREE.Clock();
        this.dateTime = performance.now()
        this.assetsInit();
    }

    async assetsInit() {
        this.manager = new THREE.LoadingManager();
        this.ktx2Loader = (new KTX2Loader(this.manager)).setTranscoderPath('/basis/').detectSupport(this.renderer);
        this.textureLoader = new THREE.TextureLoader(this.manager);
        this.dracoLoader = (new DRACOLoader()).setDecoderPath('/draco/gltf/');
        this.glbLoader = new GLTFLoader(this.manager);
        this.glbLoader.setDRACOLoader(this.dracoLoader);
        this.maskNoise = this.textureLoader.load(filePath('img/mask-noise.png'));
        this.plasterTexture = this.textureLoader.load(filePath('img/plaster.jpg'));
        this.glbLoader.load(filePath('glb/reliefs_high_compressed.glb'), (model) => this.reliefsModel = model.scene)
        this.attenuation = this.textureLoader.load(filePath('img/rgb-attenuation-0,9.png'));
        // this.normal05 = this.ktx2Loader.load(filePath('ktx/normal_05.ktx2'));
        // this.normal06 = this.ktx2Loader.load(filePath('ktx/normal_06.ktx2'));
        // this.rocksNormal = this.ktx2Loader.load(filePath('ktx/rocks_normal.ktx2'));
        // this.maskNoise2 = this.textureLoader.load(filePath('img/rgb-noise.jpg'));
        this.manager.onLoad = () => {
            this.callback();
            this.basRelief = new BasRelief(this);
            this.animation();
            this.resize();
        }
    }

    animation() {
        this.renderer.setAnimationLoop(() => this.animation());
        this.controls.update();


        this.renderer.render(this.scene, this.camera);
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
