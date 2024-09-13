export type TyphoonRoute = {
    begin_time: string
    ename: string
    end_time: string
    ident: string
    is_current: 1
    land: any[]
    name: string
    points: TyphoonPoint[]
    tfbh: string
}

export type TyphoonPoint = {
    id?: string
    time: string
    lng: number
    lat: number
    strong: string
    power: number
    speed: number
    move_dir: string
    move_speed: number
    pressure: number
    radius7: number
    radius10: number
    radius12: number
    radius7_quad?: {
        ne: number
        se: number
        sw: number
        nw: number
    }
    radius10_quad?: {
        ne: number
        se: number
        sw: number
        nw: number
    }
    radius12_quad?: {
        ne: number
        se: number
        sw: number
        nw: number
    }
    remark: string
    forecast?: TyphoonRouteForecast[]
    type?: 'live' | 'forc'
    index?: number
    tfbh?: string
    sets?: string
    entity: Cesium.Entity
}

export type TyphoonRouteForecast = {
    sets: string
    points: TyphoonPoint[]
    unshifted?: boolean
    name?: string
}

export type TyphoonDatasource = {
    name: string
    typhoonRoute: TyphoonRoute | TyphoonRouteForecast
    show: boolean
    points: TyphoonPoint[]
    colors: string[]
    positions: Cesium.Cartesian3[]
    playInterval?: any
    playIndex?: number
    children?: TyphoonDatasource[]
    type?: 'live' | 'forc'
}