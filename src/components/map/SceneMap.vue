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
          url: "/3dtiles/HKMODEL/tileset.json",
        })
    );
    useMapStore().setCameraView({
      "lng": 114.16555823902526,
      "lat": 22.2897350825988,
      "height": 216.24578720331974,
      "heading": 0.7183451020530205,
      "pitch": -0.318520837523276,
      "roll": 6.283176889678716
    })
  }
})

</script>

<template>
  <BaseMap/>
</template>

<style scoped>

</style>