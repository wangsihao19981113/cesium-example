<script setup lang="ts">
import BaseMap from "@/components/map/BaseMap.vue";
import {onMounted} from "vue";
import {useMapStore} from "@/store/modules/mapStore/mapStore";
import * as Cesium from "cesium";
import {LineShineMaterialProperty} from "@/lib/LineMaterial"
import data from "./data.json"


onMounted(() => {
  let viewer = useMapStore().getCesiumViewer
  if(viewer) {
    let source = new Cesium.CustomDataSource()
    for(let i = 0 ; i < data.positions.length ; i++){
      let entity = GetEntity({
        pointarray:data.positions[i],
        image: i % 2 == 0 ? '/image/else/spriteline1.png' : '/image/else/spriteline3.png',
        duration:1000,
      })
      source.entities.add(entity);
    }

    viewer.dataSources.add(source);
    viewer.zoomTo(source);
  }
})

const GetEntity = (config) => {
  let Entity = new Cesium.Entity({
    polyline: {
      positions: Cesium.Cartesian3.fromDegreesArray(config.pointarray),
      width: 5,
      material: new LineShineMaterialProperty(config)
    }
  })
  return Entity;
}

</script>

<template>
  <BaseMap/>
</template>

<style scoped>

</style>