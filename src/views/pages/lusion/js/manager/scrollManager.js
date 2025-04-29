/**
 * justThreeJs scrollManager.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/23 14:56:39
 */


class ScrollDomRange {
    constructor(domElement, isVertical, base) {
        this.base = base;
        // DOM 元素
        this.dom = domElement;

        // 滚动方向（true = 垂直，false = 水平）
        this.isVertical = isVertical;

        // 标记是否需要更新（外部滚动时设为 true）
        this.needsUpdate = true;
        this.forcedUpdate = true;

        // 屏幕上的位置（实际渲染用）
        this.screenX = 0;
        this.screenY = 0;

        // 自定义比率（进入/离开视口的进度）
        this.ratio = 0;

        // 线性比率（屏幕内的位置比例）
        this.screenRatio = 0;

        // 是否处于激活状态（是否在视口中）
        this.isActive = false;

        // 原始位置（相对于整个页面）
        this._left = 0;
        this._right = 0;
        this._top = 0;
        this._bottom = 0;

        // 偏移后位置（加 offset 后）
        this.left = 0;
        this.right = 0;
        this.top = 0;
        this.bottom = 0;

        // 尺寸
        this.width = 0;
        this.height = 0;

        // 显示/隐藏的距离比率，用于动画辅助
        this.showScreenOffset = 0;
        this.hideScreenOffset = 0;
    }

    /**
     * 更新元素的位置和比率信息
     * @param {number} scrollPixel 当前滚动像素值（如 scrollTop 或 scrollLeft）
     * @param {number} viewSizePixel 视口大小（如 window.innerHeight）
     * @param {number} offset 偏移值（人为提前触发）
     * @param {boolean} forceUpdate 是否强制刷新
     */
    update(scrollPixel, viewSizePixel, offset = 0, forceUpdate = false) {
        const shouldUpdate = forceUpdate || this.needsUpdate;

        if (shouldUpdate) {
            const rect = this.dom.getBoundingClientRect();

            // 标记更新完成
            this.needsUpdate = false;
            this.forcedUpdate = false;

            // 原始位置（相对于视口）
            this._left = rect.left;
            this._right = rect.right;
            this._top = rect.top;
            this._bottom = rect.bottom;

            // 尺寸
            this.width = rect.width;
            this.height = rect.height;

            // 转换为页面绝对位置（添加滚动量）
            if (this.isVertical) {
                this._top += scrollPixel;
                this._bottom += scrollPixel;
            } else {
                this._left += scrollPixel;
                this._right += scrollPixel;
            }
        }

        // 复制边界
        this.left = this._left;
        this.right = this._right;
        this.top = this._top;
        this.bottom = this._bottom;

        // 应用偏移量（提前/延后触发）
        if (this.isVertical) {
            this.top += offset;
            this.bottom += offset;
        } else {
            this.left += offset;
            this.right += offset;
        }

        // 当前在屏幕上的位置
        this.screenX = this.left;
        this.screenY = this.top;

        // 计算相对于视口的偏移（从页面绝对位置减去 scroll）
        let position;
        if (this.isVertical) {
            position = this.screenY -= scrollPixel;
        } else {
            position = this.screenX -= scrollPixel;
        }

        // 方向相关的尺寸
        const size = this.isVertical ? this.height : this.width;

        // 计算进入和离开视口的比率（用于动画控制）
        this.ratio =
            Math.min(0, this.base.math.unClampedFit(position, viewSizePixel, viewSizePixel - size, -1, 0)) +
            Math.max(0, this.base.math.unClampedFit(position, 0, -size, 0, 1));

        // 屏幕比率（线性，用于控制透明度、缩放等）
        this.screenRatio = this.base.math.fit(position, viewSizePixel, -size, -1, 1);

        // 进入/离开屏幕的偏移百分比（辅助动画触发点）
        this.showScreenOffset = -(position - viewSizePixel) / viewSizePixel;
        this.hideScreenOffset = -(position + size) / viewSizePixel;

        // 当前是否在屏幕内（或附近）范围
        this.isActive = this.ratio >= -1 && this.ratio <= 1;
    }
}


