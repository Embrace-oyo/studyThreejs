/**
 * justThreeJs aboutWhoLogo.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/30 09:10:29
 */
/**
 * "关于我们"页面中的Logo动画处理类
 * 负责管理Logo在DOM和WebGL之间的过渡效果
 */

import * as THREE from "three";
import UfxMesh from "@/views/pages/lusion/js/utils/ufxMesh.js";
// glsl
import vert$1 from '@/views/pages/lusion/glsl/about/vert$1.glsl'
import frag$4 from '@/views/pages/lusion/glsl/about/frag$4.glsl'



let _needsSync = !1;
export default class AboutWhoLogo {
    // 3D容器对象
    container = new THREE.Object3D;
    // DOM元素引用
    fromDom;        // 起始DOM元素（原始位置）
    toDom;          // 目标DOM元素（动画目标位置）
    // 网格对象
    mesh;           // 主Logo网格
    toMesh;         // 目标位置网格
    // 尺寸参数
    containerWidth = 0;  // 容器宽度
    // 动画参数
    hideRatio = 0;       // 隐藏比例(0-1)
    constructor(base) {
        this.base = base.base;
        this.aboutPage = base.parent.parent;
    }

    /**
     * 预初始化方法
     * @param {HTMLElement} e - 父容器元素
     */
    preInit(e) {
        // 获取DOM元素引用
        this.fromDom = e.querySelector("#about-who-title-main-logo");
        this.toDom = e.querySelector("#about-who-title-left-2");

        // 将容器添加到页面后处理容器
        this.aboutPage.postUfxContainer.add(this.container);

        // 创建目标位置网格
        this.toMesh = new UfxMesh({refDom: this.toDom}, this.base);

        // 加载Logo几何体
        this.base.properties.loader.add(
            this.base.settings.MODEL_PATH + "about/logo_text.buf",
            {onLoad: this._onGeometryLoad.bind(this)}
        );
    }

    /**
     * 几何体加载完成回调
     * @param {BufferGeometry} e - 加载的几何体
     */
    _onGeometryLoad(e) {
        // 获取目标网格的材质uniforms
        let t = this.toMesh.material.uniforms;

        // 创建主Logo网格
        this.mesh = new UfxMesh({
            refDom: this.fromDom,  // 参考DOM元素
            geometry: e,            // 加载的几何体
            uniforms: {             // 着色器uniforms
                u_showRatio: {value: 1},                // 显示比例
                u_hideRatio: {value: 0},                // 隐藏比例
                u_aspect: {value: 1 / 0.200957},        // 宽高比
                u_toDomXY: t.u_domXY,                   // 目标位置XY坐标
                u_toDomWH: t.u_domWH,                   // 目标位置宽高
                u_toDomPivot: t.u_domPivot,             // 目标位置中心点
                u_time: this.base.properties.shaderUniforms.u_time // 共享时间uniform
            },
            vertexShader: vert$1,  // 顶点着色器
            fragmentShader: frag$4  // 片段着色器
        }, this.base);

        // 将网格添加到容器
        this.container.add(this.mesh);
    }

    /**
     * 初始化方法 (空实现)
     */
    init() {
    }

    /**
     * 响应视口大小变化
     * @param {number} e - 宽度
     * @param {number} t - 高度
     */
    resize(e, t) {
        _needsSync = true;  // 标记需要同步DOM和WebGL状态
    }

    /**
     * 更新Logo状态
     * @param {number} e - 时间增量
     * @param {number} t - X轴位置偏移
     * @param {number} r - 时间参数
     * @param {number} n - X轴偏移修正值1
     * @param {number} a - X轴偏移修正值2
     */
    update(e, t, r, n, a) {
        if (this.mesh) {
            // 需要同步时更新DOM和WebGL状态
            if (_needsSync) {
                _needsSync = false;
                this.mesh.syncDom(r, t - n);
                this.toMesh.syncDom(r, t - a);
            }

            // 计算显示比例
            this.mesh.material.uniforms.u_showRatio.value =
                this.base.math.fit(this.aboutPage.time, 0.5, 1.5, 0, 1);

            // 移动端和桌面端不同处理
            if (this.base.properties.useMobileLayout) {
                // 移动端：显示比例受隐藏比例影响
                this.mesh.material.uniforms.u_showRatio.value *= 1 - this.hideRatio;
                this.mesh.material.uniforms.u_hideRatio.value = 0;
            } else {
                // 桌面端：直接设置隐藏比例
                this.mesh.material.uniforms.u_hideRatio.value = this.hideRatio;
            }

            // 更新网格状态
            this.mesh.update(r, t);
            this.toMesh.update(r, t);
        }
    }
}
