<template>
  <div></div>
</template>

<script>
import Bus from '@/Bus'

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
      }
    })

    Bus.$on('tokenCheck', async function () { // 检查用户 token 是否有效
      const response = await this.axios.post('/api/user/checkToken', {
        id: localStorage.getItem('id')
      })
      if (response.data !== true) {
        Bus.$emit('modifyLoginStatus', 'tokenErr')
      }
    })

    Bus.$on('infoCheck', function () { // 检查用户信息是否完整
      if (!localStorage.getItem('name') || !localStorage.getItem('gender') ||
      !localStorage.getItem('telephone') || !localStorage.getItem('campus') ||
      !localStorage.getItem('dormitory') || !localStorage.getItem('std_id') ||
      !localStorage.getItem('id')) {
        Bus.$emit('modifyLoginStatus', 'infoErr')
      }
    })

    Bus.$on('getLatestOrderInfo', function () { // 获取最近订单信息
      this.axios.post('/api/order/getLatestOrderInfo', {
        user_id: localStorage.getItem('id')
      }).then(Response => {
        if (Response.data !== false) {
          const orderInfo = Response.data
          // console.log(orderInfo)
          if (orderInfo.order_user_dormitory) { // 设置订单寝室地址
            localStorage.setItem('order_user_dormitory', orderInfo.order_user_dormitory)
          } else {
            localStorage.setItem('order_user_dormitory', '-')
          }

          if (orderInfo.order_solver_name) { // 设置订单处理者姓名
            localStorage.setItem('order_solver_name', orderInfo.order_solver_name)
          } else {
            localStorage.setItem('order_solver_name', '-')
          }

          if (orderInfo.order_solver_telephone) { // 设置订单处理者工作电话
            localStorage.setItem('order_solver_telephone', orderInfo.order_solver_telephone)
          } else {
            localStorage.setItem('order_solver_telephone', '-')
          }

          if (orderInfo.order_solver_intro) { // 设置订单处理者简介
            localStorage.setItem('order_solver_intro', orderInfo.order_solver_intro)
          } else {
            localStorage.setItem('order_solver_intro', '-')
          }

          if (orderInfo.order_solver_nickname) { // 设置订单处理者昵称
            localStorage.setItem('order_solver_nickname', orderInfo.order_solver_nickname)
          } else {
            localStorage.setItem('order_solver_nickname', '-')
          }

          if (orderInfo.order_status) { // 设置订单状态
            localStorage.setItem('order_status', orderInfo.order_status)
          } else {
            localStorage.setItem('order_status', '-')
          }

          if (orderInfo.order_user_name) { // 设置用户姓名
            localStorage.setItem('order_user_name', orderInfo.order_user_name)
          } else {
            localStorage.setItem('order_user_name', '-')
          }

          if (orderInfo.order_user_campus) { // 设置订单校区
            localStorage.setItem('order_user_campus', orderInfo.order_user_campus)
          } else {
            localStorage.setItem('order_user_campus', '-')
          }

          if (orderInfo.order_user_telephone) { // 设置用户电话
            localStorage.setItem('order_user_telephone', orderInfo.order_user_telephone)
          } else {
            localStorage.setItem('order_user_telephone', '-')
          }

          if (orderInfo.order_user_description) { // 设置订单描述
            localStorage.setItem('order_user_description', orderInfo.order_user_description)
          } else {
            localStorage.setItem('order_user_description', '-')
          }

          if (orderInfo.order_date) { // 设置订单下单日期
            localStorage.setItem('order_date', orderInfo.order_date)
          } else {
            localStorage.setItem('order_date', '-')
          }
        } else {
          location.reload()
        }
      })
    })
  }
}
</script>
