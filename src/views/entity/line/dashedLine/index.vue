<script setup lang="ts">
import BaseMap from "@/components/map/BaseMap.vue";
import {onMounted} from "vue";
import {useMapStore} from "@/store/modules/mapStore/mapStore";
import * as Cesium from "cesium";
import data from "../data/data.json"


onMounted(() => {
  let viewer = useMapStore().getCesiumViewer
  if(viewer) {
    let source = new Cesium.CustomDataSource()
    for(let i = 0 ; i < data.positions.length ; i++){
      let entity = new Cesium.Entity({
        polyline:{
          positions: Cesium.Cartesian3.fromDegreesArray(data.positions[i]),
          width: 5,
          material:new Cesium.PolylineDashMaterialProperty({
            color:new Cesium.Color(1,1,1),
            dashLength:10
          })
        }
      })
      source.entities.add(entity);
    }

    viewer.dataSources.add(source);
    viewer.zoomTo(source);
  }
})


</script>

<template>
  <BaseMap/>
</template>

<style scoped>

</style>