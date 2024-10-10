import * as Cesium from "cesium"


type HtmlOption = {
    html:HTMLElement
    position:Cesium.Cartesian3
    horizontalOrigin:Cesium.HorizontalOrigin
    verticalOrigin:Cesium.VerticalOrigin
}
export class HtmlPoint{
    private viewer
    private postRender
    private html
    private position
    private horizontalOrigin
    private verticalOrigin
    constructor(viewer:Cesium.Viewer,options:HtmlOption) {
        this.viewer = viewer
        this.html = options.html
        this.position = options.position
        this.horizontalOrigin = options.horizontalOrigin
        this.verticalOrigin = options.verticalOrigin
        this.add(options)
    }
    add(options:HtmlOption){
        this.viewer.cesiumWidget.container.append(options.html)
        let postRenderFun = () => {
            if (!this.html || !this.html.style) return
            const canvasHeight = this.viewer.scene.canvas.height
            const windowPosition = new Cesium.Cartesian2()
            Cesium.SceneTransforms.wgs84ToWindowCoordinates(
                this.viewer.scene,
                this.position,
                windowPosition
            )
            this.html.style.position = "absolute"
            switch (this.verticalOrigin){
                case Cesium.VerticalOrigin.BOTTOM:
                case Cesium.VerticalOrigin.BASELINE:
                    this.html.style.bottom = canvasHeight - windowPosition.y + 'px'
                    break
                case Cesium.VerticalOrigin.TOP:
                    this.html.style.bottom = canvasHeight - windowPosition.y - this.html.clientHeight + 'px'
                    break
                case Cesium.VerticalOrigin.CENTER:
                    this.html.style.bottom = canvasHeight - windowPosition.y - this.html.clientHeight / 2 + 'px'
                    break
            }
            switch (this.horizontalOrigin){
                case Cesium.HorizontalOrigin.LEFT:
                    this.html.style.left = windowPosition.x + 'px'
                    break
                case Cesium.HorizontalOrigin.RIGHT:
                    this.html.style.left = windowPosition.x - this.html.clientWidth + 'px'
                    break
                case Cesium.HorizontalOrigin.CENTER:
                    this.html.style.left = windowPosition.x - this.html.clientWidth / 2 + 'px'
                    break
            }


        }
        this.postRender = this.viewer.scene.postRender.addEventListener(postRenderFun)
    }

    remove(){
        this.html.remove()
        this.postRender()
    }
}