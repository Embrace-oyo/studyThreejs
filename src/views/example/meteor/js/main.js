/**
 * justThreeJs main.js
 * @author kongjianqiu
 * @description
 * @created 2025/1/23 14:56:57
 */
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {GPUComputationRenderer} from 'three/addons/misc/GPUComputationRenderer.js';
import {createNoise2D, createNoise3D} from 'simplex-noise';
import gsap from "gsap";
import vertex from '@/views/example/meteor/glsl/vertex.glsl'
import fragment from '@/views/example/meteor/glsl/fragment.glsl'
import compute from '@/views/example/meteor/glsl/compute.glsl'

export default class Meteor {
    colorsBright = ['#a3b509', '#79b68a', '#f4da7e', '#ff8f4e', '#9d797d', '#b91b2a', '#b4885c', '#dd6316', '#d9c4b4']
    colorsDark = ['#000000', '#190502', '#1c1005', '#23190d', '#380008', '#131913', '#28120a', '#551705', '#471b01']
    shakeAngle = 0
    wasteArray = []
    frequency = 1
    freqCount = 0
    metShakeSpeed = .1
    metRotateSpeed = .1
    slowMoFactor = 1
    shakeAmp = 3

    constructor(config) {
        this.target = config.target;
        this.width = this.target.offsetWidth;
        this.height = this.target.offsetHeight;
        this.halfWidthX = this.width / 2;
        this.halfHeightY = this.height / 2;
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            preserveDrawingBuffer: true
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.width, this.height);
        this.target.appendChild(this.renderer.domElement);
        this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.01, 3000);
        this.camera.position.z = 5;
        this.scene.add(new THREE.AxesHelper(1000))
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.target.set(0, 0, 0);
        this.controls.update();
        this.controls.enablePan = false;
        this.controls.enableDamping = true;
        this.clock = new THREE.Clock();
        this.createLight()
        // this.createMeteorite()
        this.createFragments()
        this.animation()
    }

    createLight() {
        this.shadowLight = new THREE.DirectionalLight(0xffffff, 2);
        this.shadowLight.position.set(20, 0, 10);
        this.shadowLight.castShadow = true;
        // 设置阴影属性
        this.shadowLight.shadow.mapSize.width = 1024; // 设置阴影贴图的宽度
        this.shadowLight.shadow.mapSize.height = 1024; // 设置阴影贴图的高度
        this.shadowLight.shadow.camera.near = 0.5; // 阴影相机的近平面
        this.shadowLight.shadow.camera.far = 500; // 阴影相机的远平面
        this.shadowLight.shadow.bias = -0.01; // 替代 shadowDarkness 的方式，防止阴影伪影
        this.scene.add(this.shadowLight);

        this.light = new THREE.DirectionalLight(0xffffff, .5);
        this.light.position.set(-20, 0, 20);
        this.scene.add(this.light);
        //*
        this.backLight = new THREE.DirectionalLight(0xffffff, 0.1);
        this.backLight.position.set(0, 0, -20);
        this.scene.add(this.backLight);
    }

    createMeteorite() {
        this.sphereRadius = 5;
        this.meteorite = new THREE.Object3D();
        this.geometryCore = new THREE.TetrahedronGeometry(this.sphereRadius, 2);
        this.materialCore = new THREE.MeshStandardMaterial({
            color: 0xd44642,
            roughness: .9,
            emissive: 0x270000,
            flatShading: true,
        });
        this.metCore = new THREE.Mesh(this.geometryCore, this.materialCore);

        // 添加到 meteorite 对象
        this.meteorite.add(this.metCore);

        // 添加到场景
        this.scene.add(this.meteorite);
    }

    updateMeteorite() {
        this.meteorite.rotation.x += 0.005;
        this.meteorite.rotation.y += 0.01;
        this.shakeAngle += this.metShakeSpeed;
        this.metCore.position.x = (Math.cos(this.shakeAngle) * this.shakeAmp);
        this.metCore.position.y = Math.cos(this.shakeAngle * 1.5) * this.shakeAmp * 2;
        this.metCore.position.z = Math.cos(this.shakeAngle * 2) * this.shakeAmp * 3;
    }

    createFragments() {
        const width = 512;
        const size = 256;
        const count = width ** 2;

        this.gpgpu = new GPUComputationRenderer(width, width, this.renderer);
        if (this.renderer.capabilities.isWebGL2 === false) this.gpgpu.setDataType(THREE.HalfFloatType)
        const posDt = this.gpgpu.createTexture();

        const data = posDt.image.data;
        for (let i = 0; i < data.length; i++) {
            data[i * 4 + 0] = THREE.MathUtils.randFloatSpread(size);
            data[i * 4 + 1] = THREE.MathUtils.randFloatSpread(size);
            data[i * 4 + 2] = THREE.MathUtils.randFloatSpread(size);
            data[i * 4 + 3] = 1;
        }
        this.posVar = this.gpgpu.addVariable("texturePosition", compute, posDt)
        this.posVar.material.uniforms['uFreq'] = {value: 1};
        this.posVar.material.uniforms['iTime'] = {value: 0};
        this.posVar.material.uniforms['uAttract'] = {value: new THREE.Vector3(0, 0, 0)};
        this.posVar.material.uniforms['uNoise'] = {value: 0.5};
        this.posVar.material.uniforms['uAttractEnabled'] = {value: false};
        this.posVar.material.uniforms['uId'] = {value: 0};
        this.gpgpu.init();
        this.gpgpu.compute();
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const references = new Float32Array(count * 2);
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < width; j++) {
                const idx = i + j * width;
                positions[idx * 3 + 0] = Math.random();
                positions[idx * 3 + 1] = Math.random();
                positions[idx * 3 + 2] = Math.random();
                references[idx * 2 + 0] = i / width;
                references[idx * 2 + 1] = j / width;
            }
        }
        geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute("reference", new THREE.BufferAttribute(references, 2));
        const material = new THREE.ShaderMaterial({
            vertexShader: vertex,
            fragmentShader: fragment,
            uniforms: {
                texturePosition: {
                    value: null,
                },
                uPointSize: {
                    value: 1,
                },
                uPixelRatio: {
                    value: this.renderer.getPixelRatio(),
                },
            },
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });
        this.points = new THREE.Points(geometry, material);
        this.scene.add(this.points);
    }

    updateFragments() {
        this.gpgpu.compute();
        const t = this.clock.getElapsedTime();
        const mat = this.points.material;
        this.posVar.material.uniforms['iTime'] = {value: t};
        const texture = this.gpgpu.getCurrentRenderTarget(this.posVar).texture;
        mat.uniforms.texturePosition.value = texture;
    }

    animation() {
        requestAnimationFrame(() => this.animation());

        this.controls.update();

        // this.updateMeteorite();

        this.updateFragments()


        this.renderer.render(this.scene, this.camera);
    }

    curlNoise(x, y, z) {
        const noise3d = createNoise3D()
        // 获取不同轴上的噪声值
        const n1 = noise3d(x, y, z);
        const n2 = noise3d(x + 1.0, y, z);
        const n3 = noise3d(x, y + 1.0, z);
        const n4 = noise3d(x, y, z + 1.0);

        // 通过对这些噪声值进行差分运算来模拟卷曲噪声
        const curlX = n3 - n1;
        const curlY = n4 - n2;
        const curlZ = n4 - n1;

        return {x: curlX, y: curlY, z: curlZ};
    }

    hexToRgb(hex) {
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    getColor(value) {
        if (value === "dark") {
            return this.colorsDark[Math.floor(Math.random() * this.colorsDark.length)];
        } else {
            return this.colorsBright[Math.floor(Math.random() * this.colorsBright.length)];
        }

    }


    listener() {
        window.addEventListener('resize', () => {
        }, false);
        window.addEventListener('mousedown', () => {
        }, false);
        window.addEventListener('mouseup', () => {
        }, false);
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
