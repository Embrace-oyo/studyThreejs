/**
 * justThreeJs pageManager.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/29 09:06:17
 */
import MinSignal from '@/views/pages/lusion/js/utils/min-signal'
import AboutPage from '@/views/pages/lusion/js/pages/about/aboutPage'

export default class PagesManager {
    // 页面集合（键值对）
    pages = {};
    // 页面列表（数组）
    // 滚动目标页
    scrollTargetPage = null;
    // DOM容器
    domContainer = null;
    domInner = null;
    // 路由记录
    prevRoute = null;
    currRoute = null;
    // 默认路由
    _defaultRoute;
    // 等待处理的路由
    _pendingRoute;
    // 状态标志
    _isHiding = false;
    _isShowing = false;
    _hasPreloaded = true;
    isFirstRoute = true;
    _needsShowLoading = false;
    // 信号事件
    onIdled = new MinSignal;          // 空闲时触发
    onScrollTargetChanged = new MinSignal; // 滚动目标变化时触发
    // 调试标志
    NEEDS_LOG = false;

    constructor(base) {
        this.base = base;
        this.aboutPage = new AboutPage(this.base);
        this.pageList = [this.aboutPage]
        // 初始化默认路由
        this._defaultRoute = null;
        this.prevRoute = this.currRoute = this._defaultRoute;

        // 初始化所有页面
        for (let e = 0; e < this.pageList.length; e++) {
            let page = this.pageList[e];
            this.pages[page.id] = page;
            // 添加路由路径
            // routeManager.addPath(page.path, page);
            // 添加动画容器
            this.base.preUfx.scene.add(page.preUfxContainer);
            this.base.postUfx.scene.add(page.postUfxContainer);
        }

        // 绑定事件
        this.base.transitionOverlay.onShowTextCompleted.add(this._onShowTextComplete, this);
        this.base.transitionOverlay.onHideTextCompleted.add(this._onHideTextComplete, this);
        this.base.taskManager.onCompleted.add(this._onTaskComplete, this);
    }

    // 预初始化
    preInit() {
        this.domContainer = document.getElementById("page-container");
        this.domContainerInner = document.getElementById("page-container-inner");
        // 监听路由变化
        // routeManager.onRouteChanged.add(this._onRouteChanged, this);
        this._onRouteChanged(this.pageList[0]);
    }

    // 初始化
    init() {
        this._initPage();
    }

    // 是否处于空闲状态
    get isIdle() {
        return !this._isHiding && this._hasPreloaded && !this._isShowing && !this._needsShowLoading;
    }

    // 路由变化时的处理
    _onRouteChanged(newRoute) {
        if (!this.isIdle) {
            // 如果忙，则暂存路由
            // this._pendingRoute = newRoute;
        } else if (this.currRoute !== newRoute) {
            // 更新路由记录
            this.prevRoute = this.currRoute;
            this.currRoute = newRoute;
            let targetPage = this.currRoute;
            // 初始化页面DOM容器
            if (!targetPage.domContainer) {
                // targetPage.domContainer = this.currRoute.dom;
                this._log("preInit: " + this.currRoute.path);
                targetPage.preInit(this.currRoute);

                // 如果需要显示加载状态
                if (this.base.properties.hasInitialized && !targetPage.bypassShowingLoading) {
                    this._needsShowLoading = true;
                }
            }

            // 预加载处理
            if (this.base.properties.hasInitialized) {
                this._hasPreloaded = false;
            } else {
                this.scrollTargetPage = targetPage;
                this.onScrollTargetChanged.dispatch(targetPage);
            }

            // 预加载内容
            if (!this.currRoute.hasContentPreloaded) {
                this._log("preInitContent: " + this.currRoute.path);
                targetPage.preInitContent(this.currRoute);
            }

            // 已初始化时的过渡处理
            if (this.base.properties.hasInitialized) {
                // 重置过渡状态
                this.base.transitionOverlay.showTextRatio = 0;
                this.base.transitionOverlay.waitTextRatio = 0;
                this.base.transitionOverlay.hideTextRatio = 0;
                this.base.transitionOverlay.needsShowText = false;
                this.base.transitionOverlay.needsHideText = false;

                // 隐藏旧页面
                let prevPage = this.prevRoute;
                this._isHiding = true;
                this._log("hide page", prevPage.id);
                prevPage.onHideStarted.dispatch();

                prevPage.hide(this.prevRoute, this.currRoute, () => {
                    this._isHiding = false;
                    this._needsShowLoading ? this.base.transitionOverlay.needsShowText = true : this._hasPreloaded && this._onHideComplete();
                });

                /*// 播放页面切换音效
                if (prevPage.useGenericTransition) {
                    audios.countPlay("page");
                }*/

                // 启动加载器
                this.base.properties.loader.start(progress => {
                    if (progress == 1) {
                        console.log('1-10')
                        this._hasPreloaded = true;
                        if (!this._isHiding) {
                            this._needsShowLoading ? this.base.transitionOverlay.showTextRatio == 1 && this._onHideComplete() : this._onHideComplete();
                        }
                    }
                });
            }
        }
    }

    // 显示过渡文本完成
    _onShowTextComplete() {
        this._hasPreloaded && this._onHideComplete();
    }

    // 隐藏过渡文本完成
    _onHideTextComplete() {
        this._showPage();
    }

    // 任务完成
    _onTaskComplete() {
        // 首次路由的特殊处理
        this.isFirstRoute;
    }

