/**
 * justThreeJs frag.js
 * @author kongjianqiu
 * @description
 * @created 2024/5/30 17:46:17
 */


import Component from "@/util/common/component.js";
// 获取设备类型
const detectDeviceType = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        ? "Mobile"
        : "Desktop";
};

/**
 * A detecter to detect `drag` event.
 */
export default class DragDetecter extends Component {
    isDragging;
    isCursorChanged;
    enabled;

    constructor(base, config = {}) {
        super(base);
        const {isCursorChanged = true} = config;
        this.isCursorChanged = isCursorChanged;
        this.isDragging = false;
        this.enabled = true;
    }

    detectDrag() {
        const deviceType = detectDeviceType();
        const downEventName = {
            Mobile: "touchstart",
            Desktop: "mousedown",
        }[deviceType];
        const upEventName = {
            Mobile: "touchend",
            Desktop: "mouseup",
        }[deviceType];
        const moveEventName = {
            Mobile: "touchmove",
            Desktop: "mousemove",
        }[deviceType];
        this.changeCursorGrab();
        window.addEventListener(downEventName, () => {
            if (!this.enabled) {
                this.endDrag();
                return;
            }
            this.isDragging = true;
            this.changeCursorGrabbing();
            this.emit("dragstart");
        });
        window.addEventListener(upEventName, () => {
            if (!this.enabled) {
                this.endDrag();
                return;
            }
            this.isDragging = false;
            this.changeCursorGrab();
            this.emit("dragend");
        });
        window.addEventListener(moveEventName, () => {
            if (!this.enabled) {
                this.endDrag();
                return;
            }
            if (this.isDragging) {
                this.emit("drag", this.base.iMouse.mouseDOMDelta);
            }
        });
    }

    enable() {
        this.enabled = true;
    }

    disable() {
        this.enabled = false;
    }

    changeCursorGrab() {
        const canvasEl = this.base.renderer.domElement;
        if (this.isCursorChanged) {
            canvasEl.style.cursor = "grab";
        }
    }

    changeCursorGrabbing() {
        const canvasEl = this.base.renderer.domElement;
        if (this.isCursorChanged) {
            canvasEl.style.cursor = "grabbing";
        }
    }

    resetCursor() {
        const canvasEl = this.base.renderer.domElement;
        canvasEl.style.cursor = "auto";
    }

    endDrag() {
        this.isDragging = false;
        this.resetCursor();
    }
}
