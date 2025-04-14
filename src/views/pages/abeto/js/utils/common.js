/**
 * justThreeJs common.js
 * @author kongjianqiu
 * @description
 * @created 2025/3/31 11:04:25
 */
import * as THREE from "three";
import {MathUtils} from "three";
import gsap from "gsap";
import {CustomEase} from 'gsap/CustomEase';
import EventEmitter from 'events'



gsap.registerPlugin(CustomEase);
gsap.config({force3D: !0});
gsap.defaults({ease: "power2.inOut", duration: .6, overwrite: "auto"});
CustomEase.create("inOut1", "M0,0 C0.5,0 0.1,1 1,1");
CustomEase.create("inOut2", "M0,0 C0.56,0 0,1 1,1");
CustomEase.create("inOut3", "M0,0 C0.6,0 0,1 1,1");
CustomEase.create("inOut4", "M0,0 C0.4,0 -0.06,1 1,1");


const xm = gsap.parseEase
const Kf = 60
const TI = .2
const II = Kf * TI
let wI = Kf / II
let Fd = 0
let Ud = 16
let xv = 0
let Xd = 60
let Vd = 0;
let ym = 0;
const RI = .5
const LI = 5
const ho = []
const BI = ["webgl_prerender", "webgl_render", "webgl_postrender"];
/*const eventManager = new gsap.core.EventEmitter();
gsap.ticker.add((i, e, t) => {
    const n = Math.round((i - Fd) * 1e3);
    ho.push(n)
    if (i - ym >= RI && ho.length >= LI) {
        const s = Math.round(1e3 / (ho.reduce((r, a) => r + a, 0) / ho.length));
        Vd = Math.max(Vd, s)
        Xd = s
        ho.length = 0
        ym = i
        eventManager.emit("webgl_average_fps_update", Xd)
    }
    Fd = i
    Ud = n
    xv++
    BI.forEach(s => eventManager.emit(s, i, n))
});*/

const CommonParams = {
    get time() {
        return Fd
    }, get delta() {
        return Ud
    }, get frame() {
        return xv
    }, get averageFPS() {
        return Xd
    }, get maxFPS() {
        return Vd
    }, get ratio() {
        return Math.min(wI, Ud / (1e3 / Kf))
    }
};


const Mi = MathUtils
const MathUtil = {
    TWO_PI: Math.PI * 2,
    HALF_PI: Math.PI * .5,
    DEG2RAD: Mi.DEG2RAD,
    RAD2DEG: Mi.RAD2DEG,
    degrees(i) {
        return Mi.radToDeg(i)
    },
    radians(i) {
        return Mi.degToRad(i)
    },
    clamp(i, e = 0, t = 1) {
        return Mi.clamp(i, e, t)
    },
    lerp(i, e, t) {
        return Mi.lerp(i, e, t)
    },
    mix(i, e, t) {
        return this.lerp(i, e, t)
    },
    deltaRatio() {
        return CommonParams.ratio
    },
    lerpCoefFPS(i) {
        return this.damp(i, CommonParams.ratio)
    },
    lerpFPS(i, e, t) {
        return this.lerp(i, e, this.lerpCoefFPS(t))
    },
    lerpFPSLimited(i, e, t, n = 1 / 0) {
        const s = this.lerpFPS(i, e, t), r = n * CommonParams.ratio, a = this.clamp(s - i, -r, r);
        return i + a
    },
    damp(i, e) {
        return 1 - Math.exp(Math.log(1 - i) * e)
    },
    frictionFPS(i) {
        return this.friction(i, CommonParams.ratio)
    },
    friction(i, e) {
        return Math.exp(Math.log(i) * e)
    },
    efit(i, e, t, n, s) {
        return Mi.mapLinear(i, e, t, n, s)
    },
    fit(i, e, t, n, s) {
        return this.efit(this.clamp(i, Math.min(e, t), Math.max(e, t)), e, t, n, s)
    },
    fit01(i, e, t) {
        return this.fit(i, 0, 1, e, t)
    },
    fit10(i, e, t) {
        return this.fit(i, 1, 0, e, t)
    },
    fit11(i, e, t) {
        return this.fit(i, -1, 1, e, t)
    },
    step(i, e) {
        return e < i ? 0 : 1
    },
    linearstep(i, e, t) {
        return this.clamp((t - i) / (e - i), 0, 1)
    },
    smoothstep(i, e, t) {
        return Mi.smoothstep(t, i, e)
    },
    smootherstep(i, e, t) {
        return Mi.smootherstep(t, i, e)
    },
    parabola(i, e) {
        return Math.pow(4 * i * (1 - i), e)
    },
    pcurve(i, e, t) {
        return Math.pow(e + t, e + t) / (Math.pow(e, e) * Math.pow(t, t)) * Math.pow(i, e) * Math.pow(1 - i, t)
    },
    ease(i, e = "linear") {
        return (xm[e] || xm.none)(i)
    },
    round(i, e = 0) {
        const t = Math.pow(10, e);
        return Math.round(i * t) / t
    },
    isPowerOfTwo(i) {
        return Mi.isPowerOfTwo(i)
    },
    ceilPowerOfTwo(i) {
        return Mi.ceilPowerOfTwo(i)
    },
    floorPowerOfTwo(i) {
        return Mi.floorPowerOfTwo(i)
    },
    makeAnglePositive(i) {
        const e = i % this.TWO_PI;
        return e < 0 ? this.TWO_PI + e : e
    },
    getShortestRotationAngle(i, e) {
        const t = this.makeAnglePositive(i);
        let n = this.makeAnglePositive(e);
        return Math.abs(n - t) > Math.PI && (n > t ? n -= this.TWO_PI : n += this.TWO_PI), i + n - t
    },
    latLonTo3D(i, e, t) {
        const n = this.HALF_PI - this.radians(i), s = this.radians(e);
        return {x: t * Math.sin(n) * Math.sin(s), y: t * Math.cos(n), z: t * Math.sin(n) * Math.cos(s)}
    },
    uid() {
        return Mi.generateUUID()
    }
}