class ScrollPane {
    lockOnDirection = true; // 锁定方向
    isActive = false; // 是否激活
    x; // X轴坐标
    y; // Y轴坐标
    viewDom; // 视图DOM元素
    contentDom; // 内容DOM元素
    isVertical = true; // 是否垂直滚动
    targetScrollPixel = 0; // 目标滚动像素
    scrollViewDelta = 0; // 滚动视图变化量
    viewWidthPixel = 0; // 视图宽度像素
    viewHeightPixel = 0; // 视图高度像素
    contentSize = 0; // 内容尺寸
    contentSizePixel = 0; // 内容尺寸像素
    scrollView = 0; // 滚动视图
    progress = 0; // 滚动进度
    minScrollPixel = 0.1; // 最小滚动像素
    viewSizePixel = 1; // 视图大小像素
    domRanges = new Map(); // DOM范围映射
    useResizeObserver = true; // 是否使用ResizeObserver
    tick = -1; // 更新周期
    lastResizeTick = -1; // 上次调整大小周期
    resizeObserveTick = -1; // 调整大小观察周期
    hasResizeObserved = false; // 是否已观察到调整大小
    autoScrollSpeed = 0; // 自动滚动速度
    autoScrollRatio = 0; // 自动滚动比例
    skipAutoScroll = false; // 是否跳过自动滚动
    dragHistory = []; // 拖动历史记录
    dragHistoryMaxTime = 0.1; // 拖动历史最大时间
    isWheelScrolling = false; // 是否正在使用滚轮滚动
    frictionCoeffFrom = 2.1; // 摩擦系数起始值
    frictionCoeffTo = 1.9; // 摩擦系数终止值
    frictionCoeffWeightDivisor = 5; // 摩擦系数权重除数
    minVelocity = -1; // 最小速度
    wheelEaseCoeff = 12; // 滚轮平滑系数
    scrollPixel = 0; // 当前滚动像素
    constructor(base) {
        this.base = base;
        this.scrollMultiplier = (this.base.browser.isMobile, 1); // 滚动倍率
    }

    init(e = {}) {
        Object.assign(this, e);

        // 使用 ResizeObserver 观察内容DOM元素
        if (this.contentDom && this.useResizeObserver && window.ResizeObserver) {
            new ResizeObserver(this._onResizeObserve.bind(this)).observe(this.contentDom);
        }

        // 监听键盘事件，控制页面滚动
        document.documentElement.addEventListener("keydown", t => {
            if (this.isMoveable) {
                if (this.isVertical) {
                    if (t.key === "ArrowUp") {
                        this.scrollToPixel(this.scrollPixel - 100);
                    } else if (t.key === "ArrowDown") {
                        this.scrollToPixel(this.scrollPixel + 100);
                    }
                } else {
                    if (t.key === "ArrowLeft") {
                        this.scrollToPixel(this.scrollPixel - 100);
                    } else if (t.key === "ArrowRight") {
                        this.scrollToPixel(this.scrollPixel + 100);
                    }
                }

                if (t.key === "PageUp") {
                    this.scrollToPixel(this.scrollPixel - this.viewSizePixel);
                } else if (t.key === "PageDown") {
                    this.scrollToPixel(this.scrollPixel + this.viewSizePixel);
                }
            }
        });
    }

    _onResizeObserve() {
        this.hasResizeObserved = true;
        this.resizeObserveTick = this.tick;
    }

    getDomRange(e, t = 0, r = false) {
        let n = this.domRanges.get(e);
        if (!n) {
            this.domRanges.set(e, n = new ScrollDomRange(e, this.isVertical, this.base));
        }
        n.update(this.scrollPixel, this.viewSizePixel, t, r);
        return n;
    }

    scrollTo(e, t = 0, r = false) {
        if (typeof e === "string") {
            e = document.getElementById(e);
        }
        if (e) {
            let n = this.getDomRange(e);
            this.scrollToPixel(n.top + t * this.viewSizePixel, r);
        }
    }

    scrollToPixel(e = 0, t = false) {
        e = this._clampScrollPixel(e);
        if (t) {
            this.resetScroll(e);
            this.progress = this.contentSize > 0 ? e / this.contentSizePixel : 0;
        } else {
            this.resetScroll(this.scrollPixel);
            this.targetScrollPixel = e;
            this.isWheelScrolling = true;
            this.skipAutoScroll = true;
        }
        this.syncDom();
    }

    getEaseInOutOffset(e, t, r = 0, n = 0.5) {
        let a = 1.5 + n;
        let l = (a - 1) * 2 + r;
        let c = 0, u = a, f = u + r, p = f + a;
        let g = t * p / l;
        let v = e + g * 0.5 - t * 0.5;
        let _ = Math.min(1, v / g);
        if (_) {
            let M = _ * p;
            let T = M;
            if (M > c && M <= u) {
                let S = (M - c) / (u - c);
                T = this.base.math.cubicBezier(c, (u - c) / 3 + c, 1, 1, S);
            } else if (M > u && M <= f) {
                T = 1;
            } else if (M > f && M <= p) {
                let S = (M - f) / (p - f);
                T = this.base.math.cubicBezier(1, 1, -(p - f) / 3 + 2, 2, S);
            } else if (M > p) {
                T = M - l;
            }
            return (M - T) / l * t;
        }
        return 0;
    }

