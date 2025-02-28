/**
 * justThreeJs index.js
 * @author kongjianqiu
 * @description
 * @created 2025/2/25 16:42:24
 */
import * as THREE from "three";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {Pane} from 'tweakpane';
// glsl
import vertex from '@/views/pages/shield/glsl/vertex.glsl'
import fragment from '@/views/pages/shield/glsl/fragment.glsl'

// 方法
function filePath(path) {
    return new URL(`../assets/${path}`, import.meta.url).href
}

export default class Shield {
    constructor(config) {
        this.parent = config.parent;
        this.target = config.target;
        this.callback = config.callback;
        this.width = this.target.offsetWidth;
        this.height = this.target.offsetHeight;
        this.aspect = this.width / this.height;
        this.renderer = new THREE.WebGLRenderer({
            powerPreference: "high-performance",
            antialias: false,
            alpha: false,
            premultipliedAlpha: false,
            preserveDrawingBuffer: true
        })
        this.renderer.setSize(this.width, this.height)
        this.target.appendChild(this.renderer.domElement);
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('#646464')
        this.camera = new THREE.PerspectiveCamera(75, this.aspect, 0.01, 1000);
        this.camera.position.copy(new THREE.Vector3(0, 0, 10))
        this.camera.lookAt(new THREE.Vector3(0, 0, 0))
        this.camera.updateProjectionMatrix()
        this.scene.add(this.camera);
        this.control = new OrbitControls(this.camera, this.renderer.domElement);
        this.control.enableDamping = true;
        this.clock = new THREE.Clock();
        this.uColor = '#' + (new THREE.Color('#4d9bff')).getHexString();
        this.geometryInit();
        this.assetsInit();
    }

    assetsInit() {
        this.manager = new THREE.LoadingManager();
        const loader = new THREE.CubeTextureLoader(this.manager);
        const texture = loader.load([
            filePath('cubeMap1/posx.png'),
            filePath('cubeMap1/negx.png'),
            filePath('cubeMap1/posy.png'),
            filePath('cubeMap1/negy.png'),
            filePath('cubeMap1/posz.png'),
            filePath('cubeMap1/negz.png'),
        ]);
        this.manager.onLoad = () => {
            console.info("%c资源加载完成!✅", "color:#fff;background-color:red",);
            this.scene.environment = texture
            this.scene.background = texture
            this.callback();
            this.animation();
            this.resize();
            this.paneInit();
        }

    }

    geometryInit() {
        const light = new THREE.DirectionalLight(0xffffff, 3);
        light.position.set(1, 1, 1);
        this.scene.add(new THREE.AmbientLight(0xcccccc));
        this.scene.add(light);


        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const material = new THREE.MeshBasicMaterial({color: '#7455c9'});
        this.cube = new THREE.Mesh(geometry, material);
        this.scene.add(this.cube);

        this.sphere = new THREE.Mesh(new THREE.SphereGeometry(3, 256, 256), new THREE.ShaderMaterial({
            uniforms: {
                uThickness: {value: 4.6},
                uColor: {value: new THREE.Color('#4d9bff')},
                uAmp: {value: 22},
                uFreq: {value: 0.3},
                uTime: {value: 0},
            },
            vertexShader: vertex,
            fragmentShader: fragment,
            blending: THREE.AdditiveBlending,
        }))
        this.scene.add(this.sphere);
    }

    animation() {
        let time = this.clock.getElapsedTime();
        this.renderer.setAnimationLoop(() => this.animation());
        this.control.update();

        this.cube.rotation.x += 0.005;
        this.cube.rotation.y += 0.01;

        this.cube.position.set(0, Math.sin(time * 2.0) * 0.5, 0);
        this.sphere.position.copy(this.cube.position);

        this.sphere.material.uniforms.uTime.value = time;


        this.renderer.render(this.scene, this.camera);
    }

    paneInit() {
        this.pane = new Pane({container: this.parent});
        this.controller = this.pane.addFolder({title: "能量护盾", expanded: true});
        this.controller.addBinding(this.sphere.material.uniforms.uThickness, 'value', {
            min: 0.01,
            max: 10,
            step: 0.1,
            label: "uThickness"
        })
        this.controller.addBinding(this.sphere.material.uniforms.uAmp, 'value', {
            min: 0.1,
            max: 50,
            step: 0.1,
            label: "uAmp"
        })
        this.controller.addBinding(this.sphere.material.uniforms.uFreq, 'value', {
            min: 0.1,
            max: 1,
            step: 0.1,
            label: "uFreq"
        })
        this.controller.addBinding(this, "uColor", {label: "颜色"}).on('change', (obj) => {
            this.sphere.material.uniforms.uColor.value.set(obj.value)
        });
    }

    resize() {
        window.addEventListener('resize', () => {
            this.width = this.target.offsetWidth;
            this.height = this.target.offsetHeight;
            this.camera.aspect = this.width / this.height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(this.width, this.height);
        })
    };

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
