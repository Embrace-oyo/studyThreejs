<!--
justThreeJs index.vue
@author kongjianqiu
@description
@created 2025/3/4 09:34:44
-->
<template>
  <div class="skull">
    <div class="loading" :class="{loadOk: isLoad}">
      <div class="load">
        <span v-for="(item, index) of 'LOADING...'" :key="index" :style="'--i:'+index">{{ item }}</span>
      </div>
    </div>
    <div class="canvas"></div>
  </div>
</template>

<script setup>
import {onMounted, onUnmounted, ref} from "vue";
import Skull from "@/views/pages/skull/js/index";

const isLoad = ref(false)
const number = ref(0)
let world = null
const progressCallback = () => {
  isLoad.value = true
}
onMounted(() => {

  world = new Skull({
    parent: document.querySelector('.skull'),
    target: document.querySelector('.canvas'),
    callback: progressCallback,
  })

})

onUnmounted(() => {
  world.destroy()
  world = null
  console.info("%c头骨-销毁😁", "color:#fff;background-color:red");
})
</script>

<style scoped lang="less">
.skull {
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
<style>
.tp-rotv{
  position: absolute;
  right: 0;
  width: 300px;
  z-index: 999;
}
</style>

