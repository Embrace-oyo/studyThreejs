<!--
justThreeJs page_8.vue
@author kongjianqiu
@description
@created 2024/5/29 17:01:31
-->
<template>
  <div class="box">
    <div class="page_8" id="page_8"></div>
    <div class="loadingBox" :class="{loadOk: isLoad}">
      <div class="load">
        <span v-for="(item, index) of 'LOADING...'" :key="index" :style="'--i:'+index">{{ item }}</span>
      </div>
    </div>
    <div class="gallery">
      <img class="gallery-item" src="https://s2.loli.net/2023/09/12/ySLGYKhVqH3BtN4.jpg" crossorigin="anonymous" alt="" />
      <img class="gallery-item" src="https://s2.loli.net/2023/09/12/BhmSdM2XA9yYftK.jpg" crossorigin="anonymous" alt="" />
      <img class="gallery-item" src="https://s2.loli.net/2023/09/12/CqIlJd1XO9rh68e.jpg" crossorigin="anonymous" alt="" />
      <img class="gallery-item" src="https://s2.loli.net/2023/09/12/RzwqhImAV9H57xs.jpg" crossorigin="anonymous" alt="" />
      <img class="gallery-item" src="https://s2.loli.net/2023/09/12/p3FME9qcUAnJixm.jpg" crossorigin="anonymous" alt="" />
    </div>
  </div>
</template>

<script setup>
import Gallerys from '@/views/shaderStudy/glsl/page8/gallery/index'

import {nextTick, onMounted, ref} from "vue";

const isLoad = ref(false)
const number = ref(0)

const progressCallback = (xhr) => {
  isLoad.value = true
}
onMounted(() => {
  nextTick(() => {
    const gallery = new Gallerys('page_8', {callbackFn: progressCallback})
    /* const base = new Base('page_8')
     const screenCamera = new ScreenCamera(base);
     screenCamera.addExisting();*/
  })
})

</script>

<style scoped lang="less">
.box {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  overflow: hidden;
  background: black;

  .loadingBox {
    position: absolute;
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

  .page_8 {
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 10;
  }

  .gallery {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
    overflow: hidden;

    .gallery-item {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 50vw;
      height: 60vh;
      opacity: 0;
    }
  }
}
</style>
