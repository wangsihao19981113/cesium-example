<script setup lang="ts">
import * as Cesium from 'cesium'
import BaseMap from "@/components/map/BaseMap.vue";
import {onMounted} from "vue";
import {useMapStore} from "@/store/modules/mapStore/mapStore.ts";

onMounted(async () => {
  let viewer = useMapStore().getCesiumViewer
  if(viewer) {
    viewer.scene.terrainProvider = new Cesium.CesiumTerrainProvider({url: "http://data.mars3d.cn/terrain/"})
    viewer.camera.setView({
      destination:new Cesium.Cartesian3( -550337.1987847314,  5531228.968461574,  3133933.430844551),
      orientation:{
        heading:6.213624554567151,
        pitch:-0.1651937911748873,
        roll:0
      }
    })
  }
})

</script>

<template>
  <BaseMap/>
</template>

<style scoped>

</style>