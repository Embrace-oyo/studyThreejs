/**
 * justThreeJs whoSubsectionTeam.js
 * @author kongjianqiu
 * @description
 * @created 2025/5/6 17:00:31
 */


/**
 * WhoSubsectionTeam 类 - 管理"关于我们"页面中的团队成员展示部分
 * 包含团队成员信息的展示、切换动画和交互逻辑
 */
import * as THREE from "three";
import SecondOrderDynamics from '@/views/pages/lusion/js/utils/secondOrderDynamics'
import Tween from "@/views/pages/lusion/js/utils/tween.js";
import UfxMesh from "@/views/pages/lusion/js/utils/ufxMesh.js";
import TextAnimationHelper from "@/views/pages/lusion/js/utils/textAnimationHelper.js";
import {easeInOutCubic, easeInOutBack, easeOutBack, easeInOutExpo} from 'easing-utils';
// glsl
import letterVert from '@/views/pages/lusion/glsl/about/letterVert.glsl'
import letterFrag from '@/views/pages/lusion/glsl/about/letterFrag.glsl'

function filePath(path) {
    return new URL(`../../../../../assets/${path}`, import.meta.url).href
}

export default class WhoSubsectionTeam {
    domContainer;
    domProgress;
    domLeftTexts;
    domLeftNamePlaceholder;
    domLeftNameText;
    domLeftJobPlaceholder;
    domLeftJobText;
    domRight;
    domIndicator;
    domIndicatorInner;
    teamDataMap = {};
    teamDataList = [];
    faceId = "edan";
    targetActiveFaceIndex = 0;
    faceIndex = 0;
    _faceIndexTween;
    facesCount = 0;
    faceIndexTimer = 0;
    containerOffsetX = 0;
    itemActiveRatio = 0;
    isForward = !0;
    wasActive = null;
    isChangable = !1;
    canSwipe = !0;
    hasSwiped = !1;
    hasSwipedOnce = !1;
    _isAnimating = !1;
    timeBaseChangeSpeed = .2;
    lastSwipeTime = -1;
    domCursorDirection = -1;
    domCursorActive = !1;
    domCursorActiveRatio = 0;
    domCursorRotateRatio = 0;
    domCursorExtraRotationMotion = new SecondOrderDynamics(0, 1, .8, 1.2);
    faceRect = {x: 0, y: 0, width: 0, height: 0, offsetX: 0, offsetY: 0};
    letterRect = {x: 0, y: 0, width: 0, height: 0, offsetX: 0, offsetY: 0};
    domRightWidth = 0;

    constructor(base) {
        this.base = base.base;
        this.parent = base;
    }

