/**
 * justThreeJs index.js
 * @author kongjianqiu
 * @description
 * @created 2025/3/21 11:14:27
 */

// const properties = new Properties;

import * as THREE from "three";
import Properties from '@/views/pages/hero/js/properties'
import {OrbitControls} from "three/addons/controls/OrbitControls.js";

function filePath(path) {
    return new URL(`../assets/${path}`, import.meta.url).href
}

export default class Hero {
    constructor(config) {
        this.parent = config.parent;
        this.target = config.target;
        this.callback = config.callback;
        this.devicePixelRatio = window.devicePixelRatio;
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
        this.renderer.setSize(this.width, this.height);
        this.scene = new THREE.Scene();
        this.target.appendChild(this.renderer.domElement);
        this.camera = new THREE.PerspectiveCamera(75, this.aspect, 0.1, 50000);
        this.camera.position.set(5, 5, 5);
        this.camera.lookAt(0, 0, 0)
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.callback();
        this.properties = new Properties();
        const loader = new THREE.FileLoader()
        loader.setResponseType('arraybuffer').load(filePath('buf/sunny.buf'), (arrayBuffer) => {
            let geometry = this.onLoad(arrayBuffer);
            console.log(geometry)
            let material = new THREE.MeshBasicMaterial()
            let mesh = new THREE.Mesh(geometry, material)
            this.scene.add(mesh)
            this.animation();
        })
    }

    onLoad(e) {
        let t = new Uint32Array(e, 0, 1)[0],
            r = JSON.parse(String.fromCharCode.apply(null, new Uint8Array(e, 4, t))), n = r.vertexCount,
            a = r.indexCount, l = 4 + t, c = new THREE.BufferGeometry, u = r.attributes, f = !1, p = {};
        for (let _ = 0, T = u.length; _ < T; _++) {
            let M = u[_], S = M.id, b = S === "indices" ? a : n, C = M.componentSize, w = window[M.storageType],
                R = new w(e, l, b * C), E = w.BYTES_PER_ELEMENT, I;
            if (M.needsPack) {
                let O = M.packedComponents, k = O.length, L = M.storageType.indexOf("Int") === 0, F = 1 << E * 8,
                    se = L ? F * .5 : 0, V = 1 / F;
                I = new Float32Array(b * C);
                for (let Y = 0, D = 0; Y < b; Y++) for (let G = 0; G < k; G++) {
                    let H = O[G];
                    I[D] = (R[D] + se) * V * H.delta + H.from, D++
                }
            } else p[S] = l, I = R;
            S === "normal" && (f = !0), S === "indices" ? c.setIndex(new THREE.BufferAttribute(I, 1)) : c.setAttribute(S, new THREE.BufferAttribute(I, C)), l += b * C * E
        }
        let g = r.meshType, v = [];
        if (r.sceneData) {
            let _ = r.sceneData, T = new THREE.Object3D, M = [],
                S = g === "Mesh" ? 3 : g === "LineSegments" ? 2 : 1;
            for (let b = 0, C = _.length; b < C; b++) {
                let w = _[b], R;
                if (w.vertexCount == 0) R = new THREE.Object3D; else {
                    let E = new THREE.BufferGeometry, I = c.index, O = I.array, k = O.constructor,
                        L = k.BYTES_PER_ELEMENT;
                    E.setIndex(new THREE.BufferAttribute(new O.constructor(O.buffer, w.faceIndex * I.itemSize * L * S + (p.indices || 0), w.faceCount * I.itemSize * S), I.itemSize));
                    for (let F = 0, se = E.index.array.length; F < se; F++) E.index.array[F] -= w.vertexIndex;
                    for (let F in c.attributes) I = c.attributes[F], O = I.array, k = O.constructor, L = k.BYTES_PER_ELEMENT, E.setAttribute(F, new THREE.BufferAttribute(new O.constructor(O.buffer, w.vertexIndex * I.itemSize * L + (p[F] || 0), w.vertexCount * I.itemSize), I.itemSize));
                    g === "Mesh" ? R = new THREE.Mesh(E, new THREE.MeshNormalMaterial({flatShading: !f})) : g === "LineSegments" ? R = new THREE.LineSegments(E, new THREE.LineBasicMaterial) : R = new THREE.Points(E, new THREE.PointsMaterial({
                        sizeAttenuation: !1,
                        size: 2
                    })), M.push(R)
                }
                w.parentIndex > -1 ? v[w.parentIndex].add(R) : T.add(R), R.position.fromArray(w.position), R.quaternion.fromArray(w.quaternion), R.scale.fromArray(w.scale), R.name = w.name, R.userData.material = w.material, v[b] = R
            }
            c.userData.meshList = M, c.userData.sceneObject = T
        }
        return c
    }

    animation() {
        this.renderer.setAnimationLoop(() => this.animation());


        this.renderer.render(this.scene, this.camera);
    }

    resize() {
        window.addEventListener('resize', () => {
            this.width = this.target.offsetWidth;
            this.height = this.target.offsetHeight;
            this.resolution.set(this.width, this.height);
            this.aspect = this.width / this.height;
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
