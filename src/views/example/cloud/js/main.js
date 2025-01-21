/**
 * justThreeJs main.js
 * @author kongjianqiu
 * @description
 * @created 2025/1/15 15:02:36
 */
import * as THREE from 'three'
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import vert from '@/views/example/cloud/glsl/vert.glsl'
import fragment from '@/views/example/cloud/glsl/fragment.glsl'
import vert2 from '@/views/example/cloud/glsl/vert2.glsl'
import fragment2 from '@/views/example/cloud/glsl/fragment2.glsl'

export default class Main {
    constructor(config) {
        this.target = config.target;
        this.width = this.target.offsetWidth;
        this.height = this.target.offsetHeight;
        this.aspect = this.width / this.height;
        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.width, this.height);
        this.target.appendChild(this.renderer.domElement);
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(50, this.aspect, 0.1, 20000);
        this.camera.position.z = 250;
        this.targetRotX1 = Math.PI / 3;
        this.targetRotX2 = -Math.PI / 3;
        this.targetRotY1 = 0;
        this.targetRotY2 = 0;
        this.timer = 0;
        this.timer2 = 0;
        this.mousePos = {x: 0, y: 0, px: 0, py: 0};
        this.audioInit()
        this.createControl()
        this.createPlanes()
        this.animation()
        this.resize()
        // this.target.addEventListener("mousemove", this.handleMouseMove.bind(this), false);
        // this.target.addEventListener("touchmove", this.handleMouseMove.bind(this), false);
    }

    createControl() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.target.set(0, 0, 0);
        this.controls.update();
        this.controls.enablePan = true;
        this.controls.enableDamping = true;
    }

    createPlanes() {
        this.clock = new THREE.Clock()
        const textureLoad = new THREE.TextureLoader()
        const texture = textureLoad.load('./texture/nosi.png')
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        this.material = new THREE.ShaderMaterial({
            vertexShader: vert,
            fragmentShader: fragment,
            uniforms: {
                time: {value: 5},
                iTime: {value: 5},
                uHue: {value: .95},
                mousePosition: {value: new THREE.Vector2(0.5, 0.5)},
                audioData: {value: new THREE.Vector3()}
            }
        });
        this.material2 = new THREE.ShaderMaterial({
            vertexShader: vert,
            fragmentShader: fragment,
            uniforms: {
                time: {value: 5},
                iTime: {value: 5},
                uHue: {value: .95},
                mousePosition: {value: new THREE.Vector2(0.5, 0.5)},
                audioData: {value: new THREE.Vector3()}
            }
        });

        this.shapeGeometry = new THREE.PlaneGeometry(200, 200, 256, 256);

        this.shape = new THREE.Mesh(this.shapeGeometry, this.material);
        this.shape.position.y = 50;
        this.shape.rotation.x = Math.PI / 3;
        this.shape.rotation.z = Math.PI;

        this.shape2 = new THREE.Mesh(this.shapeGeometry, this.material2);
        this.shape2.position.y = -50;
        this.shape2.rotation.x = -Math.PI / 2;


        this.scene.add(this.shape);
        this.scene.add(this.shape2);
    }


    audioInit() {
        this.listener = new THREE.AudioListener();
        this.camera.add(this.listener);
        this.audio = new THREE.Audio(this.listener);
        this.audioLoader = new THREE.AudioLoader();
        this.audioLoader.load('./music/YOASOBI - 群青.mp3', (buffer) => {
            this.buffer = buffer
            console.log('audio complete')
        });
        // 创建音频分析器
        this.analyser = new THREE.AudioAnalyser(this.audio, 256);
    }

    start() {
        this.audio.setBuffer(this.buffer);
        this.audio.setLoop(true);
        this.audio.setVolume(0.2);
        this.audio.play();
    }

    pause() {
        this.audio.pause();
    }

    animation() {
        const data = this.analyser.getAverageFrequency() / 255
        this.renderer.setAnimationLoop(() => this.animation());
        this.renderer.render(this.scene, this.camera);
        this.controls.update();

        this.timer += .05 * this.analyser.getAverageFrequency() / 255;
        this.timer2 -= .15 * this.analyser.getAverageFrequency() / 255;


        this.shape2.rotation.y += (this.targetRotY2 - this.shape2.rotation.y) * .05;
        this.shape2.rotation.x += (this.targetRotX2 - this.shape2.rotation.x) * .05;

        this.shape.rotation.y += (this.targetRotY1 - this.shape.rotation.y) * .05;
        this.shape.rotation.x += (this.targetRotX1 - this.shape.rotation.x) * .05;

        let r1 = this.analyser.getAverageFrequency() / 255
        let r2 = 1 - this.analyser.getAverageFrequency() / 255
        this.shape.material.uniforms.time.value = this.timer;
        this.shape.material.uniforms.audioData.value = this.analyser.getAverageFrequency() / 255;
        this.shape.material.uniforms.uHue.value = r1
        this.shape2.material.uniforms.time.value = this.timer2;
        this.shape2.material.uniforms.audioData.value = 1 - this.analyser.getAverageFrequency() / 255
        this.shape2.material.uniforms.uHue.value = r2

    }

    handleMouseMove(e) {
        if ((e.offsetX) && (e.offsetY)) {
            this.mousePos.x = e.offsetX;
            this.mousePos.y = e.offsetY;
            this.mousePos.px = this.mousePos.x / this.target.offsetWidth * 2 - 1;
            this.mousePos.py = this.mousePos.y / this.target.offsetHeight * 2 - 1;
        } else if (e.targetTouches) {
            this.mousePos.x = e.targetTouches[0].clientX;
            this.mousePos.y = e.targetTouches[0].clientY;
            this.mousePos.px = this.mousePos.x / window.innerWidth * 2 - 1;
            this.mousePos.py = this.mousePos.y / window.innerHeight * 2 - 1;
            this.mousePos.px *= 1.5;
            this.mousePos.py *= 1.5;
            e.preventDefault();
        }
        if (this.shape) {
            this.shape.material.uniforms.mousePosition.value = new THREE.Vector2(-this.mousePos.px, -this.mousePos.py);
            this.targetRotY1 = this.mousePos.px * .5;
            this.targetRotX1 = Math.PI / 3 - this.mousePos.py * .3;

            this.shape2.material.uniforms.mousePosition.value = new THREE.Vector2(this.mousePos.px, this.mousePos.py);
            this.targetRotY2 = this.mousePos.px * .5;
            this.targetRotX2 = -Math.PI / 3 - this.mousePos.py * .3;
        }
    }

    resize() {
        window.addEventListener('resize', () => {
            this.width = this.target.offsetWidth;
            this.height = this.target.offsetHeight;
            this.aspect = this.width / this.height;
            this.renderer.setSize(this.width, this.height);
            this.camera.aspect = this.aspect;
            this.camera.updateProjectionMatrix();
        }, false);
    }

    destroy() {
    }
}
