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
          <p class="subtitle-1">{{ $t('order.latestOrder.title') }}<v-divider></v-divider></p>

          <v-row>
            <v-col
              cols="6"
            >
              <p class="body-1"><v-icon>mdi-map-marker-outline</v-icon>
                {{ $t('order.latestOrder.location') }}
              </p>
            </v-col>
            <v-col
              cols="6"
            >
              <p class="body-1 text--primary">{{ orderDormitory }}</p>
            </v-col>
            <v-col
              cols="6"
            >
              <p class="body-1"><v-icon>mdi-account-tie-outline</v-icon>
                {{ $t('order.latestOrder.solver') }}
              </p>
            </v-col>
            <v-col
              cols="6"
            >
              <p class="body-1 text--primary">{{ orderSolverName }}</p>
            </v-col>
            <v-col
              cols="6"
            >
              <p class="body-1"><v-icon>mdi-phone</v-icon>
                {{ $t('order.latestOrder.solverTelephone') }}
              </p>
            </v-col>
            <v-col
              cols="6"
            >
              <p class="body-1 text--primary">{{ orderSolverTelephone }}</p>
            </v-col>
            <v-col
              cols="6"
            >
              <p class="body-1"><v-icon>mdi-bell-ring-outline</v-icon>
                {{ $t('order.latestOrder.status') }}
              </p>
            </v-col>
            <v-col
              cols="6"
            >
              <p class="body-1 text--primary">{{ orderStatus }}</p>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-btn
            color="red"
            outlined
            style="margin: 0px 0px 10px 10px"
            @click="toCancelOrderDialog"
            :disabled="cancelDisabled"
            class="subtitle-2"
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
                <p class="subtitle-1">{{ $t('order.latestOrder.orderInfo') }}<v-divider></v-divider></p>

                <v-row>
                  <v-col
                    cols="6"
                  >
                    <p class="subtitle-1"><v-icon>mdi-account-outline</v-icon>
                      {{ $t('order.latestOrder.name') }}
                    </p>
                  </v-col>
                  <v-col
                    cols="6"
                  >
                    <p class="body-1 text--primary">{{ orderName }}</p>
                  </v-col>
                  <v-col
                    cols="6"
                  >
                    <p class="body-1"><v-icon>mdi-domain</v-icon>
                      {{ $t('order.latestOrder.campus') }}
                    </p>
                  </v-col>
                  <v-col
                    cols="6"
                  >
                    <p class="body-1 text--primary">{{ orderCampus }}</p>
                  </v-col>
                  <v-col
                    cols="6"
                  >
                    <p class="body-1"><v-icon>mdi-cellphone</v-icon>
                      {{ $t('order.latestOrder.telephone') }}
                    </p>
                  </v-col>
                  <v-col
                    cols="6"
                  >
                    <p class="body-1 text--primary">{{ orderTelephone }}</p>
                  </v-col>
                  <v-col
                    cols="6"
                  >
                    <p class="body-1"><v-icon>mdi-forum-outline</v-icon>
                      {{ $t('order.latestOrder.description') }}
                    </p>
                  </v-col>
                  <v-col
                    cols="6"
                  >
                    <p class="body-1 text--primary">{{ orderDescription }}</p>
                  </v-col>
                  <v-col
                    cols="6"
                  >
                    <p class="body-1"><v-icon>mdi-clock-outline</v-icon>
                      {{ $t('order.latestOrder.date') }}
                    </p>
                  </v-col>
                  <v-col
                    cols="6"
                  >
                    <p class="body-1 text--primary">{{ createDate }}</p>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </div>
        </v-expand-transition>
      </v-card>
    </v-hover>

    <!-- 取消订单 Dialog -->
    <v-dialog v-model="cancelDialog" max-width="600px">
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
          >{{ $t('order.latestOrder.confirm') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import Bus from '@/Bus'

export default {
  name: 'LatestOrder',
  data: () => ({
    showDetails: false,
    cancelDialog: false,
    cancelDisabled: true,
    orderDormitory: '-',
    orderSolverName: '-',
    orderSolverTelephone: '-',
    orderStatus: '-',
    orderName: '-',
    orderCampus: '-',
    orderTelephone: '-',
    orderDescription: '-',
    createDate: '-'
  }),
  methods: {
    toCancelOrderDialog () {
      Bus.$emit('tokenCheck')
      this.cancelDialog = true
    },
    cancelOrder: async function () {
      const Response = await this.axios.post('/api/order/cancelOrderByUser', {
        order_id: localStorage.getItem('latest_order_id')
      })
      if (Response.data === true) {
        this.orderStatus = this.$i18n.t('order.canceledByUserStatus')
        Bus.$emit('setSnackbar', this.$i18n.t('order.cancelSucceed'))
        this.cancelDialog = false
        this.cancelDisabled = true
      } else {
        Bus.$emit('modifyLoginStatus', 'unknownErr')
      }
    }
  },
  created: async function () { // 获取最近的订单信息
    const Response = await this.axios.post('/api/order/getLatestOrderInfo')
    const orderInfo = Response.data
    // console.log(orderInfo)
    if (orderInfo) {
      this.orderDormitory = orderInfo.order_user_dormitory
      this.orderName = orderInfo.order_user_name
      this.orderCampus = orderInfo.order_user_campus
      this.orderTelephone = orderInfo.order_user_telephone
      if (orderInfo.order_user_description !== '') this.orderDescription = orderInfo.order_user_description
      this.createDate = orderInfo.create_date
      const status = orderInfo.order_status
      if (status === this.GLOBAL.status.waiting) { // 用户可以取消订单
        this.orderStatus = this.$i18n.t('order.waitingStatus')
        this.cancelDisabled = false
      } else { // 用户不可以取消订单
        if (status === this.GLOBAL.status.receipted) {
          this.orderStatus = this.$i18n.t('order.receiptedStatus')
        } else if (status === this.GLOBAL.status.canceledByUser) {
          this.orderStatus = this.$i18n.t('order.canceledByUserStatus')
        } else if (status === this.GLOBAL.status.canceledBySolver) {
          this.orderStatus = this.$i18n.t('order.canceledBySolverStatus')
        } else if (status === this.GLOBAL.status.finished) {
          this.orderStatus = this.$i18n.t('order.finishedStatus')
        } else {
          this.orderStatus = this.$i18n.t('order.unknownStatus')
        }
        this.cancelDisabled = true
      }
      localStorage.setItem('latest_order_id', orderInfo.order_id)
      if (orderInfo.solver_id !== null) { // 存在接单者时
        if (orderInfo.order_solver_nickname !== null) {
          this.orderSolverName = orderInfo.order_solver_nickname
        } else {
          this.orderSolverName = orderInfo.order_solver_name
        }
        this.orderSolverTelephone = orderInfo.order_solver_telephone
      }
    }
  }
}
</script>
