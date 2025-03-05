/**
 * justThreeJs index.js
 * @author kongjianqiu
 * @description
 * @created 2025/3/5 09:23:12
 */
import * as THREE from "three";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import MathEx from "@/views/pages/land/js/MathEx.js";
import {createNoise4D} from 'simplex-noise';
import {Pane} from 'tweakpane';
// glsl
import landVertex from '@/views/pages/land/glsl/land/vertex.glsl'
import landFragment from '@/views/pages/land/glsl/land/fragment.glsl'
import waterVertex from '@/views/pages/land/glsl/water/vertex.glsl'
import waterFragment from '@/views/pages/land/glsl/water/fragment.glsl'

function filePath(path) {
    return new URL(`../assets/${path}`, import.meta.url).href
}

export default class Land {
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
        this.renderer.setClearColor(0x000000, 1.0);
        this.scene = new THREE.Scene();
        this.target.appendChild(this.renderer.domElement);
        this.camera = new THREE.PerspectiveCamera(50, this.aspect, 0.1, 1000);
        this.camera.setFocalLength(50);
        this.camera.position.set(300, 300, 300);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.control = new OrbitControls(this.camera, this.renderer.domElement);
        this.control.enableDamping = true;
        this.clock = new THREE.Clock();
        this.callback();
        this.randomH = Math.random();
        this.landInit();
        this.waterInit();
        this.group = new THREE.Group();
        this.group.add(this.land);
        this.group.add(this.water);
        this.scene.add(this.group);
        this.rotation = {
            x: 0,
            y: 0,
            z: 0
        }
        this.animation();
        this.resize();
    }


    landInit() {
        const noise4D = createNoise4D(Math.random);
        const baseY = 5;
        const geometry = new THREE.BoxGeometry(100, baseY, 100, 60, 1, 60);
        for (let i = 0; i < geometry.attributes.position.count; i++) {
            const x = geometry.attributes.position.getX(i);
            const y = geometry.attributes.position.getY(i);
            const z = geometry.attributes.position.getZ(i);
            const noise1 = noise4D(
                x / 80,
                y / 80,
                z / 80,
                1
            );
            const noise2 = noise4D(
                x / 48,
                y / 32,
                z / 32,
                1
            );
            const noise3 = noise4D(
                x / 6,
                y / 6,
                z / 6,
                1
            );
            const noise4 = noise4D(
                x / 2,
                y / 2,
                z / 2,
                1
            );
            const step = (e, x) => {
                return (x >= e) ? 1 : 0;
            };
            const smoothstep = (e0, e1, x) => {
                if (e0 >= e1) return undefined;
                let t = MathEx.clamp((x - e0) / (e1 - e0), 0, 1);
                return t * t * (3 - 2 * t);
            };
            const updateY =
                (noise1 * 0.75 + 0.25) * 48
                + noise2 * 18
                + noise3 * 1.2
                + noise4 * 0.6;
            const s = smoothstep(0, 5, updateY);
            const isBottom = step(0, y);

            geometry.attributes.position.setY(i, (y + updateY * s) * isBottom);
        }
        const material = new THREE.RawShaderMaterial({
            uniforms: {
                time: {
                    value: 0
                },
                addH1: {
                    value: this.randomH - 0.5
                },
                addH2: {
                    value: this.randomH
                },
            },
            vertexShader: landVertex,
            fragmentShader: landFragment,
        });
        this.land = new THREE.Mesh(geometry, material);
    }

    waterInit() {
        const geometry = new THREE.PlaneGeometry(100, 100, 60, 60);
        const material = new THREE.RawShaderMaterial({
            uniforms: {
                time: {
                    value: 0
                },
                addH: {
                    value: this.randomH - 0.5
                },
            },
            vertexShader: waterVertex,
            fragmentShader: waterFragment,
            transparent: true,
        });
        this.water = new THREE.Mesh(geometry, material);
        this.water.translateY(8);
        this.water.rotation.set(MathEx.radians(-90), 0, 0);
    }

    animation() {
        this.renderer.setAnimationLoop(() => this.animation());
        const time = this.clock.getDelta();
        this.control.update();

        this.land.material.uniforms.time.value += time;
        this.water.material.uniforms.time.value += time;

        this.renderer.render(this.scene, this.camera);
    }

    resize() {
        window.addEventListener('resize', () => {
            this.width = this.target.offsetWidth;
            this.height = this.target.offsetHeight;
            this.resolution.set(this.width, this.height);
            this.aspect = this.width / this.height;
            this.renderer.setSize(this.width, this.height);
            this.camera.updateProjectionMatrix();
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
