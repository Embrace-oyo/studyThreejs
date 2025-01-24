/**
 * justThreeJs index.js
 * @author kongjianqiu
 * @description
 * @created 2024/6/3 16:09:16
 */
import * as THREE from "three";
import Base from '@/util/common/base'
import Debug from "@/util/common/debug";
import Component from "@/util/common/Component";
import OrbitControls from "@/util/common/orbitControls";
import UniformInjector from "@/util/common/uniformInjector.js";
import ScreenQuad from "@/util/common/screenQuad.js";
import vert from '@/views/shaderStudy/glsl/page10/shader/vert.glsl'
import rayFrag from '@/views/shaderStudy/glsl/page10/shader/rayFrag.glsl'
import IMouse from "@/util/common/iMouse.js";

export default class Index extends Base {
    constructor(el = 'canvas', config = {}) {
        super(el, config);
        this.debug = new Debug(this);
        this.cameraPosition = new THREE.Vector3(0, 0, 0);
        this.orthographicCameraParams = {
            left: -1,
            right: 1,
            top: 1,
            bottom: -1,
            near: 0,
            far: 1,
            zoom: 1
        };
        this.camera = new THREE.OrthographicCamera(this.orthographicCameraParams.left, this.orthographicCameraParams.right, this.orthographicCameraParams.top, this.orthographicCameraParams.bottom, this.orthographicCameraParams.near, this.orthographicCameraParams.far);
        this.camera.position.copy(this.cameraPosition)
        this.controls = new OrbitControls(this)
        this.world = new World(this);
    }
}

class World extends Component {
    constructor(base) {
        super(base);
        this.init()
        this.debugInit()

    }

    init() {
        const textureload = new THREE.TextureLoader()
        const iChannle0 = textureload.load('./texture/7zhBySIYxEqUFW3.png')
        this.uj = new UniformInjector(this.base)
        this.geometry = new THREE.PlaneGeometry(2, 2);
        this.material = new THREE.ShaderMaterial({
            vertexShader: vert,
            fragmentShader: rayFrag,
            uniforms: {
                uProgress: {
                    value: 1.0
                },
                uVelocitySphere: {
                    value: 0.2
                },
                uDistance: {
                    value: 2.0
                },
                uAngle: {
                    value: 3.5
                },
                iChannle0: {
                    value: iChannle0
                },
                ...this.uj.shadertoyUniforms,
            }
        })
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.base.scene.add(this.mesh)
    }

    debugInit() {
        if (this.base.debug.active) {
            this.base.debug.ui.domElement.style.position = 'absolute'
            this.base.debug.ui.domElement.style.right = '0'
            this.base.debug.ui.domElement.style.top = '0'
            this.base.debug.ui.domElement.style.zIndex = '999'
            this.base.debug.ui.add(this.material.uniforms.uProgress, "value").min(0).max(1).step(0.01).name("uProgress");
            this.base.debug.ui.add(this.material.uniforms.uVelocitySphere, "value").min(0).max(1).step(0.01).name("uVelocitySphere");
            this.base.debug.ui.add(this.material.uniforms.uDistance, "value").min(0).max(5).step(0.01).name("uDistance");
            this.base.debug.ui.add(this.material.uniforms.uAngle, "value").min(0).max(4).step(0.01).name("uAngle");
        }
    }


    update() {
        this.uj.injectShadertoyUniforms(this.material.uniforms)
    }
}



