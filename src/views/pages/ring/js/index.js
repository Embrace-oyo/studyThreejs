/**
 * justThreeJs index.js
 * @author kongjianqiu
 * @description
 * @created 2025/2/20 15:27:43
 */
import * as THREE from "three";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
// glsl
import vertex from '@/views/pages/ring/glsl/ringVert.glsl'
import fragment from '@/views/pages/ring/glsl/ringFrag.glsl'

function filePath(path) {
    return new URL(`../assets/${path}`, import.meta.url).href
}

export default class Ring {
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
            premultipliedAlpha: false,
            preserveDrawingBuffer: true
        })
        this.renderer.setSize(this.width, this.height)
        this.target.appendChild(this.renderer.domElement);
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('#464646')
        this.camera = new THREE.PerspectiveCamera(75, this.aspect, 0.01, 1000);
        this.camera.position.copy(new THREE.Vector3(0, 0, 20))
        this.camera.lookAt(new THREE.Vector3(0, 0, 0))
        this.camera.updateProjectionMatrix()
        this.scene.add(this.camera);
        this.control = new OrbitControls(this.camera, this.renderer.domElement);
        this.control.enableDamping = true;
        this.clock = new THREE.Clock();
        this.assetsInit();
    }

    assetsInit() {
        this.manager = new THREE.LoadingManager();
        this.texture = (new THREE.TextureLoader(this.manager)).load(filePath('nosi.png'));
        this.manager.onLoad = () => {
            this.callback();
            this.geometryInit();
            this.animation();
            this.resize();
        }
    }

    geometryInit() {
        const geometry2 = new THREE.SphereGeometry(5, 128, 128);
        const geometry3 = new THREE.PlaneGeometry(10, 10);
        const material2 = new THREE.ShaderMaterial({
            vertexShader: vertex,
            fragmentShader: fragment,
            uniforms: {
                iTime: {value: 1.0},
                iResolution: {value: new THREE.Vector2(5, 5)},
                uTexture: {value: this.texture}
            },
            depthWrite: true,
            depthTest: true,
            // blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide
        })
        this.sphere = new THREE.Mesh(geometry2, material2);
        this.scene.add(this.sphere);
    }


    animation() {
        this.renderer.setAnimationLoop(() => this.animation())
        let time = this.clock.getElapsedTime();

        this.sphere.position.set(0, Math.cos(time * 2.0) * 0.8, 0);

        this.sphere.material.uniforms.iTime.value = time

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
