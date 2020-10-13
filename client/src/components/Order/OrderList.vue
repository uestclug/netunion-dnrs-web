<template>
  <v-container>
    <v-hover
      v-slot:default="{ hover }"
      open-delay="200"
    >
      <v-card
        :elevation="hover ? 16 : 2"
        class="mx-auto transition-swing"
        max-width="1200"
      >
        <!-- 表格 header 内容 -->
        <v-toolbar
          flat
          class="body-1 pt-2"
        >
          <v-toolbar-title
            class="hidden-xs-only"
            style="cursor: pointer;"
            @click="openExportRecordsDialog"
          >{{ $t('order.orderList.title') }}</v-toolbar-title>
          <v-divider
            class="mx-4 hidden-xs-only"
            inset
            vertical
          />
          <v-spacer />
          <v-select
            v-model="filterSelect"
            dense
            :items="filterItems"
            :label="filterLabel"
            class="mt-5"
            outlined
            @change="changeOrderListFilter"
          ></v-select>
          <v-divider
            class="mx-4"
            inset
            vertical
          />
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
            :no-data-text="orderListNoDataText"
            hide-default-footer
            multi-sort
          >
            <!-- 表格 footer 内容 -->
            <template v-slot:footer>
              <v-btn
                v-show="showLoadMore"
                :disabled="orderListLoading"
                :loading="orderListLoading"
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
              <!-- 修改订单 -->
              <v-icon
                :disabled="!item.is_solver"
                @click="modifyOrder(item)"
              >mdi-pencil</v-icon>
              <!-- 拨打电话 -->
              <v-icon
                v-if="item.is_solver && item.order_status === $GLOBAL.status.receipted && item.order_user_telephone"
                @click="telephoneCall(item.order_user_telephone)"
                class="ml-3"
              >mdi-phone-in-talk</v-icon>
              <!-- 接取订单 -->
              <v-icon
                v-if="item.order_status === $GLOBAL.status.waiting"
                @click="receiptOrder(item)"
                class="ml-3"
              >mdi-briefcase-plus</v-icon>
              <!-- 完成订单 -->
              <v-icon
                v-else-if="item.order_status === $GLOBAL.status.receipted && item.is_solver"
                @click="finishOrder(item)"
                class="ml-3"
              >mdi-checkbox-multiple-marked</v-icon>
              <!-- 重置订单 -->
              <v-icon
                v-if="item.order_status === $GLOBAL.status.canceledBySolver"
                @click="restoreOrder(item)"
                class="ml-3"
              >mdi-autorenew</v-icon>
            </template>
            <!-- 订单展开内容 -->
            <template v-slot:expanded-item="{ headers, item }">
              <td :colspan="headers.length">
                <!-- 订单详细信息 -->
                <v-row
                  style="word-wrap: break-word; word-break: break-all"
                  class="mt-3"
                >
                  <!-- 用户填写姓名 -->
                  <v-col
                    cols="12"
                    v-if="item.order_user_name"
                  >
                    <v-chip
                      small
                      label
                      outlined
                      class="mr-1"
                    >
                      <v-icon
                        small
                        left
                      >mdi-account-outline</v-icon>
                      {{ $t('order.orderList.expanded.username') }}
                    </v-chip>
                    <span style="display: inline-block;">{{ item.order_user_name }}</span>
                  </v-col>
                  <!-- 订单用户联系电话
                  <v-col
                    cols="12"
                    v-if="item.order_user_telephone"
                  >
                    <v-chip
                      small
                      label
                      outlined
                      class="mr-1"
                    >
                      <v-icon
                        small
                        left
                      >mdi-cellphone</v-icon>
                      {{ $t('order.orderList.expanded.telephone') }}
                    </v-chip>
                    <span style="display: inline-block;">{{ item.order_user_telephone }}</span>
                  </v-col>
                  -->
                  <!-- 订单寝室地址
                  <v-col
                    cols="12"
                    v-if="item.order_user_dormitory"
                  >
                    <v-chip
                      small
                      label
                      outlined
                      class="mr-1"
                    >
                      <v-icon
                        small
                        left
                      >mdi-map-marker-outline</v-icon>
                      <span style="display: inline-block;">{{ $t('order.orderList.expanded.dormitory') }}</span>
                    </v-chip>
                    <span style="display: inline-block;">{{ item.order_user_dormitory }}</span>
                  </v-col>
                  -->
                  <!-- 订单描述 -->
                  <v-col
                    cols="12"
                    v-if="item.order_user_description"
                  >
                    <v-chip
                      small
                      label
                      outlined
                      class="mr-1"
                    >
                      <v-icon
                        small
                        left
                      >mdi-calendar-blank-outline</v-icon>
                      {{ $t('order.orderList.expanded.description') }}
                    </v-chip>
                    <span style="display: inline-block;">{{ item.order_user_description }}</span>
                  </v-col>
                  <!-- 订单处理者姓名 -->
                  <v-col
                    cols="12"
                    v-if="item.solver_name"
                  >
                    <v-chip
                      small
                      label
                      outlined
                      class="mr-1"
                      :color="item.is_solver ? 'primary' : ''"
                    >
                      <v-icon
                        small
                        left
                      >mdi-card-account-details-outline</v-icon>
                      {{ $t('order.orderList.expanded.solverName') }}
                    </v-chip>
                    <span style="display: inline-block;">{{ item.solver_name }}<span
                      v-if="item.is_solver"
                    >({{ $t('order.orderList.expanded.you') }})</span>
                    </span>
                  </v-col>
                  <!-- 订单处理者记录 -->
                  <v-col
                    cols="12"
                    v-if="item.order_solver_record"
                  >
                    <v-chip
                      small
                      label
                      outlined
                      class="mr-1"
                    >
                      <v-icon
                        small
                        left
                      >mdi-calendar-check-outline</v-icon>
                      {{ $t('order.orderList.expanded.record') }}
                    </v-chip>
                    <span style="display: inline-block;">{{ item.order_solver_record }}</span>
                  </v-col>
                  <!-- 订单创建日期 -->
                  <v-col
                    cols="12"
                    v-if="item.create_date"
                  >
                    <v-chip
                      small
                      label
                      outlined
                      class="mr-1"
                    >
                      <v-icon
                        small
                        left
                      >mdi-clock-outline</v-icon>
                      {{ $t('order.orderList.expanded.createDate') }}
                    </v-chip>
                    <span style="display: inline-block;">{{ item.create_date }}</span>
                  </v-col>
                  <!-- 订单关闭日期 -->
                  <v-col
                    cols="12"
                    v-if="item.close_date"
                  >
                    <v-chip
                      small
                      label
                      outlined
                      class="mr-1"
                    >
                      <v-icon
                        small
                        left
                      >mdi-clock-check-outline</v-icon>
                      {{ $t('order.orderList.expanded.closeDate') }}
                    </v-chip>
                    <span style="display: inline-block;">{{ item.close_date }}</span>
                  </v-col>
                </v-row>

                <!-- 订单额外操作 -->
                <v-row class="mb-3">
                  <v-col v-if="item.order_status !== $GLOBAL.status.recorded">
                    <!-- 查看出勤记录 -->
                    <v-btn
                      small
                      depressed
                      @click="openAttnDialog(item)"
                      class="mr-2"
                    >
                      <v-icon
                        small
                        left
                      >mdi-briefcase-outline</v-icon>{{ $t('order.orderList.expanded.viewAttendance') }}
                    </v-btn>
                    <!-- 查看协作人 -->
                    <v-btn
                      small
                      depressed
                      @click="openAssigneeDialog(item)"
                      class="mr-2"
                    >
                      <v-icon
                        small
                        left
                      >mdi-comment-account-outline</v-icon>{{ $t('order.orderList.expanded.viewAssignee') }}
                    </v-btn>
                    <!-- 显示更多操作 -->
                    <v-btn
                      @click="showExtraActions = !showExtraActions"
                      class="mr-2"
                      icon
                    >
                      <v-icon>mdi-{{ showExtraActions ? "chevron-left-circle-outline" : "chevron-right-circle-outline" }}</v-icon>
                    </v-btn>
                    <!-- 查看订单操作记录 -->
                    <v-btn
                      small
                      depressed
                      v-show="showExtraActions"
                      @click="openOrderActionNotesDialog(item)"
                      class="mr-2"
                    >
                      <v-icon
                        small
                        left
                      >mdi-calendar-clock</v-icon>{{ $t('order.orderList.expanded.viewActionNotes') }}
                    </v-btn>
                    <!-- 取消订单 -->
                    <v-btn
                      small
                      depressed
                      v-show="showExtraActions"
                      v-if="item.order_status === $GLOBAL.status.receipted"
                      :disabled="!item.is_solver"
                      @click="cancelOrder(item)"
                      class="mr-2"
                    >
                      <v-icon
                        small
                        left
                      >mdi-close-circle-outline</v-icon>{{ $t('order.orderList.expanded.cancelOrder') }}
                    </v-btn>
                    <!-- 关闭订单 -->
                    <v-btn
                      small
                      depressed
                      v-show="showExtraActions"
                      v-if="item.order_status === $GLOBAL.status.waiting || item.order_status === $GLOBAL.status.receipted"
                      :disabled="!item.is_solver"
                      @click="closeOrder(item)"
                    >
                      <v-icon
                        small
                        left
                      >mdi-delete-circle-outline</v-icon>{{ $t('order.orderList.expanded.closeOrder') }}
                    </v-btn>
                    <!-- 重开订单 -->
                    <v-btn
                      small
                      depressed
                      v-show="showExtraActions"
                      v-if="item.order_status === $GLOBAL.status.finished"
                      :disabled="!item.is_solver"
                      @click="restartOrder(item)"
                    >
                      <v-icon
                        small
                        left
                      >mdi-progress-wrench</v-icon>{{ $t('order.orderList.expanded.restartOrder') }}
                    </v-btn>
                    <!-- 删除订单记录
                    <v-btn
                      small
                      depressed
                      v-if="item.order_status === $GLOBAL.status.canceledByUser ||
                      item.order_status === $GLOBAL.status.canceledBySolver ||
                      (item.order_status === $GLOBAL.status.finished && item.is_solver) ||
                      (item.order_status === $GLOBAL.status.recorded && item.is_solver)"
                      label
                      @click="deleteOrder(item)"
                    >删除此订单</v-btn>
                    -->
                  </v-col>
                </v-row>
              </td>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-hover>

    <AssigneeDialog />
    <AttendanceDialog />
    <OrderActionNotesDialog />
    <ExportRecordsDialog />
  </v-container>
