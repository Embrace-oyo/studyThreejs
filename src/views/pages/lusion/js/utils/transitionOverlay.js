/**
 * justThreeJs transitionOverlay.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/25 11:09:29
 */
import MinSignal from '@/views/pages/lusion/js/utils/quickLoader/min-signal'
import {easeInOutSine, easeInSine, easeOutSine} from "easing-utils";

// 预定义的加载动画矩形数据 [x, y, width, height, ...]
const LOADING_RECTS = [
    1, 1, 1, 3, 2, 4, 2, 1, 6, 2, 1, 2, 7, 1, 1, 1, 7, 4, 1, 1,
    8, 2, 1, 2, 11, 2, 1, 3, 13, 2, 1, 3, 12, 1, 1, 1, 16, 1, 2, 1,
    18, 2, 1, 2, 16, 4, 2, 1, 22, 1, 1, 4, 26, 1, 1, 4, 27, 1, 1, 1,
    28, 2, 1, 3, 32, 1, 1, 1, 33, 3, 1, 1, 31, 1, 1, 3, 32, 4, 2, 1
];

export default class TransitionOverlay {
    // 动画比例参数
    contentShowRatio = 0;      // 内容显示比例(0-1)
    contentHideRatio = 1;      // 内容隐藏比例(0-1)
    loadBarRatio = 0;          // 加载条进度比例
    lineTransformRatio = 0;    // 线条变换比例
    showTextRatio = 0;         // 文字显示动画比例
    waitTextRatio = 0;         // 文字等待比例
    hideTextRatio = 1;         // 文字隐藏动画比例

    // 状态标志
    pixelWidth = 0;            // 像素宽度基准值
    needsShowText = false;     // 是否需要显示文字
    needsHideText = false;     // 是否需要隐藏文字
    loadingTextAnimation = 0;  // 加载文字动画状态

    // 事件信号
    onShowTextCompleted = new MinSignal();  // 文字显示完成事件
    onHideTextCompleted = new MinSignal();  // 文字隐藏完成事件
    constructor(base) {
        this.base = base;
    }

    /**
     * 初始化方法 - 获取Canvas元素和上下文
     */
    init() {
        this.canvas = document.getElementById("transition-overlay");
        this.ctx = this.canvas.getContext("2d");
    }

    /**
     * 调整尺寸
     * @param {number} width 宽度
     * @param {number} height 高度
     */
    resize(width, height) {
        // 设置Canvas实际尺寸和显示尺寸
        this.canvas.width = width * this.base.settings.DPR;
        this.canvas.height = height * this.base.settings.DPR;
        this.canvas.style.width = width + "px";
        this.canvas.style.height = height + "px";

        // 计算像素宽度(基于视口宽度)
        this.pixelWidth = ~~Math.min(42, this.base.properties.viewportWidth / 30);
    }

    /**
     * 判断是否可以隐藏
     * @return {boolean}
     */
    isReadyToHide() {
        // 待实现具体逻辑
    }

    /**
     * 获取当前活动比例(用于控制整体可见性)
     * @return {number} 0-1之间的值
     */
    get activeRatio() {
        return Math.min(1 - this.contentShowRatio, this.contentHideRatio);
    }

