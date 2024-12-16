<!--
justThreeJs webGLFog.vue
@author kongjianqiu
@description
@created 2024/12/13 17:17:22
-->
<template>
  <div class="webGLFog" id="webGLFog">
  </div>
</template>

<script setup>
import Main from "@/views/example/common/webGLFog/js/main";
import {nextTick, onMounted, onUnmounted} from "vue";

let webGLFog;
onMounted(() => {
  nextTick(() => {
    const dom = document.querySelector('#webGLFog')
    webGLFog = new Main({target: dom});
  })
})
onUnmounted(() => {
  webGLFog.destroy()
})
</script>

<style scoped>
.webGLFog {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}
</style>
