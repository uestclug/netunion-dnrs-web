<template>
  <v-container>
    <v-hover
      v-slot:default="{ hover }"
      open-delay="200"
    >
      <v-card
        :elevation="hover ? 16 : 2"
        class="mx-auto transition-swing"
        max-width="800"
      >
        <v-card-text>
          <p class="subtitle-1">{{ $t('home.welcomeUser.words') }}<v-divider></v-divider>
          </p>
          <p class="headline text--primary font-weight-medium">{{ $t('home.welcomeUser.slogan') }}</p>
        </v-card-text>

        <v-card-actions>
          <v-btn
            :color="actionBtnColor"
            style="margin: 0px 0px 10px 10px"
            @click="openCreateOrderUserSheet"
            :disabled="orderInfoLoading"
            :loading="orderInfoLoading"
          >
            <v-icon left>mdi-pencil</v-icon>
            <span v-if="enableCreateOrder">{{ $t('order.createOrder.user.create') }}</span>
            <span v-else>{{ $t('order.createOrder.user.modify') }}</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-hover>
  </v-container>
</template>

<script>
export default {
  name: 'WelcomeUser',
  data: () => ({
    actionBtnColor: 'default',
    orderInfoLoading: true,
    order: [],
    enableCreateOrder: false,
    isNewUser: false
  }),
  methods: {
    openCreateOrderUserSheet () {
      // enableCreateOrder = true 时，进入创建订单模式
      // enableCreateOrder = false 时，进入修改订单模式
      this.$Bus.$emit('openCreateOrderUserSheet', {
        isModify: !this.enableCreateOrder,
        order: this.order,
        isNewUser: this.isNewUser,
        isUnlogged: false
      })
    }
  },
  mounted () {
    this.$Bus.$on('userLatestOrderInfoLoaded', (msg) => {
      // 已经获取用户最近的订单信息
      this.order = msg
      if (this.order.length != 0) { // 存在最近订单信息
        const orderStatus = this.order.order_status
        if (orderStatus === this.$GLOBAL.status.waiting) {
          // 订单为等待接单状态
          this.enableCreateOrder = false
        } else if (orderStatus === this.$GLOBAL.status.receipted) {
          // 订单为已接单状态
          this.enableCreateOrder = false
        } else if (orderStatus === this.$GLOBAL.status.canceledByUser) {
          // 订单为被用户取消状态
          this.enableCreateOrder = true
        } else if (orderStatus === this.$GLOBAL.status.canceledBySolver) {
          // 订单为被处理者取消状态
          this.enableCreateOrder = true
        } else if (orderStatus === this.$GLOBAL.status.finished) {
          // 订单为完成状态
          this.enableCreateOrder = true
        }
      } else { // 用户首次创建订单
        this.isNewUser = true
        this.enableCreateOrder = true
      }

      if (this.enableCreateOrder) { // 创建订单按钮为 success 色
        this.actionBtnColor = 'success'
      } else { // 修改订单按钮为 primary 色
        this.actionBtnColor = 'primary'
      }

      this.orderInfoLoading = false
    })
  }
}
</script>
