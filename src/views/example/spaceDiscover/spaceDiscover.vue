<!--
justThreeJs spaceDiscover.vue
@author kongjianqiu
@description
@created 2024/12/24 16:26:39
-->
<template>
  <div class="spaceDiscover" id="spaceDiscover"></div>
</template>

<script setup>
import Main from "@/views/example/spaceDiscover/js/main";
import {nextTick, onMounted, onUnmounted} from "vue";

let spaceDiscover;
onMounted(() => {
  nextTick(() => {
    const dom = document.querySelector('#spaceDiscover')
    spaceDiscover = new Main({target: dom});
  })
})
onUnmounted(() => {
  spaceDiscover.destroy()
})
</script>

<style scoped>
.spaceDiscover {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}
</style>
