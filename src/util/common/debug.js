/**
 * justThreeJs debug.js
 * @author kongjianqiu
 * @description
 * @created 2024/5/30 17:30:11
 */

// import * as dat from "lil-gui";
import {GUI} from 'three/examples/jsm/libs/lil-gui.module.min.js';

export default class Debug {
    constructor(base) {
        this.active = window.location.hash.indexOf('debug') > -1
        if (this.active) {
            this.ui = new GUI({container: base.container});
        }
    }
}
