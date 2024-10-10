<script setup lang="ts">
import {onMounted} from "vue";
import {useMapStore} from "@/store/modules/mapStore/mapStore";
/*import * as Cesium from "cesium";*/
import {Measure} from "@/lib/Measure.ts"
import TerrainMap from "@/components/map/TerrainMap.vue";
let measure:Measure

onMounted(() => {
  let viewer = useMapStore().getCesiumViewer
  if(viewer) {
    measure = new Measure(viewer)
    measure.getPositionArea([{lng:116,lat:50,alt:0},{lng:117,lat:50,alt:0},{lng:116,lat:49,alt:0},{lng:115,lat:49,alt:0}])
  }
})

const measureLength = () => {
  if(measure){
    measure.startMeasureLine({clampToGround:false})
  }
}

const measureLengthClampToGround = () => {
  if(measure){
    measure.startMeasureLine({clampToGround:true})
  }
}


const measureArea = () => {
  if(measure){
    measure.startMeasureArea({clampToGround:false})
  }
}

const measureAreaClampToGround = () => {
  if(measure){
    measure.startMeasureArea({clampToGround:true,interpolation:3})
  }
}


</script>

<template>
  <div style="z-index: 1;position: absolute;left: 10px;top: 10px">
    <el-button @click="measureLength()">长度测量</el-button>
    <el-button @click="measureLengthClampToGround()">贴地长度测量</el-button>
    <el-button @click="measureArea()">面积</el-button>
    <el-button @click="measureAreaClampToGround()">贴地面积测量</el-button>
  </div>
  <TerrainMap/>
</template>

<style scoped>

</style>