/**
 * justThreeJs aboutHeroRocks.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/27 15:00:31
 */

import {
    Object3D,
    Vector2,
    Vector4,
    InstancedBufferAttribute,
    InstancedBufferGeometry,
    Mesh,
    ShaderMaterial,
    DoubleSide,
    LinearMipmapLinearFilter
} from 'three';

// glsl
import vert$8 from '@/views/pages/lusion/glsl/about/vert$8.glsl'
import frag$c from '@/views/pages/lusion/glsl/about/frag$c.glsl'
import lightShadowMapFrag from '@/views/pages/lusion/glsl/about/lightShadowMapFrag.glsl'


function filePath(path) {
    return new URL(`../../assets/${path}`, import.meta.url).href
}

export default class AboutHeroRocks {
    ROCK_PIECE_COUNT = 16;   // 每块岩石由16个碎片组成
    FRAME_COUNT = 120;       // 动画总帧数
    FPS = 60;                // 帧率
    COUNT = 64;
    container = new Object3D();           // 容器，挂载所有Mesh
    meshList = [];                        // 正常显示的Mesh列表
    shadowMeshList = [];                  // 用于阴影绘制的Mesh列表
    meshAnimationUniformList = [];        // 每种岩石动画用的uniform
    meshInstanceUniformsList = [];         // 每种岩石实例的uniform
    meshInstanceAttributesList = [];       // 每种岩石实例的attribute
    time = 0;                             // 本地时间计数器


    constructor(base) {
        this.base = base;
        this.parent = base.base;
        this.shaderUniforms = {
            u_texture: {value: null},                      // 动画纹理
            u_animationTextureSize: {value: new Vector2(this.ROCK_PIECE_COUNT, this.FRAME_COUNT)}, // 动画纹理尺寸
            u_time: {value: 0},                             // 局部时间
            u_globalTime: {value: 0},                       // 全局时间
            u_scale: {value: 0},                            // 缩放因子
            u_lightPosition: this.base.light.shaderUniforms.u_lightPosition,   // 光照位置（外部传入）
            u_noiseStableFactor: this.base.sim.shaderUniforms.u_noiseStableFactor // 噪声稳定系数（外部传入）
        };
    }

    /**
     * 资源预加载
     */
    preInit() {
        // 加载 rocks.webp，并处理成四通道混合纹理
        this.parent.properties.loader.add(filePath("texture/rocks.webp"), {
            type: "texture",
            onLoad: (texture) => {
                const material = this.parent.fboHelper.createRawShaderMaterial({
                    uniforms: {
                        u_texture: {value: texture},
                        ...this.base.aboutHeroScatter.shaderUniforms
                    },
                    fragmentShader: `
                        uniform sampler2D u_texture;
                        varying vec2 v_uv;
                        void main() {
                            vec2 uv = v_uv * 0.5;
                            gl_FragColor = vec4(
                                texture2D(u_texture, uv).g,
                                texture2D(u_texture, uv + vec2(0.5, 0.0)).g,
                                texture2D(u_texture, uv + vec2(0.0, 0.5)).g,
                                texture2D(u_texture, uv + vec2(0.5, 0.5)).g
                            );
                        }
                    `
                });

                const renderTarget = this.parent.fboHelper.createRenderTarget(512, 512);
                renderTarget.texture.minFilter = LinearMipmapLinearFilter;
                renderTarget.texture.generateMipmaps = true;

                this.parent.fboHelper.render(material, renderTarget);

                this.shaderUniforms.u_texture.value = renderTarget.texture;

                material.dispose();
                texture.dispose();
            }
        }).content;

        // 加载4组岩石模型和动画数据
        for (let i = 0; i < 4; i++) {
            this.meshAnimationUniformList[i] = {
                u_posRandTexture: {value: null},
                u_orientTexture: {value: null}
            };

            this.meshInstanceUniformsList[i] = {
                u_textureChannelMixer: {
                    value: new Vector4(
                        +(i === 0),
                        +(i === 1),
                        +(i === 2),
                        +(i === 3)
                    )
                },
                ...this.meshAnimationUniformList[i],
                ...this.shaderUniforms,
                ...this.base.shaderUniforms,
                ...this.base.light.shaderUniforms,
                ...this.base.aboutHeroScatter.shaderUniforms
            };

            // 生成实例的随机属性
            const instanceIds = new Float32Array(this.COUNT);
            const instanceRands = new Float32Array(this.COUNT * 4);
            for (let j = 0; j < this.COUNT; j++) {
                instanceIds[j] = i + j * 4;
                instanceRands.set([
                    Math.random(),
                    Math.random(),
                    Math.random(),
                    Math.random()
                ], j * 4);
            }

            this.meshInstanceAttributesList[i] = {
                instanceId: new InstancedBufferAttribute(instanceIds, 1),
                instanceRands: new InstancedBufferAttribute(instanceRands, 4)
            };

            // 加载模型和动画数据
            this.parent.properties.loader.add(filePath(`buf/rock_${i}.buf`), {
                onLoad: this._onRockLoad.bind(this, i, false)
            });
            this.parent.properties.loader.add(filePath(`buf/rock_${i}_low.buf`), {
                onLoad: this._onRockLoad.bind(this, i, true)
            });
            this.parent.properties.loader.add(filePath(`buf/rock_animation_${i}.buf`), {
                onLoad: this._onRockAnimationLoad.bind(this, i)
            });
        }
    }

