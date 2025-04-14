/**
 * justThreeJs camera.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/9 15:55:22
 */
import * as THREE from "three";


class PlaneInteraction {
    constructor(base, {camera = null, normal = new THREE.Vector3(0, 0, -1), constant = 0}) {
        this.base = base;
        this._camera = camera
        this._plane = new THREE.Plane(normal, constant)
        this.raycaster = new THREE.Raycaster()
        this.Ai = new THREE.Vector3();
        this.Im = new THREE.Vector3();
    }

    _unproject(e) {
        this.raycaster.setFromCamera(e, this._camera)
        this.raycaster.ray.intersectPlane(this._plane, this.Ai)
        return this.Ai
    }

    getTouchPositionOnPlane(e = 0) {
        return this._unproject(this.base.inputManager.get(e).position11)
    }

    getPointPositionOnPlane(e) {
        return this._unproject(e)
    }

    getPointPositionOnScreen(e) {
        this.Ai.copy(e)
        this.Ai.project(this._camera)
        this.Ai.set((this.Ai.x + 1) / 2 * this.base.screen.w, -(this.Ai.y - 1) / 2 * this.base.screen.h, this.Ai.z)
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

class SpringPoint extends THREE.Vector3 {
    constructor(x, y, z) {
        super(x, y, z);
        this.velocity = new THREE.Vector3();
        this.acceleration = new THREE.Vector3();
        this.restPosition = new THREE.Vector3(x, y, z);
        this.restStrength = 0.05;
        this.locked = false;
    }

    update(dt = 1) {
        if (this.locked) return;

        // 弹簧力 = (目标位置 - 当前) * 弹力系数
        const force = new THREE.Vector3().subVectors(this.restPosition, this).multiplyScalar(this.restStrength);
        this.acceleration.copy(force);

        this.velocity.add(this.acceleration.multiplyScalar(dt));
        this.add(this.velocity.clone().multiplyScalar(dt));

        this.velocity.multiplyScalar(0.95); // 简单阻尼
    }
}

class SpringContact {
    constructor(e, t, base) {
        this.base = base;
        this.a = e
        this.b = t
        this.strength = .05
        this.restLength = this.a.distanceTo(this.b)
        this.fixedLength = !1
        this.Cc = new THREE.Vector3();
    }

    update(e = .999) {
        const t = this.Cc.copy(this.b).sub(this.a)
        const n = t.length() - this.restLength;
        if (this.fixedLength) t.normalize().multiplyScalar(this.restLength), this.b.locked || (this.b.copy(this.a).add(t), this.a.acceleration.setScalar(0), this.a.velocity.setScalar(0), this.b.acceleration.setScalar(0), this.b.velocity.setScalar(0)); else {
            const s = this.base.utils.frictionFPS(e), r = t.normalize().multiplyScalar(n * this.strength * s);
            this.a.locked || this.a.acceleration.add(r), this.b.locked || this.b.acceleration.sub(r)
        }
    }

    copy(e) {
        this.a.copy(e.a)
        this.b.copy(e.b)
        this.strength = e.strength
        this.restLength = e.restLength
        this.fixedLength = e.fixedLength
    }
}

class GeometryProcessing {
    constructor(base) {
        this.base = base;
        this.plane = new THREE.Plane();
        this.triangle = new THREE.BufferGeometry();
        this.planeInteraction = new PlaneInteraction(this.base.base);
        this.point = new SpringPoint();
        this.spring = new SpringContact();


        this.YI = new THREE.Vector2()
        this.JI = new THREE.Vector3()
        this.jI = new THREE.Vector4()
        this.Rv = new THREE.Vector3()
        this.Pv = new THREE.Triangle()
        this.Lv = new THREE.Vector3()
        this.Bv = new THREE.Vector3()
        this.Lm = new THREE.Vector3()
        this.qr = new THREE.Triangle()
        this.Xu = new THREE.Vector3()
        this.Bm = new THREE.Vector3()
        this.$r = new THREE.Vector2()
    }

    createDummyRT() {
        const i = new THREE.WebGLRenderTarget(2, 2, {type: THREE.HalfFloatType});
        i.setSize = () => {
        }
        i.dispose = () => {
        }
        return i
    }


    attribTransfer(sourceMesh, sourceAttribName = "uv", targetMesh, targetAttribName = "uv1") {
        // 如果 sourceMesh 没有该属性，直接抛错
        if (!sourceMesh.geometry.attributes[sourceAttribName]) {
            throw new Error(`The source geometry doesn't have the ${sourceAttribName} attribute.`);
        }

        // 获取目标几何体的顶点数（position 数量）
        const targetPositionAttr = targetMesh.geometry.attributes.position;
        const vertexCount = targetPositionAttr.count;

        // 获取 source 属性维度（1维、2维、3维或4维）
        const itemSize = sourceMesh.geometry.attributes[sourceAttribName].itemSize;

        // 如果目标上还没有这个属性，则初始化它
        if (!targetMesh.geometry.attributes[targetAttribName]) {
            targetMesh.geometry.setAttribute(
                targetAttribName,
                new THREE.BufferAttribute(new Float32Array(vertexCount * itemSize), itemSize)
            );
        }

        // 获取目标属性的底层 Float32Array
        const targetArray = targetMesh.geometry.attributes[targetAttribName].array;

        // 更新 worldMatrix，保证所有顶点处于世界空间
        sourceMesh.updateMatrixWorld();
        targetMesh.updateMatrixWorld();

        // 准备用于插值的向量（根据 itemSize 决定用什么类型）
        let tempVector = this.YI; // 默认 Vector2
        if (itemSize === 3) tempVector = this.JI; // Vector3
        else if (itemSize === 4) tempVector = this.jI; // Vector4
        const interpVector = tempVector.clone();

        // 初始化三角形信息结构（用于缓存最近点结果）
        const triangleInfo = {
            point: this.Rv,                // 最近点
            triangle: this.Pv,             // 三角形
            triangleIndex: 0,         // 三角形索引
            triangleNormal: this.Lv,       // 法线
            triangleBarycoord: this.Bv,    // 重心坐标
            nearestPointIndex: 0
        };

        // 遍历目标几何体每个顶点
        for (let i = 0; i < vertexCount; i++) {
            // 将目标顶点位置转换到世界空间
            this.Lm.fromBufferAttribute(targetPositionAttr, i).applyMatrix4(targetMesh.matrixWorld);

            // 找到 sourceMesh 中最近的三角形，得到重心坐标
            this.closestPointInfo(this.Lm, sourceMesh, triangleInfo);

            // 获取这个三角形的顶点索引
            const i0 = sourceMesh.geometry.index.array[triangleInfo.triangleIndex];
            const i1 = sourceMesh.geometry.index.array[triangleInfo.triangleIndex + 1];
            const i2 = sourceMesh.geometry.index.array[triangleInfo.triangleIndex + 2];

            if (itemSize === 1) {
                // 如果是 scalar（1维），用重心坐标插值
                const a = sourceMesh.geometry.attributes[sourceAttribName].array[i0];
                const b = sourceMesh.geometry.attributes[sourceAttribName].array[i1];
                const c = sourceMesh.geometry.attributes[sourceAttribName].array[i2];
                targetArray[i] = a * triangleInfo.triangleBarycoord.x +
                    b * triangleInfo.triangleBarycoord.y +
                    c * triangleInfo.triangleBarycoord.z;
            } else {
                // 否则是向量（2D/3D/4D），执行向量插值
                interpVector.setScalar(0);
                interpVector
                    .addScaledVector(tempVector.fromBufferAttribute(sourceMesh.geometry.attributes[sourceAttribName], i0), triangleInfo.triangleBarycoord.x)
                    .addScaledVector(tempVector.fromBufferAttribute(sourceMesh.geometry.attributes[sourceAttribName], i1), triangleInfo.triangleBarycoord.y)
                    .addScaledVector(tempVector.fromBufferAttribute(sourceMesh.geometry.attributes[sourceAttribName], i2), triangleInfo.triangleBarycoord.z);
                targetArray.set(interpVector.toArray(), i * itemSize);
            }
        }

        // 标记属性需要更新
        targetMesh.geometry.attributes[targetAttribName].needsUpdate = true;
    }

    closestPointInfo(i, e, t = {
        point: this.Rv,
        triangle: this.Pv,
        triangleIndex: 0,
        triangleNormal: this.Lv,
        triangleBarycoord: this.Bv,
        nearestPointIndex: 0
    }) {
        let closestDistSquared = Infinity;

        // 遍历 e 的所有三角形
        for (let triIndex = 0; triIndex < e.geometry.index.count; triIndex += 3) {
            // 获取三角形顶点索引
            const i0 = e.geometry.index.array[triIndex];
            const i1 = e.geometry.index.array[triIndex + 1];
            const i2 = e.geometry.index.array[triIndex + 2];

            // 从 position 属性中提取三角形，并转换到世界空间
            this.qr.setFromAttributeAndIndices(e.geometry.attributes.position, i0, i1, i2);
            this.qr.a.applyMatrix4(e.matrixWorld);
            this.qr.b.applyMatrix4(e.matrixWorld);
            this.qr.c.applyMatrix4(e.matrixWorld);

            // 找到 i 点到该三角形的最近点 Xu
            this.qr.closestPointToPoint(i, this.Xu);

            // 计算距离平方
            const distSquared = i.distanceToSquared(this.Xu);

            // 如果这是目前最近的三角形，更新结果信息
            if (distSquared < closestDistSquared) {
                closestDistSquared = distSquared;
                t.triangleIndex = triIndex;
                t.point.copy(this.Xu);
                t.triangle.copy(this.qr);
            }
        }

        // 计算该最近三角形的法线和重心坐标
        t.triangle.getNormal(t.triangleNormal);
        t.triangle.getBarycoord(t.point, t.triangleBarycoord);

        // 决定最近点属于三角形的哪个顶点（重心坐标最大的那个）
        let maxIndex = 0;
        if (t.triangleBarycoord.y > t.triangleBarycoord.x && t.triangleBarycoord.y > t.triangleBarycoord.z) {
            maxIndex = 1;
        } else if (t.triangleBarycoord.z > t.triangleBarycoord.x && t.triangleBarycoord.z > t.triangleBarycoord.y) {
            maxIndex = 2;
        }

        // 记录三角形中最靠近的顶点索引
        t.nearestPointIndex = e.geometry.index.array[t.triangleIndex + maxIndex];

        return t;
    }

    positionUI({
                   camera: i,
                   mesh: e,
                   x: t = 0,          // 相对于屏幕左上角的横坐标（像素）
                   y: n = 0,          // 相对于屏幕左上角的纵坐标（像素）
                   width: s = 1,      // UI 宽度比例
                   height: r = 1,     // UI 高度比例
                   distance: a = null,  // UI 距离相机的深度（单位：视图单位，非像素），默认为相机与 target 的距离
                   billboardCamera: o = true  // 是否面向相机（看板效果）
               } = {}) {
        // 获取 UI 距离相机的深度（距离值）
        const l = a || this.Bm.subVectors(i.position, i.target).length();

        // 获取当前视图在该深度下的实际宽高（单位空间中）
        i.getViewSize(l, this.$r);  // $r 是临时 Vector2 存储视图尺寸

        // 计算像素 → 空间单位的缩放因子
        const c = this.$r.y / this.base.screen.height;

        // 设置 mesh 的缩放，使其符合指定宽高（单位：像素乘以缩放因子）
        e.scale.set(s * c, r * c, 1);

        // 归一化屏幕坐标（0~1）
        const h = t / this.base.screen.width;
        const u = n / this.base.screen.height;

        // 根据归一化屏幕坐标计算位置偏移，并转换到相机视角空间
        e.position.copy(i.position).add(
            this.Bm.set(
                this.$r.x * -0.5 + this.$r.x * h,  // 横向从左到右移动
                this.$r.y * 0.5 - this.$r.y * u,  // 纵向从上到下移动
                -l                       // 距离相机一定深度
            ).applyQuaternion(i.quaternion) // 转换到相机方向
        );

        // 如果启用看板效果，则 UI 的方向与相机一致
        if (o) {
            e.quaternion.copy(i.quaternion);
        }

        // 更新矩阵以应用位置、缩放、旋转
        e.updateMatrixWorld();
    }
}



class zL extends qa {
    constructor({
                    scene: e = null,
                    finalMaterials: t = [],
                    rtCount: n = 2,
                    rtOptions: s = {},
                    clearColor: r = null,
                    clearAlpha: a = null
                } = {}) {
        if (!e) throw new Error("MultipleRenderPass requires a scene.");
        super(), this.scene = e, this.camera = e.camera, this.clearColor = r, this.clearAlpha = a, this.clear = !0, this.clearDepth = !1, this.needsSwap = !1, this._oldClearColor = new de, this.multipleRenderTarget = new xf(2, 2, n, {type: ui, ...s}), this.scene.customUploadRT = this.multipleRenderTarget.clone(), this.finalPasses = t.map(o => new dx(o, "__textureAssignDisabled__"))
    }

    render(e, t, n) {
        const s = e.autoClear;
        e.autoClear = !1;
        let r = null;
        this.clearColor !== null && (e.getClearColor(this._oldClearColor), e.setClearColor(this.clearColor, this.clearAlpha)), this.clearAlpha !== null && (r = e.getClearAlpha(), e.setClearAlpha(this.clearAlpha)), this.clearDepth && e.clearDepth(), e.setRenderTarget(this.multipleRenderTarget), this.clear === !0 && e.clear(e.autoClearColor, e.autoClearDepth, e.autoClearStencil), e.render(this.scene, this.camera), this.clearColor !== null && e.setClearColor(this._oldClearColor, this._oldClearAlpha), this.clearAlpha !== null && e.setClearAlpha(r), e.autoClear = s;
        const a = this.finalPasses.length % 2 === 1;
        let o = a ? n : t, l = a ? t : n, c = null;
        this.finalPasses.forEach((h, u) => {
            h.uniforms.tDiffuse && (h.uniforms.tDiffuse.value = u === 0 ? this.multipleRenderTarget.texture[0] : l.texture), h.clear = u === 0, h.render(e, o), c = l, l = o, o = c
        })
    }

    setSize(e, t) {
        this.multipleRenderTarget.setSize(e, t), this.finalPasses.forEach(n => n.setSize(e, t))
    }

    dispose() {
        this.multipleRenderTarget.dispose(), this.finalPasses.forEach(e => e.dispose())
    }
}


class eB extends Qe {
    constructor(e) {
        super({
            uniformsGroups: [st.UBO],
            uniforms: {
                tLogo: {value: si.load("flower/headline.ktx2")},
                tNoise: {value: si.load("flower/noise-simplex-layered.ktx2", "srgb-repeat")},
                tDiffuse: {value: null},
                tInfo: {value: null},
                tSim: e.fluidSim.dyeUniform,
                uBgColor: {value: new de("#ffec95")},
                tTransition: {value: si.load("flower/transition-nomipmaps.jpg")},
                uProgress1: {value: 0},
                uProgress2: {value: 0},
                uProgress3: {value: 0},
                uProgress4: {value: 0},
                uCameraNear: {value: e.camera.near, ignore: !0},
                uCameraFar: {value: e.camera.far, ignore: !0},
                uOutlineFade: {value: new K},
                uOutlineThickness: {value: 0},
                uOutlineColor: {value: new de(11406340)},
                uInfoRange: {value: new w},
                uInfoMinScale: {value: 0},
                uDepthRange: {value: new w},
                uNormalRange: {value: new w},
                uOutlineScale: {value: 0},
                uSmoothMargin: {value: 0}
            },
            vertexShader: `
                ${wt}

                varying vec2 vUv;

                void main() {
                    vUv = uv;
                    gl_Position = vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                ${wt}

                uniform sampler2D tLogo;
                uniform sampler2D tDiffuse;
                uniform sampler2D tInfo;
                uniform sampler2D tSim;

                uniform float uCameraNear;
                uniform float uCameraFar;

                uniform vec2 uOutlineFade;
                uniform float uOutlineThickness;
                uniform vec3 uOutlineColor;
                uniform float uOutlineScale;

                uniform vec3 uInfoRange;
                uniform vec3 uDepthRange;
                uniform vec3 uNormalRange;
                uniform float uSmoothMargin;
                uniform float uInfoMinScale;

                varying vec2 vUv;

                ${qL}
                ${WL}
                ${xl}
                ${$L}
                ${Hs}

                uniform sampler2D tNoise;

                uniform sampler2D tTransition;
                uniform vec3 uBgColor;
                uniform float uProgress1;
                uniform float uProgress2;
                uniform float uProgress3;
                uniform float uProgress4;

                mat2 rotateAngle(float a) {
                    float s = sin(a);
                    float c = cos(a);
                    mat2 m = mat2(c, s, -s, c);
                    return m;
                }

                vec3 hash32(vec2 p) {
                    vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973));
                    p3 += dot(p3, p3.yxz+33.33);
                    return fract((p3.xxy+p3.yzz)*p3.zyx);
                }

                void main() {
                    vec2 uv = vUv;
                    float aspect = resolution.x / resolution.y;

                    // get scene color
                    vec4 scene = texture2D(tDiffuse, uv);
                    vec3 sceneColor = scene.rgb;

                    // compensate outline with resolution
                    float resScale = min(1.0, resolution.y / 1300.0) * uOutlineScale;

                    float outlineValue = outline(tDiffuse, tInfo, vUv, uOutlineThickness, resScale, uInfoRange, uDepthRange, uNormalRange, uSmoothMargin, uInfoMinScale, uOutlineFade);
                    sceneColor = mix(sceneColor, uOutlineColor, outlineValue);

                    vec2 screenUv = gl_FragCoord.xy / resolution.xy;
                    screenUv.x *= aspect;
                    uv -= 0.5;
                    uv.x *= aspect;
                    uv *= 2.2;
                    uv += 0.5;

                    // add some noise distortion to text uvs
                    vec2 noiseUv = screenUv * 3.5;
                    float steppedTime = floor(time * 6.0) * 3.14159 * 0.2;
                    noiseUv = rotateAngle(steppedTime) * noiseUv;
                    vec2 n0 = texture2D(tNoise, noiseUv).rg;
                    uv += n0 * 0.0035;

                    // text
                    float logo = texture2D(tLogo, uv).r;
                    logo = aastep(0.5, logo);

                    // begin transition
                    vec2 transitionUv = vUv;

                    // adjust transition uvs for mobile
                    if (resolution.y > resolution.x) {
                        transitionUv -= 0.5;
                        transitionUv *= resolution / max(resolution.x, resolution.y);
                        transitionUv += 0.5;
                    }

                    float transitionNoise = texture2D(tTransition, transitionUv).r;
                    vec3 sceneSansText = sceneColor;
                    vec3 outlineColor = mix(uBgColor, uOutlineColor, outlineValue);

                    // superimpose text
                    vec3 finalColor = mix(sceneColor, vec3(1.0), logo);

                    // apply final scene color
                    sceneColor = finalColor;

                    // overwrite final scene color for intro transition
                    if (uProgress4 < 1.0) {
                        // transition phase 1
                        float progress1 = uProgress1;
                        sceneColor = mix(uBgColor, vec3(1.0), step(progress1, transitionNoise));

                        // transition phase 2
                        float progress2 = uProgress2;
                        sceneColor = mix(outlineColor, sceneColor, step(progress2, transitionNoise));

                        // transition phase 3
                        float progress3 = uProgress3;
                        sceneColor = mix(sceneSansText, sceneColor, step(progress3, transitionNoise));

                        // transition phase 4
                        float progress4 = uProgress4;
                        sceneColor = mix(finalColor, sceneColor, step(progress4, transitionNoise));
                    }

                    // film grain
                    vec3 noise = hash32(uv * 100.0 + steppedTime);
                    noise *= 2.0;
                    noise -= 1.0;
                    sceneColor += noise * 0.075;

                    // fluid debug
                    // gl_FragColor = vec4(vec3(texture(tSim, vUv).rgb), 1.0);

                    // outline debug
                    // gl_FragColor = vec4(vec3(outlineValue), 1.0); // debug

                    gl_FragColor = vec4(sceneColor, 1.0);
                }
            `
        })
    }
}

function iB(i, e) {
    const t = new zL({
        scene: i,
        rtCount: 2,
        clearColor: new de("#ffffff"),
        clearAlpha: st.renderer.clearAlpha,
        finalMaterials: [new eB(i)]
    });
    e === st.composer && (e.passes.splice(0, 1), st.renderPass = t)
    e.addPass(t);
    const n = t.multipleRenderTarget.texture;
    t.finalPasses[0].uniforms.tInfo.value = n[1]
    n[0].name = "color"
    n[1].name = "info"
    tB(i, e)
    e === st.composer && (t.finalPasses[0].fsQuad._mesh.name = "Big Triangle", So.addToGui(t.finalPasses[0].fsQuad._mesh, "post-outline"))
}
