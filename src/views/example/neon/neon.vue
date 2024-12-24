<!--
justThreeJs neon.vue
@author kongjianqiu
@description
@created 2024/12/6 10:52:38
-->
<template>
  <div class="neon" id="neon">
  </div>
</template>

<script setup>
import Main from "@/views/example/neon/js/main";
import {nextTick, onMounted, onUnmounted} from "vue";

let neon;
onMounted(() => {
  nextTick(() => {
    const parent = document.querySelector('#neon')
    const dom = document.querySelector('#neon')
    neon = new Main({parent, target: dom});
  })
})
onUnmounted(() => {
  neon.destroy()
})
</script>

<style scoped>
.neon {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}

.canvas {
  width: 100%;
  height: 100%;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}
</style>
