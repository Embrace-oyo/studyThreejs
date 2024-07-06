<template>
  <div class="fbo" id="fbo"></div>
</template>

<script setup>
import * as THREE from "three";
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {ShaderPass} from 'three/addons/postprocessing/ShaderPass.js';

import {DotScreenShader} from 'three/addons/shaders/DotScreenShader.js';
import {RGBShiftShader} from 'three/addons/shaders/RGBShiftShader.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';

import {nextTick} from "vue";

let dom, width, height, renderer, scene, camera, object, blueNoiseSharedUniforms, composer;

const init = () => {
  dom = document.getElementById('fbo')
  width = dom.offsetWidth;
  height = dom.offsetHeight;
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(width, height)
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

const blueNoise = async () => {
  const TEXTURE_SIZE = 128;
  blueNoiseSharedUniforms = {
    u_blueNoiseTexture: {value: null},
    u_blueNoiseLinearTexture: {value: null},
    u_blueNoiseTexelSize: {value: null},
    u_blueNoiseCoordOffset: {value: new THREE.Vector2}
  }
  let e = new THREE.Texture;
  e.generateMipmaps = !1
  e.minFilter = e.magFilter = THREE.LinearFilter
  e.wrapS = e.wrapT = THREE.RepeatWrapping;
  let loader = new THREE.TextureLoader();
  let texture = await loader.loadAsync('/texture/LDR_RGB1_0.png')
  let t = new THREE.Texture(texture.image)
  e.image = t.image
  t.generateMipmaps = !1
  t.minFilter = t.magFilter = THREE.NearestFilter
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  blueNoiseSharedUniforms.u_blueNoiseTexture.value = t
  blueNoiseSharedUniforms.u_blueNoiseLinearTexture.value = e
  blueNoiseSharedUniforms.u_blueNoiseTexelSize.value = new THREE.Vector2(1 / TEXTURE_SIZE, 1 / TEXTURE_SIZE)
}

const postprocessing = () => {
  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  // const effect1 = new ShaderPass( DotScreenShader );
  // effect1.uniforms[ 'scale' ].value = 4;
  // composer.addPass( effect1 );

  // const effect2 = new ShaderPass( RGBShiftShader );
  // effect2.uniforms[ 'amount' ].value = 0.0015;
  // composer.addPass( effect2 );

  const effect3 = new OutputPass();
  composer.addPass(effect3);
}

const animation = () => {
  object.rotation.x += 0.005;
  object.rotation.y += 0.01;

  blueNoiseSharedUniforms.u_blueNoiseCoordOffset.value.set(Math.random(), Math.random())


  if (composer) {
    composer.render()
  } else {
    renderer.render(scene, camera)
  }
}

nextTick(() => {
  init()
  objectInit()
  blueNoise()
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