    /**
     * 预初始化方法 - 获取DOM引用并加载初始数据
     * @param {HTMLElement} e - 父容器元素
     */
    preInit(e) {
        this.aboutWhoSection = this.parent;
        this.aboutPage = this.parent.parent;
        this.aboutHero = this.parent.aboutHero;
        this.aboutHeroFaces = this.parent.aboutHero.aboutHeroFaces;
        this.textAnimationHelper = new TextAnimationHelper(this.base)
        // ============== 1. 获取所有DOM元素引用 ==============
        this.domContainer = e.querySelector("#about-who-subsection-team");
        this.domProgress = e.querySelector("#about-who-team-progress");
        this.domLeft = e.querySelector("#about-who-team-left");
        this.domLeftInfo = e.querySelector("#about-who-team-info");
        this.domLeftNameIcon = e.querySelector("#about-who-team-name-icon");
        this.domLeftNamePlaceholder = e.querySelector("#about-who-team-name-placeholder");
        this.domLeftNameText = e.querySelector("#about-who-team-name-text");
        this.domLeftJobPlaceholder = e.querySelector("#about-who-team-job-placeholder");
        this.domLeftJobText = e.querySelector("#about-who-team-job-text");
        this.domNumber = e.querySelector("#about-who-team-number");
        this.domTopCompass = e.querySelector("#about-who-team-top-compass");
        this.domBottomCompass = e.querySelector("#about-who-team-bottom-compass");
        this.domDots = e.querySelector("#about-who-team-dots");
        this.domLetterContainer = e.querySelector("#about-who-team-letter-container");

        // 进度指示器相关元素
        this.domIndicator = this.domProgress.querySelector("#about-who-team-indicator");
        this.domIndicatorInner = this.domProgress.querySelector("#about-who-team-indicator-inner");
        this.domIndicator._prevActiveRatio = -1; // 初始化激活比例

        // 右侧区域元素
        this.domRight = e.querySelector("#about-who-team-right");
        this.domTitle = e.querySelector("#about-who-team-title");
        this.domDesc = e.querySelector("#about-who-team-desc");
        this.domDescText = e.querySelector("#about-who-team-desc-text");
        this.domDescSquare = e.querySelector("#about-who-team-square");

        // 交互相关元素
        this.domCursor = e.querySelector("#about-who-face-cursor");
        this.domCursorArrow = e.querySelector("#about-who-face-cursor-arrow");
        this.domFaces = e.querySelector("#about-who-team-faces");
        this.domMobileSwipe = e.querySelector("#about-who-team-left-mobile-tips");
        this.domTeamNumber = e.querySelector("#about-who-team-number-center-item");
        // ============== 2. 加载团队数据 ==============
        this.base.properties.loader.add(filePath("json/team.json"), {
            onLoad: (teamData) => {
                // 保存团队数据
                this.teamDataList = teamData;

                // 创建UI元素
                this._createUIElements();

                // 建立数据索引映射
                for (let i = 0; i < teamData.length; i++) {
                    teamData[i].index = i; // 添加索引属性
                    this.teamDataMap[teamData[i].id] = teamData[i]; // ID到数据的映射
                }
            }
        });

        // ============== 3. 加载默认面部 ==============
        this.aboutHeroFaces.load(this.faceId);

        // ============== 4. 初始化3D字母效果 ==============
        this.letterMesh = new UfxMesh({
            uniforms: {
                // 字体纹理
                u_texture: {
                    value: this.base.properties.loader.add(
                        filePath("texture/font.png"),
                        {
                            minFilter: THREE.LinearFilter, // 纹理过滤方式
                            type: "texture"
                        }
                    ).content
                },
                // 字母索引（0-25对应A-Z）
                u_letterIdx: {value: 0},
                // 透明度
                u_opacity: {value: 1},
                // 共享时间变量（用于动画）
                u_time: this.base.properties.shaderUniforms.u_time
            },
            // 着色器
            vertexShader: letterVert,
            fragmentShader: letterFrag
        }, this.base);

        // 初始隐藏字母网格
        this.letterMesh.visible = false;
        // 添加到页面容器
        this.aboutPage.postUfxContainer.add(this.letterMesh);

        // ============== 5. 初始化补间动画 ==============
        this._faceIndexTween = new Tween(this, () => {
            this.onTweenComplete(); // 动画完成回调
        });
    }

    /**
     * 初始化组件滑动事件监听
     * 设置横向滚动(滑动)和触摸释放的事件处理器
     */
    init() {
        // 添加横向滚动(滑动)事件监听
        this.base.input.onXScrolled.add(() => {
            // 检查有效滑动的条件:
            // 1. 当前使用移动端布局
            // 2. 当前允许滑动操作
            // 3. 组件之前处于活跃状态
            // 4. 距离上次滑动时间超过0.5秒(防抖)
            if (this.base.properties.useMobileLayout &&
                this.canSwipe &&
                this.wasActive &&
                this.base.properties.time - this.lastSwipeTime > 0.5) {

                // 更新滑动状态
                this.hasSwiped = true;                // 标记已滑动
                this.canSwipe = false;              // 暂时禁用进一步滑动
                this.domCursorDirection = this.base.input.lastScrollXDirection; // 存储滑动方向
                this.lastSwipeTime = this.base.properties.time; // 更新最后滑动时间戳
            }
        }, this);

        // 添加触摸释放事件监听(手指抬起时重新启用滑动)
        this.base.input.onUped.add(() => {
            this.canSwipe = true; // 当手指抬起时重新启用滑动功能
        }, this);
    }