class TouchInputManager {
    constructor(base, finger = 0) {
        this.base = base;
        this.finger = finger;
        this.touchID = null;
        this.eventID = finger === 0 ? "touch" : `touch${finger + 1}`;
        this.currentInput = finger === 0 ? "mouse" : "touch";
        this.touching = false;

        // 位置、速度、拖拽
        this.position = new THREE.Vector2();
        this.position01 = new THREE.Vector2();
        this.delta = new THREE.Vector2();
        this.dragged = new THREE.Vector2();
        this.velocity = new THREE.Vector2();
        this.swipeVelocity = new THREE.Vector2();

        // 记录上次位置
        this.prevPosition = new THREE.Vector2();
        this.prevTime = performance.now();

        // 监听 Three.js 渲染更新
        this.onRender = this.onRender.bind(this);
        this.startListening();
    }

    startListening() {
        document.addEventListener("pointerdown", this.onTouchStart.bind(this));
        document.addEventListener("pointermove", this.onTouchMove.bind(this));
        document.addEventListener("mousemove", this.onMouseMove.bind(this));
        document.addEventListener("pointerup", this.onTouchEnd.bind(this));
        document.addEventListener("pointerout", this.onTouchEnd.bind(this));
        this.base.eventManager.addEventListener('webgl_prerender', this.onRender.bind(this));
    }

    onRender() {
        if (!this.touching) return;
        const now = performance.now();
        const deltaTime = Math.max(0.001, (now - this.prevTime) / 1000);

        // 计算速度
        this.velocity.copy(this.position).sub(this.prevPosition).divideScalar(deltaTime);
        this.prevPosition.copy(this.position);
        this.prevTime = now;
    }

    onTouchStart(event) {
        this.touching = true;
        this.prevTime = performance.now();

        this.position.set(event.clientX, event.clientY);
        this.prevPosition.copy(this.position);
        this.delta.set(0, 0);
        this.dragged.set(0, 0);

        this.base.eventManager.dispatchEvent({type: `${this.eventID}_start`, data: this});
    }

    onTouchMove(event) {
        if (!this.touching) return;

        const newPos = new THREE.Vector2(event.clientX, event.clientY);
        this.delta.copy(newPos).sub(this.position);
        this.dragged.add(this.delta);
        this.position.copy(newPos);

        this.base.eventManager.dispatchEvent({type: `${this.eventID}_move`, data: this});
        this.base.eventManager.dispatchEvent({type: `${this.eventID}_drag`, data: this});
    }

    onMouseMove(event) {
        if (this.touching) return;
        const newPos = new THREE.Vector2(event.clientX, event.clientY);
        this.delta.copy(newPos).sub(this.position);
        this.dragged.add(this.delta);
        this.position.copy(newPos);

        this.base.eventManager.dispatchEvent({type: `${this.eventID}_move`, data: this});
        this.base.eventManager.dispatchEvent({type: `${this.eventID}_drag`, data: this});
    }

    onTouchEnd(event) {
        if (!this.touching) return;
        this.touching = false;

        const elapsedTime = Math.max(0.001, (performance.now() - this.prevTime) / 1000);
        this.swipeVelocity.copy(this.dragged).divideScalar(elapsedTime);

        this.base.eventManager.dispatchEvent({type: `${this.eventID}_end`, data: this});

        // 识别点击
        if (this.dragged.length() < 5 && elapsedTime < 0.3) {
            this.base.eventManager.dispatchEvent({type: `${this.eventID}_click`, data: this});
        }
    }

    dispose() {
        document.removeEventListener("pointerdown", this.onTouchStart);
        document.removeEventListener("pointermove", this.onTouchMove);
        document.removeEventListener("pointerup", this.onTouchEnd);
        document.removeEventListener("pointerout", this.onTouchEnd);
    }
}


export {CommonParams, MathUtil, TouchInputManager};


