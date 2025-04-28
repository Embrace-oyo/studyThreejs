/**
 * justThreeJs about.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/25 15:09:39
 */
import * as THREE from "three";
import {easeInOutCubic} from 'easing-utils';

let _c = new THREE.Color;

export default class About {
    preUfxContainer = new THREE.Object3D;
    postUfxContainer = new THREE.Object3D;

    constructor(base) {
        this.base = base;
        this.endVisualColor = this.base.properties.offWhiteColorHex;
        this.base.app.preUfx.scene.add(this.preUfxContainer);
        this.base.app.postUfx.scene.add(this.postUfxContainer);
        this.preUfxContainer.visible = true;
        this.postUfxContainer.visible = true;
        this.base.taskManager.add(this.preUfxContainer)
        this.base.taskManager.add(this.postUfxContainer)
        this.base.scrollManager.scrollToPixel(0, true);
        this.aboutWhoSection = new AboutWhoSection(this.base);
    }

    preInit() {
        this.aboutWhoSection.preInit(document)
    }

    init() {
        this.aboutWhoSection.init()
    }

    resize(w, h) {
        this.aboutWhoSection.resize(w, h)
    }

    update(e) {
        let t = !1
        let r = !0
        let n = !1;
        this.base.properties.bgColor.setStyle(this.base.properties.blackColorHex);
        let a = {
            screenRatio: -1
        };
        this.base.properties.bgColor.lerp(_c.setStyle(this.base.properties.blueColorHex), this.base.math.fit(a.screenRatio, -1, -.5, 0, 1))
        a.screenRatio > -.75 ? (n = !0, r = !1) : (n = !1, r = !0)
        document.documentElement.classList.toggle("is-black-bg", r)
        document.documentElement.classList.toggle("is-white-bg", t)
        document.documentElement.classList.toggle("is-blue-bg", n)

        this.aboutWhoSection.update(e);
    }
}

class AboutWhoSection {
    // 主 DOM 元素容器
    domContainer;
    domSubsectionContainer;
    domCrosses;

    // 当前激活的人脸 ID（用于 aboutHero）
    activeFaceId = -1;

    // 页面滚动比例（范围 0 ~ 3）
    scrollRatio = 0;

    // 子容器在 Y/X 轴的偏移（用于 transform）
    subsectionContainerOffsetY = 0;
    subsectionContainerOffsetX = 0;

    // 各滚动阶段持续时间（单位：viewport）
    RANGE_START_WAIT = 3.5;
    RANGE_PAGE_12 = 1.75;
    RANGE_PAGE_23 = 1.75;
    RANGE_PAGE_34 = 1.75;
    RANGE_END_WAIT = 2.5;

    // 每页转换的滚动比例（可理解为页宽比例）
    PAGE_DISTANCE = 1.25;

    // 滚动阈值数组（桌面 & 移动）
    THRESHOLDS = [];
    MOBILE_THRESHOLDS = [];
    isFirstRoute = !0;

    constructor(base) {
        this.base = base;
        this.aboutHero = base.aboutHero;
    }

    /**
     * 初始化结构与滚动阈值
     */
    preInit(e) {
        this.domContainer = e.querySelector("#about-who");
        this.domSubsectionContainer = e.querySelector("#about-who-subsection-container");
        this.domCrosses = e.querySelector("#about-crosses");

        let t = 0;
        let r = 0;

        // 桌面端滚动阈值
        this.THRESHOLDS.push(t += this.RANGE_START_WAIT);
        this.THRESHOLDS.push(t += this.RANGE_PAGE_12);
        this.THRESHOLDS.push(t += this.RANGE_PAGE_23);
        let desktopTotal = t;
        this.THRESHOLDS.push(t += this.RANGE_END_WAIT);

        // 移动端滚动阈值
        this.MOBILE_THRESHOLDS.push(...this.THRESHOLDS.slice(0, 3));
        this.MOBILE_THRESHOLDS.push(r += this.RANGE_PAGE_34);
        this.MOBILE_THRESHOLDS.push(r += this.RANGE_END_WAIT);

        // 子模块初始化
        // whoSubsectionWeAre.preInit(e);
        // whoSubsectionDetails.preInit(e);
        // whoSubsectionTeam.preInit(e);
        this.aboutHero.preInit();
        // 注册到 3D 场景列表中
        this.base.visuals.stage3DList.push(this.aboutHero);
    }

