/**
 * justThreeJs aboutHeroParticles.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/25 18:35:46
 */

import * as THREE from "three";
import vert$9 from '@/views/pages/lusion/glsl/about/vert$9.glsl'
import frag$d from '@/views/pages/lusion/glsl/about/frag$d.glsl'
import motionVert from '@/views/pages/lusion/glsl/about/motionVert.glsl'
import motionFrag from '@/views/pages/lusion/glsl/about/motionFrag.glsl'
import lightFieldVert from '@/views/pages/lusion/glsl/about/lightFieldVert.glsl'
import lightFieldFrag from '@/views/pages/lusion/glsl/about/lightFieldFrag.glsl'

function filePath(path) {
    return new URL(`../../../../../assets/${path}`, import.meta.url).href
}

export default class AboutHeroParticles {
    // 容器对象
    container = new THREE.Object3D();

    // 三种不同类型的网格
    emissiveMesh = null;      // 发光网格
    nonEmissiveMesh = null;   // 非发光网格
    lightFieldMesh = null;    // 光场网格

    // LOD(细节级别)标识
    lodIds = ["l", "m", "s", "xs"];  // 大、中、小、超小

    // LOD参考几何体数组
    lodRefGeometries = [];

    constructor(base) {
        this.parent = base;
        this.base = base.base;
    }

    /**
     * 预初始化方法
     */
    preInit() {
        // 加载LOD几何体
        for (let p = this.base.settings.IS_SMALL_SCREEN ? 1 : 0; p < 4; p++) {
            this.base.properties.loader.add(
                filePath("buf/sphere_" + this.lodIds[p] + ".buf"),
                {onLoad: this._onGeometryLoad.bind(this, p)}
            );
        }

        // 创建粒子UV坐标数据
        let particleCount = this.parent.sim.SIM_TEXTURE_WIDTH * this.parent.sim.SIM_TEXTURE_HEIGHT;
        let uvData = new Float32Array(particleCount * 3);

        // 创建非发光和发光网格的几何体
        let nonEmissiveGeo = new THREE.InstancedBufferGeometry();
        let emissiveGeo = new THREE.InstancedBufferGeometry();

        // 创建线状网格数据
        let lineData = new Float32Array((this.parent.sim.SIM_TEXTURE_WIDTH - 1) * this.parent.sim.SIM_TEXTURE_HEIGHT * 2);
        let emissiveLineData = new Float32Array(this.parent.sim.SIM_TEXTURE_HEIGHT * 2);

        // 填充UV数据
        for (let p = 0, uvOffset = 0, lineOffset = 0, emissiveOffset = 0; p < particleCount; p++, uvOffset += 3) {
            // 计算UV坐标
            let u = uvData[uvOffset + 0] = (p % this.parent.sim.SIM_TEXTURE_WIDTH + 0.5) / this.parent.sim.SIM_TEXTURE_WIDTH;
            let v = uvData[uvOffset + 1] = (Math.floor(p / this.parent.sim.SIM_TEXTURE_WIDTH) + 0.5) / this.parent.sim.SIM_TEXTURE_HEIGHT;

            // 分配数据到线状网格
            if (p % this.parent.sim.SIM_TEXTURE_WIDTH == 0) {
                emissiveLineData[emissiveOffset + 0] = u;
                emissiveLineData[emissiveOffset + 1] = v;
                emissiveOffset += 2;
            } else {
                lineData[lineOffset + 0] = u;
                lineData[lineOffset + 1] = v;
                lineOffset += 2;
            }
        }

        // 设置非发光网格
        nonEmissiveGeo.setAttribute("simUv", new THREE.InstancedBufferAttribute(lineData, 2));
        this.nonEmissiveMesh = new THREE.Mesh(nonEmissiveGeo, new THREE.ShaderMaterial({
            uniforms: Object.assign({
                    u_simCurrPosLifeTexture: this.parent.sim.shaderUniforms.u_simCurrPosLifeTexture,
                    u_simTextureSize: this.parent.sim.shaderUniforms.u_simTextureSize,
                    u_noiseStableFactor: this.parent.sim.shaderUniforms.u_noiseStableFactor,
                    u_isEmissive: {value: 0},
                    u_emissiveRatio: {value: 0}
                },
                this.parent.lightField.shaderUniforms,
                this.parent.aboutHeroScatter.shaderUniforms,
                this.parent.shaderUniforms,
                this.base.blueNoise.shaderUniforms),
            vertexShader: vert$9,
            fragmentShader: frag$d
        }));
        this.nonEmissiveMesh.renderOrder = 5;
        this.nonEmissiveMesh.frustumCulled = false;
        this.container.add(this.nonEmissiveMesh);

        // 设置发光网格
        emissiveGeo.setAttribute("simUv", new THREE.InstancedBufferAttribute(emissiveLineData, 2));
        this.emissiveMesh = new THREE.Mesh(emissiveGeo, new THREE.ShaderMaterial({
            uniforms: Object.assign({}, this.nonEmissiveMesh.material.uniforms, {
                u_isEmissive: {value: 1},
                u_emissiveRatio: {value: 0}
            }),
            vertexShader: vert$9,
            fragmentShader: frag$d
        }));
        this.emissiveMesh.renderOrder = 5;
        this.emissiveMesh.frustumCulled = false;
        this.container.add(this.emissiveMesh);

        // 创建运动模糊网格
        let planeGeo = new THREE.PlaneGeometry(1, 1);
        let motionGeo = new THREE.InstancedBufferGeometry();
        for (let attr in planeGeo.attributes) {
            motionGeo.attributes[attr] = planeGeo.attributes[attr];
        }
        motionGeo.setIndex(planeGeo.getIndex());
        motionGeo.setAttribute("simUv", new THREE.InstancedBufferAttribute(uvData, 3));
        this.motionMesh = new THREE.Mesh(motionGeo, new THREE.ShaderMaterial({
            uniforms: {
                u_simPrevPosLifeTexture: this.parent.sim.shaderUniforms.u_simPrevPosLifeTexture,
                u_simCurrPosLifeTexture: this.parent.sim.shaderUniforms.u_simCurrPosLifeTexture,
                u_aspect: this.base.properties.shaderUniforms.u_aspect
            },
            vertexShader: motionVert,
            fragmentShader: motionFrag
        }));
        this.motionMesh.frustumCulled = false;

        // 创建光场点云网格
        let lightFieldGeo = new THREE.BufferGeometry();
        lightFieldGeo.name = "lightFieldGeometry";
        lightFieldGeo.setAttribute("position", new THREE.BufferAttribute(uvData, 3));
        this.lightFieldMesh = new THREE.Points(lightFieldGeo, this.base.fboHelper.createRawShaderMaterial({
            uniforms: Object.assign({
                u_simCurrPosLifeTexture: this.parent.sim.shaderUniforms.u_simCurrPosLifeTexture,
                u_noiseStableFactor: this.parent.sim.shaderUniforms.u_noiseStableFactor
            }, this.parent.lightField.shaderUniforms),
            vertexShader: lightFieldVert,
            fragmentShader: lightFieldFrag,
            blending: THREE.CustomBlending,
            blendEquation: THREE.MaxEquation,
            blendSrc: THREE.OneFactor,
            blendDst: THREE.OneFactor,
            blendEquationAlpha: THREE.MaxEquation,
            blendSrcAlpha: THREE.OneFactor,
            blendDstAlpha: THREE.OneFactor
        }));
        this.lightFieldMesh.frustumCulled = false;
    }

