<script setup lang="ts">
import * as Cesium from 'cesium'
import BaseMap from "@/components/map/BaseMap.vue";
import {onMounted} from "vue";
import {useMapStore} from "@/store/modules/mapStore/mapStore.ts";

onMounted(() => {
  let viewer = useMapStore().getCesiumViewer
  if(viewer) {
    viewer.scene.terrainProvider = new Cesium.CesiumTerrainProvider({url: "http://data.mars3d.cn/terrain/"})
    useMapStore().setCameraView({
      lng:95.68202149,
      lat:29.579245387,
      height:8177.322056492163,
      heading:6.213624554567151,
      pitch:-0.1651937911748873,
      roll:0
    })
  }
})

</script>

<template>
  <BaseMap/>
</template>

<style scoped>

</style>