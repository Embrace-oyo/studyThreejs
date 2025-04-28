/**
 * justThreeJs taskManager.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/23 15:24:03
 */

import MinSignal from '@/views/pages/lusion/js/utils/quickLoader/min-signal'

class Task {
    _completeCount = 0;      // 完成的任务计数
    _completeTotal = 0;      // 总任务数

    constructor(e, base) {
        this.base = base
        // 如果 e 是数组，创建一个多个回调函数的处理方式，否则创建一个单一回调函数
        Array.isArray(e) ? this.run = this.createMultiCallbackFunc(e) : this.run = this.createCallbackFunc(e);
    }

    // 判断任务是否完成
    get isCompleted() {
        return this._completeCount === this._completeTotal;
    }

    // 默认的 run 方法，未实现
    run() {
    }

    // 创建多个回调函数的处理逻辑
    createMultiCallbackFunc(e) {
        let callbacks = [];
        for (let i = 0; i < e.length; i++) {
            callbacks.push(this.createCallbackFunc(e[i])); // 为每个任务创建回调函数
        }
        return function () {
            // 依次执行每个回调
            for (let i = 0; i < callbacks.length; i++) {
                callbacks[i]();
            }
        };
    }

    // 完成任务时调用
    _onComplete() {
        this._completeCount++; // 完成任务计数加1
    }

    // 根据传入的对象类型，创建相应的回调函数
    createCallbackFunc(e) {
        let callback;
        this._completeTotal++; // 总任务数加1

        // 根据不同的对象类型创建相应的任务处理函数
        if (e.isRawShaderMaterial || e.isShaderMaterial) {
            callback = this.createShaderMaterialFunc(e);  // 如果是原始着色器或着色器材质
        } else if (e.isObject3D) {
            callback = this.createCompileSceneFunc(e);  // 如果是 3D 对象
        } else if (e.isTexture) {
            callback = this.createInitTextureFunc(e);  // 如果是纹理
        } else {
            callback = e.bind(this, this._onComplete);  // 绑定回调
        }
        return callback;
    }

    // 创建一个处理着色器材质的回调函数
    createShaderMaterialFunc(e) {
        return function () {
            this.base.fboHelper._tri.material = e;  // 设置材质
            this.base.properties.renderer.compileAsync(this.base.fboHelper._tri, this.base.properties.camera).then(() => {
                this._onComplete();  // 编译完成后调用完成任务
            });
        };
    }

    // 创建一个处理 3D 场景的回调函数
    createCompileSceneFunc(e) {
        return function () {
            // 临时保存每个对象的 visible 属性
            e.traverse(r => {
                r._tmpVisible = r.visible;
                r.visible = true;
            });

            let originalVisibility = e.visible;
            e.visible = true;  // 设置可见
            this.base.properties.renderer.compileAsync(e, this.base.properties.camera).then(() => {
                // 恢复原来的可见性
                e.traverse(r => {
                    r.visible = r._tmpVisible;
                });
                e.visible = originalVisibility;  // 恢复原始可见性
                this._onComplete();  // 编译完成后调用完成任务
            });
        };
    }

    // 创建一个处理纹理初始化的回调函数
    createInitTextureFunc(e) {
        return function () {
            this.base.properties.renderer.initTexture(e);  // 初始化纹理
            this._onComplete();  // 完成纹理初始化后调用完成任务
        };
    }
}

export default class TaskManager {
    percent = 1;               // 当前任务完成进度（0 ~ 1）
    taskList = [];             // 等待执行的任务列表
    _activeTaskList = [];      // 执行中的任务副本列表
    _activeTaskIndex = 0;      // 当前执行任务的索引
    _needsStart = false;       // 是否需要开始任务
    onCompleted = new MinSignal(); // 所有任务完成后的回调信号

    constructor(base) {
        this.base = base;
    }

    // 调用 start() 来准备开始任务
    start() {
        this._needsStart = true;
        this.percent = 0;
    }

    // 内部实际启动任务
    _start() {
        this._needsStart = false;
        // 清空任务队列并转入活动队列
        this._activeTaskList = this.taskList.splice(0, this.taskList.length);
        this._activeTaskIndex = 0;
    }

    // 添加任务（跳过动画时不添加）
    add(taskCallback) {
        if (!this.base.settings.SKIP_ANIMATION) {
            this.taskList.push(new Task(taskCallback, this.base));
        }
    }

    // 每帧调用 update，按顺序运行任务
    update() {
        if (this._needsStart) this._start();
        if (this._activeTaskList.length) {
            let currentTask = this._activeTaskList[this._activeTaskIndex];
            if (currentTask && !currentTask.isCompleted) {
                this._activeTaskIndex++;
                this.percent = this._activeTaskIndex / this._activeTaskList.length;
                currentTask.run(); // 执行任务
            }
        } else {
            // 所有任务已完成
            let previousPercent = this.percent;
            this.percent = 1;

            if (previousPercent < 1) {
                this.onCompleted.dispatch(); // 通知任务完成
            }
        }
    }
}
