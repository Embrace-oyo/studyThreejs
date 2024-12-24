/**
 * justThreeJs main.js
 * @author kongjianqiu
 * @description
 * @created 2024/11/28 14:58:51
 */
import * as THREE from "three";
import {DRACOLoader, TGALoader} from "three-stdlib";
import {KTX2Loader} from 'three/addons/loaders/KTX2Loader.js';
import {FileLoader} from "three";
import axios from "axios";

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
    manager;
    TextureLoader;
    dracoLoader;
    ktx2Loader;

    constructor(config = {}) {
        this.target = config.target;
        this.width = this.target.offsetWidth;
        this.height = this.target.offsetHeight;
        this.aspect = this.width / this.height;
        this.renderer = new THREE.WebGLRenderer({
            depth: !0,
            stencil: !0,
            alpha: !1,
            antialias: !1,
            premultipliedAlpha: !0,
            preserveDrawingBuffer: !1,
            powerPreference: 'default',
            failIfMajorPerformanceCaveat: !1,
        })
        this.renderer.setSize(this.width, this.height);
        this.target.appendChild(this.renderer.domElement);
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('#656565');
        this.camera = new THREE.PerspectiveCamera(75, this.aspect, 0.01, 1000);
        this.camera.position.copy(this.cameraPosition);
        this.camera.lookAt(this.cameraLookAt);
        this.camera.updateProjectionMatrix();
        this.scene.add(this.camera);


        window.onresize = () => {
            this.resize();
        }
        this.assetsManage();
        this.animation();
    }

    assetsManage() {
        this.manager = new THREE.LoadingManager();
        this.manager.addHandler(/\.tga$/i, new TGALoader());
        this.fileLoader = new THREE.FileLoader(this.manager);
        this.fileLoader.setResponseType('arrayBuffer');
        this.TextureLoader = new THREE.TextureLoader(this.manager)
        this.dracoLoader = new DRACOLoader(this.manager);
        // this.dracoLoader.setDecoderConfig({type: 'js'})
        this.dracoLoader.setDecoderPath('./draco/');
        this.dracoLoader.preload();
        this.ktx2Loader = new KTX2Loader(this.manager);
        this.ktx2Loader.setTranscoderPath('./basis/');
        this.ktx2Loader.detectSupport(this.renderer);







        this.manager.onLoad = async () => {

        }
    }

    animation() {
        this.renderer.setAnimationLoop(() => this.animation());

        this.renderer.render(this.scene, this.camera);
    }

    resize() {
        this.width = this.target.offsetWidth;
        this.height = this.target.offsetHeight;
        this.aspect = this.width / this.height;
        this.renderer.setSize(this.width, this.height);
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
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
