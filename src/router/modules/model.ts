import { RouteRecordRaw } from 'vue-router'


const modelRoutes: RouteRecordRaw[] = [
    {
        path: "/example/model/basemodel",
        name: "倾斜摄影",
        component: () => import('@/views/model/base/index.vue'),
        meta: {
            title: '倾斜摄影',
        }
    },
    {
        path: "/example/model/glb",
        name: "GLB",
        component: () => import('@/views/model/glb/index.vue'),
        meta: {
            title: 'GLB',
        }
    },
    {
        path: "/example/model/bim",
        name: "BIM",
        component: () => import('@/views/model/bim/index.vue'),
        meta: {
            title: 'BIM',
        }
    },
    {
        path: "/example/model/points",
        name: "点云LAS",
        component: () => import('@/views/model/points/index.vue'),
        meta: {
            title: '点云LAS',
        }
    },
    {
        path: "/example/model/building",
        name: "自然幢",
        component: () => import('@/views/model/building/index.vue'),
        meta: {
            title: '自然幢',
        }
    }
]


export default modelRoutes