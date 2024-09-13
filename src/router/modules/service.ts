import { RouteRecordRaw } from 'vue-router'


const serviceRoutes: RouteRecordRaw[] = [
    {
        path: "/example/service/basemap",
        name: "基础地图",
        component: () => import('@/views/service/base/index.vue'),
        meta: {
            title: '基础地图',
        }
    },
    {
        path: "/example/service/arcgismap",
        name: "arcgis地图",
        component: () => import('@/views/service/arcgis/index.vue'),
        meta: {
            title: 'arcgis地图',
        }
    },
    {
        path: "/example/service/tdtmap",
        name: "天地图地图",
        component: () => import('@/views/service/tdt/index.vue'),
        meta: {
            title: '天地图地图',
        }
    },
    {
        path: "/example/service/baidumap",
        name: "百度地图",
        component: () => import('@/views/service/baidu/index.vue'),
        meta: {
            title: '百度地图',
        }
    },
    {
        path: "/example/service/cesium-terrain-map",
        name: "Cesium地形",
        component: () => import('@/views/service/cesiumTerrain/index.vue'),
        meta: {
            title: 'Cesium地形',
        }
    },
    {
        path: "/example/service/arcgis-terrain-map",
        name: "arcgis地形",
        component: () => import('@/views/service/arcgisTerrain/index.vue'),
        meta: {
            title: 'arcgis地形',
        }
    }
]


export default serviceRoutes