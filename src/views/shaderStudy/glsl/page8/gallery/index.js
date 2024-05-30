/**
 * justThreeJs index.js
 * @author kongjianqiu
 * @description
 * @created 2024/5/30 15:25:49
 */
import Base from "@/views/shaderStudy/glsl/page8/init/base";
import Debug from "@/views/shaderStudy/glsl/page8/init/debug";
import ScreenCamera from '@/views/shaderStudy/glsl/page8/init/screenCamera'
import World from '@/views/shaderStudy/glsl/page8/gallery/world'
import Postprocessing from '@/views/shaderStudy/glsl/page8/gallery/postprocessing'

export default class Gallerys extends Base {
    constructor(el = 'canvas', config = {}) {
        super(el, config);
        this.debug = new Debug();
        const screenCamera = new ScreenCamera(this);
        screenCamera.addExisting();
        this.world = new World(this)
        this.postprocessing = new Postprocessing(this)
        this.postprocessing.addExisting();
        this.update(() => {
            this.postprocessing.ce.customPass.material.uniforms.uRGBShift.value = Math.abs(this.world.slider?.ws.scroll.delta) * 0.001;
        });
    }
}
