/**
 * justThreeJs world.js
 * @author kongjianqiu
 * @description
 * @created 2024/7/22 14:55:19
 */

import * as THREE from "three";
import {GUI} from 'three/examples/jsm/libs/lil-gui.module.min.js';

import rawVert from '@/views/example/common/fluid/glsl/rawVert.glsl'
import rawFrag from '@/views/example/common/fluid/glsl/rawFrag.glsl'
import blurFrag from '@/views/example/common/fluid/glsl/blurFrag.glsl'
import blitFrag from "@/views/example/common/fluid/glsl/blitFrag.glsl";
import screenPaintFrag from "@/views/example/common/fluid/glsl/screenPaintFrag.glsl";

function cUnMix(e, t, r) {
    let math = THREE.MathUtils;
    return math.clamp((r - e) / (t - e), 0, 1)
}

function fit(e, t, r, n, o, l) {
    e = cUnMix(t, r, e)
    l && (e = l(e))
    return n + e * (o - n)
}

export default class Fluid {
    isPass = true;
    // if set to true, the pass is processed by the composer
    enabled = true;
    // if set to true, the pass indicates to swap read and write buffer after rendering
    needsSwap = true;
    // if set to true, the pass clears its buffer before rendering
    clear = true;
    // if set to true, the result of the pass is rendered to screen. This is set automatically by EffectComposer.
    renderToScreen = true;
    DOM;
    width = 0;
    height = 0;
    GUI;
    option = {
        USE_NOISE: !0,
        minRadius: 0,
        maxRadius: Math.max(40, this.width / 20),
        radiusDistanceRange: 100,
        velocityDissipation: 0.975,
        weight1Dissipation: 0.95,
        weight2Dissipation: 0.8,
        curlScale: 0.02,
        curlStrength: 3,
        accelerationDissipation: 0.8,
        pushStrength: 25,
        amount: 3,
        rgbShift: 0.5,
        multiplier: 5,
        colorMultiplier: 10,
        shade: 1.25,
    };
    fromDrawData = new THREE.Vector4(0, 0, 0, 0);
    toDrawData = new THREE.Vector4(0, 0, 0, 0);
    _v$4 = new THREE.Vector2();
    deltaXY = new THREE.Vector2();
    mouseXY = new THREE.Vector2();
    mousePixelXY = new THREE.Vector2();
    prevMousePixelXY = new THREE.Vector2();
    _prevMouseXY = new THREE.Vector2();
    drawEnabled = !0;
    hadMoved = !1;
    hasMoved = !1;
    prevPaintRenderTarget;
    currPaintRenderTarget;
    lowRenderTarget;
    lowBlurRenderTarget;
    targetScene = new THREE.Scene();
    targetCamera = new THREE.Camera();
    targetMesh;
    isLoad = false;
    depth;

