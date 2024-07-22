/**
 * justThreeJs world.js
 * @author kongjianqiu
 * @description
 * @created 2024/7/22 14:55:19
 */

import * as THREE from "three";
import {GUI} from 'three/examples/jsm/libs/lil-gui.module.min.js';
import vert from '@/views/example/common/shaderTest/glsl/vert.glsl'
import frag from '@/views/example/common/shaderTest/glsl/frag.glsl'
import rawVert from '@/views/example/common/shaderTest/glsl/rawVert.glsl'
import rawFrag from '@/views/example/common/shaderTest/glsl/rawFrag.glsl'

function cUnMix(e, t, r) {
    let math = THREE.MathUtils;
    return math.clamp((r - e) / (t - e), 0, 1)
}

function fit(e, t, r, n, o, l) {
    e = cUnMix(t, r, e)
    l && (e = l(e))
    return n + e * (o - n)
}

export default class World {
    DOM;
    width = 0;
    height = 0;
    renderer;
    scene;
    camera;
    cameraPosition = new THREE.Vector3(0, 0, 1);
    cameraLookAt = new THREE.Vector3(0, 0, 0);
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
    targetScene = new THREE.Scene();
    targetCamera = new THREE.Camera();
    targetMesh;

    constructor(config = {}) {
        this.target = config.DOM
        this.width = this.target.offsetWidth;
        this.height = this.target.offsetHeight;
        this.aspect = this.width / this.height;
        this.renderer = new THREE.WebGLRenderer({
            powerPreference: "high-performance",
            antialias: !1,
            alpha: !1,
            premultipliedAlpha: !1
        })
        this.renderer.setSize(this.width, this.height)
        this.target.appendChild(this.renderer.domElement);
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('#030303')
        this.camera = new THREE.PerspectiveCamera(75, this.aspect, 0.01, 1000);
        this.camera.position.copy(this.cameraPosition)
        this.camera.lookAt(this.cameraLookAt)
        this.camera.updateProjectionMatrix()
        this.scene.add(this.camera);
        this.geometry = new THREE.BufferGeometry
        this.geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 4, -1, 0, -1, 4, 0]), 3))
        this.targetCamera.position.copy(this.cameraPosition);
        this.targetMesh = new THREE.Mesh(this.geometry);
        this.targetMesh.frustumCulled = !1;
        this.targetScene.add(this.targetMesh);

        this.clock = new THREE.Clock()
        this.dateTime = performance.now();

        this.meshInit();
        this.guiInit();
        this.animation();


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
        this.GUI.add(this.option, 'minRadius', 0, 100, 0.1);
        this.GUI.add(this.option, 'maxRadius', 0, 100, 0.1);
        this.GUI.add(this.option, 'radiusDistanceRange', 50, 200, 0.1);
        this.GUI.add(this.option, 'velocityDissipation', 0, 2, 0.01);
        this.GUI.add(this.option, 'weight1Dissipation', 0, 2, 0.01);
        this.GUI.add(this.option, 'weight2Dissipation', 0, 2, 0.01);
        this.GUI.add(this.option, 'curlScale', 0, 1, 0.001);
        this.GUI.add(this.option, 'curlStrength', 0, 20, 0.1);
        this.GUI.add(this.option, 'accelerationDissipation', 0, 10, 0.1);
    }

    meshInit() {
        this.rawShaderMaterial = new THREE.RawShaderMaterial({
            name: 'rawMaterial',
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
        this.rawShaderMesh = new THREE.Mesh(this.geometry, this.rawShaderMaterial)
        this.scene.add(this.rawShaderMesh);

        let r = this.width >> 2
        let n = this.height >> 2
        let o = this.width >> 3
        let l = this.height >> 3;
        this.rawShaderMaterial.uniforms.u_paintTexelSize.value.set(1 / r, 1 / n);
        this.rawShaderMaterial.uniforms.u_vel.value.set(0, 0)

        this.prevPaintRenderTarget = new THREE.WebGLRenderTarget(r, n, {
            wrapS: THREE.ClampToEdgeWrapping,
            wrapT: THREE.ClampToEdgeWrapping,
            magFilter: r ? THREE.NearestFilter : THREE.LinearFilter,
            minFilter: r ? THREE.NearestFilter : THREE.LinearFilter,
            type: THREE.UnsignedByteType,
            anisotropy: 0,
            colorSpace: THREE.LinearSRGBColorSpace,
            depthBuffer: !1,
            stencilBuffer: !1,
            samples: o
        });
        this.currPaintRenderTarget = new THREE.WebGLRenderTarget(r, n, {
            wrapS: THREE.ClampToEdgeWrapping,
            wrapT: THREE.ClampToEdgeWrapping,
            magFilter: r ? THREE.NearestFilter : THREE.LinearFilter,
            minFilter: r ? THREE.NearestFilter : THREE.LinearFilter,
            type: THREE.UnsignedByteType,
            anisotropy: 0,
            colorSpace: THREE.LinearSRGBColorSpace,
            depthBuffer: !1,
            stencilBuffer: !1,
            samples: o
        });
        this.lowRenderTarget = new THREE.WebGLRenderTarget(o, l, {
            wrapS: THREE.ClampToEdgeWrapping,
            wrapT: THREE.ClampToEdgeWrapping,
            magFilter: r ? THREE.NearestFilter : THREE.LinearFilter,
            minFilter: r ? THREE.NearestFilter : THREE.LinearFilter,
            type: THREE.UnsignedByteType,
            anisotropy: 0,
            colorSpace: THREE.LinearSRGBColorSpace,
            depthBuffer: !1,
            stencilBuffer: !1,
            samples: o
        });

    }

    meshUpdate(e = 0) {
        // let t = this.width >> 2;
        // let r = this.height >> 2;
        let t = this.width;
        let r = this.height;
        let l = 0;
        let c = 0;
        this._v$4.copy(this.mousePixelXY)
        this._v$4.x += l * this.width * 3
        this._v$4.y += c * this.height * 3;
        let u = this._v$4.distanceTo(this.prevMousePixelXY)
        let f = fit(u, 0, this.option.radiusDistanceRange, this.option.minRadius, this.option.maxRadius);
        if (!this.hadMoved || !this.drawEnabled) f = 0
        f = f / this.height * r


        let n = this.prevPaintRenderTarget;
        this.prevPaintRenderTarget = this.currPaintRenderTarget;
        this.currPaintRenderTarget = n;

        this.rawShaderMaterial.uniforms.u_prevPaintTexture.value = this.prevPaintRenderTarget.texture;
        this.rawShaderMaterial.uniforms.u_lowPaintTexture.value = this.lowRenderTarget.texture;
        this.rawShaderMaterial.uniforms.u_pushStrength.value = this.option.pushStrength
        this.rawShaderMaterial.uniforms.u_curlScale.value = this.option.curlScale
        this.rawShaderMaterial.uniforms.u_curlStrength.value = this.option.curlStrength
        this.rawShaderMaterial.uniforms.u_dissipations.value.set(this.option.velocityDissipation, this.option.weight1Dissipation, this.option.weight2Dissipation)
        this.rawShaderMaterial.uniforms.u_drawTo.value = this.toDrawData
        this.rawShaderMaterial.uniforms.u_drawFrom.value = this.fromDrawData
        console.log(this.toDrawData.x, this.fromDrawData.x)

        this.fromDrawData.copy(this.toDrawData)
        this._v$4.copy(this.mouseXY)
        this._v$4.x += l
        this._v$4.y += c
        this.toDrawData.set((this._v$4.x + 1) * t / 2, (this._v$4.y + 1) * r / 2, f, 1)
        this._v$4.set(this.toDrawData.x - this.fromDrawData.x, this.toDrawData.y - this.fromDrawData.y).multiplyScalar(e * .8)

        this.rawShaderMaterial.uniforms.u_vel.value.multiplyScalar(this.option.accelerationDissipation).add(this._v$4)
        this.rawShaderMaterial.uniforms.u_scrollOffset.value.x = l
        this.rawShaderMaterial.uniforms.u_scrollOffset.value.y = c


        this.targetMesh.geometry = this.geometry;
        this.targetMesh.material = this.rawShaderMaterial;
        this.targetMesh.material.needsUpdate = true;


        // this.renderer.setRenderTarget(this.currPaintRenderTarget)
        // this.renderer.render(this.targetScene, this.targetCamera)
        // this.renderer.setRenderTarget(null);
        //
        //
        // this.lowRenderTarget = this.currPaintRenderTarget;
        // this.renderer.setRenderTarget(this.lowRenderTarget)
        // this.renderer.render(this.targetScene, this.targetCamera)
        // this.renderer.setRenderTarget(null);

        this.prevMousePixelXY.copy(this.mousePixelXY)
        this.hadMoved = this.hasMoved
        this.deltaXY.set(0, 0)

    }


    animation() {
        let a = performance.now()
        let e = (a - this.dateTime) / 1000;
        this.dateTime = a
        e = Math.min(e, 1 / 20)


        this.renderer.setAnimationLoop(() => this.animation())

        this.meshUpdate(e);


        this.renderer.render(this.scene, this.camera)
    }

}
