<script setup lang="ts">
import BaseMap from "@/components/map/BaseMap.vue";
import {onMounted,ref} from "vue";
import {useMapStore} from "@/store/modules/mapStore/mapStore";
import { NetCDFReader } from 'netcdfjs'
import {Flow} from "./lib/index.ts"
let flow:any = null
let isStart = ref(true)
import {decodeEpak} from "./lib/decoder.ts"
const remove = () => {
  flow.removeFlow()
  flow = null
  isStart.value = false
}

const start = async () => {
  let viewer = useMapStore().getCesiumViewer
  if(viewer) {
/*    let data = await loadNetCDF("/wind/data/demo.nc")*/
/*    let data = await loadJsonData("/wind/data/wind.json")*/
    let data = await loadEPAK("/wind/data/wind.epak")
    if(data && !flow){
      flow = new Flow(viewer,data)
      isStart.value = true
    }
  }
}


onMounted(() => {
  start()
})

const loadNetCDF = async (filePath:string) =>
{
  return new Promise(function (resolve) {
    var request = new XMLHttpRequest()
    request.open('GET', filePath)
    request.responseType = 'arraybuffer'
    request.onload = function () {
      let arrayToMap = function (array:any) {
        return array.reduce(function (map:any, object:any) {
          map[object.name] = object
          return map
        }, {})
      }
      let NetCDF = new NetCDFReader(request.response)
      let data:any = {}
      let dimensions = arrayToMap(NetCDF.dimensions)
      data.dimensions = {}
      data.dimensions.lon = dimensions['lon'].size
      data.dimensions.lat = dimensions['lat'].size
      data.dimensions.lev = dimensions['lev'].size
      let variables = arrayToMap(NetCDF.variables)
      let uAttributes = arrayToMap(variables['U'].attributes)
      let vAttributes = arrayToMap(variables['V'].attributes)
      data.lon = {}
      data.lon.array = new Float32Array(NetCDF.getDataVariable('lon').flat() as number[])
      data.lon.min = Math.min(...data.lon.array)
      data.lon.max = Math.max(...data.lon.array)
      data.lon.delta = data.lon.array[1] - data.lon.array[0]
      data.lat = {}
      data.lat.array = new Float32Array(NetCDF.getDataVariable('lat').flat() as number[])
      data.lat.min = Math.min(...data.lat.array)
      data.lat.max = Math.max(...data.lat.array)
      data.lat.delta = data.lat.array[1] - data.lat.array[0]
      data.lev = {}
      data.lev.array = new Float32Array(NetCDF.getDataVariable('lev').flat() as number[])
      data.lev.min = Math.min(...data.lev.array)
      data.lev.max = Math.max(...data.lev.array)
      data.U = {}
      data.U.array = new Float32Array(NetCDF.getDataVariable('U').flat() as number[])
      data.U.min = uAttributes['min'].value
      data.U.max = uAttributes['max'].value
      data.V = {}
      data.V.array = new Float32Array(NetCDF.getDataVariable('V').flat() as number[])
      data.V.min = vAttributes['min'].value
      data.V.max = vAttributes['max'].value
      resolve(data)
    }
    request.send()
  })
}

