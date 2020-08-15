<template>
  <div/>
</template>

<script>
import Bus from '@/Bus'

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
  }
}
</script>
