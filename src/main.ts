import { createApp } from 'vue'

import App from '@/App.vue'
import { registerPlugins } from '@core/utils/plugins'
import './axios'
// Styles
import '@core/scss/template/index.scss'
import '@layouts/styles/index.scss'
import 'vue3-toastify/dist/index.css'
// Create vue app
const app = createApp(App)
// Register plugins
registerPlugins(app)

// Mount vue app
app.mount('#app')
