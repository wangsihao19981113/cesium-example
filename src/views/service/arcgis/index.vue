<script setup lang="ts">
import * as Cesium from 'cesium'
import BaseMap from "@/components/map/BaseMap.vue";
import {onMounted} from "vue";
import {useMapStore} from "@/store/modules/mapStore/mapStore.ts";

onMounted(() => {
  let viewer = useMapStore().getCesiumViewer
  let provider = new Cesium.ArcGisMapServerImageryProvider({url:"https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"})
  viewer?.imageryLayers.addImageryProvider(provider)
})

</script>

<template>
  <BaseMap/>
</template>

<style scoped>

</style>