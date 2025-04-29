/**
 * justThreeJs visuals.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/24 10:51:30
 */
import Stage3D from '@/views/pages/lusion/js/utils/stage3D'

export default class Visuals {
    // 默认的 Stage3D 实例
    defaultStage3D = new Stage3D();

    // 当前激活的 Stage3D
    currentStage3D = null;

    // 所有的 Stage3D 实例列表
    stage3DList = [];

    constructor(base) {
        this.base = base;
    }

    // 预初始化（可扩展）
    preInit() {
    }

    // 初始化方法（可扩展）
    init() {
    }

    // 启动方法（可扩展）
    start() {
    }

    // 响应窗口尺寸变化（可扩展）
    resize(width, height) {
    }

    // 将所有舞台设为非激活状态
    deactivateAll() {
        for (let i = 0; i < this.stage3DList.length; i++) {
            let stage = this.stage3DList[i];
            stage.isActive = false;
        }
    }

    /**
     * 同步激活舞台的属性
     * @param {Object} properties - 要同步的全局属性对象
     */
    syncProperties(time) {
        // 默认使用 defaultStage3D
        this.currentStage3D = this.defaultStage3D;

        for (let i = 0; i < this.stage3DList.length; i++) {
            let stage = this.stage3DList[i];
            if (stage.isActive === true) {
                this.currentStage3D = stage;
                stage.syncProperties(time); // 同步当前激活的 stage 属性

                // 将该 stage 的属性合并到全局属性中
                for (let key in stage.properties) {
                    this.base.properties[key] = stage.properties[key];
                }
            } else {
                stage.isActive = false;
            }
        }
    }

    /**
     * 每帧更新
     * @param {number} delta - 距离上一帧的时间差（毫秒）
     */
    update(delta) {
        // 更新当前激活的 stage
        this.currentStage3D.update(delta);
        this.currentStage3D.visible = true;

        // 记录每个 stage 的活跃状态
        for (let i = 0; i < this.stage3DList.length; i++) {
            let stage = this.stage3DList[i];
            stage.wasActive = stage.isActive;
        }
    }
}
