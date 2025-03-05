/**
 * justThreeJs index.js
 * @author kongjianqiu
 * @description
 * @created 2025/3/4 14:56:38
 */
import * as THREE from "three";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
// glsl
import backgroundVertex from '@/views/pages/metalCube/glsl/background/vertex.glsl'
import backgroundFragment from '@/views/pages/metalCube/glsl/background/fragment.glsl'

import metalCubeVertex from '@/views/pages/metalCube/glsl/metalCube/vertex.glsl'
import metalCubeFragment from '@/views/pages/metalCube/glsl/metalCube/fragment.glsl'


function filePath(path) {
    return new URL(`../assets/${path}`, import.meta.url).href
}

const Util = {
    getRandomInt: function (min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    },
    getDegree: function (radian) {
        return radian / Math.PI * 180;
    },
    getRadian: function (degrees) {
        return degrees * Math.PI / 180;
    },
    getPolarCoord: function (rad1, rad2, r) {
        let x = Math.cos(rad1) * Math.cos(rad2) * r;
        let z = Math.cos(rad1) * Math.sin(rad2) * r;
        let y = Math.sin(rad1) * r;
        return new THREE.Vector3(x, y, z);
    }
}

class Force3 {
    constructor() {
        this.velocity = new THREE.Vector3();
        this.acceleration = new THREE.Vector3();
        this.anchor = new THREE.Vector3();
        this.mass = 1;
    }

    updateVelocity() {
        this.acceleration.divideScalar(this.mass);
        this.velocity.add(this.acceleration);
    }

    applyForce(vector) {
        this.acceleration.add(vector);
    }

    applyFriction(mu, normal) {
        let force = this.acceleration.clone();
        if (!normal) normal = 1;
        force.multiplyScalar(-1);
        force.normalize();
        force.multiplyScalar(mu);
        this.applyForce(force);
    };

    applyDrag(value) {
        let force = this.acceleration.clone();
        force.multiplyScalar(-1);
        force.normalize();
        force.multiplyScalar(this.acceleration.length() * value);
        this.applyForce(force);
    };

    applyHook(rest_length, k) {
        let force = this.velocity.clone().sub(this.anchor);
        let distance = force.length() - rest_length;
        force.normalize();
        force.multiplyScalar(-1 * k * distance);
        this.applyForce(force);
    };
}

class ForceCamera extends THREE.PerspectiveCamera {
    constructor(fov, aspect, near, far) {
        super(fov, aspect, near, far);

        this.force = {
            position: new Force3(),
            look: new Force3(),
        };
        this.up.set(0, 1, 0);
    }

    updatePosition() {
        this.position.copy(this.force.position.velocity);
    }

    updateLook() {
        this.lookAt(
            this.force.look.velocity.x,
            this.force.look.velocity.y,
            this.force.look.velocity.z
        );
    }

    reset() {
        this.setPolarCoord();
        this.lookAtCenter();
    }

    resize(width, height) {
        this.aspect = width / height;
        this.updateProjectionMatrix();
    }

    setPolarCoord(rad1, rad2, range) {
        this.force.position.anchor.copy(Util.getPolarCoord(rad1, rad2, range));
    }

    lookAtCenter() {
        this.lookAt(0, 0, 0);
    }
}

