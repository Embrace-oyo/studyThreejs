/**
 * justThreeJs triangle.js
 * @author kongjianqiu
 * @description
 * @created 2025/1/21 15:49:46
 */
import gsap from "gsap";

export default class Triangle {
    constructor(config) {
        this.ctx = config.ctx;
        this.pos = config.pos;
        this.col = config.col;
        this.row = config.row;
        this.colors = config.colors;
        this.triangleWidth = config.triangleWidth;
        this.triangleHeight = config.triangleHeight;
        this.alpha = this.tAlpha = 1;
        this.isLeft = (this.pos % 2);
        this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
        this.rgb = this.hexToRgb(this.color);
        this.selectedForTrail = false;
        this.opened = false;
        this.opening = false;
        this.closing = false;

        this.tX1 = (this.isLeft) ? (this.col + 1) * this.triangleWidth : this.col * this.triangleWidth;
        this.tX2 = (this.isLeft) ? this.col * this.triangleWidth : (this.col + 1) * this.triangleWidth;
        this.tX3 = (this.isLeft) ? (this.col + 1) * this.triangleWidth : this.col * this.triangleWidth;

        this.tY1 = .5 * this.row * this.triangleHeight;
        this.tY2 = .5 * (this.row + 1) * this.triangleHeight;
        this.tY3 = .5 * (this.row + 2) * this.triangleHeight;

        this.x1 = this.tX1;
        this.x2 = this.tX1;
        this.x3 = this.tX1;

        this.y1 = this.tY1;
        this.y2 = this.tY1;
        this.y3 = this.tY1;
    }

    draw() {
        this.ctx.fillStyle = 'rgba(' + this.rgb.r + ',' + this.rgb.g + ',' + this.rgb.b + ',' + this.alpha + ')';
        this.ctx.beginPath();
        this.ctx.moveTo(this.x1, this.y1);
        this.ctx.lineTo(this.x2, this.y2);
        this.ctx.lineTo(this.x3, this.y3);
        this.ctx.closePath();
        this.ctx.fill();
    }

    open(direction, targetSpeed, targetAlpha, targetDelay) {
        if (!this.opened || !this.opening) {
            if (this.tweenClose) this.tweenClose.kill();
            this.opening = true;
            this.direction = direction || "top";
            this.delay = targetDelay || 0;
            this.tAlpha = targetAlpha;
            this.tSpeed = targetSpeed || 1.5;
            if (this.direction === "side") {
                this.x1 = this.x2 = this.x3 = this.tX1;
                this.y1 = this.tY1;
                this.y2 = this.tY2;
                this.y3 = this.tY3;
            } else if (this.direction === "top") {
                this.x1 = (this.tX2 + this.tX3) / 2;
                this.x2 = this.tX2;
                this.x3 = this.tX3;
                this.y1 = (this.tY2 + this.tY3) / 2;
                this.y2 = this.tY2;
                this.y3 = this.tY3;
            } else if (this.direction === "bottom") {
                this.x1 = this.tX1;
                this.x2 = this.tX2;
                this.x3 = (this.tX1 + this.tX2) / 2;
                this.y1 = this.tY1;
                this.y2 = this.tY2;
                this.y3 = (this.tY1 + this.tY2) / 2;
            }
            this.tweenOpen = gsap.to(this, {
                x1: this.tX1,
                x2: this.tX2,
                x3: this.tX3,
                y1: this.tY1,
                y2: this.tY2,
                y3: this.tY3,
                alpha: this.tAlpha,
                duration: this.tSpeed,
                ease: gsap.easeInOut,
                delay: this.delay,
                onComplete: () => this.openComplete(),
                onCompleteParams: [this]
            });
        }
    }

    close(direction, targetSpeed, targetDelay) {
        this.direction = direction || "top";
        this.delay = targetDelay || 1;
        this.tSpeed = targetSpeed || .8;
        this.opened = false;
        this.closing = true;
        let closeX1, closeX2, closeX3, closeY1, closeY2, closeY3;

        if (this.direction === "side") {
            closeX1 = closeX2 = closeX3 = this.tX1;
            closeY1 = this.tY1;
            closeY2 = this.tY2;
            closeY3 = this.tY3;
        } else if (this.direction === "top") {
            closeX1 = (this.tX2 + this.tX3) / 2;
            closeX2 = this.tX2;
            closeX3 = this.tX3;
            closeY1 = (this.tY2 + this.tY3) / 2;
            closeY2 = this.tY2;
            closeY3 = this.tY3;
        } else if (this.direction === "bottom") {
            closeX1 = this.tX1;
            closeX2 = this.tX2;
            closeX3 = (this.tX1 + this.tX2) / 2;
            closeY1 = this.tY1;
            closeY2 = this.tY2;
            closeY3 = (this.tY1 + this.tY2) / 2;
        }
        if (this.tweenClose) this.tweenClose.kill();
        this.tweenClose = gsap.to(this, {
            x1: closeX1,
            x2: closeX2,
            x3: closeX3,
            y1: closeY1,
            y2: closeY2,
            y3: closeY3,
            alpha: 0,
            duration: this.tSpeed,
            ease: gsap.easeInOut,
            delay: this.delay,
            onComplete: () => this.closeComplete(),
            onCompleteParams: [this]
        });
    }

    openComplete() {
        this.opened = true;
        this.opening = false;
        this.closing = false;
    }

    closeComplete() {
        this.opened = false;
        this.opening = false;
        this.closing = false;
    }

    hexToRgb(hex) {
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
}
