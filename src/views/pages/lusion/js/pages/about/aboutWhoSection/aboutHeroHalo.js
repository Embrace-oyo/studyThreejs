/**
 * justThreeJs aboutHeroHalo.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/29 17:28:33
 */
import * as THREE from "three";
// glsl
import vert$4 from '@/views/pages/lusion/glsl/about/vert$4.glsl'
import frag$7 from '@/views/pages/lusion/glsl/about/frag$7.glsl'

function filePath(path) {
    return new URL(`../../../../assets/${path}`, import.meta.url).href
}


export default class AboutHeroHalo {
    // 3D容器对象
    container = new THREE.Object3D;
    // 网格对象
    mesh = null;
    constructor(base) {
        this.parent = base;
        this.base = base.base;
    }

    // 预初始化方法 - 加载背景盒子几何体
    preInit() {
        this.base.properties.loader.add(
            filePath("buf/bg_box.buf"),
            {
                onLoad: this._onGeometryLoad.bind(this) // 几何体加载完成回调
            }
        );
    }

    // 几何体加载完成回调
    _onGeometryLoad(geometry) {
        // 创建着色器材质，合并多个uniform变量
        const material = new THREE.ShaderMaterial({
            uniforms: Object.assign(
                { u_resolution: this.base.properties.shaderUniforms.u_resolution }, // 基础分辨率
                this.parent.light.shaderUniforms,          // 光照相关uniforms
                this.base.blueNoise.shaderUniforms,     // 蓝噪声uniforms
                this.parent.aboutHeroScatter.shaderUniforms, // 散射效果uniforms
                this.parent.shaderUniforms       // 主英雄效果uniforms
            ),
            vertexShader: vert$4,  // 顶点着色器
            fragmentShader: frag$7  // 片段着色器
        });

        // 创建网格对象
        this.mesh = new THREE.Mesh(geometry, material);

        // 设置渲染顺序(确保在适当阶段渲染)
        this.mesh.renderOrder = 10;

        // 将网格添加到容器
        this.container.add(this.mesh);
    }

    // 初始化方法(空实现，可扩展)
    init() {
        // 预留初始化逻辑
    }

    // 调整大小方法(空实现，可扩展)
    resize(width, height) {
        // 预留响应式调整逻辑
    }

    // 更新方法(空实现，可扩展)
    update(deltaTime) {
        // 预留动画更新逻辑
    }
}
