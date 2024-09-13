<script setup lang="ts">
import {onMounted} from "vue";
import SceneMap from "@/components/map/SceneMap.vue";
import * as Cesium from "cesium"
import {ImageThreeD} from "@/lib/index"
import {useMapStore} from "@/store/modules/mapStore/mapStore.ts";
onMounted(async () => {
  let viewer = useMapStore().getCesiumViewer
  if(viewer){
    let image = new ImageThreeD(viewer,
        {
          position:Cesium.Cartesian3.fromDegrees(114.17012240865101, 22.293793329608604, 50.878586973404786),
          orientation:Cesium.HeadingPitchRoll.fromDegrees(45,0,90),
          width:70,
          height:50,
          url:"/image/else/HongKongCultureCenter.png"
        }
    )
  }
})

</script>

<template>
  <SceneMap/>
</template>

<style scoped>

</style>