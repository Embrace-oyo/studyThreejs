/**
 * justThreeJs aboutHeroFaces.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/29 17:50:38
 */
import * as THREE from "three";
// glsl
import vert$3 from '@/views/pages/lusion/glsl/about/vert$4.glsl'
import frag$6 from '@/views/pages/lusion/glsl/about/frag$7.glsl'

function filePath(path) {
    return new URL(`../../../../assets/${path}`, import.meta.url).href
}

const PARTICLE_COUNT = 8192
const SIM_TEXTURE_WIDTH = 128
const SIM_TEXTURE_HEIGHT = 64
const MAX_FACE_NUM = 2;
let _v1$1 = new THREE.Vector3;
let _m = new THREE.Matrix4;
export default class AboutHeroFaces {
    // 3D容器和状态变量
    container = new THREE.Object3D;       // 主容器
    faceContainer = new THREE.Object3D;   // 面部容器
    isActive = false;               // 是否激活状态
    hasStartedLoads = {};           // 已开始加载的模型记录
    teamPosDataTextures = {};       // 位置数据纹理缓存
    teamNShadeDataTextures = {};    // 法线/着色数据纹理缓存

    // 共享uniform变量
    shaderUniforms = {
        u_mouse: {value: new THREE.Vector3},          // 鼠标位置
        u_glitchOffset: {value: 0},            // 故障效果偏移
        u_glitchStrength: {value: 0},          // 故障效果强度
        u_showRatio: {value: 0}                // 显示比例
    };

    // 过渡状态变量
    currId = "";                    // 当前显示的面部ID
    nextId = "";                    // 下一个要显示的面部ID
    transitionRatio = 0;            // 过渡比例(0-1)
    showRatio = 0;                  // 整体显示比例
    activeRatio = 1;                // 激活比例
    hideRatio = 0;                  // 隐藏比例

    // 网格数组
    meshArray = [];                 // 存储面部网格实例

    constructor(base) {
        this.parent = base;
        this.base = base.base;
    }

    // 预初始化方法(空实现)
    preInit() {
    }

    // 加载面部模型数据
    load(id) {
        if (!this.hasStartedLoads[id]) {
            this.hasStartedLoads[id] = true;
            // 根据初始化状态选择加载方式
            this.base.properties.loader[this.base.properties.hasInitialized ? "load" : "add"](
                filePath(id + ".buf"),
                {
                    onLoad: data => this._onModelLoaded(id, data)
                }
            );
        }
    }

    // 模型加载完成回调
    _onModelLoaded(id, data) {
        // 处理位置数据
        const positions = data.attributes.position.array;
        const posData = new Float32Array(PARTICLE_COUNT * 4);

        // 将位置数据转换为纹理数据格式
        for (let i = 0, posIdx = 0, dataIdx = 0; i < PARTICLE_COUNT; i++, posIdx += 3, dataIdx += 4) {
            posData[dataIdx] = positions[posIdx];
            posData[dataIdx + 1] = positions[posIdx + 1];
            posData[dataIdx + 2] = positions[posIdx + 2];
            posData[dataIdx + 3] = 1 / PARTICLE_COUNT; // 归一化系数
        }

        // 创建并缓存数据纹理
        this.teamPosDataTextures[id] = this.base.fboHelper.createDataTexture(
            posData,
            SIM_TEXTURE_WIDTH,
            SIM_TEXTURE_HEIGHT,
            true,  // 使用浮点纹理
            true   // 需要更新
        );

        // 创建法线/着色数据纹理
        this.teamNShadeDataTextures[id] = this.base.fboHelper.createDataTexture(
            data.attributes.nShade.array,
            SIM_TEXTURE_WIDTH,
            SIM_TEXTURE_HEIGHT,
            false, // 不使用浮点纹理
            true   // 需要更新
        );
    }

