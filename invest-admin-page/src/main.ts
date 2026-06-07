import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import 'vant/lib/index.css'
import routers from './routers'

let app =createApp(App)
app.use(routers)
app.mount('#app')
