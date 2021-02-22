<template>
  <div>
    <v-dialog
      v-model="assigneeDialog"
      max-width="600"
      :persistent="addAssigneeLoading"
    >
      <v-card>
        <v-card-title>
          {{ $t('order.assigneeDialog.title') }}
        </v-card-title>
        <!-- 订单协作人 -->
        <v-card-text>
          <div class="subtitle-1">
            {{ $t('order.assigneeDialog.nowAssignee') }}
          </div>
          <div v-if="queryAssigneeLoading" class="text--primary">
            {{ $t('order.assigneeDialog.nowAssigneeLoading') }}
          </div>
          <div v-else-if="assignee.length == 0" class="body-1 text--primary">
            {{ $t('order.assigneeDialog.nowAssigneeNotFound') }}
          </div>
          <div v-else>
            <template v-for="asgn in assignee">
              <v-chip
                v-bind:key="asgn.solver_id"
                :color="asgn.solver_id == userId ? 'primary' : ''"
                label
                :close="
                  order.is_solver &&
                    order.order_status === $GLOBAL.status.receipted
                "
                @click:close="toConfirmRemoveAsgnDialog(asgn)"
                class="mr-2 mt-1"
                >{{ asgn.solver_name }}</v-chip
              >
            </template>
          </div>
        </v-card-text>
        <!-- 添加协作人 -->
        <v-card-text
          v-if="
            order != null &&
              order.is_solver &&
              order.order_status === $GLOBAL.status.receipted
          "
        >
          <div class="subtitle-1">
            {{ $t('order.assigneeDialog.addAssignee') }}
          </div>
          <v-btn
            @click="addMasterAsAssignee"
            depressed
            :disabled="addAssigneeLoading"
            >{{ $t('order.assigneeDialog.addMasterAsAssignee') }}</v-btn
          >
          <v-text-field
            v-model="searchTextField"
            :label="label"
            :hint="searchResultText"
            persistent-hint
            single-line
            outlined
            dense
            append-outer-icon="mdi-account-plus"
            @click:append-outer="addAssignee"
            :disabled="addAssigneeLoading"
            class="mt-2"
          ></v-text-field>
        </v-card-text>
        <v-card-actions class="mr-4 pb-4">
          <v-spacer />
          <v-btn
            depressed
            @click="assigneeDialog = false"
            :disabled="addAssigneeLoading"
            >{{ $t('order.assigneeDialog.close') }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="confirmDialog"
      max-width="400"
      :persistent="removeAssigneeLoading"
    >
      <v-card>
        <v-card-title>{{
          $t('order.assigneeDialog.confirmTitle')
        }}</v-card-title>
        <v-card-text>{{ confirmDialogText }}</v-card-text>
        <v-card-actions class="mr-2 pb-4">
          <v-spacer />
          <v-btn
            depressed
            @click="confirmDialog = false"
            :disabled="removeAssigneeLoading"
            >{{ $t('order.assigneeDialog.cancel') }}</v-btn
          >
          <v-btn
            color="primary"
            @click="removeAssignee"
            :disabled="removeAssigneeLoading"
            :loading="removeAssigneeLoading"
            >{{ $t('order.assigneeDialog.confirm') }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'AssigneeDialog',
  data: () => ({
    userId: null,
    assigneeDialog: false,
    confirmDialog: false,
    confirmRemovedAsgnId: null,
    confirmRemovedAsgnName: null,
    confirmDialogText: '',
    order: null,
    assignee: [],
    searchTextField: '',
    searchResultText: '',
    queryAssigneeLoading: true,
    removeAssigneeLoading: false,
    addAssigneeLoading: false
  }),
  methods: {
    queryAssigneeInfo () {
      // 获取此订单的协作人信息
      if (this.$DevMode) {
        this.assignee = this.$DevData.order.assignee
        this.queryAssigneeLoading = false
        return
      }

      this.queryAssigneeLoading = true
      this.axios
        .post('api/order/queryAssignee', {
          order_id: this.order.order_id
        })
        .then(Response => {
          if (Response.data) {
            this.assignee = Response.data
          }
          this.queryAssigneeLoading = false
        })
    },
    toConfirmRemoveAsgnDialog (asgn) {
      // 进入确认移除协作人界面
      this.confirmRemovedAsgnId = asgn.solver_id
      this.confirmRemovedAsgnName = asgn.solver_name
      this.confirmDialogText =
        this.$i18n.t('order.assigneeDialog.confirmRemoveAsgnDialogTextFront') +
        this.confirmRemovedAsgnName +
        this.$i18n.t('order.assigneeDialog.confirmRemoveAsgnDialogTextEnd')
      this.confirmDialog = true
    },
    removeAssignee () {
      // 移除协作人
      if (this.$DevMode) {
        for (let i = 0; i < this.assignee.length; i++) {
          if (this.assignee[i].solver_id == this.confirmRemovedAsgnId) {
            this.assignee.splice(i, 1)
            break
          }
        }
        this.confirmDialog = false
        return
      }

      this.removeAssigneeLoading = true
      this.axios
        .post('api/order/removeAssignee', {
          order_id: this.order.order_id,
          assignee_id: this.confirmRemovedAsgnId,
          assignee_name: this.confirmRemovedAsgnName
        })
        .then(Response => {
          if (Response.data) {
            // 成功移除此协作人
            for (let i = 0; i < this.assignee.length; i++) {
              if (this.assignee[i].solver_id == this.confirmRemovedAsgnId) {
                this.assignee.splice(i, 1)
                break
              }
            }
            this.removeAssigneeLoading = false
            this.confirmDialog = false
          } else {
            // 移除协作人失败
            location.reload()
          }
        })
    },
    addAssignee () {
      // 添加协作人
      const stdId = this.searchTextField
      if (stdId == '') {
        // 搜索学号不能为空
        this.searchResultText = this.$i18n.t(
          'order.assigneeDialog.searchNullError'
        )
        return false
      } else if (stdId == this.order.solver_std_id) {
        // 协作人不能为处理者自己
        this.searchResultText = this.$i18n.t(
          'order.assigneeDialog.addYouAsAssigneeFailed'
        )
        return false
      } else {
        // 检验协作人是否已存在本订单
        for (let i = 0; i < this.assignee.length; i++) {
          if (this.assignee[i].solver_std_id == stdId) {
            this.searchResultText =
              this.$i18n.t('order.assigneeDialog.addAssigneeExisted') +
              this.assignee[i].solver_name
            return false
          }
        }
      }

      this.addAssigneeLoading = true
      this.searchResultText = this.$i18n.t(
        'order.assigneeDialog.searchAssignee'
      )

      if (this.$DevMode) {
        const newAssignee = {
          solver_id: new Date().getTime(),
          solver_std_id: stdId,
          solver_name: 'Other Developer'
        }
        this.assignee.push(newAssignee)
        this.addAssigneeLoading = false
        this.searchResultText =
          this.$i18n.t('order.assigneeDialog.addAssigneeSuccessfully') +
          newAssignee.solver_name
        return
      }

      this.axios
        .post('/api/user/getSolverInfoByStdId', {
          std_id: stdId
        })
        .then(Response => {
          if (Response.data) {
            // 成功获取到处理者信息
            const assigneeId = Response.data.user_id
            const newAssignee = {
              solver_id: assigneeId,
              solver_std_id: Response.data.std_id,
              solver_name: Response.data.name
            }
            this.axios
              .post('/api/order/addAssignee', {
                // 添加协作人记录到数据库
                order_id: this.order.order_id,
                assignee_id: assigneeId,
                assignee_name: newAssignee.solver_name,
                is_solver: this.order.is_solver
              })
              .then(Response => {
                if (Response.data) {
                  // 成功添加协作人记录
                  this.assignee.push(newAssignee)
                  this.searchResultText =
                    this.$i18n.t(
                      'order.assigneeDialog.addAssigneeSuccessfully'
                    ) + newAssignee.solver_name
                  this.addAssigneeLoading = false
                  return true
                } else {
                  // 添加协作人记录失败
                  location.reload()
                  return false
                }
              })
          } else {
            // 未获取到处理者信息或其他错误
            this.searchResultText = this.$i18n.t(
              'order.assigneeDialog.searchAssigneeFailed'
            )
            this.addAssigneeLoading = false
            return false
          }
        })
    },
    addMasterAsAssignee () {
      // 添加维修师傅协作人
      if (this.$DevMode) {
        const newAssignee = {
          solver_id: this.$GLOBAL.master.userId,
          solver_std_id: this.$GLOBAL.master.stdId,
          solver_name: this.$GLOBAL.master.name
        }
        this.assignee.push(newAssignee)
        this.addAssigneeLoading = false
        this.searchResultText =
          this.$i18n.t('order.assigneeDialog.addAssigneeSuccessfully') +
          newAssignee.solver_name
        return
      }

      const inputSearchText = this.searchTextField
      this.searchTextField = this.$GLOBAL.master.stdId
      this.addAssignee()
      this.searchTextField = inputSearchText
    }
  },
  computed: {
    label () {
      return this.$i18n.t('order.assigneeDialog.searchLabel')
    }
  },
  mounted () {
    this.$Bus.$on('openAssigneeDialog', msg => {
      this.userId = localStorage.user_id
      if (this.order == null || this.order != msg) {
        this.assignee = []
        this.searchTextField = ''
        this.searchResultText = ''
        this.order = msg
        this.queryAssigneeInfo()
      }
      this.assigneeDialog = true
    })
  }
}
</script>
