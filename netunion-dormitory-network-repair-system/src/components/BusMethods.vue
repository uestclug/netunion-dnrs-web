<template>
  <div></div>
</template>

<script>
import Bus from '@/Bus'
const $common = require('@/../server/common')

export default {
  name: 'BusMethods',
  mounted () {
    Bus.$on('modifyLoginStatus', (msg) => { // 根据传入的 msg 执行用户不同登录状态的方法
      if (msg === 'logout') { // 用户主动登出
        Bus.$emit('setSnackbar', this.$i18n.t('login.logoutSuccess'))
        localStorage.clear()
        location.reload()
      } else if (msg === 'tokenErr') { // 用户 token 验证失败
        Bus.$emit('setSnackbar', this.$i18n.t('login.tokenCheckFailed'))
        localStorage.clear()
        location.reload()
      } else if (msg === 'infoErr') { // 用户本地存储信息验证失败
        Bus.$emit('setSnackbar', this.$i18n.t('login.infoCheckFailed'))
        localStorage.clear()
        location.reload()
      } else if (msg === 'unknownErr') { // 发生未知错误时
        Bus.$emit('setSnackbar', this.$i18n.t('login.unknownFailed'))
        localStorage.clear()
        location.reload()
      }
    })

    Bus.$on('tokenCheck', async function () { // 检查用户 token 是否有效
      const response = await this.axios.post('/api/token/checkToken', {
        user_id: localStorage.getItem('user_id')
      })
      if (response.data !== true) {
        Bus.$emit('modifyLoginStatus', 'tokenErr')
      }
    })

    Bus.$on('infoCheck', function () { // 检查用户信息是否完整
      const role = localStorage.getItem('role')
      if (role == $common.role.user) {
        if (!localStorage.getItem('name') || !localStorage.getItem('gender') ||
        !localStorage.getItem('telephone') || !localStorage.getItem('campus') ||
        !localStorage.getItem('dormitory') || !localStorage.getItem('std_id') ||
        !localStorage.getItem('user_id')) {
          Bus.$emit('modifyLoginStatus', 'infoErr')
        }
      } else if (role == $common.role.solver) {
        //
      } else if (role == $common.role.admin) {
        //
      } else {
        Bus.$emit('modifyLoginStatus', 'infoErr')
      }
    })
  }
}
</script>
