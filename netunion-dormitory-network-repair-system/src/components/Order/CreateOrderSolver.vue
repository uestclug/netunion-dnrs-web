<template>
  <div class="text-center">
    <v-bottom-sheet
      v-model="sheet"
      inset
    >
      <v-sheet height="1200px">
        <v-form ref="bottomForm">
          <v-card flat>
            <v-card-title>
              <v-btn
                color="info"
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
                    color="error"
                    class="mr-2 subtitle-2"
                    @click="sheet = false"
                  >{{ $t('order.createOrder.solver.cancel') }}</v-btn>
                </template>
                <span>{{ $t('order.createOrder.solver.cancelTip') }}</span>
              </v-tooltip>

              <!-- 提交按钮 -->
              <v-btn
                color="success"
                @click="submit"
                class="subtitle-2"
                :loading="submitLoading"
                :disabled="submitLoading"
              >{{ $t('order.createOrder.solver.submit') }}<v-icon right>mdi-check</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text>
              <v-row
                class="mt-6"
                justify="center"
              >
                <!-- 姓名表单 -->
                <v-col
                  cols="3"
                >
                  <v-text-field
                    v-model="name"
                    :error-messages="nameErrors"
                    counter="20"
                    :label="nameLabel"
                    @input="$v.name.$touch()"
                    @blur="$v.name.$touch()"
                  ></v-text-field>
                </v-col>

                <!-- 性别表单 -->
                <v-col
                  cols="3"
                >
                  <v-select
                    v-model="gender"
                    :items="genderItems"
                    :label="genderLabel"
                  ></v-select>
                </v-col>

                <!-- 联系电话表单 -->
                <v-col
                  cols="6"
                >
                  <v-text-field
                    v-model="telephone"
                    :error-messages="telephoneErrors"
                    counter="11"
                    :label="telephoneLabel"
                    @input="$v.telephone.$touch()"
                    @blur="$v.telephone.$touch()"
                  ></v-text-field>
                </v-col>

                <!-- 校区选择器 -->
                <v-col
                  cols="3"
                >
                  <v-select
                    v-model="campus"
                    :items="campusItems"
                    :error-messages="campusErrors"
                    :label="campusLabel"
                    @change="$v.campus.$touch()"
                    @blur="$v.campus.$touch()"
                  ></v-select>
                </v-col>

                <!-- 寝室表单 -->
                <v-col
                  cols="6"
                >
                  <v-text-field
                    v-model="dormitory"
                    :error-messages="dormitoryErrors"
                    :label="dormitoryLabel"
                    @input="$v.dormitory.$touch()"
                    @blur="$v.dormitory.$touch()"
                  ></v-text-field>
                </v-col>

                <!-- 订单状态选择器 -->
                <v-col
                  cols="3"
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
                <v-col
                  cols="12"
                >
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

    <v-dialog v-model="resetConfirmDialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ $t('order.createOrder.solver.reset') }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                {{ $t('order.createOrder.solver.resetTip') }}
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn
            color="info"
            @click="resetConfirmDialog = false"
            class="subtitle-2"
          >{{ $t('order.createOrder.solver.cancel') }}</v-btn>
          <v-btn
            color="success"
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
    gender: null,
    campus: null,
    genderItems: ['男(Male)', '女(Female)'],
    campusItems: ['清水河校区(Qingshuihe Campus)', '沙河校区(Shahe Campus)'],
    dormitory: '',
    telephone: '',
    status: null,
    description: '',
    record: '',
    submitLoading: false
  }),
  mixins: [validationMixin],
  validations: {
    name: {
      maxLength: maxLength(20)
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
  computed: {
    nameErrors () {
      const errors = []
      if (!this.$v.name.$dirty) return errors
      !this.$v.name.maxLength && errors.push(this.$i18n.t('order.createOrder.solver.nameMaxLengthErr'))
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
        return this.$i18n.t('order.createOrder.solver.statusTooltipUnexpected')
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
      this.$v.$touch()
      if (this.nameErrors.length === 0 && this.campusErrors.length === 0 &&
      this.dormitoryErrors.length === 0 && this.telephoneErrors.length === 0 &&
      this.statusErrors.length === 0) {
        this.submitLoading = true // 设置加载状态

        let description = this.description
        let record = this.record
        let status = this.status

        if (this.status === this.$i18n.t('order.waitingStatus')) {
          status = this.GLOBAL.status.waiting
          // 如果为创建订单，则清空 record
          record = ''
        } else if (this.status === this.$i18n.t('order.receiptedStatus')) {
          status = this.GLOBAL.status.receipted
          // 如果为接取订单，则清空 record
          record = ''
        } else if (this.status === this.$i18n.t('order.recordedStatus')) {
          status = this.GLOBAL.status.recorded
          // 如果为记录订单，则清空 description
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
    },
    toResetDialog () {
      this.resetConfirmDialog = true
    },
    reset () {
      this.name = ''
      this.gender = null
      this.telephone = ''
      this.campus = null
      this.dormitory = ''
      this.status = null
      this.description = ''
      this.record = ''
      this.resetConfirmDialog = false
    }
  },
  mounted () {
    this.Bus.$on('openCreateOrderSolverSheet', (msg) => {
      this.sheet = true
    })
  }
}
</script>
