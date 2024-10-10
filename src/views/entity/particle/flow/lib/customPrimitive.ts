import * as Cesium from 'cesium'
class CustomPrimitive {
  commandType: string
  geometry: any
  attributeLocations: any
  primitiveType: any
  uniformMap: any
  vertexShaderSource: any
  fragmentShaderSource: any
  rawRenderState: any
  framebuffer: any
  outputTexture: any
  autoClear: any
  preExecute: any
  show: boolean
  commandToExecute: any
  clearCommand: any
  constructor(options:any) {
    this.commandType = options.commandType

    this.geometry = options.geometry
    this.attributeLocations = options.attributeLocations
    this.primitiveType = options.primitiveType

    this.uniformMap = options.uniformMap

    this.vertexShaderSource = options.vertexShaderSource
    this.fragmentShaderSource = options.fragmentShaderSource

    this.rawRenderState = options.rawRenderState
    this.framebuffer = options.framebuffer

    this.outputTexture = options.outputTexture

    this.autoClear = Cesium.defaultValue(options.autoClear, false)
    this.preExecute = options.preExecute

    this.show = true
    this.commandToExecute = undefined
    this.clearCommand = undefined
    if (this.autoClear) {
      // @ts-ignore
      this.clearCommand = new Cesium.ClearCommand({
        color: new Cesium.Color(0.0, 0.0, 0.0, 0.0),
        depth: 1.0,
        framebuffer: this.framebuffer,
        // @ts-ignore
        pass: Cesium.Pass.OPAQUE
      })
    }
  }

  createCommand(context:any) {
    switch (this.commandType) {
      case 'Draw': {
        // @ts-ignore
        const vertexArray = Cesium.VertexArray.fromGeometry({
          context: context,
          geometry: this.geometry,
          attributeLocations: this.attributeLocations,
          // @ts-ignore
          bufferUsage: Cesium.BufferUsage.STATIC_DRAW
        })
        // @ts-ignore
        const shaderProgram = Cesium.ShaderProgram.fromCache({
          context: context,
          attributeLocations: this.attributeLocations,
          vertexShaderSource: this.vertexShaderSource,
          fragmentShaderSource: this.fragmentShaderSource
        })

        // @ts-ignore
        const renderState = Cesium.RenderState.fromCache(this.rawRenderState)
        // @ts-ignore
        return new Cesium.DrawCommand({
          owner: this,
          vertexArray: vertexArray,
          primitiveType: this.primitiveType,
          uniformMap: this.uniformMap,
          modelMatrix: Cesium.Matrix4.IDENTITY,
          shaderProgram: shaderProgram,
          framebuffer: this.framebuffer,
          renderState: renderState,
          // @ts-ignore
          pass: Cesium.Pass.OPAQUE
        })
      }
      case 'Compute': {
        // @ts-ignore
        return new Cesium.ComputeCommand({
          owner: this,
          fragmentShaderSource: this.fragmentShaderSource,
          uniformMap: this.uniformMap,
          outputTexture: this.outputTexture,
          persists: true
        })
      }
    }
  }

  setGeometry(context:any, geometry:any) {
    this.geometry = geometry
    // @ts-ignore
    const vertexArray = Cesium.VertexArray.fromGeometry({
      context: context,
      geometry: this.geometry,
      attributeLocations: this.attributeLocations,
      // @ts-ignore
      bufferUsage: Cesium.BufferUsage.STATIC_DRAW
    })
    this.commandToExecute.vertexArray = vertexArray
  }

  update(frameState:any) {
    if (!this.show) {
      return
    }

    if (!Cesium.defined(this.commandToExecute)) {
      this.commandToExecute = this.createCommand(frameState.context)
    }

    if (Cesium.defined(this.preExecute)) {
      this.preExecute()
    }

    if (Cesium.defined(this.clearCommand)) {
      frameState.commandList.push(this.clearCommand)
    }
    frameState.commandList.push(this.commandToExecute)
  }

  isDestroyed() {
    return false
  }

  destroy() {
    if (Cesium.defined(this.commandToExecute)) {
      this.commandToExecute.shaderProgram = this.commandToExecute.shaderProgram && this.commandToExecute.shaderProgram.destroy()
    }
    return Cesium.destroyObject(this)
  }
}

export default CustomPrimitive
