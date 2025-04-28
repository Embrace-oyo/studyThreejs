/**
 * justThreeJs simple1DNoise.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/24 10:42:25
 */
import MathUtils from '@/views/pages/lusion/js/utils/math'

export default class Simple1DNoise {
    static MAX_VERTICES = 512; // 最大顶点数量
    static MAX_VERTICES_MASK = Simple1DNoise.MAX_VERTICES - 1; // 用于快速取模

    _scale = 1;      // 控制输入的缩放比例（频率）
    _amplitude = 1;  // 控制输出幅度（强度）
    _r = [];         // 随机值数组，用于存储预生成的伪随机序列

    constructor(seed) {
        this.math = new MathUtils;
        // 如果有种子参数，就用种子生成器，否则使用 Math.random
        let rand = seed ? this.math.getSeedRandomFn(seed) : Math.random;

        // 生成 MAX_VERTICES 个随机值，范围在 [-0.5, 0.5] 之间
        for (let i = 0; i < Simple1DNoise.MAX_VERTICES; ++i) {
            this._r.push(rand() - 0.5);
        }
    }

    // 获取某个 x 值上的一维噪声值（基础插值）
    getVal(x) {
        const tx = x * this._scale;              // 缩放后的输入值
        const xi = Math.floor(tx);               // 整数部分
        const xf = tx - xi;                      // 小数部分（用于插值）
        const fade = xf * xf * (3 - 2 * xf);     // 三次缓动函数（smoothstep）

        const i0 = xi & Simple1DNoise.MAX_VERTICES_MASK;       // 当前索引
        const i1 = (i0 + 1) & Simple1DNoise.MAX_VERTICES_MASK; // 下一索引（循环）

        // 插值 + 放大输出幅度
        return this.math.mix(this._r[i0], this._r[i1], fade) * this._amplitude;
    }

    // FBM：分形布朗运动 —— 多层次叠加的噪声
    getFbm(x, layers) {
        let total = 0;
        let amplitude = 0.5;

        for (let i = 0; i < layers; i++) {
            total += amplitude * this.getVal(x);
            x *= 2;             // 提高频率
            amplitude *= 0.5;   // 减小强度
        }

        return total;
    }

    // 属性访问器：设置与读取幅度
    get amplitude() {
        return this._amplitude;
    }

    set amplitude(v) {
        this._amplitude = v;
    }

    // 属性访问器：设置与读取缩放（频率）
    get scale() {
        return this._scale;
    }

    set scale(v) {
        this._scale = v;
    }
}
