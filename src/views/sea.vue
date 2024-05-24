<!--
justThreeJs sea.vue
@author kongjianqiu
@description
@created 2024/1/23 15:10:29
-->
<template>
  <div class="sea" id="sea"></div>
  <div class="gui" id="gui"></div>
</template>

<script setup lang="ts">
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {GUI} from 'three/examples/jsm/libs/lil-gui.module.min.js';
import seaVertexShader from "@/views/glsl/seaVertex.glsl"
import seaFragmentShader from '@/views/glsl/seaFragment.glsl'
import {nextTick} from "vue";

const option = {}
const renderer = new THREE.WebGLRenderer({alpha: true, antialias: true})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setClearColor(0x000000)
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.lookAt(0, 0, 0)
camera.position.set(0.5, 0.6, 0.5)
const clock = new THREE.Clock()
const control = new OrbitControls(camera, renderer.domElement)
const axesHelper = new THREE.AxesHelper(10)
// scene.add(axesHelper)

const geometry = new THREE.PlaneGeometry(1, 1, 128, 128)
geometry.rotateX(Math.PI / 180 * 90)
const debugObject = {
  depthColor: '#186691',
  surfaceColor: '#b1cfe2'
}
const material = new THREE.ShaderMaterial({
  side: THREE.DoubleSide,
  // transparent: true,
  // wireframe: false,
  vertexShader: seaVertexShader,
  fragmentShader: seaFragmentShader,
  uniforms: {
    u_bigWavesElevation: {value: 0.2},
    u_bigWavesFrequency: {value: new THREE.Vector2(4, 1.5)},
    u_time: {value: 0},
    u_bigWavesSpeed: {value: new THREE.Vector2(0.75, 0.75)},
    u_depthColor: {value: new THREE.Color(debugObject.depthColor)},
    u_surfaceColor: {value: new THREE.Color(debugObject.surfaceColor)},
    u_colorOffset: {value: 0.08},
    u_colorMultiplier: {value: 5},
    u_smallWavesElevation: {value: 0.15},
    u_smallWavesFrequency: {value: 5.52},
    u_smallWavesSpeed: {value: 0.5},
    u_smallIterations: {value: 4},
  }
})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

const createGui = () => {
  const gui = new GUI({container: document.getElementById('gui'), width: 500})
  gui.add(material.uniforms.u_bigWavesElevation, 'value')
      .min(0)
      .max(1)
      .step(0.001)
      .name('uBigWavesElevation')
  gui.add(material.uniforms.u_bigWavesFrequency.value, 'x')
      .min(0)
      .max(10)
      .step(0.001)
      .name('uBigWavesFrequencyX')
  gui.add(material.uniforms.u_bigWavesFrequency.value, 'y')
      .min(0)
      .max(10)
      .step(0.001)
      .name('uBigWavesFrequencyY')
  gui.add(material.uniforms.u_bigWavesSpeed.value, 'x')
      .min(0)
      .max(4)
      .step(0.001)
      .name('uBigWavesSpeedX')
  gui.add(material.uniforms.u_bigWavesSpeed.value, 'y')
      .min(0)
      .max(4)
      .step(0.001)
      .name('uBigWavesSpeedY')
  gui.addColor(debugObject, 'depthColor')
      .onChange(() => {
        material.uniforms.u_depthColor.value.set(debugObject.depthColor)
      })
  gui.addColor(debugObject, 'surfaceColor')
      .onChange(() => {
        material.uniforms.u_surfaceColor.value.set(debugObject.surfaceColor)
      })
  gui.add(material.uniforms.u_colorOffset, 'value')
      .min(0)
      .max(1)
      .step(0.001)
      .name('uColorOffset')
  gui.add(material.uniforms.u_colorMultiplier, 'value')
      .min(0)
      .max(10)
      .step(0.001)
      .name('uColorMultiplier')
  gui.add(material.uniforms.u_smallWavesElevation, 'value').min(0).max(1).step(0.001).name('uSmallWavesElevation')
  gui.add(material.uniforms.u_smallWavesFrequency, 'value').min(0).max(30).step(0.001).name('uSmallWavesFrequency')
  gui.add(material.uniforms.u_smallWavesSpeed, 'value').min(0).max(4).step(0.001).name('uSmallWavesSpeed')
  gui.add(material.uniforms.u_smallIterations, 'value').min(0).max(5).step(1).name('uSmallIterations')
}
const animation = () => {
  const time = clock.getElapsedTime()
  material.uniforms.u_time.value = time;
  camera.updateProjectionMatrix()
  control.update()
  renderer.render(scene, camera)
  requestAnimationFrame(animation)
}
nextTick(() => {
  const dom: any = document.getElementById('sea')
  dom.appendChild(renderer.domElement)
  createGui()
  animation()
  window.addEventListener('resize', function () {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;

    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(newWidth, newHeight);
  });
})
</script>

<style scoped lang="less">
.sea {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  overflow: hidden;
}

.gui {
  position: absolute;
  left: 0;
  top: 0;
}
</style>
