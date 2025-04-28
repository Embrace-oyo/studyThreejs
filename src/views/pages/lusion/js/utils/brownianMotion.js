/**
 * justThreeJs brownianMotion.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/24 10:37:44
 */
import * as THREE from "three";
import Simple1DNoise from '@/views/pages/lusion/js/utils/simple1DNoise'

 // 共享的临时向量，避免重复创建对象
const _tempVector = new THREE.Vector3();

export default class BrownianMotion {
    // 变换属性
    _position = new THREE.Vector3();       // 位置偏移量
    _rotation = new THREE.Quaternion();    // 旋转偏移量(四元数)
    _euler = new THREE.Euler();            // 欧拉角(用于旋转计算)
    _scale = new THREE.Vector3(1, 1, 1);   // 缩放比例(默认1:1:1)
    _matrix = new THREE.Matrix4();         // 最终变换矩阵

    // 噪声控制参数
    _enablePositionNoise = true;     // 是否启用位置噪声
    _enableRotationNoise = true;    // 是否启用旋转噪声
    _positionFrequency = 0.25;      // 位置变化频率
    _rotationFrequency = 0.25;      // 旋转变化频率
    _positionAmplitude = 0.3;       // 位置变化幅度
    _rotationAmplitude = 0.003;     // 旋转变化幅度(弧度)
    _positionScale = new THREE.Vector3(1, 1, 1);  // 位置噪声各轴缩放
    _rotationScale = new THREE.Vector3(1, 1, 0);  // 旋转噪声各轴缩放(Z轴设为0)
    _positionFractalLevel = 3;      // 位置分形噪声层级
    _rotationFractalLevel = 3;      // 旋转分形噪声层级

    // 时间记录(用于6个噪声维度: 3位置 + 3旋转)
    _times = new Float32Array(6);

    // 噪声生成器
    _noise = new Simple1DNoise();

    // 分形布朗运动(FBM)标准化常量
    static FBM_NORM = 1 / 0.75;

    /**
     * 构造函数
     */
    constructor() {
        this.rehash(); // 初始化随机种子
    }

    /**
     * 重置随机种子
     */
    rehash() {
        for (let i = 0; i < 6; i++) {
            // 初始化各维度时间为随机值(负值确保初始状态随机)
            this._times[i] = Math.random() * -10000;
        }
    }

    /**
     * 更新布朗运动状态
     * @param {number} deltaTime 时间增量(毫秒)
     */
    update(deltaTime) {
        // 默认使用60FPS的帧时间(16.666ms)
        const timeStep = deltaTime === undefined ? 16.666666666666668 : deltaTime;

        // 更新位置噪声
        if (this._enablePositionNoise) {
            // 更新时间(前3个维度用于位置)
            for (let i = 0; i < 3; i++) {
                this._times[i] += this._positionFrequency * timeStep;
            }

            // 获取三维分形噪声
            _tempVector.set(
                this._noise.getFbm(this._times[0], this._positionFractalLevel),
                this._noise.getFbm(this._times[1], this._positionFractalLevel),
                this._noise.getFbm(this._times[2], this._positionFractalLevel)
            );

            // 应用轴向缩放和幅度
            _tempVector.multiply(this._positionScale)
                .multiplyScalar(this._positionAmplitude * BrownianMotion.FBM_NORM);

            this._position.copy(_tempVector);
        }

        // 更新旋转噪声
        if (this._enableRotationNoise) {
            // 更新时间(后3个维度用于旋转)
            for (let i = 0; i < 3; i++) {
                this._times[i + 3] += this._rotationFrequency * timeStep;
            }

            // 获取三维分形噪声
            _tempVector.set(
                this._noise.getFbm(this._times[3], this._rotationFractalLevel),
                this._noise.getFbm(this._times[4], this._rotationFractalLevel),
                this._noise.getFbm(this._times[5], this._rotationFractalLevel)
            );

            // 应用轴向缩放和幅度
            _tempVector.multiply(this._rotationScale)
                .multiplyScalar(this._rotationAmplitude * BrownianMotion.FBM_NORM);

            // 转换为四元数旋转
            this._euler.set(_tempVector.x, _tempVector.y, _tempVector.z);
            this._rotation.setFromEuler(this._euler);
        }

        // 更新变换矩阵
        this._matrix.compose(this._position, this._rotation, this._scale);
    }

    // --- 属性访问器 ---

    get positionAmplitude() {
        return this._positionAmplitude;
    }

    set positionAmplitude(value) {
        this._positionAmplitude = value;
    }

    get positionFrequency() {
        return this._positionFrequency;
    }

    set positionFrequency(value) {
        this._positionFrequency = value;
    }

    get rotationAmplitude() {
        return this._rotationAmplitude;
    }

    set rotationAmplitude(value) {
        this._rotationAmplitude = value;
    }

    get rotationFrequency() {
        return this._rotationFrequency;
    }

    set rotationFrequency(value) {
        this._rotationFrequency = value;
    }

    get matrix() {
        return this._matrix;
    }

    set matrix(value) {
        this._matrix = value;
    }
}
