<template>
  <v-dialog v-model="dialog" max-width="600" :persistent="exportRecordsLoading">
    <v-card>
      <v-card-title>
        {{ $t('order.exportDialog.title') }}
      </v-card-title>
      <v-stepper v-model="stepper" vertical>
        <v-stepper-step :complete="stepper > 1" step="1" editable>
          {{ $t('order.exportDialog.pickDate') }} / {{ datePicker }}
        </v-stepper-step>
        <v-stepper-content step="1">
          <v-date-picker
            v-model="datePicker"
            type="month"
            no-title
            color="primary"
            min="2020-08"
            :max="new Date().toISOString().substr(0, 7)"
          >
          </v-date-picker>
          <v-card-actions>
            <v-btn color="primary" @click="stepper = 2">
              {{ $t('order.exportDialog.continue') }}
            </v-btn>
            <v-btn text @click="dialog = false">
              {{ $t('order.exportDialog.cancel') }}
            </v-btn>
          </v-card-actions>
        </v-stepper-content>

        <v-stepper-step :complete="stepper > 2" step="2" editable>
          {{ $t('order.exportDialog.additionalSettings') }} / {{ format }}
          <small v-show="format == 'csv'" class="mt-1">{{
            $t('order.exportDialog.formatToCsvNotes')
          }}</small>
        </v-stepper-step>
        <v-stepper-content step="2">
          <div class="ml-3">{{ $t('order.exportDialog.formatTitle') }}</div>
          <v-radio-group v-model="format" row class="ml-3">
            <v-radio label="xlsx" value="xlsx"></v-radio>
            <v-radio label="csv" value="csv"></v-radio>
          </v-radio-group>
          <!-- 同时发送到邮箱
          <div class="ml-3">{{ $t('order.exportDialog.emailTitle') }}</div>
          <v-text-field
            v-model="email"
            prepend-icon="mdi-email"
            class="ml-3 mr-12"
            :label="emailLabel"
            clearable
            :error-messages="emailErrors"
          />
          -->
          <v-card-actions>
            <v-btn color="primary" @click="continueToStepThree">
              {{ $t('order.exportDialog.continue') }}
            </v-btn>
            <v-btn text @click="stepper = 1">
              {{ $t('order.exportDialog.back') }}
            </v-btn>
          </v-card-actions>
        </v-stepper-content>

        <v-stepper-step :complete="exportRecordsLoading" step="3">
          {{ $t('order.exportDialog.exportRecords') }}
        </v-stepper-step>
        <v-stepper-content step="3">
          <div class="ml-3 mr-12">
            <span v-if="!exportRecordsLoading">{{
              $t('order.exportDialog.confirmText')
            }}</span>
            <span v-if="exportRecordsLoading">{{
              $t('order.exportDialog.onExportingRecords')
            }}</span>
          </div>
          <v-card-actions class="mt-4">
            <v-btn
              color="success"
              @click="exportRecords"
              :disabled="exportRecordsLoading"
              :loading="exportRecordsLoading"
            >
              {{ $t('order.exportDialog.confirm') }}
            </v-btn>
            <v-btn text @click="stepper = 2" :disabled="exportRecordsLoading">
              {{ $t('order.exportDialog.back') }}
            </v-btn>
          </v-card-actions>
        </v-stepper-content>
      </v-stepper>
    </v-card>
  </v-dialog>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { email } from 'vuelidate/lib/validators'

export default {
  name: 'ExportRecordsDialog',
  data: () => ({
    dialog: false,
    stepper: 1,
    exportRecordsLoading: false,
    datePicker: new Date().toISOString().substr(0, 7),
    format: 'xlsx',
    email: ''
  }),
  mixins: [validationMixin],
  validations: {
    email: {
      email
    }
  },
  methods: {
    continueToStepThree () {
      if (this.email !== '') {
        this.$v.email.$touch()
        if (this.emailErrors.length == 0) {
          this.stepper = 3
        }
      } else {
        this.stepper = 3
      }
    },
    exportRecords () {
      if (this.$DevMode) {
        this.$Bus.$emit(
          'setSnackbar',
          this.$i18n.t('order.exportDialog.exportSuccessfully')
        )
        this.dialog = false
        this.stepper = 1
        return
      }

      this.exportRecordsLoading = true

      this.axios
        .post('/api/export/exportToExcel', {
          month: this.datePicker,
          format: this.format,
          email: this.email
        })
        .then(Response => {
          if (Response.data) {
            this.$Bus.$emit(
              'setSnackbar',
              this.$i18n.t('order.exportDialog.exportSuccessfully')
            )
            this.stepper = 1

            const filename = Response.data.filename
            const filebuffer = Response.data.filebuffer

            for (let i = 0; i < filebuffer.length; i++) {
              let fb = Buffer.from(filebuffer[i].data, 'binary')
              if (this.format == 'csv') fb = '\uFEFF' + fb // 设置为 UTF-8 编码
              const blob = new Blob([fb], {
                type: filebuffer[i].type
              })
              if (window.navigator.msSaveOrOpenBlob) {
                navigator.msSaveBlob(blob, filename[i])
              } else {
                const link = document.createElement('a')
                const body = document.querySelector('body')

                link.href = window.URL.createObjectURL(blob) // 创建对象url
                link.download = filename[i]

                // fix Firefox
                link.style.display = 'none'
                body.appendChild(link)

                link.click()
                body.removeChild(link)

                window.URL.revokeObjectURL(link.href) // 通过调用 URL.createObjectURL() 创建的 URL 对象
              }
            }
          } else {
            this.$Bus.$emit(
              'setSnackbar',
              this.$i18n.t('order.exportDialog.exportFailed')
            )
          }
          this.dialog = false
          this.exportRecordsLoading = false
        })
    }
  },
  computed: {
    emailLabel () {
      return this.$i18n.t('order.exportDialog.emailLabel')
    },
    emailErrors () {
      const errors = []
      if (!this.$v.email.$dirty) return errors
      !this.$v.email.email &&
        errors.push(this.$i18n.t('order.exportDialog.emailErrors'))
      return errors
    }
  },
  mounted () {
    this.$Bus.$on('openExportRecordsDialog', msg => {
      this.dialog = true
    })
  }
}
</script>
