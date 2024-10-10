import * as Cesium from 'cesium'
import * as earcut from 'earcut'

type WGS84 = {
    lng:number
    lat:number
    alt?:number
}

type lineOption = {
    width?:number
    material?:any
    clampToGround?:boolean
}

type areaOption = {
    interpolation?:number
    clampToGround?:boolean
}

export class Measure{
    protected _viewer
    protected _drawLayer
    constructor(viewer:Cesium.Viewer) {
        this._viewer = viewer
        this._drawLayer = new Cesium.CustomDataSource('measureLayer')
        this._viewer.dataSources.add(this._drawLayer)
    }

    /**
     * 笛卡尔转WGS84
     * @param cartesian
     */
    transformCartesianToWGS84(cartesian:Cesium.Cartesian3) {
        if (this._viewer && cartesian) {
            let ellipsoid = Cesium.Ellipsoid.WGS84
            let cartographic = ellipsoid.cartesianToCartographic(cartesian)
            return {
                lng: Cesium.Math.toDegrees(cartographic.longitude),
                lat: Cesium.Math.toDegrees(cartographic.latitude),
                alt: cartographic.height
            }
        }
    }


    /**
     * WGS84转笛卡尔
     * @param position
     */
    transformWGS84ToCartesian(position:WGS84){
        if (this._viewer) {
            return position
                ? Cesium.Cartesian3.fromDegrees(
                    position.lng,
                    position.lat,
                    position.alt || 0,
                    Cesium.Ellipsoid.WGS84
                )
                : Cesium.Cartesian3.ZERO
        }
    }

    /**
     * 84坐标转弧度坐标
     * @param position
     */
    transformWGS84ToCartographic(position:WGS84){
        return position
            ? Cesium.Cartographic.fromDegrees(
                position.lng,
                position.lat,
                position.alt
            )
            : Cesium.Cartographic.ZERO
    }

    /**
     * 笛卡尔转84 数组
     * @param cartesianArr
     */
    transformCartesianArrayToWGS84Array(cartesianArr:Cesium.Cartesian3[]) {
        if (this._viewer) {
                let $this = this
                return cartesianArr
                    ? cartesianArr.map(function (item) { return $this.transformCartesianToWGS84(item) }) : []
        }
    }

    /**
     * 84转笛卡尔 数组
     * @param cartesianArr
     */
    transformWGS84ArrayToCartesianArray(WSG84Arr:WGS84[]){
        if (this._viewer && WSG84Arr) {
            let $this = this
            return WSG84Arr
                ? WSG84Arr.map(function (item) { return $this.transformWGS84ToCartesian(item) })
            : []
        }
    }

    /**
     * 获取屏幕坐标位置
     * @param px
     */
    getCartesian3FromPX(px:Cesium.Cartesian2){
        if (this._viewer && px) {
            var picks = this._viewer.scene.drillPick(px)
            var cartesian = null;
            var isOn3dtiles = false, isOnTerrain = false;
            // drillPick
            for (let i in picks) {
                let pick = picks[i]
                if (pick &&
                    pick.primitive instanceof Cesium.Cesium3DTileFeature
                    || pick && pick.primitive instanceof Cesium.Cesium3DTileset
                    || pick && pick.primitive instanceof Cesium.Model) { //模型上拾取
                    isOn3dtiles = true;
                }
                // 3dtilset
                if (isOn3dtiles) {
                    this._viewer.scene.pick(px) // pick
                    cartesian = this._viewer.scene.pickPosition(px);
                    if (cartesian) {
                        let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                        if (cartographic.height < 0) cartographic.height = 0;
                        let lon = Cesium.Math.toDegrees(cartographic.longitude)
                            , lat = Cesium.Math.toDegrees(cartographic.latitude)
                            , height = cartographic.height;
                        cartesian = this.transformWGS84ToCartesian({ lng: lon, lat: lat, alt: height })

                    }
                }
            }
            // 地形
            let boolTerrain = this._viewer.terrainProvider instanceof Cesium.EllipsoidTerrainProvider;
            // Terrain
            if (!isOn3dtiles && !boolTerrain) {
                var ray = this._viewer.scene.camera.getPickRay(px);
                if (!ray) return null;
                cartesian = this._viewer.scene.globe.pick(ray, this._viewer.scene);
                isOnTerrain = true
            }
            // 地球
            if (!isOn3dtiles && !isOnTerrain && boolTerrain) {
                cartesian = this._viewer.scene.camera.pickEllipsoid(px, this._viewer.scene.globe.ellipsoid);
            }
            if (cartesian) {
/*                let position = this.transformCartesianToWGS84(cartesian)
                if (position && position.alt < 0) {
                    cartesian = this.transformWGS84ToCartesian(position, 0.1)
                }*/
                return cartesian;
            }
            return false;
        }
    }

