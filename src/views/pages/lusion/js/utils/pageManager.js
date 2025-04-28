/**
 * justThreeJs pageManager.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/25 12:47:09
 */
import MinSignal from '@/views/pages/lusion/js/utils/quickLoader/min-signal'
import Route from '@/views/pages/lusion/js/utils/route'
import AboutPage from '@/views/pages/lusion/js/about/aboutPage'

export default class PageManager {
    pages = {};
    // pageList = [homePage, aboutPage, projectPage, projectsPage, playgroundPage];
    scrollTargetPage = null;
    domContainer = null;
    domInner = null;
    prevRoute = null;
    currRoute = null;

    _defaultRoute;
    _pendingRoute;
    _isHiding = false;
    _isShowing = false;
    _hasPreloaded = true;
    isFirstRoute = true;
    _needsShowLoading = false;

    onIdled = new MinSignal();
    onScrollTargetChanged = new MinSignal();

    NEEDS_LOG = false;

    constructor(base) {
        this.base = base;
        this._defaultRoute = new Route(undefined);
        this.prevRoute = this.currRoute = this._defaultRoute;
        this.aboutPage = new AboutPage(this.base);
        this.pageList = [this.aboutPage];
        // 初始化页面配置
        for (let i = 0; i < this.pageList.length; i++) {
            const page = this.pageList[i];
            this.pages[page.id] = page;
            console.log(this.pages)
            this.base.routeManager.addPath(page.path, page);
            // 添加到前后特效场景中
            this.base.app.preUfx.scene.add(page.preUfxContainer);
            this.base.app.postUfx.scene.add(page.postUfxContainer);
        }

        // 监听过渡事件
        this.base.transitionOverlay.onShowTextCompleted.add(this._onShowTextComplete, this);
        this.base.transitionOverlay.onHideTextCompleted.add(this._onHideTextComplete, this);
        this.base.taskManager.onCompleted.add(this._onTaskComplete, this);
    }

    preInit() {
        this.domContainer = document.getElementById("page-container");
        this.domContainerInner = document.getElementById("page-container-inner");

        // this.base.routeManager.onRouteChanged.add(this._onRouteChanged, this);

        // 初始化当前路由
        // this._onRouteChanged(this.base.routeManager.currRoute);
    }

    get isIdle() {
        return !this._isHiding && this._hasPreloaded && !this._isShowing && !this._needsShowLoading;
    }

    _onRouteChanged(route) {
        if (!this.isIdle) {
            this._pendingRoute = route;
            return;
        }

        if (this.currRoute !== route) {
            this.prevRoute = this.currRoute;
            this.currRoute = route;

            const target = route.target;

            // 页面未初始化容器
            if (!target.domContainer) {
                target.domContainer = route.dom;
                this._log("preInit: " + route.path);
                target.preInit(route);

                // 若已初始化并不跳过 loading，则标记需要加载页
                if (this.base.properties.hasInitialized && !target.bypassShowingLoading) {
                    this._needsShowLoading = true;
                }
            }

            if (!this.base.properties.hasInitialized) {
                this.scrollTargetPage = target;
                this.onScrollTargetChanged.dispatch(target);
            }

            if (!route.hasContentPreloaded) {
                this._log("preInitContent: " + route.path);
                target.preInitContent(route);
            }

            if (this.base.properties.hasInitialized) {
                this.base.transitionOverlay.showTextRatio = 0;
                this.base.transitionOverlay.waitTextRatio = 0;
                this.base.transitionOverlay.hideTextRatio = 0;
                this.base.transitionOverlay.needsShowText = false;
                this.base.transitionOverlay.needsHideText = false;

                const prevTarget = this.prevRoute.target;
                this._isHiding = true;
                this._log("hide page", prevTarget.id);

                prevTarget.onHideStarted.dispatch();
                prevTarget.hide(this.prevRoute, this.currRoute, () => {
                    this._isHiding = false;

                    if (this._needsShowLoading) {
                        this.base.transitionOverlay.needsShowText = true;
                    } else if (this._hasPreloaded) {
                        this._onHideComplete();
                    }
                });

                /*  if (prevTarget.useGenericTransition) {
                      audios.countPlay("page");
                  }*/

                this.base.properties.loader.start((progress) => {
                    if (progress === 1) {
                        this._hasPreloaded = true;

                        if (!this._isHiding) {
                            if (this._needsShowLoading) {
                                if (this.base.transitionOverlay.showTextRatio === 1) {
                                    this._onHideComplete();
                                }
                            } else {
                                this._onHideComplete();
                            }
                        }
                    }
                });
            }
        }
    }

    _onShowTextComplete() {
        if (this._hasPreloaded) {
            this._onHideComplete();
        }
    }

    _onHideTextComplete() {
        this._showPage();
    }

    _onTaskComplete() {
        // 可用于某些首次加载后的逻辑
        this.isFirstRoute;
    }

    init() {
        this._initPage();
    }

