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
        <v-toolbar flat class="body-1 pt-2">
          <v-toolbar-title>{{ $t('order.orderList.title') }}</v-toolbar-title>
          <v-divider class="mx-4" inset vertical />
          <v-spacer/>
          <v-btn
            color="success"
            class="mb-2"
            @click="openCreateOrderSolverSheet"
          >{{ $t('order.createOrder.solver.create') }}</v-btn>
        </v-toolbar>
        <v-card-text>
          <v-data-table
            :headers="orderListHeaders"
            :items="orderListItems"
            :items-per-page="itemsPerPage"
            item-key="order_id"
            show-expand
            single-expand
            :expanded.sync="expandedOrder"
            fixed-header
            calculate-widths
            :loading="orderListLoading"
            hide-default-footer
          >
            <template v-slot:footer>
              <v-btn
                v-show="showLoadMore"
                depressed
                block
                @click="loadMoreOrderListItems"
              >加载更多</v-btn>
            </template>
            <template v-slot:item.order_status="{ item }">
              <v-chip
                :color="getStatusColor(item.order_status)"
                :text-color="getStatusTextColor(item.order_status)"
              >
                <v-avatar left>
                  <v-icon>{{ getStatusIcon(item.order_status) }}</v-icon>
                </v-avatar>
                {{ getStatusText(item.order_status) }}
              </v-chip>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-icon
                v-if="item.order_status === GLOBAL.status.waiting"
                @click="receiptOrder(item)"
              >
                mdi-checkbox-marked-circle-outline
              </v-icon>
              <v-icon
                v-else-if="item.order_status === GLOBAL.status.receipted"
                @click="finishOrder(item)"
              >
                mdi-checkbox-marked-circle
              </v-icon>
              <v-icon
                v-if="item.order_status === GLOBAL.status.canceledBySolver"
                @click="restoreOrder(item)"
              >
                mdi-autorenew
              </v-icon>
            </template>
            <template v-slot:expanded-item="{ headers, item }">
              <td
                :colspan="headers.length"
              >
                <div class="mt-3"/>
                <v-row style="word-wrap: break-word; word-break: break-all">
                  <v-col cols="12" v-if="item.order_user_telephone">
                    <v-chip
                      small
                      label
                      outlined
                    >
                      <v-icon small left>mdi-cellphone</v-icon>
                      用户联系电话
                    </v-chip>
                    {{ item.order_user_telephone }}
                  </v-col>
                  <v-col cols="12" v-if="item.order_user_dormitory">
                    <v-chip
                      small
                      label
                      outlined
                    >
                      <v-icon small left>mdi-map-marker-outline</v-icon>
                      用户寝室地址
                    </v-chip>
                    {{ item.order_user_dormitory }}
                  </v-col>
                  <v-col cols="12" v-if="item.order_user_description">
                    <v-chip
                      small
                      label
                      outlined
                    >
                      <v-icon small left>mdi-calendar-blank-outline</v-icon>
                      用户情况描述
                    </v-chip>
                    {{ item.order_user_description }}
                  </v-col>
                  <v-col cols="12" v-if="item.create_date">
                    <v-chip
                      small
                      label
                      outlined
                    >
                      <v-icon small left>mdi-clock-fast</v-icon>
                      订单创建日期
                    </v-chip>
                    {{ item.create_date }}
                  </v-col>
                  <v-col cols="12" v-if="item.solver_name">
                    <v-chip
                      small
                      label
                      outlined
                    >
                      <v-icon small left>mdi-calendar-check-outline</v-icon>
                      处理者的姓名
                    </v-chip>
                    {{ item.solver_name }}
                  </v-col>
                  <v-col cols="12" v-if="item.order_solver_record">
                    <v-chip
                      small
                      label
                      outlined
                    >
                      <v-icon small left>mdi-calendar-check-outline</v-icon>
                      处理情况记录
                    </v-chip>
                    {{ item.order_solver_record }}
                  </v-col>
                  <v-col cols="12" v-if="item.close_date">
                    <v-chip
                      small
                      label
                      outlined
                    >
                      <v-icon small left>mdi-clock-check-outline</v-icon>
                      订单关闭日期
                    </v-chip>
                    {{ item.close_date }}
                  </v-col>
                  <v-col cols="12" v-if="item.order_notes">
                    <v-chip
                      small
                      label
                      outlined
                    >
                      <v-icon small left>mdi-comment-processing-outline</v-icon>
                      订单备注信息
                    </v-chip>
                    {{ item.order_notes }}
                  </v-col>
                  <v-col cols="auto" v-if="item.order_status === GLOBAL.status.waiting || item.order_status === GLOBAL.status.receipted">
                    <v-chip
                      label
                      @click="modifyOrder(item)"
                    >修改订单信息</v-chip>
                  </v-col>
                  <v-col cols="auto" v-if="item.order_status === GLOBAL.status.waiting || item.order_status === GLOBAL.status.receipted">
                    <v-chip
                      label
                      @click="cancelOrder(item)"
                    >删除此订单</v-chip>
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
    itemsPerPage: -1,
    page: 1,
    orderListLoading: true,
    showLoadMore: false,
    expandedOrder: [],
    orderListItems: []
  }),
  created () {
    this.axios.post('/api/order/queryOrderList', {
      page: 1
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
    openCreateOrderSolverSheet () {
      this.Bus.$emit('openCreateOrderSolverSheet')
    },
    loadMoreOrderListItems () {
      this.showLoadMore = false
      this.page = this.page + 1
      this.orderListLoading = true

      this.axios.post('/api/order/queryOrderList', {
        page: this.page
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
    getStatusColor (status) {
      if (status === this.GLOBAL.status.waiting) {
        return 'green'
      } else if (status === this.GLOBAL.status.receipted) {
        return 'primary'
      } else if (status === this.GLOBAL.status.canceledByUser || status === this.GLOBAL.status.canceledBySolver) {
        return 'red'
      } else if (status === this.GLOBAL.status.finished) {
        return 'teal'
      } else if (status === this.GLOBAL.status.recorded) {
        return 'teal'
      } else {
        return 'white'
      }
    },
    getStatusTextColor (status) {
      if (status === this.GLOBAL.status.waiting) {
        return 'white'
      } else if (status === this.GLOBAL.status.receipted) {
        return 'white'
      } else if (status === this.GLOBAL.status.canceledByUser) {
        return 'white'
      } else if (status === this.GLOBAL.status.canceledBySolver) {
        return 'white'
      } else if (status === this.GLOBAL.status.finished) {
        return 'white'
      } else if (status === this.GLOBAL.status.recorded) {
        return 'white'
      } else {
        return 'black'
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
        return 'mdi-delete-circle'
      }
    },
    getStatusText (status) {
      if (status === this.GLOBAL.status.waiting) {
        return '等待接单'
      } else if (status === this.GLOBAL.status.receipted) {
        return '已接单'
      } else if (status === this.GLOBAL.status.canceledByUser) {
        return '用户取消'
      } else if (status === this.GLOBAL.status.canceledBySolver) {
        return '已关闭'
      } else if (status === this.GLOBAL.status.finished) {
        return '订单完成'
      } else if (status === this.GLOBAL.status.recorded) {
        return '登记完成'
      } else {
        return '未知'
      }
    }
  },
  computed: {
    orderListHeaders () {
      const headers = [
        {
          text: this.$i18n.t('order.orderList.header.userName'),
          align: 'start',
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
