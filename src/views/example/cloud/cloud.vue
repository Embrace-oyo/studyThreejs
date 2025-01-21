<!--
justThreeJs cloud.vue
@author kongjianqiu
@description
@created 2025/1/15 15:02:10
-->
<template>
  <div class="cloudBox">
    <div class="info">
      <span class="button" v-if="!proxy.isPlay" @click="toggle(true)">play</span>
      <span class="button" v-else @click="toggle(false)">pause</span>
    </div>
    <div class="cloud"></div>
  </div>
</template>

<script setup>
import {nextTick, onMounted, onUnmounted, reactive} from "vue";
import Main from "@/views/example/cloud/js/main.js";

const proxy = reactive({
  music: null,
  isPlay: false
})
let main;
const toggle = (flag) => {
  flag ? main.start() : main.pause()
  proxy.isPlay = flag;
  console.log(proxy.isPlay)
}
onMounted(() => {
  nextTick(() => {
    main = new Main({
      target: document.querySelector('.cloud')
    })
  })
})
onUnmounted(() => {
  console.log('销毁')
  main.destroy()
})
</script>

<style scoped lang="less">
.cloudBox {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: #000;

  .info {
    z-index: 99;
    position: absolute;
    left: 0;
    top: 5%;

    .button {
      color: #fff;
      margin-left: 20px;
      padding: 6px 20px;
      border-radius: 8px;
      border: 1px solid #ccc;
      cursor: pointer;
    }
  }

  .cloud {
    position: relative;
    z-index: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
