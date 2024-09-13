<script setup lang="ts">
import {onMounted} from "vue";
import BaseMap from "@/components/map/BaseMap.vue";
import {useMapStore} from "@/store/modules/mapStore/mapStore.ts";
import  * as Cesium from 'cesium'

onMounted(async () => {
  let viewer = useMapStore().getCesiumViewer
  if(viewer){
    viewer.shadows = true
    viewer.scene.globe.enableLighting = true

    let entity = new Cesium.Entity({
      position:Cesium.Cartesian3.fromDegrees( 12.58544493931099, 41.88249708813064,0),
      point:{
        pixelSize:10,
        color:Cesium.Color.WHITE
      }
    })

    viewer.scene.screenSpaceCameraController.enableCollisionDetection = false


    let tiles = new Cesium.Cesium3DTileset({
      url: "/3dtiles/church/tileset.json",
    })

    let _3dtilesmodel = viewer.scene.primitives.add(
        tiles
    );

    tiles.readyPromise.then((model) => {
      update3dtilesMaxtrix(model)
    })

    useMapStore().setCameraView({
      "lng": 12.586823879441273,
      "lat": 41.882263837114515,
      "height": 31.06533477865368,
      "heading": 4.93183420841685,
      "pitch": -0.2032580652553535,
      "roll": 6.283183034507749
    })

    let params = {
      tx: 12.58544493931099,  //模型中心X轴坐标（经度，单位：十进制度）
      ty: 41.88249708813064,    //模型中心Y轴坐标（纬度，单位：十进制度）
      tz: -11,    //模型中心Z轴坐标（高程，单位：米）
      rx: 0,    //X轴（经度）方向旋转角度（单位：度）
      ry: 0,    //Y轴（纬度）方向旋转角度（单位：度）
      rz: 95 //Z轴（高程）方向旋转角度（单位：度）
    };

    function update3dtilesMaxtrix(tileset) {
      //旋转
      var mx = Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(params.rx));
      var my = Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(params.ry));
      var mz = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(params.rz));
      var rotationX = Cesium.Matrix4.fromRotationTranslation(mx);
      var rotationY = Cesium.Matrix4.fromRotationTranslation(my);
      var rotationZ = Cesium.Matrix4.fromRotationTranslation(mz);
      //平移
      var position = Cesium.Cartesian3.fromDegrees(params.tx, params.ty, params.tz);
      var m = Cesium.Transforms.eastNorthUpToFixedFrame(position);
      //旋转、平移矩阵相乘
      Cesium.Matrix4.multiply(m, rotationX, m);
      Cesium.Matrix4.multiply(m, rotationY, m);
      Cesium.Matrix4.multiply(m, rotationZ, m);
      //赋值给tileset
      tileset._root.transform = m;
    }
  }
})

</script>

<template>
  <BaseMap/>
</template>

<style scoped>

</style>