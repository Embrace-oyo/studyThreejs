<!--
justThreeJs test.vue
@author kongjianqiu
@description
@created 2024/6/27 10:34:18
-->
<template>
  <div class="test" id="test">
    <div id="scroll-nav-section"></div>
  </div>
</template>

<script setup>
import {nextTick, onMounted} from "vue";
import * as THREE from 'three';
import {DRACOLoader, GLTFLoader} from "three-stdlib";
import blur9VaryingVertexShader from "@/glsl/blur/blur9VaryingVertexShader.glsl";
import blur9FragmentShader from "@/glsl/blur/blur9FragmentShader.glsl";
import blur9VaryingFragmentShader from "@/glsl/blur/blur9VaryingFragmentShader.glsl";

let dom, renderer, scene, camera, control, clock, axesHelper, geometry, material, mesh, loader, dracoLoader, webTarget,
    QUADCamera, QUADGeometry, QUADMaterial, QUADMesh, texture;
let iMouse = new THREE.Vector2(0, 0)
const init = () => {
  renderer = new THREE.WebGLRenderer({antialias: true, alpha: true})
  renderer.setSize(dom.offsetWidth, dom.offsetHeight)
  renderer.setPixelRatio(window.devicePixelRatio * 2)
  dom.appendChild(renderer.domElement)
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x000000)
  camera = new THREE.PerspectiveCamera(55, dom.offsetWidth / dom.offsetHeight, 0.01, 20000);
  camera.position.copy(new THREE.Vector3(0, 0, 2));
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  clock = new THREE.Clock()
  // 创建一个简单的立方体
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
}

const shader = () => {
  webTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    type: THREE.HalfFloatType,
  })
  QUADCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  QUADGeometry = new THREE.PlaneGeometry(2, 2)
  QUADMaterial = new THREE.ShaderMaterial({
    vertexShader: blur9VaryingVertexShader,
    fragmentShader: blur9FragmentShader,
    uniforms: {
      u_texture: {value: null},
      u_delta: {value: iMouse},
      iTime: {value: 0.0},
    },
    depthWrite: !1,
    depthTest: !1,
    blending: THREE.NoBlending
  });
  QUADMesh = new THREE.Mesh(QUADGeometry, QUADMaterial)
  const loader = new THREE.TextureLoader()
  texture = loader.load('/texture/flip_texture.png')
  QUADMaterial.uniforms.u_texture.value = texture
  // scene.add(QUADMesh);
}

const shaderRender = () => {
  QUADMaterial.uniforms.iTime.value += clock.getDelta();
  renderer.setRenderTarget(webTarget);
  renderer.render(QUADMesh, QUADCamera);
  renderer.setRenderTarget(null);
}

const animation = () => {
  requestAnimationFrame(animation)
  shaderRender()
  camera.updateProjectionMatrix()
  renderer.render(scene, camera)
}


onMounted(() => {
  nextTick(() => {
    const left = document.querySelector('.left');
    dom = document.querySelector('#test')
    init()
    shader()
    animation()

    const handleMove = (event) => {
      iMouse.x = (event.pageX - left.offsetWidth) / dom.offsetWidth;
      iMouse.y = (dom.offsetHeight - event.pageY) / dom.offsetHeight;
      QUADMaterial.uniforms.u_delta.value = iMouse;
    };
    dom.addEventListener('mousedown', (e) => {
      QUADMaterial.uniforms.u_delta.value = iMouse;
      dom.addEventListener("mousemove", handleMove);
      dom.addEventListener("mouseup", () => {
        dom.removeEventListener("mousemove", handleMove);
        QUADMaterial.uniforms.u_delta.value = iMouse;
      });
    })
  })
})
</script>

<style scoped lang="less">
.test {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  overflow: hidden;
}
</style>
