<template>
  <div class="text-center">
    <v-bottom-sheet
      v-model="sheet"
      persistent
      inset
    >
      <template v-slot:activator="{ on }">
        <v-btn
          color="success"
          outlined
          style="margin: 0px 0px 10px 10px"
          v-on="on"
        >
          <v-icon left>mdi-pencil</v-icon> {{ $t('order.create') }}
        </v-btn>
      </template>

      <v-sheet height="1200px">
        <v-form ref="bottomForm">
          <v-container>
            <div class="text-right">
              <v-tooltip left>
                <template v-slot:activator="{ on }">
                  <v-btn
                    v-on="on"
                    color="error"
                    class="mr-3"
                    @click="sheet = !sheet"
                  >{{ $t('order.cancel') }}</v-btn>
                </template>
                <span>{{ $t('order.cancelTip') }}</span>
              </v-tooltip>

              <v-btn
                color="success"
                @click="submit"
              >{{ $t('order.submit') }}<v-icon right>mdi-check</v-icon></v-btn>
            </div>

            <v-row
              class="mt-6"
              justify="center"
            >
              <v-col
                lg="6"
              >
                <v-alert
                  border="left"
                  colored-border
                  type="info"
                >
                  {{ $t('order.note') }}
                </v-alert>
              </v-col>
            </v-row>

            <v-row
              class="mt-0"
              justify="center"
            >
              <v-col
                lg="2"
              >
                <v-text-field
                  v-model="name"
                  :error-messages="nameErrors"
                  label="Name"
                  required
                  @input="$v.name.$touch()"
                  @blur="$v.name.$touch()"
                ></v-text-field>
              </v-col>

              <v-col
                lg="4"
              >
                <v-text-field
                  v-model="telephone"
                  :error-messages="telephoneErrors"
                  :counter="11"
                  label="Telephone"
                  required
                  @input="$v.telephone.$touch()"
                  @blur="$v.telephone.$touch()"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row
              justify="center"
            >
              <v-col
                lg="6"
              >
                <v-text-field
                  v-model="dormitory"
                  :error-messages="dormitoryErrors"
                  label="Dormitory"
                  required
                  @input="$v.dormitory.$touch()"
                  @blur="$v.dormitory.$touch()"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-sheet>
    </v-bottom-sheet>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, maxLength } from 'vuelidate/lib/validators'

export default {
  name: 'createOrder',
  data: () => ({
    sheet: false,
    name: '',
    dormitory: '',
    telephone: ''
  }),
  mixins: [validationMixin],
  validations: {
    name: {
      required,
      maxLength: maxLength(20)
    },
    dormitory: {
      required
    },
    telephone: {
      required,
      maxLength: maxLength(11)
    }
  },
  computed: {
    nameErrors () {
      const errors = []
      if (!this.$v.name.$dirty) return errors
      !this.$v.name.maxLength && errors.push(this.$i18n.t('order.nameMaxLengthErr'))
      !this.$v.name.required && errors.push(this.$i18n.t('order.nameRequiredErr'))
      return errors
    },
    dormitoryErrors () {
      const errors = []
      if (!this.$v.dormitory.$dirty) return errors
      !this.$v.dormitory.required && errors.push(this.$i18n.t('order.locationRequiredErr'))
      return errors
    },
    telephoneErrors () {
      const errors = []
      if (!this.$v.telephone.$dirty) return errors
      !this.$v.telephone.maxLength && errors.push(this.$i18n.t('order.telephoneMaxLengthErr'))
      !this.$v.telephone.required && errors.push(this.$i18n.t('order.telephoneRequiredErr'))
      return errors
    }
  },
  methods: {
    submit () {
      this.$v.$touch()
    }
  }
}
</script>
