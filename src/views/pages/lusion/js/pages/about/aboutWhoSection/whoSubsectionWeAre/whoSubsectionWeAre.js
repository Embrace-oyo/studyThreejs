/**
 * justThreeJs whoSubsectionWeAre.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/30 09:01:27
 */
import {easeOutCubic, easeInOutCubic} from 'easing-utils';
import AboutWhoLogo from '@/views/pages/lusion/js/pages/about/aboutWhoSection/whoSubsectionWeAre/aboutWhoLogo'

/**
 * "我们是谁"子版块类，负责处理相关DOM元素的动画和布局
 */
export default class WhoSubsectionWeAre {
    // DOM元素引用
    domContainer;       // 主容器元素
    domScroll;         // 滚动标题元素
    domLeftTexts;       // 左侧文本元素集合
    logoHideRatio = 0;  // logo隐藏比例(0-1)
    constructor(base) {
        this.parent = base;
        this.base = base.base;
        this.aboutWhoLogo = new AboutWhoLogo(this);
    }

    /**
     * 预初始化方法，获取DOM元素引用
     * @param {HTMLElement} e - 父容器元素
     */
    preInit(e) {
        this.domContainer = e.querySelector("#about-who-subsection-we-are");
        this.domScroll = e.querySelector("#about-who-title-main-scroll");
        this.domLeftTexts = e.querySelectorAll(
            "#about-who-title-left-1, #about-who-title-left-2 svg, " +
            "#about-who-title-left-3, #about-who-title-left-4 span"
        );
        this.domRightTexts = e.querySelectorAll(".about-who-title-right-text");
        this.aboutWhoLogo.preInit(e);  // 初始化logo
    }

    /**
     * 初始化方法
     */
    init() {
        this.aboutWhoLogo.init();
    }

    /**
     * 显示方法 (空实现)
     */
    show() {
    }

    /**
     * 隐藏方法 (空实现)
     */
    hide() {
    }

    /**
     * 响应视口大小变化
     * @param {number} e - 宽度
     * @param {number} t - 高度
     */
    resize(e, t) {
        // 计算偏移单位尺寸(不小于60px，且为视口宽度的8%)
        this.offsetUnitSize = Math.max(60, this.base.properties.viewportWidth * 0.08);
        this.aboutWhoLogo.resize(e, t);
    }

    /**
     * 更新动画状态
     * @param {number} e - 时间增量
     * @param {boolean} t - 是否可见
     * @param {number} r - 滚动比例
     * @param {number} n - 未使用参数
     * @param {number} a - 垂直滚动像素值
     */
    update(e, t, r, n, a) {
        // 设置容器可见性
        this.domContainer.style.visibility = t ? "visible" : "hidden";
        this.domContainer.style.opacity = t ? 1 : 0;
        this.aboutWhoLogo.container.visible = t;

        if (t) {
            // 移动端布局处理
            let l = this.base.properties.useMobileLayout ? this.base.properties.viewportWidth * -r : 0;
            this.domContainer.style.transform = "translate3d(" + l + "px, 0, 0)";

            // 根据hero区域比例计算logo隐藏比例
            let c = this.parent.aboutHero.introRatio < 0.05;
            this.logoHideRatio = this.base.math.saturate(this.logoHideRatio + e * (c ? -1 : 1));

            let u = this.offsetUnitSize;
            this.aboutWhoLogo._pageScrollOffsetXRatio = 0;

            // 处理左侧文本动画
            for (let p = 0; p < this.domLeftTexts.length; p++) {
                let g = this.domLeftTexts[p];
                // 计算每个元素的位置比例
                let _ = (!this.base.properties.useMobileLayout && p == 5 ? 4 : p) /
                    (this.domLeftTexts.length - 1);
                // 计算透明度变化
                let T = this.base.math.fit(this.logoHideRatio, _ * 0.2, _ * 0.2 + 0.8, 0, 1);
                // 计算水平偏移
                let M = this.base.math.fit(r, 0, _ * 0.5 + 0.3, 0, -10, easeOutCubic);

                g._pageScrollOffsetXRatio = M;

                // 特殊处理移动端或特定元素
                if (this.base.properties.useMobileLayout || p != 1) {
                    T = this.base.math.fit(T, 0.35, 1, 0, 1, easeOutCubic);
                    g.style.opacity = T;
                    g.style.transform = "translate3d(" + ((1 - T) * 1 + M) * u + "px, 0, 0)";

                    // 特殊处理第二个元素
                    if (p == 1) {
                        this.aboutWhoLogo.hideRatio = this.logoHideRatio;
                    }
                } else {
                    this.aboutWhoLogo.hideRatio = T;
                    this.aboutWhoLogo._pageScrollOffsetXRatio = M;
                }
            }

            // 处理右侧文本动画
            for (let p = 0; p < this.domRightTexts.length; p++) {
                let g = this.domRightTexts[p];
                let v = p / (this.domRightTexts.length - 1);
                let _ = this.base.math.fit(this.logoHideRatio, 0.5 + v * 0.1, v * 0.1 + 0.9, 0, 1, easeOutCubic);
                let T = this.base.math.fit(r, 0.35, v * 0.5 + 1.35, 0, -5, easeOutCubic);

                g.style.opacity = _;
                g.style.transform = "translate3d(" + ((1 - _) * 1 + T) * u + "px, 0, 0)";
            }

            // 处理滚动标题动画
            let f = this.base.math.fit(this.logoHideRatio, 0, 0.35, 1, 0, easeInOutCubic);
            this.domScroll.style.opacity = f;

            // 移动端和桌面端不同布局处理
            if (this.base.properties.useMobileLayout) {
                this.domScroll.style.transform = "translate3d(50%, " + (1 - f) * 120 + "%, 0)";
            } else {
                this.domScroll.style.transform = "translate3d(0, " + (1 - f) * 120 + "%, 0)";
            }

            // 更新logo位置
            this.aboutWhoLogo.update(
                e,
                -r * this.base.properties.viewportWidth + this.aboutWhoLogo._pageScrollOffsetXRatio * u,
                -this.base.scrollManager.scrollPixel + a,
                this.aboutWhoLogo._pageScrollOffsetXRatio * u,
                this.domLeftTexts[1]._pageScrollOffsetXRatio * u
            );
        }
    }
}