    /**
     * 考虑地球曲率的测量
     * @param positions
     */
    getPositionDistance (positions:any[]) {
        let distance = 0
        for (let i = 0; i < positions.length - 1; i++) {
            let point1cartographic = this.transformWGS84ToCartographic(positions[i])
            let point2cartographic = this.transformWGS84ToCartographic(positions[i + 1])
            let geodesic = new Cesium.EllipsoidGeodesic()
            geodesic.setEndPoints(point1cartographic, point2cartographic)
            let s = geodesic.surfaceDistance
            s = Math.sqrt(
                Math.pow(s, 2) +
                Math.pow(point2cartographic.height - point1cartographic.height, 2)
                )
            distance = distance + s
        }
        return distance
    }

    /**
     * 考虑地形的测量
     * @param positions
     */
    getPositionDistanceTerrain(positions:any[]){
        let $this = this
        return new Promise((resolve) => {
            let lerpArray = [];
            for(let j = 1 ; j < positions.length ; j++) {

                let start = $this.transformWGS84ToCartesian(positions[j-1])
                let end = $this.transformWGS84ToCartesian(positions[j])

                if(start && end) {
                    //插值个数
                    let splitNum = parseInt(Cesium.Cartesian3.distance(start, end).toString());
                    let startCartographic = Cesium.Cartographic.fromCartesian(start);
                    let startDegrees = [startCartographic.longitude, startCartographic.latitude];
                    let endCartographic = Cesium.Cartographic.fromCartesian(end);
                    let endDegrees = [endCartographic.longitude, endCartographic.latitude];
                    lerpArray.push(new Cesium.Cartographic(startDegrees[0], startDegrees[1]));
                    for (let i = 1; i <= splitNum - 1; i++) {
                        let x = Cesium.Math.lerp(startDegrees[0], endDegrees[0], i / splitNum);
                        let y = Cesium.Math.lerp(startDegrees[1], endDegrees[1], i / splitNum);
                        lerpArray.push(new Cesium.Cartographic(x, y));
                    }
                }
            }

            //地形细节采样：传入 目标地形 和 制图坐标插值组（不贴附地形） 获取 贴地形的制图坐标插值组 再计算距离
            Cesium.sampleTerrainMostDetailed($this._viewer.terrainProvider, lerpArray).then((cartographicArr) => {
                $this.getDetailedTerrainDistance(cartographicArr).then((distance) => {
                    resolve(distance);
                });
            })
        })
    }

    getDetailedTerrainDistance(cartographicArr:Cesium.Cartographic[]) {
        return new Promise((resolve) => {
            let terrainDistance = 0;
            cartographicArr.map((currentCartographic, index) => {
                if (index == cartographicArr.length - 1) {
                    return;
                }
                let nextCartographic = cartographicArr[index + 1];
                let currentPosition = Cesium.Cartesian3.fromRadians(currentCartographic.longitude, currentCartographic.latitude, currentCartographic.height);
                let nextPosition = Cesium.Cartesian3.fromRadians(nextCartographic.longitude, nextCartographic.latitude, nextCartographic.height);
                terrainDistance += Cesium.Cartesian3.distance(currentPosition, nextPosition);
            });
            resolve(terrainDistance);
        });
    }

    //耳切法获取多边形的三角形
    getTriangles(positions:any[]){
        let array = positions.map((item:any) => {return [item.lng,item.lat]})
        const data = earcut.flatten([array]);
        const triangleIndexs = earcut.default(data.vertices, data.holes, data.dimensions);
        let triangles = []
        for(let i = 0 ; i < triangleIndexs.length ; i+=3){
            triangles.push({
                p1:positions[triangleIndexs[i]],
                p2:positions[triangleIndexs[i+1]],
                p3:positions[triangleIndexs[i+2]]
            })
        }

        return triangles
    }