    onPageShow() {
        this.aboutHeroFaces.showRatio = 0;
        for (let e = 0; e < this.teamDataList.length; e++) {
            let t = this.teamDataList[e].id;
            this.aboutHeroFaces.load(t)
        }
        this.facesCount = this.teamDataList.length
        this.updateTeamNumberUI()
    }

    /**
     * 切换到上一个面板
     * 执行以下操作：
     * 1. 减少目标面板索引
     * 2. 设置滑动方向为向后
     * 3. 清除现有动画
     * 4. 启动新动画
     * 5. 更新队伍编号UI
     */
    prev() {
        // 目标面板索引减1
        this.targetActiveFaceIndex--;

        // 标记滑动方向为向后(非前进)
        this.isForward = false;

        // 清除当前所有动画效果
        this._clearTween();

        // 设置动画状态为进行中
        this._isAnimating = true;

        // 创建新的面板切换动画：
        // - 动画持续时间基础值1.25秒
        // - 根据目标面板与当前面板的距离增加额外时间(每差1个面板增加0.25秒)
        // - 使用三次缓动函数实现平滑的加速减速效果
        this._faceIndexTween.to(
            1.25 + Math.abs(this.targetActiveFaceIndex - this.faceIndex) * 0.25,
            {faceIndex: this.targetActiveFaceIndex},
            easeInOutCubic
        );

        // 更新队伍编号的用户界面显示
        this.updateTeamNumberUI();
    }

    /**
     * 切换到下一个面板
     * 执行以下操作：
     * 1. 增加目标面板索引
     * 2. 设置滑动方向为向前
     * 3. 清除现有动画
     * 4. 启动新动画
     * 5. 更新队伍编号UI
     */
    next() {
        // 目标面板索引加1
        this.targetActiveFaceIndex++;

        // 标记滑动方向为向前
        this.isForward = true;

        // 清除当前所有动画效果
        this._clearTween();

        // 设置动画状态为进行中
        this._isAnimating = true;

        // 创建新的面板切换动画：
        // - 基础动画时间1.25秒
        // - 根据面板距离增加额外时间(每差1个面板加0.25秒)
        // - 使用缓动函数实现平滑过渡
        this._faceIndexTween.to(
            1.25 + Math.abs(this.targetActiveFaceIndex - this.faceIndex) * 0.25,
            {faceIndex: this.targetActiveFaceIndex},
            easeInOutCubic
        );

        // 更新队伍编号显示
        this.updateTeamNumberUI();
    }

    /**
     * 清除当前动画效果
     */
    _clearTween() {
        // 标记动画状态为未进行
        this._isAnimating = false;

        // 终止当前动画
        this._faceIndexTween.kill();
    }

    /**
     * 更新队伍编号UI显示
     * 格式化为3位数字(不足补零)，例如：001, 012, 123
     */
    updateTeamNumberUI() {
        // 计算显示的数字：
        // 1. 对面板总数取模防止溢出
        // 2. 加1001后取子串实现补零(如5 → "1006" → "006")
        const teamNumber = `${(this.base.math.mod(this.targetActiveFaceIndex, this.facesCount) + 1001).toString().substring(1)}`;

        // 更新DOM元素显示
        this.domTeamNumber.innerHTML = teamNumber;
    }

    /**
     * 动画完成回调函数
     * 执行以下操作：
     * 1. 清除动画状态
     * 2. 重置面板计时器
     * 3. 根据当前索引更新UI显示
     */
    onTweenComplete() {
        // 清除当前动画状态
        this._clearTween();

        // 重置面板切换计时器
        this.faceIndexTimer = 0;

        // 更新UI显示当前面板
        // 使用模运算确保索引在有效范围内
        this._changeFaceUIByIndex(
            this.base.math.mod(this.targetActiveFaceIndex, this.teamDataList.length)
        );
    }

    /**
     * 重置组件状态
     * 将所有状态恢复初始值并显示第一个面板
     */
    reset() {
        // 清除当前动画
        this._clearTween();

        // 重置计时器和索引
        this.faceIndexTimer = 0;
        this.targetActiveFaceIndex = 0;
        this.faceIndex = 0;

        // 启用滑动功能并设置默认方向为向前
        this.canSwipe = true;
        this.isForward = true;

        // 显示第一个面板
        this._changeFaceUIByIndex(0);
    }