    /**
     * 模块初始化
     */
    init() {
        // whoSubsectionWeAre.init();
        // whoSubsectionDetails.init();
        // whoSubsectionTeam.init();
        this.aboutHero.init();
    }

    /**
     * 视图大小变化时的处理
     */
    resize(width, height) {
        this.syncSubsectionContainerTransform();
        // whoSubsectionWeAre.resize(width, height);
        // whoSubsectionDetails.resize(width, height);
        // whoSubsectionTeam.resize(width, height);
        this.aboutHero.resize(this.base.properties.width, this.base.properties.height);
    }

    /**
     * 页面显示触发
     */
    show() {
        // aboutWhoLogo.hideRatio = 0;
        // whoSubsectionTeam.onPageShow();
    }

    /**
     * 获取滚动位移比率（相对容器）
     */
    getMoveRatio() {
        const range = this.base.scrollManager.getDomRange(this.domContainer);
        const base = this.base.properties.useMobileLayout ? this.base.properties.viewportHeight : this.base.properties.viewportWidth;
        return -range.screenY / base;
    }

    /**
     * 获取当前滚动位置对应的滚动比值（范围 0 ~ 3）
     */
    getScrollRatio() {
        const thresholds = this.base.properties.useMobileLayout ? this.MOBILE_THRESHOLDS : this.THRESHOLDS;
        const t = this.getMoveRatio();
        let r = 0;

        if (t < thresholds[0]) {
            r = 0;
        } else if (t < thresholds[1]) {
            r = this.base.math.fit(t, thresholds[0], thresholds[1], 0, 1, easeInOutCubic);
        } else if (this.base.properties.useMobileLayout) {
            if (t < thresholds[2]) {
                r = this.base.math.fit(t, thresholds[1], thresholds[2], 1, 2, easeInOutCubic);
            } else {
                r = this.base.math.fit(t, thresholds[2], thresholds[3], 2, 3, easeInOutCubic);
            }
        } else {
            r = this.base.math.fit(t, thresholds[1], thresholds[2], 1, 2, easeInOutCubic);
        }

        this.scrollRatio = r;
        return r;
    }

    /**
     * 根据滚动位置同步 DOM transform
     */
    syncSubsectionContainerTransform() {
        const thresholds = this.base.properties.useMobileLayout ? this.MOBILE_THRESHOLDS : this.THRESHOLDS;
        const size = this.base.properties.useMobileLayout ? this.base.properties.viewportHeight : this.base.properties.viewportWidth;
        this.scrollableSize = thresholds[thresholds.length - 1] * size;

        const range = this.base.scrollManager.getDomRange(this.domContainer);
        const moveRatio = this.getScrollRatio() * this.PAGE_DISTANCE;

        this.subsectionContainerOffsetY = this.base.math.fit(range.screenY, 0, -this.scrollableSize, 0, this.scrollableSize);
        this.subsectionContainerOffsetX = this.base.properties.useMobileLayout ? 0 : moveRatio * -this.base.properties.viewportWidth;

        this.domSubsectionContainer.style.transform = `translate3d(${this.subsectionContainerOffsetX}px, ${this.subsectionContainerOffsetY}px, 0)`;
        this.domCrosses.style.transform = `translate3d(${-this.subsectionContainerOffsetX}px, 0, 0)`;

        if (!range.isActive) this.aboutHero.isActive = false;
    }

