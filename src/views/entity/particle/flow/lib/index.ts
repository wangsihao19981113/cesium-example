import * as Cesium from 'cesium'
import {ViewerParameters} from "./types";
import {viewRectangleToLonLatRange} from "./util";
import ParticleSystem from "./particleSystem";
let particleSystemOptions = {
  particlesTextureSize:  64,
  maxParticles: 64*64,
  particleHeight: 100.0,
  fadeOpacity: 0.996,
  dropRate: 0.003,
  dropRateBump: 0.01,
  speedFactor: 1.0,
  lineWidth: 4.0
}
export class Flow {
  private viewerParameters:ViewerParameters
  private globeBoundingSphere:Cesium.BoundingSphere
  private primitiveCollection:Cesium.PrimitiveCollection
  private particleSystem:ParticleSystem
  private viewer:Cesium.Viewer
  private origin_viewerParameters:ViewerParameters | undefined
  private resized:boolean
  private resizeInstance:Cesium.Event.RemoveCallback | undefined
  constructor(viewer:Cesium.Viewer,data:any) {
    this.primitiveCollection = new Cesium.PrimitiveCollection()
    this.globeBoundingSphere = new Cesium.BoundingSphere(Cesium.Cartesian3.ZERO, 0.99 * 6378137.0)
    this.origin_viewerParameters = undefined
    this.viewer = viewer
    this.viewerParameters = {
      lonRange: new Cesium.Cartesian2(0, 0),
      latRange: new Cesium.Cartesian2(0, 0),
      pixelSize: 0.0
    }
    this.resized = false
    this.updateViewerParameters()
    this.particleSystem = new ParticleSystem((viewer.scene as any).context , data , particleSystemOptions , this.viewerParameters)
    this.resizeInstance = undefined
    this.addFlow()
  }
  updateViewerParameters(){
    const scene = this.viewer.scene
    const camera = scene.camera
    if(scene && camera) {
      if (
          this.origin_viewerParameters && Cesium.defined(this.origin_viewerParameters) &&
          this.origin_viewerParameters.latRange && Cesium.defined(this.origin_viewerParameters.latRange) &&
          this.origin_viewerParameters.lonRange && Cesium.defined(this.origin_viewerParameters.lonRange)
      ) {
        this.viewerParameters.lonRange = new Cesium.Cartesian2(this.origin_viewerParameters.lonRange[0], this.origin_viewerParameters.lonRange[1])
        this.viewerParameters.latRange =  new Cesium.Cartesian2(this.origin_viewerParameters.latRange[0], this.origin_viewerParameters.latRange[1])
      } else {
        const viewRectangle = camera.computeViewRectangle(scene.globe.ellipsoid)
        if (viewRectangle) {
          const lonLatRange = viewRectangleToLonLatRange(viewRectangle);
          if(lonLatRange && lonLatRange.lon && lonLatRange.lat) {
            (this.viewerParameters.lonRange as Cesium.Cartesian2).x = lonLatRange.lon.min;
            (this.viewerParameters.lonRange as Cesium.Cartesian2).y = lonLatRange.lon.max;
            (this.viewerParameters.latRange as Cesium.Cartesian2).x = lonLatRange.lat.min;
            (this.viewerParameters.latRange as Cesium.Cartesian2).y = lonLatRange.lat.max;
          }
        }
      }

      const pixelSize =
          this.origin_viewerParameters && Cesium.defined(this.origin_viewerParameters) && this.origin_viewerParameters.pixelSize && Cesium.defined(this.origin_viewerParameters.pixelSize)
              ? this.origin_viewerParameters.pixelSize
              : camera?.getPixelSize(this.globeBoundingSphere, scene.drawingBufferWidth, scene.drawingBufferHeight)

      if (pixelSize && pixelSize > 0) {
        this.viewerParameters.pixelSize = pixelSize
      }
    }
  }
  addFlow(){
    this.viewer.scene.primitives.add(this.primitiveCollection)
    this.addPrimitives()
    // the order of primitives.add() should respect the dependency of primitives
    const scene = this.viewer.scene
    const camera = scene.camera
    camera.moveStart.addEventListener(this.moveStartListener,this)
    camera.moveEnd.addEventListener(this.moveEndListener,this)
    window.addEventListener('resize', this.resizeListener)
    this.resizeInstance = scene.preRender.addEventListener(this.preRenderListener)
  }

  removeFlow(){
    this.removePrimitives()
    const scene = this.viewer.scene
    const camera = scene.camera
    this.removePrimitives()
    this.viewer.scene.primitives.remove(this.primitiveCollection)
    camera.moveStart.removeEventListener(this.moveStartListener)
    camera.moveEnd.removeEventListener(this.moveEndListener)
    window.removeEventListener('resize', this.resizeListener)
    if(this.resizeInstance)
      this.resizeInstance()
  }



  addPrimitives(){
    this.primitiveCollection.add(this.particleSystem.particlesComputing.primitives.calculateSpeed)
    this.primitiveCollection.add(this.particleSystem.particlesComputing.primitives.updatePosition)
    this.primitiveCollection.add(this.particleSystem.particlesComputing.primitives.postProcessingPosition)
    this.primitiveCollection.add(this.particleSystem.particlesRendering.primitives.segments)
    this.primitiveCollection.add(this.particleSystem.particlesRendering.primitives.trails)
    this.primitiveCollection.add(this.particleSystem.particlesRendering.primitives.screen)
  }

  removePrimitives(){
    this.primitiveCollection.remove(this.particleSystem.particlesComputing.primitives.calculateSpeed)
    this.primitiveCollection.remove(this.particleSystem.particlesComputing.primitives.updatePosition)
    this.primitiveCollection.remove(this.particleSystem.particlesComputing.primitives.postProcessingPosition)
    this.primitiveCollection.remove(this.particleSystem.particlesRendering.primitives.segments)
    this.primitiveCollection.remove(this.particleSystem.particlesRendering.primitives.trails)
    this.primitiveCollection.remove(this.particleSystem.particlesRendering.primitives.screen)
  }


  preRenderListener = () => {
    if (this.resized && this.primitiveCollection && this.particleSystem) {
      const scene = this.viewer.scene
      this.particleSystem.canvasResize((scene as any).context)
      this.resized = false
      this.addPrimitives()
      this.primitiveCollection.show = true
    }
  }

  moveStartListener(){
    this.primitiveCollection.show = false
  }

   moveEndListener(){
    this.updateViewerParameters()
    this.particleSystem.applyViewerParameters(this.viewerParameters)
    this.primitiveCollection.show = true
  }

  resizeListener = () => {
    if(this.primitiveCollection) {
      this.resized = true
      this.primitiveCollection.show = false
      this.primitiveCollection.removeAll()
    }
  }

}