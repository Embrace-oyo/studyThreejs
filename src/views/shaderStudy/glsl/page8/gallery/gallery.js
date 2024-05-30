/**
 * justThreeJs gallery.js
 * @author kongjianqiu
 * @description
 * @created 2024/5/30 15:55:55
 */

import * as THREE from "three";
import {Maku, MakuGroup, Scroller} from "maku.js";
import imagesLoaded from "imagesloaded";
import Component from "@/views/shaderStudy/glsl/page8/init/component";
import UniformInjector from "@/views/shaderStudy/glsl/page8/init/uniformInjector";


const defaultVertexShader = /* glsl */ `
uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;

void main(){
    vec3 p=position;
    gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);
    
    vUv=uv;
}
`;
const defaultFragmentShader = /* glsl */ `
uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

uniform sampler2D uTexture;

varying vec2 vUv;

void main(){
    vec4 tex=texture(uTexture,vUv);
    vec3 color=tex.rgb;
    gl_FragColor=vec4(color,1.);
}
`;

// 图片预加载
const preloadImages = (sel = "div") => {
    return new Promise((resolve) => {
        imagesLoaded(sel, {background: true}, resolve);
    });
};
class Gallery extends Component {
    constructor(base, config) {
        super(base);
        const {
            elList = [...document.querySelectorAll("img")],
            vertexShader = defaultVertexShader,
            fragmentShader = defaultFragmentShader,
            uniforms = {},
            makuConfig = {},
            isScrollPositionSync = true,
            scroller = null,
            materialParams = {},
            isRectAutoRefreshed = false,
        } = config;
        this.elList = elList;
        this.vertexShader = vertexShader;
        this.fragmentShader = fragmentShader;
        this.uniforms = uniforms;
        this.makuConfig = makuConfig;
        this.isScrollPositionSync = isScrollPositionSync;
        this.isRectAutoRefreshed = isRectAutoRefreshed;
        this.makuMaterial = null;
        this.makuGroup = null;
        this.scroller = scroller;
        this.materialParams = materialParams;
        const uniformInjector = new UniformInjector(base);
        this.uniformInjector = uniformInjector;
        this.useSelfScroller = false;
        if (!scroller) {
            this.useSelfScroller = true;
        }
    }

    async addExisting() {
        // Load all the images
        await preloadImages();
        const {uniformInjector} = this;
        // Create a ShaderMaterial
        const makuMaterial = new THREE.ShaderMaterial({
            vertexShader: this.vertexShader,
            fragmentShader: this.fragmentShader,
            side: THREE.DoubleSide,
            uniforms: {
                ...{
                    uTexture: {
                        value: null,
                    },
                    uMeshSize: {
                        value: new THREE.Vector2(0, 0),
                    },
                    uMeshPosition: {
                        value: new THREE.Vector2(0, 0),
                    },
                    uMediaSize: {
                        value: new THREE.Vector2(0, 0),
                    },
                },
                ...uniformInjector.shadertoyUniforms,
                ...this.uniforms,
            },
            ...this.materialParams,
        });
        this.makuMaterial = makuMaterial;
        // Make a MakuGroup that contains all the makus!
        const makuGroup = new MakuGroup();
        this.makuGroup = makuGroup;
        const makus = this.elList.map((el) => new Maku(el, makuMaterial, this.container, {
            ...this.makuConfig,
            isRectAutoRefreshed: this.isRectAutoRefreshed,
        }));
        makuGroup.addMultiple(makus);
        // Sync images positions
        makuGroup.setPositions();
        // scroller listen for scroll
        if (this.useSelfScroller) {
            const scroller = new Scroller();
            this.scroller = scroller;
            this.scroller.listenForScroll();
        }
        // handle resize
        this.base.resizer.on("resize", () => {
            makuGroup.makus.forEach((maku) => {
                maku.rect = maku.el.getBoundingClientRect();
            });
        });
        console.log(this.container, makuGroup)
    }