    /**
     * 处理窗口大小改变事件
     * @param {number} e - 窗口宽度
     * @param {number} t - 窗口高度
     */
    resize(e, t) {
        // 重新分割文本(适应新尺寸)
        this._splitText();

        // 同步容器偏移量
        this.syncContainerOffset();

        // 更新右侧容器宽度
        this.domRightWidth = this.domRight.offsetWidth;

        // 获取容器和面板的尺寸信息
        const containerRect = this.domContainer.getBoundingClientRect();
        const facesRect = this.domFaces.getBoundingClientRect();

        // 更新面板矩形区域信息
        this._updateRect(this.faceRect, facesRect, containerRect);

        // 获取文字容器尺寸并更新
        const letterRect = this.domLetterContainer.getBoundingClientRect();
        this._updateRect(this.letterRect, letterRect, containerRect);

        // 再次分割文本确保布局正确
        this._splitText();
    }

    /**
     * 更新矩形区域的位置和尺寸信息
     * @param {Object} e - 要更新的矩形对象(存储计算结果)
     * @param {DOMRect} t - 源元素的边界矩形(来自getBoundingClientRect)
     * @param {DOMRect} r - 参考容器的边界矩形(用于计算相对偏移)
     */
    _updateRect(e, t, r) {
        // 计算绝对位置X坐标(考虑容器偏移和滚动位置)
        e.x = t.left - this.aboutWhoSection.subsectionContainerOffsetX - this.containerOffsetX;

        // 计算绝对位置Y坐标(考虑容器偏移和滚动位置)
        e.y = t.top - this.aboutWhoSection.subsectionContainerOffsetY + this.base.scrollManager.scrollPixel;

        // 设置矩形宽度
        e.width = t.width;

        // 设置矩形高度
        e.height = t.height;

        // 计算相对于参考容器的X偏移量
        e.offsetX = t.left - r.left;

        // 计算相对于参考容器的Y偏移量
        e.offsetY = t.top - r.top;
    }

    /**
     * 根据索引更新团队成员信息UI
     * @param {number} e - 团队成员索引
     */
    _changeFaceUIByIndex(e) {
        // 确保索引在有效范围内(使用模运算循环)
        e = this.base.math.mod(e, this.teamDataList.length);

        // 获取当前团队成员数据
        const teamMemberId = this.faceId = this.teamDataList[e].id;
        const teamMember = this.teamDataMap[teamMemberId];
        const memberName = teamMember.name;
        const memberRole = teamMember.role;

        // 更新成员姓名UI
        this.domLeftNamePlaceholder.innerHTML = memberName;
        this.textAnimationHelper.setMatrixText(
            this.domLeftNameText,
            memberName,
            0,      // 动画延迟
            1,      // 动画持续时间
            3,      // 动画效果类型
            1 / 30  // 动画间隔
        );

        // 更新成员职位UI
        this.domLeftJobPlaceholder.innerHTML = memberRole;
        this.textAnimationHelper.setMatrixText(
            this.domLeftJobText,
            memberRole,
            0,      // 动画延迟
            1,      // 动画持续时间
            3,      // 动画效果类型
            1 / 30  // 动画间隔
        );
    }

