<!--
nft demo2.vue
@author kongjianqiu
@description
@created 2023/10/17 15:56:40
-->
<template>
  <div class="demoBox" id="demoBox">
    <div class="loadingBox" :class="{loadOk: isLoad}">
      <div class="load">
        <span v-for="(item, index) of 'LOADING...'" :key="index" :style="'--i:'+index">{{ item }}</span>
      </div>
    </div>
    <div id="demo2" class="demo2"></div>
  </div>
</template>

<script setup>
import ModelClass from '@/util/modelClass'
import {onMounted, ref} from "vue";

const isLoad = ref(false)
const number = ref(0)

const progressCallback = (any) => {
  isLoad.value = true
  // const progress = Math.floor((xhr.loaded / xhr.total) * 100)
  // if (progress >= 100) isLoad.value = true
  // number.value = progress
}
onMounted(() => {

  const model = new ModelClass({
    parent: document.getElementById('demoBox'),
    canvas: document.getElementById('demo2'),
    modelUrl: './model/sm_car.gltf',
    // modelUrl: 'https://mylink.oss-accelerate.aliyuncs.com/meta/nftTest/20240409172309_7862_92048092_s.glb',
    // modelUrl: 'https://threejs.org/examples/models/gltf/RobotExpressive/RobotExpressive.glb',
    // modelUrl: 'https://threejs.org/examples/models/gltf/Xbot.glb',
    // modelUrl: 'https://threejs.org/examples/models/gltf/LittlestTokyo.glb',
    // modelUrl: 'https://threejs.org/examples/models/fbx/Samba%20Dancing.fbx',
    // modelUrl: 'https://threejs.org/examples/models/obj/male02/male02.obj',
    progressCallback,
  })


})
</script>

<style lang="less" scoped>
.demoBox {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;

  .loadingBox {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 999;
    background: #000;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    opacity: 1;
    pointer-events: none;

    .load {
      color: #fff;
      font-size: 36px;
      letter-spacing: 25px;
      font-weight: bold;

      span {
        display: inline-flex;
        text-align: center;
        transform: scale(1.2);
        animation: blurAnimation 1.5s calc(var(--i) / 10 * 3s) alternate infinite
      }

      @keyframes blurAnimation {
        to {
          filter: blur(2px);
          transform: scale(1) translateY(-20px);
          color: gray;
        }
      }
    }

    .number {
      opacity: 0.5;
      margin-top: 50px;
      color: #fff;
      font-size: 24px;
      letter-spacing: 5px;
      font-weight: bold;
    }
  }

  .loadOk {
    opacity: 0;
    pointer-events: none;
  }

  .demo2 {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 99;
  }
}
</style>
