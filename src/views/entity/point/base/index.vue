<script setup lang="ts">
import {onMounted} from "vue";
import SceneMap from "@/components/map/SceneMap.vue";
import * as Cesium from "cesium"
import {useMapStore} from "@/store/modules/mapStore/mapStore.ts";
onMounted(async () => {
  let viewer = useMapStore().getCesiumViewer
  if(viewer){
    let point1 = new Cesium.Entity(
        {
          position:Cesium.Cartesian3.fromDegrees(114.16899044163502, 22.29348971034226, 10),
          point:{
            pixelSize:20,
            color:Cesium.Color.WHITE,
            outlineColor:Cesium.Color.RED,
            outlineWidth:5
          }
        }
    )
    viewer.entities.add(point1)

    let point2 = new Cesium.Entity(
        {
          position:Cesium.Cartesian3.fromDegrees(114.16899044163502, 22.29379971034226, 10),
          point:{
            pixelSize:30,
            color:Cesium.Color.YELLOW
          }
        }
    )

    viewer.entities.add(point2)
  }
})

</script>

<template>
  <SceneMap/>
</template>

<style scoped>

</style>