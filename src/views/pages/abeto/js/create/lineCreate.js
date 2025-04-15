/**
 * justThreeJs lineCreate.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/1 14:28:29
 */
import * as THREE from "three";
import {FullScreenQuad} from 'three/addons/postprocessing/Pass.js';
// glsl
import vertex from '@/views/pages/abeto/glsl/line/vertex.glsl'
import fragment from '@/views/pages/abeto/glsl/line/fragment.glsl'


class CustomMesh extends THREE.Mesh {
    constructor(base) {
        super(base.geometry, base.material);
        this.base = base;
        this.isMeshLine = !0
        this.linesCount = this.base.count;
        this.name = this.linesCount > 1 ? "Meshlines" : "Meshline"
        this.frustumCulled = !1;
        const renderTargetType = this.base.base.renderer.webgl.capabilities.floatRenderTarget ? THREE.FloatType : THREE.HalfFloatType;
        const size = this.base.base.utils.ceilPowerOfTwo(Math.max(2, this.base.points));
        this.rt1 = new THREE.WebGLMultipleRenderTargets(size, size, this.base.textureData.textures || 1, {
            wrapS: THREE.ClampToEdgeWrapping,
            wrapT: THREE.ClampToEdgeWrapping,
            minFilter: THREE.NearestFilter,
            magFilter: THREE.NearestFilter,
            format: THREE.RGBAFormat,
            type: renderTargetType,
            depthBuffer: !1
        });
        this.rt2 = this.rt1.clone();
        this.rtCurrent = 0;
        this.fsQuad = new FullScreenQuad(null)

        this.computationMaterial = this.base.textureData.material
        this.fsQuad.material = this.computationMaterial

        this.base.textureData.afterCompute && (this.afterCompute = this.base.textureData.afterCompute)
        this.base.textureData.autoCompute !== !1 && (this.onBeforeRender = this.compute.bind(this))
    }

    compute(renderer, scene, camera) {
        const t = this.base.base.renderer.webgl;
        const r = this.computationMaterial.uniforms.uModelMatrix
        const a = this.computationMaterial.uniforms.uViewMatrix
        const o = this.computationMaterial.uniforms.uProjMatrix;
        r && r.value.copy(this.matrixWorld)
        a && a.value.copy(camera.matrixWorldInverse)
        o && o.value.copy(camera.projectionMatrix);
        const l = this.rtCurrent === 0 ? this.rt1 : this.rt2
        const c = this.rtCurrent === 0 ? this.rt2 : this.rt1;
        this.rtCurrent = (this.rtCurrent + 1) % 2;
        for (let f = 0; f < c.texture.length; f++) {
            const A = this.computationMaterial.uniforms[`tTexture${f + 1}`];
            A && (A.value = c.texture[f])
        }
        const h = t.autoClear;
        t.autoClear = !1;
        const u = t.getRenderTarget();
        t.setRenderTarget(l)
        t.getClearColor(new THREE.Color());
        const d = t.getClearAlpha();
        t.setClearColor(new THREE.Color("#000000"), 0)
        t.clear(!0, !1, !1)
        this.fsQuad.render(t)
        t.autoClear = h
        t.setRenderTarget(u)
        t.setClearColor(new THREE.Color(), d);
        for (let f = 0; f < l.texture.length; f++) {
            const A = this.material.uniforms[`tTexture${f + 1}`];
            A && (A.value = l.texture[f]);
            const g = this.material.uniforms[`tTexture${f + 1}Prev`];
            g && (g.value = c.texture[f])
        }
        this.afterCompute && this.afterCompute(renderer, scene, camera)
    }

    dispose() {
        var t;
        this.fsQuad.dispose()
        this.computationMaterial.dispose()
        this.rt1.dispose()
        this.rt2.dispose()
        (t = super.dispose) == null || t.call(this)
    }
}

class PlaneProjector {
    constructor(base, {camera: e = null, normal: t = new THREE.Vector3(0, 0, -1), constant: n = 0} = {}) {
        this.base = base;
        this.raycaster = new THREE.Raycaster();
        this._camera = e
        this._plane = new THREE.Plane(t, n)
        this.Ai = new THREE.Vector3();
        this.Im = new THREE.Vector3();
    }

