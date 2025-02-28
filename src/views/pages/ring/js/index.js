/**
 * justThreeJs index.js
 * @author kongjianqiu
 * @description
 * @created 2025/2/20 15:27:43
 */
import * as THREE from "three";
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
        this.clock = new THREE.Clock();
        this.assetsInit();
    }

    assetsInit() {
        this.manager = new THREE.LoadingManager();
        this.texture = (new THREE.TextureLoader(this.manager)).load(filePath('nosi.png'));
        console.log(this.texture)
        this.manager.onLoad = () => {
            this.callback();
            this.geometryInit();
            this.animation();
            this.resize();
        }
    }

    geometryInit() {
        const geometry1 = new THREE.BoxGeometry(5, 5, 5);
        const geometry2 = new THREE.SphereGeometry(5, 128, 128);
        const geometry3 = new THREE.PlaneGeometry(10, 8);
        const material1 = new THREE.MeshBasicMaterial({color: 0x0077ff});
        const material2 = new THREE.ShaderMaterial({
            vertexShader: vertex,
            fragmentShader: fragment,
            uniforms: {
                iTime: {value: 1.0},
                iResolution: {value: new THREE.Vector2(this.width, this.height)},
                uTexture: {value: this.texture}
            },
            depthWrite: false,
            depthTest: false,
            blending: THREE.AdditiveBlending,
        })
        this.cube = new THREE.Mesh(geometry1, material1);
        this.cube.position.setX(-10)
        this.sphere = new THREE.Mesh(geometry2, material2);
        this.sphere.position.setX(10)
        this.scene.add(this.cube);
        this.scene.add(this.sphere);
    }


    animation() {
        this.renderer.setAnimationLoop(() => this.animation())
        let time = this.clock.getElapsedTime();

        this.cube.position.set(-10, Math.sin(time * 2.0) * 0.5, 0);
        this.sphere.position.set(10, Math.cos(time * 2.0) * 0.8, 0);

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
