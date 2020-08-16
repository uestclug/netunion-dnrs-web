<template>
  <div class="login">
    <v-container>
      <v-card
        class="mx-auto"
        max-width="800"
      >
        <v-card-text>
          <v-row
            justify="center"
            no-gutters
            class="mt-3"
          >
            <v-col
              lg="6"
            >
              <v-text-field
                v-model="username"
                :error-messages="usernameErrors"
                :label="usernameLabel"
                required
                @input="$v.username.$touch()"
                @blur="$v.username.$touch()"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row
            justify="center"
            no-gutters
            class="mt-3"
          >
            <v-col
              lg="6"
            >
              <v-text-field
                v-model="pwd"
                :error-messages="pwdErrors"
                :label="pwdLabel"
                required
                @input="$v.pwd.$touch()"
                @blur="$v.pwd.$touch()"
                :type="showPassword ? 'text' : 'password'"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword = !showPassword"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-row
            justify="center"
            no-gutters
            class="mb-3"
          >
            <v-btn
              color="success"
              @click="submit"
            >{{ $t('login.submit') }}<v-icon right>mdi-arrow-right</v-icon></v-btn>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'

export default {
  name: 'Login',
  data: () => ({
    username: '',
    pwd: '',
    showPassword: false
  }),
  mixins: [validationMixin],
  validations: {
    username: {
      required
    },
    pwd: {
      required
    }
  },
  computed: {
    usernameLabel () {
      return this.$i18n.t('login.usernameLabel')
    },
    pwdLabel () {
      return this.$i18n.t('login.pwdLabel')
    },
    usernameErrors () {
      const errors = []
      if (!this.$v.username.$dirty) return errors
      !this.$v.username.required && errors.push(this.$i18n.t('login.usernameRequiredErr'))
      return errors
    },
    pwdErrors () {
      const errors = []
      if (!this.$v.pwd.$dirty) return errors
      !this.$v.pwd.required && errors.push(this.$i18n.t('login.pwdRequiredErr'))
      return errors
    }
  },
  methods: {
    submit () { // 登录验证
      this.$v.$touch()
      if (this.usernameErrors.length === 0 && this.pwdErrors.length === 0) { // 无报错内容时
        const password = this.pwd // 加密密码
        const stdId = this.username
        localStorage.setItem('std_id', stdId)
        this.axios.post('/api/user/login', {
          std_id: stdId,
          password: password
        }).then((Response) => {
          // console.log(Response.data)
          if (Response.data) { // 登录成功
            const resData = Response.data
            const userId = resData.user_id
            const role = resData.role
            const token = resData.token
            // 存储用户信息至 vuex 和 localStorage
            this.$store.commit('setUserId', userId)
            this.$store.commit('setRole', role)
            this.$store.commit('setToken', token)
            // 获取用户资料
            this.axios.post('/api/user/queryUserInfo').then((Response) => {
              // console.log(Response.data)
              const resData = Response.data
              // 将得到的用户资料保存到 localStorage 中
              localStorage.setItem('name', resData.name)
              localStorage.setItem('nickname', resData.nickname)
              localStorage.setItem('gender', resData.gender)
              localStorage.setItem('telephone', resData.telephone)
              localStorage.setItem('campus', resData.campus)
              localStorage.setItem('dormitory', resData.dormitory)
              localStorage.setItem('intro', resData.intro)
              // 显示提示登录成功的信息条
              this.Bus.$emit('setSnackbar', this.$i18n.t('login.loginSucceed') + Response.data.name)
              // 回到主页
              this.$router.push({
                name: 'home'
              })
            })
          } else { // 登录失败
            this.pwd = ''
            // 显示提示登录失败的消息条
            this.Bus.$emit('setSnackbar', this.$i18n.t('login.loginFailed'))
          }
        })
      }
    }
  }
}
</script>
