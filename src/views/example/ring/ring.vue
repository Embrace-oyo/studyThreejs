<!--
justThreeJs ring.vue
@author kongjianqiu
@description
@created 2024/7/24 09:56:51
-->
<template>
  <div class="ring" id="ring"></div>
</template>

<script setup>
import Main from "@/views/example/ring/js/main";
import {nextTick, onMounted, onUnmounted} from "vue";

let ring;
onMounted(() => {
  nextTick(() => {
    const dom = document.querySelector('#ring')
    ring = new Main({target: dom});
  })
})
onUnmounted(() => {
  console.log('销毁-扩散光环特效')
  ring.destroy()
})
</script>

<style scoped lang="less">
.ring {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}
</style>
