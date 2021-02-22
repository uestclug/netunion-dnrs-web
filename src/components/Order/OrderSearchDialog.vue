<template>
  <v-dialog v-model="dialog" max-width="600">
    <v-card>
      <v-card-title>
        {{ $t('order.orderSearchDialog.title') }}
      </v-card-title>
      <v-card-subtitle class="pt-1">
        {{ $t('order.orderSearchDialog.subtitle') }}
      </v-card-subtitle>
      <v-card-text>
        <div>
          <v-text-field
            v-model="searchTextField"
            :label="$t('order.orderSearchDialog.inputLabel')"
            :hint="$t('order.orderSearchDialog.inputHint')"
            persistent-hint
            single-line
            outlined
            dense
            hide-details="auto"
            autofocus
            @keyup.enter.native="searchOrder"
          ></v-text-field>
        </div>
      </v-card-text>
      <v-card-actions class="mr-2 pb-4">
        <v-spacer />
        <v-btn depressed @click="dialog = false">{{
          $t('order.orderSearchDialog.close')
        }}</v-btn>
        <v-btn color="success" @click="searchOrder">{{
          $t('order.orderSearchDialog.confirm')
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'OrderSearchDialog',
  data: () => ({
    dialog: false,
    searchTextField: ''
  }),
  methods: {
    searchOrder () {
      this.dialog = false
      if (this.searchTextField !== '') {
        this.$Bus.$emit('setOrderListFilter', this.searchTextField)
      }
    }
  },
  mounted () {
    this.$Bus.$on('openOrderSearchDialog', msg => {
      this.dialog = true
    })
  }
}
</script>

<style></style>