const loadJsonData = async (filePath:string) => {
  return new Promise(function (resolve) {
    var request = new XMLHttpRequest();
    request.open('GET', filePath);
    request.onload = function () {
      let data:any = {}
      let a = JSON.parse(request.response);
      let header = a[0].header;
      let array = [];
      for(let i = header.la2 ; i <= header.la1 ; i = i + header.dy)
      {
        array.push(i);
      }
      data["lat"] = {array:new Float32Array(array),min:header.la2,max:header.la1}

      array = [];
      for(let i = header.lo1 ; i <= header.lo2 ; i = i + header.dx)
      {
        array.push(i);
      }

      let arrayU = []
      for(let i = header.ny-1 ; i >= 0 ; i--){
        for(let j = 0 ; j < header.nx ; j++){
          arrayU.push(a[0].data[i*header.nx + j])
        }
      }

      let arrayV = []
      for(let i = header.ny-1 ; i >= 0 ; i--){
        for(let j = 0 ; j < header.nx ; j++){
          arrayV.push(a[1].data[i*header.nx + j])
        }
      }
      data["lon"] = {array:new Float32Array(array),min:header.lo1,max:header.lo2};
      data["U"] = {array:new Float32Array(arrayU) , min: Math.min(...arrayU) , max: Math.max(...arrayU)};
      data["V"] = {array:new Float32Array(arrayV) , min: Math.min(...arrayV) , max: Math.max(...arrayV)};
      data["dimensions"] = { lon:header.nx, lat:header.ny, lev:1};
      data["lev"] = {array:new Float32Array([1]) , min : 1 , max : 1};
      resolve(data);
    };
    request.send();
  });
}

const loadEPAK = async (filePath:string) => {
  return new Promise(function (resolve) {
    var request = new XMLHttpRequest();
    request.responseType = "arraybuffer";
    request.open('GET', filePath);

    request.onload = function () {
      let a = decodeEpak(request.response,{});
      let data:any = {}

      let latConfig = (a.header.variables.lat || a.header.variables.latitude).sequence;
      let array = [];
      for(let i = latConfig.start , k = 0 ; k<latConfig.size ; i = i + latConfig.delta , k++)
      {
        array.push(i);
      }
      data["lat"] = {array:new Float32Array(array).sort(),min:Math.min(...array),max:Math.max(...array)}

      let lonConfig = (a.header.variables.lon || a.header.variables.longitude).sequence;
      array = [];
      for(let i = lonConfig.start , k = 0 ; k<lonConfig.size ; i = i + lonConfig.delta , k++)
      {
        array.push(i);
      }
      data["lon"] = {array:new Float32Array(array).sort(),min:Math.min(...array),max:Math.max(...array)}

      let arrayU = []
      for(let x = latConfig.size-1 ; x >= 0 ; x--){
        for(let y = 0 ; y < lonConfig.size ; y++){
          if(a.blocks[0][x*lonConfig.size + y] == a.blocks[0][x*lonConfig.size + y])
          {
            arrayU.push(a.blocks[0][x*lonConfig.size + y])
          }
          else{
            arrayU.push(0)
          }
        }
      }

      let arrayV = []
      for(let z = latConfig.size-1 ; z >= 0 ; z--){
        for(let n = 0 ; n < lonConfig.size ; n++){
          if(a.blocks[1][z*lonConfig.size + n] == a.blocks[1][z*lonConfig.size + n]) {
            arrayV.push(a.blocks[1][z * lonConfig.size + n])
          }
          else{
            arrayV.push(0)
          }
        }
      }

      //排序
      let Float32U = new Float32Array(arrayU);
      let Float32V = new Float32Array(arrayV);
      Float32U.sort();
      Float32V.sort();

      data["U"] = {array:new Float32Array(arrayU) , min: Float32U[0] , max: Float32U[Float32U.length - 1]};
      data["V"] = {array:new Float32Array(arrayV) , min: Float32V[0] , max: Float32V[Float32V.length - 1]};
      data["dimensions"] = { lon:(a.header.dimensions.lon || a.header.dimensions.longitude).length , lat:(a.header.dimensions.lat || a.header.dimensions.latitude).length, lev:1};
      data["lev"] = {array:new Float32Array([1]) , min : 1 , max : 1};

      resolve(data);
    };

    request.send();
  });
}



</script>

<template>
  <div style="z-index: 1;position: absolute;left: 10px;top: 10px">
    <el-button v-if="!isStart"  @click="start()"  type="primary">开始</el-button>
    <el-button v-else @click="remove()">清除</el-button>
  </div>
  <BaseMap/>
</template>

<style scoped>

</style>