<!--
justThreeJs layout.vue
@author kongjianqiu
@description
@created 2025/1/23 09:20:52
-->
<template>
  <div class="layout">
    <div class="top">
      <div class="left button" @click="back">返回</div>
      <div class="center">{{ proxy.name }}</div>
      <div class="right">
        <div class="raw button">内存: {{ proxy.raw }}</div>
        <div class="fps button">FPS: {{ proxy.fps }}</div>
        <div class="print button" @click="print">截图</div>
        <div class="screen button" @click="screen">全屏</div>
      </div>
    </div>
    <div class="container">
      <RouterView/>
    </div>
  </div>
</template>

<script setup>
import {useRouter, useRoute} from "vue-router";
import {onMounted, reactive} from "vue";

const router = useRouter()
const route = useRoute()
const proxy = reactive({
  name: '',
  raw: '',
  fps: '',
  last: Date.now(),
  ticks: 0
})
const back = () => {
  router.push({
    path: '/index'
  })
}
const raw = () => {
  requestAnimationFrame(() => raw())
  proxy.raw = Math.floor(window.performance.memory.totalJSHeapSize / 1024 / 1024) + 'MB'
  proxy.ticks += 1;
  //每30帧统计一次帧率
  if (proxy.ticks >= 30) {
    const now = Date.now();
    const diff = now - proxy.last
    const fps = Math.round(1000 / (diff / proxy.ticks));
    proxy.last = now
    proxy.ticks = 0
    proxy.fps = fps
  }
}
const print = () => {
  const canvas = document.querySelector('canvas');
  const base64 = canvas.toDataURL("image/png");
  const byteCharacters = atob(
      base64.replace(/^data:image\/(png|jpeg|jpg);base64,/, "")
  );
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], {
    type: undefined,
  });
  const aLink = document.createElement("a");
  aLink.download = `${proxy.name}.png`; //这里写保存时的图片名称
  aLink.href = URL.createObjectURL(blob);
  aLink.click();
}
const screen = () => {
  if (document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled || document.msFullscreenEnabled) {
    console.log('浏览器支持全屏功能');
    const element = document.querySelector('.container')
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) { // Firefox
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) { // Chrome, Safari and Opera
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) { // Internet Explorer and Edge
      element.msRequestFullscreen();
    }
  } else {
    console.log('浏览器不支持全屏功能');
  }
}

onMounted(() => {
  proxy.name = route.name
  raw()
})
</script>

<style scoped lang="less">
.layout {
  width: 100%;
  height: 100%;
  padding: 20px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  background: rgb(9, 9, 11);

  .top {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;

    .left {

    }

    .center {
      font-size: 24px;
      font-weight: bold;
      color: #ffffff;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }

    .right {
      display: flex;
      align-items: center;
      justify-content: flex-end;

      .fps, .print, .screen {
        margin-left: 20px;
      }
    }
  }

  .button {
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    font-size: 16px;
    color: #fff;
    padding: 10px 26px;
    font-weight: bold;
    cursor: pointer;
  }

  .container {
    width: 100%;
    height: 100%;
    margin-top: 20px;
    border-radius: 16px;
    position: relative;
    overflow: hidden;
    border: 1px solid #858585;
  }
}
</style>
