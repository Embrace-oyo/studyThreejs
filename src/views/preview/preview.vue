<!--
justThreeJs index.vue
@author kongjianqiu
@description
@created 2025/1/21 14:54:14
-->
<template>
  <div class="preview">
    <div class="background">
      <canvas class="canvas"></canvas>
    </div>
    <div class="container"></div>
  </div>
</template>

<script setup>
import Background from "@/views/preview/js/background.js";
import {nextTick, onMounted, onUnmounted, reactive} from "vue";

const proxy = reactive({
  background: null,
})
onMounted(() => {
  nextTick(() => {
    proxy.background = new Background({
      target: document.querySelector('.canvas')
    })
  })
})
onUnmounted(() => {
  console.log('preview-销毁')
})

</script>

<style scoped lang="less">
.preview {
  position: relative;
  width: 100%;
  height: 100%;

  .background {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    background-color: #000;
    overflow: hidden;

    .canvas {
      width: 100%;
      height: 100%;
    }
  }

  .container {
    position: relative;
    z-index: 5;
  }
}
</style>
