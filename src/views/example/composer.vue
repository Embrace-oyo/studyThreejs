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
import {SMAAPass} from 'three/addons/postprocessing/SMAAPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';

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

const createRenderTarget = (e, t, r = !1, n = !1, o = 0) => {
  return new THREE.WebGLRenderTarget(e, t, {
    wrapS: THREE.ClampToEdgeWrapping,
    wrapT: THREE.ClampToEdgeWrapping,
    magFilter: r ? THREE.NearestFilter : THREE.LinearFilter,
    minFilter: r ? THREE.NearestFilter : THREE.LinearFilter,
    type: typeof n == "boolean" ? n ? this.floatType : THREE.UnsignedByteType : n,
    anisotropy: 0,
    encoding: THREE.LinearEncoding,
    depthBuffer: !1,
    stencilBuffer: !1,
    samples: o
  })
}

const screenPaintInit = () => {
  const screenPaintObject = {
    screenPaint: {
      _lowRenderTarget: null,
      _lowBlurRenderTarget: null,
      _prevPaintRenderTarget: null,
      _currPaintRenderTarget: null,
      _material: null,
      _material2: null,
      _distortionMaterial: null,
      _fromDrawData: null,
      _toDrawData: null,
      drawEnabled: !0,
      needsMouseDown: !1,
      enabled: !0,
      minRadius: 0,
      maxRadius: 100,
      radiusDistanceRange: 100,
      pushStrength: 25,
      accelerationDissipation: .8,
      velocityDissipation: .985,
      weight1Dissipation: .985,
      weight2Dissipation: .5,
      useNoise: !1,
      curlScale: .1,
      curlStrength: 5,
      _prevUseNoise: null,
      sharedUniforms: {
        u_paintTexelSize: {value: new THREE.Vector2},
        u_paintTextureSize: {value: new THREE.Vector2},
        u_prevPaintTexture: {value: null},
        u_currPaintTexture: {value: null},
        u_lowPaintTexture: {value: null}
      }
    },
    amount: 20,
    rgbShift: 1,
    multiplier: 1.25,
    colorMultiplier: 1,
    shade: 1.25,
    renderOrder: 75
  }
  let r = width >> 2
  let n = height >> 2
  let o = width >> 3
  let l = height >> 3;
  screenPaintObject.screenPaint._lowRenderTarget = createRenderTarget(1, 1)
  screenPaintObject.screenPaint._lowBlurRenderTarget = createRenderTarget(1, 1)
  screenPaintObject.screenPaint._prevPaintRenderTarget = createRenderTarget(1, 1)
  screenPaintObject.screenPaint._currPaintRenderTarget = createRenderTarget(1, 1)
  screenPaintObject.screenPaint.sharedUniforms.u_lowPaintTexture.value = screenPaintObject.screenPaint._lowRenderTarget.texture


  const _materialParams = Object.assign({
    depthTest: !1,
    depthWrite: !1,
    blending: THREE.NoBlending,
    vertexShader: blitVert,
    fragmentShader: blitFrag,
    derivatives: !1
  }, {
    uniforms: {
      u_lowPaintTexture: {value: screenPaintObject.screenPaint._lowRenderTarget.texture},
      u_prevPaintTexture: screenPaintObject.screenPaint.sharedUniforms.u_prevPaintTexture,
      u_paintTexelSize: screenPaintObject.screenPaint.sharedUniforms.u_paintTexelSize,
      u_drawFrom: {value: screenPaintObject.screenPaint._fromDrawData = new THREE.Vector4(0, 0, 0, 0)},
      u_drawTo: {value: screenPaintObject.screenPaint._toDrawData = new THREE.Vector4(0, 0, 0, 0)},
      u_pushStrength: {value: 0},
      u_curlScale: {value: 0},
      u_curlStrength: {value: 0},
      u_vel: {value: new THREE.Vector2},
      u_dissipations: {value: new THREE.Vector3},
      u_scrollOffset: {value: new THREE.Vector2}
    },
    fragmentShader: screenPaintShader,
  })
  _materialParams.vertexShader = vertShader
  _materialParams.fragmentShader = fragShader
  delete _materialParams.vertexShaderPrefix
  delete _materialParams.fragmentShaderPrefix
  delete _materialParams.derivatives;

  screenPaintObject.screenPaint._material = new THREE.RawShaderMaterial(_materialParams)

  if (r !== screenPaintObject.screenPaint._currPaintRenderTarget.width || n !== screenPaintObject.screenPaint._currPaintRenderTarget.height) {
    screenPaintObject.screenPaint._currPaintRenderTarget.setSize(r, n)
    screenPaintObject.screenPaint._prevPaintRenderTarget.setSize(r, n)
    screenPaintObject.screenPaint._lowRenderTarget.setSize(o, l)
    screenPaintObject.screenPaint._lowBlurRenderTarget.setSize(o, l)
    screenPaintObject.screenPaint.sharedUniforms.u_paintTexelSize.value.set(1 / r, 1 / n)
    screenPaintObject.screenPaint.sharedUniforms.u_paintTextureSize.value.set(r, n)
    screenPaintObject.screenPaint._material.uniforms.u_vel.value.set(0, 0)
  }

  const materialParams = Object.assign({
    depthTest: !1,
    depthWrite: !1,
    blending: THREE.NoBlending,
    vertexShader: blitVert,
    fragmentShader: blitFrag,
    derivatives: !1
  }, {
    uniforms: Object.assign({
      u_texture: {value: null},
      u_screenPaintTexture: screenPaintObject.screenPaint.sharedUniforms.u_currPaintTexture,
      u_screenPaintTexelSize: screenPaintObject.screenPaint.sharedUniforms.u_paintTexelSize,
      u_amount: {value: 0},
      u_rgbShift: {value: 0},
      u_multiplier: {value: 0},
      u_colorMultiplier: {value: 0},
      u_shade: {value: 0}
    }, blueNoiseSharedUniforms),
    fragmentShader: screenPaintDistortionShader
  })

  materialParams.vertexShader = vShader
  materialParams.fragmentShader = fShader
  delete materialParams.vertexShaderPrefix
  delete materialParams.fragmentShaderPrefix
  delete materialParams.derivatives;

  screenPaintObject.material = new THREE.RawShaderMaterial(materialParams)
}

const postprocessing = () => {
  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  const smaaPass = new SMAAPass(window.innerWidth * renderer.getPixelRatio(), window.innerHeight * renderer.getPixelRatio());
  composer.addPass(smaaPass);
  //
  // const effect1 = new ShaderPass(DotScreenShader);
  // effect1.uniforms['scale'].value = 4;
  // composer.addPass(effect1);
  //
  // const effect2 = new ShaderPass(RGBShiftShader);
  // effect2.uniforms['amount'].value = 0.0115;
  // composer.addPass(effect2);
  //
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
  screenPaintInit()
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