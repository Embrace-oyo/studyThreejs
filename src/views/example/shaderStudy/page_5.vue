<!--
justThreeJs seaSky.vue
@author kongjianqiu
@description
@created 2024/5/8 16:43:32
-->
<template>
  <div class="page_5" id="page_5"></div>
</template>

<script setup>
import {nextTick, onMounted} from "vue";
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {GUI} from 'three/examples/jsm/libs/lil-gui.module.min.js';
import vShader from '@/views/shaderStudy/glsl/page5/page_5_v.glsl'
import v1 from '@/views/shaderStudy/glsl/page5/page_5_v_1.glsl'
import v2 from '@/views/shaderStudy/glsl/page5/page_5_v_2.glsl'
import v3 from '@/views/shaderStudy/glsl/page5/page_5_v_3.glsl'
import v4 from '@/views/shaderStudy/glsl/page5/page_5_v_4.glsl'
import fShader from '@/views/shaderStudy/glsl/page5/page_5_f.glsl'
import f3 from '@/views/shaderStudy/glsl/page5/page_5_f_3.glsl'

let dom, renderer, scene, camera, control, clock, axesHelper, geometry, material, mesh, bufferGeometry;
const iMouse = new THREE.Vector4();
const init = () => {
  renderer = new THREE.WebGLRenderer({antialias: true, alpha: true, physicallyCorrectLights: true})
  renderer.setSize(dom.offsetWidth, dom.offsetHeight)
  renderer.setPixelRatio(window.devicePixelRatio * 2)
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x000000)
  camera = new THREE.PerspectiveCamera(55, dom.offsetWidth / dom.offsetHeight, 1, 20000);
  camera.position.copy(new THREE.Vector3(0, 0, 10));
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  clock = new THREE.Clock()
  axesHelper = new THREE.AxesHelper(5)
  scene.add(axesHelper)
  control = new OrbitControls(camera, renderer.domElement)
  dom.appendChild(renderer.domElement)
}
const draw = () => {
  geometry = new THREE.SphereGeometry(2, 64, 64);
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
    },
  })
  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh)
}
const animation = () => {
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
  const obj = {shader: '初始化'}
  const obj2 = {
    '初始化': {value: 0, shader_v: vShader, shader_f: fShader},
    '顶点扭曲': {value: 1, shader_v: v1, shader_f: fShader},
    '顶点噪音扭曲': {value: 2, shader_v: v2, shader_f: fShader},
    '顶点粒子': {value: 3, shader_v: v3, shader_f: f3},
    '顶点自定义粒子形状': {value: 4, shader_v: v4, shader_f: f3},
  }
  gui.add(obj, 'shader', obj2).name('顶点着色器').onChange((val) => {
    const newMaterial = new THREE.ShaderMaterial().copy(material);
    geometry.dispose();
    material.dispose();
    scene.remove(mesh)
    material = null;
    newMaterial.vertexShader = val.shader_v;
    newMaterial.fragmentShader = val.shader_f;
    material = newMaterial;
    if ([3, 4].includes(val.value)) {
      material.transparent = true;
      material.blending = THREE.AdditiveBlending;
      material.depthWrite = false;
      if (val.value === 4) {
        const bufferGeometry = new THREE.BufferGeometry();
        const count = 500;
        let positions = Array.from({length: count}, () => [2, 2, 2].map(THREE.MathUtils.randFloatSpread));
        positions = positions.flat();
        positions = Float32Array.from(positions);
        bufferGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        mesh = new THREE.Points(bufferGeometry, material);
      } else {
        mesh = new THREE.Points(geometry, material);
      }
    } else {
      material.transparent = false;
      material.blending = THREE.NormalBlending;
      material.depthWrite = true;
      mesh = new THREE.Mesh(geometry, material);
    }
    scene.add(mesh);
  });
}

onMounted(() => {
  nextTick(() => {
    const left = document.querySelector('.left');
    dom = document.getElementById('page_5')
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
.page_5 {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  overflow: hidden;
}
</style>
