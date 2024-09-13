<script setup lang="ts">
import * as Cesium from 'cesium'
import BaseMap from "@/components/map/BaseMap.vue";
import {onMounted} from "vue";
import {useMapStore} from "@/store/modules/mapStore/mapStore.ts";

onMounted(() => {
  let viewer = useMapStore().getCesiumViewer
  const tianditu = new Cesium.UrlTemplateImageryProvider({
    url:"http://t0.tianditu.gov.cn/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles&tk=ef263e6d2593d5168786ea72ff7f62d9"
  })
  viewer?.imageryLayers.addImageryProvider(tianditu)
})

</script>

<template>
  <BaseMap/>
</template>

<style scoped>

</style>