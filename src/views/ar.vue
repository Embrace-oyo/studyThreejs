<!--
justThreeJs ar.vue
@author kongjianqiu
@description
@created 2024/4/30 09:28:03
-->
<template>
  <div class="ar">
    <!--在图像描述符加载前显示 loading，根据设备的计算力，加载可能需要一点时间。-->
    <div class="arjs-loader">
      <div>Loading, please wait...</div>
    </div>

    <!-- a-frame scene -->
    <a-scene
        vr-mode-ui="enabled: false;"
        renderer="logarithmicDepthBuffer: true;"
        embedded
        arjs="trackingMethod: best; sourceType: webcam;debugUIEnabled: false;"
    >
      <!-- a-nft是定义图像跟踪实体的锚点 -->
      <!-- 在 url 使用到图像描述符的路径之前创建 -->
      <!-- 路径应该以名称结束，无需扩展名。举例来说，如果文件是“pinball.fset”那么路径的结尾单次就是“pinball” -->
      <a-nft
          type="nft"
          url="/public/ar/pinball"
          smooth="true"
          smoothCount="10"
          smoothTolerance=".01"
          smoothThreshold="5"
      >
        <!-- 作为 a-nft 的子元素，您可以定义要显示的内容。下面是一个 GLTF 模型实体 -->
        <a-entity
            gltf-model="/public/ar/Flamingo.glb"
            scale="5 5 5"
            position="50 150 0"
        >
        </a-entity>
      </a-nft>
      <!-- 静态摄像机，根据设备的运动参数进行移动 -->
      <a-entity camera></a-entity>
    </a-scene>
  </div>
</template>

<script setup>

</script>

<style scoped lang="less">
.ar {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  overflow: hidden;

  .arjs-loader {
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .arjs-loader div {
    text-align: center;
    font-size: 1.25em;
    color: white;
  }
}
</style>
