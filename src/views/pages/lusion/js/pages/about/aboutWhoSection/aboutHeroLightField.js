/**
 * justThreeJs aboutHeroLightField.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/25 18:48:41
 */

import * as THREE from "three";
// glsl
import sliceBlendFrag from '@/views/pages/lusion/glsl/about/sliceBlendFrag.glsl'

export default class AboutHeroLightField {
    // 网格划分配置
    GRID_COUNT = new THREE.Vector3(64, 64, 64);  // XYZ轴网格数量
    VOLUME_SIZE = new THREE.Vector3(8, 0, 0);    // 体积空间大小(初始只有X轴)

    // 3D容器和渲染目标
    container = new THREE.Object3D();            // 容器对象
    prevSliceRenderTarget = null;          // 前一帧切片渲染目标
    currSliceRenderTarget = null;          // 当前帧切片渲染目标
    drawnSliceRenderTarget = null;         // 绘制用临时渲染目标

    // 渲染相关
    sliceTo3DMesh = null;                  // 切片转3D的网格
    sliceBlendMaterial;                    // 切片混合材质
    sliceColumnCount = 0;                  // 切片列数
    sliceRowCount = 0;                     // 切片行数
    gridSize = 0;                          // 单个网格大小

    // 调试标志
    SHOW_TEST_VOXELS = false;              // 是否显示测试体素

    // 共享uniform变量
    shaderUniforms = {
        u_lightFieldTexture3D: {value: null},            // 3D光场纹理
        u_lightFieldMaxLod: {value: 0},                  // 最大LOD级别
        u_lightFieldSlicedTexture: {value: null},        // 切片纹理
        u_lightFieldSlicedTextureSize: {value: new THREE.Vector2()}, // 切片纹理尺寸
        u_lightFieldSliceColRowCount: {value: new THREE.Vector2()},  // 切片行列数
        u_lightFieldGridSize: {value: 0},                // 网格尺寸
        u_lightFieldGridCount: {value: this.GRID_COUNT}, // 网格数量
        u_lightFieldVolumeOffset: {value: new THREE.Vector3()}, // 体积偏移
        u_lightFieldVolumeSize: {value: new THREE.Vector3()}   // 体积大小
    };

    constructor(base) {
        this.parent = base;
        this.base = base.base;
    }

    /**
     * 预初始化 (当前为空实现)
     */
    preInit() {
        // 可在此添加资源预加载逻辑
    }

    /**
     * 初始化光场系统
     */
    init() {

        // 计算网格大小并设置uniform
        this.gridSize = this.VOLUME_SIZE.x / (this.GRID_COUNT.x - 1);
        this.shaderUniforms.u_lightFieldGridSize.value = this.gridSize;

        // 计算Y/Z轴体积大小
        this.VOLUME_SIZE.y = this.gridSize * (this.GRID_COUNT.y - 1);
        this.VOLUME_SIZE.z = this.gridSize * (this.GRID_COUNT.z - 1);

        // 设置体积大小(包含边界)
        this.shaderUniforms.u_lightFieldVolumeSize.value
            .setScalar(this.gridSize)
            .add(this.VOLUME_SIZE);

        // 计算最大LOD级别
        this.shaderUniforms.u_lightFieldMaxLod.value = Math.log2(
            Math.min(this.GRID_COUNT.x, this.GRID_COUNT.y, this.GRID_COUNT.z)
        );

        // 计算切片布局(将3D体积展开为2D纹理)
        const totalVoxels = this.GRID_COUNT.x * this.GRID_COUNT.y * this.GRID_COUNT.z;
        this.sliceColumnCount = Math.ceil(Math.sqrt(totalVoxels) / this.GRID_COUNT.x);
        this.sliceRowCount = Math.ceil(this.GRID_COUNT.z / this.sliceColumnCount);

        // 设置切片行列数
        this.shaderUniforms.u_lightFieldSliceColRowCount.value.set(
            this.sliceColumnCount,
            this.sliceRowCount
        );

        // 计算切片纹理尺寸
        const sliceTexWidth = this.GRID_COUNT.x * this.sliceColumnCount;
        const sliceTexHeight = this.GRID_COUNT.y * this.sliceRowCount;
        this.shaderUniforms.u_lightFieldSlicedTextureSize.value.set(sliceTexWidth, sliceTexHeight);

        // 创建渲染目标(三缓冲)
        this.currSliceRenderTarget = this.base.fboHelper.createRenderTarget(sliceTexWidth, sliceTexHeight);
        this.prevSliceRenderTarget = this.currSliceRenderTarget.clone();
        this.drawnSliceRenderTarget = this.currSliceRenderTarget.clone();

        // 清空当前渲染目标
        this.base.fboHelper.clearColor(0, 0, 0, 0, this.currSliceRenderTarget);

        // 创建切片混合材质
        this.sliceBlendMaterial = this.base.fboHelper.createRawShaderMaterial({
            uniforms: {
                u_lightFieldSlicedTextureSize: this.shaderUniforms.u_lightFieldSlicedTextureSize,
                u_lightFieldSliceColRowCount: this.shaderUniforms.u_lightFieldSliceColRowCount,
                u_lightFieldGridCount: this.shaderUniforms.u_lightFieldGridCount,
                u_lightFieldVolumeOffset: this.shaderUniforms.u_lightFieldVolumeOffset,
                u_lightFieldVolumeSize: this.shaderUniforms.u_lightFieldVolumeSize,
                u_prevSliceTexture: {value: null},  // 前一帧纹理
                u_drawnSliceTexture: {value: this.drawnSliceRenderTarget.texture} // 绘制纹理
            },
            fragmentShader: sliceBlendFrag  // 切片混合片段着色器
        });
    }