    /**
     * 创建团队展示页面的UI元素
     * 包括顶部罗盘、底部罗盘和导航圆点
     */
    _createUIElements() {
        // 创建顶部罗盘内部容器
        const topCompassInner = document.createElement("div");
        topCompassInner.id = "about-who-team-top-compass-inner";
        this.topCompassInnerDiv = topCompassInner;

        // 创建顶部罗盘的长短线元素
        for (let row = 0; row < this.teamDataList.length - 4; row++) {
            for (let col = 0; col < 4; col++) {
                // 创建长线元素
                const longLine = document.createElement("div");
                longLine.classList.add("about-who-team-top-compass-long");
                topCompassInner.append(longLine);

                // 创建4个短线元素
                for (let shortLine = 0; shortLine < 4; shortLine++) {
                    const shortLineElement = document.createElement("div");
                    shortLineElement.classList.add("about-who-team-top-compass-small");
                    topCompassInner.append(shortLineElement);
                }
            }
        }
        this.domTopCompass.append(topCompassInner);

        // 创建底部罗盘内部容器
        const bottomCompassInner = document.createElement("div");
        bottomCompassInner.id = "about-who-team-bottom-compass-inner";
        this.bottomCompassInnerDiv = bottomCompassInner;

        // 创建底部罗盘的长短线元素
        for (let row = 0; row < this.teamDataList.length - 4; row++) {
            for (let col = 0; col < 4; col++) {
                // 创建长线元素
                const longLine = document.createElement("div");
                longLine.classList.add("about-who-team-bottom-compass-long");
                bottomCompassInner.append(longLine);

                // 创建4个短线元素
                for (let shortLine = 0; shortLine < 4; shortLine++) {
                    const shortLineElement = document.createElement("div");
                    shortLineElement.classList.add("about-who-team-bottom-compass-small");
                    bottomCompassInner.append(shortLineElement);
                }
            }
        }
        this.domBottomCompass.append(bottomCompassInner);

        // 创建导航圆点
        for (let col = 0; col < 11; col++) {
            const dotColumn = document.createElement("div");
            dotColumn.classList.add("about-who-team-dots-col");

            // 每列创建3个圆点
            for (let row = 0; row < 3; row++) {
                const dot = document.createElement("div");
                dot.classList.add("about-who-team-dot");
                dotColumn.append(dot);
            }
            this.domDots.append(dotColumn);
        }

        // 计算罗盘容器的额外宽度
        this.topCompassInnerDiv._width =
            this.topCompassInnerDiv.getBoundingClientRect().width -
            this.domTopCompass.getBoundingClientRect().width;

        this.bottomCompassInnerDiv._width =
            this.bottomCompassInnerDiv.getBoundingClientRect().width -
            this.domBottomCompass.getBoundingClientRect().width;
    }

    /**
     * 同步容器偏移量
     * 根据当前滚动比例和设备类型调整容器水平位置
     */
    syncContainerOffset() {
        // 计算容器偏移量：
        // - 移动端布局时固定为0
        // - 桌面端布局时根据滚动比例计算动态偏移
        this.containerOffsetX = this.base.properties.useMobileLayout
            ? 0
            : (this.aboutWhoSection.scrollRatio * this.aboutWhoSection.PAGE_DISTANCE -
                this.aboutWhoSection.PAGE_DISTANCE * 2) *
            this.base.properties.viewportWidth;

        // 应用3D变换实现平滑移动效果
        this.domContainer.style.transform = `translate3d(${this.containerOffsetX}px, 0, 0)`;
    }

    _splitText() {
    }

    preUpdate() {
        this.domCursor.style.display = "none"
        this.letterMesh.visible = !1
    }

    onSwipe() {
        this.hasSwipedOnce = !0
    }

