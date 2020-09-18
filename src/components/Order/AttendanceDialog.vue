<template>
  <v-dialog
    v-model="dialog"
    max-width="600"
    :persistent="description !== ''"
  >
    <v-card>
      <v-card-title>
        {{ $t('order.attendanceDialog.title') }}
      </v-card-title>
      <v-card-text>
        <div>{{ $t('order.attendanceDialog.nowAttnTitle') }}</div>
        <div v-if="queryAttnloading" class="text--primary">
          {{ $t('order.attendanceDialog.nowAttnLoading') }}
        </div>
        <div v-else-if="attendance.length == 0" class="body-1 text--primary">
          {{ $t('order.attendanceDialog.nowAttnNotFound') }}
        </div>
        <div v-else>
          <template v-for="attn in attendance" >
            <div v-bind:key="attn.attn_date" class="mt-1">
              <v-tooltip left>
                <template v-slot:activator="{ on, attrs }">
                  <v-chip
                    label
                    class="mr-2"
                    v-bind="attrs"
                    v-on="on"
                    :color="attn.solver_id == userId ? 'primary' : ''"
                  >{{ attn.attn_date }}</v-chip>
                  <span class="text--primary">{{ attn.attn_description }}</span>
                </template>
                <!--
                  处理者取消或关闭订单时，不会清除已有的出勤记录
                  考虑到处理者可能取消或关闭订单，再由他人接取订单，故添加此项方便管理查看
                -->
                <span>{{ attn.solver_name }}</span>
              </v-tooltip>
            </div>
          </template>
        </div>
      </v-card-text>
      <v-card-text v-if="order != null && order.is_solver &&
        order.order_status === GLOBAL.status.receipted"
      >
        <div>{{ $t('order.attendanceDialog.addAttnTitle') }}</div>
        <v-text-field
          v-model="description"
          :label="label"
          :hint="addAttnResultText"
          persistent-hint
          single-line
          outlined
          dense
          append-outer-icon="mdi-briefcase-edit"
          class="mt-1"
          @click:append-outer="addAttendance"
          :loading="addAttnLoading"
          :disabled="addAttnLoading"
        ></v-text-field>
      </v-card-text>
      <v-card-actions class="mr-4">
        <v-spacer />
        <v-btn
          color="success"
          @click="dialog = false"
          :disabled="addAttnLoading"
        >{{ $t('order.attendanceDialog.close') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'AttendanceDialog',
  data: () => ({
    userId: null,
    dialog: false,
    description: '',
    addAttnResultText: '',
    order: null,
    attendance: [],
    queryAttnloading: true,
    addAttnLoading: false
  }),
  methods: {
    queryAttnInfo () { // 获取此订单的出勤记录信息
      this.queryAttnloading = true
      this.axios.post('api/order/queryAttendance', {
        order_id: this.order.order_id
      }).then((Response) => {
        if (Response.data) {
          this.attendance = Response.data
          this.queryAttnloading = false
        }
      })
    },
    addAttendance () { // 添加出勤记录
      if (this.description == '') {
        this.addAttnResultText = this.$i18n.t('order.attendanceDialog.addAttnNeedDescription')
        return false
      }

      this.addAttnLoading = true
      this.addAttnResultText = this.$i18n.t('order.attendanceDialog.addAttnLoading')

      const attnDescription = this.description
      this.axios.post('api/order/addAttendance', {
        order_id: this.order.order_id,
        attn_description: attnDescription,
        solver_name: localStorage.name,
        is_solver: this.order.is_solver
      }).then((Response) => {
        if (Response.data) {
          this.description = ''
          this.addAttnResultText = this.$i18n.t('order.attendanceDialog.addAttnSuccessfully')
          this.attendance.unshift(Response.data)
        } else {
          this.addAttnResultText = this.$i18n.t('order.attendanceDialog.addAttnFailed')
        }
        this.addAttnLoading = false
      })
    }
  },
  computed: {
    label () {
      return this.$i18n.t('order.attendanceDialog.descriptionLabel')
    }
  },
  mounted () {
    this.Bus.$on('openAttnDialog', (msg) => {
      this.userId = localStorage.user_id
      if (this.order != msg) {
        this.attendance = []
        this.description = ''
        this.addAttnResultText = ''
        this.order = msg
        this.queryAttnInfo()
      }
      this.dialog = true
    })
  }
}
</script>