</template>

<script>
import AssigneeDialog from '@/components/Order/AssigneeDialog'
import AttendanceDialog from '@/components/Order/AttendanceDialog'
import OrderActionNotesDialog from '@/components/Order/OrderActionNotesDialog'
import ExportRecordsDialog from '@/components/Order/ExportRecordsDialog'

export default {
  name: 'OrderList',
  components: {
    AssigneeDialog,
    AttendanceDialog,
    OrderActionNotesDialog,
    ExportRecordsDialog
  },
  data: () => ({
    filterSelect: '显示可用',
    filterItems: ['显示可用', '与我相关', '显示全部'],
    itemsPerPage: -1,
    page: 1,
    orderListLoading: true,
    showLoadMore: false,
    expandedOrder: [],
    orderListItems: [],
    showExtraActions: false
  }),
  created () {
    if (this.$DevMode) {
      this.orderListItems = this.$DevData.order.orderListOrders
      this.showLoadMore = true
      this.orderListLoading = false
      return
    }

    this.axios.post('/api/order/queryOrderList', {
      page: 1,
      filter: this.$GLOBAL.filter.available
    }).then((Response) => {
      const orderItems = Response.data
      this.orderListItems = orderItems
      if (orderItems.length === 10) {
        this.showLoadMore = true
      }
      this.orderListLoading = false
    })
  },
  methods: {
    changeOrderListFilter (id) {
      if (this.$DevMode) return // 开发者模式禁用过滤选项

      this.page = 0
      this.orderListItems = []

      this.loadMoreOrderListItems()
    },
    openCreateOrderSolverSheet () {
      this.$Bus.$emit('openCreateOrderSolverSheet')
    },
    openAttnDialog (item) {
      this.$Bus.$emit('openAttnDialog', item)
    },
    openAssigneeDialog (item) {
      this.$Bus.$emit('openAssigneeDialog', item)
    },
    openOrderActionNotesDialog (item) {
      this.$Bus.$emit('openOrderActionNotesDialog', item)
    },
    openExportRecordsDialog () {
      this.$Bus.$emit('openExportRecordsDialog')
    },
    // 接取订单，设置订单状态为已接取
    receiptOrder (item) {
      if (confirm(this.$i18n.t('order.orderList.actions.receiptOrderConfirm'))) {
        if (this.$DevMode) {
          this.$Bus.$emit(
            'setSnackbar',
            this.$i18n.t('order.orderList.actions.receiptOrderSucceed')
          )
          for (let i = 0; i < this.orderListItems.length; i++) {
            if (this.orderListItems[i] == item) {
              this.orderListItems[i].order_status = this.$GLOBAL.status.receipted
              this.orderListItems[i].is_solver = true
              this.orderListItems[i].solver_name = 'Developer'
              break
            }
          }
          return
        }

        this.axios.post('/api/order/receiptOrder', {
          order_id: item.order_id
        }).then((Response) => {
          if (Response.data) {
            this.$Bus.$emit(
              'setSnackbar',
              this.$i18n.t('order.orderList.actions.receiptOrderSucceed')
            )
          } else {
            this.$Bus.$emit(
              'setSnackbar',
              this.$i18n.t('order.orderList.actions.receiptOrderFailed')
            )
          }
          this.refreshRouter()
        })
      }
    },
    // 设置订单状态为已完成
    finishOrder (item) {
      if (confirm(this.$i18n.t('order.orderList.actions.finishOrderConfirm'))) {
        if (this.$DevMode) {
          this.$Bus.$emit(
            'setSnackbar',
            this.$i18n.t('order.orderList.actions.finishOrderSucceed')
          )
          for (let i = 0; i < this.orderListItems.length; i++) {
            if (this.orderListItems[i] == item) {
              this.orderListItems[i].order_status = this.$GLOBAL.status.finished
              this.orderListItems[i].close_date = new Date().toLocaleString()
              break
            }
          }
          return
        }

        this.axios.post('/api/order/finishOrder', {
          order_id: item.order_id
        }).then((Response) => {
          if (Response.data) {
            this.$Bus.$emit(
              'setSnackbar',
              this.$i18n.t('order.orderList.actions.finishOrderSucceed')
            )
          } else {
            this.$Bus.$emit(
              'setSnackbar',
              this.$i18n.t('order.orderList.actions.finishOrderFailed')
            )
          }
          this.refreshRouter()
        })
      }
    },
    // 将 solver 关闭订单的状态设置为待接取
    restoreOrder (item) {
      if (confirm(this.$i18n.t('order.orderList.actions.restoreOrderConfirm'))) {
        if (this.$DevMode) {
          this.$Bus.$emit(
            'setSnackbar',
            this.$i18n.t('order.orderList.actions.restoreOrderSucceed')
          )
          for (let i = 0; i < this.orderListItems.length; i++) {
            if (this.orderListItems[i] == item) {
              this.orderListItems[i].order_status = this.$GLOBAL.status.waiting
              break
            }
          }
          return
        }

        this.axios.post('/api/order/restoreOrder', {
          order_id: item.order_id
        }).then((Response) => {
          if (Response.data) {
            this.$Bus.$emit(
              'setSnackbar',
              this.$i18n.t('order.orderList.actions.restoreOrderSucceed')
            )
          } else {
            this.$Bus.$emit(
              'setSnackbar',
              this.$i18n.t('order.orderList.actions.restoreOrderFailed')
            )
          }
          this.refreshRouter()
        })
      }
    },
    // 修改订单信息
    modifyOrder (item) {
      this.$Bus.$emit('openModifyOrderSolverSheet', item)
    },
    // 取消订单，并设置订单状态为待接取
    cancelOrder (item) {
      if (confirm(this.$i18n.t('order.orderList.actions.cancelOrderConfirm'))) {
        if (this.$DevMode) {
          this.$Bus.$emit(
            'setSnackbar',
            this.$i18n.t('order.orderList.actions.cancelOrderSucceed')
          )
          for (let i = 0; i < this.orderListItems.length; i++) {
            if (this.orderListItems[i] == item) {
              this.orderListItems[i].order_status = this.$GLOBAL.status.waiting
              this.orderListItems[i].is_solver = false
              this.orderListItems[i].solver_name = ''
              break
            }
          }
          return
        }

        this.axios.post('/api/order/cancelOrder', {
          order_id: item.order_id
        }).then((Response) => {
          if (Response.data) {
            this.$Bus.$emit(
              'setSnackbar',
              this.$i18n.t('order.orderList.actions.cancelOrderSucceed')
            )
          } else {
            this.$Bus.$emit(
              'setSnackbar',
              this.$i18n.t('order.orderList.actions.cancelOrderFailed')
            )
          }
          this.refreshRouter()
        })
      }
    },
    // 关闭订单，并设置订单状态为处理者关闭
    closeOrder (item) {
      if (confirm(this.$i18n.t('order.orderList.actions.closeOrderConfirm'))) {
        if (this.$DevMode) {
          this.$Bus.$emit(
            'setSnackbar',
            this.$i18n.t('order.orderList.actions.closeOrderSucceed')
          )
          for (let i = 0; i < this.orderListItems.length; i++) {
            if (this.orderListItems[i] == item) {
              this.orderListItems[i].order_status = this.$GLOBAL.status.canceledBySolver
              this.orderListItems[i].is_solver = false
              this.orderListItems[i].solver_name = ''
              break
            }
          }
          return
        }

        this.axios.post('/api/order/closeOrder', {
          order_id: item.order_id
        }).then((Response) => {
          if (Response.data) {
            this.$Bus.$emit(
              'setSnackbar',
              this.$i18n.t('order.orderList.actions.closeOrderSucceed')
            )
          } else {
            this.$Bus.$emit(
              'setSnackbar',
              this.$i18n.t('order.orderList.actions.closeOrderFailed')
            )
          }
          this.refreshRouter()
        })
      }
    },
    // 重开订单，将已完成订单设置为进行中
    restartOrder (item) {
      if (confirm(this.$i18n.t('order.orderList.actions.restartOrderConfirm'))) {
        if (this.$DevMode) {
          this.$Bus.$emit(
            'setSnackbar',
            this.$i18n.t('order.orderList.actions.restartOrderSucceed')
          )
          for (let i = 0; i < this.orderListItems.length; i++) {
            if (this.orderListItems[i] == item) {
              this.orderListItems[i].order_status = this.$GLOBAL.status.receipted
              this.orderListItems[i].close_date = ''
              break
            }
          }
          return
        }

        this.axios.post('/api/order/restartOrder', {
          order_id: item.order_id
        }).then((Response) => {
          if (Response.data) {
            this.$Bus.$emit(
              'setSnackbar',
              this.$i18n.t('order.orderList.actions.restartOrderSucceed')
            )
          } else {
            this.$Bus.$emit(
              'setSnackbar',
              this.$i18n.t('order.orderList.actions.restartOrderFailed')
            )
          }
          this.refreshRouter()
        })
      }
    },
    // 删除订单
    deleteOrder (item) {
      if (confirm()) {
        console.log('deleted')
      }
    },
    loadMoreOrderListItems () {
      // 点击加载更多按钮载入更多订单信息
      if (this.$DevMode) {
        this.showLoadMore = false
        return
      }

      this.page = this.page + 1
      this.orderListLoading = true

      let filter = false
      if (this.filterSelect === '与我相关') {
        filter = this.$GLOBAL.filter.relevant
      } else if (this.filterSelect === '显示全部') {
        filter = this.$GLOBAL.filter.all
      } else if (this.filterSelect === '显示可用') {
        filter = this.$GLOBAL.filter.available
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
        } else {
          this.showLoadMore = false
        }
        this.orderListLoading = false
      })
    },
    getStatusColor (status, isSolver) {
      if (status === this.$GLOBAL.status.waiting) {
        return 'green'
      } else if (status === this.$GLOBAL.status.receipted) {
        if (isSolver) return 'orange'
        else return 'primary'
      } else if (
        status === this.$GLOBAL.status.canceledByUser ||
        status === this.$GLOBAL.status.canceledBySolver
      ) {
        return 'grey'
      } else if (status === this.$GLOBAL.status.finished) {
        return 'teal'
      } else if (status === this.$GLOBAL.status.recorded) {
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
      if (status === this.$GLOBAL.status.waiting) {
        return 'mdi-bell-circle'
      } else if (status === this.$GLOBAL.status.receipted) {
        return 'mdi-account-circle'
      } else if (status === this.$GLOBAL.status.canceledByUser) {
        return 'mdi-close-circle'
      } else if (status === this.$GLOBAL.status.canceledBySolver) {
        return 'mdi-delete-circle'
      } else if (status === this.$GLOBAL.status.finished) {
        return 'mdi-check-circle'
      } else if (status === this.$GLOBAL.status.recorded) {
        return 'mdi-check-underline-circle'
      } else {
        return null
      }
    },
    getStatusText (status, isSolver) {
      if (status === this.$GLOBAL.status.waiting) {
        return this.$i18n.t('order.orderList.status.waiting')
      } else if (status === this.$GLOBAL.status.receipted) {
        if (isSolver) { return this.$i18n.t('order.orderList.status.receiptedByYou') } else return this.$i18n.t('order.orderList.status.receipted')
      } else if (status === this.$GLOBAL.status.canceledByUser) {
        return this.$i18n.t('order.orderList.status.closed')
      } else if (status === this.$GLOBAL.status.canceledBySolver) {
        return this.$i18n.t('order.orderList.status.closed')
      } else if (status === this.$GLOBAL.status.finished) {
        return this.$i18n.t('order.orderList.status.finished')
      } else if (status === this.$GLOBAL.status.recorded) {
        return this.$i18n.t('order.orderList.status.recorded')
      } else {
        return null
      }
    },
    telephoneCall (telephone) {
      window.location.href = 'tel:' + telephone
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
    orderListNoDataText () {
      return this.$i18n.t('order.orderList.noDataText')
    },
    orderListHeaders () {
      const headers = [
        {
          text: this.$i18n.t('order.orderList.header.userGender'),
          value: 'order_user_gender',
          align: 'start'
        },
        {
          text: this.$i18n.t('order.orderList.header.userCampus'),
          value: 'order_user_campus'
        },
        {
          text: this.$i18n.t('order.orderList.header.userDormitory'),
          value: 'order_user_dormitory',
          sortable: false
        },
        {
          text: this.$i18n.t('order.orderList.header.userTelephone'),
          value: 'order_user_telephone',
          sortable: false
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
          value: 'actions',
          sortable: false
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
