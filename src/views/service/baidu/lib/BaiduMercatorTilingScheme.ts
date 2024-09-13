import BaiduMercatorProjection from './BaiduMercatorProjection'
import gcoord from 'gcoord';
import * as Cesium from 'cesium'

class BaiduMercatorTilingScheme extends Cesium.WebMercatorTilingScheme {
  constructor(options) {
    super(options)
    let projection = new BaiduMercatorProjection()
    this._projection.project = function(cartographic, result) {
      result = result || {}
      // wgs84坐标系转BD09坐标系
      result = gcoord.transform([
        Cesium.Math.toDegrees(cartographic.longitude),
         Cesium.Math.toDegrees(cartographic.latitude)
      ], gcoord.WGS84, gcoord.BD09)
 
 
      result[0] = Math.min(result[0], 180)
      result[0] = Math.max(result[0], -180)
      result[1] = Math.min(result[1], 74.000022)
      result[1] = Math.max(result[1], -71.988531)
 
 
      result = projection.lngLatToMercator({
        lng: result[0],
        lat: result[1]
      })
      return new Cesium.Cartesian2(result.lng, result.lat)
    }
    this._projection.unproject = function(cartesian:Cesium.Cartesian3, result) {
      result = result || {}
      result = projection.mercatorToLngLat({
        lng: cartesian.x,
        lat: cartesian.y
      })
      // BD09坐标系转wgs84坐标系
      result = gcoord.transform([
        result.lng,
        result.lat
      ], gcoord.BD09, gcoord.WGS84)
 
 
      return new Cesium.Cartographic(
        Cesium.Math.toRadians(result[0]),
        Cesium.Math.toRadians(result[1])
      )
    }
    this.resolutions = options.resolutions || []
  }
 
 
  tileXYToNativeRectangle(x:number, y:number, level:number, result:any) {
    const tileWidth = this.resolutions[level]
    const west = x * tileWidth
    const east = (x + 1) * tileWidth
    const north = ((y = -y) + 1) * tileWidth
    const south = y * tileWidth
 
 
    if (!Cesium.defined(result)) {
      return new Cesium.Rectangle(west, south, east, north)
    }
 
 
    result.west = west
    result.south = south
    result.east = east
    result.north = north
    return result
  }
 
 
  positionToTileXY(position, level, result) {
    const rectangle = this._rectangle
    if (!Cesium.Rectangle.contains(rectangle, position)) {
      return undefined
    }
    const projection = this._projection
    const webMercatorPosition = projection.project(position)
    if (!Cesium.defined(webMercatorPosition)) {
      return undefined
    }
    const tileWidth = this.resolutions[level]
    const xTileCoordinate = Math.floor(webMercatorPosition.x / tileWidth)
    const yTileCoordinate = -Math.floor(webMercatorPosition.y / tileWidth)
    if (!Cesium.defined(result)) {
      return new Cesium.Cartesian2(xTileCoordinate, yTileCoordinate)
    }
    result.x = xTileCoordinate
    result.y = yTileCoordinate
    return result
  }
}
 
 
export default BaiduMercatorTilingScheme