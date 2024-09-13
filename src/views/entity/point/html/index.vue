<script setup lang="ts">
import {onMounted} from "vue";
import SceneMap from "@/components/map/SceneMap.vue";
import * as Cesium from "cesium"
import {HtmlPoint} from "@/lib/index"
import {useMapStore} from "@/store/modules/mapStore/mapStore.ts";
onMounted(async () => {
  let viewer = useMapStore().getCesiumViewer
  if(viewer){
    let div = document.createElement("div")
    div.style.cssText = "position: absolute;\n" +
        "width: 400px;\n" +
        "height: 119px;\n" +
        "background-image: url('/image/else/boarder.svg');\n" +
        "background-size: cover;\n" +
        "background-position: center; /* 居中显示 */\n" +
        "background-repeat: no-repeat;" +
        "text-align:center;" +
        "align-content: center;" +
        "text-shadow: rgb(0, 158, 255) 0 0 20px;" +
        "color:white;" +
        "font-size:35px;" +
        "font-family: \"Microsoft YaHei\";" +
        "font-weight:600"
    div.innerHTML = "香港文化中心"
    let image = new HtmlPoint(viewer,
        {
          position:Cesium.Cartesian3.fromDegrees(114.17012240865101, 22.293793329608604, 50.878586973404786),
          html:div,
          verticalOrigin:Cesium.VerticalOrigin.CENTER,
          horizontalOrigin:Cesium.HorizontalOrigin.CENTER,
        }
    )
  }
})

</script>

<template>
  <SceneMap/>
</template>

<style scoped>

</style>