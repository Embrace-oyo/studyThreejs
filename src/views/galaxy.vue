<!--
justThreeJs fire.vue
@author kongjianqiu
@description
@created 2024/2/5 17:31:30
-->
<template>
  <div class="galaxy" id="galaxy"></div>
</template>

<script setup>
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {nextTick} from "vue";
import galaxyV from '@/views/glsl/galaxy_v.glsl'
import galaxyF from '@/views/glsl/galaxy_f.glsl'

const renderer = new THREE.WebGLRenderer({antialias: true, alpha: false})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setClearColor(0x160016, 1.0)
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.lookAt(0, 10, 0)
camera.position.set(0, 0, 18)
const control = new OrbitControls(camera, renderer.domElement)


const count1 = 50000;
const count2 = 100000;
const geometry = new THREE.BufferGeometry();
const positions = [];
const sizes = [];
const shifts = [];
for (let i = 0; i < count1 + count2; i++) {
  let theta = Math.random() * Math.PI * 2;
  let phi = Math.acos(Math.random() * 2 - 1); // 分布更均匀
  let angle = (Math.random() * 0.9 + 0.1) * Math.PI * 0.1;
  let strength = Math.random() * 0.9 + 0.1; // 0.1-1
  let size = Math.random() * 1.5 + 0.5;
  shifts.push(theta, phi, angle, strength);
  sizes.push(size)
  // 球体部分
  if (i < count1) {
    let {x, y, z} = new THREE.Vector3().randomDirection().multiplyScalar(Math.random() * 0.5 + 12.5);
    positions.push(x, y, z);
  } else {
    // 圆盘/圆柱部分
    // 圆盘粒子
    let radius = Math.random() * 30 + 10;
    let { x, y, z } = new THREE.Vector3().setFromCylindricalCoords(radius, Math.random() * 2 * Math.PI, (Math.random() - 0.5) * 2);
    positions.push(x, y, z);
  }
}

geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
geometry.setAttribute("aSize", new THREE.Float32BufferAttribute(sizes, 1));
geometry.setAttribute("aShift", new THREE.Float32BufferAttribute(shifts, 4));


const material = new THREE.ShaderMaterial({
  vertexShader: galaxyV,
  fragmentShader: galaxyF,
  transparent: true,
  blending: THREE.AdditiveBlending,
  depthTest: false,
  uniforms: {
    uTime: {
      value: 0,
    }
  }
});
const points = new THREE.Points(geometry, material);
points.rotation.z = Math.PI / 180 * 10;
points.position.setY(-4);
scene.add(points);

const clock = new THREE.Clock();

const animation = () => {
  requestAnimationFrame(animation)
  // 更新粒子系统
  points.material.uniforms.uTime.value = clock.getElapsedTime();
  points.rotation.y = clock.getElapsedTime() * 0.03;
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
  const dom = document.getElementById('galaxy');
  dom.appendChild(renderer.domElement)
  animation()
})
</script>

<style scoped lang="less">
.galaxy {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  overflow: hidden;
}
</style>
