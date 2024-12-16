<!--
justThreeJs abeto.vue
@author kongjianqiu
@description
@created 2024/11/28 14:54:10
-->
<template>
  <div class="abeto" id="abeto"></div>
</template>

<script setup>
import Main from "@/views/example/common/abeto/js/main";
import {nextTick, onMounted, onUnmounted} from "vue";

let abeto;
onMounted(() => {
  nextTick(() => {
    const dom = document.querySelector('#abeto')
    abeto = new Main({target: dom});
  })
})
onUnmounted(() => {
  abeto.destroy()
})
</script>

<style scoped>
.abeto {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}
</style>
