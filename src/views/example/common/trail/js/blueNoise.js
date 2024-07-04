/**
 * justThreeJs blueNoise.js
 * @author kongjianqiu
 * @description
 * @created 2024/7/4 16:16:52
 */
import * as THREE from "three";

export default class BlueNoise {
    sharedUniforms = {
        u_blueNoiseTexture: {value: null},
        u_blueNoiseLinearTexture: {value: null},
        u_blueNoiseTexelSize: {value: null},
        u_blueNoiseCoordOffset: {value: new THREE.Vector2}
    };
    TEXTURE_SIZE = 128;

    async preInit() {
        let e = new THREE.Texture;
        e.generateMipmaps = !1
        e.minFilter = e.magFilter = THREE.LinearFilter
        e.wrapS = e.wrapT = THREE.RepeatWrapping;
        let texture = new THREE.TextureLoader()
        let t = await texture.loadAsync('/texture/LDR_RGB1_0.png')
        t.needsUpdate = !0
        e.needsUpdate = !0
        e.image = t.image
        t.generateMipmaps = !1
        t.minFilter = t.magFilter = THREE.NearestFilter
        t.wrapS = t.wrapT = THREE.RepeatWrapping
        this.sharedUniforms.u_blueNoiseTexture.value = t
        this.sharedUniforms.u_blueNoiseLinearTexture.value = e
        this.sharedUniforms.u_blueNoiseTexelSize.value = new THREE.Vector2(1 / this.TEXTURE_SIZE, 1 / this.TEXTURE_SIZE)
    }

    update(e) {
        this.sharedUniforms.u_blueNoiseCoordOffset.value.set(Math.random(), Math.random())
    }
}
