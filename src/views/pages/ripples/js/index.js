/**
 * justThreeJs index.js
 * @author kongjianqiu
 * @description
 * @created 2025/3/14 17:03:58
 */
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {ShaderPass} from 'three/addons/postprocessing/ShaderPass.js';
import {RGBShiftShader} from 'three/addons/shaders/RGBShiftShader.js';
import {FilmShader} from 'three/addons/shaders/FilmShader.js';
import RipplesPass from "@/views/pages/ripples/js/ripplesPass.js";


import backgroundVertex from "@/views/pages/metalCube/glsl/background/vertex.glsl";
import backgroundFragment from "@/views/pages/metalCube/glsl/background/fragment.glsl";

import ripples from '@/views/pages/ripples/glsl/ripples.glsl'
import water from '@/views/pages/ripples/glsl/water.glsl'
import vertex from '@/views/pages/ripples/glsl/vertex.glsl'

function filePath(path) {
    return new URL(`../assets/${path}`, import.meta.url).href
}

export default class Ripples {
    constructor(config) {
        this.parent = config.parent;
        this.target = config.target;
        this.callback = config.callback;
        this.width = this.target.offsetWidth;
        this.height = this.target.offsetHeight;
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
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('gray')
        this.target.appendChild(this.renderer.domElement);
        this.camera = new THREE.PerspectiveCamera(75, this.aspect, 0.1, 50000);
        this.camera.position.set(100, 30, 100);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.control = new OrbitControls(this.camera, this.renderer.domElement);
        this.control.enableDamping = true;
        this.callback();
        this.backgroundInit();
        this.composerInit();
        this.animation();
        this.resize();
    }

    backgroundInit() {
        const baseGeo = new THREE.OctahedronGeometry(30, 4);
        const nonIndexedGeo = baseGeo.toNonIndexed();
        const positions = nonIndexedGeo.attributes.position.array;
        const faceNormals = new Float32Array(positions.length);
        for (let i = 0; i < positions.length; i += 9) { // 每面3顶点，每个顶点xyz
            const x1 = positions[i], y1 = positions[i + 1], z1 = positions[i + 2];
            const x2 = positions[i + 3], y2 = positions[i + 4], z2 = positions[i + 5];
            const x3 = positions[i + 6], y3 = positions[i + 7], z3 = positions[i + 8];

            // 计算面法线（世界空间）
            const v1 = new THREE.Vector3(x2 - x1, y2 - y1, z2 - z1);
            const v2 = new THREE.Vector3(x3 - x1, y3 - y1, z3 - z1);
            const normal = new THREE.Vector3().crossVectors(v1, v2).normalize();

            // 为当前面的3个顶点填充相同法线
            faceNormals.set([normal.x, normal.y, normal.z], i);   // 顶点1
            faceNormals.set([normal.x, normal.y, normal.z], i + 3); // 顶点2
            faceNormals.set([normal.x, normal.y, normal.z], i + 6); // 顶点3
        }
        nonIndexedGeo.setAttribute('normal', new THREE.BufferAttribute(faceNormals, 3));
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: {
                    value: 0,
                },
                acceleration: {
                    value: 0
                },
            },
            vertexShader: backgroundVertex,
            fragmentShader: backgroundFragment,
            side: THREE.BackSide,
        });
        this.background = new THREE.Mesh(nonIndexedGeo, material);
        this.background.name = 'Background';
        this.scene.add(this.background);
    }

    updateNormals(geometry) {
        this.background.material.uniforms.time.value++;
        const positions = geometry.attributes.position.array;
        const normals = geometry.attributes.normal.array;
        for (let i = 0; i < positions.length; i += 9) {
            // 重新计算面法线（基于变形后的顶点位置）
            const x1 = positions[i], y1 = positions[i + 1], z1 = positions[i + 2];
            const x2 = positions[i + 3], y2 = positions[i + 4], z2 = positions[i + 5];
            const x3 = positions[i + 6], y3 = positions[i + 7], z3 = positions[i + 8];

            const v1 = new THREE.Vector3(x2 - x1, y2 - y1, z2 - z1);
            const v2 = new THREE.Vector3(x3 - x1, y3 - y1, z3 - z1);
            const normal = new THREE.Vector3().crossVectors(v1, v2).normalize();

            // 更新法线数据
            normals[i] = normal.x;
            normals[i + 1] = normal.y;
            normals[i + 2] = normal.z;
            normals[i + 3] = normal.x;
            normals[i + 4] = normal.y;
            normals[i + 5] = normal.z;
            normals[i + 6] = normal.x;
            normals[i + 7] = normal.y;
            normals[i + 8] = normal.z;
        }

        geometry.attributes.normal.needsUpdate = true;
    }

    composerInit() {
        this.composer = new EffectComposer(this.renderer);
        this.renderPass = new RenderPass(this.scene, this.camera);
        this.outPass = new OutputPass();
        this.rgbShiftPass = new ShaderPass(RGBShiftShader);
        this.filmPass = new ShaderPass(FilmShader);
        this.ripplesPass = new RipplesPass(this);

        this.composer.addPass(this.renderPass);
        this.composer.addPass(this.rgbShiftPass);
        this.composer.addPass(this.filmPass);
        this.composer.addPass(this.ripplesPass);
        this.composer.addPass(this.outPass);
    }

    animation() {
        this.renderer.setAnimationLoop(() => this.animation());

        this.updateNormals(this.background.geometry);



        this.composer.render();
    }

    resize() {
        window.addEventListener('resize', () => {
            this.width = this.target.offsetWidth;
            this.height = this.target.offsetHeight;
            this.camera.updateProjectionMatrix();
            this.resolution.set(this.width, this.height);
            this.aspect = this.width / this.height;
            this.composer.setSize(this.width, this.height);
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
        this.composer.dispose();
    }
}
