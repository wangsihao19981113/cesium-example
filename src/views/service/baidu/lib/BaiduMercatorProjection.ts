
const MC_BAND = [12890594.86, 8362377.87, 5591021, 3481989.83, 1678043.12, 0]
const LL_BAND = [75, 60, 45, 30, 15, 0]
const MC2LL = [
    [
        1.410526172116255e-8,
        8.98305509648872e-6,
        -1.9939833816331,
        2.009824383106796e2,
        -1.872403703815547e2,
        91.6087516669843,
        -23.38765649603339,
        2.57121317296198,
        -0.03801003308653,
        1.73379812e7
    ],
    [
        -7.435856389565537e-9,
        8.983055097726239e-6,
        -0.78625201886289,
        96.32687599759846,
        -1.85204757529826,
        -59.36935905485877,
        47.40033549296737,
        -16.50741931063887,
        2.28786674699375,
        1.026014486e7
    ],
    [
        -3.030883460898826e-8,
        8.98305509983578e-6,
        0.30071316287616,
        59.74293618442277,
        7.357984074871,
        -25.38371002664745,
        13.45380521110908,
        -3.29883767235584,
        0.32710905363475,
        6.85681737e6
    ],
    [
        -1.981981304930552e-8,
        8.983055099779535e-6,
        0.03278182852591,
        40.31678527705744,
        0.65659298677277,
        -4.44255534477492,
        0.85341911805263,
        0.12923347998204,
        -0.04625736007561,
        4.48277706e6
    ],
    [
        3.09191371068437e-9,
        8.983055096812155e-6,
        0.00006995724062,
        23.10934304144901,
        -0.00023663490511,
        -0.6321817810242,
        -0.00663494467273,
        0.03430082397953,
        -0.00466043876332,
        2.5551644e6
    ],
    [
        2.890871144776878e-9,
        8.983055095805407e-6,
        -0.00000003068298,
        7.47137025468032,
        -0.00000353937994,
        -0.02145144861037,
        -0.00001234426596,
        0.00010322952773,
        -0.00000323890364,
        8.260885e5
    ]
]
const LL2MC = [
    [
        -0.0015702102444,
        1.113207020616939e5,
        1.704480524535203e15,
        -1.033898737604234e16,
        2.611266785660388e16,
        -3.51496691766537e16,
        2.659570071840392e16,
        -1.072501245418824e16,
        1.800819912950474e15,
        82.5
    ],
    [
        8.277824516172526e-4,
        1.113207020463578e5,
        6.477955746671608e8,
        -4.082003173641316e9,
        1.077490566351142e10,
        -1.517187553151559e10,
        1.205306533862167e10,
        -5.124939663577472e9,
        9.133119359512032e8,
        67.5
    ],
    [
        0.00337398766765,
        1.113207020202162e5,
        4.481351045890365e6,
        -2.339375119931662e7,
        7.968221547186455e7,
        -1.159649932797253e8,
        9.723671115602145e7,
        -4.366194633752821e7,
        8.477230501135234e6,
        52.5
    ],
    [
        0.00220636496208,
        1.113207020209128e5,
        5.175186112841131e4,
        3.796837749470245e6,
        9.920137397791013e5,
        -1.22195221711287e6,
        1.340652697009075e6,
        -6.209436990984312e5,
        1.444169293806241e5,
        37.5
    ],
    [
        -3.441963504368392e-4,
        1.113207020576856e5,
        2.782353980772752e2,
        2.485758690035394e6,
        6.070750963243378e3,
        5.482118345352118e4,
        9.540606633304236e3,
        -2.71055326746645e3,
        1.405483844121726e3,
        22.5
    ],
    [
        -3.218135878613132e-4,
        1.113207020701615e5,
        0.00369383431289,
        8.237256402795718e5,
        0.46104986909093,
        2.351343141331292e3,
        1.58060784298199,
        8.77738589078284,
        0.37238884252424,
        7.45
    ]
]

class BaiduMercatorProjection {
    private isWgs84
    constructor() {
        this.isWgs84 = false
    }

