<script setup lang="ts">
import * as Cesium from 'cesium'
import SceneMap from "@/components/map/SceneMap.vue";
import {onMounted} from "vue";
import {useMapStore} from "@/store/modules/mapStore/mapStore.ts";
import {Flooding} from "@/lib/index"
onMounted(async () => {

})
let flooding:Flooding
const start = () => {
  let viewer = useMapStore().getCesiumViewer
  if(viewer){
    if (flooding){
      flooding.remove()
    }
    flooding = new Flooding(viewer,{
      positionArray:[114.16836268110701, 22.2955102180748,114.1702958871463, 22.295597320322436,114.17081723444794, 22.29337286455863,114.16850972267937, 22.29336239480481],
      speed:1,
      targetHeight:50
    })
    flooding.start()
  }
}

const restart = () => {
  if (flooding){
    flooding.restart()
  }
}

const remove = () => {
  if (flooding){
    flooding.remove()
  }
}

</script>

<template>
  <div style="z-index: 1;position: absolute;left: 10px;top: 10px">
    <el-button @click="start()">开始</el-button>
    <el-button @click="remove()">清除</el-button>
  </div>
  <SceneMap/>
</template>

<style scoped>

</style>