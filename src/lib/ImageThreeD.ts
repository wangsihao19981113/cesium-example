import * as Cesium from 'cesium'


export type imageOption = {
    position:Cesium.Cartesian3,
    url:string,
    width:number,
    height:number,
    orientation:Cesium.HeadingPitchRoll
}


export class ImageThreeD{
    /*    private text
        private style*/
    private viewer
    private primitive
    constructor(viewer:Cesium.Viewer, options:imageOption){
        this.viewer = viewer
        this.add(options)
    }

    add(options){
        let canvas = document.createElement("canvas")
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.src = options.url
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            // 将图片绘制到 canvas 上
            ctx?.drawImage(img, 0, 0);
            let dimensions = new Cesium.Cartesian3(options.width, options.height, 1.0);
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

    }

    remove(){
        this.viewer.scene.primitives.remove(this.primitive)
    }


}