import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue()],
    base: '/invest-admin-page',
    server: {
        host: '0.0.0.0',
        port: 6014,
        proxy: {
            "/invest/macro/api": {
                target: "http://[::1]:6012",
            },
        }
    },
})
