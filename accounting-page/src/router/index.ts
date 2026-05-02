import { createRouter, createWebHistory } from 'vue-router'
import VoucherCreate from '../views/VoucherCreate.vue'
import BalanceSheet from '../views/BalanceSheet.vue'

const routes = [
    { path: '/', redirect: '/voucher' },
    { path: '/voucher', component: VoucherCreate },
    { path: '/balance-sheet', component: BalanceSheet }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router