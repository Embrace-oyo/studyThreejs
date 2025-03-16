/**
 * justThreeJs ripplesPass.js
 * @author kongjianqiu
 * @description
 * @created 2025/3/16 14:50:37
 */
import * as THREE from "three";
import {Pass, FullScreenQuad} from 'three/addons/postprocessing/Pass.js';
import ripples from '@/views/pages/ripples/glsl/ripples.glsl'
import water from '@/views/pages/ripples/glsl/water.glsl'
import vertex from '@/views/pages/ripples/glsl/vertex.glsl'

export default class RipplesPass extends Pass {
    constructor(base) {
        super();
        this.base = base;
        this.width = this.base.width;
        this.height = this.base.height;
        this.clock = new THREE.Clock();
        this.mouse = new THREE.Vector3(0, 0, 0);
        this.time = null;
        this.base.target.addEventListener("mousemove", (e) => {
            // 坐标系转换（Three.js使用左上角坐标系）
            const rect = this.base.target.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = this.base.height - (e.clientY - rect.top);
            this.mouse.z = 1.0;
            clearTimeout(this.time)
            this.time = setTimeout(() => {
                this.mouse.z = 0.0;
                clearTimeout(this.time)
            }, 50)
        });
        this.clearColor = new THREE.Color(0, 0, 0);
        this.lowRenderTarget = new THREE.WebGLRenderTarget(this.width >> 2, this.width >> 2, {
            wrapS: THREE.ClampToEdgeWrapping,
            wrapT: THREE.ClampToEdgeWrapping,
            magFilter: THREE.LinearFilter,
            minFilter: THREE.LinearFilter,
            type: THREE.UnsignedByteType,
            anisotropy: 0,
            colorSpace: THREE.LinearSRGBColorSpace,
            depthBuffer: !1,
            stencilBuffer: !1,
            samples: 0
        });
        this.renderTargetA = new THREE.WebGLRenderTarget(512, 512, {
            samples: 4,
            type: THREE.HalfFloatType,
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat
        });
        this.renderTargetA.texture.name = 'ripples';
        this.renderTargetB = new THREE.WebGLRenderTarget(512, 512, {
            samples: 4,
            type: THREE.HalfFloatType,
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat
        });
        this.renderTargetB.texture.name = 'water';
        this.ripplesMaterial = new THREE.ShaderMaterial({
            uniforms: {
                iResolution: {value: new THREE.Vector2(this.width, this.height)},
                iTime: {value: 0},
                iMouse: {value: this.mouse},
                iChannel0: {value: null},
            },
            vertexShader: vertex,
            fragmentShader: ripples,
        })
        this.waterMaterial = new THREE.ShaderMaterial({
            uniforms: {
                iResolution: {value: new THREE.Vector2(this.width, this.height)},
                iTime: {value: 0},
                tDiffuse: {value: null},
                iChannel0: {value: null},
            },
            vertexShader: vertex,
            fragmentShader: water,
        })
        this.fsQuad = new FullScreenQuad(null);


        this.base.renderer.setRenderTarget(this.renderTargetA);
        this.base.renderer.setClearColor(this.clearColor);
        this.base.renderer.clear();
        this.base.renderer.setRenderTarget(null);
    }

    render(renderer, writeBuffer, readBuffer) {
        this.ripplesMaterial.uniforms.iChannel0.value = this.renderTargetA.texture;
        this.ripplesMaterial.uniforms.iMouse.value = this.mouse;
        this.ripplesMaterial.uniforms.iTime.value = performance.now() / 1000;
        this.fsQuad.material = this.ripplesMaterial;
        this.fsQuad.material.needsUpdate = true;

        renderer.setRenderTarget(this.renderTargetB);
        this.fsQuad.render(renderer);

        // 交换帧
        const temp = this.renderTargetA;
        this.renderTargetA = this.renderTargetB;
        this.renderTargetB = temp;

        this.waterMaterial.uniforms.iChannel0.value = this.renderTargetA.texture;
        this.waterMaterial.uniforms.tDiffuse.value = readBuffer.texture;
        this.fsQuad.material = this.waterMaterial;
        this.fsQuad.material.needsUpdate = true;

        if (this.renderToScreen) {
            renderer.setRenderTarget(null);

        } else {
            renderer.setRenderTarget(writeBuffer);
            if (this.clear) renderer.clear();
        }

        this.fsQuad.render(renderer);

    }

    setSize(width, height) {
        this.lowRenderTarget.setSize(width >> 2, height >> 2);
        this.renderTargetA.setSize(width, height);
        this.renderTargetB.setSize(width, height);
        this.width = width;
        this.height = height;
        this.ripplesMaterial.uniforms.iResolution.value.set(width, height);
        this.waterMaterial.uniforms.iResolution.value.set(width, height);
    }

    dispose() {
        this.renderTargetA.dispose();
        this.renderTargetB.dispose();
        this.ripplesMaterial.dispose();
        this.waterMaterial.dispose();
        this.fsQuad.dispose();

    }
}
