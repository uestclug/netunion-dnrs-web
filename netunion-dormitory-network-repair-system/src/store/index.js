import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = { // 全局访问的 state 对象

}

const getters = { // 计算 state 属性变化

}

const mutations = { // 自定义 state 方法

}

const store = new Vuex.Store({
  state,
  getters,
  mutations
})

export default store
