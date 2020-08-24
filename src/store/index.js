import Vue from 'vue'
import Vuex from 'vuex'
import common from '@/../server/common'

Vue.use(Vuex)

const state = { // 全局访问的 state 对象
  user_id: null,
  role: null,
  token: null
}

const getters = { // 计算 state 属性变化

}

const mutations = { // 自定义 state 方法
  setUserId (state, userId) {
    if (userId) {
      state.user_id = userId
      localStorage.setItem('user_id', userId)
    } else {
      console.log('unknown userId setting.')
    }
  },
  setRole (state, role) {
    if (role === common.role.user || role === common.role.solver || role === common.role.admin) {
      state.role = role
      localStorage.setItem('role', role)
    } else {
      console.log('unknown role setting.')
    }
  },
  setToken (state, token) {
    if (token) {
      state.token = token
      localStorage.setItem('token', token)
    } else {
      console.log('unknown token setting.')
    }
  },
  removeToken (state) {
    state.token = null
  },
  removeLoginInfo (state) {
    state.user_id = null
    state.role = null
    state.token = null
  }
}

const store = new Vuex.Store({
  state,
  getters,
  mutations
})

export default store
