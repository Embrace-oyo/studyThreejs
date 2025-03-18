/**
 * justThreeJs tick.js
 * @author kongjianqiu
 * @description
 * @created 2025/3/18 14:31:45
 */


export default class Tick {
    constructor({autoplay: i = !0} = {}) {
        this.queue = [],
            this.last = performance.now(),
            this.autoplay = i,
            this.frame = this.frame.bind(this),
        typeof window < "u" && requestAnimationFrame(this.frame)
    }

    frame(i) {
        this.autoplay && this.update(i),
            requestAnimationFrame(this.frame)
    }

    step(i) {
        this.update(this.last + i)
    }

    update(i) {
        let e = i - this.last;
        this.autoplay && (e = Math.min(150, e)),
            this.last = i;
        for (let t = this.queue.length - 1; t >= 0; t--) {
            const s = this.queue[t];
            if (s.fps) {
                let o = i - s.last;
                if (this.autoplay && (o = Math.min(s.delta * 5, o)),
                o < s.delta)
                    continue;
                s(o === 1 / 0 ? s.delta : o, i, ++s.frame),
                    s.last = i;
                continue
            }
            s(e, i)
        }
    }

    add(i, e) {
        e && (i.fps = e,
            i.last = -1 / 0,
            i.frame = -1,
            i.delta = 1e3 / e),
        this.queue.includes(i) || this.queue.unshift(i)
    }

    remove(i) {
        this.queue.includes(i) && this.queue.splice(this.queue.indexOf(i), 1)
    }
}
