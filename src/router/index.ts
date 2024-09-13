import { createRouter, createWebHistory } from 'vue-router'
import modules from './modules'

const routes = [
    {
        //路由初始指向
        path: '/',
        name: 'Home',
        redirect:"/example",
        children:[...modules.serviceRoutes,...modules.analysisRoutes,...modules.modelRoutes,...modules.entityRoutes]
    },{
        path:"/example",
        component: () => import('@/views/home/index.vue'),
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to,from,next) => {
    if(to.meta.title){
        document.title = to.meta.title
    }
    next()
})

export default router