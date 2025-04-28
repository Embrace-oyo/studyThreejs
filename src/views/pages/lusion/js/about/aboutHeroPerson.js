/**
 * justThreeJs aboutHeroPerson.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/28 14:15:02
 */
import * as THREE from "three";
// glsl
import vert$6 from '@/views/pages/lusion/glsl/about/vert$6.glsl'
import frag$9 from '@/views/pages/lusion/glsl/about/frag$9.glsl'
import shadowVert from '@/views/pages/lusion/glsl/about/shadowVert.glsl'
import shadowFrag from '@/views/pages/lusion/glsl/about/shadowFrag.glsl'
function filePath(path) {
    return new URL(`../../assets/${path}`, import.meta.url).href
}

let _v1$2 = new THREE.Vector3;
let _v2$1 = new THREE.Vector3;
let _q1$1 = new THREE.Quaternion;
let _q2 = new THREE.Quaternion;
export default class AboutHeroPerson {
    // 常量定义
    BONE_COUNT = 54;      // 骨骼数量
    FPS = 60;             // 动画帧率

    // 3D对象
    container = new THREE.Object3D();  // 容器对象
    geometry = null;       // 几何体
    mesh = null;           // 网格对象
    texture = null;        // 基础纹理
    shadowMesh = null;     // 阴影网格
    shadowTexture = null;  // 阴影纹理

    // 动画相关
    time = 0;              // 动画时间
    frameCount = 0;        // 动画总帧数
    bonePosAnimationData;  // 骨骼位置动画数据
    boneOrientAnimationData; // 骨骼旋转动画数据
    bonePoses = new Float32Array(this.BONE_COUNT * 3);  // 当前骨骼位置
    boneOrients = new Float32Array(this.BONE_COUNT * 4); // 当前骨骼旋转

    // 共享uniform变量
    shaderUniforms = {
        u_texture: { value: null },  // 纹理
        u_lightMixer: { value: new THREE.Vector3(1, 0, 0) }  // 灯光混合器
    };

    constructor(base) {
        this.parent = base;
        this.base = base.base;
    }

    /**
     * 预初始化 - 加载资源
     */
    preInit() {
        // 加载光照纹理
        this.base.properties.loader.load(filePath("texture/person_light.webp"), {
            type: "texture",
            onLoad: e => {
                this.lightTexture = e;
                this._onTextureLoad(e);
            }
        }).content;

        // 加载基础纹理
        this.base.properties.loader.load(filePath("texture/person.webp"), {
            type: "texture",
            onLoad: e => {
                this.texture = e;
                this._onTextureLoad(e);
            }
        }).content;

        // 加载阴影纹理
        this.shadowTexture = this.base.properties.loader.load(
            filePath("texture/ground_person_shadow.webp"),
            { type: "texture" }
        ).content;

        // 加载人物模型
        this.base.properties.loader.add(filePath("buf/person.buf"), {
            onLoad: e => {
                this._onModelLoad(e);
            }
        });

        // 加载动画数据
        this.base.properties.loader.add(filePath("buf/person_idle.buf"), {
            onLoad: e => {
                this._onAnimationLoad(e);
            }
        });
    }

    /**
     * 纹理加载完成回调
     */
    _onTextureLoad() {
        if (this.lightTexture && this.texture) {
            // 创建渲染目标
            let renderTarget = this.base.fboHelper.createRenderTarget(
                this.lightTexture.image.width,
                this.lightTexture.image.height
            );

            // 配置纹理
            renderTarget.texture.minFilter = THREE.LinearMipMapNearestFilter;
            renderTarget.texture.generateMipmaps = false;

            // 设置共享纹理
            this.shaderUniforms.u_texture.value = renderTarget.texture;

            // 纹理混合处理
            this.base.fboHelper.copy(this.base.textureHelper.transparentTexture, renderTarget);
            this.base.textureHelper.mixChannels(this.lightTexture, renderTarget, 0, 1, 2, -1);

            // 生成mipmap并混合基础纹理
            renderTarget.texture.generateMipmaps = true;
            this.base.textureHelper.mixChannels(this.texture, renderTarget, -1, -1, -1, 0);

            // 释放临时纹理
            this.texture.dispose();
            this.lightTexture.dispose();
            this.texture = null;
            this.lightTexture = null;
        }
    }

