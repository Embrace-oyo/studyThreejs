/**
 * justThreeJs index.js
 * @author kongjianqiu
 * @description
 * @created 2024/5/31 09:49:53
 */
import * as THREE from "three";
import Base from '@/util/common/base'
import Debug from "@/util/common/debug";
import Component from "@/util/common/component.js";
import UniformInjector from "@/util/common/uniformInjector";
import OrbitControls from "@/util/common/orbitControls";
import vert from '@/views/shaderStudy/glsl/page9/shaders/vert.glsl'
import frag from '@/views/shaderStudy/glsl/page9/shaders/frag.glsl'
import {GUI} from "three/examples/jsm/libs/lil-gui.module.min.js";

class Index extends Base {
    constructor(el = 'canvas', config = {}) {
        super(el);
        this.debug = new Debug(this);
        this.camera.position.set(0, 0, 2.5);
        this.controls = new OrbitControls(this)
        this.world = new World(this);
    }
}


class World extends Component {
    constructor(base) {
        super(base);
        const colorParams = {
            themeColor: "#070618",
            lightColor: "#4cc2e9",
            light2Color: "#9743fe",
        };
        this.base.scene.background = new THREE.Color(colorParams.themeColor);
        const RADIUS = 1.001;
        const SEGMENTS = 256.001;
        this.geometry = new THREE.SphereGeometry(RADIUS, SEGMENTS, SEGMENTS);
        this.material = new THREE.ShaderMaterial({
            vertexShader: vert,
            fragmentShader: frag,
            defines: {
                RADIUS,
                SEGMENTS,
            },
        })
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        const params = {
            uDistort: {
                value: 1,
            },
            uFrequency: {
                value: 1.7,
            },
            uThemeColor: {
                value: new THREE.Color(colorParams.themeColor),
            },
            uLightColor: {
                value: new THREE.Color(colorParams.lightColor),
            },
            uLight2Color: {
                value: new THREE.Color(colorParams.light2Color),
            },
            uFresnelIntensity: {
                value: 0.2,
            },
            uLightIntensity: {
                value: 0.9,
            },
            uLight2Intensity: {
                value: 0.9,
            },
            uAudioData: {
                value: 0
            }

        };
        this.uj = new UniformInjector(this.base)
        this.material.uniforms = {
            ...this.material.uniforms,
            ...this.uj.shadertoyUniforms,
            ...params,
        };
        this.base.scene.add(this.mesh)
        if (this.base.debug.active) {
            this.base.debug.ui.domElement.style.position = 'absolute'
            this.base.debug.ui.domElement.style.right = '0'
            this.base.debug.ui.domElement.style.top = '0'
            this.base.debug.ui.domElement.style.zIndex = '999'
            this.base.debug.ui.addColor(colorParams, "themeColor").onChange((val) => {
                this.material.uniforms.uThemeColor.value = new THREE.Color(val);
                this.base.scene.background = new THREE.Color(val);
            });
            this.base.debug.ui.addColor(colorParams, "lightColor").onChange((val) => {
                this.material.uniforms.uLightColor.value = new THREE.Color(val);
            });
            this.base.debug.ui.addColor(colorParams, "light2Color").onChange((val) => {
                this.material.uniforms.uLight2Color.value = new THREE.Color(val);
            });
            this.base.debug.ui.add(params.uDistort, "value").min(1).max(5).step(0.01).name("uDistort");
            this.base.debug.ui.add(params.uFrequency, "value").min(0).max(5).step(0.01).name("frequency");
            this.base.debug.ui.add(params.uFresnelIntensity, "value").min(0).max(1).step(0.01).name("fresnelIntensity");
            this.base.debug.ui.add(params.uLightIntensity, "value").min(0).max(1).step(0.01).name("lightIntensity");
            this.base.debug.ui.add(params.uLight2Intensity, "value").min(0).max(1).step(0.01).name("light2Intensity");
        }


        this.isPlay = false;
        this.fftSize = 128;
        this.audioFile = './audio/test.mp3'
        this.listener = null;
        this.audio = null;
        this.analyser = null
    }

    audioInit() {
        this.listener = new THREE.AudioListener();
        this.audio = new THREE.Audio(this.listener);
        if (/(iPad|iPhone|iPod)/g.test(navigator.userAgent)) {

            const loader = new THREE.AudioLoader();
            loader.load(this.audioFile, function (buffer) {
                this.audio.setBuffer(buffer);
                this.audio.play();
            });

        } else {

            const mediaElement = new Audio(this.audioFile);
            mediaElement.play();

            this.audio.setMediaElementSource(mediaElement);

        }

        this.analyser = new THREE.AudioAnalyser(this.audio, this.fftSize);
        this.material.uniforms.uAudioData.value = new THREE.DataTexture(this.analyser.data, this.fftSize / 2, 1, THREE.RedFormat)
        this.isPlay = true;
    }

    update() {
        this.uj.injectShadertoyUniforms(this.material.uniforms);
        if (this.isPlay) {
            this.analyser.getFrequencyData();
            this.material.uniforms.uAudioData.value.needsUpdate = true;
        }
    }
}

export {Index, World}


