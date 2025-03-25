/**
 * justThreeJs heroLines.js
 * @author kongjianqiu
 * @description
 * @created 2025/3/25 10:25:53
 */
import * as THREE from "three";
// glsl
import vert from '@/views/pages/hero/glsl/heroLines/vert.glsl'
import frag from '@/views/pages/hero/glsl/heroLines/frag.glsl'

let SEGMENT_COUNT = 3
let THREHSOLDS = [60, 245, 806, 966, 991, 1026, 1191, 1853, 2061, 3111, 4279, 4309, 4338, 5265, 5316, 5447, 5475, 6407, 6445, 7116, 7235, 7349, 7934, 8555, 8583, 8614, 9154, 9640, 9688, 10163, 10420, 10645, 10895, 11074, 11286, 11453, 11596, 11628, 11740, 11799, 11832]
let v0 = new THREE.Vector3;

export default class HeroLines {
    container = new THREE.Object3D;
    time = 0;
    shaderUniforms = {};

    constructor(base) {
        this.base = base;
        this.onLineLoad(this.base.terrainLines)
    }

    onLineLoad(e) {
        let t = e.attributes.position.array, r = THREHSOLDS.length, n = t.length / 3
        let a = new Float32Array(n * SEGMENT_COUNT * 3)
        let l = new Float32Array(n * SEGMENT_COUNT * 3)
        let c = new Float32Array(n * SEGMENT_COUNT)
        let u = new Float32Array(n * SEGMENT_COUNT)
        let f = new Uint8Array(n * SEGMENT_COUNT)
        let p = new Uint16Array((n - r) * 6 * SEGMENT_COUNT)
        let g = new THREE.Vector3
        let v = new THREE.Vector3
        let _ = new THREE.Vector3
        let T = new THREE.Vector3
        let M = new THREE.Vector3
        let S = new THREE.Vector3
        let b = new THREE.Quaternion
        let C = new THREE.Vector3
        let w = 0
        let R = 0
        let E = 0;
        for (let k = 0; k < THREHSOLDS.length; k++) {
            let L = k == 0 ? 0 : THREHSOLDS[k - 1], F = THREHSOLDS[k];
            _.fromArray(t, L * 3), v.copy(_), M.set(0, 1, 0);
            let se = 0;
            for (let D = L; D < F; D++) {
                let G = D * 3;
                g.copy(v), v.copy(_), D < F - 1 && _.fromArray(t, G + 3), T.subVectors(_, g).normalize(), S.crossVectors(M, T).normalize(), b.setFromAxisAngle(T, Math.PI * 2 / SEGMENT_COUNT), C.copy(M), se += v0.copy(v).sub(g).length();
                for (let H = 0; H < SEGMENT_COUNT; H++) {
                    if (C.applyQuaternion(b), a[R + 0] = v.x, a[R + 1] = v.y, a[R + 2] = v.z, l[R + 0] = C.x, l[R + 1] = C.y, l[R + 2] = C.z, c[w] = se, f[w] = k, D < F - 1) {
                        let Z = H == SEGMENT_COUNT - 1 ? 1 - SEGMENT_COUNT : 1;
                        p[E++] = w, p[E++] = w + Z, p[E++] = w + SEGMENT_COUNT, p[E++] = w + Z, p[E++] = w + SEGMENT_COUNT + Z, p[E++] = w + SEGMENT_COUNT
                    }
                    w++, R += 3
                }
            }
            let V = SEGMENT_COUNT * (F - L);
            w -= V;
            let Y = w + V;
            for (; w < Y; w++) u[w] = se
        }
        let I = new THREE.BufferGeometry;
        I.setAttribute("position", new THREE.BufferAttribute(a, 3))
        I.setAttribute("normal", new THREE.BufferAttribute(l, 3))
        I.setAttribute("t", new THREE.BufferAttribute(c, 1))
        I.setAttribute("totalLength", new THREE.BufferAttribute(u, 1))
        I.setAttribute("lineId", new THREE.BufferAttribute(f, 1))
        I.setIndex(new THREE.BufferAttribute(p, 1));
        let O = new THREE.ShaderMaterial({
            uniforms: Object.assign(
                {
                    u_time: this.base.commonUniforms.u_time
                },
                this.base.shaderUniforms
            ),
            vertexShader: vert,
            fragmentShader: frag,
            blending: THREE.CustomBlending,
            blendEquation: THREE.MaxEquation,
            blendSrc: THREE.OneFactor,
            blendDst: THREE.OneFactor,
            blendEquationAlpha: THREE.AddEquation,
            blendSrcAlpha: THREE.OneFactor,
            blendDstAlpha: THREE.OneFactor
        });
        O.extensions.derivatives = !0
        this.mesh = new THREE.Mesh(I, O)
        this.mesh.renderOrder = 15
        this.container.add(this.mesh)
    }

    update(e) {
    }
}
