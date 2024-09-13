<script setup lang="ts">
import {ref} from 'vue'
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from '@element-plus/icons-vue'

import data from './example.json'

const screenHeight = ref(document.documentElement.clientHeight)
const examples = ref(data.examples)

const OpenExample = (url:string) => {
  if(url){
    window.open(window.location.origin + url)
  }
}

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

const changeItem = (id:string) => {
  window.location.href= "#"+id
}

const openGithub = () => {
  window.open('https://github.com/wangsihao19981113')
}

const getIcon = (icon:string) => {
  return "/image/icon/" + icon +".png"
}

const getSketch = (img:string) => {
  return "/image/sketch/" + img +".png"
}

</script>

<template>
  <el-menu
      :default-active="1"
      class="el-menu-demo"
      mode="horizontal"
      :ellipsis="false"
      @select="handleSelect"
  >
    <el-menu-item index="0">
      <img src="../../assets/icon.png" width="45" height="60">
      <span style="font-size: 20px;font-weight: 700;margin-left: 20px">Cesium例子集</span>
    </el-menu-item>
    <div style="display: flex;justify-content: center;align-items: center;height: 100%;margin-right: 10px">
      <div class="catrun moveRight"></div>
      <el-icon size="32" @click="openGithub" style="cursor: pointer">
        <svg preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" width="1.2em" height="1.2em" data-v-87052479=""><path fill="currentColor" d="M12 2C6.475 2 2 6.475 2 12a9.994 9.994 0 0 0 6.838 9.488c.5.087.687-.213.687-.476c0-.237-.013-1.024-.013-1.862c-2.512.463-3.162-.612-3.362-1.175c-.113-.288-.6-1.175-1.025-1.413c-.35-.187-.85-.65-.013-.662c.788-.013 1.35.725 1.538 1.025c.9 1.512 2.338 1.087 2.912.825c.088-.65.35-1.087.638-1.337c-2.225-.25-4.55-1.113-4.55-4.938c0-1.088.387-1.987 1.025-2.688c-.1-.25-.45-1.275.1-2.65c0 0 .837-.262 2.75 1.026a9.28 9.28 0 0 1 2.5-.338c.85 0 1.7.112 2.5.337c1.912-1.3 2.75-1.024 2.75-1.024c.55 1.375.2 2.4.1 2.65c.637.7 1.025 1.587 1.025 2.687c0 3.838-2.337 4.688-4.562 4.938c.362.312.675.912.675 1.85c0 1.337-.013 2.412-.013 2.75c0 .262.188.574.688.474A10.016 10.016 0 0 0 22 12c0-5.525-4.475-10-10-10z"></path></svg>
      </el-icon>
    </div>
  </el-menu>
  <div style="width: 100%;display: flex;height: calc(100% - 60px)">
    <div style="width: 12%;display: flex;height: 100%">
      <el-menu
          style="width: 100%"
          default-active="2"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
      >
        <el-sub-menu v-for="(first,index) in examples" :key="index" :index="first.id">
          <template #title>
            <img :src="getIcon(first.icon)" width="24" height="24" style="margin-right: 5px">
            <span>{{first.name}}</span>
          </template>
          <el-menu-item v-for="(second,index) in first.categories" @click="changeItem(second.id)" :key="index" :index="second.id">
            <img :src="getIcon(second.icon)" width="24" height="24" style="margin-right: 5px">
            {{second.name}}
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </div>

    <div class="viewer" style="{height:100%}">
      <div class="big" v-for="(first,index) in examples" :key="index">
        <div class="first" :id="first.id">
          <img :src="getIcon(first.icon)" width="24" height="24" style="margin-right: 5px">
          <p>{{first.name}}</p>
          <div class="line">
            <span></span>
          </div>
        </div>
        <div class="second" v-for="(second,index) in first.categories" :key="index" :id="second.id">
          <h3 class="secondName"><img :src="getIcon(second.icon)" width="24" height="24" style="margin-right: 5px">{{second.name}}</h3>
          <ul class="third">
            <li class="thirdItem" v-for="(third,index) in second.items" :key="index" @click="OpenExample(third.path)">
              <div class="pic">
                <img :src="getSketch(third.icon)" lazy="loaded">
              </div>
              <div class="catpaw catpaw1" style="left: 20px;bottom: 25px;width: 40px;height:35px;rotate: 15deg"></div>
              <div class="catpaw catpaw2" style="right: 15px;bottom: 8px;width: 20px;height:15px;rotate: -10deg" ></div>
              <div class="catpaw catpaw3" style="right: 32px;bottom: 51px;width: 30px;height:25px;rotate: -15deg" ></div>
              <p>{{third.name}}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>
