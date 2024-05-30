/**
 * justThreeJs world.js
 * @author kongjianqiu
 * @description
 * @created 2024/5/30 15:38:26
 */

import Component from "@/views/shaderStudy/glsl/page8/init/component.js";
import Slider from '@/views/shaderStudy/glsl/page8/gallery/Slider'

export default class World extends Component {
    constructor(base) {
        super(base);
        this.slider = new Slider(this.base)
        this.delay()
    }

    async delay() {
        await this.slider.addExisting();
        await this.base.callback()
    }

}