    resize(e, t) {
        this.domRanges.forEach(n => {
            n.needsUpdate = true;
        });

        if (this.viewDom) {
            let n = this.viewDom.getBoundingClientRect();
            e = n.width;
            t = n.height;
        }

        this.viewWidthPixel = e;
        this.viewHeightPixel = t;

        let r = this.isVertical ? t : e;
        if (this.contentDom) {
            let n = this.contentDom.getBoundingClientRect();
            this.contentSize = Math.max(0, (this.isVertical ? n.height : n.width) / r - 1);
        }

        this.contentSizePixel = Math.floor(this.contentSize * r);
        this.targetScrollPixel = this.contentSizePixel * this.progress;
        this.resetScroll(this.targetScrollPixel);
        this.viewSizePixel = r;
        this.lastResizeTick = this.tick;
        this.syncDom();
    }

    _clampScrollPixel(e) {
        return this.base.math.clamp(e, 0, this.contentSizePixel);
    }

    resetScroll(e) {
        this.targetScrollPixel = this.scrollPixel = e;
        this.velocityPixel = 0;
        this.dragHistory.length = 0;
    }

    update(e, t) {
        if (this.hasResizeObserved) {
            this.hasResizeObserved = false;
            if (this.resizeObserveTick !== this.lastResizeTick) {
                this.resize(this.viewWidthPixel, this.viewHeightPixel);
            }
        }

        let r = this.scrollView;
        let n = this.base.input.isDown && (!this.lockOnDirection && (this.base.input.isDragScrollingY || this.base.input.isDragScrollingX) || this.isVertical && this.base.input.isDragScrollingY || !this.isVertical && this.base.input.isDragScrollingX);
        let a = 0;

        if (this.base.input.isDown && !this.base.input.wasDown) {
            this.dragHistory.length = 0;
        }

        if (this.isMoveable) {
            let l = 0;
            if (this.isVertical) {
                if (this.base.input.isWheelScrolling || this.base.input.isDragScrollingY) {
                    l = this.base.input.deltaScrollY;
                } else if (!this.lockOnDirection && this.base.input.isDragScrollingX) {
                    l = -this.base.input.deltaPixelXY.y + this.base.input.deltaWheel;
                }
            } else {
                if (this.base.input.isWheelScrolling || this.base.input.isDragScrollingX) {
                    l = this.base.input.deltaScrollX;
                } else if (!this.lockOnDirection && this.base.input.isDragScrollingY) {
                    l = -this.base.input.deltaPixelXY.x + this.base.input.deltaWheel;
                }
            }

            if (this.base.input.isWheelScrolling) {
                this.isWheelScrolling = true;
            }

            if (l !== 0) {
                this.skipAutoScroll = false;
            }

            this.autoScrollRatio = this.base.math.saturate(this.autoScrollRatio + (Math.abs(this.autoScrollSpeed) > 0 && l == 0 ? e : -1));

            let c = this.autoScrollSpeed * this.viewSizePixel * e * (this.skipAutoScroll ? 0 : this.autoScrollRatio);
            let u = this.base.properties.time;

            if (n) {
                for (this.dragHistory.push({
                    time: u,
                    deltaTime: e,
                    deltaPixel: l
                }); this.dragHistory.length > 0 && u - this.dragHistory[0].time > this.dragHistoryMaxTime;) {
                    this.dragHistory.shift();
                }
                this.targetScrollPixel = this.scrollPixel;
                this.isWheelScrolling = false;
                a = l;
            } else if (this.base.input.isDown && this.resetScroll(this.scrollPixel), this.isWheelScrolling) {
                this.dragHistory.length = 0;
                this.velocityPixel = 0;
                this.targetScrollPixel += l;
                this.targetScrollPixel = this._clampScrollPixel(this.targetScrollPixel);
                let f = this.targetScrollPixel - this.scrollPixel;
                a = f * (1 - Math.exp(-this.wheelEaseCoeff * e));
                if (Math.abs(f) < this.minScrollPixel) {
                    a = f;
                    this.isWheelScrolling = false;
                }
            } else {
                if (this.dragHistory.length > 0) {
                    let g = 0;
                    let v = 0;

                    for (let _ = 0; _ < this.dragHistory.length; _++) {
                        let T = this.dragHistory[_];
                        if (T.time > 0) {
                            let M = T.deltaPixel / T.deltaTime;
                            let S = T.deltaTime;
                            let b = this.dragHistory.length == 1 ? 1 : (T.time - this.dragHistory[0].time) / this.dragHistoryMaxTime;
                            let C = S * b;
                            v += M * C;
                            g += C;
                        }
                    }

                    this.velocityPixel = v / g;
                    this.dragHistory.length = 0;
                }

                let p = -this.base.math.mix(this.frictionCoeffFrom, this.frictionCoeffTo, this.base.math.clamp(Math.abs(this.velocityPixel / this.viewSizePixel / this.frictionCoeffWeightDivisor), 0, 1)) * this.velocityPixel;
                this.velocityPixel += p * e;
                a = this.velocityPixel * e;
            }

            this.targetScrollPixel += c;
            this.scrollPixel += c;
        }

        this.scrollPixel = this._clampScrollPixel(this.scrollPixel + a);
        this.scrollView = this.scrollPixel / this.viewSizePixel;
        this.scrollViewDelta = this.scrollView - r;
        this.progress = this.contentSize > 0 ? this.scrollPixel / this.contentSizePixel : 0;

        if (Math.abs(this.targetScrollPixel - this.scrollPixel) < this.minScrollPixel) {
            this.scrollPixel = this.targetScrollPixel;
        }

        if (Math.abs(this.velocityPixel) <= this.minVelocity) {
            this.velocityPixel = 0;
        }

        this.isScrolling = this.targetScrollPixel !== this.scrollPixel || Math.abs(this.velocityPixel) > 0;
        this.syncDom();
        this.tick++;
    }

