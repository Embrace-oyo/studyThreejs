<!--
justThreeJs page_1.vue
@author kongjianqiu
@description
@created 2024/2/4 10:45:02
-->
<template>
  <div class="page_1" id="page_1"></div>
</template>

<script setup>
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {nextTick} from "vue";
import vertexShader from './glsl/page1/page_1_vertex.glsl'
import fragmentShader from './glsl/page1/page_1_fragment.glsl'

const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setClearColor(0x000000, 1.0)
renderer.shadowMap.enabled = true;
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x020924);
scene.fog = new THREE.Fog(0x020924, 0.1, 1000);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.lookAt(0, 0, 0)
camera.position.set(0, 0, 8)
const control = new OrbitControls(camera, renderer.domElement)

const geometry = new THREE.PlaneGeometry(1, 1)
const material = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: `
    varying vec2 vUv;
    uniform float uTime;
    void main() {
        gl_FragColor = vec4(vUv.x, 0.0, 0.0, 1.0);
    }
  `,
  uniforms: {
    uTime: {value: 0}
  }
})
const mesh = new THREE.Mesh(geometry, material)
mesh.position.set(-4, 4, 0)
scene.add(mesh)

const geometry1 = new THREE.PlaneGeometry(1, 1)
const material1 = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: `
    varying vec2 vUv;
    uniform float uTime;
    void main() {
        gl_FragColor = vec4(vUv.y, 0.0, 0.0, 1.0);
    }
  `,
  uniforms: {
    uTime: {value: 0}
  }
})
const mesh1 = new THREE.Mesh(geometry1, material1)
mesh1.position.set(-2, 4, 0)
scene.add(mesh1)

const geometry2 = new THREE.PlaneGeometry(1, 1)
const material2 = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: `
    varying vec2 vUv;
    uniform float uTime;
    void main() {
        gl_FragColor = vec4(vec3(vUv.x), 1.0);
    }
  `,
  uniforms: {
    uTime: {value: 0}
  }
})
const mesh2 = new THREE.Mesh(geometry2, material2)
mesh2.position.set(0, 4, 0)
scene.add(mesh2)


const geometry3 = new THREE.PlaneGeometry(1, 1)
const material3 = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: `
    varying vec2 vUv;
    uniform float uTime;
    void main() {
        gl_FragColor = vec4(vec3(vUv.x), 1.0);
    }
  `,
  uniforms: {
    uTime: {value: 0}
  }
})
const mesh3 = new THREE.Mesh(geometry3, material3)
mesh3.position.set(2, 4, 0)
scene.add(mesh3)

const geometry4 = new THREE.PlaneGeometry(1, 1)
const material4 = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: `
    varying vec2 vUv;
    uniform float uTime;
    void main() {
        gl_FragColor = vec4(vec3(vUv.y), 1.0);
    }
  `,
  uniforms: {
    uTime: {value: 0}
  }
})
const mesh4 = new THREE.Mesh(geometry4, material4)
mesh4.position.set(2, 4, 0)
scene.add(mesh4)

const geometry5 = new THREE.PlaneGeometry(1, 1)
const material5 = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: `
    varying vec2 vUv;
    uniform float uTime;
    void main() {
        gl_FragColor = vec4(vUv, 0.0, 1.0);
    }
  `,
  uniforms: {
    uTime: {value: 0}
  }
})
const mesh5 = new THREE.Mesh(geometry5, material5)
mesh5.position.set(4, 4, 0)
scene.add(mesh5)

const geometry6 = new THREE.PlaneGeometry(1, 1)
const material6 = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: `
    varying vec2 vUv;
    uniform float uTime;
    void main() {
        gl_FragColor = vec4(vUv, 1.0, 1.0);
    }
  `,
  uniforms: {
    uTime: {value: 0}
  }
})
const mesh6 = new THREE.Mesh(geometry6, material6)
mesh6.position.set(-4, 2, 0)
scene.add(mesh6)

