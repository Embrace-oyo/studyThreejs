/**
 * justThreeJs routeManager.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/25 13:12:09
 */
import MinSignal from '@/views/pages/lusion/js/utils/quickLoader/min-signal'
import Route from '@/views/pages/lusion/js/utils/route'

let loc = window.location
let ORIGIN = window.location.origin
let URL_PREFIX_REGEX = new RegExp("^" + ORIGIN.replace(/\//g, "\\/"));
export default class RouteManager {
    routes = {};                    // 存储所有已解析的路径对应的 Route 实例
    matchList = [];                 // 路由匹配规则列表 [{ regExp, target }]
    currPath = null;               // 当前路径
    _pendingPath = null;           // 等待加载的路径
    queryStr;                       // URL 查询参数字符串
    onRouteChanged = new MinSignal();  // 路由切换时触发的信号

    constructor(base) {
        this.base = base;
    }

    get currRoute() {
        return this.routes[this.currPath];
    }

    init() {
        this.queryStr = loc.href.split("?")[1] || "";
        window.addEventListener("popstate", this._onStatePop.bind(this));
        this.setUrl(); // 初始化当前 URL
    }

    addPath(pattern, target) {
        this.matchList.push({
            regExp: pattern instanceof RegExp ? pattern : new RegExp("^" + pattern + "$"),
            target
        });
    }

    _createRoute(path) {
        let route = this.routes[path] = new Route(path);
        route.setTarget(this.matchList);
        return route;
    }

    _fetchHtml(path) {
        let route = this.routes[path];
        if (route) {
            if (route.dom) {
                this._onDomReady(route);
            }
        } else {
            this.base.properties.loader.load("/" + path, {
                type: "text",
                onLoad: this._initDom.bind(this, this._createRoute(path))
            });
        }
    }

    _initDom(route, html) {
        let doc = document;
        let title = doc.title;

        if (html) {
            // 创建新 HTML 文档并解析内容
            doc = doc.implementation.createHTMLDocument();
            doc.body.innerHTML = /<body[^>]*>((.|[\n\r])*)<\/body>/im.exec(html)[1];

            let titleMatch = /<title[^>]*>((.|[\n\r])*)<\/title>/im.exec(html);
            title = titleMatch ? titleMatch[1] : "";
        }

        let navEl = doc.getElementById("scroll-nav-section");
        let scrollPath, scrollText;

        if (navEl) {
            scrollPath = navEl.dataset.path;
            scrollText = doc.getElementById("scroll-nav-text").innerHTML;
        }

        route.setTitleDom(title, doc.querySelector(".page"), scrollPath, scrollText);
        navEl?.removeAttribute("data-path");

        this._attachEvents(html ? route.dom : doc.documentElement);
        this._onDomReady(route);
    }

    _attachEvents(container) {
        let links = container.querySelectorAll("a");

        for (let i = 0; i < links.length; i++) {
            let link = links[i];

            if (!link.__hasClickParsed) {
                link.__hasClickParsed = true;

                let isInternal = link.href.startsWith(window.location.origin) || link.href.startsWith("/");
                if (link.dataset.linkType) {
                    isInternal = link.dataset.linkType === "internal";
                }

                if (isInternal) {
                    link.addEventListener("mouseenter", () => {
                        this.preFetch(this.parseUrl(link.href));
                    });
                    link.addEventListener("click", this._onInternalLinkClick.bind(this, link));
                } else {
                    link.addEventListener("click", this._onRegularLinkClick.bind(this, link));
                }
            }
        }
    }

    _onRegularLinkClick(link, event) {
        let href = link.href;

        if (href.startsWith("https://player.vimeo.com/video/")) {
            event.preventDefault();
            let videoId = href.split("/").pop();
            // videoOverlay.initAndPlayVideo(videoId, true);
        }
    }

    _onInternalLinkClick(link, event) {
        event.preventDefault();

        let shouldProceed = true;
        if (link._onPreClick) {
            shouldProceed = link._onPreClick() !== false;
        }

        if (shouldProceed) {
            this.setUrl(link.href);
        }
    }

    _onDomReady(route) {
        if (this._pendingPath === route.path) {
            this._pendingPath = null;
            this.onRouteChanged.dispatch(route);
        }
    }

    parseUrl(href = loc.href) {
        let cleanHref = href.replace(URL_PREFIX_REGEX, "");
        let parts = cleanHref.split("#")[0].split("?");
        return this.parsePath(parts[0]);
    }

    parsePath(path) {
        return path.replace(/^\/|\/$/g, ""); // 去掉首尾斜杠
    }

    setUrl(href = loc.href) {
        let path = this.parseUrl(href);
        this.setPath(path);
    }

    setPath(path) {
       /* path = this.parsePath(path);
        if (path !== this.currPath) {
            let url = (path || "/") + (this.queryStr ? "?" + this.queryStr : "");
            history.pushState(null, null, url);
            this._onStatePop();
        }*/
    }

    preFetch(href) {
        let path = this.parsePath(href);
        this._fetchHtml(path);
    }

    _onStatePop(event) {
        if (event) event.preventDefault();

        let path = this.parseUrl();
        if (path !== this.currPath) {
            this.currPath = path;
            this._pendingPath = path;

            if (this.base.properties.hasInitialized) {
                this._fetchHtml(path);
            } else {
                this._initDom(this._createRoute(path));
            }
        }
    }
}
