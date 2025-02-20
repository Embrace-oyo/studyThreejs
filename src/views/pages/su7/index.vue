<!--
nft demo2.vue
@author kongjianqiu
@description
@created 2023/10/17 15:56:40
-->
<template>
  <div class="su7">
    <div class="loading" :class="{loadOk: isLoad}">
      <div class="load">
        <span v-for="(item, index) of 'LOADING...'" :key="index" :style="'--i:'+index">{{ item }}</span>
      </div>
    </div>
    <div class="canvas"></div>
  </div>
</template>

<script setup>
import Su7 from '@/views/pages/su7/js/su7'
import {onMounted, onUnmounted, ref} from "vue";

const isLoad = ref(false)
const number = ref(0)
let model = null
const progressCallback = (any) => {
  isLoad.value = true
  // const progress = Math.floor((xhr.loaded / xhr.total) * 100)
  // if (progress >= 100) isLoad.value = true
  // number.value = progress
}
onMounted(() => {

  model = new Su7({
    parent: document.querySelector('.su7'),
    target: document.querySelector('.canvas'),
    callback: progressCallback,
  })

})

onUnmounted(() => {
  model.destroy()
  model = null
  console.log('su7-销毁')
})
</script>

<style lang="less" scoped>
.su7 {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;

  .loading {
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

  .canvas {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 99;
  }
}
</style>
