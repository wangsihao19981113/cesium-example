<script setup lang="ts">
import BaseMap from "@/components/map/BaseMap.vue";
import BaiduImageryProvider from './lib/BaiduImageryProvider'
import {onMounted} from "vue";
import {useMapStore} from "@/store/modules/mapStore/mapStore.ts";
import * as Cesium from 'cesium'
onMounted(() => {
  let viewer = useMapStore().getCesiumViewer
  const layerProvider = new BaiduImageryProvider({type:'img_w',crs:'WGS84'});
  viewer?.imageryLayers.addImageryProvider(layerProvider);
  viewer?.camera.setView({
    destination:new Cesium.Cartesian3(-7732945.492261427, 23361250.363770947,11288113.919075862),
    orientation:{
      heading:0,
      pitch:-1.57,
      roll:0
    }
  })
})


</script>

<template>
  <BaseMap/>
</template>

<style scoped>

</style>