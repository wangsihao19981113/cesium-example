<template>
  <div style="z-index: 0; width: 100%;height: 100%;position: absolute;top: 0;bottom: 0;left: 0;right: 0;}" ref="cesiumContainer"></div>
</template>

<script setup lang="ts">
import * as Cesium from 'cesium'
import {onMounted, ref} from "vue";
import {useMapStore} from "@/store/modules/mapStore/mapStore.ts";
const cesiumContainer = ref()


onMounted(() => {
  Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwMTI5MmI3OS02YzZmLTQ3ZDgtYTg5ZC03NWU2NDA2NjAzMTgiLCJpZCI6NjUwMTAsImlhdCI6MTYyOTc5Mzk0OX0._KrXra53wNfiFndh1xuQr36N-FRY94G0PXZ7I8wJ2-c'
  let viewer = new Cesium.Viewer(cesiumContainer.value as HTMLElement,{
    animation: true, //控制是否显示动画小部件
    timeline: true, //是否显示时间线小部件
    baseLayerPicker: false, //是否显示基本层选择器小部件
    fullscreenButton: false, //是否显示全屏按钮
    vrButton: false, //是否显示虚拟现实按钮
    geocoder: false, //是否显示地理编码器小部件，用于搜索位置
    homeButton: false, //是否显示回到主页按钮
    infoBox: false,
    sceneModePicker: false, //是否显示场景模式选择器，允许用户在3D，2D，和Columbus View模式
    selectionIndicator: false,
    navigationHelpButton: false, //是否显示导航帮助按钮
    navigationInstructionsInitiallyVisible: true,
    scene3DOnly: false,
    creditContainer:undefined,
    shouldAnimate:true,
    contextOptions: {
      webgl:{
        alpha: true,
        depth:true,
        stencil:true,
        antialias:true,
        premultipliedAlpha:true,
        //通过canvas.toDataURL()实现截图需要将该项设置为true
        preserveDrawingBuffer:true,
        failIfMajorPerformanceCaveat:true
      }
    }
  })

  //深度监测
  viewer.scene.globe.depthTestAgainstTerrain = true

  useMapStore().setCesiumViewer(viewer)

  viewer["getCameraOption"] = function (){
    let cartographic = this.scene.globe.ellipsoid.cartesianToCartographic(this.camera.position)
    return {
      lng: Cesium.Math.toDegrees(cartographic.longitude),
      lat: Cesium.Math.toDegrees(cartographic.latitude),
      height: cartographic.height,
      heading: this.camera.heading,
      pitch: this.camera.pitch,
      roll: this.camera.roll
    }
  }

  let handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas)
  handler.setInputAction(function (event){
    let position = viewer.scene.pickPosition(event.position);
    let cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(position)
    console.log([Cesium.Math.toDegrees(cartographic.longitude),Cesium.Math.toDegrees(cartographic.latitude),cartographic.height])
  },Cesium.ScreenSpaceEventType.LEFT_CLICK)

  window.viewer = viewer
})

</script>



<style scoped>

</style>