<!--
justThreeJs streamer.vue
@author kongjianqiu
@description
@created 2024/4/10 14:16:09
-->
<template>
  <div class="streamer" id="streamer"></div>
</template>

<script setup lang="ts">
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {nextTick} from "vue";
import seaVertexShader from "@/views/glsl/streamerV.glsl"
import seaFragmentShader from '@/views/glsl/streamerF.glsl'

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
camera.position.set(0, 0, 0.01)
const control = new OrbitControls(camera, renderer.domElement)
const clock = new THREE.Clock()
const axesHelper = new THREE.AxesHelper(10)
scene.add(axesHelper)
// const geometry = new THREE.BoxGeometry(100, 100, 100);
// const geometry = new THREE.CapsuleGeometry( 10, 10, 4, 8 );
// const geometry = new THREE.PlaneGeometry( 5, 2 );
class CustomSinCurve extends THREE.Curve {

  constructor(scale = 1) {

    super();

    this.scale = scale;

  }

  getPoint(t, optionalTarget = new THREE.Vector3()) {

    const tx = t * 3 - 1.5;
    const ty = Math.sin(2 * Math.PI * t);
    const tz = 0;

    return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);

  }

}

const path = new CustomSinCurve(10);
const geometry = new THREE.TubeGeometry(path, 1, 3, 20, false);
const material = new THREE.ShaderMaterial({
  side: THREE.DoubleSide,
  transparent: true,
  wireframe: false,
  vertexShader: seaVertexShader,
  fragmentShader: seaFragmentShader,
  uniforms: {
    u_time: {value: 0},
    u_speed: {value: 0},
  }
})
const mesh = new THREE.Mesh(geometry, material);
mesh.rotateY(Math.PI / 180 * 90)
scene.add(mesh)
const animation = () => {
  const time = clock.getElapsedTime()
  material.uniforms.u_time.value = time * 1.25;
  material.uniforms.u_speed.value = time * 3;
  camera.updateProjectionMatrix()
  control.update()
  renderer.render(scene, camera)
  requestAnimationFrame(animation)
}
nextTick(() => {
  const dom = document.getElementById('streamer');
  dom.appendChild(renderer.domElement)
  animation()
})
window.addEventListener('resize', function () {
  const newWidth = window.innerWidth;
  const newHeight = window.innerHeight;
  camera.aspect = newWidth / newHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(newWidth, newHeight);
});
</script>

<style scoped lang="less">
.streamer {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  overflow: hidden;
}
</style>
