import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import VueI18n from 'vue-i18n'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.config.productionTip = false

Vue.use(VueI18n)
Vue.use(VueAxios, axios)

// 实现国际化
const i18n = new VueI18n({
  // 通过切换 this.$i18n.locale 的值来实现语言切换
  locale: 'zh-CN',
  messages: {
    'zh-CN': require('./common/lang/zh'),
    'en-US': require('./common/lang/en')
  },
  defaultLanguage: '简体中文'
})

// 添加页面登录验证
router.beforeEach(function (to, from, next) {
  if (to.meta.needLogin) { // 页面需要登录访问时
    if (localStorage.getItem('token')) { // 如果已经登陆，则访问该页面
      next()
    } else { // 如果未登录，则跳转到登录页面
      next({
        name: 'login'
      })
    }
  } else { // 页面不需要登录访问时
    if (to.name === 'login' && localStorage.getItem('token')) { // 如果进入“登录”页面且已登录，跳转到主页
      next({
        name: 'home'
      })
    } else { // 访问该页面
      next()
    }
  }
})

new Vue({
  router,
  vuetify,
  i18n,
  render: h => h(App)
}).$mount('#app')
