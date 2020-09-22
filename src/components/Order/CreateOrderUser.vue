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
              <v-tooltip right>
                <template v-slot:activator="{ on, attr }">
                  <v-btn
                    v-on="on"
                    v-bind="attr"
                    color="info"
                    @click="autoEnter"
                    class="subtitle-2"
                  >{{ $t('order.createOrder.user.autoEnter') }}</v-btn>
                </template>
                <span>{{ $t('order.createOrder.user.autoEnterNote') }}</span>
              </v-tooltip>

              <v-spacer></v-spacer>

              <!-- 取消按钮 -->
              <v-tooltip left>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-on="on"
                    v-bind="attrs"
                    class="mr-2"
                    @click="sheet = false"
                  >{{ $t('order.createOrder.user.cancel') }}</v-btn>
                </template>
                <span>{{ $t('order.createOrder.user.cancelTip') }}</span>
              </v-tooltip>

              <!-- 提交按钮 -->
              <v-btn
                color="success"
                @click="submit"
                :loading="submitLoading"
                :disabled="submitLoading"
              >{{ $t('order.createOrder.user.submit') }}<v-icon right>mdi-check</v-icon>
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
                  ></v-text-field>
                </v-col>

                <!-- 性别表单 -->
                <v-col cols="3">
                  <v-select
                    v-model="gender"
                    :items="genderItems"
                    :error-messages="genderErrors"
                    :label="genderLabel"
                    @change="$v.gender.$touch()"
                    @blur="$v.gender.$touch()"
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
                  ></v-text-field>
                </v-col>

                <!-- 校区选择器 -->
                <v-col cols="6">
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
                <v-col cols="6">
                  <v-text-field
                    v-model="dormitory"
                    :error-messages="dormitoryErrors"
                    :label="dormitoryLabel"
                    @input="$v.dormitory.$touch()"
                    @blur="$v.dormitory.$touch()"
                  ></v-text-field>
                </v-col>

                <!-- 描述表单 -->
                <v-col cols="12">
                  <v-textarea
                    v-model="description"
                    :label="descriptionLabel"
                    :hint="descriptionHint"
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-form>
      </v-sheet>
    </v-bottom-sheet>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, maxLength, numeric } from 'vuelidate/lib/validators'

export default {
  name: 'CreateOrderUser',
  data: () => ({
    sheet: false,
    name: '',
    gender: null,
    campus: null,
    genderItems: ['男(Male)', '女(Female)'],
    campusItems: ['清水河校区(Qingshuihe Campus)', '沙河校区(Shahe Campus)'],
    dormitory: '',
    telephone: '',
    description: '',
    submitLoading: false
  }),
  mixins: [validationMixin],
  validations: {
    name: {
      required,
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
      required,
      numeric,
      maxLength: maxLength(11)
    }
  },
  computed: {
    nameErrors () {
      const errors = []
      if (!this.$v.name.$dirty) return errors
      !this.$v.name.maxLength && errors.push(this.$i18n.t('order.createOrder.user.nameMaxLengthErr'))
      !this.$v.name.required && errors.push(this.$i18n.t('order.createOrder.user.nameRequiredErr'))
      return errors
    },
    genderErrors () {
      const errors = []
      if (!this.$v.gender.$dirty) return errors
      !this.$v.gender.required && errors.push(this.$i18n.t('order.createOrder.user.genderRequiredErr'))
      return errors
    },
    campusErrors () {
      const errors = []
      if (!this.$v.campus.$dirty) return errors
      !this.$v.campus.required && errors.push(this.$i18n.t('order.createOrder.user.campusRequiredErr'))
      return errors
    },
    dormitoryErrors () {
      const errors = []
      if (!this.$v.dormitory.$dirty) return errors
      !this.$v.dormitory.required && errors.push(this.$i18n.t('order.createOrder.user.dormitoryRequiredErr'))
      return errors
    },
    telephoneErrors () {
      const errors = []
      if (!this.$v.telephone.$dirty) return errors
      !this.$v.telephone.numeric && errors.push(this.$i18n.t('order.createOrder.user.telephoneNumericErr'))
      !this.$v.telephone.maxLength && errors.push(this.$i18n.t('order.createOrder.user.telephoneMaxLengthErr'))
      !this.$v.telephone.required && errors.push(this.$i18n.t('order.createOrder.user.telephoneRequiredErr'))
      return errors
    },
    nameLabel () {
      return this.$i18n.t('order.createOrder.user.nameLabel')
    },
    genderLabel () {
      return this.$i18n.t('order.createOrder.user.genderLabel')
    },
    telephoneLabel () {
      return this.$i18n.t('order.createOrder.user.telephoneLabel')
    },
    campusLabel () {
      return this.$i18n.t('order.createOrder.user.campusLabel')
    },
    dormitoryLabel () {
      return this.$i18n.t('order.createOrder.user.dormitoryLabel')
    },
    descriptionLabel () {
      return this.$i18n.t('order.createOrder.user.descriptionLabel')
    },
    descriptionHint () {
      return this.$i18n.t('order.createOrder.user.descriptionHint')
    }
  },
  methods: {
    submit () {
      this.$v.$touch()
      if (this.nameErrors.length === 0 && this.genderErrors.length === 0 &&
        this.campusErrors.length === 0 && this.dormitoryErrors.length === 0 &&
        this.telephoneErrors.length === 0) {
        this.submitLoading = true

        this.axios.post('/api/order/createOrderUser', {
          user_name: this.name,
          user_gender: this.gender,
          user_telephone: this.telephone,
          user_campus: this.campus,
          user_dormitory: this.dormitory,
          user_description: this.description
        }).then((Response) => {
          if (Response.data === false) { // 订单提交失败，刷新页面
            this.Bus.$emit('setSnackbar', this.$i18n.t('order.createOrder.user.createFailed'))
            location.reload()
          } else { // 订单提交成功，通过切换路由更新页面
            this.Bus.$emit('setSnackbar', this.$i18n.t('order.createOrder.user.createSucceed'))
            this.sheet = false
            this.submitLoading = false
            this.$router.push({ path: '/_empty' })
            this.$router.back(-1)
          }
        })
      }
    },
    autoEnter () { // 从 localstorage 读取用户资料并填写
      this.name = localStorage.getItem('name')
      this.gender = localStorage.getItem('gender')
      this.telephone = localStorage.getItem('telephone')
      this.dormitory = localStorage.getItem('dormitory')
      this.campus = localStorage.getItem('campus')
    }
  },
  mounted () {
    this.Bus.$on('openCreateOrderUserSheet', (msg) => {
      this.axios.post('/api/order/getLatestOrderStatus').then((Response) => {
        const res = Response.data
        if (res) {
          this.sheet = true
        } else {
          // 存在进行中的订单时不可新建订单
          this.Bus.$emit('setSnackbar', this.$i18n.t('order.createOrder.user.orderStatusErr'))
        }
      })
    })
  }
}
</script>
