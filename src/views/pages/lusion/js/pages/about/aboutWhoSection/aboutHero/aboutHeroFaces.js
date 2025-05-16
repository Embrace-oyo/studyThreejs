/**
 * justThreeJs aboutHeroFaces.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/29 17:50:38
 */
import * as THREE from "three";
// glsl
import vert$3 from '@/views/pages/lusion/glsl/about/vert$3.glsl'
import frag$6 from '@/views/pages/lusion/glsl/about/frag$6.glsl'

function filePath(path) {
    return new URL(`../../../../../assets/${path}`, import.meta.url).href
}

const PARTICLE_COUNT = 8192
const SIM_TEXTURE_WIDTH = 128
const SIM_TEXTURE_HEIGHT = 64
const MAX_FACE_NUM = 2;
let _v1$1 = new THREE.Vector3;
let _m = new THREE.Matrix4;
export default class AboutHeroFaces {
    container = new THREE.Object3D(); // 主容器
    faceContainer = new THREE.Object3D(); // 面容 mesh 容器
    isActive = false; // 当前是否激活
    hasStartedLoads = {}; // 已开始加载的队员 ID
    teamPosDataTextures = {}; // 每个队员的位置数据纹理
    teamNShadeDataTextures = {}; // 每个队员的法线阴影数据纹理
    shaderUniforms = {
        u_mouse: { value: new THREE.Vector3() },
        u_glitchOffset: { value: 0 },
        u_glitchStrength: { value: 0 },
        u_showRatio: { value: 0 }
    };

    currId = ""; // 当前展示的队员 ID
    nextId = ""; // 下一个队员 ID（用于过渡）
    transitionRatio = 0; // 过渡进度
    showRatio = 0; // 显示比例
    activeRatio = 1; // 当前激活程度
    hideRatio = 0; // 隐藏程度（暂未使用）
    meshArray = []; // 存放 instanced mesh 的数组（最多两个）

    constructor(base) {
        this.base = base.base;
        this.parent = base;
    }

    preInit() {
        // 预初始化占位
    }

    // 加载指定 ID 的面部模型数据
    load(id) {
        if (!this.hasStartedLoads[id]) {
            this.hasStartedLoads[id] = true;
            const loaderMethod = this.base.properties.hasInitialized ? "load" : "add";
            this.base.properties.loader[loaderMethod](filePath(`buf/${id}.buf`), {
                onLoad: (geometry) => {
                    this._onModelLoaded(id, geometry);
                }
            });
        }
    }

    // 模型加载完成后创建数据纹理
    _onModelLoaded(id, geometry) {
        const positions = geometry.attributes.position.array;
        const n = new Float32Array(PARTICLE_COUNT * 4);

        for (let i = 0, j = 0, k = 0; i < PARTICLE_COUNT; i++, j += 3, k += 4) {
            n[k] = positions[j];
            n[k + 1] = positions[j + 1];
            n[k + 2] = positions[j + 2];
            n[k + 3] = 1 / PARTICLE_COUNT;
        }

        this.teamPosDataTextures[id] = this.base.fboHelper.createDataTexture(n, SIM_TEXTURE_WIDTH, SIM_TEXTURE_HEIGHT, true, true);
        this.teamNShadeDataTextures[id] = this.base.fboHelper.createDataTexture(geometry.attributes.nShade.array, SIM_TEXTURE_WIDTH, SIM_TEXTURE_HEIGHT, false, true);
    }

