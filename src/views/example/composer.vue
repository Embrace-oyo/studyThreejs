<template>
  <div class="fbo" id="fbo"></div>
</template>

<script setup>
import * as THREE from "three";
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {BloomPass} from 'three/addons/postprocessing/BloomPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {ShaderPass} from 'three/addons/postprocessing/ShaderPass.js';

import {DotScreenShader} from 'three/addons/shaders/DotScreenShader.js';
import {RGBShiftShader} from 'three/addons/shaders/RGBShiftShader.js';

import SMAAPass from '@/views/example/common/composer/js/SMAAPass'
import ScreenPaintDistortionPass from '@/views/example/common/composer/js/screenPaintDistortionPass'

import screenPaintShader from '@/views/example/common/composer/glsl/screenPaintShader.glsl'
import blitVert from '@/views/example/common/composer/glsl/blitVert.glsl'
import blitFrag from '@/views/example/common/composer/glsl/blitFrag.glsl'
import vertShader from '@/views/example/common/composer/glsl/vertShader.glsl'
import fragShader from '@/views/example/common/composer/glsl/fragShader.glsl'
import screenPaintDistortionShader from '@/views/example/common/composer/glsl/screenPaintDistortionShader.glsl'
import vShader from '@/views/example/common/composer/glsl/vShader.glsl'
import fShader from '@/views/example/common/composer/glsl/fShader.glsl'

import {nextTick} from "vue";

let dom, width, height, renderer, scene, camera, object, blueNoiseSharedUniforms, composer;

const init = () => {
  dom = document.getElementById('fbo')
  width = dom.offsetWidth;
  height = dom.offsetHeight;
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(width, height)
  renderer.toneMapping = THREE.ReinhardToneMapping;
  renderer.setAnimationLoop(animation);
  dom.appendChild(renderer.domElement)


  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x000000, 1, 1000);


  camera = new THREE.PerspectiveCamera(70, width / height, .1, 1000)
  camera.position.set(0, 0, 400)
  camera.lookAt(0, 0, 0)

}

const objectInit = () => {
  object = new THREE.Object3D();
  scene.add(object);

  const geometry = new THREE.SphereGeometry(1, 4, 4);
  const material = new THREE.MeshPhongMaterial({color: 0xffffff, flatShading: true});

  for (let i = 0; i < 100; i++) {

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
    mesh.position.multiplyScalar(Math.random() * 400);
    mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
    mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 50;
    object.add(mesh);

  }

  scene.add(new THREE.AmbientLight(0xcccccc));

  const light = new THREE.DirectionalLight(0xffffff, 3);
  light.position.set(1, 1, 1);
  scene.add(light);
}

const postprocessing = () => {
  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  const SMAA_Pass = new SMAAPass(dom.offsetWidth * renderer.getPixelRatio(), dom.offsetHeight * renderer.getPixelRatio());
  composer.addPass(SMAA_Pass)


  // const screenPaintPass = new ScreenPaintDistortionPass(dom.offsetWidth, dom.offsetHeight, renderer)
  // composer.addPass(screenPaintPass)

  const outputPass = new OutputPass();
  composer.addPass(outputPass);
}

const animation = () => {
  object.rotation.x += 0.005;
  object.rotation.y += 0.01;

  if (composer) {
    composer.render()
  } else {
    renderer.render(scene, camera)
  }
}

nextTick(() => {
  init()
  objectInit()
  postprocessing()
})

</script>

<style scoped lang="less">
.fbo {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}
</style>
