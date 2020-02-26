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

export default {
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
  created: function () {
    this.usernameLabel = this.$i18n.t('login.usernameLabel')
    this.pwdLabel = this.$i18n.t('login.pwdLabel')
  },
  computed: {
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
    submit () {
      this.$v.$touch()
      if (this.usernameErrors.length === 0 && this.pwdErrors.length === 0) { // 无报错内容时
        // 设置 token
        localStorage.setItem('token', this.username)
        // 回到主页
        this.$router.push({
          name: 'home'
        })
      } else {
        alert('have errors')
      }
    }
  }
}
</script>
