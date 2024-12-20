/**
 * justThreeJs createScene.js
 * @author kongjianqiu
 * @description
 * @created 2024/12/20 10:11:17
 */
import * as THREE from "three";
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

export default class CreateScene {
    constructor(config = {
        geometry: new THREE.BoxGeometry(10, 10, 2),
        backgroundColor: 0x000000,
        controls: false,
        camera: {
            fov: 45,
            near: 0.1,
            far: 100,
            x: 0,
            y: 0,
            z: 0,
        }
    }) {
        this.target = config.target;
        this.width = this.target.offsetWidth;
        this.height = this.target.offsetHeight;
        this.aspect = this.width / this.height;
        this.camera = new THREE.PerspectiveCamera(config.camera.fov, this.aspect, config.camera.near, config.camera.far);
        this.camera.position.set(config.camera.x, config.camera.y, config.camera.z);

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(config.backgroundColor);
        const light = new THREE.DirectionalLight(0xffffff, 3);
        light.position.set(1, 1, 1);
        this.scene.add(new THREE.AmbientLight(0xcccccc));
        this.scene.add(light);

         if (config.controls) {
             this.controls = new OrbitControls(this.camera, config.renderer.domElement);
             this.controls.target.set(0, 0, 0);
             this.controls.update();
             this.controls.enablePan = false;
             this.controls.enableDamping = true;
         }


        if (config.environment) this.scene.environment = config.environment;

        if (config.model) this.scene.add(config.model)

        if (config.mesh) this.scene.add(config.mesh)

        if (config.geometry && !config.model && !config.mesh) {
            const color = 0x0000ff;
            const material = new THREE.MeshPhongMaterial({color: color, flatShading: true});
            const mesh = new THREE.InstancedMesh(config.geometry, material, 500);
            this.scene.add(mesh)
        }
    }


    animation() {
        this.controls.update();
    }


    resize() {
        this.width = this.target.offsetWidth;
        this.height = this.target.offsetHeight;
        this.aspect = this.width / this.height;
        this.camera.aspect = this.aspect;
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
    }

}