    // 初始化当前页
    _initPage() {
        let currPage = this.currRoute;

        // 初始化页面
        if (!currPage.hasInitialized) {
            this._log("init: " + this.currRoute.path);
            currPage.init(this.currRoute);
            currPage.hasInitialized = true;
        }

        // 初始化内容
        if (!this.currRoute.hasContentPreloaded) {
            this.currRoute.hasContentPreloaded = true;
            this._log("initContent: " + this.currRoute.path);
            currPage.initContent(this.currRoute);
        }

        // 启动任务管理器
        this.base.taskManager.start();
    }

    // 隐藏完成
    _onHideComplete() {
        // 初始化页面
        this._initPage();

        // 处理旧页面
        if (this.prevRoute.target) {
            let prevPage = this.prevRoute.target;
            prevPage.onHideCompleted.dispatch();
            this._log("hide page complete: " + this.prevRoute.path);
            prevPage.isActive = false;

            // 移除旧页面DOM
            if (prevPage !== this.currRoute.target) {
                prevPage.domContainer.remove();
                prevPage.preUfxContainer.visible = false;
                prevPage.postUfxContainer.visible = false;
            }
        }

        // 决定下一步操作
        this._needsShowLoading ? this.base.transitionOverlay.needsHideText = true : this._showPage();
    }

    // 调整大小
    resize(width, height) {
        // 调整旧页面大小
        if (this.prevRoute && this.prevRoute.isActive &&
            this.prevRoute !== this.currRoute &&
            this.prevRoute.hasInitialized) {
            this.prevRoute.resize(width, height);
        }

        // 调整当前页面大小
        if (this.currRoute && this.currRoute.isActive) {
            this.currRoute.resize(width, height);
        }
    }

    // 启动显示页面
    start() {
        this._showPage();
    }

    // 显示页面
    _showPage() {
        this._isShowing = true;
        this._needsShowLoading = false;

        let currPage = this.currRoute;
        currPage.isActive = true;

        // 添加页面DOM
        if (this.base.properties.hasInitialized && currPage !== this.prevRoute) {
            this.domContainerInner.prepend(currPage.domContainer);
            currPage.time = 0;
        }

        // 更新文档标题
        // document.title = this.currRoute.title;

        // 设置滚动目标
        this.scrollTargetPage = currPage;
        currPage.preUfxContainer.visible = true;
        currPage.postUfxContainer.visible = true;
        this.onScrollTargetChanged.dispatch(currPage);

        this._log("show page: " + this.currRoute.path);

        // 调整布局
        // this.base.pageExtraSections.resize(properties.viewportWidth, properties.viewportHeight);
        this.base.scrollManager.resize(this.base.properties.viewportWidth, this.base.properties.viewportHeight);
        this.base.scrollManager.scrollToPixel(0, true);

        // 调整页面大小并显示
        currPage.resize(this.base.properties.viewportWidth, this.base.properties.viewportHeight);
        currPage.onShowStarted.dispatch();
        currPage.show(this.prevRoute, this.currRoute, this._onShowComplete.bind(this));

        // 播放页面切换音效
        /* if (currPage.useGenericTransition) {
             audios.countPlay("page");
         }*/
    }

    // 显示完成
    _onShowComplete() {
        this.base.transitionOverlay.contentShowRatio = 1;
        this._isShowing = false;
        this.isFirstRoute = false;

        // 标记页面首次显示
        this.currRoute.isFirstShown = true;
        this.currRoute.onShowCompleted.dispatch();

        this._log("===============");

        // 处理等待中的路由
        if (this._pendingRoute) {
            let pendingRoute = this._pendingRoute;
            this._pendingRoute = null;
            this._onRouteChanged(pendingRoute);
        } else {
            this.onIdled.dispatch();
        }

        // 特殊处理：从项目页跳转到联系页
        if (this.base.properties.isContactFromProjectPage) {
            this.base.properties.isContactFromProjectPage = false;
            this.base.scrollManager.scrollTo("footer-section", 0, false);
        }
    }

    // 更新
    update(deltaTime) {
        // 更新旧页面
        if (this.prevRoute && this.prevRoute.isActive &&
            this.prevRoute !== this.currRoute &&
            this.prevRoute.hasInitialized) {
            let prevPage = this.prevRoute;
            prevPage.time += deltaTime;
            prevPage.update(deltaTime);
        }

        // 更新当前页面
        if (this.currRoute && this.currRoute.isActive) {
            let currPage = this.currRoute;
            currPage.time += deltaTime;
            currPage.update(deltaTime);
        }

        // 非首次路由的过渡效果处理
        if (!this.isFirstRoute) {
            // 处理隐藏过渡
            if ((this._isHiding || !this._hasPreloaded) && !this._isShowing &&
                this.prevRoute.target.useGenericTransition) {
                this.base.transitionOverlay.contentHideRatio = this.prevRoute.target.hideRatio;
                this.base.transitionOverlay.contentShowRatio = 0;
            }

            // 处理显示过渡
            if (this._isShowing && this.currRoute.target &&
                this.currRoute.target.useGenericTransition) {
                this.base.transitionOverlay.contentHideRatio = 1;
                this.base.transitionOverlay.contentShowRatio = this.currRoute.target.showRatio;
            }

            // 计算容器透明度
            let opacity = 1;
            if (this.prevRoute != this.currRoute) {
                // 处理非通用过渡的隐藏效果
                if (this._isHiding && !this.prevRoute.target.useGenericTransition) {
                    opacity *= this.base.math.fit(this.prevRoute.target.hideRatio, 0, 0.5, 1, 0);
                }
                // 处理非通用过渡的显示效果
                if (this._isShowing && !this.currRoute.target.useGenericTransition) {
                    opacity *= this.base.math.fit(this.currRoute.target.showRatio, 0.5, 1, 0, 1);
                }
            }

            // 应用透明度
            this.domContainer.style.opacity = opacity;
        }
    }

    // 日志记录（空实现）
    _log(message) {
        // 调试日志记录
    }
}
