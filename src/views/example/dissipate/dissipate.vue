<!--
justThreeJs dissipate.vue
@author kongjianqiu
@description
@created 2025/2/10 11:06:22
-->
<template>
  <div class="dissipate">

  </div>
</template>

<script setup>
import {nextTick, onMounted, onUnmounted} from "vue";
import Dissipate from "@/views/example/dissipate/js/main.js";

let dissipate;
onMounted(() => {
  nextTick(() => {
    dissipate = new Dissipate({
      target: document.querySelector('.dissipate')
    })
  })
})
onUnmounted(() => {
  console.log('销毁-消散特效')
  dissipate.destroy()
})
</script>

<style scoped lang="less">
.dissipate {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}
</style>
