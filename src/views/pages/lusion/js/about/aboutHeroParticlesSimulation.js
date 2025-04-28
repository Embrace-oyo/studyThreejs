/**
 * justThreeJs aboutHeroParticlesSimulation.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/25 18:23:59
 */

import * as THREE from "three";
import Simple1DNoise from '@/views/pages/lusion/js/utils/simple1DNoise'
// glsl
import fragSim from '@/views/pages/lusion/glsl/about/fragSim.glsl'

export default class AboutHeroParticlesSimulation {
    // 粒子模拟纹理的尺寸
    SIM_TEXTURE_WIDTH = 128;  // 纹理宽度

    // 用于存储粒子当前位置和上一帧位置的渲染目标
    currPositionRenderTarget = null;  // 当前帧位置
    prevPositionRenderTarget = null;  // 上一帧位置

    // 粒子系统的原点坐标
    ORIGIN = new THREE.Vector3(0, 8, 0);  // 三维向量(0,8,0)

    // 模拟状态标志
    isPlaying = true;  // 是否正在播放模拟
    isFirstSim = true;  // 是否是第一次模拟

    // 噪声动画参数
    noiseSpeed = 0.4;  // 噪声变化速度
    _noise = new Simple1DNoise();  // 1D噪声生成器
    noiseScaleTime = Math.random();  // 噪声时间缩放
    noiseStableFactorTime = Math.random();  // 稳定因子时间
    noiseStableFactor = Math.random();  // 稳定因子

    // 共享的着色器uniform变量
    shaderUniforms = {
        u_simCurrPosLifeTexture: {value: null},  // 当前位置和生命期纹理
        u_simPrevPosLifeTexture: {value: null},  // 上一帧位置和生命期纹理
        u_simDefaultPosLifeTexture: {value: null},  // 默认位置和生命期纹理
        u_simTextureSize: {value: new THREE.Vector2(this.SIM_TEXTURE_WIDTH, this.SIM_TEXTURE_HEIGHT)},  // 纹理尺寸
        u_noiseStableFactor: {value: 0}  // 噪声稳定因子
    };

    constructor(base) {
        this.parent = base;
        this.base = base.base;
        // 移动设备使用较小的纹理以提高性能
        this.SIM_TEXTURE_HEIGHT = this.base.browser.isMobile ? 128 : 192;  // 纹理高度
    }

    /**
     * 预初始化方法 - 创建渲染目标和初始化粒子位置
     */
    preInit() {
        // 创建当前和上一帧位置的渲染目标
        this.currPositionRenderTarget = this.base.fboHelper.createRenderTarget(
            this.SIM_TEXTURE_WIDTH,
            this.SIM_TEXTURE_HEIGHT,
            true,  // 包含深度缓冲
            THREE.FloatType  // 使用浮点纹理
        );
        this.prevPositionRenderTarget = this.currPositionRenderTarget.clone();

        // 创建用于位置模拟的着色器材质
        this.positionMaterial = this.base.fboHelper.createRawShaderMaterial({
            uniforms: {
                u_lightPosition: this.parent.light.shaderUniforms.u_lightPosition,  // 光源位置
                u_simPrevPosLifeTexture: this.shaderUniforms.u_simPrevPosLifeTexture,
                u_simDefaultPosLifeTexture: this.shaderUniforms.u_simDefaultPosLifeTexture,
                u_introDeltaTime: this.parent.shaderUniforms.u_introDeltaTime,  // 介绍动画时间增量
                u_noiseTime: {value: 0},  // 噪声时间
                u_noiseScale: {value: 0},  // 噪声缩放
                u_noiseStableFactor: this.shaderUniforms.u_noiseStableFactor
            },
            fragmentShader: fragSim  // 片段着色器代码
        });

        // 创建初始粒子位置数据(球面分布)
        let particleCount = this.SIM_TEXTURE_WIDTH * this.SIM_TEXTURE_HEIGHT;
        let positionData = new Float32Array(particleCount * 4);  // 每个粒子4个分量(x,y,z,生命期)

        // 生成随机球面分布的粒子
        for (let i = 0, offset = 0; i < particleCount; i++, offset += 4) {
            let u = Math.random();  // 随机数1
            let v = Math.random();  // 随机数2
            let theta = u * 2 * Math.PI;  // 方位角
            let phi = Math.acos(2 * v - 1);  // 极角
            let radius = 0.25 + Math.cbrt(Math.random()) * 0.5;  // 半径

            // 球坐标转笛卡尔坐标
            let sinPhi = Math.sin(phi);
            let x = radius * sinPhi * Math.cos(theta);
            let y = radius * sinPhi * Math.sin(theta);
            let z = radius * Math.cos(phi);

            // 设置粒子位置和生命期(生命期初始为-1到0之间)
            positionData[offset + 0] = x;
            positionData[offset + 1] = y;
            positionData[offset + 2] = z;
            positionData[offset + 3] = i / particleCount - 1;
        }

        // 创建默认位置纹理并复制到当前渲染目标
        let defaultPosTexture = this.shaderUniforms.u_simDefaultPosLifeTexture.value =
            this.base.fboHelper.createDataTexture(
                positionData,
                this.SIM_TEXTURE_WIDTH,
                this.SIM_TEXTURE_HEIGHT,
                true,  // 使用浮点纹理
                true   // 需要更新
            );
        this.base.fboHelper.copy(defaultPosTexture, this.currPositionRenderTarget);
    }

    /**
     * 初始化方法(当前为空)
     */
    init() {
    }

    /**
     * 更新粒子模拟
     * @param {number} e 时间增量(deltaTime)
     */
    update(e) {
        if (this.isPlaying) {
            // 交换当前和上一帧的渲染目标
            let temp = this.currPositionRenderTarget;
            this.currPositionRenderTarget = this.prevPositionRenderTarget;
            this.prevPositionRenderTarget = temp;

            // 更新uniform变量
            this.shaderUniforms.u_simCurrPosLifeTexture.value = this.currPositionRenderTarget.texture;
            this.shaderUniforms.u_simPrevPosLifeTexture.value = this.prevPositionRenderTarget.texture;

            // 更新噪声参数
            this.positionMaterial.uniforms.u_noiseTime.value += e * this.noiseSpeed;
            this.noiseScaleTime += e;

            // 计算分形布朗运动噪声
            const noiseValue = this._noise.getFbm(this.noiseScaleTime, 3);
            this.positionMaterial.uniforms.u_noiseScale.value = 10 * Math.abs(noiseValue);

            // 更新稳定因子
            this.noiseStableFactorTime += 0.5 * e;
            this.noiseStableFactor += 0.05 * Math.abs(this._noise.getFbm(this.noiseStableFactorTime, 3));

            // 根据介绍动画进度计算稳定因子
            this.shaderUniforms.u_noiseStableFactor.value =
                this.base.math.fit(this.parent.introRatio, 0, 0.4, 0, 1) *
                this.base.math.smoothstep(0.9, 0.95, 0.5 + 0.5 * Math.sin(this.noiseStableFactor));

            // 执行渲染
            this.base.fboHelper.render(this.positionMaterial, this.currPositionRenderTarget);
        }
    }
}
