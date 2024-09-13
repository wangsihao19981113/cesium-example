import * as Cesium from 'cesium'

export type TextStyle = {
    font?: string
    textBaseline?: string
    fill?: boolean
    stroke?: boolean
    fillColor?: Cesium.Color
    strokeColor?:Cesium.Color
    strokeWidth?: number
    backgroundColor?: Cesium.Color
    padding?: number
}

export type TextOption = {
    position:Cesium.Cartesian3,
    orientation:Cesium.HeadingPitchRoll,
    text:string,style:TextStyle
}


export class TextThreeD{
/*    private text
    private style*/
    private viewer
    private primitive
    constructor(viewer:Cesium.Viewer, options:TextOption){
        this.viewer = viewer
        this.add(options)
    }

    add(options){
        let canvas = Cesium.writeTextToCanvas(options.text,options.style)
        console.log(canvas?.toDataURL())
        let dimensions = new Cesium.Cartesian3(canvas.width * 0.1, canvas.height * 0.1, 1.0);
        let scaleM = Cesium.Matrix4.fromScale(dimensions);
        let M = Cesium.Transforms.eastNorthUpToFixedFrame(options.position)
        let rotateM3 = Cesium.Matrix3.fromHeadingPitchRoll(options.orientation);
        let rotateM4 = Cesium.Matrix4.fromRotationTranslation(rotateM3)
        Cesium.Matrix4.multiply(M,rotateM4,M)
        Cesium.Matrix4.multiply(M,scaleM,M)
        let primitive = new Cesium.Primitive({
            geometryInstances: new Cesium.GeometryInstance({
                geometry: Cesium.PlaneGeometry.createGeometry(
                    new Cesium.PlaneGeometry({
                        vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT
                    })
                ),
                modelMatrix: M
            }),
            appearance: new Cesium.EllipsoidSurfaceAppearance({
                material: Cesium.Material.fromType('Image', {
                    image: canvas,
                    repeat: new Cesium.Cartesian2(1, 1)
                }),
                flat: true,
                aboveGround: true
            }),
            asynchronous: false
        })
        this.primitive = primitive
        this.viewer.scene.primitives.add(primitive)
    }

    remove(){
        this.viewer.scene.primitives.remove(this.primitive)
    }


}