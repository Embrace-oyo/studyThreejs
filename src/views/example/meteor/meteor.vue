<!--
justThreeJs meteor.vue
@author kongjianqiu
@description
@created 2025/1/23 14:55:46
-->
<template>
  <div class="meteor"></div>
</template>

<script setup>
import {nextTick, onMounted, onUnmounted} from "vue";
import Meteor from "@/views/example/meteor/js/main.js";

let meteor;
onMounted(() => {
  nextTick(() => {
    meteor = new Meteor({
      target: document.querySelector('.meteor')
    })
  })
})
onUnmounted(() => {
  console.log('销毁-陨石')
  meteor.destroy()
})
</script>

<style scoped lang="less">
.meteor {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  //background: #000;
}
</style>
