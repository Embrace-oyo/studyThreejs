/**
 * justThreeJs blur.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/23 17:20:18
 */
import * as THREE from "three";
// glsl
import blur9VaryingVertexShader from '@/views/pages/lusion/glsl/blur/blur9VaryingVertexShader.glsl'
import blur9VaryingFragmentShader from '@/views/pages/lusion/glsl/blur/blur9VaryingFragmentShader.glsl'
import blur9FragmentShader from '@/views/pages/lusion/glsl/blur/blur9FragmentShader.glsl'
export default /**
 * 高斯模糊处理类
 * 提供9-tap高斯模糊算法实现，支持可变半径模糊效果
 */
class Blur {
    // 材质缓存
    material = null;
    blur9Material = null;  // 9-tap模糊专用材质
    constructor(base) {
        this.base = base;
    }
    /**
     * 获取或创建9-tap模糊材质
     * @return {ShaderMaterial} 模糊材质实例
     */
    getBlur9Material() {
        // 检测设备是否支持超过8个varying变量
        let supportHighPrecision = this.base.fboHelper.MAX_VARYING_VECTORS > 8;

        if (!this.blur9Material) {
            this.blur9Material = this.base.fboHelper.createRawShaderMaterial({
                uniforms: {
                    u_texture: {value: null},      // 输入纹理
                    u_delta: {value: new THREE.Vector2}  // 模糊步长
                },
                // 根据设备能力选择着色器版本
                vertexShader: supportHighPrecision
                    ? this.base.fboHelper.precisionPrefix + blur9VaryingVertexShader
                    : this.base.fboHelper.vertexShader,
                fragmentShader: this.base.fboHelper.precisionPrefix +
                    (supportHighPrecision
                        ? blur9VaryingFragmentShader
                        : blur9FragmentShader),
                // 禁用深度测试/写入
                depthWrite: false,
                depthTest: false
            });
        }
        return this.blur9Material;
    }

    /**
     * 执行高斯模糊处理
     * @param {number} e - 模糊半径（像素单位）
     * @param {number} t - 模糊比例（0-1）
     * @param {WebGLRenderTarget} r - 源渲染目标
     * @param {WebGLRenderTarget} n - 中间渲染目标
     * @param {WebGLRenderTarget} [a] - 输出目标（默认使用源目标）
     * @param {boolean} [l] - 是否强制尺寸匹配
     */
    blur(e, t, r, n, a, l) {
        const qualityFactor = 0.25;  // 质量系数（可调整）

        // 计算实际模糊尺寸
        let targetWidth = Math.ceil(r.width * t) || 0,
            targetHeight = Math.ceil(r.height * t) || 0;

        // 懒初始化材质
        this.material || (this.material = this.getBlur9Material());

        // 验证参数
        if (!n) console.warn("You have to pass intermediateRenderTarget to blur");

        // 调整渲染目标尺寸
        if (targetWidth !== n.width || targetHeight !== n.height) {
            n.setSize(targetWidth, targetHeight);
        }

        // 处理输出目标
        a ? (l || a.setSize(r.width, r.height)) : a = r;

        // 水平模糊 pass
        this.material.uniforms.u_texture.value = r.texture || r;
        this.material.uniforms.u_delta.value.set(e / targetWidth * qualityFactor, 0);
        this.base.fboHelper.render(this.material, n);

        // 垂直模糊 pass
        this.material.uniforms.u_texture.value = n.texture || n;
        this.material.uniforms.u_delta.value.set(0, e / targetHeight * qualityFactor);
        this.base.fboHelper.render(this.material, a);
    }
}