    update(time) {
        const {scroller, makuGroup} = this;
        scroller?.syncScroll();
        makuGroup?.makus.forEach((maku) => {
            const material = maku.mesh.material;
            const uniforms = material.uniforms;
            this.uniformInjector.injectShadertoyUniforms(uniforms);
            uniforms.uMeshSize.value = new THREE.Vector2(maku.el.clientWidth, maku.el.clientHeight);
            uniforms.uMeshPosition.value = new THREE.Vector2(maku.mesh.position.x, maku.mesh.position.y);
            const mediaEl = maku.el;
            if (mediaEl instanceof HTMLImageElement) {
                uniforms.uMediaSize.value = new THREE.Vector2(mediaEl.naturalWidth, mediaEl.naturalHeight);
            } else if (mediaEl instanceof HTMLVideoElement) {
                uniforms.uMediaSize.value = new THREE.Vector2(mediaEl.videoWidth, mediaEl.videoHeight);
            } else if (mediaEl instanceof HTMLCanvasElement) {
                uniforms.uMediaSize.value = new THREE.Vector2(mediaEl.width, mediaEl.height);
            }
            if (this.isScrollPositionSync) {
                if (maku.el.classList.contains("webgl-fixed")) {
                    // fixed element
                    maku.setPosition(0);
                } else {
                    // scroll element
                    maku.setPosition(scroller?.scroll.current);
                }
            }
        });
    }

    checkImagesLoaded() {
        return new Promise((resolve) => {
            this.base.update(() => {
                if (this.makuGroup) {
                    if (this.makuGroup.makus
                        .map((maku) => {
                            return maku.mesh.material.uniforms
                                .uTexture.value.image?.complete;
                        })
                        .every((item) => item)) {
                        resolve(true);
                    }
                }
            });
        });
    }

    iterate(cb) {
        this.makuGroup?.makus.forEach((maku, i) => {
            cb(maku, i);
        });
    }

}

/**
 * An infinite gallery.
 *
 * Demo: https://kokomi-playground.vercel.app/entries/#leanSpeedGallery
 */
class InfiniteGallery extends Gallery {
    direction;
    gap;
    appendCount;
    constructor(base, config = {}) {
        super(base, { ...config, isScrollPositionSync: false });
        const { direction = "vertical", gap = 64, appendCount = 3 } = config;
        this.direction = direction;
        this.gap = gap;
        this.appendCount = appendCount;
    }
    get lengthType() {
        return {
            horizontal: "clientWidth",
            vertical: "clientHeight",
        }[this.direction];
    }
    get dimensionType() {
        return {
            horizontal: "x",
            vertical: "y",
        }[this.direction];
    }
    getImgLength() {
        let target = 0;
        if (this.makuGroup) {
            target = this.makuGroup.makus[0].el[this.lengthType];
        }
        return target;
    }
    getItemLength() {
        const { gap } = this;
        const imgLength = this.getImgLength();
        const itemLength = imgLength + gap;
        return itemLength;
    }
    getTotalCount() {
        let target = 0;
        if (this.makuGroup) {
            target = this.makuGroup.makus.length;
        }
        return target;
    }
    sync(current = 0) {
        const { appendCount } = this;
        if (this.makuGroup) {
            const itemLength = this.getItemLength();
            const totalCount = this.getTotalCount();
            const totalLength = itemLength * totalCount;
            this.iterate((maku, i) => {
                maku.mesh.position[this.dimensionType] =
                    ((itemLength * i - current - 114514 * totalLength) % totalLength) +
                    itemLength * appendCount;
            });
        }
    }
    getSnapIndex(target = 0) {
        const itemLength = this.getItemLength();
        const snapIndex = Math.round(target / itemLength);
        return snapIndex;
    }
    snap(target = 0) {
        const itemLength = this.getItemLength();
        const snapIndex = this.getSnapIndex(target);
        const snapTarget = itemLength * snapIndex;
        return snapTarget;
    }
    getActiveIndex(target = 0) {
        const snapIndex = this.getSnapIndex(target);
        const totalCount = this.getTotalCount();
        const activeIndex = (snapIndex + 114514 * totalCount) % totalCount;
        return activeIndex;
    }
}


export { Gallery, InfiniteGallery };
