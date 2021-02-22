<template>
  <div>
    <v-card
      elevation="2"
      class="mx-auto transition-swing"
      max-width="1200"
      :width="
        $vuetify.breakpoint.name == 'xs' || $vuetify.breakpoint.name == 'sm'
          ? '100%'
          : '90%'
      "
    >
      <!-- 表格 header 内容 -->
      <!-- 标题 / 导出订单按钮 -->
      <v-toolbar flat class="body-1 pt-2">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-toolbar-title
              class="hidden-xs-only"
              style="cursor: pointer;"
              v-bind="attrs"
              v-on="on"
              @click="openExportRecordsDialog"
              >{{ $t('order.orderList.title') }}</v-toolbar-title
            >
          </template>
          <span>{{ $t('order.orderList.titleTooltip') }}</span>
        </v-tooltip>
        <v-divider class="mx-4 hidden-xs-only" inset vertical />
        <v-spacer />
        <!-- 过滤器下拉框 -->
        <v-select
          v-model="filterSelect"
          dense
          :items="filterItems"
          :label="filterLabel"
          class="mt-5"
          outlined
          @change="changeOrderListFilter"
        >
          <template v-slot:prepend-item>
            <v-list-item ripple @click="openOrderSearchDialog">
              <v-list-item-action>
                <v-icon>
                  mdi-briefcase-search
                </v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  {{ $t('order.orderList.searchOrder') }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider class="mt-2"></v-divider>
          </template>
        </v-select>
        <v-divider class="mx-4" inset vertical />
        <!-- 导出订单记录按钮 -->
        <v-btn
          color="info"
          class="mb-2 mr-2 d-flex d-sm-none"
          @click="openExportRecordsDialog"
          >{{ $t('order.orderList.exportOrderShort') }}</v-btn
        >
        <!-- 创建新订单按钮 -->
        <v-btn
          color="success"
          class="mb-2"
          @click="openCreateOrderSolverSheet"
          >{{
            $vuetify.breakpoint.xs
              ? $t('order.createOrder.solver.createShort')
              : $t('order.createOrder.solver.create')
          }}</v-btn
        >
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
              :disabled="orderListLoading || !showLoadMore"
              :loading="orderListLoading"
              depressed
              block
              @click="loadMoreOrderListItems"
              >{{
                showLoadMore
                  ? $t('order.orderList.loadingMore') +
                    ' ' +
                    $Utils.generateEmoticons()
                  : $t('order.orderList.noLoadingMore') +
                    ' ' +
                    $Utils.generateEmoticons('happy')
              }}</v-btn
            >
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
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  :icon="!$vuetify.breakpoint.xs"
                  :small="$vuetify.breakpoint.xs"
                  depressed
                  :disabled="!item.is_solver"
                  @click="modifyOrder(item)"
                  class="mr-1"
                >
                  <v-icon
                    :left="$vuetify.breakpoint.xs"
                    :small="$vuetify.breakpoint.xs"
                    >mdi-pencil{{
                      $vuetify.breakpoint.xs ? '-outline' : ''
                    }}</v-icon
                  >
                  <span v-if="$vuetify.breakpoint.xs">{{
                    $t('order.orderList.actions.modifyOrder')
                  }}</span>
                </v-btn>
              </template>
              <span>{{
                $t('order.orderList.actions.modifyOrderTooltip')
              }}</span>
            </v-tooltip>

            <!-- 拨打电话 -->
            <v-tooltip
              bottom
              v-if="
                item.is_solver &&
                  item.order_status === $GLOBAL.status.receipted &&
                  item.order_user_telephone
              "
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  :icon="!$vuetify.breakpoint.xs"
                  :small="$vuetify.breakpoint.xs"
                  depressed
                  @click="telephoneCall(item.order_user_telephone)"
                  class="mr-1"
                >
                  <v-icon
                    :left="$vuetify.breakpoint.xs"
                    :small="$vuetify.breakpoint.xs"
                    >mdi-phone-in-talk{{
                      $vuetify.breakpoint.xs ? '-outline' : ''
                    }}</v-icon
                  >
                  <span v-if="$vuetify.breakpoint.xs">{{
                    $t('order.orderList.actions.teleCall')
                  }}</span>
                </v-btn>
              </template>
              <span>{{ $t('order.orderList.actions.teleCallTooltip') }}</span>
            </v-tooltip>
            <!-- 接取订单 -->
            <v-tooltip
              bottom
              v-if="item.order_status === $GLOBAL.status.waiting"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  :icon="!$vuetify.breakpoint.xs"
                  :small="$vuetify.breakpoint.xs"
                  depressed
                  @click="receiptOrder(item)"
                  class="mr-1"
                >
                  <v-icon
                    :left="$vuetify.breakpoint.xs"
                    :small="$vuetify.breakpoint.xs"
                    >mdi-briefcase-plus{{
                      $vuetify.breakpoint.xs ? '-outline' : ''
                    }}</v-icon
                  >
                  <span v-if="$vuetify.breakpoint.xs">{{
                    $t('order.orderList.actions.acceptOrder')
                  }}</span>
                </v-btn>
              </template>
              <span>{{
                $t('order.orderList.actions.acceptOrderTooltip')
              }}</span>
            </v-tooltip>
            <!-- 完成订单 -->
            <v-tooltip
              bottom
              v-else-if="
                item.order_status === $GLOBAL.status.receipted && item.is_solver
              "
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  :icon="!$vuetify.breakpoint.xs"
                  :small="$vuetify.breakpoint.xs"
                  depressed
                  @click="finishOrder(item)"
                  class="mr-1"
                >
                  <v-icon
                    :left="$vuetify.breakpoint.xs"
                    :small="$vuetify.breakpoint.xs"
                    >mdi-checkbox-multiple-marked{{
                      $vuetify.breakpoint.xs ? '-outline' : ''
                    }}</v-icon
                  >
                  <span v-if="$vuetify.breakpoint.xs">{{
                    $t('order.orderList.actions.finishOrder')
                  }}</span>
                </v-btn>
              </template>
              <span>{{
                $t('order.orderList.actions.finishOrderTooltip')
              }}</span>
            </v-tooltip>
            <!-- 重启订单 -->
            <v-tooltip
              bottom
              v-if="item.order_status === $GLOBAL.status.canceledBySolver"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  :icon="!$vuetify.breakpoint.xs"
                  :small="$vuetify.breakpoint.xs"
                  depressed
                  @click="restoreOrder(item)"
                  class="mr-1"
                >
                  <v-icon
                    :left="$vuetify.breakpoint.xs"
                    :small="$vuetify.breakpoint.xs"
                    >mdi-autorenew</v-icon
                  >
                  <span v-if="$vuetify.breakpoint.xs">{{
                    $t('order.orderList.actions.restoreOrder')
                  }}</span>
                </v-btn>
              </template>
              <span>{{
                $t('order.orderList.actions.restoreOrderTooltip')
              }}</span>
            </v-tooltip>
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
                <v-col cols="12" v-if="item.order_user_name">
                  <v-chip small label outlined class="mr-1">
                    <v-icon small left>mdi-account-outline</v-icon>
                    {{ $t('order.orderList.expanded.username') }}
                  </v-chip>
                  <span style="display: inline-block;">{{
                    item.order_user_name
                  }}</span>
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
                <v-col cols="12" v-if="item.order_user_description">
                  <v-chip small label outlined class="mr-1">
                    <v-icon small left>mdi-calendar-blank-outline</v-icon>
                    {{ $t('order.orderList.expanded.description') }}
                  </v-chip>
                  <span style="display: inline-block;">{{
                    item.order_user_description
                  }}</span>
                </v-col>
                <!-- 订单处理者姓名 -->
                <v-col cols="12" v-if="item.solver_name">
                  <v-chip
                    small
                    label
                    outlined
                    class="mr-1"
                    :color="item.is_solver ? 'primary' : ''"
                  >
                    <v-icon small left>mdi-card-account-details-outline</v-icon>
                    {{ $t('order.orderList.expanded.solverName') }}
                  </v-chip>
                  <span style="display: inline-block;"
                    >{{ item.solver_name
                    }}<span v-if="item.is_solver"
                      >({{ $t('order.orderList.expanded.you') }})</span
                    >
                  </span>
                </v-col>
                <!-- 订单处理者记录 -->
                <v-col cols="12" v-if="item.order_solver_record">
                  <v-chip small label outlined class="mr-1">
                    <v-icon small left>mdi-calendar-check-outline</v-icon>
                    {{ $t('order.orderList.expanded.record') }}
                  </v-chip>
                  <span style="display: inline-block;">{{
                    item.order_solver_record
                  }}</span>
                </v-col>
                <!-- 订单创建日期 -->
                <v-col cols="12" v-if="item.create_date">
                  <v-chip small label outlined class="mr-1">
                    <v-icon small left>mdi-clock-outline</v-icon>
                    {{ $t('order.orderList.expanded.createDate') }}
                  </v-chip>
                  <span style="display: inline-block;">{{
                    item.create_date
                  }}</span>
                </v-col>
                <!-- 订单关闭日期 -->
                <v-col cols="12" v-if="item.close_date">
                  <v-chip small label outlined class="mr-1">
                    <v-icon small left>mdi-clock-check-outline</v-icon>
                    {{ $t('order.orderList.expanded.closeDate') }}
                  </v-chip>
                  <span style="display: inline-block;">{{
                    item.close_date
                  }}</span>
                </v-col>
              </v-row>

              <v-divider class="mt-4 mb-4" />

              <!-- 订单额外操作 -->
              <v-row class="mb-1">
                <v-col v-if="item.order_status !== $GLOBAL.status.recorded">
                  <!-- 查看出勤记录 -->
                  <v-btn
                    small
                    depressed
                    @click="openAttnDialog(item)"
                    class="mr-2 mb-1"
                  >
                    <v-icon small left>mdi-briefcase-outline</v-icon
                    >{{ $t('order.orderList.expanded.viewAttendance') }}
                  </v-btn>
                  <!-- 查看协作人 -->
                  <v-btn
                    small
                    depressed
                    @click="openAssigneeDialog(item)"
                    class="mr-2 mb-1"
                  >
                    <v-icon small left>mdi-comment-account-outline</v-icon
                    >{{ $t('order.orderList.expanded.viewAssignee') }}
                  </v-btn>
                  <!-- 显示更多操作 -->
                  <v-btn
                    @click="showExtraActions = !showExtraActions"
                    class="mr-2 mb-1"
                    icon
                  >
                    <v-icon
                      >mdi-{{
                        showExtraActions
                          ? 'chevron-left-circle-outline'
                          : 'chevron-right-circle-outline'
                      }}</v-icon
                    >
                  </v-btn>
                  <!-- 查看订单操作记录 -->
                  <v-btn
                    small
                    depressed
                    v-show="showExtraActions"
                    @click="openOrderActionNotesDialog(item)"
                    class="mr-2 mb-1"
                  >
                    <v-icon small left>mdi-calendar-clock</v-icon
                    >{{ $t('order.orderList.expanded.viewActionNotes') }}
                  </v-btn>
                  <!-- 取消订单 -->
                  <v-btn
                    small
                    depressed
                    v-show="showExtraActions"
                    v-if="item.order_status === $GLOBAL.status.receipted"
                    :disabled="!item.is_solver"
                    @click="cancelOrder(item)"
                    class="mr-2 mb-1"
                  >
                    <v-icon small left>mdi-close-circle-outline</v-icon
                    >{{ $t('order.orderList.expanded.cancelOrder') }}
                  </v-btn>
                  <!-- 关闭订单 -->
                  <v-btn
                    small
                    depressed
                    v-show="showExtraActions"
                    v-if="
                      item.order_status === $GLOBAL.status.waiting ||
                        item.order_status === $GLOBAL.status.receipted
                    "
                    :disabled="
                      item.order_status === $GLOBAL.status.receipted &&
                        !item.is_solver
                    "
                    @click="closeOrder(item)"
                    class="mb-1"
                  >
                    <v-icon small left>mdi-delete-circle-outline</v-icon
                    >{{ $t('order.orderList.expanded.closeOrder') }}
                  </v-btn>
                  <!-- 重开订单 -->
                  <v-btn
                    small
                    depressed
                    v-show="showExtraActions"
                    v-if="item.order_status === $GLOBAL.status.finished"
                    :disabled="!item.is_solver"
                    @click="restartOrder(item)"
                    class="mb-1"
                  >
                    <v-icon small left>mdi-progress-wrench</v-icon
                    >{{ $t('order.orderList.expanded.restartOrder') }}
                  </v-btn>
                </v-col>
              </v-row>
            </td>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <AssigneeDialog />
    <AttendanceDialog />
    <ExportRecordsDialog />
    <OrderActionNotesDialog />
    <OrderSearchDialog />
  </div>
</template>

<script>
import AssigneeDialog from '@/components/Order/AssigneeDialog'
import AttendanceDialog from '@/components/Order/AttendanceDialog'
import ExportRecordsDialog from '@/components/Order/ExportRecordsDialog'
import OrderActionNotesDialog from '@/components/Order/OrderActionNotesDialog'
import OrderSearchDialog from '@/components/Order/OrderSearchDialog'

export default {
  name: 'OrderList',
  components: {
    AssigneeDialog,
    AttendanceDialog,
    ExportRecordsDialog,
    OrderActionNotesDialog,
    OrderSearchDialog
  },
  data: () => ({
    filterSelect: '显示可用',
    filterItems: ['显示可用', '我已接单', '与我相关', '显示全部'],
    itemsPerPage: -1,
    page: 1,
    loadLimit: 15, // 每次加载订单数
    orderListLoading: true,
    showLoadMore: false,
    expandedOrder: [],
    orderListItems: [],
    showExtraActions: false
  }),
  created () {
    // 从 localStorage 读取最近一次自定义的过滤 filter
    const customFilter = localStorage.getItem('orderListCustomFilter')
    if (customFilter && customFilter != '') {
      this.filterItems.push(customFilter)
    }

    if (this.$DevMode) {
      this.orderListItems = this.$DevData.order.orderListOrders
      this.showLoadMore = true
      this.orderListLoading = false
      return
    }

    this.loadMoreOrderListItems()
  },
  methods: {
    changeOrderListFilter (id) {
      // 修改订单过滤下拉框时触发此方法
      if (this.$DevMode) return // 开发者模式禁用过滤选项

      this.page = 1
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
    openOrderSearchDialog () {
      this.$Bus.$emit('openOrderSearchDialog')
    },
    // 接取订单，设置订单状态为已接取
    receiptOrder (item) {
      if (
        confirm(this.$i18n.t('order.orderList.actions.receiptOrderConfirm'))
      ) {
        if (this.$DevMode) {
          this.$Bus.$emit(
            'setSnackbar',
            this.$i18n.t('order.orderList.actions.receiptOrderSucceed')
          )
          for (let i = 0; i < this.orderListItems.length; i++) {
            if (this.orderListItems[i] == item) {
              this.orderListItems[
                i
              ].order_status = this.$GLOBAL.status.receipted
              this.orderListItems[i].is_solver = true
              this.orderListItems[i].solver_name = 'Developer'
              break
            }
          }
          return
        }

        this.axios
          .post('/api/order/receiptOrder', {
            order_id: item.order_id
          })
          .then(Response => {
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

        this.axios
          .post('/api/order/finishOrder', {
            order_id: item.order_id
          })
          .then(Response => {
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
      if (
        confirm(this.$i18n.t('order.orderList.actions.restoreOrderConfirm'))
      ) {
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

        this.axios
          .post('/api/order/restoreOrder', {
            order_id: item.order_id
          })
          .then(Response => {
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

        this.axios
          .post('/api/order/cancelOrder', {
            order_id: item.order_id
          })
          .then(Response => {
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
              this.orderListItems[
                i
              ].order_status = this.$GLOBAL.status.canceledBySolver
              this.orderListItems[i].is_solver = false
              this.orderListItems[i].solver_name = ''
              break
            }
          }
          return
        }

        this.axios
          .post('/api/order/closeOrder', {
            order_id: item.order_id
          })
          .then(Response => {
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
      if (
        confirm(this.$i18n.t('order.orderList.actions.restartOrderConfirm'))
      ) {
        if (this.$DevMode) {
          this.$Bus.$emit(
            'setSnackbar',
            this.$i18n.t('order.orderList.actions.restartOrderSucceed')
          )
          for (let i = 0; i < this.orderListItems.length; i++) {
            if (this.orderListItems[i] == item) {
              this.orderListItems[
                i
              ].order_status = this.$GLOBAL.status.receipted
              this.orderListItems[i].close_date = ''
              break
            }
          }
          return
        }

        this.axios
          .post('/api/order/restartOrder', {
            order_id: item.order_id
          })
          .then(Response => {
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
    // 载入更多订单信息
    loadMoreOrderListItems () {
      if (this.$DevMode) {
        this.showLoadMore = false
        return
      }

      this.orderListLoading = true

      const limit = this.loadLimit
      const page = this.page

      let filter = ''
      switch (this.filterSelect) {
        case '显示可用':
          filter = 'available'
          break
        case '我已接单':
          filter = 'received'
          break
        case '与我相关':
          filter = 'relevant'
          break
        case '显示全部':
          filter = 'all'
          break
        default:
          filter = this.filterSelect
      }

      this.axios
        .post('/api/order/queryOrderList', {
          page: page,
          filter: filter,
          limit: limit
        })
        .then(Response => {
          this.page = page + 1

          const orderItems = Response.data
          this.orderListItems.push(...orderItems)

          if (orderItems.length === limit) {
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
        if (isSolver) {
          return this.$i18n.t('order.orderList.status.receiptedByYou')
        } else return this.$i18n.t('order.orderList.status.receipted')
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
  },
  mounted () {
    this.$Bus.$on('setOrderListFilter', msg => {
      if (this.filterItems.length === 4) {
        localStorage.setItem('orderListCustomFilter', msg)
        this.filterItems.push(msg)
        this.filterSelect = msg
        this.changeOrderListFilter()
      } else {
        if (this.filterItems[4] !== msg) {
          localStorage.setItem('orderListCustomFilter', msg)
          this.filterItems.pop()
          this.filterItems.push(msg)
          this.filterSelect = msg
          this.changeOrderListFilter()
        }
      }
    })
  }
}
</script>
