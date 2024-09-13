import { RouteRecordRaw } from 'vue-router'


const entityRoutes: RouteRecordRaw[] = [
    //点
    {
        path: "/example/entity/basepoint",
        name: "基础点",
        component: () => import('@/views/entity/point/base/index.vue'),
        meta: {
            title: '基础点',
        }
    },
    {
        path: "/example/entity/label",
        name: "标签",
        component: () => import('@/views/entity/point/label/index.vue'),
        meta: {
            title: '标签',
        }
    },
    {
        path: "/example/entity/text",
        name: "文字",
        component: () => import('@/views/entity/point/text/index.vue'),
        meta: {
            title: '文字',
        }
    },
    {
        path: "/example/entity/image",
        name: "图片",
        component: () => import('@/views/entity/point/image/index.vue'),
        meta: {
            title: '图片',
        }
    },
    {
        path: "/example/entity/billboard",
        name: "广告牌",
        component: () => import('@/views/entity/point/billboard/index.vue'),
        meta: {
            title: '广告牌',
        }
    },
    {
        path: "/example/entity/html",
        name: "Html",
        component: () => import('@/views/entity/point/html/index.vue'),
        meta: {
            title: 'Html',
        }
    },
    //线
    {
        path: "/example/entity/risingline",
        name: "上升线",
        component: () => import('@/views/entity/line/risingLine/index.vue'),
        meta: {
            title: '上升线',
        }
    }
]


export default entityRoutes