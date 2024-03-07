import { createApp } from 'vue'

import App from '@/App.vue'
import { registerPlugins } from '@core/utils/plugins'
// import { createPinia } from 'pinia'
import './axios'
// Styles
import '@core/scss/template/index.scss'
import '@layouts/styles/index.scss'
import 'vue3-toastify/dist/index.css'
// Create vue app
const app = createApp(App)
// const pinia = createPinia()
// Register plugins
registerPlugins(app)

// Mount vue app
// app.mount('pinia')
app.mount('#app')
