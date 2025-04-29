/**
 * justThreeJs aboutHeroLetters.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/29 18:11:47
 */

import * as THREE from "three";
// glsl
import vert$2 from '@/views/pages/lusion/glsl/about/vert$2.glsl'
import frag$5 from '@/views/pages/lusion/glsl/about/frag$5.glsl'

function filePath(path) {
    return new URL(`../../../../assets/${path}`, import.meta.url).href
}


export default class AboutHeroLetters {
    // 3D容器和渲染目标
    container = new THREE.Object3D;   // 主容器
    rt;                        // 主渲染目标
    blurRt;                    // 模糊渲染目标
    shaderUniforms = {};       // 共享uniform变量
    mesh;                      // 最终显示网格
    meshList = [];             // 字母网格列表
    constructor(base) {
        this.parent = base;
        this.base = base.base;
    }
    // 预初始化 - 加载字母位置数据
    preInit() {
        this.base.properties.loader.add(
            filePath("buf/letter_placements.buf"),
            {
                onLoad: this._onGeometryLoad.bind(this) // 加载完成回调
            }
        );
    }

    // 几何体加载完成回调
    _onGeometryLoad(geometry) {
        // 创建基础平面几何体(用于实例化)
        const planeGeo = new THREE.PlaneGeometry(1, 1)
            .translate(0, 0.5, 0)  // 向上偏移0.5单位
            .rotateY(Math.PI);     // 绕Y轴旋转180度

        const vertexCount = geometry.attributes.position.count;
        const instanceCount = Math.floor(vertexCount / 4); // 每个网格实例数

        // 创建共享材质
        const material = new THREE.ShaderMaterial({
            uniforms: Object.assign(
                {
                    u_time: this.base.properties.shaderUniforms.u_time,
                    u_showRatio: this.parent.aboutHeroFaces.shaderUniforms.u_showRatio
                },
                this.parent.shaderUniforms
            ),
            depthTest: false,
            depthWrite: false,
            vertexShader: vert$2,
            fragmentShader: frag$5,
            transparent: true,
            blending: THREE.CustomBlending,
            blendEquation: THREE.AddEquation,
            blendSrc: THREE.OneFactor,
            blendDst: THREE.OneFactor,
            blendEquationAlpha: THREE.AddEquation,
            blendSrcAlpha: THREE.OneFactor,
            blendDstAlpha: THREE.OneFactor
        });

        // 创建4组字母网格(分4层渲染)
        for (let i = 0; i < 4; i++) {
            const instancedGeo = new THREE.InstancedBufferGeometry();

            // 复制基础几何体属性
            for (const attr in planeGeo.attributes) {
                instancedGeo.setAttribute(attr, planeGeo.attributes[attr]);
            }
            instancedGeo.setIndex(planeGeo.index);

            // 创建随机数属性(用于动画变化)
            const rands = new Float32Array(vertexCount * 4);
            for (let j = 0; j < instanceCount; j++) {
                rands[j * 4 + 0] = Math.random();
                rands[j * 4 + 1] = Math.random();
                rands[j * 4 + 2] = Math.random();
                rands[j * 4 + 3] = Math.random();
            }
            instancedGeo.setAttribute("instanceRands", new THREE.InstancedBufferAttribute(rands, 4));

            // 设置实例位置和密度属性
            const startIdx = instanceCount * i;
            instancedGeo.setAttribute(
                "instancePos",
                new THREE.InstancedBufferAttribute(
                    geometry.attributes.position.array.slice(startIdx * 3, (startIdx + instanceCount) * 3),
                    3
                )
            );
            instancedGeo.setAttribute(
                "instanceDensity",
                new THREE.InstancedBufferAttribute(
                    geometry.attributes.density.array.slice(startIdx, startIdx + instanceCount),
                    1
                )
            );

            this.meshList[i] = new THREE.Mesh(instancedGeo, material);
        }

        // 创建渲染目标和模糊目标
        this.rt = this.base.fboHelper.createRenderTarget(1, 1);
        this.blurRt = this.base.fboHelper.createRenderTarget(1, 1);

        // 创建最终显示的全屏网格
        this.mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(2, 2),
            this.base.fboHelper.createRawShaderMaterial({
                uniforms: {u_texture: {value: this.rt.texture}},
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
            })
        );

        // 设置渲染属性
        this.mesh.frustumCulled = false; // 禁用视锥体剔除
        this.mesh.renderOrder = 10;      // 设置渲染顺序

        // 添加到容器并设置渲染前回调
        this.container.add(this.mesh);
        this.mesh.onBeforeRender = this._onBeforeRender.bind(this);
    }

    // 初始化方法(空实现)
    init() {}

    // 渲染前回调 - 执行离屏渲染和模糊处理
    _onBeforeRender() {
        // 调整渲染目标尺寸(如果需要)
        if (this.base.properties.width != this.rt.width || this.base.properties.height != this.rt.height) {
            this.rt.setSize(this.base.properties.width, this.base.properties.height);
        }

        const renderer = this.base.properties.renderer;
        const prevTarget = renderer.getRenderTarget();
        const prevColorState = this.base.fboHelper.getColorState();

        // 设置渲染状态
        renderer.setClearColor(0, 0);
        renderer.setRenderTarget(this.rt);
        renderer.clear();
        renderer.autoClear = false;

        // 分层渲染字母并应用模糊效果
        // 第1层: 强模糊
        this.base.fboHelper.renderMesh(this.meshList[0], this.rt, this.base.properties.camera);
        this.base.blur.blur(16, 0.5, this.rt, this.blurRt, this.rt);

        // 第2层: 中等模糊
        this.base.fboHelper.renderMesh(this.meshList[1], this.rt, this.base.properties.camera);
        this.base.blur.blur(8, 0.5, this.rt, this.blurRt, this.rt);

        // 第3层: 弱模糊
        this.base.fboHelper.renderMesh(this.meshList[2], this.rt, this.base.properties.camera);
        this.base.blur.blur(4, 0.5, this.rt, this.blurRt, this.rt);

        // 第4层: 无模糊
        this.base.fboHelper.renderMesh(this.meshList[3], this.rt, this.base.properties.camera);

        // 恢复渲染状态
        renderer.setRenderTarget(prevTarget);
        this.base.fboHelper.setColorState(prevColorState);
    }

    // 更新方法(空实现)
    update(deltaTime) {}
}
