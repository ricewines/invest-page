import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

const app = createApp(App)

import Vant from 'vant'
import 'vant/lib/index.css'
import axios from 'axios'

app.use(Vant)

// 配置后端接口地址
axios.defaults.baseURL = '/api'
app.config.globalProperties.$axios = axios
import router from './router'
app.use(router)
app.mount('#app')