    // 初始化方法
    init() {
        // 设置容器层级和初始变换
        this.container.add(this.faceContainer);
        this.container.scale.set(27.5, 27.5, 16);
        this.container.rotation.y = Math.PI + 0.2;
        this.container.rotation.x = 0.1;
        this.container.position.y = 34;
        this.container.position.z = 25;
        this.container.updateMatrixWorld(true);

        // 创建基础平面几何体
        const planeGeo = new THREE.PlaneGeometry(1, 1);
        const instancedGeo = new THREE.InstancedBufferGeometry();

        // 复制几何体属性
        for (const attr in planeGeo.attributes) {
            instancedGeo.attributes[attr] = planeGeo.attributes[attr];
        }
        instancedGeo.index = planeGeo.index;

        // 创建实例化属性数据
        const simUvs = new Float32Array(PARTICLE_COUNT * 2);    // 模拟UV
        const rands1 = new Float32Array(PARTICLE_COUNT * 4);    // 随机数1
        const rands2 = new Float32Array(PARTICLE_COUNT * 4);    // 随机数2

        // 填充实例化属性数据
        for (let i = 0, uvIdx = 0, randIdx = 0; i < PARTICLE_COUNT; i++, uvIdx += 2, randIdx += 4) {
            // 计算模拟UV(对应数据纹理中的位置)
            simUvs[uvIdx] = (i % SIM_TEXTURE_WIDTH + 0.5) / SIM_TEXTURE_WIDTH;
            simUvs[uvIdx + 1] = (~~(i / SIM_TEXTURE_WIDTH) + 0.5) / SIM_TEXTURE_HEIGHT;

            // 填充随机数
            rands1[randIdx] = Math.random();
            rands1[randIdx + 1] = Math.random();
            rands1[randIdx + 2] = Math.random();
            rands1[randIdx + 3] = Math.random();

            rands2[randIdx] = Math.random();
            rands2[randIdx + 1] = Math.random();
            rands2[randIdx + 2] = Math.random();
            rands2[randIdx + 3] = Math.random();
        }

        // 设置实例化属性
        instancedGeo.setAttribute("a_simUv", new THREE.InstancedBufferAttribute(simUvs, 2));
        instancedGeo.setAttribute("a_rands1", new THREE.InstancedBufferAttribute(rands1, 4));
        instancedGeo.setAttribute("a_rands2", new THREE.InstancedBufferAttribute(rands2, 4));

        // 创建多个面部网格(用于过渡效果)
        for (let i = 0; i < MAX_FACE_NUM; i++) {
            const material = new THREE.ShaderMaterial({
                uniforms: {
                    u_time: this.base.properties.shaderUniforms.u_time,
                    u_resolution: this.base.properties.shaderUniforms.u_resolution,
                    u_mouse: this.shaderUniforms.u_mouse,
                    u_glitchOffset: this.shaderUniforms.u_glitchOffset,
                    u_glitchStrength: this.shaderUniforms.u_glitchStrength,
                    u_glitchThreshold: {value: 0},
                    u_activeRatio: {value: 0},
                    u_showRatio: this.shaderUniforms.u_showRatio,
                    u_positionTexture: {value: null},
                    u_norShadeTexture: {value: null}
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

            // 启用着色器导数扩展
            material.extensions.derivatives = true;

            // 创建网格实例
            const mesh = new THREE.Mesh(instancedGeo, material);
            mesh.frustumCulled = false; // 禁用视锥体剔除
            mesh.visible = false;       // 初始不可见

            this.meshArray.push(mesh);
            this.faceContainer.add(mesh);
        }
    }

    // 调整大小方法(空实现)
    resize(width, height) {
    }

    // 每帧更新
    update(deltaTime) {
        if (this.meshArray.length > 0) {
            const transitionRatio = this.transitionRatio;

            // 更新显示比例uniform
            this.shaderUniforms.u_showRatio.value = this.showRatio;

            // 计算鼠标位置相关效果
            const mouseDynamics = this.base.input.easedMouseDynamics.default.value;
            _v1$1.set(mouseDynamics.x, mouseDynamics.y, 0.5)
                .unproject(this.base.cameraControls._camera)
                .sub(this.base.cameraControls._camera.position)
                .normalize();

            _v1$1.multiplyScalar(75 / _v1$1.z).add(this.base.cameraControls._camera.position);

            // 转换到面部容器局部空间
            _m.copy(this.faceContainer.matrixWorld).invert();
            _v1$1.applyMatrix4(_m);

            // 计算基于鼠标位置的旋转偏移
            const rotY = this.base.math.clamp(_v1$1.y * 0.03, -0.05, 0.05);
            const rotX = this.base.math.clamp(_v1$1.x * 0.03, -0.05, 0.05);

            // 转换回世界空间并更新uniform
            _v1$1.applyMatrix4(this.faceContainer.matrixWorld);
            this.shaderUniforms.u_mouse.value.copy(_v1$1);

            // 更新当前面部网格
            const currMesh = this.meshArray[0];
            currMesh.material.uniforms.u_positionTexture.value = this.teamPosDataTextures[this.currId];
            currMesh.material.uniforms.u_norShadeTexture.value = this.teamNShadeDataTextures[this.currId];
            currMesh.material.uniforms.u_activeRatio.value = 1 - transitionRatio;
            currMesh.material.uniforms.u_glitchThreshold.value = this.base.math.fit(
                currMesh.material.uniforms.u_activeRatio.value,
                0.4, 1, 0, 0.9
            );
            currMesh.material.uniforms.u_activeRatio.value *= this.activeRatio;
            currMesh.position.x = transitionRatio * -1.5;
            currMesh.position.z = -transitionRatio * 2 - (1 - this.activeRatio) * 2;
            currMesh.rotation.y = transitionRatio * -0.3 + rotX;
            currMesh.rotation.x = transitionRatio * 0.4 + rotY;
            currMesh.visible = true;

            // 更新下一个面部网格(过渡效果)
            const nextMesh = this.meshArray[1];
            nextMesh.material.uniforms.u_positionTexture.value = this.teamPosDataTextures[this.nextId];
            nextMesh.material.uniforms.u_norShadeTexture.value = this.teamNShadeDataTextures[this.nextId];
            nextMesh.material.uniforms.u_activeRatio.value = transitionRatio;
            nextMesh.material.uniforms.u_glitchThreshold.value = this.base.math.fit(
                nextMesh.material.uniforms.u_activeRatio.value,
                0.4, 1, 0, 0.9
            );
            nextMesh.material.uniforms.u_activeRatio.value *= this.activeRatio;
            nextMesh.position.x = (transitionRatio - 1) * -1.5;
            nextMesh.position.z = (transitionRatio - 1) * 2 - (1 - this.activeRatio) * 2;
            nextMesh.rotation.y = (transitionRatio - 1) * -0.3 + rotX;
            nextMesh.rotation.x = (transitionRatio - 1) * -0.4 + rotY;
            nextMesh.visible = true;

            // 更新故障效果参数
            this.shaderUniforms.u_glitchOffset.value = Math.random() * 1000;
            this.shaderUniforms.u_glitchStrength.value = Math.random();

            // 根据激活状态设置容器可见性
            this.container.visible = this.isActive;
        }
    }
}
