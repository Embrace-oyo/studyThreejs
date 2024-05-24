<!--
justThreeJs text.vue
@author kongjianqiu
@description
@created 2024/1/31 17:43:33
-->
<template>
  <div class="text" id="text"></div>
</template>

<script setup lang="ts">
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader.js';
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry.js';
import {MeshSurfaceSampler} from 'three/examples/jsm/math/MeshSurfaceSampler.js';
import {nextTick} from "vue";

const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(0x000000, 1.0)
renderer.shadowMap.enabled = true;
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.lookAt(0, 0, 0)
camera.position.set(0, 1, 10)
const control = new OrbitControls(camera, renderer.domElement)
const clock = new THREE.Clock()
const axesHelper = new THREE.AxesHelper(10)
scene.add(axesHelper)
const light = new THREE.HemisphereLight(0xffffff, 0xeeeeee, 1);
light.position.set(0, 5, 0);
scene.add(light);
const getTime = () => {
  let date = new Date()
  let year = date.getFullYear()
  let month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
  let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  let hh = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
  let mm = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
  let ss = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  return `${year}-${month}-${day}
  ${hh}:${mm}:${ss}`
}
let textGeometry: any = null;
let textMaterial: any = null;
let textMesh: any = null;
let response: any = null;
let geometry: any = null;
let points: any = null;
let vertices: any = []
let count = 10000;
const fontLoad = new FontLoader();
const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load(new URL('@/assets/texture/star3.png', import.meta.url).href);
// 加载字体
const loaded = () => new Promise(resolve => fontLoad.load(new URL('@/assets/font/font1.json', import.meta.url).href, (res: any) => resolve(res)))
// 创建3D文字
const createFonts = (text: string = 'Embrace') => {
  // 创建文本缓冲几何体
  textGeometry = new TextGeometry(text, {
    // 字体类型
    font: response,
    // 字体大小
    size: 3,
    // 字体的厚度
    height: 0.3,
    // 文本曲线上的点的数量，越高字体曲线越平滑
    curveSegments: 2,
    // 是否开启斜角(棱角平滑过渡)
    bevelEnabled: true,
    // 文本上斜角的深度
    bevelThickness: 0.1,
    // 斜角与原始文本轮廓之间的延伸距离(斜角尺寸)
    bevelSize: 0.1,
    // 斜角分段数
    bevelSegments: 1,
  })
  // 使用材质数组
  textMaterial = [
    // 第一项修饰文字正面背面
    new THREE.MeshPhongMaterial({color: 0x00ff00, flatShading: true}), // front
    // 第二项修饰文字侧面(顶部底部)
    new THREE.MeshPhongMaterial({color: 0x0000ff, flatShading: true}) // side
    // Phong网格材质可以模拟具有镜面高光的光泽表面（例如涂漆木材）
  ]
  // 创建文字
  textMesh = new THREE.Mesh(textGeometry, textMaterial)
}
// 更新3D文字
const updateFonts = () => {
  // 移除旧的 TextMesh
  textGeometry.dispose()
  // 创建文本缓冲几何体
  const newTextGeometry = new TextGeometry(getTime(), {
    // 字体类型
    font: response,
    // 字体大小
    size: 3,
    // 字体的厚度
    height: 0.3,
    // 文本曲线上的点的数量，越高字体曲线越平滑
    curveSegments: 2,
    // 是否开启斜角(棱角平滑过渡)
    bevelEnabled: true,
    // 文本上斜角的深度
    bevelThickness: 0.1,
    // 斜角与原始文本轮廓之间的延伸距离(斜角尺寸)
    bevelSize: 0.1,
    // 斜角分段数
    bevelSegments: 1,
  })
  textMesh.geometry = newTextGeometry;
}
// 创建点
const createPoints = () => {
  const sampler = new MeshSurfaceSampler(textMesh).build();
  const fixedStartPoint = new THREE.Vector3();
  for (let i = 0; i < count; i++) {
    //三维向量
    const tempPosition = new THREE.Vector3();
    //通过采样器随机位置采样--(x,y,z)
    sampler.sample(tempPosition, fixedStartPoint);
    //每次的随机位置保存在vertices数组
    vertices.push(tempPosition.x, tempPosition.y, tempPosition.z);
  }
  geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
  const pointsMaterial = new THREE.PointsMaterial({
    size: 0.1,
    vertexColors: false,
    map: texture,
    blending: THREE.AdditiveBlending,
    transparent: false,
    depthTest: false
  });
  points = new THREE.Points(geometry, pointsMaterial);
  geometry.computeBoundingBox();
  points.position.x = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x)
  scene.add(points)
}
// 更新点
const updatePoints = () => {
  const newVertices = []
  const sampler = new MeshSurfaceSampler(textMesh).build();
  const fixedStartPoint = new THREE.Vector3();
  for (let i = 0; i < count; i++) {
    //三维向量
    const tempPosition = new THREE.Vector3();
    //通过采样器随机位置采样--(x,y,z)
    sampler.sample(tempPosition, fixedStartPoint);
    //每次的随机位置保存在vertices数组
    newVertices.push(tempPosition.x, tempPosition.y, tempPosition.z);
  }
  points.geometry.setAttribute('position', new THREE.Float32BufferAttribute(newVertices, 3))
  points.geometry.computeBoundingBox();
  points.position.x = -0.5 * (points.geometry.boundingBox.max.x - points.geometry.boundingBox.min.x)
  points.geometry.attributes.position.needsUpdate = true
}
let lastUpdateTime = 0
const animation = () => {
  requestAnimationFrame(animation)
  camera.updateProjectionMatrix()
  control.update()
  updatePoints()
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
  const dom: any = document.getElementById('text');
  dom.appendChild(renderer.domElement)
  response = await loaded()
  createFonts()
  createPoints()
  setInterval(() => {
    updateFonts();
  }, 800)
  animation()
})
</script>

<style scoped lang="less">
.text {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  overflow: hidden;
}
</style>
