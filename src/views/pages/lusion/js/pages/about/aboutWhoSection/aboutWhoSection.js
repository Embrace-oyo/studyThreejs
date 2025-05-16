/**
 * justThreeJs aboutWhoSection.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/29 09:29:33
 */
import {easeInOutCubic} from 'easing-utils';
import WhoSubsectionWeAre
    from '@/views/pages/lusion/js/pages/about/aboutWhoSection/whoSubsectionWeAre/whoSubsectionWeAre'
import WhoSubsectionDetails
    from '@/views/pages/lusion/js/pages/about/aboutWhoSection/whoSubsectionDetails/whoSubsectionDetails'
import WhoSubsectionTeam from '@/views/pages/lusion/js/pages/about/aboutWhoSection/whoSubsectionTeam/whoSubsectionTeam'
import AboutHero from '@/views/pages/lusion/js/pages/about/aboutWhoSection/aboutHero/aboutHero'

export default class AboutWhoSection {
    // DOM元素引用
    domContainer;                 // 主容器
    domSubsectionContainer;       // 子部分容器
    domCrosses;                   // 交叉元素容器

    // 状态变量
    activeFaceId = -1;            // 当前激活的面板ID
    scrollRatio = 0;              // 滚动比例(0-1)
    subsectionContainerOffsetY = 0; // Y轴偏移量
    subsectionContainerOffsetX = 0; // X轴偏移量

    // 滚动区域定义(桌面版)
    RANGE_START_WAIT = 3.5;       // 起始等待区域
    RANGE_PAGE_12 = 1.75;         // 第1到第2部分过渡区域
    RANGE_PAGE_23 = 1.75;         // 第2到第3部分过渡区域
    RANGE_END_WAIT = 2.5;         // 结束等待区域

    // 移动版额外定义
    RANGE_PAGE_34 = 1.75;         // 第3到第4部分过渡区域(仅移动版)
    PAGE_DISTANCE = 1.25;         // 页面间距系数

    // 阈值数组
    THRESHOLDS = [];              // 桌面版阈值
    MOBILE_THRESHOLDS = [];       // 移动版阈值
    constructor(base) {
        this.base = base.base;
        this.parent = base;
        this.whoSubsectionWeAre = new WhoSubsectionWeAre(this);
        this.whoSubsectionDetails = new WhoSubsectionDetails(this);
        this.whoSubsectionTeam = new WhoSubsectionTeam(this);
        this.aboutHero = new AboutHero(this);
    }

    // 预初始化方法
    preInit(container) {
        // 获取DOM元素
        this.domContainer = container.querySelector("#about-who");
        this.domSubsectionContainer = container.querySelector("#about-who-subsection-container");
        this.domCrosses = container.querySelector("#about-crosses");

        // 计算桌面版阈值
        let desktopThreshold = 0;
        let mobileThreshold = 0;

        // 添加各区域阈值
        this.THRESHOLDS.push(desktopThreshold += this.RANGE_START_WAIT);
        this.THRESHOLDS.push(desktopThreshold += this.RANGE_PAGE_12);
        this.THRESHOLDS.push(desktopThreshold += this.RANGE_PAGE_23);

        // 移动版阈值(前3个与桌面版相同)
        mobileThreshold = desktopThreshold;
        this.MOBILE_THRESHOLDS.push(...this.THRESHOLDS);

        // 添加桌面版结束阈值
        this.THRESHOLDS.push(desktopThreshold += this.RANGE_END_WAIT);

        // 添加移动版额外阈值
        this.MOBILE_THRESHOLDS.push(mobileThreshold += this.RANGE_PAGE_34);
        this.MOBILE_THRESHOLDS.push(mobileThreshold += this.RANGE_END_WAIT);

        // 初始化子部分
        this.whoSubsectionWeAre.preInit(container);  // "我们是谁"部分
        this.whoSubsectionDetails.preInit(container); // 详情部分
        this.whoSubsectionTeam.preInit(container);   // 团队部分

        // 初始化英雄区域并添加到3D场景
        this.aboutHero.preInit();
        this.base.visuals.stage3DList.push(this.aboutHero);
    }

    // 初始化方法
    init() {
        this.whoSubsectionWeAre.init();
        this.whoSubsectionDetails.init();
        this.whoSubsectionTeam.init();
        this.aboutHero.init();
    }

