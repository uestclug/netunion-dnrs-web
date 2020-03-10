<template>
  <v-container>
    <v-hover
      v-slot:default="{ hover }"
      open-delay="200"
    >
      <v-card
        :elevation="hover ? 16 : 2"
        class="mx-auto"
        max-width="800"
      >
        <v-card-text>
          <p class="subtitle-1">{{ $t('home.welcome.words') }}<v-divider></v-divider></p>
          <p class="headline text--primary font-weight-medium">{{ $t('home.welcome.slogan') }}</p>
        </v-card-text>

        <v-card-actions>
          <v-btn
            color="success"
            outlined
            style="margin: 0px 0px 10px 10px"
            @click="openBottomSheet"
          >
            <v-icon left>mdi-pencil</v-icon> {{ $t('order.createOrder.create') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-hover>
  </v-container>
</template>

<script>
import Bus from '@/Bus'

export default {
  name: 'Welcome',
  methods: {
    openBottomSheet: async function () {
      const response = await this.axios.post('/api/user/checkToken', {
        id: localStorage.getItem('id')
      })
      if (response.data === true) { // 当用户 token 有效时
        const orderStatus = await this.axios.post('/api/order/getLatestOrderStatus', {
          user_id: localStorage.getItem('id')
        })
        if (orderStatus.data === true) { // 可以新建订单
          Bus.$emit('openBottomSheet', '')
        } else if (orderStatus.data === false) { // 订单状态验证错误
          Bus.$emit('setSnackbar', this.$i18n.t('order.createOrder.orderStatusErr'))
        } else if (orderStatus.data === 'waiting' || orderStatus.data === 'receipted') { // 不可新建订单
          Bus.$emit('setSnackbar', this.$i18n.t('order.createOrder.orderStatusErr'))
        } else {
          Bus.$emit('openBottomSheet', '')
        }
      } else { // 无效时清除 token 并刷新回到登录页面
        Bus.$emit('setSnackbar', this.$i18n.t('login.tokenCheckFailed'))
        localStorage.removeItem('token')
        location.reload()
      }
    }
  }
}
</script>
