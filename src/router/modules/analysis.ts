import { RouteRecordRaw } from 'vue-router'


const analysisRoutes: RouteRecordRaw[] = [
    {
        path: "/example/analysis/measure",
        name: "测量",
        component: () => import('@/views/analysis/measure/index.vue'),
        meta: {
            title: '测量',
        }
    },
    {
        path: "/example/analysis/flooding",
        name: "水淹分析",
        component: () => import('@/views/analysis/flooding/index.vue'),
        meta: {
            title: '水淹分析',
        }
    },
    {
        path: "/example/analysis/viewshed",
        name: "可视域分析",
        component: () => import('@/views/analysis/viewshed/index.vue'),
        meta: {
            title: '可视域分析',
        }
    },
    {
        path: "/example/analysis/section",
        name: "剖面分析",
        component: () => import('@/views/analysis/section/index.vue'),
        meta: {
            title: '剖面分析',
        }
    }
]


export default analysisRoutes