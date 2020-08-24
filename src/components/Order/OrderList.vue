<template>
  <v-container>
    <v-hover
      v-slot:default="{ hover }"
      open-delay="200"
    >
      <v-card
        :elevation="hover ? 16 : 2"
        class="mx-auto"
        max-width="1200"
      >
        <!-- 表格 header 内容 -->
        <v-toolbar flat class="body-1 pt-2">
          <v-toolbar-title>{{ $t('order.orderList.title') }}</v-toolbar-title>
          <v-divider class="mx-4" inset vertical />
          <v-spacer/>
          <v-select
            v-model="filterSelect"
            dense
            :items="filterItems"
            :label="filterLabel"
            class="mt-5"
            outlined
            @change="changeOrderListFilter"
          ></v-select>
          <v-divider class="mx-4" inset vertical />
          <v-btn
            color="success"
            class="mb-2"
            @click="openCreateOrderSolverSheet"
          >{{ $t('order.createOrder.solver.create') }}</v-btn>
        </v-toolbar>
        <v-card-text>
          <!-- 表格主体 -->
          <v-data-table
            :headers="orderListHeaders"
            :items="orderListItems"
            :items-per-page="itemsPerPage"
            item-key="order_id"
            show-expand
            single-expand
            :expanded.sync="expandedOrder"
            calculate-widths
            :loading="orderListLoading"
            :loading-text="orderListLoadingText"
            hide-default-footer
            multi-sort
          >
            <!-- 表格 footer 内容 -->
            <template v-slot:footer>
              <v-btn
                v-show="showLoadMore"
                depressed
                block
                @click="loadMoreOrderListItems"
              >{{ $t('order.orderList.loadingMore') }}</v-btn>
            </template>
            <!-- 订单 status 项内容 -->
            <template v-slot:item.order_status="{ item }">
              <v-chip
                :color="getStatusColor(item.order_status, item.is_solver)"
                :text-color="getStatusTextColor(item.order_status)"
              >
                <v-avatar left>
                  <v-icon>{{ getStatusIcon(item.order_status) }}</v-icon>
                </v-avatar>
                {{ getStatusText(item.order_status, item.is_solver) }}
              </v-chip>
            </template>
            <!-- 订单 actions 项内容 -->
            <template v-slot:item.actions="{ item }">
              <v-icon
                v-if="item.order_status === GLOBAL.status.waiting"
                @click="receiptOrder(item)"
              >mdi-briefcase-plus-outline</v-icon>
              <v-icon
                v-else-if="item.order_status === GLOBAL.status.receipted && item.is_solver"
                @click="finishOrder(item)"
              >mdi-checkbox-multiple-marked-outline</v-icon>
              <v-icon
                v-if="item.order_status === GLOBAL.status.canceledBySolver"
                @click="restoreOrder(item)"
              >mdi-autorenew</v-icon>
            </template>
            <!-- 订单展开内容 -->
            <template v-slot:expanded-item="{ headers, item }">
              <td
                :colspan="headers.length"
              >
                <div class="mt-3"/>
                <v-row style="word-wrap: break-word; word-break: break-all">
                  <!-- 订单用户联系电话 -->
                  <v-col cols="12" v-if="item.order_user_telephone">
                    <v-chip
                      small
                      label
                      outlined
                      class="mr-1"
                    >
                      <v-icon small left>mdi-cellphone</v-icon>
                      {{ $t('order.orderList.expanded.telephone') }}
                    </v-chip>
                    <span style="display: inline-block;">{{ item.order_user_telephone }}</span>
                  </v-col>
                  <!-- 订单寝室地址 -->
                  <v-col cols="12" v-if="item.order_user_dormitory">
                    <v-chip
                      small
                      label
                      outlined
                      class="mr-1"
                    >
                      <v-icon small left>mdi-map-marker-outline</v-icon>
                      <span style="display: inline-block;">{{ $t('order.orderList.expanded.dormitory') }}</span>
                    </v-chip>
                    {{ item.order_user_dormitory }}
                  </v-col>
                  <!-- 订单描述 -->
                  <v-col cols="12" v-if="item.order_user_description">
                    <v-chip
                      small
                      label
                      outlined
                      class="mr-1"
                    >
                      <v-icon small left>mdi-calendar-blank-outline</v-icon>
                      {{ $t('order.orderList.expanded.description') }}
                    </v-chip>
                    <span style="display: inline-block;">{{ item.order_user_description }}</span>
                  </v-col>
                  <!-- 订单处理者姓名 -->
                  <v-col cols="12" v-if="item.solver_name">
                    <v-chip
                      small
                      label
                      outlined
                      class="mr-1"
                    >
                      <v-icon small left>mdi-card-account-details-outline</v-icon>
                      {{ $t('order.orderList.expanded.solverName') }}
                    </v-chip>
                    <span style="display: inline-block;">{{ item.solver_name }}</span>
                  </v-col>
                  <!-- 订单处理者记录 -->
                  <v-col cols="12" v-if="item.order_solver_record">
                    <v-chip
                      small
                      label
                      outlined
                      class="mr-1"
                    >
                      <v-icon small left>mdi-calendar-check-outline</v-icon>
                      {{ $t('order.orderList.expanded.record') }}
                    </v-chip>
                    <span style="display: inline-block;">{{ item.order_solver_record }}</span>
                  </v-col>
                  <!-- 订单关闭日期 -->
                  <v-col cols="12" v-if="item.close_date">
                    <v-chip
                      small
                      label
                      outlined
                      class="mr-1"
                    >
                      <v-icon small left>mdi-clock-check-outline</v-icon>
                      {{ $t('order.orderList.expanded.closeDate') }}
                    </v-chip>
                    <span style="display: inline-block;">{{ item.close_date }}</span>
                  </v-col>
                  <!-- 订单备注信息 -->
                  <v-col cols="12" v-if="item.order_notes">
                    <v-chip
                      small
                      label
                      outlined
                      class="mr-1"
                    >
                      <v-icon small left>mdi-comment-processing-outline</v-icon>
                      {{ $t('order.orderList.expanded.notes') }}
                    </v-chip>
                    <span style="display: inline-block;">{{ item.order_notes }}</span>
                  </v-col>
                  <!-- 订单额外操作 -->
                  <v-col
                    cols="12"
                  >
                  <!--
                    <v-btn
                      small
                      depressed
                      v-if="item.order_status === GLOBAL.status.waiting ||
                      (item.order_status === GLOBAL.status.receipted && item.is_solver)"
                      label
                      @click="modifyOrder(item)"
                    >修改订单信息</v-btn>
                  </v-col>
                  -->
                    <v-btn
                      small
                      depressed
                      v-if="(item.order_status === GLOBAL.status.receipted && item.is_solver)"
                      @click="cancelOrder(item)"
                      class="mr-2"
                    >{{ $t('order.orderList.expanded.cancelOrder') }}</v-btn>
                    <v-btn
                      small
                      depressed
                      v-if="item.order_status === GLOBAL.status.waiting ||
                      (item.order_status === GLOBAL.status.receipted && item.is_solver)"
                      @click="closeOrder(item)"
                    >{{ $t('order.orderList.expanded.closeOrder') }}</v-btn>
                  <!--
                    <v-btn
                      small
                      depressed
                      v-if="item.order_status === GLOBAL.status.canceledByUser ||
                      item.order_status === GLOBAL.status.canceledBySolver ||
                      (item.order_status === GLOBAL.status.finished && item.is_solver) ||
                      (item.order_status === GLOBAL.status.recorded && item.is_solver)"
                      label
                      @click="deleteOrder(item)"
                    >删除此订单</v-btn>
                  -->
                  </v-col>
                </v-row>
                <div class="mb-3"/>
              </td>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-hover>
  </v-container>
