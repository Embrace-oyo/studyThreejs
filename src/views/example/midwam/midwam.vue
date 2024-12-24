<!--
justThreeJs minwam.vue
@author kongjianqiu
@description
@created 2024/8/22 11:39:23
-->
<template>
  <div class="midwam" id="midwam"></div>
</template>

<script setup>
import Main from "@/views/example/midwam/js/main";
import {nextTick, onMounted, onUnmounted} from "vue";

let midwam;
onMounted(() => {
  nextTick(() => {
    const dom = document.querySelector('#midwam')
    midwam = new Main({target: dom});
  })
})
</script>

<style scoped lang="less">
.midwam {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}
</style>

