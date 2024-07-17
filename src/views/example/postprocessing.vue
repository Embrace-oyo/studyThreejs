<!--
justThreeJs post.vue
@author kongjianqiu
@description
@created 2024/7/16 14:22:49
-->
<template>
  <div class="post" id="post">
    <canvas id="canvas"></canvas>
  </div>
</template>

<script setup>
import World from '@/views/example/common/postprocessing/js/world.js';
import {nextTick, onMounted} from "vue";

let postProcessing;

onMounted(() => {
  nextTick(() => {
    postProcessing = new World({
      parent: document.querySelector('#post'),
      canvas: document.querySelector('#canvas')
    })
  })
})
</script>

<style scoped lang="less">
.post {
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
