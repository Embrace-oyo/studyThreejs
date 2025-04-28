/**
 * justThreeJs fina.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/23 18:16:23
 */

import * as THREE from "three";
import PostEffect from '@/views/pages/lusion/js/pass/postEffect'
//glsl
import fragmentShader from '@/views/pages/lusion/glsl/final/fragmentShader.glsl'

export default class FinalPass extends PostEffect {
    // 暗角起始/结束范围
    vignetteFrom = 0.6;
    vignetteTo = 1.6;

    // 暗角形状与屏幕纵横比调整
    vignetteAspect = new THREE.Vector2();

    // 暗角颜色
    vignetteColor = new THREE.Color();

    // 调色参数
    saturation = 1;      // 饱和度（1 为原始）
    contrast = 0;        // 对比度增量
    brightness = 1;      // 亮度（1 为原始）

    // 色调叠加
    tintColor = new THREE.Color();    // 叠加颜色
    tintOpacity = 1;           // 色调透明度

    // 背景颜色
    bgColor = new THREE.Color();

    // 全体透明度
    opacity = 1;

    // 是否启用该效果
    isActive = false;

    // 渲染顺序（越小越早）
    renderOrder = 30;

    constructor(base) {
        super(base);
        this.base = base;
    }

    // 初始化函数，传入配置项
    init(e) {
        Object.assign(this, e);   // 合并外部传入属性
        super.init();             // 调用父类初始化
        this.material = this.base.fboHelper.createRawShaderMaterial({
            uniforms: {
                u_texture: {value: null}, // 主纹理（来自上一个 pass）
                u_vignetteFrom: {value: 0},
                u_vignetteTo: {value: 0},
                u_vignetteAspect: {value: this.vignetteAspect},
                u_vignetteColor: {value: this.vignetteColor},
                u_saturation: {value: 0},
                u_contrast: {value: 0},
                u_brightness: {value: 0},
                u_tintColor: {value: this.tintColor},
                u_tintOpacity: {value: 0},
                u_bgColor: {value: this.bgColor},
                u_opacity: {value: 0},
                u_ditherSeed: {value: 0} // 抖动用随机种子
            },
            fragmentShader // 着色器源码（需外部提供）
        });
    }

    // 是否需要执行渲染（取决于 isActive）
    needsRender() {
        return this.isActive;
    }

    // 渲染函数：更新 uniform 并调用父类渲染
    render(e, t = false) {
        const r = e.width;
        const n = e.height;
        let a = this.material.uniforms;

        // 设置暗角范围
        a.u_vignetteFrom.value = this.vignetteFrom;
        a.u_vignetteTo.value = this.vignetteTo;

        // 动态计算 vignetteAspect，使其适应屏幕纵横比
        const l = n / Math.sqrt(r * r + n * n);  // 正规化半径计算
        this.vignetteAspect.set((r / n) * l, l);

        // 更新调色参数
        a.u_saturation.value = this.saturation - 1;
        a.u_contrast.value = this.contrast;
        a.u_brightness.value = this.brightness - 1;

        // 更新色调叠加、不透明度和抖动种子
        a.u_tintOpacity.value = this.tintOpacity;
        a.u_opacity.value = this.opacity;
        a.u_ditherSeed.value = Math.random() * 1000;

        // 调用父类渲染逻辑（会传入 renderTarget）
        super.render(e, t);
    }
}
