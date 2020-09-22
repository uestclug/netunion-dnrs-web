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
        <v-toolbar
          flat
          class="body-1 pt-2"
        >
          <v-toolbar-title>{{ $t('order.latestOrder.title') }}</v-toolbar-title>
          <v-divider class="mx-4" />
        </v-toolbar>

        <v-container
          v-if="infoLoading"
          style="text-align: center;"
        >
          <div class="loadingio-spinner-ripple-s9nf2nweyv">
            <div class="ldio-62v9m71m4dc">
              <div></div>
              <div></div>
            </div>
          </div>
        </v-container>

        <div v-else>
          <v-card-text>
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
          </v-card-text>

          <v-card-actions>
            <v-btn
              outlined
              color="blue-grey"
              @click="telephoneCall(orderSolverTelephone)"
              :disabled="telephoneCallDisabled"
              class="ml-2 mb-2"
            >
              <v-icon left>mdi-phone-in-talk-outline</v-icon> {{ $t('order.acceptedOrder.telephoneCall') }}
            </v-btn>

            <v-btn
              color="red"
              outlined
              @click="toCancelOrderDialog"
              :disabled="cancelDisabled"
              class="ml-2 mb-2"
            >
              <v-icon left>mdi-close</v-icon> {{ $t('order.latestOrder.cancelOrder') }}
            </v-btn>

            <v-spacer></v-spacer>

            <v-btn
              icon
              @click="showDetails = !showDetails"
              class="subtitle-2"
            >
              <v-icon>{{ showDetails ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
            </v-btn>
          </v-card-actions>

          <v-expand-transition>
            <div v-show="showDetails">
              <v-card flat>
                <v-card-text>
                  <p class="subtitle-1">{{ $t('order.latestOrder.orderInfo') }}<v-divider></v-divider>
                  </p>

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
              </v-card>
            </div>
          </v-expand-transition>
        </div>
      </v-card>
    </v-hover>

    <!-- 取消订单 Dialog -->
    <v-dialog
      v-model="cancelDialog"
      max-width="600px"
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{ $t('order.latestOrder.cancelOrder') }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                {{ $t('order.latestOrder.cancelOrderText') }}
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="info"
            @click="cancelDialog = false"
            class="subtitle-2"
          >{{ $t('order.latestOrder.cancel') }}</v-btn>
          <v-btn
            color="success"
            @click="cancelOrder"
            class="subtitle-2"
            :loading="loading"
            :disabled="loading"
          >{{ $t('order.latestOrder.confirm') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: 'LatestOrder',
  data: () => ({
    showDetails: false,
    cancelDialog: false,
    cancelDisabled: true,
    telephoneCallDisabled: true,
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
      this.loading = true
      const Response = await this.axios.post('/api/order/cancelOrderByUser', {
        order_id: localStorage.getItem('latest_order_id')
      })
      if (Response.data) {
        this.orderStatus = this.$i18n.t('order.canceledByUserStatus')
        this.Bus.$emit('setSnackbar', this.$i18n.t('order.cancelSucceed'))
        this.loading = false
        this.cancelDialog = false
        this.cancelDisabled = true
        this.Bus.$emit('enableUserCreateOrder')
      } else {
        this.Bus.$emit('modifyLoginStatus', 'unknownErr')
      }
    },
    telephoneCall (telephone) {
      window.location.href = 'tel:' + telephone
    }
  },
  created: async function () { // 获取最近的订单信息
    const Response = await this.axios.post('/api/order/getLatestOrderInfo')
    const orderInfo = Response.data
    if (orderInfo) { // 用户存在最近的订单
      this.orderDormitory = orderInfo.order_user_dormitory
      this.orderName = orderInfo.order_user_name
      this.orderCampus = orderInfo.order_user_campus
      this.orderTelephone = orderInfo.order_user_telephone
      if (orderInfo.order_user_description !== '') this.orderDescription = orderInfo.order_user_description
      this.createDate = orderInfo.create_date
      const status = orderInfo.order_status
      localStorage.setItem('latest_order_id', orderInfo.order_id)

      if (status === this.GLOBAL.status.waiting) { // 用户可以取消订单
        this.orderStatus = this.$i18n.t('order.waitingStatus')
        this.cancelDisabled = false
      } else { // 用户不可以取消订单
        if (status === this.GLOBAL.status.receipted) {
          this.orderStatus = this.$i18n.t('order.receiptedStatus')
        } else if (status === this.GLOBAL.status.canceledByUser) {
          this.orderStatus = this.$i18n.t('order.canceledByUserStatus')
          this.Bus.$emit('enableUserCreateOrder')
        } else if (status === this.GLOBAL.status.canceledBySolver) {
          this.orderStatus = this.$i18n.t('order.canceledBySolverStatus')
          this.Bus.$emit('enableUserCreateOrder')
        } else if (status === this.GLOBAL.status.finished) {
          this.orderStatus = this.$i18n.t('order.finishedStatus')
          this.Bus.$emit('enableUserCreateOrder')
        } else {
          this.orderStatus = this.$i18n.t('order.unknownStatus')
        }
        this.cancelDisabled = true
      }
      if (orderInfo.solver_id !== null) { // 存在接单者时
        if (orderInfo.order_solver_nickname !== null && orderInfo.order_solver_nickname !== '') {
          this.orderSolverName = orderInfo.order_solver_nickname
        } else {
          this.orderSolverName = orderInfo.order_solver_name
        }
        this.orderSolverTelephone = orderInfo.order_solver_telephone
        if (this.orderStatus == this.$i18n.t('order.receiptedStatus') &&
          this.orderSolverTelephone.length >= 4) { // 联系方式应至少为 4 位号码
          this.telephoneCallDisabled = false
        }
      }
      this.infoLoading = false
    } else { // 用户不存在最近的订单
      this.Bus.$emit('enableUserCreateOrder')
    }
  }
}
</script>
