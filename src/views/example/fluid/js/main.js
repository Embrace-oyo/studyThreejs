/**
 * justThreeJs main.js
 * @author kongjianqiu
 * @description
 * @created 2024/7/23 15:38:13
 */
import * as THREE from "three";
import {EffectComposer} from "three/addons/postprocessing/EffectComposer.js";
import {RenderPass} from "three/addons/postprocessing/RenderPass.js";
import {OutputPass} from "three/addons/postprocessing/OutputPass.js";
import {SMAAPass} from "three/addons/postprocessing/SMAAPass.js";
import Fluid from '@/views/example/fluid/js/fluid';

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
    outputPass;
    SMAAPass;
    fluidPass;

    constructor(config = {}) {
        this.target = config.DOM
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

        this.backgroundLoad();
        this.composerInit();
        this.animation();

        window.onresize = () => {
            this.resize();
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

    backgroundLoad() {
        const light = new THREE.DirectionalLight(0xffffff, 3);
        light.position.set(1, 1, 1);
        this.scene.add(new THREE.AmbientLight(0xcccccc));
        this.scene.add(light);


        this.object = new THREE.Object3D();
        const geometry = new THREE.SphereGeometry(0.5, 4, 4);
        for (let i = 0; i < 200; i++) {
            const material = new THREE.MeshPhongMaterial({
                color: 0xffffff * Math.random(),
                flatShading: true,
            });
            const mesh = new THREE.Mesh(geometry, material);

            let x = (Math.random() - 0.5);
            let y = (Math.random() - 0.5);
            let z = (Math.random() - 0.5);

            mesh.position.set(x, y, z).normalize();
            mesh.position.multiplyScalar(Math.random() * 0.8);
            mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
            mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 0.05;

            this.object.add(mesh);

        }

        this.scene.add(this.object);

    }

    composerInit() {
        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(new RenderPass(this.scene, this.camera));

        // 抗锯齿
        this.SMAAPass = new SMAAPass(this.width * window.devicePixelRatio, this.width * window.devicePixelRatio)
        this.composer.addPass(this.SMAAPass)
        this.SMAAPass.renderToScreen = false;

        // 流体绘制
        this.fluidPass = new Fluid(this);
        this.composer.addPass(this.fluidPass)

        // 通道输出
        this.outputPass = new OutputPass();
        this.composer.addPass(this.outputPass);
    }


    animation() {
        this.renderer.setAnimationLoop(() => this.animation())

        this.object.rotation.x += 0.005;
        this.object.rotation.y += 0.01;

        if (this.composer) {
            this.composer.render();
        } else {
            this.renderer.render(this.scene, this.camera)
        }

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
