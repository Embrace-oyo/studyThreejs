/**
 * justThreeJs keyboard.js
 * @author kongjianqiu
 * @description
 * @created 2024/5/30 10:48:43
 */


/**
 * An encapsuled class to get keyboard key.
 */
export default class Keyboard {
    keys;

    constructor() {
        this.keys = {};
    }

    listenForKey() {
        window.addEventListener("keydown", (e) => {
            this.onKeyDown(e);
        });
        window.addEventListener("keyup", (e) => {
            this.onKeyUp(e);
        });
    }

    onKeyDown(e) {
        this.keys[e.key] = true;
    }

    onKeyUp(e) {
        this.keys[e.key] = false;
    }

    get isUpKeyDown() {
        return this.keys["w"] || this.keys["ArrowUp"];
    }

    get isDownKeyDown() {
        return this.keys["s"] || this.keys["ArrowDown"];
    }

    get isLeftKeyDown() {
        return this.keys["a"] || this.keys["ArrowLeft"];
    }

    get isRightKeyDown() {
        return this.keys["d"] || this.keys["ArrowRight"];
    }

    get isSpaceKeyDown() {
        return this.keys[" "];
    }

    get isEnterKeyDown() {
        return this.keys["Enter"];
    }

    get isBackspaceKeyDown() {
        return this.keys["Backspace"];
    }

    get isCtrlKeyDown() {
        return this.keys["Control"];
    }

    get isShiftKeyDown() {
        return this.keys["Shift"];
    }

    get isTabKeyDown() {
        return this.keys["Tab"];
    }

    get isEscKeyDown() {
        return this.keys["Escape"];
    }
}

