<template>
  <div class="main">
    <div class="left">
      <div class="title">目录</div>
      <div class="list">
        <div class="itemBox" :class="{active:menuIndex === index }" v-for="(item, index) of list" :key="index">
          <div class="item" @click="go(item, index)">{{ item.name }}</div>
        </div>
      </div>
    </div>
    <div class="right">
      <RouterView/>
    </div>
  </div>
</template>
<script setup>
import {onMounted, ref} from "vue";
import {useRouter, useRoute} from "vue-router";
import routerList from '@/router/index'

const list = routerList.options.routes.slice(1, routerList.options.routes.length)
const router = useRouter()
const route = useRoute()
const menuIndex = ref(0)
const go = (item, index) => {
  menuIndex.value = index
  router.push({
    path: item.path
  })
}

onMounted(() => {
  setTimeout(() => {
    console.log(route.fullPath)
    list.map((x, index) => {
      if (route.fullPath === x.path) menuIndex.value = index
    })
  }, 100)
})
</script>
<style lang="less">
#app {
  padding: 0;
  margin: 0;

  .main {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .left {
      width: 200px;
      height: 100vh;

      .title {
        margin: 10px 0 0 0;
        padding-bottom: 10px;
        text-align: center;
        font-size: 18px;
        font-weight: bold;
        border-bottom: 1px solid #E8E8E8;
      }

      .list {
        height: calc(100% - 40px - 70px);
        overflow-y: auto;
        overflow-x: hidden;
        padding: 20px;
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
        flex-direction: column;

        .itemBox {
          width: 100%;

          .item {
            text-align: left;
            padding: 10px 0;
            flex-wrap: wrap;
            cursor: pointer;
            font-size: 16px;
          }
        }

        .active {
          text-decoration: underline;
          font-weight: bold;
        }
      }
    }

    .right {
      width: calc(100vw - 200px);
      height: 100vh;
      position: relative;
    }
  }
}
</style>
