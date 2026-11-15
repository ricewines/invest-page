import {createRouter, createWebHistory} from 'vue-router'
import Operation from './Operation.vue'
import Config from './Config.vue'
import SmsPage from "./SmsPage.vue";

const routes = [
    {path: '/', redirect: '/operation'},
    {path: '/operation', component: Operation},
    {path: '/config', component: Config},
    {path: '/sms-page', component: SmsPage},
]

const routers = createRouter({
    history: createWebHistory("invest-admin-page"),
    routes
})

export default routers