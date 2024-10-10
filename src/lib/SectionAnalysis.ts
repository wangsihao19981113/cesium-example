import * as Cesium from 'cesium'

/**
 * 剖面分析
 */
export class SectionAnalysis{
    protected viewer
    protected tileset
    protected clippingPlanes:Cesium.ClippingPlaneCollection | null
    protected transfrom:Cesium.Matrix4 | null

    /**
     * 构造函数
     * @param viewer
     * @param tileset
     * @param transfrom
     */
    constructor(viewer:Cesium.Viewer,tileset:Cesium.Cesium3DTileset,transfrom?:Cesium.Matrix4) {
        this.viewer = viewer;
        this.tileset = tileset
        this.clippingPlanes = null
        if(transfrom){
            this.transfrom = transfrom
        }else{
            this.transfrom = null
        }
        if(viewer && tileset){
            this.startAnalysis()
        }
    }

    startAnalysis(){
        let $this = this
        let viewer = this.viewer
        let scene = this.viewer.scene;
        let tileset = this.tileset;
        let targetY = 0.0;
        let viewModel = {
            debugBoundingVolumesEnabled: false,
            edgeStylingEnabled: true,
        };

        let downHandler = new Cesium.ScreenSpaceEventHandler(
            scene.canvas
        );
        let selectedPlane : any;
        downHandler.setInputAction(function (movement:Cesium.ScreenSpaceEventHandler.PositionedEvent) {
            const pickedObject = scene.pick(movement.position);
            if (
                Cesium.defined(pickedObject) &&
                Cesium.defined(pickedObject.id) &&
                Cesium.defined(pickedObject.id.plane)
            ) {
                selectedPlane = pickedObject.id.plane;
                selectedPlane.material = Cesium.Color.WHITE.withAlpha(0.05);
                selectedPlane.outlineColor = Cesium.Color.RED;
                scene.screenSpaceCameraController.enableInputs = false;
            }
        }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

        let upHandler = new Cesium.ScreenSpaceEventHandler(
            scene.canvas
        );

        upHandler.setInputAction(function () {
            if (Cesium.defined(selectedPlane)) {
                selectedPlane.material = Cesium.Color.WHITE.withAlpha(0.1);
                selectedPlane.outlineColor = Cesium.Color.RED;
                selectedPlane = undefined;
            }
            scene.screenSpaceCameraController.enableInputs = true;
        }, Cesium.ScreenSpaceEventType.LEFT_UP);

        let moveHandler = new Cesium.ScreenSpaceEventHandler(
            viewer.scene.canvas
        );
        moveHandler.setInputAction(function (movement:Cesium.ScreenSpaceEventHandler.MotionEvent) {
            if (Cesium.defined(selectedPlane)) {
                const deltaY = movement.startPosition.y - movement.endPosition.y;
                targetY += deltaY;
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        function createPlaneUpdateFunction(plane:any) {
            return function () {
                plane.distance = targetY;
                return plane;
            };
        }

        let clippingPlanes = new Cesium.ClippingPlaneCollection({
            planes: [
                new Cesium.ClippingPlane(
                    new Cesium.Cartesian3(0.0, 0.0, -1.0),
                    0.0
                ),
            ],
            edgeWidth: viewModel.edgeStylingEnabled ? 1.0 : 0.0,
        });

        tileset.clippingPlanes = clippingPlanes;
        this.clippingPlanes = clippingPlanes;

        tileset.debugShowBoundingVolume =
            viewModel.debugBoundingVolumesEnabled;
        return tileset.readyPromise
            .then(function () {

                const boundingSphere = tileset.boundingSphere;
                const radius = boundingSphere.radius;

                if($this.transfrom) {
                    tileset.root.transform = $this.transfrom
                }

                if (
                    !Cesium.Matrix4.equals(
                        tileset.root.transform,
                        Cesium.Matrix4.IDENTITY
                    )
                ) {
                    // The clipping plane is initially positioned at the tileset's root transform.
                    // Apply an additional matrix to center the clipping plane on the bounding sphere center.
                    const transformCenter = Cesium.Matrix4.getTranslation(
                        tileset.root.transform,
                        new Cesium.Cartesian3()
                    );
                    const transformCartographic = Cesium.Cartographic.fromCartesian(
                        transformCenter
                    );
                    const boundingSphereCartographic = Cesium.Cartographic.fromCartesian(
                        tileset.boundingSphere.center
                    );
                    const height =
                        boundingSphereCartographic.height -
                        transformCartographic.height;
                    clippingPlanes.modelMatrix = Cesium.Matrix4.fromTranslation(
                        new Cesium.Cartesian3(0.0, 0.0, height)
                    );
                }

                for (let i = 0; i < clippingPlanes.length; ++i) {
                    const plane = clippingPlanes.get(i);
                     viewer.entities.add({
                        position: boundingSphere.center,
                        plane: {
                            dimensions: new Cesium.Cartesian2(
                                radius * 2.5,
                                radius * 2.5
                            ),
                            material: Cesium.Color.WHITE.withAlpha(0.1),
                            plane: new Cesium.CallbackProperty(
                                createPlaneUpdateFunction(plane),
                                false
                            ),
                            outline: true,
                            outlineColor: Cesium.Color.RED,
                        },
                    });
                }
                return tileset;
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    remove(){
        let viewer = this.viewer;
        viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOWN);
        viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_UP);
        if(this.clippingPlanes)
        this.clippingPlanes.removeAll()
    }

}

export default  SectionAnalysis