    // 响应视窗大小变化
    resize(width, height) {
        // 同步容器变换
        this.syncSubsectionContainerTransform();

        // 调整子部分大小
        this.whoSubsectionWeAre.resize(width, height);
        this.whoSubsectionDetails.resize(width, height);
        this.whoSubsectionTeam.resize(width, height);

        // 调整英雄区域大小
        this.aboutHero.resize(this.base.properties.width, this.base.properties.height);
    }

    // 显示方法
    show() {
        // 重置logo隐藏比例
        this.whoSubsectionWeAre.aboutWhoLogo.hideRatio = 0;

        // 通知团队部分显示
        this.whoSubsectionTeam.onPageShow();
    }

    // 获取移动比例(基于滚动位置)
    getMoveRatio() {
        const range = this.base.scrollManager.getDomRange(this.domContainer);
        return -range.screenY / (this.base.properties.useMobileLayout
            ? this.base.properties.viewportHeight
            : this.base.properties.viewportWidth);
    }

    // 获取滚动比例(0-3表示4个部分)
    getScrollRatio() {
        const thresholds = this.base.properties.useMobileLayout
            ? this.MOBILE_THRESHOLDS
            : this.THRESHOLDS;
        const moveRatio = this.getMoveRatio();
        let ratio = 0;

        if (moveRatio < thresholds[0]) {
            ratio = 0;  // 第一部分之前
        } else if (moveRatio < thresholds[1]) {
            // 第一部分到第二部分过渡
            ratio = this.base.math.fit(moveRatio, thresholds[0], thresholds[1], 0, 1, easeInOutCubic);
        } else if (this.base.properties.useMobileLayout) {
            if (moveRatio < thresholds[2]) {
                // 第二部分到第三部分过渡(移动版)
                ratio = this.base.math.fit(moveRatio, thresholds[1], thresholds[2], 1, 2, easeInOutCubic);
            } else {
                // 第三部分到第四部分过渡(移动版)
                ratio = this.base.math.fit(moveRatio, thresholds[2], thresholds[3], 2, 3, easeInOutCubic);
            }
        } else {
            // 第二部分到第三部分过渡(桌面版)
            ratio = this.base.math.fit(moveRatio, thresholds[1], thresholds[2], 1, 2, easeInOutCubic);
        }

        this.scrollRatio = ratio;
        return ratio;
    }

    // 同步子部分容器变换
    syncSubsectionContainerTransform() {
        const thresholds = this.base.properties.useMobileLayout
            ? this.MOBILE_THRESHOLDS
            : this.THRESHOLDS;
        const viewportSize = this.base.properties.useMobileLayout
            ? this.base.properties.viewportHeight
            : this.base.properties.viewportWidth;

        // 计算可滚动区域总大小
        this.scrollableSize = thresholds[thresholds.length - 1] * viewportSize;
        const range = this.base.scrollManager.getDomRange(this.domContainer);
        const isActive = range.isActive;

        // 计算当前页面位置
        const pagePos = this.getScrollRatio() * this.PAGE_DISTANCE;

        // 计算Y轴偏移(基于滚动位置)
        this.subsectionContainerOffsetY = this.base.math.fit(
            range.screenY,
            0,
            -this.scrollableSize,
            0,
            this.scrollableSize
        );

        // 计算X轴偏移(桌面版有水平滑动效果)
        this.subsectionContainerOffsetX = this.base.properties.useMobileLayout
            ? 0
            : pagePos * -this.base.properties.viewportWidth;

        // 应用变换
        this.domSubsectionContainer.style.transform =
            `translate3d(${this.subsectionContainerOffsetX}px,${this.subsectionContainerOffsetY}px, 0)`;

        // 交叉元素反向移动(视差效果)
        this.domCrosses.style.transform =
            `translate3d(${-this.subsectionContainerOffsetX}px,0, 0)`;

        // 非活跃状态时停用英雄区域
        if (!isActive) {
            this.aboutHero.isActive = false;
        }
    }

