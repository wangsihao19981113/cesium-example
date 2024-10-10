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
        path: "/example/entity/baseline",
        name: "基础线",
        component: () => import('@/views/entity/line/baseLine/index.vue'),
        meta: {
            title: '基础线',
        }
    },
    {
        path: "/example/entity/dashedline",
        name: "虚线",
        component: () => import('@/views/entity/line/dashedLine/index.vue'),
        meta: {
            title: '虚线',
        }
    },
    {
        path: "/example/entity/risingline",
        name: "上升线",
        component: () => import('@/views/entity/line/risingLine/index.vue'),
        meta: {
            title: '上升线',
        }
    },
    {
        path: "/example/entity/parabolaline",
        name: "抛物线",
        component: () => import('@/views/entity/line/parabolaLine/index.vue'),
        meta: {
            title: '抛物线',
        }
    },
    {
        path: "/example/entity/shineline",
        name: "闪烁线",
        component: () => import('@/views/entity/line/shineLine/index.vue'),
        meta: {
            title: '闪烁线',
        }
    },
    //面
    {
        path: "/example/entity/water",
        name: "水面",
        component: () => import('@/views/entity/polygon/water/index.vue'),
        meta: {
            title: '水面',
        }
    },
    //粒子系统
    {
        path: "/example/entity/flow",
        name: "流",
        component: () => import('@/views/entity/particle/flow/index.vue'),
        meta: {
            title: '流',
        }
    }
]


export default entityRoutes