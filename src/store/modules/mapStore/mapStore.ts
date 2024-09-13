import { defineStore } from 'pinia'
import * as Cesium from 'cesium'

interface MapStoreType{
    viewer: null | Cesium.Viewer
}

type CameraViewOption = {
    lng:number
    lat:number
    height:number
    heading:number
    pitch:number
    roll:number
}

export const useMapStore = defineStore('map', {
    state: ():MapStoreType => ({
        viewer : null
    }),
    getters: {
        getCesiumViewer():Cesium.Viewer | null{
            return this.viewer
        }
    },
    actions: {
        setCesiumViewer(viewer:Cesium.Viewer){
            this.viewer = viewer
        },
        setCameraView(option:CameraViewOption){
            if(this.viewer){
                this.viewer.camera.setView({
                    destination:Cesium.Cartesian3.fromDegrees(option.lng,option.lat,option.height),
                    orientation:{
                        heading:option.heading,
                        pitch:option.pitch,
                        roll:option.roll
                    }
                })
            }
        }
    },
})