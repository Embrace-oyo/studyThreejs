/**
 * justThreeJs pageExtraSections.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/25 12:57:22
 */
import * as THREE from "three";
export default class PageExtraSections {
    isActive = true;

    domContainer;
    _needsResize = false;

    preUfxContainer = new THREE.Object3D();
    postUfxContainer = new THREE.Object3D();

    constructor(base) {
        this.base = base;
    }

    preInit() {
        // 加入前后特效容器到全局特效场景
        this.base.app.preUfx.scene.add(this.preUfxContainer);
        this.base.app.postUfx.scene.add(this.postUfxContainer);

        // 获取 DOM 容器
        this.domContainer = document.querySelector("#page-extra-sections");

        // 各子区域预初始化
        // endSection.preInit();
        // footerSection.preInit();
        // this.base.scrollNavSection.preInit();
    }

    init() {
        // endSection.init();
        // footerSection.init();
        // this.base.scrollNavSection.init();
    }

    resize(width, height) {
        // 默认隐藏
        this.preUfxContainer.visible = false;
        this.postUfxContainer.visible = false;

        const targetPage = this.base.pagesManager.scrollTargetPage;

        if (targetPage && targetPage.hasExtraPages) {
            // 显示额外部分，执行布局
            this.preUfxContainer.visible = true;
            this.postUfxContainer.visible = true;
            this._needsResize = false;

            this.domContainer.style.display = "block";

            // endSection.resize(width, height);
            // footerSection.resize(width, height);
            // this.base.scrollNavSection.resize(width, height);
        } else {
            // 没有额外部分需要显示
            this.domContainer.style.display = "none";
            this._needsResize = true;
        }
    }

    update(dt) {
        // 默认隐藏
        this.preUfxContainer.visible = false;
        this.postUfxContainer.visible = false;

        const targetPage = this.base.pagesManager.scrollTargetPage;

        if (targetPage && targetPage.hasExtraPages) {
            // 需要显示额外页面
            this.preUfxContainer.visible = true;
            this.postUfxContainer.visible = true;

            // 如果上次 resize 被跳过，重新执行
            if (this._needsResize) {
                this.resize(this.base.properties.viewportWidth, this.base.properties.viewportHeight);
            }

            this.domContainer.style.display = "block";

            // endSection.update(dt);
            // footerSection.update(dt);
            // this.base.scrollNavSection.update(dt);
        } else {
            this.domContainer.style.display = "none";
            this._needsResize = true;
        }
    }
}
