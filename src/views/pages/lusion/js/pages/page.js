/**
 * justThreeJs page.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/29 09:08:13
 */
import * as THREE from "three";
import Tween from "@/views/pages/lusion/js/utils/tween.js";
import MinSignal from '@/views/pages/lusion/js/utils/min-signal'

export default class Page {
    // DOM容器元素
    domContainer;
    // 关联的路由对象
    route = null;
    // 页面活跃时间
    time = 0;
    // 显示/隐藏动画持续时间
    showDuration = 1;
    hideDuration = 1;
    // 显示/隐藏进度比例 (0-1)
    showRatio = 0;
    hideRatio = 0;
    // 动画补间对象
    _showPageTween;
    _hidePageTween;
    // 状态标志
    isActive = false;          // 是否活跃状态
    hasInitialized = false;    // 是否已初始化
    hasExtraPages = true;      // 是否有额外页面
    hasEndVisual = true;       // 是否有结束视觉效果
    // 结束视觉效果配置
    endVisualUseTextured = false;               // 是否使用纹理
    endSectionActiveThreshold = 0.9;            // 结束区域激活阈值
    useGenericTransition = true;  // 是否使用通用过渡效果
    isFirstShown = false;        // 是否首次显示
    bypassShowingLoading = false; // 是否绕过加载显示
    // 动画容器
    preUfxContainer = new THREE.Object3D;   // 前置动画容器
    postUfxContainer = new THREE.Object3D;  // 后置动画容器
    // 事件信号
    onShowStarted = new MinSignal;   // 开始显示时触发
    onShowCompleted = new MinSignal; // 显示完成时触发
    onHideStarted = new MinSignal;   // 开始隐藏时触发
    onHideCompleted = new MinSignal; // 隐藏完成时触发

    constructor(base) {
        this.base = base;
        // 初始化动画补间对象
        this._showPageTween = new Tween(this);
        this._hidePageTween = new Tween(this);
        this.endVisualColor = this.base.properties.blueColorHex;  // 结束视觉颜色
    }

    // 获取当前活跃比例 (考虑显示和隐藏状态)
    get activeRatio() {
        return this.showRatio * (1 - this.hideRatio);
    }

    // 检查是否包含指定项目 (默认实现返回false)
    hasProject(e) {
        return false;
    }

    // 当前是否是滚动目标页面
    get isScrollTarget() {
        return this.base.pagesManager.scrollTargetPage === this;
    }

    // 预初始化方法 (空实现)
    preInit(e) {
        // 在DOM创建后、内容加载前调用
    }

    // 预初始化内容方法 (空实现)
    preInitContent(e) {
        // 在内容加载前调用
    }

    // 初始化方法
    init(e) {
        // 将动画容器添加到任务管理器
        this.base.taskManager.add(this.preUfxContainer);
        this.base.taskManager.add(this.postUfxContainer);
    }

    // 初始化内容方法 (空实现)
    initContent(e) {
        // 在内容加载后调用
    }

    // 显示页面方法
    show(prevRoute, currRoute, callback) {
        // 停止之前的显示动画
        this._showPageTween.kill();
        // 设置完成回调
        this._showPageTween.onComplete = callback;
        // 重置隐藏比例
        this.hideRatio = 0;
        // 启动显示动画 (从0到1)
        this._showPageTween.fromTo(
            this.showDuration,
            {showRatio: 0},
            {showRatio: 1}
        );
    }

    // 隐藏页面方法
    hide(prevRoute, currRoute, callback) {
        // 停止之前的隐藏动画
        this._hidePageTween && this._hidePageTween.kill();
        // 设置完成回调
        this._hidePageTween.onComplete = callback;
        // 启动隐藏动画 (从0到1)
        this._hidePageTween.fromTo(
            this.hideDuration,
            {hideRatio: 0},
            {hideRatio: 1}
        );
    }

    // 调整大小方法 (空实现)
    resize(width, height) {
        // 响应视窗大小变化
    }

    // 更新方法 (空实现)
    update(deltaTime) {
        // 每帧更新逻辑
    }
}
