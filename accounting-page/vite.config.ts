import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue()],
    base: "/accounting-page",
    server: {
        port: 6013,
        proxy: {
            "/invest/accounting/api": {
                target: "http://[::1]:6011",
            },
        }
    },
})
