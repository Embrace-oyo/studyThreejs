/**
 * justThreeJs main3.js
 * @author kongjianqiu
 * @description
 * @created 2024/12/12 17:20:33
 */
import * as THREE from "three";

import {GUI} from 'three/examples/jsm/libs/lil-gui.module.min.js';

import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {ShaderPass} from 'three/addons/postprocessing/ShaderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {RGBShiftShader} from 'three/addons/shaders/RGBShiftShader.js';
import {DotScreenShader} from 'three/addons/shaders/DotScreenShader.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';

import gateVertexShader from '@/views/example/neon/glsl/gateVertexShader.glsl';
import gateFragmentShader from '@/views/example/neon/glsl/gateFragmentShader.glsl'

import roadVertexShader from '@/views/example/neon/glsl/roadVertexShader.glsl';
import roadFragmentShader from '@/views/example/neon/glsl/roadFragmentShader.glsl'

import ceilingVertexShader from '@/views/example/neon/glsl/ceilingVertexShader.glsl';
import ceilingFragmentShader from '@/views/example/neon/glsl/ceilingFragmentShader.glsl'

import wallVertexShader from '@/views/example/neon/glsl/wallVertexShader.glsl';
import wallFragmentShader from '@/views/example/neon/glsl/wallFragmentShader.glsl'
import gsap from "gsap";

const ROAD_WIDTH = 4.3;
const ROAD_LENGTH = 100;
const GATE_HEIGHT = 1.65;
const REPEAT = 47;


class Reflect {

    constructor(options) {

        this.width = options.width;
        this.height = options.height;
        this.renderer = options.renderer;
        this.target = new THREE.WebGLRenderTarget(this.width, this.height);

        this.texture = this.target.texture;

    }

    render(scene, camera, offset) {

        if (offset.x) camera.position.x -= offset.x;
        if (offset.y) camera.position.y -= offset.y;
        camera.rotation.z = -camera.rotation.z;


        this.renderer.setRenderTarget(this.target)
        this.renderer.clear();
        this.renderer.render(scene, camera)
        this.renderer.setRenderTarget(null)

        if (offset.x) camera.position.x += offset.x;
        if (offset.y) camera.position.y += offset.y;
        camera.rotation.z = -camera.rotation.z;

    }

}


export default class Main {
    textureList = [
        {type: 'road', url: 'https://res.cloudinary.com/dbo3jfkpl/image/upload/v1519579527/road-1.png'},
        {type: 'road', url: 'https://res.cloudinary.com/dbo3jfkpl/image/upload/v1519579527/road-2.png'},
        {type: 'road', url: 'https://res.cloudinary.com/dbo3jfkpl/image/upload/v1519579527/road-3.png'},
        {type: 'road', url: 'https://res.cloudinary.com/dbo3jfkpl/image/upload/v1519579527/road-4.png'},
        {type: 'gate', url: 'https://res.cloudinary.com/dbo3jfkpl/image/upload/v1519579527/gate-1.png'},
        {type: 'gate', url: 'https://res.cloudinary.com/dbo3jfkpl/image/upload/v1519579527/gate-2.png'},
        {type: 'gate', url: 'https://res.cloudinary.com/dbo3jfkpl/image/upload/v1519579527/gate-3.png'},
        {type: 'gate', url: 'https://res.cloudinary.com/dbo3jfkpl/image/upload/v1519579527/gate-4.png'},
        {type: 'wall', url: 'https://res.cloudinary.com/dbo3jfkpl/image/upload/v1519579527/wall-1.png'},
        {type: 'wall', url: 'https://res.cloudinary.com/dbo3jfkpl/image/upload/v1519579527/wall-2.png'},
        {type: 'wall', url: 'https://res.cloudinary.com/dbo3jfkpl/image/upload/v1519579527/wall-3.png'},
        {type: 'wall', url: 'https://res.cloudinary.com/dbo3jfkpl/image/upload/v1519579527/wall-4.png'},
    ]
    textureListLoader = []
    settings = {
        speed: 0.06,
        bloom: 0.65,
        strength: 0.3,
        radius: 0.0,
        threshold: 0.0,
    }