    _unproject(e) {
        this.raycaster.setFromCamera(e, this._camera)
        this.raycaster.ray.intersectPlane(this._plane, this.Ai)
        return this.Ai
    }

    getTouchPositionOnPlane(e = 0) {
        return this._unproject(this.base.base.inputManager.get(e).position11)
    }

    getPointPositionOnPlane(e) {
        return this._unproject(e)
    }

    getPointPositionOnScreen(e) {
        this.Ai.copy(e)
        this.Ai.project(this._camera)
        this.Ai.set((this.Ai.x + 1) / 2 * this.base.base.screen.w, -(this.Ai.y - 1) / 2 * this.base.base.screen.h, this.Ai.z)
        return this.Ai
    }

    setPlaneFromPoint(e) {
        this.Ai.copy(this._camera.position).sub(e).normalize()
        this._plane.setFromNormalAndCoplanarPoint(this.Ai, e)
        return this
    }

    setPlaneFromCameraTarget() {
        return this.setPlaneFromPoint(this._camera.target)
    }

    setPlaneFromCameraTargetAndDistance(e) {
        this.Ai.copy(this._camera.position).sub(this._camera.target).normalize()
        this.Im.copy(this.Ai).negate().multiplyScalar(e).add(this._camera.position)
        this._plane.setFromNormalAndCoplanarPoint(this.Ai, this.Im)
        return this
    }

    setPlaneFromDirectionAndPoint(e, t) {
        this.Ai.copy(e).normalize()
        this._plane.setFromNormalAndCoplanarPoint(this.Ai, t)
        return this
    }

    setDefaultPlane() {
        this._plane.normal.set(0, 0, -1)
        this._plane.constant = 0
        return this
    }

    setCamera(e) {
        this._camera = e
        return this
    }

    unprojectFinger(e = 0) {
        return this.setPlaneFromCameraTarget().getTouchPositionOnPlane(e)
    }

    unprojectPoint(e) {
        return this.setPlaneFromCameraTarget().getPointPositionOnPlane(e)
    }

    unprojectDistance(e, t = 0) {
        return this.setPlaneFromCameraTargetAndDistance(e).getTouchPositionOnPlane(t)
    }

    project(e) {
        return this.getPointPositionOnScreen(e)
    }
}

export default class LineCreate {
    constructor(base, t = {}) {
        this.base = base;
        this.options = {length: .5, ...t}
        this.count = 1;
        this.points = 16
        this.init()
    }

