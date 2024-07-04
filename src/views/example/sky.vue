<!--
justThreeJs sky.vue
@author kongjianqiu
@description
@created 2024/7/1 16:29:09
-->
<template>
  <div class="sky" id="sky"></div>
</template>

<script setup>
import World from "@/views/example/common/sky/js/sky.js";
import {nextTick, onMounted, onUnmounted} from "vue";

let world = null
onMounted(() => {
  nextTick(() => {
    world = new World('sky')
  })
})

onUnmounted(() => {
  world.destroy()
  world = null
  console.log('销毁')
})

</script>

<style scoped lang="less">
.sky {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}
</style>
