import { createRouter, createWebHistory } from 'vue-router'
import Operation from './Operation.vue'
import Config from './Config.vue'

const routes = [
    { path: '/', redirect: '/operation' },
    { path: '/operation', component: Operation },
    { path: '/config', component: Config }
]

const routers = createRouter({
    history: createWebHistory("invest-admin-page"),
    routes
})

export default routers