    init() {
        this.geometry = this.createPolylineGeometry({
            count: this.count,
            points: this.points,
            closed: false
        });
        this.material = new THREE.ShaderMaterial({
            defines: {SHAPE: 0},
            uniformsGroups: [this.base.UBO],
            uniforms: {
                lineWidth: {value: 0.1},
                uColor: {value: new THREE.Color("#ac5c36")},
                tTexture1: {value: null},
                tNoise: {value: this.base.noiseSimplexLayeredTexture}
            },
            vertexShader: vertex,
            fragmentShader: fragment,
            depthTest: !1
        });
        this.textureData = {
            textures: 1,
            material: new THREE.ShaderMaterial({
                uniformsGroups: [this.base.UBO],
                uniforms: {
                    tTexture1: {value: null},
                    uMousePos: {value: new THREE.Vector3()},
                    uSnap: {value: 0},
                    uViewMatrix: {value: new THREE.Matrix4()},
                    uModelMatrix: {value: new THREE.Matrix4()},
                    uProjMatrix: {value: new THREE.Matrix4()}
                },
                vertexShader: `
                    void main() {
                        gl_Position = vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    #define outPos pc_fragColor

                    uniform sampler2D tTexture1;

                    uniform mat4 uProjMatrix;
                    uniform mat4 uViewMatrix;
                    uniform mat4 uModelMatrix;

                    uniform vec3 uMousePos;
                    uniform int uSnap;

                    uniform Global{vec2 resolution;float time;float dtRatio;};

                    void main() {
                        ivec2 uv = ivec2(gl_FragCoord.xy);
                        vec3 pos = texelFetch(tTexture1, uv, 0).xyz;

                        if (uv.x == 0) {
                            pos = uMousePos;
                        } else {
                            vec3 nextPos = texelFetch(tTexture1, uv - ivec2(1, 0), 0).xyz;
                            pos = mix(pos, nextPos, clamp(dtRatio, 0.0, 1.0));

                            if (uSnap == 1) pos = uMousePos;
                        }

                        outPos = vec4(pos, 1.0);
                    }
                `
            })
        }
        this.mesh = new CustomMesh(this);
        this.mesh.name = "line"
        this.mesh.renderOrder = 5
        this.mesh.updateMatrixWorld()
        this.mesh.matrixAutoUpdate = !1;
        const e = new THREE.Vector3()
        const t = new THREE.Vector3()
        let n = 0
        let s = !1;
        this.base.eventManage.once("touch_move", () => {
            s = !0
        })
        this.planeInteraction = new PlaneProjector(this)
        this.base.scene.beforeRenderCbs.push(() => {
            const r = this.mesh.computationMaterial.uniforms.uMousePos.value
            const a = this.planeInteraction.setCamera(this.base.scene.camera).unprojectFinger(0);
            r.lerp(a, this.base.utils.lerpCoefFPS(.3))
            n += t.subVectors(r, e).length()
            n *= this.base.utils.frictionFPS(.8)
            n = this.base.utils.clamp(n, 0, 1)
            e.copy(r)
            this.mesh.material.uniforms.lineWidth.value = 9 / this.base.screen.h * this.base.utils.fit(n, .01, .001, 1, 0)
            if (s) {
                this.mesh.computationMaterial.uniforms.uSnap.value = 1
                r.copy(a)
                s = !1
            } else {
                this.mesh.computationMaterial.uniforms.uSnap.value = 0
            }
        })
        this.base.scene.add(this.mesh)
    }

    createPolylineGeometry({points: pointCount, count: instanceCount, closed: isClosed}) {
        const isInstanced = instanceCount > 1;

        const vertexData = []; // 每个顶点存储：当前点、前一个点、后一个点索引（用于计算线段朝向等）
        for (let i = 0; i < pointCount; i++) {
            let prevIndex, nextIndex;

            if (isClosed) {
                // 闭合：环形处理
                prevIndex = i === 0 ? pointCount - 2 : i - 1;
                nextIndex = i === pointCount - 1 ? 1 : i + 1;
            } else {
                // 非闭合：边界保持静止
                prevIndex = i === 0 ? 0 : i - 1;
                nextIndex = i === pointCount - 1 ? pointCount - 1 : i + 1;
            }

            // 每个点复制两次（上/下边界），用于构造带宽度的线
            vertexData.push(i, prevIndex, nextIndex);
            vertexData.push(i, prevIndex, nextIndex);
        }

        const indexData = [];
        for (let i = 0; i < pointCount - 1; i++) {
            const base = i * 2;
            // 构造两个三角形，组成一个带状面片
            indexData.push(base, base + 1, base + 2);
            indexData.push(base + 2, base + 1, base + 3);
        }

        const uvData = [];
        for (let i = 0; i < pointCount; i++) {
            const u = i / (pointCount - 1);
            uvData.push(u, 0); // 下边界
            uvData.push(u, 1); // 上边界
        }

        const instanceUVY = [];
        if (isInstanced) {
            for (let i = 0; i < instanceCount; i++) instanceUVY.push(i); // 每个实例唯一标识
        } else {
            for (let i = 0; i < pointCount * 2; i++) instanceUVY.push(0); // 非实例：统一标识
        }

        const geometry = new (isInstanced ? THREE.InstancedBufferGeometry : THREE.BufferGeometry)(); // Ph = InstancedBufferGeometry，Gt = BufferGeometry
        if (isInstanced) geometry.instanceCount = instanceCount;

        geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(vertexData), 3)); // 实际是存储点索引信息（逻辑上的 position）
        geometry.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(uvData), 2));
        geometry.setAttribute("uvy", new (isInstanced ? THREE.InstancedBufferAttribute : THREE.BufferAttribute)(new Float32Array(instanceUVY), 1));
        geometry.setIndex(indexData);

        return geometry;
    }

}
