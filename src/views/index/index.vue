<!--
justThreeJs index.vue
@author kongjianqiu
@description
@created 2025/1/21 14:54:14
-->
<template>
  <div class="preview" id="preview">
    <div class="background" id="background">
      <canvas class="canvas" id="canvas"></canvas>
    </div>
    <div class="container">
      <div class="info">
        <div class="title">Just Threejs</div>
        <div class="time" id="time"></div>
      </div>
      <div class="list">
        <div class="item" v-for="(item, index) of proxy.list" :key="index" @click="go(item)">
          <div class="title">{{ item.name }}</div>
          <div class="previewImg">
            <img :src="getImg(item.meta.img)" alt="">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {nextTick, onMounted, onUnmounted, reactive} from "vue";
import {useRouter} from "vue-router";
import Background from "@/views/index/js/background.js";
import routerList from '@/router/routerList'
import GlitchClock from "@/views/index/js/GlitchClock.js";

const router = useRouter()
const proxy = reactive({
  glitchClock: null,
  background: null,
  list: []
})
const getImg = (path) => {
  return new URL(path, import.meta.url).href
}
const go = (item) => {
  router.push({
    path: `/layout/${item.path}`,
  })
}
onMounted(() => {
  nextTick(() => {
    proxy.list = routerList
    proxy.glitchClock = new GlitchClock()
    proxy.background = new Background()
  })
})
onUnmounted(() => {
  console.log('preview-销毁')
})

</script>

<style scoped lang="less">
.preview {
  position: relative;
  width: 100%;
  height: 100%;

  .background {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    overflow: hidden;

    .canvas {
      position: relative;
      margin: auto;
      //width: 100%;
      //height: 100%;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: #000;
    }
  }

  .container {
    position: relative;
    z-index: 5;
    width: 1400px;
    padding: 0 40px;
    height: 100%;
    margin: 0 auto;
    color: #fff;
    scrollbar-width: none; /* firefox */
    -ms-overflow-style: none; /* IE 10+ */
    overflow-x: hidden;
    overflow-y: auto;

    ::-webkit-scrollbar {
      display: none; /* Chrome Safari */
    }

    .info {
      margin-top: 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .title {
        font-size: 34px;
        font-weight: bold;
      }

      .time {
        width: 500px;
        height: 200px;
      }
    }

    .list {
      margin-top: 40px;
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
      flex-wrap: wrap;

      .item {
        width: 307px;
        height: 220px;
        border-radius: 24px;
        background: rgba(255, 255, 255, 0.1);
        box-shadow: rgba(0, 0, 0, 0.35) 20px 20px 50px;
        margin: 0 30px 40px 0;
        transition: all 0.3s cubic-bezier(.4, 0, .2, 1);
        opacity: 0.7;

        &:nth-child(4n) {
          margin-right: 0;
        }

        &:hover {
          transition: all 0.3s cubic-bezier(.4, 0, .2, 1);
          transform: scale(1.15);
          opacity: 1;
        }

        .title {
          padding: 20px;
          font-size: 22px;
          font-weight: bold;
        }

        .previewImg {
          padding: 0 20px 20px 20px;
          border-radius: 24px;
          overflow: hidden;

          img {
            width: 100%;
            height: 100%;
            background: #232323;
            border-radius: 16px;
          }
        }
      }
    }
  }
}

@media (max-width: 1000px) {
  .preview {
    .container {
      padding: 40px 60px;
      width: calc(100% - 120px);

      .info {
        width: 100%;
        position: relative;

        .title {
          font-size: 150px;
        }

        .time {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translate(0, -50%);
          width: 900px;
          height: 600px;
        }
      }

      .list {
        margin-top: 100px;
        display: block;

        .item {
          width: 100%;
          height: auto;
          margin: 0;
          margin-bottom: 80px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.35);

          &:hover {
            transition: all 0.3s cubic-bezier(.4, 0, .2, 1);
            transform: scale(1.05);
            opacity: 1;
          }

          .title {
            font-size: 70px;
            padding: 40px 60px;
          }

          .previewImg {
            width: 100%;
            height: 800px;
            padding: 60px 60px;
          }
        }

      }
    }
  }
}
</style>
