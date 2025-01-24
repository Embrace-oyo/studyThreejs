/**
 * justThreeJs world.js
 * @author kongjianqiu
 * @description
 * @created 2024/5/30 15:38:26
 */
import gsap from "gsap";
import Component from "@/util/common/component.js";
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
        this.currentActiveMesh = null;
        this.slider.ig.iterate((maku) => {

            this.base.interactionManager.add(maku.mesh);

            maku.mesh.addEventListener("click", () => {
                if (Math.abs(this.slider.ws.scroll.delta) > 5) {
                    return;
                }


                const otherMakus = this.slider.ig.makuGroup.makus.filter((item) => item !== maku);


                if (!this.currentActiveMesh) {
                    this.slider.ws.disable();
                    this.slider.dd.disable();

                    otherMakus.forEach((item) => {
                        gsap.to(item.mesh.material.uniforms.uOpacity, {
                            value: 0,
                        });
                    });

                    const that = this;

                    gsap.to(maku.mesh.material.uniforms.uProgress, {
                        value: 1,
                        duration: 1,
                        ease: "power2.out",
                        delay: 0.5,
                        onUpdate() {
                            if (this.progress() >= 0.5) {
                                that.currentActiveMesh = maku.mesh;
                            }
                        },
                    });

                }

            });

            this.base.container.addEventListener("click", () => {
                if (this.currentActiveMesh) {
                    const that = this;
                    gsap.to(this.currentActiveMesh.material.uniforms.uProgress, {
                        value: 0,
                        duration: 1,
                        ease: "power2.inOut",
                        onUpdate() {
                            if (this.progress() >= 0.5) {
                                that.slider.ws.enable();
                                that.slider.dd.enable();

                                that.currentActiveMesh = null;
                            }
                        },
                    });
                    this.slider.ig.iterate((item) => {
                        gsap.to(item.mesh.material.uniforms.uOpacity, {
                            value: 1,
                            delay: 0.5,
                            ease: "power2.out",
                        });
                    });
                }
            });


        });
    }

}