    constructor(config) {
        this.parent = config.parent;
        this.target = config.target;
        this.width = this.target.offsetWidth;
        this.height = this.target.offsetHeight;
        this.aspect = this.width / this.height;

        this.assetsManage();

        this.setupEventListeners();

        window.onresize = () => {
            this.resize();
        }
    }

    assetsManage() {
        this.manager = new THREE.LoadingManager();
        this.textureLoader = new THREE.TextureLoader(this.manager);
        this.textureLoader.crossOrigin = 'anonymous';
        this.textureList.map(item => {
            let load = this.textureLoader.load(item.url);
            if (item.type === 'wall') {
                load.wrapS = THREE.RepeatWrapping;
                load.minFilter = THREE.LinearFilter;
            } else if (item.type === 'road') {
                load.wrapT = THREE.RepeatWrapping;
                load.minFilter = THREE.LinearFilter;
            }
            this.textureListLoader.push(load)
        })
        this.manager.onLoad = () => {
            console.log('complete')
            this.setRenderer();
            this.setReflection();
            this.setCamera();

            this.createGates();
            this.createRoad();
            this.createCeiling();
            this.createLeftWall();
            this.createRightWall();

            this.setPostProcessing();
            this.guiInit();
            this.animation();

        }
    }

    setRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            preserveDrawingBuffer: true
        });
        this.renderer.setSize(this.width, this.height);
        this.renderer.autoClear = false;
        this.target.appendChild(this.renderer.domElement);

        this.scene = new THREE.Scene();
        this.sceneGates = new THREE.Scene();
    }

    setReflection() {
        this.reflectRoad = new Reflect({renderer: this.renderer, width: this.width, height: this.height});
        this.reflectLeftWall = new Reflect({renderer: this.renderer, width: this.width, height: this.height});
        this.reflectRightWall = new Reflect({renderer: this.renderer, width: this.width, height: this.height});
        this.reflectCeiling = new Reflect({renderer: this.renderer, width: this.width, height: this.height});
    }

    setCamera() {
        this.camera = new THREE.PerspectiveCamera(75, this.aspect, 0.1, 1000);
        this.camera.position.x = 1.035;
        this.camera.position.y = 0.5;
        this.camera.position.z = 5;
    }

    createRoad() {

        const geometry = new THREE.PlaneGeometry(ROAD_WIDTH, ROAD_LENGTH);
        this.roadMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uRoadTexture: {value: this.textureListLoader[0]},
                uReflectionTexture: {value: this.reflectRoad.texture},
                uRepeatY: {value: REPEAT}
            },
            vertexShader: roadVertexShader,
            fragmentShader: roadFragmentShader
        });

        const mesh = new THREE.Mesh(geometry, this.roadMaterial);
        mesh.position.z = -ROAD_LENGTH / 2 + 5;
        mesh.rotation.x = -Math.PI * 0.5;

        this.scene.add(mesh);

    }

    createGates() {
        const geometry = new THREE.PlaneGeometry(ROAD_WIDTH, GATE_HEIGHT);
        this.gateMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uTexture: {value: this.textureListLoader[8]},
                uShowMask: {value: true},
                uMaskDirection: {value: 1},
                uMaskHorizontal: {value: true},
                uStrength: {value: 1},
            },
            transparent: true,
            vertexShader: gateVertexShader,
            fragmentShader: gateFragmentShader
        });

        for (let i = 0; i < 40; i++) {
            const mesh = new THREE.Mesh(geometry, this.gateMaterial);
            mesh.position.y = GATE_HEIGHT * 0.5;
            mesh.position.z = 2.86 + -2.13 * i;
            this.sceneGates.add(mesh);
        }
    }

    createCeiling() {
        const geometry = new THREE.PlaneGeometry(ROAD_WIDTH, ROAD_LENGTH);
        const material = new THREE.ShaderMaterial({
            uniforms: {
                uReflectionTexture: {value: this.reflectCeiling.texture}
            },
            vertexShader: ceilingVertexShader,
            fragmentShader: ceilingFragmentShader
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.y = GATE_HEIGHT;
        mesh.position.z = -ROAD_LENGTH / 2 + 5;
        mesh.rotation.x = Math.PI * 0.5;

        this.scene.add(mesh);
    }

    createLeftWall() {
        const geometry = new THREE.PlaneGeometry(ROAD_LENGTH, GATE_HEIGHT);
        this.wallLeftMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uWallTexture: {value: this.textureListLoader[9]},
                uReflectionTexture: {value: this.reflectLeftWall.texture},
                uRepeatZ: {value: REPEAT}
            },
            vertexShader: wallVertexShader,
            fragmentShader: wallFragmentShader
        });

        const mesh = new THREE.Mesh(geometry, this.wallLeftMaterial);
        mesh.position.x = -ROAD_WIDTH * 0.5;
        mesh.position.y = GATE_HEIGHT * 0.5;
        mesh.position.z = -ROAD_LENGTH / 2 + 5;
        mesh.rotation.y = Math.PI * 0.5;

        this.scene.add(mesh);
    }

    createRightWall() {
        const geometry = new THREE.PlaneGeometry(ROAD_LENGTH, GATE_HEIGHT);
        this.wallRightMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uWallTexture: {value: this.textureListLoader[9]},
                uReflectionTexture: {value: this.reflectRightWall.texture},
                uRepeatZ: {value: REPEAT}
            },
            side: THREE.BackSide,
            vertexShader: wallVertexShader,
            fragmentShader: wallFragmentShader
        });

        const mesh = new THREE.Mesh(geometry, this.wallRightMaterial);
        mesh.position.x = ROAD_WIDTH / 2;
        mesh.position.y = GATE_HEIGHT * 0.5;
        mesh.position.z = -ROAD_LENGTH / 2 + 5;
        mesh.rotation.y = Math.PI * 0.5;

        this.scene.add(mesh);
    }

    setPostProcessing() {
        this.composer = new EffectComposer(this.renderer);

        const renderPass1 = new RenderPass(this.scene, this.camera);
        const renderPass2 = new RenderPass(this.sceneGates, this.camera);
        renderPass2.clear = false;

        this.bloomPass = new UnrealBloomPass(new THREE.Vector2(this.width, this.height), this.settings.strength, this.settings.radius, this.settings.threshold);
        this.bloomPass.renderToScreen = true;

        this.dotScreenPass = new ShaderPass(DotScreenShader);
        this.dotScreenPass.uniforms['scale'].value = 4;

        this.RGBShiftPass = new ShaderPass(RGBShiftShader);
        this.RGBShiftPass.uniforms['amount'].value = 0.0015;

        const copyPass = new ShaderPass({
            uniforms: {
                'tDiffuse': {type: 't', value: null},
                'opacity': {type: 'f', value: 1.0}
            },
            vertexShader: [
                'varying vec2 vUv;',

                'void main() {',

                'vUv = uv;',
                'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',

                '}'
            ].join('\n'),
            fragmentShader: [
                'uniform float opacity;',

                'uniform sampler2D tDiffuse;',

                'varying vec2 vUv;',

                'void main() {',

                'vec4 texel = texture2D( tDiffuse, vUv );',
                'gl_FragColor = opacity * texel;',

                '}'
            ].join('\n')
        });
        copyPass.renderToScreen = true;

        const outputPass = new OutputPass();


        this.composer.addPass(renderPass1)
        this.composer.addPass(renderPass2)
        this.composer.addPass(this.bloomPass)
        // this.composer.addPass(this.dotScreenPass);
        // this.composer.addPass(this.RGBShiftPass);
        this.composer.addPass(copyPass)
        // this.composer.addPass(outputPass)


    }

    swapTextures() {
        if (!this.currentTextureIndex) this.currentTextureIndex = 0;
        this.currentTextureIndex = (this.currentTextureIndex + 1) % 4;
        this.roadMaterial.uniforms.uRoadTexture.value = this.textureListLoader[this.currentTextureIndex];
        this.gateMaterial.uniforms.uTexture.value = this.textureListLoader[this.currentTextureIndex + 4];
        this.wallLeftMaterial.uniforms.uWallTexture.value = this.textureListLoader[this.currentTextureIndex + 8];
        this.wallRightMaterial.uniforms.uWallTexture.value = this.textureListLoader[this.currentTextureIndex + 8];
    }

    update() {
        this.counter = this.counter || 0;
        this.counter++;

        this.camera.position.z -= this.settings.speed;
        if (this.camera.position.z < -10.9) this.camera.position.z = 4;

        if (this.counter % 20 === 0) {
            this.swapTextures();
        }
    }

    animation() {
        requestAnimationFrame(() => this.animation())

        this.update();

        this.gateMaterial.uniforms.uShowMask.value = true;

        // Road
        this.gateMaterial.uniforms.uMaskDirection.value = 0;
        this.gateMaterial.uniforms.uMaskHorizontal.value = 1;
        this.gateMaterial.uniforms.uStrength.value = 2.8;
        this.reflectRoad.render(this.sceneGates, this.camera, {y: this.camera.position.y * 2});

        // Ceiling
        this.gateMaterial.uniforms.uMaskDirection.value = 1;
        this.gateMaterial.uniforms.uStrength.value = 12;
        this.reflectCeiling.render(this.sceneGates, this.camera, {y: (this.camera.position.y - GATE_HEIGHT) * 2});

        // Left wall
        this.gateMaterial.uniforms.uMaskHorizontal.value = 0;
        this.gateMaterial.uniforms.uMaskDirection.value = 0;
        this.gateMaterial.uniforms.uStrength.value = 38;
        this.reflectLeftWall.render(this.sceneGates, this.camera, {x: (this.camera.position.x + ROAD_WIDTH * 0.5) * 2});

        // Right wall
        this.gateMaterial.uniforms.uMaskDirection.value = 1;
        this.reflectRightWall.render(this.sceneGates, this.camera, {x: (this.camera.position.x - ROAD_WIDTH * 0.5) * 2});


        this.gateMaterial.uniforms.uShowMask.value = false;


        if (this.composer) {
            this.composer.render();
        } else {
            this.renderer.render(this.scene, this.camera)
        }
    }

    guiInit() {
        this.GUI = new GUI({container: this.parent})
        this.GUI.domElement.style.position = 'absolute'
        this.GUI.domElement.style.right = '0'
        this.GUI.domElement.style.top = '0'
        this.GUI.domElement.style.zIndex = '999'

    /*    this.GUI.add(this.bloomPass, 'strength', 0, 20, 0.1).name('strength');
        this.GUI.add(this.bloomPass, 'radius', 0, 20, 0.01).name('radius');
        this.GUI.add(this.bloomPass, 'threshold', 0, 20, 0.01).name('threshold');
        this.GUI.add(this.RGBShiftPass.uniforms.amount, 'value', 0, 20, 0.001).name('amount');*/
    }

    setupEventListeners() {
        this.keyDownHandler = this.keyDownHandler.bind(this);
        this.keyUpHandler = this.keyUpHandler.bind(this);
        document.body.addEventListener('keydown', this.keyDownHandler);
        document.body.addEventListener('keyup', this.keyUpHandler);
    }

    keyDownHandler(e) {
        switch (e.keyCode) {
            case 37:
            case 65:
                this.switchLane(-1);
                break;
            case 38:
            case 87:
                this.speedUp();
                break;
            case 39:
            case 68:
                this.switchLane(1);
                break;
        }

    }

    keyUpHandler(e) {

        if (e.keyCode === 38 || e.keyCode === 87) {
            this.slowDown();
        }

    }

    switchLane(direction) {
        gsap.to(this.camera.position, {
            x: 1.035 * direction,
            duration: 0.3,
            ease: "sine.out",
        });

    }

    speedUp() {

        if (this.isSpeedingUp) return;
        this.isSpeedingUp = true;

        gsap.to(this.settings, {
            speed: 1,
            duration: 15,
            ease: "sine.out",
        });


    }

    slowDown() {

        this.isSpeedingUp = false;

        gsap.to(this.settings, {
            speed: 0.05,
            duration: 3,
            ease: "sine.in",
        });

    }


    resize() {
        this.width = this.target.offsetWidth;
        this.height = this.target.offsetHeight;
        this.aspect = this.width / this.height;
        this.renderer.setSize(this.width, this.height);
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
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
