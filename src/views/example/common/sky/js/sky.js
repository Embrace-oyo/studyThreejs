/**
 * justThreeJs js.js
 * @author kongjianqiu
 * @description
 * @created 2024/7/1 16:39:18
 */
import * as THREE from "three";
import Base from '@/util/common/base'
import Component from '@/util/common/component'
import OrbitControls from "@/util/common/orbitControls.js";
import skyVert from '@/views/example/common/sky/glsl/skyVert.glsl'
import skyFrag from '@/views/example/common/sky/glsl/skyFrag.glsl'
import Debug from "@/util/common/debug.js";

export default class World extends Base {
    constructor(el = 'canvas', config = {}) {
        super(el, config);
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 0.5;
        this.camera = new THREE.PerspectiveCamera(60, this.aspect, 100, 2000000);
        this.camera.position.set(5000, 1000, 100000);
        this.controls = new OrbitControls(this)
        const helper = new THREE.GridHelper(10000, 2, 0xffffff, 0xffffff);
        this.scene.add(helper);
        this.debug = new Debug(this)
        new Init(this)
    }
}


class Init extends Component {
    constructor(base) {
        super(base);
        this.base = base;
        this.geometry = new THREE.BoxGeometry(1, 1, 1)
        this.material = new THREE.ShaderMaterial({
            name: 'SkyShader',
            uniforms: {
                'turbidity': {value: 2},
                'rayleigh': {value: 1},
                'mieCoefficient': {value: 0.005},
                'mieDirectionalG': {value: 0.8},
                'sunPosition': {value: new THREE.Vector3()},
                'up': {value: new THREE.Vector3(0, 1, 0)}
            },
            vertexShader: skyVert,
            fragmentShader: skyFrag,
            side: THREE.BackSide,
            depthWrite: true,
        })
        this.sky = new THREE.Mesh(this.geometry, this.material)
        this.isSky = true;
        this.sky.scale.setScalar(450000);
        this.base.scene.add(this.sky);
        this.sun = new THREE.Vector3();
        const effectController = {
            turbidity: 10,
            rayleigh: 3,
            mieCoefficient: 0.005,
            mieDirectionalG: 0.7,
            elevation: 2,
            azimuth: 180,
            exposure: this.base.renderer.toneMappingExposure
        };
        const guiChanged = () => {
            const uniforms = this.sky.material.uniforms;
            uniforms['turbidity'].value = effectController.turbidity;
            uniforms['rayleigh'].value = effectController.rayleigh;
            uniforms['mieCoefficient'].value = effectController.mieCoefficient;
            uniforms['mieDirectionalG'].value = effectController.mieDirectionalG;

            const phi = THREE.MathUtils.degToRad(90 - effectController.elevation);
            const theta = THREE.MathUtils.degToRad(effectController.azimuth);

            this.sun.setFromSphericalCoords(1, phi, theta);

            uniforms['sunPosition'].value.copy(this.sun);

            this.base.renderer.toneMappingExposure = effectController.exposure;
            this.base.renderer.render(this.base.scene, this.base.camera);
        }
        if (this.base.debug.active) {
            this.base.debug.ui.domElement.style.position = 'absolute'
            this.base.debug.ui.domElement.style.right = '0'
            this.base.debug.ui.domElement.style.top = '0'
            this.base.debug.ui.domElement.style.zIndex = '999'
            this.base.debug.ui.add(effectController, 'turbidity', 0.0, 20.0, 0.1).onChange(guiChanged);
            this.base.debug.ui.add(effectController, 'rayleigh', 0.0, 4, 0.001).onChange(guiChanged);
            this.base.debug.ui.add(effectController, 'mieCoefficient', 0.0, 0.1, 0.001).onChange(guiChanged);
            this.base.debug.ui.add(effectController, 'mieDirectionalG', 0.0, 1, 0.001).onChange(guiChanged);
            this.base.debug.ui.add(effectController, 'elevation', 0, 90, 0.1).onChange(guiChanged);
            this.base.debug.ui.add(effectController, 'azimuth', -180, 180, 0.1).onChange(guiChanged);
            this.base.debug.ui.add(effectController, 'exposure', 0, 1, 0.0001).onChange(guiChanged);
        }
        guiChanged()
    }

    water() {
        this.waterGeometry = new THREE.Plane()
    }

    update() {

    }
}