</template>

<script>
export default {
  name: 'OrderList',
  data: () => ({
    filterSelect: '显示可用',
    filterItems: ['显示可用', '与我相关', '显示全部'],
    itemsPerPage: -1,
    page: 1,
    orderListLoading: true,
    showLoadMore: false,
    expandedOrder: [],
    orderListItems: []
  }),
  created () {
    this.axios.post('/api/order/queryOrderList', {
      page: 1,
      filter: this.GLOBAL.filter.available
    }).then((Response) => {
      const orderItems = Response.data
      for (let i = 0; i < orderItems.length; i++) {
        this.orderListItems.push(orderItems[i])
      }
      if (orderItems.length === 10) {
        this.showLoadMore = true
      }
      this.orderListLoading = false
    })
  },
  methods: {
    changeOrderListFilter (id) {
      this.page = 0
      this.orderListItems = []

      this.loadMoreOrderListItems()
    },
    openCreateOrderSolverSheet () {
      this.Bus.$emit('openCreateOrderSolverSheet')
    },
    receiptOrder (item) { // 接取订单，设置订单状态为已接取
      if (confirm(this.$i18n.t('order.orderList.actions.receiptOrderConfirm'))) {
        this.axios.post('/api/order/receiptOrder', {
          order_id: item.order_id
        }).then((Response) => {
          if (Response.data) {
            this.Bus.$emit('setSnackbar', this.$i18n.t('order.orderList.actions.receiptOrderSucceed'))
            this.refreshRouter()
          } else {
            this.Bus.$emit('setSnackbar', this.$i18n.t('order.orderList.actions.receiptOrderFailed'))
            this.refreshRouter()
          }
        })
      }
    },
    finishOrder (item) { // 设置订单状态为已完成
      if (confirm(this.$i18n.t('order.orderList.actions.finishOrderConfirm'))) {
        this.axios.post('/api/order/finishOrder', {
          order_id: item.order_id
        }).then((Response) => {
          if (Response.data) {
            this.Bus.$emit('setSnackbar', this.$i18n.t('order.orderList.actions.finishOrderSucceed'))
            this.refreshRouter()
          } else {
            this.Bus.$emit('setSnackbar', this.$i18n.t('order.orderList.actions.finishOrderFailed'))
            this.refreshRouter()
          }
        })
      }
    },
    restoreOrder (item) { // 将 solver 关闭订单的状态设置为待接取
      if (confirm(this.$i18n.t('order.orderList.actions.restoreOrderConfirm'))) {
        this.axios.post('/api/order/restoreOrder', {
          order_id: item.order_id
        }).then((Response) => {
          if (Response.data) {
            this.Bus.$emit('setSnackbar', this.$i18n.t('order.orderList.actions.restoreOrderSucceed'))
            this.refreshRouter()
          } else {
            this.Bus.$emit('setSnackbar', this.$i18n.t('order.orderList.actions.restoreOrderFailed'))
            this.refreshRouter()
          }
        })
      }
    },
    modifyOrder (item) { // 修改订单信息
      console.log('modify')
    },
    cancelOrder (item) { // 取消订单，并设置订单状态为待接取
      if (confirm(this.$i18n.t('order.orderList.actions.cancelOrderConfirm'))) {
        this.axios.post('/api/order/cancelOrder', {
          order_id: item.order_id
        }).then((Response) => {
          if (Response.data) {
            this.Bus.$emit('setSnackbar', this.$i18n.t('order.orderList.actions.cancelOrderSucceed'))
            this.refreshRouter()
          } else {
            this.Bus.$emit('setSnackbar', this.$i18n.t('order.orderList.actions.cancelOrderFailed'))
            this.refreshRouter()
          }
        })
      }
    },
    closeOrder (item) { // 关闭订单，并设置订单状态为处理者关闭
      if (confirm(this.$i18n.t('order.orderList.actions.closeOrderConfirm'))) {
        this.axios.post('/api/order/closeOrder', {
          order_id: item.order_id
        }).then((Response) => {
          if (Response.data) {
            this.Bus.$emit('setSnackbar', this.$i18n.t('order.orderList.actions.closeOrderSucceed'))
            this.refreshRouter()
          } else {
            this.Bus.$emit('setSnackbar', this.$i18n.t('order.orderList.actions.closeOrderFailed'))
            this.refreshRouter()
          }
        })
      }
    },
    deleteOrder (item) { // 删除订单
      if (confirm()) {
        console.log('deleted')
      }
    },
    loadMoreOrderListItems () { // 点击加载更多按钮载入更多订单信息
      this.showLoadMore = false
      this.page = this.page + 1
      this.orderListLoading = true

      let filter = false
      if (this.filterSelect === '与我相关') {
        filter = this.GLOBAL.filter.relevant
      } else if (this.filterSelect === '显示全部') {
        filter = this.GLOBAL.filter.all
      } else if (this.filterSelect === '显示可用') {
        filter = this.GLOBAL.filter.available
      }

      this.axios.post('/api/order/queryOrderList', {
        page: this.page,
        filter: filter
      }).then((Response) => {
        const orderItems = Response.data
        for (let i = 0; i < orderItems.length; i++) {
          this.orderListItems.push(orderItems[i])
        }
        if (orderItems.length === 10) {
          this.showLoadMore = true
        }
        this.orderListLoading = false
      })
    },
    getStatusColor (status, isSolver) {
      if (status === this.GLOBAL.status.waiting) {
        return 'green'
      } else if (status === this.GLOBAL.status.receipted) {
        if (isSolver) return 'orange'
        else return 'primary'
      } else if (status === this.GLOBAL.status.canceledByUser || status === this.GLOBAL.status.canceledBySolver) {
        return 'grey'
      } else if (status === this.GLOBAL.status.finished) {
        return 'teal'
      } else if (status === this.GLOBAL.status.recorded) {
        return 'teal'
      } else {
        return null
      }
    },
    getStatusTextColor (status) {
      if (status) {
        return 'white'
      } else {
        return null
      }
    },
    getStatusIcon (status) {
      if (status === this.GLOBAL.status.waiting) {
        return 'mdi-bell-circle'
      } else if (status === this.GLOBAL.status.receipted) {
        return 'mdi-account-circle'
      } else if (status === this.GLOBAL.status.canceledByUser) {
        return 'mdi-close-circle'
      } else if (status === this.GLOBAL.status.canceledBySolver) {
        return 'mdi-delete-circle'
      } else if (status === this.GLOBAL.status.finished) {
        return 'mdi-check-circle'
      } else if (status === this.GLOBAL.status.recorded) {
        return 'mdi-check-underline-circle'
      } else {
        return null
      }
    },
    getStatusText (status, isSolver) {
      if (status === this.GLOBAL.status.waiting) {
        return this.$i18n.t('order.orderList.status.waiting')
      } else if (status === this.GLOBAL.status.receipted) {
        if (isSolver) return this.$i18n.t('order.orderList.status.receiptedByYou')
        else return this.$i18n.t('order.orderList.status.receipted')
      } else if (status === this.GLOBAL.status.canceledByUser) {
        return this.$i18n.t('order.orderList.status.closed')
      } else if (status === this.GLOBAL.status.canceledBySolver) {
        return this.$i18n.t('order.orderList.status.closed')
      } else if (status === this.GLOBAL.status.finished) {
        return this.$i18n.t('order.orderList.status.finished')
      } else if (status === this.GLOBAL.status.recorded) {
        return this.$i18n.t('order.orderList.status.finished')
      } else {
        return null
      }
    },
    refreshRouter () {
      this.$router.push({ path: '/_empty' })
      this.$router.back(-1)
    }
  },
  computed: {
    filterLabel () {
      return this.$i18n.t('order.orderList.filterLabel')
    },
    orderListLoadingText () {
      return this.$i18n.t('order.orderList.loadingText')
    },
    orderListHeaders () {
      const headers = [
        {
          text: this.$i18n.t('order.orderList.header.userName'),
          align: 'start',
          sortable: false,
          value: 'order_user_name'
        },
        {
          text: this.$i18n.t('order.orderList.header.userGender'),
          value: 'order_user_gender'
        },
        {
          text: this.$i18n.t('order.orderList.header.userCampus'),
          value: 'order_user_campus'
        },
        {
          text: this.$i18n.t('order.orderList.header.createDate'),
          value: 'create_date'
        },
        {
          text: this.$i18n.t('order.orderList.header.orderOpenTime'),
          value: 'order_open_time'
        },
        {
          text: this.$i18n.t('order.orderList.header.status'),
          value: 'order_status'
        },
        {
          text: this.$i18n.t('order.orderList.header.actions'),
          sortable: false,
          value: 'actions'
        },
        {
          sortable: false,
          value: 'data-table-expand'
        }
      ]
      return headers
    }
  }
}
</script>
