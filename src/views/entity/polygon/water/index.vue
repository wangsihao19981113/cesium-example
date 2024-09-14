<script setup lang="ts">
import {onMounted} from "vue";
import SceneMap from "@/components/map/SceneMap.vue";
import * as Cesium from "cesium"
import {WaterPrimitive} from "@/lib/WaterPrimitive"
import {useMapStore} from "@/store/modules/mapStore/mapStore.ts";
import data from "./data.json"

onMounted(async () => {
  let viewer = useMapStore().getCesiumViewer
  if(viewer){
    viewer.scene.globe.depthTestAgainstTerrain = false
    var promise =Cesium.GeoJsonDataSource.load(data);
    promise.then(function(dataSource){
      var entities = dataSource.entities.values;
      let geometry = []
      for (let i = 0; i < entities.length; i++){
        let positions = dataSource.entities.values[i].polygon.hierarchy._value.positions
        positions.push(positions[0])
        for(let j = 0 ; j < positions.length ; j++){
          positions[j] =  Cesium.Cartographic.fromCartesian(positions[j])
        }
        const aaa = new WaterPrimitive({
          scene: viewer.scene,
          positions: positions,
          height: 0,
          rippleSize: 100,
        });
        const waterParams = {
          波纹大小: 20.0,
          透明度: 0.7,
          反射率: 0.7,
          扭曲: 10,
          高度: 0,
        };
        aaa.rippleSize = waterParams["波纹大小"];
        aaa.waterAlpha = waterParams["透明度"];
        aaa.reflectivity = waterParams["反射率"];
        aaa.distortionScale = waterParams["扭曲"];
        aaa.height = waterParams["高度"];
      }

      // for (let i = 0; i < entities.length; i++) {
      //     let entity = entities[i];
      //     geometry.push(new Cesium.PolygonGeometry({
      //         polygonHierarchy : entity.polygon.hierarchy._value,
      //         height:-1
      //         //extrudedHeight: 0,//注释掉此属性可以只显示水面
      //         //perPositionHeight : true//注释掉此属性水面就贴地了
      //     }))
      // }
      // let polygons = geometry;
      // let polygonPrimitive = [];
      // for(let i = 0 ; i < polygons.length ; i++) {
      //     let polygon = polygons[i];
      //     polygonPrimitive.push(
      //         new Cesium.GeometryInstance({
      //             geometry: polygon,
      //         })
      //     )
      // }
      // WaterCollection = new Cesium.Primitive({
      //     geometryInstances: polygonPrimitive,
      //     appearance: new Cesium.EllipsoidSurfaceAppearance({
      //         material: watermaterial
      //     }),
      // })
      // window.app.viewer.scene.primitives.add(WaterCollection);
    });
  }
})

</script>

<template>
  <SceneMap/>
</template>

<style scoped>

</style>