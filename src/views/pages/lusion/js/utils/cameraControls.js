/**
 * justThreeJs cameraControls.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/24 10:33:44
 */
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import BrownianMotion from '@/views/pages/lusion/js/utils/brownianMotion'
import DeviceOrientationControls from '@/views/pages/lusion/js/utils/deviceOrientationControls'
export default class CameraControls {
    useOrbitControls = false; // 是否启用 OrbitControls（桌面交互）
    constructor(base) {
        this.base = base;
    }
    preInit(e) {
        // 设置默认相机位置和注视点
        this.DEFAULT_CAMERA_POSITION = new THREE.Vector3(0, 0, 5);
        this.DEFAULT_LOOKAT_POSITION = new THREE.Vector3(0, 0, 0);

        // 初始化成员变量
        this._brownianMotion = new BrownianMotion(this.base); // 摄像机抖动
        this._orbitControls = null;
        this._orbitCamera = null;
        this._deviceOrientationControls = null;
        this._baseDeviceControlQuaternion = null;
        this._targetDeviceControlQuaternion = null;
        this._deviceOrientationCamera = null;
        this._hasDeviceOrientationControlValues = false;

        // 公共临时变量
        this._q = new THREE.Quaternion();
        this._e = new THREE.Euler();
        this._v1 = new THREE.Vector3();
        this._v2 = new THREE.Vector3();
        // 获取主相机
        this._camera = this.base.properties.camera;
        this._deviceOrientationEuler = new THREE.Euler();

        // 设置初始位置
        this._camera.position.copy(this.DEFAULT_CAMERA_POSITION);

        // 初始化 OrbitControls
        if (this.useOrbitControls === true) {
            this._orbitCamera = this._camera.clone();
            this._orbitControls = new OrbitControls(this._orbitCamera, document.documentElement);
            this._orbitControls.enableDamping = true;
            this._orbitControls.target0.copy(this.DEFAULT_LOOKAT_POSITION);
            this._orbitControls.reset();
        }

        // 移动设备支持设备方向控制
        if (this.base.browser.isMobile) {
            this._deviceOrientationCamera = new THREE.Camera();
            this._baseDeviceControlQuaternion = new THREE.Quaternion();
            this._targetDeviceControlQuaternion = new THREE.Quaternion();

            const connectDeviceOrientation = () => {
                this._deviceOrientationControls = new DeviceOrientationControls(this._deviceOrientationCamera);
                this._deviceOrientationControls.connect();
            };

            // iOS 上需点击后初始化传感器
            this.base.browser.isIOS ? this.base.properties.onFirstClicked.addOnce(connectDeviceOrientation) : connectDeviceOrientation();
        }
    }

    init() {
        // 可用于后续绑定事件或 UI 控制
    }

    resize(e, t) {
        // 可根据需要响应屏幕尺寸变化
    }

