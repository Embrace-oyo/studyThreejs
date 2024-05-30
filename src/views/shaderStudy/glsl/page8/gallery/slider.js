/**
 * justThreeJs slider.js
 * @author kongjianqiu
 * @description
 * @created 2024/5/30 15:35:18
 */

import Component from "@/views/shaderStudy/glsl/page8/init/component.js";
import {WheelScroller} from "@/views/shaderStudy/glsl/page8/init/scroller.js";
import DragDetecter from "@/views/shaderStudy/glsl/page8/init/drag.js";
import {InfiniteGallery} from "@/views/shaderStudy/glsl/page8/gallery/gallery.js";
import vert from '@/views/shaderStudy/glsl/page8/shaders/vert.glsl'
import frag from '@/views/shaderStudy/glsl/page8/shaders/frag.glsl'

export default class Slider extends Component {
    constructor(base) {
        super(base);

        const params = {
            uDistortX: {
                value: 1.15,
            },
            uDistortZ: {
                value: 1.5,
            },
        };
        this.params = params;

        this.ig = new InfiniteGallery(this.base, {
            elList: [...document.querySelectorAll(".gallery-item")],
            direction: "horizontal",
            gap: 128,
            vertexShader: vert,
            fragmentShader: frag,
            uniforms: {
                uVelocity: {
                    value: 0,
                },
                ...params
            }
        });

        this.ws = new WheelScroller();
        this.ws.listenForScroll();

        const debug = this.base.debug
        if (debug.active) {
            const debugFolder = debug.ui.addFolder("gallery");
            debugFolder
                .add(params.uDistortX, "value")
                .min(-2)
                .max(2)
                .step(0.01)
                .name("distortX");
            debugFolder
                .add(params.uDistortZ, "value")
                .min(-2)
                .max(2)
                .step(0.01)
                .name("distortZ");
        }

        this.dd = new DragDetecter(this.base);
        this.dd.detectDrag();
        this.dd.on("drag", (delta) => {
            this.ws.scroll.target -= delta[this.ig.dimensionType] * 2;
        });
    }

    async addExisting() {
        await this.ig.addExisting();
        await this.ig.checkImagesLoaded();
    }

    update() {
        this.ws.syncScroll();
        const {current, delta} = this.ws.scroll;
        this.ig.sync(current);
        this.ig.iterate((maku) => {
            maku.mesh.material.uniforms.uVelocity.value = delta;
            maku.mesh.material.uniforms.uDistortX.value = this.params.uDistortX.value;
            maku.mesh.material.uniforms.uDistortZ.value = this.params.uDistortZ.value;
        });
    }
}