    /**
     * 更新光场状态
     * @param {number} deltaTime 时间增量
     */
    update(deltaTime) {
        if(!this.drawnSliceRenderTarget) return
        // 计算体积偏移(基于光源位置)
        const volumeOffset = this.VOLUME_SIZE.clone()
            .multiplyScalar(0.5)
            .sub(this.parent.light.position)
            .multiplyScalar(-1);

        // 设置uniform(考虑网格边界)
        this.shaderUniforms.u_lightFieldVolumeOffset.value
            .setScalar(-this.gridSize / 2)
            .add(volumeOffset);

        // 清空绘制目标
        const renderer = this.base.properties.renderer;
        const colorState = this.base.fboHelper.getColorState();
        const currentTarget = renderer.getRenderTarget();

        renderer.setRenderTarget(this.drawnSliceRenderTarget);
        renderer.setClearColor(0, 0);  // 透明黑色
        renderer.clear();

        renderer.setRenderTarget(currentTarget);
        this.base.fboHelper.setColorState(colorState);
    }

    /**
     * 渲染网格到光场
     * @param {Mesh} mesh 要渲染的网格
     */
    renderMesh(mesh) {
        if(!this.drawnSliceRenderTarget) return
        // 保存当前渲染状态
        const renderer = this.base.properties.renderer;
        const colorState = this.base.fboHelper.getColorState();
        const currentTarget = renderer.getRenderTarget();

        // 禁用自动清除颜色(保留深度)
        renderer.autoClearColor = false;

        // 渲染网格到绘制目标
        this.base.fboHelper.renderMesh(mesh, this.drawnSliceRenderTarget);

        // 恢复渲染状态
        renderer.setRenderTarget(currentTarget);
        this.base.fboHelper.setColorState(colorState);
    }

    /**
     * 后期更新 - 执行切片混合
     * @param {number} deltaTime 时间增量
     */
    postUpdate(deltaTime) {
        if (!this.currSliceRenderTarget) return;
        // 保存当前渲染状态
        const renderer = this.base.properties.renderer;
        const colorState = this.base.fboHelper.getColorState();
        const currentTarget = renderer.getRenderTarget();

        // 禁用自动清除
        renderer.autoClear = false;

        // 交换渲染目标(三缓冲轮换)
        const prevTarget = this.prevSliceRenderTarget;
        this.prevSliceRenderTarget = this.currSliceRenderTarget;
        this.currSliceRenderTarget = prevTarget;

        // 更新uniform引用
        this.shaderUniforms.u_lightFieldSlicedTexture.value = this.currSliceRenderTarget.texture;
        this.sliceBlendMaterial.uniforms.u_prevSliceTexture.value = this.prevSliceRenderTarget.texture;

        // 执行切片混合渲染
        this.base.fboHelper.render(this.sliceBlendMaterial, this.currSliceRenderTarget);

        // 恢复渲染状态
        renderer.setRenderTarget(currentTarget);
        this.base.fboHelper.setColorState(colorState);
    }
}