    /**
     * 计算三角形面积
     * @param triangles
     */
    getTriangleArea(triangles:any){
        let p1 = Cesium.Cartesian3.fromDegrees(triangles.p1.lng,triangles.p1.lat,triangles.p1.alt)
        let p2 = Cesium.Cartesian3.fromDegrees(triangles.p2.lng,triangles.p2.lat,triangles.p2.alt)
        let p3 = Cesium.Cartesian3.fromDegrees(triangles.p3.lng,triangles.p3.lat,triangles.p3.alt)
/*        let p1 = new Cesium.Cartesian3(1,0,0)
        let p2 = new Cesium.Cartesian3(0,1,0)
        let p3 = new Cesium.Cartesian3(0,0,0)*/
        const AB = new Cesium.Cartesian3(
            p2.x - p1.x,
            p2.y - p1.y,
            p2.z - p1.z
        );
        // 向量 AC
        const AC = new Cesium.Cartesian3(
            p3.x - p1.x,
            p3.y - p1.y,
            p3.z - p1.z
        );
        // 计算叉积 AB × AC
        const crossProduct = Cesium.Cartesian3.cross(AB, AC, new Cesium.Cartesian3());

        // 计算叉积向量的模长
        const crossMagnitude = Cesium.Cartesian3.magnitude(crossProduct);

        // 三角形面积为平行四边形面积的一半
        const area = 0.5 * crossMagnitude;

        return area;
    }

    //使用耳切法计算面积
    getPositionArea(positions:any[]){
        let triangles = this.getTriangles(positions)
        let area = 0
        for(let i = 0 ; i < triangles.length ; i++){
            area += this.getTriangleArea(triangles[i])
        }
        return area
    }

    getHeight(point:any){
        if(this._viewer){
            const cartographic = Cesium.Cartographic.fromDegrees(point.lng, point.lat);
            const height = this._viewer.scene.globe.getHeight(cartographic);
            return height
        }
        return 0
    }


    getPositionAreaClampToGround(positions:any[],interpolation:number){
        let triangles = this.getTriangles(positions)
        let area = 0
        for(let i = 0 ; i < triangles.length ; i ++ ){
            let divideTriangles = this.subdivideTriangle(triangles[i],interpolation)
            for(let j = 0 ; j < divideTriangles.length ; j++){
                area += this.getTriangleArea(divideTriangles[j])
            }
        }
        return area
    }

    /**
     * 分割三角形
     */
    subdivideTriangle(triangle:any, depth:number) {
        if (depth === 0) {
            // 当达到递归深度时，返回当前三角形
            return [triangle];
        }

        // 计算三角形的三个边的中点
        const centroid = this.getTriangleCenter(triangle);

        // 用中点分割成三个小三角形
        const triangles:any[] = [
            this.subdivideTriangle({p1:triangle.p1,p2:centroid,p3:triangle.p3}, depth - 1), // 小三角形1
            this.subdivideTriangle({p1:triangle.p1,p2:triangle.p2,p3:centroid}, depth - 1), // 小三角形2
            this.subdivideTriangle({p1:centroid,p2:triangle.p2,p3:triangle.p3}, depth - 1), // 小三角形3
        ];

        // 返回当前深度下的所有三角形
        return triangles.flat();
    }


    /**
     * 获取中点
     */

    getMidpoint(p1:any, p2:any) {
        // 计算两个点的中点
        return {
            lng: (p1.lng+p2.lng) / 2,
            lat: (p1.lat+p2.lat) / 2,
            alt: 0
        }
    }

    /**
     * 获取三角形中点
     */
    getTriangleCenter(triangle:any){
        let lng = (triangle.p1.lng + triangle.p2.lng + triangle.p3.lng) / 3
        let lat = (triangle.p1.lat + triangle.p2.lat + triangle.p3.lat) / 3
/*        if(this._viewer){
            this._viewer.entities.add({
                position:Cesium.Cartesian3.fromDegrees(lng,lat,this.getHeight({lng:lng,lat:lat})),
                point:{
                    pixelSize:10,
                    color:Cesium.Color.fromCssColorString("#FFFFFF")
                }
            })
        }*/
        return {
            lng:lng,
            lat:lat,
            alt: this.getHeight({lng:lng,lat:lat})
        }
    }