    syncDom() {
        if (this.contentDom) {
            this.x = 0;
            this.y = 0;
            if (this.isVertical) {
                this.y = -this.scrollPixel;
            } else {
                this.x = -this.scrollPixel;
            }
            this.contentDom.style.transform = `translate3d(${this.x}px, ${this.y}px, 0)`;
        }
    }

    get isMoveable() {
        // return this.isActive && !videoOverlay.isOpened && pagesManager.isIdle && !header.menu.opened && this.contentSize > 0 && (!this.viewDom || this.base.input.hasThroughElem(this.viewDom, "down"))
        return true
    }
}

export default class ScrollManager extends ScrollPane {
    domScrollIndicator;                  // 滚动条容器 DOM 元素
    domScrollIndicatorHeight = 1;        // 滚动条容器高度
    domScrollIndicatorBar;               // 滚动条实际可动的进度条 DOM
    scrollIndicatorActiveRatio = 0;      // 指示条透明度的激活程度（0~1）
    lastMouseInteractiveTime = -Infinity;// 上一次交互时间
    isIndicatorActive = undefined;       // 是否激活指示器
    easedScrollStrength = 0;             // 缓动滚动强度
    frameIdx = -1;                       // 当前帧编号
    MIN_BAR_SCALE_Y = 0.2;               // 指示器最小缩放值
    constructor(base) {
        super(base);
        this.base = base;
    }

    init() {
        super.init({
            contentDom: document.getElementById("page-container"),              // 主内容容器
            domScrollIndicator: document.getElementById("scroll-indicator"),    // 滚动条容器
            domScrollIndicatorBar: document.getElementById("scroll-indicator-bar") // 滚动条条本体
        });
    }

    resize(width, height) {
        super.resize(width, height);
        // 更新滚动条容器的高度
        this.domScrollIndicatorHeight = this.domScrollIndicator.getBoundingClientRect().height;
    }

    update(dt) {
        super.update(dt, this.scrollValue);

        // 计算缓动滚动强度
        this.easedScrollStrength += Math.abs(this.scrollViewDelta);
        this.easedScrollStrength += (0 - this.easedScrollStrength) * (1 - Math.exp(-10 * dt));
        this.easedScrollStrength = Math.min(this.easedScrollStrength, 1);

        // 记录交互时间
        if (Math.abs(this.scrollViewDelta) > 0) {
            this.lastMouseInteractiveTime = this.base.properties.time;
            this.isIndicatorActive = true;
        } else if (this.base.properties.time > this.lastMouseInteractiveTime + 0.5) {
            this.isIndicatorActive = false;
        }

        // 缓动激活状态，改变透明度
        this.scrollIndicatorActiveRatio = this.base.math.clamp(
            this.scrollIndicatorActiveRatio + (this.isIndicatorActive ? 2 : -2) * dt,
            0, 1
        );
        this.domScrollIndicator.style.opacity = this.scrollIndicatorActiveRatio;

        // 计算滚动条高度和位置
        let scaleY = 1;
        let offsetRatio = 0;

        if (this.contentSize > 0) {
            scaleY = Math.max(this.MIN_BAR_SCALE_Y, 1 / (1 + this.contentSize));
            offsetRatio = this.scrollView / this.contentSize * (1 - scaleY);
        }

        this.domScrollIndicatorBar.style.height = (this.domScrollIndicatorHeight * scaleY) + "px";
        this.domScrollIndicatorBar.style.transform = `translate3d(0, ${this.domScrollIndicatorHeight * offsetRatio}px, 0)`;

        this.frameIdx++;
    }

    get isMoveable() {
        return super.isMoveable;
    }
}