    /**
     * 几何体加载回调
     * @param {number} e LOD级别索引
     * @param {BufferGeometry} t 加载的几何体
     */
    _onGeometryLoad(e, t) {
        this.lodRefGeometries[e] = t;
    }

    /**
     * 初始化方法
     */
    init() {
        // 当前为空实现
    }

    /**
     * 更新粒子系统
     * @param {number} e 时间增量(deltaTime)
     */
    update(e) {
        // 更新发光比例
        let emissiveRatio = this.base.math.fit(this.parent.introRatio, 0, 0.2, 0, 0.75);
        this.nonEmissiveMesh.material.uniforms.u_emissiveRatio.value = emissiveRatio;
        this.emissiveMesh.material.uniforms.u_emissiveRatio.value = emissiveRatio;

        // 根据介绍动画进度确定LOD级别
        let isEarlyPhase = this.parent.introRatio < 0.3;
        let isMidPhase = !isEarlyPhase && this.parent.introRatio < 0.7;

        let nonEmissiveLod, emissiveLod;

        if (this.base.settings.IS_SMALL_SCREEN) {
            // 小屏幕设备LOD选择
            nonEmissiveLod = isEarlyPhase ? 2 : 3;
            emissiveLod = isEarlyPhase ? 1 : (isMidPhase ? 2 : 3);
        } else {
            // 大屏幕设备LOD选择
            nonEmissiveLod = isEarlyPhase ? 1 : (isMidPhase ? 2 : 3);
            emissiveLod = isEarlyPhase ? 0 : (isMidPhase ? 1 : 3);
        }

        // 应用LOD几何体
        let lodGeo = this.lodRefGeometries[nonEmissiveLod];
        for (let attr in lodGeo.attributes) {
            this.nonEmissiveMesh.geometry.attributes[attr] = lodGeo.attributes[attr];
        }
        this.nonEmissiveMesh.geometry.setIndex(lodGeo.getIndex());

        lodGeo = this.lodRefGeometries[emissiveLod];
        for (let attr in lodGeo.attributes) {
            this.emissiveMesh.geometry.attributes[attr] = lodGeo.attributes[attr];
        }
        this.emissiveMesh.geometry.setIndex(lodGeo.getIndex());

        // 渲染光场效果
        this.parent.lightField.renderMesh(this.lightFieldMesh);

        // 计算并应用运动模糊
        let motionBlurRatio = this.base.math.fit(this.parent.introRatio, 0, 0.1, 1, 1.5);
        motionBlurRatio = this.base.math.fit(this.parent.introRatio, 0.1, 0.15, motionBlurRatio, 0);
        this.base.aboutPageHeroEfxPrepass.motionBlurRatio = motionBlurRatio;

        // 如果需要运动模糊，则渲染运动效果
        if (this.base.aboutPageHeroEfxPrepass.motionBlurRatio > 0) {
            this.base.aboutPageHeroEfxPrepass.renderMotion(
                this.motionMesh,
                this.base.properties.camera,
                this.base.properties.width >> 2,  // 宽度的1/4
                this.base.properties.height >> 2   // 高度的1/4
            );
        }
    }
}
