/**
 * justThreeJs whoSubsectionDetails.js
 * @author kongjianqiu
 * @description
 * @created 2025/5/6 16:34:19
 */


/**
 * WhoSubsectionDetails 类 - 处理"关于我们"页面中WHO子部分的详细内容展示
 */
export default class WhoSubsectionDetails {
    domContainer;       // 主DOM容器元素
    activeFaceId = -1;   // 当前激活的面部ID
    domTopWords;        // 顶部文字DOM元素集合
    domBottomWords;     // 底部文字DOM元素集合
    constructor(base) {
        this.base = base.base;
        this.parent = base;
    }

    /**
     * 预初始化方法 - 在正式初始化前准备DOM元素
     * @param {HTMLElement} e - 父容器元素
     */
    preInit(e) {
        // 获取主容器
        this.domContainer = e.querySelector("#about-who-subsection-details");
        // 获取顶部和底部描述元素
        let t = this.domContainer.querySelector("#about-who-desc-top");
        let r = this.domContainer.querySelector("#about-who-desc-bottom");
        // 解析DOM文本并保存结果
        this.domTopWords = this._parseDomText(t)
        this.domBottomWords = this._parseDomText(r)
    }

    /**
     * 私有方法 - 解析DOM文本并将其拆分为span元素
     * @param {HTMLElement} e - 要解析的DOM元素
     * @returns {NodeList} 包含所有span子元素的集合
     */
    _parseDomText(e) {
        // 获取所有span元素
        let t = e.querySelectorAll("span");
        // 遍历每个span
        for (let r = 0; r < t.length; r++) {
            let n = t[r]
            let a = t[r].innerHTML.split(" ");  // 按空格分割文本
            // 用span包裹每个单词
            n.innerHTML = "<span>" + a.join("</span><span>") + "</span>"
        }
        // 返回所有新创建的span元素
        return e.querySelectorAll("span span")
    }

    /**
     * 初始化方法 (目前为空)
     */
    init() {
    }

    /**
     * 显示方法 (目前为空)
     */
    show() {
    }

    /**
     * 隐藏方法 (目前为空)
     */
    hide() {
    }

    /**
     * 调整大小和布局
     * @param {number} e - 宽度参数 (未使用)
     * @param {number} t - 高度参数 (未使用)
     */
    resize(e, t) {
        let r;
        // 处理顶部文字
        r = this.domTopWords;
        let n = Infinity,  // 最小左边界
            a = -1;        // 行计数器

        // 计算顶部文字的行布局
        for (let l = 0; l < r.length; l++) {
            let c = r[l];
            // 重置样式
            c.style.transform = "translateZ(0)";
            c.style.opacity = 1;

            // 获取元素左边界位置
            let u = c.getBoundingClientRect().left;
            // 如果左边界小于当前最小值，增加行计数
            u <= n && a++,
                n = u + 1,  // 更新最小左边界
                c._line = a  // 记录元素所在行
        }
        this.domTopWords._lineCount = a + 1;  // 保存总行数

        // 处理底部文字 (逻辑类似，但使用右边界)
        r = this.domBottomWords,
            n = Infinity,
            a = -1;
        for (let l = 0; l < r.length; l++) {
            let c = r[l];
            c.style.transform = "translateZ(0)";
            c.style.opacity = 1;
            let u = c.getBoundingClientRect().right;
            u <= n && a++,
                n = u + 1,
                c._line = a
        }
        this.domBottomWords._lineCount = a + 1
    }

    /**
     * 更新元素状态
     * @param {number} e - 滚动位置或动画进度
     * @param {boolean} t - 是否可见
     * @param {number} r - 动画进度 (0到1之间)
     */
    update(e, t, r) {
        // 设置容器可见性
        this.domContainer.style.visibility = t ? "visible" : "hidden";

        if (t) {
            let n = 0;  // 不透明度

            // 移动端布局处理
            if (this.base.properties.useMobileLayout) {
                n = this.base.math.fit(r, -.75, -.25, 0, 1) * this.base.math.fit(r, .25, .5, 1, 0);
            }
            // 桌面端布局处理
            else {
                n = 1;
                let a, l;

                // 处理顶部文字动画
                a = this.domTopWords,
                    l = a._lineCount;
                for (let c = 0; c < a.length; c++) {
                    let u = a[c],
                        f = u._line / l,          // 行位置比例
                        p = c / a.length;         // 元素位置比例

                    // 计算各种动画参数
                    let g = this.base.math.fit(r, -1 + f * .5, -.1, 0, 1),
                        v = this.base.math.fit(r, -1 + p * .5, -.1, 0, 1),
                        _ = this.base.math.fit(r, .1, .5 + f * .5, 0, 1),
                        T = this.base.math.fit(r, .1, .5 + p * .5, 0, 1);

                    // 应用变换和透明度
                    u.style.transform = "translate3d(" +
                        (this.base.math.fit(g, 0, 1, 10, 0) + this.base.math.fit(_, 0, 1, 0, -10)) +
                        "em, 0, 0) translate3d(" +
                        (this.base.math.fit(r, -1, 0, -50, 0) + this.base.math.fit(r, .1, 1, 0, 20)) +
                        "vw, 0, 0)";
                    u.style.opacity = v * (1 - T);
                }

                // 处理底部文字动画 (逻辑类似)
                a = this.domBottomWords,
                    l = a._lineCount;
                for (let c = 0; c < a.length; c++) {
                    let u = a[c],
                        f = u._line / l,
                        p = c / a.length,
                        g = this.base.math.fit(r, -.6 + f * .5, -.1, 0, 1),
                        v = this.base.math.fit(r, -.6 + p * .5, -.1, 0, 1),
                        _ = this.base.math.fit(r, .2, .5 + f * .5, 0, 1),
                        T = this.base.math.fit(r, .2, .5 + p * .5, 0, 1);

                    u.style.transform = "translate3d(" +
                        (this.base.math.fit(g, 0, 1, 10, 0) + this.base.math.fit(_, 0, 1, 0, -10)) +
                        "em, 0, 0) translate3d(" +
                        (this.base.math.fit(r, -1, 0, -20, 0) + this.base.math.fit(r, 0, 1, 0, 50)) +
                        "vw, 0, 0)";
                    u.style.opacity = v * (1 - T);
                }
            }
            // 设置容器不透明度
            this.domContainer.style.opacity = n;
        }
    }
}
