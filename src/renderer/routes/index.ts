import { RouteRecordRaw } from 'vue-router'

import Home from '../pages/home.vue'
import One from '../pages/one.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/one',
    component: One,
  },
]

export default routes
