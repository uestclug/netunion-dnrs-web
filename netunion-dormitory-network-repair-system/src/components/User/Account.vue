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
          <p class="subtitle-1">{{ $t('user.account.title') }}<v-divider></v-divider></p>

          <v-row>
            <v-col cols="6">
              <p class="body-1 pt-2"><v-icon>mdi-account-outline</v-icon>
                {{ $t('user.account.name') }}
              </p>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="name"
                class="body-1 pt-0 pb-0"
                :disabled="disabled"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <p class="body-1 pt-2"><v-icon>mdi-gender-male-female</v-icon>
                {{ $t('user.account.gender') }}
              </p>
            </v-col>
            <v-col cols="6">
              <v-select
                v-model="gender"
                class="body-1 pt-0 pb-0"
                :items="genderItems"
                :disabled="disabled"
              ></v-select>
            </v-col>
            <v-col cols="6">
              <p class="body-1 pt-2"><v-icon>mdi-domain</v-icon>
                {{ $t('user.account.campus') }}
              </p>
            </v-col>
            <v-col cols="6">
              <v-select
                v-model="campus"
                class="body-1 pt-0 pb-0"
                :items="campusItems"
                :disabled="disabled"
              ></v-select>
            </v-col>
            <v-col cols="6">
              <p class="body-1 pt-2"><v-icon>mdi-map-marker-outline</v-icon>
                {{ $t('user.account.location') }}
              </p>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="dormitory"
                class="body-1 pt-0 pb-0"
                :disabled="disabled"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <p class="body-1 pt-2"><v-icon>mdi-cellphone</v-icon>
                {{ $t('user.account.telephone') }}
              </p>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="telephone"
                class="body-1 pt-0 pb-0"
                :disabled="disabled"
              ></v-text-field>
            </v-col>
          </v-row>

        </v-card-text>
        <v-card-actions>
          <v-btn
            :color="modifyBtnColor"
            outlined
            style="margin: 0px 0px 10px 10px"
            @click="modifyAccountInfo"
            class="subtitle-2"
          >
            <v-icon left>mdi-account-edit-outline</v-icon>{{ $t('user.account.modify') }}
          </v-btn>
          <v-btn
            color="blue-grey"
            text
            style="margin: 0px 0px 10px 10px"
            @click="modifyPassword"
            class="subtitle-2"
          >
            <v-icon left>mdi-key-outline</v-icon>{{ $t('user.account.modifyPassword') }}
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            text
            style="margin: 0px 0px 10px 0px"
            @click="toLogoutDialog"
            class="subtitle-2"
          >{{ $t('user.account.logout') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-hover>
    <!-- 修改密码 Dialog -->
    <v-dialog v-model="modifyPasswordDialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ $t('user.account.modifyPassword') }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form
              ref="passwordForm"
            >
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="presentPassword"
                    :label="presentPasswordLabel"
                    :error-messages="presentPasswordErrors"
                    @input="$v.presentPassword.$touch()"
                    @blur="$v.presentPassword.$touch()"
                    type='password'
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="modifiedPassword"
                    :label="modifiedPasswordLabel"
                    :error-messages="modifiedPasswordErrors"
                    @input="$v.modifiedPassword.$touch()"
                    @blur="$v.modifiedPassword.$touch()"
                    type='password'
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="reModifiedPassword"
                    :label="reModifiedPasswordLabel"
                    :error-messages="reModifiedPasswordErrors"
                    @input="$v.reModifiedPassword.$touch()"
                    @blur="$v.reModifiedPassword.$touch()"
                    type='password'
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="error"
            @click="modifyPasswordDialog = false"
            class="subtitle-2"
          >{{ $t('user.account.cancel') }}</v-btn>
          <v-btn
            color="success"
            @click="submitNewPassword"
            class="subtitle-2"
          >{{ $t('user.account.submit') }}<v-icon right>mdi-check</v-icon></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 登出 Dialog -->
    <v-dialog v-model="logoutDialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ $t('user.account.logout') }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                {{ $t('user.account.logoutText') }}
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="info"
            @click="logoutDialog = false"
            class="subtitle-2"
          >{{ $t('user.account.cancel') }}</v-btn>
          <v-btn
            color="success"
            @click="logout"
            class="subtitle-2"
          >{{ $t('user.account.confirm') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, maxLength, minLength } from 'vuelidate/lib/validators'
import Bus from '@/Bus'
import md5 from 'js-md5'
const Base64 = require('js-base64').Base64

export default {
  name: 'Account',
  data: () => ({
    name: '',
    gender: null,
    campus: null,
    telephone: '',
    dormitory: '',
    disabled: true,
    modifyPasswordDialog: false,
    logoutDialog: false,
    modifyBtnColor: 'brown darken-1',
    genderItems: ['男(Male)', '女(Female)'],
    campusItems: ['清水河校区(Qingshuihe Campus)', '沙河校区(Shahe Campus)'],
    presentPassword: '',
    modifiedPassword: '',
    reModifiedPassword: ''
  }),
  mixins: [validationMixin],
  validations: {
    presentPassword: {
      required,
      maxLength: maxLength(32),
      minLength: minLength(6)
    },
    modifiedPassword: {
      required,
      maxLength: maxLength(32),
      minLength: minLength(6)
    },
    reModifiedPassword: {
      required,
      maxLength: maxLength(32),
      minLength: minLength(6)
    }
  },
  created: async function () {
    if (!localStorage.getItem('name') || !localStorage.getItem('gender') ||
    !localStorage.getItem('telephone') || !localStorage.getItem('campus') ||
    !localStorage.getItem('dormitory') || !localStorage.getItem('std_id')) { // 当 localStorage 没有存储账户资料内容时
      const response = await this.axios.post('/api/user/queryUserInfo', { // 获取用户资料
        id: localStorage.getItem('id')
      })
      // 设置 localStorage
      localStorage.setItem('name', response.data.name)
      localStorage.setItem('gender', response.data.gender)
      localStorage.setItem('telephone', response.data.telephone)
      localStorage.setItem('campus', response.data.campus)
      localStorage.setItem('dormitory', response.data.dormitory)
      localStorage.setItem('std_id', response.data.std_id)
    }
    // 设置页面 dom
    this.name = localStorage.getItem('name')
    this.gender = localStorage.getItem('gender')
    this.campus = localStorage.getItem('campus')
    this.telephone = localStorage.getItem('telephone')
    this.dormitory = localStorage.getItem('dormitory')
  },
  computed: {
    presentPasswordErrors () {
      const errors = []
      if (!this.$v.presentPassword.$dirty) return errors
      !this.$v.presentPassword.maxLength && errors.push(this.$i18n.t('user.account.passwordMaxLengthErr'))
      !this.$v.presentPassword.minLength && errors.push(this.$i18n.t('user.account.passwordminLengthErr'))
      !this.$v.presentPassword.required && errors.push(this.$i18n.t('user.account.presentPasswordRequiredErr'))
      return errors
    },
    modifiedPasswordErrors () {
      const errors = []
      if (!this.$v.modifiedPassword.$dirty) return errors
      !this.$v.modifiedPassword.maxLength && errors.push(this.$i18n.t('user.account.passwordMaxLengthErr'))
      !this.$v.modifiedPassword.minLength && errors.push(this.$i18n.t('user.account.passwordminLengthErr'))
      !this.$v.modifiedPassword.required && errors.push(this.$i18n.t('user.account.modifiedPasswordRequiredErr'))
      return errors
    },
    reModifiedPasswordErrors () {
      const errors = []
      if (!this.$v.reModifiedPassword.$dirty) return errors
      !this.$v.reModifiedPassword.maxLength && errors.push(this.$i18n.t('user.account.passwordMaxLengthErr'))
      !this.$v.reModifiedPassword.minLength && errors.push(this.$i18n.t('user.account.passwordminLengthErr'))
      !this.$v.reModifiedPassword.required && errors.push(this.$i18n.t('user.account.reModifiedPasswordRequiredErr'))
      return errors
    },
    presentPasswordLabel () {
      return this.$i18n.t('user.account.presentPassword')
    },
    modifiedPasswordLabel () {
      return this.$i18n.t('user.account.modifiedPassword')
    },
    reModifiedPasswordLabel () {
      return this.$i18n.t('user.account.reModifiedPassword')
    }
  },
  methods: {
    modifyAccountInfo: async function () {
      if (this.disabled === true) { // 第一次点击，进入修改模式
        const loginResponse = await this.axios.post('/api/user/checkToken', {
          id: localStorage.getItem('id')
        })
        if (loginResponse.data === true) { // 当用户 token 有效时进入修改模式
          this.modifyBtnColor = 'success' // 设置按钮颜色
          Bus.$emit('setSnackbar', this.$i18n.t('user.account.modifyAccountInfoNote'))
          this.disabled = false
        } else { // 无效时清除 token 并刷新回到登录页面
          Bus.$emit('setSnackbar', this.$i18n.t('login.tokenCheckFailed'))
          localStorage.removeItem('token')
          location.reload()
        }
      } else { // 第二次点击，保存修改内容到数据库中
        const modifyResponse = await this.axios.post('/api/user/modifyAccountInfo', {
          name: this.name,
          gender: this.gender,
          campus: this.campus,
          dormitory: this.dormitory,
          telephone: this.telephone,
          id: localStorage.getItem('id')
        })
        if (modifyResponse.data === true) { // 修改成功，更新 localStorage
          localStorage.setItem('name', this.name)
          localStorage.setItem('gender', this.gender)
          localStorage.setItem('campus', this.campus)
          localStorage.setItem('telephone', this.telephone)
          localStorage.setItem('dormitory', this.dormitory)
          this.modifyBtnColor = 'brown darken-1'
          Bus.$emit('setSnackbar', this.$i18n.t('user.account.modifyAccountInfoSucceed'))
          this.disabled = true
        } else { // 修改失败，显示提示信息
          Bus.$emit('setSnackbar', this.$i18n.t('user.account.modifyAccountInfoFailed'))
        }
      }
    },
    modifyPassword: async function () {
      const loginResponse = await this.axios.post('/api/user/checkToken', {
        id: localStorage.getItem('id')
      })
      if (loginResponse.data === true) { // 当用户 token 有效时打开密码修改 dialog
        this.modifyPasswordDialog = true
      } else {
        Bus.$emit('setSnackbar', this.$i18n.t('login.tokenCheckFailed'))
        localStorage.removeItem('token')
        location.reload()
      }
    },
    submitNewPassword: async function () {
      this.$v.$touch()
      if (this.presentPasswordErrors.length === 0 && this.modifiedPasswordErrors.length === 0 && this.reModifiedPasswordErrors.length === 0) {
        if (this.modifiedPassword !== this.reModifiedPassword) { // 当两次输入的新密码不一样时
          this.modifiedPassword = ''
          this.reModifiedPassword = ''
          Bus.$emit('setSnackbar', this.$i18n.t('user.account.reModifiedPasswordErr'))
          return
        }

        this.axios.post('/api/user/modifyPassword', { // 调用修改密码接口
          id: localStorage.getItem('id'),
          presentPassword: md5(Base64.encode(this.presentPassword)),
          modifiedPassword: md5(Base64.encode(this.modifiedPassword))
        }).then((Response) => {
          if (Response.data === true) {
            Bus.$emit('setSnackbar', this.$i18n.t('user.account.modifyPasswordSucceed'))
            this.$refs.passwordForm.reset() // 重置表单
            this.modifyPasswordDialog = false
          } else if (Response.data === 'present password error') {
            Bus.$emit('setSnackbar', this.$i18n.t('user.account.presentPasswordErr'))
            this.presentPassword = ''
          } else {
            Bus.$emit('setSnackbar', this.$i18n.t('user.account.unknownErr'))
          }
        })
      }
    },
    toLogoutDialog () { // 打开确认 logout 的 dialog
      this.logoutDialog = true
    },
    logout () { // 移除 localStorage 的 token 并刷新回到登录页面
      localStorage.clear()
      location.reload()
    }
  }
}
</script>
