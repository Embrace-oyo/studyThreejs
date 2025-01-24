/**
 * justThreeJs postprocessing.js
 * @author kongjianqiu
 * @description
 * @created 2024/5/30 17:55:43
 */
import * as THREE from "three";
import Component from "@/util/common/component.js";
import {BlendFunction, BloomEffect, EffectComposer, EffectPass, GlitchEffect, RenderPass} from 'postprocessing'

export default class Postprocessing extends Component {
    constructor(base) {
        super(base);
        this.base.composer = new EffectComposer(this.base.renderer);
        this.base.composer.addPass(new RenderPass(this.base.scene, this.base.camera));
        const bloom = new BloomEffect({
            blendFunction: BlendFunction.SET,
            mipmapBlur: true,
            luminanceThreshold: 0.4,
            luminanceSmoothing: 0.2,
            intensity: 10.0
        })

        const glitch = new GlitchEffect()
        this.base.composer.addPass(new EffectPass(this.base.camera, bloom, glitch));
    }
}
