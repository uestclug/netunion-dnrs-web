<template>
  <div>
    <v-hover
      v-slot:default="{ hover }"
    >
      <v-card
        :elevation="hover ? 4 : 2"
        class="mx-auto transition-swing"
        max-width="800"
      >
        <v-toolbar
          flat
          class="body-1 pt-2"
        >
          <v-toolbar-title>{{ $t('user.account.title') }}</v-toolbar-title>
          <v-divider class="mx-4" />
        </v-toolbar>
        <v-card-text>
          <v-row>
            <v-col cols="6">
              <p class="body-1 pt-2">
                <v-icon left>mdi-account-outline</v-icon>{{ $t('user.account.name') }}
              </p>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="name"
                class="body-1 pt-0 pb-0"
                :disabled="disabled"
                :counter="nameCounter"
                :error-messages="nameErrors"
                @input="$v.name.$touch()"
                @blur="$v.name.$touch()"
              ></v-text-field>
            </v-col>
            <v-col
              cols="6"
              v-if="role === $GLOBAL.role.solver"
            >
              <p class="body-1 pt-2">
                <v-icon left>mdi-account-tie-outline</v-icon>{{ $t('user.account.nickname') }}
              </p>
            </v-col>
            <v-col
              cols="6"
              v-if="role === $GLOBAL.role.solver"
            >
              <v-text-field
                v-model="nickname"
                class="body-1 pt-0 pb-0"
                :disabled="disabled"
                :counter="nicknameCounter"
                :error-messages="nicknameErrors"
                @input="$v.nickname.$touch()"
                @blur="$v.nickname.$touch()"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <p class="body-1 pt-2">
                <v-icon left>mdi-gender-male-female</v-icon>{{ $t('user.account.gender') }}
              </p>
            </v-col>
            <v-col cols="6">
              <v-select
                v-model="gender"
                class="body-1 pt-0 pb-0"
                :items="genderItems"
                :disabled="disabled"
                :error-messages="genderErrors"
                @input="$v.gender.$touch()"
                @blur="$v.gender.$touch()"
              ></v-select>
            </v-col>
            <v-col cols="6">
              <p class="body-1 pt-2">
                <v-icon left>mdi-domain</v-icon>{{ $t('user.account.campus') }}
              </p>
            </v-col>
            <v-col cols="6">
              <v-select
                v-model="campus"
                class="body-1 pt-0 pb-0"
                :items="campusItems"
                :disabled="disabled"
                :error-messages="campusErrors"
                @input="$v.campus.$touch()"
                @blur="$v.campus.$touch()"
              ></v-select>
            </v-col>
            <v-col
              cols="6"
              v-if="role === $GLOBAL.role.user"
            >
              <p class="body-1 pt-2">
                <v-icon left>mdi-map-marker-outline</v-icon>{{ $t('user.account.location') }}
              </p>
            </v-col>
            <v-col
              cols="6"
              v-if="role === $GLOBAL.role.user"
            >
              <v-text-field
                v-model="dormitory"
                class="body-1 pt-0 pb-0"
                :disabled="disabled"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <p class="body-1 pt-2">
                <v-icon left>mdi-cellphone</v-icon>{{ $t('user.account.telephone') }}
              </p>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="telephone"
                class="body-1 pt-0 pb-0"
                :disabled="disabled"
                :counter="telephoneCounter"
                :error-messages="telephoneErrors"
                @input="$v.telephone.$touch()"
                @blur="$v.telephone.$touch()"
              ></v-text-field>
            </v-col>
            <v-col
              cols="6"
              v-if="role === $GLOBAL.role.solver"
            >
              <p class="body-1 pt-2">
                <v-icon left>mdi-badge-account-horizontal-outline</v-icon>{{ $t('user.account.intro') }}
              </p>
            </v-col>
            <v-col
              cols="6"
              v-if="role === $GLOBAL.role.solver"
            >
              <v-textarea
                v-model="intro"
                class="body-1 pt-0 pb-0"
                :disabled="disabled"
                auto-grow
                rows="1"
                :counter="introCounter"
                :error-messages="introErrors"
                @input="$v.intro.$touch()"
                @blur="$v.intro.$touch()"
              ></v-textarea>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="auto">
              <v-btn
                :color="modifyBtnColor"
                depressed
                @click="modifyAccountInfo"
                :loading="modifyAccountInfoLoading"
                :disabled="modifyAccountInfoLoading"
                class="mr-2"
              ><v-icon left>mdi-account-edit-outline</v-icon
                >{{ disabled ? $t('user.account.modify'):$t('user.account.saveModify') }}</v-btn
              >
              <v-btn
                depressed
                @click="modifyPassword"
                :disabled="!disabled"
              >
                <v-icon left>mdi-key-outline</v-icon>{{ $t('user.account.modifyPassword') }}
              </v-btn>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="auto">
              <v-btn
                depressed
                @click="toLogoutDialog"
                :disabled="!disabled"
              >{{ $t('user.account.logout') }}</v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-hover>

    <!-- 修改密码 Dialog -->
    <v-dialog
      v-model="modifyPasswordDialog"
      :persistent="presentPassword != ''"
      max-width="600"
    >
      <v-card class="pb-2">
        <v-card-title>
          <span class="headline">{{ $t('user.account.modifyPassword') }}</span>
        </v-card-title>
        <v-form
          ref="passwordForm"
          class="ml-6 mr-6"
        >
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="presentPassword"
                class="body-1 pt-0 pb-0"
                :label="presentPasswordLabel"
                :error-messages="presentPasswordErrors"
                @input="$v.presentPassword.$touch()"
                @blur="$v.presentPassword.$touch()"
                type='password'
                clearable
                counter
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="modifiedPassword"
                class="body-1 pt-0 pb-0"
                :label="modifiedPasswordLabel"
                :error-messages="modifiedPasswordErrors"
                @input="$v.modifiedPassword.$touch()"
                @blur="$v.modifiedPassword.$touch()"
                type='password'
                clearable
                counter
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="reModifiedPassword"
                class="body-1 pt-0 pb-0"
                :label="reModifiedPasswordLabel"
                :error-messages="reModifiedPasswordErrors"
                @input="$v.reModifiedPassword.$touch()"
                @blur="$v.reModifiedPassword.$touch()"
                type='password'
                clearable
                counter
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-spacer />
            <v-col cols="auto" class="pb-4">
              <v-btn
                depressed
                @click="modifyPasswordDialog = false"
                class="mr-2"
              >
                {{ $t('user.account.cancel') }}
              </v-btn>
              <v-btn
                color="primary"
                @click="submitNewPassword"
                :loading="submitNewPasswordLoading"
                :disabled="presentPassword == '' || modifiedPassword == '' ||
                reModifiedPassword == '' || submitNewPasswordLoading"
              >{{ $t('user.account.submit') }}</v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card>
    </v-dialog>

    <!-- 登出 Dialog -->
    <v-dialog
      v-model="logoutDialog"
      max-width="600"
    >
      <v-card class="pb-2">
        <v-card-title>
          {{ $t('user.account.logout') }}
        </v-card-title>
        <v-card-text>
          {{ $t('user.account.logoutText') }}
        </v-card-text>
        <v-card-actions class="mr-4">
          <v-spacer></v-spacer>
          <v-btn
            depressed
            @click="logoutDialog = false"
          >{{ $t('user.account.cancel') }}</v-btn>
          <v-btn
            color="primary"
            @click="logout"
            :loading="logoutLoading"
            :disabled="logoutLoading"
          >{{ $t('user.account.confirm') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, maxLength, minLength, numeric } from 'vuelidate/lib/validators'

export default {
  name: 'Account',
  data: () => ({
    role: null,
    name: '',
    gender: '',
    campus: '',
    telephone: '',
    dormitory: '', // *user
    nickname: '', // *solver
    intro: '', // *solver
    disabled: true, // 设置修改用户资料内容默认不可修改
    modifyPasswordDialog: false, // 设置修改密码 Dialog 默认不可见
    logoutDialog: false, // 设置登出 Dialog 默认不可见
    modifyBtnColor: 'primary',
    genderItems: ['男(Male)', '女(Female)'],
    campusItems: ['清水河校区(Qingshuihe Campus)', '沙河校区(Shahe Campus)'],
    presentPassword: '',
    modifiedPassword: '',
    reModifiedPassword: '',
    modifyAccountInfoLoading: false,
    submitNewPasswordLoading: false,
    logoutLoading: false,
    nameCounter: false,
    nicknameCounter: false,
    telephoneCounter: false,
    introCounter: false
  }),
  mixins: [validationMixin],
  validations: {
    name: {
      maxLength: maxLength(20)
    },
    nickname: {
      maxLength: maxLength(30)
    },
    gender: {
      required
    },
    campus: {
      required
    },
    telephone: {
      numeric,
      maxLength: maxLength(11)
    },
    intro: {
      maxLength: maxLength(50)
    },
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
  created: function () {
    if (this.$DevMode) {
      localStorage.setItem('name', this.$DevData.account.name)
      localStorage.setItem('nickname', this.$DevData.account.nickname)
      localStorage.setItem('gender', this.$DevData.account.gender)
      localStorage.setItem('telephone', this.$DevData.account.telephone)
      localStorage.setItem('campus', this.$DevData.account.campus)
      localStorage.setItem('dormitory', this.$DevData.account.dormitory)
      localStorage.setItem('intro', this.$DevData.account.intro)
    } else {
      this.axios.post('/api/user/queryUserInfo').then((Response) => {
        const resData = Response.data
        localStorage.setItem('name', resData.name)
        localStorage.setItem('nickname', resData.nickname)
        localStorage.setItem('gender', resData.gender)
        localStorage.setItem('telephone', resData.telephone)
        localStorage.setItem('campus', resData.campus)
        localStorage.setItem('dormitory', resData.dormitory)
        localStorage.setItem('intro', resData.intro)
      })
    }
    // 获取用户组
    this.role = this.$store.state.role
    // 设置页面 dom
    this.name = localStorage.getItem('name')
    this.gender = localStorage.getItem('gender')
    this.campus = localStorage.getItem('campus')
    this.telephone = localStorage.getItem('telephone')
    if (this.role === this.$GLOBAL.role.user) {
      this.dormitory = localStorage.getItem('dormitory')
    } else if (this.role === this.$GLOBAL.role.solver) {
      this.nickname = localStorage.getItem('nickname')
      this.intro = localStorage.getItem('intro')
    }
  },
  computed: {
    nameErrors () {
      const errors = []
      if (!this.$v.name.$dirty) return errors
      !this.$v.name.maxLength && errors.push(this.$i18n.t('user.account.nameMaxLengthErr'))
      return errors
    },
    nicknameErrors () {
      const errors = []
      if (!this.$v.nickname.$dirty) return errors
      !this.$v.nickname.maxLength && errors.push(this.$i18n.t('user.account.nicknameMaxLengthErr'))
      return errors
    },
    genderErrors () {
      const errors = []
      if (!this.$v.gender.$dirty) return errors
      !this.$v.gender.required && errors.push(this.$i18n.t('user.account.genderRequiredErr'))
      return errors
    },
    campusErrors () {
      const errors = []
      if (!this.$v.campus.$dirty) return errors
      !this.$v.campus.required && errors.push(this.$i18n.t('user.account.campusRequiredErr'))
      return errors
    },
    telephoneErrors () {
      const errors = []
      if (!this.$v.telephone.$dirty) return errors
      !this.$v.telephone.numeric && errors.push(this.$i18n.t('user.account.telephoneNumericErr'))
      !this.$v.telephone.maxLength && errors.push(this.$i18n.t('user.account.telephoneMaxLengthErr'))
      return errors
    },
    introErrors () {
      const errors = []
      if (!this.$v.intro.$dirty) return errors
      !this.$v.intro.maxLength && errors.push(this.$i18n.t('user.account.introMaxLengthErr'))
      return errors
    },
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
        this.$Bus.$emit('tokenCheck')
        this.modifyBtnColor = 'success' // 设置按钮颜色
        this.$Bus.$emit('setSnackbar', this.$i18n.t('user.account.modifyAccountInfoNote'))
        this.disabled = false
        this.nameCounter = 20
        this.nicknameCounter = 30
        this.telephoneCounter = 11
        this.introCounter = 50
      } else { // 第二次点击，保存修改内容到数据库中
        this.$v.$touch()

        if (this.nameErrors.length === 0 && this.nicknameErrors.length === 0 &&
          this.telephoneErrors.length === 0 && this.introErrors.length === 0 &&
          this.campusErrors.length === 0 && this.genderErrors.length === 0) {
          if (this.$DevMode) {
            this.$Bus.$emit('setSnackbar', this.$i18n.t('user.account.modifyAccountInfoSucceed'))
            this.modifyBtnColor = 'primary'
            this.disabled = true
            this.nameCounter = false
            this.nicknameCounter = false
            this.telephoneCounter = false
            this.introCounter = false
            return
          }

          this.modifyAccountInfoLoading = true

          let modifyResponse = false
          if (this.role === this.$GLOBAL.role.user) { // 对于 user 用户组
            modifyResponse = await this.axios.post('/api/user/modifyAccountInfo', {
              name: this.name,
              gender: this.gender,
              campus: this.campus,
              dormitory: this.dormitory,
              telephone: this.telephone
            })
          } else if (this.role === this.$GLOBAL.role.solver) { // 对于 solver 用户组
            modifyResponse = await this.axios.post('/api/user/modifyAccountInfo', {
              name: this.name,
              nickname: this.nickname,
              gender: this.gender,
              campus: this.campus,
              telephone: this.telephone,
              intro: this.intro
            })
          }
          if (modifyResponse.data === true) {
            localStorage.setItem('name', this.name)
            localStorage.setItem('gender', this.gender)
            localStorage.setItem('campus', this.campus)
            localStorage.setItem('telephone', this.telephone)
            if (this.role === this.$GLOBAL.role.user) {
              localStorage.setItem('dormitory', this.dormitory)
            } else if (this.role === this.$GLOBAL.role.solver) {
              localStorage.setItem('nickname', this.nickname)
              localStorage.setItem('intro', this.intro)
            }
            this.modifyBtnColor = 'primary'
            this.$Bus.$emit('setSnackbar', this.$i18n.t('user.account.modifyAccountInfoSucceed'))
            this.modifyAccountInfoLoading = false
            this.disabled = true
            this.nameCounter = false
            this.nicknameCounter = false
            this.telephoneCounter = false
            this.introCounter = false
          } else { // 修改失败，显示提示信息并刷新页面
            this.$Bus.$emit('setSnackbar', this.$i18n.t('user.account.modifyAccountInfoFailed'))
            location.reload()
          }
        }
      }
    },
    modifyPassword: function () {
      this.$Bus.$emit('tokenCheck')
      this.modifyPasswordDialog = true
    },
    submitNewPassword: async function () {
      this.$v.presentPassword.$touch()
      this.$v.modifiedPassword.$touch()
      this.$v.reModifiedPassword.$touch()
      if (this.presentPasswordErrors.length === 0 && this.modifiedPasswordErrors.length === 0 && this.reModifiedPasswordErrors.length === 0) {
        if (this.modifiedPassword !== this.reModifiedPassword) { // 当两次输入的新密码不一样时
          this.modifiedPassword = ''
          this.reModifiedPassword = ''
          this.$Bus.$emit('setSnackbar', this.$i18n.t('user.account.reModifiedPasswordErr'))
          return
        }

        if (this.modifiedPassword === this.presentPassword) {
          this.modifiedPassword = ''
          this.reModifiedPassword = ''
          this.$Bus.$emit('setSnackbar', this.$i18n.t('user.account.sameModifiedPasswordErr'))
          return
        }

        if (this.$DevMode) {
          this.$Bus.$emit('setSnackbar', this.$i18n.t('user.account.modifyPasswordSucceed'))
          this.$refs.passwordForm.reset()
          this.modifyPasswordDialog = false
          return
        }

        this.submitNewPasswordLoading = true

        this.axios.post('/api/user/modifyPassword', { // 调用修改密码接口
          presentPassword: this.$Utils.generateEncryptedPassword(this.presentPassword),
          modifiedPassword: this.$Utils.generateEncryptedPassword(this.modifiedPassword)
        }).then((Response) => {
          this.submitNewPasswordLoading = false
          if (Response.data === true) {
            this.$Bus.$emit('setSnackbar', this.$i18n.t('user.account.modifyPasswordSucceed'))
            this.$refs.passwordForm.reset() // 重置表单
            this.modifyPasswordDialog = false
          } else if (Response.data === 'present password error') {
            this.$Bus.$emit('setSnackbar', this.$i18n.t('user.account.presentPasswordErr'))
            this.presentPassword = ''
          } else {
            this.$Bus.$emit('setSnackbar', this.$i18n.t('user.account.unknownErr'))
          }
        })
      }
    },
    toLogoutDialog () { // 打开确认 logout 的 dialog
      this.logoutDialog = true
    },
    logout () {
      this.logoutLoading = true
      this.$Bus.$emit('modifyLoginStatus', 'logout')
    }
  }
}
</script>
