/**
 * justThreeJs clock.js
 * @author kongjianqiu
 * @description
 * @created 2024/5/30 14:41:59
 */
import * as THREE from "three";
import Component from '@/util/common/component'

export default class Clock extends Component {
    clock;
    deltaTime;
    elapsedTime;

    constructor(base) {
        super(base);
        const clock = new THREE.Clock();
        this.clock = clock;
        this.deltaTime = 0;
        this.elapsedTime = 0;
    }

    update(time) {
        const newElapsedTime = this.clock.getElapsedTime();
        const deltaTime = newElapsedTime - this.elapsedTime;
        this.deltaTime = deltaTime;
        this.elapsedTime = newElapsedTime;
        this.emit("tick");
    }
}