    convertMC2LL(point) {
        if (!point) {
            return { lng: 0, lat: 0 }
        }
        let lnglat:any = {}
        if (this.isWgs84) {
            lnglat.lng = (point.lng / 20037508.34) * 180
            let mmy = (point.lat / 20037508.34) * 180
            lnglat.lat =
                (180 / Math.PI) *
                (2 * Math.atan(Math.exp((mmy * Math.PI) / 180)) - Math.PI / 2)
            return {
                lng: lnglat['lng'].toFixed(6),
                lat: lnglat['lat'].toFixed(6)
            }
        }

        let temp = {
            lng: Math.abs(point['lng']),
            lat: Math.abs(point['lat'])
        }

        let factor = undefined
        for (let i = 0; i < MC_BAND.length; i++) {
            if (temp['lat'] >= MC_BAND[i]) {
                factor = MC2LL[i]
                break
            }
        }
        lnglat = this.convertor(point, factor)
        return {
            lng: lnglat['lng'].toFixed(6),
            lat: lnglat['lat'].toFixed(6)
        }
    }

    convertLL2MC(point) {
        if (!point) {
            return { lng: 0, lat: 0 }
        }
        if (
            point['lng'] > 180 ||
            point['lng'] < -180 ||
            point['lat'] > 90 ||
            point['lat'] < -90
        ) {
            return point
        }

        if (this.isWgs84) {
            let mercator:any = {}
            let earthRad = 6378137.0
            mercator.lng = ((point.lng * Math.PI) / 180) * earthRad
            let a = (point.lat * Math.PI) / 180
            mercator.lat =
                (earthRad / 2) * Math.log((1.0 + Math.sin(a)) / (1.0 - Math.sin(a)))

            return {
                lng: parseFloat(mercator['lng'].toFixed(2)),
                lat: parseFloat(mercator['lat'].toFixed(2))
            }
        }

        point['lng'] = this.getLoop(point['lng'], -180, 180)
        point['lat'] = this.getRange(point['lat'], -74, 74)
        let temp = { lng: point['lng'], lat: point['lat'] }
        let factor = undefined
        for (let i = 0; i < LL_BAND.length; i++) {
            if (temp['lat'] >= LL_BAND[i]) {
                factor = LL2MC[i]
                break
            }
        }
        if (!factor) {
            for (let i = 0; i < LL_BAND.length; i++) {
                if (temp['lat'] <= -LL_BAND[i]) {
                    factor = LL2MC[i]
                    break
                }
            }
        }
        let mc = this.convertor(point, factor)
        return {
            lng: parseFloat(mc['lng'].toFixed(2)),
            lat: parseFloat(mc['lat'].toFixed(2))
        }
    }


    convertor(fromPoint, factor) {
        if (!fromPoint || !factor) {
            return { lng: 0, lat: 0 }
        }
        let x = factor[0] + factor[1] * Math.abs(fromPoint['lng'])
        let temp = Math.abs(fromPoint['lat']) / factor[9]
        let y =
            factor[2] +
            factor[3] * temp +
            factor[4] * temp * temp +
            factor[5] * temp * temp * temp +
            factor[6] * temp * temp * temp * temp +
            factor[7] * temp * temp * temp * temp * temp +
            factor[8] * temp * temp * temp * temp * temp * temp
        x *= fromPoint['lng'] < 0 ? -1 : 1
        y *= fromPoint['lat'] < 0 ? -1 : 1
        return {
            lng: x,
            lat: y
        }
    }

    getRange(v, a, b) {
        if (a != null) {
            v = Math.max(v, a)
        }
        if (b != null) {
            v = Math.min(v, b)
        }
        return v
    }

    getLoop(v, a, b) {
        while (v > b) {
            v -= b - a
        }
        while (v < a) {
            v += b - a
        }
        return v
    }


    lngLatToMercator(point) {
        return this.convertLL2MC(point)
    }

    mercatorToLngLat(point) {
        return this.convertMC2LL(point)
    }
}

export default BaiduMercatorProjection