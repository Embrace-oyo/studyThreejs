<template>
  <div class="fbo" id="fbo">
    <canvas id="canvas"></canvas>
  </div>
</template>

<script setup>
import * as THREE from "three";
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {DotScreenPass} from 'three/addons/postprocessing/DotScreenPass.js';
import {GlitchPass} from 'three/addons/postprocessing/GlitchPass.js';
import {GTAOPass} from 'three/addons/postprocessing/GTAOPass.js';
import {RenderPixelatedPass} from 'three/addons/postprocessing/RenderPixelatedPass.js';
import {SMAAPass} from '@/views/example/common/composer/js/SMAAPass.js';
import {ScreenPaintPass} from '@/views/example/common/composer/js/screenPaintDistortionPass'

import {nextTick} from "vue";

let dom, canvas, gl, width, height, renderer, scene, camera, object, composer, renderTarget, postProcessScene,
    postProcessCamera;

const init = () => {
  dom = document.getElementById('fbo')
  canvas = document.getElementById('canvas')
  gl = canvas.getContext("webgl2", {antialias: !1, alpha: !1, xrCompatible: !1, powerPreference: "high-performance"})
  width = dom.offsetWidth;
  height = dom.offsetHeight;
  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    context: gl,
    premultipliedAlpha: !1
  });
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(width, height)
  renderer.toneMapping = THREE.ReinhardToneMapping;
  renderer.setAnimationLoop(animation);
  dom.appendChild(renderer.domElement)


  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x000000, 1, 1000);


  camera = new THREE.PerspectiveCamera(70, width / height, .1, 1000)
  camera.position.set(0, 0, 500)
  camera.lookAt(0, 0, 0)

}

const objectInit = () => {
  object = new THREE.Object3D();
  scene.add(object);

  const geometry = new THREE.SphereGeometry(1, 4, 4);
  const material = new THREE.MeshPhongMaterial({color: 0xffffff, flatShading: true});

  for (let i = 0; i < 500; i++) {

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

  const smaaPass = new SMAAPass(dom.offsetWidth, dom.offsetHeight);
  composer.addPass(smaaPass);

  const gtaoPass = new GTAOPass(scene, camera);
  gtaoPass.output = GTAOPass.OUTPUT.Denoise;
  gtaoPass.updateGtaoMaterial({
    radius: 0.25,
    distanceExponent: 1.,
    thickness: 1.,
    scale: 1.,
    samples: 16,
    distanceFallOff: 1.,
    screenSpaceRadius: false,
  });
  gtaoPass.updatePdMaterial({
    lumaPhi: 10,
    depthPhi: 2.,
    normalPhi: 3.,
    radius: 4.,
    radiusExponent: 1.,
    rings: 2.,
    samples: 16,
  });
  composer.addPass(gtaoPass);

  const glitchPass = new GlitchPass()
  composer.addPass(glitchPass);

  /*const renderPixelatedPass = new RenderPixelatedPass(5, scene, camera, {normalEdgeStrength: 1, depthEdgeStrength: 1});
  composer.addPass(renderPixelatedPass);*/


  /* const screenPaintPass = new ScreenPaintPass({
     renderer,
     scene,
     camera,
     dom
   })
   composer.addPass(screenPaintPass)*/


  const outputPass = new OutputPass();
  outputPass.renderToScreen = true;
  composer.addPass(outputPass);
}

const postProcess = () => {
  renderTarget = new THREE.WebGLRenderTarget(dom.offsetWidth, dom.offsetHeight);
  postProcessScene = new THREE.Scene();
  postProcessCamera = new THREE.PerspectiveCamera(70, width / height, .1, 1000)
  postProcessCamera.position.z = 1;
  const postProcessPlane = new THREE.BoxGeometry(1, 1, 1);
  const postProcessMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00});
  const postProcessMesh = new THREE.Mesh(postProcessPlane, postProcessMaterial);
  postProcessScene.add(postProcessMesh);
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

  #canvas {
    width: 100%;
    height: 100%;
  }
}
</style>
