<!--
justThreeJs webGLFog.vue
@author kongjianqiu
@description
@created 2024/12/13 17:17:22
-->
<template>
  <div class="ablate" id="ablate">
  </div>
</template>

<script setup>
import Main from "@/views/example/ablate/js/main";
import {nextTick, onMounted, onUnmounted} from "vue";

let ablate;
onMounted(() => {
  nextTick(() => {
    const dom = document.querySelector('#ablate')
    ablate = new Main({target: dom});
  })
})
onUnmounted(() => {
  ablate.destroy()
})
</script>

<style scoped>
.ablate {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}
</style>
