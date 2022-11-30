import { createRouter, RouteRecordRaw, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import QrCodeGenerator from '../views/QrCodeGenerator.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'QR Scanner | DSJIN'
    }
  },
  {
    path: '/generator',
    name: 'QrCodeGenerator',
    component: QrCodeGenerator,
    meta: {
      title: 'QR Code Generator | DSJIN'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title as string
  next()
})

export default router
