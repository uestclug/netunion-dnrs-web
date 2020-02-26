import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    meta: {
      viewTitle: 'viewTitle.home',
      needLogin: true
    },
    component: Home
  },
  {
    path: '/about',
    name: 'about',
    meta: {
      viewTitle: 'viewTitle.about',
      needLogin: false
    },
    component: () => import('../views/About.vue')
  },
  {
    path: '/user',
    name: 'user',
    meta: {
      viewTitle: 'viewTitle.user',
      needLogin: true
    },
    component: () => import('../views/User.vue')
  },
  {
    path: '/order',
    name: 'order',
    meta: {
      viewTitle: 'viewTitle.order',
      needLogin: true
    },
    component: () => import('../views/Order.vue')
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      viewTitle: 'viewTitle.login',
      needLogin: false
    },
    component: () => import('../views/Login.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
