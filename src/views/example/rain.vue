<!--
justThreeJs rain.vue
@author kongjianqiu
@description
@created 2024/5/27 16:36:26
-->
<template>
  <div class="rain" id="rain"></div>
</template>

<script setup>
import {nextTick, onMounted} from "vue";
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import vShader from "@/glsl/rain/vShader.glsl";
import fShader from "@/glsl/rain/fShader.glsl";

let dom, renderer, scene, camera, control, clock, axesHelper, geometry, material, mesh;
const iMouse = new THREE.Vector4();
const base = () => {
  renderer = new THREE.WebGLRenderer({antialias: true, alpha: true, physicallyCorrectLights: true})
  renderer.setSize(dom.offsetWidth, dom.offsetHeight)
  renderer.setPixelRatio(window.devicePixelRatio * 2)
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xb7b7b7)
  camera = new THREE.PerspectiveCamera(55, dom.offsetWidth / dom.offsetHeight, 0.01, 20000);
  camera.position.copy(new THREE.Vector3(0, 0, 2));
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  clock = new THREE.Clock()
  axesHelper = new THREE.AxesHelper(5)
  scene.add(axesHelper)
  dom.appendChild(renderer.domElement)
}

const init = () => {
  const textureLoad = new THREE.TextureLoader()
  const t1 = textureLoad.load('./texture/63quVIA9xZLksDc.jpg')
  t1.wrapS = THREE.RepeatWrapping;
  t1.wrapT = THREE.RepeatWrapping;
  geometry = new THREE.PlaneGeometry(2, 1);
  material = new THREE.ShaderMaterial({
    name: 'rainShader',
    vertexShader: vShader,
    fragmentShader: fShader,
    uniforms: {
      iResolution: {value: new THREE.Vector2()},
      iMouse: {value: iMouse},
      iTime: {value: 0.0},
      iGlobalTime: {value: 0.0},
      iChannel0: {value: t1},
    }
  })
  material.uniforms.iResolution.value.x = 2;
  material.uniforms.iResolution.value.y = 1;
  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh)
}

const animation = () => {
  material.uniforms.iTime.value += clock.getDelta();
  material.uniforms.iGlobalTime.value += clock.getDelta();
  camera.updateProjectionMatrix()
  renderer.render(scene, camera)
  requestAnimationFrame(animation)
}


onMounted(() => {
  nextTick(() => {
    const left = document.querySelector('.left');
    dom = document.getElementById('rain')
    base()
    init()
    animation()
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
    window.onresize = () => {
      camera.aspect = dom.offsetWidth / dom.offsetHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(dom.offsetWidth, dom.offsetHeight);
    }
  })
})

</script>

<style scoped lang="less">
.rain {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  overflow: hidden;
}
</style>
