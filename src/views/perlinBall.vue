<template>
  <div class="demo" id="demo"></div>
</template>
<script setup lang="ts">
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {nextTick} from "vue";
import domeVertexShader from "@/views/glsl/domeVertexShader.glsl"
import domeFragmentShader from '@/views/glsl/domeFragmentShader.glsl'

let scene: any, camera: any, renderer: any, dom: any, orbitControls: any, planeMesh, planeMaterial: any,
    time: number = 0;
nextTick(() => {
  dom = document.getElementById('demo')
  renderer = new THREE.WebGLRenderer()
  renderer.setClearColor(0x000000, 1)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(dom.offsetWidth, dom.offsetHeight)
  dom.appendChild(renderer.domElement)
  main()
  window.onresize = () => {
    camera.aspect = dom.offsetWidth / dom.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(dom.offsetWidth, dom.offsetHeight);
  }
})
const clock = new THREE.Clock()
const animation = () => {
  const time = clock.getElapsedTime()
  planeMaterial.uniforms.u_time.value = time;
  orbitControls.update();
  renderer.render(scene, camera)
  requestAnimationFrame(animation)
}
const main = () => {
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xb7b7b7)
  camera = new THREE.PerspectiveCamera(75, dom.offsetWidth / dom.offsetHeight, 0.1, 1000);
  camera.position.set(0, 8, 10);
  camera.lookAt(0, 0, 0);
  camera.updateProjectionMatrix();
  orbitControls = new OrbitControls(camera, renderer.domElement)
  const planeGeometry = new THREE.SphereGeometry(1, 256, 256);
  planeMaterial = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    wireframe: false,
    vertexShader: domeVertexShader,
    fragmentShader: domeFragmentShader,
    uniforms: {
      u_time:
          {value: 0}
    },
  })
  planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
  scene.add(planeMesh)
  const axesHelper = new THREE.AxesHelper(300);
  scene.add(axesHelper)
  animation()
}
</script>
<style scoped lang="less">
.demo {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  overflow: hidden;
}
</style>
