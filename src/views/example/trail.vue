<!--
justThreeJs trail.vue
@author kongjianqiu
@description
@created 2024/7/2 11:03:37
-->
<template>
  <div class="trail" id="trail">
    <canvas id="canvas"></canvas>
  </div>
</template>

<script setup>
import Trail from "@/views/example/common/trail/js/trail";
import {nextTick, onMounted, onUnmounted} from "vue";

let trail = null
onMounted(() => {
  nextTick(() => {
    trail = new Trail('trail')
  })
})

onUnmounted(() => {
  // trail.destroy()
  // trail = null
})
</script>

<style scoped lang="less">
.trail {
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
