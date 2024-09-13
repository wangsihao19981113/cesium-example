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
          url: "/3dtiles/PSMODEL/tileset.json",
        })
    );
    viewer.zoomTo(_3dtilesmodel)
  }
})

</script>

<template>
  <BaseMap/>
</template>

<style scoped>

</style>