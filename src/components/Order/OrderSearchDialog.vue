<template>
  <v-dialog v-model="dialog" max-width="600">
    <v-card>
      <v-card-title>
        {{ $t('order.orderSearchDialog.title') }}
      </v-card-title>
      <v-card-subtitle class="pt-1">
        {{ $t('order.orderSearchDialog.subtitle') }}
      </v-card-subtitle>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'OrderSearchDialog',
  data: () => ({
    dialog: false
  }),
  methods: {

  },
  mounted () {
    this.$Bus.$on('openOrderSearchDialog', msg => {
      console.log(msg)
      this.dialog = true
    })
  }
}
</script>

<style>

</style>
