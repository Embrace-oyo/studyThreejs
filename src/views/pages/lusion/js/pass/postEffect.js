/**
 * justThreeJs postEffect.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/23 17:29:22
 */
export default class PostEffect {
    // 类属性
    sharedUniforms = {};       // 共享的uniform变量
    enabled = true;             // 是否启用效果 (!0 = true)
    material = null;            // 材质对象
    renderOrder = 0;            // 渲染顺序
    _hasShownWarning = false;   // 是否已显示警告 (!1 = false)
    constructor(base) {
        this.base = base;
    }
    /**
     * 初始化方法
     * @param {Object} e 配置参数
     */
    init(e) {
        // 合并配置参数到当前对象
        Object.assign(this, e);
    }

    /**
     * 判断是否需要渲染
     * @return {boolean} 总是返回true
     */
    needsRender() {
        return true;
    }

    /**
     * 警告方法(只显示一次)
     * @param {string} e 警告信息
     */
    warn(e) {
        if (!this._hasShownWarning) {
            console.warn(e);
            this._hasShownWarning = true;
        }
    }

    /**
     * 设置后期处理参数(空实现)
     * @param {Object} e 参数对象
     */
    setPostprocessing(e) {
        // 可由子类实现具体逻辑
    }

    /**
     * 渲染方法
     * @param {Object} e 渲染参数对象
     * @param {boolean} t 是否渲染到屏幕(默认false)
     */
    render(e, t = false) {
        // 设置输入纹理
        if (this.material.uniforms.u_texture) {
            this.material.uniforms.u_texture.value = e.fromTexture;
        }

        // 执行渲染
        this.base.fboHelper.render(
            this.material,
            t ? null : e.toRenderTarget  // 如果t为true则渲染到屏幕(null)，否则渲染到目标
        );

        // 交换缓冲区
        e.swap();
    }
}
