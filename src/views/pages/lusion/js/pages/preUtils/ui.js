/**
 * justThreeJs ui.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/25 11:24:24
 */

export default class UI {
    domSectionsContainer = document.querySelector("#page-container");

    constructor(base) {
        this.base = base;
    }

    // 初始化 HTML 状态与 UI 子模块
    preInit() {
        if (!this.base.settings.WEBGL_OFF) {
            document.documentElement.classList.add("is-ready");
        }

        this.base.transitionOverlay.init();
        this.base.preloader.preInit();
        // header.preInit();
        // links.preInit();
        // this.base.pageExtraSections.preInit();
    }

    // 显示 this.base.preloader，并传入 init 与 start 的回调
    preload(initCallback, startCallback) {
        this.base.preloader.show(initCallback, startCallback);
    }

    // 初始化 UI 子模块（通常用于事件监听、DOM 构造）
    init() {
        // header.init();
        // links.init();
        // this.base.pageExtraSections.init();
    }

    // 启动 UI 展示逻辑（比如隐藏 this.base.preloader、显示 header）
    start() {
        this.base.preloader.hide();
        // header.show();
    }

    // 响应窗口变化，重新计算尺寸与参数
    resize(width, height, isInitial) {
        this.base.transitionOverlay.resize(width, height);
        this.base.preloader.resize(width, height, isInitial);
        // links.resize(width, height);
        // header.resize(width, height);
        // this.base.pageExtraSections.resize(width, height);
        // videoOverlay.resize(width, height);

        // 动态读取 CSS 变量，并赋值给 WebGL 的 uniform
        const radius = getComputedStyle(document.documentElement)
            .getPropertyValue("--global-border-radius")
            .split("px")[0];

        this.base.properties.globalRadius = this.base.properties.shaderUniforms.u_globalRadius.value = parseInt(radius);
    }

    // 每帧更新动画与状态
    update(deltaTime) {
        this.base.preloader.update(deltaTime);
        this.base.transitionOverlay.update(deltaTime);
        // links.update(deltaTime);
        // header.update(deltaTime);
        // this.base.pageExtraSections.update(deltaTime);
        // videoOverlay.update(deltaTime);
    }
}

