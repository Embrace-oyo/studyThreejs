/**
 * justThreeJs preUfx.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/24 10:19:49
 */

import * as THREE from "three";
import PostEffect from '@/views/pages/lusion/js/pass/postEffect'

class Ufx extends PostEffect {
    // 场景和相机
    scene = new THREE.Scene();                     // 主场景对象
    camera = new THREE.PerspectiveCamera(60, 1);   // 60度视角的透视相机
    frameIdx = -1;                           // 帧索引计数器

    // 分层容器
    sectionLayer = new THREE.Object3D();           // 章节内容层
    projectDetailsLayer = new THREE.Object3D();    // 项目细节层

    // 共享uniform变量
    shaderUniforms = {
        u_fromTexture: {value: null}         // 输入纹理
    };

    constructor(base) {
        super(base);
        this.base = base;
    }

    /**
     * 初始化方法
     */
    init() {
        // 可以在这里添加初始化逻辑
    }

    /**
     * 设置后期处理参数
     * @param {Object} e 配置参数
     */
    setPostprocessing(e) {
        let t = this.camera;
        let r = this.base.properties.viewportWidth;    // 视口宽度
        let n = this.base.properties.viewportHeight;   // 视口高度

        // 计算相机位置
        t.position.set(r / 2, -n / 2, n / (2 * Math.tan(t.fov * Math.PI / 360)));

        // 更新相机参数
        t.aspect = r / n;                   // 宽高比
        t.far = t.position.z * 2;           // 远平面
        t.near = t.far / 1000;              // 近平面(1e3 = 1000)
        t.updateProjectionMatrix();         // 更新投影矩阵
    }

    /**
     * 渲染方法
     * @param {Object} e 渲染参数对象
     * @param {boolean} t 是否渲染到屏幕(默认false)
     */
    render(e, t = false) {
        // 保存当前渲染状态
        let r = this.base.fboHelper.getColorState();
        let n = this.base.properties.renderer;

        // 复制输入纹理到场景渲染目标
        this.base.fboHelper.copy(e.fromTexture, e.sceneRenderTarget);

        // 设置渲染目标并配置自动清除
        n.setRenderTarget(e.sceneRenderTarget);
        this.base.fboHelper.renderer.autoClear = false;           // 禁用自动全清除
        this.base.fboHelper.renderer.autoClearColor = false;      // 禁用自动清除颜色
        this.base.fboHelper.renderer.autoClearStencil = true;     // 启用自动清除模板
        this.base.fboHelper.renderer.autoClearDepth = true;       // 启用自动清除深度
        this.base.fboHelper.renderer.clear(false, true, true);    // 执行清除(颜色保留)

        // 渲染场景
        n.render(this.scene, this.camera);
        n.setRenderTarget(null);

        // 复制结果到输出目标
        let a = t ? null : e.toRenderTarget;
        this.base.fboHelper.copy(e.sceneTexture, a);

        // 恢复渲染状态并交换缓冲区
        this.base.fboHelper.setColorState(r);
        e.swap();
    }
}

class PreUfx extends Ufx {
    renderOrder = 50

    constructor(base) {
        super(base);
        this.base = base;
    }
}

class PostUfx extends Ufx {
    renderOrder = 100

    constructor(base) {
        super(base);
        this.base = base;
    }
}

export {PreUfx, PostUfx}