    // 每帧更新
    update(deltaTime) {
        const thresholds = this.base.properties.useMobileLayout
            ? this.MOBILE_THRESHOLDS
            : this.THRESHOLDS;
        const viewportSize = this.base.properties.useMobileLayout
            ? this.base.properties.viewportHeight
            : this.base.properties.viewportWidth;

        // 计算可滚动区域总大小
        this.scrollableSize = thresholds[thresholds.length - 1] * viewportSize;

        const range = this.base.scrollManager.getDomRange(this.domContainer);
        const isActive = range.isActive;

        // 同步容器变换
        this.syncSubsectionContainerTransform();

        // 预更新团队部分
        this.whoSubsectionTeam.preUpdate();

        if (isActive) {
            const pagePos = this.getScrollRatio() * this.PAGE_DISTANCE;
            const moveRatio = -range.screenY / viewportSize;
            // 设置英雄区域参数
            this.aboutHero.initialSplineRatio = this.base.math.fit(moveRatio, 0, thresholds[1], 0, 1);
            this.aboutHero.hudRatio = this.base.math.fit(moveRatio, thresholds[1], thresholds[1] + this.RANGE_PAGE_23 * 0.5, 0, 1);
            this.aboutHero.outSectionRatio = this.base.math.fit(moveRatio / thresholds[3], 0.9, 1, 0, 1);


            // 重置相机偏移
            this.aboutHero.properties.cameraViewportOffsetX = 0;
            this.aboutHero.properties.cameraViewportOffsetY = 0;
            this.aboutHero.scrollYRatio = 0;
            this.aboutHero.faceShowRatio = 0;

            // 根据页面位置更新各部分
            if (pagePos < this.PAGE_DISTANCE) {
                // 第一部分
                this.aboutHero.introRatio = moveRatio / (this.RANGE_START_WAIT + this.RANGE_PAGE_12);
                this.whoSubsectionWeAre.update(deltaTime, true, pagePos, moveRatio, this.subsectionContainerOffsetY);

            } else {
                // 其他部分
                this.aboutHero.introRatio = 1;
                this.whoSubsectionWeAre.update(deltaTime, false, pagePos, moveRatio, this.subsectionContainerOffsetY);
            }

            // 更新详情部分
            if (pagePos > 0 && pagePos < this.PAGE_DISTANCE * 2) {
                this.whoSubsectionDetails.update(deltaTime, true, pagePos - this.PAGE_DISTANCE, this.subsectionContainerOffsetY);
            } else {
                this.whoSubsectionDetails.update(deltaTime, false, pagePos - this.PAGE_DISTANCE, this.subsectionContainerOffsetY);
            }

            // 更新英雄区域滑动效果
            const panRatio = this.base.properties.useMobileLayout
                ? this.base.math.fit(this.getMoveRatio(), thresholds[2], thresholds[4], 0, 1)
                : this.base.math.fit(this.getMoveRatio(), thresholds[1], thresholds[3], 0, 1);
            this.aboutHero.panningSplineRaito = panRatio;

            // 计算团队部分显示比例
            const teamShowRatio = this.base.math.fit(
                pagePos - this.PAGE_DISTANCE * 2 - (this.base.properties.useMobileLayout ? this.PAGE_DISTANCE : 0),
                -1, 0, 0, 1
            );

            // 计算滚动偏移
            const scrollOffset = Math.max(0, this.base.scrollManager.scrollPixel - range.top - this.scrollableSize);
            // 更新团队部分
            if (pagePos >= this.PAGE_DISTANCE) {
                this.aboutHero.properties.cameraViewportOffsetY = scrollOffset;
                this.aboutHero.scrollYRatio = scrollOffset / viewportSize;
                this.whoSubsectionTeam.update(
                    deltaTime,
                    true,
                    pagePos - this.PAGE_DISTANCE * 2,
                    scrollOffset,
                    this.subsectionContainerOffsetY,
                    teamShowRatio
                );
            } else {
                this.whoSubsectionTeam.update(
                    deltaTime,
                    false,
                    pagePos - this.PAGE_DISTANCE * 2,
                    scrollOffset,
                    this.subsectionContainerOffsetY,
                    teamShowRatio
                );
            }

            // 激活英雄区域
            this.aboutHero.isActive = true;
        } else {
            // 非活跃状态
            this.aboutHero.isActive = false;
            this.whoSubsectionTeam.wasActive = false;
        }
    }
}