    /**
     * 加载普通Mesh或ShadowMesh
     */
    _onRockLoad(index, isShadow, geometryData) {
        const geometry = new InstancedBufferGeometry();
        for (const key in geometryData.attributes) {
            geometry.setAttribute(key, geometryData.attributes[key]);
        }
        geometry.index = geometryData.index;

        const attributes = this.meshInstanceAttributesList[index];
        geometry.setAttribute('instanceId', attributes.instanceId);
        geometry.setAttribute('instanceRands', attributes.instanceRands);

        const material = new ShaderMaterial({
            uniforms: this.meshInstanceUniformsList[index],
            vertexShader: vert$8,
            fragmentShader: frag$c
        });

        if (isShadow) {
            material.defines = {IS_SHADOW: true};
            material.fragmentShader = lightShadowMapFrag;
            material.side = DoubleSide;
        }

        const mesh = new Mesh(geometry, material);
        mesh.frustumCulled = false;

        if (isShadow) {
            this.shadowMeshList[index] = mesh;
        } else {
            this.meshList[index] = mesh;
        }
    }

    /**
     * 加载动画数据
     */
    _onRockAnimationLoad(index, geometryData) {
        const positionArray = geometryData.attributes.position.array;
        const orientArray = geometryData.attributes.orient.array;

        const posRandArray = new Float32Array(positionArray.length / 3 * 4);
        const randomSeed = [];

        for (let i = 0, j = 0, k = 0; j < positionArray.length; i++, j += 3, k += 4) {
            posRandArray[k] = positionArray[j];
            posRandArray[k + 1] = positionArray[j + 1];
            posRandArray[k + 2] = positionArray[j + 2];
            if (i < this.ROCK_PIECE_COUNT) {
                randomSeed[i] = Math.random();
            }
            posRandArray[k + 3] = randomSeed[i % this.ROCK_PIECE_COUNT];
        }

        this.meshAnimationUniformList[index].u_posRandTexture.value = this.parent.fboHelper.createDataTexture(
            posRandArray, this.ROCK_PIECE_COUNT, this.FRAME_COUNT, true, true
        );

        this.meshAnimationUniformList[index].u_orientTexture.value = this.parent.fboHelper.createDataTexture(
            orientArray, this.ROCK_PIECE_COUNT, this.FRAME_COUNT, true, true
        );
    }

    /**
     * 初始化，将mesh挂到container
     */
    init() {
        for (let i = 0; i < 4; i++) {
            if (this.meshList[i]) {
                this.container.add(this.meshList[i]);
            }
        }
    }

    /**
     * 更新动画
     */
    update(deltaTime) {
        if (!this.parent.properties.hasInitialized) return;

        this.time += deltaTime;
        this.shaderUniforms.u_time.value = this.time;
        this.shaderUniforms.u_globalTime.value = this.parent.properties.time;
        this.shaderUniforms.u_scale.value = this.parent.math.fit(
            this.base.introRatio, 0, 0.2, 0, 1
        );

        for (let i = 0; i < 4; i++) {
            if (this.shadowMeshList[i]) {
                this.base.light.renderMesh(this.shadowMeshList[i]);
            }
        }
    }
}
