import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueCookies from 'vue-cookies'
import vuetify from './plugins/vuetify'
import VueI18n from 'vue-i18n'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.config.productionTip = false

Vue.use(VueCookies)
Vue.use(VueI18n)
Vue.use(VueAxios, axios)

const i18n = new VueI18n({
  // 通过切换 this.$i18n.locale 的值来实现语言切换
  locale: 'zh-CN',
  messages: {
    'zh-CN': require('./common/lang/zh'),
    'en-US': require('./common/lang/en')
  },
  defaultLanguage: '简体中文'
})

new Vue({
  router,
  vuetify,
  i18n,
  render: h => h(App)
}).$mount('#app')
