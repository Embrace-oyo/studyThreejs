/**
 * justThreeJs smaa.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/23 17:28:30
 */

import * as THREE from "three";
import PostEffect from '@/views/pages/lusion/js/pass/postEffect'
// glsl
import smaaBlendFrag from '@/views/pages/lusion/glsl/smaa/smaaBlendFrag.glsl'
import smaaBlendVert from '@/views/pages/lusion/glsl/smaa/smaaBlendVert.glsl'
import smaaEdgesFrag from '@/views/pages/lusion/glsl/smaa/smaaEdgesFrag.glsl'
import smaaEdgesVert from '@/views/pages/lusion/glsl/smaa/smaaEdgesVert.glsl'
import smaaWeightsFrag from '@/views/pages/lusion/glsl/smaa/smaaWeightsFrag.glsl'
import smaaWeightsVert from '@/views/pages/lusion/glsl/smaa/smaaWeightsVert.glsl'

export default /**
 * SMAA (Enhanced Subpixel Morphological Antialiasing) 抗锯齿效果
 * 继承自PostEffect基类，实现三阶段SMAA抗锯齿处理
 */
class Smaa extends PostEffect {
    // 渲染目标
    edgesRenderTarget = null;    // 边缘检测阶段渲染目标
    weightsRenderTarget = null;  // 权重计算阶段渲染目标

    // 材质
    edgesMaterial = null;   // 边缘检测材质
    weightsMaterial = null; // 权重计算材质

    // 渲染顺序(确保最后执行)
    renderOrder = 500;

    constructor(base) {
        super(base);
        this.base = base;
    }

    /**
     * 初始化SMAA效果
     * @param {Object} config 配置参数
     */
    init(config) {
        // 合并配置参数
        Object.assign(this, {
            shaderUniforms: {
                u_areaTexture: {value: null},   // 区域纹理(用于权重计算)
                u_searchTexture: {value: null}  // 搜索纹理(用于边缘搜索)
            }
        }, config);

        // 调用父类初始化
        super.init();

        // 创建渲染目标(初始尺寸1x1，后续会调整)
        this.weightsRenderTarget = this.base.fboHelper.createRenderTarget(1, 1);
        this.edgesRenderTarget = this.base.fboHelper.createRenderTarget(1, 1);

        // 创建边缘检测材质
        this.edgesMaterial = this.base.fboHelper.createRawShaderMaterial({
            uniforms: {
                u_texture: {value: null},  // 输入纹理
                u_texelSize: null            // 像素尺寸(后续设置)
            },
            vertexShader: smaaEdgesVert,   // 边缘检测顶点着色器
            fragmentShader: smaaEdgesFrag,  // 边缘检测片段着色器
            defines: {
                SMAA_THRESHOLD: "0.1"        // 边缘检测阈值
            },
            blending: THREE.NoBlending,           // 禁用混合
            depthTest: false,               // 禁用深度测试
            depthWrite: false               // 禁用深度写入
        });

        // 创建权重计算材质
        this.weightsMaterial = this.base.fboHelper.createRawShaderMaterial({
            uniforms: {
                u_edgesTexture: {value: this.edgesRenderTarget.texture}, // 边缘纹理
                u_areaTexture: this.shaderUniforms.u_areaTexture,          // 区域纹理
                u_searchTexture: this.shaderUniforms.u_searchTexture,      // 搜索纹理
                u_texelSize: null                                          // 像素尺寸
            },
            vertexShader: smaaWeightsVert,  // 权重计算顶点着色器
            fragmentShader: smaaWeightsFrag, // 权重计算片段着色器
            defines: {
                SMAA_MAX_SEARCH_STEPS: "8",                // 最大搜索步数
                SMAA_AREATEX_MAX_DISTANCE: "16",           // 区域纹理最大距离
                SMAA_AREATEX_PIXEL_SIZE: "( 1.0 / vec2( 160.0, 560.0 ))", // 区域纹理像素尺寸
                SMAA_AREATEX_SUBTEX_SIZE: "( 1.0 / 7.0 )"  // 子纹理尺寸
            },
            transparent: true,              // 启用透明
            blending: THREE.NoBlending,           // 禁用混合
            depthTest: false,               // 禁用深度测试
            depthWrite: false               // 禁用深度写入
        });

        // 创建最终混合材质
        this.material = this.base.fboHelper.createRawShaderMaterial({
            uniforms: {
                u_texture: {value: null},                   // 原始纹理
                u_weightsTexture: {value: this.weightsRenderTarget.texture}, // 权重纹理
                u_texelSize: null                             // 像素尺寸
            },
            vertexShader: smaaBlendVert,    // 混合顶点着色器
            fragmentShader: smaaBlendFrag    // 混合片段着色器
        });
    }