    /**
     * 更新过渡动画
     * @param {number} deltaTime 时间增量
     */
    update(deltaTime) {
        if (this.activeRatio > 0) {
            const width = this.base.properties.viewportWidth;
            const height = this.base.properties.viewportHeight;
            const pixelSize = this.pixelWidth;
            const loadProgress = this.loadBarRatio;
            const lineRatio = this.lineTransformRatio;
            const diagonal = Math.sqrt(width * width + height * height) / pixelSize;
            const ctx = this.ctx;

            // 保存绘图状态
            ctx.save();

            // 缩放以适应设备像素比
            ctx.scale(this.base.settings.DPR, this.base.settings.DPR);

            // 绘制黑色背景
            ctx.fillStyle = "#000";
            ctx.fillRect(0, 0, width, height);

            // 计算缓动值
            const easeValue = easeInOutSine(1 - this.activeRatio);
            const scale = (1 + easeValue * diagonal) * pixelSize;

            // 设置变换中心
            ctx.translate(width * 0.5, height * 0.5);
            ctx.rotate(easeValue * (this.contentShowRatio == 0 ? -1 : 1));
            ctx.translate(pixelSize * easeValue * diagonal, -pixelSize * 0.5 * easeValue * diagonal);
            ctx.scale(scale, scale);

            // 线条变换阶段
            if (lineRatio == 0) {
                // 绘制基础加载条
                ctx.fillStyle = "#333";
                ctx.fillRect(-2.5, -0.5, 5, 1);
                ctx.fillStyle = "#fff";
                ctx.fillRect(-2.5, -0.5, 5 * loadProgress, 1);
            }
            // 文字动画阶段
            else {
                ctx.fillStyle = "#fff";

                // 处理文字显示动画
                if (this.needsShowText) {
                    this.showTextRatio = Math.min(1, this.showTextRatio + deltaTime * 1.25);
                    if (this.showTextRatio >= 1) {
                        this.showTextRatio = 1;
                        this.needsShowText = false;
                        this.onShowTextCompleted.dispatch();
                    }
                }

                // 处理等待状态
                if (this.showTextRatio == 1) {
                    this.waitTextRatio = Math.min(1, this.waitTextRatio + deltaTime * 3);

                    // 处理文字隐藏动画
                    if (this.waitTextRatio == 1 && this.needsHideText && this.base.taskManager.percent == 1) {
                        this.hideTextRatio = Math.min(1, this.hideTextRatio + deltaTime * 1.25);
                        if (this.hideTextRatio >= 1) {
                            this.hideTextRatio = 1;
                            this.needsHideText = false;
                            this.onHideTextCompleted.dispatch();
                        }
                    }
                }

                // 计算当前动画状态
                const showRatio = this.showTextRatio;
                const hideRatio = this.hideTextRatio;
                const currentScale = this.base.math.fit(
                    Math.min(showRatio, 1 - hideRatio),
                    0, 0.5, 1, 0.2, easeInOutSine
                );
                const textOffset = (easeInOutSine(showRatio) + easeInOutSine(hideRatio)) * -15;

                // 绘制加载动画
                if (showRatio > 0 && hideRatio < 1) {
                    ctx.scale(currentScale, currentScale);
                    ctx.translate(-lineRatio, 1.5 * lineRatio);
                    ctx.translate(textOffset, 0);

                    ctx.save();
                    ctx.translate(-1.5, -4.5);
                    ctx.beginPath();

                    // 绘制预定义的加载矩形
                    for (let i = 0, count = LOADING_RECTS.length / 4, idx = 0; i < count; i++, idx += 4) {
                        ctx.fillStyle = "#fff";
                        const x = LOADING_RECTS[idx + 0];
                        const y = LOADING_RECTS[idx + 1];
                        const w = LOADING_RECTS[idx + 2];
                        const h = LOADING_RECTS[idx + 3];
                        const progress = i / (count - 1);

                        // 计算每个矩形的动画进度
                        let animProgress = this.base.math.fit(
                            showRatio,
                            progress * 0.5,
                            0.5 + progress * 0.5,
                            0, 1,
                            easeInSine
                        ) * this.base.math.fit(
                            hideRatio,
                            progress * 0.5,
                            0.5 + progress * 0.5,
                            1, 0,
                            easeOutSine
                        );

                        // 调整开头和结尾矩形的显示
                        if (showRatio < 1 && i < 2) animProgress = 1;
                        if (showRatio >= 1 && i >= count - 2) animProgress = 1;

                        // 绘制动画矩形
                        ctx.rect(
                            x + (1 - animProgress) * w * 0.5,
                            y + (1 - animProgress) * h * 0.5,
                            w * animProgress,
                            h * animProgress
                        );
                    }

                    ctx.closePath();
                    ctx.fill();
                    ctx.restore();
                }
                // 绘制线条变换效果
                else {
                    ctx.translate(-lineRatio, 1.5 * lineRatio);

                    // 绘制旋转线条
                    ctx.save();
                    ctx.translate(0.5, -0.5);
                    ctx.rotate(lineRatio * Math.PI * 0.5);
                    ctx.globalCompositeOperation = "xor";
                    ctx.fillRect(-3, 0, 3, 1);
                    ctx.globalCompositeOperation = "source-over";
                    ctx.globalAlpha = 1 - easeValue;
                    ctx.fillRect(-3, 0, 3, 1);
                    ctx.restore();

                    // 绘制静态线条
                    ctx.save();
                    ctx.translate(0.5, -0.5);
                    ctx.globalCompositeOperation = "xor";
                    ctx.fillRect(0, 0, 2, 1);
                    ctx.globalCompositeOperation = "source-over";
                    ctx.globalAlpha = 1 - easeValue;
                    ctx.fillRect(0, 0, 2, 1);
                    ctx.restore();
                }
            }

            // 恢复绘图状态
            ctx.restore();
            this.canvas.style.display = "block";
        } else {
            this.canvas.style.display = "none";
        }
    }
}
