<!--
justThreeJs App.vue
@author kongjianqiu
@description
@created 2025/1/21 14:55:26
-->
<template>
  <router-view v-slot="{ Component }">
      <component
          :is="Component"
          :key="$route.name"
      />
  </router-view>
</template>

<script setup>
import { useRoute } from "vue-router";
const $route = useRoute();
</script>

<style lang="less">
@import "@/assets/css/base.css";
#app{
  width: 100vw;
  height: 100vh;
  padding: 0;
  margin: 0;
}
</style>
