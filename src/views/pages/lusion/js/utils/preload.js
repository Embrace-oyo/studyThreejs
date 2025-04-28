/**
 * justThreeJs preload.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/25 11:08:32
 */
import {easeInOutSine} from "easing-utils";

export default class Preloader {
    percentTarget = 0;
    percent = 0;
    percentToStart = 0;

    DELAY = 1.5;
    MIN_PRELOAD_DURATION = 1;
    PERCENT_BETWEEN_INIT_AND_START = 0.3;
    MIN_DURATION_BETWEEN_INIT_AND_START = 0.25;
    HIDE_DURATION = 0.5;

    isActive = false;
    lineTransformTime = 0;
    digitsWidth = 0;

    constructor(base) {
        this.base = base;
    }

    preInit() {
        this.domContainer = document.getElementById("preloader");
        this.domDigitsContainer = document.getElementById("preloader-percent-digits");
        this.domDigits = document.querySelectorAll(".preloader-percent-digit");

        for (let i = 0; i < this.domDigits.length; i++) {
            const digit = this.domDigits[i];
            digit._domNums = digit.querySelectorAll(".preloader-percent-digit-num");
            digit._easedVal = 0;
        }
    }

    init() {
        // 初始化逻辑留空，可根据需要扩展
    }

    show(initCallback, startCallback) {
        this._initCallback = initCallback;
        this._startCallback = startCallback;
        this.isActive = true;

        this.base.properties.loader.start((progress) => {
            this.percentTarget = progress;
        });
    }

    hide() {
        // 隐藏逻辑留空，可按需要实现
    }

    resize(width, height, force = false) {
        if (!force) {
            this.digitsWidth = this.domDigitsContainer.offsetWidth;
        }
    }

    update(dt) {
        if (!this.isActive) return;

        // 百分比缓动更新
        if (this.base.settings.SKIP_ANIMATION) {
            this.percent = this.percentTarget;
        } else if (this.percentTarget > this.percent) {
            this.percent += dt / this.MIN_PRELOAD_DURATION;
        }
        this.percent = Math.min(this.percent, this.percentTarget);

        // 初始化回调触发
        if (this.percentTarget === 1 && !this.base.properties.hasInitialized) {
            this._initCallback();
        }

        // 百分比推进到启动阶段
        if (this.base.settings.SKIP_ANIMATION) {
            this.percentToStart = 1;
        } else {
            this.percentToStart = Math.min(
                this.base.taskManager.percent,
                this.percentToStart + dt / this.MIN_DURATION_BETWEEN_INIT_AND_START
            );
        }

        const blendPercent = this.percentToStart * this.PERCENT_BETWEEN_INIT_AND_START
            + this.percent * (1 - this.PERCENT_BETWEEN_INIT_AND_START);

        // 启动线条动画
        let lineRatio = 0;
        if (blendPercent === 1) {
            this.lineTransformTime += this.base.settings.SKIP_ANIMATION ? 1 : dt;
            lineRatio = easeInOutSine(this.base.math.saturate(this.lineTransformTime));
        }

        // 启动回调触发
        if (lineRatio === 1 && !this.base.properties.hasStarted) {
            this._startCallback();
        }

        const showRatio = this.base.settings.SKIP_ANIMATION
            ? Number(this.base.properties.hasStarted)
            : this.base.math.saturate(this.base.properties.startTime);

        // 更新数字滚动动画
        for (let i = 0; i < this.domDigits.length; i++) {
            const digit = this.domDigits[i];

            const base = Math.pow(10, this.domDigits.length - i - 1);
            const currentVal = Math.floor((blendPercent * 100) / base);

            digit._easedVal = this.base.math.mix(digit._easedVal, currentVal, 1 - Math.exp(-7 * dt));

            if (Math.abs(currentVal - digit._easedVal) < 0.01) {
                digit._easedVal = currentVal;
            }

            const u = digit._easedVal % 10;
            const low = Math.floor(u);
            const high = Math.ceil(u) % 10;
            const g = u - low;

            digit._domNums[0].innerHTML = low;
            digit._domNums[1].innerHTML = high;

            const yOffset = -(g - easeInOutSine(this.base.math.saturate(showRatio * 1.2 - 0.2 * i / (this.domDigits.length - 1)))) * 50;
            digit.style.transform = `translateY(${yOffset}%) translateY(-0.05em)`;
        }

        // 将进度数据绑定到 UI 控制器
        this.base.transitionOverlay.loadBarRatio = blendPercent;
        this.base.transitionOverlay.lineTransformRatio = lineRatio;
        this.base.transitionOverlay.contentShowRatio = showRatio;

        // 结束预加载
        if (showRatio === 1) {
            this.domContainer.style.display = "none";
            this.isActive = false;
        }
    }
}