    /**
     * 每帧更新（由主更新循环调用）
     */
    update(time) {
        const thresholds = this.base.properties.useMobileLayout ? this.MOBILE_THRESHOLDS : this.THRESHOLDS;
        const baseSize = this.base.properties.useMobileLayout ? this.base.properties.viewportHeight : this.base.properties.viewportWidth;
        this.scrollableSize = thresholds[thresholds.length - 1] * baseSize;
        const range = this.base.scrollManager.getDomRange(this.domContainer);
        const isActive = range.isActive;

        // 同步 DOM transform
        this.syncSubsectionContainerTransform();

        // 团队页面预处理
        // whoSubsectionTeam.preUpdate();

        if (isActive) {
            const moveRatio = this.getScrollRatio() * this.PAGE_DISTANCE;
            const moveNorm = this.getMoveRatio();

            // aboutHero 参数更新
            this.aboutHero.initialSplineRatio = this.base.math.fit(moveNorm, 0, thresholds[1], 0, 1);
            this.aboutHero.hudRatio = this.base.math.fit(moveNorm, thresholds[1], thresholds[1] + this.RANGE_PAGE_23 * 0.5, 0, 1);
            this.aboutHero.outSectionRatio = this.base.math.fit(moveNorm / thresholds[3], 0.9, 1, 0, 1);

            this.aboutHero.properties.cameraViewportOffsetX = 0;
            this.aboutHero.properties.cameraViewportOffsetY = 0;
            this.aboutHero.scrollYRatio = 0;
            this.aboutHero.faceShowRatio = 0;

            if (moveRatio < this.PAGE_DISTANCE) {
                this.aboutHero.introRatio = moveNorm / (this.RANGE_START_WAIT + this.RANGE_PAGE_12);
                // whoSubsectionWeAre.update(time, true, moveRatio, moveNorm, this.subsectionContainerOffsetY);
            } else {
                this.aboutHero.introRatio = 1;
                // whoSubsectionWeAre.update(time, false, moveRatio, moveNorm, this.subsectionContainerOffsetY);
            }

            if (moveRatio > 0 && moveRatio < this.PAGE_DISTANCE * 2) {
                // whoSubsectionDetails.update(time, true, moveRatio - this.PAGE_DISTANCE, this.subsectionContainerOffsetY);
            } else {
                // whoSubsectionDetails.update(time, false, moveRatio - this.PAGE_DISTANCE, this.subsectionContainerOffsetY);
            }

            // Panning spline
            this.aboutHero.panningSplineRaito = this.base.properties.useMobileLayout ? this.base.math.fit(moveNorm, thresholds[2], thresholds[4], 0, 1) : this.base.math.fit(moveNorm, thresholds[1], thresholds[3], 0, 1);

            // 最后一页逻辑：团队页面
            const lastOffset = this.base.math.fit(moveRatio - this.PAGE_DISTANCE * 2 - (this.base.properties.useMobileLayout ? this.PAGE_DISTANCE : 0), -1, 0, 0, 1);
            const scrollOffsetY = Math.max(0, this.base.scrollManager.scrollPixel - range.top - thresholds[thresholds.length - 1] * baseSize);

            if (moveRatio >= this.PAGE_DISTANCE) {
                this.aboutHero.properties.cameraViewportOffsetY = scrollOffsetY;
                this.aboutHero.scrollYRatio = scrollOffsetY / baseSize;

                // whoSubsectionTeam.update(time, true, moveRatio - this.PAGE_DISTANCE * 2, scrollOffsetY, this.subsectionContainerOffsetY, lastOffset);
            } else {
                // whoSubsectionTeam.update(time, false, moveRatio - this.PAGE_DISTANCE * 2, scrollOffsetY, this.subsectionContainerOffsetY, lastOffset);
            }

            this.aboutHero.isActive = true;
        } else {
            this.aboutHero.isActive = false;
            // whoSubsectionTeam.wasActive = false;
        }
    }
}
