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
                    <p class="body-1 text--primary">{{ orderDate }}</p>
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
    orderDate: '-'
  }),
  methods: {
    toCancelOrderDialog () {
      this.cancelDialog = true
    },
    cancelOrder () {
      this.cancelDialog = false
      this.orderStatus = this.$i18n.t('order.latestOrder.canceledByUserStatus')
      this.cancelDisabled = true
      Bus.$emit('setSnackbar', this.$i18n.t('order.latestOrder.cancelSucceed'))
    }
  },
  mounted () {
    Bus.$on('refreshLatestOrder', (msg) => {
      console.log(msg)
      if (msg.order_dormitory) { this.orderDormitory = msg.order_dormitory }
      if (msg.order_solver_name) { // 设置订单处理者姓名
        this.orderSolverName = msg.order_solver_name
      } else {
        this.orderSolverName = this.$i18n.t('order.latestOrder.waitingForSolver')
      }
      if (msg.order_solver_telephone) { // 设置订单处理者工作电话
        this.orderSolverTelephone = msg.order_solver_telephone
      } else {
        this.orderSolverTelephone = '-'
      }
      if (msg.order_status) { // 设置订单状态
        const status = msg.order_status
        if (status === 'waiting') {
          this.orderStatus = this.$i18n.t('order.latestOrder.waitingStatus')
          this.cancelDisabled = false
        } else if (status === 'receipted') {
          this.orderStatus = this.$i18n.t('order.latestOrder.receiptedStatus')
          this.cancelDisabled = true
        } else if (status === 'canceled by user') {
          this.orderStatus = this.$i18n.t('order.latestOrder.canceledByUserStatus')
          this.cancelDisabled = true
        } else if (status === 'canceled by solver') {
          this.orderStatus = this.$i18n.t('order.latestOrder.canceledBySolverStatus')
          this.cancelDisabled = true
        } else if (status === 'finished') {
          this.orderStatus = this.$i18n.t('order.latestOrder.finishedStatus')
          this.cancelDisabled = true
        }
      }
      if (msg.order_name) { this.orderName = msg.order_name }
      if (msg.order_campus) { this.orderCampus = msg.order_campus }
      if (msg.order_telephone) { this.orderTelephone = msg.order_telephone }
      if (msg.order_description) { // 设置订单描述
        this.orderDescription = msg.order_description
      } else {
        this.orderDescription = '-'
      }
      if (msg.order_date) { this.orderDate = msg.order_date }
    })
  }
}
</script>
