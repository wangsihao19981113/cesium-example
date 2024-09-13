import BaiduMercatorTilingScheme from './BaiduMercatorTilingScheme'
// 影像底图
const IMG_URL = 'http:shangetu{s}.map.bdimg.com/it/u=x={x};y={y};z={z};v=009;type=sate&fm=46'
// 影像标注
const IMG_LABEL_URL = 'http:maponline{s}.bdimg.com/tile/?x={x}&y={y}&z={z}&qt=vtile&styles=sl&showtext=1&scaler=2&v=083'
// 电子底图无标注
const VEC_URL ='http:maponline{s}.bdimg.com/tile/?x={x}&y={y}&z={z}&qt=vtile&styles=pl&showtext=0&scaler=1&v=083'
// 电子地图有标注
const VEC_LABEL_URL ='http:maponline{s}.bdimg.com/tile/?x={x}&y={y}&z={z}&qt=vtile&styles=pl&showtext=1&scaler=2&v=083'

import * as Cesium from 'cesium'

class BaiduImageryProvider {
    constructor(options = {}) {
        switch(options.type) {
            case 'img_w':
                this._url = IMG_URL
                break
            case 'img_label_w':
                this._url = IMG_LABEL_URL
                break
            case 'vec_w':
                this._url = VEC_URL
                break
            case 'vec_label_w':
                this._url = VEC_LABEL_URL
                break
        }
        this._tileWidth = 256
        this._tileHeight = 256
        this._maximumLevel = 18
        this._crs = options.crs || 'BD09'
        if (options.crs === 'WGS84') {
            let resolutions = []
            for (let i = 0; i < 19; i++) {
                resolutions[i] = 256 * Math.pow(2, 18 - i)
            }
            this._tilingScheme = new BaiduMercatorTilingScheme({
                resolutions,
                rectangleSouthwestInMeters: new Cesium.Cartesian2(
                    -20037726.37,
                    -12474104.17
                ),
                rectangleNortheastInMeters: new Cesium.Cartesian2(
                    20037726.37,
                    12474104.17
                )
            })
        } else {
            this._tilingScheme = new Cesium.WebMercatorTilingScheme({
                rectangleSouthwestInMeters: new Cesium.Cartesian2(-33554054, -33746824),
                rectangleNortheastInMeters: new Cesium.Cartesian2(33554054, 33746824)
            })
        }
        this._rectangle = this._tilingScheme.rectangle
        this._credit = undefined
        this._style = options.style || 'normal'
    }

    get url() {
        return this._url
    }

    get token() {
        return this._token
    }

    get tileWidth() {
        if (!this.ready) {
            throw new Cesium.DeveloperError(
                'tileWidth must not be called before the imagery provider is ready.'
            )
        }
        return this._tileWidth
    }

    get tileHeight() {
        if (!this.ready) {
            throw new Cesium.DeveloperError(
                'tileHeight must not be called before the imagery provider is ready.'
            )
        }
        return this._tileHeight
    }

    get maximumLevel() {
        if (!this.ready) {
            throw new Cesium.DeveloperError(
                'maximumLevel must not be called before the imagery provider is ready.'
            )
        }
        return this._maximumLevel
    }

    get minimumLevel() {
        if (!this.ready) {
            throw new Cesium.DeveloperError(
                'minimumLevel must not be called before the imagery provider is ready.'
            )
        }
        return 0
    }

    get tilingScheme() {
        if (!this.ready) {
            throw new Cesium.DeveloperError(
                'tilingScheme must not be called before the imagery provider is ready.'
            )
        }
        return this._tilingScheme
    }

    get rectangle() {
        if (!this.ready) {
            throw new Cesium.DeveloperError(
                'rectangle must not be called before the imagery provider is ready.'
            )
        }
        return this._rectangle
    }

    get ready() {
        return !!this._url
    }

    get credit() {
        return this._credit
    }

    get hasAlphaChannel() {
        return true
    }

    getTileCredits(x, y, level) {}

    requestImage(x, y, level) {
        if (!this.ready) {
            throw new Cesium.DeveloperError(
                'requestImage must not be called before the imagery provider is ready.'
            )
        }
        let xTiles = this._tilingScheme.getNumberOfXTilesAtLevel(level)
        let yTiles = this._tilingScheme.getNumberOfYTilesAtLevel(level)
        let url = this._url
            .replace('{z}', level)
            .replace('{s}', String(1))
        if (this._crs === 'WGS84') {
            url = url.replace('{x}', String(x)).replace('{y}', String(-y))
        } else {
            url = url
                .replace('{x}', String(x - xTiles / 2))
                .replace('{y}', String(yTiles / 2 - y - 1))
        }
        return Cesium.ImageryProvider.loadImage(this, url)
    }
}

export default BaiduImageryProvider