    _initPage() {
        const target = this.currRoute.target;

        if (!target.hasInitialized) {
            this._log("init: " + this.currRoute.path);
            target.init(this.currRoute);
            target.hasInitialized = true;
        }

        if (!this.currRoute.hasContentPreloaded) {
            this.currRoute.hasContentPreloaded = true;
            this._log("initContent: " + this.currRoute.path);
            target.initContent(this.currRoute);
        }

        this.base.taskManager.start();
    }

    _onHideComplete() {
        this._initPage();

        const prevTarget = this.prevRoute.target;
        if (prevTarget) {
            prevTarget.onHideCompleted.dispatch();
            this._log("hide page complete: " + this.prevRoute.path);
            prevTarget.isActive = false;

            if (prevTarget !== this.currRoute.target) {
                prevTarget.domContainer.remove();
                prevTarget.preUfxContainer.visible = false;
                prevTarget.postUfxContainer.visible = false;
            }
        }

        if (this._needsShowLoading) {
            this.base.transitionOverlay.needsHideText = true;
        } else {
            this._showPage();
        }
    }

    resize(width, height) {
        if (
            this.prevRoute.target &&
            this.prevRoute.target.isActive &&
            this.prevRoute.target !== this.currRoute.target &&
            this.prevRoute.target.hasInitialized
        ) {
            this.prevRoute.target.resize(width, height);
        }

        if (this.currRoute && this.currRoute.target.isActive) {
            this.currRoute.target.resize(width, height);
        }
    }

    start() {
        this._showPage();
    }

    _showPage() {
        this._isShowing = true;
        this._needsShowLoading = false;

        const target = this.currRoute.target;
        target.isActive = true;

        if (this.base.properties.hasInitialized && target !== this.prevRoute.target) {
            this.domContainerInner.prepend(target.domContainer);
            target.time = 0;
        }

        document.title = this.currRoute.title;
        this.scrollTargetPage = target;

        target.preUfxContainer.visible = true;
        target.postUfxContainer.visible = true;

        this.onScrollTargetChanged.dispatch(target);
        this._log("show page: " + this.currRoute.path);

        // this.base.pageExtraSections.resize(this.base.properties.viewportWidth, this.base.properties.viewportHeight);
        this.base.scrollManager.resize(this.base.properties.viewportWidth, this.base.properties.viewportHeight);
        this.base.scrollManager.scrollToPixel(0, true);

        target.resize(this.base.properties.viewportWidth, this.base.properties.viewportHeight);

        target.onShowStarted.dispatch();
        target.show(this.prevRoute, this.currRoute, this._onShowComplete.bind(this));

        /*if (target.useGenericTransition) {
            audios.countPlay("page");
        }*/
    }

    _onShowComplete() {
        this.base.transitionOverlay.contentShowRatio = 1;
        this._isShowing = false;
        this.isFirstRoute = false;

        const target = this.currRoute.target;
        target.isFirstShown = true;
        target.onShowCompleted.dispatch();

        this._log("===============");

        if (this._pendingRoute) {
            const pending = this._pendingRoute;
            this._pendingRoute = null;
            this._onRouteChanged(pending);
        } else {
            this.onIdled.dispatch();
        }

        // 如果是从项目页进入 contact 页，滚动到底部
        if (this.base.properties.isContactFromProjectPage) {
            this.base.properties.isContactFromProjectPage = false;
            this.base.scrollManager.scrollTo("footer-section", 0, false);
        }
    }

    update(dt) {
        // 更新前一个页面
        if (
            this.prevRoute.target &&
            this.prevRoute.target.isActive &&
            this.prevRoute.target !== this.currRoute.target &&
            this.prevRoute.target.hasInitialized
        ) {
            this.prevRoute.target.time += dt;
            this.prevRoute.target.update(dt);
        }

        // 更新当前页面
        if (this.currRoute && this.currRoute.target.isActive) {
            this.currRoute.target.time += dt;
            this.currRoute.target.update(dt);
        }

        // 处理过渡动画比例
        if (!this.isFirstRoute) {
            if ((this._isHiding || !this._hasPreloaded) && !this._isShowing && this.prevRoute.target.useGenericTransition) {
                this.base.transitionOverlay.contentHideRatio = this.prevRoute.target.hideRatio;
                this.base.transitionOverlay.contentShowRatio = 0;
            }

            if (this._isShowing && this.currRoute.target && this.currRoute.target.useGenericTransition) {
                this.base.transitionOverlay.contentHideRatio = 1;
                this.base.transitionOverlay.contentShowRatio = this.currRoute.target.showRatio;
            }

            // 页面容器的透明度过渡
            let opacity = 1;
            if (this.prevRoute !== this.currRoute) {
                if (this._isHiding && !this.prevRoute.target.useGenericTransition) {
                    opacity *= this.base.math.fit(this.prevRoute.target.hideRatio, 0, 0.5, 1, 0);
                }
                if (this._isShowing && !this.currRoute.target.useGenericTransition) {
                    opacity *= this.base.math.fit(this.currRoute.target.showRatio, 0.5, 1, 0, 1);
                }
            }

            this.domContainer.style.opacity = opacity;
        }
    }

    _log(msg) {
        if (this.NEEDS_LOG) console.log("[PageManager]", msg);
    }
}
