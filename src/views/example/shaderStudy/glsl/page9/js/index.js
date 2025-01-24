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
import Postprocessing from "@/views/shaderStudy/glsl/page9/js/postprocessing";
import vert from '@/views/shaderStudy/glsl/page9/shaders/vert.glsl'
import frag from '@/views/shaderStudy/glsl/page9/shaders/frag.glsl'

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
        this.colorParams = {
            themeColor: "#070618",
            lightColor: "#4cc2e9",
            light2Color: "#9743fe",
        };
        this.params = {
            uDistort: {
                value: 1,
            },
            uFrequency: {
                value: 1.7,
            },
            uThemeColor: {
                value: new THREE.Color(this.colorParams.themeColor),
            },
            uLightColor: {
                value: new THREE.Color(this.colorParams.lightColor),
            },
            uLight2Color: {
                value: new THREE.Color(this.colorParams.light2Color),
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
        this.base.scene.background = new THREE.Color(this.colorParams.themeColor);
        this.sceneInit()
        this.debugInit()
        this.postprocessing()

    }

    sceneInit() {
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
        this.uj = new UniformInjector(this.base)
        this.material.uniforms = {
            ...this.material.uniforms,
            ...this.uj.shadertoyUniforms,
            ...this.params,
        };
        this.base.scene.add(this.mesh)
    }

    audioInit() {
        this.isPlay = false;
        this.fftSize = 128;
        this.audioFile = './audio/test.mp3'
        this.listener = new THREE.AudioListener();
        this.audio = new THREE.Audio(this.listener);
        if (/(iPad|iPhone|iPod)/g.test(navigator.userAgent)) {
            const loader = new THREE.AudioLoader();
            loader.load(this.audioFile, function (buffer) {
                this.audio.setBuffer(buffer);
                this.audio.play();
                this.isPlay = true;
            });

        } else {
            const mediaElement = new Audio(this.audioFile);
            mediaElement.play();
            this.audio.setMediaElementSource(mediaElement);
            this.isPlay = true;
        }
        this.analyser = new THREE.AudioAnalyser(this.audio, this.fftSize);
        this.material.uniforms.uAudioData.value = this.analyser.getAverageFrequency()
    }

    debugInit() {
        if (this.base.debug.active) {
            this.base.debug.ui.domElement.style.position = 'absolute'
            this.base.debug.ui.domElement.style.right = '0'
            this.base.debug.ui.domElement.style.top = '0'
            this.base.debug.ui.domElement.style.zIndex = '999'
            this.base.debug.ui.addColor(this.colorParams, "themeColor").onChange((val) => {
                this.material.uniforms.uThemeColor.value = new THREE.Color(val);
                this.base.scene.background = new THREE.Color(val);
            });
            this.base.debug.ui.addColor(this.colorParams, "lightColor").onChange((val) => {
                this.material.uniforms.uLightColor.value = new THREE.Color(val);
            });
            this.base.debug.ui.addColor(this.colorParams, "light2Color").onChange((val) => {
                this.material.uniforms.uLight2Color.value = new THREE.Color(val);
            });
            this.base.debug.ui.add(this.params.uDistort, "value").min(1).max(5).step(0.01).name("uDistort");
            this.base.debug.ui.add(this.params.uFrequency, "value").min(0.01).max(5).step(0.01).name("frequency");
            this.base.debug.ui.add(this.params.uFresnelIntensity, "value").min(0).max(1).step(0.01).name("fresnelIntensity");
            this.base.debug.ui.add(this.params.uLightIntensity, "value").min(0).max(1).step(0.01).name("lightIntensity");
            this.base.debug.ui.add(this.params.uLight2Intensity, "value").min(0).max(1).step(0.01).name("light2Intensity");
        }
    }

    postprocessing(){
        this.post = new Postprocessing(this.base);
    }

    update() {
        this.uj.injectShadertoyUniforms(this.material.uniforms);
        if (this.isPlay) {
            this.material.uniforms.uAudioData.value = this.analyser.getAverageFrequency()
        }
    }
}

export {Index, World}