const geometry7 = new THREE.PlaneGeometry(1, 1)
const material7 = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: `
    varying vec2 vUv;
    uniform float uTime;
    void main() {
        // float color = step(0.5, vUv.x);
        float color = step(vUv.x, 0.5);
        gl_FragColor = vec4(vec3(color), 1.0);
    }
  `,
  uniforms: {
    uTime: {value: 0}
  }
})
const mesh7 = new THREE.Mesh(geometry7, material7)
mesh7.position.set(-2, 2, 0)
scene.add(mesh7)

const geometry8 = new THREE.PlaneGeometry(1, 1)
const material8 = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: `
    varying vec2 vUv;
    uniform float uTime;
    void main() {
       float d = fract(vUv.x * 3.0);
       vec3 col = vec3(d);
       gl_FragColor = vec4(col, 1.0);
    }
  `,
  uniforms: {
    uTime: {value: 0}
  }
})
const mesh8 = new THREE.Mesh(geometry8, material8)
mesh8.position.set(0, 2, 0)
scene.add(mesh8)

const geometry9 = new THREE.PlaneGeometry(1, 1)
const material9 = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: `
    varying vec2 vUv;
    uniform float uTime;
    void main() {
    float d = fract(vUv.x * 3.0);
    float c = step(0.5, d);
    vec3 col = vec3(c);
       gl_FragColor = vec4(col, 1.0);
    }
  `,
  uniforms: {
    uTime: {value: 0}
  }
})
const mesh9 = new THREE.Mesh(geometry9, material9)
mesh9.position.set(2, 2, 0)
scene.add(mesh9)


const geometry10 = new THREE.PlaneGeometry(1, 1)
const material10 = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: `
    varying vec2 vUv;
    uniform float uTime;
    void main() {
       float dist = length(vUv);
        vec3 color = vec3(dist);
        gl_FragColor = vec4(color, 1.0);
    }
  `,
  uniforms: {
    uTime: {value: 0}
  }
})
const mesh10 = new THREE.Mesh(geometry10, material10)
mesh10.position.set(4, 2, 0)
scene.add(mesh10)

const geometry11 = new THREE.PlaneGeometry(1, 1)
const material11 = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: `
    varying vec2 vUv;
    uniform float uTime;
    void main() {
          float dist = length(vUv - 0.5);
          vec3 color = vec3(step(0.5, dist));
          gl_FragColor = vec4(color, 1.0);
    }
  `,
  uniforms: {
    uTime: {value: 0}
  }
})
const mesh11 = new THREE.Mesh(geometry11, material11)
mesh11.position.set(-4, 0, 0)
scene.add(mesh11)


const geometry12 = new THREE.PlaneGeometry(1, 1)
const material12 = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: `
    varying vec2 vUv;
    uniform float uTime;
    void main() {
          float dist = length(vUv - vec2(0.5));
          vec3 color = vec3(step(0.2, dist));
          gl_FragColor = vec4(color, 1.0);
    }
  `,
  uniforms: {
    uTime: {value: 0}
  }
})
const mesh12 = new THREE.Mesh(geometry12, material12)
mesh12.position.set(-2, 0, 0)
scene.add(mesh12)


const geometry13 = new THREE.PlaneGeometry(1, 1)
const material13 = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: `
    varying vec2 vUv;
    uniform float uTime;
    void main() {
       float dist = length(vUv - vec2(0.5));
       float radius = 0.5 * (sin(uTime) * 0.5 + 0.5);
       vec3 color = vec3(step(radius, dist));
       gl_FragColor = vec4(color, 1.0);
    }
  `,
  uniforms: {
    uTime: {value: 0}
  }
})
const mesh13 = new THREE.Mesh(geometry13, material13)
mesh13.position.set(0, 0, 0)
scene.add(mesh13)


