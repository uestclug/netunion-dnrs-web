<template>
  <div>
    <v-hover v-slot:default="{ hover }">
      <v-card
        :elevation="hover ? 4 : 2"
        class="mx-auto transition-swing"
        max-width="800"
      >
        <v-toolbar flat class="body-1 pt-2">
          <v-toolbar-title>{{ $t('order.latestOrder.title') }}</v-toolbar-title>
          <v-divider class="mx-4" />
        </v-toolbar>

        <v-container v-if="infoLoading" style="text-align: center;">
          <div class="loadingio-spinner-ripple-s9nf2nweyv">
            <div class="ldio-62v9m71m4dc">
              <div></div>
              <div></div>
            </div>
          </div>
        </v-container>

        <div v-else>
          <v-card-text class="pb-4">
            <v-row>
              <v-col cols="6">
                <p class="body-1">
                  <v-icon>mdi-map-marker-outline</v-icon>
                  {{ $t('order.latestOrder.location') }}
                </p>
              </v-col>
              <v-col cols="6">
                <p class="body-1 text--primary">{{ orderDormitory }}</p>
              </v-col>
              <v-col cols="6">
                <p class="body-1">
                  <v-icon>mdi-account-tie-outline</v-icon>
                  {{ $t('order.latestOrder.solver') }}
                </p>
              </v-col>
              <v-col cols="6">
                <p class="body-1 text--primary">{{ orderSolverName }}</p>
              </v-col>
              <v-col cols="6">
                <p class="body-1">
                  <v-icon>mdi-phone</v-icon>
                  {{ $t('order.latestOrder.solverTelephone') }}
                </p>
              </v-col>
              <v-col cols="6">
                <p class="body-1 text--primary">{{ orderSolverTelephone }}</p>
              </v-col>
              <v-col cols="6">
                <p class="body-1">
                  <v-icon>mdi-bell-ring-outline</v-icon>
                  {{ $t('order.latestOrder.status') }}
                </p>
              </v-col>
              <v-col cols="6">
                <p class="body-1 text--primary">{{ orderStatus }}</p>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="auto">
                <v-btn
                  color="primary"
                  @click="telephoneCall(orderSolverTelephone)"
                  :disabled="telephoneCallDisabled"
                  class="mr-2"
                >
                  <v-icon left>mdi-phone-in-talk-outline</v-icon>
                  {{ $t('order.acceptedOrder.telephoneCall') }}
                </v-btn>

                <v-btn
                  depressed
                  @click="toCancelOrderDialog"
                  :disabled="cancelDisabled"
                >
                  <v-icon left>mdi-close</v-icon>
                  {{ $t('order.latestOrder.cancelOrder') }}
                </v-btn>
              </v-col>

              <v-spacer />

              <v-col cols="auto">
                <v-btn
                  icon
                  @click="showDetails = !showDetails"
                  class="subtitle-2"
                >
                  <v-icon>{{
                    showDetails ? 'mdi-chevron-up' : 'mdi-chevron-down'
                  }}</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>

          <v-expand-transition>
            <div v-show="showDetails">
              <v-divider />

              <v-card-subtitle>{{
                $t('order.latestOrder.orderInfo')
              }}</v-card-subtitle>

              <v-card-text class="pb-2">
                <v-row>
                  <v-col cols="6">
                    <p class="subtitle-1">
                      <v-icon>mdi-account-outline</v-icon>
                      {{ $t('order.latestOrder.name') }}
                    </p>
                  </v-col>
                  <v-col cols="6">
                    <p class="body-1 text--primary">{{ orderName }}</p>
                  </v-col>
                  <v-col cols="6">
                    <p class="body-1">
                      <v-icon>mdi-domain</v-icon>
                      {{ $t('order.latestOrder.campus') }}
                    </p>
                  </v-col>
                  <v-col cols="6">
                    <p class="body-1 text--primary">{{ orderCampus }}</p>
                  </v-col>
                  <v-col cols="6">
                    <p class="body-1">
                      <v-icon>mdi-cellphone</v-icon>
                      {{ $t('order.latestOrder.telephone') }}
                    </p>
                  </v-col>
                  <v-col cols="6">
                    <p class="body-1 text--primary">{{ orderTelephone }}</p>
                  </v-col>
                  <v-col cols="6">
                    <p class="body-1">
                      <v-icon>mdi-forum-outline</v-icon>
                      {{ $t('order.latestOrder.description') }}
                    </p>
                  </v-col>
                  <v-col cols="6">
                    <p class="body-1 text--primary">{{ orderDescription }}</p>
                  </v-col>
                  <v-col cols="6">
                    <p class="body-1">
                      <v-icon>mdi-clock-outline</v-icon>
                      {{ $t('order.latestOrder.date') }}
                    </p>
                  </v-col>
                  <v-col cols="6">
                    <p class="body-1 text--primary">{{ createDate }}</p>
                  </v-col>
                </v-row>
              </v-card-text>
            </div>
          </v-expand-transition>
        </div>
      </v-card>
    </v-hover>

    <!-- 取消订单 Dialog -->
    <v-dialog v-model="cancelDialog" max-width="600">
      <v-card>
        <v-card-title>
          {{ $t('order.latestOrder.cancelOrder') }}
        </v-card-title>
        <v-card-text>
          {{ $t('order.latestOrder.cancelOrderText') }}
        </v-card-text>
        <v-card-actions class="mr-4">
          <v-spacer></v-spacer>
          <v-btn depressed @click="cancelDialog = false">{{
            $t('order.latestOrder.cancel')
          }}</v-btn>
          <v-btn
            color="primary"
            @click="cancelOrder"
            :loading="loading"
            :disabled="loading"
            >{{ $t('order.latestOrder.confirm') }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'LatestOrder',
  data: () => ({
    showDetails: false,
    cancelDialog: false,
    cancelDisabled: true,
    telephoneCallDisabled: true,
    order: [],
    orderDormitory: '-',
    orderSolverName: '-',
    orderSolverTelephone: '-',
    orderStatus: '-',
    orderName: '-',
    orderCampus: '-',
    orderTelephone: '-',
    orderDescription: '-',
    createDate: '-',
    infoLoading: true,
    loading: false
  }),
  methods: {
    toCancelOrderDialog () {
      this.cancelDialog = true
    },
    cancelOrder: async function () {
      if (this.$DevMode) return

      this.loading = true
      const Response = await this.axios.post('/api/order/cancelOrderByUser', {
        order_id: localStorage.getItem('latest_order_id')
      })
      if (Response.data) {
        this.orderStatus = this.$i18n.t('order.canceledByUserStatus')
        this.$Bus.$emit('setSnackbar', this.$i18n.t('order.cancelSucceed'))
        this.$router.push({ path: '/_empty' })
        this.$router.back(-1)
      } else {
        this.$Bus.$emit('modifyLoginStatus', 'unknownErr')
      }
    },
    telephoneCall (telephone) {
      window.location.href = 'tel:' + telephone
    }
  },
  created: async function () {
    // 获取最近的订单信息
    let orderInfo
    if (this.$DevMode) {
      // 赋值处理时间可能快于 WelcomeUser 组件加载完成时间
      // 故设置等待时间防止 Bus 传值异常
      await setTimeout(console.log('load order info.'), 1000)
      orderInfo = this.$DevData.order.latestOrder
    } else {
      const Response = await this.axios.post('/api/order/getLatestOrderInfo')
      orderInfo = Response.data
    }

    if (orderInfo) {
      // 用户存在最近的订单
      this.order = orderInfo
      this.orderDormitory = orderInfo.order_user_dormitory
      this.orderName = orderInfo.order_user_name
      this.orderCampus = orderInfo.order_user_campus
      this.orderTelephone = orderInfo.order_user_telephone
      if (orderInfo.order_user_description !== '') { this.orderDescription = orderInfo.order_user_description }
      this.createDate = orderInfo.create_date
      const status = orderInfo.order_status
      localStorage.setItem('latest_order_id', orderInfo.order_id)

      if (status === this.$GLOBAL.status.waiting) {
        // 用户可以取消订单
        // 订单为等待接单状态
        this.orderStatus = this.$i18n.t('order.waitingStatus')
        this.cancelDisabled = false
      } else {
        // 用户不可取消订单
        if (status === this.$GLOBAL.status.receipted) {
          // 订单为已接单状态
          this.orderStatus = this.$i18n.t('order.receiptedStatus')
        } else if (status === this.$GLOBAL.status.canceledByUser) {
          // 订单为被用户取消状态
          this.orderStatus = this.$i18n.t('order.canceledByUserStatus')
        } else if (status === this.$GLOBAL.status.canceledBySolver) {
          // 订单为被处理者取消状态
          this.orderStatus = this.$i18n.t('order.canceledBySolverStatus')
        } else if (status === this.$GLOBAL.status.finished) {
          // 订单为完成状态
          this.orderStatus = this.$i18n.t('order.finishedStatus')
        } else {
          // 获取订单状态异常
          // 刷新当前页面
          this.orderStatus = this.$i18n.t('order.unknownStatus')
          location.reload()
        }
        this.cancelDisabled = true
      }
      if (orderInfo.solver_id !== null) {
        // 存在接单者时
        if (
          orderInfo.order_solver_nickname != null &&
          orderInfo.order_solver_nickname != ''
        ) {
          this.orderSolverName = orderInfo.order_solver_nickname
        } else {
          this.orderSolverName = orderInfo.order_solver_name
        }
        this.orderSolverTelephone = orderInfo.order_solver_telephone
        if (
          this.orderStatus == this.$i18n.t('order.receiptedStatus') &&
          this.orderSolverTelephone.length >= 4
        ) {
          // 假设联系方式应至少为 4 位号码
          this.telephoneCallDisabled = false
        }
      }
    } else {
      // 用户为首次创建订单
      // 用户可以创建订单，但不可修改订单或取消订单
      this.order = []
      this.cancelDisabled = true
    }
    this.infoLoading = false
    this.$Bus.$emit('userLatestOrderInfoLoaded', this.order) // 设置订单信息加载完成
  }
}
</script>
