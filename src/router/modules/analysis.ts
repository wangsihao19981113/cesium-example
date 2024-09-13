import { RouteRecordRaw } from 'vue-router'


const analysisRoutes: RouteRecordRaw[] = [
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
    }
]


export default analysisRoutes