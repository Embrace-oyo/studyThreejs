/**
 * justThreeJs aboutPage.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/29 09:14:38
 */
import * as THREE from "three";
import Page from '@/views/pages/lusion/js/pages/page';
import AboutWhoSection from '@/views/pages/lusion/js/pages/about/aboutWhoSection/aboutWhoSection'

let _c = new THREE.Color;
export default class AboutPage extends Page {
    // 路由路径
    path = "about";
    // 页面ID
    id = "about";

    constructor(base) {
        super(base);
        this.base = base;
        // 设置结束视觉颜色为灰白色
        this.endVisualColor = this.base.properties.offWhiteColorHex;
        this.aboutWhoSection = new AboutWhoSection(this);
    }

    // 预初始化方法
    preInit() {
        this.domContainer = document.querySelector('#about')
        let container = this.domContainer;
        // 初始化各个内容区块
        this.aboutWhoSection.preInit(container);      // "关于我们"部分
        // aboutClientSection.preInit(container);   // 客户部分
        // aboutAwardSection.preInit(container);    // 奖项部分
        // aboutCapabilitySection.preInit(container); // 能力部分
    }

    // 初始化方法
    init() {
        // 初始化各个内容区块
        this.aboutWhoSection.init();
        // aboutClientSection.init();
        // aboutAwardSection.init();
        // aboutCapabilitySection.init();

        // 调用父类初始化方法
        super.init();
    }

    // 响应视窗大小变化
    resize(width, height) {
        // 调整各个内容区块大小
        this.aboutWhoSection.resize(width, height);
        // aboutClientSection.resize(width, height);
        // aboutAwardSection.resize(width, height);
        // aboutCapabilitySection.resize(width, height);
    }

    // 显示页面方法
    show(prevRoute, currRoute, callback) {
        // 显示"关于我们"部分
        this.aboutWhoSection.show();
        // 初始化音频
        // aboutPageAudios.init();
        // 调用父类显示方法
        super.show(prevRoute, currRoute, callback);
    }

    // 每帧更新方法
    update(deltaTime) {
        // 调用父类更新方法
        super.update(deltaTime);

        // 状态标志
        let isFooterActive = false;
        let isBlackBg = true;
        let isBlueBg = false;

        // 只有当当前页面是滚动目标时才处理背景色变化
        if (this.base.pagesManager.scrollTargetPage == this) {
            // 设置基础背景色为黑色
            this.base.properties.bgColor.setStyle(this.base.properties.blackColorHex);

            /*// 获取能力部分的滚动位置信息
            let capabilityRange = scrollManager.getDomRange(aboutCapabilitySection.domContainer);

            // 根据滚动位置插值计算背景色(黑色到蓝色过渡)
            this.base.properties.bgColor.lerp(
                _c.setStyle(this.base.properties.blueColorHex),
                math.fit(capabilityRange.screenRatio, -1, -0.5, 0, 1)
            );

            // 判断是否显示蓝色背景
            if (capabilityRange.screenRatio > -0.75) {
                isBlueBg = true;
                isBlackBg = false;
            } else {
                isBlueBg = false;
                isBlackBg = true;
            }

            // 判断页脚是否激活
            if (footerSection.getDomRange().ratio > -0.1) {
                isFooterActive = true;
                isBlackBg = false;
                isBlueBg = false;
            }*/

            // 根据状态切换HTML类名
            document.documentElement.classList.toggle("is-black-bg", isBlackBg);
            document.documentElement.classList.toggle("is-white-bg", isFooterActive);
            document.documentElement.classList.toggle("is-blue-bg", isBlueBg);
        }

        // 更新各个内容区块
        this.aboutWhoSection.update(deltaTime);
        // aboutClientSection.update(deltaTime);
        // aboutAwardSection.update(deltaTime);
        // aboutCapabilitySection.update(deltaTime);

        // 更新音频
        // aboutPageAudios.update(isBlackBg);
    }
}