.el-menu--horizontal > .el-menu-item:nth-child(1) {
  margin-right: auto;
  pointer-events: none;
}
.viewer{
  width: 88%;
  overflow-y: auto;
}

.first{
  margin-left: 15px;
  margin-top: 15px;
  color: #666;
  display: flex;
  align-items: center;
}

.first p{
  font-size: 20px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  line-height: 26px;
  margin:0px;
  color:#018afe;
}


.first .iconfont{
  width: 18px;
  height: 18px;
  line-height: 20px;
  font-size: 18px;
  text-align: center;
  color: #018afe;
  margin-right: 10px;
  border-radius: 10px;
}

.line{
  flex: 1;
  height: 1px;
  background-color: #dfdfdf;
  margin-left: 32px;
  position: relative;
}

.line span{
  width: 105px;
  height: 1px;
  background-color: #4e97d9;
  position: absolute;
  top: 0;
  left: 0
}

.second{
  border-bottom: 1px solid #dfdfdf;
  padding-top: 22px;
  padding-bottom: 16px;
  margin-left: 37px;
  margin-bottom: 8px;
}

.secondName{
  font-size: 20px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  line-height: 26px;
  color: #000;
  display: flex;
  align-items: center;
}

.third{
  margin-top: 15px;
  flex-wrap: wrap;
  display: flex;
}

.thirdItem{
  margin-right: 1.5%;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 3px 6px gray;
  background-color: #fff;
  opacity: 1;
  border-radius: 10px;
  margin-bottom: 28px;
  padding: 20px 20px;
  cursor: pointer;
  position: relative;
}

.thirdItem:hover{
  box-shadow: 0 6px 12px rgba(0,138,255,0.56);
  background-color: #4e97d9;
  transition-duration: 1s;
  color:white;
}

.thirdItem:hover .catpaw1{
  animation: fadeIn 1s ease-in-out;
}

.thirdItem:hover .catpaw2{
  animation: fadeIn 2s ease-in-out;
}

.thirdItem:hover .catpaw3{
  animation: fadeIn 1.5s ease-in-out;
}


.thirdItem .pic{
  width: 100%;
  height: 100%;
  margin: 3px 0 10px 0
}

.thirdItem img{
  border-radius: 10px;
  width: 250px;
  height: 210px;
  object-fit: cover;
}

.thirdItem p{
  width: 90%;
  font-size: 16px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  line-height: 21px;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: center;
}

.catpaw{
  position: absolute;
  width: 60px;
  height: 40px;
  background-image: url(/image/else/catpaw.png);
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 1;
}

.catrun{
  position: absolute;
  width: 60px;
  height: 59px;
  background-image: url('/image/else/catrun.gif'); /* 设置GIF路径 */
  background-size: 100px 100px;
  background-position: -20px -10px;
  background-repeat: no-repeat;
  animation: moveLeftRight 20s ease-in-out infinite
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes moveLeftRight {
  0% {
    right: 50px;
    transform:scaleX(1)
  }
  50% {
    right: calc(100% - 300px);
    transform:scaleX(1)
  }
  51% {
    transform:scaleX(-1)
  }
  99% {
    right: 50px;
    transform:scaleX(-1)
  }
  100% {
    right: 50px;
    transform:scaleX(1)
  }
}
</style>