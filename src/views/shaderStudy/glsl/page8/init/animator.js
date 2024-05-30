/**
 * justThreeJs animation.js
 * @author kongjianqiu
 * @description
 * @created 2024/5/30 10:57:13
 */
class Animator {
    base;
    tasks;

    constructor(base) {
        this.base = base;
        this.tasks = [];
    }

    add(fn) {
        this.tasks.push(fn);
    }

    update() {
        this.base.renderer.setAnimationLoop((time) => {
            this.tick(time);
        });
    }

    tick(time = 0) {
        this.tasks.forEach((task) => {
            task(time);
        });
        this.base.render();
    }
}

export default Animator;

