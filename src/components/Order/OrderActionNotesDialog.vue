<template>
  <v-dialog v-model="dialog" max-width="600">
    <v-card>
      <v-card-title>
        {{ $t('order.actionNotesDialog.title') }}
      </v-card-title>
      <v-card-subtitle class="pt-1">
        {{ $t('order.actionNotesDialog.subtitle') }}
      </v-card-subtitle>
      <v-card-text>
        <div v-if="actionNotesLoading" class="text--primary">
          {{ $t('order.actionNotesDialog.actionNotesLoading') }}
        </div>
        <div v-else-if="actionNotes.length == 0" class="body-1 text--primary">
          {{ $t('order.actionNotesDialog.actionNotesNotFound') }}
        </div>
        <div v-else>
          <template v-for="notes in actionNotes">
            <div v-bind:key="notes.action_date" class="mt-1">
              <v-tooltip left>
                <template v-slot:activator="{ on, attrs }">
                  <v-chip
                    label
                    class="mr-2"
                    v-bind="attrs"
                    v-on="on"
                    :color="notes.user_id == userId ? 'primary' : ''"
                    >{{ notes.action_date }}</v-chip
                  >
                  <span class="text--primary">{{ notes.notes_text }}</span>
                </template>
                <span>{{ notes.user_name }}</span>
              </v-tooltip>
            </div>
          </template>
        </div>
      </v-card-text>
      <v-card-actions class="mr-2 pb-4">
        <v-spacer />
        <v-btn depressed @click="dialog = false">{{
          $t('order.actionNotesDialog.close')
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'OrderActionNotesDialog',
  data: () => ({
    dialog: false,
    userId: null,
    order: null,
    actionNotes: [],
    actionNotesLoading: true
  }),
  methods: {
    queryOrderActionNotes () {
      this.actionNotesLoading = true

      if (this.$DevMode) {
        this.actionNotes = this.$DevData.order.OrderActionNotes
        this.actionNotesLoading = false
        return
      }

      this.axios
        .post('api/order/queryOrderActionNotes', {
          order_id: this.order.order_id
        })
        .then(Response => {
          if (Response.data) {
            this.actionNotes = Response.data
          }
          this.actionNotesLoading = false
        })
    }
  },
  mounted () {
    this.$Bus.$on('openOrderActionNotesDialog', msg => {
      this.userId = localStorage.user_id
      if (this.order == null || this.order != msg) this.order = msg
      this.queryOrderActionNotes()
      this.dialog = true
    })
  }
}
</script>
