/**
 * justThreeJs sun.js
 * @author kongjianqiu
 * @description
 * @created 2024/6/6 16:05:12
 */
import * as THREE from "three";
import Base from '@/util/common/base'
import Debug from "@/util/common/debug";
import Component from "@/util/common/component";
import OrbitControls from "@/util/common/orbitControls";
import UniformInjector from "@/util/common/uniformInjector";
import vert from "@/views/shaderStudy/glsl/page11/shader/vert.glsl";
import frag from "@/views/shaderStudy/glsl/page11/shader/frag.glsl";
import sunNoiseVert from "@/views/shaderStudy/glsl/page11/shader/sunNoiseVert.glsl";
import sunNoiseFrag from "@/views/shaderStudy/glsl/page11/shader/sunNoiseFrag.glsl";
import sunRingVert from "@/views/shaderStudy/glsl/page11/shader/sunRingVert.glsl";
import sunRingFrag from "@/views/shaderStudy/glsl/page11/shader/sunRingFrag.glsl";

export default class Sun extends Base {
    constructor(el = 'canvas', config = {}) {
        super(el, config);
        this.debug = new Debug(this);
        this.cameraPosition = new THREE.Vector3(0, 0, 2);
        this.camera.position.copy(this.cameraPosition)
        this.controls = new OrbitControls(this)
        this.debug = new Debug(this);
        this.world = new World(this);
    }
}

class World extends Component {
    constructor(base) {
        super(base);
        this.init()
    }

    debugInit() {
    }

    init() {
        this.debugInit()
        this.sunInit()
        this.cubeRTInit()
        this.sunRingInit()
    }

    sunInit() {
        this.sunGeometry = new THREE.SphereGeometry(1, 100, 100);
        this.sunUj = new UniformInjector(this.base)
        this.sunMaterial = new THREE.ShaderMaterial({
            vertexShader: vert,
            fragmentShader: frag,
            side: THREE.FrontSide,
            transparent: true,
            depthWrite: true,
            uniforms: {
                uNoiseTexture: {
                    value: null
                },
                uVelocity: {
                    value: 0.05
                },
                uBrightness: {
                    value: 0.33
                },
                uStagger: {
                    value: 16
                },
                ...this.sunUj.shadertoyUniforms,
            }
        });
        this.sunMesh = new THREE.Mesh(this.sunGeometry, this.sunMaterial)
        this.base.scene.add(this.sunMesh)
    }

    cubeRTInit() {
        const resolution = 256
        this.cubeRT = new THREE.WebGLCubeRenderTarget(resolution)
        this.cubeCamera = new THREE.CubeCamera(0.1, 10, this.cubeRT);
        this.cubeScene = new THREE.Scene();
        this.cubeGeometry = new THREE.SphereGeometry(1, 100, 100);
        this.cubeUj = new UniformInjector(this.base)
        this.cubeMaterial = new THREE.ShaderMaterial({
            vertexShader: sunNoiseVert,
            fragmentShader: sunNoiseFrag,
            side: THREE.DoubleSide,
            uniforms: {
                ...this.cubeUj.shadertoyUniforms,
            }
        });
        this.cubeMesh = new THREE.Mesh(this.cubeGeometry, this.cubeMaterial)
        const position = new THREE.Vector3(0, 0, 0)
        this.cubeMesh.position.copy(position)
        this.cubeScene.add(this.cubeMesh)
    }

    sunRingInit() {
        this.sunRingGeometry = new THREE.SphereGeometry(1.2, 100, 100);
        this.sunRingUj = new UniformInjector(this.base)
        this.sunRingMaterial = new THREE.ShaderMaterial({
            vertexShader: sunRingVert,
            fragmentShader: sunRingFrag,
            side: THREE.BackSide,
            uniforms: {
                ...this.sunRingUj.shadertoyUniforms,
            }
        });
        this.ringMesh = new THREE.Mesh(this.sunRingGeometry, this.sunRingMaterial)
        const position = new THREE.Vector3(0, 0, 0)
        this.ringMesh.position.copy(position)
        this.base.scene.add(this.ringMesh)
    }


    update() {
        if (this.sunMaterial && this.cubeMaterial) {
            this.cubeCamera.update(this.base.renderer, this.cubeScene);
            this.sunMaterial.uniforms.uNoiseTexture.value = this.cubeRT.texture
            this.sunUj.injectShadertoyUniforms(this.sunMaterial.uniforms)
            this.cubeUj.injectShadertoyUniforms(this.cubeMaterial.uniforms)
            this.sunRingUj.injectShadertoyUniforms(this.sunRingUj.uniforms)
        }
    }
}