const geometry14 = new THREE.PlaneGeometry(1, 1)
const material14 = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: `
    varying vec2 vUv;
    uniform float uTime;
    void main() {
       float dist = length(fract(vUv * 6.0) - vec2(0.5));
       float radius = 0.4 * (sin(uTime * 1.8 - vUv.x + vUv.y) * 0.5 + 0.5);
       vec3 color = vec3(step(radius, dist));
       gl_FragColor = vec4(color, 1.0);
    }
  `,
  uniforms: {
    uTime: {value: 0}
  }
})
const mesh14 = new THREE.Mesh(geometry14, material14)
mesh14.position.set(2, 0, 0)
scene.add(mesh14)

const geometry15 = new THREE.PlaneGeometry(1, 1)
const material15 = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: `
    varying vec2 vUv;
    uniform float uTime;
    void main() {
        float dist = fract((length(vUv - vec2(0.5)) / 0.707 - uTime * 0.2) * 6.0);
        float radius = 0.4;
        vec3 color = vec3(step(radius, dist));
        gl_FragColor = vec4(color, 1.0);
    }
  `,
  uniforms: {
    uTime: {value: 0}
  }
})
const mesh15 = new THREE.Mesh(geometry15, material15)
mesh15.position.set(4, 0, 0)
scene.add(mesh15)


const geometry16 = new THREE.PlaneGeometry(1, 1)
const material16 = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: `
    varying vec2 vUv;
    uniform float uTime;
    void main() {
        vec3 color1 = vec3(1.0, 1.0, 0.0); // yellow 黄色
        vec3 color2 = vec3(0.0, 1.0, 1.0); // cyan 青色
        float mixer = fract(length(vUv - 0.5) * 10.0 / 0.707 + uTime);
        vec3 color = mix(color1, color2, step(0.5, mixer));
        gl_FragColor = vec4(color, 1.0);
    }
  `,
  uniforms: {
    uTime: {value: 0}
  }
})
const mesh16 = new THREE.Mesh(geometry16, material16)
mesh16.position.set(-4, -2, 0)
scene.add(mesh16)


const geometry17 = new THREE.PlaneGeometry(1, 1)
const material17 = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: `
    varying vec2 vUv;
    uniform float uTime;
    void main() {
        vec3 color1 = vec3(1.0, 1.0, 0.0); // yellow 黄色
        vec3 color2 = vec3(0.0, 1.0, 1.0); // cyan 青色
        float mixer1 = vUv.x + vUv.y;
        float mixer2 = 2.0 - (vUv.x + vUv.y);
        float mixer = min(mixer1, mixer2);
        vec3 color = mix(color1, color2, mixer);
        gl_FragColor = vec4(color, 1.0);
    }
  `,
  uniforms: {
    uTime: {value: 0}
  }
})
const mesh17 = new THREE.Mesh(geometry17, material17)
mesh17.position.set(-2, -2, 0)
scene.add(mesh17)


const geometry18 = new THREE.PlaneGeometry(1, 1)
const material18 = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: `
    varying vec2 vUv;
    uniform float uTime;
    void main() {
        vec2 uv = vUv;
        vec2 size = vec2(6.0);
        uv = floor(uv * size) / size;
        float p = length(uv) - 0.1;
        gl_FragColor = vec4(vec3(p), 1.0);
    }
  `,
  uniforms: {
    uTime: {value: 0}
  }
})
const mesh18 = new THREE.Mesh(geometry18, material18)
mesh18.position.set(0, -2, 0)
scene.add(mesh18)


let time = 0
const animation = () => {
  time += 0.03;
  // material12.uniforms.uTime.value = time
  material13.uniforms.uTime.value = time
  material14.uniforms.uTime.value = time
  material15.uniforms.uTime.value = time
  material16.uniforms.uTime.value = time
  camera.updateProjectionMatrix()
  control.update()
  renderer.render(scene, camera)
  requestAnimationFrame(animation)
}
window.addEventListener('resize', function () {
  const newWidth = window.innerWidth;
  const newHeight = window.innerHeight;

  camera.aspect = newWidth / newHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(newWidth, newHeight);
});
nextTick(() => {
  const dom = document.getElementById('page_1');
  dom.appendChild(renderer.domElement)
  animation()
})
</script>

<style scoped lang="less">
.page_1 {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  overflow: hidden;
}
</style>
