<script setup lang="ts">
import * as Cesium from 'cesium'
import {onMounted} from "vue";
import {useMapStore} from "@/store/modules/mapStore/mapStore.ts";
import SceneMap from "@/components/map/SceneMap.vue";
import {ViewShedStage} from '@/lib/index'

let viewShedStage:ViewShedStage | null= null
let handler:Cesium.ScreenSpaceEventHandler
const start = () => {
  let viewer = useMapStore().getCesiumViewer
  if(viewer) {
    if(viewShedStage){
      viewShedStage.clear()
      viewShedStage = null
    }
    if(handler){
      handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
      handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    }
    handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas)
    handler.setInputAction(function (e:Cesium.ScreenSpaceEventHandler.PositionedEvent){
      let viewPosition = viewer.scene.pickPosition(e.position);
      console.log(viewPosition)
      handler.setInputAction(function (e:Cesium.ScreenSpaceEventHandler.MotionEvent){
        let viewPositionEnd = viewer.scene.pickPosition(e.endPosition);
        if(viewShedStage){
          viewShedStage.clear()
        }
        viewShedStage = new ViewShedStage(viewer, {viewPosition: viewPosition, viewPositionEnd: viewPositionEnd})
        handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
        handler.setInputAction(function (){
          handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE)
        },Cesium.ScreenSpaceEventType.LEFT_CLICK)
      },Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    },Cesium.ScreenSpaceEventType.LEFT_CLICK)}
}

const remove = () => {
  if(viewShedStage){
    viewShedStage.clear()
    viewShedStage = null
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