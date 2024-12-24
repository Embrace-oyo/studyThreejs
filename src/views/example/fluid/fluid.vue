<!--
justThreeJs shaderTest.vue
@author kongjianqiu
@description
@created 2024/7/22 14:53:10
-->
<template>
  <div class="fluid" id="fluid"></div>
</template>

<script setup>
import Main from "@/views/example/fluid/js/main";
import {nextTick, onMounted, onUnmounted} from "vue";

let fluid;
onMounted(() => {
  nextTick(() => {
    const dom = document.querySelector('#fluid')
    fluid = new Main({DOM: dom});
  })
})
onUnmounted(() => {
  console.log('销毁')
  fluid.destroy()
})
</script>

<style scoped lang="less">
.fluid {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}
</style>