    /**
     * 更新团队展示页面的状态和动画
     * @param {number} e - 增量时间(用于动画插值)
     * @param {boolean} t - 当前页面是否处于活动状态
     * @param {number} r - 页面滚动比例
     * @param {number} n - 视口高度
     * @param {number} a - 未使用参数
     * @param {number} l - 页面可见比例
     */
    update(e, t, r, n, a, l) {
        // 1. 处理英雄面孔显示逻辑
        const isMoreThanHalfVisible = l > 0.5;
        this.aboutHeroFaces.showRatio = this.base.math.saturate(
            this.aboutHeroFaces.showRatio + (isMoreThanHalfVisible ? e : -e) / 1.5
        );
        this.aboutHeroFaces.isActive = this.aboutHeroFaces.showRatio > 0;

        // 2. 更新项目活动比例
        this.itemActiveRatio = this.base.math.saturate(
            this.itemActiveRatio + (this.aboutHeroFaces.isActive ?
                (this._isAnimating ? -2 : 2) : 0) * e
        );

        // 3. 同步容器偏移量
        if (t) {
            this.syncContainerOffset();
        }

        // 4. 处理移动端滑动提示
        if (isMoreThanHalfVisible && !this.hasSwipedOnce) {
            this.domMobileSwipe.classList.add("--is-active");
        } else {
            this.domMobileSwipe.classList.remove("--is-active");
        }

        // 5. 计算鼠标交互区域
        const faceX = this.faceRect.x + this.aboutWhoSection.subsectionContainerOffsetX + this.containerOffsetX;
        const faceY = this.faceRect.y + this.aboutWhoSection.subsectionContainerOffsetY - this.base.scrollManager.scrollPixel;
        const faceWidth = this.faceRect.width;
        const faceHeight = this.faceRect.height;

        const mouseX = this.base.input.easedMouseDynamics.default.value.x;
        const mouseY = this.base.input.easedMouseDynamics.default.value.y;

        const screenX = (mouseX * 0.5 + 0.5) * this.base.properties.viewportWidth;
        const screenY = (0.5 - mouseY * 0.5) * this.base.properties.viewportHeight;

        let isCursorOverFace = false;

        // 6. 处理光标交互
        if (this.base.properties.useMobileLayout) {
            this.domCursor.style.display = "none";
        } else {
            if (!this.wasActive) {
                this.domCursorActiveRatio = 0;
            }

            isCursorOverFace = isMoreThanHalfVisible &&
                screenX > faceX &&
                screenX < faceX + faceWidth &&
                screenY > faceY &&
                screenY < faceY + faceHeight;

            this.domCursorActiveRatio = this.base.math.saturate(
                this.domCursorActiveRatio + (isCursorOverFace ? e : -e) * 1.5
            );

            isCursorOverFace = this.domCursorActiveRatio > 0;
            this.domCursorDirection = (screenX - faceX - faceWidth * 0.5 > 0) ? 1 : -1;

            if (isCursorOverFace) {
                this.domCursor.style.display = "flex";

                const cursorX = screenX - faceX;
                const cursorY = screenY + this.faceRect.offsetY - faceY;

                const cursorScale = Math.min(2.5,
                        this.base.input.easedMouseDynamics.default.valueVel.length() / 5 + 1
                    ) * easeOutBack(this.domCursorActiveRatio) *
                    this.base.math.fit(n, 0, this.base.properties.viewportHeight, 1, 0);

                this.domCursor.style.transform = `
                translate3d(${cursorX}px, ${cursorY}px, 0) 
                translate3d(-50%, -50%, 0) 
                scale(${cursorScale})
            `;

                this.domCursorRotateRatio = this.base.math.saturate(
                    this.domCursorRotateRatio + (this.domCursorDirection > 0 ? e * 3 : e * -3)
                );

                this.domCursorExtraRotationMotion.update(
                    e,
                    this.base.math.clamp(
                        this.base.input.easedMouseDynamics.default.valueVel.y *
                        -this.domCursorDirection,
                        -1,
                        1
                    )
                );

                const rotation = easeInOutBack(this.domCursorRotateRatio);
                this.domCursorArrow.style.transform = `
                rotate(${rotation * 180 + this.domCursorExtraRotationMotion.value * 75}deg)
            `;
            } else {
                this.domCursor.style.display = "none";
            }
        }

        // 7. 处理UI元素透明度
        let titleOpacity = 0;
        let descOpacity = 0;
        let leftOpacity = 0;

        if (t) {
            if (this.base.properties.useMobileLayout) {
                titleOpacity = this.base.math.fit(r, -0.5, 0, 0, 1);
                descOpacity = this.base.math.fit(r, -0.5, 0, 0, 1) *
                    this.base.math.fit(r, 0.5, 1, 1, 0);
                leftOpacity = l;
            } else {
                titleOpacity = this.base.math.fit(r, -0.5, -0.2, 0, 1);
                descOpacity = this.base.math.fit(r, -0.4, -0.1, 0, 1);
                leftOpacity = this.base.math.fit(r, -0.3, 0, 0, 1);
            }

            this.domTitle.style.opacity = titleOpacity;
            this.domDesc.style.opacity = descOpacity;
            this.domLeft.style.opacity = leftOpacity;

            this.domLeft.style.visibility = "visible";
            this.domTitle.style.visibility = "visible";
            this.domDesc.style.visibility = "visible";

            // 更新字母网格位置
            this.letterMesh.syncRect(
                this.letterRect.x + this.aboutWhoSection.subsectionContainerOffsetX + this.containerOffsetX,
                this.letterRect.y + this.aboutWhoSection.subsectionContainerOffsetY - this.base.scrollManager.scrollPixel,
                this.letterRect.width,
                this.letterRect.height
            );

            this.letterMesh.update();
            this.letterMesh.visible = true;
        } else {
            this.domLeft.style.visibility = "hidden";
            this.domTitle.style.visibility = "hidden";
            this.domDesc.style.visibility = "hidden";
        }

        // 8. 处理团队成员数据
        if (this.teamDataList.length) {
            if (t) {
                // 初始化状态
                if (!this.wasActive) {
                    this.reset();
                }

                // 处理桌面端相机偏移
                if (!this.base.properties.useMobileLayout) {
                    this.aboutHero.properties.cameraViewportOffsetX =
                        (this.base.properties.viewportWidth / 2 -
                            (this.base.properties.viewportWidth - this.domRightWidth) / 2) *
                        this.base.math.fit(r, -this.aboutWhoSection.PAGE_DISTANCE, 0, 0, 1, easeInOutCubic);
                }

                // 处理点击/滑动事件
                const shouldTriggerAction = this.hasSwiped && isMoreThanHalfVisible;
                if ((shouldTriggerAction || (isCursorOverFace && this.base.input.justClicked))) {
                    // audios.countPlay("click");
                    this.domCursorDirection === 1 ? this.next() : this.prev();
                }

                if (shouldTriggerAction) {
                    this.onSwipe();
                }

                // 处理自动切换计时器
                const prevTimerValue = this.faceIndexTimer;
                this.faceIndexTimer = Math.min(1,
                    this.faceIndexTimer + e * this.timeBaseChangeSpeed * (this._isAnimating ? 0 : 1)
                );

                if (prevTimerValue < 1 && this.faceIndexTimer >= 1) {
                    this.isForward ? this.next() : this.prev();
                }

                // 更新当前和下一个团队成员
                const currentIndex = Math.floor(this.base.math.mod(this.faceIndex, this.teamDataList.length));
                const nextIndex = this.base.math.mod(currentIndex + 1, this.teamDataList.length);
                const transitionRatio = this.faceIndex - Math.floor(this.faceIndex);

                this.aboutHeroFaces.currId = this.teamDataList[currentIndex].id;
                this.aboutHeroFaces.nextId = this.teamDataList[nextIndex].id;
                this.aboutHeroFaces.transitionRatio = transitionRatio;

                // 更新指示器
                const indicatorInner = this.domIndicatorInner;
                indicatorInner.style.transform = `scaleX(${this.faceIndexTimer})`;
                this.domIndicator.style.transform = `scaleX(${easeInOutExpo(this.itemActiveRatio)})`;

                // 计算图标闪烁效果
                const iconOpacity = this.itemActiveRatio > 0.95 ? 1 :
                    (Math.cos(this.itemActiveRatio * 17.213) * 0.5 + 0.5) *
                    Math.pow(this.itemActiveRatio, 0.25);

                this.domLeftNameIcon.style.opacity = iconOpacity;

                // 更新文本动画
                this.domLeftNameText._direction = this.domLeftJobText._direction =
                    this._isAnimating ? -1 : 1;
                this.domLeftNameText._letterPerSecond = this.domLeftJobText._letterPerSecond =
                    this._isAnimating ? 60 : 30;

                this.textAnimationHelper.updateMatrixText(this.domLeftNameText);
                this.textAnimationHelper.updateMatrixText(this.domLeftJobText);

                // 更新字母网格材质
                this.letterMesh.material.uniforms.u_letterIdx.value =
                    this.aboutHeroFaces.currId.substring(0, 1).toUpperCase().charCodeAt(0) - 65;
                this.letterMesh.material.uniforms.u_opacity.value = leftOpacity * iconOpacity;
            } else {
                this._clearTween();
            }
        }

        // 9. 更新状态标志
        this.wasActive = t;
        this.hasSwiped = false;
    }
}

