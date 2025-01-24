<!--
justThreeJs seaSky.vue
@author kongjianqiu
@description
@created 2024/5/8 16:43:32
-->
<template>
  <div class="seaSky" id="seaSky"></div>
</template>

<script setup>
import {nextTick, onMounted} from "vue";
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {GUI} from 'three/examples/jsm/libs/lil-gui.module.min.js';
import vShader from '@/views/shaderStudy/glsl/page2/page_4_v.glsl'
import basic from '@/views/shaderStudy/glsl/page2/page_4_basic.glsl'
import center from '@/views/shaderStudy/glsl/page2/page_4_center.glsl'
import scale from '@/views/shaderStudy/glsl/page2/page_4_scale.glsl'
import step from '@/views/shaderStudy/glsl/page2/page_4_step.glsl'
import smoothstep from '@/views/shaderStudy/glsl/page2/page_4_smoothstep.glsl'
import blur from '@/views/shaderStudy/glsl/page2/page_4_blur.glsl'
import light from '@/views/shaderStudy/glsl/page2/page_4_light.glsl'
import rotate from '@/views/shaderStudy/glsl/page2/page_4_rotate.glsl'
import mix from '@/views/shaderStudy/glsl/page2/page_4_mix.glsl'
import mix2 from '@/views/shaderStudy/glsl/page2/page_4_mix2.glsl'
import change from '@/views/shaderStudy/glsl/page2/page_4_change.glsl'
import repeat from '@/views/shaderStudy/glsl/page2/page_4_repeat.glsl'
import grid from '@/views/shaderStudy/glsl/page2/page_4_grid.glsl'
import checkerboard from '@/views/shaderStudy/glsl/page2/page_4_checkerboard.glsl'
import ripple from '@/views/shaderStudy/glsl/page2/page_4_ripple.glsl'
import polar from '@/views/shaderStudy/glsl/page2/page_4_polar.glsl'
import radial from '@/views/shaderStudy/glsl/page2/page_4_radial.glsl'
import spiral from '@/views/shaderStudy/glsl/page2/page_4_Spiral.glsl'
import rain from '@/views/shaderStudy/glsl/page2/page_4_rain.glsl'

let dom, renderer, scene, camera, control, clock, axesHelper, geometry, material, mesh;
const init = () => {
  renderer = new THREE.WebGLRenderer({antialias: true, alpha: true, physicallyCorrectLights: true})
  renderer.setSize(dom.offsetWidth, dom.offsetHeight)
  renderer.setPixelRatio(window.devicePixelRatio * 2)
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xb7b7b7)
  camera = new THREE.PerspectiveCamera(55, dom.offsetWidth / dom.offsetHeight, 1, 20000);
  camera.position.copy(new THREE.Vector3(0, 0, 2));
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  control = new OrbitControls(camera, renderer.domElement)
  clock = new THREE.Clock()
  axesHelper = new THREE.AxesHelper(5)
  scene.add(axesHelper)
  dom.appendChild(renderer.domElement)
}
const water = () => {
  const textureLoad = new THREE.TextureLoader()
  const texture = textureLoad.load('./texture/nosi.png')
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  geometry = new THREE.PlaneGeometry(2, 1);

  material = new THREE.ShaderMaterial({
    name: 'MirrorShader',
    vertexShader: vShader,
    fragmentShader: basic,
    uniforms: {
      iResolution: {value: new THREE.Vector2()},
      iMouse: {value: new THREE.Vector2()},
      iTime: {value: 1.0},
      iGlobalTime: {value: 1.0},
      iChannel0: {value: texture},
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
  const obj = {shader: '圆形的绘制'}
  gui.add(obj, 'shader', {
    '圆形的绘制': basic,
    '圆的居中': center,
    '适应画布比例': scale,
    '消除渐变': step,
    '消除锯齿': smoothstep,
    '模糊效果': blur,
    '发光效果': light,
    '旋转效果': rotate,
    'mix效果': mix,
    '图形mix效果': mix2,
    '形状转变效果': change,
    '重复效果': repeat,
    '网格效果': grid,
    '棋盘格效果': checkerboard,
    '波纹效果': ripple,
    '极坐标效果': polar,
    '极坐标放射效果': radial,
    '极坐标螺旋效果': spiral,
    '扩散光环效果': rain,
  }).name('shader').onChange(value => {
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
    dom = document.getElementById('seaSky')
    init()
    water()
    animation()
    gui()
  })
  window.onresize = () => {
    camera.aspect = dom.offsetWidth / dom.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(dom.offsetWidth, dom.offsetHeight);
  }
  window.addEventListener('touchmove', (e) => {
    material.uniforms.iMouse.value.x = e["touches"][0].clientX;
    material.uniforms.iMouse.value.y = e["touches"][0].clientY;
  })
})
</script>

<style scoped lang="less">
.seaSky {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  overflow: hidden;
}
</style>
