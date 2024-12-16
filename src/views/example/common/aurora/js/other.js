/**
 * justThreeJs other.js
 * @author kongjianqiu
 * @description
 * @created 2024/12/13 17:22:30
 */

import * as THREE from "three";

const debounce = (callback, duration) => {
    var timer;
    return function(event) {
        clearTimeout(timer);
        timer = setTimeout(function(){
            callback(event);
        }, duration);
    };
};

const loadTexs = (imgs, callback) => {
    const texLoader = new THREE.TextureLoader();
    const length = Object.keys(imgs).length;
    const loadedTexs = {};
    let count = 0;

    texLoader.crossOrigin = 'anonymous';

    for (var key in imgs) {
        const k = key;
        if (imgs.hasOwnProperty(k)) {
            texLoader.load(imgs[k], (tex) => {
                tex.repeat = THREE.RepeatWrapping;
                loadedTexs[k] = tex;
                count++;
                if (count >= length) callback(loadedTexs);
            });
        }
    }
}

class Fog {
    constructor() {
        this.uniforms = {
            time: {
                type: 'f',
                value: 0
            },
            tex: {
                type: 't',
                value: null
            }
        };
        this.num = 200;
        this.obj = null;
    }
    createObj(tex) {
        // Define Geometries
        const geometry = new THREE.InstancedBufferGeometry();
        const baseGeometry = new THREE.PlaneBufferGeometry(1100, 1100, 20, 20);

        // Copy attributes of the base Geometry to the instancing Geometry
        geometry.addAttribute('position', baseGeometry.attributes.position);
        geometry.addAttribute('normal', baseGeometry.attributes.normal);
        geometry.addAttribute('uv', baseGeometry.attributes.uv);
        geometry.setIndex(baseGeometry.index);

        // Define attributes of the instancing geometry
        const instancePositions = new THREE.InstancedBufferAttribute(new Float32Array(this.num * 3), 3, 1);
        const delays = new THREE.InstancedBufferAttribute(new Float32Array(this.num), 1, 1);
        const rotates = new THREE.InstancedBufferAttribute(new Float32Array(this.num), 1, 1);
        for ( var i = 0, ul = this.num; i < ul; i++ ) {
            instancePositions.setXYZ(
                i,
                (Math.random() * 2 - 1) * 850,
                0,
                (Math.random() * 2 - 1) * 300,
            );
            delays.setXYZ(i, Math.random());
            rotates.setXYZ(i, Math.random() * 2 + 1);
        }
        geometry.addAttribute('instancePosition', instancePositions);
        geometry.addAttribute('delay', delays);
        geometry.addAttribute('rotate', rotates);

        // Define Material
        const material = new THREE.RawShaderMaterial({
            uniforms: this.uniforms,
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
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });
        this.uniforms.tex.value = tex;

        // Create Object3D
        this.obj = new THREE.Mesh(geometry, material);
    }
    render(time) {
        this.uniforms.time.value += time;
    }
}

const resolution = new THREE.Vector2();
const canvas = document.getElementById('canvas-webgl');
const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    canvas: canvas,
});
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera();
const clock = new THREE.Clock();

camera.far = 50000;
camera.setFocalLength(24);

const texsSrc = {
    fog: 'https://ykob.github.io/sketch-threejs/img/sketch/fog/fog.png'
};
const fog = new Fog();

const render = () => {
    const time = clock.getDelta();
    fog.render(time);
    renderer.render(scene, camera);
};
const renderLoop = () => {
    render();
    requestAnimationFrame(renderLoop);
};
const resizeCamera = () => {
    camera.aspect = resolution.x / resolution.y;
    camera.updateProjectionMatrix();
};
const resizeWindow = () => {
    resolution.set(window.innerWidth, window.innerHeight);
    canvas.width = resolution.x;
    canvas.height = resolution.y;
    resizeCamera();
    renderer.setSize(resolution.x, resolution.y);
};
const on = () => {
    window.addEventListener('resize', debounce(resizeWindow), 1000);
};

const init = () => {
    loadTexs(texsSrc, (loadedTexs) => {
        fog.createObj(loadedTexs.fog);

        scene.add(fog.obj);

        renderer.setClearColor(0x111111, 1.0);
        camera.position.set(0, 0, 1000);
        camera.lookAt(new THREE.Vector3());
        clock.start();

        on();
        resizeWindow();
        renderLoop();
    });
}
init();
