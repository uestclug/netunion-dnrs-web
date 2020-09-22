<template>
  <div class="text-center">
    <v-bottom-sheet
      v-model="sheet"
      inset
      :persistent="submitLoading"
    >
      <v-sheet height="1200px">
        <v-form ref="bottomForm">
          <v-card flat>
            <v-card-title>
              <v-btn
                @click="toResetDialog"
                class="subtitle-2"
              >{{ $t('order.createOrder.solver.reset') }}</v-btn>

              <v-spacer></v-spacer>

              <!-- 取消按钮 -->
              <v-tooltip left>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-on="on"
                    v-bind="attrs"
                    class="mr-2"
                    @click="sheet = false"
                  >{{ $t('order.createOrder.solver.cancel') }}</v-btn>
                </template>
                <span v-show="!isModify">{{ $t('order.createOrder.solver.cancelTip') }}</span>
                <span v-show="isModify">{{ $t('order.modifyOrder.solver.cancelTip') }}</span>
              </v-tooltip>

              <!-- 提交按钮 -->
              <v-btn
                color="success"
                @click="submit"
                :loading="submitLoading"
                :disabled="submitLoading"
              >
                <span v-if="!isModify">{{ $t('order.createOrder.solver.submit') }}</span>
                <span v-if="isModify">{{ $t('order.modifyOrder.solver.submit') }}</span>
                <v-icon right>mdi-check</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text>
              <v-row
                class="mt-6"
                justify="center"
              >
                <!-- 姓名表单 -->
                <v-col cols="3">
                  <v-text-field
                    v-model="name"
                    :error-messages="nameErrors"
                    counter="20"
                    :label="nameLabel"
                    @input="$v.name.$touch()"
                    @blur="$v.name.$touch()"
                    :disabled="modifiedOrder.order_status == GLOBAL.status.finished ||
                              modifiedOrder.order_status == GLOBAL.status.recorded"
                  ></v-text-field>
                </v-col>

                <!-- 性别选择器 -->
                <v-col cols="3">
                  <v-select
                    v-model="gender"
                    :items="genderItems"
                    :label="genderLabel"
                    :error-messages="genderErrors"
                    @input="$v.gender.$touch()"
                    @blur="$v.gender.$touch()"
                    :disabled="modifiedOrder.order_status == GLOBAL.status.finished ||
                              modifiedOrder.order_status == GLOBAL.status.recorded"
                  ></v-select>
                </v-col>

                <!-- 联系电话表单 -->
                <v-col cols="6">
                  <v-text-field
                    v-model="telephone"
                    :error-messages="telephoneErrors"
                    counter="11"
                    :label="telephoneLabel"
                    @input="$v.telephone.$touch()"
                    @blur="$v.telephone.$touch()"
                    :disabled="modifiedOrder.order_status == GLOBAL.status.finished ||
                              modifiedOrder.order_status == GLOBAL.status.recorded"
                  ></v-text-field>
                </v-col>

                <!-- 校区选择器 -->
                <v-col cols="3">
                  <v-select
                    v-model="campus"
                    :items="campusItems"
                    :error-messages="campusErrors"
                    :label="campusLabel"
                    @change="$v.campus.$touch()"
                    @blur="$v.campus.$touch()"
                    :disabled="modifiedOrder.order_status == GLOBAL.status.finished ||
                              modifiedOrder.order_status == GLOBAL.status.recorded"
                  ></v-select>
                </v-col>

                <!-- 寝室表单 -->
                <v-col cols="isModify ? 9 : 6">
                  <v-text-field
                    v-model="dormitory"
                    :error-messages="dormitoryErrors"
                    :label="dormitoryLabel"
                    @input="$v.dormitory.$touch()"
                    @blur="$v.dormitory.$touch()"
                    :disabled="modifiedOrder.order_status == GLOBAL.status.finished ||
                              modifiedOrder.order_status == GLOBAL.status.recorded"
                  ></v-text-field>
                </v-col>

                <!-- 订单状态选择器 -->
                <v-col
                  cols="3"
                  v-if="!isModify"
                >
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-select
                        v-model="status"
                        :items="statusItems"
                        :error-messages="statusErrors"
                        :label="statusLabel"
                        @change="$v.status.$touch()"
                        @blur="$v.status.$touch()"
                        v-on="on"
                        v-bind="attrs"
                      ></v-select>
                    </template>
                    <span>{{ statusTooltip }}</span>
                  </v-tooltip>
                </v-col>

                <!-- 描述 / 记录表单 -->
                <v-col cols="12">
                  <v-textarea
                    v-if="status === this.$i18n.t('order.waitingStatus') || status === this.$i18n.t('order.receiptedStatus')"
                    v-model="description"
                    :label="descriptionLabel"
                    :hint="descriptionHint"
                  ></v-textarea>
                  <v-textarea
                    v-else-if="status === this.$i18n.t('order.recordedStatus')"
                    v-model="record"
                    :label="recordLabel"
                    :hint="recordHint"
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-form>
      </v-sheet>
    </v-bottom-sheet>

    <v-dialog
      v-model="resetConfirmDialog"
      max-width="600px"
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{ $t('order.createOrder.solver.reset') }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col
                cols="12"
                v-show="!isModify"
              >
                {{ $t('order.createOrder.solver.resetTip') }}
              </v-col>
              <v-col
                cols="12"
                v-show="isModify"
              >
                {{ $t('order.modifyOrder.solver.resetTip') }}
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            @click="resetConfirmDialog = false"
            class="subtitle-2"
          >{{ $t('order.createOrder.solver.cancel') }}</v-btn>
          <v-btn
            color="info"
            @click="reset"
            class="subtitle-2"
          >{{ $t('order.createOrder.solver.resetConfirm') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, maxLength, numeric } from 'vuelidate/lib/validators'

export default {
  name: 'CreateOrderSolver',
  data: () => ({
    sheet: false,
    resetConfirmDialog: false,
    name: '',
    gender: '',
    campus: '',
    genderItems: ['男(Male)', '女(Female)'],
    campusItems: ['清水河校区(Qingshuihe Campus)', '沙河校区(Shahe Campus)'],
    dormitory: '',
    telephone: '',
    status: '',
    description: '',
    record: '',
    submitLoading: false,
    isModify: false,
    modifiedOrder: []
  }),
  mixins: [validationMixin],
  validations: {
    name: {
      maxLength: maxLength(20)
    },
    gender: {
      required
    },
    campus: {
      required
    },
    dormitory: {
      required
    },
    telephone: {
      numeric,
      maxLength: maxLength(11)
    },
    status: {
      required
    }
  },
  created () {
    this.campus = localStorage.campus
    this.status = this.status = this.$i18n.t('order.waitingStatus')
  },
  computed: {
    nameErrors () {
      const errors = []
      if (!this.$v.name.$dirty) return errors
      !this.$v.name.maxLength && errors.push(this.$i18n.t('order.createOrder.solver.nameMaxLengthErr'))
      return errors
    },
    genderErrors () {
      const errors = []
      if (!this.$v.gender.$dirty) return errors
      !this.$v.gender.required && errors.push(this.$i18n.t('order.createOrder.solver.genderRequiredErr'))
      return errors
    },
    campusErrors () {
      const errors = []
      if (!this.$v.campus.$dirty) return errors
      !this.$v.campus.required && errors.push(this.$i18n.t('order.createOrder.solver.campusRequiredErr'))
      return errors
    },
    dormitoryErrors () {
      const errors = []
      if (!this.$v.dormitory.$dirty) return errors
      !this.$v.dormitory.required && errors.push(this.$i18n.t('order.createOrder.solver.dormitoryRequiredErr'))
      return errors
    },
    telephoneErrors () {
      const errors = []
      if (!this.$v.telephone.$dirty) return errors
      !this.$v.telephone.numeric && errors.push(this.$i18n.t('order.createOrder.solver.telephoneNumericErr'))
      !this.$v.telephone.maxLength && errors.push(this.$i18n.t('order.createOrder.solver.telephoneMaxLengthErr'))
      return errors
    },
    statusErrors () {
      const errors = []
      if (!this.$v.status.$dirty) return errors
      !this.$v.status.required && errors.push(this.$i18n.t('order.createOrder.solver.statusRequiredErr'))
      return errors
    },
    nameLabel () {
      return this.$i18n.t('order.createOrder.solver.nameLabel')
    },
    genderLabel () {
      return this.$i18n.t('order.createOrder.solver.genderLabel')
    },
    telephoneLabel () {
      return this.$i18n.t('order.createOrder.solver.telephoneLabel')
    },
    campusLabel () {
      return this.$i18n.t('order.createOrder.solver.campusLabel')
    },
    dormitoryLabel () {
      return this.$i18n.t('order.createOrder.solver.dormitoryLabel')
    },
    statusItems () {
      return [this.$i18n.t('order.waitingStatus'), this.$i18n.t('order.receiptedStatus'), this.$i18n.t('order.recordedStatus')]
    },
    statusLabel () {
      return this.$i18n.t('order.createOrder.solver.statusLabel')
    },
    statusTooltip () {
      if (this.status === null) {
        return this.$i18n.t('order.createOrder.solver.statusTooltipDefault')
      } else if (this.status === this.$i18n.t('order.waitingStatus')) {
        return this.$i18n.t('order.createOrder.solver.statusTooltipWaiting')
      } else if (this.status === this.$i18n.t('order.receiptedStatus')) {
        return this.$i18n.t('order.createOrder.solver.statusTooltipReceipted')
      } else if (this.status === this.$i18n.t('order.recordedStatus')) {
        return this.$i18n.t('order.createOrder.solver.statusTooltipRecorded')
      } else {
        return this.$i18n.t('order.createOrder.solver.statusTooltipDefault')
      }
    },
    descriptionLabel () {
      return this.$i18n.t('order.createOrder.solver.descriptionLabel')
    },
    descriptionHint () {
      return this.$i18n.t('order.createOrder.solver.descriptionHint')
    },
    recordLabel () {
      return this.$i18n.t('order.createOrder.solver.recordLabel')
    },
    recordHint () {
      return this.$i18n.t('order.createOrder.solver.recordHint')
    }
  },
  methods: {
    submit () {
      if (!this.isModify) { // 创建订单模式下
        this.$v.$touch()
        if (this.nameErrors.length === 0 && this.genderErrors.length === 0 &&
          this.campusErrors.length === 0 && this.dormitoryErrors.length === 0 &&
          this.telephoneErrors.length === 0 && this.statusErrors.length === 0) {
          this.submitLoading = true // 设置加载状态

          let description = this.description
          let record = this.record
          let status = this.status

          if (this.status === this.$i18n.t('order.waitingStatus')) {
            status = this.GLOBAL.status.waiting
            // 如果设置为创建订单，则清空 record
            record = ''
          } else if (this.status === this.$i18n.t('order.receiptedStatus')) {
            status = this.GLOBAL.status.receipted
            // 如果设置为接取订单，则清空 record
            record = ''
          } else if (this.status === this.$i18n.t('order.recordedStatus')) {
            status = this.GLOBAL.status.recorded
            // 如果设置为记录订单，则清空 description
            description = ''
          } else { // 订单状态预料之外，刷新页面
            this.Bus.$emit('setSnackbar', this.$i18n.t('order.createOrder.solver.createFailed'))
            location.reload()
          }

          this.axios.post('/api/order/createOrderSolver', {
            user_name: this.name,
            user_gender: this.gender,
            user_telephone: this.telephone,
            user_campus: this.campus,
            user_dormitory: this.dormitory,
            order_status: status,
            user_description: description,
            solver_record: record
          }).then((Response) => {
            if (Response.data === false) { // 订单提交失败，刷新页面
              this.Bus.$emit('setSnackbar', this.$i18n.t('order.createOrder.solver.createFailed'))
              location.reload()
            } else { // 订单提交成功，通过切换路由更新页面
              this.Bus.$emit('setSnackbar', this.$i18n.t('order.createOrder.solver.createSucceed'))
              this.sheet = false
              this.submitLoading = false
              this.$router.push({ path: '/_empty' })
              this.$router.back(-1)
              this.reset()
            }
          })
        }
      } else if (this.isModify) { // 修改订单模式下
        this.$v.$touch()
        if (this.nameErrors.length === 0 && this.genderErrors.length === 0 &&
          this.campusErrors.length === 0 && this.dormitoryErrors.length === 0 &&
          this.telephoneErrors.length === 0) {
          this.submitLoading = true // 设置加载状态

          this.axios.post('/api/order/modifyOrderSolver', {
            order_id: this.modifiedOrder.order_id,
            user_name: this.name,
            user_gender: this.gender,
            user_telephone: this.telephone,
            user_campus: this.campus,
            user_dormitory: this.dormitory,
            user_description: this.description,
            solver_record: this.record
          }).then((Response) => {
            if (Response.data === false) { // 订单信息修改失败，刷新页面
              this.Bus.$emit('setSnackbar', this.$i18n.t('order.modifyOrder.solver.modifyFailed'))
              location.reload()
            } else { // 订单信息修改成功
              this.Bus.$emit('setSnackbar', this.$i18n.t('order.modifyOrder.solver.modifySucceed'))
              const orderUserName = this.name
              if (orderUserName == '') {
                this.modifiedOrder.order_user_name = '[匿名用户]'
              } else {
                this.modifiedOrder.order_user_name = orderUserName
              }

              const orderUserGender = this.gender
              if (orderUserGender == this.GLOBAL.gender.male) {
                this.modifiedOrder.order_user_gender = '男'
              } else if (orderUserGender == this.GLOBAL.gender.female) {
                this.modifiedOrder.order_user_gender = '女'
              }

              this.modifiedOrder.order_user_telephone = this.telephone

              const orderUserCampus = this.campus
              if (orderUserCampus == this.GLOBAL.campus.qingshuihe) {
                this.modifiedOrder.order_user_campus = '清水河校区'
              } else if (orderUserCampus == this.GLOBAL.campus.shahe) {
                this.modifiedOrder.order_user_campus = '沙河校区'
              }

              this.modifiedOrder.order_user_dormitory = this.dormitory
              this.modifiedOrder.order_user_description = this.description
              this.modifiedOrder.order_solver_record = this.record
              this.sheet = false
              this.submitLoading = false
            }
          })
        }
      }
    },
    toResetDialog () {
      this.resetConfirmDialog = true
    },
    reset () {
      if (this.isModify) {
        // 修改订单模式下，将表单项还原为订单修改前的值
        this.setOrderData(JSON.parse(localStorage.beforeModifiedOrder))
      } else {
        // 创建订单模式下，将表单项还原为默认值
        this.name = ''
        this.gender = ''
        this.telephone = ''
        this.campus = localStorage.campus
        this.dormitory = ''
        this.status = this.$i18n.t('order.waitingStatus')
        this.description = ''
        this.record = ''
      }

      this.resetConfirmDialog = false
    },
    stringifyOrderData () { // 将前端表单的数据转化为 json 存储
      return JSON.stringify({
        order_user_name: this.name,
        order_user_gender: this.gender,
        order_user_telephone: this.telephone,
        order_user_campus: this.campus,
        order_user_dormitory: this.dormitory,
        order_status: this.status,
        order_user_description: this.description,
        order_solver_record: this.record
      })
    },
    setOrderData (order) {
      // 设置用户姓名
      const orderUserName = order.order_user_name
      if (orderUserName == '[匿名用户]' || orderUserName == '') {
        this.name = ''
      } else {
        this.name = orderUserName
      }
      // 设置用户性别
      const orderUserGender = order.order_user_gender
      if (orderUserGender == '男' || orderUserGender == this.GLOBAL.gender.male) {
        this.gender = this.genderItems[0]
      } else if (orderUserGender == '女' || orderUserGender == this.GLOBAL.gender.female) {
        this.gender = this.genderItems[1]
      } else {
        this.gender = ''
      }
      // 设置用户联系电话
      this.telephone = order.order_user_telephone
      // 设置用户所在校区
      const orderUserCampus = order.order_user_campus
      if (orderUserCampus == '清水河校区' || orderUserCampus == this.GLOBAL.campus.qingshuihe) {
        this.campus = this.campusItems[0]
      } else if (orderUserCampus == '沙河校区' || orderUserCampus == this.GLOBAL.campus.shahe) {
        this.campus = this.campusItems[1]
      } else {
        this.campus = ''
      }
      // 设置用户寝室地址
      this.dormitory = order.order_user_dormitory
      // 设置订单状态
      const orderStatus = order.order_status
      if (orderStatus == this.GLOBAL.status.waiting ||
        orderStatus == this.$i18n.t('order.waitingStatus')) {
        this.status = this.$i18n.t('order.waitingStatus')
      } else if (orderStatus == this.GLOBAL.status.receipted ||
        orderStatus == this.$i18n.t('order.receiptedStatus')) {
        this.status = this.$i18n.t('order.receiptedStatus')
      } else if (orderStatus == this.GLOBAL.status.recorded ||
        orderStatus == this.GLOBAL.status.finished ||
        orderStatus == this.$i18n.t('order.recordedStatus')) {
        this.status = this.$i18n.t('order.recordedStatus')
      } else {
        this.Bus.$emit('setSnackbar', this.$i18n.t('order.modifyOrder.solver.getOrderStatusFailed'))
        location.reload()
      }
      // 设置用户描述
      this.description = order.order_user_description
      // 设置订单处理记录
      this.record = order.order_solver_record
    }
  },
  mounted () {
    this.Bus.$on('openCreateOrderSolverSheet', (msg) => { // 创建订单模式
      if (this.isModify) { // 从修改订单模式进入创建订单模式，从 localStorage 读取存储的表单数据
        this.setOrderData(JSON.parse(localStorage.beforeCreatedOrder))
      }
      this.modifiedOrder = []
      this.isModify = false
      this.sheet = true
    })
    this.Bus.$on('openModifyOrderSolverSheet', (msg) => { // 修改订单模式
      if (!this.isModify) { // 从创建订单模式进入修改订单模式，保存原本表单数据到 localStorage
        localStorage.beforeCreatedOrder = this.stringifyOrderData()
      }
      this.modifiedOrder = msg // 将欲修改的订单信息保存到 modifiedOrder 中
      this.setOrderData(msg) // 将欲修改的订单信息渲染到前端
      localStorage.beforeModifiedOrder = this.stringifyOrderData() // 保存现在的前端表单数据到 localStorage
      this.isModify = true // 设置界面为修改订单模式
      this.sheet = true
    })
  }
}
</script>