export default class MetalCube {
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
        this.camera = new ForceCamera(35, this.aspect, 0.1, 10000);
        this.camera.position.set(1000, 1000, 1000);
        this.camera.lookAt(new THREE.Vector3());
        this.clock = new THREE.Clock();
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.target.set(0, 0, 0);
        this.controls.update();
        this.controls.enablePan = true;
        this.controls.enableDamping = true;
        this.callback();
        this.paramsInit();
        this.backgroundInit();
        this.metalCubeInit();
        this.camera.setPolarCoord(0, Util.getRadian(90), 24);
        this.animation();
        this.resize();
    }

    paramsInit() {
        this.raycaster = new THREE.Raycaster();
        this.intersects = null;
        this.cube_force = new Force3();
        this.cube_force2 = new Force3();
        this.vactor_raycast = null;
        this.cube_force.mass = 1.4;
    }

    backgroundInit() {
        const baseGeo = new THREE.OctahedronGeometry(30, 4);
        const nonIndexedGeo = baseGeo.toNonIndexed();
        const positions = nonIndexedGeo.attributes.position.array;
        const faceNormals = new Float32Array(positions.length);
        for (let i = 0; i < positions.length; i += 9) { // 每面3顶点，每个顶点xyz
            const x1 = positions[i], y1 = positions[i+1], z1 = positions[i+2];
            const x2 = positions[i+3], y2 = positions[i+4], z2 = positions[i+5];
            const x3 = positions[i+6], y3 = positions[i+7], z3 = positions[i+8];

            // 计算面法线（世界空间）
            const v1 = new THREE.Vector3(x2 - x1, y2 - y1, z2 - z1);
            const v2 = new THREE.Vector3(x3 - x1, y3 - y1, z3 - z1);
            const normal = new THREE.Vector3().crossVectors(v1, v2).normalize();

            // 为当前面的3个顶点填充相同法线
            faceNormals.set([normal.x, normal.y, normal.z], i);   // 顶点1
            faceNormals.set([normal.x, normal.y, normal.z], i+3); // 顶点2
            faceNormals.set([normal.x, normal.y, normal.z], i+6); // 顶点3
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
        const positions = geometry.attributes.position.array;
        const normals = geometry.attributes.normal.array;

        for (let i = 0; i < positions.length; i += 9) {
            // 重新计算面法线（基于变形后的顶点位置）
            const x1 = positions[i], y1 = positions[i+1], z1 = positions[i+2];
            const x2 = positions[i+3], y2 = positions[i+4], z2 = positions[i+5];
            const x3 = positions[i+6], y3 = positions[i+7], z3 = positions[i+8];

            const v1 = new THREE.Vector3(x2 - x1, y2 - y1, z2 - z1);
            const v2 = new THREE.Vector3(x3 - x1, y3 - y1, z3 - z1);
            const normal = new THREE.Vector3().crossVectors(v1, v2).normalize();

            // 更新法线数据
            normals[i] = normal.x; normals[i+1] = normal.y; normals[i+2] = normal.z;
            normals[i+3] = normal.x; normals[i+4] = normal.y; normals[i+5] = normal.z;
            normals[i+6] = normal.x; normals[i+7] = normal.y; normals[i+8] = normal.z;
        }

        geometry.attributes.normal.needsUpdate = true;
    }


    metalCubeInit() {
        const geometry = new THREE.PlaneGeometry(6.0, 6.0);
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: {
                    value: 0
                },
                time2: {
                    value: 0,
                },
                acceleration: {
                    value: 0
                },
                resolution: {
                    value: new THREE.Vector2(this.width, this.height)
                }
            },
            vertexShader: metalCubeVertex,
            fragmentShader: metalCubeFragment,
            transparent: true
        });
        this.metalCube = new THREE.Mesh(geometry, material);
        this.metalCube.name = 'MetalCube';
        this.scene.add(this.metalCube);
    }


    animation() {
        this.renderer.setAnimationLoop(() => this.animation());
        this.cube_force.applyHook(0, 0.12);
        this.cube_force.applyDrag(0.01);
        this.cube_force.updateVelocity();
        this.cube_force2.applyHook(0, 0.005);
        this.cube_force2.applyDrag(0.2);
        this.cube_force2.updateVelocity();
        this.metalCube.position.copy(this.cube_force.velocity);
        this.metalCube.material.uniforms.time.value++;
        this.metalCube.material.uniforms.time2.value += 1 + Math.floor(this.cube_force.acceleration.length() * 4);
        this.metalCube.material.uniforms.acceleration.value = this.cube_force.acceleration.length();
        this.background.material.uniforms.time.value++;
        this.background.material.uniforms.acceleration.value = this.cube_force2.velocity.length();
        this.updateNormals(this.background.geometry);
        this.camera.force.position.applyHook(0, 0.025);
        this.camera.force.position.applyDrag(0.2);
        this.camera.force.position.updateVelocity();
        this.camera.updatePosition();
        this.camera.lookAtCenter();


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
            this.metalCube.material.uniforms.resolution.value.set(this.width, this.height);
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
