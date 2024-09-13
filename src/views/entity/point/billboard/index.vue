<script setup lang="ts">
import {onMounted} from "vue";
import SceneMap from "@/components/map/SceneMap.vue";
import * as Cesium from "cesium"
import {useMapStore} from "@/store/modules/mapStore/mapStore.ts";
onMounted(async () => {
  let viewer = useMapStore().getCesiumViewer
  if(viewer){
    let billboard = new Cesium.Entity({
      position:Cesium.Cartesian3.fromDegrees(114.17012240865101, 22.293793329608604, 50.878586973404786),
      billboard:{
        image:"/image/else/HongKongCultureCenter.png",
        width:140,
        height:110,
      }
    })
    viewer.entities.add(billboard)
  }
})

</script>

<template>
  <SceneMap/>
</template>

<style scoped>

</style>