<template>
  <div class="main">
    <div class="left">
      <div class="title">目录</div>
      <div class="list">
        <div class="itemBox" :class="{open:menuIndex === index }" v-for="(item, index) of list" :key="index">
          <div class="item" @click.stop="toggle(item, index)">
            <div class="itemTitle"> {{ item.name }}</div>
            <div class="childList">
              <div class="child" :class="{active: childIndex === i}" v-for="(child, i) of item.children" :key="i"
                   @click.stop="go(child, i)">- {{
                  child.name
                }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="right">
      <RouterView/>
    </div>
  </div>
</template>
<script setup>
import {onMounted, ref, watch} from "vue";
import {useRouter, useRoute} from "vue-router";
import routerList from '@/router/index'
import {onBeforeMount} from "@vue/runtime-core";

const list = routerList.options.routes.slice(1, routerList.options.routes.length)
const router = useRouter()
const route = useRoute()
const menuIndex = ref(0)
const childIndex = ref(0)

const toggle = (item, index) => {
  if (menuIndex.value === index) return
  menuIndex.value = index
  sessionStorage.setItem('menuIndex', index)
  childIndex.value = 0
  router.push({
    path: item.children[0].path
  })
}
const go = (child, index) => {
  if (childIndex.value === index) return
  childIndex.value = index
  sessionStorage.setItem('childIndex', index)
  router.push({
    path: child.path
  })
}

watch(route, (val) => {
  // console.log(val)
})

onBeforeMount(() => {
  menuIndex.value = Number(sessionStorage.getItem('menuIndex') || 0)
  childIndex.value = Number(sessionStorage.getItem('childIndex') || 0)
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
      border-right: 1px solid #ccc;
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

            .itemTitle {
              width: 100%;
              padding: 10px 0;
              cursor: pointer;
              font-size: 24px;
              color: #232323;

            }

            .childList {
              margin-top: 10px;
              width: 100%;
              overflow: hidden;
              height: 0;
              transition: all 0.3s linear;

              .child {
                font-size: 12px;
                margin: 10px 0;
                padding: 14px 0;
                color: #858585;
                text-indent: 10px;
                cursor: pointer;

                &:hover {
                  text-decoration: underline;
                  font-weight: bold;
                  color: #000000;
                }
              }

              .active {
                text-decoration: underline;
                font-weight: bold;
                color: #000000;
              }
            }

          }
        }

        .open {
          .item {
            .childList {
              height: auto;
              transition: all 0.3s linear;
            }
          }
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
