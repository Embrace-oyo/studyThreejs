<!--
justThreeJs fire.vue
@author kongjianqiu
@description
@created 2024/2/5 17:31:30
-->
<template>
  <div class="fire" id="fire"></div>
</template>

<script setup>
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {nextTick} from "vue";

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

const fireGeometry = new THREE.PlaneGeometry(5, 5, 32, 32);

const material = new THREE.ShaderMaterial({
  vertexShader: `
        varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
  `,
  fragmentShader: `
    precision highp float;
            varying vec2 vUv;

            uniform float uTime;

            void main() {
                // 使用 sin 函数模拟火焰的动态效果
                float flame = sin(vUv.y * 10.0 + uTime) * 0.2;
                flame = max(flame, 0.0);

                // 添加颜色渐变，模拟火焰的亮度
                vec3 flameColor = vec3(1.0, 0.5, 0.0) * flame;

                // 输出最终颜色
                gl_FragColor = vec4(flameColor, 1.0);
            }
  `,
  uniforms: {
    uTime: {
      value: 0,
    }
  },
  side: THREE.DoubleSide,
  blending: THREE.AdditiveBlending,
  depthTest: false,
  transparent: true,
})
const mesh = new THREE.Mesh(fireGeometry, material);
mesh.rotation.x = -Math.PI / 2;
scene.add(mesh)


const animation = () => {
  // 更新粒子系统
  material.uniforms.uTime.value += 0.01;
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
  const dom = document.getElementById('fire');
  dom.appendChild(renderer.domElement)
  animation()
})
</script>

<style scoped lang="less">
.fire {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  overflow: hidden;
}
</style>
