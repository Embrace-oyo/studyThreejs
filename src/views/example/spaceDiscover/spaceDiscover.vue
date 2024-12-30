<!--
justThreeJs spaceDiscover.vue
@author kongjianqiu
@description
@created 2024/12/24 16:26:39
-->
<template>
  <div class="spaceDiscover">
    <div class="info">方向键控制前后左右</div>
    <div class="canvas" id="canvas"></div>
  </div>
</template>

<script setup>
import Main from "@/views/example/spaceDiscover/js/main.js";
import {nextTick, onMounted, onUnmounted} from "vue";

let spaceDiscover;
onMounted(() => {
  nextTick(() => {
    const dom = document.querySelector('.canvas')
    spaceDiscover = new Main({target: dom});
  })
})
onUnmounted(() => {
  spaceDiscover.destroy()
})
</script>

<style scoped>
.spaceDiscover {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  .info{
    position: absolute;
    left: 50%;
    top: 5%;
    z-index: 999;
    color: #ccc;
  }
  .canvas{
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
  }
}
</style>
