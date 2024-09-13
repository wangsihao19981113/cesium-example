<script setup lang="ts">
import {onMounted} from "vue";
import BaseMap from "@/components/map/BaseMap.vue";
import {useMapStore} from "@/store/modules/mapStore/mapStore.ts";
import  * as Cesium from 'cesium'

onMounted(async () => {
  let viewer = useMapStore().getCesiumViewer
  if(viewer){
    let entity = new Cesium.Entity({
      position:Cesium.Cartesian3.fromDegrees(-83.21965127509245, 34.56834881861358, 0),
      model:{
        uri:"/model/machine.glb",
        scale:5
      }
    })
    viewer.entities.add(entity)
    viewer.flyTo(entity,{duration:0})
  }
})

</script>

<template>
  <BaseMap/>
</template>

<style scoped>

</style>