/**
 * justThreeJs mouse.js
 * @author kongjianqiu
 * @description
 * @created 2025/3/18 09:01:53
 */
import * as THREE from "three";

export default class Mouse {
    constructor(base) {
        this.base = base;
        this.pixel = new THREE.Vector2();
        this.normal = new THREE.Vector2(.5, .5)
        this.normalFlip = new THREE.Vector2(-1, -1)
        this.tilt = new THREE.Vector2()
        this.velocity = new THREE.Vector2()
        this.width = 0
        this.height = 0
        this.lastTime = 0
        this.lastNormalFlip = new THREE.Vector2(-1, -1)
        this.down = this.down.bind(this)
        this.move = this.move.bind(this)
        this.up = this.up.bind(this)
        this.resize = this.resize.bind(this)
        this.tick = this.tick.bind(this)
        !(typeof window > "u") && this.handlers()
    }

    handlers() {
        window.addEventListener("pointerdown", this.down)
        window.addEventListener("pointermove", this.move)
        window.addEventListener("touchmove", this.move)
        window.addEventListener("pointerup", this.up)
        window.addEventListener("resize", this.resize)
        window.addEventListener("orientationchange", this.resize)
        this.resize()
        this.base.tick.add(this.tick, 70)
    }

    updateMouse(i) {
        i.changedTouches && i.changedTouches.length && (i.x = i.changedTouches[0].pageX,
            i.y = i.changedTouches[0].pageY),
        i.x === void 0 && (i.x = i.pageX,
            i.y = i.pageY),
            this.pixel.set(i.x, i.y),
            this.normal.x = this.pixel.x / this.width,
            this.normal.y = this.pixel.y / this.height,
            this.normalFlip.x = this.normal.x,
            this.normalFlip.y = 1 - this.normal.y,
            this.tilt.x = this.normalFlip.x * 2 - 1,
            this.tilt.y = this.normalFlip.y * 2 - 1
    }

    resize(width, height) {
        this.width = width;
        this.height = height
    }

    down(i) {
        this.updateMouse(i)
    }

    move(i) {
        this.updateMouse(i)
    }

    up() {
    }

    tick(i, e) {
        this.lastNormalFlip.x === -1 && this.lastNormalFlip.copy(this.normalFlip);
        const t = this.normalFlip.x - this.lastNormalFlip.x
        const s = this.normalFlip.y - this.lastNormalFlip.y;
        this.lastNormalFlip.copy(this.normalFlip);
        const o = Math.min(32, i) / 16;
        this.velocity.x = t * o
        this.velocity.y = s * o
    }
}
