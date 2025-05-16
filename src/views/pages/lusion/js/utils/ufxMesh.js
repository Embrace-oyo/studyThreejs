/**
 * justThreeJs ufxMesh.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/30 09:39:19
 */


/**
 * 增强版Mesh类，用于DOM元素与WebGL渲染的桥接
 * 扩展自Three.js的Mesh类，添加了DOM同步和特殊渲染功能
 */
import * as THREE from "three";
//glsl
import quadVert from '@/views/pages/lusion/glsl/ufxMesh/quadVert.glsl'
import quadFrag from '@/views/pages/lusion/glsl/ufxMesh/quadFrag.glsl'

export default class UfxMesh extends THREE.Mesh {
    // 布局参数
    pivot = new THREE.Vector2;  // 元素中心点比例(默认0.5,0.5)
    paddingL = 0;         // 左侧内边距
    paddingR = 0;         // 右侧内边距
    paddingT = 0;         // 顶部内边距
    paddingB = 0;         // 底部内边距

    // DOM相关
    refDom;               // 关联的DOM元素
    requireBg;            // 是否需要背景

    // 状态跟踪
    tick = 0;             // 更新计数器
    _domX = 0;           // DOM元素X坐标
    _domY = 0;           // DOM元素Y坐标
    _domWidth = 0;       // DOM元素宽度
    _domHeight = 0;      // DOM元素高度
    _capturedOffsetX = 0; // 捕获的X偏移量
    _capturedOffsetY = 0; // 捕获的Y偏移量

    /**
     * 构造函数
     * @param {Object} e - 配置对象
     */
    constructor(e = {}, base) {
        // 初始化几何体(默认为1x1平面)
        let t = e.geometry || new THREE.PlaneGeometry(1, 1, e.segX || 1, e.segY || 1).translate(0.5, 0.5, 0);
        t.computeBoundingBox();

        // 调用父类构造函数
        super(t, e.material);
        this.base = base;
        // 初始化属性
        this.refDom = e.refDom;
        this.pivot = e.pivot || new THREE.Vector2(0.5, 0.5);
        this.matrixAutoUpdate = false;  // 禁用自动矩阵更新
        this.frustumCulled = false;    // 禁用视锥体剔除
        this.requireBg = e.requireBg === true;

        // 设置内边距
        this.paddingL = e.paddingL || 0;
        this.paddingR = e.paddingR || 0;
        this.paddingT = e.paddingT || 0;
        this.paddingB = e.paddingB || 0;

        // 初始化材质和渲染回调
        this._initMaterial(e);
        this.onBeforeRender = this._onBeforeRender.bind(this);
    }

    /**
     * 渲染前回调(用于处理背景需求)
     */
    _onBeforeRender() {
        if (this.requireBg) {
            let e = this.base.fboHelper.renderer,
                t = e.getRenderTarget();

            // 处理多采样渲染目标状态
            this.base.fboHelper.clearMultisampleRenderTargetState();

            // 复制场景纹理
            this.base.fboHelper.copy(
                this.base.properties.postprocessing.sceneTexture,
                this.base.properties.postprocessing.fromRenderTarget
            );

            e.setRenderTarget(t);
        }
    }

    /**
     * 初始化材质
     * @param {Object} e - 配置对象
     */
    _initMaterial(e) {
        // 如果材质不同则创建新材质
        if (this.material != e.material) {
            this.material = new THREE.ShaderMaterial({
                vertexShader: e.vertexShader || quadVert,
                fragmentShader: e.fragmentShader || quadFrag
            });
            this.material.side = THREE.DoubleSide;     // 双面渲染
            this.material.transparent = true;    // 启用透明
        }

        // 复制配置属性到材质
        for (let r in e) {
            if (this.material[r] !== undefined) {
                this.material[r] = e[r];
            }
        }

        // 启用着色器扩展
        this.material.extensions.derivatives = true;

        // 初始化uniforms
        let t = this.material.uniforms;
        if (t) {
            // 变换相关uniforms
            t.u_position = {value: this.position};
            t.u_quaternion = {value: this.quaternion};
            t.u_scale = {value: this.scale};

            // DOM布局相关uniforms
            t.u_domXY = {value: new THREE.Vector2};        // DOM位置
            t.u_domWH = {value: new THREE.Vector2};        // DOM尺寸
            t.u_domPivot = {value: new THREE.Vector2};     // DOM中心点
            t.u_domPadding = {value: new THREE.Vector4};    // DOM内边距

            // 渲染相关uniforms
            t.u_bgTexture = this.base.properties.postprocessing.shaderUniforms.u_fromTexture; // 背景纹理
            t.u_resolution = this.base.properties.postprocessing.shaderUniforms.u_resolution; // 分辨率
            t.u_viewportResolution = this.base.properties.shaderUniforms.u_viewportResolution; // 视口分辨率
        }
    }

    /**
     * 同步DOM元素位置和尺寸
     * @param {number} e - X轴偏移
     * @param {number} t - Y轴偏移
     */
    syncDom(e = 0, t = 0) {
        if (this.refDom) {
            // 获取DOM元素边界矩形
            let r = this.refDom.getBoundingClientRect();
            this.syncRect(r.left, r.top, Math.ceil(r.width), Math.ceil(r.height), e, t);
        } else {
            console.warn("refDom is missing");
        }
    }

    /**
     * 同步指定矩形区域
     * @param {number} e - X坐标
     * @param {number} t - Y坐标
     * @param {number} r - 宽度
     * @param {number} n - 高度
     * @param {number} a - X轴偏移
     * @param {number} l - Y轴偏移
     */
    syncRect(e, t, r, n, a = 0, l = 0) {
        this._domX = e;
        this._domY = t;
        this._domWidth = Math.ceil(r);
        this._domHeight = Math.ceil(n);

        // 更新uniforms
        this.material.uniforms.u_domWH.value.set(this._domWidth, this._domHeight);

        // 记录偏移量
        this._capturedOffsetY = a;
        this._capturedOffsetX = l;
    }

    /**
     * 测试元素是否在视口内
     * @param {number} e - Y轴偏移
     * @param {number} t - X轴偏移
     * @return {boolean} 是否可见
     */
    testViewport(e = 0, t = 0) {
        let r = this._domX - this._capturedOffsetX + t,
            n = r + this._domWidth,
            a = this._domY - this._capturedOffsetY + e,
            l = a + this._domHeight;

        return a < this.base.properties.viewportHeight &&
            l > 0 &&
            r < this.base.properties.viewportWidth &&
            n > 0;
    }

    /**
     * 更新元素状态
     * @param {number} e - Y轴偏移
     * @param {number} t - X轴偏移
     */
    update(e = 0, t = 0) {
        let r = this.material.uniforms;

        // 更新DOM位置uniform
        r.u_domXY.value.set(
            this._domX - this._capturedOffsetX + t,
            this._domY - this._capturedOffsetY + e
        );

        // 更新中心点uniform
        r.u_domPivot.value.set(
            this._domWidth * this.pivot.x,
            this._domHeight * this.pivot.y
        );

        // 更新内边距uniform
        r.u_domPadding.value.set(
            this.paddingL,
            this.paddingR,
            this.paddingT,
            this.paddingB
        );

        this.tick++;  // 递增更新计数器
    }
}
