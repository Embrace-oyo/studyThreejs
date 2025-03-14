/**
 * justThreeJs index.js
 * @author kongjianqiu
 * @description
 * @created 2025/3/14 12:42:31
 */
import * as THREE from "three";
import {GUI} from "three/examples/jsm/libs/lil-gui.module.min.js";
import createTouches from 'touches';
import TrailBuffer from '@/views/pages/oil/js/trail'
import OilScreen from '@/views/pages/oil/js/oil'

function filePath(path) {
    return new URL(`../assets/${path}`, import.meta.url).href
}

export default class Oil {
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
            alpha: false,
            failIfMajorPerformanceCaveat: true,
            preserveDrawingBuffer: true
        })
        this.renderer.setSize(this.width, this.height);
        this.renderer.setClearColor(0xffffff);
        this.target.appendChild(this.renderer.domElement);
        this.scene = new THREE.Scene();
        this.clock = new THREE.Clock();
        this.gui = new GUI({container: this.parent})
        this.gui.domElement.style.position = 'absolute'
        this.gui.domElement.style.right = '0'
        this.gui.domElement.style.top = '0'
        this.gui.domElement.style.zIndex = '999'
        this.optionInit();
        this.cameraInit();
        this.assetsInit();
        this.resize();
    }

    optionInit() {
        this.maxDeltaTime = 1 / 30;
        this.time = 0;
        this.lastTime = performance.now();
        this.PLANE_ASPECT_RATIO = 9 / 16;
        this.planeWidth = this.width;
        this.planeHeight = this.planeWidth * this.PLANE_ASPECT_RATIO;

        this.touchHandler = createTouches(window, {
            target: window,
            filtered: true,
            preventSimulated: false
        });
    }

    cameraInit() {
        this.camera = new THREE.OrthographicCamera(this.width / -2, this.width / 2, this.height / 2, this.height / -2, -10000, 10000);
        this.camera.position.z = 500;
    }

    assetsInit() {
        this.manager = new THREE.LoadingManager();
        this.textureLoad = new THREE.TextureLoader(this.manager);
        this.oilTex = this.textureLoad.load(filePath('oil.jpg'));
        this.oilTex.minFilter = THREE.LinearFilter;
        this.flowTex = this.textureLoad.load(filePath('flow.png'))
        this.flowTex.minFilter = THREE.LinearFilter;
        this.manager.onLoad = () => {
            this.callback();
            this.trail = new TrailBuffer(this)
            this.oil = new OilScreen(this)
            this.oil.position.y = (this.planeHeight - this.height) * 0.5;
            this.scene.add(this.oil);
            this.animation();
            this.bindEvents();
        }
    }

    animation() {
        this.renderer.setAnimationLoop(() => this.animation());
        const now = Date.now();
        const dt = Math.min(this.maxDeltaTime, (now - this.lastTime) / 1000);
        this.time += dt;
        this.lastTime = now;
        this.trail.update();

        this.scene.traverse(obj => {
            if (typeof obj.update === 'function') {
                obj.update(dt, this.time);
            }
        });

        this.renderer.setRenderTarget(null);
        this.renderer.render(this.scene, this.camera);
    }

    bindEvents() {
        this.touchHandler.on('move', (ev, pos) => {
            this.traverse('onMouseMove', ev, pos);
        });
    }

    traverse(fn, ...args) {
        this.scene.traverse(child => {
            if (typeof child[fn] === 'function') {
                child[fn].apply(child, args);
            }
        });
    }

    resize() {
        window.addEventListener('resize', () => {
            this.width = this.target.offsetWidth;
            this.height = this.target.offsetHeight;
            this.planeWidth = this.width;
            this.planeHeight = this.planeWidth * this.PLANE_ASPECT_RATIO;
            this.camera.left = -this.width / 2;
            this.camera.right = this.width / 2;
            this.camera.top = this.height / 2;
            this.camera.bottom = -this.height / 2;
            this.camera.updateProjectionMatrix();
            this.trail.bufferMaterial.uniforms.uAspect.value = this.planeWidth / this.planeHeight;
            this.oil.material.uniforms.uResolution.value = new THREE.Vector2(this.width, this.height);
            this.traverse('onResize', {
                width: this.planeWidth,
                height: this.planeHeight
            });
            this.renderer.setSize(this.width, this.height);
        })
    }

    destroy() {

    }

}
