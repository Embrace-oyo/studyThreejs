/**
 * justThreeJs postprocessing.js
 * @author kongjianqiu
 * @description
 * @created 2024/5/30 17:55:43
 */
import Component from "@/util/common/component.js";
import CustomEffect from "@/util/common/customEffect.js";
import postprocessingFragmentShader from "@/views/shaderStudy/glsl/page8/shaders/postprocessing/frag.glsl";

export default class Postprocessing extends Component {
    constructor(base) {
        super(base);

        this.ce = new CustomEffect(this.base, {
            fragmentShader: postprocessingFragmentShader,
            uniforms: {
                uRGBShift: {
                    value: 0,
                },
            }
        });
    }

    addExisting() {
        this.ce.addExisting();
    }
}
