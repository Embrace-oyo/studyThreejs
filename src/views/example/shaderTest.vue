<!--
justThreeJs shaderTest.vue
@author kongjianqiu
@description
@created 2024/7/22 14:53:10
-->
<template>
  <div class="shaderTest" id="shaderTest"></div>
</template>

<script setup>
import World from "@/views/example/common/shaderTest/js/world.js";
import {nextTick, onMounted} from "vue";

onMounted(() => {
  nextTick(() => {
    const dom = document.querySelector('#shaderTest')
    const world = new World({DOM: dom});
  })
})
</script>

<style scoped lang="less">
.shaderTest {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}
</style>
