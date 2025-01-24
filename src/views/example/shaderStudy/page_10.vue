<!--
justThreeJs page_10.vue
@author kongjianqiu
@description
@created 2024/5/31 09:38:31
-->
<template>
  <div class="box">
    <div class="page_10" id="page_10"></div>
  </div>
</template>

<script setup>
import Index from '@/views/shaderStudy/glsl/page10/js/index'
import {nextTick, onMounted, ref} from "vue";

let init = null

onMounted(() => {
  nextTick(() => {
    const left = document.querySelector('.left');
    init = new Index('page_10', {
      offset: left.offsetWidth
    });
  })
})
</script>

<style scoped lang="less">
.box {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  overflow: hidden;
  background: black;

  .page_10 {
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 10;
  }

  .btnBox {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    overflow: hidden;
    z-index: 20;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;

    .btn {
      background: transparent;
      border: 1px solid rgb(255, 255, 255);
      border-radius: 4px;
      color: #ffffff;
      padding: 12px 18px;
      text-transform: uppercase;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
