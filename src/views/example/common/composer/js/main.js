/**
 * justThreeJs main.js
 * @author kongjianqiu
 * @description
 * @created 2024/7/17 14:33:41
 */
import * as THREE from "three";
import {GUI} from 'three/addons/libs/lil-gui.module.min.js';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {SMAAPass} from 'three/addons/postprocessing/SMAAPass.js';
import {DotScreenPass} from 'three/addons/postprocessing/DotScreenPass.js';
import {ScreenPass} from "@/views/example/common/composer/js/screenPass.js";


class Main {
    parent;
    mainWidth = 0;
    mainHeight = 0;
    mainViewportWidth = 0;
    mainViewportHeight = 0;
    mainResolution = new THREE.Vector2();
    mainViewportResolution = new THREE.Vector2();
    MAX_PIXEL_COUNT = 2560 * 1440;
    USE_PIXEL_LIMIT = !0;
    DPR = Math.min(1.5, window.devicePixelRatio || 1);
    mainCanvas;
    mainWebGL;
    mainWebGLConfig = {antialias: !1, alpha: !1, xrCompatible: !1, powerPreference: "high-performance"};
    mainRenderer;
    mainScene;
    mainCamera;
    mainComposer;
    mainDateTime;
    mainBackgroundColor = new THREE.Color(0x3b3a38);
    mainCameraDirection = new THREE.Vector3(0, 0, 14);
    option = {
        isSmaaEnabled: true,
        autoRotate: true,
    }

    constructor(config = {}) {
        this.parent = config.DOM;
        this.mainCanvas = config.canvas;
        if (window.WebGL2RenderingContext) {
            this.mainWebGL = this.mainCanvas.getContext("webgl2", this.mainWebGLConfig)
        } else {
            this.mainWebGL = this.mainCanvas.getContext("webgl", this.mainWebGLConfig) || this.mainCanvas.getContext("experimental-webgl", this.mainWebGLConfig)
        }
        this.mainRenderer = new THREE.WebGLRenderer({
            canvas: this.mainCanvas,
            context: this.mainWebGL,
            premultipliedAlpha: !1
        })
        this.mainScene = new THREE.Scene();
        this.mainScene.background = new THREE.Color(this.mainBackgroundColor);
        this.mainCamera = new THREE.PerspectiveCamera(70, 1, .1, 200)
        this.mainCamera.lookAt(0, 0, 0)
        this.mainCamera.position.copy(this.mainCameraDirection)
        this.mainScene.add(this.mainCamera)
        this.mainDateTime = performance.now()
        this.resize(config)
        window.onresize = () => {
            this.resize(config);
        }

        this.backgroundLoad()
        this.composerInit()
        this.GuiInit()
        this.animation();

    }

    backgroundLoad() {
        const light = new THREE.DirectionalLight(0xffffff, 3);
        light.position.set(1, 1, 1);
        this.mainScene.add(new THREE.AmbientLight(0xcccccc));
        this.mainScene.add(light);


        const object = new THREE.Object3D();
        object.position.set(-6, 0, 0);
        const geometry = new THREE.SphereGeometry(0.5, 4, 4);
        for (let i = 0; i < 500; i++) {
            const material = new THREE.MeshPhongMaterial({
                color: 0xffffff * Math.random(),
                flatShading: true,
            });
            const mesh = new THREE.Mesh(geometry, material);

            let x = (Math.random() - 0.5);
            let y = (Math.random() - 0.5);
            let z = (Math.random() - 0.5);

            mesh.position.set(x, y, z).normalize();
            mesh.position.multiplyScalar(Math.random() * 5);
            mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
            mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 0.5;

            object.add(mesh);

        }


        const geometryBox = new THREE.BoxGeometry(5, 5, 5);
        const material1 = new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true});
        const boxMesh = new THREE.Mesh(geometryBox, material1)
        boxMesh.position.set(6, 0, 0)

        this.mainScene.add(object);
        this.mainScene.add(boxMesh)

    }

    backgroundUpdate() {
        if (this.option.autoRotate === true) {
            for (let i = 0; i < this.mainScene.children.length; i++) {
                const child = this.mainScene.children[i];
                if (['Object3D', 'Mesh'].includes(child.type)) {
                    child.rotation.x += 0.005;
                    child.rotation.y += 0.01;
                }
            }
        }
    }

    resize(config) {
        this.mainViewportWidth = config.DOM.offsetWidth;
        this.mainViewportHeight = config.DOM.offsetHeight;
        this.mainCanvas.style.width = `${this.mainWidth}px`
        this.mainCanvas.style.height = `${this.mainHeight}px`
        this.mainViewportResolution = new THREE.Vector2(this.mainViewportWidth, this.mainViewportHeight)
        let r = this.mainViewportWidth * this.DPR
        let n = this.mainViewportHeight * this.DPR;
        if (this.USE_PIXEL_LIMIT === !0 && r * n > this.MAX_PIXEL_COUNT) {
            let o = r / n;
            n = Math.sqrt(this.MAX_PIXEL_COUNT / o)
            r = Math.ceil(n * o)
            n = Math.ceil(n)
        }
        this.mainWidth = r
        this.mainHeight = n
        this.mainResolution.set(this.mainWidth, this.mainHeight);
        this.mainRenderer.setSize(this.mainWidth, this.mainHeight);
        if (this.mainComposer) this.mainComposer.setSize(this.mainWidth, this.mainHeight);
        this.mainCanvas.style.width = `${this.mainViewportWidth}px`;
        this.mainCanvas.style.height = `${this.mainViewportHeight}px`;
        this.mainCamera.aspect = this.mainWidth / this.mainHeight;
        this.mainCamera.updateProjectionMatrix()
    }

    GuiInit() {
        this.gui = new GUI({container: this.parent})
        this.gui.domElement.style.position = 'absolute'
        this.gui.domElement.style.right = '0'
        this.gui.domElement.style.top = '0'
        this.gui.domElement.style.zIndex = '999'


        const smaaFolder = this.gui.addFolder('SMAA');
        smaaFolder.add(this.option, 'isSmaaEnabled');

        const sceneFolder = this.gui.addFolder('Scene');
        sceneFolder.add(this.option, 'autoRotate');

    }


    composerInit() {
        this.mainComposer = new EffectComposer(this.mainRenderer);
        this.mainComposer.addPass(new RenderPass(this.mainScene, this.mainCamera));

        // 抗锯齿
        this.SMAAPass = new SMAAPass(this.mainViewportWidth * window.devicePixelRatio, this.mainViewportHeight * window.devicePixelRatio)
        this.mainComposer.addPass(this.SMAAPass)

        // 点
        // this.dotScreenPass = new DotScreenPass()
        // this.mainComposer.addPass(this.dotScreenPass)

        // 屏幕绘画
        this.screenPass = new ScreenPass(this)
        this.screenPass.renderToScreen = true;
        this.mainComposer.addPass(this.screenPass);


        // 通道输出
        this.outputPass = new OutputPass();
        this.mainComposer.addPass(this.outputPass);
    }

    animation(e = 0) {
        this.mainRenderer.setAnimationLoop((e) => this.animation(e))

        this.backgroundUpdate()

        if (this.SMAAPass) this.SMAAPass.enabled = this.option.isSmaaEnabled;

        if (this.mainComposer) {
            this.mainComposer.render();
        } else {
            this.mainRenderer.render(this.mainScene, this.mainCamera)
        }
    }

}

export default Main;
