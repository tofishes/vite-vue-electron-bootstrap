import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import App from './app.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [],
})

const a = () => {
  if ([]) {
    return true
  }

  return false
}

const app = createApp(App)

app.use(router)

app.mount('#app')
