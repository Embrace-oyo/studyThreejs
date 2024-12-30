<!--
justThreeJs music.vue
@author kongjianqiu
@description
@created 2024/12/30 10:26:14
-->
<template>
  <div class="musicBox">
    <div class="info">
      <span class="button" v-if="!proxy.isPlay" @click="play">play</span>
      <span class="button" v-else>pause</span>
    </div>
    <div class="music"></div>
  </div>
</template>

<script setup>
import {nextTick, onMounted, onUnmounted, reactive,ref} from "vue";
import Main from "@/views/example/music/js/main.js";


const proxy = reactive({
  music: null,
  isPlay: false
})

const play = () => {
  proxy.music.start()
  proxy.isPlay = true;
  console.log(proxy.isPlay)
}

onMounted(() => {
  nextTick(() => {
    const dom = document.querySelector('.music')
    proxy.music = new Main({target: dom});
  })
})
onUnmounted(() => {
  music.value.destroy()
})
</script>

<style scoped lang="less">
.musicBox{
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  .info{
    z-index: 99;
    position: absolute;
    left: 0;
    top: 5%;
    .button{
      margin-left: 20px;
      padding: 6px 20px;
      border-radius: 8px;
      border: 1px solid #ccc;
      cursor: pointer;
    }
  }
  .music{
    position: relative;
    z-index: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
