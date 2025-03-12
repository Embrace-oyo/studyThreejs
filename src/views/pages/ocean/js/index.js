/**
 * justThreeJs index.js
 * @author kongjianqiu
 * @description
 * @created 2025/3/5 17:17:05
 */
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import Sea from '@/views/pages/ocean/js/sea';
import Sky from '@/views/pages/ocean/js/sky';
import {Pane} from "tweakpane";

function filePath(path) {
    return new URL(`../assets/${path}`, import.meta.url).href
}

export default class Ocean {
    constructor(config) {
        this.parent = config.parent;
        this.target = config.target;
        this.callback = config.callback;
        this.devicePixelRatio = window.devicePixelRatio;
        this.width = this.target.offsetWidth * this.devicePixelRatio;
        this.height = this.target.offsetHeight * this.devicePixelRatio;
        this.aspect = this.width / this.height;
        this.resolution = new THREE.Vector2(this.width, this.height);
        this.renderer = new THREE.WebGLRenderer({
            powerPreference: "high-performance",
            alpha: true,
            antialias: true,
            preserveDrawingBuffer: !0
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.width, this.height);
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 0.5;
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('gray')
        this.target.appendChild(this.renderer.domElement);
        this.camera = new THREE.PerspectiveCamera(55, this.aspect, 0.1, 50000);
        this.camera.position.set(30, 30, 100);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.maxPolarAngle = Math.PI * 0.495;
        this.controls.target.set(0, 10, 0);
        this.controls.minDistance = 40.0;
        this.controls.maxDistance = 200.0;
        this.controls.update();
        this.clock = new THREE.Clock();
        this.assetsInit();
    }

    assetsInit() {
        this.manager = new THREE.LoadingManager();
        this.waterTexture = (new THREE.TextureLoader(this.manager)).load(filePath('waternormals.jpg'));
        this.waterTexture.wrapS = this.waterTexture.wrapT = THREE.RepeatWrapping;
        this.manager.onLoad = () => {
            console.info("%c资源加载完成!✅", "color:#fff;background-color:red");
            this.callback();
            this.worldInit();
            this.animation();
            this.resize();
            this.paneInit();
        }
    }

    worldInit() {
        this.sea = new Sea(this);
        this.sky = new Sky(this);
        const geometry = new THREE.BoxGeometry(30, 30, 30);
        const material = new THREE.MeshStandardMaterial({roughness: 0});
        this.cube = new THREE.Mesh(geometry, material);
        this.scene.add(this.cube);
    }


    animation() {
        this.renderer.setAnimationLoop(() => this.animation());
        const time = this.clock.getDelta();
        const time2 = performance.now() * 0.001;
        this.controls.update();
        this.cube.position.y = Math.sin(time2) * 20 + 5;
        this.cube.rotation.x = time2 * 0.5;
        this.cube.rotation.z = time2 * 0.51;
        this.sea.mesh.material.uniforms.time.value += time;
        this.renderer.render(this.scene, this.camera);
    }

    paneInit() {
        this.pane = new Pane({container: this.parent});
        this.skyFolder = this.pane.addFolder({title: "天空", expanded: true});
        this.skyFolder.addBinding(this.sky.parameters, "elevation", {
            min: 0,
            max: 360,
            step: 0.01,
            label: "海拔"
        }).on('change', () => {
            this.sky.update();
        })
        this.skyFolder.addBinding(this.sky.parameters, "azimuth", {
            min: -180,
            max: 180,
            step: 0.01,
            label: "方位角"
        }).on('change', () => {
            this.sky.update();
        })
        this.seaFolder = this.pane.addFolder({title: "海洋", expanded: true});
        this.seaFolder.addBinding(this.sea.mesh.material.uniforms.distortionScale, "value", {
            min: 0,
            max: 8,
            step: 0.01,
            label: "失真度"
        })
        this.seaFolder.addBinding(this.sea.mesh.material.uniforms.size, "value", {
            min: 0.1,
            max: 10,
            step: 0.01,
            label: "size"
        })
    }

    resize() {
        window.addEventListener('resize', () => {
            this.width = this.target.offsetWidth;
            this.height = this.target.offsetHeight;
            this.resolution.set(this.width, this.height);
            this.aspect = this.width / this.height;
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
        this.sky.renderTarget.dispose();
        this.sky.pmremGenerator.dispose();
        this.sea.renderTarget.dispose();
    }

}
