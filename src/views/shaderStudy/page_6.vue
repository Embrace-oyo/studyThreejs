<!--
justThreeJs page_6.vue
@author kongjianqiu
@description
@created 2024/5/8 16:43:32
-->
<template>
  <div class="page_6" id="page_6"></div>
</template>

<script setup>
import {nextTick, onMounted} from "vue";
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {GUI} from 'three/examples/jsm/libs/lil-gui.module.min.js';
import vShader from '@/views/shaderStudy/glsl/page6/page_6_v.glsl'
import fShader from '@/views/shaderStudy/glsl/page6/page_6_f.glsl'
import f1 from '@/views/shaderStudy/glsl/page6/page_6_f_1.glsl'
import f2 from '@/views/shaderStudy/glsl/page6/page_6_f_2.glsl'
import f3 from '@/views/shaderStudy/glsl/page6/page_6_f_3.glsl'
import f4 from '@/views/shaderStudy/glsl/page6/page_6_f_4.glsl'
import f5 from '@/views/shaderStudy/glsl/page6/page_6_f_5.glsl'

let dom, renderer, scene, camera, control, clock, axesHelper, geometry, material, mesh, bufferGeometry;
const iMouse = new THREE.Vector4();
const init = () => {
  renderer = new THREE.WebGLRenderer({antialias: true, alpha: true, physicallyCorrectLights: true})
  renderer.setSize(dom.offsetWidth, dom.offsetHeight)
  renderer.setPixelRatio(window.devicePixelRatio * 2)
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x000000)
  camera = new THREE.PerspectiveCamera(75, dom.offsetWidth / dom.offsetHeight, 1, 20000);
  camera.position.copy(new THREE.Vector3(0, 0, 5));
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  clock = new THREE.Clock()
  axesHelper = new THREE.AxesHelper(5)
  scene.add(axesHelper)
  control = new OrbitControls(camera, renderer.domElement)
  dom.appendChild(renderer.domElement)
}
const draw = () => {
  const envmap = new THREE.CubeTextureLoader().load([
    "https://s2.loli.net/2022/09/29/X8TDZROlUo6uAyG.png",
    "https://s2.loli.net/2022/09/29/KYEJ9ylQNIe6h4R.png",
    "https://s2.loli.net/2022/09/29/GqseLg6tWoluDzV.png",
    "https://s2.loli.net/2022/09/29/LUk8P21MJG6AtNF.png",
    "https://s2.loli.net/2022/09/29/4BO1JHoM3phFCb7.png",
    "https://s2.loli.net/2022/09/29/5NvAxfCVqlKFRZU.png",
  ]);
  // geometry = new THREE.SphereGeometry(2, 64, 64);
  geometry = new THREE.TorusKnotGeometry(1.2, 0.4, 128, 32);
  material = new THREE.ShaderMaterial({
    name: 'newShader',
    vertexShader: vShader,
    fragmentShader: fShader,
    uniforms: {
      iResolution: {value: new THREE.Vector2()},
      iMouse: {value: iMouse},
      iTime: {value: 1.0},
      iGlobalTime: {value: 1.0},
      pixelRatio: {value: renderer.getPixelRatio()},
      iChannel0: {value: envmap},
    },
  })
  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh)
}
const animation = () => {
  mesh.rotation.y = 0.2 * clock.elapsedTime;
  material.uniforms.iTime.value += clock.getDelta();
  material.uniforms.iGlobalTime.value += clock.getDelta();
  camera.updateProjectionMatrix()
  control.update()
  renderer.render(scene, camera)
  requestAnimationFrame(animation)
}
const gui = () => {
  const gui = new GUI({container: dom})
  gui.domElement.style.position = 'absolute'
  gui.domElement.style.right = '0'
  gui.domElement.style.top = '0'
  gui.domElement.style.zIndex = '999'
  const obj = {shader: '环境光'}
  const obj2 = {
    '环境光': {value: 0, shader_v: vShader, shader_f: fShader},
    '漫反射': {value: 1, shader_v: vShader, shader_f: f1},
    '镜面反射': {value: 2, shader_v: vShader, shader_f: f2},
    'Blinn-Phong 光照模型': {value: 3, shader_v: vShader, shader_f: f3},
    'IBL 镜面反射': {value: 4, shader_v: vShader, shader_f: f4},
    '菲涅尔反射': {value: 5, shader_v: vShader, shader_f: f5},
  }
  gui.add(obj, 'shader', obj2).name('光照模型').onChange((val) => {
    const newMaterial = new THREE.ShaderMaterial().copy(material);
    geometry.dispose();
    material.dispose();
    scene.remove(mesh)
    material = null;
    newMaterial.vertexShader = val.shader_v;
    newMaterial.fragmentShader = val.shader_f;
    material = newMaterial;
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
  });
}

onMounted(() => {
  nextTick(() => {
    const left = document.querySelector('.left');
    dom = document.getElementById('page_6')
    init()
    draw()
    animation()
    gui()
    const handleMove = (event) => {
      iMouse.x = (event.pageX - left.offsetWidth) / dom.offsetWidth;
      iMouse.y = (dom.offsetHeight - event.pageY) / dom.offsetHeight;
      material.uniforms.iMouse.value = iMouse;
    };
    dom.addEventListener('mousedown', (e) => {
      iMouse.z = 2;
      iMouse.w = 2;
      material.uniforms.iMouse.value = iMouse;
      dom.addEventListener("mousemove", handleMove);
      dom.addEventListener("mouseup", () => {
        dom.removeEventListener("mousemove", handleMove);
        iMouse.z = 0;
        iMouse.w = 0;
        material.uniforms.iMouse.value = iMouse;
      });
    })
  })
  window.onresize = () => {
    camera.aspect = dom.offsetWidth / dom.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(dom.offsetWidth, dom.offsetHeight);
  }
})
</script>

<style scoped lang="less">
.page_6 {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  overflow: hidden;
}
</style>
