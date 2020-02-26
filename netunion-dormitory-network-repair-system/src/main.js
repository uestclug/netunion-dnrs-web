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
  if (to.meta.needLogin) {
    if (localStorage.getItem('token')) {
      next()
    } else {
      next({
        name: 'login'
      })
    }
  } else {
    next()
  }
})

new Vue({
  router,
  vuetify,
  i18n,
  render: h => h(App)
}).$mount('#app')
