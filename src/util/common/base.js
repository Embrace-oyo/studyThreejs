/**
 * justThreeJs main.js
 * @author kongjianqiu
 * @description
 * @created 2024/5/30 14:26:43
 */
import * as THREE from "three";
import Animator from '@/util/common/animator'
import Clock from '@/util/common/clock'
import IMouse from '@/util/common/iMouse'
import Resizer from '@/util/common/resizer'
import Keyboard from '@/util/common/keyboard'
/**
 * 是一个用于 Three.js 的库，简化了处理用户交互（如鼠标事件和触摸事件）的过程。它扩展了 Three.js 的功能，使开发者能够更容易地在 3D 场景中添加交互行为
 * **/
import {InteractionManager} from "three.interactive";
// 下载文件
const downloadBlob = (blob, name) => {
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style.display = "none";
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = name;
    a.click();
};

class Base {
    constructor(id = 'canvas', config = {}) {
        const {
            gl = {},
            autoAdaptMobile = false,
            callbackFn = () => {
            }
        } = config;
        this.container = document.getElementById(id);
        this.width = this.container.offsetWidth || window.innerWidth;
        this.height = this.container.offsetHeight || window.innerHeight;
        this.aspect = this.width / this.height;
        this.camera = new THREE.PerspectiveCamera(70, this.aspect, 0.01, 100);
        this.camera.position.z = 1;
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            ...gl
        });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
        this.container?.appendChild(this.renderer.domElement);
        this.animator = new Animator(this);
        this.interactionManager = new InteractionManager(this.renderer, this.camera, this.renderer.domElement);
        this.composer = null;
        this.clock = new Clock(this);
        this.iMouse = new IMouse(this);
        this.resizer = new Resizer(this, {
            autoAdaptMobile,
        });
        this.keyboard = new Keyboard();
        this.callbackFn = callbackFn
        this.init();
        this.addEventListeners();
    }

    init() {
        this.update(() => {
            this.interactionManager.update();
        });
        this.animator.update();
    }

    render() {
        if (this.composer) {
            this.composer.render();
        } else {
            this.renderer.render(this.scene, this.camera);
        }
    }

    update(fn) {
        this.animator.add(fn);
    }

    addEventListeners() {
        // resize
        this.resizer.listenForResize();
        // mouse
        this.iMouse.listenForMouse();
        // keyboard
        this.keyboard.listenForKey();
    }


    async saveScreenshot(name = `screenshot.png`) {
        this.render();
        const blob = await new Promise((resolve) => {
            this.renderer.domElement.toBlob(resolve, "image/png");
        });
        if (blob) {
            downloadBlob(blob, name);
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
        this.renderer.dispose();
    }

    callback() {
        this.callbackFn()
    }
}

export default Base
