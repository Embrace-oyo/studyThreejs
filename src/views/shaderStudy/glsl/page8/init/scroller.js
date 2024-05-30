/**
 * justThreeJs scroller.js
 * @author kongjianqiu
 * @description
 * @created 2024/5/30 16:22:58
 */
import * as THREE from "three";
import { Scroller } from "maku.js";
const NormalScroller = Scroller;
/**
 * A scroller to detect `wheel` event.
 *
 * Demo: https://kokomi-playground.vercel.app/entries/#textureRecursion
 */
class WheelScroller {
    scroll;
    enabled;
    constructor() {
        this.scroll = {
            current: 0,
            target: 0,
            ease: 0.05,
            last: 0,
            delta: 0,
            direction: "",
        };
        this.enabled = true;
    }
    enable() {
        this.enabled = true;
    }
    disable() {
        this.enabled = false;
    }
    // 监听滚动
    listenForScroll() {
        window.addEventListener("wheel", (e) => {
            if (!this.enabled) {
                return;
            }
            const newScrollY = e.deltaY;
            const scrollYDelta = newScrollY;
            this.scroll.target += scrollYDelta;
        });
    }
    // 同步滚动的数据
    syncScroll() {
        this.scroll.current = THREE.MathUtils.lerp(this.scroll.current, this.scroll.target, this.scroll.ease);
        this.scroll.delta = this.scroll.current - this.scroll.last;
        this.scroll.direction = this.scroll.delta > 0 ? "down" : "up";
        this.scroll.last = this.scroll.current;
    }
}
export { NormalScroller, WheelScroller };
