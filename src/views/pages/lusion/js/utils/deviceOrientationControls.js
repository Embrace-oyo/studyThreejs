/**
 * justThreeJs deviceOrientationControls.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/24 10:46:26
 */

import * as THREE from "three";

export default class DeviceOrientationControls {
    object = null;              // 被控制的 3D 对象
    enabled = true;             // 是否启用控制
    hasValue = false;           // 是否已收到有效的方向数据
    deviceOrientation = {};     // 当前设备方向数据（alpha、beta、gamma）
    screenOrientation = 0;      // 屏幕朝向角度（横屏/竖屏）
    alphaOffset = 0;            // 可用于修正初始角度偏移

    // 用于设置屏幕方向转换四元数
    zee = new THREE.Vector3(0, 0, 1);
    euler = new THREE.Euler();
    q0 = new THREE.Quaternion();
    q1 = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)); // 用于转换设备坐标到世界坐标

    _onBoundDeviceOrientationChangeEvent;
    _onBoundScreenOrientationChangeEvent;

    constructor(object) {
        this.object = object;
        this.object.rotation.reorder("YXZ"); // 设定欧拉角旋转顺序
        this._onBoundDeviceOrientationChangeEvent = this._onDeviceOrientationChangeEvent.bind(this);
        this._onBoundScreenOrientationChangeEvent = this._onScreenOrientationChangeEvent.bind(this);
        this.connect(); // 自动连接监听
    }

    // 设备方向更新时调用，记录方向数据
    _onDeviceOrientationChangeEvent(event) {
        this.deviceOrientation = event;
    }

    // 屏幕方向改变时调用（如横竖屏切换）
    _onScreenOrientationChangeEvent() {
        this.screenOrientation = window.orientation || 0;
    }

    // 将方向角转换为四元数，并赋值给目标对象
    setObjectQuaternion(quaternion, alpha, beta, gamma, screenOrientation) {
        this.euler.set(beta, alpha, -gamma, "YXZ"); // 按 YXZ 顺序设置欧拉角
        quaternion.setFromEuler(this.euler);        // 转换为四元数
        quaternion.multiply(this.q1);               // 乘以设备到世界的旋转变换
        quaternion.multiply(this.q0.setFromAxisAngle(this.zee, -screenOrientation)); // 修正屏幕朝向
    }

    // 启用监听事件
    connect() {
        this._onBoundScreenOrientationChangeEvent();

        // iOS 下必须请求权限
        if (
            window.DeviceOrientationEvent !== undefined &&
            typeof window.DeviceOrientationEvent.requestPermission === "function"
        ) {
            window.DeviceOrientationEvent.requestPermission()
                .then(response => {
                    if (response === "granted") {
                        window.addEventListener("orientationchange", this._onBoundScreenOrientationChangeEvent, false);
                        window.addEventListener("deviceorientation", this._onBoundDeviceOrientationChangeEvent, false);
                    }
                })
                .catch(() => {
                });
        } else {
            // 其他设备直接监听
            window.addEventListener("orientationchange", this._onBoundScreenOrientationChangeEvent, false);
            window.addEventListener("deviceorientation", this._onBoundDeviceOrientationChangeEvent, false);
        }

        this.enabled = true;
    }

    // 关闭监听事件
    disconnect() {
        window.removeEventListener("orientationchange", this._onBoundScreenOrientationChangeEvent, false);
        window.removeEventListener("deviceorientation", this._onBoundDeviceOrientationChangeEvent, false);
        this.enabled = false;
    }

    // 每帧更新方向
    update() {
        if (!this.enabled) return;

        const e = this.deviceOrientation;
        if (e) {
            const alpha = e.alpha ? THREE.MathUtils.degToRad(e.alpha) + this.alphaOffset : 0;
            const beta = e.beta ? THREE.MathUtils.degToRad(e.beta) : 0;
            const gamma = e.gamma ? THREE.MathUtils.degToRad(e.gamma) : 0;
            const orient = this.screenOrientation ? THREE.MathUtils.degToRad(this.screenOrientation) : 0;

            this.setObjectQuaternion(this.object.quaternion, alpha, beta, gamma, orient);

            // 如果三个方向角都有值，则标记为已接收有效值
            if (e.alpha && e.beta && e.gamma) {
                this.hasValue = true;
            }
        }
    }

    // 清理资源
    dispose() {
        this.disconnect();
    }
}
