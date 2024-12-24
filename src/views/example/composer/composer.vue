<template>
  <div class="canvasBox" id="canvasBox">
    <canvas id="canvas"></canvas>
  </div>
</template>

<script setup>
import {nextTick, onMounted} from "vue";
import Main from "@/views/example/composer/js/main.js";

let main;
onMounted(() => {
  nextTick(() => {
    main = new Main({
      DOM: document.querySelector('#canvasBox'),
      canvas: document.querySelector('#canvas')
    })
  })
})
</script>

<style scoped lang="less">
.canvasBox {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;

  #canvas {
    width: 100%;
    height: 100%;
  }
}
</style>
