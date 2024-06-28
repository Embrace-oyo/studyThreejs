<!--
justThreeJs starSkyShader.vue
@author kongjianqiu
@description
@created 2024/1/26 09:20:54
-->
<template>
  <div class="starSkyShader" id="starSkyShader"></div>
  <div class="gui" id="gui"></div>
</template>

<script setup lang="ts">
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {GUI} from 'three/examples/jsm/libs/lil-gui.module.min.js';
import starSkyVertex from '@/views/glsl/starSkyVertex.glsl'
import starSkyFragment from '@/views/glsl/starSkyFragment.glsl'
import {nextTick} from "vue";
let dom, renderer, scene, camera, control, clock, axesHelper, geometry, material, points;
const parameters = {
  count: 100000,
  size: 30,
  radius: 5,
  branches: 4,
  spin: 1.1,
  randomness: 0.2,
  randomnessPower: 3,
  insideColor: '#2e7eff',
  outsideColor: '#ff00c8',
}
const init = () => {
  renderer = new THREE.WebGLRenderer({antialias: true, alpha: true})
  renderer.setSize(dom.offsetWidth , dom.offsetHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0x000000, 1.0)
  renderer.shadowMap.enabled = true;
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(75, dom.offsetWidth / dom.offsetHeight, 0.1, 1000)
  camera.lookAt(0, 0, 0)
  camera.position.set(3, 3, 3)
  control = new OrbitControls(camera, renderer.domElement)
  clock = new THREE.Clock()
  axesHelper = new THREE.AxesHelper(10)
  scene.add(axesHelper)
  dom.appendChild(renderer.domElement)
}
const generateGalaxy = () => {
  if (points !== null && points) {
    geometry.dispose()
    material.dispose()
    scene.remove(points)
  }
  const positions = new Float32Array(parameters.count * 3)
  const colors = new Float32Array(parameters.count * 3)
  const scales = new Float32Array(parameters.count * 1.1)
  const randomness = new Float32Array(parameters.count * 3)
  const insideColor = new THREE.Color(parameters.insideColor)
  const outsideColor = new THREE.Color(parameters.outsideColor)
  geometry = new THREE.BufferGeometry()
  for (let i = 0; i < parameters.count; i++) {
    const i3 = i * 3;
    const radius = Math.random() * parameters.radius;
    const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2
    // 螺旋角度
    const spinAngle = radius * parameters.spin
    const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius
    const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius
    const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius

    positions[i3] = Math.cos(branchAngle + spinAngle) * radius
    positions[i3 + 1] = 0
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius

    // Color
    const mixedColor = insideColor.clone()
    mixedColor.lerp(outsideColor, radius / parameters.radius)

    colors[i3] = mixedColor.r
    colors[i3 + 1] = mixedColor.g
    colors[i3 + 2] = mixedColor.b

    // scale
    scales[i] = Math.random()
    //
    randomness[i3] = randomX
    randomness[i3 + 1] = randomY
    randomness[i3 + 2] = randomZ
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('a_scale', new THREE.BufferAttribute(scales, 1))
  geometry.setAttribute('a_randomness', new THREE.BufferAttribute(randomness, 3))
  material = new THREE.ShaderMaterial({
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
    vertexShader: starSkyVertex,
    fragmentShader: starSkyFragment,
    uniforms: {
      u_size: {value: parameters.size * renderer.getPixelRatio()},
      u_time: {value: 0}
    }
  })
  points = new THREE.Points(geometry, material)
  scene.add(points)
}
const createGui = () => {
  const gui = new GUI({container: document.getElementById('gui')})
  gui.add(parameters, 'count').min(100).max(1000000).step(100).onFinishChange(generateGalaxy)
  gui.add(parameters, 'size').min(30).max(100).step(0.1).onFinishChange(generateGalaxy)
  gui.add(parameters, 'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy)
  gui.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy)
  gui.add(parameters, 'spin').min(-5).max(5).step(0.1).name('螺旋').onFinishChange(generateGalaxy)
  gui.add(parameters, 'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy)
  gui.add(parameters, 'randomnessPower').min(1).max(10).step(0.001).onFinishChange(generateGalaxy)
  gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy)
  gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy)
}

const animation = () => {
  const time = clock.getElapsedTime()
  material.uniforms.u_time.value = time
  camera.updateProjectionMatrix()
  control.update()
  renderer.render(scene, camera)
  requestAnimationFrame(animation)
}
nextTick(() => {
  dom = document.getElementById('starSkyShader');
  init()
  generateGalaxy()
  createGui()
  animation()
  window.onresize = () => {
    camera.aspect = dom.offsetWidth / dom.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(dom.offsetWidth, dom.offsetHeight);
  }
})
</script>

<style scoped lang="less">
.starSkyShader {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  overflow: hidden;
}
.gui{
  position: absolute;
  left: 0;
  top: 0;
}
</style>
