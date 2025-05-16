/**
 * justThreeJs secondOrderDynamics.js
 * @author kongjianqiu
 * @description
 * @created 2025/5/6 18:00:01
 */

export default class SecondOrderDynamics {
    // 状态变量
    target0 = null;
    target = null;
    prevTarget = null;
    value = null;
    valueVel = null;

    // 系统参数
    k1;
    k2;
    k3;

    // 内部参数
    _f;
    _z;
    _r;
    _w;
    _d;
    _targetVelCache;
    _cache1;
    _cache2;
    _k1Stable;
    _k2Stable;

    isVector = null;
    isRobust = null;

    constructor(initialValue, frequency = 1.5, damping = 0.8, response = 2, robust = true) {
        this.isRobust = robust;
        this.isVector = typeof initialValue === "object";

        this.setFZR(frequency, damping, response);

        if (this.isVector) {
            // Vector 初始化
            this.target = initialValue;
            this.target0 = initialValue.clone();
            this.prevTarget = initialValue.clone();
            this.value = initialValue.clone();
            this.valueVel = initialValue.clone().setScalar(0);

            this._targetVelCache = this.valueVel.clone();
            this._cache1 = this.valueVel.clone();
            this._cache2 = this.valueVel.clone();

            this.update = this._updateVector;
            this.reset = this._resetVector;
        } else {
            // 数值初始化
            this.target0 = initialValue;
            this.prevTarget = initialValue;
            this.value = initialValue;
            this.valueVel = 0;

            this.update = this._updateNumber;
            this.reset = this._resetNumber;
        }

        this.computeStableCoefficients = robust
            ? this._computeRobustStableCoefficients
            : this._computeStableCoefficients;
    }

    update(dt, newTarget = this.target) {
    }

    reset(e = null) {
    }

    // ============ Reset ============
    _resetVector(e = this.target0) {
        this.valueVel.setScalar(0);
        this.prevTarget.copy(e);
        this.target.copy(e);
        this.value.copy(e);
    }

    _resetNumber(e = this.target0) {
        this.valueVel = 0;
        this.prevTarget = e;
        this.target = e;
        this.value = e;
    }

    // ============ 设置频率、阻尼、响应速度 ============
    setFZR(f = this._f, z = this._z, r = this._r) {
        let omega = Math.PI * 2 * f;

        if (this.isRobust) {
            this._w = omega;
            this._z = z;
            this._d = omega * Math.sqrt(Math.abs(z * z - 1));
        }

        this.k1 = z / (Math.PI * f);
        this.k2 = 1 / (omega * omega);
        this.k3 = r * z / omega;
    }

    // ============ 稳定系数计算 ============
    _computeStableCoefficients(dt) {
        this._k1Stable = this.k1;
        this._k2Stable = Math.max(this.k2, 1.1 * dt * dt / 4 + dt * this.k1 / 2);
    }

    _computeRobustStableCoefficients(dt) {
        if (this._w * dt < this._z) {
            this._k1Stable = this.k1;
            this._k2Stable = Math.max(this.k2, dt * dt / 2 + dt * this.k1 / 2, dt * this.k1);
        } else {
            let expTerm = Math.exp(-this._z * this._w * dt);
            let r = 2 * expTerm * (this._z <= 1 ? Math.cos(dt * this._d) : Math.cosh(dt * this._d));
            let n = expTerm * expTerm;
            let a = dt / (1 + n - r);

            this._k1Stable = (1 - n) * a;
            this._k2Stable = dt * a;
        }
    }

    // ============ 更新函数（向量） ============
    _updateVector(dt, target = this.target) {
        if (dt > 0) {
            this._targetVelCache.copy(target).sub(this.prevTarget).divideScalar(dt);
            this.prevTarget.copy(target);

            this.computeStableCoefficients(dt);

            // value += velocity * dt
            this.value.add(this._cache1.copy(this.valueVel).multiplyScalar(dt));

            // acceleration step
            this._cache1.copy(target)
                .add(this._targetVelCache.multiplyScalar(this.k3))
                .sub(this.value)
                .sub(this._cache2.copy(this.valueVel).multiplyScalar(this._k1Stable))
                .multiplyScalar(dt / this._k2Stable);

            this.valueVel.add(this._cache1);
        }
    }

    // ============ 更新函数（数字） ============
    _updateNumber(dt, target = this.target) {
        if (dt > 0) {
            let targetVel = (target - this.prevTarget) / dt;
            this.prevTarget = target;

            this.computeStableCoefficients(dt);

            this.valueVel += (target + this.k3 * targetVel - this.value - this._k1Stable * this.valueVel) * (dt / this._k2Stable);
            this.value += this.valueVel * dt;
        }
    }
}
