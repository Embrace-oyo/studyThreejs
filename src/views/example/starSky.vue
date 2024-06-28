<!--
justThreeJs starCloud.vue
@author kongjianqiu
@description
@created 2024/1/17 15:11:37
-->
<template>
  <div class="starSky" id="starSky"></div>
  <div class="gui" id="gui"></div>
</template>

<script setup>
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {GUI} from 'three/examples/jsm/libs/lil-gui.module.min.js';
import {nextTick, onMounted, reactive} from "vue";

let dom, renderer, scene, camera, controls, clock, axesHelper, geometry, material, mesh, fps, gui;
const parameters = {
  count: 100000,
  size: 0.01,
  radius: 5,
  branches: 3,
  spin: 1.5,
  randomness: 1,
  randomnessPower: 3,
  insideColor: '#ff6030',
  outsideColor: '#1b3984',
}
const init = () => {
  dom = document.getElementById('starSky')
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(dom.offsetWidth, dom.offsetHeight);
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setClearColor('rgb(0,0,0)', 1.0);
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, dom.offsetWidth / dom.offsetHeight, 0.1, 1000)
  camera.position.set(1, 2, 1)
  camera.lookAt(0, 0, 0)
  camera.updateProjectionMatrix()
  controls = new OrbitControls(camera, renderer.domElement)
  scene.add(camera)
  clock = new THREE.Clock()
  axesHelper = new THREE.AxesHelper(6);
  scene.add(axesHelper)
  dom.appendChild(renderer.domElement)
}
const generateGalaxy = () => {
  if (mesh !== null && mesh) {
    geometry.dispose()
    material.dispose()
    scene.remove(mesh)
  }
  geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(parameters.count * 3)
  const colors = new Float32Array(parameters.count * 3)
  for (let i = 0; i < parameters.count; i++) {
    const i3 = i * 3
    // 粒子半径
    const radius = Math.random() * parameters.radius
    // 分支角度
    const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2
    // 螺旋角度
    const spinAngle = radius * parameters.spin
    const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
    const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
    const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
    //顶点位置
    positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX
    positions[i3 + 1] = 0.1 + randomY
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ
    // 颜色
    const colorInside = new THREE.Color(parameters.insideColor)
    const colorOutside = new THREE.Color(parameters.outsideColor)
    const mixedColor = colorInside.clone()
    mixedColor.lerp(colorOutside, radius / parameters.radius)
    colors[i3] = mixedColor.r
    colors[i3 + 1] = mixedColor.g
    colors[i3 + 2] = mixedColor.b
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3))
  material = new THREE.PointsMaterial({
    //粒子大小
    size: parameters.size,
    //开启尺寸衰减
    sizeAttenuation: true,
    //停用depthWrite
    depthWrite: false,
    //激活混合
    blending: THREE.AdditiveBlending,
    vertexColors: true
  })
  mesh = new THREE.Points(geometry, material)
  scene.add(mesh)
}
const createGui = () => {
  gui = new GUI({container: document.getElementById('gui')})
  gui.add(parameters, 'count').min(10000).max(100000).step(100).name('粒子总数').onFinishChange(generateGalaxy)
  gui.add(parameters, 'size').min(0.001).max(0.1).step(0.001).name('粒子大小').onFinishChange(generateGalaxy)
  gui.add(parameters, 'radius').min(0.01).max(20).step(0.01).name('星系半径').onFinishChange(generateGalaxy)
  gui.add(parameters, 'branches').min(2).max(20).step(1).name('星系分支').onFinishChange(generateGalaxy)
  gui.add(parameters, 'spin').min(-5).max(5).step(0.1).name('螺旋').onFinishChange(generateGalaxy)
  gui.add(parameters, 'randomness').min(0).max(2).step(0.001).name('随机性').onFinishChange(generateGalaxy)
  gui.add(parameters, 'randomnessPower').min(1).max(10).step(0.001).name('随机性幂').onFinishChange(generateGalaxy)
  gui.addColor(parameters, 'insideColor').name('内颜色').onFinishChange(generateGalaxy)
  gui.addColor(parameters, 'outsideColor').name('外颜色').onFinishChange(generateGalaxy)
}
const animation = () => {
  camera.updateProjectionMatrix();
  controls.update()
  fps = clock.getDelta()
  renderer.render(scene, camera)
  requestAnimationFrame(animation)
}

onMounted(() => {
  nextTick(() => {
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
})
</script>

<style scoped lang="less">
.starSky {
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
