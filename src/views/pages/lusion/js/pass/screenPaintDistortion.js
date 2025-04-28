/**
 * justThreeJs screenPaintDistortion.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/23 18:09:00
 */

import PostEffect from '@/views/pages/lusion/js/pass/postEffect'
// glsl
import frag$1 from '@/views/pages/lusion/glsl/screenPaintDistortion/frag$1.glsl'

export default class ScreenPaintDistortion extends PostEffect {
    // 外部传入的 screenPaint 对象，必须包含共享的画布纹理
    screenPaint = null;

    // 控制效果强度的参数们
    amount = 20;              // 扭曲强度
    rgbShift = 1;             // RGB 偏移强度
    multiplier = 1.25;        // 整体图像亮度乘子
    colorMultiplier = 1;      // 颜色叠加强度
    shade = 1.25;             // 阴影系数

    renderOrder = 75;         // 渲染顺序

    constructor(base) {
        super(base);
        this.base = base;
    }

    // 初始化函数，接受一个参数对象 e 进行配置
    init(e) {
        Object.assign(this, e);   // 合并参数到当前实例
        super.init();             // 调用父类初始化

        // 必须提供 screenPaint，否则报错
        if (!this.screenPaint) throw new Error("screenPaint is required");

        // 使用 this.base.fboHelper 创建原始着色器材质
        this.material = this.base.fboHelper.createRawShaderMaterial({
            uniforms: Object.assign({
                u_texture: {value: null}, // 主输入纹理（屏幕图像）
                u_screenPaintTexture: this.screenPaint.shaderUniforms.u_currPaintTexture, // 外部传入的画布纹理
                u_screenPaintTexelSize: this.screenPaint.shaderUniforms.u_paintTexelSize, // 画布纹理像素大小
                u_amount: {value: 0},
                u_rgbShift: {value: 0},
                u_multiplier: {value: 0},
                u_colorMultiplier: {value: 0},
                u_shade: {value: 0}
            }, this.base.blueNoise.shaderUniforms), // 添加噪声纹理等共享参数
            fragmentShader: frag$1 // 片元着色器代码（外部定义）
        });
    }

    // 只有当 amount 大于 0 时，才执行渲染
    needsRender(e) {
        return this.amount > 0;
    }

    // 同步相机矩阵，支持动态相机视角
    syncCamera(e) {
        this.needsSync = true;
        if (e) {
            e.matrixWorldInverse.decompose(this._position, this._quaternion, this._scale);
            this.projectionViewMatrix.multiplyMatrices(e.projectionMatrix, e.matrixWorldInverse);
            this.projectionViewInverseMatrix.copy(this.projectionViewMatrix).invert();
        }
        this.prevProjectionViewMatrix.copy(this.projectionViewMatrix);
    }

    // 更新材质中的 uniform 参数并渲染
    render(e, t = false) {
        this.material.uniforms.u_amount.value = this.amount;
        this.material.uniforms.u_rgbShift.value = this.rgbShift;
        this.material.uniforms.u_multiplier.value = this.multiplier;
        this.material.uniforms.u_colorMultiplier.value = this.colorMultiplier;
        this.material.uniforms.u_shade.value = this.shade;

        // 调用父类的渲染方法
        super.render(e, t);
    }
}
