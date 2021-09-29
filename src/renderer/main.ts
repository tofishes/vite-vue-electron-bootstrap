import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import Layout from './layout.vue'
import routes from './routes'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const app = createApp(Layout)

app.use(router)

app.mount('#app')
