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
import Bus from '@/Bus'
import md5 from 'js-md5'
const Base64 = require('js-base64').Base64

export default {
  name: 'Login',
  data: () => ({
    username: '',
    pwd: ''
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
    generateToken: function () { // 生成随机的 token 令牌
      const unscrambleToken = new Date().getTime().toString() + Math.floor(Math.random() * 10000 + 1).toString()
      const token = md5(Base64.encode(unscrambleToken))
      return token
    },
    submit () { // 登录验证
      this.$v.$touch()
      if (this.usernameErrors.length === 0 && this.pwdErrors.length === 0) { // 无报错内容时
        const password = md5(Base64.encode(this.pwd))
        const token = this.generateToken()
        this.axios.post('/api/user/login', {
          std_id: this.username,
          password: password,
          token: token
        }).then((Response) => {
          if (Response.data !== false) { // 登录成功
            // 设置 token 和 id
            localStorage.setItem('token', token)
            localStorage.setItem('id', Response.data.id)
            // 显示提示登录成功的信息条
            Bus.$emit('setSnackbar', this.$i18n.t('login.loginSucceed'))
            // 回到主页
            this.$router.push({
              name: 'home'
            })
          } else { // 登录失败
            this.pwd = ''
            // 显示提示登录失败的消息条
            Bus.$emit('setSnackbar', this.$i18n.t('login.loginFailed'))
          }
        })
      }
    }
  }
}
</script>
