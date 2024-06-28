<!--
justThreeJs pepyaka.vue
@author kongjianqiu
@description
@created 2024/4/30 15:12:11
-->
<template>
  <div class="pepyaka" id="pepyaka"></div>
</template>

<script setup>
import v_shader from '@/glsl/pepyaka/v.glsl'
import f_shader from '@/glsl/pepyaka/f.glsl'
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {nextTick, onMounted} from "vue";

let dom;
const renderer = new THREE.WebGLRenderer({antialias: true});
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000)
const controls = new OrbitControls(camera, renderer.domElement)
const clock = new THREE.Clock()
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setClearColor(0x0a0a0f, 1.0);
camera.position.set(0, 0, 4)
camera.lookAt(0, 0, 0)
camera.updateProjectionMatrix()

const geometry = new THREE.SphereGeometry(1, 200, 200);
const material = new THREE.ShaderMaterial({
  vertexShader: v_shader,
  fragmentShader: f_shader,
  wireframe: false,
  uniforms: {
    uTime: {value: 0}
  }
})
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh)

const animation = () => {
  const time = clock.getElapsedTime()
  mesh.material.uniforms.uTime.value = time
  camera.updateProjectionMatrix()
  renderer.render(scene, camera);
  requestAnimationFrame(animation)
}

onMounted(() => {
  nextTick(() => {
    dom = document.getElementById('pepyaka');
    dom.appendChild(renderer.domElement)
    animation()
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    })
  })
})

const init = () => {

}
</script>

<style scoped lang="less">
.pepyaka {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  overflow: hidden;
}
</style>
