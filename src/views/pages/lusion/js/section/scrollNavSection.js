/**
 * justThreeJs scrollNavSection.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/25 13:01:01
 */

export default class ScrollNavSection {
    domContainer;
    domText;
    barInner;

    overScrollRatio = 0;
    downWaitTime = 0;
    _needsReset = true;

    path = "";

    constructor(base) {
        this.base = base;
    }

    preInit() {
        this.domContainer = document.getElementById("scroll-nav-section");
        this.domText = document.getElementById("scroll-nav-text");
        this.barInner = document.getElementById("scroll-nav-next-bar-inner");
    }

    init() {
        // 初始化阶段暂无具体逻辑
    }

    resize(width, height) {
        // 响应窗口尺寸变化，暂无逻辑（预留接口）
    }

    update(dt) {
        const isActive = this.base.scrollManager.getDomRange(this.domContainer).isActive;
        const isAtBottom = this.base.scrollManager.scrollPixel >= this.base.scrollManager.contentSize * this.base.scrollManager.viewSizePixel - 5;

        // 仅在 scrollManager 处于激活状态，且当前页面不在转场中时，允许触发
        const inputDelta = (this.base.input.deltaDragScrollY + this.base.input.deltaWheel) *
            (this.base.scrollManager.isActive && this.base.pagesManager.isIdle ? 1 : 0);

        // 控制等待时间与 overscroll 动画节奏
        if (inputDelta > 0) {
            this.downWaitTime = 0.3;
        } else {
            this.downWaitTime = Math.max(0, this.downWaitTime - dt);
        }

        if (isActive) {
            const direction = isAtBottom && inputDelta > 0
                ? 2
                : this.downWaitTime > 0
                    ? 0
                    : inputDelta < 0
                        ? -5
                        : -0.2;

            const influence = direction * (this.base.pagesManager.isIdle ? 1 : 0);
            this.overScrollRatio = this.base.math.saturate(this.overScrollRatio + dt * influence);
        } else {
            this.overScrollRatio = 0;
        }

        if (isActive) {
            const currRoute = this.base.pagesManager.currRoute;

            // 更新视觉上的进度条
            this.barInner.style.transform = `scaleX(${this.overScrollRatio})`;

            if (this.base.scrollManager.isActive && this.base.pagesManager.isIdle) {
                // 路由信息更新（只执行一次）
                if (this.path !== currRoute.scrollNavPath) {
                    this.path = currRoute.scrollNavPath;
                    this.domText.innerHTML = currRoute.scrollNavText;
                }

                // 满值后跳转
               /* if (this.overScrollRatio === 1) {
                    routeManager.setPath(this.path);
                }*/
            }
        }
    }
}
