import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import(/* webpackChunkName: "register" */ '../views/Register.vue')
  },
  {
    path: '/face',
    name: 'Face',
    component: () => import(/* webpackChunkName: "face" */ '../views/Face.vue')
  },
  {
    path: '/checkin',
    name: 'CheckIn',
    component: () => import(/* webpackChunkName: "checkin" */ '../views/CheckIn.vue')
  },
  {
    path: '/checkout',
    name: 'CheckOut',
    component: () => import(/* webpackChunkName: "checkout" */ '../views/CheckOut.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