    /**
     * 面积测量
     * @param option
     */
    startMeasureArea(options:areaOption = {}){
        if (this._viewer && options) {
            let _tooltip = document.createElement("div")
            _tooltip.classList.add("measure-tooltip")
            _tooltip.style.left = "-10000px"
            _tooltip.style.top = "-10000px"
            _tooltip.innerHTML = "单击 开始绘制"
            this._viewer.cesiumWidget.container.append(_tooltip)
            let positions:any[] = []
            let polygon = new Cesium.PolygonHierarchy()
            let $this = this
            let _handler = new Cesium.ScreenSpaceEventHandler(this._viewer.scene.canvas);
            // left
            _handler.setInputAction(function (movement:Cesium.ScreenSpaceEventHandler.PositionedEvent) {
                _tooltip.innerHTML = "单击增加点，右键结束"
                var cartesian = $this.getCartesian3FromPX(movement.position);
                if (cartesian && cartesian.x) {
                    if (positions.length == 0) {
                        polygon.positions.push(cartesian.clone())
                        positions.push(cartesian.clone());
                    }
                    positions.push(cartesian.clone());
                    polygon.positions.push(cartesian.clone())
                }
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
            // mouse
            _handler.setInputAction(function (movement:Cesium.ScreenSpaceEventHandler.MotionEvent) {
                _tooltip.style.left = movement.endPosition.x + 20 + "px";
                _tooltip.style.top = movement.endPosition.y - 10 + "px";
                var cartesian = $this.getCartesian3FromPX(movement.endPosition);
                // var cartesian = $this._viewer.scene.camera.pickEllipsoid(movement.endPosition, $this._viewer.scene.globe.ellipsoid);
                if (positions.length >= 2) {
                    if (cartesian && cartesian.x) {
                        positions.pop()
                        positions.push(cartesian);
                        polygon.positions.pop()
                        polygon.positions.push(cartesian);
                    }
                }
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

            // right
            _handler.setInputAction(function (movement:Cesium.ScreenSpaceEventHandler.PositionedEvent) {

                _handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE)
                _handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
                _handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK)
                _tooltip.remove()

                _handler.destroy();

                positions.push(positions[0]);

                // 添加信息点
                _addInfoPoint(positions[0])

            }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);


            $this._drawLayer.entities.add({
                polyline:{
                    positions:new Cesium.CallbackProperty(function () {
                        return positions
                    }, false)
                    , width: 3
                    , material: Cesium.Color.BLUE.withAlpha(0.8)
                    , clampToGround: true
                },
                polygon:{
                    hierarchy: new Cesium.CallbackProperty(function () {
                        return polygon
                    }, false),
                    heightReference:Cesium.HeightReference.NONE,
                    material: Cesium.Color.fromCssColorString("rgba(12,12,235,0.2)")
                }
            })


            function _addInfoPoint(position:any) {
                let positionWGS84 = $this.transformCartesianArrayToWGS84Array(positions)
                if(positionWGS84) {
                    let area = $this.getPositionArea(positionWGS84)
                    if(options.clampToGround && options.interpolation){
                        area= $this.getPositionAreaClampToGround(positionWGS84,options.interpolation)
                    }
                    $this._drawLayer.entities.add({
                        position: position,
                        point: {
                            pixelSize: 5,
                            outlineColor: Cesium.Color.BLUE,
                            outlineWidth: 2
                        },
                        label: {
                            text: area > 1000000 ? (area / 1000000.0).toFixed(4) + '平方公里' : area.toFixed(4) + "平方米",
                            show: true,
                            showBackground: true,
                            backgroundColor: Cesium.Color.fromCssColorString("rgba(12,12,235,0.2)"),
                            font: '800 14px sans-serif',
                            horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                            pixelOffset: new Cesium.Cartesian2(-10, -30) //left top
                        }
                    })
                }
            }
        }
    }


    /**
     * 长度测量
     * @param options clampToGround控制着是否贴地测量
     */
    startMeasureLine(options:lineOption = {}) {
        if (this._viewer && options) {
            //增加tooptip
            let _tooltip = document.createElement("div")
            _tooltip.classList.add("measure-tooltip")
            _tooltip.style.left = "-10000px"
            _tooltip.style.top = "-10000px"
            _tooltip.innerHTML = "单击 开始绘制"
            this._viewer.cesiumWidget.container.append(_tooltip)

            let positions:Cesium.Cartesian3[] = []
            let $this = this
            let _handlers = new Cesium.ScreenSpaceEventHandler(this._viewer.scene.canvas)
            // left
            _handlers.setInputAction(function (movement:Cesium.ScreenSpaceEventHandler.PositionedEvent) {

                var cartesian = $this.getCartesian3FromPX(movement.position);
                if (cartesian && cartesian.x) {
                    if (positions.length == 0) {
                        positions.push(cartesian.clone());
                    }
                    _tooltip.innerHTML = "单击增加点，右键结束"
                    // 添加量测信息点
                    _addInfoPoint(cartesian)
                    positions.push(cartesian);
                }
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

            _handlers.setInputAction(function (movement:Cesium.ScreenSpaceEventHandler.MotionEvent) {
                let cartesian = $this.getCartesian3FromPX(movement.endPosition);
                _tooltip.style.left = movement.endPosition.x + 20 + "px";
                _tooltip.style.top = movement.endPosition.y - 10 + "px";
                if (positions.length >= 2) {
                    if (cartesian && cartesian.x) {
                        positions.pop();
                        positions.push(cartesian);
                    }
                }
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
            // right
            _handlers.setInputAction(function (movement:Cesium.ScreenSpaceEventHandler.PositionedEvent) {

                _handlers.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE)
                _handlers.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
                _handlers.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK)

                _tooltip.remove()

                let cartesian = $this.getCartesian3FromPX(movement.position);
                if(cartesian) {
                    _addInfoPoint(cartesian)
                }

            }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);


            let _lineEntity = this._drawLayer.entities.add({
                polyline:{
                    width: options.width || 2
                    , material: options.material || Cesium.Color.BLUE.withAlpha(0.8)
                    , clampToGround: options.clampToGround || false
                }
            })
            if(_lineEntity.polyline) {
                _lineEntity.polyline.positions = new Cesium.CallbackProperty(function () {
                    return positions
                }, false)
            }

            //添加坐标点
            function _addInfoPoint(position:Cesium.Cartesian3) {
                let _labelEntity = $this._drawLayer.entities.add({
                    position:position,
                    point:{
                        pixelSize: 5,
                        outlineColor: Cesium.Color.BLUE,
                        outlineWidth: 2
                    },
                    label:{
                        show: true,
                        showBackground: true,
                        backgroundColor:Cesium.Color.fromCssColorString("rgba(12,12,235,0.2)"),
                        font: '800 14px sans-serif',
                        horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                        pixelOffset: new Cesium.Cartesian2(-10, -30) //left top
                    }
                })
                let positionWGS84 = $this.transformCartesianArrayToWGS84Array(positions)
                if(positionWGS84) {
                    if(!options.clampToGround) {
                        if(_labelEntity.label) {
                            let distance = $this.getPositionDistance(positionWGS84)
                            _labelEntity.label.text = new Cesium.ConstantProperty( distance > 1000 ? (distance/ 1000).toFixed(4) + "公里" : distance + "米")
                        }
                    }else{
                        if($this._viewer.terrainProvider instanceof Cesium.EllipsoidTerrainProvider){
                            if(_labelEntity.label) {
                                let distance = $this.getPositionDistance(positionWGS84)
                                _labelEntity.label.text = new Cesium.ConstantProperty( distance > 1000 ? (distance/ 1000).toFixed(4) + "公里" : distance + "米")
                            }
                        }else {
                            $this.getPositionDistanceTerrain(positionWGS84).then(res => {
                                let distance = res
                                if (_labelEntity.label && typeof distance == "number") {
                                    _labelEntity.label.text = new Cesium.ConstantProperty(distance > 1000 ? (distance / 1000).toFixed(4) + "公里" : distance + "米")
                                }
                            })
                        }
                    }
                }
            }
        }
    }


}