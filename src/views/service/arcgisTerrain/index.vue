<script setup lang="ts">
import * as Cesium from 'cesium'
import BaseMap from "@/components/map/BaseMap.vue";
import {onMounted} from "vue";
import {useMapStore} from "@/store/modules/mapStore/mapStore.ts";

onMounted(() => {
  let viewer = useMapStore().getCesiumViewer
  const terrainUrl = 'https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer';
// 设置Cesium Viewer使用ArcGIS地形
  if(viewer) {
    viewer.scene.terrainProvider = new Cesium.ArcGISTiledElevationTerrainProvider({url:terrainUrl});
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