    /**
     * 设置SMAA所需纹理
     * @param {Image} areaImage 区域纹理图像
     * @param {Image} searchImage 搜索纹理图像
     */
    setTextures(areaImage, searchImage) {
        // 创建并配置区域纹理
        const areaTexture = this.shaderUniforms.u_areaTexture.value = this._createTexture(areaImage);
        areaTexture.minFilter = THREE.LinearFilter;  // 线性过滤

        // 创建并配置搜索纹理
        const searchTexture = this.shaderUniforms.u_searchTexture.value = this._createTexture(searchImage);
        searchTexture.magFilter = THREE.NearestFilter; // 最近邻过滤
        searchTexture.minFilter = THREE.NearestFilter;
    }

    /**
     * 更新纹理状态
     */
    updateTextures() {
        this.shaderUniforms.u_areaTexture.value.needsUpdate = true;
        this.shaderUniforms.u_searchTexture.value.needsUpdate = true;
    }

    /**
     * 设置后期处理参数
     * @param {Object} config 包含width和height的配置对象
     */
    setPostprocessing(config) {
        super.setPostprocessing(config);

        // 调整渲染目标尺寸
        const {width, height} = config;
        this.edgesRenderTarget.setSize(width, height);
        this.weightsRenderTarget.setSize(width, height);
    }

    /**
     * 释放资源
     */
    dispose() {
        // 释放渲染目标
        this.edgesRenderTarget?.dispose();
        this.weightsRenderTarget?.dispose();
    }

    /**
     * 判断是否需要渲染
     * @return {boolean} 是否启用且纹理已加载
     */
    needsRender() {
        return this.enabled && !this.shaderUniforms.u_areaTexture.value.needsUpdate && this.base.properties.isSmaaEnabled;
    }

    /**
     * 执行SMAA渲染
     * @param {Object} renderParams 渲染参数
     * @param {boolean} toScreen 是否渲染到屏幕
     */
    render(renderParams, toScreen) {
        // 保存当前颜色状态
        const colorState = this.base.fboHelper.getColorState();

        // 检查纹理是否设置
        if (!this.shaderUniforms.u_searchTexture.value) {
            console.warn("需要调用Smaa.setImages()手动设置SMAA纹理");
        }

        // 获取渲染器并设置清除状态
        const renderer = this.base.fboHelper.renderer;
        if (renderer) {
            renderer.autoClear = true;
            renderer.setClearColor(0, 0); // 透明黑色
        }

        // 设置所有材质的像素尺寸
        const texelSize = renderParams.shaderUniforms.u_texelSize;
        this.edgesMaterial.uniforms.u_texelSize = this.weightsMaterial.uniforms.u_texelSize = this.material.uniforms.u_texelSize = texelSize;

        // 第一阶段: 边缘检测
        this.edgesMaterial.uniforms.u_texture.value = renderParams.fromTexture;
        renderParams.renderMaterial(this.edgesMaterial, this.edgesRenderTarget);

        // 第二阶段: 权重计算
        renderParams.renderMaterial(this.weightsMaterial, this.weightsRenderTarget);

        // 恢复颜色状态
        this.base.fboHelper.setColorState(colorState);

        // 第三阶段: 最终混合
        this.material.uniforms.u_texture.value = renderParams.fromTexture;
        super.render(renderParams, toScreen);
    }

    /**
     * 创建纹理私有方法
     * @param {Image} image 图像源
     * @return {Texture} 创建的纹理
     */
    _createTexture(image) {
        const texture = new THREE.Texture(image);
        texture.generateMipmaps = false; // 禁用mipmap生成
        texture.flipY = false;           // 禁用Y轴翻转
        return texture;
    }
}
