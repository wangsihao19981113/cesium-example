<script setup lang="ts">
import {onMounted} from "vue";
import SceneMap from "@/components/map/SceneMap.vue";
import * as Cesium from "cesium"
import {TextThreeD} from "@/lib/index"
import {useMapStore} from "@/store/modules/mapStore/mapStore.ts";
onMounted(async () => {
  let viewer = useMapStore().getCesiumViewer
  if(viewer){
    let label = new Cesium.Entity(
        {
          position:Cesium.Cartesian3.fromDegrees(114.16899044163502, 22.29378971034226, 30),
          label:{
            text:"天星码头",
            font:"45px –sans-serif",
            fillColor:Cesium.Color.WHITE
          }
        }
    )
    viewer.entities.add(label)
  }
})

</script>

<template>
  <SceneMap/>
</template>

<style scoped>

</style>