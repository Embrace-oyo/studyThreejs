/**
 * justThreeJs Oil.js
 * @author kongjianqiu
 * @description
 * @created 2025/3/14 15:07:31
 */
import {
    Object3D,
    Mesh,
    PlaneGeometry,
    ShaderMaterial,
    Vector2,
} from 'three';

// glsl
import oilVertex from '@/views/pages/oil/glsl/oil/vertex.glsl'
import oilFragment from '@/views/pages/oil/glsl/oil/fragment.glsl'

export default class OilScreen extends Object3D {
    constructor(base) {
        super();
        this.base = base;
        this.width = this.base.planeWidth;
        this.height = this.base.planeHeight;
        this.uniforms = {
            uFlowSpeed: {value: 0.085},
            uTime: {value: 1.0},
            uTexture: {
                type: 't',
                value: this.base.oilTex
            },
            uTrailTexture: {
                type: 't',
                value: this.base.trail.renderTargetB.texture
            },
            uFlowMap: {
                type: 't',
                value: this.base.flowTex
            },
            uFlowOffset: {
                value: 0.0
            },
            uFlowMapBlurRadius: {
                value: 15.0
            },
            uNoiseSpeed: {
                value: 0.3
            },
            uNoiseScaleX: {
                value: 3.3
            },
            uNoiseScaleY: {
                value: 4.4
            },
            uNoiseAmplitude: {
                value: 0.05
            },
            uResolution: {
                value: new Vector2(this.base.width, this.base.height)
            }
        };
        this.init();
    }

    init() {
        this.material = new ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: oilVertex,
            fragmentShader: oilFragment
        });

        const geometry = new PlaneGeometry(this.width, this.height);

        this.mesh = new Mesh(geometry, this.material);
        this.add(this.mesh);

        this.initGUI();
    }

    initGUI() {
        const settings = {
            flowSpeed: this.material.uniforms.uFlowSpeed.value,
            flowBlurRadius: this.material.uniforms.uFlowMapBlurRadius.value,
            noiseSpeed: this.material.uniforms.uNoiseSpeed.value,
            noiseScaleX: this.material.uniforms.uNoiseScaleX.value,
            noiseScaleY: this.material.uniforms.uNoiseScaleY.value,
            noiseAmplitude: this.material.uniforms.uNoiseAmplitude.value
        };

        const update = () => {
            // Light
            this.material.uniforms.uFlowSpeed.value = settings.flowSpeed;
            this.material.uniforms.uFlowMapBlurRadius.value = settings.flowBlurRadius;

            // Noise
            this.material.uniforms.uNoiseSpeed.value = settings.noiseSpeed;
            this.material.uniforms.uNoiseScaleX.value = settings.noiseScaleX;
            this.material.uniforms.uNoiseScaleY.value = settings.noiseScaleY;
            this.material.uniforms.uNoiseAmplitude.value = settings.noiseAmplitude;
        };

        const folder = this.base.gui.addFolder('Oil');

        const flowFolder = folder.addFolder('Flow');

        flowFolder.add(settings, 'flowSpeed', 0.001, 0.5).onChange(update);
        flowFolder.add(settings, 'flowBlurRadius', 0.0, 50.0).onChange(update);

        const noiseFolder = folder.addFolder('Noise');

        noiseFolder
            .add(settings, 'noiseSpeed', 0, 3)
            .step(0.05)
            .name('speed')
            .onChange(update);
        noiseFolder
            .add(settings, 'noiseScaleX', 0, 25)
            .name('frequency X')
            .onChange(update);
        noiseFolder
            .add(settings, 'noiseScaleY', 0, 25)
            .name('frequency Y')
            .onChange(update);
        noiseFolder
            .add(settings, 'noiseAmplitude', 0, 1)
            .step(0.01)
            .name('amplitude')
            .onChange(update);
    }

    update(dt, time) {
        this.material.uniforms.uTime.value = time * 1.5;
    }
}
