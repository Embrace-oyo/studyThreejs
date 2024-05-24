<!--
justThreeJs seaSky.vue
@author kongjianqiu
@description
@created 2024/5/8 16:43:32
-->
<template>
  <div class="page_3" id="page_3"></div>
</template>

<script setup>
import {nextTick, onMounted} from "vue";
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {GUI} from 'three/examples/jsm/libs/lil-gui.module.min.js';
import vShader from '@/views/shaderStudy/glsl/page3/page_3_v.glsl'
import basic from '@/views/shaderStudy/glsl/page3/page_3_basic.glsl'
import distort from '@/views/shaderStudy/glsl/page3/page_3_distort.glsl'
import transitions from '@/views/shaderStudy/glsl/page3/page_3_transitions.glsl'
import transitions1 from '@/views/shaderStudy/glsl/page3/page_3_transitions1.glsl'
import transitions2 from '@/views/shaderStudy/glsl/page3/page_3_transitions2.glsl'
import transitions3 from '@/views/shaderStudy/glsl/page3/page_3_transitions3.glsl'
import transitions4 from '@/views/shaderStudy/glsl/page3/page_3_transitions4.glsl'
import transitions5 from '@/views/shaderStudy/glsl/page3/page_3_transitions5.glsl'
import transitions6 from '@/views/shaderStudy/glsl/page3/page_3_transitions6.glsl'

let dom, renderer, scene, camera, control, clock, axesHelper, geometry, material, mesh;
const iMouse = new THREE.Vector4();
const init = () => {
  renderer = new THREE.WebGLRenderer({antialias: true, alpha: true, physicallyCorrectLights: true})
  renderer.setSize(dom.offsetWidth, dom.offsetHeight)
  renderer.setPixelRatio(window.devicePixelRatio * 2)
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xb7b7b7)
  camera = new THREE.PerspectiveCamera(55, dom.offsetWidth / dom.offsetHeight, 1, 20000);
  camera.position.copy(new THREE.Vector3(0, 0, 2));
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  clock = new THREE.Clock()
  axesHelper = new THREE.AxesHelper(5)
  scene.add(axesHelper)
  dom.appendChild(renderer.domElement)
}
const water = () => {
  const textureLoad = new THREE.TextureLoader()
  const t1 = textureLoad.load('./texture/QozT59R6KsYmb3q.jpg')
  const t2 = textureLoad.load('./texture/Jb8mIhZMBElPiuC.jpg')
  const t3= textureLoad.load('./texture/3GDlwcvehqQjTPH.jpg')
  t1.wrapS = THREE.RepeatWrapping;
  t2.wrapT = THREE.RepeatWrapping;
  t2.wrapS = THREE.RepeatWrapping;
  t2.wrapT = THREE.RepeatWrapping;
  t3.wrapS = THREE.RepeatWrapping;
  t3.wrapT = THREE.RepeatWrapping;

  geometry = new THREE.PlaneGeometry(2, 1);
  material = new THREE.ShaderMaterial({
    name: 'MirrorShader',
    vertexShader: vShader,
    fragmentShader: basic,
    uniforms: {
      iResolution: {value: new THREE.Vector2()},
      iMouse: {value: iMouse},
      iTime: {value: 1.0},
      iGlobalTime: {value: 1.0},
      iChannel0: {value: t1},
      iChannel1: {value: t2},
      iChannel2: {value: t3},
    },
    // blending: THREE.AdditiveBlending,
    // wireframe: true,
    transparent: true,
    depthTest: true,
  })
  material.uniforms.iResolution.value.x = 2;
  material.uniforms.iResolution.value.y = 1;
  mesh = new THREE.Mesh(geometry, material);
  // mesh.rotation.x = -Math.PI / 2;
  scene.add(mesh)
}
const animation = () => {
  material.uniforms.iTime.value += clock.getDelta();
  material.uniforms.iGlobalTime.value += clock.getDelta();
  camera.updateProjectionMatrix()
  renderer.render(scene, camera)
  requestAnimationFrame(animation)
}
const gui = () => {
  const gui = new GUI({container: dom})
  gui.domElement.style.position = 'absolute'
  gui.domElement.style.right = '0'
  gui.domElement.style.top = '0'
  gui.domElement.style.zIndex = '999'
  const obj = {shader: '采样'}
  gui.add(obj, 'shader', {
    '采样': basic,
    '扭曲': distort,
    '淡出淡入转场': transitions,
    '滑动转场': transitions1,
    '遮罩转场': transitions2,
    '置换转场': transitions3,
    '颗粒化滤镜': transitions4,
    '柏林噪声转场': transitions5,
    '分形布朗噪声转场': transitions6,
  }).name('图片处理').onChange(value => {
    const newMaterial = new THREE.ShaderMaterial().copy(material);
    newMaterial.fragmentShader = value;
    material.dispose();
    scene.remove(mesh)
    material = null;
    material = newMaterial;
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
  });
}
onMounted(() => {
  nextTick(() => {
    const left = document.querySelector('.left');
    dom = document.getElementById('page_3')
    init()
    water()
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
.page_3 {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  overflow: hidden;
}
</style>
