/**
 * justThreeJs blueNoise.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/23 17:00:33
 */

import * as THREE from "three";

function filePath(path) {
    return new URL(`../../assets/${path}`, import.meta.url).href
}

export default class BlueNoise {
    // 共享的uniform变量
    shaderUniforms = {
        u_blueNoiseTexture: {value: null},           // 蓝噪声纹理(最近邻过滤)
        u_blueNoiseLinearTexture: {value: null},     // 蓝噪声纹理(线性过滤)
        u_blueNoiseTexelSize: {value: null},         // 纹素大小(1/纹理尺寸)
        u_blueNoiseCoordOffset: {value: new THREE.Vector2} // 噪声坐标偏移(用于动画)
    };

    // 纹理尺寸(128x128)
    TEXTURE_SIZE = 128;

    constructor(base) {
        this.base = base;
    }

    /**
     * 预初始化方法 - 加载和设置蓝噪声纹理
     */
    preInit() {
        // 创建线性过滤的纹理
        let linearTexture = new THREE.Texture();
        linearTexture.generateMipmaps = false;
        linearTexture.minFilter = THREE.LinearFilter;
        linearTexture.magFilter = THREE.LinearFilter;
        linearTexture.wrapS = THREE.RepeatWrapping;
        linearTexture.wrapT = THREE.RepeatWrapping;

        // 加载原始蓝噪声纹理
        let noiseTexture = new THREE.Texture(this.base.properties.loader.add(
            filePath("img/LDR_RGB1_0.png"),
            {
                weight: 55,  // 加载权重
                onLoad: function () {
                    // 纹理加载完成后的回调
                    noiseTexture.needsUpdate = true;
                    linearTexture.needsUpdate = true;
                }
            }
        ).content);

        // 共享图像数据
        linearTexture.image = noiseTexture.image;

        // 配置噪声纹理
        noiseTexture.generateMipmaps = false;
        noiseTexture.minFilter = THREE.NearestFilter;  // 使用最近邻过滤保持噪声特性
        noiseTexture.magFilter = THREE.NearestFilter;
        noiseTexture.wrapS = THREE.RepeatWrapping;
        noiseTexture.wrapT = THREE.RepeatWrapping;

        // 设置共享uniforms
        this.shaderUniforms.u_blueNoiseTexture.value = noiseTexture;
        this.shaderUniforms.u_blueNoiseLinearTexture.value = linearTexture;
        this.shaderUniforms.u_blueNoiseTexelSize.value = new THREE.Vector2(
            1 / this.TEXTURE_SIZE,
            1 / this.TEXTURE_SIZE
        );

    }

    /**
     * 更新方法 - 随机偏移噪声坐标
     * @param {number} e 时间增量
     */
    update(e) {
        // 随机更新噪声坐标偏移
        this.shaderUniforms.u_blueNoiseCoordOffset.value.set(
            Math.random(),
            Math.random()
        );
    }
}
