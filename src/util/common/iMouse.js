/**
 * justThreeJs iMouse.js
 * @author kongjianqiu
 * @description
 * @created 2024/5/30 14:14:48
 */
import * as THREE from "three";
import Component from "@/util/common/component.js";

// 获取设备类型
const detectDeviceType = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        ? "Mobile"
        : "Desktop";
};

export default class IMouse extends Component {

    mouseDOM;
    mouseScreen;
    prevMouseDOM;
    isMouseMoving;
    mouseMoveOffset;
    mouseDOMDelta;

    constructor(base) {
        super(base);
        const mouse = new THREE.Vector2(0, 0);
        this.mouse = mouse;
        const mouseDOM = new THREE.Vector2(0, 0);
        this.mouseDOM = mouseDOM;
        const mouseScreen = new THREE.Vector2(0, 0);
        this.mouseScreen = mouseScreen;
        this.prevMouseDOM = new THREE.Vector2(0, 0);
        this.isMouseMoving = false;
        this.mouseMoveOffset = 4;
        this.mouseDOMDelta = new THREE.Vector2(0, 0);
    }

    getMouse(x, y) {
        const mouse = new THREE.Vector2(x, window.innerHeight - y);
        return mouse;
    }

    getMouseDOM(x, y) {
        const mouseDOM = new THREE.Vector2(x, y);
        return mouseDOM;
    }

    getMouseScreen(x, y) {
        const mouseScreen = new THREE.Vector2(x - window.innerWidth / 2, -(y - window.innerHeight / 2));
        return mouseScreen;
    }

    listenForMouse() {
        const deviceType = detectDeviceType();
        if (deviceType === "Desktop") {
            this.listenForDesktop();
        } else if (deviceType === "Mobile") {
            this.listenForMobile();
        }
    }

    listenForDesktop() {
        window.addEventListener("mousemove", (e) => {
            const iMouseNew = this.getMouse(e.clientX, e.clientY);
            this.mouse = iMouseNew;
            const mouseDOM = this.getMouseDOM(e.clientX, e.clientY);
            this.mouseDOM = mouseDOM;
            const mouseScreen = this.getMouseScreen(e.clientX, e.clientY);
            this.mouseScreen = mouseScreen;
        });
    }

    listenForMobile() {
        window.addEventListener("touchstart", (e) => {
            const iMouseNew = this.getMouse(e.touches[0].clientX, e.touches[0].clientY);
            this.mouse = iMouseNew;
            const mouseDOM = this.getMouseDOM(e.touches[0].clientX, e.touches[0].clientY);
            this.mouseDOM = mouseDOM;
            const mouseScreen = this.getMouseScreen(e.touches[0].clientX, e.touches[0].clientY);
            this.mouseScreen = mouseScreen;
        });
        window.addEventListener("touchmove", (e) => {
            const iMouseNew = this.getMouse(e.touches[0].clientX, e.touches[0].clientY);
            this.mouse = iMouseNew;
            const mouseDOM = this.getMouseDOM(e.touches[0].clientX, e.touches[0].clientY);
            this.mouseDOM = mouseDOM;
            const mouseScreen = this.getMouseScreen(e.touches[0].clientX, e.touches[0].clientY);
            this.mouseScreen = mouseScreen;
        });
    }

    syncMouseDOM() {
        this.prevMouseDOM.x = this.mouseDOM.x;
        this.prevMouseDOM.y = this.mouseDOM.y;
    }

    judgeIsMouseMoving() {
        if (Math.abs(this.mouseDOMDelta.x) < this.mouseMoveOffset &&
            Math.abs(this.mouseDOMDelta.y) < this.mouseMoveOffset) {
            this.isMouseMoving = false;
        } else {
            this.isMouseMoving = true;
        }
    }

    getMouseDOMDelta() {
        const x = this.mouseDOM.x - this.prevMouseDOM.x;
        const y = this.mouseDOM.y - this.prevMouseDOM.y;
        const mouseDOMDelta = new THREE.Vector2(x, y);
        this.mouseDOMDelta = mouseDOMDelta;
    }

    update(time) {
        this.getMouseDOMDelta();
        this.judgeIsMouseMoving();
        this.syncMouseDOM();
    }
}