    // 初始化容器和实例化 mesh
    init() {
        this.container.add(this.faceContainer);
        this.container.scale.set(27.5, 27.5, 16);
        this.container.rotation.set(0.1, Math.PI + 0.2, 0);
        this.container.position.set(0, 34, 25);
        this.container.updateMatrixWorld(true);

        // 复制 PlaneGeometry 并设置 instanced 属性
        const baseGeo = new THREE.PlaneGeometry(1, 1);
        const instancedGeo = new THREE.InstancedBufferGeometry();
        for (let attr in baseGeo.attributes) {
            instancedGeo.attributes[attr] = baseGeo.attributes[attr];
        }
        instancedGeo.index = baseGeo.index;

        // 构建 a_simUv 和随机属性
        const simUv = new Float32Array(PARTICLE_COUNT * 2);
        const rands1 = new Float32Array(PARTICLE_COUNT * 4);
        const rands2 = new Float32Array(PARTICLE_COUNT * 4);

        for (let i = 0, j = 0, k = 0; i < PARTICLE_COUNT; i++, j += 2, k += 4) {
            simUv[j] = (i % SIM_TEXTURE_WIDTH + 0.5) / SIM_TEXTURE_WIDTH;
            simUv[j + 1] = (~~(i / SIM_TEXTURE_WIDTH) + 0.5) / SIM_TEXTURE_HEIGHT;

            for (let m = 0; m < 4; m++) {
                rands1[k + m] = Math.random();
                rands2[k + m] = Math.random();
            }
        }

        instancedGeo.setAttribute("a_simUv", new THREE.InstancedBufferAttribute(simUv, 2));
        instancedGeo.setAttribute("a_rands1", new THREE.InstancedBufferAttribute(rands1, 4));
        instancedGeo.setAttribute("a_rands2", new THREE.InstancedBufferAttribute(rands2, 4));

        // 创建 MAX_FACE_NUM 个 mesh，添加到容器中
        for (let i = 0; i < MAX_FACE_NUM; i++) {
            const mat = new THREE.ShaderMaterial({
                uniforms: {
                    u_time: this.base.properties.shaderUniforms.u_time,
                    u_resolution: this.base.properties.shaderUniforms.u_resolution,
                    u_mouse: this.shaderUniforms.u_mouse,
                    u_glitchOffset: this.shaderUniforms.u_glitchOffset,
                    u_glitchStrength: this.shaderUniforms.u_glitchStrength,
                    u_glitchThreshold: { value: 0 },
                    u_activeRatio: { value: 0 },
                    u_showRatio: this.shaderUniforms.u_showRatio,
                    u_positionTexture: { value: null },
                    u_norShadeTexture: { value: null }
                },
                vertexShader: vert$3,
                fragmentShader: frag$6,
                depthTest: false,
                depthWrite: false,
                transparent: true,
                blending: THREE.CustomBlending,
                blendEquation: THREE.AddEquation,
                blendSrc: THREE.OneFactor,
                blendDst: THREE.OneFactor,
                blendEquationAlpha: THREE.AddEquation,
                blendSrcAlpha: THREE.OneFactor,
                blendDstAlpha: THREE.OneFactor
            });

            mat.extensions.derivatives = true;

            const mesh = new THREE.Mesh(instancedGeo, mat);
            mesh.frustumCulled = false;
            mesh.visible = false;

            this.meshArray.push(mesh);
            this.faceContainer.add(mesh);
        }
    }

    resize(width, height) {
        // 空实现，供未来使用
    }

    update(dt) {
        if (this.meshArray.length === 0) return;

        const t = this.transitionRatio;
        this.shaderUniforms.u_showRatio.value = this.showRatio;

        const inputMouse = this.base.input.easedMouseDynamics.default.value;
        _v1$1.set(inputMouse.x, inputMouse.y, 0.5)
            .unproject(this.base.cameraControls._camera)
            .sub(this.base.cameraControls._camera.position)
            .normalize()
            .multiplyScalar(75 / _v1$1.z)
            .add(this.base.cameraControls._camera.position);

        _m.copy(this.faceContainer.matrixWorld).invert();
        _v1$1.applyMatrix4(_m);

        const pitch = this.base.math.clamp(_v1$1.y * 0.03, -0.05, 0.05);
        const yaw = this.base.math.clamp(_v1$1.x * 0.03, -0.05, 0.05);
        _v1$1.applyMatrix4(this.faceContainer.matrixWorld);
        this.shaderUniforms.u_mouse.value.copy(_v1$1);

        // 当前 mesh（out）
        const m0 = this.meshArray[0];
        m0.material.uniforms.u_positionTexture.value = this.teamPosDataTextures[this.currId];
        m0.material.uniforms.u_norShadeTexture.value = this.teamNShadeDataTextures[this.currId];
        m0.material.uniforms.u_activeRatio.value = (1 - t) * this.activeRatio;
        m0.material.uniforms.u_glitchThreshold.value = this.base.math.fit(m0.material.uniforms.u_activeRatio.value, 0.4, 1, 0, 0.9);
        m0.position.set(-1.5 * t, 0, -2 * t - (1 - this.activeRatio) * 2);
        m0.rotation.set(0.4 * t + pitch, -0.3 * t + yaw, 0);
        m0.visible = true;

        // 下一个 mesh（in）
        const m1 = this.meshArray[1];
        m1.material.uniforms.u_positionTexture.value = this.teamPosDataTextures[this.nextId];
        m1.material.uniforms.u_norShadeTexture.value = this.teamNShadeDataTextures[this.nextId];
        m1.material.uniforms.u_activeRatio.value = t * this.activeRatio;
        m1.material.uniforms.u_glitchThreshold.value = this.base.math.fit(m1.material.uniforms.u_activeRatio.value, 0.4, 1, 0, 0.9);
        m1.position.set((t - 1) * -1.5, 0, (t - 1) * 2 - (1 - this.activeRatio) * 2);
        m1.rotation.set((t - 1) * -0.4 + pitch, (t - 1) * -0.3 + yaw, 0);
        m1.visible = true;

        // 随机闪烁效果
        this.shaderUniforms.u_glitchOffset.value = Math.random() * 1000;
        this.shaderUniforms.u_glitchStrength.value = Math.random();

        this.container.visible = this.isActive;
    }
}

