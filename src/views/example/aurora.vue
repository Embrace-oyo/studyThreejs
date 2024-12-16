<!--
justThreeJs aurora.vue
@author kongjianqiu
@description
@created 2024/12/12 10:25:34
-->
<template>
  <div class="aurora" id="aurora">
  </div>
</template>

<script setup>
import Main from "@/views/example/common/aurora/js/main";
import {nextTick, onMounted, onUnmounted} from "vue";

let neon;
onMounted(() => {
  nextTick(() => {
    const dom = document.querySelector('#aurora')
    neon = new Main({target: dom});
  })
})
onUnmounted(() => {
  neon.destroy()
})
</script>

<style scoped>
.aurora {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}
</style>
