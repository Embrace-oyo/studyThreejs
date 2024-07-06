/**
 * justThreeJs blueNoise.js
 * @author kongjianqiu
 * @description
 * @created 2024/7/4 16:16:52
 */
import * as THREE from "three";

let getBlueNoiseShader = `#define GLSLIFY 1
uniform sampler2D u_blueNoiseTexture;uniform vec2 u_blueNoiseTexelSize;uniform vec2 u_blueNoiseCoordOffset;vec3 getBlueNoise(vec2 coord){return texture2D(u_blueNoiseTexture,coord*u_blueNoiseTexelSize+u_blueNoiseCoordOffset).rgb;}vec3 getStaticBlueNoise(vec2 coord){return texture2D(u_blueNoiseTexture,coord*u_blueNoiseTexelSize).rgb;}`;

export default class BlueNoise {
    sharedUniforms = {
        u_blueNoiseTexture: {value: null},
        u_blueNoiseLinearTexture: {value: null},
        u_blueNoiseTexelSize: {value: null},
        u_blueNoiseCoordOffset: {value: new THREE.Vector2}
    };
    TEXTURE_SIZE = 128;

    constructor(base) {
        this.base = base
    }

    preInit() {
        let e = new THREE.Texture;
        e.generateMipmaps = !1
        e.minFilter = e.magFilter = THREE.LinearFilter
        e.wrapS = e.wrapT = THREE.RepeatWrapping;
        let t = new THREE.Texture(this.base.properties.loader.add("https://lusion.dev/assets/textures/LDR_RGB1_0.png", {
            weight: 55,
            onLoad: function () {
                t.needsUpdate = !0
                e.needsUpdate = !0
            }
        }).content);
        e.image = t.image
        t.generateMipmaps = !1
        t.minFilter = t.magFilter = THREE.NearestFilter
        t.wrapS = t.wrapT = THREE.RepeatWrapping
        this.sharedUniforms.u_blueNoiseTexture.value = t
        this.sharedUniforms.u_blueNoiseLinearTexture.value = e
        this.sharedUniforms.u_blueNoiseTexelSize.value = new THREE.Vector2(1 / this.TEXTURE_SIZE, 1 / this.TEXTURE_SIZE)
        this.base.shaderHelper.addChunk("getBlueNoise", getBlueNoiseShader)
    }

    update(e) {
        this.sharedUniforms.u_blueNoiseCoordOffset.value.set(Math.random(), Math.random())
    }
}