    update(deltaTime) {
        const t = this._camera;
        // 刷新默认位置
        this.DEFAULT_CAMERA_POSITION.copy(this.base.properties.defaultCameraPosition);
        this.DEFAULT_LOOKAT_POSITION.copy(this.base.properties.defaultLookAtPosition);

        // 设置近远裁剪
        t.near = this.base.properties.cameraNear;
        t.far = this.base.properties.cameraFar;

        // 重置变换矩阵
        t.matrix.identity();
        t.matrix.decompose(t.position, t.quaternion, t.scale);

        // 设置默认视图
        t.position.copy(this.DEFAULT_CAMERA_POSITION);
        t.lookAt(this.DEFAULT_LOOKAT_POSITION);

        // 更新设备方向控制
        if (this.base.browser.isMobile && this._deviceOrientationControls) {
            this._deviceOrientationControls.update();
        }

        // OrbitControls 更新逻辑
        if (this.useOrbitControls === true) {
            this._orbitControls.update();
            this._orbitCamera.updateMatrix();
            this._orbitCamera.matrix.decompose(t.position, t.quaternion, t.scale);
        }

        // 计算视线方向
        this._v1.set(0, 0, -1).applyQuaternion(t.quaternion);
        if (this.useOrbitControls === true) {
            this.cameraDistance = this._v2.copy(this._orbitControls.target).sub(t.position).dot(this._v1);
        } else {
            this.cameraDistance = this._v2.copy(this.DEFAULT_LOOKAT_POSITION).sub(t.position).dot(this._v1);
        }

        // 摄像机焦距 / 视角处理
        if (this.base.properties.cameraUsePhysical) {
            t.filmGauge = this.base.properties.cameraFilmGauge;
            t.setFocalLength(this.base.properties.cameraFocalLength);
        } else {
            t.fov = this.base.properties.cameraFov;
        }

        // Dolly Zoom 动作模拟
        const fovBefore = t.fov;
        t.fov += this.base.properties.cameraDollyZoomFovOffset;

        let zoomOffset = this.cameraDistance *
            Math.tan(fovBefore / 360 * Math.PI / 2) /
            Math.tan(t.fov / 360 * Math.PI / 2) - this.cameraDistance;

        t.translateZ(zoomOffset);

        t.setViewOffset(
            this.base.properties.viewportWidth,
            this.base.properties.viewportHeight,
            this.base.properties.cameraViewportOffsetX,
            this.base.properties.cameraViewportOffsetY,
            this.base.properties.viewportWidth,
            this.base.properties.viewportHeight
        );


        t.fov = fovBefore;
        this.cameraDistance += zoomOffset;

        // 移动设备视角修正
        if (this.base.browser.isMobile && this._deviceOrientationControls) {
            this._deviceOrientationControls.update();

            if (this._deviceOrientationControls.hasValue) {
                if (!this._hasDeviceOrientationControlValues) {
                    this._targetDeviceControlQuaternion.copy(this._deviceOrientationCamera.quaternion);
                    this._baseDeviceControlQuaternion.copy(this._deviceOrientationCamera.quaternion);
                }

                this._targetDeviceControlQuaternion.slerp(this._deviceOrientationCamera.quaternion, 0.15);
                this._baseDeviceControlQuaternion.slerp(this._targetDeviceControlQuaternion, 0.15);

                this._q.copy(this._baseDeviceControlQuaternion).invert().multiply(this._targetDeviceControlQuaternion);
                this._deviceOrientationEuler.setFromQuaternion(this._q);

                this._hasDeviceOrientationControlValues = true;

                t.quaternion.multiply(this._q);
            }
        } else {
            // 桌面鼠标视差控制
            t.translateZ(this.cameraDistance * -1);

            let pitch = this.base.math.clamp(this.base.input.mouseXY.y, -1, 1) * this.base.properties.cameraLookStrength;
            let yaw = this.base.math.clamp(-this.base.input.mouseXY.x, -1, 1) * this.base.properties.cameraLookStrength;

            this.base.properties.cameraLookX += (pitch - this.base.properties.cameraLookX) * this.base.properties.cameraLookEaseDamp;
            this.base.properties.cameraLookY += (yaw - this.base.properties.cameraLookY) * this.base.properties.cameraLookEaseDamp;

            this._e.set(this.base.properties.cameraLookX, this.base.properties.cameraLookY, 0);
            this._q.setFromEuler(this._e);

            t.quaternion.multiply(this._q);
            t.translateZ(this.cameraDistance);
        }

        // 合成变换矩阵
        t.matrix.compose(t.position, t.quaternion, t.scale);

        // 添加摄像机抖动效果（布朗运动）
        this._brownianMotion.positionAmplitude = this.base.properties.cameraShakePositionStrength;
        this._brownianMotion.positionFrequency = this.base.properties.cameraShakePositionSpeed;
        this._brownianMotion.rotationAmplitude = this.base.properties.cameraShakeRotationStrength;
        this._brownianMotion.rotationFrequency = this.base.properties.cameraShakeRotationSpeed;

        this._brownianMotion.update(deltaTime);
        t.matrix.multiply(this._brownianMotion.matrix);
        t.matrix.decompose(t.position, t.quaternion, t.scale);

        // 更新 cameraDistance 再次（用于后续计算）
        this._v1.set(0, 0, -1).applyQuaternion(t.quaternion);
        if (this.useOrbitControls === true) {
            this.base.properties.cameraDistance = this._v2.copy(this._orbitControls.target).sub(t.position).dot(this._v1);
        }

        // 更新世界矩阵
        t.updateMatrixWorld();

        // 计算摄像机方向向量
        this.base.properties.cameraDirection
            .set(0, 0, 1)
            .applyMatrix4(t.matrixWorld)
            .sub(this._v1.set(0, 0, 0).applyMatrix4(t.matrixWorld))
            .normalize();
    }
}
