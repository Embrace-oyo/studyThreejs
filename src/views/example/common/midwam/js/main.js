/**
 * justThreeJs main.js
 * @author kongjianqiu
 * @description
 * @created 2024/8/22 11:41:05
 */
import * as THREE from "three";
import {DRACOLoader, FBXLoader, GLTFLoader, OBJLoader, RGBELoader, TGALoader, KTX2Loader} from "three-stdlib";
import {KTX2Loader} from 'three/addons/loaders/KTX2Loader.js';
import {FileLoader} from "three";

export default class Main {
    DOM;
    width = 0;
    height = 0;
    renderer;
    composer;
    scene;
    camera;
    cameraPosition = new THREE.Vector3(0, 0, 1);
    cameraLookAt = new THREE.Vector3(0, 0, 0);

    constructor(config = {}) {
        this.target = config.target
        this.width = this.target.offsetWidth;
        this.height = this.target.offsetHeight;
        this.aspect = this.width / this.height;
        this.renderer = new THREE.WebGLRenderer({
            powerPreference: "high-performance",
            antialias: !1,
            alpha: !1,
            premultipliedAlpha: !1
        })
        this.renderer.setSize(this.width, this.height)
        this.target.appendChild(this.renderer.domElement);
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('#656565')
        this.camera = new THREE.PerspectiveCamera(75, this.aspect, 0.01, 1000);
        this.camera.position.copy(this.cameraPosition)
        this.camera.lookAt(this.cameraLookAt)
        this.camera.updateProjectionMatrix()
        this.scene.add(this.camera);

        this.assetsManage()
        this.animation();

        window.onresize = () => this.resize()
    }

    async assetsManage() {
        this.manager = new THREE.LoadingManager();
        this.manager.addHandler(/\.tga$/i, new TGALoader());
        this.dracoLoader = new DRACOLoader(this.manager);
        this.dracoLoader.setDecoderPath('./draco/');
        this.dracoLoader.preload();

        this.TextureLoader = new THREE.TextureLoader(this.manager)

        this.ktx2Loader = new KTX2Loader(this.manager);
        this.ktx2Loader.setTranscoderPath('./basis/');
        this.ktx2Loader.detectSupport(this.renderer);

        const leafModel = this.dracoLoader.loadAsync('/assets/geometries/leaf.drc');
        const petalModel = this.dracoLoader.loadAsync('/assets/geometries/petal.drc');
        const needleModel = this.dracoLoader.loadAsync('/assets/geometries/needle.drc');
        const borderModel = this.dracoLoader.loadAsync('/assets/geometries/border.drc');

        const leafTexture = this.ktx2Loader.loadAsync('./midwam/leaf.ktx2')
        const petalTexture = this.ktx2Loader.loadAsync('./midwam/petal.ktx2')
        const noiseSimplexLayeredTexture = this.ktx2Loader.loadAsync('./midwam/noise-simplex-layered.ktx2')
        const emailTexture = this.ktx2Loader.loadAsync('./midwam/email.ktx2')
        const headlineTexture = this.ktx2Loader.loadAsync('./midwam/headline.ktx2')

        const transitionNomipmapsTexture = this.TextureLoader.loadAsync('./midwam/transition-nomipmaps.jpg')

        this.manager.onLoad = async () => {
            console.log('资源加载完成!');

            this.leafModel = await leafModel
            this.petalModel = await petalModel
            this.needleModel = await needleModel
            this.borderModel = await borderModel
            this.leafTexture = await leafTexture
            this.petalTexture = await petalTexture
            this.emailTexture = await emailTexture
            this.headlineTexture = await headlineTexture
            this.noiseSimplexLayeredTexture = await noiseSimplexLayeredTexture
            this.transitionNomipmapsTexture = await transitionNomipmapsTexture
        }
    }

    animation() {
        this.renderer.setAnimationLoop(() => this.animation())

        if (this.composer) {
            this.composer.render();
        } else {
            this.renderer.render(this.scene, this.camera)
        }
    }

    resize() {
        this.width = this.target.offsetWidth;
        this.height = this.target.offsetHeight;
        this.aspect = this.width / this.height;
        this.renderer.setSize(this.width, this.height)
        if (this.composer) this.composer.setSize(this.width, this.height);
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix()
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
        if (this.composer) this.composer.dispose()
        this.renderer.dispose();
    }

}
