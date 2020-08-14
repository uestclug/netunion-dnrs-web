<template>
  <div></div>
</template>

<script>
import Bus from '@/Bus'
import store from '@/store'
const $common = require('@/../server/common')

export default {
  name: 'BusMethods',
  mounted () {
    Bus.$on('modifyLoginStatus', (msg) => { // 根据传入的 msg 执行用户不同登录状态的方法
      // 保存用户自定义页面信息
      const ddm = localStorage.getItem('defaultDarkMode')
      const dl = localStorage.getItem('defaultLanguage')

      if (msg === 'logout') { // 用户主动登出
        Bus.$emit('setSnackbar', this.$i18n.t('login.logoutSuccess'))
        localStorage.clear()
      } else if (msg === 'tokenErr') { // 用户 token 验证失败
        Bus.$emit('setSnackbar', this.$i18n.t('login.tokenCheckFailed'))
        localStorage.clear()
      } else if (msg === 'infoErr') { // 用户本地存储信息验证失败
        Bus.$emit('setSnackbar', this.$i18n.t('login.infoCheckFailed'))
        localStorage.clear()
      } else if (msg === 'unknownErr') { // 发生未知错误时
        Bus.$emit('setSnackbar', this.$i18n.t('login.unknownFailed'))
        localStorage.clear()
      }

      localStorage.setItem('defaultDarkMode', ddm)
      localStorage.setItem('defaultLanguage', dl)

      location.reload()
    })

    Bus.$on('tokenCheck', async function () { // 检查用户 token 是否有效
      const response = await this.axios.post('/api/token/checkToken')
      if (response.data !== true) {
        Bus.$emit('modifyLoginStatus', 'tokenErr')
      }
      console.log('token check.')
    })

    Bus.$on('infoCheck', function () { // 检查用户信息是否完整
      const userId = store.state.user_id
      const role = store.state.role
      const token = store.state.token
      if (userId == null || role == null || token == null) {
        Bus.$emit('modifyLoginStatus', 'infoErr')
      } else {
        if (role == $common.role.user) {
          if (!localStorage.getItem('name') || !localStorage.getItem('gender') ||
          !localStorage.getItem('telephone') || !localStorage.getItem('campus') ||
          !localStorage.getItem('dormitory') || !localStorage.getItem('std_id')) {
            Bus.$emit('modifyLoginStatus', 'infoErr')
          }
        } else if (role == $common.role.solver) {
          //
        } else if (role == $common.role.admin) {
          //
        } else {
          Bus.$emit('modifyLoginStatus', 'infoErr')
        }
      }
    })
  }
}
</script>
