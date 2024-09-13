<script setup lang="ts">
import {onMounted} from "vue";
import SceneMap from "@/components/map/SceneMap.vue";
import * as Cesium from "cesium"
import {TextThreeD} from "@/lib/index"
import {useMapStore} from "@/store/modules/mapStore/mapStore.ts";
onMounted(async () => {
  let viewer = useMapStore().getCesiumViewer
  if(viewer){
    let text1 = new TextThreeD(viewer,
        {
          position:Cesium.Cartesian3.fromDegrees(114.16899044163502, 22.29448971034226, 58.878586973404786),
          orientation:Cesium.HeadingPitchRoll.fromDegrees(-12.5,0,90),
          text:"英国XXXX",
          style:{
            font:'100px – sans-serif',
            fill:true,
            fillColor:Cesium.Color.fromCssColorString("#FF0000"),
            stroke:true,
            strokeColor:Cesium.Color.fromCssColorString("#FFFFFF")
          }
        }
    )

    let text2 = new TextThreeD(viewer,
        {
          position:Cesium.Cartesian3.fromDegrees(114.17012240865101, 22.293793329608604, 40.878586973404786),
          orientation:Cesium.HeadingPitchRoll.fromDegrees(45,0,90),
          text:"香港文化中心",
          style:{
            font:'150px – sans-serif',
            fill:true,
            fillColor:Cesium.Color.fromCssColorString("#FFFFFF"),
            stroke:true,
            strokeColor:Cesium.Color.fromCssColorString("#000000")
          }
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