<!--
justThreeJs page_11.vue
@author kongjianqiu
@description
@created 2024/6/6 15:58:54
-->
<template>
  <div class="box">
    <div class="page_11" id="page_11"></div>
  </div>
</template>

<script setup>
import {nextTick, onMounted, ref} from "vue";
import Sun from "@/views/shaderStudy/glsl/page11/js/sun.js";

onMounted(() => {
  nextTick(() => {
    const left = document.querySelector('.left');
    const init = new Sun('page_11', {
      offset: left.offsetWidth
    });
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

  .page_11 {
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 10;
  }

}
</style>
