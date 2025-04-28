/**
 * justThreeJs route.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/25 13:10:11
 */

export default class Route {
    constructor(path) {
        this.path = path;                              // 路由路径，例如 "/about/team"
        this.pathNodes = path ? path.split("/") : [];  // 拆分路径为数组，例如 ["about", "team"]
        this.target = null;                            // 匹配成功后的目标页面对象
        this.title = "";                               // 页面标题
        this.dom = null;                               // 页面 DOM 容器
        this.scrollNavPath = "";                       // 滚动导航跳转路径
        this.scrollNavText = "";                       // 滚动导航显示文本
        this.hasContentPreloaded = false;              // 是否已经预加载内容
        this.content = {};                             // 页面内容对象
    }

    /**
     * 设置页面标题、容器、滚动导航路径和文本
     * @param {string} title - 页面标题
     * @param {HTMLElement} dom - 页面容器元素
     * @param {string} scrollPath - 滚动跳转路径
     * @param {string} scrollText - 滚动提示文本
     */
    setTitleDom(title, dom, scrollPath, scrollText) {
        this.title = title;
        this.dom = dom;
        this.scrollNavPath = scrollPath;
        this.scrollNavText = scrollText;
    }

    /**
     * 在给定的路由匹配规则中查找目标页面对象
     * @param {Array} routes - 包含正则表达式和 target 的路由匹配配置
     */
    setTarget(routes) {
        let matched = null;

        for (let i = 0; i < routes.length; i++) {
            let routeEntry = routes[i];
            if (routeEntry.regExp.test(this.path)) {
                matched = routeEntry;
                break;
            }
        }

        if (!matched) {
            console.error("route not found for path: " + this.path);
            window.location.href = window.location.origin; // fallback to home
        } else {
            this.target = matched.target;
        }
    }
}
