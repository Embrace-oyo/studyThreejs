<!--
justThreeJs fantasy.vue
@author kongjianqiu
@description
@created 2024/2/2 16:44:41
-->
<template>
  <div class="fantasy" id="fantasy"></div>
</template>

<script setup lang="ts">
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {Water} from '@/util/water.js'
import {Sky} from '@/util/sky.js'
import {nextTick} from "vue";

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.5;

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 20000);
camera.position.set(30, 30, 100);

const control = new OrbitControls(camera, renderer.domElement)

const axesHelper = new THREE.AxesHelper(10)

scene.add(axesHelper)

const waterGeometry = new THREE.PlaneGeometry(10000, 10000);
const water = new Water(
    waterGeometry,
    {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: new THREE.TextureLoader().load(new URL('@/assets/texture/waternormals.jpg', import.meta.url).href, function (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      }),
      sunDirection: new THREE.Vector3(),
      sunColor: 0xffffff,
      waterColor: 0x001e0f,
      distortionScale: 3.7,
      fog: scene.fog !== undefined
    }
);
water.rotation.x = -Math.PI / 2;
scene.add(water);

const sky = new Sky();
sky.scale.setScalar(10000);
scene.add(sky);
const skyUniforms = sky.material.uniforms;
skyUniforms['turbidity'].value = 10;
skyUniforms['rayleigh'].value = 2;
skyUniforms['mieCoefficient'].value = 0.005;
skyUniforms['mieDirectionalG'].value = 0.8;
const sun = new THREE.Vector3();
const parameters = {
  elevation: 2,
  azimuth: 180
};
const pmremGenerator: any = new THREE.PMREMGenerator(renderer);
const sceneEnv: any = new THREE.Scene();

let renderTarget: any;

function updateSun() {

  const phi = THREE.MathUtils.degToRad(90 - parameters.elevation);
  const theta = THREE.MathUtils.degToRad(parameters.azimuth);

  sun.setFromSphericalCoords( 1, phi, theta );

  sky.material.uniforms[ 'sunPosition' ].value.copy( sun );
  water.material.uniforms[ 'sunDirection' ].value.copy( sun ).normalize();

  if (renderTarget !== undefined) renderTarget.dispose();

  sceneEnv.add(sky);
  renderTarget = pmremGenerator.fromScene(sceneEnv);
  scene.add(sky);

  scene.environment = renderTarget.texture;

}

updateSun();


const animation = () => {
  requestAnimationFrame(animation)
  camera.updateProjectionMatrix()
  control.update()
  const time = performance.now() * 0.001;
  water.material.uniforms['time'].value += 1.0 / 60.0;
  renderer.render(scene, camera)
}
window.addEventListener('resize', function () {
  const newWidth = window.innerWidth;
  const newHeight = window.innerHeight;
  camera.aspect = newWidth / newHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(newWidth, newHeight);
});
nextTick(async () => {
  const dom: any = document.getElementById('fantasy');
  dom.appendChild(renderer.domElement)
  animation()
})
</script>

<style scoped lang="less">
.fantasy {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  overflow: hidden;
}
</style>
