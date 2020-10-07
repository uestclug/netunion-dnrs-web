import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import vuetify from '@/plugins/vuetify'
import VueI18n from 'vue-i18n'
import axios from 'axios'
import VueAxios from 'vue-axios'
import common from '@/common/common.js'
import store from '@/store'
import Bus from './Bus'

Vue.config.productionTip = false
Vue.prototype.GLOBAL = common // 引入全局变量
Vue.prototype.Bus = Bus

Vue.use(VueI18n)
Vue.use(VueAxios, axios)

// 实现国际化
const i18n = new VueI18n({
  // 通过切换 this.$i18n.locale 的值来实现语言切换
  locale: 'zh-CN',
  messages: {
    'zh-CN': require('@/common/lang/zh.json'),
    'en-US': require('@/common/lang/en.json')
  },
  defaultLanguage: '简体中文'
})

// 设置路由拦截
router.beforeEach(function (to, from, next) {
  if (to.path === '/login' && !localStorage.getItem('token')) { // 如果跳转到登录页面且用户未登录，则放行
    next()
  } else {
    if (to.meta.needLogin && !localStorage.getItem('token')) { // 如果页面需要登录且没有 token 则跳转登录页面
      next({
        name: 'login'
      })
    } else { // 如果页面不需要登录则放行
      next()
    }
  }
})

// 设置 request & response 拦截
axios.interceptors.request.use(
  config => {
    // 设置请求头带有 token
    config.headers.Authorization = store.state.token
    // 设置请求 data 包含 user_id 和 role
    config.data = {
      ...config.data,
      user_id: store.state.user_id,
      role: store.state.role
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response) {
      switch (error.response.status) { // 如果响应错误码为 401，则清空 token，回到 login 页面
        case 401:
          store.commit('removeToken')
          router.push({
            name: 'login'
          })
      }
    }
    return Promise.reject(error.response.data)
  }
)

new Vue({
  router,
  vuetify,
  i18n,
  store,
  render: h => h(App)
}).$mount('#app')