    constructor(config) {
        this.base = config;
        this.target = this.base.target;
        this.width = this.target.offsetWidth;
        this.height = this.target.offsetHeight;
        this.targetGeometry = new THREE.BufferGeometry;
        this.targetGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 4, -1, 0, -1, 4, 0]), 3))
        this.targetCamera.position.copy(this.base.cameraPosition);
        this.targetMesh = new THREE.Mesh(this.targetGeometry);
        this.targetMesh.frustumCulled = !1;
        this.dateTime = performance.now();
        this.meshInit();
        this.guiInit();
        this.target.addEventListener('mousemove', (e) => {
            this.mouseXY.set(e.offsetX / this.target.offsetWidth * 2 - 1, 1 - e.offsetY / this.target.offsetHeight * 2)
            this.mousePixelXY.set(e.offsetX, e.offsetY)
            this.deltaXY.copy(this.mouseXY).sub(this._prevMouseXY)
            this._prevMouseXY.copy(this.mouseXY)
            this.hasMoved = this.deltaXY.length() > 0
        })
    }


    guiInit() {
        this.GUI = new GUI({container: this.target})
        this.GUI.domElement.style.position = 'absolute'
        this.GUI.domElement.style.right = '0'
        this.GUI.domElement.style.top = '0'
        this.GUI.domElement.style.zIndex = '999'


        this.GUI.add(this.option, 'USE_NOISE').name('开启噪音').onChange(() => this.rawShaderMaterial.needsUpdate = !0);
        this.GUI.add(this.option, 'minRadius', 0, 100, 0.1).name('最小半径');
        this.GUI.add(this.option, 'maxRadius', 0, 100, 0.1).name('最大半径');
        this.GUI.add(this.option, 'radiusDistanceRange', 50, 200, 0.1).name('半径距离范围');
        this.GUI.add(this.option, 'velocityDissipation', 0, 2, 0.01).name('速度耗散');
        this.GUI.add(this.option, 'weight1Dissipation', 0, 2, 0.01).name('重量1D耗散');
        this.GUI.add(this.option, 'weight2Dissipation', 0, 2, 0.01).name('重量2D耗散');
        this.GUI.add(this.option, 'curlScale', 0, 1, 0.001).name('卷曲尺度');
        this.GUI.add(this.option, 'curlStrength', 0, 20, 0.1).name('卷曲强度');
        this.GUI.add(this.option, 'pushStrength', 0, 20, 0.1).name('推力');
        this.GUI.add(this.option, 'accelerationDissipation', 0, 10, 0.1).name('加速度耗散');
        this.GUI.add(this.option, 'amount', 0, 50, 1).name('数量');
        this.GUI.add(this.option, 'rgbShift', 0, 20, 0.1).name('RGB移位');
        this.GUI.add(this.option, 'multiplier', 0, 20, 0.1).name('乘数');
        this.GUI.add(this.option, 'colorMultiplier', 0, 20, 0.1).name('颜色倍增器');
        this.GUI.add(this.option, 'shade', 0, 20, 0.1).name('阴影');
    }


    async meshInit() {
        this.rawShaderMaterial = new THREE.RawShaderMaterial({
            name: 'rawShaderMaterial',
            vertexShader: rawVert,
            fragmentShader: rawFrag,
            uniforms: {
                u_lowPaintTexture: {value: null},
                u_prevPaintTexture: {value: null},
                u_paintTexelSize: {value: new THREE.Vector2()},
                u_drawFrom: {value: new THREE.Vector4(0, 0, 0, 0)},
                u_drawTo: {value: new THREE.Vector4(0, 0, 0, 0)},
                u_pushStrength: {value: 0},
                u_curlScale: {value: 0},
                u_curlStrength: {value: 0},
                u_vel: {value: new THREE.Vector2()},
                u_dissipations: {value: new THREE.Vector3()},
                u_scrollOffset: {value: new THREE.Vector2()}
            },
            defines: {
                USE_NOISE: this.option.USE_NOISE
            },
            depthTest: !1,
            depthWrite: !1,
            blending: THREE.NoBlending
        })

        this.blurShaderMaterial = new THREE.RawShaderMaterial({
            name: 'blurShaderMaterial',
            vertexShader: rawVert,
            fragmentShader: blurFrag,
            uniforms: {
                u_texture: {value: null},
                u_delta: {value: new THREE.Vector2()}
            },
            depthWrite: !1,
            depthTest: !1
        })

        this.copyShaderMaterial = new THREE.RawShaderMaterial({
            name: 'copyShaderMaterial',
            uniforms: {u_texture: {value: null}},
            vertexShader: rawVert,
            fragmentShader: blitFrag,
            depthTest: !1,
            depthWrite: !1,
            blending: THREE.NoBlending
        })

        this.outShaderMaterial = new THREE.RawShaderMaterial({
            vertexShader: rawVert,
            fragmentShader: screenPaintFrag,
            uniforms: {
                u_texture: {value: null},
                u_screenPaintTexture: {value: null},
                u_screenPaintTexelSize: {value: new THREE.Vector2()},
                u_amount: {value: 0},
                u_rgbShift: {value: 0},
                u_multiplier: {value: 0},
                u_colorMultiplier: {value: 0},
                u_shade: {value: 0},
                u_blueNoiseTexture: {value: null},
                u_blueNoiseLinearTexture: {value: null},
                u_blueNoiseTexelSize: {value: null},
                u_blueNoiseCoordOffset: {value: new THREE.Vector2()}
            },
        })

        let e = new THREE.Texture;
        e.generateMipmaps = !1
        e.minFilter = e.magFilter = THREE.LinearFilter
        e.wrapS = e.wrapT = THREE.RepeatWrapping;
        let loader = new THREE.TextureLoader()
        let texture = await loader.loadAsync('/texture/LDR_RGB1_0.png')
        let t = texture.image;
        e.image = t.image
        t.generateMipmaps = !1
        t.minFilter = t.magFilter = THREE.NearestFilter
        t.wrapS = t.wrapT = THREE.RepeatWrapping
        this.outShaderMaterial.uniforms.u_blueNoiseTexture.value = t
        this.outShaderMaterial.uniforms.u_blueNoiseLinearTexture.value = e
        this.outShaderMaterial.uniforms.u_blueNoiseTexelSize.value = new THREE.Vector2(1 / 128, 1 / 128)
        this.isLoad = true;


        let r = this.width >> 2
        let n = this.height >> 2
        let o = this.width >> 3
        let l = this.height >> 3;

        this.rawShaderMaterial.uniforms.u_paintTexelSize.value.set(1 / r, 1 / n);
        this.rawShaderMaterial.uniforms.u_vel.value.set(0, 0)

        this.prevPaintRenderTarget = new THREE.WebGLRenderTarget(r, n, {
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

        this.currPaintRenderTarget = new THREE.WebGLRenderTarget(r, n, {
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

        this.lowRenderTarget = new THREE.WebGLRenderTarget(o, l, {
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

        this.lowBlurRenderTarget = new THREE.WebGLRenderTarget(o, l, {
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

        this.sceneFlatRenderTarget = new THREE.WebGLRenderTarget(this.width, this.height, {
            wrapS: THREE.ClampToEdgeWrapping,
            wrapT: THREE.ClampToEdgeWrapping,
            magFilter: r ? THREE.NearestFilter : THREE.LinearFilter,
            minFilter: r ? THREE.NearestFilter : THREE.LinearFilter,
            type: THREE.UnsignedByteType,
            anisotropy: 0,
            colorSpace: THREE.LinearSRGBColorSpace,
            depthBuffer: !1,
            stencilBuffer: !1,
            samples: 8
        });

        this.sceneFlatRenderTarget.depthBuffer = !0;
        this.depth = new THREE.DepthTexture(this.width, this.height);
        this.depth.type = THREE.UnsignedIntType
        this.depth.minFilter = THREE.NearestFilter
        this.depth.magFilter = THREE.NearestFilter
        this.sceneFlatRenderTarget.depthTexture = this.depth
    }

    frameOne(renderer, writeBuffer, readBuffer, time) {

        this.outShaderMaterial.uniforms.u_blueNoiseCoordOffset.value.set(Math.random(), Math.random())
        this.rawShaderMaterial.needsUpdate = !0;

        this.rawShaderMaterial.uniforms.u_drawTo.value = this.toDrawData
        this.rawShaderMaterial.uniforms.u_drawFrom.value = this.fromDrawData

        let n = this.prevPaintRenderTarget;
        this.prevPaintRenderTarget = this.currPaintRenderTarget;
        this.currPaintRenderTarget = n;

        this.rawShaderMaterial.uniforms.u_prevPaintTexture.value = this.prevPaintRenderTarget.texture;
        this.rawShaderMaterial.uniforms.u_lowPaintTexture.value = this.lowRenderTarget.texture;

        let t = this.width >> 2;
        let r = this.height >> 2;
        // _v$4复制mousePixelXY坐标数据
        this._v$4.copy(this.mousePixelXY)
        // 计算该_v$4到传入的prevMousePixelX0的距离
        let u = this._v$4.distanceTo(this.prevMousePixelXY)
        //  fit 函数用于将一个值 u 从范围 [0, radiusDistanceRange] 映射到范围 [minRadius, maxRadius]
        let f = fit(u, 0, this.option.radiusDistanceRange, this.option.minRadius, this.option.maxRadius);
        // 判断是否进行鼠标移动
        if (!this.hadMoved || !this.drawEnabled) f = 0
        f = f / this.height * r

        this.rawShaderMaterial.uniforms.u_pushStrength.value = this.option.pushStrength
        this.rawShaderMaterial.uniforms.u_curlScale.value = this.option.curlScale
        this.rawShaderMaterial.uniforms.u_curlStrength.value = this.option.curlStrength
        this.rawShaderMaterial.uniforms.u_dissipations.value.set(this.option.velocityDissipation, this.option.weight1Dissipation, this.option.weight2Dissipation)

        this.fromDrawData.copy(this.toDrawData)
        this._v$4.copy(this.mouseXY)
        this.toDrawData.set((this._v$4.x + 1) * t / 2, (this._v$4.y + 1) * r / 2, f, 1)
        this._v$4.set(this.toDrawData.x - this.fromDrawData.x, this.toDrawData.y - this.fromDrawData.y).multiplyScalar(time * .8)

        // u_vel当前值与accelerationDissipation相乘再与_v$4相加
        this.rawShaderMaterial.uniforms.u_vel.value.multiplyScalar(this.option.accelerationDissipation).add(this._v$4)


        this.targetMesh.material = this.rawShaderMaterial;
        this.targetMesh.material.needsUpdate = true;

        renderer.setRenderTarget(this.currPaintRenderTarget)
        renderer.render(this.targetMesh, this.targetCamera);


        this.targetMesh.material = this.copyShaderMaterial;
        this.targetMesh.material.needsUpdate = true;
        this.copyShaderMaterial.uniforms.u_texture.value = this.currPaintRenderTarget.texture
        renderer.setRenderTarget(this.lowRenderTarget)
        renderer.render(this.targetMesh, this.targetCamera);


    }

    frameTwo(renderer) {
        this.blurShaderMaterial.uniforms.u_texture.value = this.lowRenderTarget.texture
        this.blurShaderMaterial.uniforms.u_delta.value.set(8 / this.lowRenderTarget.width * 0.25, 0)

        this.targetMesh.material = this.blurShaderMaterial;
        this.targetMesh.material.needsUpdate = true;
        renderer.setRenderTarget(this.lowBlurRenderTarget)
        renderer.render(this.targetMesh, this.targetCamera);

        this.blurShaderMaterial.uniforms.u_texture.value = this.lowBlurRenderTarget.texture
        this.blurShaderMaterial.uniforms.u_delta.value.set(0, 8 / this.lowRenderTarget.height * 0.25)

        renderer.setRenderTarget(this.lowRenderTarget)
        renderer.render(this.targetMesh, this.targetCamera);
    }

    frameThree(renderer, writeBuffer, readBuffer) {
        this.outShaderMaterial.uniforms.u_blueNoiseCoordOffset.value.set(Math.random(), Math.random())
        this.outShaderMaterial.uniforms.u_amount.value = this.option.amount
        this.outShaderMaterial.uniforms.u_rgbShift.value = this.option.rgbShift
        this.outShaderMaterial.uniforms.u_multiplier.value = this.option.multiplier
        this.outShaderMaterial.uniforms.u_colorMultiplier.value = this.option.colorMultiplier
        this.outShaderMaterial.uniforms.u_shade.value = this.option.shade
        this.outShaderMaterial.uniforms.u_screenPaintTexelSize.value = this.rawShaderMaterial.uniforms.u_paintTexelSize.value;
        this.outShaderMaterial.uniforms.u_screenPaintTexture.value = this.currPaintRenderTarget.texture;


        this.copyShaderMaterial.uniforms.u_texture.value = this.lowRenderTarget.texture;
        this.targetMesh.material = this.copyShaderMaterial;
        this.targetMesh.material.needsUpdate = true;
        renderer.setRenderTarget(this.sceneFlatRenderTarget)
        renderer.render(this.targetMesh, this.targetCamera);


        this.outShaderMaterial.uniforms.u_texture.value = readBuffer.texture;


    }

    render(renderer, writeBuffer, readBuffer) {
        if (!this.isLoad) return;

        let a = performance.now()
        let e = (a - this.dateTime) / 1000;
        this.dateTime = a
        e = Math.min(e, 1 / 20)


        // 流体绘制
        this.frameOne(renderer, writeBuffer, readBuffer, e);
        // 模糊效果绘制
        this.frameTwo(renderer);

        // 坐标位置重置
        this.prevMousePixelXY.copy(this.mousePixelXY)
        this.hadMoved = this.hasMoved
        this.deltaXY.set(0, 0)

        // 最终输出
        this.frameThree(renderer, writeBuffer, readBuffer);


        if (this.renderToScreen) {
            renderer.setRenderTarget(null);
            this.targetMesh.material = this.outShaderMaterial;
            this.targetMesh.material.needsUpdate = true;
            renderer.render(this.targetMesh, this.targetCamera);

        } else {
            renderer.setRenderTarget(writeBuffer);
            if (this.clear) renderer.clear();
            this.targetMesh.material = this.outShaderMaterial;
            this.targetMesh.material.needsUpdate = true;
            renderer.render(this.targetMesh, this.targetCamera);

        }
    }

    setSize(width, height) {
        if (!this.isLoad) return;
        this.width = width;
        this.height = height;
        this.aspect = width / height;
        let r = this.width >> 2
        let n = this.height >> 2
        let o = this.width >> 3
        let l = this.height >> 3;
        this.rawShaderMaterial.uniforms.u_paintTexelSize.value.set(1 / r, 1 / n);
        this.prevPaintRenderTarget.setSize(r, n)
        this.currPaintRenderTarget.setSize(r, n)
        this.lowRenderTarget.setSize(o, l)
        this.lowBlurRenderTarget.setSize(o, l)
        this.sceneFlatRenderTarget.setSize(width, height);
    }

    dispose() {
        this.rawShaderMaterial.dispose();
        this.blurShaderMaterial.dispose();
        this.copyShaderMaterial.dispose();
        this.outShaderMaterial.dispose();
        this.prevPaintRenderTarget.dispose();
        this.currPaintRenderTarget.dispose();
        this.lowRenderTarget.dispose();
        this.lowBlurRenderTarget.dispose();
        this.sceneFlatRenderTarget.dispose();
        this.depth.dispose();
        this.targetMesh.geometry.dispose();
    }

}
