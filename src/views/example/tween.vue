<!--
justThreeJs tween.vue
@author kongjianqiu
@description
@created 2024/2/1 15:50:53
-->
<template>
  <div class="tween" id="tween"></div>
</template>

<script setup lang="ts">
import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {nextTick} from "vue";

const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(0x000000, 1.0)
renderer.shadowMap.enabled = true;
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.lookAt(0, 0, 0)
camera.position.set(0, 1, 10)
const control = new OrbitControls(camera, renderer.domElement)
const clock = new THREE.Clock()
const axesHelper = new THREE.AxesHelper(10)
scene.add(axesHelper)
const light = new THREE.HemisphereLight(0xffffff, 0xeeeeee, 1);
light.position.set(0, 5, 0);
scene.add(light);

const count = 10000;
const distance = 5;
const points: any = []
const points2: any = []
for (let i = 0; i < count; i++) {
  const x = (Math.random() - 0.5) * distance;
  const y = (Math.random() - 0.5) * distance;
  const z = (Math.random() - 0.5) * distance;

  const phi = Math.acos(-1 + (2 * i) / count);
  const theta = Math.sqrt(count * Math.PI) * phi;
  const x2 = 5 * Math.cos(theta) * Math.sin(phi);
  const y2 = 5 * Math.sin(theta) * Math.sin(phi);
  const z2 = 5 * Math.cos(phi);

  points.push(x, y, z)
  points2.push(x2, y2, z2)
}
const pointGeometry = new THREE.BufferGeometry()
const pointGeometry2 = new THREE.BufferGeometry()
pointGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(points), 3))
pointGeometry2.setAttribute('position', new THREE.BufferAttribute(new Float32Array(points2), 3))
const pointMaterial = new THREE.PointsMaterial({color: 0xff0000, size: 0.03})
const pointMesh = new THREE.Points(pointGeometry, pointMaterial)
scene.add(pointMesh)
// Tween.js 动画
const duration = 30000; // 持续时间

const tween = new TWEEN.Tween(pointGeometry.attributes.position.array)
    .to(pointGeometry2.attributes.position.array, duration)
    .easing(TWEEN.Easing.Quadratic.In)
    .onUpdate(() => {
      // pointGeometry.attributes.position.needsUpdate = true
    })
    // .repeat(Infinity)
    // .yoyo(true)
    .start();
const animation = () => {
  requestAnimationFrame(animation)
  tween.update()
  pointGeometry.attributes.position.needsUpdate = true
  camera.updateProjectionMatrix()
  control.update()
  renderer.render(scene, camera)
}
window.addEventListener('resize', function () {
  const newWidth = window.innerWidth;
  const newHeight = window.innerHeight;
  camera.aspect = newWidth / newHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(newWidth, newHeight);
});
nextTick(() => {
  const dom: any = document.getElementById('tween');
  dom.appendChild(renderer.domElement)
  animation()
})
</script>

<style scoped lang="less">
.tween {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  overflow: hidden;
}
</style>