    /**
     * 模型加载完成回调
     * @param {BufferGeometry} e 加载的模型几何体
     */
    _onModelLoad(e) {
        // 创建人物网格
        this.mesh = new THREE.Mesh(
            e,
            new THREE.ShaderMaterial({
                uniforms: Object.assign({
                    u_texture: this.shaderUniforms.u_texture,
                    u_lightMixer: this.shaderUniforms.u_lightMixer,
                    u_bonePoses: { value: this.bonePoses },
                    u_boneOrients: { value: this.boneOrients }
                }, this.parent.light.shaderUniforms, this.parent.aboutHeroScatter.shaderUniforms, this.parent.shaderUniforms),
                vertexShader: vert$6,
                fragmentShader: frag$9
            })
        );

        // 设置骨骼数量定义
        this.mesh.material.defines.BONE_COUNT = this.BONE_COUNT;

        // 添加到容器
        this.container.add(this.mesh);
    }

    /**
     * 动画数据加载完成回调
     * @param {BufferGeometry} e 加载的动画数据
     */
    _onAnimationLoad(e) {
        // 存储骨骼动画数据
        this.bonePosAnimationData = e.attributes.position.array;
        this.boneOrientAnimationData = e.attributes.orient.array;

        // 计算总帧数
        this.frameCount = this.bonePosAnimationData.length / (this.BONE_COUNT * 3);
    }

    /**
     * 初始化 - 创建阴影网格
     */
    init() {
        // 创建阴影网格
        this.shadowMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(1.5, 1.5),
            new THREE.ShaderMaterial({
                uniforms: Object.assign({
                    u_texture: { value: this.shadowTexture },
                    u_lightMixer: this.shaderUniforms.u_lightMixer
                }, this.base.blueNoise.shaderUniforms),
                vertexShader: shadowVert,
                fragmentShader: shadowFrag,
                blending: THREE.MultiplyBlending  // 使用乘法混合
            })
        );

        // 配置阴影网格
        this.shadowMesh.renderOrder = 10;  // 渲染顺序
        this.shadowMesh.position.y = 0.01; // 稍微高于地面
        this.shadowMesh.rotation.x = -Math.PI / 2; // 旋转到水平面

        // 添加到容器
        this.container.add(this.shadowMesh);
    }

    /**
     * 更新动画
     * @param {number} deltaTime 时间增量
     */
    update(deltaTime) {
        if (this.mesh && this.frameCount) {
            // 更新时间
            this.time += deltaTime * 0.5;

            // 计算当前帧和插值
            let frameTime = this.time * this.FPS % this.frameCount;
            let prevFrame = Math.floor(frameTime);
            let nextFrame = Math.ceil(frameTime) % this.frameCount;
            let lerpFactor = frameTime - prevFrame;

            // 计算帧偏移量
            let prevOffset = prevFrame * this.BONE_COUNT;
            let nextOffset = nextFrame * this.BONE_COUNT;
            let sectionLength = this.frameCount / 3;

            // 更新灯光混合参数(三阶段过渡)
            this.shaderUniforms.u_lightMixer.value.set(
                this.base.math.fit(frameTime, sectionLength * 2, this.frameCount, 0, 1) +
                this.base.math.fit(frameTime, 0, sectionLength, 1, 0),
                this.base.math.fit(frameTime, 0, sectionLength, 0, 1) *
                this.base.math.fit(frameTime, sectionLength, sectionLength * 2, 1, 0),
                this.base.math.fit(frameTime, sectionLength, sectionLength * 2, 0, 1) *
                this.base.math.fit(frameTime, sectionLength * 2, this.frameCount, 1, 0)
            );

            // 更新每个骨骼的位置和旋转
            for (let i = 0; i < this.BONE_COUNT; i++) {
                // 插值计算骨骼位置
                _v1$2.fromArray(this.bonePosAnimationData, (prevOffset + i) * 3)
                    .lerp(_v2$1.fromArray(this.bonePosAnimationData, (nextOffset + i) * 3), lerpFactor)
                    .toArray(this.bonePoses, i * 3);

                // 插值计算骨骼旋转(四元数球面插值)
                _q1$1.fromArray(this.boneOrientAnimationData, (prevOffset + i) * 4)
                    .slerp(_q2.fromArray(this.boneOrientAnimationData, (nextOffset + i) * 4), lerpFactor)
                    .toArray(this.boneOrients, i * 4);
            }
        }
    }
}
