/**
 * justThreeJs tween.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/23 14:53:16
 */
import * as THREE from "three";
const instances = []; // 所有 Tween 实例的全局列表

export default class Tween {
    constructor(target, onComplete) {
        this.target = target;                // 要操作的对象
        this.fromProperties = {};            // 初始属性值
        this.toProperties = {};              // 目标属性值
        this.onComplete = onComplete;        // 动画完成后的回调
        this.t = 0;                           // 当前时间进度
        this.duration = 0;                   // 动画持续时间
        this.autoUpdate = true;              // 是否自动参与 global update
        this.isActive = false;               // 是否正在播放

        instances.push(this);                // 加入全局列表
    }

    // 全局批量更新所有 Tween 实例（通常在渲染循环中调用）
    static autoUpdate(dt) {
        for (let i = 0; i < instances.length; i++) {
            let tween = instances[i];
            if (tween.autoUpdate) {
                tween.update(dt);
            }
        }
    }

    // 重新开始
    restart() {
        this.isActive = true;
        this.t = 0;
    }

    // 停止动画（不会从 instances 中移除）
    kill() {
        this.t = this.duration;
    }

    // 快速设置目标属性
    to(duration, toProps, ease = null) {
        const fromProps = {};
        for (let key in toProps) {
            fromProps[key] = this.target[key];
        }
        this.fromTo(duration, fromProps, toProps, ease);
    }

    // 设置起始和目标属性值
    fromTo(duration, fromProps, toProps, ease = null) {
        this.duration = duration;
        this.ease = ease;
        this.fromProperties = fromProps;
        this.toProperties = toProps;
        this.restart();
        this.update(0, this.duration === 0); // 如果 duration 为 0，立即应用
    }

    // 核心更新方法
    update(dt = 0, forceUpdate = false) {
        if (this.t < this.duration || forceUpdate) {
            this.t = Math.min(this.duration, this.t + dt);

            let progress = this.t / this.duration;
            if (this.ease) progress = this.ease(progress); // 应用缓动函数

            // 属性插值
            for (let key in this.toProperties) {
                this.target[key] = THREE.MathUtils.lerp(
                    this.fromProperties[key],
                    this.toProperties[key],
                    progress
                );
            }

            // 完成回调
            if (this.t === this.duration && this.onComplete) {
                this.onComplete();
            }
        }
    }
}
