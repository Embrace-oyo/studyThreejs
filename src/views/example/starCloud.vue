<!--
justThreeJs starCloud.vue
@author kongjianqiu
@description
@created 2024/1/19 09:35:38
-->
<template>
  <div class="starCloud" id="starCloud"></div>
</template>

<script setup lang="ts">
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {nextTick} from "vue";

let dom, renderer, scene, camera, control, clock, axesHelper, geometry, material, points, count = 100000, vertices = [],
    verticesColor = [];

const init = () => {
  renderer = new THREE.WebGLRenderer({antialias: true, alpha: true})
  renderer.setSize(dom.offsetWidth , dom.offsetHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setClearColor(0x000000, 1.0)
  renderer.shadowMap.enabled = true;
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x020924);
  scene.fog = new THREE.Fog(0x020924, 0.1, 1000);
  camera = new THREE.PerspectiveCamera(75, dom.offsetWidth / dom.offsetHeight, 0.1, 1000)
  camera.lookAt(0, 0, 0)
  camera.position.set(5, 5, 5)
  control = new OrbitControls(camera, renderer.domElement)
  clock = new THREE.Clock()
  axesHelper = new THREE.AxesHelper(10)
  const textureLoader = new THREE.TextureLoader()
  const texture = textureLoader.load(new URL('@/assets/texture/star3.png', import.meta.url).href);
  geometry = new THREE.BufferGeometry()
  material = new THREE.PointsMaterial({
    size: 0.01,
    vertexColors: true,
    map: texture,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthTest: false
  })
  for (let i = 0; i < count; i++) {
    const radius = Math.random() * 10;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI * 2;

    const x = radius * Math.cos(theta) * Math.sin(phi);
    const y = radius * Math.sin(theta) * Math.sin(phi);
    const z = radius * Math.cos(phi);
    vertices.push(x, y, z)

    const distance = Math.sqrt(x * x + y * y);
    const color = new THREE.Color();
    const brightness = 1 - distance / 10;
    color.setHSL((distance / 10) % 1, 0.2, brightness);
    verticesColor.push(color.r, color.g, color.b)
  }
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(verticesColor, 3))
  points = new THREE.Points(geometry, material);
  points.castShadow = true;
  geometry.attributes.position.needsUpdate = true
  geometry.attributes.color.needsUpdate = true
  scene.add(points)
  dom.appendChild(renderer.domElement)
}


// 创建灯光
const createLights = () => {
  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(2, 2, 2);
  directionalLight.castShadow = true;
  scene.add(directionalLight);


  const pointLight = new THREE.PointLight(0xffffff, 2, 1000);
  pointLight.position.set(0, 0, 0);
  scene.add(pointLight);

}
const update = (t: number) => {
  const point = points.geometry.attributes.position;
  for (let i = 0; i < count; i++) {
    if (i % 10 === 0) {
      // 根据规则路径更新粒子的位置
      const oldX = vertices[i]
      const oldY = vertices[i + 1]
      const oldZ = vertices[i + 2]
      // 计算粒子在圆周上的新位置
      const radius = 0.05;
      // 根据时间变化角度，实现动画
      const angle = Date.now() * 0.001;
      points.geometry.attributes.position.array[i] = oldX + radius * Math.cos(angle);
      points.geometry.attributes.position.array[i + 1] = oldY + radius * Math.sin(angle);
      points.geometry.attributes.position.array[i + 2] = oldZ + radius * Math.cos(angle);
    }
  }
  point.needsUpdate = true
  points.rotation.x += 0.0001
  points.rotation.z += 0.0001
}
const animation = () => {
  const time = clock.getDelta()
  camera.updateProjectionMatrix()
  control.update()
  renderer.render(scene, camera)
  update(time)
  requestAnimationFrame(animation)
}

nextTick(() => {
  dom = document.getElementById('starCloud');
  init()
  createLights()
  animation()
  window.onresize = () => {
    camera.aspect = dom.offsetWidth / dom.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(dom.offsetWidth, dom.offsetHeight);
  }
})
</script>

<style scoped lang="less">
.starCloud {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  overflow: hidden;
}
</style>
