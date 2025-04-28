<!--
justThreeJs index.vue
@author kongjianqiu
@description
@created 2025/4/23 09:05:18
-->
<template>
  <div class="lusion">
    <div id="ui">
      <div id="page-container">
        <div id="page-container-inner">
          <div id="about" class="page">
            <div id="about-who" class="section">
              <div id="about-who-subsection-container">
                <div id="about-crosses">
                  <div class="about-cross"></div>
                  <div class="about-cross"></div>
                  <div class="about-cross"></div>
                  <div class="about-cross"></div>
                  <div class="about-cross"></div>
                </div>
                <div id="about-who-subsection-we-are" class="about-who-subsection">
                  <div id="about-who-title-main"></div>
                  <div id="about-who-title-left"></div>
                  <div id="about-who-title-right"></div>
                </div>
              </div>
            </div>
            <div id="about-clients" class="section"></div>
            <div id="about-award" class="section"></div>
            <div id="about-capability" class="section"></div>
          </div>
        </div>
      </div>
    </div>
    <div id="scroll-indicator">
      <div id="scroll-indicator-bar"></div>
    </div>
    <div id="preloader">
      <div id="preloader-percent-digits">
        <div class="preloader-percent-digit">
          <div class="preloader-percent-digit-num"></div>
          <div class="preloader-percent-digit-num"></div>
        </div>
        <div class="preloader-percent-digit">
          <div class="preloader-percent-digit-num"></div>
          <div class="preloader-percent-digit-num"></div>
        </div>
        <div class="preloader-percent-digit">
          <div class="preloader-percent-digit-num"></div>
          <div class="preloader-percent-digit-num"></div>
        </div>
      </div>
    </div>
    <canvas id="transition-overlay"></canvas>
    <canvas id="canvas"></canvas>
  </div>
</template>

<script setup>
import {onMounted, onUnmounted, ref} from "vue";
import Main from "@/views/pages/lusion/js/index";

const isLoad = ref(false)
const number = ref(0)
let world = null
const progressCallback = () => {
  isLoad.value = true
}
onMounted(() => {

  world = new Main({
    parent: document.querySelector('.lusion'),
    target: document.querySelector('.lusion'),
    callback: progressCallback,
  })

})

onUnmounted(() => {
  world.destroy()
  world = null
  console.info("%cHero-销毁😁", "color:#fff;background-color:red");
})
</script>
<style scoped lang="less">
.lusion {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
</style>
<style>
@import "./assets/css/about.css";
</style>

