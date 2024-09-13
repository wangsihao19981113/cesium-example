<script setup lang="ts">
import * as Cesium from 'cesium'
import BaseMap from "@/components/map/BaseMap.vue";
import {onMounted} from "vue";
import {useMapStore} from "@/store/modules/mapStore/mapStore.ts";

onMounted(async () => {
  let viewer = useMapStore().getCesiumViewer
  if(viewer) {
    let _3dtilesmodel = viewer.scene.primitives.add(
        new Cesium.Cesium3DTileset({
          url: "/3dtiles/points/tileset.json",
        })
    );
    useMapStore().setCameraView({
      "lng": -85.9179438447853,
      "lat": 39.19893537982329,
      "height": 678.8966697124008,
      "heading": 6.283185307179586,
      "pitch": -0.5000564538572947,
      "roll": 6.283185307179586
    })
  }
})

</script>

<template>
  <BaseMap/>
</template>

<style scoped>

</style>