import * as THREE from "three";
import ringVert from '@/views/example/ring/glsl/ringVert.glsl'
import ringFrag from '@/views/example/ring/glsl/ringFrag.glsl'

/**
 * justThreeJs main.js
 * @author kongjianqiu
 * @description
 * @created 2024/7/24 09:58:42
 */

function cUnMix(e, t, r) {
    let math = THREE.MathUtils;
    return math.clamp((r - e) / (t - e), 0, 1)
}

function fit(e, t, r, n, o, l) {
    e = cUnMix(t, r, e)
    l && (e = l(e))
    return n + e * (o - n)
}

export default class Ring {
    DOM;
    width = 0;
    height = 0;
    renderer;
    composer;
    scene;
    camera;
    cameraPosition = new THREE.Vector3(0, 0, 1);
    cameraLookAt = new THREE.Vector3(0, 0, 0);
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

    constructor(config = {}) {
        this.target = config.target;
        this.width = this.target.offsetWidth;
        this.height = this.target.offsetHeight;
        this.aspect = this.width / this.height;
        this.renderer = new THREE.WebGLRenderer({
            powerPreference: "high-performance",
            antialias: !1,
            alpha: !1,
            premultipliedAlpha: !1,
            preserveDrawingBuffer: !0
        })
        this.renderer.setSize(this.width, this.height)
        this.target.appendChild(this.renderer.domElement);
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('#d7d7d7')
        this.camera = new THREE.PerspectiveCamera(75, this.aspect, 0.01, 1000);
        this.camera.position.copy(this.cameraPosition)
        this.camera.lookAt(this.cameraLookAt)
        this.camera.updateProjectionMatrix()
        this.scene.add(this.camera);
        this.clock = new THREE.Clock()
        this.dateTime = performance.now();
        this.target.addEventListener('mousemove', (e) => {
            this.mouseXY.set(e.offsetX / this.target.offsetWidth * 2 - 1, 1 - e.offsetY / this.target.offsetHeight * 2)
            this.mousePixelXY.set(e.offsetX, e.offsetY)
            this.deltaXY.copy(this.mouseXY).sub(this._prevMouseXY)
            this._prevMouseXY.copy(this.mouseXY)
            this.hasMoved = this.deltaXY.length() > 0
        })
        this.meshInit();
        this.animation()
    }


    meshInit() {
        const textureLoad = new THREE.TextureLoader()
        const texture = textureLoad.load('./texture/nosi.png')
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        this.geometry = new THREE.BufferGeometry;
        this.geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 4, -1, 0, -1, 4, 0]), 3))
        this.material = new THREE.RawShaderMaterial({
            name: 'ringMaterial',
            vertexShader: ringVert,
            fragmentShader: ringFrag,
            uniforms: {
                iResolution: {value: new THREE.Vector2()},
                iMouse: {value: new THREE.Vector2()},
                iTime: {value: 1.0},
                iGlobalTime: {value: 1.0},
                iChannel0: {value: texture},
                u_drawFrom: {value: new THREE.Vector4(0, 0, 0, 0)},
                u_drawTo: {value: new THREE.Vector4(0, 0, 0, 0)},
                u_vel: {value: new THREE.Vector2()},
            },
            depthWrite: !1,
            depthTest: !1,
            blending: THREE.NoBlending
        })
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.material.uniforms.iResolution.value.x = this.width;
        this.material.uniforms.iResolution.value.y = this.height;
        this.scene.add(this.mesh);
    }


    animation() {
        let a = performance.now()
        let time = (a - this.dateTime) / 1000;
        this.dateTime = a
        time = Math.min(time, 1 / 20)

        this.renderer.setAnimationLoop(() => this.animation())

        this.material.uniforms.iTime.value += this.clock.getDelta();
        this.material.uniforms.iGlobalTime.value += this.clock.getDelta();
        this.material.uniforms.u_drawTo.value = this.toDrawData
        this.material.uniforms.u_drawFrom.value = this.fromDrawData
        this.material.uniforms.u_vel.value.multiplyScalar(0.8).add(this._v$4)


        // let t = this.width >> 2;
        // let r = this.height >> 2;
        let t = this.width;
        let r = this.height;
        this._v$4.copy(this.mousePixelXY)
        let u = this._v$4.distanceTo(this.prevMousePixelXY)
        let f = fit(u, 0, 100, 0, 40);
        if (!this.hadMoved || !this.drawEnabled) f = 0
        f = f / this.height * r
        this.fromDrawData.copy(this.toDrawData)
        this._v$4.copy(this.mouseXY)
        this.toDrawData.set((this._v$4.x + 1) * t / 2, (this._v$4.y + 1) * r / 2, f, 1)
        this._v$4.set(this.toDrawData.x - this.fromDrawData.x, this.toDrawData.y - this.fromDrawData.y).multiplyScalar(time * 0.8)


        // 坐标位置重置
        this.prevMousePixelXY.copy(this.mousePixelXY)
        this.hadMoved = this.hasMoved
        this.deltaXY.set(0, 0)

        if (this.composer) {
            this.composer.render();
        } else {
            this.renderer.render(this.scene, this.camera)
        }

    }

}
