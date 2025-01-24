/**
 * justThreeJs main.js
 * @author kongjianqiu
 * @description
 * @created 2024/12/13 17:19:47
 */
import * as THREE from "three";

export default class Main {
    constructor(config) {
        this.target = config.target;
        this.width = this.target.offsetWidth;
        this.height = this.target.offsetHeight;
        this.aspect = this.width / this.height;


        this.assets()
        window.addEventListener('resize', () => this.resize());
    }

    async assets() {
        this.manager = new THREE.LoadingManager();
        this.textureLoader = new THREE.TextureLoader(this.manager)
        this.textureLoader.crossOrigin = 'anonymous';
        this.t1 = await this.textureLoader.load('https://ykob.github.io/sketch-threejs/img/sketch/fog/fog.png')

        this.manager.onLoad = () => {
            console.log('complete')
            this.setBase()
            this.setFog()
            this.animation()
        }
    }

    setBase() {
        this.renderer = new THREE.WebGLRenderer({alpha: true, antialias: true, preserveDrawingBuffer: true});
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.width, this.height);
        this.renderer.setClearColor(0x111111, 1.0);
        this.target.appendChild(this.renderer.domElement);

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera();
        this.camera.position.set(0, 0, 1000);
        this.camera.lookAt(new THREE.Vector3());
        this.camera.far = 50000;
        this.camera.setFocalLength(24);
        this.clock = new THREE.Clock();
        this.clock.start();
    }

    setFog() {
        this.num = 200;
        this.obj = null;

        const geometry = new THREE.InstancedBufferGeometry();
        const baseGeometry = new THREE.PlaneGeometry(1100, 1100, 20, 20);
        // Copy attributes of the base Geometry to the instancing Geometry
        geometry.setAttribute('position', baseGeometry.attributes.position);
        geometry.setAttribute('normal', baseGeometry.attributes.normal);
        geometry.setAttribute('uv', baseGeometry.attributes.uv);
        geometry.setIndex(baseGeometry.index);

        // Define attributes of the instancing geometry
        const instancePositions = new THREE.InstancedBufferAttribute(new Float32Array(this.num * 3), 3, true);
        const delays = new THREE.InstancedBufferAttribute(new Float32Array(this.num), 1, true);
        const rotates = new THREE.InstancedBufferAttribute(new Float32Array(this.num), 1, true);

        for (let i = 0, ul = this.num; i < ul; i++) {
            instancePositions.setXYZ(
                i,
                (Math.random() * 2 - 1) * 850,
                0,
                (Math.random() * 2 - 1) * 300,
            );
            let random = Math.random();
            let random2 = Math.random() * 2 + 1;
            delays.setXYZ(i, random, random, random);
            rotates.setXYZ(i, random2, random2, random2);
        }

        geometry.setAttribute('instancePosition', instancePositions);
        geometry.setAttribute('delay', delays);
        geometry.setAttribute('rotate', rotates);

        const material = new THREE.RawShaderMaterial({
            vertexShader: `
        attribute vec3 position;
        attribute vec2 uv;
        attribute vec3 instancePosition;
        attribute float delay;
        attribute float rotate;

        uniform mat4 projectionMatrix;
        uniform mat4 modelViewMatrix;
        uniform float time;

        varying vec3 vPosition;
        varying vec2 vUv;
        varying vec3 vColor;
        varying float vBlink;

        const float duration = 200.0;

        mat4 calcRotateMat4Z(float radian) {
          return mat4(
            cos(radian), -sin(radian), 0.0, 0.0,
            sin(radian), cos(radian), 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0
          );
        }
        vec3 convertHsvToRgb(vec3 c) {
          vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
          vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
          return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
        }

        void main(void) {
          float now = mod(time + delay * duration, duration) / duration;

          mat4 rotateMat = calcRotateMat4Z(radians(rotate * 360.0) + time * 0.1);
          vec3 rotatePosition = (rotateMat * vec4(position, 1.0)).xyz;

          vec3 moveRise = vec3(
            (now * 2.0 - 1.0) * (2500.0 - (delay * 2.0 - 1.0) * 2000.0),
            (now * 2.0 - 1.0) * 2000.0,
            sin(radians(time * 50.0 + delay + length(position))) * 30.0
            );
          vec3 updatePosition = instancePosition + moveRise + rotatePosition;

          vec3 hsv = vec3(time * 0.1 + delay * 0.2 + length(instancePosition) * 100.0, 0.5 , 0.8);
          vec3 rgb = convertHsvToRgb(hsv);
          float blink = (sin(radians(now * 360.0 * 20.0)) + 1.0) * 0.88;

          vec4 mvPosition = modelViewMatrix * vec4(updatePosition, 1.0);

          vPosition = position;
          vUv = uv;
          vColor = rgb;
          vBlink = blink;

          gl_Position = projectionMatrix * mvPosition;
        }
      `,
            fragmentShader: `
        precision highp float;

        uniform sampler2D tex;

        varying vec3 vPosition;
        varying vec2 vUv;
        varying vec3 vColor;
        varying float vBlink;

        void main() {
          vec2 p = vUv * 2.0 - 1.0;

          vec4 texColor = texture2D(tex, vUv);
          vec3 color = (texColor.rgb - vBlink * length(p) * 0.8) * vColor;
          float opacity = texColor.a * 0.36;

          gl_FragColor = vec4(color, opacity);
        }
      `,
            uniforms: {
                time: {
                    value: 0
                },
                tex: {
                    value: this.t1
                }
            },
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,

        })

        this.mesh = new THREE.Mesh(geometry, material)

        this.scene.add(this.mesh);
    }

    animation() {
        requestAnimationFrame(() => this.animation())
        const time = this.clock.getDelta();
        this.mesh.material.uniforms.time.value += time;
        this.renderer.render(this.scene, this.camera);
    }

    resize() {
        this.width = this.target.offsetWidth;
        this.height = this.target.offsetHeight;
        this.aspect = this.width / this.height;
        this.camera.aspect = this.aspect;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.width, this.height);
    }

    destroy() {
        // scene
        this.scene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.geometry?.dispose();
                Object.values(child.material).forEach((value) => {
                    if (value && typeof value.dispose === "function") {
                        value.dispose();
                    }
                });
            }
        });
        // renderer
        this.renderer.dispose();
    }
}
