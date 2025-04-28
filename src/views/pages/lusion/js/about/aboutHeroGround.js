/**
 * justThreeJs aboutHeroGround.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/27 15:33:29
 */


import {
    Object3D,
    Mesh,
    Color,
    Vector2,
    CircleGeometry,
    ShaderMaterial,
    LinearFilter
} from 'three';

//glsl
import frag$b from '@/views/pages/lusion/glsl/about/frag$b.glsl'
import groundVert from '@/views/pages/lusion/glsl/about/groundVert.glsl'
import groundFrag from '@/views/pages/lusion/glsl/about/groundFrag.glsl'
function filePath(path) {
    return new URL(`../../assets/${path}`, import.meta.url).href
}

export default class AboutHeroGround {
    container = new Object3D();      // 地面容器
    geometry = null;                 // 地面几何
    mesh = null;                     // 处理光影模糊的辅助Mesh
    texture = null;                  // 地面基础纹理（高光阴影高度图）

    RADIUS = 12;                     // 地面投影半径
    SIZE = 768;                      // 渲染纹理大小 (768x768)

    shaderUniforms = {
        u_groundShadowTexture: { value: null } // 当前地面阴影纹理
    };

    prevRenderTarget = null;         // 上一帧阴影缓存
    currRenderTarget = null;         // 当前帧阴影缓存
    blurCacheRenderTarget = null;    // 备用模糊缓存（预留）

    constructor(base) {
        this.base = base.base;
        this.parent = base;
    }

    /**
     * 预加载资源
     */
    preInit() {
        // 加载地形模型
        this.base.properties.loader.add(filePath("buf/terrain.buf"), {
            onLoad: (geo) => this.geometry = geo
        });

        // 加载地面高度光影图
        this.texture = this.base.properties.loader.load(
            filePath("texture/terrain_shadow_light_height.webp"),
            {
                type: "texture",
                flipY: true,
                minFilter: LinearFilter
            }
        ).content;
    }

    /**
     * 初始化对象、渲染纹理和材质
     */
    init() {
        // 创建渲染缓存
        this.prevRenderTarget = this.base.fboHelper.createRenderTarget(this.SIZE, this.SIZE);
        this.currRenderTarget = this.prevRenderTarget.clone();
        this.blurCacheRenderTarget = this.prevRenderTarget.clone();

        // 创建用于光影模糊处理的小圆面Mesh
        this.mesh = new Mesh(
            new CircleGeometry(1.1, 128),
            this.base.fboHelper.createRawShaderMaterial({
                uniforms: Object.assign({
                        u_prevTexture: { value: null },
                        u_radius: { value: this.RADIUS },
                        u_texelSize: { value: 1 / this.SIZE },
                        u_blueNoiseOffset: { value: new Vector2() }
                    },
                    this.parent.light.shaderUniforms,
                    this.base.blueNoise.shaderUniforms),
                fragmentShader: frag$b
            })
        );
        this.mesh.material.defines.LIGHT_SHADOW_SAMPLE_COUNT = 8;

        // 创建正式地面Mesh
        this.groundMesh = new Mesh(
            this.geometry,
            new ShaderMaterial({
                uniforms: Object.assign({
                        u_texture: { value: this.texture },
                        u_groundShadowTexture: { value: this.currRenderTarget.texture },
                        u_color: { value: new Color() },
                        u_bgColor: { value: new Color() },
                        u_noiseStableFactor: this.parent.sim.shaderUniforms.u_noiseStableFactor,
                        u_fogA: { value: 0.03 },
                        u_fogB: { value: 0.285 }
                    },
                    this.parent.light.shaderUniforms,
                    this.parent.aboutHeroScatter.shaderUniforms,
                    this.base.blueNoise.shaderUniforms,
                    this.parent.shaderUniforms),
                vertexShader: groundVert,
                fragmentShader: groundFrag
            })
        );
        this.groundMesh.material.extensions.derivatives = true;

        // 将地面添加到场景容器
        this.container.add(this.groundMesh);

        // 初次清除当前阴影纹理（设置为白色）
        this.base.fboHelper.clearColor(1, 1, 1, 1, this.currRenderTarget);
    }

    /**
     * 每帧更新
     * @param {number} deltaTime
     */
    update(deltaTime) {
        // 交换当前帧和上一帧的阴影缓存
        let temp = this.prevRenderTarget;
        this.prevRenderTarget = this.currRenderTarget;
        this.currRenderTarget = temp;

        let renderer = this.base.properties.renderer;
        let colorState = this.base.fboHelper.getColorState();
        let currentRenderTarget = renderer.getRenderTarget();

        // 渲染新的地面阴影到 currRenderTarget
        renderer.setRenderTarget(this.currRenderTarget);
        renderer.setClearColor(0xffffff, 1); // 白色清屏

        // 随机蓝噪采样偏移（抗锯齿用）
        this.mesh.material.uniforms.u_blueNoiseOffset.value.set(
            ~~(Math.random() * 128),
            ~~(Math.random() * 128)
        );
        this.mesh.material.uniforms.u_prevTexture.value = this.prevRenderTarget.texture;

        this.base.fboHelper.renderMesh(this.mesh, this.currRenderTarget);

        // 恢复渲染状态
        renderer.setRenderTarget(currentRenderTarget);
        this.base.fboHelper.setColorState(colorState);

        // 更新地面材质的动态uniforms
        this.groundMesh.material.uniforms.u_groundShadowTexture.value = this.currRenderTarget.texture;
        this.groundMesh.material.uniforms.u_bgColor.value.copy(this.base.properties.bgColor);
        this.groundMesh.material.uniforms.u_color.value.set("#ffffff");
    }
}

