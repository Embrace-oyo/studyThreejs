/**
 * justThreeJs resizer.js
 * @author kongjianqiu
 * @description
 * @created 2024/5/30 14:51:20
 */
import * as THREE from "three";
import Component from "@/views/shaderStudy/glsl/page8/init/component.js";
import OrthographicCamera from "@/views/shaderStudy/glsl/page8/init/orthographicCamera";

export default class Resizer extends Component{
    enabled;
    autoAdaptMobile;
    constructor(base, config = {}) {
        super(base);
        this.enabled = true;
        const { autoAdaptMobile = false } = config;
        this.autoAdaptMobile = autoAdaptMobile;
        if (this.autoAdaptMobile) {
            this.resize();
        }
    }
    get aspect() {
        return window.innerWidth / window.innerHeight;
    }
    resizeRenderer(renderer) {
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    }
    resizeComposer(composer) {
        composer.setSize(window.innerWidth, window.innerHeight);
        if (composer.setPixelRatio) {
            composer.setPixelRatio(Math.min(2, window.devicePixelRatio));
        }
    }
    resizeCamera(camera) {
        const { aspect } = this;
        if (camera instanceof THREE.PerspectiveCamera) {
            camera.aspect = aspect;
            camera.updateProjectionMatrix();
        }
        else if (camera instanceof OrthographicCamera) {
            const { frustum, useAspect } = camera;
            if (frustum) {
                const actualAspect = useAspect ? aspect : 1;
                [camera.left, camera.right, camera.top, camera.bottom] = [
                    actualAspect * frustum * -0.5,
                    actualAspect * frustum * 0.5,
                    frustum * 0.5,
                    frustum * -0.5,
                ];
                camera.updateProjectionMatrix();
            }
        }
    }
    resize() {
        const { base } = this;
        const { renderer, camera, composer } = base;
        // renderer
        this.resizeRenderer(renderer);
        // composer
        if (composer) {
            this.resizeComposer(composer);
        }
        // camera
        this.resizeCamera(camera);
        // mobile
        if (this.autoAdaptMobile) {
            this.adaptMobile();
        }
        this.emit("resize");
    }
    listenForResize() {
        window.addEventListener("resize", () => {
            if (!this.enabled) {
                return;
            }
            this.resize();
        });
    }
    enable() {
        this.enabled = true;
    }
    disable() {
        this.enabled = false;
    }
    adaptMobile() {
        const { base } = this;
        const { renderer, camera } = base;
        const width = document.documentElement.clientWidth, height = document.documentElement.clientHeight;
        if (width > height) {
            renderer.setSize(width, height);
            if (camera instanceof THREE.PerspectiveCamera) {
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
            }
        }
        else {
            renderer.setSize(height, width);
            if (camera instanceof THREE.PerspectiveCamera) {
                camera.aspect = height / width;
                camera.updateProjectionMatrix();
            }
        }
    }
}
