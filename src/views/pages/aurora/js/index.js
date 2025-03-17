/**
 * justThreeJs main.js
 * @author kongjianqiu
 * @description
 * @created 2024/12/12 10:28:34
 */

import * as THREE from "three";

import backgeoundVertex from '@/views/pages/aurora/glsl/backgeoundVertex.glsl'
import backgroundFragment from '@/views/pages/aurora/glsl/backgroundFragment.glsl'

import treeVertex from '@/views/pages/aurora/glsl/treeVertex.glsl'
import treeFragment from '@/views/pages/aurora/glsl/treeFragment.glsl'

import mountainVertex from '@/views/pages/aurora/glsl/mountainVertex.glsl'
import mountainFragment from '@/views/pages/aurora/glsl/mountainFragment.glsl'

export default class Index {
    constructor(config) {
        this.target = config.target;
        this.width = this.target.offsetWidth;
        this.height = this.target.offsetHeight;
        this.aspect = this.width / this.height;
        this.callback = config.callback;
        this.camera = new THREE.PerspectiveCamera(70, this.aspect, 1, 5000);
        this.camera.position.z = 40;

        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0xFF00FF, 40, 180);

        this.renderer = new THREE.WebGLRenderer({antialias: true, preserveDrawingBuffer: true});
        // this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.width, this.height);
        this.target.appendChild(this.renderer.domElement);

        this.clock = new THREE.Clock();

        window.addEventListener('resize', () => this.resize());

        this.createBackground()
        this.createTree()
        this.createMountain()
        this.callback();
        this.animation()
    }


    createBackground() {
        const backgroundGeometry = new THREE.SphereGeometry(4000, 32, 15);
        const backgroundMaterial = new THREE.RawShaderMaterial({
            vertexShader: backgeoundVertex,
            fragmentShader: backgroundFragment,
            uniforms: {
                resolution: {
                    value: new THREE.Vector2(
                        this.width * window.devicePixelRatio,
                        this.height * window.devicePixelRatio,
                    )
                },
                globalTime: {value: performance.now() / 1000},
            },
            side: THREE.BackSide,
        });
        this.background = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
        this.scene.add(this.background);
    }

    createTree() {
        const treeGeometry = new THREE.PlaneGeometry(200, 200, 1, 1);
        const treeMaterial = new THREE.RawShaderMaterial({
            vertexShader: treeVertex,
            fragmentShader: treeFragment,
            uniforms: {
                globalTime: {value: performance.now() / 1000},
            },
            transparent: true,
        });
        this.tree = new THREE.Mesh(treeGeometry, treeMaterial);
        this.tree.position.z = 0.1;
        this.scene.add(this.tree);
    }

    createMountain() {
        const mountainGeometry = new THREE.PlaneGeometry(600, 200, 1, 1);
        const mountainMaterial = new THREE.ShaderMaterial({
            vertexShader: mountainVertex,
            fragmentShader: mountainFragment,
            fog: true,
            transparent: true,
            uniforms: {
                ...THREE.UniformsLib.fog,
                fogColor: {value: this.scene.fog.color},
                fogNear: {value: this.scene.fog.near},
                fogFar: {value: this.scene.fog.far},
            }
        });
        this.mountain = new THREE.Mesh(mountainGeometry, mountainMaterial);
        this.mountain1 = new THREE.Mesh(mountainGeometry, mountainMaterial);
        this.mountain2 = new THREE.Mesh(mountainGeometry, mountainMaterial);
        this.mountain.position.set(0, 0, 0);
        this.mountain1.position.set(0, -2, -26);
        this.mountain2.position.set(0, 0, -35);
        this.scene.add(this.mountain)
        this.scene.add(this.mountain1)
        this.scene.add(this.mountain2)
    }

    resize() {
        this.width = this.target.offsetWidth;
        this.height = this.target.offsetHeight;
        this.aspect = this.width / this.height;
        this.camera.aspect = this.aspect;
        this.camera.updateProjectionMatrix();

        this.background.material.uniforms.resolution.value.set(
            this.width * window.devicePixelRatio,
            this.height * window.devicePixelRatio,
        );

        this.renderer.setSize(this.width, this.height);
    }

    animation(timestamp = 0) {
        requestAnimationFrame((timestamp) => this.animation(timestamp));
        this.renderer.render(this.scene, this.camera);

        this.background.material.uniforms.globalTime.value = timestamp / 1000;
        this.tree.material.uniforms.globalTime.value = timestamp / 1000;

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
