/**
 * justThreeJs aboutPageHeroEfx.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/24 11:13:55
 */
import * as THREE from "three";
import PostEffect from '@/views/pages/lusion/js/pass/postEffect'
// glsl
import fragmentShader$1 from '@/views/pages/lusion/glsl/aboutPageHeroEfx/fragmentShader$1.glsl'

// 场景颜色定义 (Color Burn 和 Color Dodge 模式)
let _sceneColorBurn = new THREE.Color("#00f0ff");       // 青蓝色
let _sceneColorDodge = new THREE.Color("#005aff");      // 深蓝色
let _sceneColorBurnAlpha = 0.15;                 // 场景Color Burn透明度
let _sceneColorDodgeAlpha = 0.12;                // 场景Color Dodge透明度

// HUD(平视显示器)颜色定义
let _hudColorBurn = new THREE.Color("#79a8ff");        // 浅蓝色
let _hudColorDodge = new THREE.Color("#a5ff44");       // 亮绿色
let _hudColorBurnAlpha = 1;                      // HUD Color Burn透明度
let _hudColorDodgeAlpha = 0.7;                   // HUD Color Dodge透明度
export default class AboutPageHeroEfx extends PostEffect {
    // 类属性
    colorBurn = new THREE.Color("#000");       // 当前Color Burn颜色
    colorDodge = new THREE.Color("#000");      // 当前Color Dodge颜色
    hudRatio = 1;                        // HUD混合比例(0-1)
    isActive = true;                     // 是否激活效果
    renderOrder = 20;                    // 渲染顺序
    randSimplex1Ds = [];                 // 随机噪声数组
    constructor(base) {
        super(base);
        this.base = base;
    }
    /**
     * 初始化方法
     * @param {Object} e 配置参数
     */
    init(e) {
        // 合并配置参数
        Object.assign(this, e);

        // 调用父类初始化
        super.init();

        // 创建着色器材质
        this.material = this.base.fboHelper.createRawShaderMaterial({
            uniforms: {
                u_texture: {value: null},            // 输入纹理
                u_colorBurn: {value: this.colorBurn}, // Color Burn颜色
                u_colorBurnAlpha: {value: 1},        // Color Burn透明度
                u_colorDodge: {value: this.colorDodge}, // Color Dodge颜色
                u_colorDodgeAlpha: {value: 1}        // Color Dodge透明度
            },
            fragmentShader: fragmentShader$1          // 片段着色器
        });
    }

    /**
     * 判断是否需要渲染
     * @return {boolean} 是否激活
     */
    needsRender() {
        return this.isActive;
    }

    /**
     * 渲染方法
     * @param {Object} e 渲染参数对象
     * @param {boolean} t 是否强制渲染(默认false)
     */
    render(e, t = false) {
        let r = this.material.uniforms;

        // 根据hudRatio混合场景和HUD颜色
        this.colorBurn.copy(_sceneColorBurn).lerp(_hudColorBurn, this.hudRatio);
        this.colorDodge.copy(_sceneColorDodge).lerp(_hudColorDodge, this.hudRatio);

        // 计算混合后的透明度(使用二次曲线过渡)
        r.u_colorBurnAlpha.value = this.base.math.mix(
            _sceneColorBurnAlpha,
            _hudColorBurnAlpha,
            this.hudRatio * this.hudRatio
        );

        r.u_colorDodgeAlpha.value = this.base.math.mix(
            _sceneColorDodgeAlpha,
            _hudColorDodgeAlpha,
            this.hudRatio * this.hudRatio
        );

        // 调用父类渲染
        super.render(e, t);
    }
}
